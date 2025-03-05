<template>
  <div>
    <!-- Top Controls -->
    <div class="flex justify-between gap-4 items-center mb-4">
      <div class="flex justify-start gap-4 items-center">
        <!-- Optional slot for extra filters -->
        <slot name="filters"></slot>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div class="mr-4">
          Showing {{ startRecord }}-{{ endRecord }} of {{ pagination.totalRecords }} records
        </div>
        <input type="text" v-model="searchQuery" placeholder="Search"
          class="mr-2 outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs" />

        <!-- Pagination Controls -->
        <div class="flex items-center">
          <button @click="prevPage" :disabled="pagination.currentPage === 1"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-xs has-tooltip">
            <span class="tooltip rounded shadow-lg p-2 bg-white text-[#A32035] -mt-12 -ml-12">
              Previous page
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <input type="number" v-model.number="pagination.currentPage" :min="1" :max="pagination.totalPages"
            class="max-w-12 text-center outline-none bg-white border-[#A32035] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs hide-arrow" />
          <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs has-tooltip">
            <span class="tooltip rounded shadow-lg p-2 bg-white text-[#A32035] -mt-12 -ml-6">
              Next page
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <!-- Show/Hide Columns Dropdown -->
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="outline-none bg-white hover:bg-gray-100 border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs">
              Show/Hide Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent class="max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-for="column in allColumns" :key="column.value" asChild>
                <label class="flex items-center gap-2 cursor-pointer px-2 py-1" :class="{
                  'border border-[#A32035] text-[#A32035] px-2 py-1 rounded': selectedColumns.includes(column.value)
                }">
                  <input type="checkbox" class="hidden" v-model="selectedColumns" :value="column.value" />
                  <span>{{ column.label }}</span>
                </label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <!-- Exoprt Data -->
      <div>
        <button @click="exportData"
          class="outline-none bg-white hover:bg-gray-100 border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs">
          Export Data
          <svg class="mr-2 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

    </div>

    <!-- Table Container with Horizontal Scroll -->
    <div :class="{ 'overflow-x-auto': displayedColumns.length > defaultColumnsOrder.length }">
      <Table class="table-auto w-full">
        <TableCaption v-if="displayedData.length === 0">No records found.</TableCaption>
        <TableHeader>
          <TableRow>
            <!-- Loop through the selectable columns -->
            <TableHead v-for="column in displayedColumns" :key="column.value"
              class="cursor-pointer text-[#A32035] opacity-80" @click="sortBy(column.value)">
              <div class="flex items-center gap-2">
                {{ column.label }}
                <span v-if="sortField === column.value">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </TableHead>
            <!-- Fixed Details Column -->
            <TableHead key="details" class="cursor-default text-[#A32035] opacity-80">
              <div class="flex items-center gap-2">Details</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in displayedData" :key="uniqueId(row)" class="hover:bg-[#F1F5F9] even:bg-gray-50">
            <!-- Loop through the selectable columns -->
            <TableCell v-for="column in displayedColumns" :key="column.value">
              <span class="text-black">
                <template v-if="column.value === 'release_date'">
                  {{ formatYear(row[column.value]) }}
                </template>
                <template v-else>
                  {{ row[column.value] }}
                </template>
              </span>
            </TableCell>
            <!-- Fixed Details Column Cell -->
            <TableCell key="details">
              <NuxtLink class="text-[#A32035] hover:underline" :to="`/${props.className}/${uniqueId(row)}`">
                Details
              </NuxtLink>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NuxtLink } from '#components'

// --- Props ---
// - data: an array of objects (either CPU or GPU objects)
// - className: a string ("cpu" or "gpu") indicating the type of data
const props = defineProps({
  data: { type: Array, required: true },
  className: { type: String, required: true },
})

// --- Helper: Format Year ---
// Returns only the year from a date.
const formatYear = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric' })
}

// --- Helper: Unique ID ---
// For CPUs, use cpu_id; for GPUs, use gpu_id.
const uniqueId = (row) => {
  return props.className === 'cpu' ? row.cpu_id : row.gpu_id
}

