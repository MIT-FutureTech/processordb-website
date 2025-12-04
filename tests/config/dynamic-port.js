/**
 * Dynamic port detection for Playwright webServer
 * Handles cases where Nuxt automatically finds an available port
 */

import { spawn } from 'child_process';
import { createServer } from 'http';

/**
 * Find an available port starting from the preferred port
 */
function findAvailablePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Try next port
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Start the dev server and detect the actual port used
 */
function startDevServerWithPortDetection() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting dev server with port detection...');
    
    const child = spawn('npm', ['run', 'dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    let serverUrl = null;
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`[DevServer] ${text.trim()}`);
      
      // Look for the server URL in the output
      const urlMatch = text.match(/Local:\s*http:\/\/localhost:(\d+)/);
      if (urlMatch && !serverUrl) {
        const port = urlMatch[1];
        serverUrl = `http://localhost:${port}`;
        console.log(`✅ Detected server running on: ${serverUrl}`);
        resolve({ url: serverUrl, process: child });
      }
    });
    
    child.stderr.on('data', (data) => {
      const text = data.toString();
      console.log(`[DevServer Error] ${text.trim()}`);
    });
    
    child.on('error', (error) => {
      console.error('❌ Failed to start dev server:', error);
      reject(error);
    });
    
    // Timeout after 5 minutes
    setTimeout(() => {
      if (!serverUrl) {
        child.kill();
        reject(new Error('Timeout waiting for dev server to start'));
      }
    }, 300000);
  });
}

export { findAvailablePort, startDevServerWithPortDetection };
