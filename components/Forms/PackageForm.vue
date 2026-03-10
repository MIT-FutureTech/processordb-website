<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Message Area -->
    <div 
      v-if="successMessage" 
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
      class="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-md"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <strong>Error:</strong> <span class="ml-2">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Components Section -->
    <div>
      <div class="flex justify-between items-center mb-4 mt-8">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium font-semibold">Components</h3>
          <button @click="toggleComponents" class="p-1 hover:bg-gray-100 rounded-full" type="button">
            <v-icon name="bi-chevron-compact-up"
              :style="{ transform: isComponentsExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
          </button>
        </div>
        <div v-if="!readOnly" class="flex gap-2">
          <button 
            @click="toggleComponentSelector"
            class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
            <span class="mr-2">Add component</span>
          </button>
        </div>
      </div>

      <!-- Component Selector Modal/Dropdown -->
      <Transition name="collapse">
        <div v-if="showComponentSelector" class="mt-4 mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Select Component</h3>
            <button @click="toggleComponentSelector" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl leading-none">&times;</span>
            </button>
          </div>
          
          <!-- Component Type Tabs -->
          <div class="flex gap-2 mb-4 border-b border-gray-300">
            <button 
              @click="selectedComponentType = 'CPU'"
              :class="['px-4 py-2 font-medium', selectedComponentType === 'CPU' ? 'border-b-2 border-[#A32035] text-[#A32035]' : 'text-gray-600']">
              CPU
            </button>
            <button 
              @click="selectedComponentType = 'GPU'"
              :class="['px-4 py-2 font-medium', selectedComponentType === 'GPU' ? 'border-b-2 border-[#A32035] text-[#A32035]' : 'text-gray-600']">
              GPU
            </button>
            <button 
              @click="selectedComponentType = 'FPGA'"
              :class="['px-4 py-2 font-medium', selectedComponentType === 'FPGA' ? 'border-b-2 border-[#A32035] text-[#A32035]' : 'text-gray-600']">
              FPGA
            </button>
            <button 
              @click="selectedComponentType = 'AIProcessor'"
              :class="['px-4 py-2 font-medium', selectedComponentType === 'AIProcessor' ? 'border-b-2 border-[#A32035] text-[#A32035]' : 'text-gray-600']">
              AI Processor
            </button>
          </div>

          <!-- Quantity Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input 
              v-model.number="componentQuantity"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"
            />
          </div>

          <!-- Search Input -->
          <div class="mb-4">
            <input 
              v-model="componentSearchQuery"
              type="text"
              placeholder="Search by name, model, family, or microarchitecture..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#A32035] focus:border-[#A32035]"
              @input="debouncedSearch"
            />
          </div>

          <!-- Component List -->
          <div class="max-h-64 overflow-y-auto mb-4">
            <div v-if="loadingComponents" class="text-center py-4 text-gray-500">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#A32035] mr-2"></div>
                Searching components...
              </div>
            </div>
            <div v-else-if="availableComponents.length === 0" class="text-center py-4 text-gray-500">
              {{ componentSearchQuery.trim() ? 'No components found matching your search' : 'No components found' }}
            </div>
            <div v-else class="space-y-2">
              <div 
                v-for="component in availableComponents" 
                :key="component.id"
                class="p-3 border border-gray-200 rounded-lg hover:bg-gray-100 flex justify-between items-center">
                <div>
                  <div class="font-medium">{{ component.name || component.model || component.model_name || 'Unknown' }}</div>
                  <div class="text-sm text-gray-600">
                    {{ component.family || component.generation || '' }} 
                    {{ component.microarchitecture || component.architecture || '' }}
                  </div>
                </div>
                <button 
                  @click="associateComponent(component)"
                  class="px-4 py-1 bg-[#A32035] text-white rounded hover:bg-[#8a1b2d] text-sm">
                  Select
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div v-if="componentSearchPagination && componentSearchPagination.totalPages > 1" class="flex items-center justify-between pt-4 border-t border-gray-300">
            <div class="text-sm text-gray-600">
              Page {{ componentSearchPage }} of {{ componentSearchPagination.totalPages }}
              ({{ componentSearchPagination.totalCount }} total)
            </div>
            <div class="flex gap-2">
              <button
                @click="componentSearchPage--; searchComponents()"
                :disabled="componentSearchPage <= 1 || loadingComponents"
                class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                Previous
              </button>
              <button
                @click="componentSearchPage++; searchComponents()"
                :disabled="componentSearchPage >= componentSearchPagination.totalPages || loadingComponents"
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
            <NuxtLink 
              to="/ai-processor/form"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center text-sm font-medium">
              Add New AI Processor
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- Components Table - Always visible when expanded -->
      <div v-if="isComponentsExpanded" :key="`components-${components.length}`">
        <div class="mt-4 mb-8">
          <table class="w-full mt-4 border border-1 border-gray-200 rounded-lg overflow-hidden" :data-components-count="components.length">
              <thead class="bg-black opacity-80">
                <tr>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Type</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Component ID</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Count</th>
                  <th class="px-4 py-2 text-left text-semibold text-sm text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="components.length === 0">
                  <tr class="border-t border-gray-200">
                    <td colspan="4" class="px-4 py-2 text-center text-gray-500">No components found</td>
                  </tr>
                </template>
                <template v-else>
                  <tr 
                    v-for="(component, index) in components" 
                    :key="`component-${component.component_type}-${component.component_id || index}`" 
                    class="border-t border-gray-200"
                    :data-component-id="component.component_id"
                    :data-component-type="component.component_type"
                  >
                    <td class="px-4 py-2">{{ component.component_type }}</td>
                    <td class="px-4 py-2">{{ formatComponentId(component.component_type, component.component_id) }}</td>
                    <td class="px-4 py-2">{{ component.component_count }}</td>
                    <td class="px-4 py-2">
                      <div class="flex items-center gap-2 justify-end">
                        <NuxtLink 
                          v-if="component.component_type === 'CPU' && component.component_id" 
                          :to="`/cpu/${component.component_id}`"
                          class="text-sm text-[#A32035] hover:underline"
                        >
                          View
                        </NuxtLink>
                        <NuxtLink 
                          v-else-if="component.component_type === 'GPU' && component.component_id" 
                          :to="`/gpu/${component.component_id}`"
                          class="text-sm text-[#A32035] hover:underline"
                        >
                          View
                        </NuxtLink>
                        <NuxtLink 
                          v-else-if="component.component_type === 'FPGA' && component.component_id" 
                          :to="`/fpga/${component.component_id}`"
                          class="text-sm text-[#A32035] hover:underline"
                        >
                          View
                        </NuxtLink>
                        <NuxtLink 
                          v-else-if="component.component_type === 'AIProcessor' && component.component_id" 
                          :to="`/ai-processor/${component.component_id}`"
                          class="text-sm text-[#A32035] hover:underline"
                        >
                          View
                        </NuxtLink>
                        <span v-else class="text-sm text-gray-400">N/A</span>
                        <button
                          v-if="!readOnly && isLoggedIn && component.component_id"
                          @click="removeComponent(component)"
                          class="text-sm text-red-600 hover:text-red-800 hover:underline ml-2"
                          title="Remove component from package"
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

    <!-- Performance Section (Hidden but kept in DOM) -->
    <div style="display: none;">
      <div class="flex justify-between items-center mb-4 mt-8">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium font-semibold">Performance</h3>
        </div>
      </div>
    </div>

    <!-- Economics Section (Hidden but kept in DOM) -->
    <div style="display: none;">
      <div class="flex justify-between items-center mb-4 mt-8">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium font-semibold">Economics</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { isLogged } from '../lib/isLogged'
