import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { spawn } from 'child_process'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  // Skip during prerender
  if (import.meta.prerender) {
    console.log('[Deploy API] Skipping during build/prerender')
    throw createError({
      statusCode: 503,
      message: 'Service unavailable during build'
    })
  }

  try {
    // Validate webhook secret
    const webhookSecret = getHeader(event, 'x-webhook-secret')
    const expectedSecret = process.env.DEPLOY_WEBHOOK_SECRET

    if (!expectedSecret) {
      console.error('[Deploy API] DEPLOY_WEBHOOK_SECRET not configured')
      throw createError({
        statusCode: 500,
        message: 'Deployment webhook secret not configured on server'
      })
    }

    if (!webhookSecret || webhookSecret !== expectedSecret) {
      console.error('[Deploy API] Invalid webhook secret')
      throw createError({
        statusCode: 401,
        message: 'Unauthorized: Invalid webhook secret'
      })
    }

    // Read payload
    const body = await readBody(event)
    const environment = body.environment || (body.branch === 'main' ? 'production' : 'staging')
    const branch = body.branch || (environment === 'production' ? 'main' : 'dev')

    console.log(`[Deploy API] Deployment triggered for ${environment} (${branch})`)
    console.log(`[Deploy API] Commit: ${body.commit || 'unknown'}`)
    console.log(`[Deploy API] Repository: ${body.repository || 'unknown'}`)

    // Get the path to the deployment script
    // The script should be in the scripts directory relative to the project root
    const scriptPath = join(process.cwd(), 'scripts', 'deploy.sh')
    
    // Verify script exists
    if (!existsSync(scriptPath)) {
      console.error(`[Deploy API] Deployment script not found at ${scriptPath}`)
      throw createError({
        statusCode: 500,
        message: 'Deployment script not found'
      })
    }

    // Execute deployment script asynchronously
    // This allows the webhook to return immediately while deployment runs in background
    const deployProcess = spawn('bash', [scriptPath, environment, branch], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        // Ensure PATH includes common locations
        PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin'
      }
    })

    // Log deployment script output
    deployProcess.stdout.on('data', (data) => {
      console.log(`[Deploy Script] ${data.toString().trim()}`)
    })

    deployProcess.stderr.on('data', (data) => {
      console.error(`[Deploy Script Error] ${data.toString().trim()}`)
    })

    deployProcess.on('error', (error) => {
      console.error(`[Deploy API] Failed to start deployment script: ${error.message}`)
    })

    deployProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(`[Deploy API] Deployment script completed successfully for ${environment}`)
      } else {
        console.error(`[Deploy API] Deployment script exited with code ${code}`)
      }
    })

    // Don't wait for the process - return immediately
    // The deployment will continue in the background
    deployProcess.unref()

    // Return success response immediately
    return {
      success: true,
      message: `Deployment triggered for ${environment}`,
      environment,
      branch,
      commit: body.commit,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Deploy API] Error:', error)
    
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Otherwise, wrap it
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal server error during deployment'
    })
  }
})

