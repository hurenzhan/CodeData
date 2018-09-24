<template>
  <div class="table-Breadcrumb">
    <title-bar title="" :bread="[{link: '', name: '监控'},{link: '', name: '报表导出' }]"></title-bar>
    <div style="height: 8px; background: rgba(0, 0, 0, 0.02)"></div>
    <div class="table-area">
      <repUsageStatistics ref="usageStatistics"></repUsageStatistics>
    </div>
  </div>
</template>

<script>
import repUsageStatistics from './exportDetail'

export default {
  data() {
    return {
      title: '报表导出'
    }
  },
  components: {
    repUsageStatistics,
  }
}
</script>

<style lang="less">
  div.table-Breadcrumb {
    padding: 0px 0px 20px 0px !important;
    header.titleBar {
      padding: 0 32px;
      margin: 0px;
      height: 54px;
      div.ivu-breadcrumb {
        height: 54px;
        line-height: 54px;
        span {
          font-size: 14px;
        }
      }
    }
    div.table-area {
      padding-top: 24px;
      padding-left: 32px;
      padding-right: 32px; 
    }
  }
</style>
