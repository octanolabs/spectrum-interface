import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset'

Vue.use(Vuetify)

const options = {
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#00ea90'
      }
    }
  }
}

export default new Vuetify({
  preset,
  ...options
})
