/**
 * Centralized success message handler for form operations
 * Uses message constants from formMessages.js
 */

import { MESSAGES, formatMessage, getMessageByCode } from './formMessages.js'

/**
 * Get success message for entity operation
 * @param {string} entityType - Entity type (cpu, gpu, fpga, soc, core, benchmark, economic, processor, suggestion, user)
 * @param {string} operation - Operation type (create, update, delete)
 * @param {object} options - Additional options
 * @param {string|number} options.id - Entity ID
 * @param {string} options.name - Entity name (for processor association)
 * @param {string} options.type - Entity type (for processor disassociation)
 * @returns {object} Structured success object
 */
export function getSuccessMessage(entityType, operation, options = {}) {
  const entityUpper = entityType.toUpperCase()
  const operationUpper = operation.toUpperCase()
  const messageCode = `${entityUpper}_${operationUpper}_SUCCESS`

  let messageObj = getMessageByCode(messageCode)

  // If not found, try generic patterns
  if (!messageObj) {
    // For suggestions, use specific codes
    if (entityType === 'suggestion') {
      if (options.suggestionType === 'core') {
        messageCode = operation === 'delete' ? 'SUGGESTION_CORE_DELETE_SUBMIT_SUCCESS' : 'SUGGESTION_CORE_SUBMIT_SUCCESS'
      } else if (options.suggestionType === 'benchmark') {
        messageCode = operation === 'delete' ? 'SUGGESTION_BENCHMARK_DELETE_SUBMIT_SUCCESS' : 'SUGGESTION_BENCHMARK_SUBMIT_SUCCESS'
      } else if (options.suggestionType === 'economic') {
        messageCode = operation === 'delete' ? 'SUGGESTION_ECONOMIC_DELETE_SUBMIT_SUCCESS' : 'SUGGESTION_ECONOMIC_SUBMIT_SUCCESS'
      } else if (options.suggestionType === 'processor_association') {
        messageCode = 'SUGGESTION_PROCESSOR_ASSOCIATION_SUBMIT_SUCCESS'
      } else if (options.suggestionType === 'processor_disassociation') {
        messageCode = 'SUGGESTION_PROCESSOR_DISASSOCIATION_SUBMIT_SUCCESS'
      } else {
        messageCode = 'SUGGESTION_SUBMIT_SUCCESS'
      }
      messageObj = getMessageByCode(messageCode) || MESSAGES.SUCCESS.SUGGESTION_SUBMIT_SUCCESS
    } else {
      // Fallback to generic success
      messageObj = {
        code: messageCode,
        template: `${entityType} ${operation} successfully!`,
        type: operation,
        entity: entityType
      }
    }
  }

  // Format message with dynamic values
  const values = {}
  if (options.id) values.id = options.id
  if (options.name) values.name = options.name
  if (options.type) values.type = options.type

  const userMessage = formatMessage(messageObj.template, values)

  return {
    code: messageObj.code,
    message: userMessage,
    type: messageObj.type || operation,
    entity: messageObj.entity || entityType,
    id: options.id || null,
    nextSteps: getNextSteps(entityType, operation, options)
  }
}

/**
 * Get next steps hint for success message
 * @param {string} entityType - Entity type
 * @param {string} operation - Operation type
 * @param {object} options - Additional options
 * @returns {string} Next steps message
 */
function getNextSteps(entityType, operation, options) {
  if (operation === 'create') {
    if (entityType === 'cpu' || entityType === 'gpu' || entityType === 'fpga') {
      return 'Redirecting to detail page...'
    } else if (entityType === 'soc') {
      return 'You can now add processors, benchmarks, and economic data.'
    } else if (entityType === 'suggestion') {
      return 'It will be reviewed by an admin or editor.'
    } else if (entityType === 'user') {
      return 'Redirecting to login page...'
    }
  } else if (operation === 'update') {
    return 'Changes have been saved.'
  } else if (operation === 'delete') {
    return 'The item has been removed.'
  }
  return ''
}
