<template>
<router-view></router-view>
</template>
<script>
  import _debounce from 'lodash.debounce'
  import {emitResizeToAll} from '../../web-design/views/charts/utils/utils'

  export default {
    mounted () {
      window.addEventListener('resize', _debounce(this.resizeHandle, 200))
      // 关闭track，避免外链
      // window.G2.track(false)
      // window.G6.track(false)
    },
    methods: {
      resizeHandle () {
        setTimeout(() => {
          emitResizeToAll(this.$store.state.charts.chartsOption)
        }, 200)
      }
    }
  }
</script>
<style lang="less">
@import "./default.less";
@import "./init.css";
</style>
