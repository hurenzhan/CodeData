// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'

// import App from './App'
// import router from './router'

const App = {
  template: `<div id="app">
    默认显示的内容
    <button @click="$router.go(-1)">返回</button>
    <ul>
      <li><router-link to="/">首页</router-link></li>
      <li>
        <router-link to="/a">a</router-link>
        <ul>
          <li><router-link to="/a/aa">/a/aa</router-link></li>
          <li><router-link to="/a/aaa">/a/aaa</router-link></li>
        </ul>
      </li>
      <li><router-link :to="{path:'/b/bb',query:{ id:213 } }">/b/bb</router-link></li>
      <li><router-link :to="{ name:'b',query:{ id:321 } }">/b/bb</router-link></li>
      <li><router-link :to="{name:'c',params:{ id:'cccccccc' } }">/c</router-link></li>
    </ul>
    <router-view></router-view>
  </div>`
}

const index = {
  template: `<div>这里是index</div>`
}
const a = {
  template: `<div>
    <p>这里是a</p>
    <router-view></router-view>
  </div>`
}
const aa = {
  template: `<div>这里是aa {{ $route.params }}</div>`
}
const b = Vue.component('b_', {
  template: `
    <div>这里是b</div>
  `,
  mounted () {
    console.log(this.$route.query.id)
  }
})
const c = Vue.component('c_', {
  template: `
    <div>这里是c {{ $route.params }} </div>
  `,
  mounted () {
    console.log(this.$route.params)
  }
})

const router = new Router({
  routes: [
    {path: '/', component: index},
    {
      path: '/a',
      component: a,
      children: [
        {path: 'aa', component: aa},
        {path: ':id', component: aa}
      ]
    },
    {path: '/b/:id', name: 'b', component: b},
    {path: `/c`, name: 'c', component: c}
  ]
})

Vue.use(Router)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
