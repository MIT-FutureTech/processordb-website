<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-[#A32035] mt-8">
          Bug Reports
        </h1>
        <div class="text-lg text-gray-600 mt-2">
          View and manage bug reports submitted by users. Mark bugs as resolved or unresolved.
        </div>
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Filters -->
    <div class="mb-4 flex gap-4 items-center">
      <select v-model="statusFilter" @change="loadBugReports" class="px-4 py-2 border border-gray-300 rounded-lg">
        <option value="">All Status</option>
        <option value="false">Unresolved</option>
        <option value="true">Resolved</option>
      </select>
      <button @click="loadBugReports" class="px-4 py-2 bg-[#A32035] text-white rounded-lg hover:bg-opacity-90">
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p>Loading bug reports...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Bug Reports Table -->
    <div v-if="!loading && !error" class="bg-white rounded-lg overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-black bg-opacity-80">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Date Submitted</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Resolved By</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="bugReport in bugReports" :key="bugReport.bug_report_id">
            <td class="px-6 py-4 whitespace-nowrap">{{ bugReport.bug_report_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ bugReport.title }}</td>
            <td class="px-6 py-4">
              <div class="max-w-xs truncate" :title="bugReport.description">
                {{ bugReport.description }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="{
                'bg-red-100 text-red-800': !bugReport.is_resolved,
                'bg-green-100 text-green-800': bugReport.is_resolved
              }" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ bugReport.is_resolved ? 'Resolved' : 'Unresolved' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(bugReport.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ bugReport.resolver?.username || bugReport.resolver?.email || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex gap-2 items-center">
                <button 
                  @click="viewBugReport(bugReport)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  View
                </button>
                <template v-if="!bugReport.is_resolved">
                  <button 
                    @click="showResolveModal(bugReport)"
                    class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Resolve
                  </button>
                </template>
                <template v-else>
                  <button 
                    @click="unresolveBugReport(bugReport.bug_report_id)"
                    class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                  >
                    Unresolve
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Showing {{ (pagination.page - 1) * pagination.pageSize + 1 }} to 
          {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} of 
          {{ pagination.total }} bug reports
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

    <!-- View Bug Report Modal -->
    <div v-if="selectedBugReport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="selectedBugReport = null">
      <div class="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Bug Report Details</h2>
          <button @click="selectedBugReport = null" class="text-gray-500 hover:text-gray-700">×</button>
        </div>
        
        <div class="space-y-4">
          <div>
            <strong>ID:</strong> {{ selectedBugReport.bug_report_id }}
          </div>
          <div>
            <strong>Title:</strong> {{ selectedBugReport.title }}
          </div>
          <div>
            <strong>Status:</strong> 
            <span :class="{
              'bg-red-100 text-red-800': !selectedBugReport.is_resolved,
              'bg-green-100 text-green-800': selectedBugReport.is_resolved
            }" class="px-2 py-1 rounded-full text-xs font-medium ml-2">
              {{ selectedBugReport.is_resolved ? 'Resolved' : 'Unresolved' }}
            </span>
          </div>
          <div>
            <strong>Submitted:</strong> {{ formatDate(selectedBugReport.createdAt) }}
          </div>
          <div>
            <strong>Description:</strong>
            <div class="mt-1 p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
              {{ selectedBugReport.description }}
            </div>
          </div>
          <div v-if="selectedBugReport.is_resolved">
            <strong>Resolved By:</strong> {{ selectedBugReport.resolver?.username || selectedBugReport.resolver?.email || 'Unknown' }}
          </div>
          <div v-if="selectedBugReport.resolved_at">
            <strong>Resolved At:</strong> {{ formatDate(selectedBugReport.resolved_at) }}
          </div>
          <div v-if="selectedBugReport.resolved_notes">
            <strong>Resolution Notes:</strong>
            <div class="mt-1 p-3 bg-blue-50 rounded border border-blue-200 whitespace-pre-wrap">
              {{ selectedBugReport.resolved_notes }}
            </div>
          </div>
        </div>

        <div v-if="!selectedBugReport.is_resolved" class="mt-6 flex gap-4">
          <button 
            @click="showResolveModal(selectedBugReport)"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Resolve
          </button>
        </div>
      </div>
    </div>

    <!-- Resolve Modal -->
    <div v-if="resolveModalBugReport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="resolveModalBugReport = null">
      <div class="bg-white rounded-lg p-6 max-w-md">
        <h2 class="text-xl font-bold mb-4">Resolve Bug Report</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Resolution Notes (Optional)</label>
          <textarea 
            v-model="resolveNotes" 
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Add notes about how this bug was resolved..."
          ></textarea>
        </div>
        <div class="flex gap-4">
          <button 
            @click="resolveBugReport(resolveModalBugReport.bug_report_id)"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm Resolve
          </button>
          <button 
            @click="resolveModalBugReport = null; resolveNotes = ''"
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
const bugReports = ref([]);
const statusFilter = ref('');
const selectedBugReport = ref(null);
const resolveModalBugReport = ref(null);
const resolveNotes = ref('');
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

