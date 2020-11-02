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
        <el-col class="amap-wrapper" id="searchMap" :span="16">
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
                <el-amap-info-window
                  :position="currentWindow.position"
                  :content="currentWindow.content"
                  :visible="currentWindow.visible"
                  :events="currentWindow.events">
                </el-amap-info-window>
            </el-amap>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import Vue from 'vue'

export default {
  name: 'Search',
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
    mapCenterGetter() {
      return this.$store.getters["geolocation/geoLocaton"] ? [this.$store.getters["geolocation/geoLocaton"].substring(0,this.$store.getters["geolocation/geoLocaton"].indexOf(",")), this.$store.getters["geolocation/geoLocaton"].substring(this.$store.getters["geolocation/geoLocaton"].indexOf(",") + 1)] : ["", ""];
    },
  },
  data: function() {
    return {
      city: this.$route.params.city || "",
      searchText: "",
      geolocation: this.$route.params.location,
      screenWidth: document.body.clientWidth,
      markers: [],
      currentWindow: {
        position: [0, 0],
        content: '',
        events: {},
        visible: false
      },
      searchOption: {
        city: this.$route.params.city,
        citylimit: true,
      },
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
  },
  updated: function () {
    this.mapCenter = this.mapCenterGetter;
    this.searchOption.city = this.city;
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
    addMarker: function() {
      let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
      let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
      this.markers.push([lng, lat]);
    },
    onSearchResult: function(pois) {
      console.log(pois);
      let latSum = 0;
      let lngSum = 0;
      let that = this;
      if (pois.length > 0) {
        if (that.currentWindow.position[0] + that.currentWindow.position[1] === 0 && this.currentWindow.content === "") {
          that.currentWindow = {
            position: [pois[0].lng, pois[0].lat],
            content: pois[0].name,
            events: {},
            visible: true
          }
        }

        pois.forEach((poi, index) => {
            let oneMarker = {};
            let {lng, lat} = poi;
            lngSum += lng;
            latSum += lat;
            oneMarker.position = [lng, lat];
            oneMarker.visible = true;
            oneMarker.draggable = false;

            oneMarker.events = {
              click: (e) => {
                that.currentWindow.visible = false;
                that.$nextTick(() => {
                  that.currentWindow = {
                    position: [e.lnglat.lng, e.lnglat.lat],
                    content: pois[index].name,
                    events: {}
                  };
                  that.currentWindow.visible = true;
                });
              }
            };

            that.markers.push(oneMarker);
        });

        let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
        };
        this.mapCenter = [center.lng, center.lat];
        console.log(this.markers);
      }
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
