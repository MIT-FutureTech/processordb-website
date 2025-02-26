<template>
  <div class="page flex flex-col min-h-screen justify-between">
    <Navbar />

    <!-- Main content section with flex-1 to take up remaining space between Navbar and Footer -->
    <div v-if="!logged" class="flex flex-1 items-center justify-center bg-gray-100 sm:py-64">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 class="text-2xl font-semibold text-gray-800 text-center mb-4">Login</h1>

        <form @submit.prevent="login" class="space-y-4">

          <input v-model="email" type="email" placeholder="Email"
            class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="password" type="password" placeholder="Enter Password"
            class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <button type="submit" class="w-full px-4 py-2 text-white bg-[#A32035] rounded-lg hover:bg-opacity-90">
            Login
          </button>
        </form>

        <p v-if="error" class="text-center text-red-600">Invalid email or password</p>
      </div>
    </div>

    <div v-else class="flex flex-1 items-center justify-center bg-gray-100 sm:py-64">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">

        <form @submit.prevent="logout" class="space-y-4">

          <button type="submit" class="w-full px-4 py-2 text-white bg-[#A32035] rounded-lg hover:bg-opacity-90">
            Logout
          </button>
        </form>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { setItemWithExpiry } from '../lib/encrypter';
import { isLogged } from '../lib/isLogged';

const password = ref('');
const email = ref('');

const logged = ref(false);
const error = ref(false);
const router = useRouter();


onMounted(() => {
  logged.value = isLogged();
});

async function login() {
  try {
    const response = await $fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { email: email.value, password: password.value }
    })

    const { token, username, role } = response

    setItemWithExpiry('encryptedJWTPDB', token)
    setItemWithExpiry('PDB_U_NAME', username)
    setItemWithExpiry('PDB_U_ROLE', role[0])

    logged.value = true

    await navigateTo('/admin/dashboard')
  } catch (err) {
    error.value = true
  }
}

async function logout() {
  sessionStorage.removeItem('encryptedJWTPDB');
  sessionStorage.removeItem('PDB_U_NAME');
  sessionStorage.removeItem('PDB_U_ROLE');

  logged.value = false;
  await navigateTo('/')
}
</script>

<style scoped>
.page {
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
}
</style>