const loadBugReports = async () => {
  console.log('[Bug Reports] Loading bug reports', { 
    statusFilter: statusFilter.value
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
    
    if (statusFilter.value !== '') {
      params.append('is_resolved', statusFilter.value);
    }

    const url = `${backendUrl}${apiPrefix}/bug-reports?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        error.value = 'You do not have permission to view bug reports.';
      } else {
        error.value = 'Failed to load bug reports.';
      }
      return;
    }

    const result = await response.json();
    bugReports.value = result.data || [];
    pagination.value = result.pagination || pagination.value;
    
    console.log('[Bug Reports] Bug reports loaded', { count: bugReports.value.length });
  } catch (err) {
    console.error('[Bug Reports] Error', { error: err.message });
    error.value = 'An error occurred while loading bug reports.';
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  pagination.value.page = page;
  loadBugReports();
};

const viewBugReport = async (bugReport) => {
  // If bug report doesn't have resolver info, fetch full details
  if (bugReport.is_resolved && !bugReport.resolver) {
    try {
      const config = useRuntimeConfig();
      let backendUrl = config.public.backendUrl || 'http://localhost:3001';
      backendUrl = backendUrl.replace(/\/$/, '');
      const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
      const url = `${backendUrl}${apiPrefix}/bug-reports/${bugReport.bug_report_id}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        selectedBugReport.value = result.data || bugReport;
      } else {
        selectedBugReport.value = bugReport;
      }
    } catch (err) {
      console.error('[Bug Reports] Error fetching bug report details', { error: err.message });
      selectedBugReport.value = bugReport;
    }
  } else {
    selectedBugReport.value = bugReport;
  }
};

const showResolveModal = (bugReport) => {
  resolveModalBugReport.value = bugReport;
  resolveNotes.value = '';
};

const resolveBugReport = async (bugReportId) => {
  console.log('[Bug Reports] Resolving bug report', { bugReportId });
  
  try {
    const config = useRuntimeConfig();
    let backendUrl = config.public.backendUrl || 'http://localhost:3001';
    backendUrl = backendUrl.replace(/\/$/, '');
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
    const url = `${backendUrl}${apiPrefix}/bug-reports/${bugReportId}/resolve`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resolved_notes: resolveNotes.value || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to resolve bug report.');
      return;
    }

    alert('Bug report resolved successfully!');
    resolveModalBugReport.value = null;
    resolveNotes.value = '';
    selectedBugReport.value = null;
    loadBugReports();
  } catch (err) {
    console.error('[Bug Reports] Error resolving bug report', { error: err.message });
    alert('An error occurred while resolving the bug report.');
  }
};

const unresolveBugReport = async (bugReportId) => {
  if (!confirm('Are you sure you want to mark this bug report as unresolved?')) {
    return;
  }

  console.log('[Bug Reports] Unresolving bug report', { bugReportId });
  
  try {
    const config = useRuntimeConfig();
    let backendUrl = config.public.backendUrl || 'http://localhost:3001';
    backendUrl = backendUrl.replace(/\/$/, '');
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
    const url = `${backendUrl}${apiPrefix}/bug-reports/${bugReportId}/unresolve`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to unresolve bug report.');
      return;
    }

    alert('Bug report marked as unresolved.');
    selectedBugReport.value = null;
    loadBugReports();
  } catch (err) {
    console.error('[Bug Reports] Error unresolving bug report', { error: err.message });
    alert('An error occurred while unresolving the bug report.');
  }
};

onMounted(() => {
  loadBugReports();
});
</script>
