import bus from '../../utils/eventBus'
import { SimpleChartTable } from '../../static/configClass'
import Vue from 'vue'
export default {
  // column配置信息改变
  simpleColumnsOption (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.columnList.forEach(
      (item, index) => {
        if (item.id === obj.selectedCell) {
          if (
            obj.name === 'trend' ||
            obj.name === 'sort' ||
            obj.name === 'hover'
          ) {
            item[obj.name] = !item[obj.name]
            if (obj.name === 'sort' && !item[obj.name]) {
              item.sort = false
              item.sortType = ''
            }
          } else if (obj.name === 'dill') {
            item[obj.name] = true
          } else {
            Vue.set(item, obj.name, obj.value)
            // item[obj.name] = obj.value
          }
        }
        // 选排序清空其他列的排序
        // if (item.id !== obj.selectedCell && obj.name === 'sort') {
        //   item.sort = false
        // }
        // 选下钻清空其他列的下钻
        if (item.id !== obj.selectedCell && obj.name === 'dill') {
          item.dill = false
        }
      }
    )
    const deliver = {}
    deliver.index = obj.index
    deliver.name = obj.name
    deliver.columnList =
    state.chartsOption[obj.index].feature.styleConfig.columnList
    bus.$emit(`simpleRendererColumn${obj.index}`, deliver)
  },
  // style样式改变
  changeSimpleOption (state, obj) {
    // 存到vuex上
    if (obj.name !== 'input') {
      state.chartsOption[obj.index].feature.styleConfig[obj.name] = obj.value
    }
    // 这边可以优化一下写成对象的形式
    bus.$emit(`simpleStyleChange${obj.index}`, obj)
  },
  // 新增列显示条形图
  simpleBarAddColumn (state, obj) {
    bus.$emit(`simpleAddColumnBar${obj.index}`, obj)
  },
  // 删除列显示条形图
  simpleDelAddColumn (state, obj) {
    bus.$emit(`simpleDelColumnBar${obj.index}`, obj)
  },
  // 保存信息到Vuex
  simpleSaveConfig (state, obj) {
    // Vue.set(state.chartsOption[obj.index].feature.styleConfig, obj.name, obj[obj.name])
    state.chartsOption[obj.index].feature.styleConfig[obj.name] = obj[obj.name]
  },
  easyTableSetContainerWidth (state, { index, w }) {
    state.chartsOption[index].w = w
    bus.$emit('searchReset')
  },
  // 清空存在vuex里的状态
  simpleTableClearSettings (state, index) {
    let chartTable = new SimpleChartTable()
    Object.keys(chartTable).forEach(v => {
      if(v !== 'isExport' && v !== 'isPage' && v !== 'isShowTop' && v !== 'jumpDeatil' 
      && v !== 'pageSize' && v !== 'selectedTopList' && v !== 'tableBorder' 
      && v !== 'trendAddPercent'){
        state.chartsOption[index].feature.styleConfig[v] = chartTable[v]
      }
    })
  },
  saveSimpleDetailConfig(state, obj){
    Object.keys(obj[obj.name]).forEach(v => {
      state.chartsOption[obj.index][v] = obj[obj.name][v]
    })
  },
  // 查找悬浮表格维度
  queryHoverDimlist (state, obj) {
    // 选取指标下的所以维度
    const dimList = obj.dataSet.filter(item => item.metricCode === obj.value)[0].dimList
    // 过滤掉当前维度和时间维度
    const filterDimList = dimList.filter(item => item.dimCode !== obj.id && item.dimCode !== 'dasp_date')
    state.chartsOption[obj.index].feature.styleConfig[obj.name] = filterDimList
  }
}
