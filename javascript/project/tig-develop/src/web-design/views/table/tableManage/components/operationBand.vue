<template>
  <div style="font-size: 14px;white-space:nowrap;">
    <button @click="btnclick('edite')" v-if="!(isPreVersion||report.isLock)">编辑</button>
    <button @click="btnclick('see')" v-if="isPreVersion||report.isLock">查看</button>
    <button @click="btnclick('delete')" :disabled="(isPreVersion||report.isLock)==true" :class="{locked:isPreVersion||report.isLock}">删除</button>
    <button @click="btnclick('saveAs')" v-if="report.reportType[0] === '3'">另存为</button>
    <button @click="btnclick('lock')" v-if="!(isPreVersion||report.isLock)">锁定版本</button>
    <button @click="btnclick('add')" v-if="isPreVersion||report.isLock" :disabled="isPreVersion" :class="{locked:isPreVersion}">新增版本</button>
    <button @click="btnclick('history')">历史记录</button>

    <el-dialog class="historyView" :visible.sync="historyDialog" :close-on-click-modal="false" width="320px">
      <!-- 通过具名slot传入标题 -->
      <div class="titleSlot text-limit-length" slot="title" v-text="this.report.reportName" :title="this.report.reportName"></div>
      <!-- 步骤条 -->
      <div class="stepDiv" @scroll="handleScroll">
        <el-steps direction="vertical" :active="0" space="80px" process-status="wait">
          <el-step v-for="item in stepArr" :key="item.createTime">
            <div slot="icon">&nbsp;</div>
            <div class="stepTitleSlot" slot="title">{{'v'+item.versionId+'版本已被&nbsp;'+item.userName+'&nbsp;'+getOperateType(item.type)}}</div>
            <div class="stepDesSlot" slot="description">{{item.createTime}}</div>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../../api/versionManage'
import chartsApi from '../../../../api/charts'
import { isName } from '@/web-design/views/charts/utils/utils'

