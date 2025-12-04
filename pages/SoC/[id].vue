<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 justify-start md:justify-between items-center">

    <!-- Main Content -->

    <!-- Header -->
    <div class="flex items-center justify-between mt-8 ml-2">
      <div class="flex items-center">
        <h1 class="text-4xl font-bold text-[#A32035]">SOC</h1>
        <NuxtLink to="/soc/list">
          <v-icon name="co-arrow-circle-left"
            class="mt-1 ml-2 text-gray-300 opacity-80 w-12 h-12 hover:text-[#8A1B2D] hover:opacity-78" />
        </NuxtLink>
      </div>

      <button @click="submitForm"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
        <span class="mr-2"> Save </span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path fill-rule="evenodd" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>


    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center h-64">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
        <div class="text-gray-500">Loading SoC data...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="text-red-800">{{ error.statusMessage || 'Failed to load SoC data' }}</span>
        </div>
        <button @click="window.location.reload()" class="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
          Retry
        </button>
      </div>
    </div>

    <!-- SOC Form -->
    <div v-else class="flex items-center justify-between mt-8 ml-2">
      <form class="w-full">
        <h2 class="text-xl font-medium font-semibold text-semibold">General Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Manufacturer -->
          <div>
            <label for="manufacturer" class="block text-sm font-medium text-gray-700">Manufacturer</label>
            <select id="manufacturer" name="manufacturer" v-model="form.manufacturer"
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
            <label for="code-name" class="block text-sm font-medium text-gray-700">Code Name</label>
            <input type="text" id="code-name" name="code-name" v-model="form.codeName"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>

          <!-- Year -->
          <div>
            <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
            <input type="number" id="year" name="year" v-model="form.year"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>
        </div>

        <!-- Core Count -->
        <div class="mt-6">
          <label for="core-count" class="block text-sm font-medium text-gray-700">Core Count</label>
          <input type="number" id="core-count" name="core-count" v-model="form.coreCount"
            class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
        </div>

        <!-- Additional SoC Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <!-- Process Node -->
          <div>
            <label for="process-node" class="block text-sm font-medium text-gray-700">Process Node (nm)</label>
            <input type="number" id="process-node" name="process-node" v-model="form.processNode"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>

          <!-- Total Transistor Count -->
          <div>
            <label for="transistor-count" class="block text-sm font-medium text-gray-700">Total Transistor Count (millions)</label>
            <input type="number" id="transistor-count" name="transistor-count" v-model="form.totalTransistorCount"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>

          <!-- Die Sizes -->
          <div>
            <label for="die-sizes" class="block text-sm font-medium text-gray-700">Die Sizes (mm²)</label>
            <input type="number" id="die-sizes" name="die-sizes" v-model="form.dieSizes"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>

          <!-- Package Size -->
          <div>
            <label for="package-size" class="block text-sm font-medium text-gray-700">Package Size (mm²)</label>
            <input type="number" id="package-size" name="package-size" v-model="form.packageSize"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>

          <!-- Number of Die -->
          <div>
            <label for="number-of-die" class="block text-sm font-medium text-gray-700">Number of Die</label>
            <input type="number" id="number-of-die" name="number-of-die" v-model="form.numberOfDie"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>

          <!-- Platform -->
          <div>
            <label for="platform" class="block text-sm font-medium text-gray-700">Platform</label>
            <select id="platform" name="platform" v-model="form.platform"
              class="pl-2 mt-2 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
              <option value="">Select Platform</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
              <option value="Server">Server</option>
              <option value="Embedded">Embedded</option>
            </select>
          </div>
        </div>

        <!-- Voltage Range -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <label for="voltage-low" class="block text-sm font-medium text-gray-700">Voltage Range Low (V)</label>
            <input type="number" id="voltage-low" name="voltage-low" v-model="form.voltageLow" step="0.1"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>
          <div>
            <label for="voltage-high" class="block text-sm font-medium text-gray-700">Voltage Range High (V)</label>
            <input type="number" id="voltage-high" name="voltage-high" v-model="form.voltageHigh" step="0.1"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
          </div>
        </div>

        <!-- Transistor Density -->
        <div class="mt-6">
          <label for="transistor-density" class="block text-sm font-medium text-gray-700">Transistor Density (transistors/mm²)</label>
          <input type="number" id="transistor-density" name="transistor-density" v-model="form.transistorDensity"
            class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
        </div>

        <!-- Notes -->
        <div class="mt-6">
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea id="notes" name="notes" v-model="form.notes" rows="3"
            class="pl-2 mt-1 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm"></textarea>
        </div>

        <hr class="border-t border-gray-300 pt-8 mt-6">

        <!-- Processors Section -->
        <div>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-medium text-gray-700 text-semibold">Processors</h2>
              <button @click="togglePerformance" class="p-1 hover:bg-gray-100 rounded-full" type="button">
                <v-icon name="bi-chevron-compact-up"
                  :style="{ transform: isPerformanceExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
              </button>
            </div>
            <NuxtLink to="/soc/form"
              class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
              <span class="mr-2"> Add processor </span>
            </NuxtLink>
          </div>

          <Transition name="collapse">
            <div v-if="isPerformanceExpanded">
              <div class="mt-4 mb-8">
                <table class="w-full mt-4 border border-1 border-gray-200 rounded-lg overflow-hidden">
                  <thead class="bg-black opacity-80">
                    <tr>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Type</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Name</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Quantity</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Memory</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="processor in processors" :key="processor.id" class="border-t border-gray-200">
                      <td class="px-4 py-2">{{ processor.type }}</td>
                      <td class="px-4 py-2">{{ processor.name }}</td>
                      <td class="px-4 py-2">{{ processor.quantity }}</td>
                      <td class="px-4 py-2">{{ processor.memory }}</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>
        </div>

        <hr class="border-t border-gray-300 pt-8">

        <!-- Performance Section -->
        <div>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-medium text-gray-700 text-semibold">Performance</h2>
              <button @click="togglePerformance" class="p-1 hover:bg-gray-100 rounded-full" type="button">
                <v-icon name="bi-chevron-compact-up"
                  :style="{ transform: isPerformanceExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
              </button>
            </div>
            <NuxtLink to="/soc/form"
              class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
              <span class="mr-2"> Add benchmark </span>
            </NuxtLink>
          </div>

          <Transition name="collapse">
            <div v-if="isPerformanceExpanded">
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
                    <tr v-for="benchmark in benchmarks" :key="benchmark.id" class="border-t border-gray-200">
                      <td class="px-4 py-2">{{ benchmark.name }}</td>
                      <td class="px-4 py-2">{{ benchmark.score }}</td>
                      <td class="px-4 py-2">{{ benchmark.year }}</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>

        </div>

        <hr class="border-t border-gray-300 pt-8">

        <!-- Economics Section -->
        <div>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-medium text-gray-700 text-semibold">Economics</h2>
              <button @click="toggleEconomics" class="p-1 hover:bg-gray-100 rounded-full" type="button">
                <v-icon name="bi-chevron-compact-up"
                  :style="{ transform: isEconomicsExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
              </button>
            </div>
            <NuxtLink to="/soc/form"
              class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
              <span class="mr-2"> Add economic data </span>
            </NuxtLink>
          </div>

          <Transition name="collapse">
            <div v-if="isEconomicsExpanded">
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
                    <tr v-for="economic in economics" :key="economic.id" class="border-t border-gray-200">
                      <td class="px-4 py-2">${{ economic.price }}</td>
                      <td class="px-4 py-2">{{ economic.year }}</td>
                      <td class="px-4 py-2">{{ economic.sales }}</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>

        </div>
      </form>
    </div>

  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRuntimeConfig, useFetch, navigateTo, createError } from '#imports'
