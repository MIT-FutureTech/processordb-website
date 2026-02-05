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
  { value: 'architecture', label: 'Architecture', source: 'gpu' },  // Default: groups by architecture (Pascal, Turing, Ampere, etc.) for better performance
  { value: 'name', label: 'Name', source: 'gpu' },
  { value: 'variant', label: 'Variant', source: 'gpu' },
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

// FPGA numeric/date fields for axes
export const fpgaNumericFields = [
  { value: 'clbs', label: 'CLBs', source: 'fpga' },
  { value: 'slice_per_clb', label: 'Slice Per CLB', source: 'fpga' },
  { value: 'slices', label: 'Slices', source: 'fpga' },
  { value: 'slicels', label: 'SliceLS', source: 'fpga' },
  { value: 'slicex', label: 'SliceX', source: 'fpga' },
  { value: 'slicems', label: 'SliceMS', source: 'fpga' },
  { value: 'lut_per_slice', label: 'LUT Per Slice', source: 'fpga' },
  { value: 'lut_per_clb', label: 'LUT Per CLB', source: 'fpga' },
  { value: 'luts', label: 'LUTs', source: 'fpga' },
  { value: 'lut_inputs', label: 'LUT Inputs', source: 'fpga' },
  { value: 'ff_per_slice', label: 'FF Per Slice', source: 'fpga' },
  { value: 'ff_per_clb', label: 'FF Per CLB', source: 'fpga' },
  { value: 'ffs', label: 'Flip-Flops', source: 'fpga' },
  { value: 'distributed_ram', label: 'Distributed RAM', source: 'fpga' },
  { value: 'block_rams', label: 'Block RAMs', source: 'fpga' },
  { value: 'urams', label: 'URAMs', source: 'fpga' },
  { value: 'multiplier_dsp_blocks', label: 'DSP Blocks', source: 'fpga' },
  { value: 'ai_engines', label: 'AI Engines', source: 'fpga' },
  { value: 'noc_master_slave_ports', label: 'NoC Master/Slave Ports', source: 'fpga' },
  { value: 'io_banks', label: 'IO Banks', source: 'fpga' },
  { value: 'user_io_max', label: 'User IO Max', source: 'fpga' },
  { value: 'user_io_differential_pairs_max', label: 'User IO Differential Pairs Max', source: 'fpga' },
  { value: 'tri_state_buses', label: 'Tri-State Buses', source: 'fpga' },
  { value: 'tri_state_buffers_per_bus', label: 'Tri-State Buffers Per Bus', source: 'fpga' },
  { value: 'global_clock_buffers', label: 'Global Clock Buffers', source: 'fpga' },
  { value: 'clock_regions', label: 'Clock Regions', source: 'fpga' },
  { value: 'clock_buffers_per_region', label: 'Clock Buffers Per Region', source: 'fpga' },
  { value: 'regional_clock_buffers', label: 'Regional Clock Buffers', source: 'fpga' },
  { value: 'cmts', label: 'CMTs', source: 'fpga' },
  { value: 'dlls_dcms_mmcm', label: 'DLLs/DCMs/MMCM', source: 'fpga' },
  { value: 'pmcds', label: 'PMCDs', source: 'fpga' },
  { value: 'plls', label: 'PLLs', source: 'fpga' },
  { value: 'multi_gigabit_transceivers_max', label: 'Multi-Gigabit Transceivers Max', source: 'fpga' },
  { value: 'ethernet_macs', label: 'Ethernet MACs', source: 'fpga' },
  { value: 'pci_express_cores', label: 'PCI Express Cores', source: 'fpga' },
  { value: 'mcbs', label: 'MCBs', source: 'fpga' },
  { value: 'off_chip_memory_size', label: 'Off-Chip Memory Size', source: 'fpga' },
  { value: 'xadcs', label: 'XADCs', source: 'fpga' },
  { value: 'intelaken_cores', label: 'Intelaken Cores', source: 'fpga' },
  { value: 'hsc_blocks', label: 'HSC Blocks', source: 'fpga' },
];

