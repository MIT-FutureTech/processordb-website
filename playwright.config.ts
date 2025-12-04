import { defineConfig, devices } from '@playwright/test';
import { getPlaywrightConfig } from './tests/config/environments.js';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const envConfig = getPlaywrightConfig();

// Debug output removed for cleaner test runs

export default defineConfig({
  testDir: './tests/playwright',
  /* Run tests in files in parallel - enabled with port locking */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: envConfig.retries,
  /* Use multiple workers for parallel execution */
  workers: process.env.CI ? 2 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: envConfig.baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

        /* Test against branded browsers. */
        {
          name: 'Microsoft Edge',
          use: { ...devices['Desktop Edge'], channel: 'msedge' },
        },
        // Google Chrome removed - not available in Playwright installation

    /* Tablet viewports */
    {
      name: 'Tablet Chrome',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'Tablet Safari',
      use: { ...devices['iPad'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: envConfig.webServer || undefined,

  /* Global setup and teardown */
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  /* Test timeout - increased to account for slow Nuxt compilation */
  timeout: 120 * 1000, // Increased to 2 minutes
  expect: {
    /* Timeout for expect assertions - increased for stability */
    timeout: 10000, // Increased to 10 seconds
  },
});
