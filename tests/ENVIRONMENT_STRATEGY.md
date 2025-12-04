# Environment Strategy for Testing

## 🎯 **Overview**

This document explains how the testing suite handles different environments (development, staging, production) and ensures tests run correctly in each context.

## 🔧 **Environment Configuration**

### **Development Environment**
```bash
# Local development
NODE_ENV=development
SITE_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Run tests
npm run test:e2e:dev
```

**Characteristics:**
- ✅ Starts local dev server automatically
- ✅ Fast execution (no network latency)
- ✅ Full debugging capabilities
- ✅ No external dependencies

### **Staging Environment**
```bash
# Staging deployment
NODE_ENV=staging
SITE_URL=https://staging.processordb.com
BACKEND_URL=https://staging-api.processordb.com

# Run tests
npm run test:e2e:staging
```

**Characteristics:**
- ✅ Tests against real staging server
- ✅ Validates deployment configuration
- ✅ Tests with production-like data
- ⚠️ Requires staging server to be running

### **Production Environment**
```bash
# Production deployment
NODE_ENV=production
SITE_URL=https://processordb.com
BACKEND_URL=https://api.processordb.com

# Run tests
npm run test:e2e:production
```

**Characteristics:**
- ✅ Tests against live production system
- ✅ Validates production functionality
- ⚠️ **Use with caution** - affects live system
- ⚠️ Requires production server to be accessible

### **CI/CD Environment**
```bash
# GitHub Actions CI
CI=true
NODE_ENV=development
SITE_URL=http://localhost:3000

# Run tests
npm run test:e2e
```

**Characteristics:**
- ✅ Automated testing in CI pipeline
- ✅ Starts local dev server
- ✅ No external dependencies
- ✅ Fast and reliable

## 🚀 **How It Works**

### **1. Environment Detection**
The testing suite automatically detects the environment based on:
- `NODE_ENV` environment variable
- `CI` environment variable (for GitHub Actions)
- `SITE_URL` environment variable

### **2. Configuration Selection**
```javascript
// tests/config/environments.js
const environments = {
  development: { /* dev config */ },
  staging: { /* staging config */ },
  production: { /* production config */ },
  ci: { /* CI config */ }
};
```

### **3. Test Execution**
- **Development**: Starts local server, runs tests locally
- **Staging**: Tests against staging server (no local server)
- **Production**: Tests against production server (no local server)
- **CI**: Starts local server, runs tests in CI environment

## 📋 **Best Practices**

### **For Development**
```bash
# Always use development environment for local testing
npm run test:e2e:dev
```

### **For CI/CD**
```bash
# CI automatically uses development environment
npm run test:e2e
```

### **For Staging Validation**
```bash
# Test against staging before production deployment
npm run test:e2e:staging
```

### **For Production Monitoring**
```bash
# Only run production tests when necessary
npm run test:e2e:production
```

## ⚠️ **Important Considerations**

### **Production Testing**
- **Never run production tests during development**
- **Only run production tests when absolutely necessary**
- **Production tests should be read-only (no data modification)**
- **Use staging environment for pre-production validation**

### **Environment Variables**
- **Development**: Uses localhost URLs
- **Staging**: Uses staging domain URLs
- **Production**: Uses production domain URLs
- **CI**: Uses localhost URLs with local server

### **Test Data**
- **Development**: Uses mock data
- **Staging**: Uses staging data (safe to modify)
- **Production**: Uses production data (read-only)
- **CI**: Uses mock data

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Tests fail against production**
   - Check if production server is accessible
   - Verify SITE_URL is correct
   - Ensure tests are read-only

2. **Tests fail against staging**
   - Check if staging server is running
   - Verify staging URLs are correct
   - Check network connectivity

3. **Local tests fail**
   - Check if dev server is running
   - Verify localhost URLs
   - Check port availability

### **Debug Commands**
```bash
# Check environment configuration
npm run test:validate

# Run tests with debug output
npm run test:e2e:debug

# Run specific test suite
npm run test:accessibility
```

## 📚 **Environment Variables Reference**

| Variable | Development | Staging | Production | CI |
|----------|-------------|---------|------------|-----|
| `NODE_ENV` | `development` | `staging` | `production` | `development` |
| `SITE_URL` | `http://localhost:3000` | `https://staging.processordb.com` | `https://processordb.com` | `http://localhost:3000` |
| `BACKEND_URL` | `http://localhost:3001` | `https://staging-api.processordb.com` | `https://api.processordb.com` | `http://localhost:3001` |
| `CI` | `false` | `false` | `false` | `true` |

## 🎯 **Summary**

The testing suite intelligently handles different environments by:
1. **Detecting the current environment**
2. **Selecting appropriate configuration**
3. **Starting servers when needed**
4. **Using correct URLs and timeouts**
5. **Handling environment-specific requirements**

This ensures tests run correctly in development, staging, production, and CI environments without manual configuration changes.
