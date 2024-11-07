<template>
  <div class="text-gray-800">
    <Navbar/>

    <div class="max-w-[1400px] px-4 mx-auto">
      <div class="mt-16">
        <h1 class="text-4xl font-bold">All processors</h1>
      </div>
      <div class="my-16">
        <InteractiveGraph :data="filterData" />
      </div>
      <div class="mb-16">
        <DataTable :data="SoCs" @filteredData="setFilteredData" />
      </div>
    </div>
   <Footer />
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
const filterData = ref(data.value.data)
function setFilteredData(data) {
  filterData.value = data
  console.log('asdkasjdjaskldj')
}
</script>