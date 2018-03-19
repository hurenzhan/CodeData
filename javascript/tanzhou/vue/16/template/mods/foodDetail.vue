<template>
  <transition name="move">
    <div class="detailWrapper" ref="detailWrapper" v-show="showDetail">
      <div class="foodDetail">
        <div class="back" @click="show()">
          <i class="icon-arrow_lift"></i>
        </div>
        <img :src="food.image" height="425" width="100%">
        <div class="info">
          <div class="title">{{food.name}}</div>
          <div class="desc">
            <span>月售{{food.sellCount}}</span>
            <span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="unit">￥</span>{{food.price}}
            <span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <transition name="fade">
            <div class="shopCart" v-if="food.count<=0 || food.count === undefined">
              <div class="text" @click="addCart($event)">加入购物车</div>
            </div>
          </transition>
          <cartcontrol ref="cartcontrol" :food="food"></cartcontrol>
        </div>
        <div class="divider"></div>
        <div class="desc">
          <div class="title">商品介绍</div>
          <div class="content">{{food.info}}</div>
        </div>
        <div class="divider"></div>
        <div class="evaluation">
          <div class="title">
            商品评价
          </div>
          <div class="classify">
            <span v-for="(item,index) in classifyArr" class="item" :class="{'active':item.active,'bad':index==2,'badActive':item.active&&index==2}" @click="filterEvel(item)">
              {{item.name}}<span class="count">{{item.count}}</span>
            </span>
          </div>
           <div class="switch" @click="evelflag=!evelflag">
            <span class="icon-check_circle" :class="{'on':evelflag}"></span>
            <span class="text">只看有内容的评价</span>
          </div>
          <div class="evel-list">
            <ul>
              <li class="evel" v-for="evel in comments">
                <div class="userInfo">
                  <div class="time">{{evel.rateTime}}</div>
                  <div class="user">
                    <span>{{evel.username}}</span>
                    <span class="avatar"><img :src="evel.avatar" width="12" height="12"></span>
                  </div>
                </div>
                <div class="content">
                  <span class="icon" :class="evel.rateType?'icon-thumb_down':'icon-thumb_up'"></span>
                  <span class="text">{{evel.text}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
//  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import cartcontrol from './cartcontrol.vue'
  import evaluation from './evaluation.vue'
  import {mapMutations} from 'vuex'
  export default {
    props: ['food'],
    data () {
      return {
        showDetail: false,
        classifyArr: [
          {name: '全部', count: 0, comment: [], active: true},
          {name: '推荐', count: 0, comment: [], active: false},
          {name: '吐槽', count: 0, comment: [], active: false}
        ],
        evelflag: true,
        comment: []
      }
    },
    mounted () {
    },
    methods: {
      ...mapMutations([
        'vxaddCart'
      ]),
      show () {
        this.showDetail = !this.showDetail
        this.classifyArr.forEach(val => {
          val.count = 0
        })
        this.$nextTick(() => {
          this.comment = this.classifyArr[0].comment = this.food.ratings
          this.food.ratings.forEach(val => {
            this.classifyArr[0].count++
            if (val.rateType) {
              this.classifyArr[2].comment.push(val)
              this.classifyArr[2].count++
            } else {
              this.classifyArr[1].comment.push(val)
              this.classifyArr[1].count++
            }
          })
          this.$nextTick(() => {
            if (!this.sc) {
              /* eslint-disable no-new */
              this.sc = new BScroll(this.$refs['detailWrapper'], {
                click: true
              })
            } else {
              this.sc.refresh()
            }
          })
        })
      },
      addCart (event) {
        this.$refs.cartcontrol.addCart(event)
      },
      filterEvel (item) {
        this.classifyArr.forEach(val => {
          val.active = false
        })
        item.active = true
        this.comment = item.comment
      },
      updatasc () {
        this.$nextTick(() => {
          this.sc.refresh()
        })
      }
    },
    computed: {
      comments () {
        this.updatasc()
        if (this.evelflag) {
          let arr = []
          this.comment.forEach(val => {
            if (val.text.length > 0) {
              arr.push(val)
            }
          })
          return arr
        } else {
          return this.comment
        }
      }
    },
    components: {
      cartcontrol,
      evaluation
    }
  }
</script>
