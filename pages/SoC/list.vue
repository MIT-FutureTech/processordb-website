<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">
        SOCs
      </h1>
      <NuxtLink
        to="/soc/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2">Add SoC</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
      </NuxtLink>
    </div>

    <div class="my-8">
      <InteractiveGraph :data="filterData" />
    </div>

    <!-- Table Container -->
    <div class="mt-8 bg-white mb-16">
      <div class="overflow-x-auto">
        <PrivateTable
          :data="filterData"
          class-name="soc"
        />
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="js">
import { ref, computed } from 'vue'

const manufacturerNameFilter = ref('')
const processorTypeFilter = ref('')
const familyFilter = ref('')
const codeNameFilter = ref('')
const microarchitectureFilter = ref('')

const { data } = await useFetch(`${useRuntimeConfig().public.backendUrl}/socs`, {
  key: 'socs',
  cache: true,
  transform: (response) => {
    if (!response?.data) return [];

    return response.data.map(soc => ({
      ...soc,
      manufacturer: soc.manufacturer?.name || soc.manufacturer,
      code_name: soc.code_name || (soc.processors && soc.processors[0]?.code_name)
    }));
  },
  server: true,
  lazy: false
})

const filterData = computed(() => {
  return data.value.filter(item => {
    const matchesManufacturer =
      !manufacturerNameFilter.value ||
      slugify(item.manufacturer_name) === manufacturerNameFilter.value

    const matchesProcessorType =
      !processorTypeFilter.value ||
      item.processors?.some(proc =>
        proc.processor_type &&
        slugify(proc.processor_type) === processorTypeFilter.value
      )

    const matchesFamily =
      !familyFilter.value ||
      item.processors?.some(proc =>
        proc.family &&
        slugify(proc.family) === familyFilter.value
      )

    const matchesCodeName =
      !codeNameFilter.value ||
      item.processors?.some(proc =>
        proc.code_name &&
        slugify(proc.code_name) === codeNameFilter.value
      )

    const matchesMicroarchitecture =
      !microarchitectureFilter.value ||
      item.processors?.some(proc =>
        proc.microarchitecture &&
        slugify(proc.microarchitecture) === microarchitectureFilter.value
      )

    return (
      matchesManufacturer &&
      matchesProcessorType &&
      matchesFamily &&
      matchesCodeName &&
      matchesMicroarchitecture
    )
  })
})
</script>
