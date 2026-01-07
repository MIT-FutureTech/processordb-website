<template>
  <div class="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-700">
    <h3 class="text-sm font-semibold text-gray-300 mb-2">Display Mode</h3>
    <div class="flex gap-2">
      <button
        @click="handleSelect('processor')"
        :class="[
          'flex-1 px-3 py-2 rounded text-sm font-medium transition-all',
          mode === 'processor'
            ? 'bg-[#A32035] text-white shadow-md'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        Processor
      </button>
      <button
        @click="handleSelect('cluster')"
        :class="[
          'flex-1 px-3 py-2 rounded text-sm font-medium transition-all',
          mode === 'cluster'
            ? 'bg-[#A32035] text-white shadow-md'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        Cluster
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  mode: {
    type: String,
    default: 'processor'
  }
});

const emit = defineEmits(['update:mode']);

function handleSelect(newMode) {
  emit('update:mode', newMode);
}
</script>

