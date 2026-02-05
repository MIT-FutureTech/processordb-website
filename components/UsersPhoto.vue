<template>
  <div class="relative">
    <div class="relative group">
      <img
        :src="displaySrc"
        class="object-cover object-top w-24 h-24 rounded-full cursor-pointer"
        alt="team member"
        @click="triggerFileInput"
      >
      <span class="tooltip hidden group-hover:block absolute -ml-4 rounded shadow-md p-2 bg-white text-[#A32035] text-sm font-semibold">
        Update Image
      </span>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        ref="fileInput"
        @change="handleFileChange"
        style="display: none;"
      >
    </div>
    <div
      v-if="errorMessage"
      class="absolute top-full left-0 mt-2 text-sm text-red-600 max-w-xs bg-white rounded shadow-md p-2 z-10 border border-red-200"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getItemWithExpiry } from '../lib/encrypter';

const props = defineProps({
  initialImageBase64: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true
  }
});

const fileInput = ref(null);
const imageSrc = ref(props.initialImageBase64);
const displaySrc = ref(imageSrc.value);
const errorMessage = ref('');

// Maximum file size: 5MB (for the original file, base64 will be ~33% larger)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
// Allowed image formats
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

watch(() => props.initialImageBase64, (newVal) => {
  displaySrc.value =
    newVal ||
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4Ij48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iZ3JheSIvPjwvc3ZnPg==';
});

const triggerFileInput = () => {
  errorMessage.value = '';
  fileInput.value?.click();
};

const emit = defineEmits(['update:initialImageBase64']);

const validateImage = (file) => {
  // Check file format
  if (!ALLOWED_FORMATS.includes(file.type)) {
    const allowedExtensions = ALLOWED_FORMATS.map(f => f.split('/')[1].toUpperCase()).join(', ');
    throw new Error(`Invalid image format. Please use one of: ${allowedExtensions}`);
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(`Image is too large (${fileSizeMB}MB). Maximum size is ${maxSizeMB}MB.`);
  }

  return true;
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Clear previous errors
  errorMessage.value = '';

  // Validate image before processing
  try {
    validateImage(file);
  } catch (error) {
    errorMessage.value = error.message;
    console.error('Image validation failed:', error.message);
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64String = e.target.result;
    
    // Additional check: base64 string size (should be ~33% larger than original file)
    const base64Size = base64String.length;
    const estimatedMaxBase64Size = MAX_FILE_SIZE * 1.4; // ~40% overhead for base64 encoding
    if (base64Size > estimatedMaxBase64Size) {
      errorMessage.value = 'Image is too large after encoding. Please use a smaller image.';
      console.error('Base64 encoded image exceeds size limit');
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      return;
    }

    imageSrc.value = base64String;

    try {
      const config = useRuntimeConfig();
      let backendUrl = config.public.backendUrl || 'http://localhost:3001';
      backendUrl = backendUrl.replace(/\/$/, ''); // Remove trailing slash
      const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
      const url = `${backendUrl}${apiPrefix}/users/image`;

      const token = getItemWithExpiry('encryptedJWTPDB');
      if (!token) {
        errorMessage.value = 'Authentication required. Please log in again.';
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: props.email, profileImage: base64String })
      });

      if (!response.ok) {
        // Try to extract error message from response
        let errorMsg = 'Failed to update image';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || response.statusText || errorMsg;
        } catch (parseError) {
          // If response is not JSON, use status text or status code
          if (response.status === 413) {
            errorMsg = 'Image is too large. Maximum size is 5MB.';
          } else if (response.status === 401) {
            errorMsg = 'Authentication required. Please log in again.';
          } else if (response.status === 404) {
            errorMsg = 'User not found.';
          } else if (response.status === 400) {
            errorMsg = 'Invalid image format or data.';
          } else {
            errorMsg = response.statusText || `Server error (${response.status})`;
          }
        }
        errorMessage.value = errorMsg;
        console.error('Failed to update image:', errorMsg, 'Status:', response.status);
        // Reset file input on error
        if (fileInput.value) {
          fileInput.value.value = '';
        }
        return;
      }

      // Success - clear any previous errors
      errorMessage.value = '';
      sessionStorage.setItem('PDB_U_PROFILE_IMG', base64String);
      emit('update:initialImageBase64', base64String);

    } catch (error) {
      errorMessage.value = 'Network error. Please check your connection and try again.';
      console.error('Error uploading image:', error);
    }
  };

  reader.onerror = () => {
    errorMessage.value = 'Failed to read image file. Please try again.';
    console.error('FileReader error');
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };

  reader.readAsDataURL(file);
};
</script>
