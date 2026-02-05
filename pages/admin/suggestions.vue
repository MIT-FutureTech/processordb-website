<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-[#A32035] mt-8">
          Review Queue
        </h1>
        <div class="text-lg text-gray-600 mt-2">
          Review and approve or deny suggestions from suggestors. Use filters to view pending, approved, or denied suggestions.
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
      <select v-model="entityTypeFilter" @change="loadSuggestions" class="px-4 py-2 border border-gray-300 rounded-lg">
        <option value="">All Types</option>
        <option value="cpu">CPU</option>
        <option value="gpu">GPU</option>
        <option value="fpga">FPGA</option>
        <option value="soc">SoC</option>
        <option value="manufacturer">Manufacturer</option>
        <option value="ai-processor">AI Processor</option>
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
    <div v-if="!loading && !error" class="bg-white rounded-lg border border-gray-200">
      <div class="overflow-x-auto">
      <table class="w-full divide-y divide-gray-200" style="min-width: 1000px;">
        <thead class="bg-black bg-opacity-80">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Suggested By</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap" style="max-width: 200px; width: 200px;">Note</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Status</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Date</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="suggestion in suggestions" :key="suggestion.suggestion_id">
            <td class="px-4 py-4 whitespace-nowrap">{{ suggestion.suggestion_id }}</td>
            <td class="px-4 py-4 whitespace-nowrap">{{ suggestion.entity_type }}</td>
            <td class="px-4 py-4 whitespace-nowrap">
              {{ suggestion.suggestor?.username || suggestion.suggestor?.email || 'Unknown' }}
            </td>
            <td class="px-4 py-4" style="max-width: 200px;">
              <div class="truncate" :title="suggestion.suggestion_note || 'No note'">
                {{ suggestion.suggestion_note || '-' }}
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span :class="{
                'bg-yellow-100 text-yellow-800': suggestion.status === 'pending',
                'bg-green-100 text-green-800': suggestion.status === 'approved',
                'bg-red-100 text-red-800': suggestion.status === 'denied'
              }" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ suggestion.status }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(suggestion.createdAt) }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex gap-2 items-center flex-wrap">
                <button 
                  @click="viewSuggestion(suggestion)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm whitespace-nowrap"
                >
                  View
                </button>
                <template v-if="suggestion.status === 'pending'">
                  <button 
                    @click="approveSuggestion(suggestion.suggestion_id)"
                    class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm whitespace-nowrap"
                  >
                    Approve
                  </button>
                  <button 
                    @click="showDenyModal(suggestion)"
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm whitespace-nowrap"
                  >
                    Deny
                  </button>
                </template>
                <template v-else>
                  <span class="text-sm text-gray-500 whitespace-nowrap">
                    Reviewed by {{ suggestion.reviewer?.username || 'Unknown' }}
                  </span>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      <div class="px-4 sm:px-0 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
        Scroll horizontally to view all columns
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
          <div>
            <strong>Suggested By:</strong> {{ selectedSuggestion.suggestor?.username || selectedSuggestion.suggestor?.email }}
          </div>
          <div>
            <strong>Submitted:</strong> {{ formatDate(selectedSuggestion.createdAt) }}
          </div>
          <div v-if="selectedSuggestion.suggestion_note">
            <strong>Your Note:</strong>
            <div class="mt-1 p-3 bg-blue-50 rounded border border-blue-200">
              {{ selectedSuggestion.suggestion_note }}
            </div>
          </div>
          <div v-if="selectedSuggestion.status !== 'pending'">
            <strong>Reviewed By:</strong> {{ selectedSuggestion.reviewer?.username || 'Unknown' }}
          </div>
          <div v-if="selectedSuggestion.reviewed_at">
            <strong>Reviewed At:</strong> {{ formatDate(selectedSuggestion.reviewed_at) }}
          </div>
          <div v-if="selectedSuggestion.review_comment">
            <strong>Review Comment:</strong>
            <div class="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
              {{ selectedSuggestion.review_comment }}
            </div>
          </div>
          <div>
            <strong>Suggestion Data:</strong>
            <pre class="mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm">{{ formatSuggestionData(selectedSuggestion.suggestion_data) }}</pre>
          </div>
        </div>

        <div v-if="selectedSuggestion.status === 'pending'" class="mt-6 flex gap-4">
          <button 
            @click="approveSuggestion(selectedSuggestion.suggestion_id)"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Approve
          </button>
          <button 
            @click="showDenyModal(selectedSuggestion)"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Deny
          </button>
        </div>
      </div>
    </div>

    <!-- Deny Modal -->
    <div v-if="denyModalSuggestion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="denyModalSuggestion = null">
      <div class="bg-white rounded-lg p-6 max-w-md">
        <h2 class="text-xl font-bold mb-4">Deny Suggestion</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Review Comment (Optional)</label>
          <textarea 
            v-model="denyComment" 
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Explain why this suggestion is being denied..."
          ></textarea>
        </div>
        <div class="flex gap-4">
          <button 
            @click="denySuggestion(denyModalSuggestion.suggestion_id)"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm Deny
          </button>
          <button 
            @click="denyModalSuggestion = null; denyComment = ''"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
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
const statusFilter = ref(''); // Default to 'All Status' to show all suggestions
const entityTypeFilter = ref('');
const selectedSuggestion = ref(null);
const denyModalSuggestion = ref(null);
const denyComment = ref('');
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
  console.log('[Review Queue] Loading suggestions', { 
    statusFilter: statusFilter.value, 
    entityTypeFilter: entityTypeFilter.value 
  });
  
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
    if (entityTypeFilter.value) {
      params.append('entity_type', entityTypeFilter.value);
    }

    const url = `${backendUrl}${apiPrefix}/suggestions?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        error.value = 'You do not have permission to review suggestions.';
      } else {
        error.value = 'Failed to load suggestions.';
      }
      return;
    }

    const result = await response.json();
    suggestions.value = result.data || [];
    pagination.value = result.pagination || pagination.value;
    
    console.log('[Review Queue] Suggestions loaded', { count: suggestions.value.length });
  } catch (err) {
    console.error('[Review Queue] Error', { error: err.message });
    error.value = 'An error occurred while loading suggestions.';
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  pagination.value.page = page;
  loadSuggestions();
};

const viewSuggestion = async (suggestion) => {
  // If suggestion doesn't have reviewer info, fetch full details
  if (suggestion.status !== 'pending' && !suggestion.reviewer) {
    try {
      const config = useRuntimeConfig();
      let backendUrl = config.public.backendUrl || 'http://localhost:3001';
      backendUrl = backendUrl.replace(/\/$/, '');
      const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
      const url = `${backendUrl}${apiPrefix}/suggestions/${suggestion.suggestion_id}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        selectedSuggestion.value = result.data || suggestion;
      } else {
        selectedSuggestion.value = suggestion;
      }
    } catch (err) {
      console.error('[Review Queue] Error fetching suggestion details', { error: err.message });
      selectedSuggestion.value = suggestion;
    }
  } else {
    selectedSuggestion.value = suggestion;
  }
};

