<template>
  <div class="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-700">
    <h3 class="text-sm font-semibold text-gray-300 mb-2 flex items-center justify-between">
      <span>Clusters</span>
      <span class="text-xs font-normal text-gray-400">{{ clusters.length }} total</span>
    </h3>
    <div class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
      <button
        v-for="cluster in sortedClusters"
        :key="cluster.cluster_id"
        @click="handleSelect(cluster)"
        :class="[
          'w-full text-left p-2 rounded transition-all duration-200 border',
          selected?.cluster_id === cluster.cluster_id
            ? 'bg-[#A32035] text-white border-[#A32035] shadow-md'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700 hover:border-gray-600'
        ]"
      >
        <div class="font-medium text-xs mb-1">{{ cluster.label }}</div>
        <div class="text-xs opacity-75 flex items-center justify-between">
          <span>{{ cluster.count }} processors</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatPosition } from '@/lib/galaxyUtils';

const props = defineProps({
  clusters: {
    type: Array,
    default: () => []
  },
  selected: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['select']);

const sortedClusters = computed(() => {
  return [...props.clusters].sort((a, b) => b.count - a.count);
});

function handleSelect(cluster) {
  emit('select', cluster);
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f1f1f;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>

