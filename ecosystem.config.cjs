const { config } = require('dotenv')
const path = require('path')

// Load .env file
config({ path: path.join(__dirname, '.env') })

// Read environment variables from .env
const env = {}
if (process.env.DEPLOY_WEBHOOK_SECRET) {
  env.DEPLOY_WEBHOOK_SECRET = process.env.DEPLOY_WEBHOOK_SECRET
}
if (process.env.SITE_URL) {
  env.SITE_URL = process.env.SITE_URL
  // Also set NUXT_PUBLIC_SITE_URL for client-side access
  if (!process.env.NUXT_PUBLIC_SITE_URL) {
    env.NUXT_PUBLIC_SITE_URL = process.env.SITE_URL
  }
}
if (process.env.BACKEND_URL) {
  env.BACKEND_URL = process.env.BACKEND_URL
  // Also set NUXT_PUBLIC_BACKEND_URL for client-side access
  if (!process.env.NUXT_PUBLIC_BACKEND_URL) {
    env.NUXT_PUBLIC_BACKEND_URL = process.env.BACKEND_URL
  }
}

// Also check if NUXT_PUBLIC_* vars are explicitly set
if (process.env.NUXT_PUBLIC_SITE_URL) {
  env.NUXT_PUBLIC_SITE_URL = process.env.NUXT_PUBLIC_SITE_URL
}
if (process.env.NUXT_PUBLIC_BACKEND_URL) {
  env.NUXT_PUBLIC_BACKEND_URL = process.env.NUXT_PUBLIC_BACKEND_URL
}

module.exports = {
  apps : [{
    name: "ProcessorDB-website-staging",
    port: "3000",
    exec_mode: "cluster",
    instances: "max",
    script: "./.output/server/index.mjs",
    env: {
      NODE_ENV: "production",
      ...env
    }
  }]
}