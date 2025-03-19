<template>
  <div>
    <!-- Top Controls -->
    <div class="flex justify-between gap-4 items-center mb-4">
      <div class="flex justify-start gap-4 items-center">
        <!-- Optional slot for extra filters -->
        <slot name="filters"></slot>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div class="mr-4">
          Showing {{ startRecord }}-{{ endRecord }} of {{ pagination.totalRecords }} records
        </div>
        <input type="text" v-model="searchQuery" placeholder="Search"
          class="mr-2 outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs" />

        <!-- Pagination Controls -->
        <div class="flex items-center">
          <button @click="prevPage" :disabled="pagination.currentPage === 1"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-xs has-tooltip">
            <span class="tooltip rounded shadow-lg p-2 bg-white text-[#A32035] -mt-12 -ml-12">
              Previous page
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <input type="number" v-model.number="pagination.currentPage" :min="1" :max="pagination.totalPages"
            class="max-w-12 text-center outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs hide-arrow" />
          <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs has-tooltip">
            <span class="tooltip rounded shadow-lg p-2 bg-white text-[#A32035] -mt-12 -ml-6">
              Next page
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <!-- Show/Hide Columns Dropdown -->
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="outline-none bg-white hover:bg-gray-100 border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs">
              Show/Hide Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent class="max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-for="column in allColumns" :key="column.value" asChild>
                <label class="flex items-center gap-2 cursor-pointer px-2 py-1" :class="{
                  'border border-[#A32035] text-[#A32035] px-2 py-1 rounded': selectedColumns.includes(column.value)
                }">
                  <input type="checkbox" class="hidden" v-model="selectedColumns" :value="column.value" />
                  <span>{{ column.label }}</span>
                </label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <!-- Single Export Data Button (ZIP with CSV, XLSX & PDF) -->
      <div class="flex gap-2">
        <button @click="exportAllAsZip"
          class="outline-none bg-white hover:bg-gray-100 border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs">
          Export Data
          <svg class="mr-2 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Table Container with Horizontal Scroll -->
    <div :class="{ 'overflow-x-auto': displayedColumns.length > defaultColumnsOrder.length }">
      <Table class="table-auto w-full">
        <TableCaption v-if="displayedData.length === 0">No records found.</TableCaption>
        <TableHeader>
          <TableRow>
            <!-- Loop through the selectable columns -->
            <TableHead v-for="column in displayedColumns" :key="column.value"
              class="cursor-pointer text-[#A32035] opacity-80" @click="sortBy(column.value)">
              <div class="flex items-center gap-2">
                {{ column.label }}
                <span v-if="sortField === column.value">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </TableHead>
            <!-- Fixed Details Column -->
            <TableHead key="details" class="cursor-default text-[#A32035] opacity-80">
              <div class="flex items-center gap-2">Details</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in displayedData" :key="uniqueId(row)" class="hover:bg-[#F1F5F9] even:bg-gray-50">
            <!-- Loop through the selectable columns -->
            <TableCell v-for="column in displayedColumns" :key="column.value">
              <span class="text-black">
                <template v-if="column.value === 'release_date'">
                  {{ formatYear(row[column.value]) }}
                </template>
                <template v-else>
                  {{ row[column.value] }}
                </template>
              </span>
            </TableCell>
            <!-- Fixed Details Column Cell -->
            <TableCell key="details">
              <NuxtLink class="text-[#A32035] hover:underline" :to="`/${props.className}/${uniqueId(row)}`">
                Details
              </NuxtLink>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch } from 'vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import JSZip from 'jszip'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NuxtLink } from '#components'

// --- Props ---
const props = defineProps({
  data: { type: Array, required: true },
  className: { type: String, required: true },
})

// --- Helper: Format Year ---
const formatYear = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric' })
}

// --- Helper: Unique ID ---
const uniqueId = (row) => {
  return props.className === 'cpu' ? row.cpu_id : row.gpu_id
}

