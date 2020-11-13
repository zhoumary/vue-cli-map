import geolocation from '../../api/geolocation'
import recursion from '../../utils/recursion'

// initial state
const state = () => ({
  geolocation: '',
  distance: 0,
  routingVisible: false,
  isLoading: false
})

// getters
const getters = {
  geoLocaton: (state) => {
    return state.geolocation
  },
  isRouting: state => {
    return state.routingVisible
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
  },
  openLoading ({ commit }) {
    commit('setLoading', { loadingVisible: true })
  },
  closeLoading ({ commit }) {
    commit('setLoading', { loadingVisible: false })
  },
  getDrivingRouting ({ commit }, { startPoint, restPoints, selectedPoints, sortedPoints, driving }) {
    recursion.minDistance(
      startPoint,
      restPoints,
      selectedPoints,
      sortedPoints,
      driving,
      (planningVisible) => commit('setRoutingVisible', { dialogVisible: planningVisible })
    )
  },
  openDrivingRouting ({ commit }) {
    commit('setRoutingVisible', { dialogVisible: true })
  },
  closeDrivingRouting ({ commit }) {
    commit('setRoutingVisible', { dialogVisible: false })
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
  },
  setRoutingVisible (state, { dialogVisible }) {
    if (dialogVisible) {
      state.isLoading = false
    }
    state.routingVisible = dialogVisible
  },
  setLoading (state, { loadingVisible }) {
    state.isLoading = loadingVisible
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
