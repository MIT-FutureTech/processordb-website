<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <div class="flex items-center gap-4 mb-4 sm:mb-0">
        <h1 class="text-4xl font-bold text-[#A32035]">
          {{ socId && socId !== 'null' ? 'Edit SoC' : 'Create SoC' }}
        </h1>
        <NuxtLink to="/soc/list" @click="handleBackClick">
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

    <!-- Error State -->
    <div v-if="error" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="text-red-800">{{ error.statusMessage || 'Failed to load SoC data' }}</span>
        </div>
        <button @click="window.location.reload()" class="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
          Retry
        </button>
      </div>
    </div>

    <!-- SocForm Component -->
    <div class="mt-8 -ml-4 mb-16">
      <!-- Loading State -->
      <div v-if="pending && socId && socId !== 'null'" class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
          <div class="text-gray-500">Loading SoC data...</div>
        </div>
      </div>
      
      <!-- SoC Form -->
      <SocForm
        v-else
        :soc-data="socData"
        :edit-mode="!!(socId && socId !== 'null')"
        ref="socFormRef"
        :read-only="!isLoggedIn"
        @data-refreshed="handleDataRefreshed"
      />
    </div>
  </div>

  <Footer />
</template>

<script setup lang="js">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useFetch } from '#imports';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import SocForm from '@/components/Forms/SocForm.vue';

import { isLogged } from '../lib/isLogged';

const isLoggedIn = ref(false);
const socFormRef = ref(null);
const route = useRoute();

onMounted(() => {
  isLoggedIn.value = isLogged();
});

// Check if we're editing an existing SoC
const socId = route.params.id;

// Only fetch SoC data if we have a valid ID (editing mode)
const { data: rawSocData, pending, error, refresh } = await useFetch(
  socId && socId !== 'null' ? `/api/socs/${socId}` : null,
  {
    server: false,
    default: () => null
  }
);

// Transform the data to match what the form expects
const socData = computed(() => {
  if (!rawSocData.value) {
    // Return empty structure for create mode
    return {
      soc: {},
      processors: [],
      benchmarks: [],
      economics: [],
      versionHistory: [],
      manufacturerName: ''
    };
  }
  
  // Check if the response is HTML (error page) instead of JSON
  if (typeof rawSocData.value === 'string' && rawSocData.value.trim().startsWith('<!DOCTYPE')) {
    console.error('[SoC Form] Received HTML instead of JSON - API error:', rawSocData.value.substring(0, 200))
    return {
      soc: {},
      processors: [],
      benchmarks: [],
      economics: [],
      versionHistory: [],
      manufacturerName: ''
    };
  }
  
  const data = rawSocData.value.data || rawSocData.value;
  
  // Check if data.soc is HTML
  if (data.soc && typeof data.soc === 'string' && data.soc.trim().startsWith('<!DOCTYPE')) {
    console.error('[SoC Form] soc field contains HTML instead of object')
    return {
      soc: {},
      processors: [],
      benchmarks: [],
      economics: [],
      versionHistory: [],
      manufacturerName: ''
    };
  }
  
  const soc = data.soc || data;
  
  return {
    soc: soc,
    processors: soc.processors || [],
    benchmarks: soc.benchmarks || [],
    economics: soc.economics || [],
    versionHistory: data.versionHistory || [],
    manufacturerName: data.manufacturerName
  };
});

const handleBackClick = () => {
  console.log('Back button clicked - navigating to /soc/list');
};

const handleDataRefreshed = async () => {
  console.log('[SoC Form] handleDataRefreshed called', { socId, socIdType: typeof socId })
  // Refresh the data when sub-entities are updated
  if (socId && socId !== 'null') {
    console.log('[SoC Form] Refreshing SoC data...')
    await refresh();
    console.log('[SoC Form] SoC data refreshed')
  } else {
    console.log('[SoC Form] Skipping refresh - no valid socId')
  }
};

const submitForm = () => {
  console.log('Submit form clicked');
  console.log('SoC Form Ref:', socFormRef.value);
  console.log('SoC Data:', socData.value);
  
  if (socFormRef.value) {
    console.log('Calling submitData method');
    socFormRef.value.submitData();
  } else {
    console.error('SoC Form Ref is null - form not loaded yet');
  }
};
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
