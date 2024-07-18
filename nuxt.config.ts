// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || "",
  },
  modules: ["nuxt-quasar-ui", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
  quasar: {
    extras: {
      fontIcons: ["eva-icons"],
    },
    iconSet: "eva-icons",
    plugins: ["Notify"],
    cssAddon: true,

    config: {
      dark: false,
      brand: {
        primary: "#027be3",
      },
    },
  },
});
