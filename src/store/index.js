
import Vue from 'vue'
import Vuex from 'vuex'
import geolocation from './modules/geolocation'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    geolocation
  },
  strict: debug,
  plugins: debug ? [Vuex.createLogger()] : []
})
