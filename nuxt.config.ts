export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: ["@nuxtjs/tailwindcss", "nuxt-plotly"],
  css: ["@/assets/css/main.css"],
  alias: {
    components: './components',
    utils: './lib/utils'
  },

  // Dev server configuration
  devServer: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: 'localhost',
    https: false
  },
  
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      ignore: ['**/ui/**']
    }
  ],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL,
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3001',
      enableGalaxy: process.env.NUXT_PUBLIC_ENABLE_GALAXY === 'true' || false
    }
  },

  tailwindcss: {
    exposeConfig: false,
  },

  // PostCSS is handled automatically by @nuxtjs/tailwindcss module
  // Removing explicit config to avoid conflicts with import.meta
  // postcss: {
  //   plugins: {
  //     tailwindcss: {},
  //     autoprefixer: {},
  //   },
  // },

  vite: {
    define: {
      // Workaround for crypto.hash issue in @vitejs/plugin-vue 5.0.0
      'global': 'globalThis',
      // Fix for import.meta issue in PostCSS/Tailwind
      'import.meta.dev': 'false',
      'import.meta.prod': 'true',
      'import.meta.client': 'true',
      'import.meta.server': 'false',
    },
    optimizeDeps: {
      include: [
        "plotly.js-dist-min",
        "oh-vue-icons",
        "oh-vue-icons/icons",
        "highcharts",
        "highcharts-vue",
        "exceljs",
        "jspdf",
        "file-saver",
        "jszip"
      ],
      // Exclude TanStack Query from optimization to prevent class inheritance issues
      exclude: ['@tanstack/vue-query', '@tanstack/query-core'],
      esbuildOptions: {
        target: 'es2020', // Match build target
        keepNames: true // Preserve class names to avoid minification issues
      },
      // Force re-optimization of oh-vue-icons to include all icon modules
      force: process.env.NODE_ENV === 'development' ? ['oh-vue-icons'] : undefined
    },
    build: (() => {
      const isProduction = process.env.NODE_ENV === 'production';
      const buildConfig: any = {
        target: 'es2020',
        // Disable minification completely to prevent class inheritance issues
        // TanStack Query and other libraries break with minification
        minify: false,
        sourcemap: true,
        chunkSizeWarningLimit: 1000,
        commonjsOptions: {
          include: [/node_modules/],
          transformMixedEsModules: true
        },
        rollupOptions: {
          output: {
            // Preserve class names in output
            generatedCode: {
              constBindings: true
            },
            // Preserve function and class names in chunk names
            chunkFileNames: '[name]-[hash].js',
            entryFileNames: '[name]-[hash].js',
            assetFileNames: '[name]-[hash].[ext]',
            manualChunks(id: string) {
              // Split large dependencies into separate chunks to avoid 43MB bundle
              if (id.includes("node_modules")) {
                // Core Vue ecosystem - keep together
                if (id.includes("vue") || id.includes("vue-router") || id.includes("@vue")) {
                  return "vue-core";
                }
                
                // TanStack Query - keep separate and unminified
                // This library has class inheritance that breaks with minification
                if (id.includes("@tanstack/vue-query") || id.includes("@tanstack/query")) {
                  return "vue-query";
                }
                
                // Large charting libraries - split separately (these are huge)
                if (id.includes("highcharts")) {
                  return "highcharts";
                }
                if (id.includes("plotly")) {
                  return "plotly";
                }
                
                // Export libraries - split separately (large, used only in PrivateTable)
                if (id.includes("exceljs")) {
                  return "exceljs";
                }
                if (id.includes("jspdf")) {
                  return "jspdf";
                }
                if (id.includes("jszip")) {
                  return "jszip";
                }
                if (id.includes("file-saver")) {
                  return "file-saver";
                }
                
                // UI libraries - group together
                if (id.includes("oh-vue-icons")) {
                  return "oh-vue-icons";
                }
                if (id.includes("radix-vue") || id.includes("shadcn") || id.includes("lucide")) {
                  return "ui-components";
                }
                if (id.includes("primevue") || id.includes("@primevue")) {
                  return "primevue";
                }
                
                // CSS/build tools - group together (small)
                if (id.includes("tailwind") || id.includes("postcss") || id.includes("autoprefixer") || id.includes("clsx")) {
                  return "css-utils";
                }
                
                // Everything else goes into vendor chunk
                return "vendor";
              }
            }
          }
        }
      };

      // Only add terserOptions in production
      if (isProduction) {
        buildConfig.terserOptions = {
          keep_classnames: true,
          keep_fnames: true,
          safari10: true, // Fix for Safari 10+ compatibility
          compress: {
            keep_classnames: true,
            keep_fnames: true,
            passes: 1, // Reduce passes to avoid breaking class inheritance
            drop_console: false, // Keep console for debugging
            // Disable ALL optimizations that could break class inheritance and dynamic function calls
            collapse_vars: false,
            reduce_vars: false,
            inline: false,
            unused: false, // Critical: don't remove unused code (might break dynamic imports)
            dead_code: false, // Critical: don't remove dead code
            conditionals: false, // Don't optimize conditionals
            evaluate: false, // Don't evaluate constant expressions
            loops: false, // Don't optimize loops
            hoist_funs: false, // Don't hoist functions
            hoist_vars: false, // Don't hoist variables
            if_return: false, // Don't optimize if-return
            join_vars: false, // Don't join var declarations
            sequences: false, // Don't optimize sequences
            properties: false, // Don't optimize property access
            drop_debugger: false
          },
          mangle: false, // CRITICAL: Disable mangling completely to preserve all names
          format: {
            comments: false,
            preserve_annotations: true,
            ascii_only: false // Allow non-ASCII characters
          }
        };
      }

      return buildConfig;
    })(),
    server: {
      fs: {
        strict: true,
      },
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/.nuxt/**',
          '**/.output/**',
          '**/coverage/**',
          '**/test-results/**',
          '**/playwright-report/**',
          '**/30000/**',
          '**/.git/**',
          '**/dist/**'
        ]
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        overlay: true
      }
    }
  },

  plugins: [
    { src: '~/plugins/oh-vue-icons.js', mode: 'client' },
    { src: '~/plugins/highcharts.client.js', mode: 'client' },
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
    },
    '/galaxy': {
      ssr: false, // Client-side only for 3D visualization
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff'
      }
    },
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


  build: {
    transpile: ['oh-vue-icons']
  },

  nitro: {
    compressPublicAssets: true,
    serveStatic: true,
    experimental: {
      wasm: true
    },
    prerender: {
      crawlLinks: false,
      ignore: ['/api/**']
    }
  },

  experimental: {
    appManifest: false
  },

  compatibilityDate: "2024-10-15"
});
