# ProcessorDB Website Testing Framework

This directory contains comprehensive testing setup for the ProcessorDB website, focusing on frontend-only testing with environment-aware configuration and parallel execution.

## Testing Strategy

The website tests are designed to be **frontend-only** with **parallel execution** and focus on:
- UI/UX functionality
- Client-side validation
- User interactions
- Visual regression
- Accessibility
- Performance
- Cross-browser compatibility
- Mobile and tablet responsiveness

### Environment-Aware Testing

The testing suite automatically adapts to different environments:

- **Development**: Fast local testing with dev server (4 parallel workers)
- **Staging**: Validation against staging deployment
- **Production**: Monitoring of live system (read-only)
- **CI/CD**: Reliable automated testing with local server (2 parallel workers)

### Parallel Execution

The testing framework supports parallel execution with:

- **Port Locking**: Ensures all workers use the same port
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Automatic Cleanup**: Removes lock files after completion
- **Conflict Resolution**: Prevents port conflicts between workers
- **Performance**: 3-4x faster execution vs sequential

**Note**: This testing framework focuses on frontend-only testing with mocked APIs.

## Environment Variables

The testing framework uses environment variables for configuration. Create a `.env` file in the project root with the following variables:

### Standard Test Environment
```env
# Frontend Configuration
SITE_URL=http://localhost:3000
PORT=3000

# Backend Configuration
BACKEND_URL=http://localhost:3001

# Environment
NODE_ENV=test
CI=false
```

### CI/CD Environment Variables
```env
# CI Configuration
CI=true
NODE_ENV=test

# CI Frontend Configuration
SITE_URL=http://localhost:3000

# CI Backend Configuration
BACKEND_URL=http://localhost:3001
```

### Staging Environment Variables
```env
# Staging Configuration
SITE_URL=https://staging.processordb.com
BACKEND_URL=https://staging-api.processordb.com
NODE_ENV=staging
```

### Production Environment Variables
```env
# Production Configuration
SITE_URL=https://processordb.com
BACKEND_URL=https://api.processordb.com
NODE_ENV=production
```

## Production Configuration

### Docker Configuration
The website uses a multi-stage Docker build for production deployment:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### PM2 Configuration
Production uses PM2 for process management:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "ProcessorDB-website",
    port: "3000",
    exec_mode: "cluster",
    instances: "max",
    script: "./.output/server/index.mjs"
  }]
}
```

### Nginx Configuration
Production deployment includes Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### OpenStack Deployment
The website supports OpenStack deployment with the following configuration:

#### Required OpenStack Secrets
```yaml
# OpenStack Authentication
OS_AUTH_URL: "https://your-openstack-api:5000/v3"
OS_USERNAME: "your-username"
OS_PASSWORD: "your-password"
OS_PROJECT_NAME: "your-project"
OS_USER_DOMAIN_NAME: "Default"
OS_PROJECT_DOMAIN_NAME: "Default"

# Server Configuration
ADMIN_PASSWORD: "secure-admin-password"
KEY_NAME: "your-ssh-key-name"
SECURITY_GROUP: "your-security-group-id"
NETWORK_ID: "your-network-id"

# SSH Access
SSH_PRIVATE_KEY: "your-private-ssh-key"
```

#### Resource Sizing
- **Development**: m1.tiny (1 vCPU, 1GB RAM)
- **Staging**: m1.small (1 vCPU, 2GB RAM)
- **Production**: m1.medium (2 vCPU, 4GB RAM)

### Health Checks
Production includes comprehensive health monitoring:

```bash
# Application health check
curl -f http://localhost:3000/ || exit 1

# PM2 status check
pm2 status

# Nginx status check
sudo systemctl status nginx
```

### Security Configuration
Production deployment includes security hardening:

```bash
# Firewall configuration
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# SSL/TLS with Let's Encrypt
sudo certbot --nginx -d your-domain.com

# Security hardening
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

## Test Structure

