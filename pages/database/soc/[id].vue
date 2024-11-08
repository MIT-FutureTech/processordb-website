<template>
  <div class="text-gray-800 bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto my-16">
      <div class="mt-16">
        <span class="text-sm">Details</span>
        <h1 class="text-4xl font-bold">{{ data.soc_name }}</h1>
      </div>

      <!-- SoC Information -->
      <section class="mb-8 text-sm">
        <h1 class="text-3xl font-bold mb-4">{{ soc.name }}</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- General SoC Info -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">General Information</h2>
            <div class="flex space-x-4">

              <!-- Left column -->
              <ul class="space-y-2 flex-1">
                <li><strong>Manufacturer:</strong> {{ soc.manufacturer_name || '-' }}</li>
                <li><strong>Release Date:</strong> {{ formatDate(soc.release_date) || '-' }}</li>
                <li><strong>Process Node:</strong> {{ soc.process_node || '-' }} nm</li>
                <li><strong>Core Count:</strong> {{ soc.core_count || '-' }}</li>
                <li><strong>Total Transistor Count:</strong> {{ soc.total_transistor_count || '-' }}</li>
                <li><strong>Package size (mm²):</strong> {{ soc.package_size || '-' }}</li>
              </ul>

              <!-- Right column -->
              <ul class="space-y-2 flex-1">
                <li><strong>Die size (mm²):</strong> {{ soc.die_sizes || '-' }}</li>
                <li><strong>Number of Dies:</strong> {{ soc.number_of_die || '-' }}</li>
                <li><strong>Transistor density:</strong> {{ soc.transistor_density || '-' }}</li>
                <li><strong>Voltage (low):</strong> {{ soc.voltage_range_low || '-' }}</li>
                <li><strong>Voltage (high):</strong> {{ soc.voltage_range_high || '-' }}</li>
                <li><strong>Platform:</strong> {{ soc.platform }}</li>
              </ul>
            </div>
          </div>

          <!-- Cache Info -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Cache</h2>
            <ul class="space-y-2">
              <li><strong>L1 Cache:</strong> {{ soc.cache.l1 }}</li>
              <li><strong>L2 Cache:</strong> {{ soc.cache.l2 }}</li>
              <li><strong>L3 Cache:</strong> {{ soc.cache.l3 }}</li>
              <li><strong>L4 Cache:</strong> {{ soc.cache.l4 }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Processors -->
      <section class="mb-8 text-sm">
        <h2 class="text-2xl font-bold mb-4">Processors</h2>
        <div class="space-y-6">

          <!-- CPU Section -->
          <div v-for="cpu in cpus" :key="cpu.cpu_id" class="bg-white shadow rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">CPU: {{ cpu.model }}</h3>
            <div class="flex space-x-4">
              <!-- Left column -->
              <ul class="space-y-2 flex-1">
                <li><strong>Processor Family:</strong> {{ cpu.family || '-' }}</li>
                <li><strong>Processor Code Name:</strong> {{ cpu.code_name || '-' }}</li>
                <li><strong>Microarchitecture:</strong> {{ cpu.microarchitecture || '-' }}</li>
                <li><strong>Processor Model:</strong> {{ cpu.model || '-' }}</li>
                <li><strong>Processor Clock (MHz):</strong> {{ cpu.clock || '-' }}</li>
                <li><strong>Processor Clock - Max - (MHz):</strong> {{ cpu.max_clock || '-' }}</li>
                <li><strong>Threads/Core:</strong> {{ cpu.threads_per_core || '-' }}</li>
                <li><strong>Cores:</strong> {{ cpu.core_count || '-' }}</li>
                <li><strong>TDP(W):</strong> {{ cpu.tdp || '-' }}</li>
                <li><strong>Lithography (nm):</strong> {{ cpu.lithography || '-' }}</li>
                <li><strong>L1 Cache KB:</strong> {{ cpu.l1_cache || '-' }}</li>
                <li><strong>L1 Data Cache KB:</strong> {{ cpu.l1_cache_data || '-' }}</li>
                <li><strong>L1 Cache Latency (clock cycles):</strong> {{ cpu.l1_cache_latency || '-' }}</li>
                <li><strong>L1 Instruction Cache KB:</strong> {{ cpu.l1_cache_instruction || '-' }}</li>
                <li><strong>L2 Cache KB:</strong> {{ cpu.l2_cache || '-' }}</li>
                <li><strong>L2 Cache Latency (clock cycles):</strong> {{ cpu.l2_cache_latency || '-' }}</li>
                <li><strong>L3 Cache MB:</strong> {{ cpu.l3_cache || '-' }}</li>
                <li><strong>L3 Cache Latency (clock cycles):</strong> {{ cpu.l3_cache_latency || '-' }}</li>
                <li><strong>L4 Cache MB:</strong> {{ cpu.l4_cache || '-' }}</li>
                <li><strong>Bus Speed MT/s:</strong> {{ cpu.bus_speed || '-' }}</li>
              </ul>

              <!-- Right column -->
              <ul class="space-y-2 flex-1">
                <li><strong>Max Memory Size (GB):</strong> {{ cpu.max_memory_size || '-' }}</li>
                <li><strong>Memory Type:</strong> {{ cpu.memory_type || '-' }}</li>
                <li><strong>Max Number of Memory Channels:</strong> {{ cpu.max_memory_channels || '-' }}</li>
                <li><strong>Max Memory Bandwidth (GB/s):</strong> {{ cpu.max_memory_bandwidth || '-' }}</li>
                <li><strong>Turbo Boost Max Technology 3.0 Frequency (MHz):</strong> {{
                  cpu.turbo_boost_max_technology_3_frequency || '-' }}</li>
                <li><strong>Turbo Frequency 1 Core:</strong> {{ cpu.turbo_frequency_1core || '-' }}</li>
                <li><strong>Turbo Frequency 2 Cores:</strong> {{ cpu.turbo_frequency_2core || '-' }}</li>
                <li><strong>eDRAM MB:</strong> {{ cpu.edram || '-' }}</li>
                <li><strong>Instruction Set Width:</strong> {{ cpu.instruction_set_width || '-' }}</li>
                <li><strong>MIPS:</strong> {{ cpu.mips || '-' }}</li>
                <li><strong>Processor Graphics:</strong> {{ cpu.graphics || '-' }}</li>
                <li><strong>Graphics Max Dynamic Frequency (MHz):</strong> {{ cpu.graphics_max_dynamic_frequency || '-'
                  }}</li>
                <li><strong>Graphics Base Frequency (MHz):</strong> {{ cpu.graphics_base_frequency || '-' }}</li>
                <li><strong>Graphics Max Memory Size (GB):</strong> {{ cpu.graphics_memory_size || '-' }}</li>
                <li><strong>FP16 (operations per cycle per core):</strong> {{ cpu.fp16_ops || '-' }}</li>
                <li><strong>FP32 (operations per cycle per core):</strong> {{ cpu.fp32_ops || '-' }}</li>
                <li><strong>FP32 Theoretical MFLOP/s:</strong> {{ cpu.fp32_theoretical_mflops || '-' }}</li>
                <li><strong>FP32 Measured GFLOPs:</strong> {{ cpu.fp32_measured_gflops || '-' }}</li>
                <li><strong>FP64 (operations per cycle per core):</strong> {{ cpu.fp64_ops || '-' }}</li>
              </ul>
            </div>
          </div>


          <!-- GPU Section -->
          <div v-for="gpu in gpus" :key="gpu.soc_id" class="bg-white shadow rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">GPU: {{ gpu.name }}</h3>
            <div class="flex space-x-4">
              <!-- Left column -->
              <ul class="space-y-2 flex-1">
                <li><strong>Variant:</strong> {{ gpu.variant || '-' }}</li>
                <li><strong>Architecture:</strong> {{ gpu.architecture || '-' }}</li>
                <li><strong>Generation:</strong> {{ gpu.generation || '-' }}</li>
                <li><strong>Process Size (nm):</strong> {{ gpu.process_size || '-' }}</li>
                <li><strong>TDP (W):</strong> {{ gpu.tdp || '-' }}</li>
                <li><strong>Base Clock (MHz):</strong> {{ gpu.base_clock || '-' }}</li>
                <li><strong>Boost Clock (MHz):</strong> {{ gpu.boost_clock || '-' }}</li>
                <li><strong>Memory Clock (MHz):</strong> {{ gpu.memory_clock || '-' }}</li>
                <li><strong>Memory Size (GB):</strong> {{ gpu.memory_size || '-' }}</li>
                <li><strong>Memory Type:</strong> {{ gpu.memory_type || '-' }}</li>
                <li><strong>Memory Bus (bits):</strong> {{ gpu.memory_bus || '-' }}</li>
                <li><strong>Memory Bandwidth (GB/s):</strong> {{ gpu.memory_bandwidth || '-' }}</li>
                <li><strong>L0 Cache (KB):</strong> {{ gpu.l0_cache || '-' }}</li>
                <li><strong>L1 Cache (KB):</strong> {{ gpu.l1_cache || '-' }}</li>
                <li><strong>L2 Cache (KB):</strong> {{ gpu.l2_cache || '-' }}</li>
                <li><strong>L3 Cache (KB):</strong> {{ gpu.l3_cache || '-' }}</li>
                <li><strong>Pixel Rate (GPixel/s):</strong> {{ gpu.pixel_rate || '-' }}</li>
              </ul>

              <!-- Right column -->
              <ul class="space-y-2 flex-1">
                <li><strong>Texture Rate (GTexel/s):</strong> {{ gpu.texture_rate || '-' }}</li>
                <li><strong>FP16 (half) Performance:</strong> {{ gpu.fp16 || '-' }}</li>
                <li><strong>FP32 Performance:</strong> {{ gpu.fp32 || '-' }}</li>
                <li><strong>FP64 (double) Performance:</strong> {{ gpu.fp64 || '-' }}</li>
                <li><strong>Slot:</strong> {{ gpu.slot || '-' }}</li>
                <li><strong>DirectX:</strong> {{ gpu.directx || '-' }}</li>
                <li><strong>OpenGL:</strong> {{ gpu.opengl || '-' }}</li>
                <li><strong>OpenCL:</strong> {{ gpu.opencl || '-' }}</li>
                <li><strong>Vulkan:</strong> {{ gpu.vulkan || '-' }}</li>
                <li><strong>Pixel Shader:</strong> {{ gpu.pixel_shader || '-' }}</li>
                <li><strong>Vertex Shader:</strong> {{ gpu.vertex_shader || '-' }}</li>
                <li><strong>Shader Units (SU):</strong> {{ gpu.shader_units || '-' }}</li>
                <li><strong>Texture Mapping Units (TMUs):</strong> {{ gpu.texture_mapping_units || '-' }}</li>
                <li><strong>Render Output Units (ROPs):</strong> {{ gpu.render_output_units || '-' }}</li>
                <li><strong>Compute Units (CUs):</strong> {{ gpu.compute_units || '-' }}</li>
                <li><strong>Ray Tracing Units (RTs):</strong> {{ gpu.ray_tracing_units || '-' }}</li>
                <li><strong>Bus Interface:</strong> {{ gpu.bus_interface || '-' }}</li>
                <li><strong>System Shared Memory:</strong> {{ gpu.system_shared_memory ? 'Yes' : 'No' }}</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      <!-- Benchmarks -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Benchmarks</h2>
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
      <section>
        <h2 class="text-2xl font-bold mb-4">Economic Data</h2>
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
const { data } = await useFetch(`http://localhost:3001/api/socs/${route.params.id}`)

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

</script>