<template>
  <div class="table-Breadcrumb">
    <title-bar title="" :bread="[{link: '', name: '报表'},{link: '', name: '可视化'}]"></title-bar>
    <div style="height: 8px; background: rgba(0, 0, 0, 0.04)"></div>
    <div class="table-area">
      <myTable :isVisualTable="true" :getTableData="getTableData"></myTable>
    </div>
  </div>
</template>

<script>
import myTable from '../components/myTable'
import api from '../../../../api/versionManage'

export default {
  name: 'tableVersionManage',
  data() {
    return {
      getTableData: api.queryReportList
    }
  },
  mounted() {
    this.getTableData.params.groupId = ''
    this.getTableData.params.searchKey = ''
  },
  components: {
    myTable,
  }
}
</script>

<style lang="less">
  div.table-Breadcrumb {
    position: relative;
    padding: 0px 0px 18px 0px !important;
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
      div.pageWrapper1 {
        height: 48px;
        line-height: 48px;
        padding: 0 16px 0 24px;
      }
    }
  }
</style>
