<template>
  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4">
    <!-- Success & Error Messages -->
    <div v-if="successMessage" class="mb-4 p-2 bg-green-200 text-green-800 rounded">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mb-4 p-2 bg-red-200 text-red-800 rounded">
      {{ errorMessage }}
    </div>

    <!-- General Information (always visible) -->
    <h3 class="text-xl font-medium mt-6">General Information</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Manufacturer</label>
        <input v-model="form.manufacturer" :disabled="readOnly" type="text"
          class="mt-1 block w-full h-10 border-0 border-b border-gray-200 focus:ring-0 bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">SoC Name</label>
        <input v-model="form.socName" :disabled="readOnly" type="text"
          class="mt-1 block w-full h-10 border-0 border-b border-gray-200 focus:ring-0 bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Release Date</label>
        <input v-model="form.releaseDate" :disabled="readOnly" type="date"
          class="mt-1 block w-full h-10 border-0 border-b border-gray-200 focus:ring-0 bg-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Process Node</label>
        <div class="input-container">
          <input v-model="form.processNode" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-0 border-b border-gray-200 focus:ring-0 bg-transparent" />
          <span class="unit-label">nm</span>
        </div>
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Logic Resources -->
    <div class="flex items-center justify-between mt-8">
      <h3 class="text-lg font-medium">Logic Resources</h3>
      <button @click="toggleLogicResources" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
        <v-icon name="bi-chevron-compact-up" :style="{
          transform: isLogicResourcesExpanded ? '' : 'rotate(180deg)',
          transition: 'transform 0.2s'
        }" />
      </button>
    </div>
    <Transition name="collapse">
      <div v-if="isLogicResourcesExpanded" class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Generation</label>
          <input v-model="form.generation" :disabled="readOnly" type="text"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Family/Subfamily</label>
          <input v-model="form.familySubfamily" :disabled="readOnly" type="text"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Model</label>
          <input v-model="form.model" :disabled="readOnly" type="text"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">CLBs</label>
          <input v-model="form.clbs" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Slices per CLB</label>
          <input v-model="form.slicePerClb" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Slices</label>
          <input v-model="form.slices" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">LUTs per CLB</label>
          <input v-model="form.lutPerClb" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Total LUTs</label>
          <input v-model="form.luts" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Flip-Flops per CLB</label>
          <input v-model="form.ffPerClb" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Total FFs</label>
          <input v-model="form.ffs" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
      </div>
    </Transition>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Memory & DSP -->
    <div class="flex items-center justify-between mt-8">
      <h3 class="text-lg font-medium">Memory & DSP</h3>
      <button @click="toggleMemoryDsp" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
        <v-icon name="bi-chevron-compact-up" :style="{
          transform: isMemoryDspExpanded ? '' : 'rotate(180deg)',
          transition: 'transform 0.2s'
        }" />
      </button>
    </div>
    <Transition name="collapse">
      <div v-if="isMemoryDspExpanded" class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Distributed RAM</label>
          <input v-model="form.distributedRam" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Block RAMs</label>
          <input v-model="form.blockRams" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">uRAMs</label>
          <input v-model="form.urams" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">DSP Multipliers</label>
          <input v-model="form.multiplierDspBlocks" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">AI Engines</label>
          <input v-model="form.aiEngines" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
      </div>
    </Transition>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- I/O & Interconnect -->
    <div class="flex items-center justify-between mt-8">
      <h3 class="text-lg font-medium">I/O & Interconnect</h3>
      <button @click="toggleIo" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
        <v-icon name="bi-chevron-compact-up" :style="{
          transform: isIoExpanded ? '' : 'rotate(180deg)',
          transition: 'transform 0.2s'
        }" />
      </button>
    </div>
    <Transition name="collapse">
      <div v-if="isIoExpanded" class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">NoC Ports</label>
          <input v-model="form.nocMasterSlavePorts" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">I/O Banks</label>
          <input v-model="form.ioBanks" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Max User I/Os</label>
          <input v-model="form.userIoMax" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Max Differential Pairs</label>
          <input v-model="form.userIoDifferentialPairsMax" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
      </div>
    </Transition>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- Clock Resources -->
    <div class="flex items-center justify-between mt-8">
      <h3 class="text-lg font-medium">Clock Resources</h3>
      <button @click="toggleClockResources" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
        <v-icon name="bi-chevron-compact-up" :style="{
          transform: isClockResourcesExpanded ? '' : 'rotate(180deg)',
          transition: 'transform 0.2s'
        }" />
      </button>
    </div>
    <Transition name="collapse">
      <div v-if="isClockResourcesExpanded" class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Global Clock Buffers</label>
          <input v-model="form.globalClockBuffers" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Clock Regions</label>
          <input v-model="form.clockRegions" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Buffers per Region</label>
          <input v-model="form.clockBuffersPerRegion" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Regional Clock Buffers</label>
          <input v-model="form.regionalClockBuffers" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
      </div>
    </Transition>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <!-- External Interfaces -->
    <div class="flex items-center justify-between mt-8">
      <h3 class="text-lg font-medium">External Interfaces</h3>
      <button @click="toggleExternalInterfaces" class="p-1 hover:bg-[#F5E9EB] rounded-full" type="button">
        <v-icon name="bi-chevron-compact-up" :style="{
          transform: isExternalInterfacesExpanded ? '' : 'rotate(180deg)',
          transition: 'transform 0.2s'
        }" />
      </button>
    </div>
    <Transition name="collapse">
      <div v-if="isExternalInterfacesExpanded" class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Max MGTs</label>
          <input v-model="form.multiGigabitTransceiversMax" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Processing System</label>
          <input v-model="form.processingSystem" :disabled="readOnly" type="text"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ethernet MACs</label>
          <input v-model="form.ethernetMacs" :disabled="readOnly" type="number"
            class="mt-1 block w-full h-10 border-b border-gray-200 focus:ring-0 bg-transparent" />
        </div>
      </div>
    </Transition>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />
  </div>
