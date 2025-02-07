import { defineNuxtPlugin } from '#app';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

export default defineNuxtPlugin({
  name: 'vue-query',
  parallel: true,
  setup(nuxtApp) {
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
