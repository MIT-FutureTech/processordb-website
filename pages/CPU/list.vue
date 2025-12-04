<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">
        CPUs
      </h1>
      <NuxtLink
        v-show="isLoggedIn"
        to="/cpu/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2">Add CPU</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
      </NuxtLink>
    </div>

    <!-- Graph Component with Lazy Loading -->
    <div class="my-8">
      <Suspense>
        <template #default>
          <div>
            <CPUsGraph v-if="chartData && chartData.length > 0" :data="chartData" />
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="text-gray-500">No chart data available</div>
            </div>
            
            <!-- Load More Data Button -->
            <div v-if="chartData && chartData.length > 0" class="mt-4 flex justify-center">
              <button
                v-if="!loadingMoreChartData && allCpusData.length < totalAvailableRecords"
                @click="loadMoreChartData"
                class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-[#8a1b2d] transition-colors text-sm font-medium"
              >
                Load More Data ({{ allCpusData.length }} / {{ totalAvailableRecords || '?' }} loaded)
                <span v-if="allCpusData.length > 1000" class="text-xs block mt-1 opacity-75">
                  (Chart displays up to 1000 points)
                </span>
              </button>
              <div v-else-if="loadingMoreChartData" class="flex items-center space-x-2 text-gray-600">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A32035]"></div>
                <span class="text-sm">Loading more data...</span>
              </div>
              <div v-else-if="allCpusData.length >= totalAvailableRecords" class="text-sm text-gray-500">
                All {{ totalAvailableRecords }} records loaded
                <span v-if="allCpusData.length > 1000" class="text-xs block mt-1 opacity-75">
                  (Chart displays up to 1000 points)
                </span>
              </div>
            </div>
          </div>
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div class="flex flex-col items-center space-y-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
              <div class="text-gray-500">Loading chart...</div>
            </div>
          </div>
        </template>
      </Suspense>
    </div>

    <!-- Error State -->
    <div v-if="error" class="my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div>
            <span class="text-red-800 font-medium">Failed to load data.</span>
            <p class="text-red-600 text-sm mt-1">{{ error.message || 'Unknown error occurred' }}</p>
          </div>
        </div>
        <button @click="handleRefresh" class="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
          Retry
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="mt-8 bg-white mb-16">
      <div v-if="pending" class="flex items-center justify-center h-32">
        <div class="flex flex-col items-center space-y-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#A32035]"></div>
          <div class="text-gray-500 text-sm">Loading data...</div>
        </div>
      </div>
      <div v-else>
        <!-- Debug info (remove after fixing) -->
        <div v-if="isDev" class="mb-4 p-2 bg-yellow-50 text-xs">
          Debug: pending={{ pending }}, error={{ error }}, tableData.length={{ tableData.length }}, cpusData={{ cpusData ? 'exists' : 'null' }}
        </div>
        
        <!-- Empty State -->
        <div v-if="!error && tableData.length === 0" class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div class="text-center">
            <p class="text-gray-600 font-medium mb-2">No CPU data available</p>
            <p class="text-gray-500 text-sm">The database is empty. Add a CPU to get started.</p>
          </div>
        </div>
        
        <!-- Data Table -->
        <template v-else-if="!error && tableData.length > 0">
          <div class="overflow-x-auto">
            <PrivateTable
              :data="tableData"
              class-name="cpu"
              :total-count="pagination?.totalCount || 0"
              :current-page="currentPage"
              :page-size="pageSize"
              :has-previous-page="pagination?.hasPreviousPage || false"
              :has-next-page="pagination?.hasNextPage || false"
              :total-pages="pagination?.totalPages || 0"
              @update:current-page="currentPage = $event"
              @update:page-size="handlePageSizeChange($event)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="js">
// Make this page client-side only to avoid SSR issues
definePageMeta({
  ssr: false
});

import { isLogged } from '../lib/isLogged';
import { ref, computed, onMounted, onActivated, watch, onUnmounted, defineAsyncComponent, nextTick } from 'vue';
import { useRoute } from 'vue-router';
// Lazy load the chart component
const CPUsGraph = defineAsyncComponent(() => import('~/components/Graphs/CPUsGraph.client.vue'));

