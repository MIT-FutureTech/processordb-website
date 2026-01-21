// Comprehensive field maps for chart dropdowns
// Maps all available fields from CPU, GPU, and SoC models

// Utility to convert underscore_case strings into a friendly format
export const convertString = (str) => {
  return str.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// CPU numeric/date fields for axes
export const cpuNumericFields = [
  { value: 'clock', label: 'Clock (MHz)', source: 'cpu' },
  { value: 'max_clock', label: 'Max Clock (MHz)', source: 'cpu' },
  { value: 'die_area', label: 'Die Area', source: 'cpu' },
  { value: 'threads_per_core', label: 'Threads Per Core', source: 'cpu' },
  { value: 'core_count', label: 'Core Count', source: 'cpu' },
  { value: 'tdp', label: 'TDP (W)', source: 'cpu' },
  { value: 'l3_cache', label: 'L3 Cache', source: 'cpu' },
  { value: 'l3_cache_latency', label: 'L3 Cache Latency', source: 'cpu' },
  { value: 'l2_cache', label: 'L2 Cache', source: 'cpu' },
  { value: 'l2_cache_latency', label: 'L2 Cache Latency', source: 'cpu' },
  { value: 'l1_cache_data', label: 'L1 Cache Data', source: 'cpu' },
  { value: 'l1_cache_instruction', label: 'L1 Cache Instruction', source: 'cpu' },
  { value: 'l1_cache', label: 'L1 Cache', source: 'cpu' },
  { value: 'l1_cache_latency', label: 'L1 Cache Latency', source: 'cpu' },
  { value: 'l4_cache', label: 'L4 Cache', source: 'cpu' },
  { value: 'bus_speed', label: 'Bus Speed', source: 'cpu' },
  { value: 'max_memory_size', label: 'Max Memory Size', source: 'cpu' },
  { value: 'max_memory_channels', label: 'Max Memory Channels', source: 'cpu' },
  { value: 'max_memory_bandwidth', label: 'Max Memory Bandwidth', source: 'cpu' },
  { value: 'turbo_boost_max_technology_3_frequency', label: 'Turbo Boost Max Technology 3 Frequency', source: 'cpu' },
  { value: 'turbo_frequency_1core', label: 'Turbo Frequency 1 Core', source: 'cpu' },
  { value: 'turbo_frequency_2core', label: 'Turbo Frequency 2 Core', source: 'cpu' },
  { value: 'edram', label: 'EDRAM', source: 'cpu' },
  { value: 'instruction_set_width', label: 'Instruction Set Width', source: 'cpu' },
  { value: 'graphics_max_dynamic_frequency', label: 'Graphics Max Dynamic Frequency', source: 'cpu' },
  { value: 'graphics_base_frequency', label: 'Graphics Base Frequency', source: 'cpu' },
  { value: 'graphics_memory_size', label: 'Graphics Memory Size', source: 'cpu' },
  { value: 'fp64_ops', label: 'FP64 Operations', source: 'cpu' },
  { value: 'fp32_ops', label: 'FP32 Operations', source: 'cpu' },
  { value: 'fp16_ops', label: 'FP16 Operations', source: 'cpu' },
  { value: 'fp32_theoretical_mflops', label: 'FP32 Theoretical MFLOPS', source: 'cpu' },
  { value: 'fp32_measured_gflops', label: 'FP32 Measured GFLOPS', source: 'cpu' },
  { value: 'mips', label: 'MIPS', source: 'cpu' },
];

// CPU categorical fields for group by
export const cpuCategoricalFields = [
  { value: 'family', label: 'Family', source: 'cpu' },
  { value: 'code_name', label: 'Code Name', source: 'cpu' },
  { value: 'microarchitecture', label: 'Microarchitecture', source: 'cpu' },
  { value: 'model', label: 'Model', source: 'cpu' },
  { value: 'lithography', label: 'Lithography', source: 'cpu' },
  { value: 'memory_type', label: 'Memory Type', source: 'cpu' },
  { value: 'graphics', label: 'Graphics', source: 'cpu' },
];

// SoC numeric/date fields available to CPU
export const socNumericFieldsForCPU = [
  { value: 'release_date', label: 'Release Date', source: 'soc' },
  { value: 'process_node', label: 'Process Node (nm)', source: 'soc' },
  { value: 'die_sizes', label: 'Die Size (mm²)', source: 'soc' },
  { value: 'total_transistor_count', label: 'Total Transistor Count', source: 'soc' },
  { value: 'transistor_density', label: 'Transistor Density', source: 'soc' },
  { value: 'package_size', label: 'Package Size', source: 'soc' },
  { value: 'number_of_die', label: 'Number Of Die', source: 'soc' },
  { value: 'voltage_range_low', label: 'Voltage Range Low', source: 'soc' },
  { value: 'voltage_range_high', label: 'Voltage Range High', source: 'soc' },
  { value: 'core_count', label: 'Core Count', source: 'soc' },
];

// SoC categorical fields available to CPU
export const socCategoricalFieldsForCPU = [
  { value: 'platform', label: 'Platform', source: 'soc' },
];

// GPU numeric/date fields for axes
export const gpuNumericFields = [
  { value: 'process_size', label: 'Process Size (nm)', source: 'gpu' },
  { value: 'tdp', label: 'TDP (W)', source: 'gpu' },
  { value: 'core_count', label: 'Core Count', source: 'gpu' },
  { value: 'base_clock', label: 'Base Clock (MHz)', source: 'gpu' },
  { value: 'boost_clock', label: 'Boost Clock (MHz)', source: 'gpu' },
  { value: 'memory_clock', label: 'Memory Clock (MHz)', source: 'gpu' },
  { value: 'memory_size', label: 'Memory Size (GB)', source: 'gpu' },
  { value: 'memory_bus', label: 'Memory Bus', source: 'gpu' },
  { value: 'memory_bandwidth', label: 'Memory Bandwidth', source: 'gpu' },
  { value: 'l0_cache', label: 'L0 Cache', source: 'gpu' },
  { value: 'l1_cache', label: 'L1 Cache', source: 'gpu' },
  { value: 'l2_cache', label: 'L2 Cache', source: 'gpu' },
  { value: 'l3_cache', label: 'L3 Cache', source: 'gpu' },
  { value: 'pixel_rate', label: 'Pixel Rate', source: 'gpu' },
  { value: 'texture_rate', label: 'Texture Rate', source: 'gpu' },
  { value: 'fp16', label: 'FP16', source: 'gpu' },
  { value: 'fp32', label: 'FP32', source: 'gpu' },
  { value: 'fp64', label: 'FP64', source: 'gpu' },
  { value: 'shader_units', label: 'Shader Units', source: 'gpu' },
  { value: 'texture_mapping_units', label: 'Texture Mapping Units', source: 'gpu' },
  { value: 'render_output_units', label: 'Render Output Units', source: 'gpu' },
  { value: 'compute_units', label: 'Compute Units', source: 'gpu' },
  { value: 'ray_tracing_units', label: 'Ray Tracing Units', source: 'gpu' },
];

// GPU categorical fields for group by
export const gpuCategoricalFields = [
  { value: 'name', label: 'Name', source: 'gpu' },
  { value: 'variant', label: 'Variant', source: 'gpu' },
  { value: 'architecture', label: 'Architecture', source: 'gpu' },
  { value: 'generation', label: 'Generation', source: 'gpu' },
  { value: 'memory_type', label: 'Memory Type', source: 'gpu' },
  { value: 'slot', label: 'Slot', source: 'gpu' },
  { value: 'directx', label: 'DirectX', source: 'gpu' },
  { value: 'opengl', label: 'OpenGL', source: 'gpu' },
  { value: 'opencl', label: 'OpenCL', source: 'gpu' },
  { value: 'vulkan', label: 'Vulkan', source: 'gpu' },
  { value: 'bus_interface', label: 'Bus Interface', source: 'gpu' },
];

// SoC numeric/date fields available to GPU (same as for CPU)
export const socNumericFieldsForGPU = socNumericFieldsForCPU;

// SoC categorical fields available to GPU (same as for CPU)
export const socCategoricalFieldsForGPU = socCategoricalFieldsForCPU;

// SoC numeric/date fields for axes
export const socNumericFields = [
  { value: 'release_date', label: 'Release Date', source: 'soc' },
  { value: 'core_count', label: 'Core Count', source: 'soc' },
  { value: 'process_node', label: 'Process Node (nm)', source: 'soc' },
  { value: 'total_transistor_count', label: 'Total Transistor Count', source: 'soc' },
  { value: 'package_size', label: 'Package Size', source: 'soc' },
  { value: 'die_sizes', label: 'Die Size (mm²)', source: 'soc' },
  { value: 'number_of_die', label: 'Number Of Die', source: 'soc' },
  { value: 'voltage_range_low', label: 'Voltage Range Low', source: 'soc' },
  { value: 'voltage_range_high', label: 'Voltage Range High', source: 'soc' },
  { value: 'transistor_density', label: 'Transistor Density', source: 'soc' },
];

// SoC categorical fields for group by
export const socCategoricalFields = [
  { value: 'platform', label: 'Platform', source: 'soc' },
];

// Combined field maps for each processor type
export const fieldMaps = {
  cpu: {
    numeric: [...cpuNumericFields, ...socNumericFieldsForCPU],
    categorical: [
      ...cpuCategoricalFields,
      ...socCategoricalFieldsForCPU,
      { value: 'manufacturer_name', label: 'Manufacturer', source: 'soc' },
    ],
  },
  gpu: {
    numeric: [...gpuNumericFields, ...socNumericFieldsForGPU],
    categorical: [
      ...gpuCategoricalFields,
      ...socCategoricalFieldsForGPU,
      { value: 'manufacturer_name', label: 'Manufacturer', source: 'soc' },
    ],
  },
  soc: {
    numeric: socNumericFields,
    categorical: [
      ...socCategoricalFields,
      { value: 'manufacturer_name', label: 'Manufacturer', source: 'soc' },
      { value: 'processor_type', label: 'Processor Type', source: 'soc' },
    ],
  },
};

// Helper function to get numeric options for a processor type
export const getNumericOptions = (processorType) => {
  return fieldMaps[processorType]?.numeric || [];
};

// Helper function to get categorical options for a processor type
export const getCategoricalOptions = (processorType) => {
  return fieldMaps[processorType]?.categorical || [];
};

// Helper function to dynamically generate options from data (fallback)
export const generateNumericOptionsFromData = (data, excludes = []) => {
  if (!data || !data.length) return [];

  const sample = data[0];
  const options = [];
  const excludeSet = new Set(excludes);

  // Scan top-level fields
  for (const key in sample) {
    if (excludeSet.has(key)) continue;
    if (typeof sample[key] === 'number') {
      options.push({ label: convertString(key), value: key, source: 'cpu' });
    } else if (key === 'release_date' || (sample[key] instanceof Date)) {
      options.push({ label: convertString(key), value: key, source: 'soc' });
    }
  }

  // Scan nested SoC object if present
  if (sample.SoC) {
    const socExcludes = new Set(['soc_id', 'manufacturer_id', 'createdAt', 'updatedAt', ...excludes]);
    for (const key in sample.SoC) {
      if (socExcludes.has(key)) continue;
      if (typeof sample.SoC[key] === 'number' || key === 'release_date') {
        options.push({ label: convertString(key), value: key, source: 'soc' });
      }
    }
  }

  return options;
};
