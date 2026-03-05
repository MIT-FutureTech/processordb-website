// Server plugin to debug runtime config at startup
export default defineNitroPlugin((nitroApp) => {
  
  // Also log to console for immediate visibility
  console.log('[Runtime Config Debug] Server startup env vars:', {
    BACKEND_URL: process.env.BACKEND_URL || 'NOT_SET',
    NUXT_PUBLIC_BACKEND_URL: process.env.NUXT_PUBLIC_BACKEND_URL || 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
  })
})
