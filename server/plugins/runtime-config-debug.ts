// Server plugin to debug runtime config at startup
export default defineNitroPlugin((nitroApp) => {
  // #region agent log
  const logData = {
    location: 'server/plugins/runtime-config-debug.ts:startup',
    message: 'Server startup - runtime config check',
    data: {
      processEnvBackendUrl: process.env.BACKEND_URL || 'NOT_SET',
      processEnvNuxtPublicBackendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'NOT_SET',
      nodeEnv: process.env.NODE_ENV || 'NOT_SET'
    },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'server-startup',
    hypothesisId: 'D'
  }
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData)
  }).catch(() => {})
  // #endregion
  
  // Also log to console for immediate visibility
  console.log('[Runtime Config Debug] Server startup env vars:', {
    BACKEND_URL: process.env.BACKEND_URL || 'NOT_SET',
    NUXT_PUBLIC_BACKEND_URL: process.env.NUXT_PUBLIC_BACKEND_URL || 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
  })
})
