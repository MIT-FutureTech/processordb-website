<template>
  <div class="flex flex-col md:flex-row gap-4">
    <div
      v-if="successMessage"
      data-testid="form-success"
      :data-message-code="successMessageCode"
      :data-action-type="successActionType"
      :data-entity-type="successEntityType"
      class="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded shadow-md"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      data-testid="form-error"
      :data-message-code="errorMessageCode"
      :data-error-type="errorType"
      :data-field-name="errorFieldName"
      class="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-md"
    >
      {{ errorMessage }}
    </div>

    <div>
      <FormFieldLabel 
        label="Old Password" 
        field-id="old_password"
        :required="true"
        tooltip="Enter your current password. This is a required field."
      />
      <div class="relative">
        <input
          id="old_password"
          :type="showOldPassword ? 'text' : 'password'"
          v-model="oldPassword"
          placeholder="Enter your current password"
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
      <FormFieldLabel 
        label="New Password" 
        field-id="new_password"
        :required="true"
        tooltip="Enter your new password. Must be at least 6 characters. Use a combination of letters, numbers, and symbols for better security. This is a required field."
      />
      <div class="relative">
        <input
          id="new_password"
          :type="showNewPassword ? 'text' : 'password'"
          v-model="newPassword"
          placeholder="Example: NewSecure123!"
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
import FormFieldLabel from '@/components/FormFieldLabel.vue';
import { handleApiError, handleNetworkError } from '@/lib/formErrorHandler';
import { getSuccessMessage } from '@/lib/formSuccessHandler';

const oldPassword = ref('');
const newPassword = ref('');
const successMessage = ref('');
const successMessageCode = ref('');
const successActionType = ref('');
const successEntityType = ref('');
const errorMessage = ref('');
const errorMessageCode = ref('');
const errorType = ref('');
const errorFieldName = ref('');

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
      const success = getSuccessMessage('user', 'update');
      successMessage.value = success.message;
      successMessageCode.value = success.code;
      successActionType.value = success.type;
      successEntityType.value = success.entity;
    } else {
      const error = await handleApiError(response, 'user', 'update');
      errorMessage.value = error.message;
      errorMessageCode.value = error.code;
      errorType.value = error.type;
      errorFieldName.value = error.field;
    }
  } catch (err) {
    console.error(err);
    const errorObj = handleNetworkError(err, 'user', 'update');
    errorMessage.value = errorObj.message;
    errorMessageCode.value = errorObj.code;
    errorType.value = errorObj.type;
    errorFieldName.value = errorObj.field;
  }
}
</script>
