#!/usr/bin/env node

/**
 * Quick API performance test script
 * Tests both frontend Nuxt API and backend API directly
 */

const testEndpoint = async (name, url, options = {}) => {
  const startTime = Date.now();
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers
      }
    });
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const contentType = response.headers.get('content-type');
    let data = null;
    let dataSize = 0;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      dataSize = JSON.stringify(data).length;
    } else {
      const text = await response.text();
      dataSize = text.length;
    }
    
    const itemCount = Array.isArray(data) ? data.length : (data?.data?.length || data?.pagination?.totalCount || 0);
    
    return {
      name,
      url,
      status: response.status,
      duration,
      dataSize,
      itemCount,
      success: response.ok
    };
  } catch (error) {
    const endTime = Date.now();
    return {
      name,
      url,
      status: 'ERROR',
      duration: endTime - startTime,
      error: error.message,
      success: false
    };
  }
};

async function runTests() {
  console.log('Testing API Performance...\n');
  console.log('='.repeat(60));
  
  const tests = [
    // Frontend Nuxt API routes
    { name: 'Frontend: CPUs (100)', url: 'http://localhost:3000/api/cpus?page=1&limit=100' },
    { name: 'Frontend: CPUs (500)', url: 'http://localhost:3000/api/cpus?page=1&limit=500' },
    { name: 'Frontend: GPUs (100)', url: 'http://localhost:3000/api/gpus?page=1&limit=100' },
    { name: 'Frontend: FPGAs (100)', url: 'http://localhost:3000/api/fpgas?page=1&limit=100' },
    
    // Backend API directly
    { name: 'Backend: CPUs (100)', url: 'http://localhost:3001/api/cpus?page=1&pageSize=100' },
    { name: 'Backend: CPUs (500)', url: 'http://localhost:3001/api/cpus?page=1&pageSize=500' },
    { name: 'Backend: GPUs (100)', url: 'http://localhost:3001/api/gpus?page=1&pageSize=100' },
    { name: 'Backend: FPGAs (100)', url: 'http://localhost:3001/api/fpgas?page=1&pageSize=100' },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url);
    results.push(result);
    
    if (result.success) {
      console.log(`✓ ${result.name}`);
      console.log(`  Status: ${result.status} | Time: ${result.duration}ms | Items: ${result.itemCount} | Size: ${(result.dataSize / 1024).toFixed(2)}KB`);
    } else {
      console.log(`✗ ${result.name}`);
      console.log(`  Status: ${result.status} | Time: ${result.duration}ms | Error: ${result.error || 'Request failed'}`);
    }
    console.log('');
  }
  
  console.log('='.repeat(60));
  console.log('\nSummary:');
  console.log('='.repeat(60));
  
  const frontendResults = results.filter(r => r.name.startsWith('Frontend'));
  const backendResults = results.filter(r => r.name.startsWith('Backend'));
  
  if (frontendResults.length > 0) {
    const avgFrontend = frontendResults.reduce((sum, r) => sum + r.duration, 0) / frontendResults.length;
    const maxFrontend = Math.max(...frontendResults.map(r => r.duration));
    console.log(`Frontend API (Nuxt):`);
    console.log(`  Average: ${avgFrontend.toFixed(0)}ms`);
    console.log(`  Max: ${maxFrontend}ms`);
  }
  
  if (backendResults.length > 0) {
    const avgBackend = backendResults.reduce((sum, r) => sum + r.duration, 0) / backendResults.length;
    const maxBackend = Math.max(...backendResults.map(r => r.duration));
    console.log(`Backend API (Direct):`);
    console.log(`  Average: ${avgBackend.toFixed(0)}ms`);
    console.log(`  Max: ${maxBackend}ms`);
  }
  
  console.log('\nPerformance Thresholds:');
  console.log('  < 500ms: Excellent');
  console.log('  500-1000ms: Good');
  console.log('  1000-2000ms: Acceptable');
  console.log('  > 2000ms: Slow (needs optimization)');
  console.log('  > 5000ms: Very Slow (critical issue)');
}

runTests().catch(console.error);





