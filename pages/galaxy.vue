<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50">
      <!-- Feature flag check -->
      <div v-if="!enableGalaxy" class="flex items-center justify-center min-h-screen">
        <div class="text-center p-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-4">Galaxy Visualization Disabled</h1>
          <p class="text-gray-600">
            This feature is currently disabled. Set NUXT_PUBLIC_ENABLE_GALAXY=true to enable.
          </p>
        </div>
      </div>

    <!-- Main content - Full screen black background -->
    <div v-else class="relative min-h-screen bg-black">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A32035] mx-auto mb-4"></div>
          <p class="text-gray-300">Loading processor data...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
        <div class="bg-red-900 bg-opacity-80 border border-red-700 rounded-lg p-6 max-w-md">
          <h2 class="text-lg font-semibold text-red-200 mb-2">Error Loading Data</h2>
          <p class="text-red-300">{{ error }}</p>
        </div>
      </div>

      <!-- Main visualization area -->
      <div v-else-if="embeddingData" class="relative w-full h-screen">
        <!-- 3D Visualization - Full screen -->
        <div class="absolute inset-0">
          <ProcessorGalaxy3D
            v-if="embeddingData"
            :processors="filteredProcessors"
            :clusters="embeddingData.clusters"
            :selected-cluster="selectedCluster"
            :display-mode="displayMode"
            :color-by="colorBy"
            @select-processor="handleProcessorSelect"
            @select-cluster="handleClusterSelect"
          />
        </div>

        <!-- Overlay - Left sidebar - Filters -->
        <div class="absolute left-4 top-4 z-10 space-y-3 max-w-xs">
          <ManufacturerFilter
            :manufacturers="manufacturers"
            :selected="selectedManufacturers"
            @update:selected="selectedManufacturers = $event"
          />
          <YearFilter
            :years="availableYears"
            :selected="selectedYears"
            @update:selected="selectedYears = $event"
          />
          <ProcessorTypeFilter
            :types="['CPU', 'GPU', 'FPGA']"
            :selected="selectedTypes"
            @update:selected="selectedTypes = $event"
          />
          <DisplayModeFilter
            :mode="displayMode"
            @update:mode="displayMode = $event"
          />
        </div>

        <!-- Overlay - Top center - Controls -->
        <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div class="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg px-3 py-2 flex flex-wrap items-center gap-3 text-xs text-gray-300 border border-gray-700">
            <div class="flex items-center gap-2">
              <span class="font-medium text-xs">Controls:</span>
              <span class="text-xs">Drag • Scroll • Click</span>
            </div>
            <div class="flex gap-2">
              <button
                @click="resetView"
                class="px-2 py-1 bg-[#A32035] text-white hover:bg-[#8a1b2d] rounded transition-colors text-xs font-medium"
              >
                Reset
              </button>
              <button
                @click="toggleLegend"
                class="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors text-xs font-medium"
              >
                {{ showLegend ? 'Hide' : 'Show' }} Legend
              </button>
            </div>
            <div class="flex items-center gap-2 border-l border-gray-700 pl-3">
              <label class="text-xs font-medium text-gray-400">Color:</label>
              <button
                @click="colorBy = 'type'"
                :class="[
                  'px-2 py-1 rounded text-xs transition-colors',
                  colorBy === 'type' ? 'bg-[#A32035] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                Type
              </button>
              <button
                @click="colorBy = 'cluster'"
                :class="[
                  'px-2 py-1 rounded text-xs transition-colors',
                  colorBy === 'cluster' ? 'bg-[#A32035] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                Cluster
              </button>
            </div>
          </div>
        </div>

        <!-- Overlay - Right sidebar - Selection and Clusters -->
        <div class="absolute right-4 top-24 z-10 space-y-3 max-w-xs">
          <SelectionPanel
            :selection="currentSelection"
            :type="selectionType"
            :trends-data="selectionTrendsData"
          />
          <ClusterList
            :clusters="embeddingData.clusters"
            :selected="selectedCluster"
            @select="handleClusterSelect"
          />
        </div>

      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue';
import { useRuntimeConfig } from '#app';

