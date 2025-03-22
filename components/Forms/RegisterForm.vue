<template>
  <div class="mt-8">

    <div v-if="successMessage" class="mb-4 p-2 bg-green-200 text-green-800 rounded">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mb-4 p-2 bg-red-200 text-red-800 rounded">
      {{ errorMessage }}
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 pl-2">Name</label>
      <input type="text" v-model="name"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 pl-2">Email</label>
      <input type="email" v-model="email"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 pl-2">Password</label>
      <input type="password" v-model="password"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent" />
    </div>

    <button @click="submitForm()"
      class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center mt-6">
      <span class="mr-2"> Register </span>
    </button>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';

const password = ref('');
const email = ref('');
const name = ref('');
const successMessage = ref('');
const errorMessage = ref('');

async function submitForm() {
  try {
    let response = await fetch(`${useRuntimeConfig().public.backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: name.value, email: email.value, password: password.value })
    })

    if (response.ok) {
      successMessage.value = 'Registration successful!'
      setTimeout(() => {
        window.location.reload();
      }, 3500);
    } else {
      errorMessage.value = 'Registration unsuccessful!'
    }

  } catch (err) {
    console.log(err)
  }
}

</script>