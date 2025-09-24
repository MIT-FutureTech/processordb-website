<template>
  <Navbar />

  <div class="min-h-screen max-w-7xl mx-auto py-2 justify-start md:justify-between items-center">

    <!-- Main Content -->

    <!-- Header -->
    <div class="flex items-center justify-between mt-8 ml-2">
      <div class="flex items-center">
        <h1 class="text-4xl font-bold text-[#A32035]">SOC</h1>
        <NuxtLink to="/cpu/list">
          <v-icon name="co-arrow-circle-left"
            class="mt-1 ml-2 text-gray-300 opacity-80 w-12 h-12 hover:text-[#8A1B2D] hover:opacity-78" />
        </NuxtLink>
      </div>

      <NuxtLink to="/cpu/form"
        class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
        <span class="mr-2"> Save </span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path fill-rule="evenodd" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"
            clip-rule="evenodd" />
        </svg>
      </NuxtLink>
    </div>


    <!-- SOC Form -->
    <div class="flex items-center justify-between mt-8 ml-2">
      <form class="w-full">
        <h2 class="text-xl font-medium font-semibold text-semibold">General Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Manufacturer -->
          <div>
            <label for="manufacturer" class="block text-sm font-medium text-gray-700">Manufacturer</label>
            <select id="manufacturer" name="manufacturer"
              class="pl-2 mt-2 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm">
              <option>Intel</option>
              <option>AMD</option>
              <option>ARM</option>
            </select>
          </div>

          <!-- Code Name -->
          <div>
            <label for="code-name" class="block text-sm font-medium text-gray-700">Code Name</label>
            <input type="text" id="code-name" name="code-name"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm"
              value="Intel® Core™ i7 processor 14650">
          </div>

          <!-- Year -->
          <div>
            <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
            <input type="number" id="year" name="year"
              class="pl-2 mt-1 h-10 block w-full border-1 border-gray-200 rounded-md drop-shadow focus:ring-[#A32035] focus:border-[#A32035] sm:text-sm"
              value="2024">
          </div>
        </div>

        <hr class="border-t border-gray-300 pt-8 mt-6">

        <!-- Processors Section -->
        <div>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-medium text-gray-700 text-semibold">Processors</h2>
              <button @click="togglePerformance" class="p-1 hover:bg-gray-100 rounded-full" type="button">
                <v-icon name="bi-chevron-compact-up"
                  :style="{ transform: isPerformanceExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
              </button>
            </div>
            <NuxtLink to="/soc/form"
              class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
              <span class="mr-2"> Add processor </span>
            </NuxtLink>
          </div>

          <Transition name="collapse">
            <div v-if="isPerformanceExpanded">
              <div class="mt-4 mb-8">
                <table class="w-full mt-4 border border-1 border-gray-200 rounded-lg overflow-hidden">
                  <thead class="bg-black opacity-80">
                    <tr>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Type</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Name</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Quantity</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Memory</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-t border-gray-200">
                      <td class="px-4 py-2">CPU</td>
                      <td class="px-4 py-2">Intel® Core™ i7 processor 14650</td>
                      <td class="px-4 py-2">1</td>
                      <td class="px-4 py-2">4GB</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                    <tr class="border-t border-gray-200">
                      <td class="px-4 py-2">GPU</td>
                      <td class="px-4 py-2">Intel Iris Xe Graphics G7 96EU</td>
                      <td class="px-4 py-2">1</td>
                      <td class="px-4 py-2">2GB</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>
        </div>

        <hr class="border-t border-gray-300 pt-8">

        <!-- Performance Section -->
        <div>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-medium text-gray-700 text-semibold">Performance</h2>
              <button @click="togglePerformance" class="p-1 hover:bg-gray-100 rounded-full" type="button">
                <v-icon name="bi-chevron-compact-up"
                  :style="{ transform: isPerformanceExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
              </button>
            </div>
            <NuxtLink to="/soc/form"
              class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
              <span class="mr-2"> Add benchmark </span>
            </NuxtLink>
          </div>

          <Transition name="collapse">
            <div v-if="isPerformanceExpanded">
              <div class="mt-4 mb-8">
                <table class="w-full mt-4 border border-1 border-gray-200 rounded-lg overflow-hidden">
                  <thead class="bg-black opacity-80">
                    <tr>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Benchmark</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Score</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Year</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-t border-gray-200">
                      <td class="px-4 py-2">SpecInt2006</td>
                      <td class="px-4 py-2">26.6</td>
                      <td class="px-4 py-2">2006</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                    <tr class="border-t border-gray-200">
                      <td class="px-4 py-2">SpecInt2000</td>
                      <td class="px-4 py-2">1701.9</td>
                      <td class="px-4 py-2">2000</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>

        </div>

        <hr class="border-t border-gray-300 pt-8">

        <!-- Economics Section -->
        <div>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-medium text-gray-700 text-semibold">Economics</h2>
              <button @click="toggleEconomics" class="p-1 hover:bg-gray-100 rounded-full" type="button">
                <v-icon name="bi-chevron-compact-up"
                  :style="{ transform: isEconomicsExpanded ? '' : 'rotate(180deg)', transition: 'transform 0.2s' }" />
              </button>
            </div>
            <NuxtLink to="/soc/form"
              class="px-6 py-2.5 bg-[#A32035] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#8a1b2d] hover:shadow-lg text-center inline-flex items-center justify-center">
              <span class="mr-2"> Add economic data </span>
            </NuxtLink>
          </div>

          <Transition name="collapse">
            <div v-if="isEconomicsExpanded">
              <div class="mt-4 mb-8">
                <table class="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
                  <thead class="bg-black opacity-80">
                    <tr>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Price</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Year</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white">Sales</th>
                      <th class="px-4 py-2 text-left text-semibold text-sm text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-t border-gray-200">
                      <td class="px-4 py-2">$639</td>
                      <td class="px-4 py-2">2000</td>
                      <td class="px-4 py-2">5K units</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                    <tr class="border-t border-gray-200">
                      <td class="px-4 py-2">$609</td>
                      <td class="px-4 py-2">2001</td>
                      <td class="px-4 py-2">4K units</td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" class="text-sm text-[#A32035] hover:underline">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>

        </div>
      </form>
    </div>

  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isPerformanceExpanded = ref(true)
const isEconomicsExpanded = ref(true)
const sidebarOffset = ref(0)

const handleScroll = () => {
  const footer = document.querySelector('footer')
  const sideMenu = document.querySelector('.side-menu-class')
  const footerRect = footer.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  if (footerRect.top < viewportHeight) {
    sidebarOffset.value = viewportHeight - footerRect.top
  } else {
    sidebarOffset.value = 0
  }

  sideMenu.style.transform = `translateY(-${sidebarOffset.value}px)`
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const togglePerformance = () => {
  isPerformanceExpanded.value = !isPerformanceExpanded.value;
};

const toggleEconomics = () => {
  isEconomicsExpanded.value = !isEconomicsExpanded.value;
};
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
