<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-[#A32035] mt-8">
          Change Log
        </h1>
        <div class="text-lg text-gray-600 mt-2">
          View and undo all changes made to the database. Filter by entity type, date range, user, or source.
        </div>
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Filters -->
    <div class="mb-4 flex gap-4 items-center flex-wrap">
      <select v-model="tableNameFilter" @change="loadChanges" class="px-4 py-2 border border-gray-300 rounded-lg">
        <option value="">All Entity Types</option>
        <option value="cpus">CPU</option>
        <option value="gpus">GPU</option>
        <option value="fpgas">FPGA</option>
        <option value="socs">SoC</option>
        <option value="manufacturers">Manufacturer</option>
        <option value="ai_processors">AI Processor</option>
      </select>
      <select v-model="sourceFilter" @change="loadChanges" class="px-4 py-2 border border-gray-300 rounded-lg">
        <option value="">All Sources</option>
        <option value="direct">Direct Edit</option>
        <option value="suggestion">Suggestion</option>
      </select>
      <input 
        v-model="startDate" 
        type="date" 
        @change="loadChanges"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="Start Date"
      />
      <input 
        v-model="endDate" 
        type="date" 
        @change="loadChanges"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="End Date"
      />
      <button @click="loadChanges" class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-opacity-90">
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p>Loading changes...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Changes Table -->
    <div v-if="!loading && !error" class="bg-white rounded-lg overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-black bg-opacity-80">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Entity Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Entity ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Field</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Old Value</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">New Value</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Changed By</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Source</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="change in changes" :key="change.version_id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(change.changed_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatTableName(change.table_name) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <a 
                :href="getEntityLink(change.table_name, change.record_id)" 
                class="text-blue-600 hover:underline"
                target="_blank"
              >
                {{ change.record_id }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatFieldName(change.field_name) }}
            </td>
            <td class="px-6 py-4 max-w-xs truncate" :title="change.old_value || ''">
              {{ truncateValue(change.old_value) }}
            </td>
            <td class="px-6 py-4 max-w-xs truncate" :title="change.new_value || ''">
              {{ truncateValue(change.new_value) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ change.User?.username || change.User?.email || 'Unknown' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="change.suggestion_id" class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Suggestion
                <a 
                  :href="`/admin/suggestions`" 
                  class="underline"
                  @click.prevent="viewSuggestion(change.suggestion_id)"
                >
                  #{{ change.suggestion_id }}
                </a>
              </span>
              <span v-else class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                Direct Edit
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                v-if="userRole === 'admin'"
                @click="undoChange(change.version_id)"
                :disabled="undoing === change.version_id"
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
              >
                {{ undoing === change.version_id ? 'Undoing...' : 'Undo' }}
              </button>
              <span v-else class="text-gray-400 text-sm">Admin only</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error && pagination.totalPages > 1" class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ (pagination.page - 1) * pagination.pageSize + 1 }} to 
        {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} of 
        {{ pagination.total }} changes
      </div>
      <div class="flex gap-2">
        <button 
          @click="goToPage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span class="px-4 py-2">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </span>
        <button 
          @click="goToPage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <div class="mb-16" />
  </div>
  <Footer />
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { navigateTo } from '#imports';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { isLogged, getRole } from '@/lib/isLogged';
import { getAllChanges, undoChange as undoChangeApi } from '@/lib/versionHistoryService.js';

definePageMeta({
  ssr: false
});

const loading = ref(false);
const error = ref('');
const changes = ref([]);
const tableNameFilter = ref('');
const sourceFilter = ref('');
const startDate = ref('');
const endDate = ref('');
const userRole = ref('');
const isLoggedIn = ref(false);
const undoing = ref(null);
const pagination = ref({
  page: 1,
  pageSize: 50,
  total: 0,
  totalPages: 0,
});

onMounted(() => {
  isLoggedIn.value = isLogged();
  userRole.value = getRole();
  
  if (!isLoggedIn.value || userRole.value !== 'admin') {
    error.value = 'Access denied. Admin role required.';
    return;
  }
  
  loadChanges();
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const formatTableName = (tableName) => {
  const nameMap = {
    'cpus': 'CPU',
    'gpus': 'GPU',
    'fpgas': 'FPGA',
    'socs': 'SoC',
    'manufacturers': 'Manufacturer',
    'ai_processors': 'AI Processor',
  };
  return nameMap[tableName] || tableName;
};

const formatFieldName = (fieldName) => {
  if (!fieldName) return '';
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

const truncateValue = (value) => {
  if (!value) return '';
  const str = String(value);
  return str.length > 50 ? str.substring(0, 50) + '...' : str;
};

const getEntityLink = (tableName, recordId) => {
  const routeMap = {
    'cpus': '/CPU',
    'gpus': '/GPU',
    'fpgas': '/FPGA',
    'socs': '/SoC',
  };
  const base = routeMap[tableName] || '';
  return base ? `${base}/${recordId}` : '#';
};

const viewSuggestion = (suggestionId) => {
  navigateTo(`/admin/suggestions`);
  // Could open a modal or navigate to suggestion details
};

const loadChanges = async () => {
  if (!isLoggedIn.value || userRole.value !== 'admin') {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const filters = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    };

    if (tableNameFilter.value) {
      filters.table_name = tableNameFilter.value;
    }
    if (sourceFilter.value === 'suggestion') {
      // Filter for changes with suggestion_id
      // Note: This requires backend support for filtering by suggestion_id presence
      // For now, we'll filter on the frontend
    }
    if (startDate.value) {
      filters.start_date = startDate.value;
    }
    if (endDate.value) {
      filters.end_date = endDate.value;
    }

    const result = await getAllChanges(filters);
    changes.value = result.data || [];
    pagination.value = result.pagination || pagination.value;

    // Filter by source on frontend if needed
    if (sourceFilter.value === 'suggestion') {
      changes.value = changes.value.filter(c => c.suggestion_id);
    } else if (sourceFilter.value === 'direct') {
      changes.value = changes.value.filter(c => !c.suggestion_id);
    }
  } catch (err) {
    console.error('[Change Log] Error loading changes:', err);
    error.value = err.message || 'An error occurred while loading changes.';
  } finally {
    loading.value = false;
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page;
    loadChanges();
  }
};

const undoChange = async (versionId) => {
  if (!confirm('Are you sure you want to undo this change? This action cannot be undone.')) {
    return;
  }

  undoing.value = versionId;
  error.value = '';

  try {
    await undoChangeApi(versionId);
    // Reload changes to reflect the undo
    await loadChanges();
    // Show success message (could use a toast library)
    alert('Change undone successfully');
  } catch (err) {
    console.error('[Change Log] Error undoing change:', err);
    error.value = err.message || 'Failed to undo change.';
  } finally {
    undoing.value = null;
  }
};
</script>
