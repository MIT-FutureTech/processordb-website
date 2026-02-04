#!/bin/bash

# Package maintenance script for frontend
# This script updates packages and fixes vulnerabilities
# Run manually during scheduled maintenance windows

set -e

ENVIRONMENT=${1:-"staging"}

# Determine deployment path based on environment
if [ "$ENVIRONMENT" == "production" ]; then
    DEPLOY_PATH="${DEPLOY_PATH:-$HOME/processordb-website}"
    GIT_BRANCH="main"
else
    DEPLOY_PATH="${STAGING_DEPLOY_PATH:-$HOME/processordb-website-staging}"
    GIT_BRANCH="dev"
fi

echo "=== Package Maintenance for $ENVIRONMENT ==="
echo "Deploy path: $DEPLOY_PATH"
echo "Branch: $GIT_BRANCH"
echo ""
echo "This script will:"
echo "  1. Check for outdated packages"
echo "  2. Check for security vulnerabilities"
echo "  3. Update packages to latest compatible versions"
echo "  4. Fix automatically fixable vulnerabilities"
echo ""
echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
sleep 5

# Navigate to deployment directory
cd "$DEPLOY_PATH" || {
    echo "Error: Deployment directory $DEPLOY_PATH does not exist"
    exit 1
}

# Load nvm if available
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
else
    echo "Warning: nvm not found, assuming node is in PATH"
fi

# Show current status
echo ""
echo "=== Current Package Status ==="
echo "Outdated packages:"
npm outdated || echo "No outdated packages found (or npm outdated failed)"

echo ""
echo "Current vulnerabilities:"
npm audit --audit-level=low || echo "No vulnerabilities found (or npm audit failed)"

# Ask for confirmation
echo ""
read -p "Apply updates? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Update packages
echo ""
echo "=== Updating Packages ==="
echo "Updating packages to latest compatible versions..."
npm update || {
    echo "Warning: Some packages could not be updated"
}

# Fix vulnerabilities (non-breaking fixes only)
echo ""
echo "=== Fixing Vulnerabilities ==="
echo "Applying automatically fixable security patches..."
npm audit fix || {
    echo "Warning: Some vulnerabilities may require manual intervention"
    echo "For breaking changes, review 'npm audit fix --force' (use with caution)"
}

# Show updated status
echo ""
echo "=== Updated Package Status ==="
echo "Remaining outdated packages:"
npm outdated || echo "No outdated packages found"

echo ""
echo "Remaining vulnerabilities:"
npm audit --audit-level=low || echo "No vulnerabilities found"

echo ""
echo "=== Maintenance Complete ==="
echo "Next steps:"
echo "  1. Review the changes above"
echo "  2. Test the application thoroughly"
echo "  3. Commit updated package-lock.json if changes were made"
echo "  4. Deploy to staging first, then production"
echo ""
echo "To commit changes:"
echo "  git add package-lock.json"
echo "  git commit -m 'chore: update npm packages and fix vulnerabilities'"
echo "  git push origin $GIT_BRANCH"
