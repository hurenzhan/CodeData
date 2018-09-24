export default {
  showTypeToggle (state, { index, key, value }) {
    state.chartsOption[index].feature.styleConfig[key] = value
  },
  // 指标链接列表
  saveLinkList (state, { index, key, linkList }) {
      state.chartsOption[index].feature.styleConfig[key] = linkList
  },
  // 指标链接列表
  searchKeyList (state, { index, key, searchKeyList }) {
    state.chartsOption[index].feature.styleConfig[key] = searchKeyList
  }
}
