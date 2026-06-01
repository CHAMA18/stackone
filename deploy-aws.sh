#!/bin/bash
set -e

# ============================================================
# StackOne Mailflow - AWS Deployment Script
# ============================================================
# This script deploys the Next.js SSR application to AWS
# using ECS Fargate with Application Load Balancer
# ============================================================

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="103658463143"
DOMAIN="thestackone.com"
ECR_REPO="mailflow-app"
CLUSTER_NAME="mailflow-cluster"
SERVICE_NAME="mailflow-service"
TASK_FAMILY="mailflow-task"
CONTAINER_NAME="mailflow-container"
IMAGE_TAG="latest"
ALB_NAME="mailflow-alb"
TG_NAME="mailflow-target-group"
CERT_ARN=""  # Will be set to the existing certificate
HOSTED_ZONE_ID="Z03773932LRTBXZF0M28O"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[DEPLOY]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check AWS credentials
check_credentials() {
    log "Checking AWS credentials..."
    if ! aws sts get-caller-identity &>/dev/null; then
        error "AWS credentials not configured. Run 'aws configure' first."
    fi
    IDENTITY=$(aws sts get-caller-identity --output json)
    ACCOUNT=$(echo "$IDENTITY" | jq -r '.Account')
    log "Using AWS Account: $ACCOUNT"
}

# Get the SSL certificate ARN
get_certificate() {
    log "Looking for SSL certificate for $DOMAIN..."
    CERT_ARN=$(aws acm list-certificates --region $AWS_REGION \
        --query "CertificateSummaryList[?DomainName=='${DOMAIN}'].CertificateArn" \
        --output text | head -1)
    
    if [ -z "$CERT_ARN" ]; then
        CERT_ARN=$(aws acm list-certificates --region $AWS_REGION \
            --query "CertificateSummaryList[?contains(DomainName,'${DOMAIN}')].CertificateArn" \
            --output text | head -1)
    fi
    
    if [ -n "$CERT_ARN" ]; then
        success "Found SSL certificate: $CERT_ARN"
    else
        warn "No SSL certificate found. Creating one..."
        CERT_ARN=$(aws acm request-certificate \
            --domain-name "$DOMAIN" \
            --subject-alternative-names "*.$DOMAIN" \
            --validation-method DNS \
            --region $AWS_REGION \
            --query 'CertificateArn' \
            --output text)
        warn "Certificate created: $CERT_ARN"
        warn "You need to validate the certificate via DNS before proceeding."
        warn "Run this script again after validation."
        exit 0
    fi
}

# Create ECR repository
create_ecr_repo() {
    log "Creating ECR repository..."
    if ! aws ecr describe-repositories --repository-names "$ECR_REPO" --region $AWS_REGION &>/dev/null; then
        aws ecr create-repository --repository-name "$ECR_REPO" --region $AWS_REGION
        success "Created ECR repository: $ECR_REPO"
    else
        success "ECR repository already exists: $ECR_REPO"
    fi
}

# Build and push Docker image
build_and_push() {
    log "Building Docker image..."
    ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
    
    # Login to ECR
    aws ecr get-login-password --region $AWS_REGION | \
        docker login --username AWS --password-stdin "$ECR_URI"
    
    # Build image
    docker build -t "${ECR_REPO}:${IMAGE_TAG}" .
    docker tag "${ECR_REPO}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
    
    # Push image
    log "Pushing image to ECR..."
    docker push "${ECR_URI}:${IMAGE_TAG}"
    success "Pushed image: ${ECR_URI}:${IMAGE_TAG}"
}

# Create ECS cluster
create_cluster() {
    log "Creating ECS cluster..."
    if ! aws ecs describe-clusters --clusters "$CLUSTER_NAME" --region $AWS_REGION 2>/dev/null | jq -r '.clusters[0].status' | grep -q "ACTIVE"; then
        aws ecs create-cluster --cluster-name "$CLUSTER_NAME" --region $AWS_REGION
        success "Created ECS cluster: $CLUSTER_NAME"
    else
        success "ECS cluster already exists: $CLUSTER_NAME"
    fi
}

