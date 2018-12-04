import Vue from 'vue'
import Vuetify, { directives } from 'vuetify/lib'
// import 'vuetify/src/stylus/app.styl'
import * as icons from './icons'

const { Scroll, Ripple, Resize } = directives

Vue.use(Vuetify, {
  directives: {
    Ripple,
    Resize,
    Scroll
  },
  theme: {
    primary: '#2196F3',
    accent: '#42A5F5',
    secondary: '#757575',
    info: '#1976D2',
    warning: '#ffab00',
    error: '#D50000',
    success: '#00C853'
  },
  customProperties: true,
  options: {
    cspNonce: process.env.VUE_APP_NONCE_VUETIFY,
    svgIcons: Object.freeze(icons)
  }
})
