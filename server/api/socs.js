import { defineEventHandler, createError, getQuery } from 'h3'
import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        // Check if force refresh is requested
        const query = getQuery(event)
        const forceRefresh = query.refresh === 'true'
        
        // Initialize storage for caching
        const storage = useStorage()
        const cacheKey = 'socs-data'
        
        // Try to get data from cache first (unless force refresh)
        if (!forceRefresh) {
            const cachedData = await storage.getItem(cacheKey)
            if (cachedData) {
                console.log(`Cache HIT for ${cacheKey}`)
                return cachedData
            }
        } else {
            console.log(`Force refresh requested for ${cacheKey}`)
        }
        
        console.log(`Cache MISS for ${cacheKey}`)

        // If no cached data, fetch from backend
        const backendUrl = `${useRuntimeConfig().public.backendUrl}`
        const response = await fetch(`${backendUrl}/socs`)
        
        if (!response.ok) {
            console.error(`Backend API error: ${response.status} - ${response.statusText}`)
            throw new Error(`Backend API error: ${response.status} - ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Cache the data for 5 minutes (300 seconds) - shorter TTL for better responsiveness
        await storage.setItem(cacheKey, data, { ttl: 300 })
        
        console.log(`Cache SET for ${cacheKey} with TTL 300 seconds`)
        return data
    } catch (error) {
        console.error('Error fetching SoCs:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch SoCs data'
        })
    }
})
