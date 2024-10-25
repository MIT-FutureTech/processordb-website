<template>
  <div class="text-gray-800">
    <div class="bg-black border-b-4 border-b-[#A32035] sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-lg md:text-2xl font-bold font-logo text-gray-50">
            <span class="text-[#A32035] inline">MIT</span> <span class="text-nowrap">
              PROCESSOR DB
            </span>
          </h1>
        </NuxtLink>
      </div>
    </div>
    <div class="max-w-7xl mx-auto">
      <div class="mt-16">
        <h1 class="text-4xl font-bold">All processors</h1>
      </div>
      <div class="my-16">
        <InteractiveGraph :data="SoCs" />
      </div>
      <div class="mb-16">
        <DataTable :data="SoCs" />
      </div>
    </div>
    <footer class="bg-black border-t-[12px] border-t-[#A32035] text-center text-white py-8 px-4 sm:px-6 lg:px-8 ">
      <div class="max-w-7xl mx-auto flex justify-between flex-col gap-8 lg:flex-row flex-wrap">
        <div class="text-left">
          <h2 class="text-2xl font-bold font-logo"><span class="text-[#A32035]">MIT</span> <span
              class="text-nowrap">PROCESSOR DB</span></h2>
          <p class="text-sm">
            Revealing Technical and Economic Trends in Computer Hardware</p>
        </div>
        <div class="flex justify-between text-left flex-col gap-8 lg:gap-32 lg:flex-row  ">
          <div>
            <h2 class="font-medium text-md">Relevant links</h2>
            <ul class="font-light text-sm space-y-2 mt-2">
              <li><a class="hover:underline py-2" href="https://futuretech.mit.edu/" target="_blank"
                  aria-label="MIT Futuretech">MIT
                  Futuretech</a></li>
              <li><a class="hover:underline py-2" href="https://www.koomey.com/analyticspage.html" target="_blank"
                  aria-label="Koomey Analytics">Koomey Analytics</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-md">Data sources</h3>
            <ul class="font-light text-sm space-y-2 mt-2">
              <li><a class="hover:underline py-2" href="http://cpudb.stanford.edu/" target="_blank"
                  aria-label="Stanford CPU DB">Stanford
                  CPU DB</a></li>
              <li><a class="hover:underline py-2" href="https://chip-dataset.vercel.app/" target="_blank"
                  aria-label="The CHIP Dataset">The
                  CHIP Dataset</a></li>
              <li><a class="hover:underline py-2" href="https://www.techpowerup.com/cpu-specs/" target="_blank"
                  aria-label="TechPowerUp">TechPowerUp</a></li>
              <li><a class="hover:underline py-2" href="https://en.wikichip.org/wiki/WikiChip" target="_blank"
                  aria-label="TechPowerUp">WikiChip</a></li>
            </ul>
          </div>
          <!-- <div>
                            <h4 class="font-bold text-md">Social</h4>
                            <ul class="font-light text-sm space-y-2 mt-2">
                                <li><a class="hover:underline py-2" href="#">Facebook</a></li>
                                <li><a class="hover:underline py-2" href="#">X</a></li>
                            </ul>
                        </div> -->


        </div>

      </div>
      <div
        class="max-w-7xl mx-auto  border-t border-t-white flex justify-between gap-8 mt-16 pt-8 flex-col sm:flex-row">
        <p class="text-center text-sm">
          © {{ new Date().getFullYear() }} MIT Processor Database
        </p>
        <p>
          <a href="https://accessibility.mit.edu/" target="_blank" aria-label="MIT Acessability">
            Accessibility
          </a>
        </p>

      </div>
    </footer>
  </div>
</template>

<script setup>
const SoCs = ref([])
// Fetch data function
const { data } = await useFetch(
  'http://localhost:3001/api/socs', {
    key: 'socs'
  }
)
console.log(data.value.data)
SoCs.value = data.value.data

</script>