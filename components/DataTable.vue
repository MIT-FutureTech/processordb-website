<template>
  <div>
    <div class="flex justify-between gap-4 items-center mb-4">
      <div class="flex justify-start gap-4 items-center ">
        <slot name="filters"></slot>
      </div>

      <div class="flex justify-center sm:justify-end flex-wrap   gap-2 items-center text-xs">
        <input type="text" v-model="filters.manufacturer" placeholder="Search processors"
          class="mr-8 outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2  text-gray-700  text-xs" />
        <div class="mr-4">
          Showing {{ startRecord }}-{{ endRecord }} of {{ pagination.totalRecords }} records
        </div>

        <!-- Pagination Control -->
        <div class="flex items-center ">
          <button @click="prevPage" :disabled="pagination.currentPage === 1"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700  text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <input type="number" v-model.number="pagination.currentPage" min="1" :max="pagination.totalPages"
            class=" max-w-12 text-center outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2  text-gray-700  text-xs hide-arrow" />
          <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700  text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>

          </button>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="outline-none bg-white hover:bg-gray-100 border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2  text-gray-700  text-xs">
              Show/hide columns
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-for="column in allColumns" :key="column.value" asChild>
                <label class="flex items-center gap-2 cursor-pointer"
                  :class="{ 'border border-[#A32035] text-[#A32035] px-2 py-1 rounded': selectedColumns.includes(column.value) }">
                  <input type="checkbox" class="hidden" v-model="selectedColumns" :value="column.value" />
                  <span>{{ column.label }}</span>
                </label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </div>

    <Table>
      <!-- empty table -->
      <TableCaption v-if="displayedSocs.length === 0">No SoCs found.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead v-for="column in displayedColumns" :key="column.value"
            class="cursor-pointer text-white opacity-80" @click="sortBy(column.value)">
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
        <TableRow v-for="(soc, index) in displayedSocs" :key="soc.soc_id"
          class="hover:bg-[#F1F5F9] even:bg-gray-50">
          <TableCell v-if="selectedColumns.includes('manufacturer_name')">
            <NuxtLink class="text-[#A32035] hover:underline"
              :to="`/database/manufacturer/${slugify(soc.manufacturer_name)}`">
              {{ soc.manufacturer_name }}
            </NuxtLink>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('processor_type')">
            <div v-for="processor in soc.processors" :key="processor.model">
              <NuxtLink class="text-[#A32035] hover:underline"
                :to="`/database/processorType/${slugify(processor.processor_type)}`">
                {{ processor.processor_type }}
              </NuxtLink>
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('processor_family')">
            <div v-for="processor in soc.processors" :key="processor.family">
              <NuxtLink class="text-[#A32035] hover:underline"
                :to="`/database/manufacturer/${slugify(soc.manufacturer_name)}/family/${slugify(processor.family)}`">
                {{ processor.family }}
              </NuxtLink>
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('microarchitecture')">
            <div v-for="processor in soc.processors" :key="processor.microarchitecture">
              <NuxtLink class="text-[#A32035] hover:underline"
                :to="`/database/manufacturer/${slugify(soc.manufacturer_name)}/microarchitecture/${slugify(processor.microarchitecture)}`">
                {{ processor.microarchitecture }}
              </NuxtLink>
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('model')">
            <div v-for="processor in soc.processors" :key="processor.model">
              <NuxtLink class="text-[#A32035] hover:underline" :to="`/database/soc/${soc.soc_id}`">
                {{ processor.model }}
              </NuxtLink>
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('release_date')">
            {{ formatDate(soc.release_date) }}
          </TableCell>
          <TableCell v-if="selectedColumns.includes('clock')">
            <div v-for="processor in soc.processors" :key="processor.clock">
              {{ processor.clock ? processor.clock + ' MHz' : '' }}
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('tdp')">
            <div v-for="processor in soc.processors" :key="processor.tdp">
              {{ processor.tdp ? processor.tdp + ' W' : '' }}
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('die_sizes')">
            {{ soc.die_sizes ? soc.die_sizes + ' mm²' : '' }}
          </TableCell>
          <TableCell v-if="selectedColumns.includes('total_transistor_count')">
            {{ soc.total_transistor_count ? soc.total_transistor_count + ' million' : '' }}
          </TableCell>
          <TableCell v-if="selectedColumns.includes('lithography')">
            <div v-for="processor in soc.processors" :key="processor.lithography">
              {{ processor.lithography ? processor.lithography + ' nm' : '' }}
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('fp64_ops')">
            <div v-for="processor in soc.processors" :key="processor.fp64_ops">
              {{ processor.fp64_ops ? processor.fp64_ops + ' GFLOPS' : '' }}
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('fp32_ops')">
            <div v-for="processor in soc.processors" :key="processor.fp32_ops">
              {{ processor.fp32_ops ? processor.fp32_ops + ' GFLOPS' : '' }}
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('fp16_ops')">
            <div v-for="processor in soc.processors" :key="processor.fp16_ops">
              {{ processor.fp16_ops ? processor.fp16_ops + ' GFLOPS' : '' }}
            </div>
          </TableCell>
          <TableCell v-if="selectedColumns.includes('details')">
            <NuxtLink class="text-[#A32035] hover:underline" :to="`/database/soc/${soc.soc_id}`">Details
            </NuxtLink>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

  </div>
</template>

<script setup lang="js">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  data: {
    type: Array,
    required: true,
  }
})


const emit = defineEmits(['filteredData'])


// State for SoCs
const socs = ref(props.data)

// Dropdown state for column selection
const showColumnDropdown = ref(false)
const toggleColumnDropdown = () => {
  showColumnDropdown.value = !showColumnDropdown.value
}

