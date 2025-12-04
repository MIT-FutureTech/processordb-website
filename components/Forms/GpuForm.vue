<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4">
    <!-- Área de Mensagens -->
    <div
      v-if="successMessage"
      class="mb-4 p-2 bg-green-200 text-green-800 rounded"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mb-4 p-2 bg-red-200 text-red-800 rounded"
    >
      {{ errorMessage }}
    </div>

    <!-- General Information -->
    <h3 class="text-xl font-medium font-semibold">
      General Information
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
      <!-- Manufacturer -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Manufacturer</label>
        <input
          v-model="form.manufacturer"
          type="text"
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"
        >
      </div>
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Name</label>
        <input
          v-model="form.name"
          type="text"
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
        >
      </div>
      <!-- Variant -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Variant</label>
        <input
          v-model="form.variant"
          type="text"
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
        >
      </div>
      <!-- Release Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Release Date</label>
        <input
          v-model="form.releaseDate"
          type="date"
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
        >
      </div>
      <!-- Process Node -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Process Node</label>
        <div class="input-container">
          <input
            v-model="form.processNode"
            type="number"
            :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
          >
          <span class="unit-label">nm</span>
        </div>
      </div>
      <!-- Core Count -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Core Count</label>
        <input
          v-model="form.coreCount"
          type="number"
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
        >
      </div>
      <!-- Total Transistor Count -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Total Transistor Count</label>
        <input
          v-model="form.totalTransistorCount"
          type="number"
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
        >
      </div>
      <!-- Package Size -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Package Size</label>
        <div class="input-container">
          <input
            v-model="form.packageSize"
            type="number"
            :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
          >
          <span class="unit-label">mm²</span>
        </div>
      </div>
      <!-- Die Size -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Die Size</label>
        <div class="input-container">
          <input
            v-model="form.dieSize"
            type="number"
            :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
          >
          <span class="unit-label">mm²</span>
        </div>
      </div>
      <!-- Number of Dies -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Number of Dies</label>
        <input
          v-model="form.numberOfDies"
          type="number"
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
        >
      </div>
      <!-- Transistor Density -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Transistor Density</label>
        <input
          v-model="form.transistorDensity"
          type="number"
          :disabled="readOnly"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
        >
      </div>
      <!-- Voltage (Low) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Voltage (Low)</label>
        <div class="input-container">
          <input
            v-model="form.voltageLow"
            type="number"
            :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
          >
          <span class="unit-label">V</span>
        </div>
      </div>
      <!-- Voltage (High) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Voltage (High)</label>
        <div class="input-container">
          <input
            v-model="form.voltageHigh"
            type="number"
            :disabled="readOnly"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
          >
          <span class="unit-label">V</span>
        </div>
      </div>
      <!-- Platform -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Platform</label>
        <select
          v-model="form.platform"
          :disabled="readOnly"
          class="mt-1 pl-2 block w-full h-10 border border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm"
        >
          <option>Server</option>
          <option>Desktop</option>
          <option>Laptop</option>
        </select>
      </div>
    </div>

    <!-- Cores Section -->
    <div>
      <div class="flex justify-between items-center mb-4 mt-8">
        <h3 class="text-lg font-medium">
          Cores
        </h3>
        <NuxtLink
          to="/gpu/core/form"
          class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg inline-flex items-center justify-center"
        >
          <span class="mr-2">Add GPU Core</span>
        </NuxtLink>
      </div>
      <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-black bg-opacity-80">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">
                Number of Cores
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">
                Core Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">
                Base Frequency (GHz)
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">
                Max Turbo Frequency (GHz)
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white" />
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Example row; you can implement dynamic rendering as needed -->
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                2
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                Performance-cores
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                1.7
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                4.8
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  class="text-[#A32035] hover:underline"
                  :disabled="readOnly"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Processors Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">
          Processors
        </h3>
        <button
          @click="toggleProcessors"
          class="p-1 hover:bg-[#F5E9EB] rounded-full"
          type="button"
        >
          <v-icon
            name="bi-chevron-compact-up"
            :style="{ transform: isProcessorsExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }"
          />
        </button>
      </div>
      <Transition name="collapse">
        <div
          v-if="isProcessorsExpanded"
          class="mt-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- TDP -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">TDP</label>
              <div class="input-container">
                <input
                  v-model="form.tdp"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">W</span>
              </div>
            </div>
            <!-- Cores (Processadores) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Cores</label>
              <input
                v-model="form.cores"
                type="number"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Architecture Information Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">
          Architecture Information
        </h3>
        <button
          @click="toggleArchitecture"
          class="p-1 hover:bg-[#F5E9EB] rounded-full"
          type="button"
        >
          <v-icon
            name="bi-chevron-compact-up"
            :style="{ transform: isArchitectureExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }"
          />
        </button>
      </div>
      <Transition name="collapse">
        <div
          v-if="isArchitectureExpanded"
          class="mt-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Architecture -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Architecture</label>
              <input
                v-model="form.architecture"
                type="text"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
            <!-- Generation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Generation</label>
              <input
                v-model="form.generation"
                type="text"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
            <!-- Process Size -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Process Size</label>
              <div class="input-container">
                <input
                  v-model="form.processSize"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">nm</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Clock Information Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">
          Clock Information
        </h3>
        <button
          @click="toggleClock"
          class="p-1 hover:bg-[#F5E9EB] rounded-full"
          type="button"
        >
          <v-icon
            name="bi-chevron-compact-up"
            :style="{ transform: isClockExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }"
          />
        </button>
      </div>
      <Transition name="collapse">
        <div
          v-if="isClockExpanded"
          class="mt-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Base Clock -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Base Clock</label>
              <div class="input-container">
                <input
                  v-model="form.baseClock"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">MHz</span>
              </div>
            </div>
            <!-- Boost Clock -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Boost Clock</label>
              <div class="input-container">
                <input
                  v-model="form.boostClock"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">MHz</span>
              </div>
            </div>
            <!-- Memory Clock -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Memory Clock</label>
              <div class="input-container">
                <input
                  v-model="form.memoryClock"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">MHz</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Memory Information Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">
          Memory Information
        </h3>
        <button
          @click="toggleMemory"
          class="p-1 hover:bg-[#F5E9EB] rounded-full"
          type="button"
        >
          <v-icon
            name="bi-chevron-compact-up"
            :style="{ transform: isMemoryExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }"
          />
        </button>
      </div>
      <Transition name="collapse">
        <div
          v-if="isMemoryExpanded"
          class="mt-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Memory Size -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Memory Size</label>
              <div class="input-container">
                <input
                  v-model="form.memorySize"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">MB</span>
              </div>
            </div>
            <!-- Memory Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Memory Type</label>
              <input
                v-model="form.memoryType"
                type="text"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
            <!-- Memory Bus -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Memory Bus</label>
              <input
                v-model="form.memoryBus"
                type="text"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
            <!-- Memory Bandwidth -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Memory Bandwidth</label>
              <div class="input-container">
                <input
                  v-model="form.memoryBandwidth"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">GB/s</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Compute Information Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">
          Compute Information
        </h3>
        <button
          @click="toggleCompute"
          class="p-1 hover:bg-[#F5E9EB] rounded-full"
          type="button"
        >
          <v-icon
            name="bi-chevron-compact-up"
            :style="{ transform: isComputeExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }"
          />
        </button>
      </div>
      <Transition name="collapse">
        <div
          v-if="isComputeExpanded"
          class="mt-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Texture Rate -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Texture Rate</label>
              <div class="input-container">
                <input
                  v-model="form.textureRate"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">GTexels/s</span>
              </div>
            </div>
            <!-- FP16 Performance -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP16 Performance</label>
              <div class="input-container">
                <input
                  v-model="form.fp16Performance"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">GFLOPS</span>
              </div>
            </div>
            <!-- FP32 Performance -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP32 Performance</label>
              <div class="input-container">
                <input
                  v-model="form.fp32Performance"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">GFLOPS</span>
              </div>
            </div>
            <!-- FP64 Performance -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">FP64 Performance</label>
              <div class="input-container">
                <input
                  v-model="form.fp64Performance"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">GFLOPS</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Graphic API Information Section -->
    <div>
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">
          Graphic API Information
        </h3>
        <button
          @click="toggleGraphicAPI"
          class="p-1 hover:bg-[#F5E9EB] rounded-full"
          type="button"
        >
          <v-icon
            name="bi-chevron-compact-up"
            :style="{ transform: isGraphicAPIExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }"
          />
        </button>
      </div>
      <Transition name="collapse">
        <div
          v-if="isGraphicAPIExpanded"
          class="mt-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Pixel Rate -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Pixel Rate</label>
              <div class="input-container">
                <input
                  v-model="form.pixelRate"
                  type="number"
                  :disabled="readOnly"
                  class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
                >
                <span class="unit-label">GPixels/s</span>
              </div>
            </div>
            <!-- Slot -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">Slot</label>
              <input
                v-model="form.slot"
                type="text"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
            <!-- DirectX -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">DirectX</label>
              <input
                v-model="form.directX"
                type="text"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
            <!-- OpenGL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">OpenGL</label>
              <input
                v-model="form.openGL"
                type="text"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
            <!-- OpenCL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 pl-2">OpenCL</label>
              <input
                v-model="form.openCL"
                type="text"
                :disabled="readOnly"
                class="pl-2 mt-1 block w-full h-10 sm:text-sm border-b border-gray-200 focus:ring-0 focus:border-gray-400 bg-transparent"
              >
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- History Section -->
    <div v-if="editMode">
      <div class="flex items-center gap-2 mt-8">
        <h3 class="text-lg font-medium font-semibold">
          History
        </h3>
        <button
          @click="toggleHistory"
          class="p-1 hover:bg-gray-100 rounded-full"
          type="button"
        >
          <v-icon
            name="bi-chevron-compact-up"
            :style="{ transform: isHistoryExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }"
          />
        </button>
      </div>

      <hr class="border-t border-white opacity-80 my-4 mt-8">

      <div v-if="isHistoryExpanded">
        <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-black bg-opacity-80">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">
                  Field Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">
                  Old Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">
                  New Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">
                  Reference
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">
                  Changed by
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">
                  Comment
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(history, index) in (gpuData.versionHistory || [])"
                :key="history.version_id || index"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatFieldName(history.field_name) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ history.old_value || '' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ history.new_value || '' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ history.reference || '' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ history.changed_by || 'Unknown' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ history.comment || '' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatDate(history.changed_at) || '' }}
                </td>
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

