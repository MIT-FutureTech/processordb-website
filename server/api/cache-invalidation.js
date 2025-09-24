import { useStorage } from '#imports'

export async function invalidateCache() {
  try {
    const storage = useStorage()
    
    // List of cache keys to invalidate
    const cacheKeys = [
      'cpus-data',
      'gpus-data', 
      'fpgas-data',
      'socs-data'
    ]
    
    // Remove all cached data
    for (const key of cacheKeys) {
      await storage.removeItem(key)
      console.log(`Cache invalidated for ${key}`)
    }
    
    return true
  } catch (error) {
    console.error('Error invalidating cache:', error)
    return false
  }
}
