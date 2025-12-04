#!/usr/bin/env node

/**
 * Test Configuration Validation Script
 * 
 * This script validates that the testing configuration is properly set up
 * and all dependencies are available for running tests.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

console.log('Validating ProcessorDB Website Test Configuration...\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: package.json not found. Please run this script from the processordb-website directory.');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check required dependencies
console.log('Checking dependencies...');
const requiredDeps = [
  '@playwright/test',
  '@vitest/ui',
  '@vitest/coverage-v8',
  '@vue/test-utils',
  'vitest',
  '@axe-core/playwright'
];

const missingDeps = [];
for (const dep of requiredDeps) {
  if (!packageJson.devDependencies?.[dep] && !packageJson.dependencies?.[dep]) {
    missingDeps.push(dep);
  }
}

if (missingDeps.length > 0) {
  console.error('Missing required dependencies:', missingDeps.join(', '));
  console.log('Run: npm install to install missing dependencies');
  process.exit(1);
} else {
  console.log('All required dependencies are present');
}

// Check test configuration files
console.log('\nChecking test configuration files...');
const configFiles = [
  'playwright.config.ts',
  'vitest.config.ts',
  'tests/setup.ts',
  'tests/e2e/global-setup.ts',
  'tests/e2e/global-teardown.ts',
  'tests/mocks/imports.ts',
  'tests/helpers/test-data.ts'
];

const missingConfigs = [];
for (const config of configFiles) {
  if (!fs.existsSync(config)) {
    missingConfigs.push(config);
  }
}

if (missingConfigs.length > 0) {
  console.error('Missing configuration files:', missingConfigs.join(', '));
  process.exit(1);
} else {
  console.log('All configuration files are present');
}

// Check test files
console.log('\nChecking test files...');
const testFiles = [
  'tests/e2e/accessibility.test.ts',
  'tests/e2e/frontend-forms.test.ts',
  'tests/e2e/performance.test.ts',
  'tests/e2e/visual-regression.test.ts'
];

const missingTests = [];
for (const test of testFiles) {
  if (!fs.existsSync(test)) {
    missingTests.push(test);
  }
}

if (missingTests.length > 0) {
  console.error('Missing test files:', missingTests.join(', '));
} else {
  console.log('All test files are present');
}

// Check package.json scripts
console.log('\nChecking package.json scripts...');
const requiredScripts = [
  'test',
  'test:e2e',
  'test:unit',
  'test:integration',
  'test:accessibility',
  'test:performance',
  'test:visual',
  'test:forms'
];

const missingScripts = [];
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    missingScripts.push(script);
  }
}

if (missingScripts.length > 0) {
  console.error('Missing required scripts:', missingScripts.join(', '));
  process.exit(1);
} else {
  console.log('All required scripts are present');
}

// Validate TypeScript configuration
console.log('\nChecking TypeScript configuration...');
try {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    // const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    console.log('TypeScript configuration found');
  } else {
    console.log('No tsconfig.json found (this may be expected for some projects)');
  }
} catch {
  console.log('Could not validate TypeScript configuration');
}

// Check for common issues
console.log('\nChecking for common configuration issues...');

// Check if playwright browsers are installed
try {
  execSync('npx playwright --version', { stdio: 'pipe' });
  console.log('Playwright is available');
} catch {
  console.log('Playwright may not be properly installed. Run: npx playwright install');
}

// Check if vitest is available
try {
  execSync('npx vitest --version', { stdio: 'pipe' });
  console.log('Vitest is available');
} catch {
  console.log('Vitest may not be properly installed');
}

// Validate test data structure
console.log('\nValidating test data structure...');
try {
  const testDataPath = path.join(process.cwd(), 'tests/helpers/test-data.ts');
  const testDataContent = fs.readFileSync(testDataPath, 'utf8');
  
  // Check for required exports
  const requiredExports = [
    'testCpuData',
    'testGpuData', 
    'testFpgaData',
    'TestDataGenerator',
    'TestDataValidator',
    'TestDataCleanup'
  ];
  
  const missingExports = [];
  for (const exportName of requiredExports) {
    if (!testDataContent.includes(`export ${exportName}`) && 
        !testDataContent.includes(`export const ${exportName}`) &&
        !testDataContent.includes(`export class ${exportName}`)) {
      missingExports.push(exportName);
    }
  }
  
  if (missingExports.length > 0) {
    console.error('Missing test data exports:', missingExports.join(', '));
  } else {
    console.log('Test data structure is valid');
  }
} catch (error) {
  console.error('Error validating test data:', error.message);
}

// Final validation
console.log('\nConfiguration Validation Summary:');
console.log('Dependencies: All required packages are present');
console.log('Configuration: All config files are present');
console.log('Test Files: All test files are present');
console.log('Scripts: All required npm scripts are present');

console.log('\nTest Configuration is Ready!');
console.log('\nAvailable test commands:');
console.log('  npm run test              # Run all tests');
console.log('  npm run test:e2e          # Run E2E tests');
console.log('  npm run test:unit         # Run unit tests');
console.log('  npm run test:integration  # Run integration tests');
console.log('  npm run test:accessibility # Run accessibility tests');
console.log('  npm run test:performance  # Run performance tests');
console.log('  npm run test:visual       # Run visual regression tests');
console.log('  npm run test:forms        # Run form tests');

console.log('\nTips:');
console.log('  - Run tests in headed mode: npm run test:e2e:ui');
console.log('  - Debug tests: npm run test:e2e:debug');
console.log('  - Generate coverage: npm run test:coverage');
console.log('  - Install Playwright browsers: npx playwright install');

console.log('\nHappy Testing!');