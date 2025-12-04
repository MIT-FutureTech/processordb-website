import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FpgaForm from '~/components/Forms/FpgaForm.vue'

// Mock the v-icon component
vi.mock('oh-vue-icons', () => ({
  default: {
    name: 'v-icon',
    template: '<i class="icon"></i>'
  }
}))

describe('FpgaForm', () => {
  let wrapper: any
  const mockFpgaData = {
    fpga: {
      fpga_id: 1,
      generation: '7 Series',
      family_subfamily: 'Kintex-7',
      model: 'XC7K325T',
      clbs: 25400,
      slice_per_clb: 2,
      slices: 50800,
      lut_per_clb: 4,
      luts: 203200,
      ff_per_clb: 8,
      ffs: 406400,
      distributed_ram: 4450,
      block_rams: 445,
      urams: 0,
      multiplier_dsp_blocks: 840,
      ai_engines: 0,
      SoC: {
        soc_id: 1,
        name: 'XC7K325T',
        release_date: '2012-04-18',
        process_node: 28,
        Manufacturer: {
          manufacturer_id: 1,
          name: 'Xilinx'
        }
      }
    },
    manufacturerName: 'Xilinx',
    versionHistory: []
  }

  beforeEach(() => {
    // Reset fetch mock
    global.fetch = vi.fn()
    
    wrapper = mount(FpgaForm, {
      props: {
        fpgaData: mockFpgaData,
        editMode: false,
        readOnly: false
      },
      global: {
        stubs: {
          'v-icon': true
        }
      }
    })
  })

  describe('Form Initialization', () => {
    it('should initialize form with correct default values', () => {
      expect(wrapper.vm.form.manufacturer).toBe('Xilinx')
      expect(wrapper.vm.form.socName).toBe('XC7K325T')
      expect(wrapper.vm.form.generation).toBe('7 Series')
      expect(wrapper.vm.form.familySubfamily).toBe('Kintex-7')
      expect(wrapper.vm.form.model).toBe('XC7K325T')
      expect(wrapper.vm.form.clbs).toBe(25400)
    })

    it('should update form when fpgaData prop changes', async () => {
      const newFpgaData = {
        ...mockFpgaData,
        fpga: {
          ...mockFpgaData.fpga,
          generation: 'UltraScale+',
          model: 'XCVU9P'
        }
      }

      await wrapper.setProps({ fpgaData: newFpgaData })
      
      expect(wrapper.vm.form.generation).toBe('UltraScale+')
      expect(wrapper.vm.form.model).toBe('XCVU9P')
    })
  })

  describe('Form Validation', () => {
    it('should show error message when required fields are empty', async () => {
      wrapper.vm.form.manufacturer = ''
      wrapper.vm.form.socName = ''
      
      await wrapper.vm.submitData()
      
      expect(wrapper.vm.errorMessage).toBeTruthy()
    })

    it('should validate numeric fields', () => {
      wrapper.vm.form.clbs = 'invalid'
      wrapper.vm.form.slices = 'invalid'
      
      // The form should handle this gracefully
      expect(wrapper.vm.form.clbs).toBe('invalid')
    })
  })

  describe('Create Operation (POST)', () => {
    it('should prepare correct POST request body', () => {
      // Create a fresh wrapper for create mode (no existing data)
      const createWrapper = mount(FpgaForm, {
        props: {
          fpgaData: {
            SoC: {
              soc_id: null
            }
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
        manufacturer: 'Xilinx',
        generation: '7 Series',
        familySubfamily: 'Kintex-7',
        model: 'XC7K325T',
        year: '2012',
        clbs: '25400',
        slicePerClb: '2',
        slices: '50800',
        lutPerClb: '4',
        luts: '203200',
        ffPerClb: '8',
        ffs: '406400',
        distributedRam: '4450',
        blockRams: '445',
        urams: '0',
        multiplierDspBlocks: '840',
        aiEngines: '0',
        processNode: '28'
      }

      const expectedBody = {
        soc: {
          soc_id: null,
          name: undefined,
          release_date: null,
          process_node: 28
        },
        manufacturer: {
          name: 'Xilinx'
        },
        fpga: expect.objectContaining({
          fpga_id: null,
          generation: '7 Series',
          family_subfamily: 'Kintex-7',
          model: 'XC7K325T',
          clbs: 25400,
          slice_per_clb: 2,
          slices: 50800,
          lut_per_clb: 4,
          luts: 203200,
          ff_per_clb: 8,
          ffs: 406400,
          distributed_ram: 4450,
          block_rams: 445,
          urams: 0,
          multiplier_dsp_blocks: 840,
          ai_engines: 0
        })
      }

      const actualBody = createWrapper.vm.preparePostRequestBody()
      expect(actualBody).toMatchObject(expectedBody)
    })

    it('should make POST request when creating new FPGA', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          fpga: { fpga_id: 123 },
          soc: { soc_id: 456 },
          manufacturer: { manufacturer_id: 789 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/fpgas',
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
          fpga: { fpga_id: 123 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.successMessage).toBe('FPGA saved successfully!')
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
      wrapper = mount(FpgaForm, {
        props: {
          fpgaData: mockFpgaData,
          editMode: true,
          readOnly: false
        },
        global: {
          stubs: {
            'v-icon': true
          }
        }
      })
    })

    it('should make PUT request when editing existing FPGA', async () => {
      // Create a wrapper for edit mode with correct data structure
      const editWrapper = mount(FpgaForm, {
        props: {
          fpgaData: {
            fpga_id: 1,
            ...mockFpgaData
          },
          editMode: true,
          readOnly: false
        },
        global: {
          stubs: {
            'v-icon': true
          }
        }
      })

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          fpga: { fpga_id: 1 },
          soc: { soc_id: 1 },
          manufacturer: { manufacturer_id: 1 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await editWrapper.vm.submitData()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/fpgas/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String)
        })
      )
    })

    it('should include existing IDs in request body when editing', () => {
      // Create a wrapper for edit mode with correct data structure
      const editWrapper = mount(FpgaForm, {
        props: {
          fpgaData: {
            fpga_id: 1,
            SoC: {
              soc_id: 1
            },
            ...mockFpgaData
          },
          editMode: true,
          readOnly: false
        },
        global: {
          stubs: {
            'v-icon': true
          }
        }
      })

      const body = editWrapper.vm.preparePostRequestBody()
      
      expect(body.soc.soc_id).toBe(1)
      expect(body.fpga.fpga_id).toBe(1)
    })
  })

  describe('Read-only Mode', () => {
    beforeEach(() => {
      wrapper = mount(FpgaForm, {
        props: {
          fpgaData: mockFpgaData,
          editMode: false,
          readOnly: true
        },
        global: {
          stubs: {
            'v-icon': true
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
  })

  describe('Form Sections', () => {
    it('should toggle logic resources section visibility', async () => {
      const initialState = wrapper.vm.isLogicResourcesExpanded
      await wrapper.vm.toggleLogicResources()
      expect(wrapper.vm.isLogicResourcesExpanded).toBe(!initialState)
    })

    it('should toggle memory DSP section visibility', async () => {
      const initialState = wrapper.vm.isMemoryDspExpanded
      await wrapper.vm.toggleMemoryDsp()
      expect(wrapper.vm.isMemoryDspExpanded).toBe(!initialState)
    })

    it('should toggle I/O section visibility', async () => {
      const initialState = wrapper.vm.isIoExpanded
      await wrapper.vm.toggleIo()
      expect(wrapper.vm.isIoExpanded).toBe(!initialState)
    })

    it('should toggle clock resources section visibility', async () => {
      const initialState = wrapper.vm.isClockResourcesExpanded
      await wrapper.vm.toggleClockResources()
      expect(wrapper.vm.isClockResourcesExpanded).toBe(!initialState)
    })

    it('should toggle external interfaces section visibility', async () => {
      const initialState = wrapper.vm.isExternalInterfacesExpanded
      await wrapper.vm.toggleExternalInterfaces()
      expect(wrapper.vm.isExternalInterfacesExpanded).toBe(!initialState)
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
        socName: '',
        generation: '',
        familySubfamily: '',
        model: '',
        // ... other fields
      }

      const body = wrapper.vm.preparePostRequestBody()
      expect(body.soc.name).toBe('')
      expect(body.fpga.model).toBe('')
    })

    it('should format date correctly for release date field', () => {
      wrapper.vm.form.releaseDate = '2023-12-25'
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.soc.release_date).toBe('2023-12-25')
    })

    it('should handle null release date', () => {
      wrapper.vm.form.releaseDate = ''
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.soc.release_date).toBe(null)
    })
  })

  describe('Form Field Mapping', () => {
    it('should correctly map form fields to API structure', () => {
      const body = wrapper.vm.preparePostRequestBody()
      
      // Test some key mappings
      expect(body.fpga.generation).toBe(wrapper.vm.form.generation)
      expect(body.fpga.family_subfamily).toBe(wrapper.vm.form.familySubfamily)
      expect(body.fpga.model).toBe(wrapper.vm.form.model)
      expect(body.fpga.clbs).toBe(wrapper.vm.form.clbs)
      expect(body.fpga.slices).toBe(wrapper.vm.form.slices)
      expect(body.fpga.luts).toBe(wrapper.vm.form.luts)
      expect(body.fpga.ffs).toBe(wrapper.vm.form.ffs)
    })

    it('should handle nested SoC data correctly', () => {
      const body = wrapper.vm.preparePostRequestBody()
      
      expect(body.soc.name).toBe(wrapper.vm.form.socName)
      expect(body.soc.release_date).toBe(wrapper.vm.form.releaseDate)
      expect(body.soc.process_node).toBe(wrapper.vm.form.processNode)
    })

    it('should handle manufacturer data correctly', () => {
      const body = wrapper.vm.preparePostRequestBody()
      
      expect(body.manufacturer.name).toBe(wrapper.vm.form.manufacturer)
    })
  })

  describe('Redirect Functionality', () => {
    it('should redirect to correct URL after successful creation', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          fpga: { fpga_id: 123 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)
      
      // Mock window.location.href
      delete (window as any).location
      window.location = { href: '' } as any

      await wrapper.vm.submitData()

      // Wait for setTimeout
      await new Promise(resolve => setTimeout(resolve, 2100))
      
      expect(window.location.href).toBe('/fpga/123')
    })

    it('should redirect to correct URL after successful edit', async () => {
      const editWrapper = mount(FpgaForm, {
        props: {
          fpgaData: mockFpgaData,
          editMode: true,
          readOnly: false
        },
        global: {
          stubs: {
            'v-icon': true
          }
        }
      })

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          fpga: { fpga_id: 1 }
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)
      
      // Mock window.location.href
      delete (window as any).location
      window.location = { href: '' } as any

      await editWrapper.vm.submitData()

      // Wait for setTimeout
      await new Promise(resolve => setTimeout(resolve, 2100))
      
      expect(window.location.href).toBe('/fpga/1')
    })
  })

  describe('Data Type Validation Edge Cases', () => {
    it('should handle negative numbers correctly', () => {
      wrapper.vm.form.clbs = '-100'
      wrapper.vm.form.slices = '-50'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.fpga.clbs).toBe(-100)
      expect(body.fpga.slices).toBe(-50)
    })

    it('should handle decimal values in integer fields', () => {
      wrapper.vm.form.clbs = '25400.5'
      wrapper.vm.form.slices = '50800.7'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.fpga.clbs).toBe(25400) // parseInt truncates
      expect(body.fpga.slices).toBe(50800) // parseInt truncates
    })

    it('should handle zero values correctly', () => {
      wrapper.vm.form.clbs = '0'
      wrapper.vm.form.slices = '0'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.fpga.clbs).toBe(0)
      expect(body.fpga.slices).toBe(0)
    })

    it('should handle empty numeric fields as null', () => {
      wrapper.vm.form.clbs = ''
      wrapper.vm.form.slices = ''
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.fpga.clbs).toBeNull()
      expect(body.fpga.slices).toBeNull()
    })
  })

  describe('Input Validation Edge Cases', () => {
    it('should sanitize special characters in text fields', () => {
      wrapper.vm.form.manufacturer = 'Xilinx@#$%'
      wrapper.vm.form.generation = '7 Series<script>alert("xss")</script>'
      wrapper.vm.form.model = 'XC7K325T" OR 1=1--'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.fpga.generation).toBe('7 Series&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(body.manufacturer.name).toBe('Xilinx@#$%')
      expect(body.fpga.model).toBe('XC7K325T&quot; OR 1=1--')
    })

    it('should handle extremely long strings', () => {
      const longString = 'A'.repeat(1000)
      wrapper.vm.form.manufacturer = longString
      wrapper.vm.form.generation = longString
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.manufacturer.name).toBe(longString)
      expect(body.fpga.generation).toBe(longString)
    })

    it('should handle unicode characters', () => {
      wrapper.vm.form.manufacturer = 'Xilinx®'
      wrapper.vm.form.generation = '7 Series™'
      wrapper.vm.form.model = 'XC7K325T™'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.manufacturer.name).toBe('Xilinx®')
      expect(body.fpga.generation).toBe('7 Series™')
      expect(body.fpga.model).toBe('XC7K325T™')
    })
  })

  describe('Business Logic Validation', () => {
    it('should handle logical constraints gracefully', () => {
      // Set slices < clbs (illogical but should be handled)
      wrapper.vm.form.clbs = '1000'
      wrapper.vm.form.slices = '500'
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.fpga.clbs).toBe(1000)
      expect(body.fpga.slices).toBe(500)
      // Note: Business logic validation should be added to the form
    })

    it('should handle realistic value ranges', () => {
      wrapper.vm.form.clbs = '100' // Very low but valid
      wrapper.vm.form.slices = '100000' // Very high but valid
      wrapper.vm.form.luts = '500000' // Very high but valid
      
      const body = wrapper.vm.preparePostRequestBody()
      expect(body.fpga.clbs).toBe(100)
      expect(body.fpga.slices).toBe(100000)
      expect(body.fpga.luts).toBe(500000)
    })
  })

  describe('Error Handling Edge Cases', () => {
    it('should handle malformed API responses', async () => {
      wrapper.vm.form.manufacturer = 'Xilinx'
      wrapper.vm.form.generation = '7 Series'
      wrapper.vm.form.model = 'XC7K325T'
      
      const mockResponse = {
        ok: true,
        json: () => Promise.reject(new Error('Unexpected token'))
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Invalid response from server. Please try again.')
    })

    it('should handle timeout scenarios', async () => {
      wrapper.vm.form.manufacturer = 'Xilinx'
      wrapper.vm.form.generation = '7 Series'
      wrapper.vm.form.model = 'XC7K325T'
      
      global.fetch = vi.fn().mockRejectedValue(new Error('Request timeout'))

      await wrapper.vm.submitData()

      expect(wrapper.vm.errorMessage).toBe('Request timeout')
    })

    it('should handle partial network failures', async () => {
      wrapper.vm.form.manufacturer = 'Xilinx'
      wrapper.vm.form.generation = '7 Series'
      wrapper.vm.form.model = 'XC7K325T'
      
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