import { getItemWithExpiry } from '@/lib/encrypter'

const props = defineProps({
  packageData: {
    type: Object,
    default: () => null
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

const emit = defineEmits(['data-refreshed', 'package-created'])

// Helper function to get the authentication token
const getAuthToken = () => {
  const token = getItemWithExpiry('encryptedJWTPDB')
  if (!token) {
    console.warn('[PackageForm] No authentication token found. User may need to log in again.')
  }
  return token || null
}

const isLoggedIn = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Component management
const isComponentsExpanded = ref(true)
const showComponentSelector = ref(false)
const selectedComponentType = ref('CPU')
const componentSearchQuery = ref('')
const componentQuantity = ref(1)
const loadingComponents = ref(false)
const availableComponents = ref([])
const componentSearchPage = ref(1)
const componentSearchPagination = ref(null)

// Format component ID with type prefix
function formatComponentId(componentType, componentId) {
  const prefixMap = {
    'CPU': 'CPU',
    'GPU': 'GPU',
    'FPGA': 'FPGA',
    'AIProcessor': 'AI'
  };
  const prefix = prefixMap[componentType] || componentType;
  return `${prefix}-${componentId}`;
}

// Local components for creation mode (when no package_id exists)
const localComponents = ref([])

// Components from props or local (for creation mode)
const components = computed(() => {
  // If in creation mode (no packageData), use localComponents
  if (!props.packageData?.package?.package_id) {
    return localComponents.value
  }
  // Otherwise use components from props
  if (!props.packageData?.components) {
    return []
  }
  return props.packageData.components.map(comp => ({
    component_type: comp.component_type || comp.processor_type,
    component_id: comp.component_id || comp.cpu_id || comp.gpu_id || comp.fpga_id || comp.ai_processor_id,
    component_count: comp.component_count || 1,
    component_name: comp.component_name || comp.name || comp.model || comp.model_name || 'Unknown'
  }))
})

const toggleComponents = () => {
  isComponentsExpanded.value = !isComponentsExpanded.value
}

const toggleComponentSelector = () => {
  showComponentSelector.value = !showComponentSelector.value
  if (showComponentSelector.value) {
    searchComponents()
  }
}

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    componentSearchPage.value = 1
    searchComponents()
  }, 300)
}

