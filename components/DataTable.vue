<template>
    <div>
        
        <div class="flex justify-end  gap-2 items-center mb-4 text-xs">
            <input type="text" v-model="filters.manufacturer" placeholder="Filter by Manufacturer"
                class="border p-2 mr-2" />
            <select v-model="filters.processorType" class="border p-2 mr-2">
                <option value="">All</option>
                <option value="CPU">CPU</option>
                <option value="GPU">GPU</option>
            </select>
            <div class="mr-4">
                Showing {{ displayedSocs.length }} of {{ pagination.totalRecords }} records
            </div>

            <!-- Pagination Control -->
            <div class="flex items-center space-x-2">
                <button @click="prevPage" :disabled="pagination.currentPage === 1"
                    class="px-2 py-1 bg-[#A32035] text-white disabled:opacity-50 text-xs">
                    < </button>
                        <input type="number" v-model.number="pagination.currentPage" min="1"
                            :max="pagination.totalPages" class="border p-1 max-w-12 text-center text-xs hide-arrow" />
                        <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
                            class="px-2 py-1 bg-[#A32035] text-white disabled:opacity-50 text-xs">
                            >
                        </button>
            </div>

            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger class="px-1 py-1 bg-[#A32035] text-white"><svg
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem v-for="column in allColumns" :key="column.value">
                            <label class="block">
                                <input type="checkbox" v-model="selectedColumns" :value="column.value" />
                                {{ column.label }}
                            </label>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>

        <!-- SoC Table -->
        <table class="table-auto w-full border-collapse border border-gray-200 text-xs text-left">
            <thead>
                <tr>
                    <th v-for="column in displayedColumns" :key="column.value" class="border px-2 py-0.5 cursor-pointer"
                        @click="sortBy(column.value)">
                        {{ column.label }}
                        <span v-if="sortField === column.value">
                            {{ sortOrder === 'asc' ? '↑' : '↓' }}
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="hover:bg-[#F1F5F9] even:bg-gray-50" v-for="soc in displayedSocs" :key="soc.soc_id">
                    <td v-if="selectedColumns.includes('manufacturer_name')" class="border px-2 py-0.5">
                        {{ soc.manufacturer_name }}
                    </td>
                    <td v-if="selectedColumns.includes('soc_name')" class="border px-2 py-0.5">
                        {{ soc.soc_name }}
                    </td>
                    <td v-if="selectedColumns.includes('processor_type')" class="border px-2 py-0.5">
                        <div v-for="processor in soc.processors" :key="processor.model">
                            {{ processor.processor_type }}
                        </div>
                    </td>
                    <td v-if="selectedColumns.includes('processor_family')" class="border px-2 py-0.5">
                        <div v-for="processor in soc.processors" :key="processor.family">
                            {{ processor.family || 'N/A' }}
                        </div>
                    </td>
                    <td v-if="selectedColumns.includes('model')" class="border px-2 py-0.5">
                        <div v-for="processor in soc.processors" :key="processor.model">
                            {{ processor.model || 'N/A' }}
                        </div>
                    </td>
                    <td v-if="selectedColumns.includes('release_date')" class="border px-2 py-0.5">
                        {{ formatDate(soc.release_date) }}
                    </td>
                    <td v-if="selectedColumns.includes('clock')" class="border px-2 py-0.5">
                        <div v-for="processor in soc.processors" :key="processor.clock">
                            {{ processor.clock ? processor.clock + ' GHz' : 'N/A' }}
                        </div>
                    </td>
                    <td v-if="selectedColumns.includes('tdp')" class="border px-2 py-0.5">
                        <div v-for="processor in soc.processors" :key="processor.tdp">
                            {{ processor.tdp ? processor.tdp + ' W' : 'N/A' }}
                        </div>
                    </td>
                    <td v-if="selectedColumns.includes('details')" class="border px-2 py-0.5 text-[#A32035] hover:underline">
                        <NuxtLink :to="`/database/soc/${soc.soc_id}`">Details</NuxtLink>
                    </td>
                </tr>
            </tbody>
        </table>


    </div>
</template>

<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
const props = defineProps({
    data: {
        type: Array,
        required: true,
    }
})


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
const sortField = ref('')
const sortOrder = ref('asc')

// State for filters
const filters = ref({
    manufacturer: '',
    processorType: '',
})

// State for selected columns
const allColumns = [
    { label: 'Manufacturer', value: 'manufacturer_name' },
    { label: 'SoC Name', value: 'soc_name' },
    { label: 'Processor Type', value: 'processor_type' },
    { label: 'Processor Family', value: 'processor_family' },
    { label: 'Model', value: 'model' },
    { label: 'Release Date', value: 'release_date' },
    { label: 'Clock (GHz)', value: 'clock' },
    { label: 'TDP (W)', value: 'tdp' },
    { label: 'Details', value: 'details' },
]

const selectedColumns = ref(allColumns.map((column) => column.value))

// Computed property for displayed columns
const displayedColumns = computed(() =>
    allColumns.filter((column) => selectedColumns.value.includes(column.value))
)

// Computed property for displayed SoCs
const displayedSocs = ref([])

// Function to apply filters, sorting, and pagination
const applyFiltersAndSorting = () => {
    let filteredSocs = socs.value

    // Apply filters
    if (filters.value.manufacturer) {
        filteredSocs = filteredSocs.filter((soc) =>
            soc.manufacturer_name
                ?.toLowerCase()
                .includes(filters.value.manufacturer.toLowerCase()) ||
            soc.name?.toLowerCase().includes(filters.value.manufacturer.toLowerCase()) 
        )
    }
    if (filters.value.processorType) {
        filteredSocs = filteredSocs.filter((soc) => {
            if (soc.processors == null) return false
            return filters.value.processorType === '' ||
                soc.processors.some((processor) =>
                    (processor.processor_type || '')
                        ?.toLowerCase()
                        .includes(filters.value.processorType.toLowerCase())
                )
        }
        )
    }

    // Apply sorting (case-insensitive)
    if (sortField.value) {
        filteredSocs.sort((a, b) => {
            const aValue = getFieldValue(a, sortField.value).toLowerCase()
            const bValue = getFieldValue(b, sortField.value).toLowerCase()
            if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
            if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
            return 0
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
    const start =
        (pagination.value.currentPage - 1) * pagination.value.pageSize
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

// Helper function to get field value for sorting
const getFieldValue = (soc, field) => {
    if (field === 'manufacturer_name' || field === 'soc_name' || field === 'release_date') {
        return soc[field] || ''
    } else if (
        [
            'processor_type',
            'processor_family',
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

// Helper function to format date
const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
    })
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