// State for pagination
const pagination = ref({
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 50,
})


// State for sorting
const sortField = ref('release_date')
const sortOrder = ref('desc')

// State for filters
const filters = ref({
  manufacturer: '',
  processorType: '',
})
// Computed property for the starting record index
const startRecord = computed(() => {
  return (pagination.value.currentPage - 1) * pagination.value.pageSize + 1
})

// Computed property for the ending record index
const endRecord = computed(() => {
  return Math.min(
    pagination.value.currentPage * pagination.value.pageSize,
    pagination.value.totalRecords
  )
})

// State for selected columns
const allColumns = [
  { label: 'Manufacturer', value: 'manufacturer_name' },
  { label: 'Processor Type', value: 'processor_type' },
  { label: 'Processor Family', value: 'processor_family' },
  { label: 'Microarchitecture', value: 'microarchitecture' },
  { label: 'Model', value: 'model' },
  { label: 'Release Date', value: 'release_date' },
  { label: 'Clock (MHz)', value: 'clock' },
  { label: 'TDP (W)', value: 'tdp' },
  { label: 'Die Size (mm^2)', value: 'die_sizes', hiddenBydefault: true },
  { label: 'Transistors (million)', value: 'total_transistor_count', hiddenBydefault: true },
  { label: 'Lithography (nm)', value: 'lithography', hiddenBydefault: true },
  { label: 'FP64 Operations (GFLOPS)', value: 'fp64_ops', hiddenBydefault: true },
  { label: 'FP32 Operations (GFLOPS)', value: 'fp32_ops', hiddenBydefault: true },
  { label: 'FP16 Operations (GFLOPS)', value: 'fp16_ops', hiddenBydefault: true },
  { label: 'Details', value: 'details' },
]

const selectedColumns = ref(allColumns.filter((column) => !column.hiddenBydefault).map((column) => column.value))

// Computed property for displayed columns
const displayedColumns = computed(() =>
  allColumns.filter((column) => selectedColumns.value.includes(column.value))
)

// Computed property for displayed SoCs
const displayedSocs = ref([])

// Helper function to get field value for sorting
const getFieldValue = (soc, field) => {
  if (field === 'manufacturer_name' || field === 'soc_name' || field === 'release_date') {
    return soc[field] || ''
  } else if (
    [
      'processor_type',
      'processor_family',
      'microarchitecture',
      'model',
      'clock',
      'tdp',
    ].includes(field)
  ) {
    // For processor fields, get the first processor's field value
    if (soc.processors && soc.processors.length > 0) {
      const processor = soc.processors[0]
      const processorField =
        field === 'processor_family' ? 'family' : field
      return processor[processorField] || ''
    }
    return ''
  }
  return ''
}
const stringSortFields = [
  'manufacturer_name',
  'processor_type',
  'processor_family',
  'microarchitecture',
  'model'
]

// Function to apply filters, sorting, and pagination
const applyFiltersAndSorting = () => {
  let filteredSocs = socs.value

  // Apply filters
  if (filters.value.manufacturer) {
    filteredSocs = filteredSocs.filter((soc) =>
      soc.manufacturer_name?.toLowerCase().includes(filters.value.manufacturer.toLowerCase()) ||
      soc.soc_name?.toLowerCase().includes(filters.value.manufacturer.toLowerCase())
    )
  }

  // Apply sorting (case-insensitive)
  if (sortField.value) {
    filteredSocs.sort((a, b) => {
      const aValue = getFieldValue(a, sortField.value)
      const bValue = getFieldValue(b, sortField.value)

      // Handle null or empty values to always appear last
      const aIsEmpty = aValue == null || aValue === ''
      const bIsEmpty = bValue == null || bValue === ''

      if (aIsEmpty && !bIsEmpty) return 1
      if (!aIsEmpty && bIsEmpty) return -1

      // Determine sorting method based on column type
      const useStringSort = stringSortFields.includes(sortField.value)
      const aParsed = useStringSort ? aValue.toString().toLowerCase() : parseFloat(aValue)
      const bParsed = useStringSort ? bValue.toString().toLowerCase() : parseFloat(bValue)

      // Primary sort based on parsed values
      if (aParsed < bParsed) return sortOrder.value === 'asc' ? -1 : 1
      if (aParsed > bParsed) return sortOrder.value === 'asc' ? 1 : -1

      // Secondary sort by unique identifier to ensure stability
      return a.soc_id < b.soc_id ? -1 : 1
    })
  }

  // Update total records and pages
  pagination.value.pageSize = Number(pagination.value.pageSize)
  pagination.value.totalRecords = filteredSocs.length
  pagination.value.totalPages = Math.ceil(
    pagination.value.totalRecords / pagination.value.pageSize
  )

  // Ensure current page is within total pages
  if (pagination.value.currentPage > pagination.value.totalPages) {
    pagination.value.currentPage = pagination.value.totalPages || 1
  }

  // Apply pagination
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  displayedSocs.value = filteredSocs.slice(start, end)
}



watch(socs, () => {
  applyFiltersAndSorting()
}, {
  immediate: true
})

// Watchers
watch(
  [filters, sortField, sortOrder, pagination],
  () => {
    applyFiltersAndSorting()
  },
  { deep: true }
)

// Pagination functions
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

// Sorting function
const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Helper function to format date
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
  })
}

function slugify(str) {
  if (!str) return ''

  return str
    .toLowerCase()
    .replace(/[^\w- ]+/g, '') // Allow hyphens by excluding them from the pattern
    .replace(/ +/g, '-')      // Replace spaces with hyphens
}
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
</style>