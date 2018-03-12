<template>
  <div class="shopCart">
    <div @click="show = !show" class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo active">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="badge" v-show="totalPrice>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'active':totalPrice}">${{totalPrice}}</div>
        <div class="desc" v-show="totalPrice<99">另需要配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" :class="{'enough':totalPrice>=minPrice}">
        <div class="pay">{{payDesc}}</div>
      </div>
    </div>
    <transition name="transHeight">
      <div v-show="totalPrice > 0 && show" class="shopcart-list">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty()">清空</span>
        </div>
        <div class="list-content">
          <ul>
            <li class="food" v-for="item in food">
              <span class="name">{{item.name}}</span>
              <div class="price">
                <span>${{item.price}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="item"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import cartcontrol from './cartcontrol.vue'
  export default {
    props: ['deliveryPrice', 'minPrice', 'food'],   //配送费 起步价 数量大于0商品信息
    data () {
      return {
        show: false
      }
    },
    computed: {
      totalPrice () {   //总金额
        let total = 0
        this.food.forEach(food => {
          total += food.count * food.price
        })
        return total
      },
      totalCount () {   //商品总数
        let count = 0
        this.food.forEach(food => {
          count += food.count
        })
        return count
      },
      payDesc () {  //差多少起送
        if (this.totalPrice === 0) {
          return `$${this.minPrice}起送`
        } else if (this.totalPrice < this.minPrice) {
          return `还差${this.minPrice - this.totalPrice}起送`
        } else {
          return `去结算`
        }
      }
    },
    methods: {
      empty () {
        this.food.forEach(val => {
          val.count = 0
        })
      }
    },
    components: {
      cartcontrol
    }
  }
</script>
