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
    <div v-if="!loading && !error" class="bg-white rounded-lg border border-gray-200">
      <div class="overflow-x-auto">
      <table ref="tableRef" class="w-full divide-y divide-gray-200" style="min-width: 1000px;">
        <thead class="bg-black bg-opacity-80">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Date</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Entity Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Entity ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Field</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap" style="max-width: 200px; width: 200px;">Old Value</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap" style="max-width: 200px; width: 200px;">New Value</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Changed By</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Source</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="change in changes" :key="change.version_id">
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(change.changed_at) }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              {{ formatTableName(change.table_name) }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <a 
                :href="getEntityLink(change.table_name, change.record_id)" 
                class="text-blue-600 hover:underline"
                target="_blank"
              >
                {{ change.record_id }}
              </a>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              {{ formatFieldName(change.field_name) }}
            </td>
            <td class="px-4 py-4" style="max-width: 200px;">
              <div class="truncate" :title="change.old_value || ''">
                {{ truncateValue(change.old_value) }}
              </div>
            </td>
            <td class="px-4 py-4" style="max-width: 200px;">
              <div class="truncate" :title="change.new_value || ''">
                {{ truncateValue(change.new_value) }}
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              {{ change.User?.username || change.User?.email || 'Unknown' }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
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
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex gap-2 items-center">
                <button 
                  @click="viewChange(change)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm whitespace-nowrap"
                >
                  View
                </button>
                <button 
                  v-if="userRole === 'admin'"
                  @click="undoChange(change.version_id)"
                  :disabled="undoing === change.version_id"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50 whitespace-nowrap"
                >
                  {{ undoing === change.version_id ? 'Undoing...' : 'Undo' }}
                </button>
                <span v-if="userRole !== 'admin'" class="text-gray-400 text-sm">Admin only</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      <div class="px-4 sm:px-0 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
        Scroll horizontally to view all columns
      </div>
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

    <!-- View Change Modal -->
    <div v-if="selectedChange" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="selectedChange = null">
      <div class="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Change Details</h2>
          <button @click="selectedChange = null" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        
        <div class="space-y-4">
          <div>
            <strong>Entity Type:</strong> {{ formatTableName(selectedChange.table_name) }}
          </div>
          <div>
            <strong>Entity ID:</strong> 
            <a 
              :href="getEntityLink(selectedChange.table_name, selectedChange.record_id)" 
              class="text-blue-600 hover:underline"
              target="_blank"
            >
              {{ selectedChange.record_id }}
            </a>
          </div>
          <div>
            <strong>Field:</strong> {{ formatFieldName(selectedChange.field_name) }}
          </div>
          <div>
            <strong>Changed At:</strong> {{ formatDate(selectedChange.changed_at) }}
          </div>
          <div>
            <strong>Changed By:</strong> {{ selectedChange.User?.username || selectedChange.User?.email || 'Unknown' }}
          </div>
          <div>
            <strong>Source:</strong> 
            <span v-if="selectedChange.suggestion_id" class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Suggestion #{{ selectedChange.suggestion_id }}
            </span>
            <span v-else class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              Direct Edit
            </span>
          </div>
          <div v-if="selectedChange.comment">
            <strong>Comment:</strong>
            <div class="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
              {{ selectedChange.comment }}
            </div>
          </div>
          <div>
            <strong>Old Value:</strong>
            <div class="mt-1 p-3 bg-red-50 rounded border border-red-200">
              <pre class="whitespace-pre-wrap break-words text-sm">{{ formatChangeValue(selectedChange.old_value) }}</pre>
            </div>
          </div>
          <div>
            <strong>New Value:</strong>
            <div class="mt-1 p-3 bg-green-50 rounded border border-green-200">
              <pre class="whitespace-pre-wrap break-words text-sm">{{ formatChangeValue(selectedChange.new_value) }}</pre>
            </div>
          </div>
        </div>

        <div v-if="userRole === 'admin'" class="mt-6 flex gap-4">
          <button 
            @click="undoChange(selectedChange.version_id)"
            :disabled="undoing === selectedChange.version_id"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {{ undoing === selectedChange.version_id ? 'Undoing...' : 'Undo This Change' }}
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
const tableRef = ref(null);
const selectedChange = ref(null);
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

const viewChange = (change) => {
  selectedChange.value = change;
};

const formatChangeValue = (value) => {
  if (!value) return '(empty)';
  if (typeof value === 'string') {
    try {
      // Try to parse as JSON and format it nicely
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // Not JSON, return as-is
      return value;
    }
  }
  return String(value);
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
    const errorMessage = err.message || 'Failed to undo change.';
    
    // Check if it's a deleted entity error
    if (errorMessage.includes('no longer exists') || errorMessage.includes('Entity not found')) {
      error.value = `Cannot undo: The entity has been deleted and no longer exists in the database. This change was made before the entity was removed.`;
    } else if (errorMessage.includes('no longer exists in table')) {
      error.value = `Cannot undo: The field '${errorMessage.match(/field '([^']+)'/)?.[1] || 'unknown'}' no longer exists. This change was made before a schema migration.`;
    } else {
      error.value = errorMessage;
    }
    
    // Show alert for better visibility
    alert(error.value);
  } finally {
    undoing.value = null;
  }
};
</script>
