<template>

    <div class="page flex flex-col min-h-screen justify-between">
      <Navbar />
      
      <!-- Main content section with flex-1 to take up remaining space between Navbar and Footer -->
      <div class="flex flex-1 items-center justify-center bg-gray-100 sm:py-64">
        <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h1 class="text-2xl font-semibold text-gray-800 text-center mb-4">Enter Password</h1>
  
          <form @submit.prevent="checkPassword" class="space-y-4">
            <input 
              v-model="password" 
              type="password" 
              placeholder="Enter Password"
              class="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
            <button 
              type="submit"
              class="w-full px-4 py-2 text-white bg-[#A32035] rounded-lg hover:bg-opacity-90"
            >
              Submit
            </button>
          </form>
  
          <p v-if="error" class="text-center text-red-600">Incorrect password. Try again.</p>
        </div>
      </div>
      
      <Footer />
    </div>

  </template>
  

<script setup>

const password = ref('');
const error = ref(false);
const PASSWORD = 'processorDB-2024';
const router = useRouter();
const route = useRoute();
const checkPassword = () => {
    if (password.value === PASSWORD) {
        // Store password in localStorage (or sessionStorage) to persist session
        localStorage.setItem('protectedPassword', PASSWORD);
        error.value = false;
        // Redirect to protected page
        if (route.query.redirect) {
            router.push(route.query.redirect);
        } else {
            router.push('/database');
        }
    } else {
        error.value = true;
    }
};
</script>

<style scoped>
.page {
    display: flex;
    justify-content: space-between;
    min-height: 100vh;
}

</style>