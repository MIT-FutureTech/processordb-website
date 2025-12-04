<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">
        GPUs
      </h1>
      <NuxtLink
        v-if="isLoggedIn"
        to="/gpu/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2">Add GPU</span>
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
            <GPUsGraph v-if="chartData && chartData.length > 0" :data="chartData" />
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="text-gray-500">No chart data available</div>
            </div>
            
            <!-- Load More Data Button -->
            <div v-if="chartData && chartData.length > 0" class="mt-4 flex justify-center">
              <button
                v-if="!loadingMoreChartData && allGpusData.length < totalAvailableRecords"
                @click="loadMoreChartData"
                class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-[#8a1b2d] transition-colors text-sm font-medium"
              >
                Load More Data ({{ allGpusData.length }} / {{ totalAvailableRecords || '?' }} loaded)
                <span v-if="allGpusData.length > 1000" class="text-xs block mt-1 opacity-75">
                  (Chart displays up to 1000 points)
                </span>
              </button>
              <div v-else-if="loadingMoreChartData" class="flex items-center space-x-2 text-gray-600">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A32035]"></div>
                <span class="text-sm">Loading more data...</span>
              </div>
              <div v-else-if="allGpusData.length >= totalAvailableRecords" class="text-sm text-gray-500">
                All {{ totalAvailableRecords }} records loaded
                <span v-if="allGpusData.length > 1000" class="text-xs block mt-1 opacity-75">
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
    <div class="mt-8 mb-16">
      <div v-if="pending" class="flex items-center justify-center h-32">
        <div class="flex flex-col items-center space-y-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#A32035]"></div>
          <div class="text-gray-500 text-sm">Loading data...</div>
        </div>
      </div>
      <div v-else>
        <!-- Empty State -->
        <div v-if="!error && tableData.length === 0" class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div class="text-center">
            <p class="text-gray-600 font-medium mb-2">No GPU data available</p>
            <p class="text-gray-500 text-sm">The database is empty. Add a GPU to get started.</p>
          </div>
        </div>
        
        <!-- Data Table -->
        <template v-else-if="!error && tableData.length > 0">
          <div class="overflow-x-auto">
            <PrivateTable
              :data="tableData"
              class-name="gpu"
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

import { ref, computed, onMounted, onActivated, watch, onUnmounted, defineAsyncComponent, nextTick } from 'vue';
import { isLogged } from '../lib/isLogged';
import { useRoute } from 'vue-router';
// Lazy load the chart component
const GPUsGraph = defineAsyncComponent(() => import('~/components/Graphs/GPUsGraph.client.vue'));

const isLoggedIn = ref(false);
const isDev = import.meta.env.DEV;

// Pagination state
const currentPage = ref(1);
const pageSize = ref(100);

// Fetch data for charts - start with page 1 for fast initial load, can load more on demand
// Use native fetch for consistency with table data fetching
const allGpusData = ref([]);
const loadingMoreChartData = ref(false);
const totalAvailableRecords = ref(null);
const currentChartPage = ref(1); // Track which page we're on (backend caps at 1000 per page)
const itemsPerPage = 1000; // Backend maximum per page

