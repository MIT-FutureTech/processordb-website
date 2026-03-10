<template>
  <div>
    <!-- Top Controls -->
    <div class="flex justify-between gap-4 items-center mb-4">
      <div class="flex justify-start gap-4 items-center">
        <!-- Optional slot for extra filters -->
        <slot name="filters" />
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div class="mr-4">
          Showing {{ startRecord }}-{{ endRecord }} of {{ totalCount }} records
        </div>
        <select 
          :value="pageSize" 
          @change="handlePageSizeChange"
          class="mr-2 outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs"
        >
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
          <option value="200">200 per page</option>
        </select>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search"
          class="mr-2 outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs"
        >

        <!-- Pagination Controls -->
        <div class="flex items-center">
          <button
            @click="prevPage"
            :disabled="!hasPreviousPage || currentPage === 1"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-xs has-tooltip disabled:opacity-50 disabled:cursor-not-allowed"
            @mouseenter="logPaginationState('prev')"
          >
            <span class="tooltip rounded shadow-lg p-2 bg-white text-[#A32035] -mt-12 -ml-12">
              Previous page
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <input
            type="number"
            :value="currentPage"
            @input="handlePageChange"
            :min="1"
            :max="totalPages"
            class="max-w-12 text-center outline-none bg-white border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs hide-arrow"
          >
          <button
            @click="nextPage"
            :disabled="!hasNextPage || currentPage === totalPages"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700 text-xs has-tooltip disabled:opacity-50 disabled:cursor-not-allowed"
            @mouseenter="logPaginationState('next')"
          >
            <span class="tooltip rounded shadow-lg p-2 bg-white text-[#A32035] -mt-12 -ml-6">
              Next page
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        <!-- Show/Hide Columns Dropdown -->
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="outline-none bg-white hover:bg-gray-100 border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs"
            >
              Show/Hide Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent class="max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                v-for="column in allColumns"
                :key="column.value"
                as-child
              >
                <label
                  class="flex items-center gap-2 cursor-pointer px-2 py-1"
                  :class="{
                    'border border-[#A32035] text-[#A32035] px-2 py-1 rounded': selectedColumns.includes(column.value)
                  }"
                >
                  <input
                    type="checkbox"
                    class="hidden"
                    v-model="selectedColumns"
                    :value="column.value"
                  >
                  <span>{{ column.label }}</span>
                </label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <!-- Single Export Data Button (ZIP with CSV, XLSX & PDF) -->
      <div class="flex gap-2">
        <button
          @click="exportAllAsZip"
          class="outline-none bg-white hover:bg-gray-100 border-[#A3203555] border flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-xs"
        >
          Export Data
          <svg
            class="mr-2 h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Table Container with Horizontal Scroll -->
    <div :class="{ 'overflow-x-auto': displayedColumns.length > defaultColumnsOrder.length }">
      <Table class="table-auto w-full">
        <TableCaption v-if="displayedData.length === 0">
          No records found.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <!-- Loop through the selectable columns -->
            <TableHead
              v-for="column in displayedColumns"
              :key="column.value"
              class="cursor-pointer text-[#A32035] opacity-80"
              @click="sortBy(column.value)"
            >
              <div class="flex items-center gap-2">
                {{ column.label }}
                <span v-if="sortField === column.value">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </TableHead>
            <!-- Fixed Details Column -->
            <TableHead
              key="details"
              class="cursor-default text-[#A32035] opacity-80"
            >
              <div class="flex items-center gap-2">
                Details
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- Empty State -->
          <TableRow v-if="displayedData.length === 0">
            <TableCell :colspan="displayedColumns.length + 1" class="text-center py-12">
              <div class="flex flex-col items-center justify-center">
                <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="text-gray-600 font-medium mb-1">No data available</p>
                <p class="text-gray-500 text-sm">
                  <template v-if="searchQuery">
                    No results found for "{{ searchQuery }}"
                  </template>
                  <template v-else>
                    No records match the current filters
                  </template>
                </p>
              </div>
            </TableCell>
          </TableRow>
          
          <!-- Data Rows -->
          <TableRow
            v-for="(row, index) in displayedData"
            :key="row._rowId || uniqueId(row) || index"
            class="hover:bg-[#F1F5F9] even:bg-gray-50"
          >
            <!-- Loop through the selectable columns -->
            <TableCell
              v-for="column in displayedColumns"
              :key="column.value"
            >
              <span class="text-black">
                <template v-if="column.value === 'release_year'">
                  {{ getFieldValue(row, column.value) || '-' }}
                </template>
                <template v-else>
                  {{ getFieldValue(row, column.value) }}
                </template>
              </span>
            </TableCell>
            <!-- Fixed Details Column Cell -->
            <TableCell key="details">
              <NuxtLink
                v-if="uniqueId(row)"
                class="text-[#A32035] hover:underline"
                :to="getDetailPath(row)"
              >
                Details
              </NuxtLink>
              <span v-else class="text-gray-400">N/A</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table-index'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu/dropdown-menu-index'
