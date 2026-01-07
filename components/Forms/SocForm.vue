<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Message Area -->
    <div v-if="successMessage" class="mb-4 p-2 bg-green-200 text-green-800 rounded">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mb-4 p-2 bg-red-200 text-red-800 rounded">
      {{ errorMessage }}
    </div>

    <!-- General Information -->
    <h3 class="text-xl font-medium font-semibold">General Information</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <!-- Manufacturer -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Manufacturer</label>
        <select v-model="form.manufacturer" :disabled="readOnly"
          class="pl-2 mt-2 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          <option value="">Select Manufacturer</option>
          <option value="Intel">Intel</option>
          <option value="AMD">AMD</option>
          <option value="ARM">ARM</option>
          <option value="NVIDIA">NVIDIA</option>
          <option value="Qualcomm">Qualcomm</option>
        </select>
      </div>

      <!-- Code Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Code Name</label>
        <input v-model="form.codeName" type="text" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Year -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Year</label>
        <input v-model="form.year" type="number" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Core Count -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Core Count</label>
        <input v-model="form.coreCount" type="number" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Process Node -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Process Node (nm)</label>
        <input v-model="form.processNode" type="number" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Total Transistor Count -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Total Transistor Count (millions)</label>
        <input v-model="form.totalTransistorCount" type="number" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Die Sizes -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Die Sizes (mm²)</label>
        <input v-model="form.dieSizes" type="number" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Package Size -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Package Size (mm²)</label>
        <input v-model="form.packageSize" type="number" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Number of Die -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Number of Die</label>
        <input v-model="form.numberOfDie" type="number" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Platform -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Platform</label>
        <select v-model="form.platform" :disabled="readOnly"
          class="pl-2 mt-2 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          <option value="">Select Platform</option>
          <option value="Desktop">Desktop</option>
          <option value="Mobile">Mobile</option>
          <option value="Server">Server</option>
          <option value="Embedded">Embedded</option>
        </select>
      </div>

      <!-- Voltage Range Low -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Voltage Range Low (V)</label>
        <input v-model="form.voltageLow" type="number" step="0.1" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Voltage Range High -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Voltage Range High (V)</label>
        <input v-model="form.voltageHigh" type="number" step="0.1" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>

      <!-- Transistor Density -->
      <div>
        <label class="block text-sm font-medium text-gray-700 pl-2">Transistor Density (transistors/mm²)</label>
        <input v-model="form.transistorDensity" type="number" :disabled="readOnly"
          class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
      </div>
    </div>

    <!-- Notes -->
    <div class="mt-6">
      <label class="block text-sm font-medium text-gray-700 pl-2">Notes</label>
      <textarea v-model="form.notes" rows="3" :disabled="readOnly"
        class="pl-2 mt-1 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm"></textarea>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Processors Section -->
    <div>
      <div class="flex justify-between items-center mb-4 mt-8">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium font-semibold">Processors</h3>
          <button @click="toggleProcessors" class="p-1 hover:bg-gray-100 rounded-full" type="button">
            <v-icon name="bi-chevron-compact-up"
              :style="{ transform: isProcessorsExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
          </button>
        </div>
        <div v-if="!readOnly" class="flex gap-2">
          <button 
            @click="toggleProcessorSelector"
            class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
            <span class="mr-2">Add processor</span>
          </button>
        </div>
      </div>

      <!-- Processor Selector Modal/Dropdown -->
      <Transition name="collapse">
        <div v-if="showProcessorSelector" class="mt-4 mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Select Processor</h3>
            <button @click="toggleProcessorSelector" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl leading-none">&times;</span>
            </button>
          </div>
          
          <!-- Processor Type Tabs -->
          <div class="flex gap-2 mb-4 border-b border-gray-300">
            <button 
              @click="selectedProcessorType = 'CPU'"
              :class="['px-4 py-2 font-medium', selectedProcessorType === 'CPU' ? 'border-b-2 border-[#A32035] text-[#A32035]' : 'text-gray-600']">
              CPU
            </button>
            <button 
              @click="selectedProcessorType = 'GPU'"
              :class="['px-4 py-2 font-medium', selectedProcessorType === 'GPU' ? 'border-b-2 border-[#A32035] text-[#A32035]' : 'text-gray-600']">
              GPU
            </button>
            <button 
              @click="selectedProcessorType = 'FPGA'"
              :class="['px-4 py-2 font-medium', selectedProcessorType === 'FPGA' ? 'border-b-2 border-[#A32035] text-[#A32035]' : 'text-gray-600']">
              FPGA
            </button>
          </div>

          <!-- Search Input -->
          <div class="mb-4">
            <input 
              v-model="processorSearchQuery"
              type="text"
              placeholder="Search by name, model, family, or microarchitecture..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"
              @input="debouncedSearch"
            />
          </div>

          <!-- Processor List -->
          <div class="max-h-64 overflow-y-auto mb-4">
            <div v-if="loadingProcessors" class="text-center py-4 text-gray-500">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#A32035] mr-2"></div>
                Searching processors...
              </div>
            </div>
            <div v-else-if="availableProcessors.length === 0" class="text-center py-4 text-gray-500">
              {{ processorSearchQuery.trim() ? 'No processors found matching your search' : 'No processors found' }}
            </div>
            <div v-else class="space-y-2">
              <div 
                v-for="processor in availableProcessors" 
                :key="processor.id"
                class="p-3 border border-gray-200 rounded-lg hover:bg-gray-100 flex justify-between items-center">
                <div>
                  <div class="font-medium">{{ processor.name || processor.model || 'Unknown' }}</div>
                  <div class="text-sm text-gray-600">
                    {{ processor.family || processor.generation || '' }} 
                    {{ processor.microarchitecture || processor.architecture || '' }}
                  </div>
                </div>
                <button 
                  @click="associateProcessor(processor)"
                  class="px-4 py-1 bg-[#A32035] text-white rounded hover:bg-[#8a1b2d] text-sm">
                  Select
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div v-if="processorSearchPagination && processorSearchPagination.totalPages > 1" class="flex items-center justify-between pt-4 border-t border-gray-300">
            <div class="text-sm text-gray-600">
              Page {{ processorSearchPage }} of {{ processorSearchPagination.totalPages }}
              ({{ processorSearchPagination.totalCount }} total)
            </div>
            <div class="flex gap-2">
              <button
                @click="processorSearchPage--; searchProcessors()"
                :disabled="processorSearchPage <= 1 || loadingProcessors"
                class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                Previous
              </button>
              <button
                @click="processorSearchPage++; searchProcessors()"
                :disabled="processorSearchPage >= processorSearchPagination.totalPages || loadingProcessors"
                class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                Next
              </button>
            </div>
          </div>

          <!-- Add New Buttons -->
          <div class="flex gap-2 pt-4 border-t border-gray-300">
            <NuxtLink 
              to="/cpu/form"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center text-sm font-medium">
              Add New CPU
            </NuxtLink>
            <NuxtLink 
              to="/gpu/form"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center text-sm font-medium">
              Add New GPU
            </NuxtLink>
            <NuxtLink 
              to="/fpga/form"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center text-sm font-medium">
              Add New FPGA
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- Processors Table - Always visible when expanded, no Transition to avoid rendering issues -->
      <div v-if="isProcessorsExpanded" :key="`processors-${processors.length}`">
        <div class="mt-4 mb-8">
          <table class="w-full mt-4 border border-1 border-gray-200 rounded-lg overflow-hidden" :data-processors-count="processors.length">
              <thead class="bg-black opacity-80">
                <tr>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Type</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Name</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Quantity</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Memory</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="processors.length === 0">
                  <tr class="border-t border-gray-200">
                    <td colspan="5" class="px-4 py-2 text-center text-gray-500">No processors found</td>
                  </tr>
                </template>
                <template v-else>
                  <tr 
                    v-for="(processor, index) in processors" 
                    :key="`processor-${processor.type}-${processor.id || index}`" 
                    class="border-t border-gray-200"
                    :data-processor-id="processor.id"
                    :data-processor-type="processor.type"
                  >
                    <td class="px-4 py-2">{{ processor.type }}</td>
                    <td class="px-4 py-2">{{ processor.name }}</td>
                    <td class="px-4 py-2">{{ processor.quantity }}</td>
                    <td class="px-4 py-2">{{ processor.memory }}</td>
                    <td class="px-4 py-2">
                      <div class="flex items-center gap-2 justify-end">
                        <NuxtLink 
                          v-if="processor.type === 'CPU' && processor.id" 
                          :to="`/cpu/${processor.id}`"
                          class="text-sm text-[#A32035] hover:underline"
                        >
                          View
                        </NuxtLink>
                        <NuxtLink 
                          v-else-if="processor.type === 'GPU' && processor.id" 
                          :to="`/gpu/${processor.id}`"
                          class="text-sm text-[#A32035] hover:underline"
                        >
                          View
                        </NuxtLink>
                        <NuxtLink 
                          v-else-if="processor.type === 'FPGA' && processor.id" 
                          :to="`/fpga/${processor.id}`"
                          class="text-sm text-[#A32035] hover:underline"
                        >
                          View
                        </NuxtLink>
                        <span v-else class="text-sm text-gray-400">N/A</span>
                        <button
                          v-if="!readOnly && isLoggedIn && processor.id"
                          @click="removeProcessor(processor)"
                          class="text-sm text-red-600 hover:text-red-800 hover:underline ml-2"
                          title="Remove processor from SoC"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Performance Section (Benchmarks) -->
    <div>
      <div class="flex justify-between items-center mb-4 mt-8">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium font-semibold">Performance</h3>
          <button @click="togglePerformance" class="p-1 hover:bg-gray-100 rounded-full" type="button">
            <v-icon name="bi-chevron-compact-up"
              :style="{ transform: isPerformanceExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
          </button>
        </div>
        <button 
          v-if="!readOnly"
          @click="toggleAddBenchmarkForm"
          class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
          <span class="mr-2">{{ showAddBenchmarkForm ? 'Cancel' : 'Add benchmark' }}</span>
        </button>
      </div>

      <!-- Add Benchmark Form -->
      <Transition name="collapse">
        <div v-if="showAddBenchmarkForm" class="mt-4 mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-medium mb-4">{{ editingBenchmark ? 'Edit Benchmark' : 'Add Benchmark' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Benchmark Name *</label>
              <input v-model="benchmarkForm.benchmark_name" type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Score *</label>
              <input v-model="benchmarkForm.score" type="number" step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Test Date</label>
              <input v-model="benchmarkForm.test_date" type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Test Conditions</label>
              <input v-model="benchmarkForm.test_conditions" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea v-model="benchmarkForm.notes" rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"></textarea>
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button @click="submitBenchmark" 
              class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-[#8a1b2d]">
              {{ editingBenchmark ? 'Update' : 'Add' }}
            </button>
            <button @click="cancelBenchmarkForm" 
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </Transition>

      <Transition name="collapse">
        <div v-if="isPerformanceExpanded" :key="`benchmarks-${benchmarks.length}`">
          <div class="mt-4 mb-8">
            <table class="w-full mt-4 border border-1 border-gray-200 rounded-lg overflow-hidden">
              <thead class="bg-black opacity-80">
                <tr>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Benchmark</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Score</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Year</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="benchmarks.length === 0" class="border-t border-gray-200">
                  <td colspan="4" class="px-4 py-2 text-center text-gray-500">No benchmarks found</td>
                </tr>
                <tr v-for="benchmark in benchmarks" :key="benchmark.id" class="border-t border-gray-200">
                  <td class="px-4 py-2">{{ benchmark.name }}</td>
                  <td class="px-4 py-2">{{ benchmark.score }}</td>
                  <td class="px-4 py-2">{{ benchmark.year }}</td>
                  <td class="px-4 py-2 text-right">
                    <button 
                      v-if="!readOnly && editMode"
                      type="button" 
                      @click="editBenchmark(benchmark)"
                      class="text-sm text-[#A32035] hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      v-if="!readOnly && editMode"
                      type="button" 
                      @click="deleteBenchmark(benchmark.id)"
                      class="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Economics Section -->
    <div>
      <div class="flex justify-between items-center mb-4 mt-8">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium font-semibold">Economics</h3>
          <button @click="toggleEconomics" class="p-1 hover:bg-gray-100 rounded-full" type="button">
            <v-icon name="bi-chevron-compact-up"
              :style="{ transform: isEconomicsExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
          </button>
        </div>
        <button 
          v-if="!readOnly"
          @click="toggleAddEconomicsForm"
          class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
          <span class="mr-2">{{ showAddEconomicsForm ? 'Cancel' : 'Add economic data' }}</span>
        </button>
      </div>

      <!-- Add Economics Form -->
      <Transition name="collapse">
        <div v-if="showAddEconomicsForm" class="mt-4 mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-medium mb-4">{{ editingEconomic ? 'Edit Economic Data' : 'Add Economic Data' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input v-model="economicsForm.year" type="number" min="1900" max="2100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input v-model="economicsForm.price" type="number" step="0.01" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sales (units)</label>
              <input v-model="economicsForm.sales_in_units" type="number" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Revenue</label>
              <input v-model="economicsForm.revenue" type="number" step="0.01" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea v-model="economicsForm.notes" rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"></textarea>
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button @click="submitEconomic" 
              class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-[#8a1b2d]">
              {{ editingEconomic ? 'Update' : 'Add' }}
            </button>
            <button @click="cancelEconomicsForm" 
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </Transition>

      <Transition name="collapse">
        <div v-if="isEconomicsExpanded" :key="`economics-${economics.length}`">
          <div class="mt-4 mb-8">
            <table class="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
              <thead class="bg-black opacity-80">
                <tr>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Price</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Year</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Sales</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="economics.length === 0" class="border-t border-gray-200">
                  <td colspan="4" class="px-4 py-2 text-center text-gray-500">No economic data found</td>
                </tr>
                <tr v-for="economic in economics" :key="economic.id" class="border-t border-gray-200">
                  <td class="px-4 py-2">${{ economic.price }}</td>
                  <td class="px-4 py-2">{{ economic.year }}</td>
                  <td class="px-4 py-2">{{ economic.sales }}</td>
                  <td class="px-4 py-2 text-right">
                    <button 
                      v-if="!readOnly && editMode"
                      type="button" 
                      @click="editEconomic(economic)"
                      class="text-sm text-[#A32035] hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      v-if="!readOnly && editMode"
                      type="button" 
                      @click="deleteEconomic(economic.id)"
                      class="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted, onMounted, nextTick } from 'vue'
import { useRuntimeConfig, useFetch, navigateTo } from '#imports'
import { isLogged } from '@/lib/isLogged'
import { getItemWithExpiry } from '@/lib/encrypter'

const props = defineProps({
  socData: {
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
    console.warn('[SocForm] No authentication token found. User may need to log in again.')
  }
  return token || null
}

// Reactive states for messages
const successMessage = ref('')
const errorMessage = ref('')

// Check if user is logged in
const isLoggedIn = ref(false)
onMounted(() => {
  isLoggedIn.value = isLogged()
})

// Form data
const form = ref({
  manufacturer: '',
  manufacturerId: null,
  codeName: '',
  year: '',
  processNode: '',
  totalTransistorCount: '',
  dieSizes: '',
  packageSize: '',
  numberOfDie: '',
  voltageLow: '',
  voltageHigh: '',
  platform: '',
  transistorDensity: '',
  coreCount: '',
  notes: ''
})

// Watch for changes in socData prop to update the form
watch(
  () => props.socData,
  (newData) => {
    if (!newData || !newData.soc) {
      return
    }
    
    const soc = newData.soc
    
    form.value = {
      manufacturer: newData.manufacturerName || '',
      manufacturerId: soc.soc_manufacturer_id || null,
      codeName: soc.name || '',
      year: soc.release_date ? new Date(soc.release_date).getFullYear().toString() : '',
      processNode: soc.process_node || '',
      totalTransistorCount: soc.total_transistor_count || '',
      dieSizes: soc.die_sizes || '',
      packageSize: soc.package_size || '',
      numberOfDie: soc.number_of_die || '',
      voltageLow: soc.voltage_range_low || '',
      voltageHigh: soc.voltage_range_high || '',
      platform: soc.platform || '',
      transistorDensity: soc.transistor_density || '',
      coreCount: soc.core_count || '',
      notes: soc.soc_notes || soc.notes || ''
    }
  },
  { immediate: true }
)

// Toggles for collapsible sections (declare early to avoid initialization errors)
const isProcessorsExpanded = ref(true)
const isPerformanceExpanded = ref(true)
const isEconomicsExpanded = ref(true)

// Processors, benchmarks, and economics from props
const processors = computed(() => {
  console.log('[SocForm] processors computed - socData:', props.socData)
  if (!props.socData?.processors) {
    console.log('[SocForm] No processors in socData')
    return []
  }
  const procs = props.socData.processors
  console.log('[SocForm] processors array:', procs, 'isArray:', Array.isArray(procs))
  
  if (!Array.isArray(procs)) {
    console.log('[SocForm] processors is not an array, returning empty array')
    return []
  }
  
  const mapped = procs.map((p, idx) => {
    // Log each processor structure for debugging
    console.log(`[SocForm] Processing processor ${idx}:`, p)
    
    // Handle different processor structures from backend
    let processorId = p.cpu_id || p.gpu_id || p.fpga_id || idx
    let processorType = p.processor_type || 'Unknown'
    let processorName = 'Unknown'
    let memory = 'N/A'
    
    // CPU structure: model is in core_info.model or top-level model
    if (processorType === 'CPU') {
      processorName = p.core_info?.model || p.model || 'Unknown'
      memory = p.memory_info?.max_memory_size ? `${p.memory_info.max_memory_size}GB` : 'N/A'
    }
    // GPU structure: name is at top level or in general_info.name
    else if (processorType === 'GPU') {
      processorName = p.name || p.general_info?.name || 'Unknown'
      memory = p.memory_info?.memory_size ? `${p.memory_info.memory_size}GB` : 'N/A'
    }
    // FPGA structure
    else if (processorType === 'FPGA') {
      processorName = p.model || 'Unknown'
      memory = 'N/A'
    }
    
    const mappedProc = {
      id: processorId,
      type: processorType,
      name: processorName,
      quantity: 1,
      memory: memory
    }
    
    console.log(`[SocForm] Mapped processor ${idx}:`, mappedProc)
    return mappedProc
  })
  
  console.log('[SocForm] Final mapped processors array:', mapped, 'length:', mapped.length)
  return mapped
})

// Watch for changes in processors to debug reactivity
watch(() => processors.value, (newProcessors, oldProcessors) => {
  console.log('[SocForm] processors watcher triggered:', {
    oldLength: oldProcessors?.length || 0,
    newLength: newProcessors?.length || 0,
    newProcessors
  })
}, { deep: true })

// Watch for changes in socData.processors
watch(() => props.socData?.processors, (newProcs, oldProcs) => {
  console.log('[SocForm] socData.processors watcher triggered:', {
    oldLength: oldProcs?.length || 0,
    newLength: newProcs?.length || 0,
    isArray: Array.isArray(newProcs)
  })
}, { deep: true })

const benchmarks = computed(() => {
  if (!props.socData?.benchmarks) return []
  const bench = props.socData.benchmarks
  return Array.isArray(bench) ? bench.map((b, idx) => ({
    id: b.benchmark_id || idx,
    name: b.benchmark_name || 'Unknown',
    score: b.score || 'N/A',
    year: b.test_date ? new Date(b.test_date).getFullYear().toString() : 'N/A',
    test_conditions: b.test_conditions || '',
    notes: b.notes || ''
  })) : []
})

const economics = computed(() => {
  if (!props.socData?.economics) return []
  const econ = props.socData.economics
  return Array.isArray(econ) ? econ.map((e, idx) => ({
    id: e.economic_data_id || idx,
    price: e.price || 'N/A',
    year: e.year || 'N/A',
    sales: e.sales_in_units ? `${e.sales_in_units} units` : 'N/A',
    revenue: e.revenue || null,
    notes: e.notes || ''
  })) : []
})

const toggleProcessors = () => {
  isProcessorsExpanded.value = !isProcessorsExpanded.value
}

const togglePerformance = () => {
  isPerformanceExpanded.value = !isPerformanceExpanded.value
}

const toggleEconomics = () => {
  isEconomicsExpanded.value = !isEconomicsExpanded.value
}

// Processor selector state and functions
const showProcessorSelector = ref(false)
const selectedProcessorType = ref('CPU')
const processorSearchQuery = ref('')
const availableProcessors = ref([])
const loadingProcessors = ref(false)
const processorSearchPage = ref(1)
const processorSearchPagination = ref(null)
let searchDebounceTimer = null

const toggleProcessorSelector = () => {
  showProcessorSelector.value = !showProcessorSelector.value
  if (showProcessorSelector.value) {
    processorSearchQuery.value = ''
    processorSearchPage.value = 1
    searchProcessors()
  } else {
    processorSearchQuery.value = ''
    availableProcessors.value = []
    processorSearchPagination.value = null
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
  }
}

const searchProcessors = async (resetPage = false) => {
  if (!showProcessorSelector.value) return
  
  // Reset to page 1 if starting new search
  if (resetPage) {
    processorSearchPage.value = 1
  }
  
  loadingProcessors.value = true
  try {
    let endpoint = '/api/cpus'
    if (selectedProcessorType.value === 'GPU') {
      endpoint = '/api/gpus'
    } else if (selectedProcessorType.value === 'FPGA') {
      endpoint = '/api/fpgas'
    }
    const searchQuery = processorSearchQuery.value.trim()
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
    const url = `${endpoint}?page=${processorSearchPage.value}&pageSize=50${searchParam}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch processors')
    }
    
    const data = await response.json()
    
    const processors = data.data || []
    const currentSocId = props.socData?.soc?.soc_id
    
    // Filter processors: show those without soc_id or with different soc_id
    const filtered = processors.filter(p => {
      const processorSocId = p.soc_id || p.SoC?.soc_id
      return !processorSocId || processorSocId !== currentSocId
    })
    
    // Transform to common format
    availableProcessors.value = filtered.map(p => ({
      id: p.cpu_id || p.gpu_id || p.fpga_id,
      type: selectedProcessorType.value,
      name: p.model || p.name || 'Unknown',
      model: p.model || p.name,
      family: p.family || p.generation,
      microarchitecture: p.microarchitecture || p.architecture,
      soc_id: p.soc_id || p.SoC?.soc_id
    }))
    
    // Store pagination info
    processorSearchPagination.value = data.pagination || null
  } catch (error) {
    console.error('Error searching processors:', error)
    errorMessage.value = 'Error loading processors'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  } finally {
    loadingProcessors.value = false
  }
}

// Debounced search function
const debouncedSearch = () => {
  // Clear existing timer
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  
  // Set new timer - wait 300ms after user stops typing
  searchDebounceTimer = setTimeout(() => {
    searchProcessors(true) // Reset to page 1 on new search
  }, 300)
}

// Cleanup on unmount
onUnmounted(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
})

const associateProcessor = async (processor) => {
  console.log('[SocForm] associateProcessor called', { processor, socData: props.socData })
  const socId = props.socData?.soc?.soc_id
  console.log('[SocForm] socId:', socId)
  if (!socId) {
    console.log('[SocForm] No socId - showing error message')
    errorMessage.value = 'Please save the SOC first before adding processors'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    return
  }
  
  console.log('[SocForm] Proceeding with association for socId:', socId)
  
  try {
    const config = useRuntimeConfig()
    // Normalize backendUrl - remove trailing slash and handle /api prefix
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '') // Remove trailing slash
    
    // Check if backendUrl already includes /api
    const hasApiPrefix = backendUrl.endsWith('/api')
    const apiPrefix = hasApiPrefix ? '' : '/api'
    
    let endpoint = `${apiPrefix}/cpus/${processor.id}`
    if (processor.type === 'GPU') {
      endpoint = `${apiPrefix}/gpus/${processor.id}`
    } else if (processor.type === 'FPGA') {
      endpoint = `${apiPrefix}/fpgas/${processor.id}`
    }
    const url = `${backendUrl}${endpoint}`
    
    console.log('[SocForm] Constructed URL:', url, { backendUrl, hasApiPrefix, apiPrefix, endpoint })
    
    // Get current processor data to preserve it
    const getResponse = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })
    
    if (!getResponse.ok) {
      throw new Error('Failed to fetch processor data')
    }
    
    const processorData = await getResponse.json()
    const data = processorData.data || processorData
    
    // Extract current data structure
    let currentProcessor
    if (processor.type === 'CPU') {
      currentProcessor = data.cpu || data
    } else if (processor.type === 'GPU') {
      currentProcessor = data.gpu || data
    } else if (processor.type === 'FPGA') {
      currentProcessor = data.fpga || data
    }
    const currentSoc = data.soc || data.SoC || {}
    const currentManufacturer = data.manufacturer || data.Manufacturer || {}
    
    // Update processor with new soc_id - maintain existing structure
    const updatePayload = {
      soc: {
        soc_id: socId,
        name: props.socData.soc.name || currentSoc.name || '',
        ...currentSoc
      },
      manufacturer: {
        manufacturer_id: currentManufacturer.manufacturer_id || props.socData.soc.manufacturer_id || null,
        name: currentManufacturer.name || props.socData.manufacturerName || ''
      }
    }
    
    // Add CPU, GPU, or FPGA data based on processor type
    if (processor.type === 'CPU') {
      updatePayload.cpu = currentProcessor
    } else if (processor.type === 'GPU') {
      updatePayload.gpu = currentProcessor
    } else if (processor.type === 'FPGA') {
      updatePayload.fpga = currentProcessor
    }
    
    const updateResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(updatePayload)
    })
    
    if (updateResponse.ok) {
      console.log('[SocForm] Processor association successful')
      successMessage.value = `Processor ${processor.name} associated successfully!`
      setTimeout(() => { successMessage.value = '' }, 5000)
      
      console.log('[SocForm] Closing processor selector and emitting data-refreshed')
      toggleProcessorSelector()
      // Ensure processors section is expanded so user can see the newly added processor
      isProcessorsExpanded.value = true
      console.log('[SocForm] Set isProcessorsExpanded to true, processors.length:', processors.value.length)
      console.log('[SocForm] Emitting data-refreshed event')
      emit('data-refreshed')
      console.log('[SocForm] Data-refreshed event emitted')
      
      // Force a re-render by waiting for next tick
      await nextTick()
      console.log('[SocForm] After nextTick - processors.length:', processors.value.length, 'isProcessorsExpanded:', isProcessorsExpanded.value)
    } else {
      const errorData = await updateResponse.json()
      console.error('Failed to associate processor:', errorData)
      errorMessage.value = `Failed to associate processor: ${errorData.error || 'Unknown error'}`
      setTimeout(() => { errorMessage.value = '' }, 5000)
    }
  } catch (error) {
    console.error('Error associating processor:', error)
    errorMessage.value = 'Error associating processor'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

const removeProcessor = async (processor) => {
  const socId = props.socData?.soc?.soc_id
  if (!socId) {
    errorMessage.value = 'SoC ID not found'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    return
  }
  
  if (!confirm(`Are you sure you want to remove ${processor.name} from this SoC?`)) {
    return
  }
  
  try {
    const config = useRuntimeConfig()
    // Normalize backendUrl - remove trailing slash and handle /api prefix
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '') // Remove trailing slash
    
    // Check if backendUrl already includes /api
    const hasApiPrefix = backendUrl.endsWith('/api')
    const apiPrefix = hasApiPrefix ? '' : '/api'
    
    // Use SOC-scoped endpoint for consistency with benchmarks and economics
    let processorType = 'cpus'
    if (processor.type === 'GPU') {
      processorType = 'gpus'
    } else if (processor.type === 'FPGA') {
      processorType = 'fpgas'
    }
    const url = `${backendUrl}${apiPrefix}/socs/${socId}/${processorType}/${processor.id}`
    
    console.log('[SocForm] Removing processor:', { processor, url })
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })
    
    if (response.ok) {
      successMessage.value = `${processor.type} removed from SoC successfully!`
      setTimeout(() => { successMessage.value = '' }, 3000)
      emit('data-refreshed')
    } else {
      const errorData = await response.json()
      console.error('Failed to remove processor:', errorData)
      errorMessage.value = `Failed to remove processor: ${errorData.error || 'Unknown error'}`
      setTimeout(() => { errorMessage.value = '' }, 5000)
    }
  } catch (error) {
    console.error('Error removing processor:', error)
    errorMessage.value = 'Error removing processor'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

// Watch processor type change to refresh search
watch(selectedProcessorType, () => {
  if (showProcessorSelector.value) {
    processorSearchPage.value = 1
    searchProcessors(true)
  }
})

// Benchmark form functions
const showAddBenchmarkForm = ref(false)
const editingBenchmark = ref(null)
const benchmarkForm = ref({
  benchmark_name: '',
  score: '',
  test_conditions: '',
  test_date: '',
  notes: ''
})

const toggleAddBenchmarkForm = () => {
  showAddBenchmarkForm.value = !showAddBenchmarkForm.value
  if (!showAddBenchmarkForm.value) {
    cancelBenchmarkForm()
  } else {
    showAddEconomicsForm.value = false
    cancelEconomicsForm()
  }
}

const cancelBenchmarkForm = () => {
  editingBenchmark.value = null
  benchmarkForm.value = {
    benchmark_name: '',
    score: '',
    test_conditions: '',
    test_date: '',
    notes: ''
  }
  showAddBenchmarkForm.value = false
}

const editBenchmark = (benchmark) => {
  editingBenchmark.value = benchmark
  benchmarkForm.value = {
    benchmark_name: benchmark.name || '',
    score: benchmark.score || '',
    test_conditions: benchmark.test_conditions || '',
    test_date: benchmark.year && benchmark.year !== 'N/A' ? `${benchmark.year}-01-01` : '',
    notes: benchmark.notes || ''
  }
  showAddBenchmarkForm.value = true
  showAddEconomicsForm.value = false
}

const refreshSocData = async () => {
  emit('data-refreshed')
}

const submitBenchmark = async () => {
  if (!benchmarkForm.value.benchmark_name || !benchmarkForm.value.score) {
    errorMessage.value = 'Please fill in required fields: Benchmark Name and Score'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    return
  }

  try {
    const config = useRuntimeConfig()
    const socId = props.socData?.soc?.soc_id
    if (!socId) {
      errorMessage.value = 'Please save the SOC first before adding benchmarks'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      return
    }

    // Normalize backendUrl - remove trailing slash and handle /api prefix
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '') // Remove trailing slash
    
    // Check if backendUrl already includes /api
    const hasApiPrefix = backendUrl.endsWith('/api')
    const apiPrefix = hasApiPrefix ? '' : '/api'
    
    const url = editingBenchmark.value
      ? `${backendUrl}${apiPrefix}/socs/${socId}/benchmarks/${editingBenchmark.value.id}`
      : `${backendUrl}${apiPrefix}/socs/${socId}/benchmarks`
    
    const method = editingBenchmark.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        benchmark_name: benchmarkForm.value.benchmark_name,
        score: parseFloat(benchmarkForm.value.score),
        test_conditions: benchmarkForm.value.test_conditions || null,
        test_date: benchmarkForm.value.test_date || null,
        notes: benchmarkForm.value.notes || null
      })
    })

    if (response.ok) {
      successMessage.value = `Benchmark ${editingBenchmark.value ? 'updated' : 'created'} successfully!`
      setTimeout(() => { successMessage.value = '' }, 5000)
      // Ensure performance section is expanded so user can see the newly added benchmark
      isPerformanceExpanded.value = true
      cancelBenchmarkForm()
      emit('data-refreshed')
    } else {
      const errorData = await response.json()
      errorMessage.value = `Failed to ${editingBenchmark.value ? 'update' : 'create'} benchmark: ${errorData.error || 'Unknown error'}`
      setTimeout(() => { errorMessage.value = '' }, 5000)
    }
  } catch (error) {
    console.error('Error submitting benchmark:', error)
    errorMessage.value = 'Error submitting benchmark'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

const deleteBenchmark = async (benchmarkId) => {
  if (!confirm('Are you sure you want to delete this benchmark?')) return

  try {
    const config = useRuntimeConfig()
    const socId = props.socData?.soc?.soc_id
    if (!socId) {
      errorMessage.value = 'SoC ID not found'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      return
    }

    // Normalize backendUrl - remove trailing slash and handle /api prefix
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '') // Remove trailing slash
    
    // Check if backendUrl already includes /api
    const hasApiPrefix = backendUrl.endsWith('/api')
    const apiPrefix = hasApiPrefix ? '' : '/api'

    const response = await fetch(`${backendUrl}${apiPrefix}/socs/${socId}/benchmarks/${benchmarkId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })

    if (response.ok) {
      successMessage.value = 'Benchmark deleted successfully!'
      setTimeout(() => { successMessage.value = '' }, 5000)
      emit('data-refreshed')
    } else {
      const errorData = await response.json()
      errorMessage.value = `Failed to delete benchmark: ${errorData.error || 'Unknown error'}`
      setTimeout(() => { errorMessage.value = '' }, 5000)
    }
  } catch (error) {
    console.error('Error deleting benchmark:', error)
    errorMessage.value = 'Error deleting benchmark'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

// Economics form functions
const showAddEconomicsForm = ref(false)
const editingEconomic = ref(null)
const economicsForm = ref({
  year: '',
  price: '',
  sales_in_units: '',
  revenue: '',
  notes: ''
})

const toggleAddEconomicsForm = () => {
  showAddEconomicsForm.value = !showAddEconomicsForm.value
  if (!showAddEconomicsForm.value) {
    cancelEconomicsForm()
  } else {
    showAddBenchmarkForm.value = false
    cancelBenchmarkForm()
  }
}

const cancelEconomicsForm = () => {
  editingEconomic.value = null
  economicsForm.value = {
    year: '',
    price: '',
    sales_in_units: '',
    revenue: '',
    notes: ''
  }
  showAddEconomicsForm.value = false
}

const editEconomic = (economic) => {
  editingEconomic.value = economic
  economicsForm.value = {
    year: economic.year || '',
    price: economic.price || '',
    sales_in_units: economic.sales ? economic.sales.replace(' units', '').replace('N/A', '') : '',
    revenue: economic.revenue || '',
    notes: economic.notes || ''
  }
  showAddEconomicsForm.value = true
  showAddBenchmarkForm.value = false
}

const submitEconomic = async () => {
  if (!economicsForm.value.year || !economicsForm.value.price) {
    errorMessage.value = 'Please fill in required fields: Year and Price'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    return
  }

  try {
    const config = useRuntimeConfig()
    const socId = props.socData?.soc?.soc_id
    if (!socId) {
      errorMessage.value = 'Please save the SOC first before adding economic data'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      return
    }

    // Normalize backendUrl - remove trailing slash and handle /api prefix
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '') // Remove trailing slash
    
    // Check if backendUrl already includes /api
    const hasApiPrefix = backendUrl.endsWith('/api')
    const apiPrefix = hasApiPrefix ? '' : '/api'

    const url = editingEconomic.value
      ? `${backendUrl}${apiPrefix}/socs/${socId}/economics/${editingEconomic.value.id}`
      : `${backendUrl}${apiPrefix}/socs/${socId}/economics`
    
    const method = editingEconomic.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        year: parseInt(economicsForm.value.year),
        price: parseFloat(economicsForm.value.price),
        sales_in_units: economicsForm.value.sales_in_units ? parseInt(economicsForm.value.sales_in_units) : null,
        revenue: economicsForm.value.revenue ? parseFloat(economicsForm.value.revenue) : null,
        notes: economicsForm.value.notes || null
      })
    })

    if (response.ok) {
      successMessage.value = `Economic data ${editingEconomic.value ? 'updated' : 'created'} successfully!`
      setTimeout(() => { successMessage.value = '' }, 5000)
      // Ensure economics section is expanded so user can see the newly added economic data
      isEconomicsExpanded.value = true
      cancelEconomicsForm()
      emit('data-refreshed')
    } else {
      const errorData = await response.json()
      errorMessage.value = `Failed to ${editingEconomic.value ? 'update' : 'create'} economic data: ${errorData.error || 'Unknown error'}`
      setTimeout(() => { errorMessage.value = '' }, 5000)
    }
  } catch (error) {
    console.error('Error submitting economic data:', error)
    errorMessage.value = 'Error submitting economic data'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

const deleteEconomic = async (economicId) => {
  if (!confirm('Are you sure you want to delete this economic data?')) return

  try {
    const config = useRuntimeConfig()
    const socId = props.socData?.soc?.soc_id
    if (!socId) {
      errorMessage.value = 'SoC ID not found'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      return
    }

    // Normalize backendUrl - remove trailing slash and handle /api prefix
    let backendUrl = config.public.backendUrl || 'http://localhost:3001'
    backendUrl = backendUrl.replace(/\/$/, '') // Remove trailing slash
    
    // Check if backendUrl already includes /api
    const hasApiPrefix = backendUrl.endsWith('/api')
    const apiPrefix = hasApiPrefix ? '' : '/api'

    const response = await fetch(`${backendUrl}${apiPrefix}/socs/${socId}/economics/${economicId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })

    if (response.ok) {
      successMessage.value = 'Economic data deleted successfully!'
      setTimeout(() => { successMessage.value = '' }, 5000)
      emit('data-refreshed')
    } else {
      const errorData = await response.json()
      errorMessage.value = `Failed to delete economic data: ${errorData.error || 'Unknown error'}`
      setTimeout(() => { errorMessage.value = '' }, 5000)
    }
  } catch (error) {
    console.error('Error deleting economic data:', error)
    errorMessage.value = 'Error deleting economic data'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

// Helper function to get or create manufacturer
const getOrCreateManufacturer = async (manufacturerName) => {
  if (!manufacturerName) return null
  
  try {
    const config = useRuntimeConfig()
    
    // First, try to find existing manufacturer
    const searchResponse = await fetch(`${config.public.backendUrl}/api/manufacturers?name=${encodeURIComponent(manufacturerName)}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })
    
    if (searchResponse.ok) {
      const manufacturers = await searchResponse.json()
      if (manufacturers.data && manufacturers.data.length > 0) {
        return manufacturers.data[0].manufacturer_id
      }
    }
    
    // If not found, create new manufacturer
    const createResponse = await fetch(`${config.public.backendUrl}/api/manufacturers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        name: manufacturerName,
        year: new Date().getFullYear()
      })
    })
    
    if (createResponse.ok) {
      const newManufacturer = await createResponse.json()
      return newManufacturer.manufacturer_id
    }
    
    return null
  } catch (error) {
    console.error('Error handling manufacturer:', error)
    return null
  }
}

// Form submission
const submitData = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  // Basic validation
  if (!form.value.manufacturer || !form.value.codeName) {
    errorMessage.value = 'Please fill in required fields: Manufacturer and Code Name'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    return
  }

  try {
    const config = useRuntimeConfig()
    const socId = props.editMode ? props.socData?.soc?.soc_id : null
    
    // Get manufacturer ID
    const manufacturerId = form.value.manufacturerId || await getOrCreateManufacturer(form.value.manufacturer)
    
    if (!manufacturerId && form.value.manufacturer) {
      errorMessage.value = 'Failed to find or create manufacturer. Please try again.'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      return
    }
    
    const url = props.editMode && socId
      ? `${config.public.backendUrl}/api/socs/${socId}`
      : `${config.public.backendUrl}/api/socs`
    
    const method = props.editMode && socId ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        manufacturer_id: manufacturerId,
        name: form.value.codeName,
        release_date: form.value.year ? `${form.value.year}-01-01` : null,
        core_count: form.value.coreCount ? parseInt(form.value.coreCount) : null,
        process_node: form.value.processNode ? parseFloat(form.value.processNode) : null,
        total_transistor_count: form.value.totalTransistorCount ? parseFloat(form.value.totalTransistorCount) : null,
        die_sizes: form.value.dieSizes ? parseFloat(form.value.dieSizes) : null,
        package_size: form.value.packageSize ? parseFloat(form.value.packageSize) : null,
        number_of_die: form.value.numberOfDie ? parseInt(form.value.numberOfDie) : null,
        voltage_range_low: form.value.voltageLow ? parseFloat(form.value.voltageLow) : null,
        voltage_range_high: form.value.voltageHigh ? parseFloat(form.value.voltageHigh) : null,
        platform: form.value.platform,
        transistor_density: form.value.transistorDensity ? parseFloat(form.value.transistorDensity) : null,
        notes: form.value.notes
      })
    })

    let serverData
    try {
      serverData = await response.json()
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError)
      errorMessage.value = 'Invalid response from server. Please try again.'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      return
    }
    
    console.log('Response:', serverData)

    if (response.ok) {
      successMessage.value = `SoC ${props.editMode ? 'updated' : 'created'} successfully!`
      // Handle both wrapped and direct response formats
      const responseData = serverData.data || serverData
      const newSocId = props.editMode ? socId : (responseData?.soc?.soc_id || responseData?.soc_id)
      
      console.log('[SocForm] SoC saved successfully', { newSocId, editMode: props.editMode, responseData })
      
      // If creating a new SoC, navigate to detail page immediately so user can add processors
      if (!props.editMode && newSocId) {
        console.log('[SocForm] New SoC created, navigating to detail page:', `/soc/${newSocId}`)
        // Navigate immediately to detail page where user can add processors
        await navigateTo(`/soc/${newSocId}`)
        return
      }
      
      // For edit mode, just show success message (no redirect needed)
      if (props.editMode) {
        console.log('[SocForm] SoC updated, emitting data-refreshed')
        emit('data-refreshed')
      }
    } else {
      errorMessage.value = serverData.error || 'An error occurred during submission.'
      setTimeout(() => { errorMessage.value = '' }, 5000)
    }
  } catch (error) {
    console.error('Error submitting data:', error)
    errorMessage.value = error.message || 'An unexpected error occurred.'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

// redirectPage function removed - navigation is now handled directly in submitData

// Expose submitData method to parent
defineExpose({
  submitData
})
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>

