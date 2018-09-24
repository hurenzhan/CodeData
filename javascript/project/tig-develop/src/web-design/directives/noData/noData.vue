<template>
  <div class="search-no-data">
    <img src="/static/charts/images/searchNoData.svg" alt="暂无数据">
    <!-- <p class="p1">当前查询无数据，请修改查询条件</p> -->
  </div>
</template>

<script>
  export default {
    name: 'SearchNoData'
  }
</script>

<style lang="less">
  @container-title-height: 40px;
  .search-no-data{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(~'100%' - @container-title-height);
    width: 100%;
    position: absolute;
    top: @container-title-height;
    left: 0;
    background-color: #fff;
    z-index: 0;
    &.no-title{
      height: 100%;
      top: 0;
    }
    img{
      width: 200px;
      height: 85%;
    }
  }
</style>
