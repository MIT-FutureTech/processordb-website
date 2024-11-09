// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-plotly", "shadcn-nuxt"],
  css: ["@/assets/css/main.css"],

  tailwindcss: {
    exposeConfig: true,
  },
  vite: {
    optimizeDeps: {
      include: ["plotly.js-dist-min"],
    },
  },
  plugins: [
    // Ensure this runs on client side only
    { src: '~/plugins/highcharts.client.js', mode: 'client' }
  ],
  routeRules: {
    '/database': {
      swr: true,
      cache: {
        maxAge: 60,
      },
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: "icon", type: "image/png", href: "/cpu.png",  sizes:"32x32" }
      ]
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  compatibilityDate: "2024-10-15"
})