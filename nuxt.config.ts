// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-plotly", "shadcn-nuxt"],
  css: ["@/assets/css/main.css"],

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },

  tailwindcss: {
    exposeConfig: true,
  },

  vite: {
    optimizeDeps: {
      include: ["plotly.js-dist-min"]
    }
  },

  plugins: [
    { src: '~/plugins/highcharts.client.js', mode: 'client' },
    { src: '~/plugins/oh-vue-icons.js', mode: 'client' }
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
    minify: true
  },

  compatibilityDate: "2024-10-15"
})