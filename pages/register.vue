<template>
  <div class="page flex flex-col min-h-screen justify-between">
    <Navbar />

    <div class="flex flex-1 items-center justify-center bg-gray-100 sm:py-64">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 class="text-2xl font-semibold text-gray-800 text-center mb-4">
          Create Account
        </h1>

        <!-- Instructions Section -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 class="text-sm font-semibold text-blue-900 mb-2">How to Submit Change Requests</h3>
          <ul class="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>After registering, you'll have "suggestor" role by default</li>
            <li>You can view all processor data (CPUs, GPUs, FPGAs, etc.)</li>
            <li>To suggest changes, use the forms on processor detail pages</li>
            <li>Your suggestions will be reviewed by admins and authorized editors</li>
            <li>Check your suggestion status on the "My Suggestions" page</li>
          </ul>
        </div>

        <ClientOnly>
          <template #default>
            <form v-if="!registered" @submit.prevent="register" class="space-y-4">
              <!-- Username -->
              <input v-model="username" type="text" placeholder="Username" required
                class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

              <!-- Email -->
              <input v-model="email" type="email" placeholder="Email" required
                class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

              <!-- Password with show/hide toggle -->
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password" required
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

              <!-- Confirm Password -->
              <div class="relative">
                <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Confirm Password" required
                  class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <!-- Submit -->
              <button type="submit" :disabled="loading" class="w-full px-4 py-2 text-white bg-[#A32035] rounded-lg hover:bg-opacity-90 disabled:opacity-50">
                {{ loading ? 'Registering...' : 'Register' }}
              </button>
            </form>

            <!-- Success Message -->
            <div v-else class="text-center space-y-4">
              <p class="text-green-600 font-semibold">Registration successful!</p>
              <p class="text-sm text-gray-600">Redirecting to login page...</p>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-center text-red-600 text-sm">
              {{ errorMessage }}
            </p>
          </template>
        </ClientOnly>

        <!-- Login Link -->
        <div class="text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="text-[#A32035] hover:underline">Login here</NuxtLink>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { isLogged } from '../lib/isLogged';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const registered = ref(false);
const error = ref(false);
const errorMessage = ref('');
const loading = ref(false);
const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function register() {
  console.log('[Register Page] Registration form submitted', { email: email.value, username: username.value });
  
  error.value = false;
  errorMessage.value = '';
  loading.value = true;

  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = true;
    errorMessage.value = 'Passwords do not match';
    loading.value = false;
    return;
  }

  if (password.value.length < 6) {
    error.value = true;
    errorMessage.value = 'Password must be at least 6 characters';
    loading.value = false;
    return;
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    });

    console.log('[Register Page] Registration response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Registration failed' };
      }
      
      console.error('[Register Page] Registration failed', { email: email.value, error: errorData.message });
      error.value = true;
      errorMessage.value = errorData.message || errorData.error || 'Registration failed. Please try again.';
      loading.value = false;
      return;
    }

    const data = await response.json();
    console.log('[Register Page] Registration successful', { email: email.value });

    registered.value = true;
    error.value = false;

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      navigateTo('/login');
    }, 2000);
  } catch (registerError) {
    console.error('[Register Page] Registration error:', registerError);
    error.value = true;
    errorMessage.value = registerError.message || 'An unexpected error occurred. Please try again.';
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
