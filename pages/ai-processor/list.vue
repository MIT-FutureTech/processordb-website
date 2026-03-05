<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">
        AI Processors
      </h1>
      <NuxtLink
        v-if="isLoggedIn"
        to="/ai-processor/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2">Add AI Processor</span>
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
            <AIProcessorsGraph v-if="chartData && chartData.length > 0" :data="chartData" />
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="text-gray-500">No chart data available</div>
            </div>
            
            <!-- Chart Data Status -->
            <div v-if="chartData && chartData.length > 0" class="mt-4 flex justify-center">
              <div class="text-sm text-gray-500">
                {{ allAiProcessorsData.length }} records visualized
                <span v-if="allAiProcessorsData.length > 10000" class="text-xs block mt-1 opacity-75">
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
            <p class="text-gray-600 font-medium mb-2">No AI Processor data available</p>
            <p class="text-gray-500 text-sm">The database is empty. Add an AI Processor to get started.</p>
          </div>
        </div>
        
        <!-- Data Table -->
        <template v-else-if="!error && tableData.length > 0">
          <div class="overflow-x-auto">
            <PrivateTable
              :data="tableData"
              class-name="aiProcessor"
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
definePageMeta({
  ssr: false
});

import { ref, computed, onMounted, watch, onUnmounted, defineAsyncComponent } from 'vue';
import { isLogged } from '../lib/isLogged';
import { useAiProcessors } from '~/composables/useApi';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import PrivateTable from '@/components/PrivateTable.vue';

// Lazy load the chart component
const AIProcessorsGraph = defineAsyncComponent(() => import('~/components/Graphs/AIProcessorsGraph.client.vue'));

// Use API composable
const { data: aiProcessorsData, chartData: allAiProcessorsData, pagination, pending, error, fetchData, fetchChartData } = useAiProcessors();

const isLoggedIn = ref(false);
const currentPage = ref(1);
const pageSize = ref(100);

const totalAvailableRecords = ref(null);

let isFirstLoad = true;
let aiProcessorChartRefreshInterval = null;
let lastAiProcessorChartRefresh = 0;
const CHART_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function fetchAiProcessorsData(forceRefresh = false) {
  if (process.server) return;
  
  try {
    // Use composable's fetchData method
    await fetchData({
      page: currentPage.value,
      limit: pageSize.value,
      forceRefresh: forceRefresh || !isFirstLoad
    });
    
    // Update currentPage if pagination data indicates a different page
    if (pagination.value && pagination.value.page) {
      currentPage.value = pagination.value.page;
    }
    
    isFirstLoad = false;
  } catch (err) {
    console.error('[AI Processor List] Fetch error:', err);
    throw err; // Re-throw for caller to handle
  }
}

async function fetchAllChartData(forceRefresh = false) {
  if (process.server) {
    console.log('[AI Processor Chart] fetchAllChartData called on server, skipping');
    return;
  }
  
  const now = Date.now();
  if (!forceRefresh && (now - lastAiProcessorChartRefresh) < CHART_REFRESH_INTERVAL) {
    console.log('[AI Processor Chart] Skipping refresh - too soon since last refresh');
    return;
  }
  
  try {
    console.log('[AI Processor Chart] Fetching chart data using composable..., forceRefresh:', forceRefresh);
    
    // Use composable's fetchChartData method if available, otherwise fetch all data
    if (fetchChartData) {
      await fetchChartData(forceRefresh);
      if (allAiProcessorsData.value && allAiProcessorsData.value.length > 0) {
        totalAvailableRecords.value = allAiProcessorsData.value.length;
      }
    } else {
      // Fallback: fetch all data for chart
      await fetchData({
        page: 1,
        limit: 100000,
        forceRefresh: forceRefresh
      });
      allAiProcessorsData.value = aiProcessorsData.value;
      totalAvailableRecords.value = aiProcessorsData.value.length;
    }
    
    lastAiProcessorChartRefresh = Date.now();
    console.log('[AI Processor Chart] Chart data loaded:', allAiProcessorsData.value.length, 'records');
  } catch (err) {
    console.error('[AI Processor Chart] Fetch error:', err);
  }
}

function setupChartRefresh() {
  if (aiProcessorChartRefreshInterval) {
    clearInterval(aiProcessorChartRefreshInterval);
  }
  
  aiProcessorChartRefreshInterval = setInterval(() => {
    console.log('[AI Processor Chart] Periodic refresh triggered');
    fetchAllChartData(false);
  }, CHART_REFRESH_INTERVAL);
  
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', () => {
      const now = Date.now();
      if ((now - lastAiProcessorChartRefresh) > 60000) {
        console.log('[AI Processor Chart] Page focus refresh triggered');
        fetchAllChartData(false);
      }
    });
  }
}

const tableData = computed(() => aiProcessorsData.value);
const chartData = computed(() => {
  const value = allAiProcessorsData.value;
  return value;
});

const handleRefresh = async () => {
  console.log('[AI Processor List] Manual refresh triggered');
  currentPage.value = 1;
  await fetchAiProcessorsData(true);
  await fetchAllChartData(true);
};

function handlePageSizeChange(newPageSize) {
  pageSize.value = newPageSize;
  currentPage.value = 1;
  fetchAiProcessorsData();
}

watch([currentPage, pageSize], () => {
  if (!isFirstLoad) {
    fetchAiProcessorsData();
  }
}, { immediate: false });

onMounted(async () => {
  isLoggedIn.value = isLogged();
  await fetchAiProcessorsData();
  await fetchAllChartData();
  setupChartRefresh();
});

onUnmounted(() => {
  if (aiProcessorChartRefreshInterval) {
    clearInterval(aiProcessorChartRefreshInterval);
    aiProcessorChartRefreshInterval = null;
  }
});
</script>
