<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 px-4 justify-start md:justify-between items-center">
    <h1 class="text-4xl font-bold text-[#A32035] mt-8">Dashboard</h1>
    <div class="text-2xl font-bold mt-2"> Welcome back, </div>
    <div class="text-2xl font-bold mt-2"> {{ username }}! </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" v-if="showRegister" />

    <div v-if="showRegister" class="w-1/2">
      <h3 class="text-lg font-medium">Register a new user</h3>
      <RegisterForm />
    </div>

    <hr class="border-t border-[#A32035] opacity-80 my-4 mt-8" />

    <div>
      <h3 class="text-lg font-medium mb-8">List of users</h3>
      <UsersTable :userData="usersData" />
      <div class="mb-16"></div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import RegisterForm from '@/components/Forms/RegisterForm.vue';
import UsersTable from '@/components/UsersTable.vue';

const username = ref('');
const addRoles = ['leader', 'rollbacker', 'admin']
const showRegister = ref(false);
const usersData = ref([]);

onMounted(() => {
  const storedUser = sessionStorage.getItem('PDB_U_NAME');
  const storedRole = sessionStorage.getItem('PDB_U_ROLE');

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
});

fetch('http://localhost:3001/api/users/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error fetching Users data');
    }
    return response.json();
  })
  .then(data => {
    usersData.value = data;
  })
  .catch(error => {
    console.error(error);
  });

</script>