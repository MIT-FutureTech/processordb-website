<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">
        SOCs
      </h1>
      <NuxtLink
        v-show="isLoggedIn"
        to="/soc/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2">Add SoC</span>
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
            <InteractiveGraph v-if="chartData && chartData.length > 0" :data="chartData" />
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="text-gray-500">No chart data available</div>
            </div>
            
            <!-- Chart Data Status -->
            <div v-if="chartData && chartData.length > 0" class="mt-4 flex justify-center">
              <div class="text-sm text-gray-500">
                {{ chartDataRef.length }} records visualized
                <span v-if="chartDataRef.length > 10000" class="text-xs block mt-1 opacity-75">
                  (Using data grouping for optimal performance)
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
        <!-- Empty State -->
        <div v-if="!error && tableData.length === 0" class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div class="text-center">
            <p class="text-gray-600 font-medium mb-2">No SoC data available</p>
            <p class="text-gray-500 text-sm">The database is empty. Add a SoC to get started.</p>
          </div>
        </div>
        
        <!-- Data Table -->
        <template v-else-if="!error && tableData.length > 0">
          <div class="overflow-x-auto">
            <PrivateTable
              :data="tableData"
              class-name="soc"
              :total-count="pagination?.totalRecords || 0"
              :current-page="currentPage"
              :page-size="pageSize"
              :has-previous-page="pagination?.currentPage > 1 || false"
              :has-next-page="pagination?.currentPage < pagination?.totalPages || false"
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
// Make this page client-side only to avoid SSR/build issues
definePageMeta({
  ssr: false,
  middleware: 'auth-guard'
});

import { ref, computed, defineAsyncComponent, onMounted, nextTick, watch } from 'vue'
import { isLogged } from '../lib/isLogged'

// Lazy load the chart component - ensure it's only loaded on client
const InteractiveGraph = defineAsyncComponent({
  loader: () => import('~/components/Graphs/InteractiveGraph.client.vue'),
  loadingComponent: null,
  errorComponent: null,
  delay: 200,
  timeout: 3000
});

// Authentication state
const isLoggedIn = ref(false)

const manufacturerNameFilter = ref('')
const processorTypeFilter = ref('')
const familyFilter = ref('')
const codeNameFilter = ref('')
const microarchitectureFilter = ref('')

// Pagination state
const currentPage = ref(1)
const pageSize = ref(100)

// Data refs - initialize as empty to prevent errors before data loads
const data = ref(null)
const pagination = ref(null)
const chartDataRef = ref([]) // Separate ref for chart data to prevent UI blocking
const pending = ref(true)
const error = ref(null)
const hasInitialized = ref(false)

// Function to fetch SOC data - called after components are ready
// Phase 3: Updated to use chart-data endpoint for chart, keep paginated endpoint for table
async function fetchSocsData(forceRefresh = false) {
  // Ensure we're on the client
  if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.server)) {
    console.log('[SOC List] Skipping fetch on server');
    return;
  }

  try {
    pending.value = true;
    error.value = null;

    // Use Nuxt server API route (like CPU/GPU/FPGA pages) - ensures proper component loading order
    // Add pagination parameters to URL (backend expects pageSize, not limit)
    const cacheBust = forceRefresh ? `&refresh=true&_t=${Date.now()}` : '';
    const url = `/api/socs?page=${currentPage.value}&pageSize=${pageSize.value}${cacheBust}`;
    
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SoC/list.vue:fetchSocsData',message:'Fetching from Nuxt API route',data:{url:url,forceRefresh:forceRefresh},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    }
    // #endregion

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: forceRefresh ? 'no-cache' : 'default'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch SOCs: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SoC/list.vue:fetchSocsData',message:'Transform function called',data:{response:responseData,hasData:!!responseData?.data,dataIsArray:Array.isArray(responseData?.data),dataLength:responseData?.data?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    }
    // #endregion

    // Handle paginated response - API returns { data: [...], pagination: {...} }
    const socsArray = responseData?.data || (Array.isArray(responseData) ? responseData : []);
    const paginationData = responseData?.pagination || null;
    
    if (!socsArray || !Array.isArray(socsArray)) {
      // #region agent log
      if (typeof fetch !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SoC/list.vue:fetchSocsData',message:'Transform returning empty array',data:{socsArray:socsArray},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      }
      // #endregion
      data.value = [];
      pending.value = false;
      return;
    }

    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SoC/list.vue:fetchSocsData',message:'Transform calling map on socsArray',data:{dataLength:socsArray.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    }
    // #endregion

    data.value = socsArray.map(soc => ({
      ...soc,
      manufacturer: soc.manufacturer?.name || soc.manufacturer,
      code_name: soc.code_name || (soc.processors && soc.processors[0]?.code_name)
    }));

    // Store pagination metadata
    pagination.value = paginationData;
    
    // Update currentPage if pagination data indicates a different page
    if (paginationData && paginationData.currentPage) {
      currentPage.value = paginationData.currentPage;
    }

    pending.value = false;
    
    // Phase 3: Fetch chart data in background (non-critical, uses optimized endpoint)
    // This ensures table renders immediately while chart data loads
    // Chart data is kept separate from table data to prevent UI blocking
    const chartUrl = `/api/socs/chart-data${forceRefresh ? `?refresh=true&_t=${Date.now()}` : ''}`;
    fetch(chartUrl)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then(chartResponse => {
        const chartData = chartResponse.data || []
        if (chartData.length > 0) {
          console.log('[SOC List] Chart data loaded:', chartData.length, 'records')
          // Store chart data separately - don't merge into main data to avoid blocking
          // The chart component will use this data directly
          chartDataRef.value = chartData.map(soc => ({
            ...soc,
            manufacturer_name: soc.manufacturer_name || soc.manufacturer?.name || soc.manufacturer,
          }))
        }
      })
      .catch(err => {
        console.error('[SOC List] Error fetching chart data (non-critical):', err)
        // Don't throw - chart data is optional
      })
  } catch (err) {
    console.error('[SOC List] Error fetching data:', err);
    error.value = err;
    pending.value = false;
    data.value = [];
  }
}

