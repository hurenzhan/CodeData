import { CITY_MAP } from '../../constants/cityMap'
import bus from '../../utils/eventBus'
export default {
  mapOption (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    config[obj.name][obj.property] = obj.value
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  // 初始化图例位置
  editlegendStore (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    config[obj.name] = obj.value
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  // 显示地理信息
  mapGeography (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    if (obj.dimLength === 1) {
      if (obj.dimType === '1') {
        config.geo.label.normal.show = obj.value
      }
      if (obj.dimType === '2') {
        config.label.normal.show = obj.value
      }
    }
    if (obj.dimLength === 2) {
      config.geo.label.normal.show = obj.value
      config.label.normal.show = obj.value
    }
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  // 显示标点
  mapShowPoint (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    if (obj.type === true) {
      config.series[1].itemStyle[obj.name][obj.property] = 0.5
    }
    if (obj.type === false) {
      config.series[1].itemStyle[obj.name][obj.property] = 0
      config.colorPick = false
      config.metricCodeSelect = false
      config.series[0].data = []
      config.series[1].symbolSize = 5
      config.adaptiveRadius = false
      config.colorItems = [
        { add: '+', warn: '', start: '', end: '', color: '#FED63B' }
      ]
    }
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  // 切换图例位置
  mapLegend (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const legend = config.legend
    const visualMap = config.visualMap
    const vertical = 'vertical'
    const horizontal = 'horizontal'
    if (obj.type === 'left') {
      delete legend.right
      delete legend.bottom
      delete visualMap.left
      legend.left = 16
      legend.orient = vertical
      legend.top = 70
      visualMap.right = 16
    } else if (obj.type === 'top') {
      delete legend.right
      delete legend.bottom
      delete visualMap.right
      legend.left = 'center'
      legend.orient = horizontal
      legend.top = 24
      visualMap.left = 16
    } else if (obj.type === 'right') {
      delete legend.left
      delete legend.bottom
      delete visualMap.right
      legend.right = 16
      legend.orient = vertical
      legend.top = 70
      visualMap.left = 16
    } else {
      delete legend.right
      delete legend.top
      delete visualMap.right
      legend.bottom = 24
      legend.orient = horizontal
      legend.left = 'center'
      visualMap.left = 16
    }
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  // 自适应半径
  mapRadius (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const series = config.series[1]
    const arr = []
    series.data.map(item => {
      arr.push(Math.round(item.value[2]))
    })
    const max = Math.max.apply(null, arr)
    const a = max * 1 / 5
    const b = max * 2 / 5
    const c = max * 3 / 5
    const d = max * 4 / 5
    if (obj.type === true) {
      series.symbolSize = params => {
        const sum = params[2]
        if (sum <= a) {
          return 4
        }
        if (sum > a && sum <= b) {
          return 8
        }
        if (sum > b && sum <= c) {
          return 12
        }
        if (sum > d && sum <= max) {
          return 16
        }
      }
    }
    if (obj.type === false) {
      series.symbolSize = 5
    }
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  // 自定义气泡切换隐藏调色盘组件
  mapdrillChange (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    if (obj.type === true) {
      config.colorPick = true
      config.metricCodeSelect = true
    }
    if (obj.type === false) {
      config.colorPick = false
      config.metricCodeSelect = false
      config.series[0].data = []
      config.series[1].symbolSize = 5
      config.adaptiveRadius = false
      config.colorItems = [
        { add: '+', warn: '', start: '', end: '', color: '#FED63B' }
      ]
      bus.$emit('updateMapOption', {
        index: obj.index,
        config: config
      })
    }
  },
  // 地图下砖
  mapUnder (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    if (obj.value === true) {
      config[obj.name][obj.property] = 2
    }
    if (obj.value === false) {
      config[obj.name][obj.property] = 3
    }
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  // 增加删除区间
  AddDelColor (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const colorItems = config.colorItems
    const series = config.series[0]
    if (obj.colorIndex === 0) {
      config.colorItems.push({
        add: '-',
        start: '',
        end: '',
        color: '#FED63B'
      })
    } else {
      const e = colorItems[obj.colorIndex]
      series.data.forEach((i, index) => {
        const sum = i.value[2]
        if (Number(sum) >= Number(e.start) && Number(sum) <= Number(e.end)) {
          i.value = []
        }
      })
      config.colorItems.splice(obj.colorIndex, 1)
      bus.$emit('updateMapOption', {
        index: obj.index,
        config: config
      })
    }
  },
  // 调色盘选择区间改变颜色
  colorPick (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const colorItems = config.colorItems
    const arr = []
    const data = []
    for (let i = 0; i < config.series[1].data.length; i++) {
      const e = config.series[1].data[i]
      const arr = {
        name: e.name,
        value: e.value,
        dimValue: e.dimValue,
        dimCode: e.dimCode,
        tooltip: {
          formatter: ''
        }
      }
      data.push(arr)
    }
    data.map(i => {
      const sum = i.value[2]
      colorItems.forEach(e => {
        if (Number(sum) >= Number(e.start) &&
          Number(sum) <= Number(e.end) &&
          e.start !== '' &&
          e.end !== '') {
          i.symbol = `image:///static/charts/images/${e.color.replace(/#/, '')}.svg`
          i.tooltip.formatter = params => {
            const _tooltip = `<div class="tooltip_div"><span>${e.warn}</span></div>`
            return _tooltip
          }
          arr.push(i)
        }
      })
    })
    config.series[0].data = arr
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  mapMetricChange (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const colorItems = config.colorItems
    obj.metricList.forEach(item => {
      if (item.metricCode === obj.value) {
        config.metricValue = item.metricName
      }
    })
    const arr = []
    const res = []
    let data = []
    if (obj.dimLength === 1) {
      data = config.mapData
    }
    if (obj.dimLength === 2) {
      if (obj.dimType === '1') {
        data = config.mapData[1]
      } else {
        data = config.mapData[0]
      }
    }
    data.map(item => {
      if (item[0][5] === obj.value) {
        item.map(item => {
          if (item[1].indexOf('###') >= 0) {
          const name = item[1].split('###')[1].replace(/市/, '')
            const geoCoord = CITY_MAP.geoCoordMap[name]
            if (geoCoord) {
              res.push({
                name: name,
                value: geoCoord.concat(item[0]),
                dimValue: item[1],
                dimCode: item[6],
                itemStyle: { color: '#D673B9' },
                label: {
                  normal: {
                    formatter: '{b}'
                  }
                }
              })
            }
          }
        })
      }
    })
    const scatterData = []
    for (let i = 0; i < res.length; i++) {
      const e = res[i]
      const arr = {
        name: e.name,
        value: e.value,
        dimValue: e.dimValue,
        dimCode: e.dimCode,
        tooltip: {
          formatter: ''
        }
      }
      scatterData.push(arr)
    }
    scatterData.map(i => {
      const sum = i.value[2]
      colorItems.forEach(e => {
        if (Number(sum) >= Number(e.start) &&
          Number(sum) <= Number(e.end) &&
          e.start !== '' &&
          e.end !== '') {
          i.symbol = `image:///static/charts/images/${e.color.replace(/#/, '')}.svg`
          i.tooltip.formatter = params => {
            const _tooltip = `<div class="tooltip_div"><span>${
              e.warn
              }</span></div>`
            return _tooltip
          }
          arr.push(i)
        }
      })
    })
    config.series[0].data = arr
    config.series[1].data = res
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  },
  saveResData (state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    config.resData = obj.res
    bus.$emit('updateMapOption', {
      index: obj.index,
      config: config
    })
  }
}
