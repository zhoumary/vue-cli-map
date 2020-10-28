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
    <!-- <el-row>
        <el-col class="amap-wrapper" id="searchMap" :span="16">
            <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
        </el-col>
    </el-row> -->
    <el-row class="amap-page-container">
        <el-col class="amap-wrapper" id="searchMap" :span="16">
            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
            <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo">
                <el-amap-marker v-for="(marker, index) in markers" :position="marker" :key="index"></el-amap-marker>
            </el-amap>
        </el-col>
    </el-row>
  </div>
</template>

<script>
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
      screenWidth (val) {
        this.screenWidth = val;
        const searchMap = document.getElementById("searchMap");
        const appHeight = parseInt(window.innerHeight);
        const headerHeight = parseInt(document.getElementsByClassName("hello")[0].clientHeight);
        const searchHeight = parseInt(document.getElementsByClassName("search")[0].clientHeight);
        searchMap.style.height = (appHeight - 16 - headerHeight - 40 - searchHeight).toString() + "px";
      }
  },
  data: function() {
    return {
      city: this.$route.params.city || "",
      screenWidth: document.body.clientWidth,
      markers: [],
      searchOption: {
        city: this.city ? this.city : this.$route.params.city,
        citylimit: true,
        
      },
      mapCenter: [121.59996, 31.197646]
    }
  },
  mounted: function() {
    const searchMap = document.getElementById("searchMap");
    const appHeight = parseInt(window.innerHeight);
    const headerHeight = parseInt(document.getElementsByClassName("hello")[0].clientHeight);
    const searchHeight = parseInt(document.getElementsByClassName("search")[0].clientHeight);
    searchMap.style.height = (appHeight - 16 - headerHeight - 40 - searchHeight - 40).toString() + "px";
  },
  methods: {
    search: function() {
      console.log(this.city);
    },
    addMarker: function() {
        let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
        let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
        this.markers.push([lng, lat]);
    },
    onSearchResult(pois) {
        let latSum = 0;
        let lngSum = 0;
        if (pois.length > 0) {
        pois.forEach(poi => {
            let {lng, lat} = poi;
            lngSum += lng;
            latSum += lat;
            this.markers.push([poi.lng, poi.lat]);
        });
        let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
        };
        this.mapCenter = [center.lng, center.lat];
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
