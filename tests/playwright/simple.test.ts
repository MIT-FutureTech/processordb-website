import { test, expect } from '@playwright/test';

test.describe('Simple Frontend Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls for frontend-only testing
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
  });

  test('should load homepage', async ({ page }) => {
    // Use relative URL - Playwright will use baseURL from config
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    
    // Basic check that page loads - use actual title from the app
    await expect(page).toHaveTitle(/MIT Processor DB/);
  });

  test('should load page successfully', async ({ page }) => {
    // Use relative URL - Playwright will use baseURL from config
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    
    // Basic check that page loads and has content
    await expect(page).toHaveTitle(/MIT Processor DB/);
    
    // Check that page has some content
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that page has some text content
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent!.length).toBeGreaterThan(0);
  });
});
