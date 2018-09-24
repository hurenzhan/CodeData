export default {
  // 添加指标别名
  addMetricAlias (state, {metricCode, metricName, alias}) {
    // 如果state.alias不存在这个metricCode则push，存在则修改别名
    const hasIndex = state.alias.metrics.findIndex(item => item.metricCode === metricCode)
    if (hasIndex === -1) {
      state.alias.metrics.push({
        metricCode,
        metricName,
        alias
      })
    } else {
      state.alias.metrics[hasIndex].alias = alias
    }
  },
  // 删除指标别名
  delMetricAlias (state, {metricCode}) {
    const toDelIndex = state.alias.metrics.findIndex(item => item.metricCode === metricCode)
    state.alias.metrics.splice(toDelIndex, 1)
  },
  // 同步指标or维度别名
  syncMetricAlias (state, {data, type}) {
    state.alias[type] = data
  },
  // 添加指标别名
  addDimAlias (state, {dimCode, dimName, alias}) {
    const hasIndex = state.alias.dims.findIndex(item => item.dimCode === dimCode)
    if (hasIndex === -1) {
      state.alias.dims.push({
        dimCode,
        dimName,
        alias
      })
    } else {
      state.alias.dims[hasIndex].alias = alias
    }
  },
  // 删除指标别名
  delDimAlias (state, {dimCode}) {
    const toDelIndex = state.alias.dims.findIndex(item => item.dimCode === dimCode)
    state.alias.dims.splice(toDelIndex, 1)
  }
}
