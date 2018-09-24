import bus from '../../utils/eventBus'
export default {
  // 指标选择弹窗的toggle
  toggleWarnDialog (state, value) {
    state.warnDialogToggle = value
  },
  delWarnData(state, {index, warnIndex}) {
    state.chartsOption[index].warnData.splice(warnIndex, 1)
    bus.$emit(`warnUpdate_${index}`, state.chartsOption[index].warnData)
  },
  saveWarnData(state, { emitObj, index, warnIndex }) {
    if (warnIndex === null) {
      state.chartsOption[index].warnData.push(emitObj)
    } else {
      state.chartsOption[index].warnData.splice(warnIndex, 1, emitObj)
    }
    bus.$emit(`warnUpdate_${index}`, state.chartsOption[index].warnData)
  }
}
