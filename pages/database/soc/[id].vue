<template>
  <div class="text-gray-800 bg-gray-50">
    <Navbar/>
    <div class="max-w-7xl mx-auto my-16">
      <div class="mt-16">
        <span class="text-sm">Details</span>
        <h1 class="text-4xl font-bold">{{data.soc_name}}</h1>
      </div>
     
    <!-- SoC Information -->
    <section class="mb-8 text-sm">
      <h1 class="text-3xl font-bold mb-4">{{ soc.name }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- General SoC Info -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">General Information</h2>
          <ul class="space-y-2">
            <li><strong>Manufacturer:</strong> {{ soc.manufacturer_name }}</li>
            <li><strong>Release Date:</strong> {{ formatDate(soc.release_date) }}</li>
            <li><strong>Process Node:</strong> {{ soc.process_node }} nm</li>
            <li><strong>Core Count:</strong> {{ soc.core_count }}</li>
            <li><strong>Total Transistor Count:</strong> {{ soc.total_transistor_count }}</li>
            <li><strong>Platform:</strong> {{ soc.platform }}</li>
          </ul>
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
          <ul class="space-y-2">
            <li><strong>Family:</strong> {{ cpu.family }}</li>
            <li><strong>Clock Speed:</strong> {{ cpu.clock }} GHz</li>
            <li><strong>Core Count:</strong> {{ cpu.core_count }}</li>
            <!-- Additional CPU details -->
          </ul>
          <!-- CPU Cache Info -->
          <div class="mt-4">
            <h4 class="text-lg font-semibold mb-2">Cache</h4>
            <ul class="space-y-1">
              <li><strong>L1 Cache:</strong> {{ cpu.l1_cache }}</li>
              <li><strong>L2 Cache:</strong> {{ cpu.l2_cache }}</li>
              <li><strong>L3 Cache:</strong> {{ cpu.l3_cache }}</li>
            </ul>
          </div>
        </div>

        <!-- GPU Section -->
        <div v-for="gpu in gpus" :key="gpu.gpu_id" class="bg-white shadow rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-4">GPU: {{ gpu.name }}</h3>
          <ul class="space-y-2">
            <li><strong>Architecture:</strong> {{ gpu.architecture }}</li>
            <li><strong>Base Clock:</strong> {{ gpu.base_clock }} MHz</li>
            <li><strong>Memory Size:</strong> {{ gpu.memory_size }} MB</li>
            <!-- Additional GPU details -->
          </ul>
          <!-- GPU Cache Info -->
          <div class="mt-4">
            <h4 class="text-lg font-semibold mb-2">Cache</h4>
            <ul class="space-y-1">
              <li><strong>L0 Cache:</strong> {{ gpu.l0_cache }}</li>
              <li><strong>L1 Cache:</strong> {{ gpu.l1_cache }}</li>
              <li><strong>L2 Cache:</strong> {{ gpu.l2_cache }}</li>
              <li><strong>L3 Cache:</strong> {{ gpu.l3_cache }}</li>
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
            <th class="py-2 px-4 border-b">Test Date</th>
            <th class="py-2 px-4 border-b">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="benchmark in benchmarks" :key="benchmark.benchmark_id">
            <td class="py-2 px-4 border-b">{{ benchmark.benchmark_name }}</td>
            <td class="py-2 px-4 border-b">{{ benchmark.score }}</td>
            <td class="py-2 px-4 border-b">{{ formatDate(benchmark.test_date) }}</td>
            <td class="py-2 px-4 border-b">{{ benchmark.notes }}</td>
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
            <th class="py-2 px-4 border-b">Sales (Units)</th>
            <th class="py-2 px-4 border-b">Revenue</th>
            <th class="py-2 px-4 border-b">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="eco in economics" :key="eco.economic_data_id">
            <td class="py-2 px-4 border-b">{{ eco.year }}</td>
            <td class="py-2 px-4 border-b">${{ eco.price }}</td>
            <td class="py-2 px-4 border-b">{{ eco.sales_in_units }}</td>
            <td class="py-2 px-4 border-b">${{ eco.revenue }}</td>
            <td class="py-2 px-4 border-b">{{ eco.notes }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

    <Footer/>
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