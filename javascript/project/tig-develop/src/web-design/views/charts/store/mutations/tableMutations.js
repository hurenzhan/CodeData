import bus from '../../utils/eventBus'
import { ChartTable } from '../../static/configClass'
import Vue from 'vue'
export default {
  // column配置信息改变
  columnsOption(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.columnList.forEach((item, index) => {
      if (item.id === obj.selectedCell) {
        if (obj.name === 'trend' || obj.name === 'sort' || obj.name === 'hover') {
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
      // 选下钻清空其他列的下钻
      if (item.id !== obj.selectedCell && obj.name === 'dill') {
        item.dill = false
      }
    })
    const deliver = {}
    deliver.index = obj.index
    deliver.columnList = state.chartsOption[obj.index].feature.styleConfig.columnList
    bus.$emit(`rendererColumn${obj.index}`, deliver)
  },
  // style样式改变
  changeOption(state, obj) {
    // debugger
    // 存到vuex上
    if (obj.name !== 'moreDim'
      && obj.name !== 'input'
      && obj.name !== 'moreMetric'
      ) {
      state.chartsOption[obj.index].feature.styleConfig[obj.name] = obj.value
    }
    // 这边可以优化一下写成对象的形式
    // 是否显示表格头
    // if (obj.name === 'showHeader') {
    //   // debugger
    //   obj.row = state.chartsOption[obj.index].feature.styleConfig.row
    // }
    // 是否是更多维度
    if (obj.name === 'moreDim') {
      state.chartsOption[obj.index].feature.styleConfig['moreDim'] = obj.value['moreDim']
      state.chartsOption[obj.index].feature.styleConfig['dimSelected'] = obj.value['dimSelected']
    }
    // 冻结
    if (obj.name === 'input') {
      state.chartsOption[obj.index].feature.styleConfig['isInputNumber'] = obj['input']['isInputNumber']
      state.chartsOption[obj.index].feature.styleConfig['inputNumber'] = obj['input']['inputNumber']
    }
    // 更多维度的单选
    // if (obj.name === 'moreDimSingle') {
    //   state.chartsOption[obj.index].feature.styleConfig['moreDimSingle'] = obj.value
    // }
    // 更多指标
    if (obj.name === 'moreMetric') {
      state.chartsOption[obj.index].feature.styleConfig['moreMetric'] = obj.value['moreMetric']
      state.chartsOption[obj.index].feature.styleConfig['moreMetricSelect'] = obj.value['moreMetricSelect']
    }
    bus.$emit(`styleChange${obj.index}`, obj)
  },
  // 新增列显示条形图
  barAddColumn(state, obj) {
    bus.$emit(`addColumnBar${obj.index}`, obj)
  },
    // 删除列显示条形图
  delAddColumn(state, obj) {
    bus.$emit(`delColumnBar${obj.index}`, obj)
  },
  // 保存信息到Vuex
  saveConfig(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig[obj.name] = obj[obj.name]
  },
  // 清空存在vuex里的状态
  tableClearVuex(state, index) {
    let chartTable = new ChartTable()
    Object.keys(chartTable).forEach((v) => {
      state.chartsOption[index].feature.styleConfig[v] = chartTable[v]
    })
  }
}
