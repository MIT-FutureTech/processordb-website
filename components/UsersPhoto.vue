<template>
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
      accept="image/*"
      ref="fileInput"
      @change="handleFileChange"
      style="display: none;"
    >
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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
const displaySrc = ref(imageSrc.value)

watch(() => props.initialImageBase64, (newVal) => {
  displaySrc.value =
    newVal ||
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4Ij48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iZ3JheSIvPjwvc3ZnPg==';
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const emit = defineEmits(['update:initialImageBase64']);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64String = e.target.result;
    imageSrc.value = base64String;

    try {
      const response = await fetch(`${useRuntimeConfig().public.backendUrl}/users/image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: props.email, profileImage: base64String })
      });

      if (!response.ok) {
        console.error('Failed to update image:', response.statusText);
      }

      sessionStorage.setItem('PDB_U_PROFILE_IMG', base64String);
      emit('update:initialImageBase64', base64String);

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  reader.readAsDataURL(file);
};
</script>
