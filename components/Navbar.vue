<template>
  <div class="bg-black border-b-4 border-b-[#A32035] sticky top-0 z-10">
    <div class="max-w-7xl mx-auto py-2 flex flex-wrap gap-4 justify-center md:justify-between items-center">
      <div class="justify-start pl-4">
        <NuxtLink
          to="/"
          class="inline-block"
        >
          <h1 class="text-lg md:text-2xl font-bold font-logo text-gray-50 flex items-center gap-2">
            <span class="text-[#A32035] inline ml-2">MIT</span> <span class="text-nowrap">
              PROCESSOR DB
            </span>
          </h1>
        </NuxtLink>
      </div>
      <div class="justify-end">
        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center justify-end gap-6 pr-4">
          <div class="bg-white p-1 rounded inline-flex items-center">
            <img alt="processor db logo" class="h-[1.125rem] md:h-[1.5rem]" src="/logo-trans-cropped.png">
          </div>
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
                  <!-- Always show non-Profile links, conditionally show Profile link after mount -->
                  <div v-if="link.text !== 'Profile' || (isMounted && isLoggedIn)">
                    <NuxtLink
                      v-if="link.to && link.to !== '/admin/null'"
                      :to="link.to"
                      class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    >
                      <span
                        class="mr-3 text-black ml-4 flex items-center"
                        :class="{ 'text-[#A32035]': route.path === link.to }"
                      >
                        <ClientOnly>
                          <v-icon :name="link.icon" class="w-4 h-4" />
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
          <NuxtLink
            v-if="enableGalaxy"
            to="/galaxy"
            class="text-white hover:text-[#A32035] flex items-center"
          >
            Galaxy
          </NuxtLink>
          <div v-if="isMounted && isLoggedIn" class="menu-item has-dropdown relative group">
              <a
                href="#"
                class="menu-item-link flex items-center gap-2"
              >
                <span class="menu-item-label text-white group-hover:text-[#A32035]">Profile</span>
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
                class="dropdown-menu invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full right-0 min-w-[180px] bg-white bg-opacity-95 rounded-md transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
              >
                <ul class="py-2">
                  <li class="group">
                    <NuxtLink
                      to="/admin/profile"
                      class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                      :class="{ 'bg-gray-100': route.path === '/admin/profile' }"
                    >
                      <span
                        class="mr-3 text-black ml-4 flex items-center"
                        :class="{ 'text-[#A32035]': route.path === '/admin/profile' }"
                      >
                        <ClientOnly>
                          <v-icon name="bi-person" class="w-4 h-4" />
                          <template #fallback>
                            <span class="w-4 h-4 inline-block" />
                          </template>
                        </ClientOnly>
                      </span>
                      <span
                        class="mr-4"
                        :class="{ 'text-[#A32035]': route.path === '/admin/profile' }"
                      >Profile</span>
                    </NuxtLink>
                  </li>
                  <li class="group">
                    <NuxtLink
                      to="/suggestions/my"
                      class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                      :class="{ 'bg-gray-100': route.path === '/suggestions/my' }"
                    >
                      <span
                        class="mr-3 text-black ml-4 flex items-center"
                        :class="{ 'text-[#A32035]': route.path === '/suggestions/my' }"
                      >
                        <ClientOnly>
                          <v-icon name="bi-clipboard" class="w-4 h-4" />
                          <template #fallback>
                            <span class="w-4 h-4 inline-block" />
                          </template>
                        </ClientOnly>
                      </span>
                      <span
                        class="mr-4"
                        :class="{ 'text-[#A32035]': route.path === '/suggestions/my' }"
                      >My Suggestions</span>
                    </NuxtLink>
                  </li>
                  <template v-if="isAdminOrEditor">
                    <li class="border-t border-gray-200 my-1" />
                    <li v-if="canReviewSuggestions" class="group">
                      <NuxtLink
                        to="/admin/suggestions"
                        class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                        :class="{ 'bg-gray-100': route.path === '/admin/suggestions' }"
                      >
                        <span
                          class="mr-3 text-black ml-4 flex items-center"
                          :class="{ 'text-[#A32035]': route.path === '/admin/suggestions' }"
                        >
                          <ClientOnly>
                            <v-icon name="bi-clipboard-check" class="w-4 h-4" />
                            <template #fallback>
                              <span class="w-4 h-4 inline-block" />
                            </template>
                          </ClientOnly>
                        </span>
                        <span
                          class="mr-4"
                          :class="{ 'text-[#A32035]': route.path === '/admin/suggestions' }"
                        >Review Queue</span>
                      </NuxtLink>
                    </li>
                    <li v-if="userRole === 'admin'" class="group">
                      <NuxtLink
                        to="/admin/changelog"
                        class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                        :class="{ 'bg-gray-100': route.path === '/admin/changelog' }"
                      >
                        <span
                          class="mr-3 text-black ml-4 flex items-center"
                          :class="{ 'text-[#A32035]': route.path === '/admin/changelog' }"
                        >
                          <ClientOnly>
                            <v-icon name="bi-clock-history" class="w-4 h-4" />
                            <template #fallback>
                              <span class="w-4 h-4 inline-block" />
                            </template>
                          </ClientOnly>
                        </span>
                        <span
                          class="mr-4"
                          :class="{ 'text-[#A32035]': route.path === '/admin/changelog' }"
                        >Change Log</span>
                      </NuxtLink>
                    </li>
                    <li v-if="userRole === 'admin'" class="group">
                      <NuxtLink
                        to="/admin/bug-reports"
                        class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                        :class="{ 'bg-gray-100': route.path === '/admin/bug-reports' }"
                      >
                        <span
                          class="mr-3 text-black ml-4 flex items-center"
                          :class="{ 'text-[#A32035]': route.path === '/admin/bug-reports' }"
                        >
                          <ClientOnly>
                            <v-icon name="bi-bug" class="w-4 h-4" />
                            <template #fallback>
                              <span class="w-4 h-4 inline-block" />
                            </template>
                          </ClientOnly>
                        </span>
                        <span
                          class="mr-4"
                          :class="{ 'text-[#A32035]': route.path === '/admin/bug-reports' }"
                        >Bug Reports</span>
                      </NuxtLink>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="lg:hidden flex items-center gap-4 pr-4">
          <div class="bg-white p-1 rounded inline-flex items-center">
            <img alt="processor db logo" class="h-[1.125rem]" src="/logo-trans-cropped.png">
          </div>
          <!-- Database Dropdown (kept separate on mobile) -->
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
                  <!-- Always show non-Profile links, conditionally show Profile link after mount -->
                  <div v-if="link.text !== 'Profile' || (isMounted && isLoggedIn)">
                    <NuxtLink
                      v-if="link.to && link.to !== '/admin/null'"
                      :to="link.to"
                      class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    >
                      <span
                        class="mr-3 text-black ml-4 flex items-center"
                        :class="{ 'text-[#A32035]': route.path === link.to }"
                      >
                        <ClientOnly>
                          <v-icon :name="link.icon" class="w-4 h-4" />
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
          <!-- Mobile Menu Dropdown (only non-dropdown items) -->
          <div class="menu-item has-dropdown relative group mobile-menu-dropdown">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="menu-item-link flex items-center gap-2"
            >
              <span class="menu-item-label text-white">Menu</span>
              <svg
                width="13"
                height="9"
                class="chevron text-white transition-transform duration-200"
                :class="{ 'rotate-180': mobileMenuOpen }"
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
            </button>
            <div
              v-show="mobileMenuOpen"
              class="dropdown-menu absolute top-full right-0 min-w-[200px] bg-white bg-opacity-95 rounded-md transition-all duration-200 mt-2 shadow-lg"
            >
              <ul class="py-2">
                <li>
                  <NuxtLink
                    to="/about"
                    @click="mobileMenuOpen = false"
                    class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    :class="{ 'bg-gray-100': route.path === '/about' }"
                  >
                    <span
                      class="mr-3 text-black ml-4"
                      :class="{ 'text-[#A32035]': route.path === '/about' }"
                    >About</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/team"
                    @click="mobileMenuOpen = false"
                    class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    :class="{ 'bg-gray-100': route.path === '/team' }"
                  >
                    <span
                      class="mr-3 text-black ml-4"
                      :class="{ 'text-[#A32035]': route.path === '/team' }"
                    >Team</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/steering-committee"
                    @click="mobileMenuOpen = false"
                    class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    :class="{ 'bg-gray-100': route.path === '/steering-committee' }"
                  >
                    <span
                      class="mr-3 text-black ml-4"
                      :class="{ 'text-[#A32035]': route.path === '/steering-committee' }"
                    >Steering Committee</span>
                  </NuxtLink>
                </li>
                <li v-if="enableGalaxy">
                  <NuxtLink
                    to="/galaxy"
                    @click="mobileMenuOpen = false"
                    class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    :class="{ 'bg-gray-100': route.path === '/galaxy' }"
                  >
                    <span
                      class="mr-3 text-black ml-4"
                      :class="{ 'text-[#A32035]': route.path === '/galaxy' }"
                    >Galaxy</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <!-- Profile Dropdown (kept separate on mobile) -->
          <div v-if="isMounted && isLoggedIn" class="menu-item has-dropdown relative group">
            <a
              href="#"
              class="menu-item-link flex items-center gap-2"
            >
              <span class="menu-item-label text-white group-hover:text-[#A32035]">Profile</span>
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
              class="dropdown-menu invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full right-0 min-w-[180px] bg-white bg-opacity-95 rounded-md transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
            >
              <ul class="py-2">
                <li class="group">
                  <NuxtLink
                    to="/admin/profile"
                    class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    :class="{ 'bg-gray-100': route.path === '/admin/profile' }"
                  >
                    <span
                      class="mr-3 text-black ml-4 flex items-center"
                      :class="{ 'text-[#A32035]': route.path === '/admin/profile' }"
                    >
                      <ClientOnly>
                        <v-icon name="bi-person" class="w-4 h-4" />
                        <template #fallback>
                          <span class="w-4 h-4 inline-block" />
                        </template>
                      </ClientOnly>
                    </span>
                    <span
                      class="mr-4"
                      :class="{ 'text-[#A32035]': route.path === '/admin/profile' }"
                    >Profile</span>
                  </NuxtLink>
                </li>
                <li class="group">
                  <NuxtLink
                    to="/suggestions/my"
                    class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                    :class="{ 'bg-gray-100': route.path === '/suggestions/my' }"
                  >
                    <span
                      class="mr-3 text-black ml-4 flex items-center"
                      :class="{ 'text-[#A32035]': route.path === '/suggestions/my' }"
                    >
                      <ClientOnly>
                        <v-icon name="bi-clipboard" class="w-4 h-4" />
                        <template #fallback>
                          <span class="w-4 h-4 inline-block" />
                        </template>
                      </ClientOnly>
                    </span>
                    <span
                      class="mr-4"
                      :class="{ 'text-[#A32035]': route.path === '/suggestions/my' }"
                    >My Suggestions</span>
                  </NuxtLink>
                </li>
                <template v-if="isAdminOrEditor">
                  <li class="border-t border-gray-200 my-1" />
                  <li v-if="canReviewSuggestions" class="group">
                    <NuxtLink
                      to="/admin/suggestions"
                      class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                      :class="{ 'bg-gray-100': route.path === '/admin/suggestions' }"
                    >
                      <span
                        class="mr-3 text-black ml-4 flex items-center"
                        :class="{ 'text-[#A32035]': route.path === '/admin/suggestions' }"
                      >
                        <ClientOnly>
                          <v-icon name="bi-clipboard-check" class="w-4 h-4" />
                          <template #fallback>
                            <span class="w-4 h-4 inline-block" />
                          </template>
                        </ClientOnly>
                      </span>
                      <span
                        class="mr-4"
                        :class="{ 'text-[#A32035]': route.path === '/admin/suggestions' }"
                      >Review Queue</span>
                    </NuxtLink>
                  </li>
                  <li v-if="userRole === 'admin'" class="group">
                    <NuxtLink
                      to="/admin/changelog"
                      class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                      :class="{ 'bg-gray-100': route.path === '/admin/changelog' }"
                    >
                      <span
                        class="mr-3 text-black ml-4 flex items-center"
                        :class="{ 'text-[#A32035]': route.path === '/admin/changelog' }"
                      >
                        <ClientOnly>
                          <v-icon name="bi-clock-history" class="w-4 h-4" />
                          <template #fallback>
                            <span class="w-4 h-4 inline-block" />
                          </template>
                        </ClientOnly>
                      </span>
                      <span
                        class="mr-4"
                        :class="{ 'text-[#A32035]': route.path === '/admin/changelog' }"
                      >Change Log</span>
                    </NuxtLink>
                  </li>
                  <li v-if="userRole === 'admin'" class="group">
                    <NuxtLink
                      to="/admin/bug-reports"
                      class="flex items-center py-3 text-black hover:bg-gray-200 justify-start"
                      :class="{ 'bg-gray-100': route.path === '/admin/bug-reports' }"
                    >
                      <span
                        class="mr-3 text-black ml-4 flex items-center"
                        :class="{ 'text-[#A32035]': route.path === '/admin/bug-reports' }"
                      >
                        <ClientOnly>
                          <v-icon name="bi-bug" class="w-4 h-4" />
                          <template #fallback>
                            <span class="w-4 h-4 inline-block" />
                          </template>
                        </ClientOnly>
                      </span>
                      <span
                        class="mr-4"
                        :class="{ 'text-[#A32035]': route.path === '/admin/bug-reports' }"
                      >Bug Reports</span>
                    </NuxtLink>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';
