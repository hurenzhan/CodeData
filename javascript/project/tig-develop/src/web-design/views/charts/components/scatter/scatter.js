import bus from '../../utils/eventBus'
import state from '../../store/index'

// 根据operate 回滚状态
const analyzeOpetate = (config, store, index) => {
  let operate = config.operate
  let series = store.state.charts.chartsOption[index].feature.styleConfig.config.series
  // console.log(operate)
  for (let i = 0; i < operate.length; i++) {
    let change = operate[i].name
    let obj = {
      value: operate[i].optionVal,
      index: index
    }
    // console.log(change)
    switch (change) {
      case 'showZoom':
        if (obj.value) {
          showZoom(obj, store)
        }
      case 'showAxisTitle':
        if (obj.value) {
          showAxisTitle(obj, store)
        }
        break;
      case 'showLegend':
        showLegend(obj, store)
        break;
      case 'changeLengend':
        changeLengend(obj, store)
        break; 
      case 'showTooltip':
        showTooltip(obj, store)
        break; 
      default:
        break;
    }
  }
}
const showZoom = (obj, store) => {
  store.commit('showZoomScatter', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

const showAxisTitle = (obj, store) => {
  store.commit('showTitleScatter', {
    index: obj.index,
    type: obj.value,
    statue: false
  })        
}

const showLegend = (obj, store) => {
  store.commit('showLegendScatter', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

const showTooltip = (obj, store) => {
  store.commit('showTootipScatter', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

// 图例位置
const changeLengend = (obj, store) => {
  store.commit('setLegendScatter', {
    index: obj.index,
    type: obj.value,
    statue: false
  })
}

export {
  analyzeOpetate,
}