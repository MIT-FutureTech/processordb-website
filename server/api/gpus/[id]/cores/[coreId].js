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
    const coreId = getRouterParam(event, 'coreId')
    const method = event.node.req.method

    if (!gpuId || !coreId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'GPU ID and Core ID are required'
      })
    }

    const config = useRuntimeConfig()
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '')
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
    const url = `${backendUrl}${apiPrefix}/gpus/${gpuId}/cores/${coreId}`

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

    if (method === 'PUT') {
      const body = await readBody(event)
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Backend API error: ${response.statusText}`
      })
    }

    if (method === 'DELETE') {
      return { success: true }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in core API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to process core request'
    })
  }
})

