<template>
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
</template>
<script>
  import star from './star.vue'
  export default {
    props: ['ratings'],
    data () {
      return {
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
      this.ratings.forEach(val => {
        console.log(val)
        this.classifyArr[0].count++
        this.classifyArr[0].comment.push(val)
        if (val.rateType === 1) {
          this.classifyArr[1].count++
          this.classifyArr[1].comment.push(val)
        }
        if (val.rateType === 2) {
          this.classifyArr[2].count++
          this.classifyArr[2].comment.push(val)
        }
      })
      this.comment = this.ratings
    },
    computed: {
      comments () {
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
      }
    },
    filters: {
      time (value) {
        return value || 0
      }
    },
    components: {
      star
    }
  }
</script>
