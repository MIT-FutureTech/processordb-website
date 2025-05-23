<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start items-start">
    <div class="mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4">Manufacturers</h1>
      <div class="max-w-prose text-justify font-semibold mb-8">
        Text
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4">

    <!-- Table -->
    <div class="mt-8 bg-white mb-16">
      <div class="overflow-x-auto">
        <ManufacturersTable :manufacturer-counts="manufacturerCounts" />
      </div>
    </div>
  </div>
</template>


<script setup lang="js">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const { data } = useQuery({
  queryKey: ['socs'],
  queryFn: async () => {
    const res = await fetch(`${useRuntimeConfig().public.backendUrl}/socs`)

    if (!res.ok) {
      throw new Error('Error fetching SOCs')
    }

    const response = await res.json()
    if (!response?.data) return { socs: [], manufacturerCounts: {} }

    const socs = response.data.map(soc => ({
      ...soc,
      manufacturer: soc.manufacturer?.name || soc.manufacturer,
      code_name: soc.code_name || (soc.processors && soc.processors[0]?.code_name)
    }))

    const manufacturerCounts = socs.reduce((counts, soc) => {
      // Use soc.manufacturer_name if available; otherwise default to 'Unknown'
      const manufacturer = soc.manufacturer_name || 'Unknown'

      const processorType =
        soc.processors && soc.processors[0]?.processor_type
          ? soc.processors[0].processor_type.toLowerCase()
          : 'unknown'

      // Initialize if not present
      if (!counts[manufacturer]) {
        counts[manufacturer] = {
          cpu: 0,
          gpu: 0,
          fpga: 0,
          unknown: 0
        }
      }

      // Increment the count for the processor type
      counts[manufacturer][processorType] =
        (counts[manufacturer][processorType] || 0) + 1

      return counts
    }, {})

    // Sort manufacturers by total count
    const sortedManufacturerCounts = Object.fromEntries(
      Object.entries(manufacturerCounts).sort(([, a], [, b]) =>
        Object.values(b).reduce((sum, count) => sum + count, 0) -
        Object.values(a).reduce((sum, count) => sum + count, 0)
      )
    )

    return { socs, manufacturerCounts: sortedManufacturerCounts }
  },
  staleTime: 300000 // Cache data for 5 minutes
})

// Ensure manufacturerCounts is always an object
const manufacturerCounts = computed(() => data.value?.manufacturerCounts || {})
</script>
