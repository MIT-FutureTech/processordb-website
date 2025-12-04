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
}
if (process.env.BACKEND_URL) {
  env.BACKEND_URL = process.env.BACKEND_URL
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