import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000';

test.describe('Frontend Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls for frontend-only testing
    await page.route('**/api/**', route => {
      const url = route.request().url();
      const method = route.request().method();
      
      console.log(`Mocking API call: ${method} ${url}`);
      
      // Mock successful responses
      if (url.includes('/cpus') && method === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                cpu_id: 1,
                model: 'Intel Core i7-8700K',
                family: 'Core i7',
                manufacturer: 'Intel',
                cores: 6,
                threads: 12,
                base_clock: 3700,
                boost_clock: 4700
              }
            ],
            total: 1,
            page: 1,
            limit: 10
          })
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });
  });

  test('Homepage visual regression @visual', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('CPU list page visual regression @visual', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/list`);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('cpu-list.png');
  });

  test('GPU list page visual regression @visual', async ({ page }) => {
    await page.goto(`${BASE_URL}/GPU/list`);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('gpu-list.png');
  });

  test('FPGA list page visual regression @visual', async ({ page }) => {
    await page.goto(`${BASE_URL}/FPGA/list`);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('fpga-list.png');
  });

  test('Navigation component visual regression @visual', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const navbar = page.locator('nav');
    await expect(navbar).toHaveScreenshot('navigation.png');
  });

  test('Error state visual regression @visual', async ({ page }) => {
    // Mock error response
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'Something went wrong'
        })
      });
    });

    await page.goto(`${BASE_URL}/CPU/list`);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('error-state.png');
  });

  test('Loading state visual regression @visual', async ({ page }) => {
    // Mock slow response
    await page.route('**/api/**', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [], total: 0 })
        });
      }, 2000);
    });

    await page.goto(`${BASE_URL}/CPU/list`);
    
    // Capture during loading state
    await expect(page).toHaveScreenshot('loading-state.png');
  });

  test('Mobile viewport visual regression @visual @mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('mobile-homepage.png');
  });

  test('Tablet viewport visual regression @visual @tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('tablet-homepage.png');
  });

  test('Desktop viewport visual regression @visual @desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('desktop-homepage.png');
  });
});



