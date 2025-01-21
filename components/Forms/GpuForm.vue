<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">

    <!-- General Information -->
    <h3 class="text-xl font-medium font-semibold">General Information</h3>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Manufacturer</label>
        <select v-model="form.manufacturer"
          class="mt-1 pl-2 block w-full h-10 border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          <option>AMD</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Name</label>
        <input v-model="form.name" type="text"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Variant</label>
        <input v-model="form.variant" type="text"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Release Date</label>
        <input v-model="form.releaseDate" type="text"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Process Node</label>
        <div class="input-container">
          <input v-model="form.processNode" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">nm</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Core Count</label>
        <input v-model="form.coreCount" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Total Transistor Count</label>
        <input v-model="form.totalTransistorCount" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Package Size</label>
        <div class="input-container">
          <input v-model="form.packageSize" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">mm²</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Die Size</label>
        <div class="input-container">
          <input v-model="form.dieSize" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">mm²</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Number of Dies</label>
        <input v-model="form.numberOfDies" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Transistor Density</label>
        <input v-model="form.transistorDensity" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Voltage (low)</label>
        <div class="input-container">
          <input v-model="form.voltageLow" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">V</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Voltage (high)</label>
        <div class="input-container">
          <input v-model="form.voltageHigh" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">V</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Platform</label>
        <select v-model="form.platform"
          class="mt-1 pl-2 block w-full h-10 border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          <option>Server</option>
        </select>
      </div>
    </div>

    <!-- Cores Section -->
    <div>
      <div class="flex justify-between items-center mb-4 mt-8">
        <h3 class="text-lg font-medium">Cores</h3>
        <NuxtLink to="/gpu/form"
          class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
          <span class="mr-2"> Add GPU core </span>
        </NuxtLink> 
      </div>

      <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-black bg-opacity-80">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Number of cores</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Core name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Base Frequency (GHz)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Max Turbo Frequency (GHz)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">2</td>
              <td class="px-6 py-4 whitespace-nowrap">Performance-cores</td>
              <td class="px-6 py-4 whitespace-nowrap">1.7</td>
              <td class="px-6 py-4 whitespace-nowrap">4.8</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button class="text-[#A32035] hover:underline">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Processors -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Processors</h3>
        <button @click="toggleProcessors" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
          <v-icon name="bi-chevron-compact-up" :style="{ transform: isProcessorsExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
        </button>
      </div>
      <Transition name="collapse">
        <div v-if="isProcessorsExpanded" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">TDP</label>
              <div class="input-container">
                <input v-model="form.tdp" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">W</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Cores</label>
              <input v-model="form.cores" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Architecture Information -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Architecture Information</h3>
        <button @click="toggleArchitecture" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
          <v-icon name="bi-chevron-compact-up" :style="{ transform: isArchitectureExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
        </button>
      </div>
      <Transition name="collapse">
        <div v-if="isArchitectureExpanded" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Architecture</label>
              <input v-model="form.architecture" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Generation</label>
              <input v-model="form.generation" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Process Size</label>
              <div class="input-container">
                <input v-model="form.processSize" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">nm</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Clock Information -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Clock Information</h3>
        <button @click="toggleClock" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
          <v-icon name="bi-chevron-compact-up" :style="{ transform: isClockExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
        </button>
      </div>
      <Transition name="collapse">
        <div v-if="isClockExpanded" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Base Clock</label>
              <div class="input-container">
                <input v-model="form.baseClock" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">MHz</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Boost Clock</label>
              <div class="input-container">
                <input v-model="form.boostClock" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">MHz</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Memory Clock</label>
              <div class="input-container">
                <input v-model="form.memoryClock" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">MHz</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Compute Information -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Compute Information</h3>
        <button @click="toggleCompute" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
          <v-icon name="bi-chevron-compact-up" :style="{ transform: isComputeExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
        </button>
      </div>
      <Transition name="collapse">
        <div v-if="isComputeExpanded" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Texture Rate</label>
              <div class="input-container">
                <input v-model="form.textureRate" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">GTexels/s</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP16 Performance</label>
              <div class="input-container">
                <input v-model="form.fp16Performance" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">GFLOPS</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP32 Performance</label>
              <div class="input-container">
                <input v-model="form.fp32Performance" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">GFLOPS</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP64 Performance</label>
              <div class="input-container">
                <input v-model="form.fp64Performance" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">GFLOPS</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Graphic API Information -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Graphic API Information</h3>
        <button @click="toggleGraphicAPI" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
          <v-icon name="bi-chevron-compact-up" :style="{ transform: isGraphicAPIExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
        </button>
      </div>
      <Transition name="collapse">
        <div v-if="isGraphicAPIExpanded" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Pixel Rate</label>
              <div class="input-container">
                <input v-model="form.pixelRate" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
                <span class="unit-label">GPixels/s</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Slot</label>
              <input v-model="form.slot" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">DirectX</label>
              <input v-model="form.directX" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">OpenGL</label>
              <input v-model="form.openGL" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">OpenCL</label>
              <input v-model="form.openCL" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  gpuData: {
    type: Object,
    default: () => ({})
  }
})