// Initialize data after component is mounted and components/plugins are ready
onMounted(async () => {
  // Ensure we're on the client
  if (typeof window === 'undefined') {
    console.log('[SOC List] onMounted - skipping on server');
    return;
  }
  
  console.log('[SOC List] onMounted - initializing data...');
  
  // Check authentication status
  isLoggedIn.value = isLogged();
  
  // Wait for next tick to ensure DOM and plugins are ready
  await nextTick();
  
  // Only initialize if we don't have data yet
  if (!hasInitialized.value || !data.value || data.value.length === 0) {
    try {
      await fetchSocsData();
      hasInitialized.value = true;
      console.log('[SOC List] onMounted completed successfully');
    } catch (err) {
      console.error('[SOC List] Error in onMounted:', err);
    }
  } else {
    console.log('[SOC List] onMounted - data already loaded, skipping');
  }
});

// Table data - ensure it's always an array for the template
const tableData = computed(() => {
  if (!data.value || !Array.isArray(data.value)) {
    return [];
  }
  return data.value.filter(item => {
    const matchesManufacturer =
      !manufacturerNameFilter.value ||
      slugify(item.manufacturer_name) === manufacturerNameFilter.value

    const matchesProcessorType =
      !processorTypeFilter.value ||
      item.processors?.some(proc =>
        proc.processor_type &&
        slugify(proc.processor_type) === processorTypeFilter.value
      )

    const matchesFamily =
      !familyFilter.value ||
      item.processors?.some(proc =>
        proc.family &&
        slugify(proc.family) === familyFilter.value
      )

    const matchesCodeName =
      !codeNameFilter.value ||
      item.processors?.some(proc =>
        proc.code_name &&
        slugify(proc.code_name) === codeNameFilter.value
      )

    const matchesMicroarchitecture =
      !microarchitectureFilter.value ||
      item.processors?.some(proc =>
        proc.microarchitecture &&
        slugify(proc.microarchitecture) === microarchitectureFilter.value
      )

    return (
      matchesManufacturer &&
      matchesProcessorType &&
      matchesFamily &&
      matchesCodeName &&
      matchesMicroarchitecture
    )
  })
})

// Chart data - use chartDataRef directly
const chartData = computed(() => {
  if (!chartDataRef.value || !Array.isArray(chartDataRef.value)) {
    return [];
  }
  return chartDataRef.value;
})

// Helper function to slugify strings for filtering
function slugify(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/[^\w- ]+/g, '') // Allow hyphens by excluding them from the pattern
    .replace(/ +/g, '-')      // Replace spaces with hyphens
}

// Handle page size change - reset to page 1 and refetch
function handlePageSizeChange(newPageSize) {
  pageSize.value = newPageSize;
  currentPage.value = 1;
  fetchSocsData();
}

// Error handling
const handleRefresh = async () => {
  try {
    console.log('Refreshing SoC data...');
    // Force refresh with cache bypass
    await fetchSocsData(true);
    console.log('SoC data refreshed successfully');
  } catch (err) {
    console.error('Failed to refresh data:', err);
  }
};

// Watch pagination and refetch when it changes
// Watch for pagination changes - only after initial load
watch([currentPage, pageSize], (newValues, oldValues) => {
  console.log('[SOC List] Pagination changed:', { newValues, oldValues, hasInitialized: hasInitialized.value });
  // Only refetch if:
  // 1. We've already initialized (hasInitialized is true)
  // 2. Values actually changed (not initial setup)
  if (hasInitialized.value && oldValues && (oldValues[0] !== newValues[0] || oldValues[1] !== newValues[1])) {
    console.log('[SOC List] Pagination values changed, refetching...');
    fetchSocsData();
  } else {
    console.log('[SOC List] Skipping pagination refetch - not initialized yet or no change');
  }
}, { immediate: false });
</script>
