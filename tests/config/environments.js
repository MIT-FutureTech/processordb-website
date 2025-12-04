/**
 * Environment-specific test configuration
 * Handles different testing scenarios for dev, staging, and production
 */

import { getAvailablePort } from './port-detector.js';
import fs from 'fs';
import path from 'path';
import { acquireTestLock, releaseTestLock } from '../../../processordb-e2e/src/test-coordinator.js';

// Port detection strategy for parallel execution
let detectedPort = null;
const PORT_LOCK_FILE = path.join(process.cwd(), '.playwright-port-lock');

// Function to detect and lock a port for parallel execution
async function detectAndLockPort() {
  // Acquire test coordination lock for website tests
  const lockAcquired = await acquireTestLock('website');
  if (!lockAcquired) {
    console.warn('[COORDINATOR] Could not acquire test lock, using fallback port');
    detectedPort = 3000;
    return detectedPort;
  }
  
  // Check if port is already locked by another process
  if (fs.existsSync(PORT_LOCK_FILE)) {
    try {
      const lockData = JSON.parse(fs.readFileSync(PORT_LOCK_FILE, 'utf8'));
      const lockAge = Date.now() - lockData.timestamp;
      
      // If lock is older than 5 minutes, consider it stale and remove it
      if (lockAge > 5 * 60 * 1000) {
        fs.unlinkSync(PORT_LOCK_FILE);
      } else {
        // Use the locked port
        detectedPort = lockData.port;
        console.log(`Using locked port: ${detectedPort}`);
        return detectedPort;
      }
    } catch {
      // If lock file is corrupted, remove it
      fs.unlinkSync(PORT_LOCK_FILE);
    }
  }
  
  // Detect a new port and lock it
  try {
    detectedPort = await getAvailablePort();
    console.log(`Detected available port: ${detectedPort}`);
    
    // Create lock file
    fs.writeFileSync(PORT_LOCK_FILE, JSON.stringify({
      port: detectedPort,
      timestamp: Date.now(),
      pid: process.pid
    }));
    
    // Set environment variables
    process.env.PORT = detectedPort.toString();
    process.env.SITE_URL = `http://localhost:${detectedPort}`;
    console.log(`Set SITE_URL to: ${process.env.SITE_URL}`);
    
    return detectedPort;
  } catch (error) {
    console.warn('Failed to detect port, will use default:', error.message);
    detectedPort = 3000; // fallback
    return detectedPort;
  }
}

// Detect port only for development and CI environments
if (process.env.NODE_ENV === 'development' || process.env.CI === 'true') {
  await detectAndLockPort();
}

const environments = {
  development: {
    baseUrl: process.env.SITE_URL || 'http://localhost:3000',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
    timeout: 30000,
    retries: 0,
    workers: undefined,
    // Frontend server needed for testing with mocked APIs
    webServer: {
      enabled: true,
      command: 'npm run dev',
      url: process.env.SITE_URL || 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 600000 // 10 minutes to account for slow Nuxt compilation
    }
  },
  
  staging: {
    baseUrl: process.env.SITE_URL || 'https://staging.processordb.com',
    backendUrl: process.env.BACKEND_URL || 'https://staging-api.processordb.com',
    timeout: 60000,
    retries: 2,
    workers: 1,
    webServer: {
      enabled: false // Use existing staging server
    }
  },
  
  production: {
    baseUrl: process.env.SITE_URL || 'https://processordb.com',
    backendUrl: process.env.BACKEND_URL || 'https://api.processordb.com',
    timeout: 120000,
    retries: 3,
    workers: 1,
    webServer: {
      enabled: false // Use existing production server
    }
  },
  
  ci: {
    baseUrl: process.env.SITE_URL || 'http://localhost:3000',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
    timeout: 60000,
    retries: 2,
    workers: 1,
    webServer: {
      enabled: true,
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: false,
      // Dynamic port detection for CI
      port: undefined,
      timeout: 300000 // 5 minutes
    }
  }
};

/**
 * Get environment configuration based on NODE_ENV and CI status
 */
function getEnvironmentConfig() {
  const isCI = process.env.CI === 'true';
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  if (isCI) {
    return environments.ci;
  }
  
  return environments[nodeEnv] || environments.development;
}

/**
 * Get test configuration for Playwright
 */
function getPlaywrightConfig() {
  const config = getEnvironmentConfig();
  
  // Get an available port for webServer if enabled
  let webServerConfig = undefined;
  if (config.webServer.enabled) {
    // Use pre-detected port or environment variable PORT
    const port = detectedPort || process.env.PORT || 3000;
    const baseURL = `http://localhost:${port}`;
    
    console.log(`Using webServer URL: ${baseURL}`);
    
    // Use the detected port and let Nuxt handle the server startup
    webServerConfig = {
      command: config.webServer.command,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: config.webServer.timeout || 300 * 1000, // Use config timeout or default to 5 minutes
      ignoreHTTPSErrors: true,
      stdout: 'pipe',
      stderr: 'pipe',
      // Pass the detected port in environment variables
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(([, value]) => value !== undefined)
        ),
        PORT: port.toString(),
        NUXT_PORT: port.toString()
      }
    };
  }
  
  return {
    baseURL: detectedPort ? `http://localhost:${detectedPort}` : config.baseUrl,
    timeout: config.timeout,
    retries: config.retries,
    workers: config.workers,
    webServer: webServerConfig
  };
}

// Cleanup function to release test lock
function cleanupTestLock() {
  try {
    releaseTestLock('website');
    if (fs.existsSync(PORT_LOCK_FILE)) {
      fs.unlinkSync(PORT_LOCK_FILE);
    }
  } catch (error) {
    console.warn('Failed to cleanup test lock:', error.message);
  }
}

// Cleanup on process exit
process.on('exit', cleanupTestLock);
process.on('SIGINT', () => {
  cleanupTestLock();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanupTestLock();
  process.exit(0);
});

export {
  environments,
  getEnvironmentConfig,
  getPlaywrightConfig,
  cleanupTestLock
};
