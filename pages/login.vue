<template>
  <div class="page flex flex-col min-h-screen justify-between">
    <Navbar />

    <!-- Login Form - Always visible, not wrapped in ClientOnly -->
    <!-- The form itself doesn't need ClientOnly, only the reactive parts do -->
    <div class="flex flex-1 items-center justify-center bg-gray-100 sm:py-64">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 class="text-2xl font-semibold text-gray-800 text-center mb-4">
          Login
        </h1>

        <!-- Use ClientOnly only for the reactive form logic -->
        <ClientOnly>
          <template #default>
            <form v-if="!logged" @submit.prevent="login" class="space-y-4">
              <!-- Email -->
              <input v-model="email" type="email" placeholder="Email" data-testid="email-input"
                class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

              <!-- Password with show/hide toggle -->
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter Password" data-testid="password-input"
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
              <button type="submit" data-testid="login-button" class="w-full px-4 py-2 text-white bg-[#A32035] rounded-lg hover:bg-opacity-90">
                Login
              </button>
            </form>

            <!-- Registration Link -->
            <div v-if="!logged" class="text-center mt-4">
              <p class="text-gray-600 text-sm">
                Don't have an account?
                <NuxtLink to="/register" class="text-[#A32035] hover:underline">
                  Register here
                </NuxtLink>
              </p>
            </div>

            <!-- Logout Form -->
            <form v-else @submit.prevent="logout" class="space-y-4">
              <button type="submit" class="w-full px-4 py-2 text-white bg-[#A32035] rounded-lg hover:bg-opacity-90">
                Logout
              </button>
            </form>

            <!-- Error -->
            <p v-if="error" class="text-center text-red-600">
              Invalid email or password
            </p>
          </template>
          <template #fallback>
            <!-- Fallback form - always visible, works even without Vue -->
            <form class="space-y-4" id="login-form-fallback">
              <input type="email" placeholder="Email" data-testid="email-input" name="email"
                class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div class="relative">
                <input type="password" placeholder="Enter Password" data-testid="password-input" name="password"
                  class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" data-testid="login-button" class="w-full px-4 py-2 text-white bg-[#A32035] rounded-lg hover:bg-opacity-90">
                Login
              </button>
            </form>
            <!-- Registration Link for fallback -->
            <div class="text-center mt-4">
              <p class="text-gray-600 text-sm">
                Don't have an account?
                <NuxtLink to="/register" class="text-[#A32035] hover:underline">
                  Register here
                </NuxtLink>
              </p>
            </div>
          </template>
        </ClientOnly>
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
  
  // Handle fallback form submission (for when Vue hasn't loaded yet)
  const fallbackForm = document.getElementById('login-form-fallback');
  if (fallbackForm) {
    fallbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(fallbackForm);
      const emailValue = formData.get('email');
      const passwordValue = formData.get('password');
      
      // Set the values and trigger login
      if (emailValue) email.value = emailValue;
      if (passwordValue) password.value = passwordValue;
      
      // Trigger login function
      login();
    });
  }
});

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function login() {
  // Add logging to verify function is being called
  console.log('Login function called', { email: email.value ? 'present' : 'missing', password: password.value ? 'present' : 'missing' });
  
  // Use the Nuxt server API endpoint instead of calling backend directly
  // This avoids CORS issues and ensures consistent error handling
  const loginUrl = '/api/login';
  console.log('Login URL:', loginUrl);
  
  try {
    console.log('Making login request to:', loginUrl);
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login failed:', response.status, errorText);
      error.value = true;
      return;
    }

    const data = await response.json();
    console.log('Login successful, received data:', { hasToken: !!data.token, hasUsername: !!data.username });

    error.value = false;
    const { token, username, profileImage, role } = data;

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
    } catch (navError) {
      console.error('Navigation error:', navError);
      // Fallback navigation
      window.location.href = '/admin/profile';
    }
  } catch (loginError) {
    console.error('Login error:', loginError);
    console.error('Login error details:', {
      message: loginError.message,
      stack: loginError.stack,
      name: loginError.name
    });
    error.value = true;
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
