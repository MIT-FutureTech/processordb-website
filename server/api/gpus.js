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
            console.log(`Cache HIT for ${cacheKey}`)
            return cachedData
        }
        
        console.log(`Cache MISS for ${cacheKey}`)

        // If no cached data, fetch from backend
        const backendUrl = `${useRuntimeConfig().public.backendUrl}` 
        const response = await fetch(`${backendUrl}/gpus`)
        
        if (!response.ok) {
            console.error(`Backend API error: ${response.status} - ${response.statusText}`)
            throw new Error(`Backend API error: ${response.status} - ${response.statusText}`)
        }
        
        const responseData = await response.json()
        
        // Extract just the data array for compatibility with existing components
        const data = responseData.data || responseData
        
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
