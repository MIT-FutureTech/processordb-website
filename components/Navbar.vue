<template>
  <div class="bg-black border-b-4 border-b-[#A32035] sticky top-0 z-10">
    <div class="max-w-7xl mx-auto  py-2 flex flex-wrap gap-4 justify-center md:justify-between items-center">
      <div class="justify-start">
        <NuxtLink
          to="/"
          class="inline-block"
        >
          <h1 class="text-lg md:text-2xl font-bold font-logo text-gray-50">
            <span class="text-[#A32035] inline ml-2">MIT</span> <span class="text-nowrap">
              PROCESSOR DB
            </span>
          </h1>
        </NuxtLink>
      </div>
      <div class="justify-end">
        <div class="flex items-center justify-end gap-6">
          <div class="menu-item has-dropdown relative group">
            <a
              href="#"
              class="menu-item-link flex items-center gap-2"
            >
              <span class="menu-item-label text-white group-hover:text-[#A32035]">Database</span>
              <svg
                width="13"
                height="9"
                class="chevron text-white group-hover:text-[#A32035] transition-transform duration-200 group-hover:rotate-180"
                viewBox="0 0 13 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.5 1L6.5 7.5L12.5 1"
                  stroke="currentColor"
                  stroke-linecap="round"
                />
              </svg>
            </a>
            <div
              class="dropdown-menu invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-0 min-w-[150px] bg-white bg-opacity-95 rounded-md transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
            >
              <ul class="py-2">
                <li
                  v-for="link in links"
                  :key="link.text"
                  class="group"
                >
                  <div v-if="link.text !== 'Profile' || isLoggedIn">
                    <NuxtLink
                      v-if="link.to && link.to !== '/admin/null'"
                      :to="link.to"
                      class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    >
                      <span
                        class="mr-3 text-black ml-4"
                        :class="{ 'text-[#A32035]': route.path === link.to }"
                      >
                        <ClientOnly>
                          <v-icon :name="link.icon" />
                          <template #fallback>
                            <span class="w-4 h-4 inline-block" />
                          </template>
                        </ClientOnly>
                      </span>
                      <span
                        class="mr-4"
                        :class="{ 'text-[#A32035]': route.path === link.to }"
                      >{{ link.text }}</span>
                    </NuxtLink>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <NuxtLink
            to="/about"
            class="text-white hover:text-[#A32035] flex items-center"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/team"
            class="text-white hover:text-[#A32035] flex items-center"
          >
            Team
          </NuxtLink>
          <NuxtLink
            to="/steering-committee"
            class="text-white hover:text-[#A32035] flex items-center"
          >
            Steering Committee
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { isLogged } from '../lib/isLogged';

const isLoggedIn = ref(false);
const route = useRoute();

onMounted(() => {
  isLoggedIn.value = isLogged();
});

const links = ref([
  { text: 'Login', to: '/login', icon: 'md-login' },
  { text: 'Profile', to: '/admin/profile', icon: 'fa-user-circle' },
  // { text: 'Manufacturers', to: '/manufacturers/list', icon: 'md-precisionmanufacturing' },
  // { text: 'SoCs', to: '/soc/list', icon: 'gi-circuitry' },
  { text: 'CPUs', to: '/cpu/list', icon: 'bi-cpu' },
  { text: 'GPUs', to: '/gpu/list', icon: 'bi-gpu-card' },
  { text: 'FPGAs', to: '/fpga/list', icon: 'gi-logic-gate-xor' },
  // { text: 'Economics', to: '/economics', icon: 'md-attachmoney' },
  // { text: 'Performances', to: '/performances', icon: 'gi-chart' },
]);

</script>