import bus from '../../utils/eventBus'
const marginR = 80
const marginT = 20
var left = {
  legend: {
    positionName: 'left',
    show: true,
    type: 'scroll',
    orient: 'vertical',
    left: '0',
    y: 'center',
    padding: [5, 25],
    itemGap: 20,
    itemWidth: 12,
    itemHeight: 12,
    width: 200,
    formatter: function(name){
      return name.length > 11?name.substr(0,10) + "..." : name
    },
    tooltip: {
      show: true,     
      formatter: function(params) {
        const str = '<div style="border-radius:4px;padding:0 5px;font-size:12px;color:rgba(0,0,0,0.65)">' + params.name +'</div'
        return str
      },
      backgroundColor: "rgba(255, 255, 255, 1)",
      extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 200,
    right: 24,
    top: 16,
    bottom: 16,
    containLabel: true
  },
  gridTitle: {
    left: 200,
    right: 24 + marginR,
    top: 16 + marginT,
    bottom: 16,
    containLabel: true    
  }
}
var right = {
  legend: {
    positionName: 'right',
    show: true,
    type: 'scroll',
    orient: 'vertical',
    y: 'center',
    right: '0',
    padding: [5, 15],
    itemGap: 20,
    itemWidth: 12,
    itemHeight: 12,
    width: 170,
    formatter: function(name){
      return name.length > 11?name.substr(0,10) + "..." : name
    },
    tooltip: {
      show: true,     
      formatter: function(params) {
        const str = '<div style="border-radius:4px;padding:0 5px;font-size:12px;color:rgba(0,0,0,0.65)">' + params.name +'</div'
        return str
      },
      backgroundColor: "rgba(255, 255, 255, 1)",
      extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 24,
    right: 200,
    top: 16,
    bottom: 16,
    containLabel: true
  },
  gridTitle: {
    left: 24,
    right: 200,
    top: 16 + marginT,
    bottom: 16,
    containLabel: true
  }
}
var top = {
  legend: {
    positionName: 'top',
    show: true,
    type: 'scroll',
    orient: 'horizontal',
    top: '0',
    padding: [15, 50],
    itemGap: 20,
    itemWidth: 12,
    itemHeight: 12,
    height: 50,
    x: 'center',
    tooltip: {
      show: true,     
      formatter: function(params) {
        const str = '<div style="border-radius:4px;padding:0 5px;font-size:12px;color:rgba(0,0,0,0.65)">' + params.name +'</div'
        return str
      },
      backgroundColor: "rgba(255, 255, 255, 1)",
      extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 24,
    right: 24,
    top: 50,
    bottom: 16,
    containLabel: true
  },
  gridTitle: {
    left: 24,
    right: 24 + marginR,
    top: 50 + marginT,
    bottom: 16,
    containLabel: true
  }
}
var bottom = {
  legend: {
    positionName: 'bottom',
    show: true,
    type: 'scroll',
    orient: 'horizontal',
    bottom: '0',
    padding: [15, 50],
    itemGap: 20,
    itemWidth: 12,
    itemHeight: 12,
    height: 50,
    x: 'center',
    tooltip: {
      show: true,     
      formatter: function(params) {
        const str = '<div style="border-radius:4px;padding:0 5px;font-size:12px;color:rgba(0,0,0,0.65)">' + params.name +'</div'
        return str
      },
      backgroundColor: "rgba(255, 255, 255, 1)",
      extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 24,
    right: 24,
    top: 16,
    bottom: 50,
    containLabel: true
  },
  gridTitle: {
    left: 24,
    right: 24 + marginR,
    top: 16 + marginT,
    bottom: 50,
    containLabel: true
  }
}

var gridDefault = {
    left: 24,
    right: 24,
    top: 16,
    bottom: 16,
    containLabel: true 
}

var gridDefaultTitle = {
    left: 24,
    right: 24 + marginR,
    top: 16 + marginT,
    bottom: 16,
    containLabel: true
}

// 配置legend data[]
const getLegendData = (dimList) => {
  return dimList.map((item, index) => {
    return {
      name: item.dimName
    }
  })
}

export default {
  // 设置legend 位置
  setLegendScatter (state, obj) {
    let distanceT
    let distanceR
    let legend
    let grid
    let dimList = state.chartsOption[obj.index].feature.dimList
    let isTitle = state.chartsOption[obj.index].feature.styleConfig.config.xAxis[0].hasOwnProperty('name')
    let data = getLegendData(dimList)

    // 配置legend
    switch (obj.type) {
      case 'top':
        top.legend.data = data
        state.chartsOption[obj.index].feature.styleConfig.config.legend = top.legend
        if (isTitle) {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = top.gridTitle
        } else {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = top.grid 
        }
        break;
      case 'bottom':
        bottom.legend.data = data
        state.chartsOption[obj.index].feature.styleConfig.config.legend = bottom.legend
        if (isTitle) {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = bottom.gridTitle       
        } else {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = bottom.grid
        }
        break;
      case 'left':
        left.legend.data = data
        state.chartsOption[obj.index].feature.styleConfig.config.legend = left.legend
        if (isTitle) {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = left.gridTitle
        } else {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = left.grid
        }

        break;
      case 'right':
        right.legend.data = data
        state.chartsOption[obj.index].feature.styleConfig.config.legend = right.legend
        if (isTitle) {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = right.gridTitle
        } else {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = right.grid
        }
        break;
      default:
        top.legend.data = data
        state.chartsOption[obj.index].feature.styleConfig.config.legend = top.legend
        if (isTitle) {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = top.gridTitle
        } else {
          state.chartsOption[obj.index].feature.styleConfig.config.grid = top.grid
        }
        break;
    }

    // 配置同步到vuex后，用bus来联动图表
    if (obj.statue) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      operate.forEach((item, index) => {
        if (item.name === obj.record.name) {
          item.optionVal = obj.record.optionVal
          find = true
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
      }
      bus.$emit(`updateScatter_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 对XY轴标题的显示操作
  showTitleScatter (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let metricList = state.chartsOption[obj.index].feature.metricList
    let dimList = state.chartsOption[obj.index].feature.dimList
    // 当前图例位置
    let position = state.chartsOption[obj.index].feature.styleConfig.config.legend.positionName
    let legend =  state.chartsOption[obj.index].feature.styleConfig.config.legend.show
    let Xlength = config.xAxis.length
    let Ylength = config.yAxis.length

    if (obj.type) {
      if (metricList.length === 2) {
        config.xAxis[0].name = metricList[0].metricName.length > 6?metricList[0].metricName.substr(0,6) + '...': metricList[0].metricName
        config.yAxis[0].name = metricList[1].metricName.length > 6?metricList[1].metricName.substr(0,6) + '...': metricList[1].metricName
      }
    } else {
      for(let i = 0; i < Xlength; i++) {
        if (config.xAxis[i].hasOwnProperty('name')) {
          delete config.xAxis[i].name
        }
      }
      for(let i = 0; i < Ylength; i++) {
        if (config.yAxis[i].hasOwnProperty('name')) {
          delete config.yAxis[i].name
        }
      }
    }
    // 同步图例位置
    if (legend)  {
      this.commit('setLegendScatter', {
        index: obj.index,
        type: position,
        statue: false,
      })
    } else {
      state.chartsOption[obj.index].feature.styleConfig.config.grid = obj.type? gridDefaultTitle : gridDefault
    }

    if (obj.statue) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      operate.forEach((item, index) => {
        if (item.name === obj.record.name) {
          item.optionVal = obj.record.optionVal
          find = true
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
      }
      bus.$emit(`updateScatter_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 是否启用缩放功能
  showZoomScatter (state, obj) {
    const dataZoom = [
        {
          type: 'inside',
          xAxisIndex: [0],
        },
        {
          type: 'inside',
          yAxisIndex: [0],
        }
    ]

    if (obj.type) {
      state.chartsOption[obj.index].feature.styleConfig.config.dataZoom = dataZoom
    } else {
      state.chartsOption[obj.index].feature.styleConfig.config.dataZoom = []
    }

    if (obj.statue) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      operate.forEach((item, index) => {
        if (item.name === obj.record.name) {
          item.optionVal = obj.record.optionVal
          find = true
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
      }
      bus.$emit(`updateScatter_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },

  // 是否显示tooltip
  showTootipScatter (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.tooltip.show = obj.type

    if (obj.statue) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      operate.forEach((item, index) => {
        if (item.name === obj.record.name) {
          item.optionVal = obj.record.optionVal
          find = true
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
      }
      bus.$emit(`updateScatter_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 图例组件
  showLegendScatter (state, obj) {
    let isTitle = false
    let position = state.chartsOption[obj.index].feature.styleConfig.config.legend.positionName
    if (state.chartsOption[obj.index].feature.styleConfig.config.xAxis[0].hasOwnProperty('name')) {
      isTitle = true
    }
    // 切换图例显示状态
    state.chartsOption[obj.index].feature.styleConfig.config.legend.show = obj.type
    // 调整echart位置
    if (obj.type) {
      // 同步组件位置
      this.commit('setLegendScatter', {
        index: obj.index,
        type: position,
        statue: false,
      })
    } else {
      state.chartsOption[obj.index].feature.styleConfig.config.grid = isTitle?gridDefaultTitle : gridDefault
    }

    if (obj.statue) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      operate.forEach((item, index) => {
        if (item.name === obj.record.name) {
          item.optionVal = obj.record.optionVal
          find = true
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
      }
      bus.$emit(`updateScatter_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  }
}
