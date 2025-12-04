#!/bin/bash

# Deployment script for pull-based deployment
# This script runs on the instance to pull and deploy

set -e

# Determine environment from argument or git branch
ENVIRONMENT=${1:-"production"}
BRANCH=${2:-"main"}

if [ "$ENVIRONMENT" == "production" ]; then
    DEPLOY_PATH="${DEPLOY_PATH:-$HOME/processordb-website}"
    PM2_APP_NAME="ProcessorDB-website"
    GIT_BRANCH="main"
else
    DEPLOY_PATH="${STAGING_DEPLOY_PATH:-$HOME/processordb-website-staging}"
    PM2_APP_NAME="ProcessorDB-website-staging"
    GIT_BRANCH="dev"
fi

echo "Starting deployment for $ENVIRONMENT..."
echo "Deploy path: $DEPLOY_PATH"
echo "Branch: $GIT_BRANCH"

# Navigate to deployment directory
cd "$DEPLOY_PATH" || {
    echo "Error: Deployment directory $DEPLOY_PATH does not exist"
    exit 1
}

# Load .env file if it exists (for environment variables)
if [ -f .env ]; then
    echo "Loading environment variables from .env file..."
    set -a
    source .env
    set +a
fi

# Pull latest code
echo "Pulling latest code from $GIT_BRANCH..."
git fetch origin
git checkout "$GIT_BRANCH"
git pull origin "$GIT_BRANCH"

# Load nvm
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
else
    echo "Warning: nvm not found, assuming node is in PATH"
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build application
echo "Building application..."
# SITE_URL and BACKEND_URL should be loaded from .env if it exists
npm run build

# Determine ecosystem config file
if [ "$ENVIRONMENT" == "staging" ] && [ -f "ecosystem.staging.config.cjs" ]; then
    ECOSYSTEM_FILE="ecosystem.staging.config.cjs"
elif [ "$ENVIRONMENT" == "staging" ] && [ -f "ecosystem.staging.config.js" ]; then
    ECOSYSTEM_FILE="ecosystem.staging.config.js"
else
    ECOSYSTEM_FILE="ecosystem.config.js"
fi

# Restart PM2 application
echo "Restarting PM2 application..."
pm2 restart "$PM2_APP_NAME" || pm2 start "$ECOSYSTEM_FILE"

# Save PM2 process list
pm2 save --force

echo "Deployment completed successfully for $ENVIRONMENT!"

