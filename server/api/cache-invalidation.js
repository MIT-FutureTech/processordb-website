/**
 * Cache Invalidation Function (Deprecated)
 * 
 * NOTE: This function is deprecated since we switched to HTTP caching.
 * HTTP caching is handled by browsers/CDNs automatically via Cache-Control headers.
 * 
 * To force a cache refresh, use the refresh=true query parameter on API endpoints:
 * - GET /api/cpus?refresh=true
 * - GET /api/gpus?refresh=true
 * - etc.
 * 
 * This function is kept for backward compatibility but does nothing.
 */
export async function invalidateCache() {
  console.warn('[Cache Invalidate] This function is deprecated. HTTP caching is now used. Use refresh=true query parameter to force refresh.')
  return true
}
