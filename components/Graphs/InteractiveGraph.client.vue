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
              <DropdownMenuItem v-for="option in xAxisOptions" :key="option.value" class="cursor-pointer"
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
              <DropdownMenuItem v-for="option in yAxisOptions" :key="option.value" class="cursor-pointer"
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
import { getNumericOptions, getCategoricalOptions } from '@/lib/chartFieldMaps';

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

// Comprehensive X-Axis options for SoC data from field map
const xAxisOptions = computed(() => {
  const fieldMapOptions = getNumericOptions('soc');
  
  // If we have data, verify fields exist and filter to available ones
  if (props.data && props.data.length > 0) {
    const sample = props.data[0];
    const availableFields = new Set();
    
    // Check all fields in sample
    for (const key in sample) {
      if (typeof sample[key] === 'number' || key === 'release_date') {
        availableFields.add(key);
      }
    }
    
    // Filter field map options to only include available fields
    return fieldMapOptions.filter(opt => availableFields.has(opt.value) || sample.hasOwnProperty(opt.value));
  }
  
  return fieldMapOptions;
});

// Y-Axis options exclude release_date
const yAxisOptions = computed(() => {
  return xAxisOptions.value.filter(option => option.value !== 'release_date');
});

// Comprehensive Group By options for SoC data from field map
const groupOptions = getCategoricalOptions('soc');

const filteredGroupOptions = computed(() => {
  // Filter to only include fields that exist in the data
  if (props.data && props.data.length > 0) {
    const sample = props.data[0];
    return groupOptions.filter(opt => {
      if (opt.value === 'processor_type') {
        // Processor type is always available from nested processors array
        return true;
      }
      return sample.hasOwnProperty(opt.value) || 
             (opt.value === 'manufacturer_name' && (sample.manufacturer_name || sample.manufacturer));
    });
  }
  return groupOptions;
});

// Initialize axes with computed defaults
const xAxis = ref(null);
const yAxis = ref(null);
const groupBy = ref(null);

// Set initial values when options are available
watch([xAxisOptions, yAxisOptions, filteredGroupOptions], ([xOpts, yOpts, groupOpts]) => {
  if (!xAxis.value && xOpts.length > 0) {
    xAxis.value = xOpts.find(opt => opt.value === 'release_date') || xOpts[0];
  }
  if (!yAxis.value && yOpts.length > 0) {
    yAxis.value = yOpts.find(opt => opt.value === 'process_node') || yOpts[0];
  }
  if (!groupBy.value && groupOpts.length > 0) {
    groupBy.value = groupOpts[0];
  }
}, { immediate: true });

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

// Phase 2: Zoom level tracking
const currentZoomLevel = ref({ xMin: null, xMax: null, yMin: null, yMax: null });
const chartInstance = ref(null);

const chartOptions = computed(() => {
  if (!props.data || props.data.length === 0) {
    return null;
  }

  // Clear color cache when groupBy changes to force recalculation
  categoryColorMap.value.clear();

  let dataToProcess = props.data;
  const dataSize = props.data.length;
  
  // For very large datasets without zoom, sample data initially to prevent UI blocking
  // Highcharts will handle the rest with turbo mode and data grouping
  if (dataSize > 5000 && currentZoomLevel.value.xMin === null) {
    // Sample every Nth item for initial render (will show full data on zoom)
    const sampleRate = Math.ceil(dataSize / 5000); // Target ~5000 points for initial render
    dataToProcess = props.data.filter((_, index) => index % sampleRate === 0);
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

  const series = Object.keys(groupedData)
    .sort((a, b) => groupedData[b].length - groupedData[a].length)
    .map(category => ({
      name: category,
      data: groupedData[category],
      color: getColorForCategory(category),
      marker: { symbol: 'circle' },
      opacity: dataSize > 5000 ? 0.5 : 0.8,
    }));
  
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

  return {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
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
          radius: dataSize > 10000 ? 1 : (dataSize > 5000 ? 2 : 4), // Smaller markers for large datasets
          symbol: 'circle',
          enabledThreshold: 20000, // Hide markers if >20k points (use grouping instead)
          states: {
            hover: {
              enabled: true,
              radius: dataSize > 10000 ? 3 : 4,
              lineColor: 'rgb(100,100,100)',
            },
          },
        },
        states: {
          hover: {
            marker: {
              enabled: false,
            },
          },
        },
        jitter: {
          x: 0.005,
        },
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
});
</script>

