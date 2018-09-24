import bus from '../../utils/eventBus'
import configClass from '../../static/configClass'

// 深度拷贝
const deep_clone = (source) => {
  var newObject = {}
  for(var key in source) {
    if (typeof(source[key]) === 'object') {
      if (Array.isArray(source[key])) {
        let Arr = []
        for(let i = 0; i < source[key].length; i++) {
          Arr.push(source[key][i])
        }
        newObject[key] = Arr
      } else {
        newObject[key] = deep_clone(source[key])
      }
    } else if (typeof(source[key]) === 'function') {
      try {
        let anonymous
        eval('anonymous = ' + source[key].toString())
        newObject[key] = anonymous
      } catch (error) {
        console.log(error)
        return null
      }
    } else if (typeof(source[key]) === 'undefined') {
      newObject[key] = null
    } else {
      newObject[key] = source[key]
    }
  }
  return newObject
}

// 计算长度
const calcStringPixelsCount2 = (strLength, strFontSize) => {
  return strLength * strFontSize
}

// 李勇dom 计算文本的宽度 str 为传入的字符串 strFontSize为字符串的font-size
// 返回值为字符串的width
const calcStringPixelsCount = (str, strFontSize) => {
  if (str === '' || str === undefined) {
    return 0
  }
  // 字符串字符个数
  var stringCharsCount = str.length;

  // 字符串像素个数
  var stringPixelsCount = 0;

  // JS 创建HTML元素：span
  var elementPixelsLengthRuler = document.createElement("span");
  elementPixelsLengthRuler.style.fontSize = strFontSize;  // 设置span的fontsize
  // elementPixelsLengthRuler.style.visibility = "hidden";  // 设置span不可见
  elementPixelsLengthRuler.style.display = "inline-block";
  elementPixelsLengthRuler.style.wordBreak = "break-all !important";  // 打断单词

  // 添加span
  document.body.appendChild(elementPixelsLengthRuler);

  for (var i =0; i < stringCharsCount; i++) {
    // 判断字符是否为空格，如果是用&nbsp;替代，原因如下：
    // 1）span计算单个空格字符()，其像素长度为0
    // 2）空格字符在字符串的开头或者结果，计算时会忽略字符串
    if (str[i] == " ") {
      elementPixelsLengthRuler.innerHTML = "&nbsp;";
    } else {
      elementPixelsLengthRuler.innerHTML = str[i];
    }

    stringPixelsCount += elementPixelsLengthRuler.offsetWidth;
  }
  // 移除dom
  document.body.removeChild(elementPixelsLengthRuler);
  // console.log(stringPixelsCount)
  return stringPixelsCount;
}

