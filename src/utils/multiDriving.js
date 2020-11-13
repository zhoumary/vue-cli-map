export default {
  drivingRoute (firstPoint, sortedPoints, driving, cb) {
    // 根据起终点经纬度规划驾车导航路线，针对大于两个地方的情况
    const points = sortedPoints.map(sortedPoint => {
      return new AMap.LngLat(sortedPoint[0], sortedPoint[1])
    })
    driving.search(new AMap.LngLat(firstPoint[0], firstPoint[1]), new AMap.LngLat(firstPoint[0], firstPoint[1]),
      { waypoints: points }, function (status, result) {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          // eslint-disable-next-line standard/no-callback-literal
          cb(true)
          const routingDOM = document.getElementById('container')
          const searchMap = document.getElementById('searchMap')
          routingDOM.style.height = searchMap.offsetHeight.toString() + 'px'
        } else {
          alert('获取驾车数据失败：' + result)
          // eslint-disable-next-line standard/no-callback-literal
          cb(false)
        }
      })
  }
}
