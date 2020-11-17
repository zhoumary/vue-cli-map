import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import multiDriving from './multiDriving'

Vue.use(VueAxios, axios)

export default {
  minDistance (startPoint, defaultStartPoint, restPoints, points, sortingPoints, driving, cb) {
    if (restPoints.length < 2) {
      return []
    }

    const restPointsPromises = []
    restPoints.forEach(restPoint => {
      const getDistanceUrl = 'https://restapi.amap.com/v3/direction/driving?origin=' + startPoint[0] + ',' + startPoint[1] + '&destination=' + restPoint[0] + ',' + restPoint[1] + '&key=' + '29b3305fe75feb8d14d4190c932ba7c9'
      restPointsPromises.push(Vue.axios.get(getDistanceUrl))
    })

    if (restPointsPromises.length) {
      Promise.all(restPointsPromises)
        .then(responses => {
          const distances = responses.map(response => {
            const data = response.data
            const routePaths = data && data.route.paths
            if (routePaths && routePaths.length) {
              return parseFloat(routePaths[0].distance, 10)
            }
          })

          if (distances.length) {
            const minDistanceIndex = distances.indexOf(Math.min(...distances))
            sortingPoints.push(restPoints[minDistanceIndex])
            restPoints.splice(minDistanceIndex, 1)
          }

          if (restPoints.length && restPoints.length === 1) {
            sortingPoints.push(restPoints[0])
            restPoints.length = 0
            defaultStartPoint ? multiDriving.drivingRoute(defaultStartPoint, sortingPoints, driving, cb) : multiDriving.drivingRoute(points[0], sortingPoints, driving, cb)
            return sortingPoints
          }
          if (restPoints.length && restPoints.length > 1) {
            this.minDistance(sortingPoints[sortingPoints.length - 1], defaultStartPoint, restPoints, points, sortingPoints, driving, cb)
          }
        })
        .catch(error => {
          alert(error)
        })
    }
  }
}