// Search components
async function searchComponents() {
  if (typeof window === 'undefined') return
  
  loadingComponents.value = true
  try {
    const endpointMap = {
      'CPU': 'cpus',
      'GPU': 'gpus',
      'FPGA': 'fpgas',
      'AIProcessor': 'ai-processors'
    }
    const endpoint = endpointMap[selectedComponentType.value]
    if (!endpoint) return

    const query = componentSearchQuery.value.trim()
    const searchParam = query ? `&search=${encodeURIComponent(query)}` : ''
    const url = `/api/${endpoint}?page=${componentSearchPage.value}&limit=20${searchParam}`

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const items = data.data || data || []
    
    // Transform to common format
    availableComponents.value = items.map(item => {
      const id = item.cpu_id || item.gpu_id || item.fpga_id || item.ai_processor_id || item.id
      return {
        id: id,
        type: selectedComponentType.value,
        name: item.name || item.model || item.model_name || item.product_name || 'Unknown',
        model: item.model || item.model_name,
        family: item.family || item.generation,
        microarchitecture: item.microarchitecture || item.architecture,
        architecture: item.architecture
      }
    })

    componentSearchPagination.value = data.pagination || null
  } catch (error) {
    console.error('Error searching components:', error)
    availableComponents.value = []
  } finally {
    loadingComponents.value = false
  }
}

