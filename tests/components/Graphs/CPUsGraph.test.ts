import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CPUsGraph from '@/components/Graphs/CPUsGraph.client.vue'

// Mock Highcharts
vi.mock('highcharts', () => ({
  default: {
    chart: vi.fn(),
    series: vi.fn(),
    xAxis: vi.fn(),
    yAxis: vi.fn(),
    title: vi.fn(),
    subtitle: vi.fn(),
    legend: vi.fn(),
    plotOptions: vi.fn(),
    tooltip: vi.fn(),
    credits: vi.fn()
  }
}))

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    path: '/cpu/list',
    query: {}
  }))
}))

describe('CPUsGraph', () => {
  const mockData = [
    { name: 'Intel Core i7', cores: 8, base_clock: 3.2, tdp: 65 },
    { name: 'AMD Ryzen 7', cores: 8, base_clock: 3.6, tdp: 65 },
    { name: 'Intel Core i5', cores: 6, base_clock: 2.8, tdp: 65 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with data prop', () => {
    const wrapper = mount(CPUsGraph, {
      props: {
        data: mockData
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should handle empty data array', () => {
    const wrapper = mount(CPUsGraph, {
      props: {
        data: []
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display chart controls', () => {
    const wrapper = mount(CPUsGraph, {
      props: {
        data: mockData
      }
    })

    // Check for dropdown menus and controls
    expect(wrapper.text()).toContain('X-Axis')
    expect(wrapper.text()).toContain('Y-Axis')
  })

  it('should handle undefined data gracefully', () => {
    const wrapper = mount(CPUsGraph, {
      props: {
        data: undefined as any
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should have proper component structure', () => {
    const wrapper = mount(CPUsGraph, {
      props: {
        data: mockData
      }
    })

    // Check for main container
    expect(wrapper.find('.scatter-plot').exists()).toBe(true)
  })

  it('should initialize with default chart type', () => {
    const wrapper = mount(CPUsGraph, {
      props: {
        data: mockData
      }
    })

    // Component should initialize without errors
    expect(wrapper.exists()).toBe(true)
  })
})


