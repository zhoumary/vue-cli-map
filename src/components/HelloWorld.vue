<template>
  <div>
    <el-row>
      <el-col :span="10">
        <el-input
          placeholder="Please input city"
          v-model="city"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-button class="search" size="medium" type="primary" @click="search">Search</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function () {
    return {
      city: '',
      geolocation: ''
    }
  },
  computed: {
    ...mapState({
      geoLocation: state => state.geolocation.geolocation
    })
  },
  methods: {
    search: function () {
      // from city to get geolocation
      const toPath = '/search/' + this.city + '/geolocation/'
      const payload = {
        placeName: this.city,
        router: this.$router,
        topath: toPath
      }
      this.$store.dispatch('geolocation/getGeolocation', payload)
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
.search {
  width: inherit;
}
</style>
