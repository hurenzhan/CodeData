// fix可用配置的维度及指标未根据配置在其他图表的维度及指标的变化而变化

import {getMetricOrDimUsed} from '../../../utils/utils'

export default {
  computed: {
    // 所有可选指标
    metricList () {
      return getMetricOrDimUsed(this.$store.state.charts.chartsOption, 1).map(item => item.metricCode)
    },
    // 所有可选维度
    dimList () {
      return getMetricOrDimUsed(this.$store.state.charts.chartsOption, 2).map(item => item.dimCode)
    },
    // 已使用的指标
    metricUsed () {
      return this.currentContainer.feature.dataMetricData.map(item => item.metricCode)
    }
  },
  watch: {
    metricList () {
      // console.log('metricList')
      let needDelArr = []
      this.metricUsed.forEach((item, index) => {
        if (!this.metricList.includes(item)) needDelArr.push(index)
      })
      if (!needDelArr.length) return
      this.$store.commit('searchHandleMetricChange', {
        index: this.index,
        needDelArr
      })
    }
  }
}
