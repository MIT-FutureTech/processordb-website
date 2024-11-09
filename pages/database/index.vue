<template>
  <div class="text-gray-800">
    <Navbar/>

    <div class="max-w-[1400px] px-4 mx-auto">
      <div class="mt-16">
        <h1 class="text-4xl font-bold">All processors</h1>
      </div>
      <div class="my-16">
        <InteractiveGraph :data="filterData" />
      </div>
      <div class="mb-16">
        <DataTable :data="filterData" />
      </div>
    </div>
   <Footer />
  </div>
</template>

<script setup>

const { data } = await useFetch('http://localhost:3001/api/socs', {
  key: 'socs',
  cache: true
})
// Define your filter values as ref variables
const manufacturerNameFilter = ref('')
const processorTypeFilter = ref('')
const familyFilter = ref('')
const codeNameFilter = ref('')
const microarchitectureFilter = ref('')
const modelFilter = ref('')

const filterData = computed(() => {
  return data.value.data.filter(item => {
    // Check for manufacturer name filter
    const matchesManufacturer = !manufacturerNameFilter.value || item.manufacturer_name.includes(manufacturerNameFilter.value)
    
    // Check for processor type filter
    const matchesProcessorType = !processorTypeFilter.value || item.processors.some(proc => proc.processor_type.includes(processorTypeFilter.value))
    
    // Check for processor family filter
    const matchesFamily = !familyFilter.value || item.processors.some(proc => proc.family.includes(familyFilter.value))
    
    // Check for code name filter
    const matchesCodeName = !codeNameFilter.value || item.processors.some(proc => proc.code_name && proc.code_name.includes(codeNameFilter.value))
    
    // Check for microarchitecture filter
    const matchesMicroarchitecture = !microarchitectureFilter.value || item.processors.some(proc => proc.microarchitecture.includes(microarchitectureFilter.value))
    
    // Check for model filter
    const matchesModel = !modelFilter.value || item.processors.some(proc => proc.model.includes(modelFilter.value))
    
    // Return true if all filters match
    return matchesManufacturer && matchesProcessorType && matchesFamily && matchesCodeName && matchesMicroarchitecture && matchesModel
  })
})
</script>
