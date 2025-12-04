#!/usr/bin/env node

/**
 * Frontend Service Test Runner
 * Runs comprehensive tests for the frontend service in isolation
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  testTimeout: 300000, // 5 minutes
  parallel: true,
  services: {
    frontend: {
      port: process.env.FRONTEND_PORT || 3000,
      healthEndpoint: '/health'
    },
    api: {
      port: process.env.API_PORT || 3001,
      healthEndpoint: '/health'
    }
  }
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(title, 'bright');
  log('='.repeat(60), 'cyan');
}

// Setup test environment
async function setupTestEnvironment() {
  logSection('Setting up Frontend Service Test Environment');
  
  try {
    // Set default environment variables
    process.env.NODE_ENV = process.env.NODE_ENV || 'test';
    process.env.FRONTEND_PORT = process.env.FRONTEND_PORT || '3000';
    process.env.BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
    process.env.SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

    log('[SUCCESS] Environment variables configured', 'green');
    log(`[INFO] Frontend URL: ${process.env.SITE_URL}`, 'yellow');
    log(`[INFO] Backend URL: ${process.env.BACKEND_URL}`, 'yellow');
    
    log('[SUCCESS] Test environment setup complete', 'green');
  } catch (error) {
    log(`[ERROR] Test environment setup failed: ${error.message}`, 'red');
    throw error;
  }
}

// Start frontend service
async function startFrontendService() {
  return new Promise((resolve, reject) => {
    logSection('Starting Frontend Service');
    
    const frontendProcess = spawn('node', ['node_modules/.bin/nuxt', 'dev'], {
      cwd: join(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    frontendProcess.stdout.on('data', (data) => {
      const message = data.toString();
      output += message;
      if (message.includes('Local:') || message.includes('ready')) {
        log('[SUCCESS] Frontend service started', 'green');
        resolve({ process: frontendProcess, output, errorOutput });
      }
    });

    frontendProcess.stderr.on('data', (data) => {
      const message = data.toString();
      errorOutput += message;
      log(`[FRONTEND] ${message.trim()}`, 'yellow');
    });

    frontendProcess.on('error', (error) => {
      log(`[ERROR] Failed to start frontend service: ${error.message}`, 'red');
      reject(error);
    });

    // Timeout handling
    setTimeout(() => {
      frontendProcess.kill();
      log('[ERROR] Frontend service startup timed out', 'red');
      reject(new Error('Frontend service startup timeout'));
    }, 60000);
  });
}

// Health check for frontend service
async function healthCheck() {
  const maxRetries = 30;
  const retryDelay = 2000;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`http://localhost:${config.services.frontend.port}`);
      if (response.ok) {
        log('[SUCCESS] Frontend service health check passed', 'green');
        return true;
      }
    } catch {
      // Service not ready yet
    }
    
    if (i < maxRetries - 1) {
      log(`[INFO] Health check attempt ${i + 1}/${maxRetries}, retrying in ${retryDelay}ms...`, 'yellow');
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw new Error('Frontend service health check failed');
}

// Run unit tests
async function runUnitTests() {
  return new Promise((resolve) => {
    logSection('Running Unit Tests');
    
    const testProcess = spawn('npm', ['run', 'test:unit'], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    testProcess.stdout.on('data', (data) => {
      const message = data.toString();
      output += message;
      process.stdout.write(message);
    });

    testProcess.stderr.on('data', (data) => {
      const message = data.toString();
      errorOutput += message;
      process.stderr.write(message);
    });

    testProcess.on('close', (code) => {
      const passed = code === 0;
      log(`\n[${passed ? 'SUCCESS' : 'ERROR'}] Unit tests ${passed ? 'passed' : 'failed'}`, passed ? 'green' : 'red');
      resolve({ passed, output, errorOutput });
    });

    // Timeout handling
    setTimeout(() => {
      testProcess.kill();
      log('[ERROR] Unit tests timed out', 'red');
      resolve({ passed: false, duration: config.testTimeout, output, errorOutput });
    }, config.testTimeout);
  });
}

// Run integration tests
async function runIntegrationTests() {
  return new Promise((resolve) => {
    logSection('Running Integration Tests');
    
    const testProcess = spawn('npm', ['run', 'test:integration'], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    testProcess.stdout.on('data', (data) => {
      const message = data.toString();
      output += message;
      process.stdout.write(message);
    });

    testProcess.stderr.on('data', (data) => {
      const message = data.toString();
      errorOutput += message;
      process.stderr.write(message);
    });

    testProcess.on('close', (code) => {
      const passed = code === 0;
      log(`\n[${passed ? 'SUCCESS' : 'ERROR'}] Integration tests ${passed ? 'passed' : 'failed'}`, passed ? 'green' : 'red');
      resolve({ passed, output, errorOutput });
    });

    // Timeout handling
    setTimeout(() => {
      testProcess.kill();
      log('[ERROR] Integration tests timed out', 'red');
      resolve({ passed: false, duration: config.testTimeout, output, errorOutput });
    }, config.testTimeout);
  });
}

// Run frontend service tests
async function runServiceTests() {
  return new Promise((resolve) => {
    logSection('Running Frontend Service Tests');
    
    const testProcess = spawn('npm', ['run', 'test:run'], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    testProcess.stdout.on('data', (data) => {
      const message = data.toString();
      output += message;
      process.stdout.write(message);
    });

    testProcess.stderr.on('data', (data) => {
      const message = data.toString();
      errorOutput += message;
      process.stderr.write(message);
    });

    testProcess.on('close', (code) => {
      const passed = code === 0;
      log(`\n[${passed ? 'SUCCESS' : 'ERROR'}] Frontend service tests ${passed ? 'passed' : 'failed'}`, passed ? 'green' : 'red');
      resolve({ passed, output, errorOutput });
    });

    // Timeout handling
    setTimeout(() => {
      testProcess.kill();
      log('[ERROR] Frontend service tests timed out', 'red');
      resolve({ passed: false, duration: config.testTimeout, output, errorOutput });
    }, config.testTimeout);
  });
}

// Cleanup test environment
async function cleanupTestEnvironment(frontendProcess) {
  logSection('Cleaning Up Test Environment');
  
  try {
    // Stop frontend service
    if (frontendProcess) {
      frontendProcess.kill();
      log('[SUCCESS] Frontend service stopped', 'green');
    }
    
    log('[SUCCESS] Test environment cleanup complete', 'green');
  } catch (error) {
    log(`[ERROR] Test environment cleanup failed: ${error.message}`, 'red');
  }
}

// Generate test report
function generateTestReport(results) {
  logSection('Frontend Service Test Results');
  
  log('Test Results:', 'bright');
  log(`  Unit Tests: ${results.unit.passed ? 'PASSED' : 'FAILED'}`, results.unit.passed ? 'green' : 'red');
  log(`  Integration Tests: ${results.integration.passed ? 'PASSED' : 'FAILED'}`, results.integration.passed ? 'green' : 'red');
  log(`  Service Tests: ${results.service.passed ? 'PASSED' : 'FAILED'}`, results.service.passed ? 'green' : 'red');
  
  const allPassed = results.unit.passed && results.integration.passed && results.service.passed;
  log(`\n[${allPassed ? 'SUCCESS' : 'ERROR'}] Frontend Service tests ${allPassed ? 'passed' : 'failed'}`, 
      allPassed ? 'green' : 'red');
  
  return allPassed;
}

// Main execution
async function main() {
  const startTime = Date.now();
  let frontendProcess = null;
  
  try {
    log('[START] Starting Frontend Service Test Suite', 'bright');
    log(`Test timeout: ${config.testTimeout}ms`, 'yellow');
    log(`Parallel execution: ${config.parallel}`, 'yellow');
    
    // Setup
    await setupTestEnvironment();
    
    // Start frontend service
    const { process } = await startFrontendService();
    frontendProcess = process;
    
    // Wait for service to be healthy
    await healthCheck();
    
    // Run tests
    const testPromises = [];
    
    if (config.parallel) {
      // Run tests in parallel
      testPromises.push(runUnitTests());
      testPromises.push(runIntegrationTests());
      testPromises.push(runServiceTests());
      
      const results = await Promise.all(testPromises);
      const [unitResults, integrationResults, serviceResults] = results;
      
      // Generate report
      const allPassed = generateTestReport({
        unit: unitResults,
        integration: integrationResults,
        service: serviceResults
      });
      
      const totalDuration = Date.now() - startTime;
      log(`\n[TIME] Total execution time: ${totalDuration}ms`, 'cyan');
      
      // Cleanup
      await cleanupTestEnvironment(frontendProcess);
      
      // Exit with appropriate code
      process.exit(allPassed ? 0 : 1);
    } else {
      // Run tests sequentially
      const unitResults = await runUnitTests();
      const integrationResults = await runIntegrationTests();
      const serviceResults = await runServiceTests();
      
      // Generate report
      const allPassed = generateTestReport({
        unit: unitResults,
        integration: integrationResults,
        service: serviceResults
      });
      
      const totalDuration = Date.now() - startTime;
      log(`\n[TIME] Total execution time: ${totalDuration}ms`, 'cyan');
      
      // Cleanup
      await cleanupTestEnvironment(frontendProcess);
      
      // Exit with appropriate code
      process.exit(allPassed ? 0 : 1);
    }
    
  } catch (error) {
    log(`\n[ERROR] Test execution failed: ${error.message}`, 'red');
    await cleanupTestEnvironment(frontendProcess);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log('Frontend Service Test Runner', 'bright');
  log('Usage: node test-service.js [options]', 'yellow');
  log('Options:', 'yellow');
  log('  --help, -h     Show this help message', 'yellow');
  log('  --no-parallel  Run tests sequentially', 'yellow');
  process.exit(0);
}

if (args.includes('--no-parallel')) {
  config.parallel = false;
}

// Run the tests
main().catch(error => {
  log(`[ERROR] Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
