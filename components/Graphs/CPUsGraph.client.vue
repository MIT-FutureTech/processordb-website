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
              <DropdownMenuItem v-for="option in numericOptions" :key="option.value + '-' + option.source"
                class="cursor-pointer" @click="yAxis = option">
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
import { computed, ref, onErrorCaptured } from 'vue';
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

// Props: Expect an array of CPU data objects
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Utility to convert underscore_case strings into a friendly format.
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
//     cpu_id: item.cpu_id,
//     family: item.family,
//     microarchitecture: item.microarchitecture,
//     // Only include key fields for hashing
//   })));
// };

// Dynamically generate numeric options for X and Y axes.
// It scans the first CPU data object and its nested SoC object, excluding IDs and timestamps.
const numericOptions = computed(() => {
  if (!props.data || !props.data.length) return [];

  const sample = props.data[0];
  const options = [];
  const cpuExcludes = new Set(['cpu_id', 'soc_id', 'createdAt', 'updatedAt']);

  for (const key in sample) {
    if (cpuExcludes.has(key)) continue;
    if (typeof sample[key] === 'number') {
      options.push({ label: convertString(key), value: key, source: 'cpu' });
    }
  }

  if (sample.SoC) {
    const socExcludes = new Set(['soc_id', 'manufacturer_id', 'createdAt', 'updatedAt']);
    for (const key in sample.SoC) {
      if (socExcludes.has(key)) continue;
      if (typeof sample.SoC[key] === 'number' || key === 'release_date') {
        options.push({ label: `${convertString(key)}`, value: key, source: 'soc' });
      }
    }
  }
  return options;
});

// Static Group By options for CPU data.
const groupOptions = [
  { label: 'Manufacturer', value: 'manufacturer_name', source: 'soc' },
  { label: 'Family', value: 'family', source: 'cpu' },
  { label: 'Microarchitecture', value: 'microarchitecture', source: 'cpu' }
];

const filteredGroupOptions = computed(() => groupOptions);

// Initialize axes with first available options, with fallbacks
const xAxis = ref(numericOptions.value.find(opt => opt.value === 'release_date') || numericOptions.value[0] || { label: 'X-Axis', value: '', source: '' });
const yAxis = ref(numericOptions.value.find(opt => opt.value === 'core_count') || numericOptions.value[1] || { label: 'Y-Axis', value: '', source: '' });
const groupBy = ref(filteredGroupOptions.value[0]);

// Utility: Get the proper value from a CPU data item based on the axis source.
const getAxisData = (item, axis) => {
  if (axis.source === 'soc') {
    if (axis.value === 'manufacturer_name') {
      return item.SoC?.Manufacturer?.name ?? null;
    }
    return item.SoC?.[axis.value] ?? null;
  }
  return item[axis.value] ?? null;
};

// Seaborn-inspired color schemes for grouping.
const seabornColors = {
  family: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  microarchitecture: ['#4c72b0', '#dd8452', '#55a868', '#c44e52'],
  manufacturer: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
};


// Determine the color for a given grouping category.
const getColorForCategory = (colorCategory) => {
  if (groupBy.value.value === 'family') {
    const categories = [...new Set(props.data.map(item => getAxisData(item, { value: 'family', source: 'cpu' })))];
    const colorIndex = categories.indexOf(colorCategory) % seabornColors.family.length;
    return seabornColors.family[colorIndex];
  } else if (groupBy.value.value === 'microarchitecture') {
    const categories = [...new Set(props.data.map(item => getAxisData(item, { value: 'microarchitecture', source: 'cpu' })))];
    const colorIndex = categories.indexOf(colorCategory) % seabornColors.microarchitecture.length;
    return seabornColors.microarchitecture[colorIndex];
  } else if (groupBy.value.value === 'manufacturer_name') {
    const categories = [...new Set(props.data.map(item => getAxisData(item, { value: 'manufacturer_name', source: 'soc' })))];
    const colorIndex = categories.indexOf(colorCategory) % seabornColors.manufacturer.length;
    return seabornColors.manufacturer[colorIndex];
  }
  return 'gray';
};

// Memoize chart data processing
const chartDataCache = ref(new Map())

const chartOptions = computed(() => {
  // Handle undefined or empty data
  if (!props.data || !props.data.length) {
    return {
      chart: { type: 'scatter' },
      title: { text: 'No data available' },
      series: []
    }
  }
  
  // Performance optimization: Sample data for large datasets
  const MAX_POINTS = 1000;
  const dataToProcess = props.data.length > MAX_POINTS 
    ? props.data.filter((_, index) => index % Math.ceil(props.data.length / MAX_POINTS) === 0)
    : props.data;
  
  // Create cache key based on data length, axis selections, and groupBy
  const cacheKey = `${dataToProcess.length}-${xAxis.value.value}-${yAxis.value.value}-${groupBy.value.value}`
  
  // Check if we have cached data
  if (chartDataCache.value.has(cacheKey)) {
    return chartDataCache.value.get(cacheKey)
  }

  let groupedData = {};
  let series = [];

  // Group the CPU data points by the selected groupBy field.
  groupedData = dataToProcess.reduce((acc, item) => {
    const xValue = getAxisData(item, xAxis.value);
    const yValue = getAxisData(item, yAxis.value);
    const colorCategory = getAxisData(item, groupBy.value);

    if (xValue === null || yValue === null || colorCategory === null) return acc;

    const xFormattedValue = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;
    const point = {
      x: xFormattedValue,
      y: yValue,
      name: `${item.family || '-'} ${item.code_name || '-'} ${item.model || '-'}`,
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
      opacity: 0.8,
    }));

  const chartConfig = {
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
      type: 'linear',
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
            ${data.family || '-'} 
            ${data.microarchitecture || '-'} 
            ${data.model || '-'}
          `.trim().replace(/\s+/g, ' ');

          const header = `
            <div class="flex w-full justify-between gap-8">
              <div style="color: ${this.series.color}; white-space: normal;" class="font-bold">${name}</div>
              <div class="font-bold">${soc.release_date ? new Date(soc.release_date).getFullYear() : '-'}</div>
            </div><br>
          `;

          const details = `
            <div>
              <span style="color: gray; font-size: 11px">Clock:</span> ${data.clock || '-'} MHz<br>
              <span style="color: gray; font-size: 11px">Core Count:</span> ${data.core_count || '-'}<br>
              <span style="color: gray; font-size: 11px">TDP:</span> ${data.tdp || '-'} W<br>
              <span style="color: gray; font-size: 11px">L2 Cache:</span> ${data.l2_cache || '-'} KB<br>
              <span style="color: gray; font-size: 11px">L3 Cache:</span> ${data.l3_cache || '-'} MB<br>
              <span style="color: gray; font-size: 11px">FP32 Ops:</span> ${data.fp32_ops || '-'}<br>
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
        marker: {
          radius: 4,
          symbol: 'circle',
          states: { hover: { enabled: true, lineColor: 'rgb(100,100,100)' } },
        },
        states: { hover: { marker: { enabled: false } } },
        jitter: { x: 0.005 },
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
  chartDataCache.value.set(cacheKey, chartConfig)
  
  // Limit cache size to prevent memory leaks
  if (chartDataCache.value.size > 10) {
    const firstKey = chartDataCache.value.keys().next().value
    chartDataCache.value.delete(firstKey)
  }
  
  return chartConfig
});
</script>
