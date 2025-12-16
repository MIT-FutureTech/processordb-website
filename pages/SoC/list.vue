<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">
        SOCs
      </h1>
      <NuxtLink
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
            <InteractiveGraph v-if="chartDataRef && chartDataRef.length > 0" :data="chartDataRef" />
            <div v-else-if="pending" class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="flex flex-col items-center space-y-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
                <div class="text-gray-500">Loading chart...</div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="text-gray-500">No chart data available</div>
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

    <!-- Table Container -->
    <div class="mt-8 bg-white mb-16">
      <div class="overflow-x-auto">
        <PrivateTable
          :data="filterData"
          class-name="soc"
        />
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="js">
// Make this page client-side only to avoid SSR/build issues
definePageMeta({
  ssr: false
});

import { ref, computed, defineAsyncComponent, onMounted, nextTick } from 'vue'

// Lazy load the chart component
const InteractiveGraph = defineAsyncComponent(() => import('~/components/Graphs/InteractiveGraph.client.vue'));

const manufacturerNameFilter = ref('')
const processorTypeFilter = ref('')
const familyFilter = ref('')
const codeNameFilter = ref('')
const microarchitectureFilter = ref('')

// Data refs - initialize as empty to prevent errors before data loads
const data = ref(null)
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
    const cacheBust = forceRefresh ? `?refresh=true&_t=${Date.now()}` : '';
    const url = `/api/socs${cacheBust}`;
    
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

    // Handle both { data: [...] } and direct array responses
    const socsArray = responseData?.data || (Array.isArray(responseData) ? responseData : []);
    
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
  console.log('[SOC List] onMounted - initializing data...');
  
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

const filterData = computed(() => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SoC/list.vue:77',message:'filterData computed - data.value check',data:{dataValue:data.value,dataValueType:typeof data.value,dataValueIsNull:data.value === null,dataValueIsUndefined:data.value === undefined,dataValueIsArray:Array.isArray(data.value)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  if (!data.value || !Array.isArray(data.value)) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SoC/list.vue:79',message:'filterData returning empty array - data.value invalid',data:{dataValue:data.value,dataValueType:typeof data.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return [];
  }
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SoC/list.vue:84',message:'filterData calling filter - data.value is valid array',data:{dataValueLength:data.value.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
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

// Helper function to slugify strings for filtering
function slugify(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/[^\w- ]+/g, '') // Allow hyphens by excluding them from the pattern
    .replace(/ +/g, '-')      // Replace spaces with hyphens
}
</script>
