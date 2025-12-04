<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">
        FPGAs
      </h1>
      <NuxtLink
        v-if="isLoggedIn"
        to="/fpga/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2">Add FPGA</span>
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
            <FPGAsGraph v-if="chartData && chartData.length > 0" :data="chartData" />
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="text-gray-500">No chart data available</div>
            </div>
            
            <!-- Load More Data Button -->
            <div v-if="chartData && chartData.length > 0" class="mt-4 flex justify-center">
              <button
                v-if="!loadingMoreChartData && allFpgasData.length < totalAvailableRecords"
                @click="loadMoreChartData"
                class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-[#8a1b2d] transition-colors text-sm font-medium"
              >
                Load More Data ({{ allFpgasData.length }} / {{ totalAvailableRecords || '?' }} loaded)
                <span v-if="allFpgasData.length > 1000" class="text-xs block mt-1 opacity-75">
                  (Chart displays up to 1000 points)
                </span>
              </button>
              <div v-else-if="loadingMoreChartData" class="flex items-center space-x-2 text-gray-600">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A32035]"></div>
                <span class="text-sm">Loading more data...</span>
              </div>
              <div v-else-if="allFpgasData.length >= totalAvailableRecords" class="text-sm text-gray-500">
                All {{ totalAvailableRecords }} records loaded
                <span v-if="allFpgasData.length > 1000" class="text-xs block mt-1 opacity-75">
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
            <p class="text-gray-600 font-medium mb-2">No FPGA data available</p>
            <p class="text-gray-500 text-sm">The database is empty. Add an FPGA to get started.</p>
          </div>
        </div>
        
        <!-- Data Table -->
        <template v-else-if="!error && tableData.length > 0">
          <div class="overflow-x-auto">
            <PrivateTable
              :data="tableData"
              class-name="fpgas"
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
const FPGAsGraph = defineAsyncComponent(() => import('~/components/Graphs/FPGAsGraph.client.vue'));

const isLoggedIn = ref(false);
const isDev = import.meta.env.DEV;

// Pagination state
const currentPage = ref(1);
const pageSize = ref(100);

// Fetch data for charts - start with page 1 for fast initial load, can load more on demand
// Use native fetch for consistency with table data fetching
const allFpgasData = ref([]);
const loadingMoreChartData = ref(false);
const totalAvailableRecords = ref(null);
const currentChartPage = ref(1); // Track which page we're on (backend caps at 1000 per page)
const itemsPerPage = 1000; // Backend maximum per page

