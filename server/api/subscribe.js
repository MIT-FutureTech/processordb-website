import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
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
    const backendUrl = useRuntimeConfig().public.backendUrl
    const response = await fetch(`${backendUrl}/api/subscribe`, {
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
