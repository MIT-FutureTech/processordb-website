import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  // #region agent log
  const logData = {
    location: 'server/api/cpus/[id]/cores.js:3',
    message: 'Cores API route entry',
    data: {
      url: event.node.req.url,
      method: event.node.req.method,
      hasAuthHeader: !!event.node.req.headers.authorization,
      nodeEnv: process.env.NODE_ENV,
      isPrerender: import.meta.prerender
    },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'A'
  }
  try {
    await fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {})
  } catch {}
  // #endregion

  if (import.meta.prerender) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not available during build'
    })
  }

  try {
    const cpuId = getRouterParam(event, 'id')
    const method = event.node.req.method

    if (!cpuId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CPU ID is required'
      })
    }

    const config = useRuntimeConfig()
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '')
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
    const url = `${backendUrl}${apiPrefix}/cpus/${cpuId}/cores`

    // #region agent log
    const logData2 = {
      location: 'server/api/cpus/[id]/cores.js:26',
      message: 'Backend URL constructed',
      data: {
        cpuId,
        method,
        backendUrl: config.public.backendUrl,
        constructedUrl: url,
        apiPrefix,
        hasBackendUrl: !!config.public.backendUrl
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'B'
    }
    try {
      await fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData2)
      }).catch(() => {})
    } catch {}
    // #endregion

    // Get auth token from headers
    const authHeader = event.node.req.headers.authorization
    
    // #region agent log
    const logData3 = {
      location: 'server/api/cpus/[id]/cores.js:38',
      message: 'Auth header check',
      data: {
        hasAuthHeader: !!authHeader,
        authHeaderPrefix: authHeader ? authHeader.substring(0, 20) : null,
        method
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'C'
    }
    try {
      await fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData3)
      }).catch(() => {})
    } catch {}
    // #endregion

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

    // #region agent log
    const logData4 = {
      location: 'server/api/cpus/[id]/cores.js:60',
      message: 'Before backend fetch',
      data: {
        url,
        method,
        hasAuth: !!options.headers['Authorization'],
        hasBody: !!options.body
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'D'
    }
    try {
      await fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData4)
      }).catch(() => {})
    } catch {}
    // #endregion

    const response = await fetch(url, options)

    // #region agent log
    const logData5 = {
      location: 'server/api/cpus/[id]/cores.js:68',
      message: 'Backend response received',
      data: {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'E'
    }
    try {
      await fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData5)
      }).catch(() => {})
    } catch {}
    // #endregion

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
    // #region agent log
    const logData6 = {
      location: 'server/api/cpus/[id]/cores.js:85',
      message: 'Cores API error',
      data: {
        errorMessage: error.message,
        errorStatus: error.statusCode,
        errorStatusMessage: error.statusMessage,
        stack: error.stack?.substring(0, 200)
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'F'
    }
    try {
      await fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData6)
      }).catch(() => {})
    } catch {}
    // #endregion

    console.error('Error in cores API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch cores data'
    })
  }
})

