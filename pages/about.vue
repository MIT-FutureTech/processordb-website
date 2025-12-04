<template>
  <div class="text-gray-800">
    <Navbar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 mb-16 mt-16">
      <section>
        <h2 class="text-3xl font-medium text-gray-600 sm:text-4xl">
          About
        </h2>
        <p class="text-lg text-left leading-loose mt-4 text-justify">
          We are an interdisciplinary research team dedicated to creating the most comprehensive database of
          hardware chips, encompassing CPUs, GPUs, FPGAs, and other domain-specific chips from around the
          globe. Our goal is to track and analyze trends in hardware development comprehensively. We
          appreciate your feedback, which is vital for maintaining and enhancing the quality of our vibrant
          and esteemed community!
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
useHead({
    title: 'About - MIT Processor DB',
    meta: [
        {
            name: 'description', content: 'MIT Processor DB is an interdisciplinary research team \
dedicated to creating the most comprehensive database of hardware chips, encompassing CPUs, GPUs, FPGAs, and other domain-specific chips from around the globe.\
Our goal is to track and analyze trends in hardware development comprehensively' }
    ],
    htmlAttrs: {
        lang: 'en',
    },
})
</script>

