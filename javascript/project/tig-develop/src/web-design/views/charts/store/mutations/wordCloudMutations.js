import bus from '../../utils/eventBus'
export default {
  // 是否显示tooltip
  showTootipWordCloud (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.tooltip.show = obj.value
    bus.$emit(`updateWordCloud_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  // 保存处理过的数据
  saveHandleData(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.handleData = obj.handleData
  }
}
