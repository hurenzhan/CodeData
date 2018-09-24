export default {
  showTypeToggle (state, {index, key, value}) {
    state.chartsOption[index].feature.styleConfig[key] = value
  },
  showNumbInt (state, {index, key, value}) {
    state.chartsOption[index].feature.styleConfig[key] = value
  },
  filterDimValue (state, { index, value }) {
    state.chartsOption[index].feature.styleConfig.filterDimValueFlag = value
  },
  saveDimValueList (state, { index, dimValueList }) {
    state.chartsOption[index].feature.styleConfig.dimValueList = dimValueList
  },
  selectDimValue (state, { index, selectedDimValue }) {
    state.chartsOption[index].feature.styleConfig.selectedDimValue = selectedDimValue
  },
  saveFilterData (state, { index, filterData }) {
    state.chartsOption[index].feature.styleConfig.filterData = filterData
  }
}
