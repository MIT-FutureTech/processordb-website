<template>
  <div class="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-700">
    <h3 class="text-sm font-semibold text-gray-300 mb-2">Selection</h3>
    <div v-if="!selection" class="text-xs text-gray-400 italic py-6 text-center">
      Please click the embedding to start...
    </div>
    <div v-else class="space-y-3">
      <div v-if="type === 'cluster'" class="border-l-4 border-[#A32035] pl-3">
        <div class="font-bold text-sm text-gray-200 mb-2">{{ selection.label }}</div>
        <div class="space-y-1 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-400">Cluster ID:</span>
            <span class="text-gray-300">{{ selection.cluster_id }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-400">Processors:</span>
            <span class="text-gray-300">{{ selection.count }}</span>
          </div>
          <div v-if="selection.centroid" class="flex items-center gap-2">
            <span class="font-medium text-gray-400">Centroid:</span>
            <span class="text-xs text-gray-500 font-mono">{{ formatPosition(selection.centroid) }}</span>
          </div>
          <div v-if="selection.summary" class="mt-2 p-2 bg-gray-900 rounded text-gray-300 text-xs">
            {{ selection.summary }}
          </div>
        </div>
      </div>
      <div v-else-if="type === 'processor'" class="border-l-4 border-blue-500 pl-3">
        <div class="font-bold text-sm text-gray-200 mb-2">{{ selection.model || selection.name || 'Unknown Processor' }}</div>
        <div class="space-y-1 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-400">Type:</span>
            <span class="px-2 py-0.5 rounded text-xs font-medium" :class="getTypeColorClass(selection.type)">
              {{ selection.type }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-400">Manufacturer:</span>
            <span class="text-gray-300">{{ selection.manufacturer || 'Unknown' }}</span>
          </div>
          <div v-if="selection.position" class="flex items-center gap-2">
            <span class="font-medium text-gray-400">Position:</span>
            <span class="text-xs text-gray-500 font-mono">{{ formatPosition(selection.position) }}</span>
          </div>
          <div v-if="selection.specs" class="mt-2 p-2 bg-gray-900 rounded">
            <div class="text-xs font-medium text-gray-400 mb-1">Specifications:</div>
            <div class="space-y-1 text-xs text-gray-300">
              <div v-if="selection.specs.clock">Clock: {{ selection.specs.clock }} MHz</div>
              <div v-if="selection.specs.cores">Cores: {{ selection.specs.cores }}</div>
              <div v-if="selection.specs.tdp">TDP: {{ selection.specs.tdp }} W</div>
              <div v-if="selection.specs.architecture">Architecture: {{ selection.specs.architecture }}</div>
            </div>
          </div>
          
          <!-- Trends Chart for individual processor -->
          <div v-if="trendsData && trendsData.byYear && trendsData.byYear.length > 0" class="mt-3">
            <div class="text-xs font-medium text-gray-400 mb-2">Trends</div>
            <ClientOnly>
              <div ref="chartContainer" class="h-48"></div>
              <template #fallback>
                <div class="h-48 flex items-center justify-center text-gray-400 text-xs">
                  Loading chart...
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { formatPosition } from '@/lib/galaxyUtils';

const props = defineProps({
  selection: {
    type: Object,
    default: null
  },
  type: {
    type: String,
    default: null
  },
  trendsData: {
    type: Object,
    default: null
  }
});

const chartContainer = ref(null);
let chart = null;

async function initChart() {
  if (!props.trendsData || !props.trendsData.byYear || props.trendsData.byYear.length === 0) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
    return;
  }
  if (!chartContainer.value) return;
  
  try {
    const Highcharts = (await import('highcharts')).default;
    
    if (chart) {
      chart.destroy();
      chart = null;
    }
    
    if (!chartContainer.value) return;
    
    chart = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        height: 192
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
        categories: props.trendsData.byYear.map(t => t.year.toString())
      },
      yAxis: {
        title: {
          text: 'Count',
          style: { color: '#9ca3af' }
        },
        labels: {
          style: { color: '#9ca3af' }
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        line: {
          marker: {
            enabled: true,
            radius: 3
          }
        }
      },
      series: [{
        name: 'Processors Released',
        data: props.trendsData.byYear.map(t => t.count || 0),
        color: '#A32035'
      }],
      credits: {
        enabled: false
      }
    });
  } catch (err) {
    console.error('Error initializing Highcharts:', err);
  }
}

watch(() => props.trendsData, () => {
  nextTick(() => {
    initChart();
  });
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

function getTypeColorClass(type) {
  const classes = {
    'CPU': 'bg-blue-900 text-blue-200',
    'GPU': 'bg-red-900 text-red-200',
    'FPGA': 'bg-green-900 text-green-200'
  };
  return classes[type] || 'bg-gray-700 text-gray-300';
}
</script>

