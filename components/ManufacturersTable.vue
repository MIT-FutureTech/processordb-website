<template>
  <div>
    <!-- Controls Container -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <!-- Search and Pagination Container -->
      <div class="flex flex-col sm:flex-row w-full justify-between items-center gap-4">
        <!-- Search Input -->
        <input 
          type="text" 
          v-model="filters.manufacturer" 
          placeholder="Search Manufacturers"
          class="w-3xs sm:w-auto outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs"
        />

        <!-- Pagination Controls -->
        <div class="flex items-center gap-4">
          <!-- Records Info -->
          <div class="text-xs text-gray-600">
            Showing {{ startRecord }}-{{ endRecord }} of {{ pagination.totalRecords }} records
          </div>

          <!-- Pagination Buttons -->
          <div class="flex items-center">
            <button 
              @click="prevPage" 
              :disabled="pagination.currentPage === 1"
              class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs has-tooltip"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <input 
              type="number" 
              v-model.number="pagination.currentPage" 
              min="1" 
              :max="pagination.totalPages"
              class="w-12 text-center outline-none bg-white border-[#A3203555] border rounded px-3 py-2 text-gray-700 text-xs hide-arrow"
            />

            <button 
              @click="nextPage" 
              :disabled="pagination.currentPage === pagination.totalPages"
              class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs has-tooltip"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="w-full">
      <TableCaption v-if="displayedManufacturers.length === 0">No Manufacturers found.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead 
            v-for="column in displayedColumns" 
            :key="column.value"
            class="cursor-pointer text-gray-700 opacity-80"
            @click="sortBy(column.value)"
          >
            <div class="flex items-center flex-nowrap gap-2 text-nowrap">
              {{ column.label }}
              <span v-if="sortField === column.value">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow 
          v-for="manufacturer in displayedManufacturers" 
          :key="manufacturer.manufacturer_name"
          class="hover:bg-[#F1F5F9] even:bg-gray-50"
        >
          <TableCell>
            <span class="text-[#A32035]">
              {{ manufacturer.manufacturer_name }}
            </span>
          </TableCell>

          <TableCell>
            <span class="text-[#A32035]">
              {{ manufacturer.cpus }}
            </span>
          </TableCell>

          <TableCell>
            <span class="text-[#A32035]">
              {{ manufacturer.gpus }}
            </span>
          </TableCell>

          <TableCell>
            <span class="text-[#A32035]">
              {{ manufacturer.fpgas }}
            </span>
          </TableCell>

          <TableCell>
            <span class="text-[#A32035]">
              {{ manufacturer.total }}
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps({
  manufacturerCounts: {
    type: Object,
    required: true
  }
})

// Transform manufacturerCounts into a displayable array
const manufacturerData = computed(() => {
  return Object.entries(props.manufacturerCounts).map(([manufacturer, counts]) => ({
    manufacturer_name: manufacturer,
    cpus: counts.cpu || 0,
    gpus: counts.gpu || 0,
    fpgas: counts.fpga || 0,
    total: Object.values(counts).reduce((sum, count) => sum + count, 0)
  }))
})

// Pagination and sorting setup
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 20,
  get totalPages() { 
    return Math.ceil(manufacturerData.value.length / this.itemsPerPage) 
  },
  get totalRecords() { 
    return manufacturerData.value.length 
  }
})

const filters = ref({
  manufacturer: ''
})

const sortField = ref('total')
const sortOrder = ref('desc')

// Computed properties for filtering and sorting
const filteredManufacturers = computed(() => {
  return manufacturerData.value
    .filter(m => 
      m.manufacturer_name.toLowerCase().includes(filters.value.manufacturer.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortOrder.value === 'asc' ? 1 : -1
      return modifier * (a[sortField.value] - b[sortField.value])
    })
})

// Pagination-related computed properties
const displayedManufacturers = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
  const end = start + pagination.value.itemsPerPage
  return filteredManufacturers.value.slice(start, end)
})

const startRecord = computed(() => 
  (pagination.value.currentPage - 1) * pagination.value.itemsPerPage + 1
)

const endRecord = computed(() => 
  Math.min(
    pagination.value.currentPage * pagination.value.itemsPerPage, 
    filteredManufacturers.value.length
  )
)

// Pagination methods
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

// Sorting method
const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
}

// Columns definition
const displayedColumns = [
  { value: 'manufacturer_name', label: 'Manufacturer' },
  { value: 'cpus', label: 'CPUs' },
  { value: 'gpus', label: 'GPUs' },
  { value: 'fpgas', label: 'FPGAs' },
  { value: 'total', label: 'Total' }
]

const selectedColumns = ref(['manufacturer_name', 'cpus', 'gpus', 'fpgas', 'total'])
</script>

<style scoped>
/* Add any custom styles here */
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