const props = defineProps({
  gpuData: {
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

const successMessage = ref('')
const errorMessage = ref('')
const isProcessorsExpanded = ref(true)
const isArchitectureExpanded = ref(true)
const isClockExpanded = ref(true)
const isMemoryExpanded = ref(true)
const isComputeExpanded = ref(true)
const isGraphicAPIExpanded = ref(true)
const isHistoryExpanded = ref(true)

function formatFieldName(fieldName) {
  if (!fieldName) return '';
  return fieldName
    .replace(/_/g, ' ') 
    .replace(/\b\w/g, char => char.toUpperCase());
}

const form = ref({
  // General Information
  manufacturer: '',
  name: '',
  variant: '',
  releaseDate: '',
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
  // Processors
  tdp: '',
  cores: '',
  // Architecture Information
  architecture: '',
  generation: '',
  processSize: '',
  // Clock Information
  baseClock: '',
  boostClock: '',
  memoryClock: '',
  // Memory Information
  memorySize: '',
  memoryType: '',
  memoryBus: '',
  memoryBandwidth: '',
  // Compute Information
  textureRate: '',
  fp16Performance: '',
  fp32Performance: '',
  fp64Performance: '',
  // Graphic API Information
  pixelRate: '',
  slot: '',
  directX: '',
  openGL: '',
  openCL: '',
  // Extra field if needed
  vulkan: '',
  // Cache (if applicable)
  l0Cache: '',
  l1Cache: '',
  l2Cache: '',
  l3Cache: ''
})

watch(
  () => props.gpuData,
  (newData) => {
    if (newData && newData.gpu) {
      const gpu = newData.gpu
      form.value = {
        // General Information
        manufacturer: newData.manufacturerName || (gpu.SoC?.Manufacturer?.name || ''),
        name: gpu.name || '',
        variant: gpu.variant || '',
        releaseDate: gpu.SoC?.release_date ? new Date(gpu.SoC.release_date).toISOString().split('T')[0] : '',
        processNode: gpu.process_size || '',
        coreCount: gpu.core_count || '',
        totalTransistorCount: gpu.SoC?.total_transistor_count || '',
        packageSize: gpu.SoC?.package_size || '',
        dieSize: gpu.SoC?.die_sizes || '',
        numberOfDies: gpu.SoC?.number_of_die || '',
        transistorDensity: gpu.SoC?.transistor_density || '',
        voltageLow: gpu.SoC?.voltage_range_low || '',
        voltageHigh: gpu.SoC?.voltage_range_high || '',
        platform: gpu.SoC?.platform || '',
        // Processors
        tdp: gpu.tdp || '',
        cores: gpu.core_count || '',
        // Architecture Information
        architecture: gpu.architecture || '',
        generation: gpu.generation || '',
        processSize: gpu.process_size || '',
        // Clock Information
        baseClock: gpu.base_clock || '',
        boostClock: gpu.boost_clock || '',
        memoryClock: gpu.memory_clock || '',
        // Memory Information
        memorySize: gpu.memory_size || '',
        memoryType: gpu.memory_type || '',
        memoryBus: gpu.memory_bus || '',
        memoryBandwidth: gpu.memory_bandwidth || '',
        // Compute Information
        textureRate: gpu.texture_rate || '',
        fp16Performance: gpu.fp16 || '',
        fp32Performance: gpu.fp32 || '',
        fp64Performance: gpu.fp64 || '',
        // Graphic API Information
        pixelRate: gpu.pixel_rate || '',
        slot: gpu.slot || '',
        directX: gpu.directx || '',
        openGL: gpu.opengl || '',
        openCL: gpu.opencl || '',
        vulkan: gpu.vulkan || '',
        // Cache
        l0Cache: gpu.l0_cache || '',
        l1Cache: gpu.l1_cache || '',
        l2Cache: gpu.l2_cache || '',
        l3Cache: gpu.l3_cache || ''
      }
    }
  },
  { immediate: true }
)

const toggleProcessors = () => {
  isProcessorsExpanded.value = !isProcessorsExpanded.value
}
const toggleArchitecture = () => {
  isArchitectureExpanded.value = !isArchitectureExpanded.value
}
const toggleClock = () => {
  isClockExpanded.value = !isClockExpanded.value
}
const toggleMemory = () => {
  isMemoryExpanded.value = !isMemoryExpanded.value
}
const toggleCompute = () => {
  isComputeExpanded.value = !isComputeExpanded.value
}
const toggleGraphicAPI = () => {
  isGraphicAPIExpanded.value = !isGraphicAPIExpanded.value
}

const toggleHistory = () => {
  isHistoryExpanded.value = !isHistoryExpanded.value
}


function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const preparePostRequestBody = () => {
  return {
    soc: {
      name: form.value.name,
      release_date: form.value.releaseDate ? form.value.releaseDate : null,
      platform: form.value.platform,
      process_node: form.value.processNode,
      tdp: form.value.tdp ? parseFloat(form.value.tdp) : null,
      soc_id: props.gpuData.gpu?.SoC?.soc_id || null,
    },
    manufacturer: {
      name: form.value.manufacturer?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      manufacturer_id: props.gpuData.gpu?.SoC?.Manufacturer?.manufacturer_id || null,
    },
    gpu: {
      gpu_id: props.gpuData.gpu?.gpu_id || null,
      model: form.value.name?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      variant: form.value.variant?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      architecture: form.value.architecture?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      generation: form.value.generation?.replace(/[<>"'&]/g, (match) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return escapeMap[match];
      }),
      core_count: form.value.coreCount ? parseInt(form.value.coreCount) : null,
      base_clock: form.value.baseClock ? parseFloat(form.value.baseClock) : null,
      boost_clock: form.value.boostClock ? parseFloat(form.value.boostClock) : null,
      memory_clock: form.value.memoryClock ? parseFloat(form.value.memoryClock) : null,
      memory_size: form.value.memorySize ? parseInt(form.value.memorySize) : null,
      memory_type: form.value.memoryType,
      memory_bus: form.value.memoryBus,
      memory_bandwidth: form.value.memoryBandwidth ? parseFloat(form.value.memoryBandwidth) : null,
      l0_cache: form.value.l0Cache ? parseInt(form.value.l0Cache) : null,
      l1_cache: form.value.l1Cache ? parseInt(form.value.l1Cache) : null,
      l2_cache: form.value.l2Cache ? parseInt(form.value.l2Cache) : null,
      l3_cache: form.value.l3Cache ? parseInt(form.value.l3Cache) : null,
      pixel_rate: form.value.pixelRate ? parseFloat(form.value.pixelRate) : null,
      texture_rate: form.value.textureRate ? parseFloat(form.value.textureRate) : null,
      fp16: form.value.fp16Performance ? parseFloat(form.value.fp16Performance) : null,
      fp32: form.value.fp32Performance ? parseFloat(form.value.fp32Performance) : null,
      fp64: form.value.fp64Performance ? parseFloat(form.value.fp64Performance) : null,
      slot: form.value.slot,
      directx: form.value.directX,
      opengl: form.value.openGL,
      opencl: form.value.openCL,
      vulkan: form.value.vulkan,
      cores: form.value.cores
    },
    economics: {
      year: form.value.releaseDate ? new Date(form.value.releaseDate).getFullYear() : ''
    }
  }
}

const submitData = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  // Basic validation
  if (!form.value.manufacturer || !form.value.variant || !form.value.name) {
    errorMessage.value = 'Please fill in all required fields (Manufacturer, Variant, Name)'
    return
  }

  const postData = preparePostRequestBody()

  try {
    const response = await fetch(
      props.editMode
        ? `${useRuntimeConfig().public.backendUrl}/gpus/${props.gpuData.gpu?.gpu_id}`
        : `${useRuntimeConfig().public.backendUrl}/gpus`,
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
    
    if (response.ok) {
      successMessage.value = 'GPU saved successfully!'
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

const redirectPage = (data) => {
  const gpuId = props.editMode ? props.gpuData.gpu?.gpu_id : data.gpu?.gpu_id
  const redirectUrl = `/gpu/${gpuId}`
  setTimeout(() => {
    if (process.client && typeof window !== 'undefined') {
      window.location.href = redirectUrl
    }
  }, 2500)
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

/* Transition for collapsible sections */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
