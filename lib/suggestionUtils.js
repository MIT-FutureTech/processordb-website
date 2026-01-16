/**
 * Utility functions for submitting suggestions
 */
import { getItemWithExpiry } from './encrypter.js';

/**
 * Get authentication token from storage
 * @returns {string|null} JWT token or null
 */
function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = getItemWithExpiry('encryptedJWTPDB');
    return token;
  } catch (error) {
    console.error('[Suggestion Utils] Error getting auth token:', error);
    return null;
  }
}

/**
 * Submit a suggestion to the backend
 * @param {string} entityType - Type of entity (cpu, gpu, fpga, soc, manufacturer, ai-processor)
 * @param {number|null} entityId - ID of existing entity (null for new entries)
 * @param {object} data - The suggestion data (same format as direct create/update)
 * @param {string|null} note - Optional note explaining the suggestion
 * @returns {Promise<object>} Response from the API
 */
export async function submitSuggestion(entityType, entityId, data, note = null) {
  console.log('[Suggestion Utils] Submitting suggestion', { 
    entityType, 
    entityId, 
    hasNote: !!note 
  });

  try {
    // Get auth token
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated. Please log in.');
    }

    // Get backend URL - handle both client and server side
    let backendUrl = 'http://localhost:3001';
    if (typeof window !== 'undefined') {
      // Client side - use runtime config if available
      const config = useRuntimeConfig?.();
      backendUrl = config?.public?.backendUrl || backendUrl;
    } else if (typeof useRuntimeConfig !== 'undefined') {
      // Server side
      const config = useRuntimeConfig();
      backendUrl = config.public.backendUrl || backendUrl;
    }
    
    backendUrl = backendUrl.replace(/\/$/, '');
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
    const url = `${backendUrl}${apiPrefix}/suggestions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        entity_type: entityType,
        entity_id: entityId,
        suggestion_data: data,
        suggestion_note: note,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Suggestion submission failed' };
      }
      
      console.error('[Suggestion Utils] Suggestion submission failed', { 
        entityType, 
        entityId, 
        error: errorData.error || errorData.message 
      });
      throw new Error(errorData.error || errorData.message || 'Suggestion submission failed');
    }

    const result = await response.json();
    console.log('[Suggestion Utils] Suggestion submitted successfully', { 
      entityType, 
      entityId,
      suggestionId: result.data?.suggestion_id 
    });
    
    return result;
  } catch (error) {
    console.error('[Suggestion Utils] Suggestion submission error', { 
      entityType, 
      entityId, 
      error: error.message 
    });
    throw error;
  }
}
