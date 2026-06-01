# StackOne Mailflow - AWS Deployment Guide

## Current Status
- ✅ Code pushed to GitHub: https://github.com/CHAMA18/stackone
- ✅ "Get Started" and "Sign In" buttons fixed with Next.js Link navigation
- ✅ Authentication system (NextAuth.js) fully functional
- ✅ Dashboard pages complete (Overview, Projects, Messages, Settings, Team)
- ✅ Build passes successfully (17 routes)
- ✅ GitHub Actions workflows created

## Important: Server-Side Rendering Required
This application uses NextAuth.js which requires server-side rendering. The previous S3 + CloudFront static hosting setup will **NOT** work for the auth/dashboard features. You need a server-side hosting solution.

## Deployment Options

### Option 1: AWS Amplify Hosting (RECOMMENDED - Easiest)

AWS Amplify has native support for Next.js SSR applications including API routes.

#### Step 1: Add GitHub Secrets
Go to your GitHub repo → Settings → Secrets and variables → Actions, and add:
- `AWS_ACCESS_KEY_ID` - Your IAM access key
- `AWS_SECRET_ACCESS_KEY` - Your IAM secret key
- `NEXTAUTH_SECRET` - A random secret (generate with: `openssl rand -hex 32`)
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

#### Step 2: Trigger the GitHub Actions Workflow
Push to `main` branch or manually trigger the "Deploy to AWS Amplify" workflow.

#### Step 3: Setup Domain in Amplify Console
1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify
2. Select your app
3. Go to Domain Management → Add Domain
4. Enter "thestackone.com"
5. Follow DNS configuration instructions (update Route53 records)

### Option 2: Manual AWS Amplify Setup (via Console)

1. Go to AWS Amplify Console: https://us-east-1.console.aws.amazon.com/amplify
2. Click "Create New App" → "Host Web App"
3. Select GitHub as source
4. Authorize and select the "CHAMA18/stackone" repository
5. Branch: main
6. Build settings:
   - Framework: Next.js (SSR)
   - Build command: `npm run build`
   - Output directory: `.next`
7. Add environment variables:
   - `NEXTAUTH_SECRET` = (generate with: `openssl rand -hex 32`)
   - `NEXTAUTH_URL` = `https://thestackone.com`
   - `NODE_ENV` = `production`
8. Click "Save and Deploy"
9. After deployment succeeds, add custom domain:
   - Domain management → Add domain → thestackone.com
   - Update Route53 DNS records as instructed

### Option 3: ECS Fargate with Docker

Use the provided Dockerfile and deploy-aws.sh script:
```bash
# Set up AWS credentials
aws configure

# Run the deployment script
bash deploy-aws.sh
```

This creates:
- ECR repository for Docker images
- ECS Fargate cluster and service
- Application Load Balancer with SSL
- Route53 DNS records pointing to the ALB

### Option 4: EC2 with Standalone Build

1. Launch an EC2 instance (t3.small minimum)
2. Install Node.js 20 and bun
3. Clone the repo
4. Run:
```bash
bun install
npx prisma generate
bun run build
NODE_ENV=production DATABASE_URL=file:/app/db/custom.db \
NEXTAUTH_SECRET=your-secret NEXTAUTH_URL=https://thestackone.com \
node .next/standalone/server.js
```
5. Set up Nginx reverse proxy with SSL
6. Update Route53 to point to the EC2 instance

## AWS Credentials Setup

If you need to create new IAM credentials:

1. Go to AWS Console → IAM → Users → StackOne
2. Security credentials tab → Create access key
3. Copy the Access Key ID and Secret Access Key
4. Configure AWS CLI: `aws configure`
5. Or add as GitHub Secrets for CI/CD

## Required IAM Permissions

The IAM user needs these permissions for Amplify deployment:
- `amplify:*` - Full Amplify access
- `iam:CreateServiceLinkedRole` - For Amplify service roles
- `route53:*` - For DNS management
- `acm:*` - For SSL certificates
- `cloudfront:*` - For CDN distribution
- `s3:*` - For S3 bucket operations

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | Secret for JWT signing | `openssl rand -hex 32` |
| `NEXTAUTH_URL` | Public URL of the app | `https://thestackone.com` |
| `DATABASE_URL` | SQLite database path | `file:/app/db/custom.db` |
| `NODE_ENV` | Environment | `production` |

## DNS Configuration

Update Route53 records for thestackone.com:
- **A Record** (Alias): Point to the Amplify/CloudFront distribution
- **AAAA Record** (Alias): Point to the Amplify/CloudFront distribution
- Remove any existing A/AAAA records pointing to old CloudFront distribution

## Quick Start (Fastest Path)

1. Go to https://us-east-1.console.aws.amazon.com/amplify
2. New App → Host Web App → GitHub
3. Select CHAMA18/stackone, branch: main
4. Framework: Next.js SSR
5. Add env vars (NEXTAUTH_SECRET, NEXTAUTH_URL)
6. Deploy
7. Add custom domain (thestackone.com)
8. Done! 🎉
