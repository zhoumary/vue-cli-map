import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAMap from 'vue-amap'
import './plugins/element.js'

import store from './store'
import App from './App.vue'
import HelloWorld from './components/HelloWorld.vue'
import Search from './components/Search.vue'

Vue.use(VueRouter);
// 定义routes
const routes = [
  {path: '/', component: HelloWorld},
  {path: '/search/:city/geolocation/:location', component: Search}
];
// 创建路由对象并配置路由规则
let router = new VueRouter({
  routes,
  mode: 'history'
});

Vue.use(VueAxios, axios)

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '411e5b31c281c0c5d09266a3ea2b7983',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
