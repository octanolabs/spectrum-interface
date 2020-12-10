import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset'

Vue.use(Vuetify)

const options = {
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#6fceb7',
        secondary: '#e76754',
      },
    },
  },
}

export default new Vuetify({
  preset,
  ...options,
})
