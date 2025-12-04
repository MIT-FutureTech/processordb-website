import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // Skip only during actual prerender (build-time), not at runtime
  // process.env.NITRO_PRERENDER can persist at runtime, so only check import.meta.prerender
  if (import.meta.prerender) {
    console.log('[Subscribe API] Skipping during build/prerender')
    throw createError({
      statusCode: 503,
      message: 'Service unavailable during build'
    })
  }

  try {
    const body = await readBody(event)
    const { email } = body
    
    // Validate email
    if (!email || !email.includes('@')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid email address is required'
      })
    }
    
    // Forward to backend API
    let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
    // Remove trailing slash
    backendUrl = backendUrl.replace(/\/$/, '')
    // If backendUrl already includes /api, use it as-is; otherwise add /api
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
    const url = `${backendUrl}${apiPrefix}/subscribe`
    console.log(`[Subscribe API] Fetching from backend: ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw createError({
        statusCode: response.status,
        statusMessage: errorData.error || 'Failed to process subscription'
      })
    }
    
    const data = await response.json()
    return data
    
  } catch (error) {
    console.error('Error in subscribe endpoint:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to process subscription'
    })
  }
})
