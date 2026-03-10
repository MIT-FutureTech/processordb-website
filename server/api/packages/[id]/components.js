import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
    if (import.meta.prerender) {
        console.log('[Package Components API] Skipping during build/prerender')
        throw createError({
            statusCode: 404,
            statusMessage: 'Not available during build'
        })
    }

    try {
        const packageId = getRouterParam(event, 'id')
        
        if (!packageId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Package ID is required'
            })
        }

        // Only allow POST method
        if (event.node.req.method !== 'POST') {
            throw createError({
                statusCode: 405,
                statusMessage: 'Method not allowed'
            })
        }

        const body = await readBody(event)
        
        const config = useRuntimeConfig()
        let backendUrl = config.public.backendUrl || 'http://localhost:3001'
        backendUrl = backendUrl.replace(/\/$/, '')
        const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
        const url = `${backendUrl}${apiPrefix}/packages/${packageId}/components`
        
        console.log(`[Package Components API] POST to backend: ${url}`)
        
        // Get authorization header from request
        const authHeader = event.node.req.headers.authorization || event.node.req.headers.Authorization
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader })
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`[Package Components API] Backend error: ${response.status} - ${errorText}`)
            let errorData
            try {
                errorData = JSON.parse(errorText)
            } catch {
                errorData = { error: errorText || 'Failed to add component' }
            }
            throw createError({
                statusCode: response.status,
                statusMessage: errorData.error || errorData.message || 'Failed to add component'
            })
        }

        const data = await response.json()
        console.log(`[Package Components API] Component added successfully`)
        return data
    } catch (error) {
        console.error('[Package Components API] Error:', error)
        if (error.statusCode) {
            throw error // Re-throw createError
        }
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to process request'
        })
    }
})
