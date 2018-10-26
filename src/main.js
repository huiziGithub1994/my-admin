import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

import '@/icons' // icon

import operation from './components/operation/index'
import area from './utils/directives/area'
/* 功能页面操作域组件。将条件域中的条件放入操作域中的“更多条件”下拉按钮中 */
Vue.component('operation', operation)
// 全局指令
Vue.directive('area', area)

Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
