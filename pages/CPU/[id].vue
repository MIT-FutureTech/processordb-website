<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <div class="flex items-center gap-4 mb-4 sm:mb-0">
        <h1 class="text-4xl font-bold text-[#A32035]">
          CPU
        </h1>
        <NuxtLink to="/cpu/list" @click="handleBackClick">
          <v-icon
            name="co-arrow-circle-left"
            class="text-gray-300 opacity-80 w-12 h-12 hover:text-[#8A1B2D] hover:opacity-78"
          />
        </NuxtLink>
      </div>

      <button
        @click="submitForm"
        v-show="isLoggedIn"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center"
      >
        <span class="mr-2"> Save </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- CpuForm Component -->
    <div class="mt-8 -ml-4 mb-16">
      <!-- Pass the CPU data from the query into the form -->
      <CpuForm
        v-if="cpuData"
        :cpu-data="cpuData"
        :edit-mode="true"
        ref="cpuFormRef"
        :read-only="!isLoggedIn"
      />
      <div v-else class="flex items-center justify-center h-64">
        <div class="text-gray-500">Loading CPU data...</div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="js">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRuntimeConfig, useFetch, createError } from '#imports';
import { useQuery } from '@tanstack/vue-query';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import CpuForm from '@/components/Forms/CpuForm.vue';

import { isLogged } from '../lib/isLogged';

const isLoggedIn = ref(false);
const cpuFormRef = ref(null);
const route = useRoute();

onMounted(() => {
  isLoggedIn.value = isLogged();
});

// Add safety check for route params
const cpuId = route.params.id;
if (!cpuId) {
  console.error('CPU ID is missing from route params');
  throw createError({ statusCode: 404, statusMessage: 'CPU ID not found' });
}

const { data: rawCpuData } = await useFetch(`${useRuntimeConfig().public.backendUrl}/cpus/${cpuId}`);

// Transform the data to match what the form expects
const cpuData = computed(() => {
  if (!rawCpuData.value) return null;
  
  return {
    cpu: rawCpuData.value.cpu,
    versionHistory: rawCpuData.value.versionHistory || [],
    manufacturerName: rawCpuData.value.manufacturerName
  };
});

const handleBackClick = () => {
  console.log('Back button clicked - navigating to /cpu/list');
};

const submitForm = () => {
  console.log('Submit form clicked');
  console.log('CPU Form Ref:', cpuFormRef.value);
  console.log('CPU Data:', cpuData.value);
  
  if (cpuFormRef.value) {
    console.log('Calling submitData method');
    cpuFormRef.value.submitData();
  } else {
    console.error('CPU Form Ref is null - form not loaded yet');
  }
};
</script>
