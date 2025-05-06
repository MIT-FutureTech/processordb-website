<template>
  <div class="flex flex-col md:flex-row gap-4">
    <div
      v-if="successMessage"
      class="mb-4 p-2 bg-green-200 text-green-800 rounded"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mb-4 p-2 bg-red-200 text-red-800 rounded"
    >
      {{ errorMessage }}
    </div>

    <div>
      <label class="block text-gray-700 font-bold mb-2">Old Password</label>
      <div class="relative">
        <input
          :type="showOldPassword ? 'text' : 'password'"
          v-model="oldPassword"
          class="w-full h-10 px-3 py-2 mb-4 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        >
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
          @click="toggleOldPassword"
        >
          <div v-if="showOldPassword">
            <v-icon
              name="bi-eye-slash"
              class="mb-4"
            />
          </div>
          <div v-else>
            <v-icon
              name="bi-eye"
              class="mb-4"
            />
          </div>
        </button>
      </div>
    </div>

    <div>
      <label class="block text-gray-700 font-bold mb-2">New Password</label>
      <div class="relative">
        <input
          :type="showNewPassword ? 'text' : 'password'"
          v-model="newPassword"
          class="w-full h-10 px-3 py-2 mb-4 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        >
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
          @click="toggleNewPassword"
        >
          <div v-if="showNewPassword">
            <v-icon
              name="bi-eye-slash"
              class="mb-4"
            />
          </div>
          <div v-else>
            <v-icon
              name="bi-eye"
              class="mb-4"
            />
          </div>
        </button>
      </div>
    </div>

    <button
      @click="submitUpdatePassword()"
      class="h-10 px-4 bg-[#A32035] text-white font-small rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center mt-8"
    >
      <span class="mr-2"> Update </span>
    </button>
  </div>
</template>

<script lang="js" setup>
import { ref } from 'vue';

const oldPassword = ref('');
const newPassword = ref('');
const successMessage = ref('');
const errorMessage = ref('');

const showOldPassword = ref(false);
const showNewPassword = ref(false);

function toggleOldPassword() {
  showOldPassword.value = !showOldPassword.value;
}

function toggleNewPassword() {
  showNewPassword.value = !showNewPassword.value;
}

const props = defineProps({
  email: {
    type: String,
    default: () => ('')
  }
});

async function submitUpdatePassword() {
  try {
    let response = await fetch(`${useRuntimeConfig().public.backendUrl}/auth/reset`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: props.email,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      })
    });

    if (response.ok) {
      successMessage.value = 'Password updated!';
    } else {
      errorMessage.value = 'Something went wrong!';
    }
  } catch (err) {
    console.error(err);
  }
}
</script>
