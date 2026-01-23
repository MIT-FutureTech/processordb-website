import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:3',message:'Route handler called',data:{method:event.node.req.method,url:event.node.req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // Skip only during actual prerender (build-time), not at runtime
  if (import.meta.prerender) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:6',message:'Prerender check - skipping',data:{prerender:import.meta.prerender},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    console.log('[Register API] Skipping during build/prerender')
    throw createError({
      statusCode: 503,
      message: 'Service unavailable during build'
    })
  }

  try {
    const body = await readBody(event)
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:18',message:'Request body parsed',data:{email:body?.email,username:body?.username,hasPassword:!!body?.password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    console.log('[Register API] Registration request received', { email: body.email })
    
    // Get backend URL and ensure proper formatting
    let backendUrl;
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:25',message:'Before useRuntimeConfig call',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:27',message:'After useRuntimeConfig call',data:{backendUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    } catch (configError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:30',message:'useRuntimeConfig error',data:{error:configError.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      throw configError;
    }
    // Remove trailing slash
    backendUrl = backendUrl.replace(/\/$/, '')
    // If backendUrl already includes /api, use it as-is; otherwise add /api
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
    const url = `${backendUrl}${apiPrefix}/auth/register`
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:36',message:'Before backend fetch',data:{url,backendUrl,apiPrefix},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    console.log(`[Register API] Fetching from backend: ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:48',message:'Backend response received',data:{status:response.status,ok:response.ok,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    if (!response.ok) {
      const errorText = await response.text()
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:52',message:'Backend error response',data:{status:response.status,errorText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error(`[Register API] Backend error: ${response.status} - ${errorText}`)
      throw createError({
        statusCode: response.status,
        message: errorText || 'Registration failed'
      })
    }
    
    const data = await response.json()
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:61',message:'Registration successful',data:{email:body.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.log(`[Register API] Registration successful`, { email: body.email })
    return data
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server/api/register.js:65',message:'Error caught in handler',data:{errorMessage:error.message,statusCode:error.statusCode,stack:error.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
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
