<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <div class="flex items-center gap-4 mb-4 sm:mb-0">
        <h1 class="text-4xl font-bold text-[#A32035]">
          GPU
        </h1>
        <NuxtLink to="/gpu/list" @click="handleBackClick">
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
          <span class="text-red-800">{{ error.statusMessage || 'Failed to load GPU data' }}</span>
        </div>
        <button @click="window.location.reload()" class="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
          Retry
        </button>
      </div>
    </div>

    <!-- GpuForm Component -->
    <div class="mt-8 -ml-4 mb-16">
      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
          <div class="text-gray-500">Loading GPU data...</div>
        </div>
      </div>
      
      <!-- GPU Form -->
      <GpuForm
        v-else-if="gpuData && gpuData.gpu"
        :gpu-data="gpuData"
        :edit-mode="true"
        ref="gpuFormRef"
        :read-only="!isLoggedIn"
      />
      
      <!-- No Data State -->
      <div v-else class="flex items-center justify-center h-64">
        <div class="text-gray-500">No GPU data available</div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="js">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useFetch, createError } from '#imports';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import GpuForm from '@/components/Forms/GpuForm.vue';

import { isLogged } from '../lib/isLogged';

const isLoggedIn = ref(false);
const gpuFormRef = ref(null);
const route = useRoute();

onMounted(() => {
  isLoggedIn.value = isLogged();
});

// Add safety check for route params
const gpuId = route.params.id;
if (!gpuId) {
  console.error('GPU ID is missing from route params');
  throw createError({ statusCode: 404, statusMessage: 'GPU ID not found' });
}

const { data: rawGpuData, pending, error } = await useFetch(`/api/gpus/${gpuId}`, {
  server: false, // Client-side only to avoid SSR issues
  default: () => null
});

// Transform the data to match what the form expects
const gpuData = computed(() => {
  if (!rawGpuData.value) return null;
  
  // Handle different response structures
  const data = rawGpuData.value.data || rawGpuData.value;
  
  return {
    gpu: data.gpu || data,
    versionHistory: data.versionHistory || [],
    manufacturerName: data.manufacturerName
  };
});

const handleBackClick = () => {
  console.log('Back button clicked - navigating to /gpu/list');
};

const submitForm = () => {
  console.log('Submit form clicked');
  console.log('GPU Form Ref:', gpuFormRef.value);
  console.log('GPU Data:', gpuData.value);
  
  if (gpuFormRef.value) {
    console.log('Calling submitData method');
    gpuFormRef.value.submitData();
  } else {
    console.error('GPU Form Ref is null - form not loaded yet');
  }
};
</script>