</template>

<script setup lang="js">
import { ref, watch } from 'vue'
import { useRuntimeConfig } from '#imports'

const props = defineProps({
  fpgaData: { type: Object, required: true },
  editMode: { type: Boolean, default: false },
  readOnly: { type: Boolean, default: false }
})

const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  manufacturer: '',
  socName: '',
  releaseDate: '',
  processNode: '',
  generation: '',
  familySubfamily: '',
  model: '',
  clbs: '',
  slicePerClb: '',
  slices: '',
  lutPerSlice: '',
  lutPerClb: '',
  luts: '',
  lutInputs: '',
  ffPerSlice: '',
  ffPerClb: '',
  ffs: '',
  distributedRam: '',
  distributedRamNotes: '',
  blockRams: '',
  urams: '',
  multiplierDspBlocks: '',
  multiplierDspBlockType: '',
  aiEngines: '',
  nocMasterSlavePorts: '',
  nocMasterSlavePortNotes: '',
  ioBanks: '',
  userIoMax: '',
  userIoDifferentialPairsMax: '',
  triStateBuses: '',
  triStateBuffersPerBus: '',
  globalClockBuffers: '',
  clockRegions: '',
  clockBuffersPerRegion: '',
  regionalClockBuffers: '',
  multiGigabitTransceiversMax: '',
  processingSystem: '',
  ethernetMacs: '',
  vendor: '',
  createdAt: '',
  updatedAt: ''
})