// FPGA categorical fields for group by
export const fpgaCategoricalFields = [
  { value: 'generation', label: 'Generation', source: 'fpga' },
  { value: 'family_subfamily', label: 'Family/Subfamily', source: 'fpga' },
  { value: 'model', label: 'Model', source: 'fpga' },
  { value: 'vendor', label: 'Vendor', source: 'fpga' },
  { value: 'processing_system', label: 'Processing System', source: 'fpga' },
  { value: 'off_chip_memory_type', label: 'Off-Chip Memory Type', source: 'fpga' },
  { value: 'multiplier_dsp_block_type', label: 'Multiplier DSP Block Type', source: 'fpga' },
];

// SoC numeric/date fields available to FPGA
export const socNumericFieldsForFPGA = [
  { value: 'release_date', label: 'Release Date', source: 'soc' },
  { value: 'process_node', label: 'Process Node (nm)', source: 'soc' },
  { value: 'die_sizes', label: 'Die Size (mm²)', source: 'soc' },
  { value: 'total_transistor_count', label: 'Total Transistor Count', source: 'soc' },
  { value: 'transistor_density', label: 'Transistor Density', source: 'soc' },
  { value: 'package_size', label: 'Package Size', source: 'soc' },
  { value: 'number_of_die', label: 'Number Of Die', source: 'soc' },
  { value: 'voltage_range_low', label: 'Voltage Range Low', source: 'soc' },
  { value: 'voltage_range_high', label: 'Voltage Range High', source: 'soc' },
];

