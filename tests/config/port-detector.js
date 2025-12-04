/**
 * Port detection utility for Playwright tests
 * Handles automatic port detection to avoid conflicts
 */

import { getPort } from 'get-port-please';

let cachedPort = null;

/**
 * Get an available port for the web server
 * Caches the result to ensure consistency across test runs
 */
export async function getAvailablePort() {
  if (cachedPort) {
    return cachedPort;
  }
  
  // Try to get port 3000, but fallback to any available port in range 3000-3100
  const port = await getPort({ 
    port: 3000, 
    portRange: [3000, 3100],
    random: false // Try ports sequentially
  });
  
  cachedPort = port;
  return port;
}

/**
 * Reset cached port (useful for testing)
 */
export function resetPortCache() {
  cachedPort = null;
}



