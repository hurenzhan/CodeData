<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses()" :class="itemClass" class="star-item"></span>
  </div>
</template>
<script>
  export default {
    props: ['score', 'size'], // score = 4.8    4   0.8
    methods: {
      itemClasses () {
        let result = []
        let score = Math.floor(this.score) // 向下取整
        let hasDecimal = (this.score - score) >= 0.5 // 小数点 >= 0.5的时候 半颗星
        for (let i = 0; i < score; i++) {
          result.push('on') // 4颗星
        }
        if (hasDecimal) {
          result.push('half') // 半颗星
        }
        while (result.length < 5) {
          result.push('off') // 如果没有到5 添加 0
        }
        return result
      }
    },
    computed: {
      starType () {
        return `star-${this.size}`
      }
    }
  }
</script>
