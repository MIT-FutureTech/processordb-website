import { defineEventHandler, createError, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    // Skip only during actual prerender (build-time), not at runtime
    // process.env.NITRO_PRERENDER can persist at runtime, so only check import.meta.prerender
    if (import.meta.prerender) {
        console.log('[FPGA API] Skipping during build/prerender')
        return { data: [], pagination: null }
    }

    try {
        // Get query parameters for pagination
        const query = getQuery(event)
        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || 100

        // Check for cache-busting parameter (useful for tests)
        const forceRefresh = query.refresh === 'true' || query.nocache === 'true'
        
        // Set HTTP cache headers
        if (forceRefresh) {
            // Disable caching for force refresh requests
            event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            event.node.res.setHeader('Pragma', 'no-cache')
            event.node.res.setHeader('Expires', '0')
            console.log(`[FPGA API] Cache bypass requested for page=${page}, limit=${limit}`)
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
        const url = `${backendUrl}${apiPrefix}/fpgas?page=${page}&pageSize=${limit}`
        
        console.log(`[FPGA API] Fetching from backend: ${url}`)
        
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
        
        console.log(`[FPGA API] Backend response status: ${response.status}`)
        
        clearTimeout(timeoutId)
        const fetchTime = Date.now() - fetchStartTime
        
        if (!response.ok) {
            console.error(`Backend API error: ${response.status} - ${response.statusText}`)
            throw new Error(`Backend API error: ${response.status} - ${response.statusText}`)
        }

        const parseStartTime = Date.now()
        const responseData = await response.json()
        const parseTime = Date.now() - parseStartTime
        
        // Handle response format:
        // - Paginated responses: { data: [...], pagination: {...} }
        // - Non-paginated responses: [...] (array directly)
        const data = Array.isArray(responseData) ? responseData : (responseData.data || responseData)
        const pagination = responseData.pagination || null
        
        console.log(`[FPGA API] Received ${Array.isArray(data) ? data.length : 0} FPGAs from backend`)
        if (pagination) {
            console.log(`[FPGA API] Pagination info: totalCount=${pagination.totalCount}, totalPages=${pagination.totalPages}`)
        }

        const totalTime = Date.now() - fetchStartTime
        console.log(`[PERF] FPGA fetch timings - Fetch: ${fetchTime}ms, Parse: ${parseTime}ms, Total: ${totalTime}ms`)

        // Return data with pagination if available (for backward compatibility, return data directly if no pagination)
        // HTTP caching is handled by browser/CDN via Cache-Control headers
        return pagination ? { data, pagination } : data
    } catch (error) {
        console.error('Error fetching FPGAs:', error)
        
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
            message: 'Failed to fetch FPGAs data'
        })
    }
})
