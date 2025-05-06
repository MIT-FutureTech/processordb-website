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
    if (!data || !data.fpga_id) return

    form.value = {
      manufacturer: data.vendor || '',
      socName: data.SoC?.name || '',
      releaseDate: data.SoC?.release_date?.split('T')[0] || '',
      processNode: data.SoC?.process_node || '',
      generation: data.generation || '',
      familySubfamily: data.family_subfamily || '',
      model: data.model || '',
      clbs: data.clbs || '',
      slicePerClb: data.slice_per_clb || '',
      slices: data.slices || '',
      lutPerSlice: data.lut_per_slice || '',
      lutPerClb: data.lut_per_clb || '',
      luts: data.luts || '',
      lutInputs: data.lut_inputs || '',
      ffPerSlice: data.ff_per_slice || '',
      ffPerClb: data.ff_per_clb || '',
      ffs: data.ffs || '',
      distributedRam: data.distributed_ram || '',
      distributedRamNotes: data.distributed_ram_notes || '',
      blockRams: data.block_rams || '',
      urams: data.urams || '',
      multiplierDspBlocks: data.multiplier_dsp_blocks || '',
      multiplierDspBlockType: data.multiplier_dsp_block_type || '',
      aiEngines: data.ai_engines || '',
      nocMasterSlavePorts: data.noc_master_slave_ports || '',
      nocMasterSlavePortNotes: data.noc_master_slave_port_notes || '',
      ioBanks: data.io_banks || '',
      userIoMax: data.user_io_max || '',
      userIoDifferentialPairsMax:
        data.user_io_differential_pairs_max || '',
      triStateBuses: data.tri_state_buses || '',
      triStateBuffersPerBus: data.tri_state_buffers_per_bus || '',
      globalClockBuffers: data.global_clock_buffers || '',
      clockRegions: data.clock_regions || '',
      clockBuffersPerRegion: data.clock_buffers_per_region || '',
      regionalClockBuffers: data.regional_clock_buffers || '',
      multiGigabitTransceiversMax:
        data.multi_gigabit_transceivers_max || '',
      processingSystem: data.processing_system || '',
      ethernetMacs: data.ethernet_macs || '',
      vendor: data.vendor || '',
      createdAt: new Date(data.createdAt).toLocaleString(),
      updatedAt: new Date(data.updatedAt).toLocaleString()
    }
  },
  { immediate: true }
)

const preparePostRequestBody = () => ({
  soc: {
    soc_id: props.fpgaData.SoC?.soc_id || null,
    name: form.value.socName,
    release_date: form.value.releaseDate || null,
    process_node: form.value.processNode
  },
  manufacturer: {
    name: form.value.manufacturer
  },
  fpga: {
    fpga_id: props.fpgaData.fpga_id || null,
    generation: form.value.generation,
    family_subfamily: form.value.familySubfamily,
    model: form.value.model,
    clbs: form.value.clbs,
    slice_per_clb: form.value.slicePerClb,
    slices: form.value.slices,
    lut_per_slice: form.value.lutPerSlice,
    lut_per_clb: form.value.lutPerClb,
    luts: form.value.luts,
    lut_inputs: form.value.lutInputs,
    ff_per_slice: form.value.ffPerSlice,
    ff_per_clb: form.value.ffPerClb,
    ffs: form.value.ffs,
    distributed_ram: form.value.distributedRam,
    distributed_ram_notes: form.value.distributedRamNotes,
    block_rams: form.value.blockRams,
    urams: form.value.urams,
    multiplier_dsp_blocks: form.value.multiplierDspBlocks,
    multiplier_dsp_block_type: form.value.multiplierDspBlockType,
    ai_engines: form.value.aiEngines,
    noc_master_slave_ports: form.value.nocMasterSlavePorts,
    noc_master_slave_port_notes: form.value.nocMasterSlavePortNotes,
    io_banks: form.value.ioBanks,
    user_io_max: form.value.userIoMax,
    user_io_differential_pairs_max: form.value.userIoDifferentialPairsMax,
    tri_state_buses: form.value.triStateBuses,
    tri_state_buffers_per_bus: form.value.triStateBuffersPerBus,
    global_clock_buffers: form.value.globalClockBuffers,
    clock_regions: form.value.clockRegions,
    clock_buffers_per_region: form.value.clockBuffersPerRegion,
    regional_clock_buffers: form.value.regionalClockBuffers,
    multi_gigabit_transceivers_max: form.value.multiGigabitTransceiversMax,
    processing_system: form.value.processingSystem,
    ethernet_macs: form.value.ethernetMacs,
    vendor: form.value.vendor
  }
})

const submitData = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const url = props.editMode
      ? `${useRuntimeConfig().public.backendUrl}/fpgas/${props.fpgaData.fpga_id}`
      : `${useRuntimeConfig().public.backendUrl}/fpgas`

    const res = await fetch(url, {
      method: props.editMode ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preparePostRequestBody())
    })

    const data = await res.json()
    if (res.ok) {
      successMessage.value = 'FPGA saved successfully!'
      setTimeout(() => window.location.href = `/fpga/${data.fpga.fpga_id}`, 2000)
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
const isVendorExpanded = ref(true)

const toggleLogicResources = () => (isLogicResourcesExpanded.value = !isLogicResourcesExpanded.value)
const toggleMemoryDsp = () => (isMemoryDspExpanded.value = !isMemoryDspExpanded.value)
const toggleIo = () => (isIoExpanded.value = !isIoExpanded.value)
const toggleClockResources = () => (isClockResourcesExpanded.value = !isClockResourcesExpanded.value)
const toggleExternalInterfaces = () => (isExternalInterfacesExpanded.value = !isExternalInterfacesExpanded.value)
const toggleVendor = () => (isVendorExpanded.value = !isVendorExpanded.value)

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
