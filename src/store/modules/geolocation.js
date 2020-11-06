import geolocation from '../../api/geolocation'

// initial state
const state = () => ({
  geolocation: '',
  distance: 0
})

// getters
const getters = {
  geoLocaton: (state) => {
    return state.geolocation
  }
}

// actions
const actions = {
  getGeolocation ({ commit }, { placeName, router, topath }) {
    geolocation.getGeolocation(
      placeName,
      (geocode) => commit('setGeolocation', { geolocation: geocode, router: router, topath: topath }),
      () => commit('setGeolocation', { geolocation: '', router: router, topath: topath })
    )
  },
  getDistance ({ commit }, { startPoint, endPoint }) {
    geolocation.getDistance(
      startPoint,
      endPoint,
      (distance) => commit('setDistance', { distance: distance }),
      () => commit('setDistance', { distance: 0 })
    )
  }
}

// mutations
const mutations = {
  setGeolocation (state, { geolocation, router, topath }) {
    state.geolocation = geolocation
    if (geolocation && router) {
      router.push(topath + geolocation)
    }
  },
  setDistance (state, { distance }) {
    state.distance = distance
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
