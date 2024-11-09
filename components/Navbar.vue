<template>
  <div class="bg-black border-b-4 border-b-[#A32035] sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div>
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-lg md:text-2xl font-bold font-logo text-gray-50">
            <span class="text-[#A32035] inline">MIT</span> <span class="text-nowrap">
              PROCESSOR DB
            </span>
          </h1>
        </NuxtLink>

      </div>
      <div class="flex items-center gap-6">
        <NuxtLink to="/team" class="text-white hover:text-[#A32035] flex items-center">
            Team
          </NuxtLink>
          <NuxtLink to="/team#steering-committee" class="text-white hover:text-[#A32035] flex items-center">
            Steering committee
          </NuxtLink>
        <NuxtLink to="/database" class="text-white hover:text-[#A32035] flex items-center"><svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>Access database <sup>(beta)</sup></NuxtLink>
      </div>
    </div>
  </div>
</template>