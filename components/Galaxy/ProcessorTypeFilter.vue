<template>
  <div class="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-700">
    <h3 class="text-sm font-semibold text-gray-300 mb-2">Processor Type</h3>
    <div class="space-y-2">
      <label
        v-for="type in types"
        :key="type"
        class="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors"
      >
        <input
          type="checkbox"
          :value="type"
          :checked="selected.includes(type)"
          @change="handleChange(type, $event.target.checked)"
          class="w-4 h-4 text-[#A32035] rounded focus:ring-[#A32035] bg-gray-700 border-gray-600"
        />
        <span class="text-sm text-gray-200 flex-1">{{ type }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  types: {
    type: Array,
    default: () => []
  },
  selected: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:selected']);

function handleChange(type, checked) {
  const newSelected = checked
    ? [...props.selected, type]
    : props.selected.filter(t => t !== type);
  emit('update:selected', newSelected);
}
</script>

