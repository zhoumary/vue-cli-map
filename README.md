# vue-cli-map

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Vue && Vue Router && Vuex && Vue AMap
```
1. use vue-router to create navigation
2. use vue-amap to create map and search places
3. use vuex to manage states
4. use vue-axios to manage apis
5. planning driving routing by calculating the min distance startPoint to other points, and do the recursion to get the min passing routes
6. add loading screen before getting driving routes
7. use el-dialog to show the driving routing
8. make full screen loading and full screen dialog component
9. add start place by el-amap-search-box as the routing first point
```
## To do list
```
1. add destination point
2. get restraunts info(name, stars) nearby view points
```

## Optimization
```
1. hide map search box, directly show all view points table and show more by toggling
2. select view points which skip to the item in the left list and addtional places(food or hotel) nearby selected points, and organize them to the left list when click Planning button
3. change color of selected points
4. show all sorted points in the routing dialog
```
