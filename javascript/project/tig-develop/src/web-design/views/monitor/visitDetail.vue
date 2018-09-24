<template>
  <div>
    <div class="monitor-select"> 
      <section class="monitor-select-section">
        <DatePicker v-model="startDate" :options="limitDate" :editable="false" @on-change="date1Change" type="date" placeholder="开始时间" style="width: 110px"></DatePicker>
        <span class="doubleLine">&nbsp;--&nbsp;</span>
        <DatePicker v-model="endDate" :options="limitDate" :editable="false" @on-change="date2Change" type="date" placeholder="结束时间" style="width: 110px"></DatePicker>
      </section>
      <!-- <section class="monitor-select-section">
        <Select v-model="getTableData.body.industryId" @on-change="industryChange" placeholder="请选择产业" style="width:140px" filterable clearable>
          <Option v-for="item in industrys" :value="item.valueId" :key="item.valueId">{{ item.name }}</Option>
        </Select>
      </section>
      <section class="monitor-select-section">
        <Select v-model="getTableData.body.domainId" @on-change="businessChange" placeholder="请选择业务域" style="width:140px" filterable clearable>
          <Option v-for="item in business" :value="item.valueId" :key="item.valueId">{{ item.name }}</Option>
        </Select>
      </section>
      <section class="monitor-select-section">
        <Select v-model="getTableData.body.firstSubject" @on-change="firstTopicChange" placeholder="请选择一级主题" style="width:140px" filterable clearable>
          <Option v-for="item in firstTopic" :value="item.valueId" :key="item.valueId">{{ item.name }}</Option>
        </Select>
      </section>
      <section class="monitor-select-section">
        <Select v-model="getTableData.body.secondSubject" @on-change="queryItem" placeholder="请选择二级主题" style="width:140px" filterable clearable>
          <Option v-for="item in secondTopic" :value="item.valueId" :key="item.valueId">{{ item.name }}</Option>
        </Select>
      </section> -->
      <div style="height:24px" class="searchWra">
         <Input icon="ios-search" placeholder="报表ID/名称搜索" style="width:200px" v-model="getTableData.body._search" @on-change="queryItem"></Input>
      </div>
    </div>
    <tablePaging ref="dataTable" :ajax="getTableData" :type="3" :columns="repVisitHeaderList"></tablePaging>
  </div>
</template>

<script>
import headerListMixin from './tableHeaderLists'
import apiMonitor from '@/web-design/api/monitor'
import tools  from './commonTool'

export default {
  data() {
    return {
      getTableData: apiMonitor.getVisitDetailTableData,
      startDate: '',
      endDate: ''
    }
  },
  mounted() {
    // this.getIndustrys()
    // 时间必选,所以挂载时就设置显示时间
    this.getTableData.body.startDate = this.formatRecentTime(true)
    this.getTableData.body.endDate = this.formatRecentTime(false)
    this.startDate = this.formatRecentTime(true)
    this.endDate = this.formatRecentTime(false)
  },
  methods: {
    // 查询日期范围改变
    date1Change(timeStr) {
      if (!timeStr) {
        this.startDate = ''
        this.getTableData.body.startDate = ''
        this.$Message.warning('查询时间不能为空')
      } else {
        this.startDate = timeStr
        this.getTableData.body.startDate = `${timeStr} 00:00:00`
        this.queryItem()
      }
    },
    date2Change(timeStr) {
      if (!timeStr) {
        this.endDate = ''
        this.getTableData.body.endDate = ''
        this.$Message.warning('查询时间不能为空')
      } else {
        this.endDate = timeStr
        this.getTableData.body.endDate = `${timeStr} 23:59:59`
        this.queryItem()
      }
    },
    clearQueryConditions() {
      this.getTableData.body.startDate = this.formatRecentTime(true)
      this.getTableData.body.endDate = this.formatRecentTime(false)
      // this.getTableData.body.industryId = ''
      // this.getTableData.body.domainId = ''
      // this.getTableData.body.firstSubject = ''
      // this.getTableData.body.secondSubject = ''
      this.getTableData.body._search = ''
      // this.business = []
      // this.firstTopic = []
      // this.secondTopic = []
      this.startDate = this.formatRecentTime(true)
      this.endDate = this.formatRecentTime(false)
      this.$refs.dataTable.limit = 10
      this.$refs.dataTable.judgeType()
    }
  },
  mixins: [tools, headerListMixin]
}
</script>

<style lang="less" scoped>
  .monitor-select {
    margin-top: 4px;
    position: relative;
    display: flex;
    min-width: 1052px;
    .monitor-select-section {
      display: flex;
      margin-right: 12px;
      .doubleLine{
        height: 32px;
        line-height: 32px;
      }
    }
  }
  div.searchWra{
    position: absolute;
    right: 0px;
  }
</style>