watch(
  () => props.fpgaData,
  (data) => {
    if (!data || !data.fpga || !data.fpga.fpga_id) return

    const fpga = data.fpga;
    form.value = {
      manufacturer: data.manufacturerName || fpga.vendor || '',
      socName: fpga.SoC?.name || '',
      releaseDate: fpga.SoC?.release_date?.split('T')[0] || '',
      processNode: fpga.SoC?.process_node || '',
      generation: fpga.generation || '',
      familySubfamily: fpga.family_subfamily || '',
      model: fpga.model || '',
      clbs: fpga.clbs || '',
      slicePerClb: fpga.slice_per_clb || '',
      slices: fpga.slices || '',
      lutPerSlice: fpga.lut_per_slice || '',
      lutPerClb: fpga.lut_per_clb || '',
      luts: fpga.luts || '',
      lutInputs: fpga.lut_inputs || '',
      ffPerSlice: fpga.ff_per_slice || '',
      ffPerClb: fpga.ff_per_clb || '',
      ffs: fpga.ffs || '',
      distributedRam: fpga.distributed_ram || '',
      distributedRamNotes: fpga.distributed_ram_notes || '',
      blockRams: fpga.block_rams || '',
      urams: fpga.urams || '',
      multiplierDspBlocks: fpga.multiplier_dsp_blocks || '',
      multiplierDspBlockType: fpga.multiplier_dsp_block_type || '',
      aiEngines: fpga.ai_engines || '',
      nocMasterSlavePorts: fpga.noc_master_slave_ports || '',
      nocMasterSlavePortNotes: fpga.noc_master_slave_port_notes || '',
      ioBanks: fpga.io_banks || '',
      userIoMax: fpga.user_io_max || '',
      userIoDifferentialPairsMax:
        fpga.user_io_differential_pairs_max || '',
      triStateBuses: fpga.tri_state_buses || '',
      triStateBuffersPerBus: fpga.tri_state_buffers_per_bus || '',
      globalClockBuffers: fpga.global_clock_buffers || '',
      clockRegions: fpga.clock_regions || '',
      clockBuffersPerRegion: fpga.clock_buffers_per_region || '',
      regionalClockBuffers: fpga.regional_clock_buffers || '',
      multiGigabitTransceiversMax:
        fpga.multi_gigabit_transceivers_max || '',
      processingSystem: fpga.processing_system || '',
      ethernetMacs: fpga.ethernet_macs || '',
      vendor: fpga.vendor || '',
      createdAt: new Date(fpga.createdAt).toLocaleString(),
      updatedAt: new Date(fpga.updatedAt).toLocaleString()
    }
  },
  { immediate: true }
)

const preparePostRequestBody = () => ({
  soc: {
    soc_id: props.fpgaData.SoC?.soc_id || null,
    name: form.value.socName,
    release_date: form.value.releaseDate || null,
      process_node: form.value.processNode ? parseFloat(form.value.processNode) : null
  },
  manufacturer: {
    name: form.value.manufacturer?.replace(/[<>"'&]/g, (match) => {
      const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return escapeMap[match];
    })
  },
  fpga: {
    fpga_id: props.fpgaData.fpga_id || null,
    generation: form.value.generation?.replace(/[<>"'&]/g, (match) => {
      const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return escapeMap[match];
    }),
    family_subfamily: form.value.familySubfamily?.replace(/[<>"'&]/g, (match) => {
      const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return escapeMap[match];
    }),
    model: form.value.model?.replace(/[<>"'&]/g, (match) => {
      const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return escapeMap[match];
    }),
    clbs: form.value.clbs ? parseInt(form.value.clbs) : null,
    slice_per_clb: form.value.slicePerClb ? parseInt(form.value.slicePerClb) : null,
    slices: form.value.slices ? parseInt(form.value.slices) : null,
    lut_per_slice: form.value.lutPerSlice ? parseInt(form.value.lutPerSlice) : null,
    lut_per_clb: form.value.lutPerClb ? parseInt(form.value.lutPerClb) : null,
    luts: form.value.luts ? parseInt(form.value.luts) : null,
    lut_inputs: form.value.lutInputs,
    ff_per_slice: form.value.ffPerSlice ? parseInt(form.value.ffPerSlice) : null,
    ff_per_clb: form.value.ffPerClb ? parseInt(form.value.ffPerClb) : null,
    ffs: form.value.ffs ? parseInt(form.value.ffs) : null,
    distributed_ram: form.value.distributedRam ? parseInt(form.value.distributedRam) : null,
    distributed_ram_notes: form.value.distributedRamNotes,
    block_rams: form.value.blockRams ? parseInt(form.value.blockRams) : null,
    urams: form.value.urams ? parseInt(form.value.urams) : null,
    multiplier_dsp_blocks: form.value.multiplierDspBlocks ? parseInt(form.value.multiplierDspBlocks) : null,
    multiplier_dsp_block_type: form.value.multiplierDspBlockType,
    ai_engines: form.value.aiEngines ? parseInt(form.value.aiEngines) : null,
    noc_master_slave_ports: form.value.nocMasterSlavePorts,
    noc_master_slave_port_notes: form.value.nocMasterSlavePortNotes,
    io_banks: form.value.ioBanks,
    user_io_max: form.value.userIoMax ? parseInt(form.value.userIoMax) : null,
    user_io_differential_pairs_max: form.value.userIoDifferentialPairsMax ? parseInt(form.value.userIoDifferentialPairsMax) : null,
    tri_state_buses: form.value.triStateBuses ? parseInt(form.value.triStateBuses) : null,
    tri_state_buffers_per_bus: form.value.triStateBuffersPerBus ? parseInt(form.value.triStateBuffersPerBus) : null,
    global_clock_buffers: form.value.globalClockBuffers ? parseInt(form.value.globalClockBuffers) : null,
    clock_regions: form.value.clockRegions ? parseInt(form.value.clockRegions) : null,
    clock_buffers_per_region: form.value.clockBuffersPerRegion ? parseInt(form.value.clockBuffersPerRegion) : null,
    regional_clock_buffers: form.value.regionalClockBuffers ? parseInt(form.value.regionalClockBuffers) : null,
    multi_gigabit_transceivers_max: form.value.multiGigabitTransceiversMax ? parseInt(form.value.multiGigabitTransceiversMax) : null,
    processing_system: form.value.processingSystem,
    ethernet_macs: form.value.ethernetMacs,
    vendor: form.value.vendor
  }
})

