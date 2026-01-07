<template>
  <div class="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-700">
    <h3 class="text-sm font-semibold text-gray-300 mb-2">Manufacturers</h3>
    <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
      <label
        v-for="manufacturer in manufacturers"
        :key="manufacturer"
        class="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors"
      >
        <input
          type="checkbox"
          :value="manufacturer"
          :checked="selected.includes(manufacturer)"
          @change="handleChange(manufacturer, $event.target.checked)"
          class="w-4 h-4 text-[#A32035] rounded focus:ring-[#A32035] bg-gray-700 border-gray-600"
        />
        <span class="text-sm text-gray-200 flex-1">{{ manufacturer }}</span>
      </label>
      <div v-if="manufacturers.length === 0" class="text-sm text-gray-400 italic py-4 text-center">
        No manufacturers available
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  manufacturers: {
    type: Array,
    default: () => []
  },
  selected: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:selected']);

function handleChange(manufacturer, checked) {
  const newSelected = checked
    ? [...props.selected, manufacturer]
    : props.selected.filter(m => m !== manufacturer);
  emit('update:selected', newSelected);
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

