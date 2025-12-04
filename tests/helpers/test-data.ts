// Test data management for ProcessorDB website tests

export interface TestCpuData {
  manufacturer: string;
  family: string;
  codeName: string;
  microarchitecture: string;
  model: string;
  year: string;
  clock: string;
  maxClock: string;
  threadsPerCore: string;
  lithography: string;
  tdp: string;
  platform: string;
}

export interface TestGpuData {
  manufacturer: string;
  family: string;
  model: string;
  year: string;
  memory: string;
  memoryType: string;
  memoryBus: string;
  baseClock: string;
  boostClock: string;
}

export interface TestFpgaData {
  manufacturer: string;
  family: string;
  model: string;
  year: string;
  logicElements: string;
  memoryBits: string;
  dspSlices: string;
}

export interface TestUserData {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

// CPU Test Data
export const testCpuData = {
  valid: {
    manufacturer: 'Intel',
    family: 'Core i7',
    codeName: 'Alder Lake',
    microarchitecture: 'Golden Cove + Gracemont',
    model: 'i7-12700K',
    year: '2021',
    clock: '3200',
    maxClock: '5000',
    threadsPerCore: '2',
    lithography: '10',
    tdp: '125',
    platform: 'Desktop'
  } as TestCpuData,

  validAlternative: {
    manufacturer: 'AMD',
    family: 'Ryzen 7',
    codeName: 'Vermeer',
    microarchitecture: 'Zen 3',
    model: '5800X',
    year: '2020',
    clock: '3800',
    maxClock: '4700',
    threadsPerCore: '2',
    lithography: '7',
    tdp: '105',
    platform: 'Desktop'
  } as TestCpuData,

  invalid: {
    manufacturer: '',
    family: 'Core i7',
    codeName: 'Alder Lake',
    microarchitecture: 'Golden Cove + Gracemont',
    model: 'i7-12700K',
    year: '2021',
    clock: '3200',
    maxClock: '5000',
    threadsPerCore: '2',
    lithography: '10',
    tdp: '125',
    platform: 'Desktop'
  } as TestCpuData,

  invalidNumeric: {
    manufacturer: 'Intel',
    family: 'Core i7',
    codeName: 'Alder Lake',
    microarchitecture: 'Golden Cove + Gracemont',
    model: 'i7-12700K',
    year: '2021',
    clock: 'not-a-number',
    maxClock: 'invalid',
    threadsPerCore: '2',
    lithography: '10',
    tdp: '125',
    platform: 'Desktop'
  } as TestCpuData,

  edgeCases: {
    manufacturer: 'A'.repeat(100), // Very long string
    family: 'Core i7',
    codeName: 'Alder Lake',
    microarchitecture: 'Golden Cove + Gracemont',
    model: 'i7-12700K',
    year: '2021',
    clock: '3200',
    maxClock: '5000',
    threadsPerCore: '2',
    lithography: '10',
    tdp: '125',
    platform: 'Desktop'
  } as TestCpuData,

  minimal: {
    manufacturer: 'Intel',
    family: 'Core i7',
    codeName: '',
    microarchitecture: '',
    model: 'i7-12700K',
    year: '2021',
    clock: '3200',
    maxClock: '5000',
    threadsPerCore: '2',
    lithography: '10',
    tdp: '125',
    platform: 'Desktop'
  } as TestCpuData
};

// GPU Test Data
export const testGpuData = {
  valid: {
    manufacturer: 'NVIDIA',
    family: 'GeForce RTX',
    model: 'RTX 4070',
    year: '2023',
    memory: '12',
    memoryType: 'GDDR6X',
    memoryBus: '192',
    baseClock: '1920',
    boostClock: '2475'
  } as TestGpuData,

  validAlternative: {
    manufacturer: 'AMD',
    family: 'Radeon RX',
    model: 'RX 7800 XT',
    year: '2023',
    memory: '16',
    memoryType: 'GDDR6',
    memoryBus: '256',
    baseClock: '1800',
    boostClock: '2430'
  } as TestGpuData,

  invalid: {
    manufacturer: '',
    family: 'GeForce RTX',
    model: 'RTX 4070',
    year: '2023',
    memory: '12',
    memoryType: 'GDDR6X',
    memoryBus: '192',
    baseClock: '1920',
    boostClock: '2475'
  } as TestGpuData,

  invalidNumeric: {
    manufacturer: 'NVIDIA',
    family: 'GeForce RTX',
    model: 'RTX 4070',
    year: '2023',
    memory: 'not-a-number',
    memoryType: 'GDDR6X',
    memoryBus: 'invalid',
    baseClock: 'invalid',
    boostClock: 'invalid'
  } as TestGpuData,

  edgeCases: {
    manufacturer: 'NVIDIA',
    family: 'GeForce RTX',
    model: 'RTX 4070',
    year: '2023',
    memory: '12',
    memoryType: 'GDDR6X',
    memoryBus: '192',
    baseClock: '1920',
    boostClock: '2475'
  } as TestGpuData,

  minimal: {
    manufacturer: 'NVIDIA',
    family: 'GeForce RTX',
    model: 'RTX 4070',
    year: '2023',
    memory: '12',
    memoryType: 'GDDR6X',
    memoryBus: '192',
    baseClock: '1920',
    boostClock: '2475'
  } as TestGpuData
};

// FPGA Test Data
export const testFpgaData = {
  valid: {
    manufacturer: 'Xilinx',
    family: 'Artix',
    model: 'A7-100T',
    year: '2023',
    logicElements: '101440',
    memoryBits: '4608000',
    dspSlices: '240'
  } as TestFpgaData,

  validAlternative: {
    manufacturer: 'Intel',
    family: 'Cyclone',
    model: '10CL025',
    year: '2022',
    logicElements: '25000',
    memoryBits: '608256',
    dspSlices: '56'
  } as TestFpgaData,

  invalid: {
    manufacturer: '',
    family: 'Artix',
    model: 'A7-100T',
    year: '2023',
    logicElements: '101440',
    memoryBits: '4608000',
    dspSlices: '240'
  } as TestFpgaData,

  invalidNumeric: {
    manufacturer: 'Xilinx',
    family: 'Artix',
    model: 'A7-100T',
    year: '2023',
    logicElements: 'not-a-number',
    memoryBits: 'invalid',
    dspSlices: 'invalid'
  } as TestFpgaData,

  edgeCases: {
    manufacturer: 'Xilinx',
    family: 'Artix',
    model: 'A7-100T',
    year: '2023',
    logicElements: '101440',
    memoryBits: '4608000',
    dspSlices: '240'
  } as TestFpgaData,

  minimal: {
    manufacturer: 'Xilinx',
    family: 'Artix',
    model: 'A7-100T',
    year: '2023',
    logicElements: '101440',
    memoryBits: '4608000',
    dspSlices: '240'
  } as TestFpgaData
};

// User Test Data
export const testUserData = {
  admin: {
    email: 'admin@test.com',
    password: 'password',
    role: 'admin' as const
  } as TestUserData,

  user: {
    email: 'user@test.com',
    password: 'password',
    role: 'user' as const
  } as TestUserData,

  invalid: {
    email: 'invalid-email',
    password: '',
    role: 'user' as const
  } as TestUserData
};

// Test data generators
export class TestDataGenerator {
  static generateCpuData(overrides: Partial<TestCpuData> = {}): TestCpuData {
    return {
      ...testCpuData.valid,
      ...overrides
    };
  }

