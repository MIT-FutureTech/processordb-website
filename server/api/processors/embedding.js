import { defineEventHandler, createError, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  // Skip during prerender
  if (import.meta.prerender) {
    console.log('[Processors Embedding API] Skipping during build/prerender');
    return { processors: [], clusters: [] };
  }

  try {
    // Check feature flag
    const config = useRuntimeConfig();
    if (!config.public.enableGalaxy) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Galaxy visualization is disabled'
      });
    }

    // Check for cache-busting parameter
    const query = getQuery(event);
    const forceRefresh = query.refresh === 'true' || query.nocache === 'true';

    // Set HTTP cache headers
    if (forceRefresh) {
      event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      event.node.res.setHeader('Pragma', 'no-cache');
      event.node.res.setHeader('Expires', '0');
    } else {
      // Cache embedding results for 1 hour (changes infrequently)
      event.node.res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      event.node.res.setHeader('Vary', 'Accept');
    }

    // Fetch from backend API
    let backendUrl = config.public.backendUrl || 'http://localhost:3001';
    backendUrl = backendUrl.replace(/\/$/, '');
    const apiPrefix = backendUrl.endsWith('/api') ? '' : '/api';
    const url = `${backendUrl}${apiPrefix}/processors/embedding`;

    console.log(`[Processors Embedding API] Fetching from backend: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw createError({
        statusCode: response.status,
        statusMessage: `Backend API error: ${errorText}`
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Processors Embedding API] Error:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch processor embedding'
    });
  }
});