const getLegendData = (metricList) => {
  return metricList.map((item, index) => {
    return {
      name: item.metricName,
      icon: 'bar'
    }
  })
}
const marginR = 70
const marginT = 30
var left = {
  legend: {
    positionName: 'left',
    show: true,
    type: 'scroll',
    orient: 'vertical',
    left: 0,
    y: 'center',
    padding: [16, 16],
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    width: 200,
    formatter: function(name){
      return name.length > 11?name.substr(0,10) + "..." : name
    },
   tooltip: {
        show: true,
        textStyle: {
         color: '#fff'
        },
        formatter: function (params) {
          const str =
            '<div style="border-radius:2px;padding:0 5px;font-size:12px;">' +
            params.name +
            '</div'
          return str
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        extraCssText:
          'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
      }
  },
  grid: {
    left: 170,
    right: 16,
    top: 16,
    bottom: 16,
    containLabel: true
  },
  gridTitle: {
    left: 170,
    right: 16 + marginR,
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
    right: 0,
    padding: [5, 16],
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    width: 170,
    formatter: function(name){
      return name.length > 11?name.substr(0,10) + "..." : name
    },
    tooltip: {
      show: true,
      textStyle: {
       color: '#fff'
      },
      formatter: function (params) {
        const str =
          '<div style="border-radius:2px;padding:0 5px;font-size:12px;">' +
          params.name +
          '</div'
        return str
      },
      backgroundColor: 'rgba(0,0,0,0.7)',
      extraCssText:
        'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 16,
    right: 170,
    top: 16,
    bottom: 16,
    containLabel: true
  },
  gridTitle: {
    left: 16,
    right: 170,
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
    padding: [16, 50],
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    height: 50,
    x: 'center',
    tooltip: {
      show: true,
      textStyle: {
       color: '#fff'
      },
      formatter: function (params) {
        const str =
          '<div style="border-radius:2px;padding:0 5px;font-size:12px;">' +
          params.name +
          '</div'
        return str
      },
      backgroundColor: 'rgba(0,0,0,0.7)',
      extraCssText:
        'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
  }
  },
  grid: {
    left: 16,
    right: 16,
    top: 50,
    bottom: 16,
    containLabel: true
  },
  gridTitle: {
    left: 16,
    right: 16 + marginR,
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
    padding: [16, 50],
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    height: 50,
    x: 'center',
     tooltip: {
          show: true,
          textStyle: {
           color: '#fff'
          },
          formatter: function (params) {
            const str =
              '<div style="border-radius:2px;padding:0 5px;font-size:12px;">' +
              params.name +
              '</div'
            return str
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          extraCssText:
            'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 16,
    right: 16,
    top: 16,
    bottom: 50,
    containLabel: true
  },
  gridTitle: {
    left: 16,
    right: 16 + marginR,
    top: 16 + marginT,
    bottom: 50,
    containLabel: true
  }
}

export default {
  setBarChart (state, obj) {
    let dimList = state.chartsOption[obj.index].feature.dimList
    let metricList = state.chartsOption[obj.index].feature.metricListFlat ? state.chartsOption[obj.index].feature.metricListFlat : state.chartsOption[obj.index].feature.metricList
    const metricListLength = metricList.length
    let data = getLegendData(metricList)
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const crosswise = config.crosswise
    const legendShow = config.legend.show
    const legendPosition = config.legendPosition
    const isMeasureLineShow =  config.isMeasureLineShow
    const measureLineType =  config.measureLineType
    const dimValue = config.dimValue
    const yShow = config.yAxis[0].show
    const xShow = config.xAxis[0].show
    let isTitle = config.axisTitle
    let XTitleString = config.xAxis[0].name || ''

    let maxSeriesValue = 0, tempSeriesValue, maxRightPadding
    config.series.forEach(item => {
      let seriesItemDataArray = item.data.map(seriesItemDataItem => {
        seriesItemDataItem = seriesItemDataItem || ''
        return (seriesItemDataItem).toString().length
      })
      tempSeriesValue = Math.max(...seriesItemDataArray)
      maxSeriesValue = tempSeriesValue > maxSeriesValue ? tempSeriesValue : maxSeriesValue
    })
    maxRightPadding = Math.max(maxSeriesValue * 6, 60)

    let maxYAxisValue = 0, tempYAxisValue
    if (!yShow && crosswise) {
      config.yAxis.forEach(item => {
        let yAxisItemDataArray = item.data.map(yAxisItemDataItem => {
          yAxisItemDataItem = yAxisItemDataItem || ''
          let yAxisItemDataItemString = (yAxisItemDataItem).toString()
          if (yAxisItemDataItemString.indexOf('_') > -1) {
            return yAxisItemDataItemString.split('_')[1].length
          } else {
            return yAxisItemDataItemString.length
          }
        })
        tempYAxisValue = Math.max(...yAxisItemDataArray)
        maxYAxisValue = tempYAxisValue > maxYAxisValue ? tempYAxisValue : maxYAxisValue
      })
    }

    let tempStringLength = 0, maxRightPadding2
    if (dimValue !== '') {
      tempStringLength = dimValue.toString().length
    }
    maxRightPadding2 = Math.max(tempStringLength * 6, 60)

    if (legendShow) {
      // 配置legend
      switch (legendPosition) {
        case 'top':
          top.legend.data = data
          config.legend = top.legend

          config.grid = JSON.parse(JSON.stringify(top.grid))
          if (isTitle) config.grid = JSON.parse(JSON.stringify(top.gridTitle))

          if (crosswise) {
            config.grid.right = 16 + marginR/2
          }

          if (xShow && isTitle && crosswise) {
            config.grid.right = 16 + marginR/2 + marginR
          }

          if (!xShow) {
            config.grid.bottom = parseInt(config.grid.bottom) - calcStringPixelsCount2(2, 12)
            config.grid.right = 16
          }

          if (!yShow && !crosswise) {
            config.grid.top = 50
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxSeriesValue, 6)
          }

          if (!yShow && crosswise) {
            config.grid.top = 50
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxYAxisValue, 12)
          }

          if (isMeasureLineShow && measureLineType !== '0' && !crosswise) {
            config.grid.right = 16 + maxRightPadding
          }

          if (isMeasureLineShow && measureLineType === '0' && !crosswise) {
            config.grid.right = 16 + maxRightPadding2
          }
          break;
        case 'bottom':
          bottom.legend.data = data
          config.legend = bottom.legend
          config.grid = JSON.parse(JSON.stringify(bottom.grid))
          if (isTitle) config.grid = JSON.parse(JSON.stringify(bottom.gridTitle))

          if (crosswise) {
            config.grid.right = 16 + marginR/2
          }

          if (xShow && isTitle && crosswise) {
            config.grid.right = 16 + marginR/2 + marginR
          }

          if (!xShow) {
            config.grid.right = 16
            config.grid.bottom = parseInt(config.grid.bottom) - calcStringPixelsCount2(2, 12)
          }

          if (!yShow && !crosswise) {
            config.grid.top = 16
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxSeriesValue, 6)
          }

          if (!yShow && crosswise) {
            config.grid.top = 16
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxYAxisValue, 12)
          }

          if (isMeasureLineShow && measureLineType !== '0' && !crosswise) {
            config.grid.right = 16 + maxRightPadding
          }

          if (isMeasureLineShow && measureLineType === '0' && !crosswise) {
            config.grid.right = 16 + maxRightPadding2
          }

          break;
        case 'left':
          left.legend.data = data
          config.legend = left.legend
          config.grid = JSON.parse(JSON.stringify(left.grid))
          if (isTitle) config.grid = JSON.parse(JSON.stringify(left.gridTitle))

          if (crosswise) {
            config.grid.right = 16 + marginR/2
          }

          if (xShow && isTitle && crosswise) {
            config.grid.right = 16 + marginR/2 + marginR
          }

          if (!xShow) {
            config.grid.right = 16
            config.grid.bottom = parseInt(config.grid.bottom) - calcStringPixelsCount2(2, 12)
          }

          if (!yShow && !crosswise) {
            config.grid.top = 16
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxSeriesValue, 6)
          }

          if (!yShow && crosswise) {
            config.grid.top = 16
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxYAxisValue, 12)
          }

          if (isMeasureLineShow && measureLineType !== '0' && !crosswise) {
            config.grid.right = 16 + maxRightPadding
          }

          if (isMeasureLineShow && measureLineType === '0' && !crosswise) {
            config.grid.right = 16 + maxRightPadding2
          }

          break;
        case 'right':
          right.legend.data = data
          config.legend = right.legend
          config.grid = JSON.parse(JSON.stringify(right.grid))
          if (isTitle) config.grid = JSON.parse(JSON.stringify(right.gridTitle))

          if (!xShow) {
            config.grid.right = 170
            config.grid.bottom = parseInt(config.grid.bottom) - calcStringPixelsCount2(2, 12)
          }

          if (!yShow && !crosswise) {
            config.grid.top = 16
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxSeriesValue, 6)
          }

          if (!yShow && crosswise) {
            config.grid.top = 16
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxYAxisValue, 12)
          }

          if (isMeasureLineShow && measureLineType !== '0' && !crosswise) {
            config.grid.right = parseInt(config.grid.right) + maxRightPadding
          }

          if (isMeasureLineShow && measureLineType === '0' && !crosswise) {
            config.grid.right = parseInt(config.grid.right) + maxRightPadding2
          }

          break;
        default:
          top.legend.data = data
          config.legend = top.legend
          config.grid = JSON.parse(JSON.stringify(top.grid))
          if (isTitle) config.grid = JSON.parse(JSON.stringify(top.gridTitle))

          if (crosswise) {
            config.grid.right = 16 + marginR/2
          }

          if (xShow && isTitle && crosswise) {
            config.grid.right = 16 + marginR/2 + marginR
          }

          if (!xShow) {
            config.grid.right = 16
            config.grid.bottom = parseInt(config.grid.bottom) - calcStringPixelsCount2(2, 12)
          }

          if (!yShow && !crosswise) {
            config.grid.top = 16
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxSeriesValue, 6)
          }

          if (!yShow && crosswise) {
            config.grid.top = 16
            config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxYAxisValue, 12)
          }

          if (isMeasureLineShow && measureLineType !== '0' && !crosswise) {
            config.grid.right = 16 + maxRightPadding
          }

          if (isMeasureLineShow && measureLineType === '0' && !crosswise) {
            config.grid.right = 16 + maxRightPadding2
          }

          break;
      }
    } else {
      config.grid = {
        left: 16,
        right: 16,
        top: 16,
        bottom: 16,
        containLabel: true
      }

      if (isTitle) {
        config.grid = {
          left: 16,
          right: 16 + marginR,
          top: 16 + marginT,
          bottom: 16,
          containLabel: true
        }
      }

      if (crosswise) {
        config.grid.right = 16 + marginR/2
      }

      if (xShow && isTitle && crosswise) {
        config.grid.right = 16 + marginR/2 + marginR
      }

      if (!xShow) {
        config.grid.right = 16
        config.grid.bottom = parseInt(config.grid.bottom) - calcStringPixelsCount2(2, 12)
      }

      if (!yShow && !crosswise) {
        config.grid.top = 16
        config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxSeriesValue, 6)
      }

      if (!yShow && crosswise) {
        config.grid.top = 16
        config.grid.left = parseInt(config.grid.left) - calcStringPixelsCount2(maxYAxisValue, 12)
      }

      if (isMeasureLineShow && measureLineType !== '0' && !crosswise) {
        config.grid.right = 16 + maxRightPadding
      }

      if (isMeasureLineShow && measureLineType === '0' && !crosswise) {
        config.grid.right = 16 + maxRightPadding2
      }

    }

  },
  editMidOptionBar(state, obj) {
    if (obj.toDelete && obj.toDelete.length > 0) {
        obj.toDelete.map((item, index) => {
          delete state.chartsOption[obj.index].feature.styleConfig.config[obj.name][item]
        })
    }
    if (obj.toEdit) {
      if (Array.isArray(obj.toEdit)) {
        obj.toEdit.map((item, index) => {
         state.chartsOption[obj.index].feature.styleConfig.config[obj.name][item] = obj.value[index]
        })
      } else {
        state.chartsOption[obj.index].feature.styleConfig.config[obj.name][obj.toEdit] = obj.value
      }
    } else {
       state.chartsOption[obj.index].feature.styleConfig.config[obj.name] = obj.value
    }
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  editMidBarSeries(state, obj) {
    if (obj.toDelete && obj.toDelete.length > 0) {
         state.chartsOption[obj.index].feature.styleConfig.config.series.map((seriesItem, seriesIndex)=> {
           obj.toDelete.map( (item, index) => {
             delete seriesItem[item]
           })
         })
    }
    if (obj.toEdit) {
      if (Array.isArray(obj.toEdit)) {
         state.chartsOption[obj.index].feature.styleConfig.config.series.map((seriesItem, seriesIndex)=> {
           obj.toEdit.map( (item, index) => {
             seriesItem[obj.name][item] = obj.value[index]
           })
         })
      } else {
         state.chartsOption[obj.index].feature.styleConfig.config.series.map((seriesItem, seriesIndex)=> {
           seriesItem[obj.name][obj.toEdit] = obj.value
         })
      }
    } else {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
          item[obj.name] = obj.value
        })
    }
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  editMidOptionBarXAxis(state, obj) {
    if (obj.toDelete && obj.toDelete.length > 0) {
        obj.toDelete.map((item, index) => {
          delete state.chartsOption[obj.index].feature.styleConfig.config[obj.name][item]
        })
    }
    if (obj.toEdit) {
      if (Array.isArray(obj.toEdit)) {
         state.chartsOption[obj.index].feature.styleConfig.config.xAxis.map((seriesItem, seriesIndex)=> {
           obj.toEdit.map( (item, index) => {
             seriesItem[obj.name][item] = obj.value[index]
           })
         })
      } else {
         state.chartsOption[obj.index].feature.styleConfig.config.xAxis.map((seriesItem, seriesIndex)=> {
           seriesItem[obj.name][obj.toEdit] = obj.value
         })
      }
    } else {
        state.chartsOption[obj.index].feature.styleConfig.config.xAxis.map((item, index) => {
          item[obj.name] = obj.value
        })
    }
    this.commit('setBarChart', {index: obj.index})
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  editMidOptionBarYAxis(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const doubleY = config.doubleY
    if (obj.toDelete && obj.toDelete.length > 0) {
        obj.toDelete.map((item, index) => {
          delete state.chartsOption[obj.index].feature.styleConfig.config[obj.name][item]
        })
    }
    if (obj.toEdit) {
      if (Array.isArray(obj.toEdit)) {
         state.chartsOption[obj.index].feature.styleConfig.config.yAxis.map((seriesItem, seriesIndex)=> {
           obj.toEdit.map( (item, index) => {
             seriesItem[obj.name][item] = obj.value[index]
           })
         })
      } else {
         state.chartsOption[obj.index].feature.styleConfig.config.yAxis.map((seriesItem, seriesIndex)=> {
           seriesItem[obj.name][obj.toEdit] = obj.value
         })
      }
    } else {
        if (doubleY) {
          state.chartsOption[obj.index].feature.styleConfig.config.yAxis.map((item, index) => {
           item[obj.name] = obj.value
         })
        } else {
          state.chartsOption[obj.index].feature.styleConfig.config.yAxis.map((item, index) => {
            if (index === 0) {
              item[obj.name] = obj.value
            }
         })
        }
    }
    this.commit('setBarChart', {index: obj.index})
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
 },
 deleteBarSeries(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.series.map((seriesItem, seriesIndex)=> {
       delete seriesItem[obj.name]
    })
  // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeXYBar(state, obj) {
    // 获取数据关系中排序方式
    const sortByWhich = state.chartsOption[obj.index].sortByWhich
    const sortType = state.chartsOption[obj.index].sortType
    let xAxisS = state.chartsOption[obj.index].feature.styleConfig.config.xAxis
    const backXAxis = JSON.parse(JSON.stringify(xAxisS))
    let yAxisS = state.chartsOption[obj.index].feature.styleConfig.config.yAxis
    const backYAxis = JSON.parse(JSON.stringify(yAxisS))
    // 获取eCharts中系列列表
    let seriesBackup = state.chartsOption[obj.index].feature.styleConfig.config.series
    state.chartsOption[obj.index].feature.styleConfig.config.xAxis = backYAxis
    state.chartsOption[obj.index].feature.styleConfig.config.yAxis = backXAxis
    const legendPosition = state.chartsOption[obj.index].feature.styleConfig.config.legendPosition
    const axisTitle = state.chartsOption[obj.index].feature.styleConfig.config.axisTitle
    const isMeasureLineShow = state.chartsOption[obj.index].feature.styleConfig.config.isMeasureLineShow
    const dimValue = state.chartsOption[obj.index].feature.styleConfig.config.dimValue
    const doubleY = state.chartsOption[obj.index].feature.styleConfig.config.doubleY
    const showNumber = state.chartsOption[obj.index].feature.styleConfig.config.showNumber
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const totalLength = config.data.totalLength
    const stack = config.stack
    const seriesLength = config.series[0].data.length

    // 数据关系中按指标降序排列时，切换横/纵向，反转系列列表中数组
    if (sortByWhich === 1 && sortType === 1) {
      seriesBackup.forEach(item => item.data.reverse())
      // 图表样式@condition(obj.type === true)横向展示，反转x轴数组以实现降序
      // 否则反转y轴数组以恢复降序
      obj.type ? backXAxis.forEach(item => item.data.reverse()) : backYAxis.forEach(item => item.data.reverse())
    }
    if (obj.type) {
      // state.chartsOption[obj.index].feature.styleConfig.config.xAxis[0].name = backXAxis[0].name
      // state.chartsOption[obj.index].feature.styleConfig.config.yAxis[0].name = backYAxis[0].name
      // 处理横坐标 axisLabel 把 LY01_南京雨花物流中心 前面的 编码去掉
       backXAxis.map((item, index) => {
        item.axisLabel =  {
              show: true,
              textStyle: {
                color: '#151515',
                fontFamily: 'PingFangSC-Regular'
              },
              fontFamily: 'HelveticaNeue',
              fontSize: 12,
              color: '#333333',
              lineHeight: 20,
              // 自定义标签显示格式
              formatter: params => {
                if (params.indexOf('###') !== -1) {
                  let dimName = params.split('###')[1]
                  return dimName.length > 15
                    ? dimName.substr(0, 15) + '...'
                    : dimName
                } else {
                  return params.length > 15
                    ? params.substr(0, 15) + '...'
                    : params
                }
              }
              // 不显示最小刻度标签
              // showMinLabel: false,
              // showMaxLabel: false
            }
     })

      state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        item.barMaxWidth = '10'
      })
      // if (stack) {
      //   if (seriesLength < 6) {
      //       state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      //         item.barWidth = '24'
      //       })
      //   } else {
      //     state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      //        delete item.barWidth
      //     })
      //   }
      // } else {
      //   if (totalLength < 10) {
      //       state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      //         item.barWidth = '24'
      //       })
      //   } else {
      //     state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      //        delete item.barWidth
      //     })
      //   }
      // }
      if (showNumber) {
        config.series.map((item, index) => {
          item.label = {
            show: true,
            color: '#333',
            position: 'right',
            formatter: function(name) {
              name = name.data
              return name.length > 11 ? name.substr(0, 10) + "..." : name;
            }
          }
        })
      }
      // if (legendPosition === 'top' || legendPosition === 'left' || legendPosition === 'bottom') {
      //   if (!axisTitle) {
      //     state.chartsOption[obj.index].feature.styleConfig.config.grid.right = 54
      //   }
      // }
      if (isMeasureLineShow && state.chartsOption[obj.index].feature.styleConfig.config.measureLineType === '0' && dimValue !="") {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
         item.markLine.data = []
        })
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
         item.markLine.data.push({
            name: '固定值',
            xAxis: dimValue,
            lineStyle: {
              color: '#EF561A'
              // type: 'solid'
            }
          })
        })
      }
      if (doubleY) {
       state.chartsOption[obj.index].feature.styleConfig.config.series[0].yAxisIndex = 0
       state.chartsOption[obj.index].feature.styleConfig.config.series[0].xAxisIndex = 0
       state.chartsOption[obj.index].feature.styleConfig.config.series[1].yAxisIndex = 0
       state.chartsOption[obj.index].feature.styleConfig.config.series[1].xAxisIndex = 1
      } else {
        state.chartsOption[obj.index].feature.styleConfig.config.series[0].yAxisIndex = 0
        state.chartsOption[obj.index].feature.styleConfig.config.series[0].xAxisIndex = 0
        const length = state.chartsOption[obj.index].feature.metricListFlat ? state.chartsOption[obj.index].feature.metricListFlat.length : state.chartsOption[obj.index].feature.metricList.length
        if (length >= 2) {
          state.chartsOption[obj.index].feature.styleConfig.config.series[1].yAxisIndex = 0
          state.chartsOption[obj.index].feature.styleConfig.config.series[1].xAxisIndex = 0
        }
      }
    } else {
      // 处理横坐标 axisLabel 把 LY01_南京雨花物流中心 前面的 编码去掉
      backYAxis.map((item, index) => {
        item.axisLabel =  {
            show: true,
            textStyle: {
              color: '#151515',
              fontFamily: 'PingFangSC-Regular'
            },
            fontFamily: 'HelveticaNeue',
            fontSize: 12,
            color: '#333333',
            lineHeight: 20,
            // 自定义标签显示格式
            formatter: params => {
              const reg = /(.+)###(.+)/
              if (params.indexOf('###') !== -1) {
                let dimName = params.match(reg)[2]
                return dimName.length > 15
                  ? dimName.substr(0, 15) + '...'
                  : dimName
              } else {
                return params.length > 15
                  ? params.substr(0, 15) + '...'
                  : params
              }
            }
            // 不显示最小刻度标签
            // showMinLabel: false,
            // showMaxLabel: false
        }
      })
        if (showNumber) {
          config.series.map((item, index) => {
            item.label = {
              show: true,
              color: '#333',
              position: 'top',
              formatter: function(name) {
                name = name.data
                if (totalLength < 6) {
                  return name.length > 11 ? name.substr(0, 10) + "..." : name;
                } else {
                  return name.length > 5 ? name.substr(0, 5) + "..." : name;
                }
              }
            }
          })
        }
        // const metricLength = state.chartsOption[obj.index].feature.metricListFlat ? state.chartsOption[obj.index].feature.metricListFlat.length : state.chartsOption[obj.index].feature.metricList.length
        // if (legendPosition === 'top' || legendPosition === 'left' || legendPosition === 'bottom') {
        //   if (!axisTitle) {
        //     if (metricLength > 1) {
        //      config.grid.right = config.grid.right - marginR
        //   } else {
        //     state.chartsOption[obj.index].feature.styleConfig.config.grid.right = config.grid.right + marginR
        //   }
        //   }
        // }
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
            item.barMaxWidth = '32'
        })
        // if (totalLength < 21) {
        //   state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        //     item.barWidth = '32'
        //   })
        // }
        if (isMeasureLineShow && state.chartsOption[obj.index].feature.styleConfig.config.measureLineType === '0' && dimValue !="") {
          state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
            item.markLine.data = []
          })
          state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
           item.markLine.data.push({
              name: '固定值',
              yAxis: dimValue,
              lineStyle: {
                color: '#EF561A'
                // type: 'solid'
              }
            })
          })
        }
       if (doubleY) {
        state.chartsOption[obj.index].feature.styleConfig.config.series[0].yAxisIndex = 0
        state.chartsOption[obj.index].feature.styleConfig.config.series[0].xAxisIndex = 0
        state.chartsOption[obj.index].feature.styleConfig.config.series[1].yAxisIndex = 1
        state.chartsOption[obj.index].feature.styleConfig.config.series[1].xAxisIndex = 0
       } else {
        state.chartsOption[obj.index].feature.styleConfig.config.series[0].yAxisIndex = 0
        state.chartsOption[obj.index].feature.styleConfig.config.series[0].xAxisIndex = 0
         const length2 = state.chartsOption[obj.index].feature.metricListFlat ? state.chartsOption[obj.index].feature.metricListFlat.length : state.chartsOption[obj.index].feature.metricList.length
         if (length2 >= 2) {
          state.chartsOption[obj.index].feature.styleConfig.config.series[1].yAxisIndex = 0
          state.chartsOption[obj.index].feature.styleConfig.config.series[1].xAxisIndex = 0
        }
       }
    }
    this.commit('setBarChart', {index: obj.index})

    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeLine(state, obj) {
    const totalLength = state.chartsOption[obj.index].feature.styleConfig.config.data.totalLength
    const showNumber = state.chartsOption[obj.index].feature.styleConfig.config.showNumber
    if (obj.type) {
      state.chartsOption[obj.index].feature.styleConfig.config.series[1].type = 'line'
      let barArray = []
      state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        if (item.type === 'bar') {
          barArray.push(item)
        } else {
          if (showNumber) {
            item.label = {
              show: true,
              color: '#333',
              position: 'bottom',
              formatter: function(name) {
                name = name.data
                if (totalLength < 6) {
                  return name.length > 11 ? name.substr(0, 10) + "..." : name;
                } else {
                  return name.length > 5 ? name.substr(0, 5) + "..." : name;
                }
              }
            }
          }
        }
      })
      const barLength = barArray.length
      const mockDataLength = state.chartsOption[obj.index].data.length
      if (barLength * mockDataLength < 21) {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
          item.barWidth = '32'
        })
      }
    } else {
      state.chartsOption[obj.index].feature.styleConfig.config.series[1].type = 'bar'
      if (totalLength < 21) {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
          item.barWidth = '32'
        })
      }
      if (showNumber) {
         state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
            item.label = {
              show: true,
              color: '#333',
              position: 'top',
              formatter: function(name) {
                name = name.data
                if (totalLength < 6) {
                  return name.length > 11 ? name.substr(0, 10) + "..." : name;
                } else {
                  return name.length > 5 ? name.substr(0, 5) + "..." : name;
                }
              }
            }
          })
      }
    }
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  showBarDoubleY(state, obj) {
    const isCross = state.chartsOption[obj.index].feature.styleConfig.config.crosswise
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const legendPosition = config.legendPosition
    const axisTitle = config.axisTitle
    const metricLength = state.chartsOption[obj.index].feature.metricListFlat ? state.chartsOption[obj.index].feature.metricListFlat.length : state.chartsOption[obj.index].feature.metricList.length
    if (metricLength === 2) {
      if (obj.type) {
        // if (state.chartsOption[obj.index].feature.styleConfig.config.isMeasureLineShow) {
          state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
            item.markLine.lineStyle.opacity = 0
            item.markLine.label.show = false
          })
        // }
        // if (isCross) {
        //   state.chartsOption[obj.index].feature.styleConfig.config.xAxis[1].show = true
        //   state.chartsOption[obj.index].feature.styleConfig.config.series[0].yAxisIndex = 0
        //   state.chartsOption[obj.index].feature.styleConfig.config.series[0].xAxisIndex = 0
        //   state.chartsOption[obj.index].feature.styleConfig.config.series[1].yAxisIndex = 0
        //   state.chartsOption[obj.index].feature.styleConfig.config.series[1].xAxisIndex = 1
        // } else {
          state.chartsOption[obj.index].feature.styleConfig.config.yAxis[1].show = true
          state.chartsOption[obj.index].feature.styleConfig.config.series[0].yAxisIndex = 0
          state.chartsOption[obj.index].feature.styleConfig.config.series[0].xAxisIndex = 0
          state.chartsOption[obj.index].feature.styleConfig.config.series[1].yAxisIndex = 1
          state.chartsOption[obj.index].feature.styleConfig.config.series[1].xAxisIndex = 0
          // 解决多条柱子间距莫名其妙不对的样式问题
        // if (legendPosition !== "right") {
        //   if (axisTitle) {
        //     config.grid.right = '64'
        //   } else {
        //     config.grid.right = '24'
        //   }
        // } else {
        //   config.grid.right = '200'
        // }
        // }
      } else {
        //  if (legendPosition !== "right") {
        //   if (axisTitle) {
        //     config.grid.right = '84'
        //   } else {
        //     config.grid.right = '24'
        //   }
        // } else {

        // }
        // if (legendPosition !== "right") {
        //   if (axisTitle) {
        //     config.grid.right = '64'
        //   } else {
        //     config.grid.right = '0'
        //   }
        // } else {
        //   config.grid.right = '200'
        // }
          // if (state.chartsOption[obj.index].feature.styleConfig.config.isMeasureLineShow) {
          //   state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
          //     item.markLine.lineStyle.opacity = 1
          //   })
          // }
          // state.chartsOption[obj.index].feature.styleConfig.config.line = false
          // state.chartsOption[obj.index].feature.styleConfig.config.series[1].type = 'bar'
        // if (isCross) {
        //   state.chartsOption[obj.index].feature.styleConfig.config.xAxis[1].show = false
        //   state.chartsOption[obj.index].feature.styleConfig.config.series[1].xAxisIndex = 0
        // } else {
          state.chartsOption[obj.index].feature.styleConfig.config.yAxis[1].show = false
          state.chartsOption[obj.index].feature.styleConfig.config.series[1].yAxisIndex = 0
          const isMeasureLineShow = state.chartsOption[obj.index].feature.styleConfig.config.isMeasureLineShow
          if (isMeasureLineShow) {
            state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
              item.markLine.lineStyle.opacity = 1
              item.markLine.label.show = true
            })
          }
        // }
      }
    }
    this.commit('setBarChart', {index: obj.index})

    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  // 对XY轴标题的显示操作
  // showAxisBarTitile (state, obj) {
  //   let Xlength = state.chartsOption[obj.index].feature.styleConfig.config.xAxis.length
  //   let Ylength = state.chartsOption[obj.index].feature.styleConfig.config.yAxis.length
  //   const isCross = state.chartsOption[obj.index].feature.styleConfig.config.crosswise
  //   // 显示 X/Y轴标题
  //   if (obj.type) {
  //     // X/Y交叉时 显示 X/Y轴标题
  //     if (isCross) {
  //       for(let i = 0; i < Xlength; i++) {
  //         let name = state.chartsOption[obj.index].feature.metricList[i].metricName
  //         state.chartsOption[obj.index].feature.styleConfig.config.xAxis[i].name = name
  //       }
  //       for(let i = 0; i < Ylength; i++) {
  //         let name = state.chartsOption[obj.index].feature.dimList[0].dimName
  //         state.chartsOption[obj.index].feature.styleConfig.config.yAxis[i].name = name
  //       }
  //     } else {
  //       // X/Y不交叉时 显示 X/Y轴标题
  //       for(let i = 0; i < Xlength; i++) {
  //         state.chartsOption[obj.index].feature.styleConfig.config.xAxis[i].name = state.chartsOption[obj.index].feature.dimList[i].dimName
  //       }
  //       for(let i = 0; i < Ylength; i++) {
  //         let name = state.chartsOption[obj.index].feature.metricList[i].metricName
  //         state.chartsOption[obj.index].feature.styleConfig.config.yAxis[i].name = name
  //       }
  //     }
  //   } else {
  //     // 不显示 X/Y轴标题
  //     for(let i = 0; i < Xlength; i++) {
  //       if (state.chartsOption[obj.index].feature.styleConfig.config.xAxis[i].hasOwnProperty('name')) {
  //         delete state.chartsOption[obj.index].feature.styleConfig.config.xAxis[i].name
  //       }
  //     }
  //     for(let i = 0; i < Ylength; i++) {
  //       if (state.chartsOption[obj.index].feature.styleConfig.config.yAxis[i].hasOwnProperty('name')) {
  //         delete state.chartsOption[obj.index].feature.styleConfig.config.yAxis[i].name
  //       }
  //     }
  //   }
  //   bus.$emit(`updateOptionBar_${obj.index}`, {
  //     index: obj.index,
  //     config: state.chartsOption[obj.index].feature.styleConfig.config
  //   })
  // },
  showAxisBarTitile (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let metricList = state.chartsOption[obj.index].feature.metricListFlat ? state.chartsOption[obj.index].feature.metricListFlat : state.chartsOption[obj.index].feature.metricList
    let dimList = state.chartsOption[obj.index].feature.dimList
    // let position = state.chartsOption[obj.index].feature.styleConfig.config.positionName
    let Xlength = config.xAxis.length
    let Ylength = config.yAxis.length
    let isCross = false
    let val = state.chartsOption[obj.index].feature.styleConfig.config.legend.positionName

    // 是否显示轴标题
    let isTitle = state.chartsOption[obj.index].feature.styleConfig.config.xAxis[0].hasOwnProperty('name')

    // 当前是否存在X/Y轴交换行为
    if (config.yAxis[0].type === 'category' && config.xAxis[0].type === 'value') {
      isCross = true
    }
    const axisTitle = config.axisTitle
    const XAxisTitle = config.XAxisTitle || ''
    const YAxisTitle = config.YAxisTitle || ''
    // 显示 X/Y轴标题
    if (obj.type) {
      // X/Y交叉时 显示 X/Y轴标题
      if (isCross) {
        if (YAxisTitle !== '' && axisTitle) {
          for(let i = 0; i < Xlength; i++) {
           config.xAxis[i].name = YAxisTitle
        }
      } else {
         for(let i = 0; i < Xlength; i++) {
          let name = metricList[i].metricName
          if (name.length > 4) {
            name = name.substring(0, 4) + '...'
          }
          config.xAxis[i].name = name
        }
      }
      if (XAxisTitle !== '' && axisTitle) {
        for(let i = 0; i < Ylength; i++) {
          config.yAxis[i].name = XAxisTitle
        }
      } else {
        for(let i = 0; i < Ylength; i++) {
          let name = dimList[0].dimName
          if (name.length > 4) {
            name = name.substring(0, 4) + '...'
          }
          config.yAxis[i].name = name
        }
      }
      } else {
        if (XAxisTitle !== '' && axisTitle) {
          for(let i = 0; i < Xlength; i++) {
           config.xAxis[i].name = XAxisTitle
          }
      } else {
          // X/Y不交叉时 显示 X/Y轴标题
          for(let i = 0; i < Xlength; i++) {
            let name = dimList[i].dimName
            if (name.length > 4) {
              name = name.substring(0, 4) + '...'
            }
            config.xAxis[i].name = name
          }
        }
        if (YAxisTitle !== '' && axisTitle) {
          for(let i = 0; i < Ylength; i++) {
            config.yAxis[i].name = YAxisTitle
          }
        } else {
          for(let i = 0; i < Ylength; i++) {
            let name = metricList[i].metricName
            if (name.length > 4) {
              name = name.substring(0, 4) + '...'
            }
            config.yAxis[i].name = name
          }
        }
      }
    } else {
      // 不显示 X/Y轴标题
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

    this.commit('setBarChart', {index: obj.index})

    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
    // if (obj.statue) {
    //   // 保存操作记录
    //   let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
    //   let find = false
    //   operate.forEach((item, index) => {
    //     if (item.name === obj.record.name) {
    //       item.optionVal = obj.record.optionVal
    //       find = true
    //     }
    //   })
    //   if (!find) {
    //     state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
    //   }
    //   bus.$emit('updateOption', {
    //     index: obj.index,
    //     config: state.chartsOption[obj.index].feature.styleConfig.config
    //   })
    // }
  },
  syncDataZoom(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.dataZoom[0].start = obj.start
    state.chartsOption[obj.index].feature.styleConfig.config.dataZoom[0].end = obj.end
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  initConfig(state, obj) {
    let bar = new configClass.Bar()
    state.chartsOption[obj.index].feature.styleConfig.config = bar.config
  },
  changeMeasureLine(state, obj) {
    const  measureLineType = state.chartsOption[obj.index].feature.styleConfig.config.measureLineType
    let grid = state.chartsOption[obj.index].feature.styleConfig.config.grid
    if(obj.type) {
      const dimValue = state.chartsOption[obj.index].feature.styleConfig.config.dimValue
      if (measureLineType === '0' && dimValue !="") {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
          item.markLine.data = []
        })
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
          if (state.chartsOption[obj.index].feature.styleConfig.config.crosswise) {
            item.markLine.data.push({
              name: '固定值',
              xAxis: dimValue,
              lineStyle: {
                color: '#EF561A'
                // type: 'solid'
              }
            })
          } else {
            item.markLine.data.push({
              name: '固定值',
              yAxis: dimValue,
              lineStyle: {
                color: '#EF561A'
                // type: 'solid'
              }
            })
          }
        })
      }
      state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        item.markLine.lineStyle.opacity = 1
        item.markLine.label.show = true
      })
    } else {
      state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        item.markLine.lineStyle.opacity = 0
        item.markLine.label.show = false
      })
    }

    this.commit('setBarChart', {index: obj.index})

    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  setFixedMeasure(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      item.markLine.data = []
    })
    state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      if (state.chartsOption[obj.index].feature.styleConfig.config.crosswise) {
        item.markLine.data.push({
          name: '固定值',
          xAxis: obj.dimValue,
          // label: {
          //  position: 'middle'
          // },
          lineStyle: {
            color: '#EF561A'
            // type: 'solid'
          }
        })
      } else {
        item.markLine.data.push({
          name: '固定值',
          yAxis: obj.dimValue,
          // label: {
          //  position: 'middle'
          // },
          lineStyle: {
            color: '#EF561A'
            // type: 'solid'
          }
        })
      }
    })

    this.commit('setBarChart', {index: obj.index})

    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  setAvageMeasure(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.series.forEach((item, index) => {
      item.markLine.data = []
    })
    state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      item.markLine.data.push({
        name: '平均值',
        type: 'average',
        // label: {
        //    position: 'middle'
        // }
      })
    })

    this.commit('setBarChart', {index: obj.index})

    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  clearFixedValue(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      item.markLine.data = []
    })

    this.commit('setBarChart', {index: obj.index})

    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
 saveBarOperate(state, obj) {
    if (obj.state) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      operate.forEach((item, index) => {
        if (item.methods === obj.methods) {
          item.params = obj.params
          find = true
          if (obj.methods === 'changeCrosswise' && obj.type === false || obj.methods === 'changeGuideShow' && obj.type === false) {
            operate.splice(index, 1)
          }
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj)
      }
    }
 },
 changeToolip(state, obj) {
   const config = state.chartsOption[obj.index].feature.styleConfig.config
   const tooltip = config.tooltip
   tooltip.show = obj.type
   if (!obj.type) {
      config.isGuideShow  = false
   }
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
 },
  setBarLegendPosition (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.legendPosition = obj.type

    this.commit('setBarChart', {index: obj.index})
    if (obj.statue) {
      bus.$emit(`updateOptionBar_${obj.index}`, {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  changeShowNumber(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const totalLength = config.data.totalLength
    const crosswise = config.crosswise
    const line  = config.line
    if (obj.type) {
      if (crosswise) {
        config.series.map((item, index) => {
          item.label = {
            show: true,
            color: '#333',
            position: 'right',
            formatter: function(name) {
              name = name.data
              return name.length > 11 ? name.substr(0, 10) + "..." : name;
            }
          }
        })
      } else if (line){
        config.series.map((item, index) => {
          if (item.type === 'bar') {
            item.label = {
              show: true,
              color: '#333',
              position: 'top',
              formatter: function(name) {
                name = name.data
                if (totalLength < 6) {
                  return name.length > 11 ? name.substr(0, 10) + "..." : name;
                } else {
                  return name.length > 5 ? name.substr(0, 5) + "..." : name;
                }
              }
            }
          } else {
            item.label = {
              show: true,
              color: '#333',
              position: 'bottom',
              formatter: function(name) {
                name = name.data
                if (totalLength < 6) {
                  return name.length > 11 ? name.substr(0, 10) + "..." : name;
                } else {
                  return name.length > 5 ? name.substr(0, 5) + "..." : name;
                }
              }
            }
          }
        })
      } else {
        config.series.map((item, index) => {
          item.label = {
            show: true,
            color: '#333',
            position: 'top',
            formatter: function(name) {
              name = name.data
              if (totalLength < 6) {
                return name.length > 11 ? name.substr(0, 10) + "..." : name;
              } else {
                return name.length > 5 ? name.substr(0, 5) + "..." : name;
              }
            }
          }
        })
      }
    } else {
      config.series.map((item, index) => {
        item.label = {
          show: false,
          color: '#333',
          position: 'top',
          formatter: function(name) {
            name = name.data
            if (totalLength < 6) {
              return name.length > 11 ? name.substr(0, 10) + "..." : name;
            } else {
              return name.length > 5 ? name.substr(0, 5) + "..." : name;
            }
          }
        }
      })
    }
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeStack(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const crosswise = config.crosswise
    const totalLength = config.data.totalLength
    const seriesLength = config.series[0].data.length
    if (obj.type) {
      if (crosswise) {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
          item.barMaxWidth = '10'
        })
        // if (seriesLength < 6) {
        //     state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        //       item.barWidth = '24'
        //     })
        // } else {
        //   state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        //      delete item.barWidth
        //   })
        // }
      }
      config.series.map((item, index) => {
        item.stack = '总量'
      })
    } else {
      if (crosswise) {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
          item.barMaxWidth = '10'
        })
        // if (totalLength < 10) {
        //     state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        //       item.barWidth = '24'
        //     })
        // } else {
        //   state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        //      delete item.barWidth
        //   })
        // }
      }
     config.series.map((item, index) => {
        item.stack = ''
      })
    }
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeGuideShow(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const metricListLength = state.chartsOption[obj.index].feature.metricListFlat ? state.chartsOption[obj.index].feature.metricListFlat.length : state.chartsOption[obj.index].feature.metricList.length
    if (obj.type) {
      config.tooltip.show = true
      config.tooltip.axisPointer.type = 'cross'
      // if (metricListLength === 1) {
      //   config.tooltip.axisPointer.type = 'cross'
      // } else {
      //   config.tooltip.axisPointer.type = 'shadow'
      // }
    } else {
      config.tooltip.show = false
      config.tooltip.axisPointer.type = ''
    }
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeLineChart(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const selectMetricList = config.selectMetricList
    config.series.map((item, index) => {
      item.type = 'bar'
    })
    selectMetricList.map((metricItem, metricIndex) => {
      config.series.map((item, index) => {
        if (metricItem == item.id) {
          item.type = 'line'
        }
      })
    })
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeShowLineChar(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const selectMetricList = config.selectMetricList
    if (obj.type) {
     selectMetricList.map((metricItem, metricIndex) => {
        config.series.map((item, index) => {
          if (metricItem == item.id) {
            item.type = 'line'
          }
        })
      })
    } else {
      config.series.map((item, index) => {
        item.type = 'bar'
      })
      config.selectMetricList = []
    }
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  editCurrentPage(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    config.currentPage = obj.value
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  saveHandelData(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    config.data = obj.value
  },
  saveDimValueNumList(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    config.dimValueNmList = obj.value
  },
  saveDimLimit(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config[obj.name] = obj.value
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  cancelIndexPave(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.dimFilter = false
    state.chartsOption[obj.index].feature.styleConfig.config.selectedDim = ''
    state.chartsOption[obj.index].feature.styleConfig.config.selectDimValue = []
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  cancelDimFilter(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.selectedDim = ''
    state.chartsOption[obj.index].feature.styleConfig.config.selectDimValue = []
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  saveSearchKey(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.searchKey = obj.value
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  clearSelectedDim(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.selectedDim = ''
    state.chartsOption[obj.index].feature.styleConfig.config.selectDimValue = []
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  setCustomXAxisTitle(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let crosswise = config.crosswise
    // if (obj.value.length > 4) {
    //   obj.value = obj.value.substring(0, 4) + '...'
    // }
    config.xAxis[0].name = obj.value
    const val = config.legendPosition

    this.commit('setBarChart', {index: obj.index})

    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  setCustomYAxisTitle(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let crosswise = config.crosswise
    const val = config.legendPosition

    this.commit('setBarChart', {index: obj.index})

    config.yAxis.map((item, index) => {
      item.name = obj.value
    })
    // config.yAxis[0].name = obj.value
    bus.$emit(`updateOptionBar_${obj.index}`, {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  }
}
