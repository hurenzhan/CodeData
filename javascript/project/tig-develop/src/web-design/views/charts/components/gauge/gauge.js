import bus from '../../utils/eventBus'
import state from '../../store/index'

// 根据operate 回滚状态
const analyzeOpetate = (config, store, index) => {
  let operate = config.operate
  let series = store.state.charts.chartsOption[index].feature.styleConfig.config.series

  for (let i = 0; i < operate.length; i++) {
    let change = operate[i].name
    let obj = {
      value: operate[i].optionVal,
      index: index
    }
    // console.log(change)
    switch (change) {
      case 'setColor':
        setColor(obj, store)
        break;
      case 'showLenged':
        showLenged(obj, store)
        break;
      case 'showTool':
        showTool(obj, store)
        break;
      case 'setTick':
        setTick(obj, store)
        break;
      case 'setUnit':
        setUnit(obj, store)
        break;
      // case 'switchTickType':
      //   switchTickType(obj, store)
      default:
        break;
    }
  }
}

const setTick = (obj, store) => {
  store.commit('setTickGauge', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

const setUnit = (obj, store) => {
  store.commit('setUnitGauge', {
    index: obj.index,
    type: obj.value,
    statue: false
  }) 
}

const setColor = (obj, store) => {
  store.commit('setColorGauge', {
    index: obj.index,
    model: obj.value.model,
    type: obj.value.type,
    color: obj.value.color,
    statue: false
  })
}

const showLenged = (obj, store) => {
  store.commit('showLengedGauge', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

const showTooltip = (obj, store) => {
  store.commit('showTooltipGauge', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

const switchTickType = (obj, store) => {
  store.commit('setTickType', {
    index: obj.index,
    type: obj.value,
    statue: false
  })  
}
export {
  analyzeOpetate,
}