<template>
  <div>
    <ul>
      <li v-for="item in shop">
        <p>{{item.title}}</p>
        <p>购买 数量 <button @click="addCart(item)">购买</button></p>
        <p><button @click="addCart(item)">+</button> <button @click="jian(item)">-</button> </p>
      </li>
    </ul>
    <chat :cart="cart"></chat>
  </div>
</template>
<script>
//  import Vue from 'vue'
  import {mapState, mapMutations} from 'vuex'
  import chat from './chat.vue'
  export default {
    data () {
      return {
        shop: [
          {title: '电脑', price: 100},
          {title: '洗衣机', price: 100},
          {title: '油烟机', price: 100}
        ]
      }
    },
    computed: {
      ...mapState([
        'vxcart'
      ]),
      cart () {
        let a = []
        this.shop.forEach((val) => {
          if (val.num > 0) {
            console.log(val)
            a.push(val)
          }
        })
        return a
      }
    },
    methods: {
      ...mapMutations([
        'vxaddCart',
        'vxjian'
      ]),
      addCart (item) {
        if (typeof item.num === 'undefined') {
          this.$set(item, 'num', 0)
        }
        this.vxaddCart(item)
        console.log(item)
        item.num++
      },
      jian (item) {
        item.num--
        if (item.num <= 0) {
          this.vxjian(item)
        }
      }
    },
    components: {
      chat
    }
  }
</script>
