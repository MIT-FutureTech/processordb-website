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
              <DropdownMenuItem v-for="option in numericOptions" :key="option.value + '-' + option.source"
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
              <DropdownMenuItem v-for="option in numericOptions" :key="option.value + '-' + option.source"
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
import { getNumericOptions, getCategoricalOptions } from '@/lib/chartFieldMaps';
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
    return fieldMapOptions.filter(opt => {
      // For soc source, check both flattened and nested
      if (opt.source === 'soc') {
        return availableFields.has(opt.value) || 
               (sample.SoC && sample.SoC.hasOwnProperty(opt.value)) ||
               sample.hasOwnProperty(opt.value);
      }
      return availableFields.has(opt.value) || sample.hasOwnProperty(opt.value);
    });
  }
  
  return fieldMapOptions;
});

// Comprehensive Group By options for GPU data from field map
const groupOptions = getCategoricalOptions('gpu');

const filteredGroupOptions = computed(() => {
  // Filter to only include fields that exist in the data
  if (props.data && props.data.length > 0) {
    const sample = props.data[0];
    return groupOptions.filter(opt => {
      if (opt.source === 'soc') {
        // Check both flattened and nested structures
        return sample.hasOwnProperty(opt.value) || 
               (sample.SoC && sample.SoC.hasOwnProperty(opt.value)) ||
               (opt.value === 'manufacturer_name' && (sample.manufacturer_name || sample.SoC?.Manufacturer));
      }
      return sample.hasOwnProperty(opt.value);
    });
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
const getColorForCategory = (colorCategory) => {
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
  return colorPalette[colorIndex];
};

// Phase 2: Zoom level tracking
const currentZoomLevel = ref({ xMin: null, xMax: null, yMin: null, yMax: null });
const chartInstance = ref(null);

const chartOptions = computed(() => {
  // Handle undefined or empty data
  if (!props.data || !props.data.length) {
    return {
      chart: { type: 'scatter' },
      title: { text: 'No data available' },
      series: []
    }
  }
  
  // Use all data - Highcharts turbo mode and data grouping handle performance
  const dataToProcess = props.data;
  const dataSize = props.data.length;

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
      color: getColorForCategory(colorCategory),
      data: item,
    };

    if (!acc[colorCategory]) {
      acc[colorCategory] = [];
    }
    acc[colorCategory].push(point);
    return acc;
  }, {});

  series = Object.keys(groupedData)
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

  return {
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
          radius: dataSize > 10000 ? 1 : (dataSize > 5000 ? 2 : 4), // Smaller markers for large datasets
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
});
</script>
