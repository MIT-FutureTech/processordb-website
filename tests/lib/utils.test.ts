import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should handle conditional classes', () => {
      expect(cn('base-class', { 'active-class': true, 'inactive-class': false })).toBe('base-class active-class')
    })

    it('should handle multiple conditional classes', () => {
      expect(cn(
        'base-class',
        { 'active-class': true },
        { 'hover-class': false },
        'static-class'
      )).toBe('base-class active-class static-class')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base-class', undefined, null, 'valid-class')).toBe('base-class valid-class')
    })

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('p-2 p-4')).toBe('p-4')
      expect(cn('text-sm text-lg')).toBe('text-lg')
    })
  })
})


