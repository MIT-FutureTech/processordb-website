<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Message Area -->
    <div v-if="successMessage" class="mb-4 p-2 bg-green-200 text-green-800 rounded">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mb-4 p-2 bg-red-200 text-red-800 rounded">
      {{ errorMessage }}
    </div>

    <!-- Basic Information -->
    <h3 class="text-xl font-medium font-semibold">General Information</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Manufacturer</label>
        <input v-model="form.manufacturer" type="text" :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Family</label>
        <input v-model="form.family" type="text" :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Code Name</label>
        <input v-model="form.codeName" type="text" :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Microarchitecture</label>
        <input v-model="form.microarchitecture" type="text" :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Model</label>
        <input v-model="form.model" type="text" :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Year</label>
        <input v-model="form.year" type="number" :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Clock</label>
        <div class="input-container">
          <input v-model="form.clock" type="number" :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">MHz</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Max Clock</label>
        <div class="input-container">
          <input v-model="form.maxClock" type="number" :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">MHz</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Threads/Core</label>
        <input v-model="form.threadsPerCore" type="number" :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Lithography</label>
        <div class="input-container">
          <input v-model="form.lithography" type="number" :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">nm</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">TDP</label>
        <div class="input-container">
          <input v-model="form.tdp" type="number" :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
          <span class="unit-label">W</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Platform</label>
        <select v-model="form.platform" :disabled="readOnly"
          class="mt-1 pl-2 block w-full h-10 border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          <option>Server</option>
          <!-- Add other platforms as needed -->
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
      <!-- Table with core information (read-only or editable as needed) -->
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
                <button class="text-[#A32035] hover:underline" :disabled="readOnly">Edit</button>
              </td>
            </tr>
            <!-- Add more rows as needed -->
          </tbody>
        </table>
      </div>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

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
                <input v-model="form.l3Cache" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>
            <!-- L3 Cache Latency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L3 Cache Latency</label>
              <div class="input-container">
                <input v-model="form.l3CacheLatency" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">ns</span>
              </div>
            </div>
            <!-- L2 Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L2 Cache</label>
              <div class="input-container">
                <input v-model="form.l2Cache" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>
            <!-- L2 Cache Latency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L2 Cache Latency</label>
              <div class="input-container">
                <input v-model="form.l2CacheLatency" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">ns</span>
              </div>
            </div>
            <!-- L1 Data Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L1 Data Cache</label>
              <div class="input-container">
                <input v-model="form.l1DataCache" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>
            <!-- L1 Instruction Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L1 Instruction Cache</label>
              <div class="input-container">
                <input v-model="form.l1InstructionCache" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>
            <!-- L1 Cache Latency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L1 Cache Latency</label>
              <div class="input-container">
                <input v-model="form.l1CacheLatency" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">ns</span>
              </div>
            </div>
            <!-- L4 Cache -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">L4 Cache</label>
              <div class="input-container">
                <input v-model="form.l4Cache" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">KB</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

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
                <input v-model="form.busSpeed" type="text" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">MT/s</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Max Memory Size</label>
              <div class="input-container">
                <input v-model="form.maxMemorySize" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">GB</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">DRAM Latency</label>
              <div class="input-container">
                <input v-model="form.dramLatency" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">ns</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Memory Type</label>
              <select v-model="form.memoryType" :disabled="readOnly"
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
                <input v-model="form.maxMemoryBandwidth" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">GB/s</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Max Number of Memory Channels</label>
              <input v-model="form.maxMemoryChannels" type="number" :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

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
              <input v-model="form.instructionSetWidth" type="number" :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Transistors</label>
              <div class="input-container">
                <input v-model="form.transistors" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">millions</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Die Size</label>
              <div class="input-container">
                <input v-model="form.dieSize" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">mm²</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Transistors Density</label>
              <div class="input-container">
                <input v-model="form.transistorsDensity" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">millions/mm²</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Package Size</label>
              <div class="input-container">
                <input v-model="form.packageSize" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">mm²</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">MIPS</label>
              <div class="input-container">
                <input v-model="form.mips" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">MHz</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Voltage (low)</label>
              <div class="input-container">
                <input v-model="form.voltageLow" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">V</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Voltage (average)</label>
              <div class="input-container">
                <input v-model="form.voltageAverage" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">V</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Voltage (high)</label>
              <div class="input-container">
                <input v-model="form.voltageHigh" type="number" :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
                <span class="unit-label">V</span>
              </div>
            </div>
            <!-- New Performance Fields -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP64 Ops</label>
              <input v-model="form.fp64Ops" type="number" :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP32 Ops</label>
              <input v-model="form.fp32Ops" type="number" :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP16 Ops</label>
              <input v-model="form.fp16Ops" type="number" :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP32 Theoretical MFLOPS</label>
              <input v-model="form.fp32TheoreticalMflops" type="number" :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP32 Measured GFLOPS</label>
              <input v-model="form.fp32MeasuredGflops" type="number" :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Additional CPU Fields Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">Additional CPU Fields</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 pl-2">eDRAM</label>
          <input v-model="form.edram" type="number" :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 pl-2">Graphics</label>
          <input v-model="form.graphics" type="text" :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 pl-2">Graphics Max Dynamic Frequency</label>
          <div class="input-container">
            <input v-model="form.graphicsMaxDynamicFrequency" type="number" :disabled="readOnly"
              class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            <span class="unit-label">MHz</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 pl-2">Graphics Base Frequency</label>
          <div class="input-container">
            <input v-model="form.graphicsBaseFrequency" type="number" :disabled="readOnly"
              class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            <span class="unit-label">MHz</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 pl-2">Graphics Memory Size</label>
          <div class="input-container">
            <input v-model="form.graphicsMemorySize" type="number" :disabled="readOnly"
              class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            <span class="unit-label">MB</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 pl-2">Turbo Boost Max Technology 3 Frequency</label>
          <div class="input-container">
            <input v-model="form.turboBoostMaxTechnology3Frequency" type="number" :disabled="readOnly"
              class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            <span class="unit-label">MHz</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 pl-2">Turbo Frequency 1 Core</label>
          <div class="input-container">
            <input v-model="form.turboFrequency1core" type="number" :disabled="readOnly"
              class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            <span class="unit-label">MHz</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 pl-2">Turbo Frequency 2 Core</label>
          <div class="input-container">
            <input v-model="form.turboFrequency2core" type="number" :disabled="readOnly"
              class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
            <span class="unit-label">MHz</span>
          </div>
        </div>
      </div>
    </div>
    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- History -->
    <div v-if="!readOnly">
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">History</h3>
        <button @click="toggleHistory" class="p-1 hover:bg-gray-100 rounded-full" type="button">
        <v-icon name="bi-chevron-compact-up"
          :style="{ transform: isHistoryExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
      </button>
      </div>

      <hr class="border-t border-white opacity-80 my-4 mt-8" />

      <div v-if="isHistoryExpanded && cpuData && cpuData.versionHistory">
        <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-black bg-opacity-80">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Field Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Old Value</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">New Value</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Reference</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Changed by</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Comment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="history in (cpuData?.versionHistory || [])" :key="history.version_id">
                <td class="px-6 py-4 whitespace-nowrap">{{ formatFieldName(history.field_name) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ history.old_value || '' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ history.new_value || '' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ history.reference || '' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ history.changed_by || 'Unknown' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ history.comment || '' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(history.changed_at) || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="js">
import { ref, watch } from 'vue'
import { useRuntimeConfig } from '#imports'
// import { useRouter } from 'vue-router'

// const router = useRouter()

// Define props for initial cpuData, editMode, and the new readOnly flag
const props = defineProps({
  cpuData: {
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


// Reactive states for messages
const successMessage = ref('')
const errorMessage = ref('')

function formatFieldName(fieldName) {
  if (!fieldName) return '';
  return fieldName
    .replace(/_/g, ' ') 
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Initialize all fields in the form object.
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
  dramLatency: '',
  // Technical Details
  busSpeed: '',
  instructionSetWidth: '',
  fp64Ops: '',
  fp32Ops: '',
  fp16Ops: '',
  mips: '',
  fp32TheoreticalMflops: '',
  fp32MeasuredGflops: '',
  // Extra Technical Details
  transistors: '',
  dieSize: '',
  transistorsDensity: '',
  packageSize: '',
  voltageLow: '',
  voltageAverage: '',
  voltageHigh: '',
  // Additional CPU Fields
  edram: '',
  graphics: '',
  graphicsMaxDynamicFrequency: '',
  graphicsBaseFrequency: '',
  graphicsMemorySize: '',
  turboBoostMaxTechnology3Frequency: '',
  turboFrequency1core: '',
  turboFrequency2core: ''
})

// Watch for changes in cpuData prop to update the form.
watch(
  () => props.cpuData,
  (newData) => {
    // Guard against null/undefined during SSR
    if (!newData) {
      return;
    }
    
    const cpuData = newData.cpu || {}
    const socData = newData.cpu?.SoC || {}

    form.value = {
        manufacturer: newData.manufacturerName || socData.Manufacturer?.name || '',
        family: cpuData.family || '',
        codeName: cpuData.code_name || '',
        microarchitecture: cpuData.microarchitecture || '',
        model: cpuData.model || '',
        year: socData.release_date ? new Date(socData.release_date).getFullYear().toString() : '',
        clock: cpuData.clock || '',
        maxClock: cpuData.max_clock || '',
        threadsPerCore: cpuData.threads_per_core || '',
        lithography: cpuData.lithography || '',
        tdp: cpuData.tdp || '',
        platform: socData.platform || '',
        l3Cache: cpuData.l3_cache || '',
        l3CacheLatency: cpuData.l3_cache_latency || '',
        l2Cache: cpuData.l2_cache || '',
        l2CacheLatency: cpuData.l2_cache_latency || '',
        l1Cache: cpuData.l1_cache || '',
        l1CacheLatency: cpuData.l1_cache_latency || '',
        l1DataCache: cpuData.l1_cache_data || '',
        l1InstructionCache: cpuData.l1_cache_instruction || '',
        l4Cache: cpuData.l4_cache || '',
        maxMemorySize: cpuData.max_memory_size || '',
        memoryType: cpuData.memory_type || '',
        maxMemoryChannels: cpuData.max_memory_channels || '',
        maxMemoryBandwidth: cpuData.max_memory_bandwidth || '',
        busSpeed: cpuData.bus_speed || '',
        instructionSetWidth: cpuData.instruction_set_width || '',
        fp64Ops: cpuData.fp64_ops || '',
        fp32Ops: cpuData.fp32_ops || '',
        fp16Ops: cpuData.fp16_ops || '',
        mips: cpuData.mips || '',
        fp32TheoreticalMflops: cpuData.fp32_theoretical_mflops || '',
        fp32MeasuredGflops: cpuData.fp32_measured_gflops || '',
        edram: cpuData.edram || '',
        graphics: cpuData.graphics || '',
        graphicsMaxDynamicFrequency: cpuData.graphics_max_dynamic_frequency || '',
        graphicsBaseFrequency: cpuData.graphics_base_frequency || '',
        graphicsMemorySize: cpuData.graphics_memory_size || '',
        turboBoostMaxTechnology3Frequency: cpuData.turbo_boost_max_technology_3_frequency || '',
        turboFrequency1core: cpuData.turbo_frequency_1core || '',
        turboFrequency2core: cpuData.turbo_frequency_2core || ''
      }
  },
  { immediate: true }
)

// Prepares the payload to be sent to the API.
const preparePostRequestBody = () => {
  return {
    soc: {
      name: form.value.model,
      release_date: form.value.year ? `${form.value.year}-01-02` : null,
      platform: form.value.platform,
      process_node: form.value.lithography ? parseFloat(form.value.lithography) : null,
      tdp: form.value.tdp ? parseFloat(form.value.tdp) : null,
      soc_id: props.cpuData?.cpu?.SoC?.soc_id || null,
    },
    manufacturer: {
      name: form.value.manufacturer?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      manufacturer_id: props.cpuData?.cpu?.SoC?.Manufacturer?.manufacturer_id || null,
    },
    cpu: {
      cpu_id: props.cpuData?.cpu?.cpu_id || null,
      family: form.value.family?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      code_name: form.value.codeName?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      microarchitecture: form.value.microarchitecture?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      model: form.value.model?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      clock: form.value.clock ? parseFloat(form.value.clock) : null,
      max_clock: form.value.maxClock ? parseFloat(form.value.maxClock) : null,
      tdp: form.value.tdp ? parseFloat(form.value.tdp) : null,
      lithography: form.value.lithography,
      threads_per_core: form.value.threadsPerCore ? parseInt(form.value.threadsPerCore) : null,
      l1_cache_data: form.value.l1DataCache ? parseInt(form.value.l1DataCache) : null,
      l1_cache_instruction: form.value.l1InstructionCache ? parseInt(form.value.l1InstructionCache) : null,
      l1_cache_latency: form.value.l1CacheLatency ? parseFloat(form.value.l1CacheLatency) : null,
      l2_cache: form.value.l2Cache ? parseInt(form.value.l2Cache) : null,
      l2_cache_latency: form.value.l2CacheLatency ? parseFloat(form.value.l2CacheLatency) : null,
      l3_cache: form.value.l3Cache ? parseInt(form.value.l3Cache) : null,
      l3_cache_latency: form.value.l3CacheLatency ? parseFloat(form.value.l3CacheLatency) : null,
      l4_cache: form.value.l4Cache ? parseInt(form.value.l4Cache) : null,
      max_memory_size: form.value.maxMemorySize ? parseInt(form.value.maxMemorySize) : null,
      memory_type: form.value.memoryType,
      max_memory_channels: form.value.maxMemoryChannels ? parseInt(form.value.maxMemoryChannels) : null,
      max_memory_bandwidth: form.value.maxMemoryBandwidth ? parseFloat(form.value.maxMemoryBandwidth) : null,
      dram_latency: form.value.dramLatency ? parseFloat(form.value.dramLatency) : null,
      bus_speed: form.value.busSpeed ? parseFloat(form.value.busSpeed) : null,
      instruction_set_width: form.value.instructionSetWidth ? parseInt(form.value.instructionSetWidth) : null,
      fp64_ops: form.value.fp64Ops ? parseFloat(form.value.fp64Ops) : null,
      fp32_ops: form.value.fp32Ops ? parseFloat(form.value.fp32Ops) : null,
      fp16_ops: form.value.fp16Ops ? parseFloat(form.value.fp16Ops) : null,
      mips: form.value.mips ? parseFloat(form.value.mips) : null,
      fp32_theoretical_mflops: form.value.fp32TheoreticalMflops ? parseFloat(form.value.fp32TheoreticalMflops) : null,
      fp32_measured_gflops: form.value.fp32MeasuredGflops ? parseFloat(form.value.fp32MeasuredGflops) : null,
      edram: form.value.edram ? parseInt(form.value.edram) : null,
      graphics: form.value.graphics,
      graphics_max_dynamic_frequency: form.value.graphicsMaxDynamicFrequency ? parseFloat(form.value.graphicsMaxDynamicFrequency) : null,
      graphics_base_frequency: form.value.graphicsBaseFrequency ? parseFloat(form.value.graphicsBaseFrequency) : null,
      graphics_memory_size: form.value.graphicsMemorySize ? parseInt(form.value.graphicsMemorySize) : null,
      turbo_boost_max_technology_3_frequency: form.value.turboBoostMaxTechnology3Frequency ? parseFloat(form.value.turboBoostMaxTechnology3Frequency) : null,
      turbo_frequency_1core: form.value.turboFrequency1core ? parseFloat(form.value.turboFrequency1core) : null,
      turbo_frequency_2core: form.value.turboFrequency2core ? parseFloat(form.value.turboFrequency2core) : null,
      transistors: form.value.transistors ? parseInt(form.value.transistors) : null,
      die_size: form.value.dieSize ? parseFloat(form.value.dieSize) : null,
      transistors_density: form.value.transistorsDensity ? parseFloat(form.value.transistorsDensity) : null,
      package_size: form.value.packageSize ? parseFloat(form.value.packageSize) : null,
      voltage_low: form.value.voltageLow ? parseFloat(form.value.voltageLow) : null,
      voltage_average: form.value.voltageAverage ? parseFloat(form.value.voltageAverage) : null,
      voltage_high: form.value.voltageHigh ? parseFloat(form.value.voltageHigh) : null
    },
    economics: {
      year: form.value.year
    }
  }
}

const submitData = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  // Basic validation
  if (!form.value.manufacturer || !form.value.family || !form.value.model) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }

  const postData = preparePostRequestBody()

  console.log('Post Data:', postData)
  try {
    const response = await fetch(
      props.editMode && props.cpuData?.cpu?.cpu_id
        ? `${useRuntimeConfig().public.backendUrl}/cpus/${props.cpuData.cpu.cpu_id}`
        : `${useRuntimeConfig().public.backendUrl}/cpus`,
      {
        method: props.editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }
    )

    let serverData
    try {
      serverData = await response.json()
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError)
      errorMessage.value = 'Invalid response from server. Please try again.'
      return
    }
    
    console.log('Response:', serverData)

    if (response.ok) {
      successMessage.value = 'CPU saved successfully!'
      // Handle both wrapped and direct response formats
      const responseData = serverData.data || serverData
      redirectPage(responseData)
    } else {
      errorMessage.value = serverData.error || 'An error occurred during submission.'
    }
  } catch (error) {
    console.error('Error submitting data:', error)
    errorMessage.value = error.message || 'An unexpected error occurred.'
  }
}

// Toggles for collapsible sections.
const isCacheExpanded = ref(true)
const isMemoryExpanded = ref(true)
const isTechnicalDetailsExpanded = ref(true)
const isHistoryExpanded = ref(true)

const redirectPage = (data) => {
  const cpuId = props.editMode ? props.cpuData?.cpu?.cpu_id : data?.cpu?.cpu_id;
  
  // Validate cpuId before redirecting
  if (!cpuId) {
    console.error('CPU ID is missing, redirecting to CPU list instead');
    setTimeout(() => {
      window.location.href = '/cpu/list';
    }, 3500);
    return;
  }
  
  const redirectUrl = `/cpu/${cpuId}`;

  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 3500);
};

const toggleCache = () => {
  isCacheExpanded.value = !isCacheExpanded.value
}

const toggleMemory = () => {
  isMemoryExpanded.value = !isMemoryExpanded.value
}

const toggleTechnicalDetails = () => {
  isTechnicalDetailsExpanded.value = !isTechnicalDetailsExpanded.value
}

const toggleHistory = () => {
  isHistoryExpanded.value = !isHistoryExpanded.value
}

// Expose the submitData function so that a parent component can call it.
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
