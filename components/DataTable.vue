<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">System on Chip (SoC) Database</h1>

        <!-- Filter & Search Input -->
        <div class="flex space-x-4 mb-4">
            <input v-model="search" type="text" placeholder="Search by SoC name..."
                class="border border-gray-300 p-2 rounded" />
            <select v-model="filterType" class="border border-gray-300 p-2 rounded">
                <option value="">All Types</option>
                <option value="CPU">CPU</option>
                <option value="GPU">GPU</option>
                <option value="FPGA">FPGA</option>
                <option value="AIProcessor">AI</option>
            </select>
        </div>

        <!-- Loading Indicator -->
        <div v-if="!filteredData" class="text-center py-4">
            <p>Loading data...</p>
        </div>

        <!-- SoC Table -->
        <table v-else class="table-auto w-full bg-white shadow rounded-lg">
            <thead>
                <tr class="bg-gray-200 text-left">
                    <th class="px-4 py-2">SoC ID</th>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Manufacturer</th>
                    <th class="px-4 py-2">Release Date</th>
                    <th class="px-4 py-2">Details</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="soc in filteredData" :key="soc.soc_id">
                    <tr class="border-b border-gray-200 hover:bg-gray-100">
                        <td class="px-4 py-2">{{ soc.soc_id }}</td>
                        <td class="px-4 py-2">{{ soc.name }}</td>
                        <td class="px-4 py-2">{{ soc.Manufacturer?.name || 'Unknown' }}</td>
                        <td class="px-4 py-2">{{ formatDate(soc.release_date) }}</td>
                        <td class="px-4 py-2">
                            <button @click="toggleDetails(soc.soc_id)" class="text-blue-500 underline">
                                {{ expandedSoc === soc.soc_id ? 'Hide Details' : 'Show Details' }}
                            </button>
                        </td>
                    </tr>
                    <tr v-if="expandedSoc === soc.soc_id">
                        <td colspan="5" class="bg-gray-50 p-4">
                            <h3 class="font-semibold mb-2">Processors</h3>

                            <div v-if="soc.CPUs && soc.CPUs.length">
                                <h4 class="font-semibold text-lg">CPUs</h4>
                                <table class="table-auto w-full mt-2 mb-4 bg-white">
                                    <thead>
                                        <tr class="bg-gray-200 text-left">
                                            <th class="px-2 py-1">Family</th>
                                            <th class="px-2 py-1">Code Name</th>
                                            <th class="px-2 py-1">Clock (MHz)</th>
                                            <th class="px-2 py-1">Cores</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="cpu in soc.CPUs" :key="cpu.cpu_id">
                                            <td class="px-2 py-1">{{ cpu.family }}</td>
                                            <td class="px-2 py-1">{{ cpu.code_name }}</td>
                                            <td class="px-2 py-1">{{ cpu.clock }}</td>
                                            <td class="px-2 py-1">
                                                <table class="table-auto w-full mt-1">
                                                    <thead>
                                                        <tr class="bg-gray-100">
                                                            <th class="px-1 py-1">Core Name</th>
                                                            <th class="px-1 py-1">Base Clock</th>
                                                            <th class="px-1 py-1">Max Turbo Clock</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="core in cpu.cores || []" :key="core.core_id">
                                                            <td class="px-1 py-1">{{ core.core_name }}</td>
                                                            <td class="px-1 py-1">{{ core.base_clock }}</td>
                                                            <td class="px-1 py-1">{{ core.max_turbo_clock }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div v-if="soc.GPUs && soc.GPUs.length">
                                <h4 class="font-semibold text-lg">GPUs</h4>
                                <!-- Similar GPU Table Layout here -->
                            </div>

                            <div v-if="soc.FPGAs && soc.FPGAs.length">
                                <h4 class="font-semibold text-lg">FPGAs</h4>
                                <!-- Similar FPGA Table Layout here -->
                            </div>

                            <div v-if="soc.AIProcessors && soc.AIProcessors.length">
                                <h4 class="font-semibold text-lg">AI Processors</h4>
                                <!-- Similar AI Processor Table Layout here -->
                            </div>
                        </td>
                    </tr>
                </template>

                <!-- Details Row -->
            </tbody>
        </table>
    </div>
</template>

<script setup>
const search = ref('');
const filterType = ref('');
const expandedSoc = ref(null);
const isLoading = ref(true);

// Use Nuxt 3's `useFetch` to load the data and handle loading state
const { data: socData } = await useFetch('http://localhost:3001/api/socs', {
    onResponse({ response }) {
        isLoading.value = false; // Set loading to false once data is fetched
        return response._data;
    },
    onRequest({ options }) {
        options.headers = { 'Content-Type': 'application/json' }; // Set headers if needed
    }
});

// Show loading state or set empty array if `socData` is null
const data = ref(socData.value || []);

const toggleDetails = (id) => {
    expandedSoc.value = expandedSoc.value === id ? null : id;
};

// Filter data to search and filter by type
const filteredData = computed(() => {
    console.log(data.value)
    return data.value
      .filter(soc => soc && soc.name?.toLowerCase().includes(search.value.toLowerCase()))
      .filter(soc => {
        if (filterType.value === 'CPU') return soc.CPUs && soc.CPUs.length > 0;
        if (filterType.value === 'GPU') return soc.GPUs && soc.GPUs.length > 0;
        if (filterType.value === 'FPGA') return soc.FPGAs && soc.FPGAs.length > 0;
        if (filterType.value === 'AIProcessor') return soc.AIProcessors && soc.AIProcessors.length > 0;
        return true;
      });
});

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
};
</script>

<style scoped>
.container {
    max-width: 1200px;
}
</style>