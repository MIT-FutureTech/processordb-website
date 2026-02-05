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
              <DropdownMenuItem v-for="option in xAxisOptions" :key="option.value + '-' + option.source" class="cursor-pointer"
                @click="xAxis = option">
                {{ option.label }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span class="text-gray-500 text-lg p-1 flex items-center justify-center gap-2 font-thin">
          X
        </span>
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
              <DropdownMenuItem v-for="option in yAxisOptions" :key="option.value + '-' + option.source" class="cursor-pointer"
                @click="yAxis = option">
                {{ option.label }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <!-- Group By Selection -->
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
    <div v-else-if="!props.data || props.data.length === 0" class="flex items-center justify-center h-64 text-gray-500">
      No data available
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
import { computed, ref, onErrorCaptured, onMounted, watch } from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu/dropdown-menu-index';
import { 
  calculateDataDensity, 
  binData, 
  clusterData, 
  createHeatmap,
  detectDenseRegions 
} from '@/lib/chartUtils';
import { getNumericOptions, getCategoricalOptions, generateNumericOptionsFromData, generateCategoricalOptionsFromData, validateFieldMaps } from '@/lib/chartFieldMaps';

// Props: Expect an array of SoC data objects
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const chartError = ref(null);

onErrorCaptured((err) => {
  chartError.value = err.message || 'An error occurred';
  return false;
});

// Base numeric options for SoC data (before axis exclusions)
const baseNumericOptions = computed(() => {
  const fieldMapOptions = getNumericOptions('soc');
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InteractiveGraph.client.vue:baseNumericOptions',message:'Computing base numeric options',data:{fieldMapOptionsCount:fieldMapOptions.length,hasData:!!props.data,dataLength:props.data?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // If we have data, verify fields exist and filter to available ones
  if (props.data && props.data.length > 0) {
    // Validate field maps against actual data
    validateFieldMaps(fieldMapOptions, props.data, 'soc');
    
    const sample = props.data[0];
    const availableFields = new Set();
    
    // Check all fields in sample
    for (const key in sample) {
      if (typeof sample[key] === 'number' || key === 'release_date') {
        availableFields.add(key);
      }
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InteractiveGraph.client.vue:baseNumericOptions',message:'Available fields detected',data:{availableFieldsCount:availableFields.size,availableFields:Array.from(availableFields),sampleKeys:Object.keys(sample)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Filter field map options to only include available fields
    let filtered = fieldMapOptions.filter(opt => availableFields.has(opt.value) || sample.hasOwnProperty(opt.value));
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InteractiveGraph.client.vue:baseNumericOptions',message:'After filtering field map',data:{filteredCount:filtered.length,filteredValues:filtered.map(f=>f.value)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // If filtered list is empty or very small, fall back to dynamic generation
    if (filtered.length < 3 && props.data.length > 0) {
      const dynamicOptions = generateNumericOptionsFromData(props.data, 'soc');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InteractiveGraph.client.vue:baseNumericOptions',message:'Dynamic options generated',data:{dynamicOptionsCount:dynamicOptions.length,dynamicValues:dynamicOptions.map(f=>f.value)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (dynamicOptions.length > filtered.length) {
        console.warn('[InteractiveGraph] Field map incomplete, using dynamic field detection');
        filtered = dynamicOptions;
      }
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InteractiveGraph.client.vue:baseNumericOptions',message:'Final base options',data:{finalCount:filtered.length,finalValues:filtered.map(f=>f.value)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    return filtered;
  }
  
  return fieldMapOptions;
});

// X-Axis options exclude the selected Y-axis value
const xAxisOptions = computed(() => {
  let options = baseNumericOptions.value;
  // Exclude the selected Y-axis value from X-axis options
  if (yAxis.value && yAxis.value.value) {
    options = options.filter(opt => opt.value !== yAxis.value.value);
  }
  return options;
});

// Y-Axis options exclude release_date and the selected X-axis value
const yAxisOptions = computed(() => {
  let options = baseNumericOptions.value.filter(option => option.value !== 'release_date');
  // Exclude the selected X-axis value from Y-axis options
  if (xAxis.value && xAxis.value.value) {
    options = options.filter(opt => opt.value !== xAxis.value.value);
  }
  return options;
});

// Comprehensive Group By options for SoC data from field map
const groupOptions = getCategoricalOptions('soc');

const filteredGroupOptions = computed(() => {
  // Filter to only include fields that exist in the data
  if (props.data && props.data.length > 0) {
    const sample = props.data[0];
    const filtered = groupOptions.filter(opt => {
      if (opt.value === 'processor_type') {
        // Processor type is always available from nested processors array
        return true;
      }
      return sample.hasOwnProperty(opt.value) || 
             (opt.value === 'manufacturer_name' && (sample.manufacturer_name || sample.manufacturer));
    });
    
    // If filtered list is empty, fall back to dynamic generation
    if (filtered.length === 0 && props.data.length > 0) {
      const dynamicOptions = generateCategoricalOptionsFromData(props.data, 'soc');
      if (dynamicOptions.length > 0) {
        console.warn('[InteractiveGraph] Group options incomplete, using dynamic field detection');
        return dynamicOptions;
      }
    }
    
    return filtered;
  }
  return groupOptions;
});

// Initialize axes with computed defaults
const xAxis = ref(null);
const yAxis = ref(null);
const groupBy = ref(null);

// Set initial values when options are available
// Use baseNumericOptions for initial selection to avoid circular dependency
watch([baseNumericOptions, filteredGroupOptions], ([baseOpts, groupOpts]) => {
  if (!xAxis.value && baseOpts.length > 0) {
    // Find release_date in base options (before exclusions)
    const releaseDateOpt = baseOpts.find(opt => opt.value === 'release_date');
    xAxis.value = releaseDateOpt || baseOpts[0];
  }
  if (!yAxis.value && baseOpts.length > 0) {
    // Find process_node in base options, excluding release_date
    const processNodeOpt = baseOpts.find(opt => opt.value === 'process_node' && opt.value !== 'release_date');
    yAxis.value = processNodeOpt || baseOpts.find(opt => opt.value !== 'release_date') || baseOpts[0];
  }
  if (!groupBy.value && groupOpts.length > 0) {
    groupBy.value = groupOpts[0];
  }
}, { immediate: true });

// Also watch for axis changes to update the other axis's options
watch([xAxis, yAxis], ([newXAxis, newYAxis]) => {
  // When X-axis changes, ensure Y-axis is still valid (not the same as X)
  if (newXAxis && newYAxis && newXAxis.value === newYAxis.value) {
    // If they're the same, reset Y-axis to a different option
    const availableYOptions = yAxisOptions.value;
    if (availableYOptions.length > 0) {
      yAxis.value = availableYOptions[0];
    }
  }
  // When Y-axis changes, ensure X-axis is still valid (not the same as Y)
  if (newXAxis && newYAxis && newXAxis.value === newYAxis.value) {
    // If they're the same, reset X-axis to a different option
    const availableXOptions = xAxisOptions.value;
    if (availableXOptions.length > 0) {
      xAxis.value = availableXOptions[0];
    }
  }
});

// Utility: Get the appropriate value from an item
const getAxisData = (item, axis) => {
  if (axis.value === 'manufacturer_name') {
    return item.manufacturer_name || item.manufacturer?.name || null;
  }
  if (axis.value === 'processor_type') {
    // Get processor types from nested processors array
    if (item.processors && item.processors.length > 0) {
      const types = [...new Set(item.processors.map(p => p.processor_type).filter(Boolean))];
      return types.length > 0 ? types.join(', ') : null;
    }
    return null;
  }
  if (axis.value === 'platform') {
    return item.platform || null;
  }
  return item[axis.value] ?? null;
};

// Seaborn-inspired color schemes for grouping
const seabornColors = {
  manufacturer_name: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3', '#8c8c8c'],
  processor_type: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  platform: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860'],
  default: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3', '#8c8c8c'],
};

// Memoize category colors to avoid recalculating on every call
const categoryColorMap = ref(new Map());

// Determine color based on the current group option (optimized with memoization)
const getColorForCategory = (colorCategory) => {
  if (!colorCategory) return 'gray';
  
  // Use memoized map if available
  if (categoryColorMap.value.has(colorCategory)) {
    return categoryColorMap.value.get(colorCategory);
  }
  
  const groupByValue = groupBy.value.value;
  const colorPalette = seabornColors[groupByValue] || seabornColors.default;
  
  // Get all unique categories for the current groupBy field
  const categories = [...new Set(
    props.data
      .map(item => getAxisData(item, groupBy.value))
      .filter(Boolean)
  )];
  
  const colorIndex = categories.indexOf(colorCategory) % colorPalette.length;
  const color = colorPalette[colorIndex];
  
  // Cache the color
  categoryColorMap.value.set(colorCategory, color);
  return color;
};

// Memoize chart data processing
const chartDataCache = ref(new Map())

// Phase 2: Zoom level tracking for LOD rendering
const currentZoomLevel = ref({ xMin: null, xMax: null, yMin: null, yMax: null });
const chartInstance = ref(null);

const chartOptions = computed(() => {
  // Handle undefined or empty data
  if (!props.data || !props.data.length) {
    console.log('[InteractiveGraph] No data available, returning empty chart config');
    return {
      chart: { type: 'scatter' },
      title: { text: 'No data available' },
      series: []
    }
  }
  
  console.log('[InteractiveGraph] Computing chartOptions with', props.data.length, 'data points');

  // Clear color cache when groupBy changes to force recalculation
  categoryColorMap.value.clear();

  // Use all data - Highcharts turbo mode and data grouping handle performance
  let dataToProcess = props.data;
  const dataSize = props.data.length;
  
  // Create cache key based on data length, axis selections, and groupBy
  const cacheKey = `${dataSize}-${xAxis.value?.value || 'null'}-${yAxis.value?.value || 'null'}-${groupBy.value?.value || 'null'}`
  
  // Check if we have cached data
  if (chartDataCache.value.has(cacheKey)) {
    return chartDataCache.value.get(cacheKey)
  }
  
  // Phase 2: Level-of-Detail (LOD) Rendering
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
  
  let groupedData = {};

  // Group the data points according to the selected groupBy field
  // Use dataToProcess (which may be filtered/binned/clustered) instead of raw props.data
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
      name: item.soc_name || item.name || `SoC ${item.soc_id}`,
      color: getColorForCategory(colorCategory),
      data: item,
    };

    if (!acc[colorCategory]) {
      acc[colorCategory] = [];
    }
    acc[colorCategory].push(point);
    return acc;
  }, {});

  let series = Object.keys(groupedData)
    .sort((a, b) => groupedData[b].length - groupedData[a].length)
    .map(category => ({
      name: category,
      data: groupedData[category],
      color: getColorForCategory(category),
      marker: { symbol: 'circle' },
      opacity: dataSize > 5000 ? 0.5 : 0.8,
    }));
  
  // Ensure we have at least one series - if all data was filtered out, create a placeholder
  if (series.length === 0 && dataToProcess.length > 0) {
    console.warn('[InteractiveGraph] No valid data points after filtering, creating placeholder series');
    // Try to create at least one point from the first valid item
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
          name: firstItem.soc_name || firstItem.name || `SoC ${firstItem.soc_id}`,
          data: firstItem
        }],
        marker: { symbol: 'circle' },
        opacity: 0.8,
      }];
    }
  }
  
  // Phase 2: Add heatmap overlay for very large datasets (>50k points)
  let heatmapSeries = null;
  if (dataSize > 50000) {
    const pointData = dataToProcess.map(item => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      if (xValue === null || yValue === null) return null;
      const xFormattedValue = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;
      const yFormattedValue = yAxis.value.value === 'release_date' ? Date.parse(yValue) : yValue;
      return {
        x: xFormattedValue,
        y: yFormattedValue,
        data: item
      };
    }).filter(p => p !== null && !isNaN(p.x) && !isNaN(p.y));
    
    const heatmapData = createHeatmap(pointData, 50);
    if (heatmapData.length > 0) {
      heatmapSeries = {
        type: 'heatmap',
        name: 'Data Density',
        data: heatmapData,
        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: '#0000FF'
        },
        zIndex: 0,
        opacity: 0.4,
        turboThreshold: 0
      };
    }
  }

  const chartConfig = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      events: {
        load: function() {
          chartInstance.value = this;
          const xAxis = this.xAxis[0];
          const yAxis = this.yAxis[0];
          
          // Update zoom level on load
          currentZoomLevel.value = {
            xMin: xAxis.min,
            xMax: xAxis.max,
            yMin: yAxis.min,
            yMax: yAxis.max
          };
          
          // Track zoom changes
          xAxis.update({
            events: {
              afterSetExtremes: function() {
                currentZoomLevel.value = {
                  xMin: this.min,
                  xMax: this.max,
                  yMin: yAxis.min,
                  yMax: yAxis.max
                };
              }
            }
          });
          
          yAxis.update({
            events: {
              afterSetExtremes: function() {
                currentZoomLevel.value = {
                  xMin: xAxis.min,
                  xMax: xAxis.max,
                  yMin: this.min,
                  yMax: this.max
                };
              }
            }
          });
        }
      }
    },
    credits: false,
    title: false,
    xAxis: {
      title: { text: xAxis.value?.label || 'X-Axis' },
      type: (xAxis.value?.value === 'release_date') ? 'datetime' : 'linear',
      labels: {
        formatter: function () {
          if (xAxis.value?.value === 'release_date') {
            return new Date(this.value).getFullYear();
          }
          return this.value;
        }
      },
      tickInterval: (xAxis.value?.value === 'release_date') ? null : 'auto',
      gridLineWidth: 1,
      min: (xAxis.value?.value === 'release_date') ? undefined : 1,
      startOnTick: true,
      endOnTick: true,
    },
    yAxis: {
      title: { text: yAxis.value?.label || 'Y-Axis' },
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
          const name = data.soc_name || data.name || `SoC ${data.soc_id}`;
          const manufacturer = data.manufacturer_name || data.manufacturer?.name || '-';

          const header = `
            <div class="flex w-full justify-between gap-8">
              <div style="color: ${this.series.color}; white-space: normal;" class="font-bold">${name}</div>
              <div class="font-bold">${data.release_date ? new Date(data.release_date).getFullYear() : '-'}</div>
            </div><br>
          `;

          const details = `
            <div>
              <span style="color: gray; font-size: 11px">Manufacturer:</span> ${manufacturer}<br>
              <span style="color: gray; font-size: 11px">Process Node:</span> ${data.process_node ? data.process_node + ' nm' : '-'}<br>
              <span style="color: gray; font-size: 11px">Die Size:</span> ${data.die_sizes ? data.die_sizes + ' mm²' : '-'}<br>
              <span style="color: gray; font-size: 11px">Transistor Count:</span> ${data.total_transistor_count ? data.total_transistor_count + ' million' : '-'}<br>
              <span style="color: gray; font-size: 11px">Transistor Density:</span> ${data.transistor_density || '-'}<br>
            </div><br>
          `;

          return `
            <div style="border-color: ${this.series.color};" class="bg-white/70 backdrop-blur-sm shadow-sm p-4 border rounded-lg">
              ${header}
              ${details}
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
    series: heatmapSeries ? [heatmapSeries, ...series] : series,
  };
  
  // Cache the result
  chartDataCache.value.set(cacheKey, chartConfig)
  
  // Limit cache size to prevent memory leaks
  if (chartDataCache.value.size > 10) {
    const firstKey = chartDataCache.value.keys().next().value
    chartDataCache.value.delete(firstKey)
  }
  
  console.log('[InteractiveGraph] Returning chartConfig with', series.length, 'series, heatmapSeries:', !!heatmapSeries);
  return chartConfig
});
</script>

