<template>
  <div class="table-Breadcrumb">
      <title-bar title="" :bread="[{link: '', name: '系统'},{link: '', name: '用户管理'}]"></title-bar>
      <div style="height: 8px; background: rgba(0, 0, 0, 0.02)"></div>
      <div class="table-area">
        <user-manage
          :getListajax="getListajax" :ty="type" :followed="folow"
        ></user-manage>
      </div>
  </div>
</template>

<script>
  import userManage from './list'
import system from '@/web-design/api/system'

  export default {
    data() {
      return {
        type: 2,
        folow: 2,
        getListajax: system.getListajax
      }
    },
    mounted() {
    },
    methods: {},
    components: {
      userManage
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