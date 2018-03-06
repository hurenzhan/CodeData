<template>
  <div id="app">
    这个.vue模板文件是默认显示的
    <v-header :aaaa="aaaa"></v-header>
    <!-- 路由所显示的地方 -->
    <router-view :aa="aaaa"></router-view>
  </div>
</template>

<script>
  import header from './components/hreder.vue'
  export default {
    name: 'app',
    data () {
      return {
        aaaa: 'aaaaaa'
      }
    },
    components: {
      'v-header': header
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  .router-link-active{
    color:green
  }
</style>
