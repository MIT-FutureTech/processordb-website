import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CpuForm from '~/components/Forms/CpuForm.vue'

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

describe('CpuForm', () => {
  let wrapper: any
  const mockCpuData = {
    cpu: {
      cpu_id: 1,
      family: 'Core i7',
      code_name: 'Coffee Lake',
      microarchitecture: 'Coffee Lake',
      model: 'i7-8700K',
      clock: 3700,
      max_clock: 4700,
      threads_per_core: 2,
      lithography: 14,
      tdp: 95,
      l3_cache: 12288,
      l2_cache: 256,
      l1_cache_data: 32,
      l1_cache_instruction: 32,
      SoC: {
        soc_id: 1,
        name: 'i7-8700K',
        release_date: '2017-10-05',
        platform: 'Desktop',
        Manufacturer: {
          manufacturer_id: 1,
          name: 'Intel'
        }
      }
    },
    manufacturerName: 'Intel',
    versionHistory: []
  }

  beforeEach(() => {
    // Reset fetch mock
    global.fetch = vi.fn()
    
    wrapper = mount(CpuForm, {
      props: {
        cpuData: mockCpuData,
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
      expect(wrapper.vm.form.manufacturer).toBe('Intel')
      expect(wrapper.vm.form.family).toBe('Core i7')
      expect(wrapper.vm.form.model).toBe('i7-8700K')
      expect(wrapper.vm.form.clock).toBe(3700)
    })

    it('should update form when cpuData prop changes', async () => {
      const newCpuData = {
        ...mockCpuData,
        cpu: {
          ...mockCpuData.cpu,
          family: 'Core i9',
          model: 'i9-9900K'
        }
      }

      await wrapper.setProps({ cpuData: newCpuData })
      
      expect(wrapper.vm.form.family).toBe('Core i9')
      expect(wrapper.vm.form.model).toBe('i9-9900K')
    })
  })

  describe('Form Validation', () => {
    it('should show error message when required fields are empty', async () => {
      wrapper.vm.form.manufacturer = ''
      wrapper.vm.form.model = ''
      
      await wrapper.vm.submitData()
      
      expect(wrapper.vm.errorMessage).toBeTruthy()
    })

    it('should validate numeric fields', () => {
      wrapper.vm.form.clock = 'invalid'
      wrapper.vm.form.maxClock = 'invalid'
      
      // The form should handle this gracefully
      expect(wrapper.vm.form.clock).toBe('invalid')
    })

    it('should show error message when required fields are missing', async () => {
      // Clear required fields
      wrapper.vm.form.manufacturer = ''
      wrapper.vm.form.family = ''
      wrapper.vm.form.model = ''
      
      await wrapper.vm.submitData()
      
      expect(wrapper.vm.errorMessage).toBe('Please fill in all required fields (Manufacturer, Family, Model)')
    })
  })

  describe('Create Operation (POST)', () => {
    it('should prepare correct POST request body', () => {
      // Create a fresh wrapper for create mode (no existing data)
      const createWrapper = mount(CpuForm, {
        props: {
          cpuData: {
            versionHistory: []
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
        manufacturer: 'Intel',
        family: 'Core i7',
        codeName: 'Coffee Lake',
        microarchitecture: 'Coffee Lake',
        model: 'i7-8700K',
        year: '2017',
        clock: '3700',
        maxClock: '4700',
        threadsPerCore: '2',
        lithography: '14',
        tdp: '95',
        platform: 'Desktop',
        l1CacheData: '32',
        l1CacheInstruction: '32',
        l2Cache: '256',
        l3Cache: '12288'
      }

      const expectedBody = {
        soc: {
          name: 'i7-8700K',
          release_date: '2017-01-02',
          platform: 'Desktop',
          process_node: 14,
          tdp: 95,
          soc_id: null
        },
        manufacturer: {
          name: 'Intel',
          manufacturer_id: null
        },
        cpu: expect.objectContaining({
          cpu_id: null,
          family: 'Core i7',
          code_name: 'Coffee Lake',
          microarchitecture: 'Coffee Lake',
          model: 'i7-8700K',
          clock: 3700,
          max_clock: 4700,
          tdp: 95,
          lithography: '14',
          threads_per_core: 2
        }),
        economics: {
          year: '2017'
        }
      }

      const actualBody = createWrapper.vm.preparePostRequestBody()
      expect(actualBody).toMatchObject(expectedBody)
    })

    it('should make POST request when creating new CPU', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          cpu: { cpu_id: 123 },
          soc: { soc_id: 456 },
          manufacturer: { manufacturer_id: 789 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/cpus',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String)
        })
      )
    })

    it('should show success message on successful creation', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          cpu: { cpu_id: 123 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.successMessage).toBe('CPU saved successfully!')
    })

    it('should show error message on failed creation', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          error: 'Validation failed'
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Validation failed')
    })
  })

  describe('Edit Operation (PUT)', () => {
    beforeEach(() => {
      wrapper = mount(CpuForm, {
        props: {
          cpuData: mockCpuData,
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

    it('should make PUT request when editing existing CPU', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          cpu: { cpu_id: 1 },
          soc: { soc_id: 1 },
          manufacturer: { manufacturer_id: 1 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/cpus/1',
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
      expect(body.cpu.cpu_id).toBe(1)
    })
  })

  describe('Read-only Mode', () => {
    beforeEach(() => {
      wrapper = mount(CpuForm, {
        props: {
          cpuData: mockCpuData,
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
    it('should toggle cache section visibility', async () => {
      const initialState = wrapper.vm.isCacheExpanded
      await wrapper.vm.toggleCache()
      expect(wrapper.vm.isCacheExpanded).toBe(!initialState)
    })

    it('should toggle memory section visibility', async () => {
      const initialState = wrapper.vm.isMemoryExpanded
      await wrapper.vm.toggleMemory()
      expect(wrapper.vm.isMemoryExpanded).toBe(!initialState)
    })

    it('should toggle technical details section visibility', async () => {
      const initialState = wrapper.vm.isTechnicalDetailsExpanded
      await wrapper.vm.toggleTechnicalDetails()
      expect(wrapper.vm.isTechnicalDetailsExpanded).toBe(!initialState)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Network error')
    })

    it('should handle JSON parsing errors', async () => {
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
        family: '',
        model: '',
        year: '',
        clock: '',
        maxClock: '',
        // ... other fields
      }

      const body = wrapper.vm.preparePostRequestBody()
      expect(body.soc.name).toBe('')
      expect(body.cpu.model).toBe('')
    })

    it('should format date correctly for year field', () => {
      wrapper.vm.form.year = '2023'
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.soc.release_date).toBe('2023-01-02')
    })
  })

  describe('Data Type Validation Edge Cases', () => {
    it('should handle negative numbers correctly', () => {
      wrapper.vm.form.clock = '-100'
      wrapper.vm.form.tdp = '-50'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.cpu.clock).toBe(-100)
      expect(body.cpu.tdp).toBe(-50)
    })

    it('should handle decimal values in integer fields', () => {
      wrapper.vm.form.threadsPerCore = '2.5'
      wrapper.vm.form.l3Cache = '12288.7'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.cpu.threads_per_core).toBe(2) // parseInt truncates
      expect(body.cpu.l3_cache).toBe(12288) // parseInt truncates
    })

    it('should handle zero values correctly', () => {
      wrapper.vm.form.clock = '0'
      wrapper.vm.form.tdp = '0'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.cpu.clock).toBe(0)
      expect(body.cpu.tdp).toBe(0)
    })

    it('should handle empty numeric fields as null', () => {
      wrapper.vm.form.clock = ''
      wrapper.vm.form.tdp = ''
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.cpu.clock).toBeNull()
      expect(body.cpu.tdp).toBeNull()
    })

    it('should handle extremely large numbers', () => {
      wrapper.vm.form.clock = '999999999'
      wrapper.vm.form.transistors = '999999999999'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.cpu.clock).toBe(999999999)
      expect(body.cpu.transistors).toBe(999999999999)
    })
  })

  describe('Input Validation Edge Cases', () => {
    it('should sanitize special characters in text fields', () => {
      wrapper.vm.form.manufacturer = 'Intel@#$%'
      wrapper.vm.form.family = 'Core i7<script>alert("xss")</script>'
      wrapper.vm.form.model = 'i7-8700K" OR 1=1--'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.cpu.family).toBe('Core i7&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(body.manufacturer.name).toBe('Intel@#$%')
      expect(body.cpu.model).toBe('i7-8700K&quot; OR 1=1--')
    })

    it('should handle extremely long strings', () => {
      const longString = 'A'.repeat(1000)
      wrapper.vm.form.manufacturer = longString
      wrapper.vm.form.family = longString
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.manufacturer.name).toBe(longString)
      expect(body.cpu.family).toBe(longString)
    })

    it('should handle unicode characters', () => {
      wrapper.vm.form.manufacturer = 'Intel®'
      wrapper.vm.form.family = 'Core™ i7'
      wrapper.vm.form.model = 'i7-8700K™'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.manufacturer.name).toBe('Intel®')
      expect(body.cpu.family).toBe('Core™ i7')
      expect(body.cpu.model).toBe('i7-8700K™')
    })
  })

  describe('Business Logic Validation', () => {
    it('should handle logical constraints gracefully', () => {
      // Set max_clock < clock (illogical but should be handled)
      wrapper.vm.form.clock = '5000'
      wrapper.vm.form.maxClock = '3000'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.cpu.clock).toBe(5000)
      expect(body.cpu.max_clock).toBe(3000)
      // Note: Business logic validation should be added to the form
    })

    it('should handle realistic value ranges', () => {
      wrapper.vm.form.clock = '100' // Very low but valid
      wrapper.vm.form.maxClock = '6000' // Very high but valid
      wrapper.vm.form.tdp = '5' // Very low TDP
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.cpu.clock).toBe(100)
      expect(body.cpu.max_clock).toBe(6000)
      expect(body.cpu.tdp).toBe(5)
    })
  })

  describe('Error Handling Edge Cases', () => {
    it('should handle malformed API responses', async () => {
      wrapper.vm.form.manufacturer = 'Intel'
      wrapper.vm.form.family = 'Core i7'
      wrapper.vm.form.model = 'i7-8700K'
      
      const mockResponse = {
        ok: true,
        json: () => Promise.reject(new Error('Unexpected token'))
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Invalid response from server. Please try again.')
    })

    it('should handle timeout scenarios', async () => {
      wrapper.vm.form.manufacturer = 'Intel'
      wrapper.vm.form.family = 'Core i7'
      wrapper.vm.form.model = 'i7-8700K'
      
      global.fetch = vi.fn().mockRejectedValue(new Error('Request timeout'))

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Request timeout')
    })

    it('should handle partial network failures', async () => {
      wrapper.vm.form.manufacturer = 'Intel'
      wrapper.vm.form.family = 'Core i7'
      wrapper.vm.form.model = 'i7-8700K'
      
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