```
tests/
├── playwright/             # Frontend tests (Playwright with parallel execution)
│   ├── simple.test.ts
│   ├── mock-test.test.ts
├── global-setup.ts         # Global Playwright setup
├── global-teardown.ts      # Global Playwright teardown
├── components/             # Component unit tests (Vitest)
│   ├── DataTable.test.ts
│   ├── Navbar.test.ts
│   ├── Forms/
│   │   ├── CpuForm.test.ts
│   │   ├── GpuForm.test.ts
│   │   └── FpgaForm.test.ts
│   ├── Graphs/
│   │   └── CPUsGraph.test.ts
│   └── ui/
│       ├── Breadcrumb.test.ts
│       ├── DropdownMenu.test.ts
│       └── Table.test.ts
├── api/                    # API integration tests (Vitest)
│   └── form-endpoints.test.ts
├── lib/                    # Library unit tests (Vitest)
│   ├── encrypter.test.ts
│   ├── isLogged.test.ts
│   └── utils.test.ts
├── accessibility.test.ts   # WCAG compliance tests
├── forms.test.ts           # Form validation tests
├── performance.test.ts     # Frontend performance tests
├── visual-regression.test.ts # Visual consistency tests
├── config/                 # Environment configuration
│   ├── environments.js     # Environment-aware config with port locking
│   └── port-detector.js    # Port detection utilities
├── helpers/               # Test utilities and data
│   ├── test-data.ts
│   └── test-data-generator.ts
├── mocks/                  # Mock implementations
│   └── imports.ts
└── setup.ts               # Test setup configuration
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Validate Configuration
```bash
npm run test:validate
```

### 4. Run Tests
```bash
# Run all tests
npm run test:all

# Run specific test types
npm run test:frontend         # Frontend tests (Playwright with parallel execution)
npm run test:unit             # Unit tests (Vitest)
npm run test:integration      # Integration tests (Vitest)
npm run test:coverage         # All tests with coverage report

# Additional test commands
npm run test:ui               # Vitest UI for interactive testing
npm run test:run              # Run Vitest tests once
npm run test:frontend:ui      # Playwright UI for interactive testing
npm run test:frontend:headed  # Run Playwright tests with visible browser
npm run test:frontend:debug   # Debug Playwright tests
npm run test:accessibility    # Accessibility tests only
npm run test:performance      # Performance tests only
npm run test:visual           # Visual regression tests only
npm run test:forms            # Form tests only
npm run test:service          # Service tests
npm run test:validate         # Validate test configuration
```

## Test Types

### Frontend Tests (Playwright)
- **Simple Tests**: Basic page loading and navigation
- **Mock Tests**: API mocking and frontend functionality
- **Parallel Execution**: 4 workers in development, 2 in CI
- **Cross-Browser**: Chrome, Firefox, Safari, Edge, Mobile, Tablet

### Unit Tests (Vitest)
- **Components**: Individual component functionality
- **Forms**: CPU, GPU, and FPGA form validation
- **UI Components**: Breadcrumb, Dropdown, Table components
- **Libraries**: Utility functions and helpers

### Integration Tests (Vitest)
- **API Endpoints**: Form submission and data handling
- **Mocked APIs**: Frontend-backend integration testing

## Test Data Management

The testing framework includes comprehensive test data:

### CPU Test Data
```typescript
import { testCpuData } from './helpers/test-data';

// Valid data
const validCpu = testCpuData.valid;

// Invalid data for error testing
const invalidCpu = testCpuData.invalid;

// Edge cases
const edgeCaseCpu = testCpuData.edgeCases;
```

### GPU Test Data
```typescript
import { testGpuData } from './helpers/test-data';

// Similar structure for GPU testing
const validGpu = testGpuData.valid;
```

### FPGA Test Data
```typescript
import { testFpgaData } from './helpers/test-data';

// Similar structure for FPGA testing
const validFpga = testFpgaData.valid;
```

## Configuration Files

### Environment Configuration (`tests/config/environments.js`)
- **Automatic environment detection** based on `NODE_ENV` and `CI` variables
- **Environment-specific settings** for development, staging, production, and CI
- **Smart web server management** (starts local server vs uses existing)
- **Dynamic URL configuration** based on environment

### Playwright Configuration (`playwright.config.ts`)
- **Environment-aware configuration** using `environments.js`
- Multi-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile and tablet viewport testing
- Screenshot and video recording on failures
- Global setup and teardown

### Vitest Configuration (`vitest.config.ts`)
- Component testing with Vue Test Utils
- Coverage reporting
- Mock setup for Nuxt composables
- JSDOM environment

## Visual Regression Testing

Visual regression tests capture screenshots and compare them across test runs:

```bash
# Run visual tests
npm run test:visual

