import config from './params/config.json'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s',
    title: config.title || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: config.description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: config.favicon }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/apexcharts.js',
    '~plugins/notifications.js',
    '~plugins/qrcode.js',
    '~plugins/smoothreflow.js',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/router-extras',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   *  Global App-wide variables
   *
   */
  env: {
    config: {
      apiUrl: config.api + '/v4/',
      rpcUrl: config.rpc,
      pollData: 30000, // interval to poll api, in ms
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // baseURL: 'http://185.243.113.40:8181/v2'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/scss/style.scss'],
    theme: config.theme,
  },
  /*
   ** moment module configuration
   ** https://github.com/nuxt-community/moment-module
   */
  moment: {
    defaultTimezone: 'Etc/UTC',
    timezone: {
      matchZones: ['Etc/UTC'],
      startYear: 2000,
      endYear: 2030,
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
