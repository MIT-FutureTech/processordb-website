import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Navbar from '@/components/Navbar.vue'

// Mock the isLogged module
vi.mock('@/lib/isLogged', () => ({
  isLogged: vi.fn()
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    path: '/',
    query: {},
    params: {}
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }))
}))

import { isLogged } from '@/lib/isLogged'

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the MIT PROCESSOR DB title', () => {
    vi.mocked(isLogged).mockReturnValue(false)
    
    const wrapper = mount(Navbar)
    
    expect(wrapper.text()).toContain('MIT')
    expect(wrapper.text()).toContain('PROCESSOR DB')
  })

  it('should show login link when user is not logged in', () => {
    vi.mocked(isLogged).mockReturnValue(false)
    
    const wrapper = mount(Navbar)
    
    expect(wrapper.text()).toContain('Login')
  })

  it('should show profile link when user is logged in', async () => {
    vi.mocked(isLogged).mockReturnValue(true)
    
    const wrapper = mount(Navbar)
    
    // Wait for onMounted to execute
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Profile')
  })

  it('should render navigation links', () => {
    vi.mocked(isLogged).mockReturnValue(false)
    
    const wrapper = mount(Navbar)
    
    expect(wrapper.text()).toContain('Database')
    expect(wrapper.text()).toContain('Team')
  })

  it('should have proper CSS classes for styling', () => {
    vi.mocked(isLogged).mockReturnValue(false)
    
    const wrapper = mount(Navbar)
    
    expect(wrapper.classes()).toContain('bg-black')
    expect(wrapper.classes()).toContain('border-b-4')
    expect(wrapper.classes()).toContain('sticky')
  })

  it('should call isLogged on mount', async () => {
    vi.mocked(isLogged).mockReturnValue(false)
    
    const wrapper = mount(Navbar)
    
    await wrapper.vm.$nextTick()
    
    expect(isLogged).toHaveBeenCalled()
  })
})