const isLoggedIn = ref(false);
const isDev = import.meta.env.DEV;

// Immediate initialization check - run as soon as script loads (client-side only)
// In build mode with ssr: false, this should always run on client
if (typeof window !== 'undefined') {
  console.log('[CPU List] Script setup - client side detected (window check)');
  console.log('[CPU List] process.client:', typeof process !== 'undefined' ? process.client : 'process not defined');
  // Use nextTick to ensure all refs are initialized
  nextTick(() => {
    console.log('[CPU List] nextTick - checking if initialization needed');
    // This will be set up after functions are defined
  });
} else {
  console.log('[CPU List] Script setup - server side (window undefined)');
}

// Pagination state
const currentPage = ref(1);
const pageSize = ref(100);

// Fetch data for charts - start with 500 for fast initial load, can load more on demand
// Use native fetch for consistency with table data fetching
const allCpusData = ref([]);
const loadingMoreChartData = ref(false);
const totalAvailableRecords = ref(null);
const currentChartPage = ref(1); // Track which page we're on (backend caps at 1000 per page)
const itemsPerPage = 1000; // Backend maximum per page

async function fetchChartData(forceRefresh = false, page = 1) {
  // Ensure we're on the client - use window check as fallback
  if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.server)) {
    console.log('[CPU Chart] fetchChartData called on server, skipping');
    return;
  }
  
  try {
    console.log('[CPU Chart] Fetching chart data..., forceRefresh:', forceRefresh, 'page:', page);
    
    // Add cache-busting parameter on navigation to ensure fresh data
    const cacheBust = forceRefresh ? `&refresh=true&_t=${Date.now()}` : '';
    // Backend caps at 1000 items per page, so use max limit
    const url = `/api/cpus?page=${page}&limit=${itemsPerPage}${cacheBust}`;
    console.log(`[CPU Chart] Fetch URL: ${url}`);
    
    // Use native fetch with timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      console.log('[CPU Chart] Response received:', typeof responseData, 'IsArray:', Array.isArray(responseData));
      
      // Handle response format - API may return { data, pagination } or array directly
      const fetchedData = Array.isArray(responseData) ? responseData : (responseData.data || responseData);
      const pagination = responseData.pagination || null;
      
      // Update total count from pagination if available
      if (pagination && pagination.totalCount) {
        totalAvailableRecords.value = pagination.totalCount;
        console.log('[CPU Chart] Total records from pagination:', totalAvailableRecords.value);
      } else if (fetchedData.length < itemsPerPage) {
        // If we got fewer records than requested and no pagination, we've reached the end
        if (!totalAvailableRecords.value) {
          totalAvailableRecords.value = allCpusData.value.length + fetchedData.length;
          console.log('[CPU Chart] Estimated total records:', totalAvailableRecords.value);
        }
      }
      
      // Merge with existing data (avoid duplicates by checking cpu_id)
      const existingIds = new Set(allCpusData.value.map(item => item.cpu_id));
      const newData = fetchedData.filter(item => !existingIds.has(item.cpu_id));
      
      console.log('[CPU Chart] Data merge - Existing:', allCpusData.value.length, 'Fetched:', fetchedData.length, 'New:', newData.length);
      
      // If no new data and we got a full page, we might have duplicates or reached the end
      if (newData.length === 0 && fetchedData.length === itemsPerPage) {
        console.warn('[CPU Chart] No new data found despite full page. Possible duplicate data or pagination issue.');
      }
      
      allCpusData.value = [...allCpusData.value, ...newData];
      currentChartPage.value = page;
      
      console.log('[CPU Chart] allCpusData.value set to:', allCpusData.value.length, 'items (page:', page, ')');
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        throw new Error('Request timeout: Server did not respond in time');
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('[CPU Chart] Fetch error:', err);
    if (allCpusData.value.length === 0) {
      allCpusData.value = [];
    }
  }
}

// Function to load more chart data using pagination
async function loadMoreChartData() {
  if (loadingMoreChartData.value) return;
  
  loadingMoreChartData.value = true;
  try {
    // Fetch next page (backend caps at 1000 per page, so we paginate)
    const nextPage = currentChartPage.value + 1;
    console.log('[CPU Chart] Loading next page:', nextPage);
    await fetchChartData(false, nextPage);
  } catch (err) {
    console.error('[CPU Chart] Error loading more data:', err);
  } finally {
    loadingMoreChartData.value = false;
  }
}

