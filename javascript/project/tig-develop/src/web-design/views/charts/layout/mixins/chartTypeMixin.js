// 这个mixin专门用来处理来回切换图表和‘更新’按钮的事宜
import {chartCategory} from '../../static/configData'
import {calcNumOfMeasure, calcNumMetricListFlat} from '../../utils/utils'

export default {
  data () {
  },
  computed: {
    // ‘更新’按钮的高亮状态
    updateBtnActive () {
      return this.selectedOption.updateBtnActive
    },
    // 并不是所有类型的图表都支持指标的属性展开，这个字段就是表示当前图表是否支持
    supportMetricFeature () {
      const chartId = this.selectedOption.feature.chartId
      const notSupportArr = [1, 3, 6, 7, 12]
      return !notSupportArr.includes(chartId)
    }
  },
  watch: {
    // 不支持指标属性的展开时，将所选指标的value1置为true，其他都置为false，即初始化
    supportMetricFeature (val) {
      if (!val) {
        this.$store.commit('resetMetricFeature', {
          index: this.index
        })
      }
    }
  },
  methods: {
    // ‘更新’按钮的高亮状态toggle
    updateBtnActiveToggle (value) {
      this.$store.commit('updateBtnActiveToggle', {
        index: this.index,
        value
      })
    },
    // 当前选中的指标和数据是否适合当前图表样式，不适合的话，切换成表格
    dataSetChangeHandle () {
      const chartId = this.selectedOption.feature.chartId
      const metricsNum = calcNumOfMeasure(this.selectedOption.feature.metricList)
      const metricsFistNum = calcNumMetricListFlat(this.selectedOption.feature.metricListFlat)
      const metricCount = this.selectedOption.feature.metricList.length
      const dimsNum = this.selectedOption.feature.dimList.length
      const dimCode = this.selectedOption.feature.dimList.map(item => item.dimCode)
      const dimType = this.selectedOption.feature.dimList.map(item => item.dimType)
      const flag = chartCategory[chartId].isRecommend({metricsNum, metricsFistNum, dimsNum, dimCode, dimType, metricCount})
      const chartName = chartCategory[chartId].name
      if (!flag) {
        this.$message({
          message: `当前数据不适用于当前图表(${chartName})，为您切为表格`,
          type: 'info'
        })
        this.$store.commit('selectType', {
          index: this.index,
          id: 0
        })
      }
    }
  }
}
