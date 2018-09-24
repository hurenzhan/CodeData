<template>
  <div class="table-Breadcrumb">
      <title-bar title="" :bread="[{link: '', name: '系统'},{link: '', name: '主系统管理'}]"></title-bar>
      <div style="height: 8px; background: rgba(0, 0, 0, 0.02)"></div>
      <div class="table-area">
         <div style="height:32px" class="searchWra">
          <Input 
          icon="ios-search" v-model="groupList.params.searchKey" placeholder="请输入主系统名称" class="" style="width:2rem" @on-change="change"/>
        </div>
        <table-paging :columns="columns1" :ajax="groupList" :type="2" ref="table">
        </table-paging>
      </div>
     
  </div>
</template>
<script>

//  v-model="groupList.params.searchKey" 
import system from '@/web-design/api/system'

export default {
  data() {
    return {
      groupList: system.groupList,
      columns1: [
        {
          title: 'ID/主系统名称',
          render: (h, params) =>
            h('div', [
              h('p', {
                class: 'report-name not-link'
              }, params.row.systemNm),
              h('p', {
                class: 'report-id'
              }, params.row.systemId)
            ], params.row.systemNm)
        },
        {
          title: '管理员',
          render: (h, params) =>
            h('div', [
              h('p', {
                class: 'report-name not-link'
              }, params.row.pmMangerName),
              h('p', {
                class: 'report-id'
              }, params.row.pmManger)
            ], params.row.pmMangerName)
        },
        {
          title: '产品总监',
          render: (h, params) =>
            h('div', [
              h('p', {
                class: 'report-name not-link'
              }, params.row.pmDirectorName),
              h('p', {
                class: 'report-id'
              }, params.row.pmDirector)
            ], params.row.pmDirectorName)
        }
      ],
    }
  },
  mounted() {
  },
  methods: {
    change() {
      this.$refs.table.judgeType()
    },
  }
}
</script>

<style lang="less">
.table-area {
  .searchWra {
    text-align: right;
    .ivu-input-icon-normal + .ivu-input {
        padding-left: 32px;
      }
      .ivu-input-icon {
        left: 0;
      }
  }
}

</style>
