import Vue from 'vue'
import App from './App.vue'
// 如果引入的是目录的话 默认去找文件名为index的文件
import router from './router/'

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 传递一个参数: 让页面默认显示的模板 return
  render: h => h(App)
})