// Initialize expansion states
const isProcessorsExpanded = ref(true)
const isArchitectureExpanded = ref(true)
const isClockExpanded = ref(true)
const isComputeExpanded = ref(true)
const isGraphicAPIExpanded = ref(true)

const form = ref({
  manufacturer: '',
  releaseDate: props.gpuData?.release_date ? new Date(props.gpuData.release_date).toISOString().split('T')[0] : '',
  processNode: '',
  coreCount: '',
  totalTransistorCount: '',
  packageSize: '',
  dieSize: '',
  numberOfDies: '',
  transistorDensity: '',
  voltageLow: '',
  voltageHigh: '',
  platform: '',
  tdp: '',
  cores: '',
  architecture: '',
  generation: '',
  processSize: '',
  baseClock: '',
  boostClock: '',
  memoryClock: '',
  textureRate: '',
  fp16Performance: '',
  fp32Performance: '',
  fp64Performance: '',
  pixelRate: '',
  slot: '',
  directX: '',
  openGL: '',
  openCL: '',
})

// Toggle functions
const toggleProcessors = () => {
  isProcessorsExpanded.value = !isProcessorsExpanded.value
}

const toggleArchitecture = () => {
  isArchitectureExpanded.value = !isArchitectureExpanded.value
}

const toggleClock = () => {
  isClockExpanded.value = !isClockExpanded.value
}

const toggleCompute = () => {
  isComputeExpanded.value = !isComputeExpanded.value
}

const toggleGraphicAPI = () => {
  isGraphicAPIExpanded.value = !isGraphicAPIExpanded.value
}

watch(() => props.gpuData, (newData) => {
  if (newData) {
    const processor = newData.processors?.[0] || {}
    const { architecture_info, clock_info, memory_info, compute_info, cache_info, general_info, graphic_api_info } = processor

    form.value = {
      // General Information
      name: general_info.name || '',
      variant: general_info.variant || '',
      manufacturer: newData.manufacturer_name || '',
      releaseDate: newData.release_date ? new Date(newData.release_date).toISOString().split('T')[0] : '',
      processNode: newData.process_node || '',
      coreCount: newData.core_count || '',
      totalTransistorCount: newData.total_transistor_count || '',
      packageSize: newData.package_size || '',
      dieSize: newData.die_sizes || '',
      numberOfDies: newData.number_of_die || '',
      transistorDensity: newData.transistor_density || '',
      voltageLow: newData.voltage_range_low || '',
      voltageHigh: newData.voltage_range_high || '',
      platform: newData.platform || '',
      tdp: general_info?.tdp || '',
      cores: general_info?.core_count || '',

      // Architecture Information
      architecture: architecture_info?.architecture || '',
      generation: architecture_info?.generation || '',
      processSize: architecture_info?.process_size || '',

      // Clock Information
      baseClock: clock_info?.base_clock || '',
      boostClock: clock_info?.boost_clock || '',
      memoryClock: clock_info?.memory_clock || '',

      // Memory Information
      memorySize: memory_info?.memory_size || '',
      memoryType: memory_info?.memory_type || '',
      memoryBus: memory_info?.memory_bus || '',
      memoryBandwidth: memory_info?.memory_bandwidth || '',

      // Compute Information
      shaderUnits: compute_info?.shader_units || '',
      textureMappingUnits: compute_info?.texture_mapping_units || '',
      renderOutputUnits: compute_info?.render_output_units || '',
      fp16: compute_info?.fp16 || '',
      fp32: compute_info?.fp32 || '',
      fp64: compute_info?.fp64 || '',

      // Cache Information
      l0Cache: cache_info?.l0_cache || '',
      l1Cache: cache_info?.l1_cache || '',
      l2Cache: cache_info?.l2_cache || '',
      l3Cache: cache_info?.l3_cache || '',

      // Graphic API Information
      slot: graphic_api_info?.slot || '',
      directx: graphic_api_info?.directx || '',
      opengl: graphic_api_info?.opengl || '',
      vulkan: graphic_api_info?.vulkan || '',
      pixelShader: graphic_api_info?.pixel_shader || '',
      vertexShader: graphic_api_info?.vertex_shader || '',
      pixelRate: graphic_api_info?.pixel_rate || '',
      textureRate: graphic_api_info?.texture_rate || '',
      openCL: graphic_api_info?.opencl || ''
    }
  }
}, { immediate: true })
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 1000px;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.unit-label {
  position: absolute;
  right: 10px;
  color: #6B7280;
  pointer-events: none;
}
</style>