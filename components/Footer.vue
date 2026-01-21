<template>
  <footer class="bg-black border-t-[12px] border-t-[#A32035] text-center text-white py-8 px-4 sm:px-6 lg:px-8 ">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between flex-col gap-8 lg:flex-row flex-wrap">
      <div class="text-left">
        <h2 class="text-2xl font-bold font-logo"><span class="text-[#A32035]">MIT</span> <span
            class="text-nowrap">PROCESSOR DB</span></h2>
        <p class="text-sm">
          Revealing Technical and Economic Trends in Computer Hardware</p>
          <a class="flex max-w-md pt-6" href="https://futuretech.mit.edu/" target="_blank" >
            <div class="bg-white p-2 rounded">
              <img alt="future tech" class="max-h-[80px]" src="/MIT Futuretech - new transparent  (3).png">
            </div>
          </a>
      </div>
      <div class="flex justify-between text-left flex-col gap-8 lg:gap-32 lg:flex-row  ">
        <div>
          <h2 class="font-medium text-md">Relevant links</h2>
          <ul class="font-light text-sm space-y-2 mt-2">
            <li><a class="hover:underline py-2" href="https://futuretech.mit.edu/" target="_blank"
                aria-label="MIT Futuretech">MIT
                Futuretech</a></li>
            <li><a class="hover:underline py-2" href="https://www.koomey.com/analyticspage.html" target="_blank"
                aria-label="Koomey Analytics">Koomey Analytics</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-medium text-md">Data sources</h3>
          <ul class="font-light text-sm space-y-2 mt-2">
            <li><a class="hover:underline py-2" href="http://cpudb.stanford.edu/" target="_blank"
                aria-label="Stanford CPU DB">Stanford
                CPU DB</a></li>
            <li><a class="hover:underline py-2" href="https://chip-dataset.vercel.app/" target="_blank"
                aria-label="The CHIP Dataset">The
                CHIP Dataset</a></li>
            <li><a class="hover:underline py-2" href="https://www.techpowerup.com/cpu-specs/" target="_blank"
                aria-label="TechPowerUp">TechPowerUp</a></li>
            <li><a class="hover:underline py-2" href="https://en.wikichip.org/wiki/WikiChip" target="_blank"
                aria-label="TechPowerUp">WikiChip</a></li>
          </ul>
        </div>

      </div>
      <div>
        <h3 class="font-medium text-md mb-2">Support</h3>
        <button
          @click="showBugReportModal = true"
          class="px-4 py-2 text-sm bg-[#A32035] text-white rounded hover:bg-opacity-90 transition-colors"
        >
          Report a Bug
        </button>
      </div>

    </div>
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-t-white flex justify-between gap-8 mt-16 pt-8 flex-col sm:flex-row">
      <p class="text-center text-sm">
        © {{ new Date().getFullYear() }} MIT Processor Database
      </p>
      <p>
        <a href="https://accessibility.mit.edu/" target="_blank" aria-label="MIT Acessability">
          Accessibility
        </a>
      </p>

    </div>

    <!-- Bug Report Modal -->
    <div v-if="showBugReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeBugReportModal">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Report a Bug</h2>
          <button @click="closeBugReportModal" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            ×
          </button>
        </div>
        
        <form @submit.prevent="submitBugReport" class="space-y-4">
          <div>
            <label for="bug-title" class="block text-sm font-medium text-gray-700 mb-1">
              Bug Title <span class="text-red-500">*</span>
            </label>
            <input
              id="bug-title"
              v-model="bugReportForm.title"
              type="text"
              placeholder="Brief description of the bug"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A32035] focus:border-transparent"
            >
          </div>
          
          <div>
            <label for="bug-description" class="block text-sm font-medium text-gray-700 mb-1">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="bug-description"
              v-model="bugReportForm.description"
              placeholder="Please describe the bug in detail. Include steps to reproduce if possible."
              required
              rows="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A32035] focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div v-if="bugReportMessage" :class="bugReportMessageType === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'" class="p-3 rounded-lg border">
            {{ bugReportMessage }}
          </div>

          <div class="flex gap-4 justify-end pt-2">
            <button
              type="button"
              @click="closeBugReportModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ submitting ? 'Submitting...' : 'Submit Bug Report' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </footer>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const showBugReportModal = ref(false);
const bugReportForm = ref({
  title: '',
  description: '',
});
const submitting = ref(false);
const bugReportMessage = ref('');
const bugReportMessageType = ref('');

const closeBugReportModal = () => {
  showBugReportModal.value = false;
  // Reset form after a short delay to allow modal close animation
  setTimeout(() => {
    bugReportForm.value = {
      title: '',
      description: '',
    };
    bugReportMessage.value = '';
    bugReportMessageType.value = '';
  }, 300);
};

const submitBugReport = async () => {
  if (!bugReportForm.value.title.trim() || !bugReportForm.value.description.trim()) {
    return;
  }

  submitting.value = true;
  bugReportMessage.value = '';
  bugReportMessageType.value = '';

  try {
    let backendUrl = config.public.backendUrl || 'http://localhost:3001';
    backendUrl = backendUrl.replace(/\/$/, '');
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
    const url = `${backendUrl}${apiPrefix}/bug-reports`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: bugReportForm.value.title.trim(),
        description: bugReportForm.value.description.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit bug report');
    }

    bugReportMessage.value = 'Bug report submitted successfully. Thank you!';
    bugReportMessageType.value = 'success';
    bugReportForm.value = {
      title: '',
      description: '',
    };

    // Close modal after successful submission
    setTimeout(() => {
      closeBugReportModal();
    }, 2000);
  } catch (error) {
    console.error('Error submitting bug report:', error);
    bugReportMessage.value = error.message || 'Failed to submit bug report. Please try again.';
    bugReportMessageType.value = 'error';
  } finally {
    submitting.value = false;
  }
};
</script>