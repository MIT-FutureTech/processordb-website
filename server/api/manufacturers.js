import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
    // Skip only during actual prerender (build-time), not at runtime
    if (import.meta.prerender) {
        console.log('[Manufacturers API] Skipping during build/prerender')
        return []
    }

    try {
        // Fetch from backend
        let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
        // Remove trailing slash
        backendUrl = backendUrl.replace(/\/$/, '')
        // If backendUrl already includes /api, use it as-is; otherwise add /api
        const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
        const url = `${backendUrl}${apiPrefix}/manufacturers`
        
        console.log(`[Manufacturers API] Fetching from backend: ${url}`)
        
        // Performance timing
        const fetchStartTime = Date.now()
        // Add timeout to prevent hanging requests
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        const response = await fetch(url, {
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': 'application/json'
            },
            signal: controller.signal
        })
        
        console.log(`[Manufacturers API] Backend response status: ${response.status}`)
        
        clearTimeout(timeoutId)
        const fetchTime = Date.now() - fetchStartTime

        if (!response.ok) {
            console.error(`Backend API error: ${response.status} - ${response.statusText}`)
            throw new Error(`Backend API error: ${response.status} - ${response.statusText}`)
        }

        const parseStartTime = Date.now()
        const responseData = await response.json()
        const parseTime = Date.now() - parseStartTime
        
        console.log(`[Manufacturers API] Received ${Array.isArray(responseData) ? responseData.length : 0} manufacturers from backend`)

        const totalTime = Date.now() - fetchStartTime
        console.log(`[PERF] Manufacturers fetch timings - Fetch: ${fetchTime}ms, Parse: ${parseTime}ms, Total: ${totalTime}ms`)

        // Return data directly (manufacturers endpoint returns array)
        return responseData
    } catch (error) {
        console.error('Error fetching manufacturers:', error)
        
        // Handle timeout errors specifically
        if (error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('timeout')) {
            throw createError({
                statusCode: 504,
                message: 'Request timeout: Backend API did not respond in time'
            })
        }
        
        // Handle network errors
        if (error.message?.includes('fetch') || error.message?.includes('network')) {
            throw createError({
                statusCode: 503,
                message: 'Service unavailable: Unable to reach backend API'
            })
        }
        
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch manufacturers data'
        })
    }
})
