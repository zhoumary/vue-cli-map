<template>
  <div>
    <el-row class="search">
      <el-col :span="6">
        <!-- <el-input
          placeholder="Please input start place"
          v-model="startPlace"
          clearable>
        </el-input> -->
        <el-amap-search-box class="search-start-box" ref="startPlaceSearch" :search-option="startPlaceOption" :on-search-result="onStartPlaceResult"></el-amap-search-box>
      </el-col>
    </el-row>
    <el-row class="search">
      <el-col :span="6">
        <el-input
          placeholder="Please input city"
          v-model="city"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button size="medium" type="primary" @click="search">Search</el-button>
      </el-col>
      <el-col :span="4" id="planning" v-if="selectedCont">
        <el-button size="medium" type="info" @click="plan">Planning</el-button>
      </el-col>
    </el-row>

    <el-row class="amap-page-container">
        <el-col class="amap-wrapper" id="searchMap" :span="12">
            <el-amap-search-box class="search-box" v-model="searchText" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
            <el-amap vid="amapDemo" :center="location" :zoom="12" class="amap-demo">
                <el-amap-marker
                  v-for="(marker, index) in markers"
                  :events="marker.events"
                  :position="marker.position"
                  :visible="marker.visible"
                  :draggable="marker.draggable"
                  :key="index">
                </el-amap-marker>
                <el-amap-text
                  v-for="marker in markers"
                  :key="marker.id"
                  :text="marker.num"
                  :offset=[-0.8,-20]
                  :position="marker.position"
                  :events="textsEvents">
                </el-amap-text>
                <el-amap-info-window
                  :position="currentWindow.position"
                  :content="currentWindow.content"
                  :visible="currentWindow.visible">
                </el-amap-info-window>
            </el-amap>
        </el-col>
        <el-col :span="6" v-if="poisCont">
          <MultipleSelectionTable
            id="results"
            :tableData="resultsTableData"
            :columns="resultsTableCols"
            :selectedData="getSelectedPoints" />
        </el-col>
    </el-row>

    <FullLoading v-show="isLoading" />
    <FullScreenDialog v-show="routingVisible" title="Driving Routing" dialogKey="planningDialog" @closedialog="closeDialog" />
  </div>
</template>

