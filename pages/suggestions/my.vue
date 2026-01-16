<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-[#A32035] mt-8">
          My Suggestions
        </h1>
        <div class="text-lg text-gray-600 mt-2">
          View the status of your submitted suggestions
        </div>
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Filters -->
    <div class="mb-4 flex gap-4 items-center">
      <select v-model="statusFilter" @change="loadSuggestions" class="px-4 py-2 border border-gray-300 rounded-lg">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="denied">Denied</option>
      </select>
      <button @click="loadSuggestions" class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-opacity-90">
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p>Loading suggestions...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Suggestions Table -->
    <div v-if="!loading && !error" class="bg-white rounded-lg overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-black bg-opacity-80">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Note</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Submitted</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Reviewed</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="suggestion in suggestions" :key="suggestion.suggestion_id">
            <td class="px-6 py-4 whitespace-nowrap">{{ suggestion.suggestion_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ suggestion.entity_type }}</td>
            <td class="px-6 py-4">
              <div class="max-w-xs truncate" :title="suggestion.suggestion_note || 'No note'">
                {{ suggestion.suggestion_note || '-' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="{
                'bg-yellow-100 text-yellow-800': suggestion.status === 'pending',
                'bg-green-100 text-green-800': suggestion.status === 'approved',
                'bg-red-100 text-red-800': suggestion.status === 'denied'
              }" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ suggestion.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(suggestion.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ suggestion.reviewed_at ? formatDate(suggestion.reviewed_at) : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                @click="viewSuggestion(suggestion)"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="suggestions.length === 0" class="text-center py-8 text-gray-500">
        No suggestions found. Submit your first suggestion from any processor detail page!
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Showing {{ (pagination.page - 1) * pagination.pageSize + 1 }} to 
          {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} of 
          {{ pagination.total }} suggestions
        </div>
        <div class="flex gap-2">
          <button 
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- View Suggestion Modal -->
    <div v-if="selectedSuggestion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="selectedSuggestion = null">
      <div class="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Suggestion Details</h2>
          <button @click="selectedSuggestion = null" class="text-gray-500 hover:text-gray-700">×</button>
        </div>
        
        <div class="space-y-4">
          <div>
            <strong>Type:</strong> {{ selectedSuggestion.entity_type }}
          </div>
          <div>
            <strong>Status:</strong> 
            <span :class="{
              'bg-yellow-100 text-yellow-800': selectedSuggestion.status === 'pending',
              'bg-green-100 text-green-800': selectedSuggestion.status === 'approved',
              'bg-red-100 text-red-800': selectedSuggestion.status === 'denied'
            }" class="px-2 py-1 rounded-full text-xs font-medium ml-2">
              {{ selectedSuggestion.status }}
            </span>
          </div>
          <div v-if="selectedSuggestion.suggestion_note">
            <strong>Your Note:</strong>
            <div class="mt-1 p-3 bg-blue-50 rounded border border-blue-200">
              {{ selectedSuggestion.suggestion_note }}
            </div>
          </div>
          <div v-if="selectedSuggestion.review_comment">
            <strong>Review Comment:</strong>
            <div class="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
              {{ selectedSuggestion.review_comment }}
            </div>
          </div>
          <div v-if="selectedSuggestion.reviewer">
            <strong>Reviewed By:</strong> {{ selectedSuggestion.reviewer?.username || selectedSuggestion.reviewer?.email || 'Unknown' }}
          </div>
          <div>
            <strong>Suggestion Data:</strong>
            <pre class="mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm">{{ formatSuggestionData(selectedSuggestion.suggestion_data) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-16" />
  </div>
  <Footer />
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { getItemWithExpiry } from '@/lib/encrypter';
import { useRuntimeConfig } from '#imports';

const loading = ref(false);
const error = ref('');
const suggestions = ref([]);
const statusFilter = ref('');
const selectedSuggestion = ref(null);
const pagination = ref({
  page: 1,
  pageSize: 50,
  total: 0,
  totalPages: 0,
});

const getAuthToken = () => {
  return getItemWithExpiry('encryptedJWTPDB');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const formatSuggestionData = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  }
  return JSON.stringify(data, null, 2);
};

const loadSuggestions = async () => {
  console.log('[My Suggestions] Loading suggestions', { statusFilter: statusFilter.value });
  
  loading.value = true;
  error.value = '';

  try {
    const config = useRuntimeConfig();
    let backendUrl = config.public.backendUrl || 'http://localhost:3001';
    backendUrl = backendUrl.replace(/\/$/, '');
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
    
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      pageSize: pagination.value.pageSize.toString(),
    });
    
    if (statusFilter.value) {
      params.append('status', statusFilter.value);
    }

    const url = `${backendUrl}${apiPrefix}/suggestions/my?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        error.value = 'Please log in to view your suggestions.';
      } else {
        error.value = 'Failed to load suggestions.';
      }
      return;
    }

    const result = await response.json();
    suggestions.value = result.data || [];
    pagination.value = result.pagination || pagination.value;
    
    console.log('[My Suggestions] Suggestions loaded', { count: suggestions.value.length });
  } catch (err) {
    console.error('[My Suggestions] Error', { error: err.message });
    error.value = 'An error occurred while loading suggestions.';
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  pagination.value.page = page;
  loadSuggestions();
};

const viewSuggestion = (suggestion) => {
  selectedSuggestion.value = suggestion;
};

onMounted(() => {
  loadSuggestions();
});
</script>
