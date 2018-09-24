// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'

// 页面组件
import App from '@/components/App'
import views from './views'

Vue.use(VueRouter)

Vue.config.productionTip = false

// 路由配置
const router = new VueRouter({
  routes: views
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
