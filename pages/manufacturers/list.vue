<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">Manufacturers</h1>
      <NuxtLink to=""
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
        <span class="mr-2">Add Manufacturer</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Table -->
    <div class="mt-32 bg-white mb-16">
      <div class="overflow-x-auto">
        <ManufacturersTable :manufacturer-counts="manufacturerCounts" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { data } = await useFetch('/api/socs', {
  key: 'socs',
  cache: true,
  transform: (response) => {
    if (!response?.data) return { socs: [], manufacturerCounts: {} };

    const socs = response.data.map(soc => ({
      ...soc,
      manufacturer: soc.manufacturer?.name || soc.manufacturer,
      code_name: soc.code_name || (soc.processors && soc.processors[0]?.code_name)
    }));

    const manufacturerCounts = socs.reduce((counts, soc) => {
      const manufacturer = soc.manufacturer_name || 'Unknown';
      const processorType = soc.processors && soc.processors[0]?.processor_type
        ? soc.processors[0].processor_type.toLowerCase()
        : 'unknown';

      // Initialize manufacturer if not exists
      if (!counts[manufacturer]) {
        counts[manufacturer] = {
          cpu: 0,
          gpu: 0,
          fpga: 0,
          unknown: 0
        };
      }

      // Increment the specific processor type count
      counts[manufacturer][processorType] =
        (counts[manufacturer][processorType] || 0) + 1;

      return counts;
    }, {});

    // Sort manufacturers by total count
    const sortedManufacturerCounts = Object.fromEntries(
      Object.entries(manufacturerCounts).sort(([, a], [, b]) =>
        Object.values(b).reduce((sum, count) => sum + count, 0) -
        Object.values(a).reduce((sum, count) => sum + count, 0)
      )
    );

    return { socs, manufacturerCounts: sortedManufacturerCounts };
  },
  server: true,
  lazy: false
})

// Ensure manufacturerCounts is always an object
const manufacturerCounts = computed(() => data.value?.manufacturerCounts || {})
</script>