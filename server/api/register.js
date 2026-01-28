import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // Skip only during actual prerender (build-time), not at runtime
  if (import.meta.prerender) {
    console.log('[Register API] Skipping during build/prerender')
    throw createError({
      statusCode: 503,
      message: 'Service unavailable during build'
    })
  }

  try {
    const body = await readBody(event)
    
    console.log('[Register API] Registration request received', { email: body.email })
    
    // Get backend URL and ensure proper formatting
    let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
    // Remove trailing slash
    backendUrl = backendUrl.replace(/\/$/, '')
    // If backendUrl already includes /api, use it as-is; otherwise add /api
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
    const url = `${backendUrl}${apiPrefix}/auth/register`
    console.log(`[Register API] Fetching from backend: ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Register API] Backend error: ${response.status} - ${errorText}`)
      throw createError({
        statusCode: response.status,
        message: errorText || 'Registration failed'
      })
    }
    
    const data = await response.json()
    console.log(`[Register API] Registration successful`, { email: body.email })
    return data
  } catch (error) {
    console.error('[Register API] Error:', error)
    if (error.statusCode) {
      throw error // Re-throw createError
    }
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to process registration'
    })
  }
})
