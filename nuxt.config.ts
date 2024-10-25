// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["@/assets/css/main.css"],

  tailwindcss: {
    exposeConfig: true,
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

  compatibilityDate: "2024-10-15"
})