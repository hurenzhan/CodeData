<template>
  <div id="app">
    <v-header :seller="d.seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="d.seller" ref="router"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from './template/mods/header.vue'
  import axios from 'axios'
  export default {
    name: 'app',
    data () {
      return {
        d: {
          seller: {},
          goods: [],
          ratings: []
        }
      }
    },
    mounted () {
      axios.get('/static/data.json').then((res) => {
        this.d.seller = res.data.seller
        this.d.goods = res.data.goods
        this.d.ratings = res.data.ratings
//        this.$nextTick(() => {
//          this.$refs.router.scroll()
//        })
      })
      document.addEventListener('visibilitychange', this.changeTitle, false)
    },
    methods: {
      changeTitle () {
        if (document.hidden) {
          document.title = 'Σ(ﾟдﾟ;)'
        } else {
          document.title = 'VueVip'
        }
      }
    },
    computed: {},
    components: {
      'v-header': header
    }
  }
</script>

<style scoped>
  .tab .tab-item a.router-link-active {
    color: #f01414;
  }
</style>