  static generateGpuData(overrides: Partial<TestGpuData> = {}): TestGpuData {
    return {
      ...testGpuData.valid,
      ...overrides
    };
  }

  static generateFpgaData(overrides: Partial<TestFpgaData> = {}): TestFpgaData {
    return {
      ...testFpgaData.valid,
      ...overrides
    };
  }

  static generateUserData(overrides: Partial<TestUserData> = {}): TestUserData {
    return {
      ...testUserData.admin,
      ...overrides
    };
  }

  static generateRandomCpuData(): TestCpuData {
    const manufacturers = ['Intel', 'AMD', 'ARM', 'Qualcomm'];
    const families = ['Core i7', 'Ryzen 7', 'Cortex-A78', 'Snapdragon'];
    const models = ['i7-12700K', '5800X', 'A78', '8cx'];
    
    return {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      family: families[Math.floor(Math.random() * families.length)],
      codeName: 'Test Code Name',
      microarchitecture: 'Test Architecture',
      model: models[Math.floor(Math.random() * models.length)],
      year: (2020 + Math.floor(Math.random() * 4)).toString(),
      clock: (2000 + Math.floor(Math.random() * 2000)).toString(),
      maxClock: (3000 + Math.floor(Math.random() * 2000)).toString(),
      threadsPerCore: '2',
      lithography: (7 + Math.floor(Math.random() * 5)).toString(),
      tdp: (50 + Math.floor(Math.random() * 150)).toString(),
      platform: 'Desktop'
    };
  }

  static generateRandomGpuData(): TestGpuData {
    const manufacturers = ['NVIDIA', 'AMD', 'Intel'];
    const families = ['GeForce RTX', 'Radeon RX', 'Arc'];
    const models = ['RTX 4070', 'RX 7800 XT', 'A770'];
    
    return {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      family: families[Math.floor(Math.random() * families.length)],
      model: models[Math.floor(Math.random() * models.length)],
      year: (2020 + Math.floor(Math.random() * 4)).toString(),
      memory: (4 + Math.floor(Math.random() * 20)).toString(),
      memoryType: 'GDDR6X',
      memoryBus: (128 + Math.floor(Math.random() * 128)).toString(),
      baseClock: (1000 + Math.floor(Math.random() * 1000)).toString(),
      boostClock: (1500 + Math.floor(Math.random() * 1000)).toString()
    };
  }

