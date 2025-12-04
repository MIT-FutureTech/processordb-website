import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue() as any],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/tests/e2e/**', // Exclude E2E tests from Vitest
      '**/tests/playwright/**', // Exclude Playwright tests from Vitest
      '**/tests/accessibility.test.ts', // Exclude Playwright accessibility tests
      '**/tests/forms.test.ts', // Exclude Playwright form tests
      '**/tests/performance.test.ts', // Exclude Playwright performance tests
      '**/tests/visual-regression.test.ts' // Exclude Playwright visual regression tests
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/dist/**',
        '**/.nuxt/**',
        '**/.output/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '~': resolve(__dirname, '.'),
      '#app': resolve(__dirname, 'node_modules/nuxt/dist/app'),
      '#imports': resolve(__dirname, 'tests/mocks/imports.ts')
    }
  },
  esbuild: {
    target: 'node18'
  },
  define: {
    'import.meta.vitest': 'undefined'
  }
})


