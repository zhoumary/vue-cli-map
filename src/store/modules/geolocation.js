import geolocation from '../../api/geolocation'

// initial state
const state = () => ({
    geolocation: ""
})
  
// getters
const getters = {
    geoLocaton: (state) => {
        return state.geolocation;
    }
}

// actions
const actions = {
  getGeolocation ({ commit }, {placeName, router, topath}) {
    geolocation.getGeolocation(
      placeName,
      (geocode) => commit('setGeolocation', {"geolocation": geocode, "router": router, "topath": topath}),
      () => commit('setGeolocation', {"geolocation": '', "router": router, "topath": topath})
    );
  }
}

// mutations
const mutations = {
  setGeolocation (state, {geolocation, router, topath}) {
    state.geolocation = geolocation
    if (geolocation && router) {
      router.push(topath + geolocation);
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}