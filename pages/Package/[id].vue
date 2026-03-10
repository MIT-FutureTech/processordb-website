<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <div class="flex items-center gap-4 mb-4 sm:mb-0">
        <h1 class="text-4xl font-bold text-[#A32035]">
          Package
        </h1>
        <NuxtLink to="/package/list" @click="handleBackClick">
          <ClientOnly>
            <v-icon
              name="co-arrow-circle-left"
              class="text-gray-300 opacity-80 w-12 h-12 hover:text-[#8A1B2D] hover:opacity-78"
            />
            <template #fallback>
              <svg class="text-gray-300 opacity-80 w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" />
              </svg>
            </template>
          </ClientOnly>
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
          <span class="text-red-800">{{ error.statusMessage || 'Failed to load Package data' }}</span>
        </div>
        <button @click="handleRetry" class="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
          Retry
        </button>
      </div>
    </div>

    <!-- PackageForm Component -->
    <div class="mt-8 -ml-4 mb-16">
      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
          <div class="text-gray-500">Loading Package data...</div>
        </div>
      </div>

      <!-- Package Form -->
      <PackageForm
        v-else-if="packageData"
        :package-data="packageData"
        :edit-mode="true"
        ref="packageFormRef"
        :read-only="!isLoggedIn"
        @data-refreshed="handleDataRefreshed"
      />
      
      <!-- No Data State -->
      <div v-else class="flex items-center justify-center h-64">
        <div class="text-gray-500">No Package data available</div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="js">
definePageMeta({
  ssr: false
});

import { ref, onMounted, computed } from 'vue';
import { useRoute, useFetch, createError, navigateTo } from '#imports';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import PackageForm from '@/components/Forms/PackageForm.vue';

import { isLogged } from '../lib/isLogged';

const isLoggedIn = ref(false);
const packageFormRef = ref(null);
const route = useRoute();

onMounted(() => {
  isLoggedIn.value = isLogged();
});

// Add safety check for route params
const packageId = route.params.id;

// Don't throw error for 'null' or 'form' - these should be handled by other routes
const shouldRedirect = !packageId || packageId === 'null' || packageId === 'form' || isNaN(Number(packageId));

if (shouldRedirect) {
  navigateTo('/package/list', { replace: true });
  throw createError({ statusCode: 302, statusMessage: 'Redirecting to list page' });
}

// Use a reactive query parameter to force cache refresh
const refreshKey = ref(Date.now())

const { data: rawPackageData, pending, error, refresh } = await useFetch(`/api/packages/${packageId}`, {
  server: false,
  default: () => null,
  query: computed(() => ({ refresh: 'true', _t: refreshKey.value }))
});

// Transform the data to match what the form expects
const packageData = computed(() => {
  if (!rawPackageData.value) return null;
  
  console.log('Raw Package Data:', rawPackageData.value);
  
  // Check if the response is HTML (error page) instead of JSON
  if (typeof rawPackageData.value === 'string' && rawPackageData.value.trim().startsWith('<!DOCTYPE')) {
    console.error('[Package Detail] Received HTML instead of JSON - API error:', rawPackageData.value.substring(0, 200))
    return null
  }
  
  // Handle standardized response format
  let data
  if (rawPackageData.value.success !== undefined) {
    data = rawPackageData.value.data || {}
  } else {
    data = rawPackageData.value.data || rawPackageData.value
  }
  
  const packageObj = data.package || data;
  const components = packageObj.components || [];
  
  return {
    package: packageObj,
    components: components
  };
});

const handleBackClick = () => {
  console.log('Back button clicked - navigating to /package/list');
};

const handleRetry = () => {
  if (typeof window !== 'undefined') {
    window.location.reload();
  } else {
    refresh();
  }
};

const handleDataRefreshed = async () => {
  console.log('[Package Detail] handleDataRefreshed called, refreshing data...')
  refreshKey.value = Date.now()
  await refresh();
  console.log('[Package Detail] Data refreshed')
};

const submitForm = () => {
  console.log('Submit form clicked');
  console.log('Package Form Ref:', packageFormRef.value);
  console.log('Package Data:', packageData.value);
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Package/[id].vue:submitForm',message:'Submit form called',data:{hasFormRef:!!packageFormRef.value,isLoggedIn:isLoggedIn.value,hasPackageData:!!packageData.value},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  
  if (packageFormRef.value) {
    console.log('Calling submitData method');
    packageFormRef.value.submitData();
  } else {
    console.error('Package Form Ref is null - form not loaded yet');
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