// SoC categorical fields available to FPGA
export const socCategoricalFieldsForFPGA = socCategoricalFieldsForCPU;

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
  fpga: {
    numeric: [...fpgaNumericFields, ...socNumericFieldsForFPGA],
    categorical: [
      ...fpgaCategoricalFields,
      ...socCategoricalFieldsForFPGA,
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
// This provides resilience when field maps are incomplete or fields are renamed
export const generateNumericOptionsFromData = (data, processorType = 'cpu', excludes = []) => {
  if (!data || !data.length) return [];

  const sample = data[0];
  const options = [];
  const excludeSet = new Set([
    'id', 'createdAt', 'updatedAt', 
    'cpu_id', 'gpu_id', 'fpga_id', 'soc_id', 'manufacturer_id',
    'SoC', 'Manufacturer', 'processors', 'cores',
    'benchmarks', 'economics', 'notes',
    ...excludes
  ]);

  // Determine default source based on processor type
  const defaultSource = processorType || 'cpu';

  // Scan top-level fields
  for (const key in sample) {
    if (excludeSet.has(key)) continue;
    const value = sample[key];
    
    // Check for numeric fields
    if (typeof value === 'number' && !isNaN(value)) {
      options.push({ 
        label: convertString(key), 
        value: key, 
        source: defaultSource 
      });
    } 
    // Check for date fields
    else if (key === 'release_date' || (value instanceof Date) || 
             (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
      options.push({ 
        label: convertString(key), 
        value: key, 
        source: 'soc' 
      });
    }
  }

  // Scan nested SoC object if present
  if (sample.SoC && typeof sample.SoC === 'object') {
    const socExcludes = new Set([
      'soc_id', 'manufacturer_id', 'createdAt', 'updatedAt', 
      'Manufacturer', 'processors', 'cores',
      ...excludes
    ]);
    
    for (const key in sample.SoC) {
      if (socExcludes.has(key)) continue;
      const value = sample.SoC[key];
      
      if (typeof value === 'number' && !isNaN(value)) {
        options.push({ 
          label: convertString(key), 
          value: key, 
          source: 'soc' 
        });
      } else if (key === 'release_date' || (value instanceof Date) ||
                 (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
        options.push({ 
          label: convertString(key), 
          value: key, 
          source: 'soc' 
        });
      }
    }
  }

  // Remove duplicates based on value and source
  const seen = new Set();
  return options.filter(opt => {
    const key = `${opt.value}-${opt.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Helper function to dynamically generate categorical options from data (fallback)
export const generateCategoricalOptionsFromData = (data, processorType = 'cpu', excludes = []) => {
  if (!data || !data.length) return [];

  const sample = data[0];
  const options = [];
  const excludeSet = new Set([
    'id', 'createdAt', 'updatedAt',
    'cpu_id', 'gpu_id', 'fpga_id', 'soc_id', 'manufacturer_id',
    'SoC', 'Manufacturer', 'processors', 'cores',
    'benchmarks', 'economics', 'notes',
    'distributed_ram_notes', 'noc_master_slave_port_notes',
    ...excludes
  ]);

  const defaultSource = processorType || 'cpu';

  // Scan top-level fields
  for (const key in sample) {
    if (excludeSet.has(key)) continue;
    const value = sample[key];
    
    // Include string fields and non-numeric fields (but not objects/arrays)
    if (typeof value === 'string' && value.length > 0) {
      options.push({ 
        label: convertString(key), 
        value: key, 
        source: defaultSource 
      });
    }
  }

  // Scan nested SoC object if present
  if (sample.SoC && typeof sample.SoC === 'object') {
    const socExcludes = new Set([
      'soc_id', 'manufacturer_id', 'createdAt', 'updatedAt',
      'Manufacturer', 'processors', 'cores',
      ...excludes
    ]);
    
    for (const key in sample.SoC) {
      if (socExcludes.has(key)) continue;
      const value = sample.SoC[key];
      
      if (typeof value === 'string' && value.length > 0) {
        options.push({ 
          label: convertString(key), 
          value: key, 
          source: 'soc' 
        });
      } else if (key === 'manufacturer_name' && sample.SoC.Manufacturer) {
        // Special case for manufacturer
        options.push({ 
          label: 'Manufacturer', 
          value: 'manufacturer_name', 
          source: 'soc' 
        });
      }
    }
  }

  // Remove duplicates
  const seen = new Set();
  return options.filter(opt => {
    const key = `${opt.value}-${opt.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Validation helper: Log warnings when field map fields don't exist in data
export const validateFieldMaps = (fieldMapOptions, data, processorType) => {
  if (!data || !data.length || !fieldMapOptions || !fieldMapOptions.length) {
    return;
  }

  const sample = data[0];
  const missingFields = [];
  const availableFields = new Set(Object.keys(sample));
  
  // Also check nested SoC fields
  if (sample.SoC) {
    Object.keys(sample.SoC).forEach(key => availableFields.add(key));
  }

  fieldMapOptions.forEach(opt => {
    const fieldExists = 
      availableFields.has(opt.value) ||
      (opt.source === 'soc' && sample.SoC && sample.SoC.hasOwnProperty(opt.value)) ||
      (opt.value === 'manufacturer_name' && (sample.manufacturer_name || sample.SoC?.Manufacturer));

    if (!fieldExists) {
      missingFields.push(`${opt.value} (${opt.source})`);
    }
  });

  if (missingFields.length > 0 && typeof console !== 'undefined' && console.warn) {
    // Only warn in development mode to reduce console noise in production
    let isDev = false;
    try {
      // Check Node.js environment
      if (typeof process !== 'undefined' && process.env) {
        isDev = process.env.NODE_ENV !== 'production';
      }
      // Check Vite/Nuxt environment (import.meta is available in ES modules)
      if (!isDev) {
        try {
          // Access import.meta directly - it's available in ES modules, wrap in try-catch for safety
          // eslint-disable-next-line no-undef
          if (import.meta && import.meta.env) {
            // eslint-disable-next-line no-undef
            isDev = import.meta.env.DEV === true;
          }
        } catch (e) {
          // import.meta not available (e.g., in non-ES module context), skip
        }
      }
    } catch (e) {
      // If we can't determine environment, default to showing warnings (safer for development)
      isDev = true;
    }
    
    if (isDev) {
      // Group warnings: show count and first few examples, not all fields
      const maxFieldsToShow = 5;
      const fieldsToShow = missingFields.slice(0, maxFieldsToShow);
      const remainingCount = missingFields.length - maxFieldsToShow;
      const fieldsList = remainingCount > 0 
        ? `${fieldsToShow.join(', ')}, ... and ${remainingCount} more`
        : missingFields.join(', ');
      
      console.warn(
        `[chartFieldMaps] ${processorType}: ${missingFields.length} field map field(s) not found in data (${fieldsList}). This is normal if fields are optional or not yet populated.`
      );
    }
  }
};
