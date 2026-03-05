/**
 * API composables for standardized response handling
 * All composables handle the standardized API response format:
 * { success: true, data: [...], pagination?: {...}, meta: {...} }
 */

import { ref, computed } from 'vue'

/**
 * Generic API composable factory
 * @param {string} resource - Resource name (e.g., 'cpus', 'gpus')
 * @param {string} chartDataEndpoint - Chart data endpoint (optional)
 * @returns {Object} Composable with data, pagination, pending, error, refresh
 */
function createApiComposable(resource, chartDataEndpoint = null) {
  const data = ref([])
  const chartData = ref([])
  const pagination = ref(null)
  const pending = ref(false)
  const error = ref(null)

  /**
   * Fetch list data
   * @param {Object} options - Fetch options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {string} options.search - Search query
   * @param {boolean} options.forceRefresh - Force cache refresh
   */
  async function fetchData({ page = 1, limit = 100, search = null, forceRefresh = false } = {}) {
    if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.server)) {
      return
    }

    try {
      pending.value = true
      error.value = null

      const cacheBust = forceRefresh ? `&refresh=true&_t=${Date.now()}` : ''
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
      const url = `/api/${resource}?page=${page}&limit=${limit}${searchParam}${cacheBust}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(url, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const responseData = await response.json()

      // Handle standardized response format
      if (responseData.success !== undefined) {
        // New standardized format
        data.value = responseData.data || []
        pagination.value = responseData.pagination || null
      } else {
        // Legacy format - handle backward compatibility
        const processedData = Array.isArray(responseData) ? responseData : (responseData.data || responseData)
        data.value = Array.isArray(processedData) ? processedData : []
        pagination.value = responseData.pagination || null
      }

      pending.value = false
    } catch (err) {
      pending.value = false
      error.value = err
      console.error(`[${resource} API] Fetch error:`, err)
    }
  }

  /**
   * Fetch chart data
   * @param {boolean} forceRefresh - Force cache refresh
   */
  async function fetchChartData(forceRefresh = false) {
    if (!chartDataEndpoint) return
    if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.server)) {
      return
    }

    try {
      const cacheBust = forceRefresh ? `?refresh=true&_t=${Date.now()}` : ''
      const url = `/api/${chartDataEndpoint}${cacheBust}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const response = await fetch(url, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const responseData = await response.json()


      // Handle Nuxt server API format: { data: [...], total: N }
      // Also handle backend direct format: { success: true, data: [...], total: N, meta: {...} }
      let extractedData = []
      if (responseData.data && Array.isArray(responseData.data)) {
        // Nuxt server API format
        extractedData = responseData.data || []
      } else if (responseData.success !== undefined) {
        // Backend standardized format
        extractedData = responseData.data || []
      } else {
        // Legacy format
        extractedData = Array.isArray(responseData) ? responseData : (responseData.data || [])
      }
      
      
      chartData.value = extractedData
      
    } catch (err) {
      console.error(`[${resource} Chart API] Fetch error:`, err)
    }
  }

  /**
   * Refresh data
   */
  async function refresh(options = {}) {
    await fetchData({ ...options, forceRefresh: true })
    if (chartDataEndpoint) {
      await fetchChartData(true)
    }
  }

  return {
    data,
    chartData,
    pagination,
    pending,
    error,
    fetchData,
    fetchChartData,
    refresh
  }
}

/**
 * CPU API composable
 */
export function useCpus() {
  return createApiComposable('cpus', 'cpus/chart-data')
}

/**
 * GPU API composable
 */
export function useGpus() {
  return createApiComposable('gpus', 'gpus/chart-data')
}

/**
 * FPGA API composable
 */
export function useFpgas() {
  return createApiComposable('fpgas', 'fpgas/chart-data')
}

/**
 * SoC API composable
 */
export function useSocs() {
  return createApiComposable('socs', 'socs/chart-data')
}

/**
 * Manufacturer API composable
 */
export function useManufacturers() {
  return createApiComposable('manufacturers')
}

/**
 * AI Processor API composable
 */
export function useAiProcessors() {
  return createApiComposable('ai-processors', 'ai-processors/chart-data')
}
