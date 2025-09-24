<template>
    <Navbar />

    <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
            <div class="flex items-center gap-4 mb-4 sm:mb-0">
                <h1 class="text-4xl font-bold text-[#A32035]">
                    FPGA
                </h1>
                <NuxtLink to="/fpga/list" @click="handleBackClick">
                    <v-icon name="co-arrow-circle-left"
                        class="text-gray-300 opacity-80 w-12 h-12 hover:text-[#8A1B2D] hover:opacity-78" />
                </NuxtLink>
            </div>

            <button @click="submitForm" v-if="isLoggedIn"
                class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
                <span class="mr-2"> Save </span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor">
                    <path fill-rule="evenodd" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"
                        clip-rule="evenodd" />
                </svg>
            </button>
        </div>

        <div class="mt-8 -ml-4 mb-16">
            <FpgaForm 
                v-if="fpgaData" 
                :fpga-data="fpgaData" 
                :edit-mode="true" 
                ref="fpgaFormRef" 
                :read-only="!isLoggedIn" 
            />
            <div v-else class="flex items-center justify-center h-64">
                <div class="text-gray-500">Loading FPGA data...</div>
            </div>
        </div>
    </div>

    <Footer />
</template>

<script setup lang="js">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRuntimeConfig, useFetch, createError } from '#imports'
import Footer from '@/components/Footer.vue'
import { isLogged } from '../lib/isLogged';
import FpgaForm from '~/components/Forms/FpgaForm.vue';

const isLoggedIn = ref(false);

onMounted(() => {
    isLoggedIn.value = isLogged();
});

const fpgaFormRef = ref(null)
const route = useRoute()
// Add safety check for route params
const fpgaId = route.params.id;
if (!fpgaId) {
  console.error('FPGA ID is missing from route params');
  throw createError({ statusCode: 404, statusMessage: 'FPGA ID not found' });
}

const { data: rawFpgaData } = await useFetch(`${useRuntimeConfig().public.backendUrl}/fpgas/${fpgaId}`)

// Transform the data to match what the form expects
const fpgaData = computed(() => {
  if (!rawFpgaData.value) return null;
  
  return {
    fpga: rawFpgaData.value,
    versionHistory: [], // FPGA API doesn't return version history
    manufacturerName: rawFpgaData.value.SoC?.Manufacturer?.name || null
  };
});

console.log('Raw FPGA Data:', rawFpgaData.value)
console.log('Transformed FPGA Data:', fpgaData.value)

const handleBackClick = () => {
    console.log('Back button clicked - navigating to /fpga/list');
};

const submitForm = () => {
    console.log('Submit form clicked');
    console.log('FPGA Form Ref:', fpgaFormRef.value);
    console.log('FPGA Data:', fpgaData.value);
    
    if (fpgaFormRef.value) {
        console.log('Calling submitData method');
        fpgaFormRef.value.submitData()
    } else {
        console.error('FPGA Form Ref is null - form not loaded yet');
    }
}
</script>