import { defineEventHandler, createError, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    if (import.meta.prerender) {
        console.log('[SOC Chart Data API] Skipping during build/prerender')
        return { data: [], total: 0 }
    }

    try {
        const query = getQuery(event)
        const forceRefresh = query.refresh === 'true' || query.nocache === 'true'
        
        if (forceRefresh) {
            event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            event.node.res.setHeader('Pragma', 'no-cache')
            event.node.res.setHeader('Expires', '0')
        } else {
            event.node.res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300')
            event.node.res.setHeader('Vary', 'Accept')
        }

        let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
        backendUrl = backendUrl.replace(/\/$/, '')
        const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
        const url = `${backendUrl}${apiPrefix}/socs/chart-data${forceRefresh ? `?refresh=true&_t=${Date.now()}` : ''}`
        
        console.log(`[SOC Chart Data API] Fetching from backend: ${url}`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000)
        
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
            const errorText = await response.text()
            console.error(`[SOC Chart Data API] Backend error: ${response.status} - ${errorText}`)
            throw createError({
                statusCode: response.status,
                message: `Backend API error: ${response.statusText}`
            })
        }
        
        const data = await response.json()
        console.log(`[SOC Chart Data API] Data fetched successfully: ${data.total || data.data?.length || 0} records`)
        return data
    } catch (error) {
        console.error('[SOC Chart Data API] Error:', error)
        if (error.statusCode) {
            throw error
        }
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to fetch SOC chart data'
        })
    }
})

