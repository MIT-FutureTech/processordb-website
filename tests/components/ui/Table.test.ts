import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Table from '@/components/ui/table/Table.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCaption from '@/components/ui/table/TableCaption.vue'
import TableEmpty from '@/components/ui/table/TableEmpty.vue'
import TableFooter from '@/components/ui/table/TableFooter.vue'

describe('Table Components', () => {
  describe('Table', () => {
    it('should render with default slot', () => {
      const wrapper = mount(Table, {
        slots: {
          default: 'Test Table'
        }
      })

      expect(wrapper.text()).toContain('Test Table')
    })

    it('should have proper table element', () => {
      const wrapper = mount(Table, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('table').exists()).toBe(true)
      expect(wrapper.find('div').classes()).toContain('relative')
    })
  })

  describe('TableBody', () => {
    it('should render with default slot', () => {
      const wrapper = mount(TableBody, {
        slots: {
          default: 'Test Body'
        }
      })

      expect(wrapper.text()).toContain('Test Body')
    })

    it('should have proper tbody element', () => {
      const wrapper = mount(TableBody, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('tbody').exists()).toBe(true)
    })
  })

  describe('TableCell', () => {
    it('should render with default slot', () => {
      const wrapper = mount(TableCell, {
        slots: {
          default: 'Test Cell'
        }
      })

      expect(wrapper.text()).toContain('Test Cell')
    })

    it('should have proper td element', () => {
      const wrapper = mount(TableCell, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('td').exists()).toBe(true)
    })
  })

  describe('TableHead', () => {
    it('should render with default slot', () => {
      const wrapper = mount(TableHead, {
        slots: {
          default: 'Test Head'
        }
      })

      expect(wrapper.text()).toContain('Test Head')
    })

    it('should have proper th element', () => {
      const wrapper = mount(TableHead, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('th').exists()).toBe(true)
    })
  })

  describe('TableHeader', () => {
    it('should render with default slot', () => {
      const wrapper = mount(TableHeader, {
        slots: {
          default: 'Test Header'
        }
      })

      expect(wrapper.text()).toContain('Test Header')
    })

    it('should have proper thead element', () => {
      const wrapper = mount(TableHeader, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('thead').exists()).toBe(true)
    })
  })

  describe('TableRow', () => {
    it('should render with default slot', () => {
      const wrapper = mount(TableRow, {
        slots: {
          default: 'Test Row'
        }
      })

      expect(wrapper.text()).toContain('Test Row')
    })

    it('should have proper tr element', () => {
      const wrapper = mount(TableRow, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('tr').exists()).toBe(true)
    })
  })

  describe('TableCaption', () => {
    it('should render with default slot', () => {
      const wrapper = mount(TableCaption, {
        slots: {
          default: 'Test Caption'
        }
      })

      expect(wrapper.text()).toContain('Test Caption')
    })

    it('should have proper caption element', () => {
      const wrapper = mount(TableCaption, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('caption').exists()).toBe(true)
    })
  })

  describe('TableEmpty', () => {
    it('should render with default slot', () => {
      const wrapper = mount(TableEmpty, {
        slots: {
          default: 'No data available'
        }
      })

      expect(wrapper.text()).toContain('No data available')
    })
  })

  describe('TableFooter', () => {
    it('should render with default slot', () => {
      const wrapper = mount(TableFooter, {
        slots: {
          default: 'Test Footer'
        }
      })

      expect(wrapper.text()).toContain('Test Footer')
    })

    it('should have proper tfoot element', () => {
      const wrapper = mount(TableFooter, {
        slots: {
          default: 'Test'
        }
      })

      expect(wrapper.find('tfoot').exists()).toBe(true)
    })
  })
})


