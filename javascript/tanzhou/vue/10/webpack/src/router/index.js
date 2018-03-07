import Vue from 'vue'
import Router from 'vue-router'
// @是webpack规定的 @代表src目录
// 后缀名写不写都可以
// 机制 如果没有后缀名的话 会自动去寻找Hello.vue  Hello.js
import Hello from '@/components/Hello'
import a from '@/components/a'
import b from '@/components/b'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: Hello
    },
    {
      path: '/a',
      component: a
    },
    {
      path: '/b',
      component: b
    }
  ]
})
