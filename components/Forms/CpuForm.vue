<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Basic Information -->
    <h3 class="text-xl font-medium font-semibold">General Information</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Manufacturer</label>
        <input v-model="form.manufacturer" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Family</label>
        <input v-model="form.family" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Code Name</label>
        <input v-model="form.codeName" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Microarchitecture</label>
        <input v-model="form.microarchitecture" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Model</label>
        <input v-model="form.model" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Year</label>
        <input v-model="form.year" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Clock</label>
        <div class="input-container">
          <input v-model="form.clock" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">MHz</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Max Clock</label>
        <div class="input-container">
          <input v-model="form.maxClock" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">MHz</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Threads/Core</label>
        <input v-model="form.threadsPerCore" type="text"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Lithography</label>
        <div class="input-container">
          <input v-model="form.lithography" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">nm</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">TDP</label>
        <div class="input-container">
          <input v-model="form.tdp" type="text"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">W</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Platform</label>
        <select v-model="form.platform"
          class="mt-1 pl-2 block w-full h-10 border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          <option>Server</option>
          <!-- Add other platforms -->
        </select>
      </div>
    </div>

    <!-- Cores Section -->
    <div>
      <div class="flex justify-between items-center mb-4 mt-8">
        <h3 class="text-lg font-medium">Cores</h3>
        <NuxtLink to="/soc/form"
          class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
          <span class="mr-2"> Add CPU core </span>
        </NuxtLink>
      </div>

      <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-black bg-opacity-80">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Number of cores</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Core name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Base Frequency</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Max Turbo Frequency</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">2</td>
              <td class="px-6 py-4 whitespace-nowrap">Performance-cores</td>
              <td class="px-6 py-4 whitespace-nowrap">1.7 GHz</td>
              <td class="px-6 py-4 whitespace-nowrap">4.8 GHz</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button class="text-[#A32035] hover:underline">Edit</button>
              </td>
            </tr>
            <!-- Add more rows as needed -->
          </tbody>
        </table>
      </div>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Cache Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Cache</h3>
        <button @click="toggleCache" class="p-1 hover:bg-gray-100 rounded-full" type="button">
          <v-icon name="bi-chevron-compact-up"
            :style="{ transform: isCacheExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
        </button>
      </div>
      <Transition name="collapse">
        <div v-if="isCacheExpanded" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- L3 Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L3 Cache</label>
              <div class="input-container">
                <input v-model="form.l3Cache" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>

            <!-- L3 Cache Latency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L3 Cache Latency</label>
              <div class="input-container">
                <input v-model="form.l3CacheLatency" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">ns</span>
              </div>
            </div>

            <!-- L2 Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L2 Cache</label>
              <div class="input-container">
                <input v-model="form.l2Cache" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>

            <!-- L2 Cache Latency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L2 Cache Latency</label>
              <div class="input-container">
                <input v-model="form.l2CacheLatency" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">ns</span>
              </div>
            </div>

            <!-- L1 Data Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L1 Data Cache</label>
              <div class="input-container">
                <input v-model="form.l1DataCache" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>

            <!-- L1 Instruction Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L1 Instruction Cache</label>
              <div class="input-container">
                <input v-model="form.l1InstructionCache" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>

            <!-- L1 Cache Latency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L1 Cache Latency</label>
              <div class="input-container">
                <input v-model="form.l1CacheLatency" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">ns</span>
              </div>
            </div>

            <!-- L4 Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L4 Cache</label>
              <div class="input-container">
                <input v-model="form.l4Cache" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Memory Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Memory</h3>
        <button @click="toggleMemory" class="p-1 hover:bg-gray-100 rounded-full" type="button">
          <v-icon name="bi-chevron-compact-up"
            :style="{ transform: isMemoryExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
        </button>
      </div>
      <Transition name="collapse">
        <div v-if="isMemoryExpanded" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Bus Speed</label>
              <div class="input-container">
                <input v-model="form.busSpeed" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">MT/s</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Max Memory Size</label>
              <div class="input-container">
                <input v-model="form.maxMemorySize" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">GB</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">DRAM Latency</label>
              <div class="input-container">
                <input v-model="form.dramLatency" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">ns</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Memory Type</label>
              <select v-model="form.memoryType"
                class="mt-1 pl-2 block w-full h-10 border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
                <option>DDR4</option>
                <option>DDR5</option>
                <option>LPDDR4</option>
                <option>LPDDR5</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Max Memory Bandwidth</label>
              <div class="input-container">
                <input v-model="form.maxMemoryBandwidth" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">GB/s</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Max Number of Memory Channels</label>
              <input v-model="form.maxMemoryChannels" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Technical Details Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Technical Details</h3>
        <button @click="toggleTechnicalDetails" class="p-1 hover:bg-gray-100 rounded-full" type="button">
          <v-icon name="bi-chevron-compact-up"
            :style="{ transform: isTechnicalDetailsExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
        </button>
      </div>
      <Transition name="collapse">
        <div v-if="isTechnicalDetailsExpanded" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Instruction Set Width</label>
              <input v-model="form.instructionSetWidth" type="text"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Transistors</label>
              <div class="input-container">
                <input v-model="form.transistors" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">millions</span>
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
              <label class="block text-sm font-medium text-gray-700 pl-2">Transistors Density</label>
              <div class="input-container">
                <input v-model="form.transistorsDensity" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">mm²</span>
              </div>
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
              <label class="block text-sm font-medium text-gray-700 pl-2">MIPS</label>
              <div class="input-container">
                <input v-model="form.mips" type="text"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">MHz</span>
              </div>
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
              <label class="block text-sm font-medium text-gray-700 pl-2">Voltage (average)</label>
              <div class="input-container">
                <input v-model="form.voltageAverage" type="text"
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
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  cpuData: {
    type: Object,
    default: () => ({})
  }
})

