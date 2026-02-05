<template>
  <div class="scatter-plot">
    <div class="flex flex-col sm:flex-row sm:justify-space-between flex-wrap gap-4 items-center mb-4">
      <!-- X Axis Selection -->
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
        <!-- Y Axis Selection -->
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
// import { useRoute } from 'vue-router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu/dropdown-menu-index';
import { 
  calculateDataDensity, 
  binData, 
  clusterData, 
  createHeatmap,
  detectDenseRegions 
} from '@/lib/chartUtils';
import { getNumericOptions, getCategoricalOptions, generateNumericOptionsFromData, generateCategoricalOptionsFromData, validateFieldMaps } from '@/lib/chartFieldMaps';
// import { color } from 'highcharts';

// Error handling for chart component
const chartError = ref(null);
onErrorCaptured((err) => {
  console.error('Chart component error:', err);
  chartError.value = err.message || 'An error occurred while rendering the chart';
  return false; // Prevent error from propagating
});

// Props: expect an array of FPGA data points
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Performance optimization: Memoize expensive computations
// const memoizedData = ref(null);
// const lastDataHash = ref('');

// Create a hash of the data to detect changes
// const createDataHash = (data) => {
//   if (!data || !data.length) return '';
//   return JSON.stringify(data.map(item => ({
//     fpga_id: item.fpga_id,
//     family: item.family,
//     microarchitecture: item.microarchitecture,
//     // Only include key fields for hashing
//   })));
// };

// Comprehensive numeric options for X and Y axes from field map
// Falls back to dynamic generation if data structure differs
const numericOptions = computed(() => {
  // Use comprehensive field map first
  const fieldMapOptions = getNumericOptions('fpga');
  
  // Validate field maps against actual data
  if (props.data && props.data.length > 0) {
    validateFieldMaps(fieldMapOptions, props.data, 'fpga');
    
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
      const dynamicOptions = generateNumericOptionsFromData(props.data, 'fpga');
      if (dynamicOptions.length > filtered.length) {
        console.warn('[FPGAsGraph] Field map incomplete, using dynamic field detection');
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

// Comprehensive Group By options for FPGA data from field map
const groupOptions = getCategoricalOptions('fpga');

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
      const dynamicOptions = generateCategoricalOptionsFromData(props.data, 'fpga');
      if (dynamicOptions.length > 0) {
        console.warn('[FPGAsGraph] Group options incomplete, using dynamic field detection');
        return dynamicOptions;
      }
    }
    
    return filtered;
  }
  return groupOptions;
});

// Initialize axes with first available options, with fallbacks
const xAxis = ref(null);
const yAxis = ref(null);
const groupBy = ref(null);

// Set initial values when options are available
watch([xAxisOptions, yAxisOptions, filteredGroupOptions], ([xOpts, yOpts, groupOpts]) => {
  if (!xAxis.value && xOpts.length > 0) {
    xAxis.value = xOpts.find(opt => opt.value === 'release_date') || xOpts[0];
  }
  if (!yAxis.value && yOpts.length > 0) {
    yAxis.value = yOpts.find(opt => opt.value === 'luts') || yOpts[0];
  }
  if (!groupBy.value && groupOpts.length > 0) {
    groupBy.value = groupOpts.find(opt => opt.value === 'generation') || groupOpts[0];
  }
}, { immediate: true });

// Chart instance and zoom tracking
const chartInstance = ref(null);
const currentZoomLevel = ref({ xMin: null, xMax: null, yMin: null, yMax: null });

// Utility: Get the appropriate value from an item based on the axis's source
// Handles both nested structure (from regular API) and flattened structure (from chart-data endpoint)
const getAxisData = (item, axis) => {
  if (!item || !axis) return null;
  
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
  // Handle FPGA fields
  return item[axis.value] ?? null;
};

// Define color schemes (similar to Seaborn) for grouping categories
const seabornColors = {
  generation: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  family: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3', '#8c8c8c'],
  processNode: value => {
    const maxLightness = 200;
    const minLightness = 90;
    const numericValue = parseFloat(value) || 0;
    const lightness = Math.max(minLightness, maxLightness - (numericValue / 200) * (maxLightness - minLightness));
    return `rgb(0, ${lightness}, 0, 0.8)`;
  }
};

