import { defineEventHandler, createError } from 'h3'

/**
 * Cache Invalidation Endpoint (Deprecated)
 * 
 * NOTE: This endpoint is deprecated since we switched to HTTP caching.
 * HTTP caching is handled by browsers/CDNs automatically via Cache-Control headers.
 * 
 * To force a cache refresh, use the refresh=true query parameter on API endpoints:
 * - GET /api/cpus?refresh=true
 * - GET /api/gpus?refresh=true
 * - etc.
 * 
 * This endpoint is kept for backward compatibility but does nothing.
 */
export default defineEventHandler(async (event) => {
  console.warn('[Cache Invalidate] This endpoint is deprecated. Use refresh=true query parameter instead.')
  
  return {
    success: true,
    message: 'Cache invalidation endpoint is deprecated. HTTP caching is now used. Use refresh=true query parameter to force refresh.',
    note: 'HTTP caching is handled automatically by browsers/CDNs via Cache-Control headers',
    timestamp: new Date().toISOString()
  }
})
