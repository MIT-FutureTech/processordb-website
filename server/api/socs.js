import { defineEventHandler, createError, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    // Skip only during actual prerender (build-time), not at runtime
    // process.env.NITRO_PRERENDER can persist at runtime, so only check import.meta.prerender
    if (import.meta.prerender) {
        console.log('[SoC API] Skipping during build/prerender')
        return { data: [], pagination: null }
    }

    try {
        // Get query parameters for pagination
        const query = getQuery(event)
        const page = parseInt(query.page) || 1
        const pageSize = parseInt(query.pageSize) || parseInt(query.limit) || 100

        // Check if force refresh is requested
        const forceRefresh = query.refresh === 'true' || query.nocache === 'true'
        
        // Set HTTP cache headers
        if (forceRefresh) {
            // Disable caching for force refresh requests
            event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            event.node.res.setHeader('Pragma', 'no-cache')
            event.node.res.setHeader('Expires', '0')
            console.log(`[SoC API] Cache bypass requested for page=${page}, pageSize=${pageSize}`)
        } else {
            // Enable HTTP caching - 5 minutes (300 seconds) for SoCs
            event.node.res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300')
            event.node.res.setHeader('Vary', 'Accept')
        }

        // If no cached data, fetch from backend
        let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
        // Remove trailing slash
        backendUrl = backendUrl.replace(/\/$/, '')
        // If backendUrl already includes /api, use it as-is; otherwise add /api
        const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
        // Forward pagination parameters to backend (backend expects pageSize, not limit)
        const url = `${backendUrl}${apiPrefix}/socs?page=${page}&pageSize=${pageSize}`
        console.log(`[SoC API] Fetching from backend: ${url}`)
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
            console.error(`Backend API error: ${response.status} - ${response.statusText}`)
            throw new Error(`Backend API error: ${response.status} - ${response.statusText}`)
        }
        
        const responseData = await response.json()
        
        // Handle response format - API returns { data: [...], pagination: {...} }
        const data = Array.isArray(responseData) ? responseData : (responseData.data || responseData)
        const pagination = responseData.pagination || null
        
        console.log(`[SoC API] Data fetched successfully - ${Array.isArray(data) ? data.length : 0} records`)
        if (pagination) {
            console.log(`[SoC API] Pagination info: totalRecords=${pagination.totalRecords}, totalPages=${pagination.totalPages}`)
        }
        
        // Return data with pagination if available (for backward compatibility, return data directly if no pagination)
        // HTTP caching is handled by browser/CDN via Cache-Control headers
        return pagination ? { data, pagination } : data
    } catch (error) {
        console.error('Error fetching SoCs:', error)
        
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
            message: 'Failed to fetch SoCs data'
        })
    }
})
