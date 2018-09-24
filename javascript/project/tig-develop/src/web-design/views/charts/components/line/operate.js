import bus from '../../utils/eventBus'
import state from '../../store/index'

// 根据operate 回滚状态
const analyzeOpetate = (config, store, index, operate) => {
  let series = store.state.charts.chartsOption[index].feature.styleConfig.config.series

  for (let i = 0; i < operate.length; i++) {
    let change = operate[i].name
    let obj = {
      value: operate[i].optionVal,
      index: index
    }
    // console.log(change)
    // 相对初始化时的默认值有变化时 执行恢复选项
    switch (change) {
      case 'changeCrosswise':
        if (obj.value) {
          changeCrosswise(obj, store)
          config.operate.push(operate[i])
        }
        break;
      // 双Y轴时 指标数据不满足双Y轴条件时 不进行状态恢复
      case 'changeDoubleY':
        if (obj.value && series.length === 2) {
          changeDoubleY(obj, store)
          config.operate.push(operate[i])
        }
        break;
      // 柱状图时 指标数据不满足条件时 不进行状态恢复
      case 'changeType':
        if (obj.value && series.length === 2) {
          changeType(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'showArea':
        if (obj.value) {
          showArea(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'changeSmooth':
        if (obj.value) {
          changeSmooth(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'isShowX':
        isShowX(obj, store)
        config.operate.push(operate[i])
        break;
      case 'isShowY':
        isShowY(obj, store)
        config.operate.push(operate[i])
        break;
      case 'changeAxisTitle':
        if (obj.value) {
          changeAxisTitle(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'modifyXAxisTitle':
        if (obj.value) {
          modifyXAxisTitle(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'modifyYAxisTitle':
        if (obj.value) {
          modifyYAxisTitle(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'showTable':
        if (obj.value) {
          showTable(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'showLegend':
        showLegend(obj, store)
        config.operate.push(operate[i])
        break;
      case 'changeLengend':
        changeLengend(obj, store)
        config.operate.push(operate[i])
        break;
      case 'showTooltip':
        showTooltip(obj, store)
        config.operate.push(operate[i])
        break;
      case 'showValue':
        if (obj.value) {
          showValue(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'showShadow':
        if (obj.value) {
          showShadow(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'showSlider':
        let dimCode = store.state.charts.chartsOption[obj.index].feature.dimList[0].dimCode
        if (obj.value && dimCode === 'dasp_date') {
          showSlider(obj, store)
          config.operate.push(operate[i])
        }
        break;
      case 'changeTimeSet':
        if (obj.value) {
          // 特殊处理 必须在changeTimeSet之前执行
          config.operate.push(operate[i])
          changeTimeSet (obj, store)
        }
        break;
      case 'setNumberTime':
        // 特殊处理 必须在 setNumberTime 之前执行
        config.operate.push(operate[i])
        setNumberTime (obj, store)
        break;
      case 'setValueSum':
        setValueSum (obj, store)
        config.operate.push(operate[i])
      default:
        break;
    }
  }
}
// 图例位置
const changeLengend = (obj, store) => {
  store.commit('setLegendPosition', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

// XY交叉
const changeCrosswise = (obj, store) => {
  store.commit('changeXtoY', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

// 是否显示轴标题
const changeAxisTitle = (obj, store) => {
  store.commit('showAxisTitile', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

// 轴标题自定义名称配置
const modifyXAxisTitle = (obj, store) => {
  store.commit('modifyXAxisTitleShow', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

// 轴标题自定义名称配置
const modifyYAxisTitle = (obj, store) => {
  store.commit('modifyYAxisTitleShow', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

// 是否显示双Y轴
const changeDoubleY = (obj, store) => {
  store.commit('showDoubleY', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

const showTooltip = (obj, store) => {
  store.commit('showTootip', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

const showShadow = (obj, store) => {
  store.commit('showTootipType', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

// 切换折线图的type类型
const changeType = (obj, store) => {
  store.commit('switchType', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

// 是否显示X轴
const isShowX = (obj, store) => {
  store.commit('switchXshow', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

// 是否显示Y轴
const isShowY = (obj, store) => {
  store.commit('switchYshow', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

// 当前style 线条是否smooth
const changeSmooth = (obj, store) => {
  store.commit('switchSmooth', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

// 当前style 是否堆叠区域图
const showArea = (obj, store) => {
  store.commit('switchArea', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

// 是否显示图例
const showLegend = (obj, store) => {
  store.commit('switchLegend', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

// 是否显示图表切换开关
const showTable = (obj, store) => {
  store.commit('switchTable', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

const showValue = (obj, store) => {
  store.commit('switchValue', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

const showSlider = (obj, store) => {
  store.commit('switchSlider', {
    type: obj.value,
    index: obj.index,
    statue: false,
  })
}

const changeTimeSet = (obj, store) => {
  store.commit('changeTimeSet', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

const setNumberTime = (obj, store) => {
  store.commit('setNumberTime', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}

const setValueSum = (obj, store) => {
  store.commit('setValueSum', {
    type: obj.value,
    index: obj.index,
    statue: false
  })
}
export {
  getLegendData,
  analyzeOpetate,
}
