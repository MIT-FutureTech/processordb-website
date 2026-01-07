<template>
  <div class="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-700">
    <h3 class="text-sm font-semibold text-gray-300 mb-3">Processor Trends Over Time</h3>
    <div v-if="!data || !data.byYear || data.byYear.length === 0" class="text-xs text-gray-400 h-48 flex items-center justify-center">
      No trend data available
    </div>
    <ClientOnly v-else>
      <div ref="chartContainer" class="h-64"></div>
      <template #fallback>
        <div class="h-64 flex items-center justify-center text-gray-400">
          Loading chart...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
});

const chartContainer = ref(null);
let chart = null;

async function initChart() {
  if (!props.data || !props.data.byYear || props.data.byYear.length === 0) return;
  if (!chartContainer.value) return;
  
  try {
    // Dynamic import of Highcharts
    const Highcharts = (await import('highcharts')).default;
    
    // Destroy existing chart if any
    if (chart) {
      chart.destroy();
      chart = null;
    }
    
    // Check if container is still available
    if (!chartContainer.value) return;
    
    chart = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        height: 256
      },
      title: {
        text: null
      },
      xAxis: {
        title: {
          text: 'Year',
          style: { color: '#9ca3af' }
        },
        labels: {
          style: { color: '#9ca3af' }
        },
        categories: props.data.byYear.map(t => t.year.toString())
      },
      yAxis: [{
        title: {
          text: 'Count',
          style: { color: '#9ca3af' }
        },
        labels: {
          style: { color: '#9ca3af' }
        }
      }, {
        title: {
          text: 'Clock Speed (MHz)',
          style: { color: '#9ca3af' }
        },
        labels: {
          style: { color: '#9ca3af' }
        },
        opposite: true
      }],
      legend: {
        enabled: true,
        itemStyle: { color: '#9ca3af' }
      },
      plotOptions: {
        line: {
          marker: {
            enabled: true,
            radius: 4
          }
        }
      },
      series: [{
        name: 'Processors Released',
        data: props.data.byYear.map(t => t.count || 0),
        color: '#A32035',
        yAxis: 0
      }, {
        name: 'Avg Clock Speed (MHz)',
        data: props.data.byYear.map(t => Math.round(t.avgClock || 0)),
        color: '#3498db',
        yAxis: 1
      }],
      credits: {
        enabled: false
      }
    });
  } catch (err) {
    console.error('Error initializing Highcharts:', err);
    // Don't throw - just log the error
  }
}

watch(() => props.data, () => {
  nextTick(() => {
    initChart();
  });
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});
</script>

