/**
 * Centralized error handler for form operations
 * Uses message constants from formMessages.js
 */

import { MESSAGES, formatMessage, getMessageByCode } from './formMessages.js'

/**
 * Handle error from API response
 * @param {Response} response - Fetch response object
 * @param {string} entityType - Entity type (cpu, gpu, fpga, soc)
 * @param {string} operation - Operation type (create, update, delete)
 * @returns {object} Structured error object
 */
export async function handleApiError(response, entityType = '', operation = '') {
  let errorData = null
  try {
    errorData = await response.json()
  } catch {
    // If JSON parsing fails, use default error
  }

  const status = response.status
  const entityUpper = entityType.toUpperCase()
  const operationUpper = operation.toUpperCase()

  // Try to get specific error message
  let messageCode = null
  let messageTemplate = null

  // Check for specific error codes based on status and entity
  if (status === 400) {
    // Validation error
    if (errorData?.error) {
      // Check if error message contains field names
      const errorMsg = errorData.error.toLowerCase()
      if (errorMsg.includes('manufacturer')) {
        messageCode = `${entityUpper}_${operationUpper}_VALIDATION_MANUFACTURER_REQUIRED`
      } else if (errorMsg.includes('family') && entityType === 'cpu') {
        messageCode = `${entityUpper}_${operationUpper}_VALIDATION_FAMILY_REQUIRED`
      } else if (errorMsg.includes('variant') && entityType === 'gpu') {
        messageCode = `${entityUpper}_${operationUpper}_VALIDATION_VARIANT_REQUIRED`
      } else if (errorMsg.includes('generation') && entityType === 'fpga') {
        messageCode = `${entityUpper}_${operationUpper}_VALIDATION_GENERATION_REQUIRED`
      } else if (errorMsg.includes('model')) {
        messageCode = `${entityUpper}_${operationUpper}_VALIDATION_MODEL_REQUIRED`
      } else if (errorMsg.includes('name') && entityType === 'gpu') {
        messageCode = `${entityUpper}_${operationUpper}_VALIDATION_NAME_REQUIRED`
      } else if (errorMsg.includes('code') && entityType === 'soc') {
        messageCode = `${entityUpper}_${operationUpper}_VALIDATION_CODE_NAME_REQUIRED`
      } else {
        messageCode = `${entityUpper}_${operationUpper}_VALIDATION_REQUIRED_FIELDS`
      }
    } else {
      messageCode = `${entityUpper}_${operationUpper}_VALIDATION_REQUIRED_FIELDS`
    }
  } else if (status === 401) {
    messageCode = 'LOGIN_INVALID_CREDENTIALS'
  } else if (status === 403) {
    messageCode = 'GENERIC_SERVER_ERROR'
  } else if (status === 404) {
    messageCode = 'GENERIC_SERVER_ERROR'
  } else if (status >= 500) {
    messageCode = `${entityUpper}_${operationUpper}_SERVER_ERROR`
  } else {
    messageCode = `${entityUpper}_${operationUpper}_SERVER_ERROR`
  }

  const messageObj = getMessageByCode(messageCode)
  if (messageObj) {
    messageTemplate = messageObj.template
  } else {
    // Fallback to generic error
    messageTemplate = errorData?.error || errorData?.message || MESSAGES.ERROR.GENERIC_ERROR.template
  }

  // Replace placeholders if any
  const userMessage = formatMessage(messageTemplate, {
    message: errorData?.error || errorData?.message || ''
  })

  return {
    code: messageCode || 'GENERIC_ERROR',
    message: userMessage,
    type: messageObj?.type || 'server',
    field: messageObj?.field || null,
    status,
    originalError: errorData
  }
}

/**
 * Handle network error
 * @param {Error} error - Error object
 * @param {string} entityType - Entity type (cpu, gpu, fpga, soc)
 * @param {string} operation - Operation type (create, update, delete)
 * @returns {object} Structured error object
 */
export function handleNetworkError(error, entityType = '', operation = '') {
  const entityUpper = entityType.toUpperCase()
  const operationUpper = operation.toUpperCase()
  const messageCode = `${entityUpper}_${operationUpper}_NETWORK_ERROR`

  const messageObj = getMessageByCode(messageCode) || MESSAGES.ERROR.GENERIC_NETWORK_ERROR

  return {
    code: messageObj.code,
    message: messageObj.template,
    type: 'network',
    field: null,
    originalError: error
  }
}

/**
 * Handle timeout error
 * @param {string} entityType - Entity type (cpu, gpu, fpga, soc)
 * @param {string} operation - Operation type (create, update, delete)
 * @returns {object} Structured error object
 */
export function handleTimeoutError(entityType = '', operation = '') {
  const entityUpper = entityType.toUpperCase()
  const operationUpper = operation.toUpperCase()
  const messageCode = `${entityUpper}_${operationUpper}_TIMEOUT`

  const messageObj = getMessageByCode(messageCode) || MESSAGES.ERROR.GENERIC_TIMEOUT

  return {
    code: messageObj.code,
    message: messageObj.template,
    type: 'timeout',
    field: null,
    originalError: null
  }
}

/**
 * Handle JSON parsing error
 * @param {string} entityType - Entity type (cpu, gpu, fpga, soc)
 * @param {string} operation - Operation type (create, update, delete)
 * @returns {object} Structured error object
 */
export function handleJsonParseError(entityType = '', operation = '') {
  const entityUpper = entityType.toUpperCase()
  const operationUpper = operation.toUpperCase()
  const messageCode = `${entityUpper}_${operationUpper}_INVALID_RESPONSE`

  const messageObj = getMessageByCode(messageCode) || MESSAGES.ERROR.GENERIC_INVALID_RESPONSE

  return {
    code: messageObj.code,
    message: messageObj.template,
    type: 'server',
    field: null,
    originalError: null
  }
}

/**
 * Handle validation error
 * @param {string} messageCode - Message code from MESSAGES.ERROR or MESSAGES.VALIDATION
 * @param {object} values - Values to replace in template
 * @returns {object} Structured error object
 */
export function handleValidationError(messageCode, values = {}) {
  const messageObj = getMessageByCode(messageCode) || MESSAGES.ERROR.GENERIC_ERROR

  return {
    code: messageObj.code,
    message: formatMessage(messageObj.template, values),
    type: 'validation',
    field: messageObj.field || null,
    originalError: null
  }
}

/**
 * Handle generic error
 * @param {Error|string} error - Error object or message
 * @returns {object} Structured error object
 */
export function handleGenericError(error) {
  const errorMessage = error instanceof Error ? error.message : error

  return {
    code: 'GENERIC_ERROR',
    message: errorMessage || MESSAGES.ERROR.GENERIC_ERROR.template,
    type: 'server',
    field: null,
    originalError: error
  }
}
