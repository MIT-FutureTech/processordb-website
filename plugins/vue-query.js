import { defineNuxtPlugin } from '#app';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

export default defineNuxtPlugin({
  name: 'vue-query',
  mode: 'client', // Only run on client side to avoid SSR issues
  setup(nuxtApp) {
    // Ensure we're on the client
    if (process.server) {
      return;
    }
    
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 300000, // Cache data for 5 minutes
        },
      },
    });

    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });
  }
});
