import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

export default {
  getGeolocation (placeName, cb, errorCb) {
    const getGeoLocationUrl = 'https://restapi.amap.com/v3/geocode/geo?address=' + placeName + '&key=' + 'your web api key'

    Vue.axios.get(getGeoLocationUrl)
      .then((response) => {
        const data = response.data
        const geocodes = data && data.geocodes
        if (geocodes && geocodes.length !== 0) {
          const geocode = geocodes[0].location
          geocode ? cb(geocode) : errorCb('')
        } else {
          errorCb('')
        }
      })
      .catch((err) => {
        console.log(err)
        errorCb('')
      })
  },
  getDistance (startPosition, endPosition, cb, errorCb) {
    const getDistanceUrl = 'https://restapi.amap.com/v3/geocode/geo?origin=' + startPosition + '&destination=' + endPosition + '&key=' + '29b3305fe75feb8d14d4190c932ba7c9'

    Vue.axios.get(getDistanceUrl)
      .then((response) => {
        const data = response.data
        const routePaths = data && data.route.paths
        if (routePaths && routePaths.length !== 0) {
          const distance = routePaths[0].distance
          distance ? cb(distance) : errorCb(0)
        } else {
          errorCb('')
        }
      })
      .catch((err) => {
        console.log(err)
        errorCb(0)
      })
  }
}
