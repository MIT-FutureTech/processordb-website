import { defineEventHandler, createError } from 'h3'
import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        // Initialize storage for caching
        const storage = useStorage()
        const cacheKey = 'cpus-data'

        // Try to get data from cache first
        const cachedData = await storage.getItem(cacheKey)
        if (cachedData) {
            return cachedData
        }

        // If no cached data, fetch from backend
        const backendUrl = `${useRuntimeConfig().public.backendUrl}`
        const response = await fetch(`${backendUrl}/cpus`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Cache the data for 1 hour (3600 seconds)
        await storage.setItem(cacheKey, data, { ttl: 300 })

        return data
    } catch (error) {
        console.error('Error fetching CPUs:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch CPUs data'
        })
    }
})
