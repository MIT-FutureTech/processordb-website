<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Message Area -->
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

    <!-- Basic Information -->
    <h3 class="text-xl font-medium font-semibold">General Information</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
      <div>
        <FormFieldLabel 
          label="Manufacturer" 
          field-id="manufacturer"
          :required="true"
          tooltip="The company that manufactures the CPU (e.g., Intel, AMD, ARM). This is a required field."
        />
        <input 
          id="manufacturer"
          v-model="form.manufacturer" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: Intel"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Family" 
          field-id="family"
          :required="true"
          tooltip="The CPU family name (e.g., Core i7, Ryzen 9, Cortex-A78). This is a required field."
        />
        <input 
          id="family"
          v-model="form.family" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: Core i7"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Code Name" 
          field-id="codeName"
          tooltip="Internal code name for the CPU architecture or generation (e.g., Alder Lake, Zen 3)."
        />
        <input 
          id="codeName"
          v-model="form.codeName" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: Alder Lake"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Microarchitecture" 
          field-id="microarchitecture"
          tooltip="The microarchitecture name (e.g., Golden Cove, Zen 3, Cortex-X1)."
        />
        <input 
          id="microarchitecture"
          v-model="form.microarchitecture" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: Golden Cove"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Model" 
          field-id="model"
          :required="true"
          tooltip="The specific CPU model number (e.g., 12700K, 5900X, M1). This is a required field."
        />
        <input 
          id="model"
          v-model="form.model" 
          type="text" 
          :disabled="readOnly"
          placeholder="Example: 12700K"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Year" 
          field-id="year"
          tooltip="The release year of the CPU (e.g., 2022, 2021)."
        />
        <input 
          id="year"
          v-model="form.year" 
          type="number" 
          :disabled="readOnly"
          placeholder="Example: 2022"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Clock" 
          field-id="clock"
          tooltip="Base clock frequency in MHz (e.g., 3200, 3600). This is the base operating frequency of the CPU."
        />
        <div class="input-container">
          <input 
            id="clock"
            v-model="form.clock" 
            type="number" 
            :disabled="readOnly"
            placeholder="Example: 3200"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">MHz</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="Max Clock" 
          field-id="maxClock"
          tooltip="Maximum boost/turbo clock frequency in MHz (e.g., 5000, 4800). The highest frequency the CPU can reach under load."
        />
        <div class="input-container">
          <input 
            id="maxClock"
            v-model="form.maxClock" 
            type="number" 
            :disabled="readOnly"
            placeholder="Example: 5000"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">MHz</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="Threads/Core" 
          field-id="threadsPerCore"
          tooltip="Number of threads per core (typically 1 or 2). Hyperthreading/SMT enables 2 threads per core."
        />
        <input 
          id="threadsPerCore"
          v-model="form.threadsPerCore" 
          type="number" 
          :disabled="readOnly"
          placeholder="Example: 2"
          class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
        />
      </div>
      <div>
        <FormFieldLabel 
          label="Lithography" 
          field-id="lithography"
          tooltip="Process node size in nanometers (e.g., 7, 10, 14). Smaller numbers indicate more advanced manufacturing process."
        />
        <div class="input-container">
          <input 
            id="lithography"
            v-model="form.lithography" 
            type="number" 
            :disabled="readOnly"
            placeholder="Example: 10"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">nm</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="TDP" 
          field-id="tdp"
          tooltip="Thermal Design Power in watts (e.g., 65, 105, 125). The maximum amount of heat the CPU is designed to generate."
        />
        <div class="input-container">
          <input 
            id="tdp"
            v-model="form.tdp" 
            type="number" 
            :disabled="readOnly"
            placeholder="Example: 65"
            class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" 
          />
          <span class="unit-label">W</span>
        </div>
      </div>
      <div>
        <FormFieldLabel 
          label="Platform" 
          field-id="platform"
          tooltip="Target platform for the CPU (e.g., Server, Desktop, Mobile, Embedded)."
        />
        <select 
          id="platform"
          v-model="form.platform" 
          :disabled="readOnly"
          class="mt-1 pl-2 block w-full h-10 border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm"
        >
          <option value="">Select Platform</option>
          <option value="Server">Server</option>
          <option value="Desktop">Desktop</option>
          <option value="Mobile">Mobile</option>
          <option value="Embedded">Embedded</option>
        </select>
      </div>
    </div>

    <!-- Cores Section -->
    <div>
      <div class="flex justify-between items-center mb-4 mt-8">
        <h3 class="text-lg font-medium">Cores</h3>
        <button 
          v-if="!readOnly"
          @click="toggleAddCoreForm"
          class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
          <span class="mr-2">{{ showAddCoreForm ? 'Cancel' : 'Add CPU core' }}</span>
        </button>
      </div>

      <!-- Add Core Form -->
      <Transition name="collapse">
        <div v-if="showAddCoreForm && !readOnly" class="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 class="text-md font-medium mb-4">{{ editingCore ? 'Edit Core' : 'Add Core' }}</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormFieldLabel 
                label="Core Name" 
                field-id="core_name"
                :required="true"
                tooltip="Name of the CPU core (e.g., P-Core, E-Core, Performance Core). This is a required field."
              />
              <input 
                id="core_name"
                v-model="coreForm.core_name" 
                type="text" 
                placeholder="Example: P-Core"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"
              />
            </div>
            <div>
              <FormFieldLabel 
                label="Base Clock (GHz)" 
                field-id="base_clock"
                tooltip="Base clock frequency in GHz (e.g., 3.6, 2.4). The base operating frequency of this core."
              />
              <input 
                id="base_clock"
                v-model="coreForm.base_clock" 
                type="number" 
                step="0.01"
                placeholder="Example: 3.6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"
              />
            </div>
            <div>
              <FormFieldLabel 
                label="Max Turbo Clock (GHz)" 
                field-id="max_turbo_clock"
                tooltip="Maximum turbo/boost clock frequency in GHz (e.g., 5.0, 4.2). The highest frequency this core can reach."
              />
              <input 
                id="max_turbo_clock"
                v-model="coreForm.max_turbo_clock" 
                type="number" 
                step="0.01"
                placeholder="Example: 5.0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"
              />
            </div>
            <div>
              <FormFieldLabel 
                label="Notes" 
                field-id="core_notes"
                tooltip="Additional notes or information about this core (optional)."
              />
              <input 
                id="core_notes"
                v-model="coreForm.notes" 
                type="text"
                placeholder="Example: Performance core with AVX-512 support"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"
              />
            </div>
          </div>
          <!-- Suggestion Note (for suggestors only) -->
          <div v-if="!readOnly && userRole === 'suggestor'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Note <span class="text-red-600">*</span> - Explain your suggestion
            </label>
            <textarea 
              v-model="coreNote" 
              rows="3"
              placeholder="Please provide an explanation for this core suggestion..."
              class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            ></textarea>
          </div>
          <div class="mt-4 flex gap-2">
            <button @click="submitCore" 
              class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-[#8a1b2d]">
              {{ editingCore ? 'Update' : 'Add' }}
            </button>
            <button @click="cancelCoreForm" 
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </Transition>

      <!-- Table with core information -->
      <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-black bg-opacity-80">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Core name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Base Frequency (GHz)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white">Max Turbo Frequency (GHz)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white" v-if="!readOnly"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="cores.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500">No cores found</td>
            </tr>
            <tr v-for="(core, index) in cores" :key="core.core_id || `new-core-${index}`">
              <td class="px-6 py-4 whitespace-nowrap">{{ core.core_name || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ core.base_clock ? core.base_clock + ' GHz' : 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ core.max_turbo_clock ? core.max_turbo_clock + ' GHz' : 'N/A' }}</td>
              <td v-if="!readOnly" class="px-6 py-4 whitespace-nowrap text-right">
                <button @click="editCore(core)" class="text-[#A32035] hover:underline mr-2">Edit</button>
                <button @click="deleteCore(core.core_id || index)" class="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
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
                <th v-if="userRole === 'admin'" class="px-6 py-3 text-left text-xs font-medium text-white">Actions</th>
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
                <td v-if="userRole === 'admin'" class="px-6 py-4 whitespace-nowrap">
                  <button 
                    @click="undoChange(history.version_id)"
                    :disabled="undoing === history.version_id"
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
                  >
                    {{ undoing === history.version_id ? 'Undoing...' : 'Undo' }}
                  </button>
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
import { ref, watch, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { getItemWithExpiry } from '@/lib/encrypter'
import { getRole } from '@/lib/isLogged'
import { submitSuggestion } from '@/lib/suggestionUtils'
import FormFieldLabel from '@/components/FormFieldLabel.vue'
import { handleApiError, handleNetworkError, handleJsonParseError, handleValidationError } from '@/lib/formErrorHandler'
import { getSuccessMessage } from '@/lib/formSuccessHandler'
import { undoChange as undoChangeApi } from '@/lib/versionHistoryService.js'
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

const emit = defineEmits(['data-refreshed'])

// Helper function to get the authentication token
const getAuthToken = () => {
  const token = getItemWithExpiry('encryptedJWTPDB')
  if (!token) {
    console.warn('[CpuForm] No authentication token found. User may need to log in again.')
  }
  return token || null
}

// Reactive states for messages
const successMessage = ref('')
const successMessageCode = ref('')
const successActionType = ref('')
const successEntityType = ref('')
const successEntityId = ref('')
const errorMessage = ref('')
const errorMessageCode = ref('')
const errorType = ref('')
const errorFieldName = ref('')

// User role and suggestion note
const userRole = computed(() => getRole())
const suggestionNote = ref('')
const undoing = ref(null)
const coreNote = ref('')

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
    },
    cores: newCores.value.length > 0 ? newCores.value : undefined
  }
}

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
  if (!form.value.manufacturer || !form.value.family || !form.value.model) {
    const error = handleValidationError(
      props.editMode ? 'CPU_UPDATE_VALIDATION_REQUIRED_FIELDS' : 'CPU_CREATE_VALIDATION_REQUIRED_FIELDS'
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
    formType: 'CPU', 
    role: currentRole, 
    isSuggestion,
    editMode: props.editMode 
  })

  try {
    // If user is a suggestor, submit as suggestion
    if (isSuggestion) {
      // Validate note is provided for suggestors
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

      const entityId = props.editMode ? props.cpuData?.cpu?.cpu_id : null
      
      try {
        const result = await submitSuggestion('cpu', entityId, postData, suggestionNote.value)
        
        console.log('[Form] Submission successful', { 
          formType: 'CPU', 
          role: currentRole, 
          isSuggestion: true 
        })
        
        const success = getSuccessMessage('suggestion', 'create')
        successMessage.value = success.message
        successMessageCode.value = success.code
        successActionType.value = success.type
        successEntityType.value = success.entity
        
        // Redirect to CPU list or detail page after delay
        setTimeout(() => {
          if (entityId) {
            window.location.href = `/cpu/${entityId}`
          } else {
            window.location.href = '/cpu/list'
          }
        }, 3000)
      } catch (suggestionError) {
        console.error('[Form] Submission failed', { 
          formType: 'CPU', 
          role: currentRole, 
          error: suggestionError.message 
        })
        const error = handleNetworkError(suggestionError, 'cpu', 'create')
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
    const response = await fetch(
      props.editMode && props.cpuData?.cpu?.cpu_id
        ? `${useRuntimeConfig().public.backendUrl}/cpus/${props.cpuData.cpu.cpu_id}`
        : `${useRuntimeConfig().public.backendUrl}/cpus`,
      {
        method: props.editMode ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(postData)
      }
    )

    let serverData
    try {
      serverData = await response.json()
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError)
      const error = handleJsonParseError('cpu', props.editMode ? 'update' : 'create')
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
      formType: 'CPU', 
      role: currentRole, 
      isSuggestion: false 
    })

    if (response.ok) {
      const responseData = serverData.data || serverData
      const cpuId = props.editMode ? props.cpuData?.cpu?.cpu_id : (responseData?.cpu?.cpu_id || responseData?.cpu_id)
      const success = getSuccessMessage('cpu', props.editMode ? 'update' : 'create', { id: cpuId })
      successMessage.value = success.message
      successMessageCode.value = success.code
      successActionType.value = success.type
      successEntityType.value = success.entity
      successEntityId.value = cpuId || ''
      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        redirectPage(responseData)
      }, 2000)
    } else {
      const error = await handleApiError(response, 'cpu', props.editMode ? 'update' : 'create')
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
    console.error('[Form] Submission failed', { 
      formType: 'CPU', 
      role: currentRole, 
      error: error.message 
    })
    const errorObj = handleNetworkError(error, 'cpu', props.editMode ? 'update' : 'create')
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

// Cores functionality
// Local array to store cores during creation (before CPU is saved)
const newCores = ref([])

const cores = computed(() => {
  // If editing existing CPU, use existing cores
  if (props.editMode && props.cpuData?.cores) {
    return props.cpuData.cores
  }
  // If creating new CPU, use newCores array
  return newCores.value
})

const showAddCoreForm = ref(false)
const editingCore = ref(null)
const editingCoreIndex = ref(-1)
const coreForm = ref({
  core_name: '',
  base_clock: '',
  max_turbo_clock: '',
  notes: ''
})

const toggleAddCoreForm = () => {
  showAddCoreForm.value = !showAddCoreForm.value
  if (!showAddCoreForm.value) {
    cancelCoreForm()
  }
}

const cancelCoreForm = () => {
  editingCore.value = null
  editingCoreIndex.value = -1
  coreForm.value = {
    core_name: '',
    base_clock: '',
    max_turbo_clock: '',
    notes: ''
  }
  coreNote.value = ''
  showAddCoreForm.value = false
}

const editCore = (core) => {
  editingCore.value = core
  // If creating new CPU, find index in newCores array
  if (!props.editMode || !props.cpuData?.cpu?.cpu_id) {
    editingCoreIndex.value = newCores.value.findIndex(c => c === core)
  } else {
    editingCoreIndex.value = -1
  }
  coreForm.value = {
    core_name: core.core_name || '',
    base_clock: core.base_clock || '',
    max_turbo_clock: core.max_turbo_clock || '',
    notes: core.notes || ''
  }
  showAddCoreForm.value = true
}

const submitCore = async () => {
  if (!coreForm.value.core_name) {
    const error = handleValidationError('CORE_CREATE_VALIDATION_NAME_REQUIRED')
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

  // If creating new CPU (not editing existing), add to local array
  const isCreatingNew = !props.editMode || !props.cpuData?.cpu?.cpu_id
  if (isCreatingNew) {
    const coreData = {
      core_name: coreForm.value.core_name,
      base_clock: coreForm.value.base_clock ? parseFloat(coreForm.value.base_clock) : null,
      max_turbo_clock: coreForm.value.max_turbo_clock ? parseFloat(coreForm.value.max_turbo_clock) : null,
      notes: coreForm.value.notes || null
    }
    
    if (editingCoreIndex.value >= 0) {
      // Update existing core in array
      newCores.value[editingCoreIndex.value] = coreData
    } else {
      // Add new core to array
      newCores.value.push(coreData)
    }
    
    cancelCoreForm()
    return
  }

  const currentRole = userRole.value
  const isSuggestion = currentRole === 'suggestor'

  // If user is a suggestor, validate note and submit as suggestion
  if (isSuggestion) {
    if (!coreNote.value || coreNote.value.trim() === '') {
      const error = handleValidationError('SUGGESTION_CORE_NOTE_REQUIRED')
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

    try {
      const cpuId = props.cpuData?.cpu?.cpu_id
      if (!cpuId) {
        const error = handleValidationError('CORE_CPU_ID_NOT_FOUND')
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

      // Get CPU name for identifying information
      const cpuName = props.cpuData?.cpu?.family && props.cpuData?.cpu?.model 
        ? `${props.cpuData.cpu.family} ${props.cpuData.cpu.model}`
        : `CPU ID ${cpuId}`

      // Prepare core data for suggestion
      const coreData = {
        operation: editingCore.value ? 'update_core' : 'create_core',
        core_id: editingCore.value ? editingCore.value.core_id : null,
        core_name: coreForm.value.core_name,
        base_clock: coreForm.value.base_clock ? parseFloat(coreForm.value.base_clock) : null,
        max_turbo_clock: coreForm.value.max_turbo_clock ? parseFloat(coreForm.value.max_turbo_clock) : null,
        notes: coreForm.value.notes || null,
        // Include identifying information
        processor_name: cpuName,
        processor_id: cpuId
      }

      // Submit as suggestion
      const result = await submitSuggestion('cpu', cpuId, coreData, coreNote.value)
      
      const success = getSuccessMessage('suggestion', 'create', { suggestionType: 'core' })
      successMessage.value = success.message
      successMessageCode.value = success.code
      successActionType.value = success.type
      successEntityType.value = success.entity
      cancelCoreForm()
      coreNote.value = ''
      setTimeout(() => {
        successMessage.value = ''
        successMessageCode.value = ''
        successActionType.value = ''
        successEntityType.value = ''
      }, 3000)
      // Emit event to refresh data without page reload
      emit('data-refreshed')
    } catch (suggestionError) {
      console.error('[Form] Core suggestion submission failed', { 
        error: suggestionError.message 
      })
      const error = handleNetworkError(suggestionError, 'core', 'create')
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
  try {
    const cpuId = props.cpuData?.cpu?.cpu_id
    if (!cpuId) {
      const error = handleValidationError('CORE_CPU_ID_NOT_FOUND')
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

    const url = editingCore.value
      ? `/api/cpus/${cpuId}/cores/${editingCore.value.core_id}`
      : `/api/cpus/${cpuId}/cores`
    
    const method = editingCore.value ? 'PUT' : 'POST'
    const authToken = getAuthToken()
    
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CpuForm.vue:950',message:'submitCore called',data:{cpuId,url,method,hasAuthToken:!!authToken,windowLocation:typeof window !== 'undefined' ? window.location.href : 'server',isLocalhost:typeof window !== 'undefined' ? window.location.hostname === 'localhost' : false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    // #endregion
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        core_name: coreForm.value.core_name,
        base_clock: coreForm.value.base_clock ? parseFloat(coreForm.value.base_clock) : null,
        max_turbo_clock: coreForm.value.max_turbo_clock ? parseFloat(coreForm.value.max_turbo_clock) : null,
        notes: coreForm.value.notes || null
      })
    })

    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CpuForm.vue:982',message:'submitCore response',data:{status:response.status,statusText:response.statusText,ok:response.ok,url:response.url,actualUrl:url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    // #endregion

    if (response.ok) {
      const success = getSuccessMessage('core', editingCore.value ? 'update' : 'create')
      successMessage.value = success.message
      successMessageCode.value = success.code
      successActionType.value = success.type
      successEntityType.value = success.entity
      cancelCoreForm()
      setTimeout(() => {
        successMessage.value = ''
        successMessageCode.value = ''
        successActionType.value = ''
        successEntityType.value = ''
      }, 3000)
      // Emit event to refresh data without page reload
      emit('data-refreshed')
    } else {
      const error = await handleApiError(response, 'core', editingCore.value ? 'update' : 'create')
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
      
      // #region agent log
      if (typeof fetch !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CpuForm.vue:992',message:'submitCore error response',data:{status:response.status,errorData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      }
      // #endregion
    }
  } catch (error) {
    console.error('Error submitting core:', error)
    const errorObj = handleNetworkError(error, 'core', editingCore.value ? 'update' : 'create')
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
    
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CpuForm.vue:996',message:'submitCore exception',data:{errorMessage:error.message,errorName:error.name,errorStack:error.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    }
    // #endregion
  }
}

const deleteCore = async (coreId) => {
  // If creating new CPU (not editing existing), remove from local array
  const isCreatingNew = !props.editMode || !props.cpuData?.cpu?.cpu_id
  if (isCreatingNew) {
    // coreId is actually the index in this case
    if (typeof coreId === 'number' && coreId >= 0 && coreId < newCores.value.length) {
      if (confirm('Are you sure you want to remove this core?')) {
        newCores.value.splice(coreId, 1)
      }
    }
    return
  }

  if (!confirm('Are you sure you want to delete this core?')) return

  const currentRole = userRole.value
  const isSuggestion = currentRole === 'suggestor'

  // If user is a suggestor, route to suggestion queue
  if (isSuggestion) {
    // Get note from user
    const note = prompt('Please provide a note explaining why this core should be deleted:')
    if (!note || note.trim() === '') {
      const error = handleValidationError('SUGGESTION_DELETE_NOTE_REQUIRED')
      errorMessage.value = error.message
      errorMessageCode.value = error.code
      errorType.value = error.type
      errorFieldName.value = error.field
      setTimeout(() => { 
        errorMessage.value = ''
        errorMessageCode.value = ''
        errorType.value = ''
        errorFieldName.value = ''
      }, 3000)
      return
    }

    try {
      const cpuId = props.cpuData?.cpu?.cpu_id
      if (!cpuId) {
        const error = handleValidationError('CORE_CPU_ID_NOT_FOUND')
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

      // Find the core to get its data for the suggestion
      const core = cores.value.find(c => c.core_id === coreId)
      if (!core) {
        errorMessage.value = 'Core not found'
        setTimeout(() => {
          errorMessage.value = ''
        }, 5000)
        return
      }

      // Get CPU name for identifying information
      const cpuName = props.cpuData?.cpu?.family && props.cpuData?.cpu?.model 
        ? `${props.cpuData.cpu.family} ${props.cpuData.cpu.model}`
        : `CPU ID ${cpuId}`

      // Prepare deletion data for suggestion
      const coreData = {
        operation: 'delete_core',
        core_id: coreId,
        core_name: core.core_name,
        base_clock: core.base_clock,
        max_turbo_clock: core.max_turbo_clock,
        notes: core.notes,
        // Include identifying information
        processor_name: cpuName,
        processor_id: cpuId
      }

      // Submit as suggestion
      const result = await submitSuggestion('cpu', cpuId, coreData, note)
      
      const success = getSuccessMessage('suggestion', 'delete', { suggestionType: 'core' })
      successMessage.value = success.message
      successMessageCode.value = success.code
      successActionType.value = success.type
      successEntityType.value = success.entity
      setTimeout(() => {
        successMessage.value = ''
        successMessageCode.value = ''
        successActionType.value = ''
        successEntityType.value = ''
      }, 3000)
      emit('data-refreshed')
    } catch (suggestionError) {
      console.error('[Form] Core deletion suggestion submission failed', { 
        error: suggestionError.message 
      })
      const error = handleNetworkError(suggestionError, 'core', 'delete')
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

  // Otherwise, delete directly (admin/editor)
  try {
    const cpuId = props.cpuData?.cpu?.cpu_id
    if (!cpuId) {
      errorMessage.value = 'CPU ID not found'
      setTimeout(() => {
        errorMessage.value = ''
      }, 5000)
      return
    }

    const response = await fetch(`/api/cpus/${cpuId}/cores/${coreId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })

    if (response.ok) {
      const success = getSuccessMessage('core', 'delete')
      successMessage.value = success.message
      successMessageCode.value = success.code
      successActionType.value = success.type
      successEntityType.value = success.entity
      setTimeout(() => {
        successMessage.value = ''
        successMessageCode.value = ''
        successActionType.value = ''
        successEntityType.value = ''
      }, 3000)
      // Emit event to refresh data without page reload
      emit('data-refreshed')
    } else {
      const error = await handleApiError(response, 'core', 'delete')
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
    console.error('Error deleting core:', error)
    const errorObj = handleNetworkError(error, 'core', 'delete')
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

// Undo change function
const undoChange = async (versionId) => {
  if (!confirm('Are you sure you want to undo this change? This action cannot be undone.')) {
    return;
  }

  undoing.value = versionId;
  errorMessage.value = '';

  try {
    await undoChangeApi(versionId);
    // Emit event to refresh data
    emit('data-refreshed');
    successMessage.value = 'Change undone successfully';
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (err) {
    console.error('[CpuForm] Error undoing change:', err);
    errorMessage.value = err.message || 'Failed to undo change.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    undoing.value = null;
  }
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
