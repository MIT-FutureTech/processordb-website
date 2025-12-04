export default defineEventHandler(async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'processordb-website',
    version: '1.0.0'
  }
})