# Update screenshots (when intentional changes are made)
npx playwright test --update-snapshots
```

## Accessibility Testing

Accessibility tests use Axe Core to ensure WCAG compliance:

```bash
# Run accessibility tests
npm run test:accessibility
```

## Performance Testing

Performance tests validate page load times and responsiveness:

```bash
# Run performance tests
npm run test:performance
```

## Debugging Tests

### Debug Mode
```bash
# Debug frontend tests
npm run test:frontend:debug

# Debug with UI
npm run test:frontend:ui
```

### Headed Mode
```bash
# Run tests with visible browser
npx playwright test --headed
```

## Coverage Reports

Generate test coverage reports:

```bash
# Generate coverage
npm run test:coverage

# View coverage report
open coverage/index.html
```

## Test Validation

Validate your test configuration:

```bash
# Validate test setup
npm run test:validate
```

This will check:
- All required dependencies
- Configuration files
- Test files
- Package.json scripts
- TypeScript configuration

## Common Issues

### 1. Playwright Browsers Not Installed
```bash
npx playwright install
```

### 2. Missing Dependencies
```bash
npm install
```

### 3. TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### 4. Test Timeouts
- Increase timeout in `playwright.config.ts`
- Check for slow API responses
- Verify network connectivity

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests independent

### 2. Test Data
- Use the provided test data helpers
- Create realistic test scenarios
- Clean up test data after tests

### 3. Assertions
- Use specific assertions
- Test both positive and negative cases
- Include accessibility checks

### 4. Performance
- Keep tests fast
- Use appropriate timeouts
- Mock external dependencies

## Environment-Specific Testing

### Development Environment
```bash
# Fast local testing with dev server
npm run test:frontend
```
- ✅ Uses `localhost:3000` with local dev server
- ✅ Fast execution, full debugging
- ✅ No external dependencies

### Staging Environment
```bash
# Test against staging deployment
SITE_URL=https://staging.processordb.com npm run test:frontend
```
- ✅ Tests against staging server
- ✅ Validates deployment configuration
- ✅ Uses production-like data

### Production Environment
```bash
# Test against production (use carefully!)
SITE_URL=https://processordb.com npm run test:frontend
```
- **Read-only tests only**
- **Use with caution** - affects live system
- Validates production functionality

### CI/CD Environment
```bash
# Automatic in CI/CD pipelines
npm run test:frontend
```
- Uses localhost with local server
- Fast and reliable
- No external dependencies

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm install
    npx playwright install
    npm run test:all
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Axe Core Accessibility](https://www.deque.com/axe/)

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use the provided test data helpers
3. Include both positive and negative test cases
4. Add appropriate documentation
5. Run the validation script before committing

## Port Configuration Summary

### Frontend Service Ports
- **Frontend Server**: Port 3000 (default)
- **API Server**: Port 3001 (for backend communication)
- **Test Server**: Dynamic port detection (3000-3100 range)

### Port Environment Variables
```env
# Frontend Ports
PORT=3000
SITE_URL=http://localhost:3000

# Backend Ports
BACKEND_URL=http://localhost:3001
```

### Port Configuration in Different Environments
- **Development**: Frontend on 3000, API on 3001
- **Test**: Frontend on 3000, API on 3001 (mocked)
- **Staging**: Frontend on staging URL, API on staging API URL
- **Production**: Frontend on production URL, API on production API URL
- **CI/CD**: Frontend on 3000, API on 3001 (local server)

## Testing Configurations

### Playwright Configuration (`playwright.config.ts`)
- **Environment-Aware**: Uses `environments.js` for dynamic configuration
- **Multi-Browser Testing**: Chrome, Firefox, Safari, Edge, Mobile, Tablet
- **Parallel Execution**: 4 workers in development, 2 in CI
- **Port Management**: Dynamic port detection with locking mechanism
- **Global Setup/Teardown**: API mocking and cleanup
- **Screenshot/Video**: On failure capture for debugging
- **Timeout Configuration**: 120s test timeout, 10s assertion timeout

### Vitest Configuration (`vitest.config.ts`)
- **Environment**: JSDOM for browser simulation
- **Coverage**: V8 provider with HTML, JSON, text reports
- **Aliases**: Path resolution for `@`, `~`, `#app`, `#imports`
- **Exclusions**: Playwright tests, config files
- **Setup Files**: `tests/setup.ts` for global test setup
- **ESBuild**: Node 18 target for compatibility

