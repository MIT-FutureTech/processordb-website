import { defineEventHandler, createError, getRouterParam, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    if (import.meta.prerender) {
        console.log('[Package Component API] Skipping during build/prerender')
        throw createError({
            statusCode: 404,
            statusMessage: 'Not available during build'
        })
    }

    try {
        const packageId = getRouterParam(event, 'id')
        const componentId = getRouterParam(event, 'componentId')
        const query = getQuery(event)
        const componentType = query.component_type
        
        if (!packageId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Package ID is required'
            })
        }

        if (!componentId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Component ID is required'
            })
        }

        // Only allow DELETE method
        if (event.node.req.method !== 'DELETE') {
            throw createError({
                statusCode: 405,
                statusMessage: 'Method not allowed'
            })
        }

        const config = useRuntimeConfig()
        let backendUrl = config.public.backendUrl || 'http://localhost:3001'
        backendUrl = backendUrl.replace(/\/$/, '')
        const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
        const url = `${backendUrl}${apiPrefix}/packages/${packageId}/components/${componentId}${componentType ? `?component_type=${componentType}` : ''}`
        
        console.log(`[Package Component API] DELETE from backend: ${url}`)
        
        // Get authorization header from request
        const authHeader = event.node.req.headers.authorization || event.node.req.headers.Authorization
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader })
            }
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`[Package Component API] Backend error: ${response.status} - ${errorText}`)
            let errorData
            try {
                errorData = JSON.parse(errorText)
            } catch {
                errorData = { error: errorText || 'Failed to remove component' }
            }
            throw createError({
                statusCode: response.status,
                statusMessage: errorData.error || errorData.message || 'Failed to remove component'
            })
        }

        const data = await response.json()
        console.log(`[Package Component API] Component removed successfully`)
        return data
    } catch (error) {
        console.error('[Package Component API] Error:', error)
        if (error.statusCode) {
            throw error // Re-throw createError
        }
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to process request'
        })
    }
})