import { isLogged } from '../lib/isLogged'

const isPerformanceExpanded = ref(true)
const isEconomicsExpanded = ref(true)
const sidebarOffset = ref(0)
const isLoggedIn = ref(false)

// Get SoC ID from route params
const route = useRoute()
const socId = route.params.id

// Validate SoC ID
if (!socId) {
  throw createError({ statusCode: 404, statusMessage: 'SoC ID not found' })
}

// Fetch SoC data
const { data: rawSocData, pending, error } = await useFetch(
  `/api/socs/${socId}`,
  {
    server: false,
    default: () => null
  }
)

// Transform the data
const socData = computed(() => {
  if (!rawSocData.value) return null;
  
  const data = rawSocData.value.data || rawSocData.value;
  
  return {
    soc: data.soc || data,
    versionHistory: data.versionHistory || [],
    manufacturerName: data.manufacturerName
  };
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

// Sample data for processors, benchmarks, and economics
const processors = ref([
  { id: 1, type: 'CPU', name: 'Intel® Core™ i7 processor 14650', quantity: 1, memory: '4GB' },
  { id: 2, type: 'GPU', name: 'Intel Iris Xe Graphics G7 96EU', quantity: 1, memory: '2GB' }
])

const benchmarks = ref([
  { id: 1, name: 'SpecInt2006', score: '26.6', year: '2006' },
  { id: 2, name: 'SpecInt2000', score: '1701.9', year: '2000' }
])

const economics = ref([
  { id: 1, price: '639', year: '2000', sales: '5K units' },
  { id: 2, price: '609', year: '2001', sales: '4K units' }
])

const handleScroll = () => {
  const footer = document.querySelector('footer')
  const sideMenu = document.querySelector('.side-menu-class')
  const footerRect = footer.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  if (footerRect.top < viewportHeight) {
    sidebarOffset.value = viewportHeight - footerRect.top
  } else {
    sidebarOffset.value = 0
  }

  sideMenu.style.transform = `translateY(-${sidebarOffset.value}px)`
}

// Initialize form with SoC data
const initializeForm = () => {
  if (socData.value) {
    const soc = socData.value.soc
    form.value = {
      manufacturer: socData.value.manufacturerName || '',
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
  }
}

// Watch for SoC data changes
watch(() => socData.value, () => {
  initializeForm()
}, { immediate: true })

// Helper function to get or create manufacturer
const getOrCreateManufacturer = async (manufacturerName) => {
  if (!manufacturerName) return null
  
  try {
    const config = useRuntimeConfig()
    
    // First, try to find existing manufacturer
    const searchResponse = await fetch(`${config.public.backendUrl}/api/manufacturers?name=${encodeURIComponent(manufacturerName)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
const submitForm = async () => {
  if (!isLoggedIn.value) {
    alert('Please log in to save SoC data')
    return
  }

  try {
    const config = useRuntimeConfig()
    
    // Get manufacturer ID
    const manufacturerId = form.value.manufacturerId || await getOrCreateManufacturer(form.value.manufacturer)
    
    if (!manufacturerId && form.value.manufacturer) {
      alert('Failed to find or create manufacturer. Please try again.')
      return
    }
    
    const url = `${config.public.backendUrl}/api/socs/${socId}`
    const method = 'PUT'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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

    if (response.ok) {
      alert('SoC updated successfully!')
      navigateTo('/soc/list')
    } else {
      const errorData = await response.json()
      alert(`Failed to update SoC data: ${errorData.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error updating SoC:', error)
    alert('Error updating SoC data')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  isLoggedIn.value = isLogged()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const togglePerformance = () => {
  isPerformanceExpanded.value = !isPerformanceExpanded.value;
};

const toggleEconomics = () => {
  isEconomicsExpanded.value = !isEconomicsExpanded.value;
};
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
