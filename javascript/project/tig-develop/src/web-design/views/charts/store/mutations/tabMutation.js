export default {
  // 标题的修改
  tabChangeTitle (state, {index, key, value}) {
    state.chartsOption[index].feature.title[key] = value
  },
  // tab每个标签页的标题修改
  tabNameChange (state, {index, tabIndex, value}) {
    state.chartsOption[index].feature.tabs[tabIndex].name = value
  },
  // 添加一个标签页
  addTab (state, {index ,id}) {
    state.chartsOption[index].feature.tabs.push(
      {
        name: '未命名',
        drop: false,
        id
      }
    )
  },
  // 删除一个标签页
  delTab (state, {index, tabIndex}) {
    state.chartsOption[index].feature.tabs[tabIndex].drop = true
  },

  // 隐藏tab名称
  showTabName(state, { index, value }) {
    state.chartsOption[index].feature.showTabFlag = value
  }
}
