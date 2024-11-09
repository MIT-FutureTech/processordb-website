<template>
  <div class="text-gray-800">
    <Navbar />

    <div class="max-w-[1400px] px-4 mx-auto">
      <div class="mt-16">
        <h1 class="text-4xl font-bold">{{pageTitle}}</h1>
      </div>
      <div class="my-16">
        <InteractiveGraph :data="filterData" />
      </div>
      <div class="mb-16">
        <DataTable :data="filterData">
          <template #filters>
            <div class="flex items-center gap-2">

            </div>
          </template>
        </DataTable>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>

const { data } = await useFetch('http://localhost:3001/api/socs', {
  key: 'socs',
  cache: true
})
// Define your filter values as ref variables
const manufacturerNameFilter = ref('')
const processorTypeFilter = ref('')
const familyFilter = ref('')
const codeNameFilter = ref('')
const microarchitectureFilter = ref('')
const modelFilter = ref('')
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

const filterData = computed(() => {
  return data.value.data.filter(item => {
    const matchesManufacturer =
      !manufacturerNameFilter.value ||
      slugify(item.manufacturer_name) === manufacturerNameFilter.value

    const matchesProcessorType =
      !processorTypeFilter.value ||
      item.processors?.some(proc =>
        proc.processor_type &&
        slugify(proc.processor_type) === processorTypeFilter.value
      )

    const matchesFamily =
      !familyFilter.value ||
      item.processors?.some(proc =>
        proc.family &&
        slugify(proc.family) === familyFilter.value
      )

    const matchesCodeName =
      !codeNameFilter.value ||
      item.processors?.some(proc =>
        proc.code_name &&
        slugify(proc.code_name) === codeNameFilter.value
      )

    const matchesMicroarchitecture =
      !microarchitectureFilter.value ||
      item.processors?.some(proc =>
        proc.microarchitecture &&
        slugify(proc.microarchitecture) === microarchitectureFilter.value
      )

    return (
      matchesManufacturer &&
      matchesProcessorType &&
      matchesFamily &&
      matchesCodeName &&
      matchesMicroarchitecture
    )
  })
})

const route = useRoute()
const router = useRouter()
const setFiltersFromRoute = () => {
  if (!route.params.slug || route.params.slug.length % 2 !== 0) {
    router.push('/database')
    return
  }

  // Reset all filters
  manufacturerNameFilter.value = ''
  processorTypeFilter.value = ''
  familyFilter.value = ''
  codeNameFilter.value = ''
  microarchitectureFilter.value = ''

  // Iterate over route params in pairs
  for (let i = 0; i < route.params.slug.length; i += 2) {
    const filter = route.params.slug[i]
    const value = route.params.slug[i + 1]
    console.log(filter, value)
    // Set filters based on key
    switch (filter) {
      case 'manufacturer':
        manufacturerNameFilter.value = value
        break
      case 'processorType':
        processorTypeFilter.value = value
        break
      case 'family':
        familyFilter.value = value
        break
      case 'code-name':
        codeNameFilter.value = value
        break
      case 'microarchitecture':
        microarchitectureFilter.value = value
        break
      default:
        // Redirect if an unknown filter is found
        router.push('/database')
        return
    }
  }
}


watch(
  () => route.fullPath,
  () => {
    setFiltersFromRoute()
  },
  { immediate: true }
)

const pageTitle = computed(() => {
  const firstMatch = filterData.value[0]
  if (!firstMatch) return 'All Processors'

  const manufacturer = manufacturerNameFilter.value ? firstMatch.manufacturer_name : ''
  const processorType = processorTypeFilter.value ? firstMatch.processors.find(proc => slugify(proc.processor_type) === processorTypeFilter.value)?.processor_type : ''
  const family = familyFilter.value ? firstMatch.processors.find(proc => slugify(proc.family) === familyFilter.value)?.family : ''
  const codeName = codeNameFilter.value ? firstMatch.processors.find(proc => slugify(proc.code_name) === codeNameFilter.value)?.code_name : ''
  const microarchitecture = microarchitectureFilter.value ? firstMatch.processors.find(proc => slugify(proc.microarchitecture) === microarchitectureFilter.value)?.microarchitecture : ''

  // Build title based on available data
  if (manufacturer && processorType) {
    return `${manufacturer} ${processorType}s`
  } else if (manufacturer && family) {
    return `${manufacturer} ${family} Family Processors`
  } else if (manufacturer && codeName) {
    return `${manufacturer} ${codeName} Processors`
  } else if (manufacturer && microarchitecture) {
    return `${manufacturer} ${microarchitecture} Microarchitecture`
  } else if (manufacturer) {
    return `${manufacturer} Processors`
  } else if (processorType) {
    return `All ${processorType}s`
  }
  return 'All Processors'
})

// Update document title based on computed pageTitle
watch(pageTitle, (newTitle) => {
  document.title = newTitle
})

</script>
