<template>
  <div class="my-table">
    <div class="action-areas">
      <div style="white-space:nowrap">
        <el-button v-if="isVisualTable" @click="creatNewTable()" type="primary" size="small">+ 新建可视化报表</el-button>
        <el-button v-else @click="creatNewTable()" type="primary" size="small">+ 新建电子表格</el-button>
        <el-button class="groupBtn" @click="dialogTableVisible=true" size="small">分组</el-button>
        <el-select v-model="selectGroup" @change="groupChange" size="small" placeholder="全部" style="width: 192px" clearable>
          <el-option v-for="item in groupLists" :key="item.reportGroupId" :label="item.reportGroupName" :value="item.reportGroupId"></el-option>
        </el-select>
      </div>
      <div style="white-space:nowrap">
        <el-input v-model="searchKey" @change="inputChange" @keyup.enter.native="searchClick" size="small" placeholder="报表名称/工号" suffix-icon="el-icon-search" style="width: 272px; margin-right: 16px;" clearable></el-input>
        <el-button @click="searchClick()" type="primary" size="small">查询</el-button>
      </div>
    </div>
    <table-paging
      ref="dataTable"
      :type="2"
      :ajax="getTableData"
      :columns="columnsData"
      :show="showChecked"
      @on-select="selectOne"
      @on-select-cancel="cancelSelect"
      @on-select-all="selectAll"
      @on-select-change="selectChange"
      @tableChangePage="pageChange">
    </table-paging>
    <!-- 分组弹出框 -->
    <el-dialog class="groupDialog" :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="320px">
      <div class="slotTitle" slot="title">分组</div>
      <div class="slotFooter" slot="footer">
        <el-button @click="enterClick()" type="primary" size="small">确定</el-button>
        <el-button @click="cancelClick()" size="small">取消</el-button>
      </div>
      <!-- 分组弹出框正文内容 -->
      <el-button class="addGroupButton" @click="addNewGroupName()" plain size="small">
        <img src="../../../../../../static/charts/images/newGroup.svg" alt="新建">新建分组
      </el-button>
      <div class="dialogBand">
        <el-radio-group v-model="currentGroup">
          <div class="nameGroup" v-for="item in groupLists" :key="item.reportGroupName">
            <div>
              <el-radio :label="item.reportGroupId">
                <span v-if="!item.editFlag" v-text="item.reportGroupName"></span>
                <input v-else type="text" :value="item.reportGroupName" :id="item.reportGroupId" @blur="lostFocus(item)" maxlength="10">
              </el-radio>
            </div>
            <div>
              <el-button type="text" @click="editeClick(item)">
                <img src="/static/charts/images/edite.svg" alt="edite">
              </el-button>
              <el-button type="text" @click="deleteClick(item)">
                <img src="/static/charts/images/delete.svg" alt="delete">
              </el-button>
            </div>
          </div>
        </el-radio-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import versionSelect from './versionSelect'
import lockState from './lockState'
import operationBand from './operationBand'
import api from '../../../../api/versionManage'
import checkMethods from '../utils/checkMethods'
import tools from '../utils/commonTools'
import createUser from './createUser'

export default {
  components: {
    createUser,
    versionSelect,
    lockState,
    operationBand
  },
  mixins: [checkMethods, tools],
  props: {
    isVisualTable: false, // 是否是可视化报表版本管理页面, false电子表格, true可视化表格
    getTableData: Object
  },
  data() {
    return {
      columnsData: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '报表',
          className: 'report-name-column',
          render: (h, params) => h('div', {
            class: 'text-limit-length',
            attrs: {
              title: params.row.reportName
            }
          }, params.row.reportName)
        },
        {
          title: '分组',
          width: 200,
          key: 'groupName'
        },
        {
          title: '创建人',
          width: 120,
          render: (h, params) => h('div', [
            h(createUser, {
              props: {
                report: params.row,
                operateObj: this.operateObj
              }
            })
          ])
        },
        {
          title: '版本',
          width: 160,
          render: (h, params) => h('div', [
            h(versionSelect, {
              props: {
                report: params.row
              },
              on: {
                versionChange: (operateObj) => {
                  this.operateObj = operateObj
                }
              }
            })
          ])
        },
        {
          title: '状态',
          width: 100,
          render: (h, params) => h('div', [
            h(lockState, {
              props: {
                report: params.row,
                operateObj: this.operateObj
              }
            })
          ])
        },
        {
          title: '操作',
          className: 'report-operate-column',
          // width: 260,
          render: (h, params) => h('div', [
            h(operationBand, {
              props: {
                report: params.row,
                operateObj: this.operateObj
              },
              on: {
                refreshTable: () => {
                  this.$refs.dataTable.judgeType(this.currentPage)
                }
              }
            })
          ])
        }
      ]
    }
  },
  methods: {
    // 创建可视化报表
    creatNewTable() {
      // 路由跳转
      if (this.isVisualTable) {
        let routeData = this.$router.resolve({
          path:'/dashboard',
        })
        window.open(routeData.href, '_blank')
      } else {
        let routeData = this.$router.resolve({
          path:'/tableCreate',
        })
        window.open(routeData.href, '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /* 多行文本超出1行后截断,剩余部分显示... */
  .text-limit-length{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .action-areas{
    display: flex;
    justify-content: space-between;
    div button.el-button {
      font-size: 14px !important;
      padding: 8px 17px;
    }
    div button.el-button--primary {
      padding: 9px 18px;
      border: none;
    }
  }
  .slotTitle {
    font-size: 16px;
    font-weight: 700;
    font-family: "PingFangSC-Medium";
    color: rgba(0, 0, 0, 0.85);
  }
  div.dialogBand {
    padding-top: 10px;
    padding-bottom: 28px;
    max-height: 300px;
    overflow: auto;
  }
  div.dialogBand div.nameGroup {
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
    padding-bottom: 8px;
    width: 276px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
  div.dialogBand button.el-button {
    padding-top: 0px;
    padding-bottom: 0px;
    margin-right: 5px;
  }
  div.action-areas button.groupBtn {
    margin: 0px 5px;
  }
</style>

<style lang="less">
  .action-areas {
    div div.el-input.el-input--small input {
      height: 32px !important;
      font-size: 14px !important;
    }
  }
  div.groupDialog div.el-dialog__header {
    padding: 16px 16px 12px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  }
  div.groupDialog div.el-dialog__body {
    padding :8px 0px 0px 0px;
    div.dialogBand div.el-radio-group {
      width: 100%;
      div.nameGroup {
        width: 100%;
        padding-left: 24px;
        padding-right: 24px;
      }
    }
  }
  div.groupDialog div.el-dialog__footer {
    border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
    padding-top: 16px;
    padding-bottom: 30px;
  }
  div.groupDialog div.el-dialog {
    border-radius: 4px;
  }
  div.slotFooter {
    button span {
      font-size: 14px;
    }
    button.el-button--default {
      color: rgba(0,0,0,0.45);
      background-color: #f5f5f5;
    }
  }
  // 新建分组按钮样式
  button.addGroupButton{
    margin-left: 24px;
    padding-left: 13px;
    padding-right: 13px;
    border-color: #51afff;
    &:hover {
      background-color: rgba(225, 225, 225, 0.3) !important;
      border-color: #2791ee;
      span {
        color: #2791ee;
      }
    }
    span{
      font-size: 14px;
      color: #51afff;
      img {
        vertical-align: top;
        margin-right: 6px;
      }
    }
  }
  // .report-name-column {
  //   width: 190px!important;
  // }
  // .report-operate-column {
  //   width: 16%;
  // }
</style>
