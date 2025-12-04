import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000';

test.describe('Frontend Performance Tests', () => {
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

  test('should load homepage within performance budget @performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Performance budget: homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      return {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    expect(metrics.loadTime).toBeLessThan(3000);
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });

  test('should load CPU list page within performance budget @performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${BASE_URL}/CPU/list`);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Performance budget: list page should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
  });

  test('should load GPU list page within performance budget @performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${BASE_URL}/GPU/list`);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Performance budget: list page should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
  });

  test('should load FPGA list page within performance budget @performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${BASE_URL}/FPGA/list`);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Performance budget: list page should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
  });

  test('should handle frontend interactions efficiently @performance', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    
    // Test navigation interactions
    await page.click('nav a:first-child');
    await page.waitForLoadState('networkidle');
    
    const interactionTime = Date.now() - startTime;
    
    // Navigation should be fast
    expect(interactionTime).toBeLessThan(1000);
  });

  test('should handle UI rendering efficiently @performance', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    
    // Simulate user interactions
    await page.hover('nav');
    await page.click('nav a:first-child');
    await page.waitForLoadState('networkidle');
    
    const renderTime = Date.now() - startTime;
    
    // UI should render quickly
    expect(renderTime).toBeLessThan(1500);
  });

  test('should maintain performance during form interactions @performance', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    
    // Test form interactions
    await page.fill('input[type="text"]', 'Test CPU');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.selectOption('select', 'Intel');
    
    const formTime = Date.now() - startTime;
    
    // Form interactions should be responsive
    expect(formTime).toBeLessThan(500);
  });

  test('should handle memory usage efficiently @performance', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check memory usage
    const metrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    if (metrics) {
      // Memory usage should be reasonable (less than 50MB)
      expect(metrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('should handle mobile performance @performance @mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Mobile should still load within reasonable time
    expect(loadTime).toBeLessThan(4000);
  });

  test('should handle tablet performance @performance @tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Tablet should load within reasonable time
    expect(loadTime).toBeLessThan(3500);
  });
});



