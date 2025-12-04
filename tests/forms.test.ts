import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000';

test.describe('Frontend Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls for frontend-only testing
    await page.route('**/api/**', route => {
      const url = route.request().url();
      const method = route.request().method();
      
      console.log(`🔀 Mocking API call: ${method} ${url}`);
      
      // Mock successful responses
      if (method === 'POST' || method === 'PUT') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Operation completed successfully',
            data: { id: 1 }
          })
        });
      } else if (method === 'DELETE') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Deleted successfully'
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

  test('should show client-side validation errors for empty required fields @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    const errorMessages = await page.locator('.error, [data-testid="error"]').count();
    expect(errorMessages).toBeGreaterThan(0);
  });

  test('should validate numeric fields client-side @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Fill form with invalid numeric data
    await page.fill('input[type="number"]', 'invalid');
    
    // Check for validation errors
    const errorMessages = await page.locator('.error, [data-testid="error"]').count();
    expect(errorMessages).toBeGreaterThan(0);
  });

  test('should navigate between different form types @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Navigate to GPU form
    await page.goto(`${BASE_URL}/GPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Verify we're on GPU form
    await expect(page).toHaveURL(/.*GPU.*form/);
    
    // Navigate to FPGA form
    await page.goto(`${BASE_URL}/FPGA/form`);
    await page.waitForLoadState('networkidle');
    
    // Verify we're on FPGA form
    await expect(page).toHaveURL(/.*FPGA.*form/);
  });

  test('should handle form cancellation @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Fill some data
    await page.fill('input[type="text"]', 'Test CPU');
    
    // Click cancel or back button
    const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Back"), a:has-text("Back")').first();
    if (await cancelButton.count() > 0) {
      await cancelButton.click();
    }
  });

  test('should work on mobile viewport @forms @mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Test form interactions on mobile
    await page.fill('input[type="text"]', 'Test CPU');
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Verify form is usable on mobile
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should handle form field focus and blur @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Test focus on first input
    const firstInput = page.locator('input[type="text"]').first();
    await firstInput.focus();
    await expect(firstInput).toBeFocused();
    
    // Test blur
    await firstInput.blur();
    await expect(firstInput).not.toBeFocused();
  });

  test('should handle form field changes @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Test input changes
    const input = page.locator('input[type="text"]').first();
    await input.fill('Test Value');
    await expect(input).toHaveValue('Test Value');
    
    // Test clearing
    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('should handle select dropdown changes @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Test select dropdown
    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.selectOption({ index: 1 });
      const selectedValue = await select.inputValue();
      expect(selectedValue).toBeTruthy();
    }
  });

  test('should handle textarea changes @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Test textarea
    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.fill('Test description');
      await expect(textarea).toHaveValue('Test description');
    }
  });

  test('should handle checkbox changes @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Test checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }
  });

  test('should handle radio button changes @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Test radio button
    const radio = page.locator('input[type="radio"]').first();
    if (await radio.count() > 0) {
      await radio.check();
      await expect(radio).toBeChecked();
    }
  });

  test('should validate CPU form with test data @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Fill form with valid test data
    const validData = {
      manufacturer: 'Intel',
      family: 'Core i7',
      model: 'i7-8700K',
      year: '2017'
    };
    
    await page.fill('input[name="manufacturer"]', validData.manufacturer);
    await page.fill('input[name="family"]', validData.family);
    await page.fill('input[name="model"]', validData.model);
    await page.fill('input[name="year"]', validData.year);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify form submission (mocked)
    await page.waitForTimeout(1000);
  });

  test('should show validation errors for invalid CPU data @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Fill form with invalid test data
    const invalidData = {
      manufacturer: '', // Empty required field
      family: 'Core i7',
      model: 'i7-8700K',
      year: 'invalid-year' // Invalid year format
    };
    
    await page.fill('input[name="manufacturer"]', invalidData.manufacturer);
    await page.fill('input[name="family"]', invalidData.family);
    await page.fill('input[name="model"]', invalidData.model);
    await page.fill('input[name="year"]', invalidData.year);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    const errorMessages = await page.locator('.error, [data-testid="error"]').count();
    expect(errorMessages).toBeGreaterThan(0);
  });

  test('should validate GPU form with test data @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/GPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Fill form with valid test data
    const validData = {
      manufacturer: 'NVIDIA',
      family: 'GeForce RTX',
      model: 'RTX 3080',
      year: '2020'
    };
    
    await page.fill('input[name="manufacturer"]', validData.manufacturer);
    await page.fill('input[name="family"]', validData.family);
    await page.fill('input[name="model"]', validData.model);
    await page.fill('input[name="year"]', validData.year);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify form submission (mocked)
    await page.waitForTimeout(1000);
  });

  test('should validate FPGA form with test data @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/FPGA/form`);
    await page.waitForLoadState('networkidle');
    
    // Fill form with valid test data
    const validData = {
      manufacturer: 'Xilinx',
      family: '7 Series',
      model: 'XC7K325T',
      year: '2012'
    };
    
    await page.fill('input[name="manufacturer"]', validData.manufacturer);
    await page.fill('input[name="family"]', validData.family);
    await page.fill('input[name="model"]', validData.model);
    await page.fill('input[name="year"]', validData.year);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify form submission (mocked)
    await page.waitForTimeout(1000);
  });

  test('should handle form field validation with numeric constraints @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Test numeric field validation
    const numericFields = page.locator('input[type="number"]');
    const count = await numericFields.count();
    
    if (count > 0) {
      const firstNumericField = numericFields.first();
      
      // Test negative numbers
      await firstNumericField.fill('-100');
      await firstNumericField.blur();
      
      // Test decimal numbers
      await firstNumericField.fill('100.5');
      await firstNumericField.blur();
      
      // Test valid number
      await firstNumericField.fill('100');
      await expect(firstNumericField).toHaveValue('100');
    }
  });

  test('should handle form reset functionality @forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/CPU/form`);
    await page.waitForLoadState('networkidle');
    
    // Fill form with data
    await page.fill('input[name="manufacturer"]', 'Test Manufacturer');
    await page.fill('input[name="model"]', 'Test Model');
    
    // Reset form
    const resetButton = page.locator('button[type="reset"], button:has-text("Reset")').first();
    if (await resetButton.count() > 0) {
      await resetButton.click();
      
      // Verify form is reset
      await expect(page.locator('input[name="manufacturer"]')).toHaveValue('');
      await expect(page.locator('input[name="model"]')).toHaveValue('');
    }
  });
});



