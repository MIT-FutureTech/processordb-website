<template>
  <div class="text-gray-800 flex flex-col min-h-screen">
    <Navbar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 mb-16 mt-16 flex-1">
      <section>
        <h2 class="text-3xl font-medium text-gray-600 sm:text-4xl">
          Dataset
        </h2>
        <p class="text-lg text-left leading-loose mt-4 text-justify">
          A comprehensive database of hardware chips, encompassing CPUs, GPUs, FPGAs, and other domain-specific chips from around the globe. The goal is to track and analyze trends in hardware development comprehensively.
        </p>
      </section>

      <!-- Charts Section: Stacked Top to Bottom -->
      <section class="space-y-8">
        <!-- CPU Chart -->
        <div class="space-y-4">
            <h3 class="text-xl font-medium text-gray-700">CPU</h3>
            <div class="bg-white rounded-lg p-4">
              <Suspense>
                <template #default>
                  <div>
                    <CPUsGraph v-if="cpuChartData && cpuChartData.length > 0" :data="cpuChartData" />
                    <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                      <div class="text-gray-500">No CPU chart data available</div>
                    </div>
                  </div>
                </template>
                <template #fallback>
                  <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <div class="flex flex-col items-center space-y-4">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
                      <div class="text-gray-500">Loading CPU chart...</div>
                    </div>
                  </div>
                </template>
              </Suspense>
            </div>
          </div>

        <!-- GPU Chart -->
        <div class="space-y-4">
            <h3 class="text-xl font-medium text-gray-700">GPU</h3>
            <div class="bg-white rounded-lg p-4">
              <Suspense>
                <template #default>
                  <div>
                    <GPUsGraph v-if="gpuChartData && gpuChartData.length > 0" :data="gpuChartData" />
                    <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                      <div class="text-gray-500">No GPU chart data available</div>
                    </div>
                  </div>
                </template>
                <template #fallback>
                  <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <div class="flex flex-col items-center space-y-4">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
                      <div class="text-gray-500">Loading GPU chart...</div>
                    </div>
                  </div>
                </template>
              </Suspense>
            </div>
          </div>

        <!-- FPGA Chart -->
        <div class="space-y-4">
            <h3 class="text-xl font-medium text-gray-700">FPGA</h3>
            <div class="bg-white rounded-lg p-4">
              <Suspense>
                <template #default>
                  <div>
                    <FPGAsGraph v-if="fpgaChartData && fpgaChartData.length > 0" :data="fpgaChartData" />
                    <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                      <div class="text-gray-500">No FPGA chart data available</div>
                    </div>
                  </div>
                </template>
                <template #fallback>
                  <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <div class="flex flex-col items-center space-y-4">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
                      <div class="text-gray-500">Loading FPGA chart...</div>
                    </div>
                  </div>
                </template>
              </Suspense>
            </div>
          </div>

        <!-- AI Processors Chart -->
        <div class="space-y-4">
            <h3 class="text-xl font-medium text-gray-700">AI Processors</h3>
            <div class="bg-white rounded-lg p-4">
              <Suspense>
                <template #default>
                  <div>
                    <AIProcessorsGraph v-if="aiProcessorChartData && aiProcessorChartData.length > 0" :data="aiProcessorChartData" />
                    <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                      <div class="text-gray-500">No AI Processor chart data available</div>
                    </div>
                  </div>
                </template>
                <template #fallback>
                  <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <div class="flex flex-col items-center space-y-4">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035]"></div>
                      <div class="text-gray-500">Loading AI Processor chart...</div>
                    </div>
                  </div>
                </template>
              </Suspense>
            </div>
          </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="js">
definePageMeta({
  ssr: false
});

import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useCpus, useGpus, useFpgas, useAiProcessors } from '~/composables/useApi';

// Lazy load chart components
const CPUsGraph = defineAsyncComponent(() => import('~/components/Graphs/CPUsGraph.client.vue'));
const GPUsGraph = defineAsyncComponent(() => import('~/components/Graphs/GPUsGraph.client.vue'));
const FPGAsGraph = defineAsyncComponent(() => import('~/components/Graphs/FPGAsGraph.client.vue'));
const AIProcessorsGraph = defineAsyncComponent(() => import('~/components/Graphs/AIProcessorsGraph.client.vue'));

// Use API composables
const { chartData: cpuChartData, fetchChartData: fetchCpuChartData } = useCpus();
const { chartData: gpuChartData, fetchChartData: fetchGpuChartData } = useGpus();
const { chartData: fpgaChartData, fetchChartData: fetchFpgaChartData } = useFpgas();
const { chartData: aiProcessorChartData, fetchChartData: fetchAiProcessorChartData } = useAiProcessors();

// Fetch all chart data on mount
onMounted(async () => {
  if (typeof window === 'undefined') return;
  
  // Fetch all chart data in parallel
  await Promise.all([
    fetchCpuChartData(false).catch(err => console.error('[Dataset] CPU chart fetch error:', err)),
    fetchGpuChartData(false).catch(err => console.error('[Dataset] GPU chart fetch error:', err)),
    fetchFpgaChartData(false).catch(err => console.error('[Dataset] FPGA chart fetch error:', err)),
    fetchAiProcessorChartData(false).catch(err => console.error('[Dataset] AI Processor chart fetch error:', err))
  ]);
});

useHead({
  title: 'Dataset - MIT Processor DB',
  meta: [
    {
      name: 'description',
      content: 'A comprehensive database of hardware chips, encompassing CPUs, GPUs, FPGAs, and other domain-specific chips from around the globe. The goal is to track and analyze trends in hardware development comprehensively.'
    }
  ],
  htmlAttrs: {
    lang: 'en',
  },
});
</script>
