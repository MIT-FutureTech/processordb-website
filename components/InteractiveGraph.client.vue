<template>
  <div class="scatter-plot">
    <div class="flex flex-col sm:flex-row sm:justify-space-between flex-wrap gap-4 items-center mb-4">
      <!-- X Axis Selection -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-center gap-4 flex-1">

        <div class="">
          <label class="text-gray-700 block text-xs mb-0.5">X-Axis</label>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="bg-gray-50 hover:bg-gray-100 flex items-center gap-2 rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring text-base">
              {{ xAxis?.label || "Select X-Axis" }} <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>

            </DropdownMenuTrigger>
            <DropdownMenuContent side-offset="0" align="start" class="w-full left-0">
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
        <!-- Y Axis Selection -->
        <div class="">
          <label class="text-gray-700 block text-xs mb-0.5">Y-Axis</label>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="bg-gray-50 hover:bg-gray-100 flex items-center gap-2 rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring text-base">
              {{ yAxis?.label || "Select Y-Axis" }} <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>

            </DropdownMenuTrigger>
            <DropdownMenuContent side-offset="0" align="start" class="w-full left-0">
              <DropdownMenuItem v-for="option in yAxisOptions" :key="option.value" class="cursor-pointer"
                @click="yAxis = option">
                {{ option.label }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <!-- Color Categorization Selection -->
      <div class="">
        <label class="text-gray-700 block text-xs mb-0.5">Group By</label>
        <DropdownMenu>
          <DropdownMenuTrigger
            class="bg-gray-50 hover:bg-gray-100 flex items-center gap-2 rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring text-base">
            {{ groupBy?.label || "Select Group By" }} <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent side-offset="0" align="start" class="w-full left-0">
            <DropdownMenuItem v-for="option in filteredGroupOptions" :key="option.value" class="cursor-pointer"
              @click="groupBy = option">
              {{ option.label }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <highcharts :options="chartOptions" />
  </div>
</template>

<script setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Reactive state
const xAxisOptions = [
  { label: 'Release Date', value: 'release_date', source: 'soc' },
  { label: 'Clock Speed (MHz)', value: 'clock', source: 'processor' },
  { label: 'Max Clock Speed (MHz)', value: 'max_clock', source: 'processor' },
  { label: 'TDP (W)', value: 'tdp', source: 'processor' },
  { label: 'Die Size (mm^2)', value: 'die_sizes', source: 'soc' },
  { label: 'Transistors (million)', value: 'total_transistor_count', source: 'soc' },
  { label: 'Lithography (nm)', value: 'process_node', source: 'soc' },
  { label: 'FP64 Operations (GFLOPS)', value: 'fp64_ops', source: 'processor' },
  { label: 'FP32 Operations (GFLOPS)', value: 'fp32_ops', source: 'processor' },
  { label: 'FP16 Operations (GFLOPS)', value: 'fp16_ops', source: 'processor' },
];
const yAxisOptions = xAxisOptions.filter(option => option.value !== 'release_date');
const groupOptions = [
  { label: 'Processor Type', value: 'processor_type', source: 'processor' },
  { label: 'Manufacturer', value: 'manufacturer_name', source: 'soc' },
  { label: 'Process Node', value: 'process_node', source: 'soc' },
];
const route = useRoute()
// Computed property for filtered group options based on route params
const filteredGroupOptions = computed(() => {
    const manufacturerFilterActive = route.params.slug?.includes('manufacturer')
    const processorTypeFilterActive = route.params.slug?.includes('processorType')

    return groupOptions.filter(option => {
        // Exclude 'Manufacturer' option if manufacturer filter is active
        if (option.value === 'manufacturer_name' && manufacturerFilterActive) {
            return false
        }
        // Exclude 'Processor Type' option if processor type filter is active
        if (option.value === 'processor_type' && processorTypeFilterActive) {
            return false
        }
        return true
    })
})
console.log(filteredGroupOptions)
const xAxis = ref(xAxisOptions[0]);
const yAxis = ref(yAxisOptions[0]);
const groupBy = ref(filteredGroupOptions.value[0]);

// Utility to get data based on selected axis options
const getAxisData = (item, axis) => {
  if (axis.source === 'processor' && item.processors) {
    return item.processors[0]?.[axis.value] ?? null;
  }
  return item[axis.value] ?? null;
};

// Define color schemes similar to Seaborn's style
const seabornColors = {
  processorType: ['#4c72b0', '#dd8452'],
  manufacturer: ['#4c72b0', '#dd8452', '#55a868', '#c44e52', '#8172b3', '#937860', '#da8bc3', '#8c8c8c', '#ccb974', '#64b5cd'],
  processNode: value => {
    const maxLightness = 200;
    const minLightness = 90;
    const lightness = Math.max(minLightness, maxLightness - (value / 200) * (maxLightness - minLightness));
    return `rgb(0, ${lightness}, 0, 0.8)`;
  }
};

// Function to get top 10 manufacturers by number of points
const getTopManufacturers = () => {
  const manufacturerCounts = props.data.reduce((acc, item) => {
    const manufacturer = item.manufacturer_name;
    if (!manufacturer) return acc;
    acc[manufacturer] = (acc[manufacturer] || 0) + 1;
    return acc;
  }, {});

  const sortedManufacturers = Object.entries(manufacturerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);

  return sortedManufacturers;
};

const topManufacturers = computed(() => getTopManufacturers());

// Function to determine color based on selected color option
const getColorForCategory = (colorCategory) => {
  if (groupBy.value.value === 'processor_type') {
    return colorCategory === 'GPU' ? seabornColors.processorType[0] : seabornColors.processorType[1];
  } else if (groupBy.value.value === 'manufacturer_name') {
    const manufacturers = [...new Set(props.data.map(item => item.manufacturer_name))];
    const colorIndex = manufacturers.indexOf(colorCategory) % seabornColors.manufacturer.length;
    return seabornColors.manufacturer[colorIndex];
  } else if (groupBy.value.value === 'process_node') {
    return seabornColors.processNode(colorCategory);
  }
  return 'gray';
};
const chartOptions = computed(() => {
  let groupedData;
  let series;

  if (groupBy.value.value === 'process_node') {
    // Collect all process node values, sort them, and split into 10 quantile buckets
    const processNodeValues = props.data
      .map(item => getAxisData(item, groupBy.value))
      .filter(Boolean)
      .sort((a, b) => a - b);

    const fibonacciBuckets = [5, 8, 13, 21, 34, 55, 89, 144, 233, Infinity];

    const buckets = fibonacciBuckets.reduce((acc, bucketSize, i) => {
      const min = i === 0 ? Math.min(...processNodeValues) : acc[i - 1].max + 1;
      let max = min + bucketSize - 1;

      // Round up to the next hundred if min exceeds 16
      if (min > 16) {
        max = Math.ceil(max / 100) * 100;
      }

      acc.push({ min, max });
      return acc;
    }, []);
    // Group data by quantile-based process node buckets
    groupedData = buckets.reduce((acc, bucket) => {
      const bucketKey = `${bucket.min} - ${bucket.max == Infinity ? '∞' : bucket.max}`;
      acc[bucketKey] = props.data
        .map(item => {
          const processNode = getAxisData(item, groupBy.value);
          const xValue = getAxisData(item, xAxis.value);
          const yValue = getAxisData(item, yAxis.value);

          // Only include points with valid x and y values within the current bucket
          if (
            xValue !== null &&
            yValue !== null &&
            processNode >= bucket.min &&
            processNode <= bucket.max
          ) {
            return {
              x: xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue,
              y: yValue,
              name: item.soc_name,
              data: item,
              color: seabornColors.processNode(processNode), // Gradient color based on exact process node value
            };
          }
          return null;
        })
        .filter(point => point !== null); // Filter out null points
      return acc;
    }, {});

    // Create a series for each bucket, with individual colors for points
    series = Object.keys(groupedData).map(bucketKey => ({
      name: bucketKey,
      data: groupedData[bucketKey],
      marker: { symbol: 'circle' },
      opacity: 0.8,
      color: seabornColors.processNode(parseFloat(bucketKey)),
      showInLegend: true,
    }));
  } else {
    // Default grouping behavior
    groupedData = props.data.reduce((acc, item) => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      let colorCategory = getAxisData(item, groupBy.value);

      if (xValue === null || yValue === null || colorCategory === null) return acc;

      // If grouping by manufacturer and manufacturer is not in top 10, assign to "Others"
      if (groupBy.value.value === 'manufacturer_name' && !topManufacturers.value.includes(colorCategory)) {
        colorCategory = 'Others';
      }

      const xFormattedValue = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;

      const point = {
        x: xFormattedValue,
        y: yValue,
        name: item.soc_name,
        data: item,
      };

      if (!acc[colorCategory]) {
        acc[colorCategory] = [];
      }
      acc[colorCategory].push(point);
      return acc;
    }, {});

    // Create series for each category, sorted by number of points, with "Others" at the end
    series = Object.keys(groupedData)
      .sort((a, b) => {
        if (a === 'Others') return 1; // Keep "Others" last
        if (b === 'Others') return -1;
        return groupedData[b].length - groupedData[a].length; // Sort by number of points
      })
      .map(category => ({
        name: category,
        data: groupedData[category],
        color: getColorForCategory(category),
        marker: { symbol: 'circle' },
        opacity: 0.8,
      }));
  }

  return {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
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
      startOnTick: true,
      endOnTick: true,
      type: xAxis.value.value !== 'release_date' ? 'logarithmic' : undefined,
      startOnTick: false,

    },
    yAxis: {
      title: {
        text: yAxis.value.label,
      },
      type: 'logarithmic',
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
      const processor = data.processors && data.processors[0] ? data.processors[0] : {};

      // Constructed name: Manufacturer + Family + Microarchitecture + Model
      const name = `
        ${data.manufacturer_name || '-'} 
        ${processor.family || '-'} 
        ${processor.microarchitecture || '-'} 
        ${processor.model || '-'}
      `.trim().replace(/\s+/g, ' ');

      // Header with Name and Release Year
      const header = `
        <div class="flex w-full justify-between gap-8">
          <div style="color: ${this.series.color}; white-space: normal;" class="font-bold">${name}</div>
          <div class="font-bold">${new Date(data.release_date).getFullYear()}</div>
        </div><br>
      `;

      // Manufacturer, Family, Microarchitecture, Model
      const details = `
        <div>
          <span style="color: gray; font-size: 11px">Manufacturer:</span> ${data.manufacturer_name || '-'}<br>
          <span style="color: gray; font-size: 11px">Family:</span> ${processor.family || '-'}<br>
          <span style="color: gray; font-size: 11px">Microarchitecture:</span> ${processor.microarchitecture || '-'}<br>
          <span style="color: gray; font-size: 11px">Model:</span> ${processor.model || '-'}<br>
        </div><br>
      `;

      // Release Date, Process Node, Die Size, Transistor Count with conditional units
      const specs = `
        <div>
          <span style="color: gray; font-size: 11px">Release Date:</span> ${new Date(data.release_date).getFullYear() || '-'}<br>
          <span style="color: gray; font-size: 11px">Process Node:</span> ${data.process_node ? data.process_node + ' nm' : '-'}<br>
          <span style="color: gray; font-size: 11px">Die Size:</span> ${data.die_sizes ? data.die_sizes + ' mm²' : '-'}<br>
          <span style="color: gray; font-size: 11px">Transistor Count:</span> ${data.total_transistor_count ? data.total_transistor_count + ' million' : '-'}<br>
        </div><br>
      `;

      // Clock Speeds, TDP, Lithography with conditional units
      const performance = `
        <div>
          <span style="color: gray; font-size: 11px">Base Clock:</span> ${processor.clock ? processor.clock + ' MHz' : '-'}<br>
          <span style="color: gray; font-size: 11px">Max Clock:</span> ${processor.max_clock ? processor.max_clock + ' MHz' : '-'}<br>
          <span style="color: gray; font-size: 11px">TDP:</span> ${processor.tdp ? processor.tdp + ' W' : '-'}<br>
          <span style="color: gray; font-size: 11px">Lithography:</span> ${processor.lithography ? processor.lithography + ' nm' : '-'}<br>
        </div>
      `;

      return `
        <div 
          style="border-color: ${this.series.color};"
          class="bg-white/70 backdrop-blur-sm shadow-sm p-4 border rounded-lg">
          ${header}
          ${details}
          ${specs}
          ${performance}
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
          states: {
            hover: {
              enabled: true,
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
