<template>

  <div class="text-gray-800 bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pl-4">
      <div class="mt-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/database">Database</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>

            </BreadcrumbItem>

          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <!-- SoC Information -->
      <section class="mb-8 text-sm shadow-sm">
        <h1 class="text-3xl font-bold mb-4">{{ soc.name }}</h1>
        <div>
          <!-- General SoC Info -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">General Information</h2>
            <div class="flex space-x-4">

              <!-- Left column -->
              <ul class="space-y-2 flex-1">
                <li class="pl-4"><strong>Manufacturer:</strong>
                  <NuxtLink class="underline font-medium hover:text-[#A32035]"
                    :to="`/database/manufacturer/${slugify(soc.manufacturer_name)}`">
                    {{ soc.manufacturer_name || '-' }}
                  </NuxtLink>
                </li>
                <li class="pl-4"><strong>Release Date:</strong> {{ formatDate(soc.release_date) || '-' }}</li>
                <li class="pl-4"><strong>Process Node(nm):</strong> {{ soc.process_node || '-' }}</li>
                <li class="pl-4"><strong>Core Count:</strong> {{ soc.core_count || '-' }}</li>
                <li class="pl-4"><strong>Total Transistor Count:</strong> {{ soc.total_transistor_count || '-' }}</li>
                <li class="pl-4"><strong>Package size (mm²):</strong> {{ soc.package_size || '-' }}</li>
              </ul>

              <!-- Right column -->
              <ul class="space-y-2 flex-1">
                <li class="pl-4"><strong>Die size (mm²):</strong> {{ soc.die_sizes || '-' }}</li>
                <li class="pl-4"><strong>Number of Dies:</strong> {{ soc.number_of_die || '-' }}</li>
                <li class="pl-4"><strong>Transistor density:</strong> {{ soc.transistor_density || (soc.total_transistor_count/soc.die_sizes).toFixed(2) || '-' }}</li>
                <li class="pl-4"><strong>Voltage (low):</strong> {{ soc.voltage_range_low || '-' }}</li>
                <li class="pl-4"><strong>Voltage (high):</strong> {{ soc.voltage_range_high || '-' }}</li>
                <li class="pl-4"><strong>Platform:</strong> {{ soc.platform }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Processors -->
      <section class="mb-8 text-sm shadow-sm">
        <h2 class="text-2xl font-bold mb-4 pl-4 text-[#A32035]">Processors</h2>
        <div class="space-y-6">

          <!-- CPU Section -->
          <div v-for="cpu in cpus" :key="cpu.cpu_id" class="bg-white shadow rounded-lg p-6">
            <h3 class="text-2xl font-bold mb-4">CPU {{ cpu.model }}</h3>
            <div class="flex space-x-4">
              <!-- Left column -->
              <div class="space-y-8 flex-1">
                <!-- General Information -->
                <div>
                  <h4 class="text-lg font-semibold mb-2">General Information</h4>
                  <ul class="space-y-2">
                    <li class="pl-4"><strong>Processor Family:</strong>
                      <NuxtLink class="underline font-medium hover:text-[#A32035]"
                        :to="`/database/manufacturer/${slugify(soc.manufacturer_name)}/family/${slugify(cpu.core_info.microarchitecture)}`">
                          {{ cpu.core_info.family || '-' }}
                      </NuxtLink>
                    </li>
                    <li class="pl-4"><strong>Processor Code Name:</strong> {{ cpu.core_info.code_name || '-' }}</li>
                    <li class="pl-4"><strong>Microarchitecture:</strong>
                      <NuxtLink class="underline font-medium hover:text-[#A32035]"
                        :to="`/database/manufacturer/${slugify(soc.manufacturer_name)}/microarchitecture/${slugify(cpu.core_info.microarchitecture)}`">
                        {{ cpu.core_info.microarchitecture || '-' }}
                      </NuxtLink>
                    </li>
                    <li class="pl-4"><strong>Processor Model:</strong> {{ cpu.core_info.model || '-' }}</li>
                    <li class="pl-4"><strong>Processor Clock (MHz):</strong> {{ cpu.core_info.clock || '-' }}</li>
                    <li class="pl-4"><strong>Processor Clock - Max - (MHz):</strong> {{ cpu.core_info.max_clock || '-'
                      }}</li>
                    <li class="pl-4"><strong>Threads/Core:</strong> {{ cpu.core_info.threads_per_core || '-' }}</li>
                    <li class="pl-4"><strong>Cores:</strong> {{ cpu.core_info.core_count || '-' }}</li>
                    <li class="pl-4"><strong>TDP(W):</strong> {{ cpu.core_info.tdp || '-' }}</li>
                    <li class="pl-4"><strong>Lithography (nm):</strong> {{ cpu.core_info.lithography || '-' }}</li>
                  </ul>
                </div>

                <!-- Cache Information -->
                <div>
                  <h4 class="text-lg font-semibold mb-2">Cache Information</h4>
                  <ul class="space-y-2">
                    <li class="pl-4"><strong>L1 Cache (KB):</strong> {{ cpu.cache_info.l1_cache || '-' }}</li>
                    <li class="pl-4"><strong>L1 Data Cache (KB):</strong> {{ cpu.cache_info.l1_cache_data || '-' }}</li>
                    <li class="pl-4"><strong>L1 Cache Latency (Clock cycles):</strong> {{
                      cpu.cache_info.l1_cache_latency || '-' }}</li>
                    <li class="pl-4"><strong>L1 Instruction Cache (KB):</strong> {{ cpu.cache_info.l1_cache_instruction
                      || '-' }}</li>
                    <li class="pl-4"><strong>L2 Cache (KB):</strong> {{ cpu.cache_info.l2_cache || '-' }}</li>
                    <li class="pl-4"><strong>L2 Cache Latency (Clock cycles):</strong> {{
                      cpu.cache_info.l2_cache_latency || '-' }}</li>
                    <li class="pl-4"><strong>L3 Cache (MB):</strong> {{ cpu.cache_info.l3_cache || '-' }}</li>
                    <li class="pl-4"><strong>L3 Cache Latency (Clock cycles):</strong> {{
                      cpu.cache_info.l3_cache_latency || '-' }}</li>
                    <li class="pl-4"><strong>L4 Cache (MB):</strong> {{ cpu.cache_info.l4_cache || '-' }}</li>
                    <li class="pl-4"><strong>Bus Speed (MT/s):</strong> {{ cpu.additional_info.bus_speed || '-' }}</li>
                  </ul>
                </div>

                <!-- Frequency Information -->
                <div>
                  <h4 class="text-lg font-semibold mb-2">Frequency Information</h4>
                  <ul class="space-y-2">
                    <li class="pl-4"><strong>Turbo Boost Max Technology 3.0 Frequency (MHz):</strong> {{
                      cpu.additional_info.turbo_boost_max_technology_3_frequency || '-' }}</li>
                    <li class="pl-4"><strong>Turbo Frequency 1 Core:</strong> {{ cpu.additional_info.turbo_frequency_1core || '-' }}
                    </li>
                    <li class="pl-4"><strong>Turbo Frequency 2 Cores:</strong> {{ cpu.additional_info.turbo_frequency_2core || '-' }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Right column -->
              <div class="space-y-8 flex-1">
                <!-- Memory Information -->
                <div>
                  <h4 class="text-lg font-semibold mb-2">Memory Information</h4>
                  <ul class="space-y-2">
                    <li class="pl-4"><strong>Max Memory Size (GB):</strong> {{ cpu.memory_info.max_memory_size || '-' }}
                    </li>
                    <li class="pl-4"><strong>Memory Type:</strong> {{ cpu.memory_info.memory_type || '-' }}</li>
                    <li class="pl-4"><strong>Max Number of Memory Channels:</strong> {{
                      cpu.memory_info.max_memory_channels || '-' }}</li>
                    <li class="pl-4"><strong>Max Memory Bandwidth (GB/s):</strong> {{
                      cpu.memory_info.max_memory_bandwidth || '-' }}</li>
                  </ul>
                </div>

                <!-- Performance Information -->
                <div>
                  <h4 class="text-lg font-semibold mb-2">Performance Information</h4>
                  <ul class="space-y-2">
                    <li class="pl-4"><strong>MIPS:</strong> {{ cpu.performance_info.mips || '-' }}</li>
                    <li class="pl-4"><strong>FP16 (Operations per cycle per core):</strong> {{
                      cpu.performance_info.fp16_ops || '-' }}</li>
                    <li class="pl-4"><strong>FP32 (Operations per cycle per core):</strong> {{
                      cpu.performance_info.fp32_ops || '-' }}</li>
                    <li class="pl-4"><strong>FP32 Theoretical (MFLOP/s):</strong> {{
                      cpu.performance_info.fp32_theoretical_mflops || '-' }}</li>
                    <li class="pl-4"><strong>FP32 Measured (GFLOPs):</strong> {{
                      cpu.performance_info.fp32_measured_gflops || '-' }}</li>
                    <li class="pl-4"><strong>FP64 (Operations per cycle per core):</strong> {{
                      cpu.performance_info.fp64_ops || '-' }}</li>
                  </ul>
                </div>

                <!-- Additional Information -->
                <div>
                  <h4 class="text-lg font-semibold mb-2">Additional Information</h4>
                  <ul class="space-y-2">
                    <li class="pl-4"><strong>eDRAM (MB):</strong> {{ cpu.additional_info.edram || '-' }}</li>
                    <li class="pl-4"><strong>Instruction Set Width:</strong> {{
                      cpu.additional_info.instruction_set_width || '-' }}</li>
                    <li class="pl-4"><strong>Processor Graphics:</strong> {{ cpu.graphics || '-' }}</li>
                    <li class="pl-4"><strong>Graphics Max Dynamic Frequency (MHz):</strong> {{
                      cpu.additional_info.graphics_max_dynamic_frequency || '-' }}</li>
                    <li class="pl-4"><strong>Graphics Base Frequency (MHz):</strong> {{
                      cpu.additional_info.graphics_base_frequency || '-' }}</li>
                    <li class="pl-4"><strong>Graphics Max Memory Size (GB):</strong> {{
                      cpu.additional_info.graphics_memory_size || '-' }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>


          <!-- GPU Section -->
          <div v-for="gpu in gpus" :key="gpu.soc_id" class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
              <h3 class="text-xl font-semibold mb-4">GPU: {{ gpu.name }}</h3>
            </div>

            <div class="flex space-x-4">
              <!-- Left column -->
              <div class="space-y-8 flex-1">
                <!-- General Info -->
                <div>
                  <h4 class="text-lg font-semibold mb-4">General Information</h4>
                  <ul class="space-y-2">
                    <li class="pl-4"><strong>Variant:</strong> {{ gpu.general_info.variant || '-' }}</li>
                    <li class="pl-4"><strong>TDP (W):</strong> {{ gpu.general_info.tdp || '-' }}</li>
                    <li class="pl-4"><strong>Cores:</strong> {{ gpu.general_info.core_count || '-' }}</li>
                  </ul>
                </div>

                <!-- Architecture Info -->
                <div>
                  <ul class="space-y-2">
                    <h4 class="text-lg font-semibold mb-4">Architecture Information</h4>
                    <li class="pl-4"><strong>Architecture:</strong>
                      <NuxtLink class="underline font-medium hover:text-[#A32035]"
                        :to="`/database/manufacturer/${slugify(soc.manufacturer_name)}/microarchitecture/${slugify(gpu.architecture_info.architecture)}`">
                        {{ gpu.architecture_info.architecture || '-' }}
                      </NuxtLink>
                    </li>
                    <li class="pl-4"><strong>Generation:</strong>
                      <NuxtLink class="underline font-medium hover:text-[#A32035]"
                        :to="`/database/manufacturer/${slugify(soc.manufacturer_name)}/family/${slugify(gpu.architecture_info.generation)}`">
                        {{ gpu.architecture_info.generation || '-' }}
                      </NuxtLink>
                    </li>
                    <li class="pl-4"><strong>Process Size (nm):</strong> {{ gpu.architecture_info.process_size || '-' }}
                    </li>
                  </ul>
                </div>

                <!-- Clock Info -->
                <div>
                  <ul class="space-y-2">
                    <h4 class="text-lg font-semibold mb-4">Clock Information</h4>
                    <li class="pl-4"><strong>Base Clock (MHz):</strong> {{ gpu.clock_info.base_clock || '-' }}</li>
                    <li class="pl-4"><strong>Boost Clock (MHz):</strong> {{ gpu.clock_info.boost_clock || '-' }}</li>
                    <li class="pl-4"><strong>Memory Clock (MHz):</strong> {{ gpu.clock_info.memory_clock || '-' }}</li>
                  </ul>
                </div>


                <!-- Cache Info -->
                <div>
                  <ul class="space-y-2">
                    <h4 class="text-lg font-semibold mb-4">Cache Information</h4>
                    <li class="pl-4"><strong>L0 Cache (KB):</strong> {{ gpu.cache_info.l0_cache || '-' }}</li>
                    <li class="pl-4"><strong>L1 Cache (KB):</strong> {{ gpu.cache_info.l1_cache || '-' }}</li>
                    <li class="pl-4"><strong>L2 Cache (KB):</strong> {{ gpu.cache_info.l2_cache || '-' }}</li>
                    <li class="pl-4"><strong>L3 Cache (KB):</strong> {{ gpu.cache_info.l3_cache || '-' }}</li>
                  </ul>
                </div>

                <!-- Memory Info -->
                <div>
                  <ul class="space-y-2">
                    <h4 class="text-lg font-semibold mb-4">Memory Information</h4>
                    <li class="pl-4"><strong>Memory Size (GB):</strong> {{ gpu.memory_info.memory_size || '-' }}</li>
                    <li class="pl-4"><strong>Memory Type:</strong> {{ gpu.memory_info.memory_type || '-' }}</li>
                    <li class="pl-4"><strong>Memory Bus (bits):</strong> {{ gpu.memory_info.memory_bus || '-' }}</li>
                    <li class="pl-4"><strong>Memory Bandwidth (GB/s):</strong> {{ gpu.memory_info.memory_bandwidth ||
                      '-' }}</li>
                  </ul>
                </div>

              </div>

              <!-- Right column -->
              <div class="space-y-8 flex-1">
                <!-- Compute Info -->
                <div>
                  <ul class="space-y-2">
                    <h4 class="text-lg font-semibold mb-4">Compute Information</h4>
                    <li class="pl-4"><strong>Texture Rate (GTexel/s):</strong> {{ gpu.compute_info.texture_rate || '-'
                      }}</li>
                    <li class="pl-4"><strong>FP16 (half) Performance (TFLOPS):</strong> {{ gpu.compute_info.fp16 || '-'
                      }}</li>
                    <li class="pl-4"><strong>FP32 Performance (TFLOPS):</strong> {{ gpu.compute_info.fp32 || '-' }}</li>
                    <li class="pl-4"><strong>FP64 (double) Performance (GFLOPS):</strong> {{ gpu.compute_info.fp64 ||
                      '-' }}</li>
                    <li class="pl-4"><strong>Shader Units (SU):</strong> {{ gpu.compute_info.shader_units || '-' }}</li>
                    <li class="pl-4"><strong>Texture Mapping Units (TMUs):</strong> {{
                      gpu.compute_info.texture_mapping_units ||
                      '-'
                    }}
                    </li>
                    <li class="pl-4"><strong>Render Output Units (ROPs):</strong> {{
                      gpu.compute_info.render_output_units || '-' }}
                    </li>
                  </ul>
                </div>

                <!-- Graphic API Info -->
                <div>
                  <ul class="space-y-2">
                    <h4 class="text-lg font-semibold mb-4">Graphic API Information</h4>
                    <li class="pl-4"><strong>Pixel Rate (GPixel/s):</strong> {{ gpu.graphic_api_info.pixel_rate || '-'
                      }}</li>
                    <li class="pl-4"><strong>Slot:</strong> {{ gpu.graphic_api_info.slot || '-' }}</li>
                    <li class="pl-4"><strong>DirectX:</strong> {{ gpu.graphic_api_info.directx || '-' }}</li>
                    <li class="pl-4"><strong>OpenGL:</strong> {{ gpu.graphic_api_info.opengl || '-' }}</li>
                    <li class="pl-4"><strong>OpenCL:</strong> {{ gpu.graphic_api_info.opencl || '-' }}</li>
                    <li class="pl-4"><strong>Vulkan:</strong> {{ gpu.graphic_api_info.vulkan || '-' }}</li>
                    <li class="pl-4"><strong>Pixel Shader:</strong> {{ gpu.graphic_api_info.pixel_shader || '-' }}</li>
                    <li class="pl-4"><strong>Vertex Shader:</strong> {{ gpu.graphic_api_info.vertex_shader || '-' }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Benchmarks -->
      <section class="mb-8 shadow-sm">
        <div class="flex items-center">
          <h2 class="text-2xl font-bold mb-4 pl-4 text-[#A32035]">Benchmarks</h2>
        </div>
        <table class="min-w-full bg-white shadow rounded-lg text-left text-sm">
          <thead>
            <tr>
              <th class="py-2 px-4 border-b">Benchmark Name</th>
              <th class="py-2 px-4 border-b">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="benchmark in benchmarks" :key="benchmark.benchmark_id">
              <td class="py-2 px-4 border-b">{{ benchmark.benchmark_name }}</td>
              <td class="py-2 px-4 border-b">{{ benchmark.score }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Economics -->
      <section class="shadow-sm">
        <div class="flex items-center">
          <h2 class="text-2xl font-bold mb-4 pl-4 text-[#A32035]">Economic Data</h2>
        </div>
        <table class="min-w-full bg-white shadow rounded-lg text-left text-sm">
          <thead>
            <tr>
              <th class="py-2 px-4 border-b">Year</th>
              <th class="py-2 px-4 border-b">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eco in economics" :key="eco.economic_data_id">
              <td class="py-2 px-4 border-b">{{ eco.year }}</td>
              <td class="py-2 px-4 border-b">${{ eco.price }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <Footer />
  </div>
</template>

<script setup>
const route = useRoute()
// Fetch data function
const { data } = await useFetch(`https://processordb.mit.edu/backend/api/socs/${route.params.id}`)

// Data references
const soc = ref({})
const cpus = ref([])
const gpus = ref([])
const benchmarks = ref([])
const economics = ref([])

// Utility function to format dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
// Assign data to refs
soc.value = data.value
cpus.value = data.value.processors.filter((p) => p.processor_type === 'CPU')
gpus.value = data.value.processors.filter((p) => p.processor_type === 'GPU')
benchmarks.value = data.value.benchmarks
economics.value = data.value.economics

// Aggregate cache info (example)
soc.value.cache = {
  l1: cpus.value[0]?.l1_cache || 'N/A',
  l2: cpus.value[0]?.l2_cache || 'N/A',
  l3: cpus.value[0]?.l3_cache || 'N/A',
  l4: cpus.value[0]?.l4_cache || 'N/A',
}

function slugify(str) {
  if (!str) return ''

  return str
    .toLowerCase()
    .replace(/[^\w- ]+/g, '') // Allow hyphens by excluding them from the pattern
    .replace(/ +/g, '-')      // Replace spaces with hyphens
}

</script>