import { NuxtLink } from '#components'

// --- Props ---
const props = defineProps({
  data: { type: Array, required: true },
  className: { type: String, required: true },
  // API pagination props
  totalCount: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 50 },
  hasPreviousPage: { type: Boolean, default: false },
  hasNextPage: { type: Boolean, default: false },
  totalPages: { type: Number, default: 0 },
})

// --- Emits ---
const emit = defineEmits(['update:currentPage', 'update:pageSize'])

// --- Helper: Format Year ---
const formatYear = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric' })
}

const uniqueId = (row) => {
  const socClass = props.className.toLowerCase();
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrivateTable.vue:uniqueId',message:'uniqueId called',data:{className:props.className,socClass:socClass,hasPackageId:!!row.package_id,packageId:row.package_id},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  
  switch (socClass) {
    case 'soc':
    case 'socs':
      // For SOC, use soc_id for linking to detail page
      // Multiple rows may share same soc_id (one per processor), which is fine for detail links
      const socId = row.soc_id || row.id;
      return socId;
    case 'cpu':
      return row.cpu_id || '';
    case 'gpu':
      return row.gpu_id || '';
    case 'fpgas':
      return row.fpga_id || '';
    case 'aiprocessor':
    case 'ai-processor':
    case 'aiprocessors':
    case 'ai-processors':
      return row.ai_processor_id || '';
    case 'package':
    case 'packages':
      // For Package, use package_id for linking to detail page
      // Multiple rows may share same package_id (one per component), which is fine for detail links
      return row.package_id || '';
    default:
      return '';
  }
}

