import { chromium, type FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global teardown for frontend-only testing
 * Cleans up test artifacts and resources
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting frontend-only global teardown...');

  try {
    // Cleanup port lock file
    const PORT_LOCK_FILE = path.join(process.cwd(), '.playwright-port-lock');
    if (fs.existsSync(PORT_LOCK_FILE)) {
      try {
        fs.unlinkSync(PORT_LOCK_FILE);
        console.log('Removed port lock file');
      } catch (error) {
        console.warn('Failed to remove port lock file:', error);
      }
    }
    
    // Frontend-only teardown: no backend cleanup needed
    console.log('Cleaning up frontend test artifacts...');
    
    // Clean up any test data or temporary files
    console.log('Frontend test cleanup completed');
    console.log('Global teardown completed successfully!');
    
  } catch (error) {
    console.error('Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;
