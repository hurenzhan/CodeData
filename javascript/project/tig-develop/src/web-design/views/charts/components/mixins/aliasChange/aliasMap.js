export default {
  computed: {
    // 别名
    alias () {
      return this.$store.state.charts.alias
    }
  },
  methods: {
    /**
     * @desc 通过metricCode获取别名，没有别名则返回false
     * @param {*} metricCode
     */
    getAliasByMetricCode (metricCode) {
      const hasAlias = this.alias.metrics.findIndex(
        metricItem => metricItem.metricCode === metricCode
      )
      if (hasAlias === -1) {
        return false
      } else {
        return this.alias.metrics[hasAlias].alias
      }
    },
    /**
     * @desc 通过metricName获取别名，没有别名则返回false
     * @param {*} metricName
     */
    getAliasByMetricName (metricName) {
      const hasAlias = this.alias.metrics.findIndex(
        metricItem => metricItem.metricName === metricName
      )
      if (hasAlias === -1) {
        return false
      } else {
        return this.alias.metrics[hasAlias].alias
      }
    },
    getAliasByDimCode (dimCode) {
      const hasAlias = this.alias.dims.findIndex(
        dimItem => dimItem.dimCode === dimCode
      )
      if (hasAlias === -1) {
        return false
      } else {
        return this.alias.dims[hasAlias].alias
      }
    }
  }
}
