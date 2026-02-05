<template>
  <div class="scatter-plot">
    <div class="flex flex-col sm:flex-row sm:justify-space-between flex-wrap gap-4 items-center mb-4">
      <!-- X-Axis Selection -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-center gap-4 flex-1">
        <div>
          <label class="text-gray-700 block text-xs mb-0.5">X-Axis</label>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="bg-gray-50 hover:bg-gray-100 flex items-center gap-2 rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring text-base">
              {{ xAxis?.label || "Select X-Axis" }}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent :side-offset="0" align="start" class="w-full left-0">
              <DropdownMenuItem v-for="option in xAxisOptions" :key="option.value + '-' + option.source"
                class="cursor-pointer" @click="xAxis = option">
                {{ option.label }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span class="text-gray-500 text-lg p-1 flex items-center justify-center gap-2 font-thin">X</span>
        <!-- Y-Axis Selection -->
        <div>
          <label class="text-gray-700 block text-xs mb-0.5">Y-Axis</label>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="bg-gray-50 hover:bg-gray-100 flex items-center gap-2 rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring text-base">
              {{ yAxis?.label || "Select Y-Axis" }}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent :side-offset="0" align="start" class="w-full left-0">
              <DropdownMenuItem v-for="option in yAxisOptions" :key="option.value + '-' + option.source"
                class="cursor-pointer" @click="yAxis = option">
                {{ option.label }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <!-- Group By Selection (remains static) -->
      <div>
        <label class="text-gray-700 block text-xs mb-0.5">Group By</label>
        <DropdownMenu>
          <DropdownMenuTrigger
            class="bg-gray-50 hover:bg-gray-100 flex items-center gap-2 rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring text-base">
            {{ groupBy?.label || "Select Group By" }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent :side-offset="0" align="start" class="w-full left-0">
            <DropdownMenuItem v-for="option in filteredGroupOptions" :key="option.value" class="cursor-pointer"
              @click="groupBy = option">
              {{ option.label }}
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    <div v-if="chartError" class="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
      <div class="text-center">
        <p class="text-red-800 font-medium">Error loading chart</p>
        <p class="text-red-600 text-sm mt-2">{{ chartError }}</p>
      </div>
    </div>
    <ClientOnly v-else>
      <highcharts v-if="chartOptions" :options="chartOptions" />
      <div v-else class="flex items-center justify-center h-64 text-gray-500">
        Loading chart...
      </div>
      <template #fallback>
        <div class="flex items-center justify-center h-64 text-gray-500">
          Loading chart...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
import { computed, ref, onErrorCaptured, onMounted } from 'vue';
import { 
  calculateDataDensity, 
  binData, 
  clusterData, 
  createHeatmap,
  detectDenseRegions 
} from '@/lib/chartUtils';
import { getNumericOptions, getCategoricalOptions, generateNumericOptionsFromData, generateCategoricalOptionsFromData, validateFieldMaps } from '@/lib/chartFieldMaps';
// import { useRoute } from 'vue-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu/dropdown-menu-index';

// Error handling for chart component
const chartError = ref(null);
onErrorCaptured((err) => {
  console.error('Chart component error:', err);
  chartError.value = err.message || 'An error occurred while rendering the chart';
  return false; // Prevent error from propagating
});

// Props: Expect an array of GPU data points
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const convertString = (str) => {
  return str.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Performance optimization: Memoize expensive computations
// const memoizedData = ref(null);
// const lastDataHash = ref('');

// Create a hash of the data to detect changes
// const createDataHash = (data) => {
//   if (!data || !data.length) return '';
//   return JSON.stringify(data.map(item => ({
//     gpu_id: item.gpu_id,
//     family: item.family,
//     microarchitecture: item.microarchitecture,
//     // Only include key fields for hashing
//   })));
// };

// Comprehensive numeric options for X and Y axes from field map
// Falls back to dynamic generation if data structure differs
const numericOptions = computed(() => {
  // Use comprehensive field map first
  const fieldMapOptions = getNumericOptions('gpu');
  
  // If we have data, verify fields exist and filter to available ones
  if (props.data && props.data.length > 0) {
    // Validate field maps against actual data
    validateFieldMaps(fieldMapOptions, props.data, 'gpu');
    
    const sample = props.data[0];
    const availableFields = new Set();
    
    // Check top-level fields
    for (const key in sample) {
      if (typeof sample[key] === 'number' || key === 'release_date') {
        availableFields.add(key);
      }
    }
    
    // Check nested SoC fields
    if (sample.SoC) {
      for (const key in sample.SoC) {
        if (typeof sample.SoC[key] === 'number' || key === 'release_date') {
          availableFields.add(key);
        }
      }
    }
    
    // Filter field map options to only include available fields
    const filtered = fieldMapOptions.filter(opt => {
      // For soc source, check both flattened and nested
      if (opt.source === 'soc') {
        return availableFields.has(opt.value) || 
               (sample.SoC && sample.SoC.hasOwnProperty(opt.value)) ||
               sample.hasOwnProperty(opt.value);
      }
      return availableFields.has(opt.value) || sample.hasOwnProperty(opt.value);
    });
    
    // If filtered list is empty or very small, fall back to dynamic generation
    if (filtered.length < 3 && props.data.length > 0) {
      const dynamicOptions = generateNumericOptionsFromData(props.data, 'gpu');
      if (dynamicOptions.length > filtered.length) {
        console.warn('[GPUsGraph] Field map incomplete, using dynamic field detection');
        return dynamicOptions;
      }
    }
    
    return filtered;
  }
  
  return fieldMapOptions;
});

// X-Axis options exclude the selected Y-axis value
const xAxisOptions = computed(() => {
  let options = numericOptions.value;
  // Exclude the selected Y-axis value from X-axis options
  if (yAxis.value && yAxis.value.value) {
    options = options.filter(opt => opt.value !== yAxis.value.value);
  }
  return options;
});

// Y-Axis options exclude release_date and the selected X-axis value
const yAxisOptions = computed(() => {
  let options = numericOptions.value.filter(option => option.value !== 'release_date');
  // Exclude the selected X-axis value from Y-axis options
  if (xAxis.value && xAxis.value.value) {
    options = options.filter(opt => opt.value !== xAxis.value.value);
  }
  return options;
});

// Comprehensive Group By options for GPU data from field map
const groupOptions = getCategoricalOptions('gpu');

const filteredGroupOptions = computed(() => {
  // Filter to only include fields that exist in the data
  if (props.data && props.data.length > 0) {
    const sample = props.data[0];
    const filtered = groupOptions.filter(opt => {
      if (opt.source === 'soc') {
        // Check both flattened and nested structures
        return sample.hasOwnProperty(opt.value) || 
               (sample.SoC && sample.SoC.hasOwnProperty(opt.value)) ||
               (opt.value === 'manufacturer_name' && (sample.manufacturer_name || sample.SoC?.Manufacturer));
      }
      return sample.hasOwnProperty(opt.value);
    });
    
    // If filtered list is empty, fall back to dynamic generation
    if (filtered.length === 0 && props.data.length > 0) {
      const dynamicOptions = generateCategoricalOptionsFromData(props.data, 'gpu');
      if (dynamicOptions.length > 0) {
        console.warn('[GPUsGraph] Group options incomplete, using dynamic field detection');
        return dynamicOptions;
      }
    }
    
    return filtered;
  }
  return groupOptions;
});

// Initialize xAxis and yAxis using the first available numeric option, with fallbacks
const xAxis = ref(numericOptions.value.find(opt => opt.value === 'release_date') || numericOptions.value[0] || { label: 'X-Axis', value: '', source: '' });
const yAxis = ref(numericOptions.value.find(opt => opt.value === 'core_count') || numericOptions.value[1] || { label: 'Y-Axis', value: '', source: '' });
const groupBy = ref(filteredGroupOptions.value[0]);

// Utility: Get the proper value from the data item based on the axis source.
// Handles both nested structure (from regular API) and flattened structure (from chart-data endpoint)
const getAxisData = (item, axis) => {
  if (axis.source === 'soc') {
    if (axis.value === 'manufacturer_name') {
      // Try flattened structure first (chart-data endpoint), then nested structure
      return item.manufacturer_name ?? item.SoC?.Manufacturer?.name ?? null;
    }
    if (axis.value === 'platform') {
      return item.platform ?? item.SoC?.platform ?? null;
    }
    // Try flattened structure first (chart-data endpoint), then nested structure
    return item[axis.value] ?? item.SoC?.[axis.value] ?? null;
  }
  // Handle GPU fields
  return item[axis.value] ?? null;
};

// Seaborn-inspired color schemes for grouping.
const seabornColors = {
  architecture: ['#4c72b0', '#dd8452', '#55a868', '#c44e52'],
  generation: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  manufacturer: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860'],
  variant: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  memory_type: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  slot: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  bus_interface: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  platform: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  name: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860'],
  directx: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  opengl: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  opencl: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  vulkan: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  default: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3', '#8c8c8c'],
};

// Determine the color for a given grouping category.
let getColorForCategoryCallCount = 0;
let getColorForCategoryTotalTime = 0;
const getColorForCategory = (colorCategory) => {
  // #region agent log
  const startTime = performance.now();
  getColorForCategoryCallCount++;
  // #endregion
  
  if (!colorCategory) return 'gray';
  
  const groupByValue = groupBy.value.value;
  const colorPalette = seabornColors[groupByValue] || seabornColors.default;
  
  // Get all unique categories for the current groupBy field
  const categories = [...new Set(
    props.data
      .map(item => getAxisData(item, groupBy.value))
      .filter(Boolean)
  )];
  
  const colorIndex = categories.indexOf(colorCategory) % colorPalette.length;
  
  // #region agent log
  const endTime = performance.now();
  const duration = endTime - startTime;
  getColorForCategoryTotalTime += duration;
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GPUsGraph.client.vue:getColorForCategory',message:'getColorForCategory called',data:{callCount:getColorForCategoryCallCount,totalTime:getColorForCategoryTotalTime,duration:duration,dataSize:props.data?.length||0,category:colorCategory},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  return colorPalette[colorIndex];
};

// Memoize chart data processing (similar to CPU graph)
const chartDataCache = ref(new Map());

// Phase 2: Zoom level tracking
const currentZoomLevel = ref({ xMin: null, xMax: null, yMin: null, yMax: null });
const chartInstance = ref(null);

const chartOptions = computed(() => {
  // #region agent log
  const chartOptionsStartTime = performance.now();
  getColorForCategoryCallCount = 0;
  getColorForCategoryTotalTime = 0;
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GPUsGraph.client.vue:chartOptions',message:'chartOptions computation started',data:{dataSize:props.data?.length||0,xAxis:xAxis.value?.value||'null',yAxis:yAxis.value?.value||'null',groupBy:groupBy.value?.value||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  // Handle undefined or empty data
  if (!props.data || !props.data.length) {
    return {
      chart: { type: 'scatter' },
      title: { text: 'No data available' },
      series: []
    }
  }
  
  // Use all data - Highcharts turbo mode and data grouping handle performance
  let dataToProcess = props.data;
  const dataSize = props.data.length;
  
  // Phase 2: Level-of-Detail (LOD) Rendering (same as CPU graph)
  // Apply adaptive rendering based on data density to reduce Highcharts rendering load
  if (dataSize > 1000 && currentZoomLevel.value.xMin !== null) {
    const zoom = currentZoomLevel.value;
    const visibleData = dataToProcess.filter(item => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      if (xValue === null || yValue === null) return false;
      
      const x = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;
      const y = yAxis.value.value === 'release_date' ? Date.parse(yValue) : yValue;
      return x >= zoom.xMin && x <= zoom.xMax && 
             y >= zoom.yMin && y <= zoom.yMax;
    });
    
    if (visibleData.length > 0) {
      const density = calculateDataDensity(visibleData, xAxis.value, yAxis.value);
      
      if (density > 100) {
        // Very dense - use binning
        const pointData = visibleData.map(item => {
          const xValue = getAxisData(item, xAxis.value);
          const yValue = getAxisData(item, yAxis.value);
          return {
            x: xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue,
            y: yAxis.value.value === 'release_date' ? Date.parse(yValue) : yValue,
            data: item
          };
        }).filter(p => p.x !== null && p.y !== null && !isNaN(p.x) && !isNaN(p.y));
        
        const binned = binData(pointData, 50);
        dataToProcess = binned.map(bin => bin.data || bin);
      } else if (density > 10) {
        // Medium density - use clustering
        const pointData = visibleData.map(item => {
          const xValue = getAxisData(item, xAxis.value);
          const yValue = getAxisData(item, yAxis.value);
          return {
            x: xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue,
            y: yAxis.value.value === 'release_date' ? Date.parse(yValue) : yValue,
            data: item
          };
        }).filter(p => p.x !== null && p.y !== null && !isNaN(p.x) && !isNaN(p.y));
        
        const clustered = clusterData(pointData, 100);
        dataToProcess = clustered.map(cluster => cluster.data || cluster);
      } else {
        dataToProcess = visibleData;
      }
    }
  }

  // PERFORMANCE FIX: Calculate unique categories ONCE instead of recalculating in getColorForCategory
  // This reduces complexity from O(N²) to O(N)
  const groupByValue = groupBy.value.value;
  const colorPalette = seabornColors[groupByValue] || seabornColors.default;
  const categories = [...new Set(
    dataToProcess
      .map(item => getAxisData(item, groupBy.value))
      .filter(Boolean)
  )];
  
  // Create color map: category -> color (calculated once)
  const colorMap = new Map();
  categories.forEach((category, index) => {
    colorMap.set(category, colorPalette[index % colorPalette.length]);
  });
  
  // Fast color lookup function (no recalculation)
  const getColorForCategoryFast = (colorCategory) => {
    if (!colorCategory) return 'gray';
    return colorMap.get(colorCategory) || 'gray';
  };

  // Create cache key based on data length, axis selections, and groupBy
  // Include processed data length in cache key since LOD may reduce it
  const cacheKey = `${dataToProcess.length}-${xAxis.value?.value || 'null'}-${yAxis.value?.value || 'null'}-${groupBy.value?.value || 'null'}`;
  
  // Check if we have cached data
  if (chartDataCache.value.has(cacheKey)) {
    // #region agent log
    const cacheHitTime = performance.now();
    const cacheHitDuration = cacheHitTime - chartOptionsStartTime;
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GPUsGraph.client.vue:chartOptions',message:'Cache hit',data:{cacheKey:cacheKey,cacheHitDuration:cacheHitDuration},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return chartDataCache.value.get(cacheKey);
  }

  let groupedData = {};
  let series = [];

  // Group the data points according to the selected groupBy field.
  groupedData = dataToProcess.reduce((acc, item) => {
    const xValue = getAxisData(item, xAxis.value);
    const yValue = getAxisData(item, yAxis.value);
    const colorCategory = getAxisData(item, groupBy.value);

    if (xValue === null || yValue === null || colorCategory === null) return acc;

    const xFormattedValue = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;
    const yFormattedValue = yAxis.value.value === 'release_date' ? Date.parse(yValue) : yValue;
    const point = {
      x: xFormattedValue,
      y: yFormattedValue,
      name: item.name,
      color: getColorForCategoryFast(colorCategory),
      data: item,
    };

    if (!acc[colorCategory]) {
      acc[colorCategory] = [];
    }
    acc[colorCategory].push(point);
    return acc;
  }, {});

  // #region agent log
  const beforeSeriesTime = performance.now();
  const reduceDuration = beforeSeriesTime - chartOptionsStartTime;
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GPUsGraph.client.vue:chartOptions',message:'After reduce, before series mapping',data:{reduceDuration:reduceDuration,getColorForCategoryCallCount:getColorForCategoryCallCount,getColorForCategoryTotalTime:getColorForCategoryTotalTime,groupedDataKeys:Object.keys(groupedData).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  series = Object.keys(groupedData)
    .sort((a, b) => groupedData[b].length - groupedData[a].length)
    .map(category => ({
      name: category,
      data: groupedData[category],
      color: getColorForCategoryFast(category),
      marker: { symbol: 'circle' },
      opacity: dataSize > 5000 ? 0.5 : 0.8,
    }));
  
  // Ensure we have at least one series - if all data was filtered out, create a placeholder
  if (series.length === 0 && dataToProcess.length > 0) {
    console.warn('[GPUsGraph] No valid data points after filtering, creating placeholder series');
    const firstItem = dataToProcess.find(item => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      return xValue !== null && yValue !== null;
    });
    if (firstItem) {
      const xValue = getAxisData(firstItem, xAxis.value);
      const yValue = getAxisData(firstItem, yAxis.value);
      const xFormattedValue = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;
      const yFormattedValue = yAxis.value.value === 'release_date' ? Date.parse(yValue) : yValue;
      series = [{
        name: 'Data',
        data: [{
          x: xFormattedValue,
          y: yFormattedValue,
          name: firstItem.name,
          data: firstItem
        }],
        marker: { symbol: 'circle' },
        opacity: 0.8,
      }];
    }
  }

  // #region agent log
  const chartOptionsEndTime = performance.now();
  const totalDuration = chartOptionsEndTime - chartOptionsStartTime;
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GPUsGraph.client.vue:chartOptions',message:'chartOptions computation completed',data:{totalDuration:totalDuration,getColorForCategoryCallCount:getColorForCategoryCallCount,getColorForCategoryTotalTime:getColorForCategoryTotalTime,getColorForCategoryAvgTime:getColorForCategoryCallCount>0?getColorForCategoryTotalTime/getColorForCategoryCallCount:0,seriesCount:series.length,dataSize:dataSize},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const chartConfig = {
    chart: { 
      type: 'scatter', 
      zoomType: 'xy',
      events: {
        load: function() {
          chartInstance.value = this;
          const xAxis = this.xAxis[0];
          const yAxis = this.yAxis[0];
          currentZoomLevel.value = {
            xMin: xAxis.min,
            xMax: xAxis.max,
            yMin: yAxis.min,
            yMax: yAxis.max
          };
          xAxis.update({ events: { afterSetExtremes: function() {
            currentZoomLevel.value = { xMin: this.min, xMax: this.max, yMin: yAxis.min, yMax: yAxis.max };
          }}});
          yAxis.update({ events: { afterSetExtremes: function() {
            currentZoomLevel.value = { xMin: xAxis.min, xMax: xAxis.max, yMin: this.min, yMax: this.max };
          }}});
        }
      }
    },
    credits: false,
    title: false,
    xAxis: {
      title: { text: xAxis.value.label },
      type: xAxis.value.value === 'release_date' ? 'datetime' : 'linear',
      labels: {
        formatter: function () {
          if (xAxis.value.value === 'release_date') {
            return new Date(this.value).getFullYear();
          }
          return this.value;
        }
      },
      tickInterval: xAxis.value.value === 'release_date' ? null : 'auto',
      gridLineWidth: 1,
      min: xAxis.value.value === 'release_date' ? undefined : 1,
      startOnTick: true,
      endOnTick: true,
    },
    yAxis: {
      title: { text: yAxis.value.label },
      type: (yAxis.value?.value === 'release_date') ? 'datetime' : 'linear',
      labels: {
        formatter: function () {
          if (yAxis.value?.value === 'release_date') {
            return new Date(this.value).getFullYear();
          }
          return this.value;
        }
      },
      tickInterval: (yAxis.value?.value === 'release_date') ? null : 'auto',
      startOnTick: false,
    },
    tooltip: {
      borderRadius: 3,
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      useHTML: true,
      formatter: function () {
        if (this.point && typeof this.point === "object") {
          const data = this.point.data;
          const soc = data.SoC || {};
          const manufacturer = soc.Manufacturer || {};
          const name = `
            ${manufacturer.name || '-'} 
            ${data.name || '-'} 
            ${data.architecture || '-'}
          `.trim().replace(/\s+/g, ' ');

          const header = `
            <div class="flex w-full justify-between gap-8">
              <div style="color: ${this.series.color}; white-space: normal;" class="font-bold">${name}</div>
              <div class="font-bold">${soc.release_date ? new Date(soc.release_date).getFullYear() : '-'}</div>
            </div><br>
          `;

          const details = `
            <div>
              <span style="color: gray; font-size: 11px">Generation:</span> ${data.generation || '-'}<br>
              <span style="color: gray; font-size: 11px">Architecture:</span> ${data.architecture || '-'}<br>
              <span style="color: gray; font-size: 11px">Slot:</span> ${data.slot || '-'}<br>
              <span style="color: gray; font-size: 11px">Bus Interface:</span> ${data.bus_interface || '-'}<br>
            </div><br>
          `;

          const specs = `
            <div>
              <span style="color: gray; font-size: 11px">Memory Clock:</span> ${data.memory_clock ? data.memory_clock + ' MHz' : '-'}<br>
              <span style="color: gray; font-size: 11px">Memory Size:</span> ${data.memory_size ? data.memory_size + ' GB' : '-'}<br>
              <span style="color: gray; font-size: 11px">Memory Bandwidth:</span> ${data.memory_bandwidth ? data.memory_bandwidth + ' MB/s' : '-'}<br>
              <span style="color: gray; font-size: 11px">Pixel Rate:</span> ${data.pixel_rate ? data.pixel_rate + ' Mpix' : '-'}<br>
              <span style="color: gray; font-size: 11px">Texture Rate:</span> ${data.texture_rate ? data.texture_rate + ' Mtex' : '-'}<br>
              <span style="color: gray; font-size: 11px">Process Size:</span> ${data.process_size ? data.process_size + ' nm' : '-'}<br>
              <span style="color: gray; font-size: 11px">DirectX:</span> ${data.directx || '-'}<br>
              <span style="color: gray; font-size: 11px">OpenGL:</span> ${data.opengl || '-'}<br>
            </div><br>
          `;

          return `
            <div style="border-color: ${this.series.color};" class="bg-white/70 backdrop-blur-sm shadow-sm p-4 border rounded-lg">
              ${header}
              ${details}
              ${specs}
            </div>
          `;
        }
        return "unknown";
      },
    },
    plotOptions: {
      scatter: {
        // Enable turbo mode for optimal performance with large datasets
        turboThreshold: 0, // Always use optimized rendering
        
        // Data grouping - automatically groups nearby points for better performance
        dataGrouping: {
          enabled: true,
          approximation: 'average',
          groupPixelWidth: 5, // Group points within 5 pixels
          smoothed: false,
        },
        
        marker: {
          radius: dataSize > 10000 ? 1 : 4, // Smaller markers only for very large datasets (>10k)
          symbol: 'circle',
          enabledThreshold: 20000, // Hide markers if >20k points (use grouping instead)
          states: { 
            hover: { 
              enabled: true, 
              radius: dataSize > 10000 ? 3 : 4,
              lineColor: 'rgb(100,100,100)' 
            } 
          },
        },
        states: { hover: { marker: { enabled: false } } },
        jitter: { x: 0.005 },
        // Adjust opacity for better visibility with large datasets
        opacity: dataSize > 5000 ? 0.5 : 0.8,
      },
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
    },
    series,
  };
  
  // Cache the result
  chartDataCache.value.set(cacheKey, chartConfig);
  
  // Limit cache size to prevent memory leaks
  if (chartDataCache.value.size > 10) {
    const firstKey = chartDataCache.value.keys().next().value;
    chartDataCache.value.delete(firstKey);
  }
  
  return chartConfig;
});
</script>
