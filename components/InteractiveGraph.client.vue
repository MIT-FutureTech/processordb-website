<template>
  <div class="scatter-plot">
    <div class="flex justify-start gap-4 items-center mb-4">

   <!-- Processor Type Selection -->
<div class="mb-4">
  <label class="font-semibold text-gray-700 block mb-2">Processor Types</label>
  <div class="flex space-x-2">
    <label
      v-for="(dataset, index) in datasets"
      :key="index"
      class="flex items-center border rounded px-3 py-1 cursor-pointer transition-colors hover:bg-gray-200"
      :class="{'bg-[#A32035] text-white': selectedDatasets.includes(dataset)}"
    >
      <input
        type="checkbox"
        v-model="selectedDatasets"
        :value="dataset"
        class="hidden"
      />
      <span>{{ dataset }}</span>
    </label>
  </div>
</div>

<!-- Manufacturer Filter -->
<div class="mb-4">
  <label class="font-semibold text-gray-700 block mb-2">Manufacturer</label>
  <select
    v-model="selectedManufacturer"
    class="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring"
  >
    <option value="">All</option>
    <option v-for="manufacturer in manufacturers" :key="manufacturer" :value="manufacturer">
      {{ manufacturer }}
    </option>
  </select>
</div>

<!-- X Axis Selection -->
<div class="mb-4">
  <label class="font-semibold text-gray-700 block mb-2">X-Axis</label>
  <select
    v-model="xAxis"
    class="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring"
  >
    <option v-for="option in xAxisOptions" :key="option.value" :value="option">
      {{ option.label }}
    </option>
  </select>
</div>

<!-- Y Axis Selection -->
<div class="mb-4">
  <label class="font-semibold text-gray-700 block mb-2">Y-Axis</label>
  <select
    v-model="yAxis"
    class="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring"
  >
    <option v-for="option in yAxisOptions" :key="option.value" :value="option">
      {{ option.label }}
    </option>
  </select>
</div>

<!-- Color Categorization Selection -->
<div class="mb-4">
  <label class="font-semibold text-gray-700 block mb-2">Color By</label>
  <select
    v-model="colorBy"
    class="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring"
  >
    <option v-for="option in colorOptions" :key="option.value" :value="option">
      {{ option.label }}
    </option>
  </select>
</div>
</div>


    <!-- Plotly Chart -->
    <client-only>
      <nuxt-plotly
        v-if="plotReady"
        :data="traces"
        :layout="layout"
        style="width: 100%; height: 100%;"
      />
    </client-only>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, shallowRef, markRaw } from 'vue'

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

// Reactive state
const selectedDatasets = ref(['CPU', 'GPU']) // Allow multiple selections
const plotReady = ref(false)

// Axis options with source information
const axisOptions = [
  { label: 'Release Date', value: 'release_date', source: 'soc' },
  { label: 'Clock Speed (MHz)', value: 'clock', source: 'processor' },
  { label: 'Max Clock Speed (MHz)', value: 'max_clock', source: 'processor' },
  { label: 'TDP (W)', value: 'tdp', source: 'processor' },
  { label: 'Die Size (mm^2)', value: 'die_sizes', source: 'soc' },
  { label: 'Transistors (million)', value: 'total_transistor_count', source: 'soc' },
  { label: 'Lithography (nm)', value: 'lithography', source: 'processor' },
  { label: 'FP64 Operations (GFLOPS)', value: 'fp64_ops', source: 'processor', unit: 'GFLOPS' },
  { label: 'FP32 Operations (GFLOPS)', value: 'fp32_ops', source: 'processor', unit: 'GFLOPS' },
  { label: 'FP16 Operations (GFLOPS)', value: 'fp16_ops', source: 'processor', unit: 'GFLOPS' },
  // Add more options as needed
]

// Separate X and Y axis options
const xAxisOptions = axisOptions
const yAxisOptions = axisOptions.filter(option => option.value !== 'release_date')

// Initialize xAxis and yAxis with entire option objects
const xAxis = ref(xAxisOptions[0]) // Default to first option
const yAxis = ref(yAxisOptions[0]) // Default to second option

// Color categorization options
const colorOptions = [
  { label: 'Processor Type', value: 'processor_type', source: 'processor' },
  { label: 'Manufacturer', value: 'manufacturer_name', source: 'soc' },
  { label: 'Process Node', value: 'process_node', source: 'soc' },
  // Add more options as needed
]
const colorBy = ref(colorOptions[0]) // Default to first option

const datasets = ['CPU', 'GPU']

// Additional filters
const selectedManufacturer = ref('')
const manufacturers = ref([])

// Use shallowRef to prevent deep reactivity
const traces = shallowRef([])
const layout = shallowRef({})

// 
watch(props.data.value, () => {
  plotReady.value = true
  // Populate manufacturers list
  manufacturers.value = Array.from(
    new Set(props.data.map((soc) => soc.manufacturer_name).filter(Boolean))
  )
  drawChart()
}, {
  deep: true
})

 
// Watcher for changes
watch(
  [ selectedDatasets, xAxis, yAxis, colorBy, selectedManufacturer],
  () => {
    drawChart()
  }
)