# Create CloudWatch log group
create_log_group() {
    log "Creating CloudWatch log group..."
    aws logs create-log-group --log-group-name "/ecs/mailflow" --region $AWS_REGION 2>/dev/null || true
    success "Log group ready"
}

# Create task definition
create_task_definition() {
    log "Creating ECS task definition..."
    ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
    
    cat > /tmp/task-definition.json << EOF
{
    "family": "${TASK_FAMILY}",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "512",
    "memory": "1024",
    "containerDefinitions": [
        {
            "name": "${CONTAINER_NAME}",
            "image": "${ECR_URI}:${IMAGE_TAG}",
            "essential": true,
            "portMappings": [
                {
                    "containerPort": 3000,
                    "protocol": "tcp"
                }
            ],
            "environment": [
                {"name": "NODE_ENV", "value": "production"},
                {"name": "NEXTAUTH_URL", "value": "https://${DOMAIN}"},
                {"name": "NEXTAUTH_SECRET", "value": "stackone-prod-secret-$(openssl rand -hex 16)"},
                {"name": "DATABASE_URL", "value": "file:/app/db/production.db"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/mailflow",
                    "awslogs-region": "${AWS_REGION}",
                    "awslogs-stream-prefix": "mailflow"
                }
            },
            "healthCheck": {
                "command": ["CMD-SHELL", "curl -f http://localhost:3000/ || exit 1"],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 60
            }
        }
    ]
}
EOF
    
    aws ecs register-task-definition \
        --cli-input-json file:///tmp/task-definition.json \
        --region $AWS_REGION
    
    success "Task definition registered"
}