// --- Helper: Format Column Label ---
// Capitalizes keys (e.g. "cpu_id" becomes "Cpu Id")
function formatColumnLabel(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// --- Flatten Data ---
// For CPU objects, extract manufacturer and release_date from SoC and add processor_type.
// For GPU objects, add processor_type and ensure a model field is available.
const flattenedData = computed(() => {
  if (props.className === 'cpu') {
    return props.data.map((item) => ({
      ...item,
      manufacturer: item.SoC?.Manufacturer?.name || '',
      release_date: item.SoC?.release_date || '',
      processor_type: 'CPU'
    }))
  } else if (props.className === 'gpu') {
    return props.data.map((item) => ({
      ...item,
      manufacturer: item.SoC?.Manufacturer?.name || '',
      release_date: item.SoC?.release_date || '',
      processor_type: 'GPU',
      model: item.model || item.name || '',
      family: item.architecture || '',
      microarchitecture: item.generation || '',
      clock: item.base_clock || item.boost_clock || null,
      tdp: item.tdp || null,
    }))
  }
  return props.data
})

// --- Default Columns (Visible by Default) ---
// These columns appear by default and in this fixed order.
const defaultColumnsOrder = [
  { label: 'Manufacturer', value: 'manufacturer' },
  { label: 'Processor Type', value: 'processor_type' },
  { label: 'Processor Family', value: 'family' },
  { label: 'Microarchitecture', value: 'microarchitecture' },
  { label: 'Model', value: 'model' },
  { label: 'Release Date', value: 'release_date' },
  { label: 'Clock (MHz)', value: 'clock' },
  { label: 'TDP (W)', value: 'tdp' },
]
const defaultColumnsOrderKeys = defaultColumnsOrder.map(col => col.value)

// --- Default Hidden Keys ---
// In addition to removing cpu_id/gpu_id, hide other system attributes.
const defaultHiddenKeys = {
  cpu: ['cpu_id', 'createdAt', 'updatedAt', 'soc_id', 'SoC', 'notes'],
  gpu: ['gpu_id', 'createdAt', 'updatedAt', 'soc_id', 'SoC', 'cores', 'notes', 'l0_cache', 'l1_cache', 'l2_cache', 'l3_cache', 'fp16', 'fp32', 'fp64', 'pixel_shader', 'vertex_shader', 'shader_units', 'texture_mapping_units', 'render_output_units', 'compute_units', 'ray_tracing_units', 'system_shared_memory'],
}

// --- Additional Columns ---
// Any keys in the first flattened object that are not in defaultColumnsOrderKeys
// and not in the default hidden keys become additional (optional) columns.
const additionalColumns = computed(() => {
  const dataArr = flattenedData.value
  if (!dataArr.length) return []
  const firstItem = dataArr[0]
  const keys = Object.keys(firstItem)
  const hidden = defaultHiddenKeys[props.className] || []
  const filteredKeys = keys.filter((key) => {
    if (defaultColumnsOrderKeys.includes(key)) return false
    if (hidden.includes(key)) return false
    const value = firstItem[key]
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) return false
    return true
  })
  return filteredKeys.map(key => ({
    label: formatColumnLabel(key),
    value: key,
  }))
})

const exportData = () => {
  if (!flattenedData.value?.length) {
    console.error('No data to export');
    return;
  }

  // Filter and prepare columns
  const originalColumns = Object.keys(flattenedData.value[0]);
  const filteredColumns = originalColumns.filter(key => 
    !['SoC', 'processor_type', 'createdAt', 'updatedAt'].includes(key)
  );

  // Create CSV content with proper formatting
  const csvRows = [];
  
  // Add uppercase header row
  csvRows.push(
    filteredColumns
      .map(column => `"${column.toUpperCase().replace(/"/g, '""')}"`)
      .join(',')
  );

  // Add data rows using original column names
  for (const item of flattenedData.value) {
    const row = filteredColumns.map(key => {
      const value = item[key] ?? '';
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(row.join(','));
  }

  // Create and download file
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${props.className || 'export'}.csv`);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// --- Combine Columns ---
// The full list of columns is the default ones (in the fixed order) followed by any additional columns.
const allColumns = computed(() => {
  return [...defaultColumnsOrder, ...additionalColumns.value]
})

// --- Manage Selected Columns ---
// By default, only the default columns are selected.
const selectedColumns = ref(defaultColumnsOrder.map(col => col.value))
watch(allColumns, () => {
  // Do not auto-select additional columns; keep default selection.
})
// The columns to display are those in allColumns that are selected.
const displayedColumns = computed(() =>
  allColumns.value.filter(col => selectedColumns.value.includes(col.value))
)

// --- Search, Sorting, and Pagination ---
const searchQuery = ref('')
const sortField = ref('')
const sortOrder = ref('asc')

// Filter the flattened data based on the search query (searching across displayed columns)
const filteredData = computed(() => {
  if (!searchQuery.value) return flattenedData.value
  return flattenedData.value.filter(item =>
    displayedColumns.value.some(col => {
      const cellValue = item[col.value]
      if (cellValue === null || cellValue === undefined) return false
      return cellValue.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
    })
  )
})

// Sort the filtered data.
// If no sort field is selected, sort by release_date (year) descending,
// treating rows without a release_date as having a very low year value.
const sortedData = computed(() => {
  let dataToSort = [...filteredData.value]
  if (!sortField.value) {
    return dataToSort.sort((a, b) => {
      const aYear = a.release_date ? new Date(a.release_date).getFullYear() : -Infinity
      const bYear = b.release_date ? new Date(b.release_date).getFullYear() : -Infinity
      return bYear - aYear
    })
  }
  return dataToSort.sort((a, b) => {
    const aVal = a[sortField.value] || ''
    const bVal = b[sortField.value] || ''
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

// Pagination state and computed slice of data.
const pagination = ref({
  currentPage: 1,
  pageSize: 50,
  totalRecords: 0,
  totalPages: 0,
})
const displayedData = computed(() => {
  pagination.value.totalRecords = sortedData.value.length
  pagination.value.totalPages = Math.ceil(sortedData.value.length / pagination.value.pageSize)
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return sortedData.value.slice(start, end)
})
const startRecord = computed(() => (pagination.value.currentPage - 1) * pagination.value.pageSize + 1)
const endRecord = computed(() =>
  Math.min(pagination.value.currentPage * pagination.value.pageSize, pagination.value.totalRecords)
)

const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    pagination.value.currentPage++
  }
}
const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
  }
}

// Sorting handler: clicking a header toggles sort order.
const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}
</script>

<style scoped>
.table-auto th {
  background-color: #f9fafb;
}

.table-auto th:hover {
  background-color: #f1f5f9;
}

.hide-arrow[type="number"]::-webkit-inner-spin-button,
.hide-arrow[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.tooltip {
  @apply invisible absolute;
}

.has-tooltip:hover .tooltip {
  @apply visible z-50;
}
</style>