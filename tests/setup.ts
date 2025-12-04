import { vi } from 'vitest'

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock global fetch
global.fetch = vi.fn()

// Mock console methods to reduce noise in tests
Object.assign(global, {
  console: {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
})

// Mock Nuxt composables
Object.assign(global, {
  useRuntimeConfig: vi.fn(() => ({
    public: {
      backendUrl: process.env.BACKEND_URL || 'http://localhost:3001'
    }
  })),
  useStorage: vi.fn(() => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn()
  })),
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
  })),
  NuxtLink: vi.fn()
})

// Mock #imports module
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      backendUrl: process.env.BACKEND_URL || 'http://localhost:3001'
    }
  }))
}))

// Mock window object if not available
if (typeof window === 'undefined') {
  global.window = {} as any
}

// Ensure sessionStorage and localStorage are available globally
if (!global.sessionStorage) {
  global.sessionStorage = sessionStorageMock
}

if (!global.localStorage) {
  global.localStorage = localStorageMock
}

