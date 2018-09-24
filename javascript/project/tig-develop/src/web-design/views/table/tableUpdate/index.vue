<template>
  <div class="table-Breadcrumb">
    <title-bar :showBack="true" title="" :bread="[{link: '', name: '报表'},{link: '', name: '电子表格'},{link: '', name: '修改自定义报表'}]"></title-bar>
    <div style="height: 8px; background: rgba(0, 0, 0, 0.04)"></div>
    <div class="table-area">
      <!--metric/dimList-->
      <filterPanel :checkList="dimentionArray" :checkArray="checkArray" :checkList2="metricArray" @handleCloseEvent="handleClose" @emptyAll="processFilter">
          <span slot="dimension" class="left-panel">可用维度</span>
          <div slot="footer" class="btns">
            <Button class="left-distance btnclass" type="primary" :disabled="twoDimesional" v-on:click="pageJump(1)">修改二维表</Button>
            <Button class="left-distance btnclass" type="primary" :disabled="crossType" v-on:click="pageJump(2)">修改交叉表</Button>
          </div>
      </filterPanel>
      <!--selection-->
      <div class="cockpit-select-option">
        <div>
          <Select clearable class="cockpit-select__item" v-model="getDataTable.body.busiTypes" @on-change='querySubject' placeholder="请选择业务域" style="width:150px" filterable>
            <Option v-for="item in business.data" :value="item.valueId" :key="item.valueId">{{ item.name }}</Option>
          </Select>
          <Select class="cockpit-select__item" v-model="getDataTable.body.subjects" @on-change='subjChange' placeholder="请选择主题" style="width:150px" filterable clearable>
            <Option v-for="item in subject.data" :value="item.subCode" :key="item.subCode">{{ item.subName }}</Option>
          </Select>
          <Select class="cockpit-select__item" v-model="getDataTable.body.timeGranularitys" @on-change='timeChange' placeholder="请选择时间粒度" style="width:150px" filterable clearable>
            <Option v-for="item in time.data" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Select class="cockpit-select__item" v-model="getDataTable.body.dimCodes" @on-change='dimChange' placeholder="请选择权限维度" style="width:150px" filterable clearable>
            <Option v-for="item in dimension.data" :value="item.dimId" :key="item.dimId">{{ item.dimName }}</Option>
          </Select>
          <!-- <Checkbox class="cockpit-select__check" v-model="single" @on-change="clickSingle">只显示权限内指标</Checkbox> -->
        </div>
        
        <div class="cockpit-select_icon">
          <Input v-model="getDataTable.body.searchKey" class="search" icon="ios-search" placeholder="请输入ID/指标名称搜索..." style="width: 200px" @on-change="keyChangeEnter"></Input>
        </div>
      </div>
      <!--tablePaging
        @dataLoaded="getInfo"
      -->
      <table-paging
        ref="dataTable"
        :type="2"
        :ajax="getDataTable"
        :columns="tableInfo.columns"
        :data="tableInfo.data"
        :show="showChecked"
        @on-select="selectOne"
        @on-select-cancel="cancelSelect"
        @on-select-all="selectAll"
        @on-select-change="selectChange"
        @tableChangePage="pageChange">
      </table-paging>
    </div>
  </div>
</template>

<script>
import filterPanel from '../filterPanel'
import mixins from '../mixinsRepeat/mixinsReport'
import apiReport from '@/web-design/api/report'

export default {
  name: 'report-edit-pages',
  mixins: [mixins],
  components: {
    filterPanel
  },
  data() {
    return {
      getDataTable: apiReport.getList // 表格信息
    }
  },
  mounted() {
     // 判断报表类型，置灰按钮
    const reportType = this.$route.query.reportType
    if (Number(reportType) === 1) {
      // 交叉表按钮禁用
      this.twoDimesional = false
      this.crossType = true
    } else {
      // 二维表按钮禁用
      this.twoDimesional = true
      this.crossType = false
    }
    this.initMethods()
    // 流程id下拉选
    this.queryInfo() // 查询数据
  },
  methods: {
     // 初始化过滤权限指标
    // getInfo(e) {
    //   if (!e) return
    //   e.forEach((item) => {
    //     if (item.authority === '0') {
    //       item._disabled = true
    //     }
    //   })
    // },
    // 编辑二维表/交叉表(saveMethod)
    async pageJump(typeVal) {
      // 勾选校验
      if (this.metricArray.length === 0) {
        this.$Message.warning('请先勾选列表行,再进行创建！')
        return
      }
      // 报表创建
      const dataInfo = this.queryData
      const dimRspDtos = []
      const micRspDtos = []
      const reportContent = {}// JSON.parse(dataInfo.reportContent)
      // 维度信息
      this.dimentionArray.forEach((item) => {
        dimRspDtos.push({
          dimCode: item.dimCode,
          dimName: item.dimName,
          isPrivilege: item.isPrivilege,
          reportId: dataInfo.reportId,
          versionId: dataInfo.versionId,
        })
      })
      // 指标信息
      this.metricArray.forEach((item) => {
        micRspDtos.push({
          metricId: item.metricsCode,
          metricName: item.metricName,
          timeGranularity: item.timeGranularity,
          timeGranularityName: item.timeGranularityName,
          unitDefaultNm: item.unitDefaultNm,
          reportId: dataInfo.reportId,
          versionId: dataInfo.versionId,
        })
      })
      reportContent.metricIdList = micRspDtos
      reportContent.dimIdList = dimRspDtos
      reportContent.reportContent = {}

      // 更新报表信息接口
      const result = await apiReport.changeReport({
        versionId: dataInfo.versionId,
        reportId: dataInfo.reportId,
        reportName: dataInfo.reportName,
        reportDesc: dataInfo.reportDesc,
        reportType: dataInfo.reportType,
        reportContent: JSON.stringify(reportContent)
      })
      // debugger
      if (!result) return
      if (result.statusCode === '0') {
        this.$router.push({
          path: '/design',
          query: {
            reportType: typeVal,
            reportId: dataInfo.reportId,
            versionId: dataInfo.versionId,
            reportName: dataInfo.reportName
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btns{
  padding-top: 20px;
}
.left-distance{
  margin-right: 8px;
}
.selectedData {
  width:200px;
}
.btns {
  padding-top: 20px;
}

.left-distance {
  margin-right: 8px;
}
.btnclass,
.flowIdSelec{
  float:left;
}
.flowIdSelec{
    margin-left: 14px;
    width: 180px;
}
.cockpit-select-option {
  // display: block;
  // min-width: 960px;
    display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.cockpit-select_icon {
  display: inline-block;
  float: right;
}

@cockpit-select-color: #F5F5F5;
.cockpit-select {
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cockpit-select__check {
  margin-left: 20px;
}

.cockpit-select__item {
  margin-right: 10px;
}

.ivu-select-placeholder {
  background-color: @cockpit-select-color !important;
}
</style>
<style>
.reportCreate-id{
  color: #9F9F9F;
  font-size: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.reportCreate-name{
    color: #333;
    font-size: 12px;
    /*控制两行显示*/
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

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
