export default defineNitroPlugin((nitroApp) => {
  console.log('[Static Assets Plugin] Plugin loaded')
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:2',message:'Plugin loaded',data:{cwd:process.cwd(),__dirname:typeof __dirname!=='undefined'?__dirname:'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  // Use ready hook to set up static file serving
  nitroApp.hooks.hook('ready', async () => {
    console.log('[Static Assets Plugin] Server ready, setting up static asset serving')
    const { stat, readdir } = await import('fs/promises')
    const { join } = await import('path')
    const cwd = process.cwd()
    const expectedDir1 = join(cwd, '.output/public/_nuxt')
    const expectedDir2 = join(cwd, 'public/_nuxt')
    let dir1Exists = false
    let dir2Exists = false
    let fileCount1 = 0
    let fileCount2 = 0
    try {
      const stats1 = await stat(expectedDir1)
      dir1Exists = stats1.isDirectory()
      if (dir1Exists) {
        const files = await readdir(expectedDir1, { recursive: true, withFileTypes: true })
        fileCount1 = files.filter(f => f.isFile()).length
      }
    } catch (e) {}
    try {
      const stats2 = await stat(expectedDir2)
      dir2Exists = stats2.isDirectory()
      if (dir2Exists) {
        const files = await readdir(expectedDir2, { recursive: true, withFileTypes: true })
        fileCount2 = files.filter(f => f.isFile()).length
      }
    } catch (e) {}
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:8',message:'Server ready - checking assets directories',data:{cwd,expectedDir1,dir1Exists,fileCount1,expectedDir2,dir2Exists,fileCount2},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  })
  
  // Intercept requests using the request hook
  nitroApp.hooks.hook('request', async (event) => {
    const url = event.node.req.url || ''
    
    // Only handle /_nuxt/* requests
    if (!url.startsWith('/_nuxt/')) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:30',message:'Request not for /_nuxt/, skipping',data:{url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      return
    }

    console.log('[Static Assets Plugin] Intercepting request:', url)
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:30',message:'Request hook entered for /_nuxt/',data:{url,method:event.node.req.method,headersSent:event.node.res.headersSent,statusCode:event.node.res.statusCode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const { stat } = await import('fs/promises')
    const { join } = await import('path')
    const { createReadStream } = await import('fs')

    // Get the file path - remove /_nuxt/ prefix
    const filePath = url.replace('/_nuxt/', '')
    
    const cwd = process.cwd()
    // In preview mode, process.cwd() is already in .output directory
    // In production, PM2 runs from the project root, not .output/
    // So we need to detect which case we're in and adjust the path accordingly
    const outputPath = cwd.endsWith('.output') || cwd.includes('/.output') || cwd.includes('\\.output')
      ? join(cwd, 'public/_nuxt', filePath)
      : join(cwd, '.output/public/_nuxt', filePath)
    const expectedDir = cwd.endsWith('.output') || cwd.includes('/.output') || cwd.includes('\\.output')
      ? join(cwd, 'public/_nuxt')
      : join(cwd, '.output/public/_nuxt')
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:66',message:'Path construction',data:{url,filePath,cwd,outputPath,expectedDir,cwdIncludesOutput:cwd.includes('.output')},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    console.log('[Static Assets Plugin] Looking for file at:', outputPath)
    
    // #region agent log
    const { readdir } = await import('fs/promises')
    let dirExists = false
    let dirContents: string[] = []
    try {
      const dirStats = await stat(expectedDir)
      dirExists = dirStats.isDirectory()
      if (dirExists) {
        dirContents = await readdir(expectedDir)
      }
    } catch (e) {}
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:30',message:'File lookup attempt',data:{url,filePath,outputPath,cwd,expectedDir,dirExists,dirContents:dirContents.slice(0,10)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    try {
      // Check if file exists
      const stats = await stat(outputPath)
      if (!stats.isFile()) {
        console.log('[Static Assets Plugin] Path exists but is not a file')
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:73',message:'Path exists but not a file - returning early',data:{url,outputPath,headersSent:event.node.res.headersSent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        return // Let Nitro handle 404
      }
      
      console.log('[Static Assets Plugin] File found, serving...')
      
      // Determine MIME type based on extension
      let mimeType = 'application/octet-stream'
      if (outputPath.endsWith('.js')) {
        mimeType = 'application/javascript'
      } else if (outputPath.endsWith('.css')) {
        mimeType = 'text/css'
      }
      
      console.log('[Static Assets Plugin] MIME type:', mimeType)
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:76',message:'File found, setting headers',data:{url,outputPath,mimeType,headersSent:event.node.res.headersSent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Set appropriate headers
      setHeader(event, 'Content-Type', mimeType)
      setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:93',message:'Sending stream',data:{url,outputPath,mimeType,headersSent:event.node.res.headersSent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Return the file as a stream
      return sendStream(event, createReadStream(outputPath))
    } catch (error: any) {
      console.error('[Static Assets Plugin] Error:', error.message)
      console.error('[Static Assets Plugin] Error code:', error.code)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:94',message:'File lookup failed - returning early',data:{url,outputPath,error:error.message,errorCode:error.code,cwd,headersSent:event.node.res.headersSent,statusCode:event.node.res.statusCode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'static-assets.ts:100',message:'About to return - checking if response will be handled by Nitro',data:{url,headersSent:event.node.res.headersSent,hasHandled:event.handled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return
    }
  })
})


