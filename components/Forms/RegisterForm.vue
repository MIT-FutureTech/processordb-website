<template>
  <div class="mt-14">
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
        label="Name" 
        field-id="admin_name"
        :required="true"
        tooltip="Enter the username for the new user account (e.g., johndoe). This is a required field."
      />
      <input
        id="admin_name"
        type="text"
        v-model="name"
        placeholder="Example: johndoe"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"
      >
    </div>
    <div>
      <FormFieldLabel 
        label="Email" 
        field-id="admin_email"
        :required="true"
        tooltip="Enter the email address for the new user account (e.g., user@example.com). This is a required field."
      />
      <input
        id="admin_email"
        type="email"
        v-model="email"
        placeholder="Example: user@example.com"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"
      >
    </div>
    <div>
      <FormFieldLabel 
        label="Password" 
        field-id="admin_password"
        :required="true"
        tooltip="Enter a password for the new user account. Must be at least 6 characters. This is a required field."
      />
      <input
        id="admin_password"
        type="password"
        v-model="password"
        placeholder="Example: SecurePass123!"
        class="pl-2 mt-1 block w-full h-10 sm:text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 transition-colors bg-transparent"
      >
    </div>

    <button
      @click="submitForm()"
      class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center mt-6"
    >
      <span class="mr-2"> Register </span>
    </button>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
import FormFieldLabel from '@/components/FormFieldLabel.vue';
import { handleApiError, handleNetworkError, handleValidationError } from '@/lib/formErrorHandler';
import { getSuccessMessage } from '@/lib/formSuccessHandler';

const password = ref('');
const email = ref('');
const name = ref('');
const successMessage = ref('');
const successMessageCode = ref('');
const successActionType = ref('');
const successEntityType = ref('');
const errorMessage = ref('');
const errorMessageCode = ref('');
const errorType = ref('');
const errorFieldName = ref('');

async function submitForm() {
  // Clear previous errors
  errorMessage.value = '';
  errorMessageCode.value = '';
  errorType.value = '';
  errorFieldName.value = '';

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value || !emailRegex.test(email.value)) {
    const errorObj = handleValidationError('VALIDATION_EMAIL_FORMAT');
    errorMessage.value = errorObj.message;
    errorMessageCode.value = errorObj.code;
    errorType.value = errorObj.type;
    errorFieldName.value = errorObj.field;
    return;
  }

  try {
    let response = await fetch(`${useRuntimeConfig().public.backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: name.value, email: email.value, password: password.value })
    })

    if (response.ok) {
      const success = getSuccessMessage('user', 'create');
      successMessage.value = success.message;
      successMessageCode.value = success.code;
      successActionType.value = success.type;
      successEntityType.value = success.entity;
      setTimeout(() => {
        window.location.reload();
      }, 3500);
    } else {
      const error = await handleApiError(response, 'user', 'create');
      errorMessage.value = error.message;
      errorMessageCode.value = error.code;
      errorType.value = error.type;
      errorFieldName.value = error.field;
    }

  } catch (err) {
    console.log(err);
    const errorObj = handleNetworkError(err, 'user', 'create');
    errorMessage.value = errorObj.message;
    errorMessageCode.value = errorObj.code;
    errorType.value = errorObj.type;
    errorFieldName.value = errorObj.field;
  }
}

</script>