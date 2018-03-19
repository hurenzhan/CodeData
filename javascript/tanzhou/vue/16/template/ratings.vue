<template>
  <div class="ratingsWrapper" ref="ratingsWrapper">
    <div class="ratings-content">
      <div class="info">
        <div class="mark">
          <div class="num">{{seller.score}}</div>
          <div class="text">综合评分</div>
          <div class="contrast">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="stars">
          <div class="serviceScore">
            <span class="text">服务态度</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="num">{{seller.foodScore}}</span>
          </div>
          <div class="foodScore">
            <span class="text">服务态度</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="num">{{seller.foodScore}}</span>
          </div>
          <div class="deliveryTime">
            <span class="text">送达时间</span>
            <span class="time">38分钟</span>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="evaluation">
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
              <div class="avatar">
                <img :src="evel.avatar" width="28" height="28">
              </div>
              <div class="content">
                <div class="user">
                  <span class="name">{{evel.username}}</span>
                  <span class="rateTime">{{evel.rateTime}}</span>
                </div>
                <div class="star-wrapper">
                  <star :size="24" :score="evel.score"></star>
                  <span class="deliveryTime">{{evel.deliveryTime | time}}分钟送达</span>
                </div>
                <div class="text">
                  {{evel.text}}
                </div>
                <div class="recommend">
                  <span class="icon icon-thumb_up" v-show="evel.recommend.length"></span>
                  <span class="dish" v-for="dish in evel.recommend">{{dish}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from 'better-scroll'
  import axios from 'axios'
  import star from './mods/star.vue'
  export default {
    props: ['seller'],
    data () {
      return {
        ratings: '',
        classifyArr: [
          {
            name: '全部',
            count: 0,
            active: true,
            comment: []
          },
          {
            name: '推荐',
            count: 0,
            active: false,
            comment: []
          },
          {
            name: '吐槽',
            count: 0,
            active: false,
            comment: []
          }],
        evelflag: true,
        comment: []
      }
    },
    mounted () {
      axios.get('/api/ratings').then(res => {
        this.ratings = res.data
        this.ratings.forEach(val => {
          this.classifyArr[0].count++
          this.classifyArr[0].comment.push(val)
          if (val.score > 3) {
            this.classifyArr[1].count++
            this.classifyArr[1].comment.push(val)
          }
          if (val.score <= 3) {
            this.classifyArr[2].count++
            this.classifyArr[2].comment.push(val)
          }
        })
        this.comment = this.ratings
        this.$nextTick(() => {
          /* eslint-disable no-new */
          this.sc = new Scroll(this.$refs['ratingsWrapper'], {
            click: true
          })
        })
      })
    },
    activated () {},
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
    methods: {
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
    components: {
      star
    },
    filters: {
      time (value) {
        return value || 0
      }
    }
  }
</script>
<style>

</style>
