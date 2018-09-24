import bus from '../../utils/eventBus'

// 配置legend data[]
const getLegendData = (dimList) => {
  return dimList.map((item, index) => {
    return {
      name: item.dimName
    }
  })
}

// 单色模式下 根据刻度和指针目标值重新计算颜色分割区域
const getSingleArea = (min ,max, value, color) => {
  // let colorArea = (value / (max- min)).toFixed(2)
  let colorArea = (value - min) / (max - min)
  if (colorArea === 1) {
    return [[1, color]]
  } else {
    return [[colorArea, color], [1, '#eeeeee']]
  }
}

export default {
  // 设置自定义最小刻度
  setMinValue (state, {index, value, hasEdit}) {
    let initData = state.chartsOption[index].feature.styleConfig.config.initData
    initData.min = value
    if (hasEdit) {
      initData.hasEdit = hasEdit
    }
  },
  // 设置自定义最大刻度
  setMaxValue (state, {index, value, hasEdit}) {
    let initData = state.chartsOption[index].feature.styleConfig.config.initData
    initData.max = value
    if (hasEdit) {
      initData.hasEdit = hasEdit
    }
  },
  // 设置百分比时的目标值
  setTargetValue (state, {index, value, hasEdit}) {
    let initData = state.chartsOption[index].feature.styleConfig.config.initData
    initData.targetValue = value
    if (hasEdit) {
      initData.hasEdit = hasEdit
    }
  },
  // 设置legend
  showLengedGauge (state, obj) {

    let series = state.chartsOption[obj.index].feature.styleConfig.config.series
    series[0].title.show = obj.type
    // 根据title是否显示 改变detail距离圆心的位置
    if (obj.type) {
      series[0].detail.offsetCenter =  [0, '95%']
    } else {
      series[0].detail.offsetCenter =  [0, '80%']
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
      bus.$emit(`updateGauge_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 是否显示tooltip
  showTooltipGauge (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config

    config.tooltip.show = obj.type

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
      bus.$emit(`updateGauge_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },

  // 设置标签刻度
  setTickGauge (state, obj) {
    let initData = state.chartsOption[obj.index].feature.styleConfig.config.initData
    let series = state.chartsOption[obj.index].feature.styleConfig.config.series
    let tickType = initData.tickType
    let metricValue = series[0].data[0].value
    let unit = initData.unit
    let min = parseFloat(initData.min)
    let max = parseFloat(initData.max)
    // 版本兼容
    let targetValue = initData.targetValue === undefined ? max : initData.targetValue
    // 同步刻度
    if (tickType) {
      for(let i = 0; i < series.length; i++) {
        series[i].min = min
        series[i].max = max
        // 设置标签显示为百分比 value 为刻度值
        series[i].axisLabel.formatter =  (value) => {
          let top = value - min
          let bottom = targetValue - min
          return ((top/bottom) * 100).toFixed(2) + '%'
        }
        // 设置详情显示为百分比 value为指标值
        series[i].detail.formatter =  (value) => {
          let top = value - min
          let bottom = targetValue - min
          return `完成率 ${((top/bottom) * 100).toFixed(2)}%`
        }
      }
    } else{
      for(let i = 0; i < series.length; i++) {
        series[i].min = min
        series[i].max = max
        // series[i].axisLabel.formatter =  '{value} ' + unit
        series[i].axisLabel.formatter = (value) => {
          if (parseInt(value) >= 1000000) {
            return (value / 1000000).toFixed(2) + 'M' + unit
          } else if (parseInt(value) >= 1000) {
            return (value / 1000).toFixed(2) + 'K' + unit
          } else {
            return `${value} ${unit}`
          }
        }
        // 设置显示为百分比
        series[i].detail.formatter =  (value) => {
          let top = value - min
          let bottom = targetValue - min
          return `完成率 ${((top/bottom) * 100).toFixed(2)}%`
        }
      }
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
      bus.$emit(`updateGauge_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 设置标签单位
  setUnitGauge (state, obj) {
    let series = state.chartsOption[obj.index].feature.styleConfig.config.series

    if (series.length > 0) {
      for(let i= 0; i < series.length; i++) {
        series[i].axisLabel.formatter =  '{value} ' + obj.type
        // series[i].detail.formatter =  '{value} ' + obj.type
      }
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
      bus.$emit(`updateGauge_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 改变仪表盘颜色
  setColorGauge (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let lineStyle = config.series[0].axisLine.lineStyle

    if (parseInt(obj.model) === 0) {
      // 初始化时 有保存的刻度数据时优先使用
      let min = config.initData.min
      let max = config.initData.max
      let value = config.series[0].data[0].value
      let singelColor = config.initData.singelColor
      lineStyle.color = getSingleArea(min, max, value, singelColor)
      config.series[0].splitLine.show = true
      // 分割线长度
      config.series[0].splitLine.length = 20
      // 分割线宽度
      config.series[0].splitLine.lineStyle.width = 2
      // 分割段数
      config.series[0].splitNumber = 5
    } else {
      lineStyle.color = obj.color
      config.series[0].splitLine.show = true
      // 分割段数 五等分时刻度划分为5，自定义模式下划分为10
      config.series[0].splitNumber = parseInt(obj.type) === 1? 10 : 5
      // 分割线长度
      config.series[0].splitLine.length = 20
      // 分割线宽度
      config.series[0].splitLine.lineStyle.width = 2
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
      bus.$emit(`updateGauge_${obj.index}`, {
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
  },
  // 切换标签显示类型
  setTickType (state, obj) {
    this.commit('setTickGauge', {
      index: obj.index,
      statue: false
    })
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

      bus.$emit(`updateGauge_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  }
}
