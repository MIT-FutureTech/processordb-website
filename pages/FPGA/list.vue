<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <h1 class="text-4xl font-bold text-[#A32035] mb-4 sm:mb-0">FPGAs</h1>
      <NuxtLink v-if="isLoggedIn" to="/fpga/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
        <span class="mr-2">Add FPGA</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Graph Component -->
    <div class="my-8">
      <FPGAsGraphClient :data="tableData" />
    </div>

    <!-- Table Container -->
    <div class="mt-8 mb-16">
      <div class="overflow-x-auto">
        <PrivateTable :data="tableData" className="fpgas" />
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="js">
import { isLogged } from '../lib/isLogged';
import { ref, computed, onMounted } from 'vue';
import FPGAsGraphClient from '~/components/Graphs/FPGAsGraph.client.vue';

// Data refs
const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = isLogged();
});

const { data: fpgasData } = await useFetch(`${useRuntimeConfig().public.backendUrl}/fpgas`);
const tableData = computed(() => fpgasData.value || []);

</script>