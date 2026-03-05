<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <div class="flex items-center gap-4 mb-4 sm:mb-0">
        <h1 class="text-4xl font-bold text-[#A32035]">
          {{ editMode ? 'Edit AI Processor' : 'Add AI Processor' }}
        </h1>
        <NuxtLink to="/ai-processor/list">
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
        <span class="mr-2">{{ editMode ? 'Update' : 'Create' }}</span>
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

    <!-- AI Processor Form Component -->
    <div class="mt-8 -ml-4 mb-16">
      <AiProcessorForm
        v-if="mounted"
        :ai-processor-data="aiProcessorData"
        :edit-mode="editMode"
        ref="aiProcessorFormRef"
        :read-only="!isLoggedIn"
      />
    </div>
  </div>

  <Footer />
</template>

<script setup lang="js">
definePageMeta({
  ssr: false
});

import { ref, onMounted, computed } from 'vue';
import { useRoute, useFetch } from '#imports';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import AiProcessorForm from '@/components/Forms/AiProcessorForm.vue';

import { isLogged } from '../lib/isLogged';

const isLoggedIn = ref(false);
const aiProcessorFormRef = ref(null);
const mounted = ref(false);
const route = useRoute();

const aiProcessorId = route.params.id;
const editMode = computed(() => !!aiProcessorId);

const { data: rawAiProcessorData } = await useFetch(
  editMode.value ? `/api/ai-processors/${aiProcessorId}` : null,
  {
    server: false,
    default: () => null,
    lazy: true
  }
);

const aiProcessorData = computed(() => {
  if (!rawAiProcessorData.value) return { aiProcessor: null, versionHistory: [], manufacturerName: null };
  
  const data = rawAiProcessorData.value.data || rawAiProcessorData.value;
  
  return {
    aiProcessor: data.aiProcessor || data,
    cores: data.cores || [],
    versionHistory: data.versionHistory || [],
    manufacturerName: data.manufacturerName
  };
});

onMounted(() => {
  isLoggedIn.value = isLogged();
  mounted.value = true;
});

const submitForm = () => {
  console.log('Submit form clicked');
  if (aiProcessorFormRef.value) {
    console.log('Calling submitData method');
    aiProcessorFormRef.value.submitData();
  } else {
    console.error('AI Processor Form Ref is null - form not loaded yet');
  }
};
</script>
