<template>
  <div class="configMoreData">
    <div class="title">
      <dot></dot>
      <span>更多数据</span>
    </div>
    <div class="row">
      <el-checkbox v-model="showMoreDataFlag">更多数据</el-checkbox>
    </div>
    <div class="row">
      <el-select
        v-model="selectedReport"
        remote
        size="small"
        filterable
        placeholder="请选择报表名"
        clearable
        :disabled="!showMoreDataFlag"
        :remote-method="handleItemChange"
        @clear="clearReport"
        >
        <el-option
          v-for="item in lockedReportList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="row">
      <el-select
        v-model="selectReportVersion"
        placeholder="请选择版本号"
        :disabled="selectedReport === ''"
        size="small"
        >
        <el-option
          v-for="item in reportVersionList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import dot from './dot'
import api from '@/web-design/api/report'
export default {
  name: 'configMoreData',
  data () {
    return {
    }
  },
  components: {
    dot
  },
  computed: {
      // 选中容器的index
      index () {
        return this.selectedOption.i
      },
      // 选中的容器
      selectedOption () {
        return this.$store.state.charts.chartsOption.filter(item => !item.drop && item.selected)[0]
      },
      // 剩余指标
      dataSetRest () {
        return this.$store.state.charts.dataSet.filter(item => !this.selectedOption.feature.metricList.some(each => each.metricCode === item.metricCode))
      },
      // 交叉维度
      crossDimList () {
        return getCrossDimList(this.$store.state.charts.dataSet, this.selectedOption.feature.metricList)
      },
      // 是否显示更多数据
      showMoreDataFlag: {
        set(value) {
        // 如果取消选中，就及时清空列表里已选中的报表
          if (!value) {
            this.clearReport()
          } else {
            console.log(value, '++++')
            this.getReportList(this.reportSearchKey) // 如果选中就去请求接口
          }
          this.$store.commit('showMoreData', { index: this.index, value})
        },
        get() {
          return this.selectedOption.showMoreDataFlag || false
        }
      },
      // 已锁定报表列表
      lockedReportList() {
        return this.selectedOption.lockedReportList
      },
      // 获取当前选择的报表版本
      reportVersionList() {
        return this.selectedOption.reportVersionList || []
      },
      // 已选择的报表
      selectedReport: {
        set (value) {
          this.$store.commit('saveSelectedReport', {index: this.index, selectedReport: value})
          const reportChildren = this.lockedReportList.filter(item => item.value === value)
          reportChildren.length !== 0 && this.$store.commit('getReportVersionList', { index: this.index, reportVersionList: reportChildren[0].children })
          this.$store.commit('saveSelectedReportVersion', {index: this.index, selectedReportVersion: '1.0'}) // 清空报表版本默认1.0版本
        },
        get () {
          return this.selectedOption.selectedReport || ''
        }
      },
      // 已选择报表的版本
      selectReportVersion: {
        set (value) {
          this.$store.commit('saveSelectedReportVersion', {index: this.index, selectedReportVersion: value})
        },
        get () {
          return this.selectedOption.selectedReportVersion || ''
        }
      },
      reportSearchKey () {
        return this.selectedOption.reportSearchKey
      }
  },
  methods: {
    handleItemChange(value) {
      this.getReportList(value)
      this.$store.commit('saveReportSearchKey', {index: this.index, reportSearchKey: value})
    },
    getReportList (searchKey = '') {
      this.$nextTick(async () => {
        let res = await api.getLockedReportList({ params: { searchKey }})
        let reportList = []
        if (res && res.data) {
          res.data.forEach((item, index) => {
            let reportVersion = item.reportVersion.map(report => ({
              value: report,
              label: report
            }))
            reportList.push({value: item.reportId, label: item.reportName,  children: reportVersion})
          })
        }

        this.$store.commit('getLockedReportList', {index: this.index, reportList})
        const reportChildren = this.lockedReportList && this.lockedReportList.filter(item => item.value === this.selectedReport) || []
        reportChildren.length !== 0 && this.$store.commit('getReportVersionList', { index: this.index, reportVersionList: reportChildren[0].children })
      })
    },
    clearReport() {
      this.getReportList()
      this.$store.commit('saveSelectedReport', {index: this.index, selectedReport: ''})
      this.$store.commit('saveReportSearchKey', {index: this.index, reportSearchKey: ''})
    }
  },
  mounted() {
    if (this.showMoreDataFlag) {
      this.getReportList(this.reportSearchKey)
    }
  }
}
</script>

<style lang="less" scoped>
  .configMoreData{
    padding-left: 10px;
    margin-top: 10px;
    padding-top: 10px;
    position: relative;
    .title{
      color: #666;
      font-size: 14px;
      display: block;
    }
    .row{
      display: flex;
      margin: 5px 10px 5px 20px;
      line-height: 2.5;
      box-sizing: border-box;
      >span{
        font-size: 14px;
        margin-right: 10px;
      }
      .el-select{
        flex: 1;
      }
    }
  }
</style>

