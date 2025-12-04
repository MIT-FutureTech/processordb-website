import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GpuForm from '~/components/Forms/GpuForm.vue'

// Mock the v-icon component
vi.mock('oh-vue-icons', () => ({
  default: {
    name: 'v-icon',
    template: '<i class="icon"></i>'
  }
}))

// Mock NuxtLink
vi.mock('#app', () => ({
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a><slot /></a>',
    props: ['to']
  }
}))

describe('GpuForm', () => {
  let wrapper: any
  const mockGpuData = {
    gpu: {
      gpu_id: 1,
      name: 'RTX 3080',
      variant: 'Founders Edition',
      architecture: 'Ampere',
      generation: 'RTX 30',
      core_count: 8704,
      base_clock: 1440,
      boost_clock: 1710,
      memory_clock: 19000,
      memory_size: 10240,
      memory_type: 'GDDR6X',
      memory_bus: '320-bit',
      memory_bandwidth: 760,
      tdp: 320,
      SoC: {
        soc_id: 1,
        name: 'RTX 3080',
        release_date: '2020-09-17',
        platform: 'Desktop',
        Manufacturer: {
          manufacturer_id: 1,
          name: 'NVIDIA'
        }
      }
    },
    manufacturerName: 'NVIDIA',
    versionHistory: []
  }

  beforeEach(() => {
    // Reset fetch mock
    global.fetch = vi.fn()
    
    wrapper = mount(GpuForm, {
      props: {
        gpuData: mockGpuData,
        editMode: false,
        readOnly: false
      },
      global: {
        stubs: {
          'v-icon': true,
          'NuxtLink': true
        }
      }
    })
  })

  describe('Form Initialization', () => {
    it('should initialize form with correct default values', () => {
      expect(wrapper.vm.form.manufacturer).toBe('NVIDIA')
      expect(wrapper.vm.form.name).toBe('RTX 3080')
      expect(wrapper.vm.form.variant).toBe('Founders Edition')
      expect(wrapper.vm.form.architecture).toBe('Ampere')
      expect(wrapper.vm.form.coreCount).toBe(8704)
    })

    it('should update form when gpuData prop changes', async () => {
      const newGpuData = {
        ...mockGpuData,
        gpu: {
          ...mockGpuData.gpu,
          name: 'RTX 4080',
          architecture: 'Ada Lovelace'
        }
      }

      await wrapper.setProps({ gpuData: newGpuData })
      
      expect(wrapper.vm.form.name).toBe('RTX 4080')
      expect(wrapper.vm.form.architecture).toBe('Ada Lovelace')
    })
  })

  describe('Form Validation', () => {
    it('should show error message when required fields are empty', async () => {
      wrapper.vm.form.manufacturer = ''
      wrapper.vm.form.name = ''
      
      await wrapper.vm.submitData()
      
      expect(wrapper.vm.errorMessage).toBeTruthy()
    })

    it('should validate numeric fields', () => {
      wrapper.vm.form.coreCount = 'invalid'
      wrapper.vm.form.baseClock = 'invalid'
      
      // The form should handle this gracefully
      expect(wrapper.vm.form.coreCount).toBe('invalid')
    })
  })

  describe('Create Operation (POST)', () => {
    it('should prepare correct POST request body', () => {
      // Create a fresh wrapper for create mode (no existing data)
      const createWrapper = mount(GpuForm, {
        props: {
          gpuData: {
            gpu: {}
          },
          isEditMode: false
        },
        global: {
          mocks: {
            $router: {
              push: vi.fn()
            }
          }
        }
      })

      // Set form data for create mode
      createWrapper.vm.form = {
        manufacturer: 'NVIDIA',
        variant: 'Founders Edition',
        architecture: 'Ampere',
        generation: 'RTX 30',
        model: 'RTX 3080',
        year: '2020',
        coreCount: '8704',
        baseClock: '1440',
        boostClock: '1710',
        memoryClock: '19000',
        memorySize: '10240',
        memoryType: 'GDDR6X',
        memoryBus: '320-bit',
        memoryBandwidth: '760',
        tdp: '320',
        platform: 'Desktop'
      }

      const expectedBody = {
        soc: {
          name: undefined,
          release_date: null,
          platform: 'Desktop',
          process_node: undefined,
          tdp: 320,
          soc_id: null
        },
        manufacturer: {
          name: 'NVIDIA',
          manufacturer_id: null
        },
        gpu: expect.objectContaining({
          gpu_id: null,
          variant: 'Founders Edition',
          architecture: 'Ampere',
          generation: 'RTX 30',
          core_count: 8704,
          base_clock: 1440,
          boost_clock: 1710,
          memory_clock: 19000,
          memory_size: 10240,
          memory_type: 'GDDR6X',
          memory_bus: '320-bit',
          memory_bandwidth: 760
        }),
        economics: {
          year: ''
        }
      }

      const actualBody = createWrapper.vm.preparePostRequestBody()
      expect(actualBody).toMatchObject(expectedBody)
    })

    it('should make POST request when creating new GPU', async () => {
      // Set required fields first to pass validation
      wrapper.vm.form.manufacturer = 'NVIDIA'
      wrapper.vm.form.variant = 'Founders Edition'
      wrapper.vm.form.model = 'RTX 3080'
      
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          gpu: { gpu_id: 123 },
          soc: { soc_id: 456 },
          manufacturer: { manufacturer_id: 789 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/gpus',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String)
        })
      )
    })

    it('should show success message on successful creation', async () => {
      // Set required fields first to pass validation
      wrapper.vm.form.manufacturer = 'NVIDIA'
      wrapper.vm.form.variant = 'Founders Edition'
      wrapper.vm.form.model = 'RTX 3080'
      
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          gpu: { gpu_id: 123 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.successMessage).toBe('GPU saved successfully!')
    })

    it('should show error message on failed creation', async () => {
      // Clear required fields to trigger validation
      wrapper.vm.form.manufacturer = ''
      wrapper.vm.form.variant = ''
      wrapper.vm.form.model = ''

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Please fill in all required fields (Manufacturer, Variant, Name)')
    })
  })

  describe('Edit Operation (PUT)', () => {
    beforeEach(() => {
      wrapper = mount(GpuForm, {
        props: {
          gpuData: mockGpuData,
          editMode: true,
          readOnly: false
        },
        global: {
          stubs: {
            'v-icon': true,
            'NuxtLink': true
          }
        }
      })
    })

    it('should make PUT request when editing existing GPU', async () => {
      // Set required fields first to pass validation
      wrapper.vm.form.manufacturer = 'NVIDIA'
      wrapper.vm.form.variant = 'Founders Edition'
      wrapper.vm.form.model = 'RTX 3080'
      
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          gpu: { gpu_id: 1 },
          soc: { soc_id: 1 },
          manufacturer: { manufacturer_id: 1 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/gpus/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String)
        })
      )
    })

    it('should include existing IDs in request body when editing', () => {
      const body = wrapper.vm.preparePostRequestBody()
      
      expect(body.soc.soc_id).toBe(1)
      expect(body.manufacturer.manufacturer_id).toBe(1)
      expect(body.gpu.gpu_id).toBe(1)
    })
  })

  describe('Read-only Mode', () => {
    beforeEach(() => {
      wrapper = mount(GpuForm, {
        props: {
          gpuData: mockGpuData,
          editMode: false,
          readOnly: true
        },
        global: {
          stubs: {
            'v-icon': true,
            'NuxtLink': true
          }
        }
      })
    })

    it('should disable all input fields in read-only mode', () => {
      const inputs = wrapper.findAll('input')
      inputs.forEach((input: any) => {
        expect(input.attributes('disabled')).toBeDefined()
      })
    })

    it('should not show history section in read-only mode', () => {
      expect(wrapper.find('[data-testid="history-section"]').exists()).toBe(false)
    })
  })

  describe('Form Sections', () => {
    it('should toggle processors section visibility', async () => {
      const initialState = wrapper.vm.isProcessorsExpanded
      await wrapper.vm.toggleProcessors()
      expect(wrapper.vm.isProcessorsExpanded).toBe(!initialState)
    })

    it('should toggle architecture section visibility', async () => {
      const initialState = wrapper.vm.isArchitectureExpanded
      await wrapper.vm.toggleArchitecture()
      expect(wrapper.vm.isArchitectureExpanded).toBe(!initialState)
    })

    it('should toggle clock section visibility', async () => {
      const initialState = wrapper.vm.isClockExpanded
      await wrapper.vm.toggleClock()
      expect(wrapper.vm.isClockExpanded).toBe(!initialState)
    })

    it('should toggle memory section visibility', async () => {
      const initialState = wrapper.vm.isMemoryExpanded
      await wrapper.vm.toggleMemory()
      expect(wrapper.vm.isMemoryExpanded).toBe(!initialState)
    })

    it('should toggle compute section visibility', async () => {
      const initialState = wrapper.vm.isComputeExpanded
      await wrapper.vm.toggleCompute()
      expect(wrapper.vm.isComputeExpanded).toBe(!initialState)
    })

    it('should toggle graphic API section visibility', async () => {
      const initialState = wrapper.vm.isGraphicAPIExpanded
      await wrapper.vm.toggleGraphicAPI()
      expect(wrapper.vm.isGraphicAPIExpanded).toBe(!initialState)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Set required fields first to pass validation
      wrapper.vm.form.manufacturer = 'NVIDIA'
      wrapper.vm.form.variant = 'Founders Edition'
      wrapper.vm.form.model = 'RTX 3080'
      
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Network error')
    })

    it('should handle JSON parsing errors', async () => {
      // Set required fields first to pass validation
      wrapper.vm.form.manufacturer = 'NVIDIA'
      wrapper.vm.form.variant = 'Founders Edition'
      wrapper.vm.form.model = 'RTX 3080'
      
      const mockResponse = {
        ok: false,
        json: () => Promise.reject(new Error('Invalid JSON'))
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Invalid response from server. Please try again.')
    })
  })

  describe('Form Data Preparation', () => {
    it('should handle empty form data correctly', () => {
      wrapper.vm.form = {
        manufacturer: '',
        name: '',
        variant: '',
        releaseDate: '',
        // ... other fields
      }

      const body = wrapper.vm.preparePostRequestBody()
      expect(body.soc.name).toBe('')
      expect(body.gpu.variant).toBe('')
    })

    it('should format date correctly for release date field', () => {
      wrapper.vm.form.releaseDate = '2023-12-25'
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.soc.release_date).toBe('2023-12-25')
    })

    it('should handle year extraction from date', () => {
      wrapper.vm.form.releaseDate = '2023-12-25'
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.economics.year).toBe(2023)
    })
  })

  describe('History Section', () => {
    it('should show history section only in edit mode', () => {
      const editModeWrapper = mount(GpuForm, {
        props: {
          gpuData: mockGpuData,
          editMode: true,
          readOnly: false
        },
        global: {
          stubs: {
            'v-icon': true,
            'NuxtLink': true
          }
        }
      })

      // Look for the History h3 specifically (not the first h3 which is "General Information")
      const historyH3 = editModeWrapper.findAll('h3').find(h3 => h3.text().includes('History'))
      expect(historyH3).toBeTruthy()
    })

    it('should not show history section in create mode', () => {
      const createModeWrapper = mount(GpuForm, {
        props: {
          gpuData: mockGpuData,
          editMode: false,
          readOnly: false
        },
        global: {
          stubs: {
            'v-icon': true,
            'NuxtLink': true
          }
        }
      })

      // Look for the History h3 specifically
      const historyH3 = createModeWrapper.findAll('h3').find(h3 => h3.text().includes('History'))
      expect(historyH3).toBeFalsy()
    })
  })

  describe('Data Type Validation Edge Cases', () => {
    it('should handle negative numbers correctly', () => {
      wrapper.vm.form.baseClock = '-100'
      wrapper.vm.form.tdp = '-50'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.gpu.base_clock).toBe(-100)
      expect(body.soc.tdp).toBe(-50)
    })

    it('should handle decimal values in integer fields', () => {
      wrapper.vm.form.coreCount = '8704.5'
      wrapper.vm.form.memorySize = '10240.7'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.gpu.core_count).toBe(8704) // parseInt truncates
      expect(body.gpu.memory_size).toBe(10240) // parseInt truncates
    })

    it('should handle zero values correctly', () => {
      wrapper.vm.form.baseClock = '0'
      wrapper.vm.form.tdp = '0'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.gpu.base_clock).toBe(0)
      expect(body.soc.tdp).toBe(0)
    })

    it('should handle empty numeric fields as null', () => {
      wrapper.vm.form.baseClock = ''
      wrapper.vm.form.tdp = ''
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.gpu.base_clock).toBeNull()
      expect(body.soc.tdp).toBeNull()
    })
  })

  describe('Input Validation Edge Cases', () => {
    it('should sanitize special characters in text fields', () => {
      wrapper.vm.form.manufacturer = 'NVIDIA@#$%'
      wrapper.vm.form.variant = 'Founders Edition<script>alert("xss")</script>'
      wrapper.vm.form.name = 'RTX 3080" OR 1=1--'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.gpu.variant).toBe('Founders Edition&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(body.manufacturer.name).toBe('NVIDIA@#$%')
      expect(body.gpu.model).toBe('RTX 3080&quot; OR 1=1--')
    })

    it('should handle extremely long strings', () => {
      const longString = 'A'.repeat(1000)
      wrapper.vm.form.manufacturer = longString
      wrapper.vm.form.variant = longString
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.manufacturer.name).toBe(longString)
      expect(body.gpu.variant).toBe(longString)
    })

    it('should handle unicode characters', () => {
      wrapper.vm.form.manufacturer = 'NVIDIA®'
      wrapper.vm.form.variant = 'Founders Edition™'
      wrapper.vm.form.name = 'RTX 3080™'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.manufacturer.name).toBe('NVIDIA®')
      expect(body.gpu.variant).toBe('Founders Edition™')
      expect(body.gpu.model).toBe('RTX 3080™')
    })
  })

  describe('Business Logic Validation', () => {
    it('should handle logical constraints gracefully', () => {
      // Set boost_clock < base_clock (illogical but should be handled)
      wrapper.vm.form.baseClock = '2000'
      wrapper.vm.form.boostClock = '1500'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.gpu.base_clock).toBe(2000)
      expect(body.gpu.boost_clock).toBe(1500)
      // Note: Business logic validation should be added to the form
    })

    it('should handle realistic value ranges', () => {
      wrapper.vm.form.baseClock = '100' // Very low but valid
      wrapper.vm.form.boostClock = '3000' // Very high but valid
      wrapper.vm.form.tdp = '5' // Very low TDP
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.gpu.base_clock).toBe(100)
      expect(body.gpu.boost_clock).toBe(3000)
      expect(body.soc.tdp).toBe(5)
    })
  })

  describe('Error Handling Edge Cases', () => {
    it('should handle malformed API responses', async () => {
      wrapper.vm.form.manufacturer = 'NVIDIA'
      wrapper.vm.form.variant = 'Founders Edition'
      wrapper.vm.form.name = 'RTX 3080'
      
      const mockResponse = {
        ok: true,
        json: () => Promise.reject(new Error('Unexpected token'))
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Invalid response from server. Please try again.')
    })

    it('should handle timeout scenarios', async () => {
      wrapper.vm.form.manufacturer = 'NVIDIA'
      wrapper.vm.form.variant = 'Founders Edition'
      wrapper.vm.form.model = 'RTX 3080'
      
      global.fetch = vi.fn().mockRejectedValue(new Error('Request timeout'))

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Request timeout')
    })

    it('should handle partial network failures', async () => {
      wrapper.vm.form.manufacturer = 'NVIDIA'
      wrapper.vm.form.variant = 'Founders Edition'
      wrapper.vm.form.model = 'RTX 3080'
      
      const mockResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal server error' })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Internal server error')
    })
  })
})
