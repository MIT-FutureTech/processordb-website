/**
 * Standardized message constants for all form operations
 * Each message has a unique code for testing and a template for display
 */

export const MESSAGES = {
  // Error messages
  ERROR: {
    // CPU errors
    CPU_CREATE_VALIDATION_MANUFACTURER_REQUIRED: {
      code: 'CPU_CREATE_VALIDATION_MANUFACTURER_REQUIRED',
      template: 'CPU creation failed: Manufacturer is required. Please fill in all required fields.',
      type: 'validation',
      field: 'manufacturer'
    },
    CPU_CREATE_VALIDATION_FAMILY_REQUIRED: {
      code: 'CPU_CREATE_VALIDATION_FAMILY_REQUIRED',
      template: 'CPU creation failed: Family is required. Please fill in all required fields.',
      type: 'validation',
      field: 'family'
    },
    CPU_CREATE_VALIDATION_MODEL_REQUIRED: {
      code: 'CPU_CREATE_VALIDATION_MODEL_REQUIRED',
      template: 'CPU creation failed: Model is required. Please fill in all required fields.',
      type: 'validation',
      field: 'model'
    },
    CPU_CREATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'CPU_CREATE_VALIDATION_REQUIRED_FIELDS',
      template: 'CPU creation failed: Please fill in all required fields (Manufacturer, Family, Model).',
      type: 'validation'
    },
    CPU_UPDATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'CPU_UPDATE_VALIDATION_REQUIRED_FIELDS',
      template: 'CPU update failed: Please fill in all required fields (Manufacturer, Family, Model).',
      type: 'validation'
    },
    CPU_CREATE_NETWORK_ERROR: {
      code: 'CPU_CREATE_NETWORK_ERROR',
      template: 'CPU creation failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    CPU_UPDATE_NETWORK_ERROR: {
      code: 'CPU_UPDATE_NETWORK_ERROR',
      template: 'CPU update failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    CPU_CREATE_SERVER_ERROR: {
      code: 'CPU_CREATE_SERVER_ERROR',
      template: 'CPU creation failed: Server error. Please try again later.',
      type: 'server'
    },
    CPU_UPDATE_SERVER_ERROR: {
      code: 'CPU_UPDATE_SERVER_ERROR',
      template: 'CPU update failed: Server error. Please try again later.',
      type: 'server'
    },
    CPU_CREATE_TIMEOUT: {
      code: 'CPU_CREATE_TIMEOUT',
      template: 'CPU creation failed: Request timed out. Please try again.',
      type: 'timeout'
    },
    CPU_UPDATE_TIMEOUT: {
      code: 'CPU_UPDATE_TIMEOUT',
      template: 'CPU update failed: Request timed out. Please try again.',
      type: 'timeout'
    },
    CPU_CREATE_INVALID_RESPONSE: {
      code: 'CPU_CREATE_INVALID_RESPONSE',
      template: 'CPU creation failed: Invalid response from server. Please try again.',
      type: 'server'
    },
    CPU_UPDATE_INVALID_RESPONSE: {
      code: 'CPU_UPDATE_INVALID_RESPONSE',
      template: 'CPU update failed: Invalid response from server. Please try again.',
      type: 'server'
    },

    // GPU errors
    GPU_CREATE_VALIDATION_MANUFACTURER_REQUIRED: {
      code: 'GPU_CREATE_VALIDATION_MANUFACTURER_REQUIRED',
      template: 'GPU creation failed: Manufacturer is required. Please fill in all required fields.',
      type: 'validation',
      field: 'manufacturer'
    },
    GPU_CREATE_VALIDATION_VARIANT_REQUIRED: {
      code: 'GPU_CREATE_VALIDATION_VARIANT_REQUIRED',
      template: 'GPU creation failed: Variant is required. Please fill in all required fields.',
      type: 'validation',
      field: 'variant'
    },
    GPU_CREATE_VALIDATION_NAME_REQUIRED: {
      code: 'GPU_CREATE_VALIDATION_NAME_REQUIRED',
      template: 'GPU creation failed: Name is required. Please fill in all required fields.',
      type: 'validation',
      field: 'name'
    },
    GPU_CREATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'GPU_CREATE_VALIDATION_REQUIRED_FIELDS',
      template: 'GPU creation failed: Please fill in all required fields (Manufacturer, Variant, Name).',
      type: 'validation'
    },
    GPU_UPDATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'GPU_UPDATE_VALIDATION_REQUIRED_FIELDS',
      template: 'GPU update failed: Please fill in all required fields (Manufacturer, Variant, Name).',
      type: 'validation'
    },
    GPU_CREATE_NETWORK_ERROR: {
      code: 'GPU_CREATE_NETWORK_ERROR',
      template: 'GPU creation failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    GPU_UPDATE_NETWORK_ERROR: {
      code: 'GPU_UPDATE_NETWORK_ERROR',
      template: 'GPU update failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    GPU_CREATE_SERVER_ERROR: {
      code: 'GPU_CREATE_SERVER_ERROR',
      template: 'GPU creation failed: Server error. Please try again later.',
      type: 'server'
    },
    GPU_UPDATE_SERVER_ERROR: {
      code: 'GPU_UPDATE_SERVER_ERROR',
      template: 'GPU update failed: Server error. Please try again later.',
      type: 'server'
    },
    GPU_CREATE_INVALID_RESPONSE: {
      code: 'GPU_CREATE_INVALID_RESPONSE',
      template: 'GPU creation failed: Invalid response from server. Please try again.',
      type: 'server'
    },
    GPU_UPDATE_INVALID_RESPONSE: {
      code: 'GPU_UPDATE_INVALID_RESPONSE',
      template: 'GPU update failed: Invalid response from server. Please try again.',
      type: 'server'
    },

    // FPGA errors
    FPGA_CREATE_VALIDATION_MANUFACTURER_REQUIRED: {
      code: 'FPGA_CREATE_VALIDATION_MANUFACTURER_REQUIRED',
      template: 'FPGA creation failed: Manufacturer is required. Please fill in all required fields.',
      type: 'validation',
      field: 'manufacturer'
    },
    FPGA_CREATE_VALIDATION_GENERATION_REQUIRED: {
      code: 'FPGA_CREATE_VALIDATION_GENERATION_REQUIRED',
      template: 'FPGA creation failed: Generation is required. Please fill in all required fields.',
      type: 'validation',
      field: 'generation'
    },
    FPGA_CREATE_VALIDATION_MODEL_REQUIRED: {
      code: 'FPGA_CREATE_VALIDATION_MODEL_REQUIRED',
      template: 'FPGA creation failed: Model is required. Please fill in all required fields.',
      type: 'validation',
      field: 'model'
    },
    FPGA_CREATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'FPGA_CREATE_VALIDATION_REQUIRED_FIELDS',
      template: 'FPGA creation failed: Please fill in all required fields (Manufacturer, Generation, Model).',
      type: 'validation'
    },
    FPGA_UPDATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'FPGA_UPDATE_VALIDATION_REQUIRED_FIELDS',
      template: 'FPGA update failed: Please fill in all required fields (Manufacturer, Generation, Model).',
      type: 'validation'
    },
    FPGA_CREATE_NETWORK_ERROR: {
      code: 'FPGA_CREATE_NETWORK_ERROR',
      template: 'FPGA creation failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    FPGA_UPDATE_NETWORK_ERROR: {
      code: 'FPGA_UPDATE_NETWORK_ERROR',
      template: 'FPGA update failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    FPGA_CREATE_INVALID_RESPONSE: {
      code: 'FPGA_CREATE_INVALID_RESPONSE',
      template: 'FPGA creation failed: Invalid response from server. Please try again.',
      type: 'server'
    },
    FPGA_UPDATE_INVALID_RESPONSE: {
      code: 'FPGA_UPDATE_INVALID_RESPONSE',
      template: 'FPGA update failed: Invalid response from server. Please try again.',
      type: 'server'
    },

    // SoC errors
    SOC_CREATE_VALIDATION_MANUFACTURER_REQUIRED: {
      code: 'SOC_CREATE_VALIDATION_MANUFACTURER_REQUIRED',
      template: 'SoC creation failed: Manufacturer is required. Please fill in all required fields.',
      type: 'validation',
      field: 'manufacturer'
    },
    SOC_CREATE_VALIDATION_CODE_NAME_REQUIRED: {
      code: 'SOC_CREATE_VALIDATION_CODE_NAME_REQUIRED',
      template: 'SoC creation failed: Code Name is required. Please fill in all required fields.',
      type: 'validation',
      field: 'codeName'
    },
    SOC_CREATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'SOC_CREATE_VALIDATION_REQUIRED_FIELDS',
      template: 'SoC creation failed: Please fill in all required fields (Manufacturer, Code Name).',
      type: 'validation'
    },
    SOC_UPDATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'SOC_UPDATE_VALIDATION_REQUIRED_FIELDS',
      template: 'SoC update failed: Please fill in all required fields (Manufacturer, Code Name).',
      type: 'validation'
    },
    SOC_CREATE_NETWORK_ERROR: {
      code: 'SOC_CREATE_NETWORK_ERROR',
      template: 'SoC creation failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    SOC_UPDATE_NETWORK_ERROR: {
      code: 'SOC_UPDATE_NETWORK_ERROR',
      template: 'SoC update failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    SOC_CREATE_INVALID_RESPONSE: {
      code: 'SOC_CREATE_INVALID_RESPONSE',
      template: 'SoC creation failed: Invalid response from server. Please try again.',
      type: 'server'
    },
    SOC_UPDATE_INVALID_RESPONSE: {
      code: 'SOC_UPDATE_INVALID_RESPONSE',
      template: 'SoC update failed: Invalid response from server. Please try again.',
      type: 'server'
    },
    SOC_SAVE_FIRST_FOR_PROCESSORS: {
      code: 'SOC_SAVE_FIRST_FOR_PROCESSORS',
      template: 'Please save the SoC first before adding processors.',
      type: 'validation'
    },
    SOC_SAVE_FIRST_FOR_BENCHMARKS: {
      code: 'SOC_SAVE_FIRST_FOR_BENCHMARKS',
      template: 'Please save the SoC first before adding benchmarks.',
      type: 'validation'
    },
    SOC_SAVE_FIRST_FOR_ECONOMICS: {
      code: 'SOC_SAVE_FIRST_FOR_ECONOMICS',
      template: 'Please save the SoC first before adding economic data.',
      type: 'validation'
    },

    // Core errors
    CORE_CREATE_VALIDATION_NAME_REQUIRED: {
      code: 'CORE_CREATE_VALIDATION_NAME_REQUIRED',
      template: 'Core creation failed: Core name is required.',
      type: 'validation',
      field: 'core_name'
    },
    CORE_UPDATE_VALIDATION_NAME_REQUIRED: {
      code: 'CORE_UPDATE_VALIDATION_NAME_REQUIRED',
      template: 'Core update failed: Core name is required.',
      type: 'validation',
      field: 'core_name'
    },
    CORE_CREATE_NETWORK_ERROR: {
      code: 'CORE_CREATE_NETWORK_ERROR',
      template: 'Core creation failed: Network error. Please try again.',
      type: 'network'
    },
    CORE_UPDATE_NETWORK_ERROR: {
      code: 'CORE_UPDATE_NETWORK_ERROR',
      template: 'Core update failed: Network error. Please try again.',
      type: 'network'
    },
    CORE_DELETE_NETWORK_ERROR: {
      code: 'CORE_DELETE_NETWORK_ERROR',
      template: 'Core deletion failed: Network error. Please try again.',
      type: 'network'
    },
    CORE_CPU_ID_NOT_FOUND: {
      code: 'CORE_CPU_ID_NOT_FOUND',
      template: 'CPU ID not found.',
      type: 'validation'
    },
    CORE_GPU_ID_NOT_FOUND: {
      code: 'CORE_GPU_ID_NOT_FOUND',
      template: 'GPU ID not found.',
      type: 'validation'
    },

    // Benchmark errors
    BENCHMARK_CREATE_VALIDATION_NAME_REQUIRED: {
      code: 'BENCHMARK_CREATE_VALIDATION_NAME_REQUIRED',
      template: 'Benchmark creation failed: Benchmark name is required.',
      type: 'validation',
      field: 'benchmark_name'
    },
    BENCHMARK_CREATE_VALIDATION_SCORE_REQUIRED: {
      code: 'BENCHMARK_CREATE_VALIDATION_SCORE_REQUIRED',
      template: 'Benchmark creation failed: Score is required.',
      type: 'validation',
      field: 'score'
    },
    BENCHMARK_CREATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'BENCHMARK_CREATE_VALIDATION_REQUIRED_FIELDS',
      template: 'Benchmark creation failed: Please fill in required fields: Benchmark Name and Score.',
      type: 'validation'
    },
    BENCHMARK_UPDATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'BENCHMARK_UPDATE_VALIDATION_REQUIRED_FIELDS',
      template: 'Benchmark update failed: Please fill in required fields: Benchmark Name and Score.',
      type: 'validation'
    },
    BENCHMARK_CREATE_NETWORK_ERROR: {
      code: 'BENCHMARK_CREATE_NETWORK_ERROR',
      template: 'Benchmark creation failed: Network error. Please try again.',
      type: 'network'
    },
    BENCHMARK_DELETE_NETWORK_ERROR: {
      code: 'BENCHMARK_DELETE_NETWORK_ERROR',
      template: 'Benchmark deletion failed: Network error. Please try again.',
      type: 'network'
    },

    // Economics errors
    ECONOMIC_CREATE_VALIDATION_YEAR_REQUIRED: {
      code: 'ECONOMIC_CREATE_VALIDATION_YEAR_REQUIRED',
      template: 'Economic data creation failed: Year is required.',
      type: 'validation',
      field: 'year'
    },
    ECONOMIC_CREATE_VALIDATION_PRICE_REQUIRED: {
      code: 'ECONOMIC_CREATE_VALIDATION_PRICE_REQUIRED',
      template: 'Economic data creation failed: Price is required.',
      type: 'validation',
      field: 'price'
    },
    ECONOMIC_CREATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'ECONOMIC_CREATE_VALIDATION_REQUIRED_FIELDS',
      template: 'Economic data creation failed: Please fill in required fields: Year and Price.',
      type: 'validation'
    },
    ECONOMIC_UPDATE_VALIDATION_REQUIRED_FIELDS: {
      code: 'ECONOMIC_UPDATE_VALIDATION_REQUIRED_FIELDS',
      template: 'Economic data update failed: Please fill in required fields: Year and Price.',
      type: 'validation'
    },
    ECONOMIC_CREATE_NETWORK_ERROR: {
      code: 'ECONOMIC_CREATE_NETWORK_ERROR',
      template: 'Economic data creation failed: Network error. Please try again.',
      type: 'network'
    },
    ECONOMIC_DELETE_NETWORK_ERROR: {
      code: 'ECONOMIC_DELETE_NETWORK_ERROR',
      template: 'Economic data deletion failed: Network error. Please try again.',
      type: 'network'
    },

    // Processor association errors
    PROCESSOR_ASSOCIATION_SOC_ID_NOT_FOUND: {
      code: 'PROCESSOR_ASSOCIATION_SOC_ID_NOT_FOUND',
      template: 'SoC ID not found.',
      type: 'validation'
    },
    PROCESSOR_ASSOCIATION_NETWORK_ERROR: {
      code: 'PROCESSOR_ASSOCIATION_NETWORK_ERROR',
      template: 'Processor association failed: Network error. Please try again.',
      type: 'network'
    },
    PROCESSOR_DISASSOCIATION_NETWORK_ERROR: {
      code: 'PROCESSOR_DISASSOCIATION_NETWORK_ERROR',
      template: 'Processor disassociation failed: Network error. Please try again.',
      type: 'network'
    },

    // Suggestion errors
    SUGGESTION_NOTE_REQUIRED: {
      code: 'SUGGESTION_NOTE_REQUIRED',
      template: 'Note is required for suggestions. Please provide an explanation for your suggestion.',
      type: 'validation',
      field: 'note'
    },
    SUGGESTION_SUBMIT_NETWORK_ERROR: {
      code: 'SUGGESTION_SUBMIT_NETWORK_ERROR',
      template: 'Suggestion submission failed: Network error. Please try again.',
      type: 'network'
    },
    SUGGESTION_SUBMIT_SERVER_ERROR: {
      code: 'SUGGESTION_SUBMIT_SERVER_ERROR',
      template: 'Suggestion submission failed: Server error. Please try again later.',
      type: 'server'
    },
    SUGGESTION_CORE_NOTE_REQUIRED: {
      code: 'SUGGESTION_CORE_NOTE_REQUIRED',
      template: 'Note is required for suggestions. Please provide an explanation for your core suggestion.',
      type: 'validation',
      field: 'note'
    },
    SUGGESTION_BENCHMARK_NOTE_REQUIRED: {
      code: 'SUGGESTION_BENCHMARK_NOTE_REQUIRED',
      template: 'Note is required for suggestions. Please provide an explanation for your benchmark suggestion.',
      type: 'validation',
      field: 'note'
    },
    SUGGESTION_ECONOMIC_NOTE_REQUIRED: {
      code: 'SUGGESTION_ECONOMIC_NOTE_REQUIRED',
      template: 'Note is required for suggestions. Please provide an explanation for your economic data suggestion.',
      type: 'validation',
      field: 'note'
    },
    SUGGESTION_PROCESSOR_NOTE_REQUIRED: {
      code: 'SUGGESTION_PROCESSOR_NOTE_REQUIRED',
      template: 'Note is required for suggestions. Please provide an explanation for associating this processor.',
      type: 'validation',
      field: 'note'
    },
    SUGGESTION_DELETE_NOTE_REQUIRED: {
      code: 'SUGGESTION_DELETE_NOTE_REQUIRED',
      template: 'Note is required for deletion suggestions.',
      type: 'validation',
      field: 'note'
    },

    // Registration errors
    REGISTRATION_PASSWORD_MISMATCH: {
      code: 'REGISTRATION_PASSWORD_MISMATCH',
      template: 'Passwords do not match.',
      type: 'validation',
      field: 'confirmPassword'
    },
    REGISTRATION_PASSWORD_MIN_LENGTH: {
      code: 'REGISTRATION_PASSWORD_MIN_LENGTH',
      template: 'Password must be at least {min} characters.',
      type: 'validation',
      field: 'password'
    },
    REGISTRATION_EMAIL_INVALID: {
      code: 'REGISTRATION_EMAIL_INVALID',
      template: 'Please enter a valid email address.',
      type: 'validation',
      field: 'email'
    },
    REGISTRATION_USERNAME_REQUIRED: {
      code: 'REGISTRATION_USERNAME_REQUIRED',
      template: 'Username is required.',
      type: 'validation',
      field: 'username'
    },
    REGISTRATION_EMAIL_REQUIRED: {
      code: 'REGISTRATION_EMAIL_REQUIRED',
      template: 'Email is required.',
      type: 'validation',
      field: 'email'
    },
    REGISTRATION_PASSWORD_REQUIRED: {
      code: 'REGISTRATION_PASSWORD_REQUIRED',
      template: 'Password is required.',
      type: 'validation',
      field: 'password'
    },
    REGISTRATION_NETWORK_ERROR: {
      code: 'REGISTRATION_NETWORK_ERROR',
      template: 'Registration failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    REGISTRATION_SERVER_ERROR: {
      code: 'REGISTRATION_SERVER_ERROR',
      template: 'Registration failed: {message}',
      type: 'server'
    },

    // Login errors
    LOGIN_INVALID_CREDENTIALS: {
      code: 'LOGIN_INVALID_CREDENTIALS',
      template: 'Invalid email or password.',
      type: 'validation'
    },
    LOGIN_NETWORK_ERROR: {
      code: 'LOGIN_NETWORK_ERROR',
      template: 'Login failed: Network error. Please check your connection and try again.',
      type: 'network'
    },
    LOGIN_SERVER_ERROR: {
      code: 'LOGIN_SERVER_ERROR',
      template: 'Login failed: Server error. Please try again later.',
      type: 'server'
    },

    // Password update errors
    PASSWORD_UPDATE_NETWORK_ERROR: {
      code: 'PASSWORD_UPDATE_NETWORK_ERROR',
      template: 'Password update failed: Network error. Please try again.',
      type: 'network'
    },
    PASSWORD_UPDATE_SERVER_ERROR: {
      code: 'PASSWORD_UPDATE_SERVER_ERROR',
      template: 'Password update failed: {message}',
      type: 'server'
    },

    // Generic errors
    GENERIC_ERROR: {
      code: 'GENERIC_ERROR',
      template: 'An error occurred. Please try again.',
      type: 'server'
    },
    GENERIC_NETWORK_ERROR: {
      code: 'GENERIC_NETWORK_ERROR',
      template: 'Network error. Please check your connection and try again.',
      type: 'network'
    },
    GENERIC_SERVER_ERROR: {
      code: 'GENERIC_SERVER_ERROR',
      template: 'Server error. Please try again later.',
      type: 'server'
    },
    GENERIC_TIMEOUT: {
      code: 'GENERIC_TIMEOUT',
      template: 'Request timed out. Please try again.',
      type: 'timeout'
    },
    GENERIC_INVALID_RESPONSE: {
      code: 'GENERIC_INVALID_RESPONSE',
      template: 'Invalid response from server. Please try again.',
      type: 'server'
    }
  },

  // Success messages
  SUCCESS: {
    // CPU success
    CPU_CREATE_SUCCESS: {
      code: 'CPU_CREATE_SUCCESS',
      template: 'CPU created successfully! ID: {id}. Redirecting to detail page...',
      type: 'create',
      entity: 'cpu'
    },
    CPU_UPDATE_SUCCESS: {
      code: 'CPU_UPDATE_SUCCESS',
      template: 'CPU updated successfully!',
      type: 'update',
      entity: 'cpu'
    },

    // GPU success
    GPU_CREATE_SUCCESS: {
      code: 'GPU_CREATE_SUCCESS',
      template: 'GPU created successfully! ID: {id}. Redirecting to detail page...',
      type: 'create',
      entity: 'gpu'
    },
    GPU_UPDATE_SUCCESS: {
      code: 'GPU_UPDATE_SUCCESS',
      template: 'GPU updated successfully!',
      type: 'update',
      entity: 'gpu'
    },

    // FPGA success
    FPGA_CREATE_SUCCESS: {
      code: 'FPGA_CREATE_SUCCESS',
      template: 'FPGA created successfully! ID: {id}. Redirecting to detail page...',
      type: 'create',
      entity: 'fpga'
    },
    FPGA_UPDATE_SUCCESS: {
      code: 'FPGA_UPDATE_SUCCESS',
      template: 'FPGA updated successfully!',
      type: 'update',
      entity: 'fpga'
    },

    // SoC success
    SOC_CREATE_SUCCESS: {
      code: 'SOC_CREATE_SUCCESS',
      template: 'SoC created successfully! ID: {id}. Redirecting to detail page...',
      type: 'create',
      entity: 'soc'
    },
    SOC_UPDATE_SUCCESS: {
      code: 'SOC_UPDATE_SUCCESS',
      template: 'SoC updated successfully!',
      type: 'update',
      entity: 'soc'
    },

    // Core success
    CORE_CREATE_SUCCESS: {
      code: 'CORE_CREATE_SUCCESS',
      template: 'Core added successfully!',
      type: 'create',
      entity: 'core'
    },
    CORE_UPDATE_SUCCESS: {
      code: 'CORE_UPDATE_SUCCESS',
      template: 'Core updated successfully!',
      type: 'update',
      entity: 'core'
    },
    CORE_DELETE_SUCCESS: {
      code: 'CORE_DELETE_SUCCESS',
      template: 'Core deleted successfully!',
      type: 'delete',
      entity: 'core'
    },

    // Benchmark success
    BENCHMARK_CREATE_SUCCESS: {
      code: 'BENCHMARK_CREATE_SUCCESS',
      template: 'Benchmark created successfully!',
      type: 'create',
      entity: 'benchmark'
    },
    BENCHMARK_UPDATE_SUCCESS: {
      code: 'BENCHMARK_UPDATE_SUCCESS',
      template: 'Benchmark updated successfully!',
      type: 'update',
      entity: 'benchmark'
    },
    BENCHMARK_DELETE_SUCCESS: {
      code: 'BENCHMARK_DELETE_SUCCESS',
      template: 'Benchmark deleted successfully!',
      type: 'delete',
      entity: 'benchmark'
    },

    // Economics success
    ECONOMIC_CREATE_SUCCESS: {
      code: 'ECONOMIC_CREATE_SUCCESS',
      template: 'Economic data created successfully!',
      type: 'create',
      entity: 'economic'
    },
    ECONOMIC_UPDATE_SUCCESS: {
      code: 'ECONOMIC_UPDATE_SUCCESS',
      template: 'Economic data updated successfully!',
      type: 'update',
      entity: 'economic'
    },
    ECONOMIC_DELETE_SUCCESS: {
      code: 'ECONOMIC_DELETE_SUCCESS',
      template: 'Economic data deleted successfully!',
      type: 'delete',
      entity: 'economic'
    },

    // Processor association success
    PROCESSOR_ASSOCIATION_SUCCESS: {
      code: 'PROCESSOR_ASSOCIATION_SUCCESS',
      template: 'Processor {name} associated successfully!',
      type: 'create',
      entity: 'processor'
    },
    PROCESSOR_DISASSOCIATION_SUCCESS: {
      code: 'PROCESSOR_DISASSOCIATION_SUCCESS',
      template: '{type} removed from SoC successfully!',
      type: 'delete',
      entity: 'processor'
    },

    // Suggestion success
    SUGGESTION_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_SUBMIT_SUCCESS',
      template: 'Suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },
    SUGGESTION_CORE_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_CORE_SUBMIT_SUCCESS',
      template: 'Core suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },
    SUGGESTION_CORE_DELETE_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_CORE_DELETE_SUBMIT_SUCCESS',
      template: 'Core deletion suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },
    SUGGESTION_BENCHMARK_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_BENCHMARK_SUBMIT_SUCCESS',
      template: 'Benchmark suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },
    SUGGESTION_BENCHMARK_DELETE_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_BENCHMARK_DELETE_SUBMIT_SUCCESS',
      template: 'Benchmark deletion suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },
    SUGGESTION_ECONOMIC_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_ECONOMIC_SUBMIT_SUCCESS',
      template: 'Economic data suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },
    SUGGESTION_ECONOMIC_DELETE_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_ECONOMIC_DELETE_SUBMIT_SUCCESS',
      template: 'Economic data deletion suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },
    SUGGESTION_PROCESSOR_ASSOCIATION_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_PROCESSOR_ASSOCIATION_SUBMIT_SUCCESS',
      template: 'Processor association suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },
    SUGGESTION_PROCESSOR_DISASSOCIATION_SUBMIT_SUCCESS: {
      code: 'SUGGESTION_PROCESSOR_DISASSOCIATION_SUBMIT_SUCCESS',
      template: 'Processor disassociation suggestion submitted successfully! It will be reviewed by an admin or editor.',
      type: 'create',
      entity: 'suggestion'
    },

    // Registration success
    REGISTRATION_SUCCESS: {
      code: 'REGISTRATION_SUCCESS',
      template: 'Registration successful! Redirecting to login page...',
      type: 'create',
      entity: 'user'
    },

    // Login success (handled via redirect, but included for completeness)
    LOGIN_SUCCESS: {
      code: 'LOGIN_SUCCESS',
      template: 'Login successful!',
      type: 'create',
      entity: 'session'
    },

    // Password update success
    PASSWORD_UPDATE_SUCCESS: {
      code: 'PASSWORD_UPDATE_SUCCESS',
      template: 'Password updated successfully!',
      type: 'update',
      entity: 'user'
    }
  },

  // Validation messages (field-specific)
  VALIDATION: {
    VALIDATION_PASSWORD_MIN_LENGTH: {
      code: 'VALIDATION_PASSWORD_MIN_LENGTH',
      template: 'Password must be at least {min} characters. Please choose a stronger password.',
      type: 'validation',
      field: 'password'
    },
    VALIDATION_EMAIL_FORMAT: {
      code: 'VALIDATION_EMAIL_FORMAT',
      template: 'Please enter a valid email address (e.g., user@example.com).',
      type: 'validation',
      field: 'email'
    },
    VALIDATION_USERNAME_REQUIRED: {
      code: 'VALIDATION_USERNAME_REQUIRED',
      template: 'Username is required.',
      type: 'validation',
      field: 'username'
    },
    VALIDATION_EMAIL_REQUIRED: {
      code: 'VALIDATION_EMAIL_REQUIRED',
      template: 'Email is required.',
      type: 'validation',
      field: 'email'
    },
    VALIDATION_PASSWORD_REQUIRED: {
      code: 'VALIDATION_PASSWORD_REQUIRED',
      template: 'Password is required.',
      type: 'validation',
      field: 'password'
    },
    VALIDATION_CONFIRM_PASSWORD_REQUIRED: {
      code: 'VALIDATION_CONFIRM_PASSWORD_REQUIRED',
      template: 'Password confirmation is required.',
      type: 'validation',
      field: 'confirmPassword'
    }
  }
}

/**
 * Helper function to format message template with dynamic values
 * @param {string} template - Message template with {placeholder} syntax
 * @param {object} values - Object with values to replace placeholders
 * @returns {string} Formatted message
 */
export function formatMessage(template, values = {}) {
  let message = template
  for (const [key, value] of Object.entries(values)) {
    message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return message
}

/**
 * Get message by code
 * @param {string} code - Message code
 * @returns {object|null} Message object or null if not found
 */
export function getMessageByCode(code) {
  for (const category of Object.values(MESSAGES)) {
    for (const message of Object.values(category)) {
      if (message.code === code) {
        return message
      }
    }
  }
  return null
}