### Environment Configuration (`tests/config/environments.js`)
- **Port Detection**: Automatic port detection in range 3000-3100
- **Port Locking**: Prevents conflicts between parallel workers
- **Environment Detection**: Based on `NODE_ENV` and `CI` variables
- **Web Server Management**: Starts local server vs uses existing
- **Timeout Configuration**: Environment-specific timeouts
- **Worker Configuration**: Parallel execution settings

### Test Setup (`tests/setup.ts`)
- **Storage Mocking**: sessionStorage and localStorage
- **Fetch Mocking**: Global fetch API
- **Console Mocking**: Reduced noise in test output
- **Nuxt Composables**: useRuntimeConfig, useStorage, useRoute, useRouter
- **Window Object**: Browser environment simulation

## Key Test Functions Summary

### Frontend Tests (Playwright)
- **`simple.test.ts`**: Basic page loading and navigation tests with API mocking
- **`accessibility.test.ts`**: WCAG compliance tests using Axe Core for homepage, CPU list, navigation, error messages, mobile/tablet viewports
- **`performance.test.ts`**: Performance budget tests for homepage, CPU/GPU/FPGA list pages, UI interactions, memory usage, mobile/tablet performance
- **`forms.test.ts`**: Form validation tests for client-side validation, numeric fields, form navigation, cancellation, mobile viewport, field interactions, CPU/GPU/FPGA form validation
- **`visual-regression.test.ts`**: Visual consistency tests for homepage, CPU/GPU/FPGA list pages, navigation, error states, loading states, mobile/tablet/desktop viewports

### Component Tests (Vitest)
- **`DataTable.test.ts`**: DataTable component tests for rendering, data display, empty data handling, event emission, table structure
- **`CpuForm.test.ts`**: CPU form component tests for initialization, validation, create/edit operations, read-only mode, form sections, error handling, data preparation, edge cases
- **`GpuForm.test.ts`**: GPU form component tests (similar structure to CPU form)
- **`FpgaForm.test.ts`**: FPGA form component tests (similar structure to CPU form)
- **`Navbar.test.ts`**: Navigation component tests
- **`Breadcrumb.test.ts`**: Breadcrumb component tests
- **`DropdownMenu.test.ts`**: Dropdown menu component tests
- **`Table.test.ts`**: Table component tests

### API Integration Tests (Vitest)
- **`form-endpoints.test.ts`**: API endpoint tests for CPU/GPU/FPGA creation, updates, error handling, network errors, JSON parsing errors, data validation, form data preparation

### Library Tests (Vitest)
- **`utils.test.ts`**: Utility function tests for class name merging, conditional classes, Tailwind class conflicts
- **`encrypter.test.ts`**: Encryption utility tests
- **`isLogged.test.ts`**: Authentication state tests

### Test Configuration Files
- **`environments.js`**: Environment-aware configuration with port locking, automatic environment detection, web server management
- **`port-detector.js`**: Port detection utilities for parallel execution
- **`setup.ts`**: Test setup with mocking for sessionStorage, localStorage, fetch, console, Nuxt composables
- **`global-setup.ts`**: Global Playwright setup with API mocking
- **`global-teardown.ts`**: Global Playwright teardown

### Test Data Management
- **`test-data.ts`**: Comprehensive test data for CPU, GPU, FPGA with valid, invalid, edge cases, minimal data
- **`test-data-generator.ts`**: Test data generators for different scenarios (valid, invalid, edge cases, special characters)
- **`test-data-generator.ts`**: Data validation helpers and cleanup utilities

### Service Testing (`scripts/test-service.js`)
- **Frontend Service Management**: Start/stop frontend service for testing
- **Health Checks**: Service availability validation
- **Parallel Test Execution**: Unit, integration, and service tests
- **Environment Setup**: Test environment configuration
- **Test Reporting**: Comprehensive test results and timing
- **Cleanup Management**: Proper test environment cleanup

### Test Validation (`scripts/validate-test-config.js`)
- **Dependency Validation**: Required packages and versions
- **Configuration Validation**: Test config files and structure
- **Script Validation**: Package.json test scripts
- **TypeScript Validation**: TypeScript configuration
- **Test Data Validation**: Test data structure and exports
- **Browser Validation**: Playwright browser installation


## Support

For testing issues or questions:
- Check the validation script output
- Review the test configuration
- Consult the documentation links above
- Create an issue with detailed error information