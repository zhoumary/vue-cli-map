import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAMap from 'vue-amap'
import './plugins/element.js'

import App from './App.vue'
import HelloWorld from './components/HelloWorld.vue'
import Search from './components/Search.vue'

Vue.use(VueRouter)
// 定义routes
const routes = [
  {path: '/', component: HelloWorld},
  {path: '/search/:city', component: Search}
];
// 创建路由对象并配置路由规则
let router = new VueRouter({
  routes,
  mode: 'history'
});

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'your key',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
