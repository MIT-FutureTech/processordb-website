const { config } = require('dotenv')
const path = require('path')
const fs = require('fs')

// #region agent log
const logPath = path.join(__dirname, '..', '.cursor', 'debug.log')
const logEntry = {
  sessionId: 'debug-session',
  runId: 'ecosystem-config',
  hypothesisId: 'A',
  location: 'ecosystem.config.cjs:start',
  message: 'Ecosystem config loading',
  data: {
    hasBackendUrl: !!process.env.BACKEND_URL,
    hasNuxtPublicBackendUrl: !!process.env.NUXT_PUBLIC_BACKEND_URL,
    backendUrl: process.env.BACKEND_URL || 'NOT_SET',
    nuxtPublicBackendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'NOT_SET',
    envFileExists: fs.existsSync(path.join(__dirname, '.env'))
  },
  timestamp: Date.now()
}
fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n')
// #endregion

// Load .env file
config({ path: path.join(__dirname, '.env') })

// #region agent log
const logEntry2 = {
  sessionId: 'debug-session',
  runId: 'ecosystem-config',
  hypothesisId: 'A',
  location: 'ecosystem.config.cjs:after-dotenv',
  message: 'After dotenv load',
  data: {
    backendUrl: process.env.BACKEND_URL || 'NOT_SET',
    nuxtPublicBackendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'NOT_SET'
  },
  timestamp: Date.now()
}
fs.appendFileSync(logPath, JSON.stringify(logEntry2) + '\n')
// #endregion

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

// #region agent log
const logEntry3 = {
  sessionId: 'debug-session',
  runId: 'ecosystem-config',
  hypothesisId: 'A',
  location: 'ecosystem.config.cjs:final-env',
  message: 'Final env object for PM2',
  data: {
    envKeys: Object.keys(env),
    backendUrl: env.BACKEND_URL || 'NOT_SET',
    nuxtPublicBackendUrl: env.NUXT_PUBLIC_BACKEND_URL || 'NOT_SET'
  },
  timestamp: Date.now()
}
fs.appendFileSync(logPath, JSON.stringify(logEntry3) + '\n')
// #endregion

// Determine environment from multiple sources:
// 1. PM2_ENV (set by deploy script)
// 2. Check if running in production directory (contains 'processordb-website' but not 'staging')
// 3. NODE_ENV
// 4. Default to staging for backward compatibility
let environment = process.env.PM2_ENV

// If PM2_ENV not set, try to detect from directory path
if (!environment) {
  const cwd = process.cwd()
  if (cwd.includes('processordb-website') && !cwd.includes('staging')) {
    environment = 'production'
  } else if (cwd.includes('processordb-website-staging')) {
    environment = 'staging'
  }
}

// Fall back to NODE_ENV or default
environment = environment || process.env.NODE_ENV || 'staging'
const isProduction = environment === 'production' || environment === 'prod'

// Set app name and instance count based on environment
const appName = isProduction ? "ProcessorDB-website" : "ProcessorDB-website-staging"
// Production can use more instances, staging limited to 2 for resource constraints
const instanceCount = isProduction ? "max" : 2

module.exports = {
  apps : [{
    name: appName,
    port: "3000",
    exec_mode: "cluster",
    instances: instanceCount,
    max_memory_restart: "500M", // Restart if memory exceeds 500MB per instance
    script: "./.output/server/index.mjs",
    env: {
      NODE_ENV: isProduction ? "production" : "staging",
      ...env
    }
  }]
}