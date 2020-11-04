<template>
  <div>
    <el-row class="search">
      <el-col :span="10">
        <el-input
          placeholder="Please input city"
          v-model="city"
          clearable>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="medium" type="primary" @click="search">Search</el-button>
      </el-col>
    </el-row>
    <p v-show="currGeolocation">{{currGeolocation}}</p>
    <el-row class="amap-page-container">
        <el-col class="amap-wrapper" id="searchMap" :span="12">
            <el-amap-search-box class="search-box" v-model="searchText" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
            <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo">
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import MultipleSelectionTable from './table/multiSelectTable'

export default {
  name: 'Search',
  components: {
    MultipleSelectionTable
  },
  props: {
    msg: String,
    cityName: String
  },
  watch: {
      '$route' (to) {
        this.city = to.params.city || "";
      },
  },
  computed: {
    ...mapState({
      geoLocation: state => state.geolocation.geolocation
    }),
    ...mapGetters('geolocation', {
      currGeolocation: 'geoLocaton'
    }),
    mapCenterGetter: {
      get: function () {
        return this.$store.getters["geolocation/geoLocaton"] ? [this.$store.getters["geolocation/geoLocaton"].substring(0,this.$store.getters["geolocation/geoLocaton"].indexOf(",")), this.$store.getters["geolocation/geoLocaton"].substring(this.$store.getters["geolocation/geoLocaton"].indexOf(",") + 1)] : ["", ""];
      },
      set: function (v) {
        this.currMapCenter = v
      }
    },

  },
  data: function() {
    return {
      city: this.$route.params.city || "",
      searchText: "",
      geolocation: this.$route.params.location,
      screenWidth: document.body.clientWidth,
      poisCont: 0,
      currPois: [],
      markers: [],
      resultsTableData: [],
      resultsTableCols: [],
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
        citylimit: true,
      },
      currMapCenter: this.mapCenterGetter,
      mapCenter: [this.$route.params.location.substring(0,this.$route.params.location.indexOf(",")), this.$route.params.location.substring(this.$route.params.location.indexOf(",") + 1)]
    }
  },
  mounted: function() {
    const searchMap = document.getElementById("searchMap");
    const appHeight = parseInt(window.innerHeight);
    const headerHeight = parseInt(document.getElementsByClassName("hello")[0].clientHeight);
    const searchHeight = parseInt(document.getElementsByClassName("search")[0].clientHeight);
    searchMap.style.height = (appHeight - 16 - headerHeight - 40 - searchHeight - 40).toString() + "px";
  
    // from city to get geolocation
    const payload = {
      "placeName": this.city,
      "router": '',
      "topath": ''
    };
    this.$store.dispatch('geolocation/getGeolocation', payload);

    // set mapCenter to currMapCenter
    this.currMapCenter = this.mapCenter;

    // set resultTableCols
    this.resultsTableCols = [
      {
        "id": '1',
        "label": '',
        "prop": '',
        "type": 'index',
        "formatter": null
      },
      {
        "id": '2',
        "label": '搜索结果',
        "prop": '',
        "type": '',
        "formatter": (row) => {return row.content;}
      }
    ];

    // set textsEvents style
    this.textsEvents = {
      init(o) {
        o.setStyle({
          background: '#fff0',
          border: '0px',
          padding: '30px 15px',
          fontSize: 'small',
          fontWeight: 600
        });
      }
    };
  },
  updated: function () {
    this.mapCenter = this.currMapCenter[0] + this.currMapCenter[1] === this.mapCenterGetter[0] + this.mapCenterGetter[1] ? this.currMapCenter : this.mapCenterGetter;
    this.searchOption.city = this.city;

    // according to results table height to change map height
    const resultDom = document.getElementById("results");
    const searchMap = document.getElementById("searchMap");
    if (resultDom && searchMap) {
      searchMap.style.height = resultDom.style.height;
    }
  },
  methods: {
    search: function() {
      // from city to get geolocation
      const payload = {
        "placeName": this.city,
        "router": '',
        "topath": ''
      };
      this.$store.dispatch('geolocation/getGeolocation', payload);
    },
    onSearchResult: function(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        let that = this;
        const isPoisEqual = pois.every((val, index) => {
          return (val === that.currPois[index]);
        });
        if (!isPoisEqual) {
          this.poisCont = 0;
          this.markers.length = 0;
          this.currPois.length = 0;
          this.currPois = pois;
          this.resultsTableData.length = 0;
          this.infoWindows.length = 0;
          this.currentWindow = {
            id: '',
            num: 0,
            position: [0, 0],
            content: '',
            visible: false
          };
          this.mapCenter = [0, 0];
        }

        if (this.currentWindow.position[0] + this.currentWindow.position[1] === 0 && this.currentWindow.content === "") {
          this.currentWindow = {
            position: [pois[0].lng, pois[0].lat],
            content: pois[0].name,
            visible: true,
            id: pois[0].id,
            num: 0
          }
        }

        pois.forEach((poi, index) => {
            let oneMarker = {};
            let oneInfoWindow = {};
            let oneResultData = {};
            let {lng, lat, id, name, address, type} = poi;
            lngSum += lng;
            latSum += lat;
            oneMarker.num = (index + 1).toString();
            oneMarker.position = [lng, lat];
            oneMarker.id = id;
            oneMarker.visible = true;
            oneMarker.draggable = false;

            oneInfoWindow.visible = false;
            oneInfoWindow.position = [lng, lat];
            oneInfoWindow.id = id;
            oneInfoWindow.num = index;
            oneInfoWindow.content = name;

            oneResultData.id = id;
            oneResultData.num = index + 1;
            oneResultData.content = name + '\n' + address + '\n' + type;

            oneMarker.events = {
              click: () => {
                that.currentWindow.visible = false;
                that.currentWindow = that.infoWindows[index];
                // that.currentWindow = {
                //   position: [e.lnglat.lng, e.lnglat.lat],
                //   content: pois[index].name
                // };
                that.$nextTick(() => {
                  that.currentWindow.visible = true;
                });
              }
            };

            that.markers.push(oneMarker);
            that.infoWindows.push(oneInfoWindow);
            that.resultsTableData.push(oneResultData);
        });

        let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
        };
        this.poisCont = this.markers.length;
        this.mapCenterGetter = [0, 0];
        this.mapCenter = [center.lng, center.lat];
      }
    },
    // accept the selected result
    getSelectedPoints: function(selected) {
      this.selectedData = selected;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
  margin: 20px;
  display: flex !important;
  justify-content: center;
}
.el-col-10 {
    display: flex;
    margin-left: 300px;
}
.el-col-4 {
    display: flex;
    margin-left: 20px;
}
.amap-wrapper {
  width: 100%;
}

.search-box {
    position: absolute;
    top: 25px;
    left: 20px;
}
</style>
