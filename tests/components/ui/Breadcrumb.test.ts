import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbPage from '@/components/ui/breadcrumb/BreadcrumbPage.vue'
import BreadcrumbSeparator from '@/components/ui/breadcrumb/BreadcrumbSeparator.vue'

describe('Breadcrumb Components', () => {
  describe('Breadcrumb', () => {
    it('should render with default slot', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: 'Test Breadcrumb'
        }
      })

      expect(wrapper.text()).toContain('Test Breadcrumb')
    })

    it('should have proper CSS classes', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('nav').exists()).toBe(true)
      expect(wrapper.attributes('aria-label')).toBe('breadcrumb')
    })
  })

  describe('BreadcrumbItem', () => {
    it('should render with default slot', () => {
      const wrapper = mount(BreadcrumbItem, {
        slots: {
          default: 'Test Item'
        }
      })

      expect(wrapper.text()).toContain('Test Item')
      expect(wrapper.find('li').exists()).toBe(true)
    })
  })

  describe('BreadcrumbLink', () => {
    it('should render as a link with href', () => {
      const wrapper = mount(BreadcrumbLink, {
        props: {
          href: '/test'
        },
        slots: {
          default: 'Test Link'
        }
      })

      expect(wrapper.attributes('href')).toBe('/test')
      expect(wrapper.text()).toContain('Test Link')
    })

    it('should render as NuxtLink when to prop is provided', () => {
      const wrapper = mount(BreadcrumbLink, {
        props: {
          to: '/test'
        },
        slots: {
          default: 'Test Link'
        }
      })

      expect(wrapper.text()).toContain('Test Link')
    })
  })

  describe('BreadcrumbList', () => {
    it('should render with default slot', () => {
      const wrapper = mount(BreadcrumbList, {
        slots: {
          default: 'Test List'
        }
      })

      expect(wrapper.text()).toContain('Test List')
    })
  })

  describe('BreadcrumbPage', () => {
    it('should render with default slot', () => {
      const wrapper = mount(BreadcrumbPage, {
        slots: {
          default: 'Test Page'
        }
      })

      expect(wrapper.text()).toContain('Test Page')
    })
  })

  describe('BreadcrumbSeparator', () => {
    it('should render default separator', () => {
      const wrapper = mount(BreadcrumbSeparator)

      expect(wrapper.find('li').exists()).toBe(true)
      expect(wrapper.attributes('role')).toBe('presentation')
      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })

    it('should render custom separator', () => {
      const wrapper = mount(BreadcrumbSeparator, {
        slots: {
          default: '>'
        }
      })

      expect(wrapper.text()).toContain('>')
    })
  })
})


