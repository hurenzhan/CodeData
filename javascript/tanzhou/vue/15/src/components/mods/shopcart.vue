<template>
  <div class="shopCart">
    <div @click="showa" class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo active">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="badge" v-show="totalPrice > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'active': totalPrice}">${{totalPrice}}</div>
        <div class="desc" v-show="totalPrice < 99">另需要配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" :class="{'enough': totalPrice > minPrice}">
        <div class="pay">{{payDesc}}</div>
      </div>
    </div>
    <transition name="transHeight">
      <div v-show="totalPrice > 0 && show" class="shopcart-list">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span @click="empty" class="empty">清空</span>
        </div>
        <div ref="listcontent" class="list-content">
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
  // 必须要等dom更新完之后在 new 才可以
  import Scroll from 'better-scroll'
  import cartcontrol from './cartcontrol.vue'
  export default {
    //      配送费             起步价     数量大于0的商品
    props: ['deliveryPrice', 'minPrice', 'food'],
    data () {
      return {
        show: false
      }
    },
    computed: {
      // 总金额
      totalPrice () {
        let total = 0
        this.food.forEach(food => {
          total += food.price * food.count
        })
        return total
      },
      // 选择的商品总数
      totalCount () {
        let count = 0
        this.food.forEach(food => {
          count += food.count
        })
        return count
      },
      // 还差多少起送
      payDesc () {
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
        this.show = false
      },
      showa () {
        this.show = !this.show
        // 等待dom更新完之后
        // 第一次展开购物车的时候 10个商品(1000px) 清空 再次添加 5个商品(500px)
        // 沿用第一次记录下来的高度
        this.$nextTick(() => {
          if (!this.sc) {
            this.sc = new Scroll(this.$refs['listcontent'], {
              click: true
            })
          } else {
            // 强制重新计算高度
            this.sc.refresh()
          }
        })
      }
    },
    components: {
      cartcontrol
    }
  }
</script>
