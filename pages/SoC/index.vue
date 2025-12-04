<template>
  <div>
    <!-- This page will redirect to /soc/list -->
  </div>
</template>

<script setup>
// Redirect /soc/ to /soc/list
await navigateTo('/soc/list', { replace: true })
</script>

