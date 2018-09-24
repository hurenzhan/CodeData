import bus from '../../utils/eventBus'
import { CrossChartTable } from '../../static/configClass'
import Vue from 'vue'

export default {
  // column配置信息改变
  crossColumnsOption(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.columnList.forEach((item, index) => {
      if (item.id === obj.selectedCell) {
        if (obj.name === 'trend' || obj.name === 'sort' || obj.name === 'hover') {
          item[obj.name] = !item[obj.name]
          if (name === 'sort' && !item[obj.name]) {
            item.sort = false
            item.sortType = ''
          }
        } else if (obj.name === 'showGrowth') {
          item[obj.name] = obj.value
        } else {
          Vue.set(item, obj.name, obj.value)
          // item[obj.name] = obj.value
        }
      }
      // 选排序清空其他列的排序
      // if (item.id !== obj.selectedCell && obj.name === 'sort') {
      //   item.sort = false
      // }
    })
    const deliver = {}
    deliver.index = obj.index
    deliver.columnList = state.chartsOption[obj.index].feature.styleConfig.columnList
    bus.$emit(`crossRendererColumn${obj.index}`, deliver)
  },
  // style样式改变
  changeCrossOption(state, obj) {
    // 存到vuex上
    state.chartsOption[obj.index].feature.styleConfig[obj.name] = obj.value
    // 这边可以优化一下写成对象的形式
    // 是否显示表格头
    if (obj.name === 'showHeader') {
      obj.row = state.chartsOption[obj.index].feature.styleConfig.row
    }
    bus.$emit(`crossStyleChange${obj.index}`, obj)
  },
  // 保存信息到Vuex
  crossSaveConfig(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig[obj.name] = obj[obj.name]
  },
  // 清空存在vuex里的状态
  crossTableClearVuex(state, index) {
    let chartTable = new CrossChartTable()
    Object.keys(chartTable).forEach((v) => {
      state.chartsOption[index].feature.styleConfig[v] = chartTable[v]
    })
    // console.log(state.chartsOption[index].feature.styleConfig.moreDimList)
    // state.chartsOption[index].feature.styleConfig.columnList = []
    // state.chartsOption[index].feature.styleConfig.row = 1
    // state.chartsOption[index].feature.styleConfig.pageSize = 10
    // state.chartsOption[index].feature.styleConfig.currentPage = 1
    // state.chartsOption[index].feature.styleConfig.tableHeader = []
    // state.chartsOption[index].feature.styleConfig.showTotal = false
    // state.chartsOption[index].feature.styleConfig.showHeader = true
    // state.chartsOption[index].feature.styleConfig.showNumber = false
    // state.chartsOption[index].feature.styleConfig.inputNumber = ''
    // state.chartsOption[index].feature.styleConfig.hansonMerage = []
    // state.chartsOption[index].feature.styleConfig.allTotal = {}
    // state.chartsOption[index].feature.styleConfig.singleSplit = []
    // state.chartsOption[index].feature.styleConfig.jumpDeatil = false
    // state.chartsOption[index].feature.styleConfig.isSingleSplit = false
    // state.chartsOption[index].feature.styleConfig.selectRoute = ''
    // state.chartsOption[index].feature.styleConfig.showPicture = false
    // state.chartsOption[index].feature.styleConfig.moreDim = false
  }
}
