<template>
  <div class="page flex flex-col min-h-screen justify-between">
    <Navbar />

    <!-- Login Form -->
    <div v-if="!logged" class="flex flex-1 items-center justify-center bg-gray-100 sm:py-64">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 class="text-2xl font-semibold text-gray-800 text-center mb-4">
          Login
        </h1>

        <form @submit.prevent="login" class="space-y-4">
          <!-- Email -->
          <input v-model="email" type="email" placeholder="Email"
            class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <!-- Password with show/hide toggle -->
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter Password"
              class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3" @click="togglePassword">
              <div v-if="showPassword">
                <v-icon name="bi-eye-slash" />
              </div>
              <div v-else>
                <v-icon name="bi-eye" />
              </div>
            </button>
          </div>

          <!-- Submit -->
          <button type="submit" class="w-full px-4 py-2 text-white bg-[#A32035] rounded-lg hover:bg-opacity-90">
            Login
          </button>
        </form>

        <!-- Error -->
        <p v-if="error" class="text-center text-red-600">
          Invalid email or password
        </p>
      </div>
    </div>

    <!-- Logout Form -->
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
import { setItemWithExpiry } from '../lib/encrypter';
import { isLogged } from '../lib/isLogged';

const password = ref('');
const email = ref('');

const logged = ref(false);
const error = ref(false);

// show/hide password state
const showPassword = ref(false);

onMounted(() => {
  logged.value = isLogged();
});

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function login() {
  const { data, error: loginError } = await useAsyncData('login', () =>
    $fetch(`${useRuntimeConfig().public.backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
      },
      body: { email: email.value, password: password.value }
    })
  );

  if (loginError.value) {
    error.value = true;
    return;
  }

  error.value = false;
  const { token, username, profileImage, role } = data.value;

  setItemWithExpiry('encryptedJWTPDB', token);
  setItemWithExpiry('PDB_U_NAME', username);
  setItemWithExpiry('PDB_U_ROLE', role);
  setItemWithExpiry('PDB_U_EMAIL', email.value);
  sessionStorage.setItem('PDB_U_PROFILE_IMG', profileImage);

  logged.value = true;
  
  // Add error handling for navigation
  try {
    console.log('Navigating to admin profile after successful login');
    await navigateTo('/admin/profile');
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback navigation
    window.location.href = '/admin/profile';
  }
}

async function logout() {
  sessionStorage.removeItem('encryptedJWTPDB');
  sessionStorage.removeItem('PDB_U_NAME');
  sessionStorage.removeItem('PDB_U_ROLE');
  sessionStorage.removeItem('PDB_U_EMAIL');
  sessionStorage.removeItem('PDB_U_PROFILE_IMG');

  logged.value = false;
  await navigateTo('/');
}
</script>

<style scoped>
.page {
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