// Components (will be created next - using placeholder components for now)
// These will be created in subsequent steps
const ManufacturerFilter = defineAsyncComponent({
  loader: () => import('@/components/Galaxy/ManufacturerFilter.vue'),
  loadingComponent: () => null,
  errorComponent: () => null,
  delay: 200,
  timeout: 3000
});

const YearFilter = defineAsyncComponent({
  loader: () => import('@/components/Galaxy/YearFilter.vue'),
  loadingComponent: () => null,
  errorComponent: () => null,
  delay: 200,
  timeout: 3000
});

const ProcessorTypeFilter = defineAsyncComponent({
  loader: () => import('@/components/Galaxy/ProcessorTypeFilter.vue'),
  loadingComponent: () => null,
  errorComponent: () => null,
  delay: 200,
  timeout: 3000
});

const DisplayModeFilter = defineAsyncComponent({
  loader: () => import('@/components/Galaxy/DisplayModeFilter.vue'),
  loadingComponent: () => null,
  errorComponent: () => null,
  delay: 200,
  timeout: 3000
});

const ProcessorGalaxy3D = defineAsyncComponent({
  loader: () => import('@/components/Galaxy/ProcessorGalaxy3D.client.vue'),
  loadingComponent: () => null,
  errorComponent: () => null,
  delay: 200,
  timeout: 3000
});

const ClusterList = defineAsyncComponent({
  loader: () => import('@/components/Galaxy/ClusterList.vue'),
  loadingComponent: () => null,
  errorComponent: () => null,
  delay: 200,
  timeout: 3000
});

const SelectionPanel = defineAsyncComponent({
  loader: () => import('@/components/Galaxy/SelectionPanel.vue'),
  loadingComponent: () => null,
  errorComponent: () => null,
  delay: 200,
  timeout: 3000
});

// TrendChart removed - trends now shown in SelectionPanel

// Feature flag
const config = useRuntimeConfig();
const enableGalaxy = computed(() => config.public.enableGalaxy || false);

// State
const loading = ref(true);
const error = ref(null);
const embeddingData = ref(null);
const trendsData = ref(null);
const selectedManufacturers = ref([]);
const selectedYears = ref([]);
const selectedTypes = ref(['CPU', 'GPU', 'FPGA']);
const displayMode = ref('processor'); // 'processor' or 'cluster'
const colorBy = ref('cluster'); // 'manufacturer', 'type', 'cluster'
const selectedCluster = ref(null);
const selectedProcessor = ref(null); // Track individual processor selection
const currentSelection = ref(null);
const selectionType = ref(null); // 'processor' or 'cluster'
const selectionTrendsData = ref(null); // Trends data for selected processor
const showLegend = ref(true);

// Computed
const manufacturers = computed(() => {
  if (!embeddingData.value || !embeddingData.value.processors) return [];
  const mfrs = new Set();
  embeddingData.value.processors.forEach(p => {
    if (p.manufacturer) mfrs.add(p.manufacturer);
  });
  return Array.from(mfrs).sort();
});

const availableYears = computed(() => {
  if (!trendsData.value || !trendsData.value.byYear) return [];
  return trendsData.value.byYear.map(t => t.year).sort().reverse();
});

const filteredProcessors = computed(() => {
  if (!embeddingData.value || !embeddingData.value.processors) return [];
  let filtered = [...embeddingData.value.processors];
  
  // Filter by type
  if (selectedTypes.value.length < 3) {
    filtered = filtered.filter(p => selectedTypes.value.includes(p.type));
  }
  
  // Filter by selected years if any are selected
  if (selectedYears.value.length > 0) {
    filtered = filtered.filter(p => {
      if (p.release_year) {
        return selectedYears.value.includes(p.release_year);
      }
      return false; // Hide processors without release year if years are selected
    });
  }
  
  // Filter by selected manufacturers if any are selected
  if (selectedManufacturers.value.length > 0) {
    filtered = filtered.filter(p => {
      if (p.manufacturer) {
        return selectedManufacturers.value.includes(p.manufacturer);
      }
      return false; // Hide processors without manufacturer if manufacturers are selected
    });
  }
  
  // Don't filter by selected cluster - keep all processors visible for highlighting
  // The 3D component will handle visual highlighting of the selected cluster
  
  return filtered;
});