  static generateRandomFpgaData(): TestFpgaData {
    const manufacturers = ['Xilinx', 'Intel', 'Lattice'];
    const families = ['Artix', 'Cyclone', 'ECP5'];
    const models = ['A7-100T', '10CL025', 'LFE5U-25F'];
    
    return {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      family: families[Math.floor(Math.random() * families.length)],
      model: models[Math.floor(Math.random() * models.length)],
      year: (2020 + Math.floor(Math.random() * 4)).toString(),
      logicElements: (10000 + Math.floor(Math.random() * 100000)).toString(),
      memoryBits: (1000000 + Math.floor(Math.random() * 5000000)).toString(),
      dspSlices: (50 + Math.floor(Math.random() * 200)).toString()
    };
  }
}

// Test data validation helpers
export class TestDataValidator {
  static validateCpuData(data: TestCpuData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.manufacturer) errors.push('Manufacturer is required');
    if (!data.family) errors.push('Family is required');
    if (!data.model) errors.push('Model is required');
    if (!data.year) errors.push('Year is required');
    if (!data.clock || isNaN(Number(data.clock))) errors.push('Clock must be a valid number');
    if (!data.maxClock || isNaN(Number(data.maxClock))) errors.push('Max clock must be a valid number');
    if (!data.threadsPerCore || isNaN(Number(data.threadsPerCore))) errors.push('Threads per core must be a valid number');
    if (!data.lithography || isNaN(Number(data.lithography))) errors.push('Lithography must be a valid number');
    if (!data.tdp || isNaN(Number(data.tdp))) errors.push('TDP must be a valid number');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateGpuData(data: TestGpuData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.manufacturer) errors.push('Manufacturer is required');
    if (!data.family) errors.push('Family is required');
    if (!data.model) errors.push('Model is required');
    if (!data.year) errors.push('Year is required');
    if (!data.memory || isNaN(Number(data.memory))) errors.push('Memory must be a valid number');
    if (!data.memoryType) errors.push('Memory type is required');
    if (!data.memoryBus || isNaN(Number(data.memoryBus))) errors.push('Memory bus must be a valid number');
    if (!data.baseClock || isNaN(Number(data.baseClock))) errors.push('Base clock must be a valid number');
    if (!data.boostClock || isNaN(Number(data.boostClock))) errors.push('Boost clock must be a valid number');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateFpgaData(data: TestFpgaData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.manufacturer) errors.push('Manufacturer is required');
    if (!data.family) errors.push('Family is required');
    if (!data.model) errors.push('Model is required');
    if (!data.year) errors.push('Year is required');
    if (!data.logicElements || isNaN(Number(data.logicElements))) errors.push('Logic elements must be a valid number');
    if (!data.memoryBits || isNaN(Number(data.memoryBits))) errors.push('Memory bits must be a valid number');
    if (!data.dspSlices || isNaN(Number(data.dspSlices))) errors.push('DSP slices must be a valid number');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Test data cleanup helpers
export class TestDataCleanup {
  static async cleanupCpuData(page: any, cpuId: string): Promise<void> {
    try {
      await page.request.delete(`/api/cpus/${cpuId}`);
    } catch (error) {
      console.log(`Failed to cleanup CPU ${cpuId}:`, error);
    }
  }

  static async cleanupGpuData(page: any, gpuId: string): Promise<void> {
    try {
      await page.request.delete(`/api/gpus/${gpuId}`);
    } catch (error) {
      console.log(`Failed to cleanup GPU ${gpuId}:`, error);
    }
  }

  static async cleanupFpgaData(page: any, fpgaId: string): Promise<void> {
    try {
      await page.request.delete(`/api/fpgas/${fpgaId}`);
    } catch (error) {
      console.log(`Failed to cleanup FPGA ${fpgaId}:`, error);
    }
  }

  static async cleanupAllTestData(page: any, createdIds: Array<{ type: string; id: string }>): Promise<void> {
    for (const item of createdIds) {
      try {
        if (item.type === 'cpu') {
          await this.cleanupCpuData(page, item.id);
        } else if (item.type === 'gpu') {
          await this.cleanupGpuData(page, item.id);
        } else if (item.type === 'fpga') {
          await this.cleanupFpgaData(page, item.id);
        }
      } catch (error) {
        console.log(`Failed to cleanup ${item.type} ${item.id}:`, error);
      }
    }
  }
}
