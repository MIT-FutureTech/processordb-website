<template>
  <div>
    <!-- Controls Container -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <!-- Search and Pagination Container -->
      <div class="flex flex-col sm:flex-row w-full justify-between items-center gap-4">
        <!-- Search Input -->
        <input 
          type="text" 
          v-model="filters.userSearch" 
          placeholder="Search by Name or Email"
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
              class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs"
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
              class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs"
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
      <TableCaption v-if="displayedUsers.length === 0">
        No users found.
      </TableCaption>

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
          v-for="user in displayedUsers" 
          :key="user.user_id"
          class="hover:bg-[#F1F5F9] even:bg-gray-50"
        >
          <TableCell>
            <span class="text-[#A32035]">
              {{ user.name }}
            </span>
          </TableCell>

          <TableCell>
            <span class="text-[#A32035]">
              {{ user.email }}
            </span>
          </TableCell>

          <TableCell>
            <span class="text-[#A32035]">
              {{ user.role }}
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </table>
  </div>
</template>

<script setup lang="js">
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
  userData: {
    type: Array,
    required: true
  }
})

// 1) Transform raw user data into a displayable array.
const userDisplayData = computed(() => {
  return props.userData.map((user) => ({
    user_id: user.user_id,
    name: user.username,
    email: user.email,
    // If user has multiple roles, join them into one comma-separated string
    role: user.Roles.map(r => r.role_name).join(', '),
  }))
})

// 2) Pagination setup
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 5,
  get totalPages() {
    return Math.ceil(filteredUsers.value.length / this.itemsPerPage)
  },
  get totalRecords() {
    return filteredUsers.value.length
  }
})

// 3) Filters for searching
const filters = ref({
  userSearch: ''
})

// 4) Sorting setup
const sortField = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// 5) Apply filtering and sorting
const filteredUsers = computed(() => {
  const searchTerm = filters.value.userSearch.toLowerCase()
  return userDisplayData.value
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      const fieldA = a[sortField.value] || ''
      const fieldB = b[sortField.value] || ''
      const modifier = sortOrder.value === 'asc' ? 1 : -1
      return modifier * fieldA.toString().localeCompare(fieldB.toString())
    })
})

// 6) Slice the filtered data for the current page
const displayedUsers = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
  const end = start + pagination.value.itemsPerPage
  return filteredUsers.value.slice(start, end)
})

// 7) Dynamic columns definition
const displayedColumns = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Role' }
]

// 8) Utility for showing record range
const startRecord = computed(() => 
  (pagination.value.currentPage - 1) * pagination.value.itemsPerPage + 1
)

const endRecord = computed(() => 
  Math.min(
    pagination.value.currentPage * pagination.value.itemsPerPage, 
    filteredUsers.value.length
  )
)

// 9) Pagination methods
function nextPage() {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    pagination.value.currentPage++
  }
}
function prevPage() {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
  }
}

// 10) Sorting method
function sortBy(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}
</script>

<style scoped>
/* You can keep the same style rules, adjust as needed. */
.hide-arrow[type="number"]::-webkit-inner-spin-button,
.hide-arrow[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
