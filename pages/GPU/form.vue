<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
      <div class="flex items-center gap-4 mb-4 sm:mb-0">
        <h1 class="text-4xl font-bold text-[#A32035]">
          GPU
        </h1>
        <NuxtLink to="/gpu/list">
          <v-icon
            name="co-arrow-circle-left"
            class="text-gray-300 opacity-80 w-12 h-12 hover:text-[#8A1B2D] hover:opacity-78"
          />
        </NuxtLink>
      </div>

      <button
        @click="submitForm"
        v-if="isLoggedIn"
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

    <div class="mt-8 -ml-4 mb-16">
      <GpuForm
        ref="gpuFormRef"
        :gpu-data="gpuData"
      />
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Footer from '../components/Footer.vue'
import GpuForm from '../components/Forms/GpuForm.vue'
import { isLogged } from '../lib/isLogged';

const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = isLogged();
});

const gpuFormRef = ref(null)

const submitForm = () => {
  if (gpuFormRef.value) {
    gpuFormRef.value.submitData()
  }
}
</script>