import { defineEventHandler, createError, getRouterParam, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    // Skip only during actual prerender (build-time), not at runtime
    // process.env.NITRO_PRERENDER can persist at runtime, so only check import.meta.prerender
    if (import.meta.prerender) {
        console.log('[CPU API] Skipping during build/prerender')
        throw createError({
            statusCode: 404,
            statusMessage: 'Not available during build'
        })
    }

    try {
        const cpuId = getRouterParam(event, 'id')
        
        if (!cpuId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'CPU ID is required'
            })
        }

        // Check for cache-busting parameter
        const query = getQuery(event)
        const forceRefresh = query.refresh === 'true' || query.nocache === 'true'
        
        // Set HTTP cache headers
        if (forceRefresh) {
            // Disable caching for force refresh requests
            event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            event.node.res.setHeader('Pragma', 'no-cache')
            event.node.res.setHeader('Expires', '0')
            console.log(`[CPU API] Cache bypass requested for cpuId=${cpuId}`)
        } else {
            // Enable HTTP caching - 1 hour (3600 seconds) for individual items
            event.node.res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
            event.node.res.setHeader('Vary', 'Accept')
        }

        // Fetch from backend API
        let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
        // Remove trailing slash
        backendUrl = backendUrl.replace(/\/$/, '')
        // If backendUrl already includes /api, use it as-is; otherwise add /api
        const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
        const url = `${backendUrl}${apiPrefix}/cpus/${cpuId}`
        console.log(`[CPU API] Fetching from backend: ${url}`)
        
        // Add timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        })
        
        clearTimeout(timeoutId)

        if (!response.ok) {
            console.error(`Backend API error: ${response.status} - ${response.statusText}`)
            throw createError({
                statusCode: response.status,
                statusMessage: `Backend API error: ${response.statusText}`
            })
        }

        const data = await response.json()
        
        // HTTP caching is handled by browser/CDN via Cache-Control headers
        console.log(`[CPU API] CPU ${cpuId} fetched successfully`)
        return data
    } catch (error) {
        console.error('Error fetching CPU:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to fetch CPU data'
        })
    }
})
