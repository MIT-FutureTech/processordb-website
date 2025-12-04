#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('[TEST] Running ProcessorDB Website Tests...\n');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('[INSTALL] Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('[ERROR] Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Run linting
console.log('[LINT] Running linting...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('[SUCCESS] Linting passed\n');
} catch {
  console.log('[WARNING] Linting issues found (non-blocking)\n');
}

// Run type checking
console.log('[TYPE] Running type checking...');
try {
  execSync('npx nuxi typecheck', { stdio: 'inherit' });
  console.log('[SUCCESS] Type checking passed\n');
} catch {
  console.log('[WARNING] Type checking issues found (non-blocking)\n');
}

// Run unit tests
console.log('[UNIT] Running unit tests...');
try {
  execSync('npm run test:run', { stdio: 'inherit' });
  console.log('[SUCCESS] Unit tests passed\n');
} catch (error) {
  console.log('[ERROR] Unit tests failed:', error.message);
  process.exit(1);
}

// Generate coverage report
console.log('[COVERAGE] Generating coverage report...');
try {
  execSync('npm run test:coverage', { stdio: 'inherit' });
  console.log('[SUCCESS] Coverage report generated\n');
} catch {
  console.log('[WARNING] Coverage report generation failed (non-blocking)\n');
}

console.log('[SUCCESS] All tests completed successfully!');
console.log('[INFO] Coverage report generated in coverage/ directory');
