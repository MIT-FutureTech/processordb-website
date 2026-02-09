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
# Clean any uncommitted changes and reset to remote branch
# This ensures we're always deploying what's on the remote dev branch
git clean -fd
git reset --hard "origin/$GIT_BRANCH"

# Fix line endings in deploy script (in case repo has CRLF)
# This prevents "$'\r': command not found" errors
if [ -f "scripts/deploy.sh" ]; then
    sed -i 's/\r$//' scripts/deploy.sh
fi

# Load nvm
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
else
    echo "Warning: nvm not found, assuming node is in PATH"
fi

# Install dependencies
echo "Installing dependencies..."
# Ensure devDependencies are installed (npm ci installs them by default unless NODE_ENV=production)
NODE_ENV=development npm ci

# Check for outdated packages (informational only, non-blocking)
echo "Checking for outdated packages..."
npm outdated || {
    echo "Note: Some packages may be outdated (this is informational only)"
}

# Audit packages for security vulnerabilities (non-blocking)
echo "Auditing packages for security vulnerabilities..."
npm audit --audit-level=moderate || {
    echo "⚠ WARNING: npm audit found vulnerabilities. Review the output above."
    echo "⚠ Run 'npm audit fix' manually after reviewing changes, or use scripts/maintain-packages.sh"
    echo "⚠ Deployment will continue, but please address vulnerabilities in a future update."
}

# Check package funding information (informational, non-critical)
echo "Checking package funding information..."
npm fund --json > /dev/null 2>&1 || {
    echo "Note: Could not retrieve funding information (non-critical)"
}

# Verify critical dependency is installed
if [ ! -d "node_modules/@nuxtjs/tailwindcss" ]; then
    echo "Warning: @nuxtjs/tailwindcss not found, installing it explicitly..."
    npm install @nuxtjs/tailwindcss --save-dev
fi

# Clean up previous build artifacts
echo "Cleaning up previous build artifacts..."
if [ -d ".output" ]; then
    echo "Removing .output directory..."
    rm -rf .output
fi
if [ -d ".nuxt" ]; then
    echo "Removing .nuxt directory..."
    rm -rf .nuxt
fi

# Prepare Nuxt modules (ensure this runs after all packages are installed)
echo "Preparing Nuxt modules..."
npx nuxt prepare || {
    echo "Warning: nuxt prepare failed, but continuing with build..."
}

# Build application
echo "Building application..."
# Reload .env file right before build to ensure NUXT_PUBLIC_* vars are available
if [ -f .env ]; then
    echo "Reloading environment variables for build..."
    set -a
    source .env
    set +a
    # Explicitly export NUXT_PUBLIC_* variables for Nuxt build
    if [ -n "$NUXT_PUBLIC_BACKEND_URL" ]; then
        export NUXT_PUBLIC_BACKEND_URL
        echo "✓ NUXT_PUBLIC_BACKEND_URL is set: $NUXT_PUBLIC_BACKEND_URL"
    else
        echo "⚠ WARNING: NUXT_PUBLIC_BACKEND_URL is not set!"
        # Try to set it from BACKEND_URL if available
        if [ -n "$BACKEND_URL" ]; then
            export NUXT_PUBLIC_BACKEND_URL="$BACKEND_URL"
            echo "✓ Set NUXT_PUBLIC_BACKEND_URL from BACKEND_URL: $NUXT_PUBLIC_BACKEND_URL"
        fi
    fi
    if [ -n "$NUXT_PUBLIC_SITE_URL" ]; then
        export NUXT_PUBLIC_SITE_URL
        echo "✓ NUXT_PUBLIC_SITE_URL is set: $NUXT_PUBLIC_SITE_URL"
    else
        # Try to set it from SITE_URL if available
        if [ -n "$SITE_URL" ]; then
            export NUXT_PUBLIC_SITE_URL="$SITE_URL"
            echo "✓ Set NUXT_PUBLIC_SITE_URL from SITE_URL: $NUXT_PUBLIC_SITE_URL"
        fi
    fi
else
    echo "⚠ WARNING: .env file not found!"
fi
npm run build

# Verify build output exists
echo "[Deploy Debug] Checking build output..."
if [ -d ".output" ]; then
  echo "[Deploy Debug] .output directory exists"
  if [ -d ".output/public" ]; then
    echo "[Deploy Debug] .output/public directory exists"
    if [ -d ".output/public/_nuxt" ]; then
      FILE_COUNT=$(find .output/public/_nuxt -type f 2>/dev/null | wc -l)
      echo "[Deploy Debug] .output/public/_nuxt directory exists with $FILE_COUNT files"
    else
      echo "[Deploy Debug] WARNING: .output/public/_nuxt directory does NOT exist"
    fi
  else
    echo "[Deploy Debug] WARNING: .output/public directory does NOT exist"
  fi
  if [ -d ".nuxt/dist/client" ]; then
    CLIENT_FILE_COUNT=$(find .nuxt/dist/client -type f 2>/dev/null | wc -l)
    echo "[Deploy Debug] .nuxt/dist/client directory exists with $CLIENT_FILE_COUNT files"
  else
    echo "[Deploy Debug] WARNING: .nuxt/dist/client directory does NOT exist"
  fi
else
  echo "[Deploy Debug] ERROR: .output directory does NOT exist after build"
fi

# Determine ecosystem config file
if [ "$ENVIRONMENT" == "staging" ] && [ -f "ecosystem.staging.config.cjs" ]; then
    ECOSYSTEM_FILE="ecosystem.staging.config.cjs"
elif [ "$ENVIRONMENT" == "staging" ] && [ -f "ecosystem.staging.config.js" ]; then
    ECOSYSTEM_FILE="ecosystem.staging.config.js"
else
    ECOSYSTEM_FILE="ecosystem.config.cjs"
fi

# Set PM2_ENV environment variable for ecosystem config to detect environment
export PM2_ENV="$ENVIRONMENT"

# Restart PM2 application
echo "Restarting PM2 application..."
pm2 restart "$PM2_APP_NAME" || pm2 start "$ECOSYSTEM_FILE" --update-env

# Save PM2 process list
pm2 save --force

echo "Deployment completed successfully for $ENVIRONMENT!"