const form = ref({
  // General Information
  manufacturer: '',
  family: '',
  codeName: '',
  microarchitecture: '',
  model: '',
  year: '',
  clock: '',
  maxClock: '',
  threadsPerCore: '',
  lithography: '',
  tdp: '',
  platform: '',

  // Cache Information
  l3Cache: '',
  l3CacheLatency: '',
  l2Cache: '',
  l2CacheLatency: '',
  l1Cache: '',
  l1CacheLatency: '',
  l1DataCache: '',
  l1InstructionCache: '',
  l4Cache: '',

  // Memory Information
  maxMemorySize: '',
  memoryType: '',
  maxMemoryChannels: '',
  maxMemoryBandwidth: '',

  // Technical Details
  busSpeed: '',
  instructionSetWidth: '',
  fp64Ops: '',
  fp32Ops: '',
  fp16Ops: '',
  mips: '',
  fp32TheoreticalMflops: '',
  fp32MeasuredGflops: '',
  
  // Additional Information
  edram: '',
  graphics: '',
  graphicsMaxDynamicFrequency: '',
  graphicsBaseFrequency: '',
  graphicsMemorySize: '',
  turboBoostMaxTechnology3Frequency: '',
  turboFrequency1core: '',
  turboFrequency2core: ''
})

watch(() => props.cpuData, (newData) => {
  if (newData) {
    const processor = newData.processors?.[0] || {}
    const { core_info, cache_info, performance_info, memory_info, additional_info } = processor

    form.value = {
      // General Information
      manufacturer: newData.manufacturer_name || '',
      family: core_info?.family || '',
      codeName: core_info?.code_name || '',
      microarchitecture: core_info?.microarchitecture || '',
      model: core_info?.model || '',
      year: newData.release_date ? new Date(newData.release_date).getFullYear().toString() : '',
      clock: core_info?.clock || '',
      maxClock: core_info?.max_clock || '',
      threadsPerCore: core_info?.threads_per_core || '',
      lithography: core_info?.lithography || '',
      tdp: core_info?.tdp || '',
      platform: newData.platform || '',

      // Cache Information
      l3Cache: cache_info?.l3_cache || '',
      l3CacheLatency: cache_info?.l3_cache_latency || '',
      l2Cache: cache_info?.l2_cache || '',
      l2CacheLatency: cache_info?.l2_cache_latency || '',
      l1Cache: cache_info?.l1_cache || '',
      l1CacheLatency: cache_info?.l1_cache_latency || '',
      l1DataCache: cache_info?.l1_cache_data || '',
      l1InstructionCache: cache_info?.l1_cache_instruction || '',
      l4Cache: cache_info?.l4_cache || '',

      // Memory Information
      maxMemorySize: memory_info?.max_memory_size || '',
      memoryType: memory_info?.memory_type || '',
      maxMemoryChannels: memory_info?.max_memory_channels || '',
      maxMemoryBandwidth: memory_info?.max_memory_bandwidth || '',

      // Technical Details
      busSpeed: additional_info?.bus_speed || '',
      instructionSetWidth: additional_info?.instruction_set_width || '',
      fp64Ops: performance_info?.fp64_ops || '',
      fp32Ops: performance_info?.fp32_ops || '',
      fp16Ops: performance_info?.fp16_ops || '',
      mips: performance_info?.mips || '',
      fp32TheoreticalMflops: performance_info?.fp32_theoretical_mflops || '',
      fp32MeasuredGflops: performance_info?.fp32_measured_gflops || '',
      
      // Additional Information
      edram: additional_info?.edram || '',
      graphics: additional_info?.graphics || '',
      graphicsMaxDynamicFrequency: additional_info?.graphics_max_dynamic_frequency || '',
      graphicsBaseFrequency: additional_info?.graphics_base_frequency || '',
      graphicsMemorySize: additional_info?.graphics_memory_size || '',
      turboBoostMaxTechnology3Frequency: additional_info?.turbo_boost_max_technology_3_frequency || '',
      turboFrequency1core: additional_info?.turbo_frequency_1core || '',
      turboFrequency2core: additional_info?.turbo_frequency_2core || ''
    }
  }
}, { immediate: true })

const isCacheExpanded = ref(true)
const isMemoryExpanded = ref(true)
const isTechnicalDetailsExpanded = ref(true)

const toggleCache = () => {
  isCacheExpanded.value = !isCacheExpanded.value
}

const toggleMemory = () => {
  isMemoryExpanded.value = !isMemoryExpanded.value
}

const toggleTechnicalDetails = () => {
  isTechnicalDetailsExpanded.value = !isTechnicalDetailsExpanded.value
}
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