async function fetchChartData(forceRefresh = false, page = 1) {
  // Ensure we're on the client
  if (process.server) {
    console.log('[FPGA Chart] fetchChartData called on server, skipping');
    return;
  }
  
  try {
    console.log('[FPGA Chart] Fetching chart data..., forceRefresh:', forceRefresh, 'page:', page);
    
    // Add cache-busting parameter on navigation to ensure fresh data
    const cacheBust = forceRefresh ? `&refresh=true&_t=${Date.now()}` : '';
    // Backend caps at 1000 items per page, so use max limit
    const url = `/api/fpgas?page=${page}&limit=${itemsPerPage}${cacheBust}`;
    console.log(`[FPGA Chart] Fetch URL: ${url}`);
    
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
      
      console.log('[FPGA Chart] Response received:', typeof responseData, 'IsArray:', Array.isArray(responseData));
      
      // Handle response format - API may return { data, pagination } or array directly
      const fetchedData = Array.isArray(responseData) ? responseData : (responseData.data || responseData);
      const pagination = responseData.pagination || null;
      
      // Update total count from pagination if available
      if (pagination && pagination.totalCount) {
        totalAvailableRecords.value = pagination.totalCount;
        console.log('[FPGA Chart] Total records from pagination:', totalAvailableRecords.value);
      } else if (fetchedData.length < itemsPerPage) {
        // If we got fewer records than requested and no pagination, we've reached the end
        if (!totalAvailableRecords.value) {
          totalAvailableRecords.value = allFpgasData.value.length + fetchedData.length;
          console.log('[FPGA Chart] Estimated total records:', totalAvailableRecords.value);
        }
      }
      
      // Merge with existing data (avoid duplicates by checking fpga_id)
      const existingIds = new Set(allFpgasData.value.map(item => item.fpga_id));
      const newData = fetchedData.filter(item => !existingIds.has(item.fpga_id));
      
      console.log('[FPGA Chart] Data merge - Existing:', allFpgasData.value.length, 'Fetched:', fetchedData.length, 'New:', newData.length);
      
      allFpgasData.value = [...allFpgasData.value, ...newData];
      currentChartPage.value = page;
      
      console.log('[FPGA Chart] allFpgasData.value set to:', allFpgasData.value.length, 'items (page:', page, ')');
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        throw new Error('Request timeout: Server did not respond in time');
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('[FPGA Chart] Fetch error:', err);
    if (allFpgasData.value.length === 0) {
      allFpgasData.value = [];
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
    console.log('[FPGA Chart] Loading next page:', nextPage);
    await fetchChartData(false, nextPage);
  } catch (err) {
    console.error('[FPGA Chart] Error loading more data:', err);
  } finally {
    loadingMoreChartData.value = false;
  }
}

// Fetch paginated data for table
// Use native fetch for more reliable client-side fetching
const fpgasData = ref([]);
const pagination = ref(null);
const pending = ref(true);
const error = ref(null);

// Track if this is the first load to decide whether to bust cache
let isFirstLoad = true;

// Function to fetch data with retry logic
async function fetchFpgasData(forceRefresh = false, retryCount = 0) {
  // Ensure we're on the client
  if (process.server) {
    console.log('[FPGA List] fetchFpgasData called on server, skipping');
    return;
  }
  
  const maxRetries = 3;
  
  try {
    console.log(`[FPGA List] fetchFpgasData START - page=${currentPage.value}, limit=${pageSize.value}, forceRefresh=${forceRefresh}, retry=${retryCount}`);
    
    pending.value = true;
    error.value = null;
    
    // Add cache-busting parameter on navigation (not first load) to ensure fresh data
    const cacheBust = forceRefresh || !isFirstLoad ? `&refresh=true&_t=${Date.now()}` : '';
    const url = `/api/fpgas?page=${currentPage.value}&limit=${pageSize.value}${cacheBust}`;
    console.log(`[FPGA List] Fetch URL: ${url}`);
    
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
      
      console.log('[FPGA List] Response received - Type:', typeof responseData, 'IsArray:', Array.isArray(responseData));
      
      // Handle response format - API may return { data, pagination } or array directly
      const processedData = Array.isArray(responseData) ? responseData : (responseData.data || responseData);
      const paginationData = responseData.pagination || null;
      
      console.log('[FPGA List] Data length:', processedData.length);
      console.log('[FPGA List] Pagination data:', paginationData);
      
      fpgasData.value = processedData;
      pagination.value = paginationData;
      
      // Update currentPage if pagination data indicates a different page
      if (paginationData && paginationData.page) {
        currentPage.value = paginationData.page;
      }
      
      pending.value = false;
      isFirstLoad = false; // Mark that we've done the first load
      
      console.log('[FPGA List] fetchFpgasData COMPLETE - length:', fpgasData.value.length);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        throw new Error('Request timeout: Server did not respond in time');
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('[FPGA List] Fetch error:', err);
    
    // Retry logic for transient failures
    if (retryCount < maxRetries && !forceRefresh && err.status !== 404) {
      const delay = 1000 * (retryCount + 1); // Exponential backoff
      console.log(`[FPGA List] Retry ${retryCount + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchFpgasData(forceRefresh, retryCount + 1);
    }
    
    console.error('[FPGA List] Error stack:', err.stack);
    error.value = err;
    pending.value = false;
    fpgasData.value = []; // Ensure empty array on error
    throw err; // Re-throw for caller to handle
  }
}

const route = useRoute();
const hasInitialized = ref(false);

// Function to initialize data fetching
async function initializeData(forceRefresh = false) {
  // Double-check we're on the client
  if (process.server) {
    console.log('[FPGA List] Skipping fetch on server');
    return;
  }
  
  // Prevent multiple simultaneous initializations
  if (hasInitialized.value && !forceRefresh && fpgasData.value.length > 0) {
    console.log('[FPGA List] Already initialized with data, skipping');
    return;
  }
  
  console.log('[FPGA List] initializeData called, forceRefresh:', forceRefresh);
  
  isLoggedIn.value = isLogged();
  
  // Wait for next tick to ensure DOM is ready
  await nextTick();
  
  try {
    console.log('[FPGA List] Starting data fetches...');
    
    // Reset chart data on force refresh
    if (forceRefresh) {
      allFpgasData.value = [];
      currentChartPage.value = 1;
      totalAvailableRecords.value = null;
      hasInitialized.value = false;
    }
    
    // Fetch in parallel for faster page load - table data is critical, chart can load separately
    const fetchPromises = [];
    
    // Table data (critical)
    fetchPromises.push(
      fetchFpgasData(forceRefresh).catch(err => {
        console.error('[FPGA List] fetchFpgasData failed:', err);
        throw err; // Re-throw to fail fast for critical data
      })
    );
    
    // Chart data (non-critical, can fail silently)
    fetchPromises.push(
      fetchChartData(forceRefresh, currentChartPage.value).catch(err => {
        console.error('[FPGA List] fetchChartData failed (non-critical):', err);
        // Don't throw - chart data is optional
      })
    );
    
    // Wait for all fetches to complete (or fail)
    await Promise.allSettled(fetchPromises);
    console.log('[FPGA List] All data fetches completed');
    
    hasInitialized.value = true;
  } catch (err) {
    console.error('[FPGA List] Error in initializeData:', err);
    console.error('[FPGA List] Error stack:', err.stack);
    // Ensure pending is set to false on error
    pending.value = false;
    error.value = err;
    throw err; // Re-throw so caller can handle it
  }
}

// Initial fetch on mount - primary initialization point
onMounted(async () => {
  console.log('[FPGA List] onMounted - initializing data...');
  
  // Only initialize if we don't have data yet
  if (!hasInitialized.value || fpgasData.value.length === 0) {
    try {
      await initializeData();
      console.log('[FPGA List] onMounted completed successfully');
    } catch (err) {
      console.error('[FPGA List] Error in onMounted:', err);
      // Error already handled in initializeData
    }
  } else {
    console.log('[FPGA List] onMounted - data already loaded, skipping');
  }
});

// Handle navigation - refresh data when component is activated
onActivated(async () => {
  console.log('[FPGA List] onActivated - checking if refresh needed');
  
  // Only refresh if we don't have data or if explicitly needed
  if (!hasInitialized.value || fpgasData.value.length === 0) {
    try {
      await initializeData(true); // Force refresh
    } catch (err) {
      console.error('[FPGA List] Error in onActivated:', err);
      // Error already handled in initializeData
    }
  }
    if (typeof fetchFpgasData === 'function') {
      await fetchFpgasData(true); // Force refresh
    }
    if (typeof fetchChartData === 'function') {
      await fetchChartData(true, 1); // Force refresh with page 1
    }
});

// Watch route changes to refresh data
watch(() => route.path, async (newPath, oldPath) => {
  if (newPath === '/fpga/list' && newPath !== oldPath) {
    console.log('[FPGA List] Route changed to /fpga/list, forcing refresh...');
    // Reset chart data state on navigation
    allFpgasData.value = [];
    currentChartPage.value = 1;
    totalAvailableRecords.value = null;
    loadingMoreChartData.value = false;
    
    // Force refresh on navigation to bypass cache
    if (typeof fetchFpgasData === 'function') {
      await fetchFpgasData(true); // Force refresh
    }
    if (typeof fetchChartData === 'function') {
      await fetchChartData(true, 1); // Force refresh with page 1
    }
  }
}, { immediate: false });

// For compatibility with existing code
const refresh = () => fetchFpgasData(true);
const execute = () => fetchFpgasData(true);

// Handle page size change - reset to page 1 and refetch
function handlePageSizeChange(newPageSize) {
  pageSize.value = newPageSize;
  currentPage.value = 1;
  fetchFpgasData();
}

// Watch pagination and refetch (single watch, not duplicate)
watch([currentPage, pageSize], () => {
  console.log('[FPGA List] Pagination changed, refetching data...');
  fetchFpgasData();
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
        console.warn('FPGA data fetch timeout - forcing pending to false');
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

// Debug: Watch fpgasData changes to see when it updates
watch([fpgasData, pending, error], ([data, isPending, err]) => {
  console.log('[FPGA List Watch] fpgasData:', data, 'pending:', isPending, 'error:', err);
  if (err) {
    console.error('FPGA data error:', err);
  } else if (!isPending) {
    if (data) {
      const count = Array.isArray(data) ? data.length : (data?.data?.length || 0);
      console.log(`[FPGA List Watch] FPGA data loaded: ${count} items`);
      console.log('[FPGA List Watch] First item:', data[0] || (data?.data?.[0]));
    } else {
      console.log('[FPGA List Watch] No data after pending finished');
    }
  }
}, { immediate: true, deep: true });

// Handle response format - backend returns { data: [...], pagination: {...} } or array directly
// Frontend API route extracts the data array, so fpgasData should be an array
const tableData = computed(() => {
  console.log('[tableData computed] fpgasData.value:', fpgasData.value);
  console.log('[tableData computed] Type:', typeof fpgasData.value, 'IsArray:', Array.isArray(fpgasData.value));

  if (!fpgasData.value) {
    console.log('[tableData computed] No fpgasData.value, returning empty array');
    return [];
  }

  // fpgasData.value is already an array due to fetchFpgasData processing
  const result = fpgasData.value;
  console.log('[tableData computed] Result length:', result.length);
  return result;
});

const chartData = computed(() => {
  if (!allFpgasData.value) return [];
  // allFpgasData.value is already an array due to fetchChartData processing
  return allFpgasData.value;
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
    console.log('Refreshing FPGA data...');
    // Force refresh with cache bypass
    await refresh();
    console.log('FPGA data refreshed successfully');
  } catch (err) {
    console.error('Failed to refresh data:', err);
  }
};
</script>
