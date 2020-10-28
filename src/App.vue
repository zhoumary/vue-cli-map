<template>
  <div id="app">
    <el-row class="hello">
      <el-col :span="3"><img class="logo" src="./assets/logo.jpeg"></el-col>
      <el-col :span="7"><h1>Welcome to Point Search</h1></el-col>
    </el-row>
    <!-- <router-link to="/search/chengdu">Search</router-link> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  watch: {
      '$route' () {
          const appContainer = document.getElementById("app");
          if (this.$router.currentRoute.fullPath !== "/") {
            appContainer.style.marginTop = "0px";
          } else {
            const height = parseInt(window.innerHeight / 3, 10).toString();
            appContainer.style.marginTop = height + "px";
          }
      }
  },
  data: function() {
    return {

    }
  },
  components: {
    
  },
  mounted: function() {
    const appContainer = document.getElementById("app");
    const height = parseInt(window.innerHeight / 3, 10).toString();
    if (this.$router.currentRoute.fullPath === "/") {
      appContainer.style.marginTop = height + "px";
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
.hello {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-col-3 {
  display: flex;
  justify-content: flex-end
}
.el-col-7 {
  display: flex;
}
.logo {
  height: 60px;
  width: 90px;
}
</style>