// --- Helper: Format Column Label ---
function formatColumnLabel(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// --- Flatten Data ---
const flattenedData = computed(() => {
  if (props.className === 'cpu') {
    return props.data.map((item) => ({
      ...item,
      manufacturer: item.SoC?.Manufacturer?.name || '',
      release_date: item.SoC?.release_date || '',
      processor_type: 'CPU'
    }))
  } else if (props.className === 'gpu') {
    return props.data.map((item) => ({
      ...item,
      manufacturer: item.SoC?.Manufacturer?.name || '',
      release_date: item.SoC?.release_date || '',
      processor_type: 'GPU',
      model: item.model || item.name || '',
      family: item.architecture || '',
      microarchitecture: item.generation || '',
      clock: item.base_clock || item.boost_clock || null,
      tdp: item.tdp || null,
    }))
  }
  return props.data
})

// --- Default Columns (Visible by Default) ---
const defaultColumnsOrder = [
  { label: 'Manufacturer', value: 'manufacturer' },
  { label: 'Processor Type', value: 'processor_type' },
  { label: 'Processor Family', value: 'family' },
  { label: 'Microarchitecture', value: 'microarchitecture' },
  { label: 'Model', value: 'model' },
  { label: 'Release Date', value: 'release_date' },
  { label: 'Clock (MHz)', value: 'clock' },
  { label: 'TDP (W)', value: 'tdp' },
]
const defaultColumnsOrderKeys = defaultColumnsOrder.map(col => col.value)

// --- Default Hidden Keys ---
const defaultHiddenKeys = {
  cpu: ['cpu_id', 'createdAt', 'updatedAt', 'soc_id', 'SoC', 'notes'],
  gpu: ['gpu_id', 'createdAt', 'updatedAt', 'soc_id', 'SoC', 'cores', 'notes', 'l0_cache', 'l1_cache', 'l2_cache', 'l3_cache', 'fp16', 'fp32', 'fp64', 'pixel_shader', 'vertex_shader', 'shader_units', 'texture_mapping_units', 'render_output_units', 'compute_units', 'ray_tracing_units', 'system_shared_memory'],
}

// --- Additional Columns ---
const additionalColumns = computed(() => {
  const dataArr = flattenedData.value
  if (!dataArr.length) return []
  const firstItem = dataArr[0]
  const keys = Object.keys(firstItem)
  const hidden = defaultHiddenKeys[props.className] || []
  const filteredKeys = keys.filter((key) => {
    if (defaultColumnsOrderKeys.includes(key)) return false
    if (hidden.includes(key)) return false
    const value = firstItem[key]
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) return false
    return true
  })
  return filteredKeys.map(key => ({
    label: formatColumnLabel(key),
    value: key,
  }))
})

// === File Generation Functions ===

