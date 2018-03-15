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
        <div class="evaluation">
          <div class="title">商品评价</div>
          <div class="classify">
            <span v-for="(item, index) in classify" class="item"
                  :class="{'active': item.active, 'bad': index === 2, 'badActive':index===2&&item.active }" @click="classifyclick(item)">
              {{item.name}}
              <span class="count">{{item.count}}</span>
            </span>
          </div>
          <div class="switch" @click="flag = !flag">
            <span class="icon-check_circle" :class="{'on': flag}"></span>
            <span class="text">只看有内容的评价</span>
          </div>
          <div class="evel-list">
            <ul>
              <li class="evel" v-for="item in commontss">
                <div class="userInfo">
                  <div class="time">{{item.rateTime}}</div>
                  <div class="user">
                    <span>{{item.rateTime}}</span>
                    <img :src="item.avatar" width="12" height="12" alt="">
                  </div>
                </div>
                <div class="content">
                  <span class="icon" :class="item.rateType?'icon-thumb_down':'icon-thumb_up'"></span>
                  <span class="text">{{item.text}}</span>
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
  import Scroll from 'better-scroll'
  import cartcontrol from './cartcontrol.vue'
  export default {
    props: ['foodDetails'],
    data () {
      return {
        showDetail: false,
        classify: [
          {name: '全部', count: 0, commont: [], active: true},
          {name: '推荐', count: 0, commont: [], active: false},
          {name: '吐槽', count: 0, commont: [], active: false}
        ],
        commonts: [],
        flag: true
      }
    },
    mounted () {
    },
    methods: {
      foodshow () {
        this.showDetail = true
        // 等don更新完  jq .ready
        this.$nextTick(() => {
          this.commonts = this.foodDetails.ratings
          this.foodDetails.ratings.forEach(val => {
            this.classify[0].count++
            this.classify[0].commont.push(val)
            if (val.rateType) {
              this.classify[2].count++
              this.classify[2].commont.push(val)
            } else {
              this.classify[1].count++
              this.classify[1].commont.push(val)
            }
          })
          this.$nextTick(() => {
            if (!this.cs) {
              this.cs = new Scroll(this.$refs['detailWrapper'], {
                click: true
              })
            } else {
              this.cs.refresh()
            }
          })
        })
      },
      add (event) {
        this.$refs['cartcontrol'].addCart(event)
      },
      classifyclick (item) {
        this.commonts = item.commont
        this.classify.forEach(val => {
          val.active = false
        })
        item.active = true
      },
      updatecs () {
        this.$nextTick(() => {
          this.cs.refresh()
        })
      }
    },
    computed: {
      commontss () {
        // 1.注册了一个$nextTick 2. 更新dom 3. 检测到dom更新完 执行$nextTick里的回调
        this.updatecs()
        let arr = []
        if (this.flag) {
          // 只看有内容评价
          this.commonts.forEach(val => {
            if (val.text.length > 0) {
              arr.push(val)
            }
          })
          return arr
        } else {
          // 看全部评价
          return this.commonts
        }
      }
    },
    components: {
      cartcontrol
    }
  }
</script>