// Chart data will be fetched in the main onMounted hook below

// Fetch paginated data for table
// Use $fetch directly for more reliable client-side fetching
const cpusData = ref([]);
const pagination = ref(null);
const pending = ref(true);
const error = ref(null);

// Track if this is the first load to decide whether to bust cache
let isFirstLoad = true;

// Function to fetch data with retry logic
async function fetchCpusData(forceRefresh = false, retryCount = 0) {
  // Ensure we're on the client - use window check as fallback
  if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.server)) {
    console.log('[CPU List] fetchCpusData called on server, skipping');
    console.log('[CPU List] window:', typeof window !== 'undefined' ? 'defined' : 'undefined');
    console.log('[CPU List] process.server:', typeof process !== 'undefined' ? process.server : 'process not defined');
    return;
  }
  
  const maxRetries = 3;
  
  try {
    console.log(`[CPU List] fetchCpusData START - page=${currentPage.value}, limit=${pageSize.value}, forceRefresh=${forceRefresh}, retry=${retryCount}`);
    
    pending.value = true;
    error.value = null;
    
    // Add cache-busting parameter on navigation (not first load) to ensure fresh data
    const cacheBust = forceRefresh || !isFirstLoad ? `&refresh=true&_t=${Date.now()}` : '';
      const url = `/api/cpus?page=${currentPage.value}&limit=${pageSize.value}${cacheBust}`;
      console.log(`[CPU List] Fetch URL: ${url}`);
      
      // Use native fetch with timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      try {
        console.log('[CPU List] Starting fetch request...');
        const response = await fetch(url, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        console.log('[CPU List] Fetch response received - status:', response.status, 'ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[CPU List] Response not OK:', response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('[CPU List] Parsing JSON response...');
        const responseData = await response.json();
        console.log('[CPU List] JSON parsed successfully');
      
      console.log('[CPU List] Response received - Type:', typeof responseData, 'IsArray:', Array.isArray(responseData));
      console.log('[CPU List] Response keys:', Object.keys(responseData));
      console.log('[CPU List] Response sample:', JSON.stringify(responseData).substring(0, 200));
      
      // Handle response format - API may return { data, pagination } or array directly
      const processedData = Array.isArray(responseData) ? responseData : (responseData.data || responseData);
      const paginationData = responseData.pagination || null;
      
      console.log('[CPU List] After processing:');
      console.log('[CPU List]   processedData type:', typeof processedData);
      console.log('[CPU List]   processedData isArray:', Array.isArray(processedData));
      console.log('[CPU List]   processedData length:', Array.isArray(processedData) ? processedData.length : 'N/A');
      console.log('[CPU List]   paginationData:', paginationData);
      
      if (!Array.isArray(processedData)) {
        console.error('[CPU List] ERROR: processedData is not an array!', processedData);
        throw new Error('Response data is not in expected format');
      }
      
      if (processedData.length === 0) {
        console.warn('[CPU List] WARNING: processedData is empty array!');
      }
      
      console.log('[CPU List] Setting cpusData.value to', processedData.length, 'items');
      cpusData.value = processedData;
      pagination.value = paginationData;
      console.log('[CPU List] cpusData.value after assignment:', cpusData.value.length, 'items');
      
      // Update currentPage if pagination data indicates a different page
      if (paginationData && paginationData.page) {
        currentPage.value = paginationData.page;
      }
      
      console.log('[CPU List] Setting pending.value = false');
      pending.value = false;
      isFirstLoad = false; // Mark that we've done the first load
      
      console.log('[CPU List] fetchCpusData COMPLETE');
      console.log('[CPU List] Final state - cpusData.length:', cpusData.value.length);
      console.log('[CPU List] Final state - pending:', pending.value);
      console.log('[CPU List] Final state - error:', error.value);
      console.log('[CPU List] Final state - pagination:', pagination.value);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        throw new Error('Request timeout: Server did not respond in time');
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('[CPU List] Fetch error:', err);
    
    // Retry logic for transient failures
    if (retryCount < maxRetries && !forceRefresh && err.status !== 404) {
      const delay = 1000 * (retryCount + 1); // Exponential backoff
      console.log(`[CPU List] Retry ${retryCount + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchCpusData(forceRefresh, retryCount + 1);
    }
    
    console.error('[CPU List] Error stack:', err.stack);
    error.value = err;
    pending.value = false;
    cpusData.value = []; // Ensure empty array on error
    throw err; // Re-throw for caller to handle
  }
}

const route = useRoute();
const hasInitialized = ref(false);

// Function to initialize data fetching
async function initializeData(forceRefresh = false) {
  // Double-check we're on the client - use window check as fallback
  if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.server)) {
    console.log('[CPU List] Skipping fetch on server');
    console.log('[CPU List] window:', typeof window !== 'undefined' ? 'defined' : 'undefined');
    console.log('[CPU List] process.server:', typeof process !== 'undefined' ? process.server : 'process not defined');
    return;
  }
  
  // Prevent multiple simultaneous initializations
  if (hasInitialized.value && !forceRefresh && cpusData.value.length > 0) {
    console.log('[CPU List] Already initialized with data, skipping');
    return;
  }
  
  console.log('[CPU List] initializeData called, forceRefresh:', forceRefresh);
  
  isLoggedIn.value = isLogged();
  
  // Wait for next tick to ensure DOM is ready
  await nextTick();
  
  try {
    console.log('[CPU List] Starting data fetches...');
    
    // Reset chart data on force refresh
    if (forceRefresh) {
      allCpusData.value = [];
      currentChartPage.value = 1;
      totalAvailableRecords.value = null;
      hasInitialized.value = false;
    }
    
    // Fetch in parallel for faster page load - table data is critical, chart can load separately
    const fetchPromises = [];
    
    // Table data (critical)
    fetchPromises.push(
      fetchCpusData(forceRefresh).catch(err => {
        console.error('[CPU List] fetchCpusData failed:', err);
        throw err; // Re-throw to fail fast for critical data
      })
    );
    
    // Chart data (non-critical, can fail silently)
    fetchPromises.push(
      fetchChartData(forceRefresh, currentChartPage.value).catch(err => {
        console.error('[CPU List] fetchChartData failed (non-critical):', err);
        // Don't throw - chart data is optional
      })
    );
    
    // Wait for all fetches to complete (or fail)
    await Promise.allSettled(fetchPromises);
    console.log('[CPU List] All data fetches completed');
    
    hasInitialized.value = true;
  } catch (err) {
    console.error('[CPU List] Error in initializeData:', err);
    console.error('[CPU List] Error stack:', err.stack);
    // Ensure pending is set to false on error
    pending.value = false;
    error.value = err;
    throw err; // Re-throw so caller can handle it
  }
}

// Initial fetch on mount - primary initialization point
onMounted(async () => {
  console.log('[CPU List] onMounted - initializing data...');
  
  // Only initialize if we don't have data yet
  if (!hasInitialized.value || cpusData.value.length === 0) {
    try {
      await initializeData();
      console.log('[CPU List] onMounted completed successfully');
    } catch (err) {
      console.error('[CPU List] Error in onMounted:', err);
      // Error already handled in initializeData
    }
  } else {
    console.log('[CPU List] onMounted - data already loaded, skipping');
  }
});

// Handle navigation - refresh data when component is activated
onActivated(async () => {
  console.log('[CPU List] onActivated - checking if refresh needed');
  
  // Only refresh if we don't have data or if explicitly needed
  if (!hasInitialized.value || cpusData.value.length === 0) {
    try {
      await initializeData(true); // Force refresh
    } catch (err) {
      console.error('[CPU List] Error in onActivated:', err);
      // Error already handled in initializeData
    }
  }
});

// Watch route changes to refresh data
watch(() => route.path, async (newPath, oldPath) => {
  if (newPath === '/cpu/list' && newPath !== oldPath) {
    console.log('[CPU List] Route changed to /cpu/list, forcing refresh...');
    // Reset chart data state on navigation
    allCpusData.value = [];
    currentChartPage.value = 1;
    totalAvailableRecords.value = null;
    loadingMoreChartData.value = false;
    
    // Force refresh on navigation to bypass cache
    if (typeof fetchCpusData === 'function') {
      await fetchCpusData(true); // Force refresh
    }
    if (typeof fetchChartData === 'function') {
      await fetchChartData(true, 1); // Force refresh with page 1
    }
  }
}, { immediate: false });

// For compatibility with existing code
const refresh = () => fetchCpusData(true);
const execute = () => fetchCpusData(true);

// Handle page size change - reset to page 1 and refetch
function handlePageSizeChange(newPageSize) {
  pageSize.value = newPageSize;
  currentPage.value = 1;
  fetchCpusData();
}

// Watch pagination and refetch (single watch, not duplicate)
watch([currentPage, pageSize], (newValues, oldValues) => {
  console.log('[CPU List] Pagination changed:', { newValues, oldValues });
  // Only refetch if values actually changed (not initial setup)
  if (oldValues && (oldValues[0] !== newValues[0] || oldValues[1] !== newValues[1])) {
    console.log('[CPU List] Pagination values changed, refetching...');
    fetchCpusData();
  }
}, { immediate: false });

// Manual timeout fallback - if pending is still true after 35 seconds, force it to false
const loadingTimeout = ref(null);
watch(pending, (isPending) => {
  if (isPending) {
    // Clear any existing timeout
    if (loadingTimeout.value) {
      clearTimeout(loadingTimeout.value);
    }
    // Set a timeout to force pending to false if it's still true after 35 seconds
    loadingTimeout.value = setTimeout(() => {
      if (pending.value) {
        console.warn('CPU data fetch timeout - forcing pending to false');
        // Force refresh to clear pending state
        refresh().catch(err => {
          console.error('Failed to refresh after timeout:', err);
        });
      }
    }, 35000);
  } else {
    // Clear timeout if pending becomes false
    if (loadingTimeout.value) {
      clearTimeout(loadingTimeout.value);
      loadingTimeout.value = null;
    }
  }
});

// Removed duplicate watch - already handled above

// Debug: Watch cpusData changes to see when it updates
watchEffect(() => {
  console.log('[CPU List WatchEffect] cpusData.value:', cpusData.value, 'length:', Array.isArray(cpusData.value) ? cpusData.value.length : 'not array');
  console.log('[CPU List WatchEffect] pending.value:', pending.value);
  console.log('[CPU List WatchEffect] error.value:', error.value);
});

// Table data - cpusData is already an array, so we can use it directly
// But we need to ensure it's always an array for the template
const tableData = computed(() => {
  if (!cpusData.value || !Array.isArray(cpusData.value)) {
    return [];
  }
  return cpusData.value;
});

// Chart data - allCpusData is already an array
const chartData = computed(() => {
  if (!allCpusData.value || !Array.isArray(allCpusData.value)) {
    return [];
  }
  return allCpusData.value;
});

// Cleanup timeout on unmount
onUnmounted(() => {
  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value);
  }
});

// Error handling
const handleRefresh = async () => {
  try {
    console.log('Refreshing CPU data...');
    // Force refresh with cache bypass
    await refresh();
    console.log('CPU data refreshed successfully');
  } catch (err) {
    console.error('Failed to refresh data:', err);
  }
};

// Log data state for debugging
watch([cpusData, pending, error], ([data, isPending, err]) => {
  console.log('[CPU List Watch] cpusData:', data, 'pending:', isPending, 'error:', err);
  console.log('[CPU List Watch] cpusData type:', typeof data, 'IsArray:', Array.isArray(data));
  console.log('[CPU List Watch] cpusData value:', data?.value || data);
  
  if (err) {
    console.error('CPU data error:', err);
  } else if (!isPending) {
    if (data) {
      const count = Array.isArray(data) ? data.length : (data?.data?.length || 0);
      console.log(`[CPU List Watch] CPU data loaded: ${count} items`);
      if (count > 0) {
        console.log('[CPU List Watch] First item:', data[0] || (data?.data?.[0]));
      }
    } else {
      console.log('[CPU List Watch] No data after pending finished');
    }
  } else {
    console.log('[CPU List Watch] Still pending...');
  }
}, { immediate: true, deep: true });
</script>
