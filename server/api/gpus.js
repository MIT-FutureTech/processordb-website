import { defineEventHandler, createError } from 'h3'
import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        // Initialize storage for caching
        const storage = useStorage()
        const cacheKey = 'gpus-data'
        
        // Try to get data from cache first
        const cachedData = await storage.getItem(cacheKey)
        if (cachedData) {
            return cachedData
        }

        // If no cached data, fetch from backend
        const backendUrl = `${useRuntimeConfig().public.backendUrl}` || 'http://localhost:3001'  
        const response = await fetch(`${backendUrl}/gpus`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Cache the data for 1 hour (3600 seconds)
        await storage.setItem(cacheKey, data, { ttl: 3600 })
        
        return data
    } catch (error) {
        console.error('Error fetching GPUs:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch GPUs data'
        })
    }
})
