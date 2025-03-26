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
            <DropdownMenuContent side-offset="0" align="start" class="w-full left-0">
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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { color } from 'highcharts';

// Props: expect an array of FPGA data points
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Define X-Axis options for FPGA data.
const xAxisOptions = [
  { label: 'Release Date', value: 'release_date', source: 'soc' },
  { label: 'CLBs', value: 'clbs', source: 'fpga' },
  { label: 'LUTs', value: 'luts', source: 'fpga' },
  { label: 'Flip-Flops', value: 'ffs', source: 'fpga' },
  { label: 'Block RAMs', value: 'block_rams', source: 'fpga' },
  { label: 'DSP Blocks', value: 'multiplier_dsp_blocks', source: 'fpga' },
  { label: 'PLLs', value: 'plls', source: 'fpga' },
  { label: 'Process Node (nm)', value: 'process_node', source: 'soc' },
];

const yAxisOptions = xAxisOptions.filter(option => option.value !== 'release_date');

// Define Group By options
const groupOptions = [
  { label: 'Generation', value: 'generation', source: 'fpga' },
  { label: 'Family/Subfamily', value: 'family_subfamily', source: 'fpga' },
  { label: 'Process Node', value: 'process_node', source: 'soc' },
];

const route = useRoute();
const filteredGroupOptions = computed(() => {
  // (Optional) Filter group options based on route params if needed
  return groupOptions;
});

const xAxis = ref(xAxisOptions[0]);
const yAxis = ref(yAxisOptions[0]);
const groupBy = ref(filteredGroupOptions.value[0]);

// Utility: Get the appropriate value from an item based on the axis's source
const getAxisData = (item, axis) => {
  if (axis.source === 'soc') {
    return item.SoC?.[axis.value] ?? null;
  }
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
  let groupedData;
  let series;

  if (groupBy.value.value === 'process_node') {
    // When grouping by process node, bucket data using example Fibonacci buckets
    const processNodeValues = props.data
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
      acc[bucketKey] = props.data
        .map(item => {
          const processNode = getAxisData(item, groupBy.value);
          const xValue = getAxisData(item, xAxis.value);
          const yValue = getAxisData(item, yAxis.value);

          if (xValue !== null && yValue !== null && processNode >= bucket.min && processNode <= bucket.max) {
            return {
              x: xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue,
              y: yValue,
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
      opacity: 0.8,
      color: seabornColors.processNode(parseFloat(bucketKey)),
      showInLegend: true,
    }));
  } else {
    // Default grouping: group points based on the selected group property
    groupedData = props.data.reduce((acc, item) => {
      const xValue = getAxisData(item, xAxis.value);
      const yValue = getAxisData(item, yAxis.value);
      let colorCategory = getAxisData(item, groupBy.value);

      if (xValue === null || yValue === null || colorCategory === null) return acc;

      const xFormattedValue = xAxis.value.value === 'release_date' ? Date.parse(xValue) : xValue;
      const point = {
        x: xFormattedValue,
        y: yValue,
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
