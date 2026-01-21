<template>
  <div class="relative inline-block has-tooltip" :aria-label="text">
    <button
      type="button"
      class="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#A32035] rounded-full"
      :aria-describedby="tooltipId"
      :aria-label="`More information about ${fieldName || 'this field'}`"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    </button>
    <span
      :id="tooltipId"
      class="tooltip rounded shadow-lg p-3 bg-white text-gray-700 text-sm max-w-xs z-50 border border-gray-200"
      role="tooltip"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="js">
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    default: ''
  }
})

const tooltipId = computed(() => `tooltip-${Math.random().toString(36).substr(2, 9)}`)
</script>

<style scoped>
.tooltip {
  visibility: hidden;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  white-space: normal;
  word-wrap: break-word;
}

.has-tooltip:hover .tooltip,
.has-tooltip:focus-within .tooltip {
  visibility: visible;
  z-index: 50;
}

/* Arrow pointing down */
.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: white;
}
</style>
