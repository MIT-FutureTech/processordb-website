export default defineNitroPlugin((nitroApp) => {
  console.log('[Static Assets Plugin] Plugin loaded')
  
  
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


