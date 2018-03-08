<template>
  <div>
    <ul>
      <li v-for='item in countAnother'>{{ countAnother }}</li>
      <br>
      <li v-for='item in age'>{{ item }}</li>
    </ul>
    {{count}}
    <button @click="add">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
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
      'age',
      'count'
    ]),
    countAnother: function () {  // 获取state
      return this.$store.getters.countAnother
    }
  },
  methods: {
    ...mapActions(["decrement"]),
　　　　　　　// mapActions 对应做出改变
    ...mapActions({
        add: "increment"
    })
  }
}
</script>
