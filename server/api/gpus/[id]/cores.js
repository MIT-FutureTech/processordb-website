import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  if (import.meta.prerender) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not available during build'
    })
  }

  try {
    const gpuId = getRouterParam(event, 'id')
    const method = event.node.req.method

    if (!gpuId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'GPU ID is required'
      })
    }

    const config = useRuntimeConfig()
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '')
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
    const url = `${backendUrl}${apiPrefix}/gpus/${gpuId}/cores`

    // Get auth token from headers
    const authHeader = event.node.req.headers.authorization
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    if (authHeader) {
      options.headers['Authorization'] = authHeader
    }

    // Handle request body for POST/PUT
    if (method === 'POST' || method === 'PUT') {
      const body = await readBody(event)
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      const errorText = await response.text()
      throw createError({
        statusCode: response.status,
        statusMessage: `Backend API error: ${response.statusText}`
      })
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in cores API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch cores data'
    })
  }
})

