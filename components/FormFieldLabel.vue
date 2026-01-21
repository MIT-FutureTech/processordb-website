<template>
  <label :for="fieldId" class="block text-sm font-medium text-gray-700 pl-2">
    <span>
      {{ label }}
      <span v-if="required" class="text-red-600 ml-1" aria-label="required">*</span>
    </span>
    <FormTooltip v-if="tooltip" :text="tooltip" :field-name="label" />
  </label>
</template>

<script setup lang="js">
import FormTooltip from './FormTooltip.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  fieldId: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String,
    default: ''
  }
})
</script>