const getDetailPath = (row) => {
  const id = uniqueId(row);
  let basePath = props.className.replace(/s$/i, '');
  
  // Normalize AI processor paths to use hyphenated format
  if (basePath === 'aiProcessor' || basePath === 'aiProcessors') {
    basePath = 'ai-processor';
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrivateTable.vue:getDetailPath',message:'getDetailPath called',data:{className:props.className,basePath:basePath,id:id,fullPath:`/${basePath}/${id}`},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  
  const fullPath = `/${basePath}/${id}`;
  return fullPath;
}

const logNavigation = (row) => {
  const path = getDetailPath(row);
}

// --- Helper: Format Column Label ---
function formatColumnLabel(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper: Safely extract year from release_date value
function safeGetYearFromDate(value) {
  if (value === null || value === undefined) return null;
  
  // If it's already a number, check if it looks like a year (1900-2100)
  if (typeof value === 'number') {
    const numValue = Math.floor(value);
    // If it's a reasonable year, return it directly
    if (numValue >= 1900 && numValue <= 2100) {
      return numValue;
    }
    // Otherwise, try to create a date from it
    const date = new Date(numValue);
    return isNaN(date.getTime()) ? null : date.getFullYear();
  }
  
  // If it's a string, try to parse it
  if (typeof value === 'string') {
    // Check if it's just a 4-digit year
    if (/^\d{4}$/.test(value.trim())) {
      return parseInt(value.trim(), 10);
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.getFullYear();
  }
  
  // If it's a Date object, get year
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value.getFullYear();
  }
  
  return null;
}

// --- Helper: Get field value with resilience to missing/renamed fields ---
function getFieldValue(row, fieldName) {
  if (!row || !fieldName) return '';
  
  // Direct field access
  if (row.hasOwnProperty(fieldName)) {
    const value = row[fieldName];
    // Handle null/undefined gracefully
    if (value === null || value === undefined) return '';
    return value;
  }
  
  // Special handling for release_year: check both flattened and nested structures
  if (fieldName === 'release_year') {
    
    // First check if release_year is already extracted (flattened data or from API)
    if (row.release_year !== null && row.release_year !== undefined) {
      return row.release_year;
    }
    // Check nested SoC.release_year (from API)
    if (row.SoC?.release_year !== null && row.SoC?.release_year !== undefined) {
      return row.SoC.release_year;
    }
    // Fallback: extract from release_date if release_year not available
    // For nested structure (FPGA/CPU/GPU): check SoC.release_date
    if (row.SoC?.release_date) {
      return safeGetYearFromDate(row.SoC.release_date);
    }
    // For flat structure (SOC): check row.release_date directly
    if (row.release_date) {
      return safeGetYearFromDate(row.release_date);
    }
    return null;
  }
  
  // Try nested SoC access for common SoC fields
  const socFields = ['die_sizes', 'number_of_die', 'package_size', 
                     'platform', 'total_transistor_count', 'transistor_density',
                     'voltage_range_high', 'voltage_range_low', 'process_node'];
  if (socFields.includes(fieldName) && row.SoC) {
    const value = row.SoC[fieldName];
    if (value !== null && value !== undefined) return value;
  }
  
  // Try manufacturer name from nested structure
  if (fieldName === 'manufacturer' || fieldName === 'manufacturer_name') {
    if (row.manufacturer_name) return row.manufacturer_name;
    if (row.manufacturer) return typeof row.manufacturer === 'string' ? row.manufacturer : row.manufacturer.name;
    if (row.SoC?.Manufacturer?.name) return row.SoC.Manufacturer.name;
  }
  
  // Field not found - return empty string instead of undefined
  return '';
}

// --- Flatten Data with Memoization ---
const flattenedData = computed(() => {
  // Use a more efficient approach with less object spreading
  if (props.className === 'cpu') {
    return props.data.map((item) => {
      const flattened = { ...item };
      flattened.manufacturer = item.SoC?.Manufacturer?.name || '';
      // Prefer release_year from API, fallback to extracting from release_date
      flattened.release_year = item.release_year || item.SoC?.release_year || (item.SoC?.release_date ? safeGetYearFromDate(item.SoC.release_date) : null);
      flattened.processor_type = 'CPU';
      return flattened;
    });
  } else if (props.className === 'gpu') {
    return props.data.map((item) => {
      const flattened = { ...item };
      flattened.manufacturer = item.SoC?.Manufacturer?.name || '';
      // Prefer release_year from API, fallback to extracting from release_date
      flattened.release_year = item.release_year || item.SoC?.release_year || (item.SoC?.release_date ? safeGetYearFromDate(item.SoC.release_date) : null);
      flattened.processor_type = 'GPU';
      flattened.model = item.model || item.name || '';
      flattened.family = item.architecture || '';
      flattened.microarchitecture = item.generation || '';
      flattened.clock = item.base_clock || item.boost_clock || null;
      flattened.tdp = item.tdp || null;
      return flattened;
    });
  } else if (props.className === 'aiProcessor' || props.className === 'ai-processor' || props.className === 'aiProcessors' || props.className === 'ai-processors') {
    return props.data.map((item) => {
      const flattened = { ...item };
      // Ensure ai_processor_id is preserved (it should be in the spread, but explicitly ensure it)
      flattened.ai_processor_id = item.ai_processor_id || item.id || null;
      flattened.manufacturer = item.SoC?.Manufacturer?.name || '';
      // Prefer release_year from API, fallback to extracting from release_date
      flattened.release_year = item.release_year || item.SoC?.release_year || (item.SoC?.release_date ? safeGetYearFromDate(item.SoC.release_date) : null);
      flattened.processor_type = 'AI Processor';
      flattened.model = item.model_name || item.model || item.product_name || '';
      flattened.family = item.company || '';
      flattened.clock = item.clock_rate_ghz || null;
      flattened.tdp = item.tdp_w || item.tdp || null;
      // Include all AI Processor specific fields
      flattened.company = item.company || null;
      flattened.product_name = item.product_name || null;
      flattened.country = item.country || null;
      flattened.precision = item.precision || null;
      flattened.performance_tops = item.performance_tops || null;
      flattened.die_size_mm2 = item.die_size_mm2 || null;
      flattened.process_node_nm = item.process_node_nm || null;
      flattened.sram_mb = item.sram_mb || null;
      flattened.sram_bandwidth_tbs = item.sram_bandwidth_tbs || null;
      flattened.dram_gb = item.dram_gb || null;
      flattened.dram_bandwidth_gbs = item.dram_bandwidth_gbs || null;
      flattened.peak_bw_gbs = item.peak_bw_gbs || null;
      flattened.format = item.format || null;
      flattened.cloud_edge = item.cloud_edge || null;
      flattened.workload_type = item.workload_type || null;
      flattened.networking = item.networking || null;
      flattened.units = item.units || null;
      
      
      return flattened;
    });
  } else if (props.className === 'package' || props.className === 'packages') {
    // Handle Package data - already flattened from API
    if (!Array.isArray(props.data)) {
      console.error('PrivateTable: props.data is not an array:', props.data);
      return [];
    }
    return props.data.map((item, index) => ({
      ...item,
      _rowId: `package_${item.package_id}_${item.component_type}_${item.component_id}_${index}`,
      // component_name, manufacturer, and component_type_display should come from API
      formatted_component_id: item.formatted_component_id || `${item.component_type}-${item.component_id}`
    }));
  } else if (props.className === 'soc' || props.className === 'socs') {
    // Handle SOC data with nested processors array
    // Add safety check for data type
    if (!Array.isArray(props.data)) {
      console.error('PrivateTable: props.data is not an array:', props.data);
      return [];
    }
    
    const flattenedRows = [];
    
    props.data.forEach((soc, socIndex) => {
      
      // Extract SOC-level fields
      const socBase = {
        soc_id: soc.soc_id,
        soc_name: soc.soc_name || soc.name,
        manufacturer: soc.manufacturer_name || soc.manufacturer || '',
        release_date: soc.release_date || null, // Include release_date for getFieldValue to extract year
        // Prefer release_year from API, fallback to extracting from release_date
        release_year: soc.release_year || (soc.release_date ? safeGetYearFromDate(soc.release_date) : null),
        process_node: soc.process_node || null,
        total_transistor_count: soc.total_transistor_count || null,
        die_sizes: soc.die_sizes || null,
        release_price: soc.release_price || null,
        benchmarks: soc.benchmarks || [],
        economics: soc.economics || []
      };
      
      // Check if SOC has processors
      const processors = soc.processors || [];
      
      if (processors.length > 0) {
        // Create one row per processor
        processors.forEach((processor, procIndex) => {
          // Create unique row ID combining soc_id and processor identifier
          const processorId = processor.cpu_id || processor.gpu_id || processor.fpga_id || processor.ai_processor_id || procIndex;
          flattenedRows.push({
            ...socBase,
            // Add unique row identifier for Vue key
            _rowId: `${soc.soc_id}_${processorId}_${procIndex}`,
            processor_type: processor.processor_type || 'Unknown',
            family: processor.family || null,
            code_name: processor.code_name || null,
            microarchitecture: processor.microarchitecture || null,
            model: processor.model || processor.model_name || null,
            clock: processor.clock || processor.clock_rate_ghz || null,
            max_clock: processor.max_clock || null,
            tdp: processor.tdp || processor.tdp_w || null,
            lithography: processor.lithography || null,
            fp64_ops: processor.fp64_ops || null,
            fp32_ops: processor.fp32_ops || null,
            fp16_ops: processor.fp16_ops || null,
            // AI Processor specific fields
            model_name: processor.model_name || null,
            company: processor.company || null,
            product_name: processor.product_name || null,
            country: processor.country || null,
            performance_tops: processor.performance_tops || null,
            precision: processor.precision || null,
            die_size_mm2: processor.die_size_mm2 || null,
            process_node_nm: processor.process_node_nm || null,
            sram_mb: processor.sram_mb || null,
            dram_gb: processor.dram_gb || null,
            format: processor.format || null,
            cloud_edge: processor.cloud_edge || null,
            workload_type: processor.workload_type || null,
            // Include processor IDs for reference
            cpu_id: processor.cpu_id || null,
            gpu_id: processor.gpu_id || null,
            fpga_id: processor.fpga_id || null,
            ai_processor_id: processor.ai_processor_id || null
          });
        });
      } else {
        // SOC has no processors - create a single row with SOC data only
        flattenedRows.push({
          ...socBase,
          // Add unique row identifier for Vue key
          _rowId: `${soc.soc_id}_no_proc_${socIndex}`,
          processor_type: null,
          family: null,
          code_name: null,
          microarchitecture: null,
          model: null,
          clock: null,
          max_clock: null,
          tdp: null,
          lithography: null,
          fp64_ops: null,
          fp32_ops: null,
          fp16_ops: null,
          // AI Processor fields
          model_name: null,
          company: null,
          product_name: null,
          country: null,
          performance_tops: null,
          precision: null,
          die_size_mm2: null,
          process_node_nm: null,
          sram_mb: null,
          dram_gb: null,
          format: null,
          cloud_edge: null,
          workload_type: null,
          // Processor IDs
          cpu_id: null,
          gpu_id: null,
          fpga_id: null,
          ai_processor_id: null
        });
      }
    });
    
    return flattenedRows;
  } else {
    // Add safety check for data type
    if (!Array.isArray(props.data)) {
      console.error('PrivateTable: props.data is not an array:', props.data);
      return [];
    }
    return props.data.map((item, index) => {
      
      const flattened = { ...item };
      // Prefer release_year from API, fallback to extracting from release_date
      flattened.release_year = item.release_year || item.SoC?.release_year || (item.SoC?.release_date ? safeGetYearFromDate(item.SoC.release_date) : null);
      // Prefer process_node from FPGA, fallback to SoC
      flattened.process_node = item.process_node || item.SoC?.process_node || null;
      // Ensure new fields are available (vendor, product_name, etc. should already be in item from API)
      flattened.vendor = item.vendor || null;
      flattened.product_name = item.product_name || null;
      flattened.internal_operating_voltage = item.internal_operating_voltage || null;
      flattened.logic_resource_type = item.logic_resource_type || null;
      flattened.equivalent_lut_count = item.equivalent_lut_count || null;
      flattened.die_sizes = item.SoC?.die_sizes || '';
      flattened.number_of_die = item.SoC?.number_of_die || '';
      flattened.package_size = item.SoC?.package_size || '';
      flattened.platform = item.SoC?.platform || '';
      flattened.total_transistors_count = item.SoC?.total_transistors_count || '';
      flattened.transistor_density = item.SoC?.transistor_density || '';
      flattened.voltage_range_high = item.SoC?.voltage_range_high || '';
      flattened.voltage_range_low = item.SoC?.voltage_range_low || '';
      return flattened;
    });
  }
})

// --- Default Columns (Visible by Default) ---
const defaultColumnsOrder = props.className === 'package' || props.className === 'packages' ? [
  { label: 'Package ID', value: 'package_id' },
  { label: 'Component Name', value: 'component_name' },
  { label: 'Manufacturer', value: 'manufacturer' },
  { label: 'Component Type', value: 'component_type_display' },
  { label: 'Component Count', value: 'component_count' }
] : props.className === 'fpgas' ? [
  { label: 'Vendor', value: 'vendor' },
  { label: 'Product Name', value: 'product_name' },
  { label: 'Family SubFamily', value: 'family_subfamily' },
  { label: 'Model', value: 'model' },
  { label: 'Release Year', value: 'release_year' },
  { label: 'Process', value: 'process_node' },
  { label: 'Internal Operating Voltage', value: 'internal_operating_voltage' },
  { label: 'Logic Resource Type', value: 'logic_resource_type' },
  { label: 'Equivalent LUT Count', value: 'equivalent_lut_count' }
] : props.className === 'aiProcessor' || props.className === 'ai-processor' || props.className === 'aiProcessors' || props.className === 'ai-processors' ? [
  { label: 'Manufacturer', value: 'manufacturer' },
  { label: 'Company', value: 'company' },
  { label: 'Product Name', value: 'product_name' },
  { label: 'Model Name', value: 'model' },
  { label: 'Release Year', value: 'release_year' },
  { label: 'Performance (TOPS)', value: 'performance_tops' },
  { label: 'Clock Rate (GHz)', value: 'clock' },
  { label: 'TDP (W)', value: 'tdp' },
] : [
  { label: 'Manufacturer', value: 'manufacturer' },
  { label: 'Processor Type', value: 'processor_type' },
  { label: 'Processor Family', value: 'family' },
  { label: 'Microarchitecture', value: 'microarchitecture' },
  { label: 'Model', value: 'model' },
  { label: 'Release Year', value: 'release_year' },
  { label: 'Clock (MHz)', value: 'clock' },
  { label: 'TDP (W)', value: 'tdp' },
]
const defaultColumnsOrderKeys = defaultColumnsOrder.map(col => col.value)

// --- Default Hidden Keys ---
const defaultHiddenKeys = {
  package: ['package_component_id', 'createdAt', 'updatedAt', 'component_id', 'component_type', 'formatted_component_id'],
  packages: ['package_component_id', 'createdAt', 'updatedAt', 'component_id', 'component_type', 'formatted_component_id'],
  cpu: ['cpu_id', 'createdAt', 'updatedAt', 'soc_id', 'SoC', 'notes'],
  gpu: ['gpu_id', 'createdAt', 'updatedAt', 'soc_id', 'SoC', 'cores', 'notes',
    'l0_cache', 'l1_cache', 'l2_cache', 'l3_cache', 'fp16', 'fp32', 'fp64',
    'pixel_shader', 'vertex_shader', 'shader_units', 'texture_mapping_units',
    'render_output_units', 'compute_units', 'ray_tracing_units', 'system_shared_memory'],
  aiProcessor: ['ai_processor_id', 'createdAt', 'updatedAt', 'soc_id', 'SoC', 'cores', 'notes',
    'performance_tops', 'clock_rate_ghz', 'tdp_w', 'die_size_mm2', 'process_node_nm',
    'sram_mb', 'sram_bandwidth_tbs', 'dram_gb', 'dram_bandwidth_gbs', 'peak_bw_gbs',
    'networking', 'units', 'format', 'cloud_edge', 'workload_type', 'source', 'usage'],
  soc: ['soc_id', 'soc_name', 'createdAt', 'updatedAt', 'benchmarks', 'economics', 
  'release_price', 'processors', 'cpu_id', 'gpu_id', 'fpga_id', 'ai_processor_id', 'notes',
  'max_clock', 'lithography', 'fp64_ops', 'fp32_ops', 'fp16_ops', 'code_name', '_rowId'],
  socs: ['soc_id', 'soc_name', 'createdAt', 'updatedAt', 'benchmarks', 'economics', 
  'release_price', 'processors', 'cpu_id', 'gpu_id', 'fpga_id', 'ai_processor_id', 'notes',
  'max_clock', 'lithography', 'fp64_ops', 'fp32_ops', 'fp16_ops', 'code_name', '_rowId'],
}

// --- Additional Columns ---
const additionalColumns = computed(() => {
  const dataArr = flattenedData.value
  if (!dataArr.length) return []

  const firstItem = dataArr[0]
  if (!firstItem || typeof firstItem !== 'object') return []
  
  const keys = Object.keys(firstItem)
  const hidden = defaultHiddenKeys[props.className] || []

  const filteredKeys = keys.filter((key) => {
    if (defaultColumnsOrderKeys.includes(key)) return false
    if (hidden.includes(key)) return false
    const value = firstItem[key]
    // Skip complex objects but allow arrays (they'll be stringified)
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) return false
    return true
  })
  
  return filteredKeys.map(key => ({
    label: formatColumnLabel(key),
    value: key,
  }))
})

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
const generateXLSX = async () => {
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
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');
  
  // Add headers
  worksheet.addRow(filteredColumns);
  
  // Add data rows
  minimalData.forEach(item => {
    const row = filteredColumns.map(col => item[col] ?? '');
    worksheet.addRow(row);
  });
  
  // Set workbook properties
  workbook.creator = 'MIT FutureTech';
  workbook.lastModifiedBy = 'MIT FutureTech';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.description = 'Data exported from ProcessorDB';
  workbook.keywords = 'processors, database, export';
  workbook.category = 'Data Export';
  workbook.company = 'MIT FutureTech';
  workbook.manager = 'MIT FutureTech';
  workbook.title = `${props.className} Data - ProcessorDB - MIT FutureTech`;
  workbook.subject = `${props.className.toUpperCase()} Hardware Specifications`;
  workbook.comments = 'This data is provided under CC-BY-4.0 license';
  
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

// Generate PDF Blob (async because of image loading)
const generatePDFReadme = async () => {
  const { jsPDF } = await import('jspdf');
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
// Filter to only show columns that exist in the data (resilience to schema changes)
const displayedColumns = computed(() => {
  const dataArr = flattenedData.value
  if (!dataArr.length) return []
  
  const firstItem = dataArr[0]
  const availableFields = new Set(Object.keys(firstItem))
  
  return allColumns.value.filter(col => {
    // Only include if column is selected AND field exists in data
    return selectedColumns.value.includes(col.value) && 
           (availableFields.has(col.value) || 
            getFieldValue(firstItem, col.value) !== '')
  })
})

// --- Search, Sorting, and Pagination ---
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const searchTimeout = ref(null)
const sortField = ref('')
const sortOrder = ref('asc')

// Debounce search query to avoid excessive filtering
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    debouncedSearchQuery.value = newQuery
  }, 300) // 300ms debounce
}, { immediate: true })