export default {
  name: 'operationBand',
  data() {
    return {
      historyDialog: false,
      isPreVersion: false, // 是否是之前的版本
      stepArr: [],
      total: 0, // 历史记录的总条数
      limit: 10, // 每次请求历史记录的条数限制,默认10条
      offset: 0, // 每次请求历史记录的偏移量, 默认为0
      currentVersion: '', // 当前用户选择的版本号
      reportSaveAsName: ''
    }
  },
  props: {
    report: Object, // 当前操作的报表对象
    operateObj: {}, // 当前用户操作的报表对象
  },
  mounted() {
    // 默认选中最新版本
    this.currentVersion = this.report.reportVersion[0]
  },
  methods: {
    sync (prop, value) {
      this[prop] = value
    },
    btnclick(action) {
      switch(action) {
        case 'edite':
          let editeRouterStr = ''
          if (this.report.reportType[0] == 3) {
            editeRouterStr = `#/edit?reportId=${this.report.reportId}&versionId=${this.report.reportVersion[0]}`
          } else {
            editeRouterStr = `#/design?reportId=${this.report.reportId}&versionId=${this.report.reportVersion[0]}&reportName=${this.report.reportName}&edit=true&reportType=${this.report.reportType[0]}`
          }
          window.open(editeRouterStr)
          // this.$router.push(editeRouterStr)
          break;
        case 'see':
          let seeRouterStr = ''
          if (this.report.reportType[0] == 3) {
            seeRouterStr = `#/visual?reportId=${this.report.reportId}&versionId=${this.currentVersion}`
          } else {
            seeRouterStr = `#/table?see=1&reportId=${this.report.reportId}&versionId=${this.currentVersion}`
          }
          window.open(seeRouterStr)
          // this.$router.push(seeRouterStr)
          break;
        case 'delete':
          this.$confirm('确定删除该版本?', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning',
            customClass: 'manage-warn-view'
          }).then(() => {
            this.deleteReport()
          }).catch(() => {
          })
          break;
        case 'saveAs':
          this.reportSaveAsName = this.report.reportName + '的副本'
          this.$msgbox({
            title: '请输入报表名',
            message: <p><input maxLength="30" class="el-input__inner" title="reportSaveAsName" value={this.reportSaveAsName} onChange={(e) => this.sync('reportSaveAsName', e.target.value)} /></p>,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                if (!isName(this.reportSaveAsName)) {
                  this.$message.info('名称不符合')
                  return false
                } else {
                  instance.confirmButtonLoading = true
                  instance.confirmButtonText = '创建中...'
                  this.reportSaveAs(() => {
                    done()
                    instance.confirmButtonLoading = false
                  }, () => {
                    instance.confirmButtonText = '确定'
                    instance.confirmButtonLoading = false
                  })
                }
              } else {
                done()
              }
            }
          }).then(action => {
            this.$message({
              type: 'info',
              message: '可视化报表副本创建成功！'
            });
          }).catch(err => console.log(err));
          break;
        case 'lock':
          this.$confirm('确定发布到慧眼, 锁定该版本?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'manage-warn-view'
          }).then(() => {
            this.lockReport()
          }).catch(() => {
          })
          break;
        case 'add':
          this.$confirm('确定新增版本?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'manage-warn-view'
          }).then(() => {
            this.addNewReport()
          }).catch(() => {
          })
          break;
        case 'history':
          this.historyDialog = true
          this.stepArr = []
          this.offset = 0
          this.total = 0
          this.getHistoryInfo(this.offset, this.limit)
          this.offset += this.limit
          break;
        default: {}
      }
    },
    // 报表另存为
    async reportSaveAs (success, fail) {
      const reportId = this.report.reportId
      const versionId = this.currentVersion
      const reportSaveAsName = this.reportSaveAsName
      const reportType = 3

      const getRes = await chartsApi.getReportInfo({
        reportId: reportId,
        versionId: versionId
      })
      let addRes
      let reportContent = JSON.parse(getRes.data.reportContent)
      reportContent.name = reportSaveAsName
      reportContent = JSON.stringify(reportContent)

      try {
        if (getRes && getRes.statusCode === '0') {
          addRes = await chartsApi.add({reportName: reportSaveAsName, reportType, reportContent})
        }
        if (addRes && addRes.statusCode === '0') {
          success()
          this.$emit('refreshTable')
        } else {
          fail()
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 锁定报表
    async lockReport() {
      const reportId = this.report.reportId
      const reportVersion = this.report.reportVersion[0]
      const status = 1 // 1表示锁定
      const path = this.$route.path.split('/')[1]
      const reportInfo = await chartsApi.getReportInfo({reportId, versionId: reportVersion})
      const { gridWrapperHeight } = JSON.parse(reportInfo.data.reportContent)
      let wantPath = 'visual'
      if (path === 'tableManage') wantPath = 'table'
      const url = `${window.location.href.split(path)[0]}${wantPath}?reportId=${reportId}&versionId=${reportVersion}&other=true&height=${gridWrapperHeight}`
      const res = await api.lockReport({
        reportId,
        reportVersion,
        status,
        'report_link': url
      })
      if (!res) return
      if (res.statusCode === '0') {
        this.$Message.success('锁定成功!')
        this.$emit('refreshTable')
      } else {
        this.$Message.error('锁定失败!')
      }
    },
    // 新增版本(报表)
    async addNewReport() {
      const reportId = this.report.reportId
      const reportDesc = ''
      const reportName = this.report.reportName
      // 可视化表格是'3' 电子表格是'1,2',其中1是普通表, 2是交叉表
      const reportType = this.report.reportType[0]
      const reportLink = ''
      const reportContent = ''
      const res = await api.addReportVersion({
        reportId,
        reportDesc,
        reportName,
        reportType,
        reportLink,
        reportContent
      })
      if (!res) return
      if (res.statusCode === '0') {
        this.$Message.success('版本新增成功!')
        this.$emit('refreshTable')
      } else {
        this.$Message.error('版本新增失败!')
      }
    },
    // 删除报表
    async deleteReport() {
      const reportId = this.report.reportId
      const reportVersion = this.report.reportVersion[0]
      const res = await api.deleteReport({
        reportId,
        reportVersion
      })
      if (!res) return
      if (res.statusCode === '0') {
        this.$Message.success('报表版本删除成功!')
        this.$emit('refreshTable')
      } else {
        this.$Message.error('报表版本删除失败!')
      }
    },
    // 获取报表操作的历史记录
    async getHistoryInfo(offset, limit) {
      const reportId = this.report.reportId
      const res = await api.reportHistoryInfo({
        params: {
          reportId,
          offset,
          limit
        }
      })
      if (!res) return
      if (res.statusCode === '0') {
        this.total = res.total // 记录历史记录总条数
        res.data.forEach(element => {
          this.stepArr.push(element)
        });
      } else {
        this.$Message.error('历史记录获取失败!')
      }
    },
    getOperateType(type) {
      let operate = ''
      switch (type) {
        case 0:
          operate = '新增'
          break;
        case 1:
          operate = '编辑'
          break;
        case 2:
          operate = '锁定'
          break;
        case 3:
          operate = '删除'
          break;
      }
      return operate
    },
    handleScroll(e) {
      // 420是滚动div的可视高度(css样式设置的最大高度)
      if (e.target.scrollHeight - e.target.scrollTop == 420) {
        if (this.offset < this.total) {
          this.getHistoryInfo(this.offset, this.limit)
          this.offset += this.limit
        }
      }
    }
  },
  watch: {
    operateObj() {
      var operateVersion = this.operateObj.selectVersion
      var operateReportId = this.operateObj.reportId
      if (operateReportId == this.report.reportId) {
        this.currentVersion = this.operateObj.selectVersion
        if (operateVersion == this.report.reportVersion[0]) {
          this.isPreVersion = false
        } else {
          this.isPreVersion = true
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  button {
    color: #51A6FF;
    cursor: pointer;
    margin-right: 10px;
    border: none;
    background-color: transparent;
    outline: none;
    font-size: 14px;
  }
  .locked {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
  .titleSlot {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 700;
    font-family: "PingFangSC-Medium";
    padding-right: 30px;
  }
  .stepDiv {
    max-height: 420px;
    overflow: auto;
  }
  .stepTitleSlot {
    font-size:14px;
    color:rgba(0, 0, 0, 0.65);
    font-family: "PingFangSC-Regular";
  }
  .stepDesSlot {
    font-size:14px;
    color:rgba(0, 0, 0, 0.25);
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    height: 40px;
    font-family: "PingFangSC-Regular";
  }
</style>

<style lang="less">
  div.manage-warn-view {
    width: 360px;
    height: 142px;
    .el-message-box__header {
      .el-message-box__headerbtn {
        top: 12px;
        right: 16px;
      }
    }
    .el-message-box__content {
      padding-left: 32px;
      padding-right: 16px;
    }
    .el-message-box__btns {
      padding-top: 22px;
      padding-right: 16px;
      button {
        height: 32px;
        padding: 0px 22px;
        line-height: 30px;
        font-size: 14px;
      }
    }
    .el-message-box__status {
      font-size: 17px !important;
    }
    .el-message-box__message {
      font-size: 16px;
      font-family: 'PingFangSC-Regular';
      color: rgba(0,0,0,0.85);
      font-weight: 700;
    }
    .el-message-box__status+.el-message-box__message {
      padding-left: 33px;
    }
  }
  div.historyView {
    div.el-dialog {
      div.el-dialog__header {
        border-bottom: 1px solid #e6e6e6;
        padding: 16px 16px 12px 24px;
      }
      div.el-dialog__body {
        padding: 8px 16px 28px 24px;
      }
    }
  }
  div.stepDiv .el-step__icon {
    border-color: #51A6FF;
    width: 8px;
    height: 8px;
  }
  div.stepDiv .el-step__line{
    left: 3px !important;
  }
  div.stepDiv .el-step:nth-of-type(1) .el-step__line{
    top: 8px !important;
  }
  div.stepDiv .el-step:last-of-type .el-step__line{
    height: 10px !important;
    background-color: #c0c4cc;
    display: inline-block;
  }
  div.ivu-message div.ivu-message-notice{
    div.ivu-message-notice-content {
      padding: 0px;
      height: 40px;
      font-size: 14px;
      line-height: 40px;
      width: 616px;
      border-radius: 4px;
      div.ivu-message-notice-content-text {
        width: 100%;
        border-radius: 4px;
        div.ivu-message-custom-content {
          text-align: left;
          padding-left: 16px;
          padding-right: 16px;
          border-radius: 4px;
          .ivu-icon {
            width: 14px;
            height: 14px;
          }
        }
        div.ivu-message-custom-content.ivu-message-success {
          background-color: #F6FFED;
          border: 1px solid #B7EB8F;
        }
        div.ivu-message-custom-content.ivu-message-warning {
          background-color: #FFFBE6;
          border: 1px solid #FFE58F;
        }
        div.ivu-message-custom-content.ivu-message-info {
          background-color: #E6F7FF;
          border: 1px solid #91D5FF;
        }
        div.ivu-message-custom-content.ivu-message-error {
          background-color: #FFF1F0;
          border: 1px solid #FFA39E;
        }
      }
    }
  }
  .el-message-box__wrapper{
    button{
      font-size: 14px;
      height: 32px;
      width: 74px;
      line-height: 30px;
      padding: 0;
    }
  }
</style>
