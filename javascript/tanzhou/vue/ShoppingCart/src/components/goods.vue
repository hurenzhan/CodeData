<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" v-for="item in datas.goods">
          <span class="text">
            <span v-show="item.type>0" class="iconMap" :class="icon[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWarapper">
      <ul>
        <li v-for="item in datas.goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="sell-info">
                  <span class="sellCount">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}</span>
                  <div class="price">
                    <span class="newPrice">${{food.price}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :deliveryPrice="datas.seller.deliveryPrice" :minPrice="datas.seller.minPrice"></shopcart>
    <!--<div class="detailWrapper"></div>-->
  </div>
</template>
<script>
  import icon from './mods/icon'
  import Scroll from 'better-scroll'
  import shopcart from './mods/shopcart.vue'
  export default {
    props: ['datas'],
    data () {
      return {
        icon: icon
//        goods: this.datas.goods
      }
    },
    mounted () {
      // dom更新完之后 === window.onload
      // dom更新完 => new Scroll() => ajax获取到了数据 => dom
      this.$nextTick(() => {
      })
    },
    methods: {
      scroll () {
        /* eslint-disable no-new */
        new Scroll(this.$refs['foodsWarapper'], {
          click: true
        })
        new Scroll(this.$refs['menuWrapper'], {
          click: true
        })
      }
    },
    components: {
      shopcart
    }
  }
</script>
