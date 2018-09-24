<template>
  <div class="design-wrapper">
    <designHeader class="top-header"></designHeader>
    <div class="container">
      <div class="center-wrapper">
        <center class="center"></center>
      </div>
      <left></left>
      <right class="right"></right>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
/* import axios from '@/utils/axios' */
import designHeader from './topheader'
import left from './left'
import center from './center/'
import right from './right'

export default {
  name: 'design',
  data() {
    return {
    }
  },
  components: {
    designHeader,
    left,
    center,
    right
  },
  computed: {
    firstFlag() {
      return this.$store.state.design.firstFlag
    }
  },
  destroy() {
    this.$store.commit('changeFirstFlag', 0)
  },
  methods: {
    ok() {},
    cancel() {},
  },
  mounted() {
    // location.reload();
    // 获取维度 指标信息
    // 获取报表详情
    // 数据装箱
    const query = this.$route.query
    // 获取报表名称
    const name = query.reportName
    if (Object.keys(query).length) {
      const data = { ...query }
      // // 开发端systemLabel为4, 业务端systemLabel为6
      data.systemLabel = 4
      this.$store.dispatch('getDimAndMetric', data)
    } else {
      this.$Message.info('获取参数失败')
    }
    if (name) {
      this.$store.commit('handleReportNameChange', name)
    }
    // 页面刷新时弹窗提示
    // window.onbeforeunload = function () { return '退出' }
  },
  beforeDestroy() {
    this.$store.commit('removeAllData')
  }
}
</script>

<style scoped lang="less">
.design-wrapper{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top-header{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 42px;
  min-width: 800px;
}
.container{
  height: calc(~"100% - 40px");
  position: fixed;
  top: 42px;
  left: 0;
  right: 0;
  bottom: 0;
  margin-top: 10px;
}
.center-wrapper{
  width: 100%;
  float: left;
  height: 100%;
}
.center{
  margin-left: 200px;
  margin-right: 240px;
  min-width: 200px;
}
.left{
  width: 200px;
  float: left;
  margin-left: -100%;
  height: 100%;
}
.right{
  width: 230px;
  margin-left: -230px;
  float: left;
  height: 100%;
}
</style>
<style lang="less">
.design-preview-content{
  padding: 10px;
  border: 1px dotted #E6E6E6;
}
</style>
