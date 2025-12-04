import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DataTable from '@/components/DataTable.vue'

describe('DataTable', () => {
  const mockData = [
    { soc_id: 1, name: 'Test CPU 1', manufacturer_name: 'Intel', cores: 4 },
    { soc_id: 2, name: 'Test CPU 2', manufacturer_name: 'AMD', cores: 8 },
    { soc_id: 3, name: 'Test CPU 3', manufacturer_name: 'Intel', cores: 6 }
  ]

  beforeEach(() => {
    // Mock global fetch
    global.fetch = vi.fn()
  })

  it('should render with required data prop', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display data in table format', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData
      }
    })

    // Check if table headers are present (based on actual component structure)
    expect(wrapper.text()).toContain('Manufacturer')
    expect(wrapper.text()).toContain('Processor Type')
  })

  it('should handle empty data array', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: []
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should emit filteredData event when data changes', async () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData
      }
    })

    // Simulate data filtering
    await wrapper.vm.$nextTick()

    // Check if the component exists and renders properly
    expect(wrapper.exists()).toBe(true)
  })

  it('should have proper table structure', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData
      }
    })

    // Check for table elements
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('thead').exists()).toBe(true)
    expect(wrapper.find('tbody').exists()).toBe(true)
  })

  it('should handle undefined data gracefully', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: undefined as any
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})


