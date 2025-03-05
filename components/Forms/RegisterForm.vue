<template>
  <div class="grid grid-cols-1 md:grid-cols-1 gap-8 mt-8">
    <div>
      <label class="block text-sm font-medium text-gray-700 pl-2">Name</label>
      <input type="text"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 pl-2">Email</label>
      <input type="email"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 pl-2">Password</label>
      <input type="password"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
    </div>

    <button @click="submitForm()"
      class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
      <span class="mr-2"> Register </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path fill-rule="evenodd" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"
          clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';

const password = ref('');
const email = ref('');
const name = ref('');

async function submitForm() {
  try {
    const response = await $fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { username: name.value, email: email.value, password_hash: password.value }
    })

    if (response.ok) {
      window.location.reload();
    } else {
      window.alert('Registration unsuccessful!')
    }

  } catch (err) {
    console.log(err)
  }
}

</script>