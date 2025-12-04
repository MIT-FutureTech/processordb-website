import { vi } from 'vitest';

// Mock for #imports
export const useRuntimeConfig = () => ({
  public: {
    backendUrl: 'http://localhost:3001'
  }
});

export const useRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn()
});

export const useRoute = () => ({
  params: {},
  query: {},
  path: '/',
  name: 'index'
});

export const navigateTo = vi.fn();
export const useHead = vi.fn();
export const useSeoMeta = vi.fn();
export const useLazyFetch = vi.fn();
export const useFetch = vi.fn();
export const $fetch = vi.fn();
