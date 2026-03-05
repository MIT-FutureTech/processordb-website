/**
 * Table column configuration for dynamic table rendering
 * Each resource type has a column definition with key, label, and sortable flag
 */

export const cpuColumns = [
  { key: 'model', label: 'Model', sortable: true },
  { key: 'family', label: 'Family', sortable: true },
  { key: 'code_name', label: 'Code Name', sortable: true },
  { key: 'microarchitecture', label: 'Microarchitecture', sortable: true },
  { key: 'clock', label: 'Clock (MHz)', sortable: true },
  { key: 'max_clock', label: 'Max Clock (MHz)', sortable: true },
  { key: 'core_count', label: 'Cores', sortable: true },
  { key: 'tdp', label: 'TDP (W)', sortable: true },
  { key: 'lithography', label: 'Lithography (nm)', sortable: true },
  { key: 'l3_cache', label: 'L3 Cache (MB)', sortable: true },
  { key: 'l2_cache', label: 'L2 Cache (KB)', sortable: true },
  { key: 'l1_cache', label: 'L1 Cache (KB)', sortable: true },
  { key: 'release_year', label: 'Release Year', sortable: true },
  { key: 'manufacturer_name', label: 'Manufacturer', sortable: true },
]

export const gpuColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'generation', label: 'Generation', sortable: true },
  { key: 'architecture', label: 'Architecture', sortable: true },
  { key: 'base_clock', label: 'Base Clock (MHz)', sortable: true },
  { key: 'boost_clock', label: 'Boost Clock (MHz)', sortable: true },
  { key: 'compute_units', label: 'Compute Units', sortable: true },
  { key: 'memory_size', label: 'Memory Size (GB)', sortable: true },
  { key: 'memory_bandwidth', label: 'Memory Bandwidth (GB/s)', sortable: true },
  { key: 'tdp', label: 'TDP (W)', sortable: true },
  { key: 'fp32_ops', label: 'FP32 Ops', sortable: true },
  { key: 'fp64_ops', label: 'FP64 Ops', sortable: true },
  { key: 'release_year', label: 'Release Year', sortable: true },
  { key: 'manufacturer_name', label: 'Manufacturer', sortable: true },
]

export const fpgaColumns = [
  { key: 'model', label: 'Model', sortable: true },
  { key: 'generation', label: 'Generation', sortable: true },
  { key: 'family_subfamily', label: 'Family/Subfamily', sortable: true },
  { key: 'processing_system', label: 'Processing System', sortable: true },
  { key: 'clbs', label: 'CLBs', sortable: true },
  { key: 'luts', label: 'LUTs', sortable: true },
  { key: 'ffs', label: 'FFs', sortable: true },
  { key: 'block_rams', label: 'Block RAMs', sortable: true },
  { key: 'multiplier_dsp_blocks', label: 'DSP Blocks', sortable: true },
  { key: 'release_year', label: 'Release Year', sortable: true },
  { key: 'manufacturer_name', label: 'Manufacturer', sortable: true },
]

export const socColumns = [
  { key: 'soc_name', label: 'SoC Name', sortable: true },
  { key: 'manufacturer_name', label: 'Manufacturer', sortable: true },
  { key: 'release_date', label: 'Release Date', sortable: true },
  { key: 'release_year', label: 'Release Year', sortable: true },
  { key: 'process_node', label: 'Process Node (nm)', sortable: true },
  { key: 'platform', label: 'Platform', sortable: true },
  { key: 'total_transistor_count', label: 'Transistor Count', sortable: true },
  { key: 'transistor_density', label: 'Transistor Density', sortable: true },
  { key: 'die_sizes', label: 'Die Size', sortable: true },
  { key: 'package_size', label: 'Package Size', sortable: true },
]

export const manufacturerColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'founded_year', label: 'Founded Year', sortable: true },
]

export const aiProcessorColumns = [
  { key: 'model_name', label: 'Model', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'product_name', label: 'Product', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'precision', label: 'Precision', sortable: true },
  { key: 'format', label: 'Format', sortable: true },
  { key: 'cloud_edge', label: 'Cloud/Edge', sortable: true },
  { key: 'workload_type', label: 'Workload Type', sortable: true },
]

/**
 * Get column config for a resource type
 * @param {string} resourceType - Resource type ('cpu', 'gpu', 'fpga', 'soc', 'manufacturer', 'ai-processor')
 * @returns {Array} Column configuration array
 */
export function getColumnsForResource(resourceType) {
  const columnMap = {
    'cpu': cpuColumns,
    'gpu': gpuColumns,
    'fpga': fpgaColumns,
    'soc': socColumns,
    'manufacturer': manufacturerColumns,
    'ai-processor': aiProcessorColumns,
  }
  return columnMap[resourceType] || []
}
