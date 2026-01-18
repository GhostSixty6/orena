// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-18',
  devtools: { enabled: true },
  srcDir: './src',

  modules: ['@nuxt/ui'],

  devServer: {
    port: 8081,
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  typescript: {
    tsConfig: {
      extends: 'tsconfig/nuxt.json',
    },

    typeCheck: true,
  },

  app: {
    layoutTransition: {
      name: 'slide-right',
      mode: 'out-in',
    },
  },

  css: ['~/assets/scss/main.scss'],
});
