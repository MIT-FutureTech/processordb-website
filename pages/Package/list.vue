<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">
        Packages
      </h1>
      <NuxtLink
        v-show="isLoggedIn"
        to="/package/form"
        @click="handleAddPackageClick"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2">Add Package</span>
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
            <p class="text-gray-600 font-medium mb-2">No Package data available</p>
            <p class="text-gray-500 text-sm">The database is empty. Add a Package to get started.</p>
          </div>
        </div>
        
        <!-- Data Table -->
        <template v-else-if="!error && tableData.length > 0">
          <div class="overflow-x-auto">
            <PrivateTable
              :data="tableData"
              class-name="package"
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
// Make this page client-side only to avoid SSR/build issues
definePageMeta({
  ssr: false
});

import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { usePackages } from '~/composables/useApi'
import { isLogged } from '../lib/isLogged'

// Pagination state
const currentPage = ref(1)
const pageSize = ref(100)

// Use API composable
const { data: packagesData, pagination, pending, error, fetchData } = usePackages();

// Alias for compatibility
const data = packagesData
const hasInitialized = ref(false)
const isLoggedIn = ref(false)

// Function to format component ID with type prefix
function formatComponentId(componentType, componentId) {
  const prefixMap = {
    'CPU': 'CPU',
    'GPU': 'GPU',
    'FPGA': 'FPGA',
    'AIProcessor': 'AI'
  };
  const prefix = prefixMap[componentType] || componentType;
  return `${prefix}-${componentId}`;
}

// Function to fetch Package data using composable
async function fetchPackagesData(forceRefresh = false) {
  // Ensure we're on the client
  if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.server)) {
    console.log('[Package List] Skipping fetch on server');
    return;
  }

  try {
    // Use composable's fetchData method
    await fetchData({
      page: currentPage.value,
      limit: pageSize.value,
      forceRefresh: forceRefresh
    });
    
    // Data is already transformed by API with component_name, manufacturer, and component_type_display
    // No additional transformation needed
    
    // Update currentPage if pagination data indicates a different page
    if (pagination.value && pagination.value.page) {
      currentPage.value = pagination.value.page;
    }
  } catch (err) {
    console.error('[Package List] Error fetching data:', err);
    throw err; // Re-throw for caller to handle
  }
}

// Initialize data after component is mounted and components/plugins are ready
onMounted(async () => {
  // Ensure we're on the client
  if (typeof window === 'undefined') {
    console.log('[Package List] onMounted - skipping on server');
    return;
  }
  
  console.log('[Package List] onMounted - initializing data...');
  
  // Check authentication status
  isLoggedIn.value = isLogged();
  
  // Wait for next tick to ensure DOM and plugins are ready
  await nextTick();
  
  // Only initialize if we don't have data yet
  if (!hasInitialized.value || !data.value || data.value.length === 0) {
    try {
      await fetchPackagesData();
      hasInitialized.value = true;
      console.log('[Package List] onMounted completed successfully');
    } catch (err) {
      console.error('[Package List] Error in onMounted:', err);
    }
  } else {
    console.log('[Package List] onMounted - data already loaded, skipping');
  }
});

// Table data - ensure it's always an array for the template
const tableData = computed(() => {
  if (!data.value || !Array.isArray(data.value)) {
    return [];
  }
  return data.value;
})

// Handle page size change - reset to page 1 and refetch
function handlePageSizeChange(newPageSize) {
  pageSize.value = newPageSize;
  currentPage.value = 1;
  fetchPackagesData();
}

// Error handling
const handleRefresh = async () => {
  try {
    console.log('Refreshing Package data...');
    // Force refresh with cache bypass
    await fetchPackagesData(true);
    console.log('Package data refreshed successfully');
  } catch (err) {
    console.error('Failed to refresh data:', err);
  }
};

// Watch pagination and refetch when it changes
watch([currentPage, pageSize], (newValues, oldValues) => {
  console.log('[Package List] Pagination changed:', { newValues, oldValues, hasInitialized: hasInitialized.value });
  // Only refetch if:
  // 1. We've already initialized (hasInitialized is true)
  // 2. Values actually changed (not initial setup)
  if (hasInitialized.value && oldValues && (oldValues[0] !== newValues[0] || oldValues[1] !== newValues[1])) {
    console.log('[Package List] Pagination values changed, refetching...');
    fetchPackagesData();
  } else {
    console.log('[Package List] Skipping pagination refetch - not initialized yet or no change');
  }
}, { immediate: false });

// Handle add package button click
function handleAddPackageClick(event) {
  console.log('[Package List] Add package button clicked', { isLoggedIn: isLoggedIn.value, targetRoute: '/package/form' });
}
</script>
