import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isLogged, getRole } from '@/lib/isLogged'

// Mock the encrypter module
vi.mock('@/lib/encrypter', () => ({
  getItemWithExpiry: vi.fn()
}))

import { getItemWithExpiry } from '@/lib/encrypter'

describe('isLogged', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true when all required items exist', () => {
    vi.mocked(getItemWithExpiry).mockImplementation((key) => {
      const mockData = {
        'encryptedJWTPDB': 'mock-jwt-token',
        'PDB_U_NAME': 'John Doe',
        'PDB_U_ROLE': 'admin',
        'PDB_U_EMAIL': 'john@example.com'
      }
      return mockData[key as keyof typeof mockData] || null
    })

    const result = isLogged()

    expect(result).toBe(true)
    expect(getItemWithExpiry).toHaveBeenCalledTimes(4)
    expect(getItemWithExpiry).toHaveBeenCalledWith('encryptedJWTPDB')
    expect(getItemWithExpiry).toHaveBeenCalledWith('PDB_U_NAME')
    expect(getItemWithExpiry).toHaveBeenCalledWith('PDB_U_ROLE')
    expect(getItemWithExpiry).toHaveBeenCalledWith('PDB_U_EMAIL')
  })

  it('should return false when encryptedJWTPDB is missing', () => {
    vi.mocked(getItemWithExpiry).mockImplementation((key) => {
      const mockData = {
        'encryptedJWTPDB': null,
        'PDB_U_NAME': 'John Doe',
        'PDB_U_ROLE': 'admin',
        'PDB_U_EMAIL': 'john@example.com'
      }
      return mockData[key as keyof typeof mockData] || null
    })

    const result = isLogged()

    expect(result).toBe(false)
  })

  it('should return false when PDB_U_NAME is missing', () => {
    vi.mocked(getItemWithExpiry).mockImplementation((key) => {
      const mockData = {
        'encryptedJWTPDB': 'mock-jwt-token',
        'PDB_U_NAME': null,
        'PDB_U_ROLE': 'admin',
        'PDB_U_EMAIL': 'john@example.com'
      }
      return mockData[key as keyof typeof mockData] || null
    })

    const result = isLogged()

    expect(result).toBe(false)
  })

  it('should return false when PDB_U_ROLE is missing', () => {
    vi.mocked(getItemWithExpiry).mockImplementation((key) => {
      const mockData = {
        'encryptedJWTPDB': 'mock-jwt-token',
        'PDB_U_NAME': 'John Doe',
        'PDB_U_ROLE': null,
        'PDB_U_EMAIL': 'john@example.com'
      }
      return mockData[key as keyof typeof mockData] || null
    })

    const result = isLogged()

    expect(result).toBe(false)
  })

  it('should return false when PDB_U_EMAIL is missing', () => {
    vi.mocked(getItemWithExpiry).mockImplementation((key) => {
      const mockData = {
        'encryptedJWTPDB': 'mock-jwt-token',
        'PDB_U_NAME': 'John Doe',
        'PDB_U_ROLE': 'admin',
        'PDB_U_EMAIL': null
      }
      return mockData[key as keyof typeof mockData] || null
    })

    const result = isLogged()

    expect(result).toBe(false)
  })

  it('should return false when all items are missing', () => {
    vi.mocked(getItemWithExpiry).mockReturnValue(null)

    const result = isLogged()

    expect(result).toBe(false)
  })
})

describe('getRole', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return the user role', () => {
    const mockRole = 'admin'
    vi.mocked(getItemWithExpiry).mockReturnValue(mockRole)

    const result = getRole()

    expect(result).toBe(mockRole)
    expect(getItemWithExpiry).toHaveBeenCalledWith('PDB_U_ROLE')
  })

  it('should return null when role is not found', () => {
    vi.mocked(getItemWithExpiry).mockReturnValue(null)

    const result = getRole()

    expect(result).toBeNull()
  })
})


