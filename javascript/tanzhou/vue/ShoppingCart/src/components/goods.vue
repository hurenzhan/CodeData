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
            <li v-for="food in item.foods" class="food-item" @click="xqy_in(food)">
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
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :food="food" :deliveryPrice="datas.seller.deliveryPrice" :minPrice="datas.seller.minPrice"></shopcart>
    <!-- 点击商品时候把商品信息传递到详情页 -->
    <foodDetail :foodDetails="foodDetails" ref="foodDetail"></foodDetail>
  </div>
</template>
<script>
  import icon from './mods/icon'
  import Scroll from 'better-scroll'
  import shopcart from './mods/shopcart.vue'
  import cartcontrol from './mods/cartcontrol.vue'
  import foodDetail from './mods/foodDetail.vue'
  import {mapMutations, mapState} from 'vuex'
  export default {
    props: ['datas'],
    data () {
      return {
        icon: icon,
        foodDetails: {}
//        goods: this.datas.goods
      }
    },
    computed: {
      food () {
        let arr = []
        this.datas.goods.forEach(goods => {
          goods.foods.forEach(foods => {
            if (foods.count > 0) {
              arr.push(foods)
            }
          })
        })
        return arr
      },
      ...mapState([
        'vxfood'
      ])
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
      },
      xqy_in (value) {
        this.foodDetails = value
        this.$refs.foodDetail.foodshow()   //执行详情页的方法
      }
    },
    components: {
      shopcart,
      cartcontrol,
      foodDetail
    }
  }
</script>