async function fetchChartData(forceRefresh = false, page = 1) {
  // Ensure we're on the client
  if (process.server) {
    console.log('[GPU Chart] fetchChartData called on server, skipping');
    return;
  }
  
  try {
    console.log('[GPU Chart] Fetching chart data..., forceRefresh:', forceRefresh, 'page:', page);
    
    // Add cache-busting parameter on navigation to ensure fresh data
    const cacheBust = forceRefresh ? `&refresh=true&_t=${Date.now()}` : '';
    // Backend caps at 1000 items per page, so use max limit
    const url = `/api/gpus?page=${page}&limit=${itemsPerPage}${cacheBust}`;
    console.log(`[GPU Chart] Fetch URL: ${url}`);
    
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
      
      console.log('[GPU Chart] Response received:', typeof responseData, 'IsArray:', Array.isArray(responseData));
      
      // Handle response format - API may return { data, pagination } or array directly
      const fetchedData = Array.isArray(responseData) ? responseData : (responseData.data || responseData);
      const pagination = responseData.pagination || null;
      
      // Update total count from pagination if available
      if (pagination && pagination.totalCount) {
        totalAvailableRecords.value = pagination.totalCount;
        console.log('[GPU Chart] Total records from pagination:', totalAvailableRecords.value);
      } else if (fetchedData.length < itemsPerPage) {
        // If we got fewer records than requested and no pagination, we've reached the end
        if (!totalAvailableRecords.value) {
          totalAvailableRecords.value = allGpusData.value.length + fetchedData.length;
          console.log('[GPU Chart] Estimated total records:', totalAvailableRecords.value);
        }
      }
      
      // Merge with existing data (avoid duplicates by checking gpu_id)
      const existingIds = new Set(allGpusData.value.map(item => item.gpu_id));
      const newData = fetchedData.filter(item => !existingIds.has(item.gpu_id));
      
      console.log('[GPU Chart] Data merge - Existing:', allGpusData.value.length, 'Fetched:', fetchedData.length, 'New:', newData.length);
      
      allGpusData.value = [...allGpusData.value, ...newData];
      currentChartPage.value = page;
      
      console.log('[GPU Chart] allGpusData.value set to:', allGpusData.value.length, 'items (page:', page, ')');
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        throw new Error('Request timeout: Server did not respond in time');
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('[GPU Chart] Fetch error:', err);
    if (allGpusData.value.length === 0) {
      allGpusData.value = [];
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
    console.log('[GPU Chart] Loading next page:', nextPage);
    await fetchChartData(false, nextPage);
  } catch (err) {
    console.error('[GPU Chart] Error loading more data:', err);
  } finally {
    loadingMoreChartData.value = false;
  }
}

// Fetch paginated data for table
// Use native fetch for more reliable client-side fetching
const gpusData = ref([]);
const pagination = ref(null);
const pending = ref(true);
const error = ref(null);

// Track if this is the first load to decide whether to bust cache
let isFirstLoad = true;

// Function to fetch data with retry logic
async function fetchGpusData(forceRefresh = false, retryCount = 0) {
  // Ensure we're on the client
  if (process.server) {
    console.log('[GPU List] fetchGpusData called on server, skipping');
    return;
  }
  
  const maxRetries = 3;
  
  try {
    console.log(`[GPU List] fetchGpusData START - page=${currentPage.value}, limit=${pageSize.value}, forceRefresh=${forceRefresh}, retry=${retryCount}`);
    
    pending.value = true;
    error.value = null;
    
    // Add cache-busting parameter on navigation (not first load) to ensure fresh data
    const cacheBust = forceRefresh || !isFirstLoad ? `&refresh=true&_t=${Date.now()}` : '';
    const url = `/api/gpus?page=${currentPage.value}&limit=${pageSize.value}${cacheBust}`;
    console.log(`[GPU List] Fetch URL: ${url}`);
    
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
      
      console.log('[GPU List] Response received - Type:', typeof responseData, 'IsArray:', Array.isArray(responseData));
      
      // Handle response format - API may return { data, pagination } or array directly
      const processedData = Array.isArray(responseData) ? responseData : (responseData.data || responseData);
      const paginationData = responseData.pagination || null;
      
      console.log('[GPU List] Data length:', processedData.length);
      console.log('[GPU List] Pagination data:', paginationData);
      
      gpusData.value = processedData;
      pagination.value = paginationData;
      
      // Update currentPage if pagination data indicates a different page
      if (paginationData && paginationData.page) {
        currentPage.value = paginationData.page;
      }
      
      pending.value = false;
      isFirstLoad = false; // Mark that we've done the first load
      
      console.log('[GPU List] fetchGpusData COMPLETE - length:', gpusData.value.length);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        throw new Error('Request timeout: Server did not respond in time');
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('[GPU List] Fetch error:', err);
    
    // Retry logic for transient failures
    if (retryCount < maxRetries && !forceRefresh && err.status !== 404) {
      const delay = 1000 * (retryCount + 1); // Exponential backoff
      console.log(`[GPU List] Retry ${retryCount + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchGpusData(forceRefresh, retryCount + 1);
    }
    
    console.error('[GPU List] Error stack:', err.stack);
    error.value = err;
    pending.value = false;
    gpusData.value = []; // Ensure empty array on error
    throw err; // Re-throw for caller to handle
  }
}

const route = useRoute();
const hasInitialized = ref(false);

// Function to initialize data fetching
async function initializeData(forceRefresh = false) {
  // Double-check we're on the client
  if (process.server) {
    console.log('[GPU List] Skipping fetch on server');
    return;
  }
  
  // Prevent multiple simultaneous initializations
  if (hasInitialized.value && !forceRefresh && gpusData.value.length > 0) {
    console.log('[GPU List] Already initialized with data, skipping');
    return;
  }
  
  console.log('[GPU List] initializeData called, forceRefresh:', forceRefresh);
  
  isLoggedIn.value = isLogged();
  
  // Wait for next tick to ensure DOM is ready
  await nextTick();
  
  try {
    console.log('[GPU List] Starting data fetches...');
    
    // Reset chart data on force refresh
    if (forceRefresh) {
      allGpusData.value = [];
      currentChartPage.value = 1;
      totalAvailableRecords.value = null;
      hasInitialized.value = false;
    }
    
    // Fetch in parallel for faster page load - table data is critical, chart can load separately
    const fetchPromises = [];
    
    // Table data (critical)
    fetchPromises.push(
      fetchGpusData(forceRefresh).catch(err => {
        console.error('[GPU List] fetchGpusData failed:', err);
        throw err; // Re-throw to fail fast for critical data
      })
    );
    
    // Chart data (non-critical, can fail silently)
    fetchPromises.push(
      fetchChartData(forceRefresh, currentChartPage.value).catch(err => {
        console.error('[GPU List] fetchChartData failed (non-critical):', err);
        // Don't throw - chart data is optional
      })
    );
    
    // Wait for all fetches to complete (or fail)
    await Promise.allSettled(fetchPromises);
    console.log('[GPU List] All data fetches completed');
    
    hasInitialized.value = true;
  } catch (err) {
    console.error('[GPU List] Error in initializeData:', err);
    console.error('[GPU List] Error stack:', err.stack);
    // Ensure pending is set to false on error
    pending.value = false;
    error.value = err;
    throw err; // Re-throw so caller can handle it
  }
}

// Initial fetch on mount - primary initialization point
onMounted(async () => {
  console.log('[GPU List] onMounted - initializing data...');
  
  // Only initialize if we don't have data yet
  if (!hasInitialized.value || gpusData.value.length === 0) {
    try {
      await initializeData();
      console.log('[GPU List] onMounted completed successfully');
    } catch (err) {
      console.error('[GPU List] Error in onMounted:', err);
      // Error already handled in initializeData
    }
  } else {
    console.log('[GPU List] onMounted - data already loaded, skipping');
  }
});

// Handle navigation - refresh data when component is activated
onActivated(async () => {
  console.log('[GPU List] onActivated - checking if refresh needed');
  
  // Only refresh if we don't have data or if explicitly needed
  if (!hasInitialized.value || gpusData.value.length === 0) {
    try {
      await initializeData(true); // Force refresh
    } catch (err) {
      console.error('[GPU List] Error in onActivated:', err);
      // Error already handled in initializeData
    }
  }
    if (typeof fetchGpusData === 'function') {
      await fetchGpusData(true); // Force refresh
    }
    if (typeof fetchChartData === 'function') {
      await fetchChartData(true, 1); // Force refresh with page 1
    }
});

// Watch route changes to refresh data
watch(() => route.path, async (newPath, oldPath) => {
  if (newPath === '/gpu/list' && newPath !== oldPath) {
    console.log('[GPU List] Route changed to /gpu/list, forcing refresh...');
    // Reset chart data state on navigation
    allGpusData.value = [];
    currentChartPage.value = 1;
    totalAvailableRecords.value = null;
    loadingMoreChartData.value = false;
    
    // Force refresh on navigation to bypass cache
    if (typeof fetchGpusData === 'function') {
      await fetchGpusData(true); // Force refresh
    }
    if (typeof fetchChartData === 'function') {
      await fetchChartData(true, 1); // Force refresh with page 1
    }
  }
}, { immediate: false });

// For compatibility with existing code
const refresh = () => fetchGpusData(true);
const execute = () => fetchGpusData(true);

// Watch pagination and refetch (single watch, not duplicate)
// Handle page size change - reset to page 1 and refetch
function handlePageSizeChange(newPageSize) {
  pageSize.value = newPageSize;
  currentPage.value = 1;
  fetchGpusData();
}

watch([currentPage, pageSize], () => {
  console.log('[GPU List] Pagination changed, refetching data...');
  fetchGpusData();
}, { immediate: false }); // immediate: false prevents this from running on initial mount

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
        console.warn('GPU data fetch timeout - forcing pending to false');
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

// Debug: Watch gpusData changes to see when it updates
watch([gpusData, pending, error], ([data, isPending, err]) => {
  console.log('[GPU List Watch] gpusData:', data, 'pending:', isPending, 'error:', err);
  if (err) {
    console.error('GPU data error:', err);
  } else if (!isPending) {
    if (data) {
      const count = Array.isArray(data) ? data.length : (data?.data?.length || 0);
      console.log(`[GPU List Watch] GPU data loaded: ${count} items`);
      console.log('[GPU List Watch] First item:', data[0] || (data?.data?.[0]));
    } else {
      console.log('[GPU List Watch] No data after pending finished');
    }
  }
}, { immediate: true, deep: true });

// Handle response format - backend returns { data: [...], pagination: {...} } or array directly
// Frontend API route extracts the data array, so gpusData should be an array
const tableData = computed(() => {
  console.log('[tableData computed] gpusData.value:', gpusData.value);
  console.log('[tableData computed] Type:', typeof gpusData.value, 'IsArray:', Array.isArray(gpusData.value));

  if (!gpusData.value) {
    console.log('[tableData computed] No gpusData.value, returning empty array');
    return [];
  }

  // gpusData.value is already an array due to fetchGpusData processing
  const result = gpusData.value;
  console.log('[tableData computed] Result length:', result.length);
  return result;
});

const chartData = computed(() => {
  if (!allGpusData.value) return [];
  // allGpusData.value is already an array due to fetchChartData processing
  return allGpusData.value;
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
    console.log('Refreshing GPU data...');
    // Force refresh with cache bypass
    await refresh();
    console.log('GPU data refreshed successfully');
  } catch (err) {
    console.error('Failed to refresh data:', err);
  }
};
</script>