// Associate component
async function associateComponent(component) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:associateComponent',message:'associateComponent called',data:{componentId:component.id,componentType:selectedComponentType.value,quantity:componentQuantity.value,packageId:props.packageData?.package?.package_id},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  
  const packageId = props.packageData?.package?.package_id
  
  // If in creation mode (no package_id), add to local components list
  if (!packageId) {
    const newComponent = {
      component_type: selectedComponentType.value,
      component_id: component.id,
      component_count: componentQuantity.value || 1,
      component_name: component.name || component.model || component.model_name || formatComponentId(selectedComponentType.value, component.id)
    }
    localComponents.value.push(newComponent)
    successMessage.value = 'Component added to package'
    setTimeout(() => { successMessage.value = '' }, 3000)
    
    // Close component selector
    toggleComponentSelector()
    componentQuantity.value = 1
    componentSearchQuery.value = ''
    
    // Ensure components section is expanded
    isComponentsExpanded.value = true
    return
  }

  try {
    const token = getAuthToken()
    if (!token) {
      errorMessage.value = 'Authentication required. Please log in again.'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:associateComponent',message:'No auth token found',data:{packageId:packageId,isLoggedIn:isLoggedIn.value},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return
    }

    const response = await fetch(`/api/packages/${packageId}/components`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        component_type: selectedComponentType.value,
        component_id: component.id,
        component_count: componentQuantity.value || 1
      })
    })

    if (!response.ok) {
      let errorMessage = 'Failed to add component'
      try {
        const errorData = await response.json()
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:associateComponent',message:'API error response',data:{status:response.status,statusText:response.statusText,errorData:errorData},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        
        // Handle different error response formats
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        } else {
          errorMessage = `Failed to add component (HTTP ${response.status})`
        }
      } catch (jsonError) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:associateComponent',message:'Failed to parse error response',data:{status:response.status,statusText:response.statusText,jsonError:jsonError.message},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        errorMessage = `Failed to add component (HTTP ${response.status}: ${response.statusText})`
      }
      throw new Error(errorMessage)
    }

    successMessage.value = 'Component added successfully'
    setTimeout(() => { successMessage.value = '' }, 3000)
    
    // Close component selector
    toggleComponentSelector()
    componentQuantity.value = 1
    componentSearchQuery.value = ''
    
    // Ensure components section is expanded so user can see the newly added component
    isComponentsExpanded.value = true
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:associateComponent',message:'associateComponent success, emitting data-refreshed',data:{packageId:packageId,componentId:component.id},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    
    // Emit data-refreshed to reload package data
    emit('data-refreshed')
    
    // Force a re-render by waiting for next tick
    await nextTick()
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:associateComponent',message:'associateComponent after nextTick',data:{componentsLength:components.value.length,isComponentsExpanded:isComponentsExpanded.value},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  } catch (error) {
    console.error('Error associating component:', error)
    errorMessage.value = error.message || 'Failed to add component'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:associateComponent',message:'associateComponent error',data:{error:error.message,packageId:packageId},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }
}