// Methods
async function loadData() {
  if (!enableGalaxy.value) {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    // Load embedding and clusters
    const [embeddingResponse, trendsResponse] = await Promise.all([
      $fetch('/api/processors/embedding'),
      $fetch('/api/processors/trends')
    ]);

    // Sanitize positions client-side as fallback (fix null/NaN values)
    if (embeddingResponse && embeddingResponse.processors) {
      embeddingResponse.processors = embeddingResponse.processors.map(p => {
        const rawPosition = p.position;
        if (rawPosition && Array.isArray(rawPosition) && rawPosition.length === 3) {
          const sanitized = rawPosition.map(v => (typeof v === 'number' && !isNaN(v) && v != null) ? v : 0);
          if (rawPosition.some(v => v == null || isNaN(v))) {
            p.position = sanitized;
          }
        } else if (!rawPosition || !Array.isArray(rawPosition) || rawPosition.length !== 3) {
          p.position = [0, 0, 0];
        }
        return p;
      });
    }

    embeddingData.value = embeddingResponse;
    trendsData.value = trendsResponse;
  } catch (err) {
    console.error('Error loading galaxy data:', err);
    error.value = err.message || 'Failed to load processor data';
  } finally {
    loading.value = false;
  }
}

async function handleProcessorSelect(processor) {
  selectedProcessor.value = processor;
  currentSelection.value = processor;
  selectionType.value = 'processor';
  selectedCluster.value = embeddingData.value?.clusters?.find(c => c.cluster_id === processor.cluster_id);
  selectionTrendsData.value = null;
  
  // Load full processor details and trends
  try {
    const processorType = processor.type.toLowerCase();
    const processorId = processor.processor_id;
    
    // Fetch full processor details
    const processorDetails = await $fetch(`/api/${processorType}/${processorId}`);
    
    // Merge with existing processor data
    currentSelection.value = {
      ...processor,
      ...processorDetails,
      model: processorDetails.model || processorDetails.name || 'Unknown',
      manufacturer: processorDetails.SoC?.Manufacturer?.name || 'Unknown',
      specs: {
        clock: processorDetails.clock || processorDetails.base_clock || null,
        cores: processorDetails.core_count || null,
        tdp: processorDetails.tdp || processorDetails.SoC?.tdp || null,
        architecture: processorDetails.architecture || processorDetails.microarchitecture || null
      }
    };
    
    // Fetch trends for this processor's manufacturer and type
    const trendsResponse = await $fetch(`/api/processors/trends?manufacturer=${encodeURIComponent(currentSelection.value.manufacturer)}&type=${processor.type}`);
    selectionTrendsData.value = trendsResponse;
  } catch (err) {
    console.error('Error loading processor details:', err);
    // Keep basic processor data even if details fail
  }
  
  // Highlight the cluster
  if (processor.cluster_id !== undefined) {
    selectedCluster.value = embeddingData.value?.clusters?.find(c => c.cluster_id === processor.cluster_id);
  }
}

function handleClusterSelect(cluster) {
  selectedCluster.value = cluster;
  selectionType.value = 'cluster';
  // Load cluster details
  loadClusterDetails(cluster.cluster_id);
}

async function loadClusterDetails(clusterId) {
  try {
    const clusterData = await $fetch(`/api/processors/clusters/${clusterId}`);
    currentSelection.value = clusterData;
  } catch (err) {
    console.error('Error loading cluster details:', err);
  }
}

function resetView() {
  // Reset 3D view - will be handled by component
  selectedCluster.value = null;
  currentSelection.value = null;
  selectionType.value = null;
  selectionTrendsData.value = null;
}

function toggleLegend() {
  showLegend.value = !showLegend.value;
}

// Lifecycle
onMounted(() => {
  if (enableGalaxy.value) {
    loadData();
  }
});

// Watch for filter changes
watch([selectedManufacturers, selectedYears, selectedTypes], () => {
  // Filters will be applied in computed properties
});

// Watch for embedding data changes to extract manufacturers
watch(() => embeddingData.value, async (newData) => {
  if (newData && newData.clusters && newData.clusters.length > 0) {
    // Load cluster details to get manufacturer information
    // This is a simplified approach - in production, you might want to fetch all cluster details
    // or include manufacturer info in the initial embedding response
  }
}, { immediate: true });
</script>

<style scoped>
/* Additional styles for galaxy page */
@media (max-width: 1024px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>

