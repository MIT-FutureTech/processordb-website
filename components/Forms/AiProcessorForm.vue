<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4">
    <!-- Success & Error Messages -->
    <div 
      v-if="successMessage" 
      data-testid="form-success"
      :data-message-code="successMessageCode"
      :data-action-type="successActionType"
      :data-entity-type="successEntityType"
      :data-entity-id="successEntityId"
      class="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded shadow-md"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <strong>Success:</strong> <span class="ml-2">{{ successMessage }}</span>
      </div>
    </div>
    <div 
      v-if="errorMessage" 
      data-testid="form-error"
      :data-message-code="errorMessageCode"
      :data-error-type="errorType"
      :data-field-name="errorFieldName"
      class="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-md"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <strong>Error:</strong> <span class="ml-2">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- General Information -->
    <h3 class="text-xl font-medium font-semibold mt-6">General Information</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
      <div>
        <FormFieldLabel 
          label="Manufacturer" 
          field-id="ai_manufacturer"
          :required="true"
          tooltip="The company that manufactures the AI Processor (e.g., NVIDIA, Google, Apple). This is a required field."
        />
        <input 
          id="ai_manufacturer"
          v-model="form.manufacturer" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: NVIDIA"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Company" 
          field-id="ai_company"
          tooltip="The company name (may differ from manufacturer)."
        />
        <input 
          id="ai_company"
          v-model="form.company" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: NVIDIA Corporation"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Product Name" 
          field-id="ai_product_name"
          tooltip="The product name of the AI Processor."
        />
        <input 
          id="ai_product_name"
          v-model="form.product_name" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: A100"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Model Name" 
          field-id="ai_model_name"
          :required="true"
          tooltip="The model name of the AI Processor. This is a required field."
        />
        <input 
          id="ai_model_name"
          v-model="form.model_name" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: A100 80GB"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Release Year" 
          field-id="ai_release_year"
          tooltip="The release year of the AI Processor."
        />
        <input 
          id="ai_release_year"
          v-model="form.release_year" 
          type="number" 
          :disabled="readOnly"
          min="1900"
          max="2100"
          placeholder="Example: 2020"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Country" 
          field-id="ai_country"
          tooltip="The country of origin."
        />
        <input 
          id="ai_country"
          v-model="form.country" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: USA"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Precision" 
          field-id="ai_precision"
          tooltip="The precision format (e.g., INT8, FP16, FP32)."
        />
        <input 
          id="ai_precision"
          v-model="form.precision" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: FP16"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Format" 
          field-id="ai_format"
          tooltip="The format type (e.g., Chip, Card, Module)."
        />
        <input 
          id="ai_format"
          v-model="form.format" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: Chip"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Performance Metrics -->
    <h3 class="text-xl font-medium font-semibold mt-6">Performance Metrics</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
      <div>
        <FormFieldLabel 
          label="Performance (TOPS)" 
          field-id="ai_performance_tops"
          tooltip="Performance in Tera Operations Per Second."
        />
        <div class="input-container">
          <input 
            id="ai_performance_tops"
            v-model="form.performance_tops" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 312"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">TOPS</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="Clock Rate" 
          field-id="ai_clock_rate_ghz"
          tooltip="Clock rate in GHz."
        />
        <div class="input-container">
          <input 
            id="ai_clock_rate_ghz"
            v-model="form.clock_rate_ghz" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 1.41"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">GHz</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="TDP" 
          field-id="ai_tdp_w"
          tooltip="Thermal Design Power in Watts."
        />
        <div class="input-container">
          <input 
            id="ai_tdp_w"
            v-model="form.tdp_w" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 400"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">W</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="Peak Bandwidth" 
          field-id="ai_peak_bw_gbs"
          tooltip="Peak bandwidth in GB/s."
        />
        <div class="input-container">
          <input 
            id="ai_peak_bw_gbs"
            v-model="form.peak_bw_gbs" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 2039"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">GB/s</span>
        </div>
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Physical Characteristics -->
    <h3 class="text-xl font-medium font-semibold mt-6">Physical Characteristics</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
      <div>
        <FormFieldLabel 
          label="Die Size" 
          field-id="ai_die_size_mm2"
          tooltip="Die size in square millimeters."
        />
        <div class="input-container">
          <input 
            id="ai_die_size_mm2"
            v-model="form.die_size_mm2" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 826"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">mm²</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="Process Node" 
          field-id="ai_process_node_nm"
          tooltip="Process node in nanometers."
        />
        <div class="input-container">
          <input 
            id="ai_process_node_nm"
            v-model="form.process_node_nm" 
            type="number" 
            step="0.1"
            :disabled="readOnly"
            placeholder="Example: 7"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">nm</span>
        </div>
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Memory Specifications -->
    <h3 class="text-xl font-medium font-semibold mt-6">Memory Specifications</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
      <div>
        <FormFieldLabel 
          label="SRAM" 
          field-id="ai_sram_mb"
          tooltip="SRAM size in MB."
        />
        <div class="input-container">
          <input 
            id="ai_sram_mb"
            v-model="form.sram_mb" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 40"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">MB</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="SRAM Bandwidth" 
          field-id="ai_sram_bandwidth_tbs"
          tooltip="SRAM bandwidth in TB/s."
        />
        <div class="input-container">
          <input 
            id="ai_sram_bandwidth_tbs"
            v-model="form.sram_bandwidth_tbs" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 19"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">TB/s</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="DRAM" 
          field-id="ai_dram_gb"
          tooltip="DRAM size in GB."
        />
        <div class="input-container">
          <input 
            id="ai_dram_gb"
            v-model="form.dram_gb" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 80"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">GB</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="DRAM Bandwidth" 
          field-id="ai_dram_bandwidth_gbs"
          tooltip="DRAM bandwidth in GB/s."
        />
        <div class="input-container">
          <input 
            id="ai_dram_bandwidth_gbs"
            v-model="form.dram_bandwidth_gbs" 
            type="number" 
            step="0.01"
            :disabled="readOnly"
            placeholder="Example: 2039"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">GB/s</span>
        </div>
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Deployment & Usage -->
    <h3 class="text-xl font-medium font-semibold mt-6">Deployment & Usage</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
      <div>
        <FormFieldLabel 
          label="Cloud/Edge" 
          field-id="ai_cloud_edge"
          tooltip="Deployment type (Cloud or Edge)."
        />
        <select 
          id="ai_cloud_edge"
          v-model="form.cloud_edge" 
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"
        >
          <option value="">Select...</option>
          <option value="Cloud">Cloud</option>
          <option value="Edge">Edge</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div>
        <FormFieldLabel 
          label="Workload Type" 
          field-id="ai_workload_type"
          tooltip="Type of workload (e.g., Training, Inference)."
        />
        <input 
          id="ai_workload_type"
          v-model="form.workload_type" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: Training"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Networking" 
          field-id="ai_networking"
          tooltip="Networking capabilities."
        />
        <input 
          id="ai_networking"
          v-model="form.networking" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: InfiniBand"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Units" 
          field-id="ai_units"
          tooltip="Units specification."
        />
        <input 
          id="ai_units"
          v-model="form.units" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: Single"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div class="md:col-span-4">
        <FormFieldLabel 
          label="Usage" 
          field-id="ai_usage"
          tooltip="Usage description or notes."
        />
        <textarea 
          id="ai_usage"
          v-model="form.usage" 
          :disabled="readOnly"
          rows="3"
          placeholder="Usage description..."
          class="pl-2 mt-1 block w-full sm:text-sm border border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent rounded"
        />
      </div>
      <div class="md:col-span-4">
        <FormFieldLabel 
          label="Source" 
          field-id="ai_source"
          tooltip="Data source or reference."
        />
        <textarea 
          id="ai_source"
          v-model="form.source" 
          :disabled="readOnly"
          rows="2"
          placeholder="Source information..."
          class="pl-2 mt-1 block w-full sm:text-sm border border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent rounded"
        />
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Suggestion Note (for suggestors only) -->
    <div v-if="!readOnly && userRole === 'suggestor'" class="mt-8">
      <label class="block text-sm font-medium text-gray-700 pl-2 mb-2">
        Note <span class="text-red-600">*</span> - Explain your suggestion
      </label>
      <textarea 
        v-model="suggestionNote" 
        rows="3"
        placeholder="Please provide an explanation for your suggestion..."
        class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      ></textarea>
    </div>

    <!-- History Section -->
    <div v-if="editMode">
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">
          History
        </h3>
      </div>
      <hr class="border-t border-white opacity-80 my-4 mt-8" />
      <div v-if="versionHistory && versionHistory.length > 0">
        <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-black bg-opacity-80">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Field Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Old Value</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">New Value</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Changed by</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(history, index) in versionHistory" :key="history.version_id || index">
                <td class="px-6 py-4 whitespace-nowrap">{{ formatFieldName(history.field_name) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ history.old_value || '' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ history.new_value || '' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ history.changed_by || 'Unknown' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(history.changed_at) || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="text-gray-500 text-center py-4">No version history available</div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, watch, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { getItemWithExpiry } from '@/lib/encrypter'
import { getRole } from '@/lib/isLogged'
import { submitSuggestion } from '@/lib/suggestionUtils'
import FormFieldLabel from '@/components/FormFieldLabel.vue'
import { handleApiError, handleNetworkError, handleJsonParseError, handleValidationError } from '@/lib/formErrorHandler'
import { getSuccessMessage } from '@/lib/formSuccessHandler'

const props = defineProps({
  aiProcessorData: {
    type: Object,
    default: () => ({})
  },
  editMode: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['data-refreshed'])

const getAuthToken = () => {
  const token = getItemWithExpiry('encryptedJWTPDB')
  if (!token) {
    console.warn('[AiProcessorForm] No authentication token found. User may need to log in again.')
  }
  return token || null
}

const successMessage = ref('')
const successMessageCode = ref('')
const successActionType = ref('')
const successEntityType = ref('')
const successEntityId = ref('')
const errorMessage = ref('')
const errorMessageCode = ref('')
const errorType = ref('')
const errorFieldName = ref('')

const userRole = computed(() => getRole())
const suggestionNote = ref('')
const versionHistory = ref([])

function formatFieldName(fieldName) {
  if (!fieldName) return '';
  return fieldName
    .replace(/_/g, ' ') 
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
}

const form = ref({
  manufacturer: '',
  company: '',
  product_name: '',
  model_name: '',
  release_year: '',
  country: '',
  precision: '',
  format: '',
  performance_tops: '',
  clock_rate_ghz: '',
  tdp_w: '',
  peak_bw_gbs: '',
  die_size_mm2: '',
  process_node_nm: '',
  sram_mb: '',
  sram_bandwidth_tbs: '',
  dram_gb: '',
  dram_bandwidth_gbs: '',
  cloud_edge: '',
  workload_type: '',
  networking: '',
  units: '',
  usage: '',
  source: ''
})

watch(
  () => props.aiProcessorData,
  (data) => {
    if (!data || !data.aiProcessor) return

    const aiProcessor = data.aiProcessor;
    
    // Get release year from API (prefer release_year, fallback to extracting from release_date)
    let releaseYear = '';
    if (aiProcessor.release_year) {
      releaseYear = aiProcessor.release_year.toString();
    } else if (aiProcessor.SoC?.release_year) {
      releaseYear = aiProcessor.SoC.release_year.toString();
    } else if (aiProcessor.SoC?.release_date) {
      releaseYear = new Date(aiProcessor.SoC.release_date).getFullYear().toString();
    }
    
    form.value = {
      manufacturer: data.manufacturerName || aiProcessor.SoC?.Manufacturer?.name || '',
      company: aiProcessor.company || '',
      product_name: aiProcessor.product_name || '',
      model_name: aiProcessor.model_name || '',
      release_year: releaseYear,
      country: aiProcessor.country || '',
      precision: aiProcessor.precision || '',
      format: aiProcessor.format || '',
      performance_tops: aiProcessor.performance_tops || '',
      clock_rate_ghz: aiProcessor.clock_rate_ghz || '',
      tdp_w: aiProcessor.tdp_w || '',
      peak_bw_gbs: aiProcessor.peak_bw_gbs || '',
      die_size_mm2: aiProcessor.die_size_mm2 || '',
      process_node_nm: aiProcessor.process_node_nm || '',
      sram_mb: aiProcessor.sram_mb || '',
      sram_bandwidth_tbs: aiProcessor.sram_bandwidth_tbs || '',
      dram_gb: aiProcessor.dram_gb || '',
      dram_bandwidth_gbs: aiProcessor.dram_bandwidth_gbs || '',
      cloud_edge: aiProcessor.cloud_edge || '',
      workload_type: aiProcessor.workload_type || '',
      networking: aiProcessor.networking || '',
      units: aiProcessor.units || '',
      usage: aiProcessor.usage || '',
      source: aiProcessor.source || ''
    }

    versionHistory.value = data.versionHistory || []
  },
  { immediate: true }
)

const preparePostRequestBody = () => ({
  model_name: form.value.model_name,
  company: form.value.company,
  product_name: form.value.product_name,
  release_year: form.value.release_year ? parseInt(form.value.release_year) : null,
  country: form.value.country,
  source: form.value.source,
  performance_tops: form.value.performance_tops ? parseFloat(form.value.performance_tops) : null,
  precision: form.value.precision,
  clock_rate_ghz: form.value.clock_rate_ghz ? parseFloat(form.value.clock_rate_ghz) : null,
  tdp_w: form.value.tdp_w ? parseFloat(form.value.tdp_w) : null,
  die_size_mm2: form.value.die_size_mm2 ? parseFloat(form.value.die_size_mm2) : null,
  process_node_nm: form.value.process_node_nm ? parseFloat(form.value.process_node_nm) : null,
  sram_mb: form.value.sram_mb ? parseFloat(form.value.sram_mb) : null,
  sram_bandwidth_tbs: form.value.sram_bandwidth_tbs ? parseFloat(form.value.sram_bandwidth_tbs) : null,
  dram_gb: form.value.dram_gb ? parseFloat(form.value.dram_gb) : null,
  dram_bandwidth_gbs: form.value.dram_bandwidth_gbs ? parseFloat(form.value.dram_bandwidth_gbs) : null,
  networking: form.value.networking,
  units: form.value.units,
  peak_bw_gbs: form.value.peak_bw_gbs ? parseFloat(form.value.peak_bw_gbs) : null,
  format: form.value.format,
  cloud_edge: form.value.cloud_edge,
  workload_type: form.value.workload_type,
  usage: form.value.usage,
  // Include SoC and Manufacturer if needed
  soc_id: props.aiProcessorData?.aiProcessor?.soc_id || null
})

const submitData = async () => {
  successMessage.value = ''
  successMessageCode.value = ''
  successActionType.value = ''
  successEntityType.value = ''
  successEntityId.value = ''
  errorMessage.value = ''
  errorMessageCode.value = ''
  errorType.value = ''
  errorFieldName.value = ''

  // Basic validation
  if (!form.value.model_name) {
    const error = handleValidationError(
      props.editMode ? 'AI_PROCESSOR_UPDATE_VALIDATION_REQUIRED_FIELDS' : 'AI_PROCESSOR_CREATE_VALIDATION_REQUIRED_FIELDS'
    )
    errorMessage.value = error.message
    errorMessageCode.value = error.code
    errorType.value = error.type
    errorFieldName.value = error.field
    setTimeout(() => {
      errorMessage.value = ''
      errorMessageCode.value = ''
      errorType.value = ''
      errorFieldName.value = ''
    }, 5000)
    return
  }

  const postData = preparePostRequestBody()
  const currentRole = userRole.value
  const isSuggestion = currentRole === 'suggestor'

  console.log('[Form] Submission started', { 
    formType: 'AI Processor', 
    role: currentRole, 
    isSuggestion,
    editMode: props.editMode 
  })

  try {
    // If user is a suggestor, submit as suggestion
    if (isSuggestion) {
      if (!suggestionNote.value || suggestionNote.value.trim() === '') {
        const error = handleValidationError('SUGGESTION_NOTE_REQUIRED')
        errorMessage.value = error.message
        errorMessageCode.value = error.code
        errorType.value = error.type
        errorFieldName.value = error.field
        setTimeout(() => {
          errorMessage.value = ''
          errorMessageCode.value = ''
          errorType.value = ''
          errorFieldName.value = ''
        }, 5000)
        return
      }

      const entityId = props.editMode ? props.aiProcessorData.aiProcessor?.ai_processor_id : null
      
      try {
        const result = await submitSuggestion('ai-processor', entityId, postData, suggestionNote.value)
        
        console.log('[Form] Submission successful', { 
          formType: 'AI Processor', 
          role: currentRole, 
          isSuggestion: true 
        })
        
        const success = getSuccessMessage('suggestion', 'create')
        successMessage.value = success.message
        successMessageCode.value = success.code
        successActionType.value = success.type
        successEntityType.value = success.entity
        
        setTimeout(() => {
          if (entityId) {
            window.location.href = `/ai-processor/${entityId}`
          } else {
            window.location.href = '/ai-processor/list'
          }
        }, 3000)
      } catch (suggestionError) {
        console.error('[Form] Submission failed', { 
          formType: 'AI Processor', 
          role: currentRole, 
          error: suggestionError.message 
        })
        const error = handleNetworkError(suggestionError, 'ai-processor', 'create')
        errorMessage.value = error.message
        errorMessageCode.value = error.code
        errorType.value = error.type
        errorFieldName.value = error.field
        setTimeout(() => {
          errorMessage.value = ''
          errorMessageCode.value = ''
          errorType.value = ''
          errorFieldName.value = ''
        }, 5000)
      }
      return
    }

    // Otherwise, submit directly (admin/editor)
    let backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '')
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api'
    
    const url = props.editMode
      ? `${backendUrl}${apiPrefix}/ai-processors/${props.aiProcessorData.aiProcessor?.ai_processor_id}`
      : `${backendUrl}${apiPrefix}/ai-processors`

    const response = await fetch(url, {
      method: props.editMode ? 'PUT' : 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(postData)
    })

    let serverData
    try {
      serverData = await response.json()
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError)
      const error = handleJsonParseError('ai-processor', props.editMode ? 'update' : 'create')
      errorMessage.value = error.message
      errorMessageCode.value = error.code
      errorType.value = error.type
      errorFieldName.value = error.field
      setTimeout(() => {
        errorMessage.value = ''
        errorMessageCode.value = ''
        errorType.value = ''
        errorFieldName.value = ''
      }, 5000)
      return
    }
    
    console.log('[Form] Submission successful', { 
      formType: 'AI Processor', 
      role: currentRole, 
      isSuggestion: false 
    })

    if (response.ok) {
      const responseData = serverData.data || serverData
      const success = getSuccessMessage('ai-processor', props.editMode ? 'update' : 'create')
      successMessage.value = success.message
      successMessageCode.value = success.code
      successActionType.value = success.type
      successEntityType.value = success.entity
      successEntityId.value = responseData.ai_processor_id || ''
      
      setTimeout(() => {
        if (props.editMode) {
          emit('data-refreshed')
        } else {
          window.location.href = `/ai-processor/${responseData.ai_processor_id || ''}`
        }
      }, 2000)
    } else {
      const error = await handleApiError(response, 'ai-processor', props.editMode ? 'update' : 'create')
      errorMessage.value = error.message
      errorMessageCode.value = error.code
      errorType.value = error.type
      errorFieldName.value = error.field
      setTimeout(() => {
        errorMessage.value = ''
        errorMessageCode.value = ''
        errorType.value = ''
        errorFieldName.value = ''
      }, 5000)
    }
  } catch (error) {
    console.error('Error submitting AI Processor:', error)
    const errorObj = handleNetworkError(error, 'ai-processor', props.editMode ? 'update' : 'create')
    errorMessage.value = errorObj.message
    errorMessageCode.value = errorObj.code
    errorType.value = errorObj.type
    errorFieldName.value = errorObj.field
    setTimeout(() => {
      errorMessage.value = ''
      errorMessageCode.value = ''
      errorType.value = ''
      errorFieldName.value = ''
    }, 5000)
  }
}

defineExpose({ submitData })
</script>

<style scoped>
.input-container {
  position: relative;
}

.unit-label {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.875rem;
  pointer-events: none;
}
</style>
