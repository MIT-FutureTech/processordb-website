import { chromium, type FullConfig } from '@playwright/test';

/**
 * Global setup for frontend-only testing
 * Sets up mocked APIs and test data
 */
async function globalSetup(config: FullConfig) {
  console.log('Starting frontend-only global setup...');

  // Start browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Set up API mocking
    await page.route('**/api/**', route => {
      const url = route.request().url();
      const method = route.request().method();
      
      console.log(`Mocking API call: ${method} ${url}`);
      
      // Mock successful responses for different endpoints
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
      } else if (url.includes('/gpus') && method === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                gpu_id: 1,
                model: 'NVIDIA GeForce RTX 3080',
                manufacturer: 'NVIDIA',
                memory_size: 10240,
                memory_type: 'GDDR6X',
                base_clock: 1440,
                boost_clock: 1710
              }
            ],
            total: 1,
            page: 1,
            limit: 10
          })
        });
      } else if (url.includes('/fpgas') && method === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                fpga_id: 1,
                model: 'Xilinx XC7K325T',
                manufacturer: 'Xilinx',
                generation: '7 Series',
                family_subfamily: 'Kintex-7'
              }
            ],
            total: 1,
            page: 1,
            limit: 10
          })
        });
      } else if (method === 'POST' || method === 'PUT') {
        // Mock successful creation/update responses
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
        // Mock successful deletion responses
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Deleted successfully'
          })
        });
      } else {
        // Default mock response
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    console.log('API mocking configured successfully');
    console.log('Frontend-only global setup completed!');
    
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
