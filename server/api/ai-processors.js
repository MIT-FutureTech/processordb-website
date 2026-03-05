import { defineEventHandler, createError, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    // Skip only during actual prerender (build-time), not at runtime
    // process.env.NITRO_PRERENDER can persist at runtime, so only check import.meta.prerender
    if (import.meta.prerender) {
        console.log('[AI Processor API] Skipping during build/prerender')
        return { data: [], pagination: null }
    }

    try {
        // Get query parameters for pagination and search
        const query = getQuery(event)
        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || parseInt(query.pageSize) || 100
        const search = query.search || null

        // Check for cache-busting parameter (useful for tests)
        const forceRefresh = query.refresh === 'true' || query.nocache === 'true'
        
        // Set HTTP cache headers
        if (forceRefresh) {
            // Disable caching for force refresh requests
            event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            event.node.res.setHeader('Pragma', 'no-cache')
            event.node.res.setHeader('Expires', '0')
            console.log(`[AI Processor API] Cache bypass requested for page=${page}, limit=${limit}, search=${search}`)
        } else {
            // Enable HTTP caching - 30 minutes (1800 seconds)
            event.node.res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800')
            event.node.res.setHeader('Vary', 'Accept')
        }

        // If no cached data, fetch from backend
        let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
        // Remove trailing slash
        backendUrl = backendUrl.replace(/\/$/, '')
        // If backendUrl already includes /api, use it as-is; otherwise add /api
        const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
        const url = `${backendUrl}${apiPrefix}/ai-processors?page=${page}&limit=${limit}${searchParam}`
        
        console.log(`[AI Processor API] Fetching from backend: ${url}`, { page, limit, search });
        
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
        
        console.log(`[AI Processor API] Backend response status: ${response.status}`)
        
        clearTimeout(timeoutId)
        const fetchTime = Date.now() - fetchStartTime

        if (!response.ok) {
            console.error(`Backend API error: ${response.status} - ${response.statusText}`)
            throw new Error(`Backend API error: ${response.status} - ${response.statusText}`)
        }

        const parseStartTime = Date.now()
        const responseData = await response.json()
        const parseTime = Date.now() - parseStartTime
        
        // Handle standardized response format: { success: true, data: [...], pagination: {...}, meta: {...} }
        // Also handle legacy format for backward compatibility
        let data, pagination
        if (responseData.success !== undefined) {
          // Standardized format
          data = responseData.data || []
          pagination = responseData.pagination || null
        } else {
          // Legacy format - backward compatibility
          data = Array.isArray(responseData) ? responseData : (responseData.data || responseData)
          pagination = responseData.pagination || null
        }
        
        console.log(`[AI Processor API] Received ${Array.isArray(data) ? data.length : 0} AI Processors from backend`)
        if (pagination) {
            console.log(`[AI Processor API] Pagination info: totalCount=${pagination.totalCount}, totalPages=${pagination.totalPages}`)
        }

        const totalTime = Date.now() - fetchStartTime
        console.log(`[PERF] AI Processor fetch timings - Fetch: ${fetchTime}ms, Parse: ${parseTime}ms, Total: ${totalTime}ms`)

        // Return data with pagination if available (for backward compatibility, return data directly if no pagination)
        // HTTP caching is handled by browser/CDN via Cache-Control headers
        return pagination ? { data, pagination } : data
    } catch (error) {
        console.error('Error fetching AI Processors:', error)
        
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
            message: 'Failed to fetch AI Processors data'
        })
    }
})
