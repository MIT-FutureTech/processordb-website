import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setItemWithExpiry, getItemWithExpiry } from '@/lib/encrypter'

describe('encrypter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset Date.now mock
    vi.useRealTimers()
  })

  describe('setItemWithExpiry', () => {
    it('should store item with default expiry time', () => {
      const key = 'test-key'
      const value = 'test-value'
      const defaultTtl = 43200000 // 12 hours in ms

      setItemWithExpiry(key, value)

      expect(sessionStorage.setItem).toHaveBeenCalledWith(key, expect.any(String))
      
      const storedData = JSON.parse((sessionStorage.setItem as any).mock.calls[0][1])
      expect(storedData.value).toBe(value)
      expect(storedData.expiry).toBeGreaterThan(Date.now())
    })

    it('should store item with custom expiry time', () => {
      const key = 'test-key'
      const value = 'test-value'
      const customTtl = 1000 // 1 second

      setItemWithExpiry(key, value, customTtl)

      expect(sessionStorage.setItem).toHaveBeenCalledWith(key, expect.any(String))
      
      const storedData = JSON.parse((sessionStorage.setItem as any).mock.calls[0][1])
      expect(storedData.value).toBe(value)
      expect(storedData.expiry).toBeCloseTo(Date.now() + customTtl, -2)
    })
  })

  describe('getItemWithExpiry', () => {
    it('should return null when item does not exist', () => {
      (sessionStorage.getItem as any).mockReturnValue(null)

      const result = getItemWithExpiry('non-existent-key')

      expect(result).toBeNull()
    })

    it('should return value when item exists and is not expired', () => {
      const key = 'test-key'
      const value = 'test-value'
      const currentTime = Date.now()
      const futureTime = currentTime + 3600000; // 1 hour in the future
      
      (sessionStorage.getItem as any).mockReturnValue(JSON.stringify({
        value,
        expiry: futureTime
      }))

      const result = getItemWithExpiry(key)

      expect(result).toBe(value)
    })

    it('should return null and remove item when expired', () => {
      const key = 'expired-key'
      const pastTime = -2600000; // Fixed past time
      
      (sessionStorage.getItem as any).mockReturnValue(JSON.stringify({
        value: 'expired-value',
        expiry: pastTime
      }))

      const result = getItemWithExpiry(key)

      expect(result).toBeNull()
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(key)
    })

    it('should return null and remove item when JSON is invalid', () => {
      const key = 'invalid-json-key';
      
      (sessionStorage.getItem as any).mockReturnValue('invalid-json')

      const result = getItemWithExpiry(key)

      expect(result).toBeNull()
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(key)
    })

    it('should handle empty string from sessionStorage', () => {
      (sessionStorage.getItem as any).mockReturnValue('')

      const result = getItemWithExpiry('empty-key')

      expect(result).toBeNull()
    })
  })
})


