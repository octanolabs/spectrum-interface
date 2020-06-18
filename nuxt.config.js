export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/style.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  // Vuetify is probably useless here and as a plugin
  plugins: [
    '~plugins/vuetify.js',
    '~plugins/apexcharts.js',
    '~plugins/perfectscrollbar.js',
    '~plugins/smoothreflow.js',
    '~plugins/notifications.js',
    '~plugins/qrcode.js',
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
      apiUrl: 'http://185.243.113.40:8181/v4/',
      rpcUrl: 'https://rpc1.ubiqscan.io/',
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
    // treeShake: true,
    customVariables: ['~/assets/scss/style.scss'],
    optionsPath: '~plugins/vuetify.js',
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
