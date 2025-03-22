<template>
  <div class="p-4">
    <!-- Controls Container (Search + Pagination) -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <!-- Search Input -->
      <input type="text" v-model="filters.userSearch" placeholder="Search by Name or Email"
        class="w-3xs sm:w-auto outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs" />

      <!-- Pagination Controls -->
      <div class="flex items-center gap-4">
        <!-- Records Info -->
        <div class="text-xs text-gray-600">
          Showing {{ startRecord }} - {{ endRecord }} of {{ pagination.totalRecords }} records
        </div>

        <div class="flex items-center">
          <!-- Previous Page Button -->
          <button @click="prevPage" :disabled="pagination.currentPage === 1"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs disabled:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <!-- Current Page Input -->
          <input type="number" v-model.number="pagination.currentPage" min="1" :max="pagination.totalPages"
            class="w-12 text-center outline-none bg-white border-[#A3203555] border rounded px-3 py-2 text-gray-700 text-xs hide-arrow" />

          <!-- Next Page Button -->
          <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs disabled:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="w-full">
      <!-- Display a caption when no users are found -->
      <TableCaption v-if="displayedUsers.length === 0">
        No users found.
      </TableCaption>

      <!-- Table Header -->
      <TableHeader>
        <TableRow>
          <TableHead v-for="column in displayedColumns" :key="column.value"
            class="cursor-pointer text-gray-700 opacity-80" @click="sortBy(column.value)">
            <div class="flex items-center flex-nowrap gap-2 text-nowrap">
              {{ column.label }}
              <span v-if="sortField === column.value">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </TableHead>
          <!-- We’ll add an extra column header for “Actions” below if needed -->
          <TableHead class="opacity-80">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <!-- Table Body -->
      <TableBody>
        <TableRow v-for="user in displayedUsers" :key="user.user_id" class="hover:bg-[#F1F5F9] even:bg-gray-50">
          <TableCell>
            <span class="text-[#A32035]">{{ user.name }}</span>
          </TableCell>
          <TableCell>
            <span class="text-[#A32035]">{{ user.email }}</span>
          </TableCell>
          <TableCell>
            <span class="text-[#A32035]">{{ user.role }}</span>
          </TableCell>
          <TableCell v-if="canEdit">
            <button @click="editUser(user)" class="text-[#A32035]">
              Edit
            </button>
          </TableCell>
        </TableRow>
      </TableBody>
    </table>

    <!-- Edit User Modal Overlay -->
    <div v-if="showEditModal"
      class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <!-- Modal Content -->
      <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">Edit User</h2>

        <div class="mb-4">
          <label class="block text-sm mb-1">Name</label>
          <input class="w-full border px-3 py-2 text-sm" type="text" v-model="editedUser.name" />
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-1">Role</label>
          <select class="w-full border px-3 py-2 text-sm" v-model="editedUser.role">
            <option v-for="roleOption in allRoles" :key="roleOption" :value="roleOption">
              {{ roleOption }}
            </option>
          </select>
        </div>

        <div v-if="successMessage" class="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {{ errorMessage }}
        </div>

        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 border rounded" @click="closeModal">
            Cancel
          </button>
          <button class="px-4 py-2 bg-[#A32035] text-white rounded" @click="saveEdits">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Replace these imports with wherever your UI components come from.
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getRole } from '@/lib/isLogged'

// Props
const props = defineProps({
  userData: {
    type: Array,
    required: true,
  },
})

const successMessage = ref('')
const errorMessage = ref('')

const canEdit = ref(false)
const editRoles = ['admin', 'leader', 'rollbacker']

onMounted(() => {
  canEdit.value = editRoles.includes(getRole());
});

const allRoles = ['leader', 'rollbacker', 'admin', 'editor']

// Transform raw user data into a computed array for display
// (Mapping user.username to a field called 'name', etc.)
const userDisplayData = computed(() => {
  return props.userData.map((user) => ({
    user_id: user.user_id,
    name: user.username,
    email: user.email,
    // If user has multiple roles, join them into one string
    role: user.Roles.map((r) => r.role_name).join(', '),
  }))
})

// Pagination
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 5,
  get totalPages() {
    return Math.ceil(filteredUsers.value.length / this.itemsPerPage)
  },
  get totalRecords() {
    return filteredUsers.value.length
  },
})

// Filters (e.g. for searching)
const filters = ref({
  userSearch: '',
})

// Sorting
const sortField = ref('name')
const sortOrder = ref('asc') // 'asc' or 'desc'

// Apply filtering + sorting
const filteredUsers = computed(() => {
  const searchTerm = filters.value.userSearch.toLowerCase()

  // Filter
  const result = userDisplayData.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  })

  // Sort
  result.sort((a, b) => {
    const fieldA = a[sortField.value] || ''
    const fieldB = b[sortField.value] || ''
    const modifier = sortOrder.value === 'asc' ? 1 : -1
    return modifier * fieldA.toString().localeCompare(fieldB.toString())
  })

  return result
})

// Paginated slice (the table only displays the slice for the current page)
const displayedUsers = computed(() => {
  const startIndex = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
  const endIndex = startIndex + pagination.value.itemsPerPage
  return filteredUsers.value.slice(startIndex, endIndex)
})

// Columns
const displayedColumns = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Role' },
]

const startRecord = computed(() => {
  return (pagination.value.currentPage - 1) * pagination.value.itemsPerPage + 1
})

const endRecord = computed(() => {
  return Math.min(
    pagination.value.currentPage * pagination.value.itemsPerPage,
    filteredUsers.value.length
  )
})

// Pagination methods
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

// Sorting method
function sortBy(field) {
  if (sortField.value === field) {
    // Toggle asc/desc if clicking the same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Else, switch to the new field and reset to asc
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Modal state and handlers
const showEditModal = ref(false)
const editedUser = ref({}) // temporary store for the user being edited

function editUser(user) {
  // Copy user data into editedUser so we don't mutate the table row directly
  editedUser.value = { ...user }
  showEditModal.value = true
}

function closeModal() {
  showEditModal.value = false
}

async function saveEdits() {
  try {
    // Make the PUT request to update username & role
    const response = await fetch(`${useRuntimeConfig().public.backendUrl}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: editedUser.value.email,
        username: editedUser.value.name,
        role: editedUser.value.role,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      errorMessage.value = 'An error occurred while updating the user.';
      return;
    }

    // If successful, you might want to refresh your list or just update local state
    successMessage.value = 'User updated successfully!';

    // Optionally re-fetch user data here:
    // await fetchUsers();

  } catch (err) {
    console.error(err);
    window.alert('An error occurred while updating the user.');
  } finally {
    // Close the modal in either case
    closeModal();
  }
}
</script>

<style scoped>
/* Simple utility class to hide number input spinners */
.hide-arrow[type="number"]::-webkit-inner-spin-button,
.hide-arrow[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
