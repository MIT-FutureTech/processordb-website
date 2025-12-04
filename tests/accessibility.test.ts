import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Test configuration
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000';

test.describe('Frontend Accessibility Tests', () => {
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

  test('Homepage should be accessible @accessibility', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('CPU list page should be accessible @accessibility', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/list`);
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Navigation should be accessible @accessibility', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Test navigation accessibility
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('nav')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Error messages should be accessible @accessibility', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Trigger form validation errors
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Mobile viewport should be accessible @accessibility @mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Tablet viewport should be accessible @accessibility @tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});