const submitData = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  // Basic validation
  if (!form.value.manufacturer || !form.value.generation || !form.value.model) {
    errorMessage.value = 'Please fill in all required fields (Manufacturer, Generation, Model)'
    return
  }

  try {
    const url = props.editMode
      ? `${useRuntimeConfig().public.backendUrl}/fpgas/${props.fpgaData.fpga_id}`
      : `${useRuntimeConfig().public.backendUrl}/fpgas`

    const res = await fetch(url, {
      method: props.editMode ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preparePostRequestBody())
    })

    let data
    try {
      data = await res.json()
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError)
      errorMessage.value = 'Invalid response from server. Please try again.'
      return
    }
    
    if (res.ok) {
      successMessage.value = 'FPGA saved successfully!'
      // Handle both wrapped and direct response formats
      const responseData = data.data || data
      const fpgaId = responseData.fpga?.fpga_id || responseData.fpga_id
      setTimeout(() => window.location.href = `/fpga/${fpgaId}`, 2000)
    } else {
      errorMessage.value = data.error || 'Submission error.'
    }
  } catch (err) {
    errorMessage.value = err.message || 'Unexpected error.'
  }
}

// ---- collapse toggles ----
const isLogicResourcesExpanded = ref(true)
const isMemoryDspExpanded = ref(true)
const isIoExpanded = ref(true)
const isClockResourcesExpanded = ref(true)
const isExternalInterfacesExpanded = ref(true)
// const isVendorExpanded = ref(true)

const toggleLogicResources = () => (isLogicResourcesExpanded.value = !isLogicResourcesExpanded.value)
const toggleMemoryDsp = () => (isMemoryDspExpanded.value = !isMemoryDspExpanded.value)
const toggleIo = () => (isIoExpanded.value = !isIoExpanded.value)
const toggleClockResources = () => (isClockResourcesExpanded.value = !isClockResourcesExpanded.value)
const toggleExternalInterfaces = () => (isExternalInterfacesExpanded.value = !isExternalInterfacesExpanded.value)
// const toggleVendor = () => (isVendorExpanded.value = !isVendorExpanded.value)

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

/* Collapse transition */
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
