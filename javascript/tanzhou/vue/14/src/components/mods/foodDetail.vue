<template>
  <transition name="move">
    <div class="detailWrapper" ref="detailWrapper" v-show="showDetail">
      <div class="foodDetail">
        <div @click="showDetail = !showDetail" class="back">
          <i class="icon-arrow_lift"></i>
        </div>
        <img :src="foodDetails.image" height="425" width="100%" alt="">
        <div class="info">
          <div class="title">{{foodDetails.name}}</div>
          <div class="desc">
            <span>月售{{foodDetails.sellCount}}</span>
            <span>好评率{{foodDetails.rating}}%</span>
          </div>
          <div class="price">${{foodDetails.price}}</div>
          <transition name="fade">
            <div v-show="foodDetails.count === 0 || foodDetails.count == undefined" @click="add($event)" class="shopCart">
              <div class="text">加入购物车</div>
            </div>
          </transition>
          <cartcontrol ref="cartcontrol" :food="foodDetails"></cartcontrol>
        </div>
        <div class="divider"></div>
        <div class="desc">
          <div class="title">商品介绍</div>
          <div class="content">{{foodDetails.info}}</div>
        </div>
        <div class="divider"></div>
        <div class="evaluation"></div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'better-scroll'
  import cartcontrol from './cartcontrol.vue'
  export default {
    props: ['foodDetails'],
    data () {
      return {
        showDetail: false
      }
    },
    mounted () {
    },
    methods: {
      foodshow () {
        this.showDetail = true
        this.$nextTick(() => {
          if (!this.cs) {
            this.cs = new Scroll(this.$refs['detailWrapper'], {
              click: true
            })
          } else {
            this.cs.refresh()
          }
        })
      },
      add (event) {
        this.$refs['cartcontrol'].addCart(event)
      }
    },
    components: {
      cartcontrol
    }
  }
</script>