// Optimized search with early exit
const filteredData = computed(() => {
  if (!debouncedSearchQuery.value) return flattenedData.value
  
  const query = debouncedSearchQuery.value.toLowerCase()
  const columns = displayedColumns.value
  
  return flattenedData.value.filter(item => {
    // Early exit if any column matches
    for (const col of columns) {
      const cellValue = getFieldValue(item, col.value)
      if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
        if (cellValue.toString().toLowerCase().includes(query)) {
          return true
        }
      }
    }
    return false
  })
})

const sortedData = computed(() => {
  let dataToSort = [...filteredData.value]
  if (!sortField.value) {
    return dataToSort.sort((a, b) => {
      const aYear = getFieldValue(a, 'release_year') || -Infinity
      const bYear = getFieldValue(b, 'release_year') || -Infinity
      return bYear - aYear
    })
  }
  return dataToSort.sort((a, b) => {
    const aVal = getFieldValue(a, sortField.value) || ''
    const bVal = getFieldValue(b, sortField.value) || ''
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

// Display all data (no client-side pagination since we're using API pagination)
const displayedData = computed(() => sortedData.value)

// Calculate record range based on API pagination
const startRecord = computed(() => {
  if (props.totalCount === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const endRecord = computed(() => {
  if (props.totalCount === 0) return 0
  return Math.min(props.currentPage * props.pageSize, props.totalCount)
})

// Pagination handlers - emit events to parent
const nextPage = () => {
  if (props.hasNextPage && props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

const prevPage = () => {
  if (props.hasPreviousPage && props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const handlePageChange = (event) => {
  const newPage = parseInt(event.target.value) || 1
  const validPage = Math.max(1, Math.min(newPage, props.totalPages))
  if (validPage !== props.currentPage) {
    emit('update:currentPage', validPage)
  }
}

const handlePageSizeChange = (event) => {
  const newPageSize = parseInt(event.target.value) || 50
  emit('update:pageSize', newPageSize)
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Log pagination state for debugging
const logPaginationState = (button) => {
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
