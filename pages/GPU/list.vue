<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">GPUs</h1>
      <NuxtLink
        v-if="isLoggedIn"
        to="/gpu/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2">Add GPU</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
      </NuxtLink>
    </div>

    <!-- Graph Component -->
    <div class="my-8">
      <InteractiveGraph :data="graphData" />
    </div>

    <!-- Table Container -->
    <div class="mt-8 mb-16">
      <div class="overflow-x-auto">
        <PrivateTable :data="tableData" className="gpu" />
      </div>
    </div>
  </div>
  
  <Footer />
</template>

<script setup lang="js">
import { ref, computed, onMounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { isLogged } from '../lib/isLogged';

const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = isLogged();
});

// -------------------------
// Fetch data for the Table via Vue Query
// -------------------------
const { data: gpusData } = useQuery({
  queryKey: ['gpus'],
  queryFn: async () => {
    const res = await fetch('/api/gpus');
    if (!res.ok) {
      throw new Error('Error fetching GPUs');
    }
    return res.json();
  },
  staleTime: 300000, // Cache for 5 minutes (300,000 ms)
});

// Computed property to ensure we always return an array
const tableData = computed(() => gpusData.value || []);

// -------------------------
// Fetch and Transform data for the Graph via Vue Query
// -------------------------
const { data: socData } = useQuery({
  queryKey: ['socs'],
  queryFn: async () => {
    const res = await fetch('/api/socs');
    if (!res.ok) {
      throw new Error('Error fetching SOCs');
    }
    const response = await res.json();
    if (!response?.data) return [];
    return response.data
      .filter(soc => soc.processors?.some(proc => proc.processor_type === "GPU"))
      .map(soc => ({
        ...soc,
        manufacturer: soc.manufacturer?.name || soc.manufacturer,
        code_name: soc.code_name || (soc.processors && soc.processors[0]?.code_name)
      }));
  },
  staleTime: 300000, // Cache for 5 minutes
});

// -------------------------
// UI Filter State for the Graph Data (if needed)
// -------------------------
const manufacturerNameFilter = ref('');
const processorTypeFilter = ref('');
const familyFilter = ref('');
const codeNameFilter = ref('');
const microarchitectureFilter = ref('');

// -------------------------
// Compute Graph Data using the transformed socData
// -------------------------
const graphData = computed(() => {
  if (!socData.value) return [];
  return socData.value.filter(item => {
    const matchesManufacturer =
      !manufacturerNameFilter.value ||
      (item.manufacturer && slugify(item.manufacturer) === manufacturerNameFilter.value);
    const matchesProcessorType =
      !processorTypeFilter.value ||
      slugify("gpu") === processorTypeFilter.value;
    const matchesFamily =
      !familyFilter.value ||
      (item.family && slugify(item.family) === familyFilter.value);
    const matchesCodeName =
      !codeNameFilter.value ||
      (item.code_name && slugify(item.code_name) === codeNameFilter.value);
    const matchesMicroarchitecture =
      !microarchitectureFilter.value ||
      (item.microarchitecture && slugify(item.microarchitecture) === microarchitectureFilter.value);
    
    return (
      matchesManufacturer &&
      matchesProcessorType &&
      matchesFamily &&
      matchesCodeName &&
      matchesMicroarchitecture
    );
  });
});
</script>
