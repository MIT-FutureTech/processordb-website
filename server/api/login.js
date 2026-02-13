// /* eslint-disable no-undef */
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // Skip only during actual prerender (build-time), not at runtime
  // process.env.NITRO_PRERENDER can persist at runtime, so only check import.meta.prerender
  if (import.meta.prerender) {
    console.log('[Login API] Skipping during build/prerender')
    throw createError({
      statusCode: 503,
      message: 'Service unavailable during build'
    })
  }

  // Check if authentication is enabled
  const config = useRuntimeConfig();
  if (!config.public.enableAuth) {
    throw createError({
      statusCode: 403,
      message: 'Authentication is currently disabled'
    })
  }

  try {
    const body = await readBody(event)
    
    // Get backend URL and ensure proper formatting
    let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
    // Remove trailing slash
    backendUrl = backendUrl.replace(/\/$/, '')
    // If backendUrl already includes /api, use it as-is; otherwise add /api
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
    const url = `${backendUrl}${apiPrefix}/auth/login`
    console.log(`[Login API] Fetching from backend: ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Login API] Backend error: ${response.status} - ${errorText}`)
      throw createError({
        statusCode: response.status,
        message: errorText || 'Login failed'
      })
    }
    
    const data = await response.json()
    console.log(`[Login API] Login successful`)
    return data
  } catch (error) {
    console.error('[Login API] Error:', error)
    if (error.statusCode) {
      throw error // Re-throw createError
    }
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to process login'
    })
  }
})