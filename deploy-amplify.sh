#!/bin/bash
set -e

# ============================================================
# StackOne Mailflow - AWS Amplify Deployment Script
# ============================================================
# Deploys Next.js SSR app using AWS Amplify Hosting
# which has native support for Next.js server-side rendering
# ============================================================

AWS_REGION="us-east-1"
DOMAIN="thestackone.com"
APP_NAME="mailflow"
BRANCH="main"
HOSTED_ZONE_ID="Z03773932LRTBXZF0M28O"

# Colors
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
    success "Authenticated as Account: $ACCOUNT"
}

# Push code to a Git repository (Amplify needs a Git source)
# Alternative: use amplify push with local code
setup_amplify_app() {
    log "Creating Amplify app..."
    
    # Check if app already exists
    APP_ID=$(aws amplify list-apps --query "apps[?name=='${APP_NAME}'].appId" --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$APP_ID" ] || [ "$APP_ID" = "None" ]; then
        # Create Amplify app without Git provider (manual deployments)
        APP_ID=$(aws amplify create-app \
            --name "$APP_NAME" \
            --description "StackOne Mailflow - Next.js SSR Application" \
            --platform WEB_COMPUTE \
            --environment-variables \
                NEXTAUTH_SECRET="stackone-prod-secret-$(openssl rand -hex 16)" \
                NEXTAUTH_URL="https://${DOMAIN}" \
                NODE_ENV="production" \
            --region $AWS_REGION \
            --query 'app.appId' --output text)
        
        success "Created Amplify app: $APP_ID"
    else
        success "Amplify app already exists: $APP_ID"
    fi
    
    echo "APP_ID=$APP_ID" > /tmp/amplify-deploy.env
}

# Create branch
create_branch() {
    source /tmp/amplify-deploy.env
    log "Setting up branch: $BRANCH..."
    
    # Check if branch exists
    BRANCH_STATUS=$(aws amplify get-branch \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH" \
        --query 'branch.branchName' --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$BRANCH_STATUS" ] || [ "$BRANCH_STATUS" = "None" ]; then
        aws amplify create-branch \
            --app-id "$APP_ID" \
            --branch-name "$BRANCH" \
            --stage "PRODUCTION" \
            --region $AWS_REGION
        
        success "Created production branch: $BRANCH"
    else
        success "Branch already exists: $BRANCH"
    fi
}

# Deploy using amplify push (for local code deployment)
deploy_local() {
    source /tmp/amplify-deploy.env
    log "Deploying local code to Amplify..."
    
    # Create a deployment
    DEPLOYMENT_ID=$(aws amplify create-deployment \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH" \
        --region $AWS_REGION \
        --query 'deploymentId' --output text)
    
    # Generate deployment ZIP
    log "Creating deployment package..."
    
    # Remove old artifacts
    rm -f /tmp/mailflow-deploy.zip
    
    # Create zip excluding unnecessary files
    zip -r /tmp/mailflow-deploy.zip . \
        -x "node_modules/*" \
        -x ".next/*" \
        -x ".git/*" \
        -x "db/*" \
        -x "*.log" \
        -x "upload/*" \
        -x "skills/*" \
        -x "examples/*" \
        -x "mini-services/*" \
        -x ".zscripts/*"
    
    # Get upload URL
    UPLOAD_URL=$(aws amplify create-deployment \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH" \
        --region $AWS_REGION \
        --query 'zipUploadUrl' --output text 2>/dev/null || echo "")
    
    # Upload the zip
    if [ -n "$UPLOAD_URL" ]; then
        log "Uploading deployment package..."
        curl -s -T /tmp/mailflow-deploy.zip "$UPLOAD_URL"
        success "Deployment package uploaded"
    else
        # Alternative: use start-deployment
        log "Starting deployment..."
        JOB_ID=$(aws amplify start-deployment \
            --app-id "$APP_ID" \
            --branch-name "$BRANCH" \
            --source-url "s3://thestackone-website/mailflow-deploy.zip" \
            --region $AWS_REGION \
            --query 'jobSummary.jobId' --output text 2>/dev/null || echo "manual")
    fi
}

# Setup custom domain
setup_domain() {
    source /tmp/amplify-deploy.env
    log "Setting up custom domain: $DOMAIN..."
    
    # Check if domain association exists
    DOMAIN_STATUS=$(aws amplify get-domain-association \
        --app-id "$APP_ID" \
        --domain-name "$DOMAIN" \
        --query 'domainAssociation.domainStatus' --output text --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$DOMAIN_STATUS" ] || [ "$DOMAIN_STATUS" = "None" ]; then
        aws amplify create-domain-association \
            --app-id "$APP_ID" \
            --domain-name "$DOMAIN" \
            --sub-domain-settings prefix="",branchName="$BRANCH" \
            --region $AWS_REGION
        
        success "Domain association created for $DOMAIN"
        warn "You may need to update DNS records in Route53"
    else
        success "Domain association already exists: $DOMAIN_STATUS"
    fi
}

# Main
main() {
    echo ""
    echo "============================================"
    echo "  StackOne Mailflow - AWS Amplify Deploy"
    echo "============================================"
    echo ""
    
    check_credentials
    setup_amplify_app
    create_branch
    deploy_local
    setup_domain
    
    echo ""
    echo "============================================"
    echo "  Deployment Initiated!"
    echo "============================================"
    echo ""
    source /tmp/amplify-deploy.env
    success "App ID: $APP_ID"
    log "Monitor at: https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID"
    log "Or run: aws amplify get-job --app-id $APP_ID --branch-name $BRANCH --job-id <job-id>"
}

main "$@"
