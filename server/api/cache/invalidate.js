import { defineEventHandler, readBody, createError } from 'h3'
import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    console.log('Cache invalidation endpoint called');
    const body = await readBody(event)
    console.log('Cache invalidation request body:', body);
    const { cacheKey } = body || {}
    console.log('Cache invalidation cacheKey:', cacheKey);
    
    const storage = useStorage()
    
    if (cacheKey) {
      // Invalidate specific cache key
      await storage.removeItem(cacheKey)
      console.log(`Cache invalidated for specific key: ${cacheKey}`)
    } else {
      // Invalidate all cache keys
      const cacheKeys = [
        'cpus-data',
        'gpus-data', 
        'fpgas-data',
        'socs-data'
      ]
      
      for (const key of cacheKeys) {
        await storage.removeItem(key)
        console.log(`Cache invalidated for ${key}`)
      }
    }
    
    return {
      success: true,
      message: 'Cache invalidated successfully',
      cacheKey: cacheKey || 'all',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error in cache invalidation endpoint:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to invalidate cache'
    })
  }
})
