export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-plotly", "shadcn-nuxt"],
  css: ["@/assets/css/main.css"],

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL,
      backendUrl: process.env.BACKEND_URL
    }
  },

  tailwindcss: {
    exposeConfig: true,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    optimizeDeps: {
      include: ["plotly.js-dist-min"]
    },
    build: {
      target: 'es2015',
      minify: 'esbuild',
      sourcemap: false,

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("vue")) {
                return "vue";
              }
              if (id.includes("plotly")) {
                return "plotly";
              }
              if (id.includes("highcharts")) {
                return "highcharts";
              }
              if (id.includes("jspdf")) {
                return "jspdf";
              }
              if (id.includes("xlsx")) {
                return "xlsx";
              }
              return "vendor";
            }
          }
        }
      }
    }
  },

  plugins: [
    { src: '~/plugins/highcharts.client.js', mode: 'client' },
    { src: '~/plugins/oh-vue-icons.js', mode: 'client' },
  ],

  routeRules: {
    '/database': {
      swr: true,
      cache: {
        maxAge: 60,
      },
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'ProcessorDB - CPU Database and Comparison',
      meta: [
        { name: 'description', content: 'Comprehensive database of CPU specifications and comparisons' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:title', content: 'ProcessorDB - CPU Database and Comparison' },
        { property: 'og:description', content: 'Comprehensive database of CPU specifications and comparisons' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/cpu.png", sizes: "32x32" }
      ]
    }
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  build: {
    transpile: ['oh-vue-icons']
  },

  nitro: {
    compressPublicAssets: true,
  },

  compatibilityDate: "2024-10-15"
});
