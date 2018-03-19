<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}} / {{seller.deliveryTime}}分钟送达</div>
        <div v-if="seller.supports" class="supports">
          <div class="supports_desc">
            <span class="icon decrease"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
      </div>
      <div @click="detailshow = !detailshow" v-if="seller.supports" class="support-count">
        <span class="count">{{seller.supports.length + '个'}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div @click="detailshow = !detailshow" class="bulletin-wrapper">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img width="100%" height="100%" :src="seller.avatar">
    </div>
    <transition name="fade">
      <div v-show="detailshow" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main"><h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul class="supports">
            <li v-for="item in seller.supports" class="support-item">
              <span class="icon" :class="iconClassMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">{{seller.bulletin}}</div>
        </div>
      </div>
      <div @click="detailshow = !detailshow" class="detail-close"><i class="icon-close"></i></div>
    </div>
    </transition>
  </div>
</template>
<script>
  import star from './star.vue'
  export default {
    props: ['seller'],
    data () {
      return {
        detailshow: false,
        iconClassMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      }
    },
    components: {
      star
    }
  }
</script>
<style>
</style>