// Determine color based on the current group option
const getColorForCategory = (colorCategory) => {
  if (groupBy.value.value === 'generation') {
    const generations = [...new Set(props.data.map(item => item.generation))];
    const colorIndex = generations.indexOf(colorCategory) % seabornColors.generation.length;
    return seabornColors.generation[colorIndex];
  } else if (groupBy.value.value === 'family_subfamily') {
    const families = [...new Set(props.data.map(item => item.family_subfamily))];
    const colorIndex = families.indexOf(colorCategory) % seabornColors.family.length;
    return seabornColors.family[colorIndex];
  } else if (groupBy.value.value === 'process_node') {
    return seabornColors.processNode(colorCategory);
  }
  return 'gray';
};

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

  let groupedData;
  let series;

  if (groupBy.value.value === 'process_node') {
    // When grouping by process node, bucket data using example Fibonacci buckets
    const processNodeValues = dataToProcess
      .map(item => getAxisData(item, groupBy.value))
      .filter(Boolean)
      .sort((a, b) => a - b);

    const fibonacciBuckets = [5, 8, 13, 21, 34, 55, 89, 144, 233, Infinity];
    const buckets = fibonacciBuckets.reduce((acc, bucketSize, i) => {
      const min = i === 0 ? Math.min(...processNodeValues) : acc[i - 1].max + 1;
      let max = min + bucketSize - 1;
      if (min > 16) {
        max = Math.ceil(max / 100) * 100;
      }
      acc.push({ min, max });
      return acc;
    }, []);

    groupedData = buckets.reduce((acc, bucket) => {
      const bucketKey = `${bucket.min} - ${bucket.max === Infinity ? '∞' : bucket.max}`;
      acc[bucketKey] = dataToProcess
        .map(item => {
          const processNode = getAxisData(item, groupBy.value);
          const xValue = getAxisData(item, xAxis.value);
          const yValue = getAxisData(item, yAxis.value);

          if (xValue !== null && yValue !== null && processNode >= bucket.min && processNode <= bucket.max) {
            const xFormattedValue = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;
            const yFormattedValue = yAxis.value.value === 'release_date' ? Date.parse(yValue) : yValue;
            return {
              x: xFormattedValue,
              y: yFormattedValue,
              name: `${item.generation || '-'} ${item.family_subfamily || '-'} ${item.model || '-'}`,
              data: item,
              color: seabornColors.processNode(processNode),
            };
          }
          return null;
        })
        .filter(point => point !== null);
      return acc;
    }, {});

    series = Object.keys(groupedData).map(bucketKey => ({
      name: bucketKey,
      data: groupedData[bucketKey],
      marker: { symbol: 'circle' },
      opacity: dataSize > 5000 ? 0.5 : 0.8,
      color: seabornColors.processNode(parseFloat(bucketKey)),
      showInLegend: true,
    }));
  } else {
    // Default grouping: group points based on the selected group property
    groupedData = dataToProcess.reduce((acc, item) => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      let colorCategory = getAxisData(item, groupBy.value);

      if (xValue === null || yValue === null || colorCategory === null) return acc;

      const xFormattedValue = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;
      const yFormattedValue = yAxis.value.value === 'release_date' ? Date.parse(yValue) : yValue;
      const point = {
        x: xFormattedValue,
        y: yFormattedValue,
        name: `${item.generation || '-'} ${item.family_subfamily || '-'} ${item.model || '-'}`,
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
      console.warn('[FPGAsGraph] No valid data points after filtering, creating placeholder series');
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
            name: `${firstItem.generation || '-'} ${firstItem.family_subfamily || '-'} ${firstItem.model || '-'}`,
            data: firstItem
          }],
          marker: { symbol: 'circle' },
          opacity: 0.8,
        }];
      }
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
      title: {
        text: xAxis.value.label,
      },
      type: xAxis.value.value === 'release_date' ? 'datetime' : 'linear',
      labels: {
        formatter: function () {
          if (xAxis.value.value === 'release_date') {
            const date = new Date(this.value);
            return date.getFullYear();
          }
          return this.value;
        }
      },
      tickInterval: xAxis.value.value === 'release_date' ? null : 'auto',
      gridLineWidth: 1,
      min: xAxis.value.value === 'release_date' ? undefined : 1,
      startOnTick: false,
      endOnTick: true,
    },
    yAxis: {
      title: {
        text: yAxis.value.label,
      },
      type: (yAxis.value?.value === 'release_date') ? 'datetime' : 'logarithmic',
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
          const name = `
            ${data.generation || '-'} 
            ${data.family_subfamily || '-'} 
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
              <span style="color: gray; font-size: 11px">Generation:</span> ${data.generation || '-'}<br>
              <span style="color: gray; font-size: 11px">Family/Subfamily:</span> ${data.family_subfamily || '-'}<br>
              <span style="color: gray; font-size: 11px">Model:</span> ${data.model || '-'}<br>
              <span style="color: gray; font-size: 11px">Processing System:</span> ${data.processing_system || '-'}<br>
            </div><br>
          `;

          const specs = `
            <div>
              <span style="color: gray; font-size: 11px">Release Date:</span> ${soc.release_date ? new Date(soc.release_date).getFullYear() : '-'}<br>
              <span style="color: gray; font-size: 11px">Process Node:</span> ${soc.process_node ? soc.process_node + ' nm' : '-'}<br>
              <span style="color: gray; font-size: 11px">CLBs:</span> ${data.clbs || '-'}<br>
              <span style="color: gray; font-size: 11px">LUTs:</span> ${data.luts || '-'}<br>
              <span style="color: gray; font-size: 11px">FFs:</span> ${data.ffs || '-'}<br>
              <span style="color: gray; font-size: 11px">Block RAMs:</span> ${data.block_rams || '-'}<br>
              <span style="color: gray; font-size: 11px">DSP Blocks:</span> ${data.multiplier_dsp_blocks || '-'}<br>
              <span style="color: gray; font-size: 11px">PLLs:</span> ${data.plls || '-'}<br>
            </div><br>
          `;

          return `
            <div 
              style="border-color: ${this.series.color};"
              class="bg-white/70 backdrop-blur-sm shadow-sm p-4 border rounded-lg">
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
