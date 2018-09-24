<template>
  <div class="text-assembly">
    <!-- 左侧图表区域 -->
    <div class="left-text" ref="mycontainer">
      <my-resize @notify="reset"></my-resize>
      <!-- 文本内容区域 -->
      <div class="text-content">
        {{currentContainer.feature.content}}
      </div>
    </div>
  </div>
</template>

<script>
import myResize from '../search/otherView/resize'
import { containerInit } from '../../static/configData'
import eventBus from '../../utils/eventBus'
export default {
  name: 'textInfo',
  data() {
    return {
    }
  },
  components: {
    myResize
  },
  props:["index"],
  computed: {
    // 获取vuex公共数据,展示联动
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
    // 文本框是否显示标题栏
    isShowTab () {
      return this.currentContainer.nameToggle
    }
  },
  watch: {
    isShowTab (newValue) {
      this.reset()
    }
  },
  mounted () {
    eventBus.$on(`resizeOrMove_${this.index}`, obj => {
      this.reset()
    })
  },
  beforeDestroy() {
    eventBus.$off(`resizeOrMove_${this.index}`)
  },
  methods: {
    reset () {
      let tab = this.isShowTab ? 40 : 0                               // 容器标题栏的高度
      let contentHeight = this.$refs['mycontainer'].offsetHeight      // 查询面板容器的有效内容的高度
      if  (contentHeight < 43) {
        contentHeight = 43
      }
      let RH = containerInit.rowHeight                                
      let margin = containerInit.margin[0]                            // 容器之间的margin
      let h = (contentHeight + margin + tab) / (RH + margin)
      // console.log('reset', contentHeight, h)
      this.$store.commit('setTextContainerHeight', {
        index: this.index,
        h: h
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .text-assembly {
    overflow: hidden !important;
  }
  .left-text {
    position: relative;
    box-sizing: border-box;
    .search-title {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      font-size: 16px;
      font-weight: bold;
      padding-left: 6px;
      height: 40px;
      line-height: 40px;
    }
    .text-content {
      //white-space: pre-wrap; // 保留空白操作符
      padding: 11px;
      box-sizing: border-box;
      font-size: 14px;
      height: auto;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
</style>