<script>
// NPM 方式
// import VueAMap from 'vue-amap'
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import MultipleSelectionTable from './table/multiSelectTable'
import FullScreenDialog from './dialog/FullScreenDialog'
import FullLoading from './loading/FullLoading'
// const amapManager = new VueAMap.AMapManager()
export default {
  name: 'Search',
  components: {
    MultipleSelectionTable,
    FullLoading,
    FullScreenDialog
  },
  props: {
    msg: String,
    cityName: String
  },
  watch: {
    '$route' (to) {
      this.city = to.params.city || ''
    }
  },
  computed: {
    ...mapState('geolocation', ['location', 'routingVisible', 'isLoading']),
    ...mapGetters('geolocation', {
      currGeolocation: 'geoLocaton',
      isrouting: 'isRouting'
    })
  },
  data: function () {
    return {
      startPlace: '',
      startPoint: null,
      city: this.$route.params.city || '',
      searchText: '',
      geolocation: this.$route.params.location,
      screenWidth: document.body.clientWidth,
      poisCont: 0,
      currPois: [],
      markers: [],
      resultsTableData: [],
      resultsTableCols: [],
      selectedCont: 0,
      selectedData: [],
      currentWindow: {
        id: '',
        num: 0,
        position: [0, 0],
        content: '',
        visible: false
      },
      infoWindows: [],
      textsEvents: {},
      searchOption: {
        city: this.$route.params.city,
        citylimit: true
      },
      startPlaceOption: {
        city: this.startPlace,
        citylimit: true
      },
      placesOrder: [],
      showDialog: false
      // amapManager,
      // zoom: 12,
      // routingCenter: [116.397428, 39.90923],
      // events: {
      //   init (o) {}
      // }
    }
  },
  mounted: function () {
    const searchMap = document.getElementById('searchMap')
    const appHeight = parseInt(window.innerHeight)
    const headerHeight = parseInt(document.getElementsByClassName('hello')[0].clientHeight)
    const searchHeight = parseInt(document.getElementsByClassName('search')[0].clientHeight)
    searchMap.style.height = (appHeight - 16 - headerHeight - 40 - searchHeight - 40).toString() + 'px'

    // from city to get geolocation
    const payload = {
      placeName: this.city,
      router: '',
      topath: ''
    }
    this.$store.dispatch('geolocation/getGeolocation', payload)

    // set resultTableCols
    this.resultsTableCols = [
      {
        id: '1',
        label: '',
        prop: '',
        type: 'index',
        formatter: null
      },
      {
        id: '2',
        label: '搜索结果',
        prop: '',
        type: '',
        formatter: (row) => { return row.content }
      }
    ]

    // set textsEvents style
    this.textsEvents = {
      init (o) {
        o.setStyle({
          background: '#fff0',
          border: '0px',
          padding: '30px 15px',
          fontSize: 'small',
          fontWeight: 600
        })
      }
    }
  },
  updated: function () {
    this.searchOption.city = this.city

    // according to results table height to change map height
    const resultDom = document.getElementById('results')
    const searchMap = document.getElementById('searchMap')
    if (resultDom && searchMap) {
      searchMap.style.height = resultDom.style.height
    }
  },
  methods: {
    search: function () {
      // from city to get geolocation
      const payload = {
        placeName: this.city,
        router: '',
        topath: ''
      }
      this.$store.dispatch('geolocation/getGeolocation', payload)
    },
    onSearchResult: function (pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        const that = this
        const isPoisEqual = pois.every((val, index) => {
          return (val === that.currPois[index])
        })
        if (!isPoisEqual) {
          this.poisCont = 0
          this.markers.length = 0
          this.currPois.length = 0
          this.currPois = pois
          this.resultsTableData.length = 0
          this.infoWindows.length = 0
          this.currentWindow = {
            id: '',
            num: 0,
            position: [0, 0],
            content: '',
            visible: false
          }
        }

        if (this.currentWindow.position[0] + this.currentWindow.position[1] === 0 && this.currentWindow.content === '') {
          this.currentWindow = {
            position: [pois[0].lng, pois[0].lat],
            content: pois[0].name,
            visible: true,
            id: pois[0].id,
            num: 0
          }
        }

        pois.forEach((poi, index) => {
          const oneMarker = {}
          const oneInfoWindow = {}
          const oneResultData = {}
          const { lng, lat, id, name, address, type } = poi
          lngSum += lng
          latSum += lat
          oneMarker.num = (index + 1).toString()
          oneMarker.position = [lng, lat]
          oneMarker.id = id
          oneMarker.visible = true
          oneMarker.draggable = false

          oneInfoWindow.visible = false
          oneInfoWindow.position = [lng, lat]
          oneInfoWindow.id = id
          oneInfoWindow.num = index
          oneInfoWindow.content = name

          oneResultData.id = id
          oneResultData.num = index + 1
          oneResultData.content = name + '\n' + address + '\n' + type
          oneResultData.point = [lng, lat]

          oneMarker.events = {
            click: () => {
              that.currentWindow.visible = false
              that.currentWindow = that.infoWindows[index]
              that.$nextTick(() => {
                that.currentWindow.visible = true
              })
            }
          }

          that.markers.push(oneMarker)
          that.infoWindows.push(oneInfoWindow)
          that.resultsTableData.push(oneResultData)
        })

        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.poisCont = this.markers.length
        const payload = {
          areaCenter: center
        }
        this.$store.dispatch('geolocation/getAreaCenter', payload)
      }
    },
    onStartPlaceResult: function (pois) {
      if (pois.length > 0) {
        // set the first location from pois to startPlace's location
        const firstPoi = pois[0]
        const lat = firstPoi.lat
        const lng = firstPoi.lng
        this.startPoint = [lng, lat]
      } else {
        // set the startPlace's location is null
        this.startPoint = null
      }
    },
    // accept the selected result
    getSelectedPoints: function (selected) {
      this.selectedData = selected
      this.selectedCont = selected.length
    },
    getPointsDistance: function (payload) {
      const getDistanceUrl = 'https://restapi.amap.com/v3/direction/driving?origin=' + payload.startPoint[0] + ',' + payload.startPoint[1] + '&destination=' + payload.endPoint[0] + ',' + payload.endPoint[1] + '&key=' + '29b3305fe75feb8d14d4190c932ba7c9'
      return Vue.axios.get(getDistanceUrl)
    },
    plan: function () {
      // show loading
      const loadingDOM = document.getElementsByClassName('fullLoading')
      if (loadingDOM && loadingDOM.length) {
        loadingDOM[0].style.height = (window.innerHeight).toString() + 'px'
        loadingDOM[0].style.marginTop = (-window.innerHeight).toString() + 'px'
        loadingDOM[0].style.lineHeight = (window.outerHeight).toString() + 'px'
      }
      this.$store.dispatch('geolocation/openLoading')

      // clear routing map and panel before planningDialog
      let routingMap = document.getElementById('container')
      if (!routingMap) {
        const dialogContent = document.getElementsByClassName('el-dialog el-dialog--center')
        if (dialogContent.length) {
          routingMap = document.createElement('div')
          routingMap.setAttribute('id', 'container')
          dialogContent[0].appendChild(routingMap)
          dialogContent[0].setAttribute('style', 'width: 95%; margin-top: 0px !important;')
          routingMap.setAttribute('style', 'width: 95%; margin: 25px; margin-top: 0px !important; margin-left:40px;')

          const panelDiv = document.createElement('div')
          panelDiv.setAttribute('id', 'panel')
          routingMap.appendChild(panelDiv)

          panelDiv.setAttribute('style', 'position: relative; float: right; background-color: white; right: 10px; width: 280px; z-index: 1; max-height: 66%; overflow-y: auto;')

          const panelDivAmapCall = panelDiv.getElementsByClassName('amap-call')
          panelDivAmapCall.forEach(amapCall => {
            amapCall.style.backgroundColor = '#009cf9'
            amapCall.style.borderTopLeftRadius = '4px'
            amapCall.style.borderTopRightRadius = '4px'
          })

          const panelDivAmapDriving = panelDiv.getElementsByClassName('amap-lib-driving')
          panelDivAmapDriving.forEach(amapDriving => {
            amapDriving.style.overflow = 'hidden'
            amapDriving.style.borderTopLeftRadius = '4px'
            amapDriving.style.borderTopRightRadius = '4px'
          })
        }
      }

      const that = this
      const selections = this.selectedData
      const routingCenter = [0, 0]
      if (selections.length) {
        let lngSum = 0
        let latSum = 0
        selections.forEach((poi) => {
          const { point } = poi
          lngSum += point[0]
          latSum += point[1]
        })
        const center = {
          lng: lngSum / selections.length,
          lat: latSum / selections.length
        }
        routingCenter.push(center.lng)
        routingCenter.push(center.lat)
      }
      // 基本地图加载
      const map = new AMap.Map('container', {
        resizeEnable: true,
        center: [routingCenter[2], routingCenter[3]], // 地图中心点
        zoom: 10 // 地图显示的缩放级别
      })

      // 构造路线导航类
      const driving = new AMap.Driving({
        map: map,
        panel: 'panel'
      })

      if (!this.$refs.startPlaceSearch._data.keyword) {
        this.startPoint = null
      }

      // 如若没有填写出发地，根据筛选出来的地点进行出行地点排序，并且已第一个地点为起始点和终点
      if (this.startPoint) {
        if (selections.length > 1) {
          // 提取所有地点的位置信息
          const selectionPoints = selections.map((selection, index) => {
            return selection.point
          })

          const restPoints = selectionPoints.slice(0)

          const payload = {
            startPoint: this.startPoint,
            defaultStartPoint: this.startPoint,
            restPoints: restPoints,
            selectedPoints: selectionPoints,
            sortedPoints: [],
            driving: driving
          }
          // show dialog
          this.$store.dispatch('geolocation/getDrivingRouting', payload)
        } else {
          // show loading
          const loadingDOM = document.getElementsByClassName('fullLoading')
          if (loadingDOM && loadingDOM.length) {
            loadingDOM[0].style.height = (window.innerHeight).toString() + 'px'
            loadingDOM[0].style.marginTop = (-window.innerHeight).toString() + 'px'
            loadingDOM[0].style.lineHeight = (window.outerHeight).toString() + 'px'
          }
          this.$store.dispatch('geolocation/openLoading')

          // 根据起终点经纬度规划驾车导航路线，仅针对只有两个地方的情况
          driving.search(new AMap.LngLat(that.startPoint[0], that.startPoint[1]), new AMap.LngLat(that.selectedData[0].point[0], that.selectedData[0].point[1]), function (status, result) {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
              // show dialog
              that.$store.dispatch('geolocation/closeLoading')
              that.$store.dispatch('geolocation/openDrivingRouting')
              const routingDOM = document.getElementById('container')
              const searchMap = document.getElementById('searchMap')
              routingDOM.style.height = searchMap.offsetHeight.toString() + 'px'
            } else {
              alert('获取驾车数据失败：' + result)
              // close dialog
              that.$store.dispatch('geolocation/closeDrivingRouting')
            }
          })
        }
      } else {
        if (selections.length > 2) {
          // 提取所有地点的位置信息，并提取出第一个点
          const selectionPoints = selections.map((selection, index) => {
            return selection.point
          })

          // 以第一个点为起始点，延伸至其它各点，得到距离最近的点作为第二个点，以此递推找到经历所有点的一条路线
          const restPoints = selectionPoints.slice(0)
          restPoints.shift()
          const firstPoint = selectionPoints[0]

          const payload = {
            startPoint: firstPoint,
            defaultStartPoint: null,
            restPoints: restPoints,
            selectedPoints: selectionPoints,
            sortedPoints: [],
            driving: driving
          }
          // show dialog
          this.$store.dispatch('geolocation/getDrivingRouting', payload)
        } else {
          // show loading
          const loadingDOM = document.getElementsByClassName('fullLoading')
          if (loadingDOM && loadingDOM.length) {
            loadingDOM[0].style.height = (window.innerHeight).toString() + 'px'
            loadingDOM[0].style.marginTop = (-window.innerHeight).toString() + 'px'
            loadingDOM[0].style.lineHeight = (window.outerHeight).toString() + 'px'
          }
          this.$store.dispatch('geolocation/openLoading')

          // 根据起终点经纬度规划驾车导航路线，仅针对只有两个地方的情况
          driving.search(new AMap.LngLat(that.selectedData[0].point[0], that.selectedData[0].point[1]), new AMap.LngLat(that.selectedData[1].point[0], that.selectedData[1].point[1]), function (status, result) {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
              // show dialog
              that.$store.dispatch('geolocation/closeLoading')
              that.$store.dispatch('geolocation/openDrivingRouting')
              const routingDOM = document.getElementById('container')
              const searchMap = document.getElementById('searchMap')
              routingDOM.style.height = searchMap.offsetHeight.toString() + 'px'
            } else {
              alert('获取驾车数据失败：' + result)
              // close dialog
              that.$store.dispatch('geolocation/closeDrivingRouting')
            }
          })
        }
      }
    },
    closeDialog: function (params) {
      // remove the drive routing map
      const containerDOM = document.getElementById('container')
      containerDOM && containerDOM.remove()

      // close dialog
      this.$store.dispatch('geolocation/closeDrivingRouting')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search {
  margin-bottom: 15px;
}
.el-row {
  margin-left: 20px;
  margin-right: 20px;
  display: flex !important;
  justify-content: center;
}
.el-col-6 {
  display: flex;
  margin-left: 300px;
}
.el-vue-search-box-container.search-start-box {
  width: 100% !important;
  height: 40px !important;
  box-shadow: 0 0px 1.2px #303133 !important;
}
.el-col-6 {
  margin-left: 15px;
}
.amap-wrapper {
  width: 100%;
}

.search-box {
  position: absolute;
  top: 25px;
  left: 20px;
}
#searchRouting {
  height: 500px;
}

.amap-page-container {
  margin-top: 20px;
}

#fullLoading {
  position: fixed;
  width: 100%;
  background-color: rgb(53 49 49 / 30%);
  z-index: 1000;
  text-align: center;
  color: #e0e3e8;
  font-size: xxx-large;
  font-weight: 800;
  font-style: oblique;
  letter-spacing: 4px;
  bottom: 0;
  left: 0;
}

.el-dialog__wrapper {
  position: fixed;
  padding-top: 4.5%;
  background-color: rgb(53 49 49 / 30%);
  z-index: 999;
}
.el-dialog__wrapper.el-dialog--center {
  margin-top: 0px !important;
}
#container {
  width: 98%;
  margin: 25px;
}
#panel {
  float: right;
  position: relative;
  background-color: white;
  max-height: 66%;
  overflow-y: auto;
  right: 10px;
  width: 280px;
  z-index: 1;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>
