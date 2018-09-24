import Vue from 'vue'
import VueRouter from 'vue-router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 页面组件
import App from '@/components/App'
import views from './views'

Vue.use(VueRouter)
Vue.use(ElementUI)

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
