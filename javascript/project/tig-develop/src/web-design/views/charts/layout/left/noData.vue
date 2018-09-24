<template>
  <div class="no-data">
    <img src="/static/charts/images/nodata.png" alt="暂无数据">
    <p class="p1">当前图表无数据，请从右侧进行配置</p>
    <p class="p2">数据关系-->选择合适的“数据指标”和“维度”</p>
    <p class="p2">图表样式-->选择合适的“图表类型”并设置“图表样式”</p>
  </div>
</template>

<script>
  export default {
    name: 'NoData'
  }
</script>

<style lang="less">
  .no-data{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img{
      width: 150px;
    }
    >p{
      text-align: center;
      color: #ccc;
    }
    >.p1{
      font-size: 16px;
    }
    >.p2 {
      font-size: 12px;
    }
  }
</style>