import { isLogged, getRole } from '../lib/isLogged';
import { getItemWithExpiry } from '../lib/encrypter';

const config = useRuntimeConfig();
const enableGalaxy = computed(() => config.public.enableGalaxy || false);

// Initialize as false/null for consistent SSR rendering
// These will update on client after hydration completes
const isLoggedIn = ref(false);
const userRole = ref(null);
const route = useRoute();
const mobileMenuOpen = ref(false);
const isMounted = ref(false);

// Close mobile menu when clicking outside
const handleClickOutside = (event) => {
  // Check if click is inside the mobile menu dropdown
  const mobileMenuDropdown = event.target.closest('.mobile-menu-dropdown');
  // Close if clicking outside the mobile menu area
  if (!mobileMenuDropdown && mobileMenuOpen.value) {
    mobileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Mark as mounted first to enable client-side rendering
  isMounted.value = true;
  
  // Update login state after mount to avoid hydration mismatches
  // Use nextTick to ensure this happens after Vue's hydration completes
  nextTick(() => {
    isLoggedIn.value = isLogged();
    userRole.value = getRole();
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Check if user can review suggestions (admin or editor with permission)
// Always return false during SSR to avoid hydration mismatches
const canReviewSuggestions = computed(() => {
  // On server, always return false to ensure consistent SSR
  if (typeof window === 'undefined') return false;
  if (!isLoggedIn.value) return false;
  const role = userRole.value;
  // For now, we'll show the link to admins and editors
  // The actual permission check happens on the backend
  return role === 'admin' || role === 'editor';
});

// Check if user is admin or editor (for showing admin dropdown)
// Always return false during SSR to avoid hydration mismatches
const isAdminOrEditor = computed(() => {
  // On server, always return false to ensure consistent SSR
  if (typeof window === 'undefined') return false;
  if (!isLoggedIn.value) return false;
  const role = userRole.value;
  return role === 'admin' || role === 'editor';
});

const links = ref([
  { text: 'Login', to: '/login', icon: 'md-login' },
  // { text: 'Manufacturers', to: '/manufacturers/list', icon: 'md-precisionmanufacturing' },
  { text: 'CPUs', to: '/cpu/list', icon: 'bi-cpu' },
  { text: 'GPUs', to: '/gpu/list', icon: 'bi-gpu-card' },
  { text: 'FPGAs', to: '/fpga/list', icon: 'gi-logic-gate-xor' },
  { text: 'SoCs', to: '/soc/list', icon: 'gi-circuitry' },
  // { text: 'Economics', to: '/economics', icon: 'md-attachmoney' },
  // { text: 'Performances', to: '/performances', icon: 'gi-chart' },
]);

</script>