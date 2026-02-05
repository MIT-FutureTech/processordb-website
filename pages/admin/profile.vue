<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4">
    <!-- Header area -->
    <div class="flex justify-between items-center">
      <!-- Left side: Title & welcome text -->
      <div>
        <h1 class="text-4xl font-bold text-[#A32035] mt-8">
          Profile
        </h1>
        <div class="text-2xl font-bold mt-2">
          Welcome, {{ username }}!
        </div>
      </div>

      <!-- Right side: User photo -->
      <div>
        <UsersPhoto
          v-model:initial-image-base64="image"
          :email="email"
        />
      </div>
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8">

    <!-- Main container: side menu + content -->
    <div class="flex">
      <!-- Side menu -->
      <div class="w-1/4 pr-4">
        <ul class="space-y-4">
          <li
            class="cursor-pointer hover:font-semibold"
            :class="selectedOption === 'Profile' ? 'font-bold' : ''"
            @click="selectedOption = 'Profile'"
          >
            Profile
          </li>
          <li
            v-if="showRegister"
            class="cursor-pointer hover:font-semibold"
            :class="selectedOption === 'AddUser' ? 'font-bold' : ''"
            @click="selectedOption = 'AddUser'"
          >
            Add User
          </li>
          <li
            v-if="showRegister"
            class="cursor-pointer hover:font-semibold"
            :class="selectedOption === 'EditUsers' ? 'font-bold' : ''"
            @click="selectedOption = 'EditUsers'"
          >
            Edit Users
          </li>
        </ul>
      </div>

      <!-- Content area (right) -->
      <div class="w-3/4">
        <!-- Profile Section -->
        <div v-if="selectedOption === 'Profile'">
          <h3 class="text-lg font-medium mb-4">
            Name: {{ username }}
          </h3>
          <UpdatePassword :email="email" />
        </div>

        <!-- Add User Section -->
        <div v-if="selectedOption === 'AddUser'">
          <h3 class="text-lg font-medium mb-4">
            Register a new user
          </h3>
          <RegisterForm />
        </div>

        <!-- Edit Users Section -->
        <div v-if="selectedOption === 'EditUsers'">
          <h3 class="text-lg font-medium mb-4">
            List of users
          </h3>
          <UsersTable :user-data="usersData" @refresh="fetchUsers" />
        </div>
      </div>
    </div>

    <div class="mb-16" />
  </div>
  <Footer />
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import RegisterForm from '@/components/Forms/RegisterForm.vue';
import UsersTable from '@/components/UsersTable.vue';
import UpdatePassword from '~/components/Forms/UpdatePassword.vue';
import UsersPhoto from '@/components/UsersPhoto.vue';
import { getItemWithExpiry } from '@/lib/encrypter';

const email = ref('');
const image = ref('');
const username = ref('');
const usersData = ref([]);
const showRegister = ref(false);

// This ref will determine which section to display
// Default to "Profile"
const selectedOption = ref('Profile');

const addRoles = ['leader', 'admin'];

onMounted(() => {
  const storedUser = sessionStorage.getItem('PDB_U_NAME');
  const storedRole = sessionStorage.getItem('PDB_U_ROLE');
  const storedEmail = sessionStorage.getItem('PDB_U_EMAIL');
  const storedProfileImg = sessionStorage.getItem('PDB_U_PROFILE_IMG');

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      username.value = parsedUser.value || '';
    } catch (error) {
      console.error('Error parsing PDB_U_NAME:', error);
    }
  }

  if (storedRole) {
    try {
      const parsedRole = JSON.parse(storedRole);
      showRegister.value = addRoles.includes(parsedRole.value);
    } catch (error) {
      console.error('Error parsing PDB_U_ROLE:', error);
    }
  }

  if (storedEmail) {
    try {
      const parsedEmail = JSON.parse(storedEmail);
      email.value = parsedEmail.value || '';
    } catch (error) {
      console.error('Error parsing PDB_U_EMAIL:', error);
    }
  }

  if (storedProfileImg) {
    console.log('Stored profile image:', storedProfileImg);
    image.value = storedProfileImg || '';
  }
});

const fetchUsers = async () => {
  try {
    const backendUrl = useRuntimeConfig().public.backendUrl || 'http://localhost:3001';
    const cleanUrl = backendUrl.replace(/\/$/, '');
    const apiBaseUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
    
    // Get JWT token from storage
    const token = getItemWithExpiry('encryptedJWTPDB');
    if (!token) {
      console.error('No authentication token found');
      usersData.value = [];
      return;
    }
    
    const response = await fetch(`${apiBaseUrl}/users/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching Users data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    usersData.value = data.data || data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    usersData.value = [];
  }
};

// Fetch users on mount (client-side only to avoid SSR issues)
onMounted(() => {
  fetchUsers();
});
</script>
