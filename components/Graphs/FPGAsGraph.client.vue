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
      if (typeof sample[key] === 'number' || key === 'release_year') {
        availableFields.add(key);
      }
    }
    
    // Check nested SoC fields
    if (sample.SoC) {
      for (const key in sample.SoC) {
        if (typeof sample.SoC[key] === 'number' || key === 'release_year') {
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

// Y-Axis options exclude release_year and the selected X-axis value
const yAxisOptions = computed(() => {
  let options = numericOptions.value.filter(option => option.value !== 'release_year');
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

// Utility: Get the appropriate value from an item based on the axis's source
// Handles both nested structure (from regular API) and flattened structure (from chart-data endpoint)
// MUST be defined before watch callback to avoid hoisting issues
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
    // Special handling for release_year: extract from release_date if needed
    if (axis.value === 'release_year') {
      // First check if release_year is already available
      if (item.release_year !== null && item.release_year !== undefined) {
        return item.release_year;
      }
      // Extract from release_date if available
      const releaseDate = item.release_date ?? item.SoC?.release_date ?? null;
      if (releaseDate) {
        return new Date(releaseDate).getFullYear();
      }
      return null;
    }
    // Try flattened structure first (chart-data endpoint), then nested structure
    return item[axis.value] ?? item.SoC?.[axis.value] ?? null;
  }
  // Handle FPGA fields - release_year is already in the data
  const result = item[axis.value] ?? null;
  return result;
};

// Set initial values when options are available
watch([xAxisOptions, yAxisOptions, filteredGroupOptions], ([xOpts, yOpts, groupOpts]) => {
  
  // Helper function to calculate data coverage for a field
  const getFieldCoverage = (opt) => {
    if (!props.data || props.data.length === 0) return 0;
    const count = props.data.filter(item => {
      const value = getAxisData(item, opt);
      return value !== null && value !== undefined;
    }).length;
    return count / props.data.length;
  };

  if (!xAxis.value && xOpts.length > 0) {
    // Smart selection: prefer release_year as default, then best coverage
    const withCoverage = xOpts.map(opt => ({
      opt,
      coverage: getFieldCoverage(opt)
    })).sort((a, b) => {
      // Prefer release_year first (default x-axis)
      if (a.opt.value === 'release_year') return -1;
      if (b.opt.value === 'release_year') return 1;
      // Otherwise sort by coverage descending
      return b.coverage - a.coverage;
    });
    
    const selectedX = withCoverage[0]?.opt || xOpts[0];
    xAxis.value = selectedX;
  }
  if (!yAxis.value && yOpts.length > 0) {
    // Smart selection: prefer equivalent_lut_count as default, then highest data coverage
    const withCoverage = yOpts.map(opt => ({
      opt,
      coverage: getFieldCoverage(opt)
    })).sort((a, b) => {
      // Prefer equivalent_lut_count first (default y-axis)
      if (a.opt.value === 'equivalent_lut_count' && a.opt.value !== xAxis.value?.value) return -1;
      if (b.opt.value === 'equivalent_lut_count' && b.opt.value !== xAxis.value?.value) return 1;
      // Prefer process_node if it has >50% coverage and not already X axis
      if (a.opt.value === 'process_node' && a.coverage > 0.5 && a.opt.value !== xAxis.value?.value) return -1;
      if (b.opt.value === 'process_node' && b.coverage > 0.5 && b.opt.value !== xAxis.value?.value) return 1;
      // Otherwise sort by coverage descending
      return b.coverage - a.coverage;
    });
    
    const selectedY = withCoverage[0]?.opt || yOpts[0];
    yAxis.value = selectedY;
  }
  if (!groupBy.value && groupOpts.length > 0) {
    // Default groupBy to manufacturer/manufacturer_name if available
    const manufacturerOpt = groupOpts.find(opt => opt.value === 'manufacturer_name' || opt.value === 'manufacturer');
    if (manufacturerOpt) {
      groupBy.value = manufacturerOpt;
    } else {
      // Smart selection: pick field with highest data coverage
      const withCoverage = groupOpts.map(opt => ({
        opt,
        coverage: getFieldCoverage(opt)
      })).sort((a, b) => {
        // Prefer family_subfamily if it has >50% coverage
        if (a.opt.value === 'family_subfamily' && a.coverage > 0.5) return -1;
        if (b.opt.value === 'family_subfamily' && b.coverage > 0.5) return 1;
        // Otherwise sort by coverage descending
        return b.coverage - a.coverage;
      });
      
      const selectedGroup = withCoverage[0]?.opt || groupOpts[0];
      groupBy.value = selectedGroup;
    }
  }
}, { immediate: true });

// Chart instance and zoom tracking
const chartInstance = ref(null);
const currentZoomLevel = ref({ xMin: null, xMax: null, yMin: null, yMax: null });

// Seaborn-inspired color schemes for grouping.
const seabornColors = {
  generation: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  family_subfamily: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3', '#8c8c8c'],
  model: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3'],
  vendor: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  product_name: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860'],
  logic_resource_type: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  internal_operating_voltage: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  processing_system: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  off_chip_memory_type: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  multiplier_dsp_block_type: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  platform: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3'],
  manufacturer_name: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860'],
  processNode: value => {
    const maxLightness = 200;
    const minLightness = 90;
    const numericValue = parseFloat(value) || 0;
    const lightness = Math.max(minLightness, maxLightness - (numericValue / 200) * (maxLightness - minLightness));
    return `rgb(0, ${lightness}, 0, 0.8)`;
  },
  default: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3', '#8c8c8c'],
};

// Determine the color for a given grouping category.
const getColorForCategory = (colorCategory) => {
  if (!colorCategory) return 'gray';
  
  // Special handling for process_node (numeric gradient)
  if (groupBy.value?.value === 'process_node') {
    return seabornColors.processNode(colorCategory);
  }
  
  const groupByValue = groupBy.value?.value;
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

const chartOptions = computed(() => {
  
  // Handle undefined or empty data
  if (!props.data || !props.data.length) {
    return {
      chart: { type: 'scatter' },
      title: { text: 'No data available' },
      series: []
    }
  }
  
  // Check if axes are initialized before proceeding
  if (!xAxis.value || !yAxis.value) {
    return {
      chart: { type: 'scatter' },
      title: { text: 'Loading chart configuration...' },
      series: []
    }
  }
  
  
  // Use all data - Highcharts turbo mode and data grouping handle performance
  const dataToProcess = props.data;
  const dataSize = props.data.length;

  // Build category mapping for y-axis if it's a category type (needed for both grouping and axis config)
  // For scatter plots with category axes, we need to map category strings to numeric indices
  const yAxisIsCategory = yAxis.value?.value === 'process_node' || (() => {
    if (props.data && props.data.length > 0) {
      const sampleValues = props.data.slice(0, 10).map(item => getAxisData(item, yAxis.value)).filter(v => v !== null && v !== undefined);
      if (sampleValues.length > 0) {
        return !sampleValues.every(v => typeof v === 'number' || (typeof v === 'string' && !isNaN(parseFloat(v)) && isFinite(v) && v.trim() !== ''));
      }
    }
    return false;
  })();
  
  let yCategoryMap = {};
  let yCategories = [];
  if (yAxisIsCategory) {
    // Collect all unique y-axis values
    const uniqueYValues = [...new Set(dataToProcess.map(item => getAxisData(item, yAxis.value)).filter(v => v !== null && v !== undefined))];
    yCategories = uniqueYValues.sort();
    // Create mapping: category string -> numeric index
    yCategoryMap = yCategories.reduce((acc, cat, idx) => {
      acc[cat] = idx;
      return acc;
    }, {});
  }

  let groupedData;
  let series;


  if (groupBy.value?.value === 'process_node') {
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
            const xFormattedValue = (xAxis.value?.value === 'release_year' || xAxis.value?.value === 'release_date')
              ? (typeof xValue === 'number' && xValue >= 1900 && xValue <= 2100 
                  ? Date.parse(`${xValue}-01-01`) 
                  : (typeof xValue === 'number' ? xValue : Date.parse(xValue)))
              : xValue;
            const yFormattedValue = (yAxis.value?.value === 'release_year' || yAxis.value?.value === 'release_date')
              ? (typeof yValue === 'number' && yValue >= 1900 && yValue <= 2100 
                  ? Date.parse(`${yValue}-01-01`) 
                  : (typeof yValue === 'number' ? yValue : Date.parse(yValue)))
              : (yAxisIsCategory && yCategoryMap.hasOwnProperty(yValue) ? yCategoryMap[yValue] : yValue);
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
    
    // Guard: ensure groupBy is initialized
    if (!groupBy.value) {
      return {
        chart: { type: 'scatter' },
        title: { text: 'Loading chart configuration...' },
        series: []
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
      // Special handling for process_node (numeric gradient) - use original function
      if (groupBy.value?.value === 'process_node') {
        return seabornColors.processNode(colorCategory);
      }
      return colorMap.get(colorCategory) || 'gray';
    };
    
    groupedData = dataToProcess.reduce((acc, item, index) => {
      const xValue = getAxisData(item, xAxis.value);
      let yValue = getAxisData(item, yAxis.value);
      let colorCategory = getAxisData(item, groupBy.value);


      if (xValue === null || yValue === null || colorCategory === null) return acc;

      // Convert release_year to timestamp if it's the x-axis (like AIProcessorsGraph does)
      const xFormattedValue = (xAxis.value?.value === 'release_year' || xAxis.value?.value === 'release_date')
        ? (typeof xValue === 'number' && xValue >= 1900 && xValue <= 2100 
            ? Date.parse(`${xValue}-01-01`) 
            : (typeof xValue === 'number' ? xValue : Date.parse(xValue)))
        : xValue;
      // Convert y-value to numeric index if it's a category, or convert release_year to timestamp
      const yFormattedValue = yAxisIsCategory && yCategoryMap.hasOwnProperty(yValue) 
        ? yCategoryMap[yValue] 
        : ((yAxis.value?.value === 'release_year' || yAxis.value?.value === 'release_date')
            ? (typeof yValue === 'number' && yValue >= 1900 && yValue <= 2100 
                ? Date.parse(`${yValue}-01-01`) 
                : (typeof yValue === 'number' ? yValue : Date.parse(yValue)))
            : yValue);
      
      const point = {
        x: xFormattedValue,
        y: yFormattedValue,
        name: `${item.generation || '-'} ${item.family_subfamily || '-'} ${item.model || '-'}`,
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
        const xFormattedValue = (xAxis.value?.value === 'release_year' || xAxis.value?.value === 'release_date')
          ? (typeof xValue === 'number' && xValue >= 1900 && xValue <= 2100 
              ? Date.parse(`${xValue}-01-01`) 
              : (typeof xValue === 'number' ? xValue : Date.parse(xValue)))
          : xValue;
        const yFormattedValue = (yAxis.value?.value === 'release_year' || yAxis.value?.value === 'release_date')
          ? (typeof yValue === 'number' && yValue >= 1900 && yValue <= 2100 
              ? Date.parse(`${yValue}-01-01`) 
              : (typeof yValue === 'number' ? yValue : Date.parse(yValue)))
          : (yAxisIsCategory && yCategoryMap.hasOwnProperty(yValue) ? yCategoryMap[yValue] : yValue);
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
      const xFormattedValue = (xAxis.value?.value === 'release_year' || xAxis.value?.value === 'release_date')
        ? (typeof xValue === 'number' && xValue >= 1900 && xValue <= 2100 
            ? Date.parse(`${xValue}-01-01`) 
            : (typeof xValue === 'number' ? xValue : Date.parse(xValue)))
        : xValue;
      const yFormattedValue = (yAxis.value?.value === 'release_year' || yAxis.value?.value === 'release_date')
        ? (typeof yValue === 'number' && yValue >= 1900 && yValue <= 2100 
            ? Date.parse(`${yValue}-01-01`) 
            : (typeof yValue === 'number' ? yValue : Date.parse(yValue)))
        : (yAxisIsCategory && yCategoryMap.hasOwnProperty(yValue) ? yCategoryMap[yValue] : yValue);
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
        text: xAxis.value?.label || 'X-Axis',
      },
      type: (xAxis.value?.value === 'release_year' || xAxis.value?.value === 'release_date') ? 'datetime' : 'linear',
      labels: {
        formatter: function () {
          if (xAxis.value?.value === 'release_year' || xAxis.value?.value === 'release_date') {
            return new Date(this.value).getFullYear();
          }
          return this.value;
        }
      },
      tickInterval: (xAxis.value?.value === 'release_year' || xAxis.value?.value === 'release_date') ? null : 'auto',
      gridLineWidth: 1,
      min: (xAxis.value?.value === 'release_year' || xAxis.value?.value === 'release_date') ? undefined : 1,
      startOnTick: false,
      endOnTick: true,
    },
    yAxis: {
      title: {
        text: yAxis.value?.label || 'Y-Axis',
      },
      type: (() => {
        // Determine axis type based on the field and data
        if (yAxis.value?.value === 'release_date' || yAxis.value?.value === 'release_year') return 'datetime';
        // Special case: process_node contains strings like "2000nm", "800nm" - use category
        if (yAxis.value?.value === 'process_node') {
          return 'category';
        }
        // Check if y-axis values are numeric by sampling the data
        if (props.data && props.data.length > 0) {
          const sampleValues = props.data.slice(0, 10).map(item => getAxisData(item, yAxis.value)).filter(v => v !== null && v !== undefined);
          if (sampleValues.length > 0) {
            const isNumeric = sampleValues.every(v => typeof v === 'number' || (typeof v === 'string' && !isNaN(parseFloat(v)) && isFinite(v) && v.trim() !== ''));
            return isNumeric ? 'logarithmic' : 'category';
          }
        }
        // Default to logarithmic for numeric fields
        return 'logarithmic';
      })(),
      categories: yCategories.length > 0 ? yCategories : undefined,
      labels: {
        formatter: function () {
          if (yAxis.value?.value === 'release_year' || yAxis.value?.value === 'release_date') {
            return new Date(this.value).getFullYear();
          }
          // For category axes, this.value is the numeric index, use categories array
          if (yCategories.length > 0 && typeof this.value === 'number') {
            return yCategories[this.value] || this.value;
          }
          return this.value;
        }
      },
      tickInterval: (yAxis.value?.value === 'release_year' || yAxis.value?.value === 'release_date') ? null : 'auto',
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
          // Handle both nested (SoC) and flattened (chart-data) structures
          const soc = data.SoC || {};
          const releaseDate = data.release_date || soc.release_date || null;
          const releaseYear = data.release_year || null;
          const displayYear = releaseDate ? new Date(releaseDate).getFullYear() : (releaseYear || '-');
          const processNode = data.process_node || soc.process_node || null;
          
          const name = `
            ${data.generation || '-'} 
            ${data.family_subfamily || '-'} 
            ${data.model || '-'}
          `.trim().replace(/\s+/g, ' ');

          const header = `
            <div class="flex w-full justify-between gap-8">
              <div style="color: ${this.series.color}; white-space: normal;" class="font-bold">${name}</div>
              <div class="font-bold">${displayYear}</div>
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
              <span style="color: gray; font-size: 11px">Release Year:</span> ${displayYear}<br>
              <span style="color: gray; font-size: 11px">Process Node:</span> ${processNode ? processNode + ' nm' : '-'}<br>
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