const approveSuggestion = async (suggestionId) => {
  console.log('[Review Queue] Approving suggestion', { suggestionId });
  
  try {
    const config = useRuntimeConfig();
    let backendUrl = config.public.backendUrl || 'http://localhost:3001';
    backendUrl = backendUrl.replace(/\/$/, '');
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
    const url = `${backendUrl}${apiPrefix}/suggestions/${suggestionId}/approve`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to approve suggestion.');
      return;
    }

    alert('Suggestion approved successfully!');
    selectedSuggestion.value = null;
    loadSuggestions();
  } catch (err) {
    console.error('[Review Queue] Error approving suggestion', { error: err.message });
    alert('An error occurred while approving the suggestion.');
  }
};

const showDenyModal = (suggestion) => {
  denyModalSuggestion.value = suggestion;
  denyComment.value = '';
};

const denySuggestion = async (suggestionId) => {
  console.log('[Review Queue] Denying suggestion', { suggestionId });
  
  try {
    const config = useRuntimeConfig();
    let backendUrl = config.public.backendUrl || 'http://localhost:3001';
    backendUrl = backendUrl.replace(/\/$/, '');
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
    const url = `${backendUrl}${apiPrefix}/suggestions/${suggestionId}/deny`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review_comment: denyComment.value || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to deny suggestion.');
      return;
    }

    alert('Suggestion denied.');
    denyModalSuggestion.value = null;
    denyComment.value = '';
    loadSuggestions();
  } catch (err) {
    console.error('[Review Queue] Error denying suggestion', { error: err.message });
    alert('An error occurred while denying the suggestion.');
  }
};

onMounted(() => {
  loadSuggestions();
});
</script>