// Generate CSV Blob
const generateCSV = () => {
  if (!flattenedData.value?.length) {
    console.error('No data to export');
    return null;
  }
  const originalColumns = Object.keys(flattenedData.value[0]);
  const filteredColumns = originalColumns.filter(key =>
    !['SoC', 'processor_type', 'createdAt', 'updatedAt'].includes(key)
  );
  const csvRows = [];
  csvRows.push(
    filteredColumns
      .map(column => `"${column.toUpperCase().replace(/"/g, '""')}"`)
      .join(',')
  );
  for (const item of flattenedData.value) {
    const row = filteredColumns.map(key => {
      const value = item[key] ?? '';
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(row.join(','));
  }
  const csvString = csvRows.join('\n');
  return new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
};

// Generate XLSX Blob
const generateXLSX = () => {
  const dataArr = flattenedData.value;
  if (!dataArr?.length) {
    console.error('No data to export');
    return null;
  }
  const filteredColumns = Object.keys(dataArr[0]).filter(
    key => !['SoC', 'processor_type', 'createdAt', 'updatedAt'].includes(key)
  );
  const minimalData = dataArr.map(item => {
    const newItem = {};
    filteredColumns.forEach(col => {
      newItem[col] = item[col] ?? '';
    });
    return newItem;
  });
  const worksheet = XLSX.utils.json_to_sheet(minimalData, { header: filteredColumns });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  workbook.Props = {
    Title: `${props.className} Data - ProcessorDB - MIT FutureTech`,
    Subject: `${props.className.toUpperCase()} Hardware Specifications`,
    Author: 'Neil Thompson, Jonathan Koomey, Sylvia Downing, Kenneth Flamm, Emanuele Del Sozzo, Zachary Schmidt, Rebecca Wenjing Lyu, João Lucas Zarbielli',
    CreatedDate: new Date()
  };
  workbook.Custprops = {
    License: 'CC-BY-4.0',
    Source: `https://processordb.mit.edu/${props.className}/list`
  };
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  return new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
};

// Generate PDF Blob (async because of image loading)
const generatePDFReadme = async () => {
  const doc = new jsPDF();

  // --- Header Text ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("README", 70, 20);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  const year = new Date().getFullYear();
  const readmeText = [
    "Authors: Neil Thompson, Jonathan Koomey, Sylvia Downing,",
    "         Kenneth Flamm, Emanuele Del Sozzo, Zachary Schmidt,",
    "         Rebecca Wenjing Lyu, João Lucas Zarbielli",
    "License: CC-BY-4.0",
    "How to cite: Please mention the research as follows:",
    `          'Data provided by ProcessorDB - MIT FutureTech, ${year}, under CC-BY-4.0 license.'`,
    "",
    "For more information, please visit:",
    "https://processordb.mit.edu"
  ];
  let yPos = 40;
  readmeText.forEach((line) => {
    doc.text(line, 10, yPos);
    yPos += 7;
  });

  // --- Helper: Load image and convert to Base64 ---
  const getBase64FromUrl = url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  };

  // --- Load and Add the Two Logos Below the Text ---
  try {
    const futuretechLogo = await getBase64FromUrl('/futuretech.png');
    const koomeyLogo = await getBase64FromUrl('/koomeyanalyticslogo.png');
    const processordbLogo = await getBase64FromUrl('/cpu.png');

    const logoY = yPos + 10;

    doc.addImage(futuretechLogo, 'PNG', 10, logoY, 50, 20);
    doc.addImage(koomeyLogo, 'PNG', 70, logoY, 50, 20);
    doc.addImage(processordbLogo, 'PNG', 130, logoY, 30, 20);

  } catch (error) {
    console.error("Error loading additional logos:", error);
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  const newYPos = yPos + 35;
  doc.text("Processor DB", 132, newYPos);

  // Return the PDF as a Blob
  return doc.output('blob');
};

// --- Export All as ZIP ---
const exportAllAsZip = async () => {
  const zip = new JSZip();

  const csvBlob = generateCSV();
  const xlsxBlob = generateXLSX();
  const pdfBlob = await generatePDFReadme();

  if (csvBlob) {
    zip.file(`${props.className.toUpperCase()} Data - ProcessorDB - MIT FutureTech.csv`, csvBlob);
  }
  if (xlsxBlob) {
    zip.file(`${props.className.toUpperCase()} Data - ProcessorDB - MIT FutureTech.xlsx`, xlsxBlob);
  }
  if (pdfBlob) {
    zip.file("README.pdf", pdfBlob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, `${props.className || 'export'}-data.zip`);
};

// --- Combine Columns ---
const allColumns = computed(() => {
  return [...defaultColumnsOrder, ...additionalColumns.value]
})

// --- Manage Selected Columns ---
const selectedColumns = ref(defaultColumnsOrder.map(col => col.value))
watch(allColumns, () => {
  // Keep default selection when columns update
})

// --- Columns to Display ---
const displayedColumns = computed(() =>
  allColumns.value.filter(col => selectedColumns.value.includes(col.value))
)

// --- Search, Sorting, and Pagination ---
const searchQuery = ref('')
const sortField = ref('')
const sortOrder = ref('asc')
const filteredData = computed(() => {
  if (!searchQuery.value) return flattenedData.value
  return flattenedData.value.filter(item =>
    displayedColumns.value.some(col => {
      const cellValue = item[col.value]
      if (cellValue === null || cellValue === undefined) return false
      return cellValue.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
    })
  )
})
const sortedData = computed(() => {
  let dataToSort = [...filteredData.value]
  if (!sortField.value) {
    return dataToSort.sort((a, b) => {
      const aYear = a.release_date ? new Date(a.release_date).getFullYear() : -Infinity
      const bYear = b.release_date ? new Date(b.release_date).getFullYear() : -Infinity
      return bYear - aYear
    })
  }
  return dataToSort.sort((a, b) => {
    const aVal = a[sortField.value] || ''
    const bVal = b[sortField.value] || ''
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})
const pagination = ref({
  currentPage: 1,
  pageSize: 50,
  totalRecords: 0,
  totalPages: 0,
})
const displayedData = computed(() => {
  pagination.value.totalRecords = sortedData.value.length
  pagination.value.totalPages = Math.ceil(sortedData.value.length / pagination.value.pageSize)
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return sortedData.value.slice(start, end)
})
const startRecord = computed(() => (pagination.value.currentPage - 1) * pagination.value.pageSize + 1)
const endRecord = computed(() =>
  Math.min(pagination.value.currentPage * pagination.value.pageSize, pagination.value.totalRecords)
)
const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    pagination.value.currentPage++
  }
}
const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
  }
}
const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}
</script>

<style scoped>
.table-auto th {
  background-color: #f9fafb;
}
.table-auto th:hover {
  background-color: #f1f5f9;
}
.hide-arrow[type="number"]::-webkit-inner-spin-button,
.hide-arrow[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.tooltip {
  visibility: hidden;
  position: absolute;
}
.has-tooltip:hover .tooltip {
  visibility: visible;
  z-index: 50;
}
</style>