// Remove component
async function removeComponent(component) {
  // If in creation mode, remove from local components
  if (!props.packageData?.package?.package_id) {
    const index = localComponents.value.findIndex(
      c => c.component_type === component.component_type && 
           c.component_id === component.component_id
    )
    if (index !== -1) {
      localComponents.value.splice(index, 1)
      successMessage.value = 'Component removed from package'
      setTimeout(() => { successMessage.value = '' }, 3000)
    }
    return
  }
  
  if (!props.packageData?.package?.package_id) return
  
  if (!confirm(`Remove ${formatComponentId(component.component_type, component.component_id)} from package?`)) {
    return
  }

  try {
    const packageId = props.packageData.package.package_id
    const componentId = component.component_id
    const componentType = component.component_type

    const token = getAuthToken()
    if (!token) {
      errorMessage.value = 'Authentication required. Please log in again.'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:removeComponent',message:'No auth token found',data:{packageId:packageId,isLoggedIn:isLoggedIn.value},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return
    }

    const response = await fetch(`/api/packages/${packageId}/components/${componentId}?component_type=${componentType}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      let errorMessage = 'Failed to remove component'
      try {
        const errorData = await response.json()
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:removeComponent',message:'API error response',data:{status:response.status,statusText:response.statusText,errorData:errorData},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        
        // Handle different error response formats
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        } else {
          errorMessage = `Failed to remove component (HTTP ${response.status})`
        }
      } catch (jsonError) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:removeComponent',message:'Failed to parse error response',data:{status:response.status,statusText:response.statusText,jsonError:jsonError.message},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        errorMessage = `Failed to remove component (HTTP ${response.status}: ${response.statusText})`
      }
      throw new Error(errorMessage)
    }

    successMessage.value = 'Component removed successfully'
    setTimeout(() => { successMessage.value = '' }, 3000)
    
    // Ensure components section is expanded so user can see the updated list
    isComponentsExpanded.value = true
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:removeComponent',message:'removeComponent success, emitting data-refreshed',data:{packageId:packageId,componentId:componentId},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    
    emit('data-refreshed')
    
    // Force a re-render by waiting for next tick
    await nextTick()
  } catch (error) {
    console.error('Error removing component:', error)
    errorMessage.value = error.message || 'Failed to remove component'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

// Submit data (for consistency with other forms)
// Since packages don't have editable fields, this just refreshes the data
const submitData = async () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:submitData',message:'submitData called',data:{hasPackageData:!!props.packageData,packageId:props.packageData?.package?.package_id,readOnly:props.readOnly,isLoggedIn:isLoggedIn.value},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  
  if (!props.packageData?.package?.package_id) {
    errorMessage.value = 'No package data available'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    return
  }

  try {
    // For now, packages don't have editable fields, so just refresh
    // In the future, if package_name becomes editable, update it here
    emit('data-refreshed')
    successMessage.value = 'Package data refreshed'
    setTimeout(() => { successMessage.value = '' }, 3000)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:submitData',message:'submitData completed successfully',data:{packageId:props.packageData?.package?.package_id},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  } catch (error) {
    console.error('Error submitting package data:', error)
    errorMessage.value = error.message || 'Failed to save package'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PackageForm.vue:submitData',message:'submitData error',data:{error:error.message,packageId:props.packageData?.package?.package_id},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }
}

// Create package with selected components
const createPackage = async () => {
  if (localComponents.value.length === 0) {
    errorMessage.value = 'Please add at least one component to the package'
    setTimeout(() => { errorMessage.value = '' }, 5000)
    return
  }
  
  try {
    const token = getAuthToken()
    if (!token) {
      errorMessage.value = 'Authentication required. Please log in again.'
      setTimeout(() => { errorMessage.value = '' }, 5000)
      return
    }
    
    // Prepare components for API
    const components = localComponents.value.map(comp => ({
      component_type: comp.component_type,
      component_id: comp.component_id,
      component_count: comp.component_count
    }))
    
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        package_name: null,
        components: components
      })
    })
    
    if (!response.ok) {
      let errorMsg = 'Failed to create package'
      try {
        const errorData = await response.json()
        if (typeof errorData.error === 'string') {
          errorMsg = errorData.error
        } else if (errorData.message) {
          errorMsg = errorData.message
        } else {
          errorMsg = `Failed to create package (HTTP ${response.status})`
        }
      } catch (jsonError) {
        errorMsg = `Failed to create package (HTTP ${response.status}: ${response.statusText})`
      }
      throw new Error(errorMsg)
    }
    
    const result = await response.json()
    const packageId = result.data?.package_id || result.data?.package?.package_id || result.package_id
    
    if (!packageId) {
      throw new Error('Package created but no package_id returned')
    }
    
    successMessage.value = 'Package created successfully'
    setTimeout(() => { successMessage.value = '' }, 3000)
    
    // Emit package-created event with the new package_id
    emit('package-created', packageId)
  } catch (error) {
    console.error('Error creating package:', error)
    errorMessage.value = error.message || 'Failed to create package'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  }
}

// Expose submitData and createPackage methods to parent
defineExpose({
  submitData,
  createPackage
})

onMounted(() => {
  isLoggedIn.value = isLogged()
})

// Watch for component type changes
watch(selectedComponentType, () => {
  componentSearchPage.value = 1
  searchComponents()
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
