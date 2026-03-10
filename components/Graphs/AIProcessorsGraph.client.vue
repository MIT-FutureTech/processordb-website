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
                class="cursor-pointer" @click="handleXAxisChange(option)">
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
              <DropdownMenuItem v-for="option in yAxisOptions" :key="option.value + '-' + option.source"
                class="cursor-pointer" @click="handleYAxisChange(option)">
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
import { computed, ref, onErrorCaptured, onMounted, onUnmounted } from 'vue';
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

// Error handling for chart component
const chartError = ref(null);
onErrorCaptured((err) => {
  console.error('Chart component error:', err);
  chartError.value = err.message || 'An error occurred while rendering the chart';
  return false;
});

// Props: Expect an array of AI Processor data objects
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Comprehensive numeric options for X and Y axes from field map
const numericOptions = computed(() => {
  const fieldMapOptions = getNumericOptions('aiProcessor');
  
  if (props.data && props.data.length > 0) {
    validateFieldMaps(fieldMapOptions, props.data, 'aiProcessor');
    
    const sample = props.data[0];
    const availableFields = new Set();
    
    for (const key in sample) {
      if (typeof sample[key] === 'number' || key === 'release_year' || key === 'release_date') {
        availableFields.add(key);
      }
    }
    
    if (sample.SoC) {
      for (const key in sample.SoC) {
        if (typeof sample.SoC[key] === 'number' || key === 'release_date') {
          availableFields.add(key);
        }
      }
    }
    
    const filtered = fieldMapOptions.filter(opt => {
      if (opt.source === 'soc') {
        return availableFields.has(opt.value) || 
               (sample.SoC && sample.SoC.hasOwnProperty(opt.value)) ||
               sample.hasOwnProperty(opt.value);
      }
      return availableFields.has(opt.value) || sample.hasOwnProperty(opt.value);
    });
    
    if (filtered.length < 3 && props.data.length > 0) {
      const dynamicOptions = generateNumericOptionsFromData(props.data, 'aiProcessor');
      if (dynamicOptions.length > filtered.length) {
        console.warn('[AIProcessorsGraph] Field map incomplete, using dynamic field detection');
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
  if (yAxis.value && yAxis.value.value) {
    options = options.filter(opt => opt.value !== yAxis.value.value);
  }
  return options;
});

// Y-Axis options exclude release_date and the selected X-axis value
const yAxisOptions = computed(() => {
  let options = numericOptions.value.filter(option => option.value !== 'release_date');
  if (xAxis.value && xAxis.value.value) {
    options = options.filter(opt => opt.value !== xAxis.value.value);
  }
  return options;
});

// Comprehensive Group By options for AI Processor data from field map
const groupOptions = getCategoricalOptions('aiProcessor');

const filteredGroupOptions = computed(() => {
  if (props.data && props.data.length > 0) {
    const sample = props.data[0];
    const filtered = groupOptions.filter(opt => {
      if (opt.source === 'soc') {
        return sample.hasOwnProperty(opt.value) || 
               (sample.SoC && sample.SoC.hasOwnProperty(opt.value)) ||
               (opt.value === 'manufacturer_name' && (sample.manufacturer_name || sample.SoC?.Manufacturer));
      }
      return sample.hasOwnProperty(opt.value);
    });
    
    if (filtered.length === 0 && props.data.length > 0) {
      const dynamicOptions = generateCategoricalOptionsFromData(props.data, 'aiProcessor');
      if (dynamicOptions.length > 0) {
        console.warn('[AIProcessorsGraph] Group options incomplete, using dynamic field detection');
        return dynamicOptions;
      }
    }
    
    return filtered;
  }
  return groupOptions;
});

// Initialize axes with first available options
const xAxis = ref(numericOptions.value.find(opt => opt.value === 'release_year' || opt.value === 'release_date') || numericOptions.value[0] || { label: 'X-Axis', value: '', source: '' });
const yAxis = ref(numericOptions.value.find(opt => opt.value === 'performance_tops') || numericOptions.value[1] || { label: 'Y-Axis', value: '', source: '' });
const groupBy = ref(filteredGroupOptions.value.find(opt => opt.value === 'company') || filteredGroupOptions.value[0]);

// Axis change handlers
const handleXAxisChange = (option) => {
  xAxis.value = option;
};

const handleYAxisChange = (option) => {
  yAxis.value = option;
};

// Utility: Get the proper value from an AI Processor data item based on the axis source
const getAxisData = (item, axis) => {
  if (axis.source === 'soc') {
    if (axis.value === 'manufacturer_name') {
      return item.manufacturer_name ?? item.SoC?.Manufacturer?.name ?? null;
    }
    if (axis.value === 'platform') {
      return item.platform ?? item.SoC?.platform ?? null;
    }
    return item[axis.value] ?? item.SoC?.[axis.value] ?? null;
  }
  return item[axis.value] ?? null;
};

// Seaborn-inspired color schemes for grouping
const seabornColors = {
  company: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  model_name: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860'],
  product_name: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  country: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  precision: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  format: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  cloud_edge: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  workload_type: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  networking: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  manufacturer_name: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  default: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3', '#8c8c8c'],
};

// Determine the color for a given grouping category
const getColorForCategory = (colorCategory) => {
  if (!colorCategory) return 'gray';
  
  const groupByValue = groupBy.value.value;
  const colorPalette = seabornColors[groupByValue] || seabornColors.default;
  
  const categories = [...new Set(
    props.data
      .map(item => getAxisData(item, groupBy.value))
      .filter(Boolean)
  )];
  
  const colorIndex = categories.indexOf(colorCategory) % colorPalette.length;
  return colorPalette[colorIndex];
};

// Memoize chart data processing
const chartDataCache = ref(new Map())
const currentZoomLevel = ref({ xMin: null, xMax: null, yMin: null, yMax: null });
const chartInstance = ref(null);

const chartOptions = computed(() => {
  if (!props.data || !props.data.length) {
    console.log('[AIProcessorsGraph] No data available, returning empty chart config');
    return {
      chart: { type: 'scatter' },
      title: { text: 'No data available' },
      series: []
    }
  }
  
  console.log('[AIProcessorsGraph] Computing chartOptions with', props.data.length, 'data points');
  
  let dataToProcess = props.data;
  const dataSize = props.data.length;
  
  // Level-of-Detail (LOD) Rendering
  if (dataSize > 1000 && currentZoomLevel.value.xMin !== null) {
    const zoom = currentZoomLevel.value;
    const visibleData = dataToProcess.filter(item => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      if (xValue === null || yValue === null) return false;
      const xFormattedValue = (xAxis.value.value === 'release_date' || xAxis.value.value === 'release_year') ? (typeof xValue === 'number' ? xValue : Date.parse(xValue)) : xValue;
      const yFormattedValue = (yAxis.value.value === 'release_date' || yAxis.value.value === 'release_year') ? (typeof yValue === 'number' ? yValue : Date.parse(yValue)) : yValue;
      return xFormattedValue >= zoom.xMin && xFormattedValue <= zoom.xMax &&
             yFormattedValue >= zoom.yMin && yFormattedValue <= zoom.yMax;
    });
    if (visibleData.length < dataToProcess.length * 0.5) {
      dataToProcess = visibleData;
    }
  }
  
  // Data grouping for large datasets
  if (dataSize > 5000) {
    const grouped = binData(dataToProcess, xAxis.value, yAxis.value, 50);
    dataToProcess = grouped;
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

  let groupedData = {};
  let series = [];

  // Group the AI Processor data points by the selected groupBy field
  groupedData = dataToProcess.reduce((acc, item) => {
    const xValue = getAxisData(item, xAxis.value);
    const yValue = getAxisData(item, yAxis.value);
    const colorCategory = getAxisData(item, groupBy.value);

    if (xValue === null || yValue === null || colorCategory === null) return acc;

    const xFormattedValue = (xAxis.value.value === 'release_date' || xAxis.value.value === 'release_year') 
      ? (typeof xValue === 'number' ? xValue : Date.parse(xValue)) 
      : xValue;
    const yFormattedValue = (yAxis.value.value === 'release_date' || yAxis.value.value === 'release_year') 
      ? (typeof yValue === 'number' ? yValue : Date.parse(yValue)) 
      : yValue;
    
    const point = {
      x: xFormattedValue,
      y: yFormattedValue,
      name: `${item.company || '-'} ${item.product_name || '-'} ${item.model_name || '-'}`,
      color: getColorForCategoryFast(colorCategory),
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
      color: getColorForCategoryFast(category),
      marker: { symbol: 'circle' },
      opacity: dataSize > 5000 ? 0.5 : 0.8,
    }));
  
  if (series.length === 0 && dataToProcess.length > 0) {
    console.warn('[AIProcessorsGraph] No valid data points after filtering, creating placeholder series');
    const firstItem = dataToProcess.find(item => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      return xValue !== null && yValue !== null;
    });
    if (firstItem) {
      const xValue = getAxisData(firstItem, xAxis.value);
      const yValue = getAxisData(firstItem, yAxis.value);
      const xFormattedValue = (xAxis.value.value === 'release_date' || xAxis.value.value === 'release_year') 
        ? (typeof xValue === 'number' ? xValue : Date.parse(xValue)) 
        : xValue;
      const yFormattedValue = (yAxis.value.value === 'release_date' || yAxis.value.value === 'release_year') 
        ? (typeof yValue === 'number' ? yValue : Date.parse(yValue)) 
        : yValue;
      series = [{
        name: 'Data',
        data: [{
          x: xFormattedValue,
          y: yFormattedValue,
          name: `${firstItem.company || '-'} ${firstItem.product_name || '-'} ${firstItem.model_name || '-'}`,
          data: firstItem
        }],
        marker: { symbol: 'circle' },
        opacity: 0.8,
      }];
    }
  }
  
  let heatmapSeries = null;
  if (dataSize > 50000) {
    const pointData = dataToProcess.map(item => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      if (xValue === null || yValue === null) return null;
      const xFormattedValue = (xAxis.value.value === 'release_date' || xAxis.value.value === 'release_year') 
        ? (typeof xValue === 'number' ? xValue : Date.parse(xValue)) 
        : xValue;
      const yFormattedValue = (yAxis.value.value === 'release_date' || yAxis.value.value === 'release_year') 
        ? (typeof yValue === 'number' ? yValue : Date.parse(yValue)) 
        : yValue;
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
          
          currentZoomLevel.value = {
            xMin: xAxis.min,
            xMax: xAxis.max,
            yMin: yAxis.min,
            yMax: yAxis.max
          };
          
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
      type: ((xAxis.value?.value === 'release_date' || xAxis.value?.value === 'release_year')) ? 'datetime' : 'linear',
      labels: {
        formatter: function () {
          if (xAxis.value?.value === 'release_date' || xAxis.value?.value === 'release_year') {
            return new Date(this.value).getFullYear();
          }
          return this.value;
        }
      },
      tickInterval: ((xAxis.value?.value === 'release_date' || xAxis.value?.value === 'release_year')) ? null : 'auto',
      gridLineWidth: 1,
      min: ((xAxis.value?.value === 'release_date' || xAxis.value?.value === 'release_year')) ? undefined : 1,
      startOnTick: true,
      endOnTick: true,
    },
    yAxis: {
      title: { text: yAxis.value?.label || 'Y-Axis' },
      type: ((yAxis.value?.value === 'release_date' || yAxis.value?.value === 'release_year')) ? 'datetime' : 'linear',
      labels: {
        formatter: function () {
          if (yAxis.value?.value === 'release_date' || yAxis.value?.value === 'release_year') {
            return new Date(this.value).getFullYear();
          }
          return this.value;
        }
      },
      tickInterval: ((yAxis.value?.value === 'release_date' || yAxis.value?.value === 'release_year')) ? null : 'auto',
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
            ${manufacturer.name || data.company || '-'} 
            ${data.product_name || '-'} 
            ${data.model_name || '-'}
          `.trim().replace(/\s+/g, ' ');

          const header = `
            <div class="flex w-full justify-between gap-8">
              <div style="color: ${this.series.color}; white-space: normal;" class="font-bold">${name}</div>
              <div class="font-bold">${data.release_year || (soc.release_date ? new Date(soc.release_date).getFullYear() : '-')}</div>
            </div><br>
          `;

          const details = `
            <div>
              <span style="color: gray; font-size: 11px">Performance (TOPS):</span> ${data.performance_tops || '-'}<br>
              <span style="color: gray; font-size: 11px">Clock Rate:</span> ${data.clock_rate_ghz || '-'} GHz<br>
              <span style="color: gray; font-size: 11px">TDP:</span> ${data.tdp_w || '-'} W<br>
              <span style="color: gray; font-size: 11px">Die Size:</span> ${data.die_size_mm2 || '-'} mm²<br>
              <span style="color: gray; font-size: 11px">Process Node:</span> ${data.process_node_nm || '-'} nm<br>
              <span style="color: gray; font-size: 11px">SRAM:</span> ${data.sram_mb || '-'} MB<br>
              <span style="color: gray; font-size: 11px">DRAM:</span> ${data.dram_gb || '-'} GB<br>
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
        turboThreshold: 0,
        dataGrouping: {
          enabled: true,
          approximation: 'average',
          groupPixelWidth: 5,
          smoothed: false,
        },
        marker: {
          radius: dataSize > 10000 ? 1 : 4,
          symbol: 'circle',
          enabledThreshold: 20000,
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
  
  console.log('[AIProcessorsGraph] Returning chartConfig with', series.length, 'series, heatmapSeries:', !!heatmapSeries);
  return chartConfig
});
</script>
