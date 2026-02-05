/**
 * Service for version history API calls
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
    console.error('[Version History Service] Error getting auth token:', error);
    return null;
  }
}

/**
 * Get backend URL
 * @returns {string} Backend URL
 */
function getBackendUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:3001/api';
  }

  const config = useRuntimeConfig();
  let backendUrl = config.public.backendUrl || 'http://localhost:3001';
  backendUrl = backendUrl.replace(/\/$/, '');
  const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
  const finalUrl = `${backendUrl}${apiPrefix}`;
  return finalUrl;
}

/**
 * Get all changes with filters (admin only)
 * @param {object} filters - Filter parameters
 * @param {string} filters.table_name - Table name filter
 * @param {number} filters.record_id - Record ID filter
 * @param {number} filters.changed_by - User ID filter
 * @param {number} filters.suggestion_id - Suggestion ID filter
 * @param {string} filters.start_date - Start date filter (ISO string)
 * @param {string} filters.end_date - End date filter (ISO string)
 * @param {number} filters.page - Page number (default: 1)
 * @param {number} filters.pageSize - Page size (default: 50)
 * @returns {Promise<object>} Response with data and pagination
 */
export async function getAllChanges(filters = {}) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated. Please log in.');
    }

    const backendUrl = getBackendUrl();
    const queryParams = new URLSearchParams();
    
    if (filters.table_name) queryParams.append('table_name', filters.table_name);
    if (filters.record_id) queryParams.append('record_id', filters.record_id);
    if (filters.changed_by) queryParams.append('changed_by', filters.changed_by);
    if (filters.suggestion_id) queryParams.append('suggestion_id', filters.suggestion_id);
    if (filters.start_date) queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize);

    const url = `${backendUrl}/version-history${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('Access denied. Admin role required.');
      }
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Failed to fetch changes' };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to fetch changes');
    }

    return await response.json();
  } catch (error) {
    console.error('[Version History Service] Error fetching all changes:', error);
    throw error;
  }
}

/**
 * Get changes for a specific entity
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @returns {Promise<object>} Response with version history data
 */
export async function getEntityChanges(table, id) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated. Please log in.');
    }

    const backendUrl = getBackendUrl();
    const url = `${backendUrl}/version-history/entity/${table}/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Failed to fetch entity changes' };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to fetch entity changes');
    }

    return await response.json();
  } catch (error) {
    console.error('[Version History Service] Error fetching entity changes:', error);
    throw error;
  }
}

/**
 * Undo a specific change (admin only)
 * @param {number} versionId - Version history entry ID
 * @param {string|null} comment - Optional comment for undo reason
 * @returns {Promise<object>} Response with updated entity data
 */
export async function undoChange(versionId, comment = null) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated. Please log in.');
    }

    const backendUrl = getBackendUrl();
    const url = `${backendUrl}/version-history/${versionId}/undo`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('Access denied. Admin role required.');
      }
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Failed to undo change' };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to undo change');
    }

    return await response.json();
  } catch (error) {
    console.error('[Version History Service] Error undoing change:', error);
    throw error;
  }
}

/**
 * Undo all changes from a suggestion (admin only)
 * @param {number} suggestionId - Suggestion ID
 * @param {string|null} comment - Optional comment for undo reason
 * @returns {Promise<object>} Response with list of undone changes
 */
export async function undoSuggestion(suggestionId, comment = null) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated. Please log in.');
    }

    const backendUrl = getBackendUrl();
    const url = `${backendUrl}/version-history/suggestion/${suggestionId}/undo`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('Access denied. Admin role required.');
      }
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Failed to undo suggestion changes' };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to undo suggestion changes');
    }

    return await response.json();
  } catch (error) {
    console.error('[Version History Service] Error undoing suggestion:', error);
    throw error;
  }
}
