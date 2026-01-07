<template>
  <div class="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-700">
    <DropdownMenu>
      <DropdownMenuTrigger
        class="bg-gray-800 hover:bg-gray-700 flex items-center justify-between gap-2 rounded px-3 py-2 w-full text-gray-200 focus:outline-none focus:ring focus:ring-[#A32035] text-sm"
      >
        <span>{{ displayText }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent :side-offset="4" align="start" class="w-48 bg-gray-900 border-gray-700">
        <div class="max-h-64 overflow-y-auto">
          <DropdownMenuCheckboxItem
            v-for="year in years"
            :key="year"
            :checked="selected.includes(year)"
            @update:checked="(checked) => handleToggle(year, checked)"
            class="text-gray-200 hover:bg-gray-800"
          >
            {{ year }}
          </DropdownMenuCheckboxItem>
          <div v-if="years.length === 0" class="px-2 py-1.5 text-sm text-gray-400 italic">
            No year data available
          </div>
        </div>
        <div v-if="selected.length > 0" class="border-t border-gray-700 p-1">
          <DropdownMenuItem
            @click="handleClear"
            class="text-red-400 hover:bg-red-900 hover:text-red-300 cursor-pointer"
          >
            Clear All
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu/dropdown-menu-index';

const props = defineProps({
  years: {
    type: Array,
    default: () => []
  },
  selected: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:selected']);

const displayText = computed(() => {
  if (props.selected.length === 0) return 'Select Years';
  if (props.selected.length === 1) return props.selected[0].toString();
  if (props.selected.length === props.years.length) return 'All Years';
  return `${props.selected.length} years selected`;
});

function handleToggle(year, checked) {
  const newSelected = checked
    ? [...props.selected, year]
    : props.selected.filter(y => y !== year);
  emit('update:selected', newSelected);
}

function handleClear() {
  emit('update:selected', []);
}
</script>