function capitalizeFirstLetter(str) {
  if (str && str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return str;
}

// Ensure chart is only drawn after DOM is ready
onMounted(() => {
  plotReady.value = true

  // Populate manufacturers list
  manufacturers.value = Array.from(
  new Set(
    props.data
      .map((soc) => capitalizeFirstLetter(soc.manufacturer_name)) // Capitalize the first letter
      .filter(Boolean)
  )
);
  drawChart()
})

function drawChart() {
  const selectedTypes = selectedDatasets.value

  // Flatten the data to get processors of the selected types
  const processorsData = []

  props.data.forEach((soc) => {
    // Apply manufacturer filter
    if (
      selectedManufacturer.value &&
      soc.manufacturer_name.toLowerCase() !== selectedManufacturer.value.toLowerCase()
    ) {
      return
    }

    if (soc.processors && soc.processors.length > 0) {
      soc.processors.forEach((proc) => {
        if (selectedTypes.includes(proc.processor_type)) {
          processorsData.push({
            soc: soc,
            processor: proc,
          })
        }
      })
    }
  })

  const xField = xAxis.value.value
  const xSource = xAxis.value.source
  const yField = yAxis.value.value
  const ySource = yAxis.value.source

  const colorField = colorBy.value.value
  const colorSource = colorBy.value.source

  // Prepare data grouped by color categories
  const dataByCategory = {}

  processorsData.forEach((item) => {
    let xValue = xSource === 'soc' ? item.soc[xField] : item.processor[xField]
    let yValue = ySource === 'soc' ? item.soc[yField] : item.processor[yField]

    // Filter out data points where xValue or yValue is null or undefined
    if (xValue != null && yValue != null) {
      // Convert values for GFLOPS fields
      if (xAxis.value.unit === 'GFLOPS') {
        xValue = parseFloat(xValue) 
      }
      if (yAxis.value.unit === 'GFLOPS') {
        yValue = parseFloat(yValue)
      }

      // Convert string numbers to actual numbers
      xValue = parseFloat(xValue)
      yValue = parseFloat(yValue)

      // Skip if conversion results in NaN
      if (isNaN(xValue) || isNaN(yValue)) {
        return
      }

      // Skip non-positive values for log scales (since log of zero or negative numbers is undefined)
      if (xValue <= 0 || yValue <= 0) {
        return
      }

      // Get the category for color mapping
      let category =
        colorSource === 'soc' ? item.soc[colorField] : item.processor[colorField]

      // **Modification starts here**
      // If colorBy is 'Process Node' and category is null or undefined, skip this data point
      if (
        colorBy.value.value === 'process_node' &&
        (category === null || category === undefined)
      ) {
        return
      }

      // Assign 'Unknown' to category if it's missing and colorBy is not 'Process Node'
      if (category === null || category === undefined) {
        category = 'Unknown'
      }
      // **Modification ends here**

      if (!dataByCategory[category]) {
        dataByCategory[category] = {
          x: [],
          y: [],
          text: [],
          name: category,
        }
      }

      dataByCategory[category].x.push(xValue)
      dataByCategory[category].y.push(yValue)
      dataByCategory[category].text.push(item.soc.soc_name)
    }
  })

  // Create traces for each category
  traces.value = Object.values(dataByCategory).map((categoryData) =>
    markRaw({
      x: categoryData.x,
      y: categoryData.y,
      mode: 'markers',
      type: 'scattergl', // Use WebGL rendering
      name: categoryData.name,
      marker: {
        size: 10,
        opacity: 0.3,
      },
      text: categoryData.text,
      hovertemplate:
        '<b>%{text}</b><br>' +
        `${xAxis.value.label}: %{x}<br>` +
        `${yAxis.value.label}: %{y}<br>` +
        `${colorBy.value.label}: ${categoryData.name}<extra></extra>`,
    })
  )

  // Determine axis types
  const xAxisType = xAxis.value.label === 'Release Date' ? 'linear' : 'log'
  const yAxisType = yAxis.value.label === 'Release Date' ? 'linear' : 'log'

  // Axis tick formatting
  const xTickFormat = xAxisType === 'log' ? '~s' : ''
  const yTickFormat = yAxisType === 'log' ? '~s' : ''

  // Update axis labels with units if applicable
  const xAxisLabel = xAxis.value.unit
    ? `${xAxis.value.label}`
    : xAxis.value.label
  const yAxisLabel = yAxis.value.unit
    ? `${yAxis.value.label}`
    : yAxis.value.label

  layout.value = markRaw({
    xaxis: {
      title: xAxisLabel,
      type: xAxisType,
      tickformat: xTickFormat,
      automargin: true,
    },
    yaxis: {
      title: yAxisLabel,
      type: yAxisType,
      tickformat: yTickFormat,
      automargin: true,
    },
    // Hide the title
    title: '',
    // Make the graph responsive
    autosize: true,
    // Set margins to adjust spacing
    margin: { l: 50, r: 50, b: 50, t: 20 },
  })
}
</script>

<style scoped>
.scatter-plot {
  width: 100%;
  height: 100%;
}
</style>
