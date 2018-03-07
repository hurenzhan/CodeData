<template>
  <div>
    <!-- 这里是用来存放html代码 -->
    <!-- 必须写一个元素包裹起来(template这个标签下面的元素只能有一个) -->
    <p>{{ num }}</p>
    <a href=""></a>
    <zidingyi></zidingyi>
  </div>
</template>
<script>
  import zidingyi from './moban'
  // 相当于 var zidingyi = moban这个文件
  // js代码
  export default {
    // Vue代码都是在这里写
    data () {
      return {
        num: 456
      }
    },
    methods: {
    },
    components: {
      zidingyi
    }
  }
</script>
<style>
</style>
