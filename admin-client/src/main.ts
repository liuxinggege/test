import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App.vue'
import router from './router/index'
import store from './store/index'


import './icons' // icon
import './errorLog'// error log
import './permission' // permission control

//import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium', // set element-ui default size
})

// register global utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, (filters as any)[key])
// })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
