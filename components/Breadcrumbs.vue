<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class=" sm:items-center sm:space-x-2 inline-flex flex-wrap sm:flex-row">
      <li>
        <div>
          <a href="/" class="text-[#675F7B] hover:text-[#675F7BAA]">
            <Icon name="heroicons:home-solid" class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
            <span class="sr-only">Home</span>
          </a>
        </div>
      </li>
      <li v-for="(crumb, idx) in crumbs" :key="idx">
        <div>
          <Icon name="heroicons:chevron-right-solid" class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
          <a :href="crumb.href" class="ml-2 text-sm font-medium h-5 text-[#675F7B] hover:text-[#675F7BAA"
            :aria-current="crumb.current ? 'page' : undefined">{{ crumb.name }}</a>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>

defineProps({
  crumbs: Array
})

</script>