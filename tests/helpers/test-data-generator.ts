// Frontend test data generator
export const generateCpuTestData = (scenario: string) => {
  const baseData = {
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
  };

  switch (scenario) {
    case 'validData':
      return baseData;
    case 'missingRequiredFields':
      return { manufacturer: '', family: '', model: '' };
    case 'invalidData':
      return { ...baseData, year: 'invalid', clock: 'not-a-number' };
    case 'extremeValues':
      return { ...baseData, clock: '999999', maxClock: '999999', tdp: '999999' };
    case 'specialCharacters':
      return { ...baseData, model: 'i7-12700K@#$%', codeName: 'Alder Lake<>' };
    case 'emptyOptionalFields':
      return { ...baseData, codeName: '', microarchitecture: '' };
    default:
      return baseData;
  }
};

export const generateGpuTestData = (scenario: string) => {
  const baseData = {
    manufacturer: 'NVIDIA',
    family: 'GeForce RTX',
    model: 'RTX 4070',
    year: '2023',
    memory: '12',
    memoryType: 'GDDR6X',
    memoryBus: '192',
    baseClock: '1920',
    boostClock: '2475'
  };

  switch (scenario) {
    case 'validData':
      return baseData;
    case 'missingRequiredFields':
      return { manufacturer: '', family: '', model: '' };
    case 'invalidData':
      return { ...baseData, year: 'invalid', memory: 'not-a-number' };
    case 'extremeValues':
      return { ...baseData, baseClock: '999999', boostClock: '999999' };
    case 'specialCharacters':
      return { ...baseData, model: 'RTX 4070@#$%' };
    case 'emptyOptionalFields':
      return { ...baseData, memoryType: '' };
    default:
      return baseData;
  }
};

export const generateFpgaTestData = (scenario: string) => {
  const baseData = {
    manufacturer: 'Xilinx',
    family: 'Artix',
    model: 'A7-100T',
    year: '2023',
    logicElements: '101440',
    memoryBits: '4608000',
    dspSlices: '240'
  };

  switch (scenario) {
    case 'validData':
      return baseData;
    case 'missingRequiredFields':
      return { manufacturer: '', family: '', model: '' };
    case 'invalidData':
      return { ...baseData, year: 'invalid', logicElements: 'not-a-number' };
    case 'extremeValues':
      return { ...baseData, logicElements: '999999999' };
    case 'specialCharacters':
      return { ...baseData, model: 'A7-100T@#$%' };
    case 'emptyOptionalFields':
      return { ...baseData, dspSlices: '' };
    default:
      return baseData;
  }
};

export const getAllTestScenarios = () => [
  'validData',
  'missingRequiredFields', 
  'invalidData',
  'extremeValues',
  'specialCharacters',
  'emptyOptionalFields'
];