# Create networking resources
create_networking() {
    log "Setting up networking..."
    
    # Check if VPC exists
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" \
        --query 'Vpcs[0].VpcId' --output text --region $AWS_REGION)
    
    if [ -z "$VPC_ID" ] || [ "$VPC_ID" = "None" ]; then
        error "No default VPC found. Please create a VPC first."
    fi
    
    success "Using VPC: $VPC_ID"
    
    # Get subnet IDs
    SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" \
        --query 'Subnets[*].SubnetId' --output text --region $AWS_REGION)
    
    SUBNET_ARRAY=($SUBNET_IDS)
    SUBNET_1=${SUBNET_ARRAY[0]}
    SUBNET_2=${SUBNET_ARRAY[1]:-${SUBNET_ARRAY[0]}}
    
    success "Using subnets: $SUBNET_1, $SUBNET_2"
    
    # Create security group for ALB
    ALB_SG_ID=$(aws ec2 describe-security-groups --filters \
        "Name=group-name,Values=mailflow-alb-sg" \
        --query 'SecurityGroups[0].GroupId' --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$ALB_SG_ID" ] || [ "$ALB_SG_ID" = "None" ]; then
        ALB_SG_ID=$(aws ec2 create-security-group \
            --group-name mailflow-alb-sg \
            --description "Security group for Mailflow ALB" \
            --vpc-id "$VPC_ID" \
            --query 'GroupId' --output text --region $AWS_REGION)
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$ALB_SG_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0 \
            --region $AWS_REGION 2>/dev/null || true
        aws ec2 authorize-security-group-ingress \
            --group-id "$ALB_SG_ID" --protocol tcp --port 443 --cidr 0.0.0.0/0 \
            --region $AWS_REGION 2>/dev/null || true
        
        success "Created ALB security group: $ALB_SG_ID"
    else
        success "ALB security group already exists: $ALB_SG_ID"
    fi
    
    # Create security group for ECS tasks
    ECS_SG_ID=$(aws ec2 describe-security-groups --filters \
        "Name=group-name,Values=mailflow-ecs-sg" \
        --query 'SecurityGroups[0].GroupId' --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$ECS_SG_ID" ] || [ "$ECS_SG_ID" = "None" ]; then
        ECS_SG_ID=$(aws ec2 create-security-group \
            --group-name mailflow-ecs-sg \
            --description "Security group for Mailflow ECS tasks" \
            --vpc-id "$VPC_ID" \
            --query 'GroupId' --output text --region $AWS_REGION)
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$ECS_SG_ID" --protocol tcp --port 3000 \
            --source-group "$ALB_SG_ID" \
            --region $AWS_REGION 2>/dev/null || true
        
        success "Created ECS security group: $ECS_SG_ID"
    else
        success "ECS security group already exists: $ECS_SG_ID"
    fi
    
    echo "VPC_ID=$VPC_ID" > /tmp/mailflow-deploy.env
    echo "SUBNET_1=$SUBNET_1" >> /tmp/mailflow-deploy.env
    echo "SUBNET_2=$SUBNET_2" >> /tmp/mailflow-deploy.env
    echo "ALB_SG_ID=$ALB_SG_ID" >> /tmp/mailflow-deploy.env
    echo "ECS_SG_ID=$ECS_SG_ID" >> /tmp/mailflow-deploy.env
}

# Create ALB and target group
create_alb() {
    log "Creating Application Load Balancer..."
    source /tmp/mailflow-deploy.env
    
    # Create target group
    TG_ARN=$(aws elbv2 describe-target-groups --names "$TG_NAME" \
        --query 'TargetGroups[0].TargetGroupArn' --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$TG_ARN" ] || [ "$TG_ARN" = "None" ]; then
        TG_ARN=$(aws elbv2 create-target-group \
            --name "$TG_NAME" \
            --protocol HTTP \
            --port 3000 \
            --target-type ip \
            --vpc-id "$VPC_ID" \
            --health-check-path / \
            --health-check-interval-seconds 30 \
            --query 'TargetGroups[0].TargetGroupArn' --output text --region $AWS_REGION)
        success "Created target group: $TG_ARN"
    else
        success "Target group already exists: $TG_ARN"
    fi
    
    echo "TG_ARN=$TG_ARN" >> /tmp/mailflow-deploy.env
    
    # Create ALB
    ALB_ARN=$(aws elbv2 describe-load-balancers --names "$ALB_NAME" \
        --query 'LoadBalancers[0].LoadBalancerArn' --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$ALB_ARN" ] || [ "$ALB_ARN" = "None" ]; then
        ALB_ARN=$(aws elbv2 create-load-balancer \
            --name "$ALB_NAME" \
            --subnets "$SUBNET_1" "$SUBNET_2" \
            --security-groups "$ALB_SG_ID" \
            --query 'LoadBalancers[0].LoadBalancerArn' --output text --region $AWS_REGION)
        success "Created ALB: $ALB_ARN"
    else
        success "ALB already exists: $ALB_ARN"
    fi
    
    # Get ALB DNS
    ALB_DNS=$(aws elbv2 describe-load-balancers --names "$ALB_NAME" \
        --query 'LoadBalancers[0].DNSName' --output text --region $AWS_REGION)
    success "ALB DNS: $ALB_DNS"
    
    # Create HTTPS listener
    HTTPS_LISTENER=$(aws elbv2 describe-listeners --load-balancer-arn "$ALB_ARN" \
        --query 'Listeners[?Protocol==`HTTPS`].ListenerArn' --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$HTTPS_LISTENER" ] || [ "$HTTPS_LISTENER" = "None" ]; then
        aws elbv2 create-listener \
            --load-balancer-arn "$ALB_ARN" \
            --protocol HTTPS \
            --port 443 \
            --certificates CertificateArn="$CERT_ARN" \
            --default-actions Type=forward,TargetGroupArn="$TG_ARN" \
            --region $AWS_REGION
        success "Created HTTPS listener"
    else
        success "HTTPS listener already exists"
    fi
    
    # Create HTTP to HTTPS redirect
    HTTP_LISTENER=$(aws elbv2 describe-listeners --load-balancer-arn "$ALB_ARN" \
        --query 'Listeners[?Protocol==`HTTP`].ListenerArn' --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$HTTP_LISTENER" ] || [ "$HTTP_LISTENER" = "None" ]; then
        aws elbv2 create-listener \
            --load-balancer-arn "$ALB_ARN" \
            --protocol HTTP \
            --port 80 \
            --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}" \
            --region $AWS_REGION
        success "Created HTTP redirect listener"
    fi
    
    echo "ALB_ARN=$ALB_ARN" >> /tmp/mailflow-deploy.env
    echo "ALB_DNS=$ALB_DNS" >> /tmp/mailflow-deploy.env
}

# Create ECS service
create_service() {
    log "Creating ECS service..."
    source /tmp/mailflow-deploy.env
    
    # Get latest task definition ARN
    TASK_ARN=$(aws ecs describe-task-definition --task-definition "$TASK_FAMILY" \
        --query 'taskDefinition.taskDefinitionArn' --output text --region $AWS_REGION)
    
    SERVICE_ARN=$(aws ecs describe-services --cluster "$CLUSTER_NAME" \
        --services "$SERVICE_NAME" --region $AWS_REGION \
        --query 'services[0].serviceArn' --output text 2>/dev/null || echo "")
    
    if [ -z "$SERVICE_ARN" ] || [ "$SERVICE_ARN" = "None" ]; then
        aws ecs create-service \
            --cluster "$CLUSTER_NAME" \
            --service-name "$SERVICE_NAME" \
            --task-definition "$TASK_ARN" \
            --desired-count 1 \
            --launch-type FARGATE \
            --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$ECS_SG_ID],assignPublicIp=ENABLED}" \
            --load-balancers "targetGroupArn=$TG_ARN,containerName=$CONTAINER_NAME,containerPort=3000" \
            --region $AWS_REGION
        success "Created ECS service: $SERVICE_NAME"
    else
        # Update service with new task definition
        aws ecs update-service \
            --cluster "$CLUSTER_NAME" \
            --service "$SERVICE_NAME" \
            --task-definition "$TASK_ARN" \
            --force-new-deployment \
            --region $AWS_REGION
        success "Updated ECS service with new deployment"
    fi
}

# Update Route53 DNS
update_dns() {
    log "Updating Route53 DNS..."
    source /tmp/mailflow-deploy.env
    
    ALB_HOSTED_ZONE=$(aws elbv2 describe-load-balancers --names "$ALB_NAME" \
        --query 'LoadBalancers[0].CanonicalHostedZoneId' --output text --region $AWS_REGION)
    
    cat > /tmp/dns-change.json << EOF
{
    "Comment": "Update mailflow alias record",
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "${DOMAIN}.",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "${ALB_HOSTED_ZONE}",
                    "DNSName": "dualstack.${ALB_DNS}",
                    "EvaluateTargetHealth": true
                }
            }
        },
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.${DOMAIN}.",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "${ALB_HOSTED_ZONE}",
                    "DNSName": "dualstack.${ALB_DNS}",
                    "EvaluateTargetHealth": true
                }
            }
        }
    ]
}
EOF
    
    aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch file:///tmp/dns-change.json \
        --region $AWS_REGION
    
    success "DNS records updated for $DOMAIN"
}

# Main deployment flow
main() {
    echo ""
    echo "============================================"
    echo "  StackOne Mailflow - AWS Deployment"
    echo "============================================"
    echo ""
    
    check_credentials
    get_certificate
    create_ecr_repo
    build_and_push
    create_cluster
    create_log_group
    create_task_definition
    create_networking
    create_alb
    create_service
    update_dns
    
    echo ""
    echo "============================================"
    echo "  Deployment Complete!"
    echo "============================================"
    echo ""
    success "Your app is now live at: https://$DOMAIN"
    echo ""
    log "Note: It may take a few minutes for the service to stabilize."
    log "Check status with: aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME"
}

# Run
main "$@"
