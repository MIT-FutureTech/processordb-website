export default defineNitroPlugin((nitroApp) => {
  console.log('[Static Assets Plugin] Plugin loaded')
  
  // Use ready hook to set up static file serving
  nitroApp.hooks.hook('ready', async () => {
    console.log('[Static Assets Plugin] Server ready, setting up static asset serving')
  })
  
  // Intercept requests using the request hook
  nitroApp.hooks.hook('request', async (event) => {
    const url = event.node.req.url || ''
    
    // Only handle /_nuxt/* requests
    if (!url.startsWith('/_nuxt/')) {
      return
    }

    console.log('[Static Assets Plugin] Intercepting request:', url)

    const { stat } = await import('fs/promises')
    const { join } = await import('path')
    const { createReadStream } = await import('fs')

    // Get the file path - remove /_nuxt/ prefix
    const filePath = url.replace('/_nuxt/', '')
    
    // In production, PM2 runs from the project root, not .output/
    // So we need to go to .output/public/_nuxt/ from the project root
    const outputPath = join(process.cwd(), '.output/public/_nuxt', filePath)
    
    console.log('[Static Assets Plugin] Looking for file at:', outputPath)
    
    try {
      // Check if file exists
      const stats = await stat(outputPath)
      if (!stats.isFile()) {
        console.log('[Static Assets Plugin] Path exists but is not a file')
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
      
      // Set appropriate headers
      setHeader(event, 'Content-Type', mimeType)
      setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
      
      // Return the file as a stream
      return sendStream(event, createReadStream(outputPath))
    } catch (error: any) {
      console.error('[Static Assets Plugin] Error:', error.message)
      console.error('[Static Assets Plugin] Error code:', error.code)
      return
    }
  })
})


