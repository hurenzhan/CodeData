<template>
  <div id="app">
    <vheader :seller='datas.seller'></vheader>
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
      <router-view :datas="datas" ref="abc"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import vheader from './components/mods/header.vue'
import axios from 'axios'
export default {
  data() {
    return {
      datas: {
        seller: {},   //用户信息
        goods: [],   //商品数据
        ratings: []   //评论
      }
    }
  },
  mounted () {
    axios.get('/static/data.json').then(res => {
      this.datas.seller = res.data.seller
      this.datas.goods = res.data.goods
      this.datas.ratings = res.data.ratings
      this.$nextTick(() => {
        this.$refs.abc.scroll()
      })
    })
  },
  components: {
    vheader
  }
}
</script>

<style>
  .tab .tab-item a.router-link-active{
    color:red
  }
</style>
