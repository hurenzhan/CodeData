
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import iView from 'iview'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/components'
import stores from './store'
import config from '../env'
import login from './api/login'
import elMessage from 'element-ui/packages/message'
import noData from './directives/noData/noData'

// 页面组件
import App from '@/components/App'
import views from './router'

Vue.use(Vuex)
Vue.use(VueRouter)

Vue.use(iView)
Vue.use(elementUi)
Vue.$Message = elMessage
Vue.directive('noData', noData)

Vue.config.productionTip = true
Vue.config.devtools = true

Vue.config.errorHandler = function (err, vm, info) {
  console.log(err, vm, info)
  // handle error
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
}

window.initColumnListFlag = 0
window.onlyForFormatterFlag = 0

const store = new Vuex.Store(stores)

// 路由配置
const router = new VueRouter({
  routes: views
})

router.beforeEach((to, from, next) => {
  // 权限获取校验
  login.user().then((res) => {
    next()
  }).catch(() => {
    location.href = config.dataCloud
  })
})
router.afterEach((to, from) => {
  window.formUrl = from.path
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
