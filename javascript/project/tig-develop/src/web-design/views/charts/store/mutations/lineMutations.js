import bus from '../../utils/eventBus'
var left = {
  legend: {
    show: true,
    type: 'scroll',
    orient: 'vertical',
    left: 0,
    y: 'center',
    padding: [16, 16],
    itemGap: 20,
    itemWidth: 12,
    itemHeight: 12,
    width: 168,
    textStyle: {
      fontSize: 12
    },
    pageIconSize: 10,
    formatter: function(name){
      return name.length > 11 ? name.substr(0,10) + "..." : name
    },
    tooltip: {
      show: true,
      formatter: function(params) {
        const str = '<div style="border-radius:4px;padding:0 5px;font-size:12px;">' + params.name +'</div'
        return str
      },
      backgroundColor: "rgba(255, 255, 255, 1)",
      extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 200,
    right: 16,
    top: 16,
    bottom: 16,
    containLabel: true
  }
}
var right = {
  legend: {
    show: true,
    type: 'scroll',
    orient: 'vertical',
    y: 'center',
    right: 0,
    padding: [16, 16],
    itemGap: 20,
    itemWidth: 12,
    itemHeight: 12,
    width: 168,
    textStyle: {
      fontSize: 12
    },
    pageIconSize: 10,
    formatter: function(name){
      return name.length > 11?name.substr(0,10) + "..." : name
    },
    tooltip: {
      show: true,
      formatter: function(params) {
        const str = '<div style="border-radius:4px;padding:0 5px;font-size:12px;">' + params.name +'</div'
        return str
      },
      backgroundColor: "rgba(255, 255, 255, 1)",
      extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 16,
    right: 200,
    top: 16,
    bottom: 16,
    containLabel: true
  }
}
var top = {
  legend: {
    show: true,
    type: 'scroll',
    orient: 'horizontal',
    top: 0,
    padding: [16, 16],
    itemGap: 20,
    itemWidth: 12,
    itemHeight: 12,
    height: 14,
    textStyle: {
      fontSize: 12
    },
    pageIconSize: 12,
    x: 'center',
    tooltip: {
      show: true,
      formatter: function(params) {
        const str = '<div style="border-radius:4px;padding:0 5px;font-size:12px;">' + params.name +'</div'
        return str
      },
      backgroundColor: "rgba(255, 255, 255, 1)",
      extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 16,
    right: 16,
    top: 46,
    bottom: 16,
    containLabel: true
  }
}
var bottom = {
  legend: {
    show: true,
    type: 'scroll',
    orient: 'horizontal',
    bottom: 0,
    padding: [16, 16],
    itemGap: 20,
    itemWidth: 12,
    itemHeight: 12,
    height: 14,
    textStyle: {
      fontSize: 12
    },
    pageIconSize: 12,
    x: 'center',
    tooltip: {
      show: true,
      formatter: function(params) {
        const str = '<div style="border-radius:4px;padding:0 5px;font-size:12px;">' + params.name +'</div'
        return str
      },
      backgroundColor: "rgba(255, 255, 255, 1)",
      extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
    }
  },
  grid: {
    left: 16,
    right: 16,
    top: 16,
    bottom: 46,
    containLabel: true
  }
}
var gridDefault = {
    left: 16,
    right: 16,
    top: 16,
    bottom: 16,
    containLabel: true
}
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

// 配置legend data[]
const getLegendData = (metricList, isBar) => {
  return metricList.map((item, index) => {
    if (isBar && index === 1) {
      return {
        name: item.metricName,
        icon: 'bar'
      }
    } else {
      return {
        name: item.metricName,
        icon: 'line'
      }
    }
  })
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


export default {
  // 设置echart的位置
  setChart (state, obj) {
    const marginTitleT = 28     //控制显示标题时的上边距 12px(lineHeight) + 16px(nameGap)
    const marginTitleR = 50     //控制显示标题时的右边距  弃用 => 现根据单位字符长度动态计算宽度
    const marginCross = 25      //控制切换为横向的右边距
    const marginSlider = 50     //控制显示滑块时的下边距
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    // let metricList = state.chartsOption[obj.index].feature.metricList
    let metricList = state.chartsOption[obj.index].feature.metricListFlat?state.chartsOption[obj.index].feature.metricListFlat : []
    // 当前图例位置
    let legend = config.positionName
    // 当前是否显示图例
    let isLegend = config.legend.show

    // 是否显示轴标题
    let isTitleX = false
    if (config.xAxis.length > 0 && config.isTitle) {
      isTitleX = config.xAxis[0].hasOwnProperty('name')
    }
    let isTitleY = false
    if (config.yAxis.length > 0 && config.isTitle) {
      isTitleY = config.yAxis[0].hasOwnProperty('name')
    }

    // 是否存在XY交叉
    let isCross = false
    if ((config.yAxis.length > 0) && (config.yAxis[0].type === 'category')) {
      isCross =  true
    }

    // 是否显示滑块
    let isSlider = config.dataZoom.show ? config.dataZoom.show : false
    // 是否显示柱状图

    let isBar = false
    // 当前是否存在柱状图
    if ((config.series.length === 2) && (config.series[1].type === 'bar')) {
      isBar = true
    }

    // 是否双Y轴
    let isDoubleY = false
    if (config.yAxis.length > 1) {
      isDoubleY =  true
    }

    // 获取图例数据
    let data = getLegendData(metricList, isBar)

    // 获取所有指标的最大值
    let maxArr = []
    for (let i = 0, length = config.series.length; i < length; i++) {
      maxArr.push(Math.max(...config.series[i].data))
    }
    let maxvalue = Math.max(...maxArr)

    // 配置legend和grid位置
    switch (legend) {
      case 'top':
        // 是否显示图例
        if (isLegend) {
          config.legend = deep_clone(top.legend)
          config.grid = JSON.parse(JSON.stringify(top.grid))
        } else {
          config.grid = JSON.parse(JSON.stringify(gridDefault))
        }

        // 显示X轴标题
        if (isTitleX) {
          let titleString = config.xAxis[0].name
          let right = parseInt(config.grid.right)
          // 轴标题距离 轴线的距离 = 标题字长 + 20的margin
          let xNameWidth = calcStringPixelsCount(titleString, 12) + 20
          config.grid.right = right + xNameWidth

          // 双Y轴的特殊处理双Y轴 grid参考基准变化时的处理
          if (isDoubleY) {
            // 最大刻度离轴线的距离 = 最大刻度字长 + label与轴线的margin
            let yLabelWidth = calcStringPixelsCount(maxvalue.toString(), 12) + 8
            if (xNameWidth > yLabelWidth) {
              config.grid.right = xNameWidth - yLabelWidth + 16
            } else {
              config.grid.right = 16
            }
          }
        }
        // 显示Y轴标题
        if (isTitleY) {
          let top = parseInt(config.grid.top)
          config.grid.top = top + marginTitleT
        } else {
          let titleString = config.xAxis[0].name
          // grid基准(是否显示标签)变化 重新计算右边距
          if (isDoubleY && isTitleX) {
            config.grid.right = 16 + calcStringPixelsCount(titleString, 12) + 16
          }          
        }

        // 横向时 => 右 + 50 防止数值轴 数值溢出
        if (isCross) {
          let padding = parseInt(config.grid.right)
          config.grid.right = padding + (isTitleX ? 0 : calcStringPixelsCount( maxvalue.toString(), 12) * 0.5)
        }

        // 存在滑块时 => 下 + 80
        if (isSlider) {
          let padding = parseInt(config.grid.bottom)
          config.grid.bottom = padding + marginSlider
        }
        break;
      case 'bottom':
        if (isLegend) {
          config.legend = deep_clone(bottom.legend)
          config.grid = JSON.parse(JSON.stringify(bottom.grid))
        } else {
          config.grid = JSON.parse(JSON.stringify(gridDefault))
        }

        // 显示X轴标题
        if (isTitleX) {
          let titleString = config.xAxis[0].name
          let right = parseInt(config.grid.right)

          // 轴标题距离 轴线的距离 = 标题字长 + 20的margin
          let xNameWidth = calcStringPixelsCount(titleString, 12) + 20
          config.grid.right = right + xNameWidth

          // 双Y轴的特殊处理双Y轴 grid参考基准变化时的处理
          if (isDoubleY) {
            // 最大刻度离轴线的距离 = 最大刻度字长 + label与轴线的margin
            let yLabelWidth = calcStringPixelsCount(maxvalue.toString(), 12) + 8
            if (xNameWidth > yLabelWidth) {
              config.grid.right = xNameWidth - yLabelWidth + 16
            } else {
              config.grid.right = 16
            }
          }
        }
        // 显示Y轴标题
        if (isTitleY) {
          let top = parseInt(config.grid.top)
          config.grid.top = top + marginTitleT
        } else {
          let titleString = config.xAxis[0].name
          // grid基准(是否显示标签)变化 重新计算右边距
          if (isDoubleY && isTitleX) {
            config.grid.right = 16 + calcStringPixelsCount(titleString, 12) + 16
          }          
        }

        if (isCross) {
          let padding = parseInt(config.grid.right)
          config.grid.right = padding + (isTitleX ? 0 : calcStringPixelsCount( maxvalue.toString(), 12) * 0.5)
        }

        if (isSlider) {
          let padding = parseInt(config.grid.bottom)
          config.grid.bottom = padding + marginSlider
          let bottom = parseInt(config.legend.bottom)
          config.legend.bottom = bottom + 50
        }
        break;
      case 'left':
        if (isLegend) {
          config.legend = left.legend
          config.grid = JSON.parse(JSON.stringify(left.grid))
        } else {
          config.grid = JSON.parse(JSON.stringify(gridDefault))
        }

        // 显示X轴标题
        if (isTitleX) {
          let titleString = config.xAxis[0].name
          let right = parseInt(config.grid.right)

          // 轴标题距离 轴线的距离 = 标题字长 + 20的margin
          let xNameWidth = calcStringPixelsCount(titleString, 12) + 20
          config.grid.right = right + xNameWidth
          
          // 双Y轴的特殊处理双Y轴 grid参考基准变化时的处理
          if (isDoubleY) {
            // 最大刻度离轴线的距离 = 最大刻度字长 + label与轴线的margin
            let yLabelWidth = calcStringPixelsCount(maxvalue.toString(), 12) + 8
            if (xNameWidth > yLabelWidth) {
              config.grid.right = xNameWidth - yLabelWidth + 16
            } else {
              config.grid.right = 16
            }
          }
        }
        // 显示Y轴标题
        if (isTitleY) {
          let top = parseInt(config.grid.top)
          config.grid.top = top + marginTitleT
        } else {
          let titleString = config.xAxis[0].name
          // grid基准(是否显示标签)变化 重新计算右边距
          if (isDoubleY && isTitleX) {
            config.grid.right = 16 + calcStringPixelsCount(titleString, 12) + 16
          }          
        }

        // 横向时 => 右 + 50 防止数值轴 数值溢出
        if (isCross) {
          let padding = parseInt(config.grid.right)
          config.grid.right = padding + (isTitleX ? 0 : calcStringPixelsCount( maxvalue.toString(), 12) * 0.5)
        }

        if (isSlider) {
          let padding = parseInt(config.grid.bottom)
          config.grid.bottom = padding + marginSlider
        }
        break;
      case 'right':
        if (isLegend) {
          config.legend = right.legend
          config.grid = JSON.parse(JSON.stringify(right.grid))
        } else {
          config.grid = JSON.parse(JSON.stringify(gridDefault))
        }

        // 显示X轴标题
        if (isTitleX) {
          let titleString = config.xAxis[0].name
          let right = parseInt(config.grid.right)

          // 轴标题距离 轴线的距离 = 标题字长 + 20的margin
          let xNameWidth = calcStringPixelsCount(titleString, 12) + 20
          config.grid.right = right + (isLegend ? 0 : xNameWidth)

          // 双Y轴的特殊处理双Y轴 grid参考基准变化时的处理
          if (isDoubleY) {
            // 最大刻度离轴线的距离 = 最大刻度字长 + label与轴线的margin
            let yLabelWidth = calcStringPixelsCount(maxvalue.toString(), 12) + 8
            if (xNameWidth > yLabelWidth) {
              config.grid.right = isLegend ? 200 : (xNameWidth - yLabelWidth + 16)
            } else {
              config.grid.right = isLegend ? 200 : 16
            }
          }
        }
        // 显示Y轴标题
        if (isTitleY) {
          let top = parseInt(config.grid.top)
          config.grid.top = top + marginTitleT
        } else {
          let titleString = config.xAxis[0].name
          // grid基准(是否显示标签)变化 重新计算右边距
          if (isDoubleY && isTitleX) {
            config.grid.right = isLegend ? 200 : 16 + calcStringPixelsCount(titleString, 12) + 20
          }          
        }

        if (isCross) {
          // let padding = parseInt(config.grid.right)
          // config.grid.right = padding + (isTitle ? 0 : marginCross)
        }
        if (isSlider) {
          let padding = parseInt(config.grid.bottom)
          config.grid.bottom = padding + marginSlider
        }
        break;
      default:
        if (isLegend) {
          config.legend = top.legend
          config.grid = JSON.parse(JSON.stringify(top.grid))
        } else {
          config.grid = JSON.parse(JSON.stringify(gridDefault))
        }

        // if (isTitle) {
        //   let titleString = config.xAxis[0].name    // 根据字长计算偏移宽度 标题fontsize: 13px
        //   let right = parseInt(config.grid.right)
        //   let top = parseInt(config.grid.top)
        //   // nameGap 为20px
        //   config.grid.right = right + calcStringPixelsCount(titleString, 12) + 20
        //   config.grid.top = top + marginTitleT
        //   // 双Y轴的特殊处理
        //   if (isDoubleY) {
        //     let maxvalue = Math.max(Math.max(...config.series[0].data), Math.max(...config.series[1].data))
        //     let right = parseInt(config.grid.right)
        //     config.grid.right = right - calcStringPixelsCount(maxvalue.toString(), 12) - 8
        //   }
        // }

        // 显示X轴标题
        if (isTitleX) {
          let titleString = config.xAxis[0].name
          let right = parseInt(config.grid.right)

          // 轴标题距离 轴线的距离 = 标题字长 + 20的margin
          let xNameWidth = calcStringPixelsCount(titleString, 12) + 20
          config.grid.right = right + xNameWidth

          // 双Y轴的特殊处理双Y轴 grid参考基准变化时的处理
          if (isDoubleY) {
            // 最大刻度离轴线的距离 = 最大刻度字长 + label与轴线的margin
            let yLabelWidth = calcStringPixelsCount(maxvalue.toString(), 12) + 8
            if (xNameWidth > yLabelWidth) {
              config.grid.right = xNameWidth - yLabelWidth + 16
            } else {
              config.grid.right = 16
            }
          }
        }
        // 显示Y轴标题
        if (isTitleY) {
          let top = parseInt(config.grid.top)
          config.grid.top = top + marginTitleT
        } else {
          let titleString = config.xAxis[0].name
          // grid基准(是否显示标签)变化 重新计算右边距
          if (isDoubleY && isTitleX) {
            config.grid.right = 16 + calcStringPixelsCount(titleString, 12) + 16
          }          
        }

        if (isCross) {
          // let padding = parseInt(config.grid.right)
          // config.grid.right = padding + (isTitle ? 0 : marginCross)
        }
        if (isSlider) {
          let padding = parseInt(config.grid.bottom)
          config.grid.bottom = padding + marginSlider
        }
        break;
    }
    config.legend.data = data
  },
  // 设置legend 位置
  setLegendPosition (state, obj) {
    // 设置目标位置
    state.chartsOption[obj.index].feature.styleConfig.config.positionName = obj.type
    this.commit('setChart', {index: obj.index})
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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  deleteSeries(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.series.map((seriesItem, seriesIndex)=> {
       delete seriesItem[obj.name]
    })
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit('updateOption', obj)
  },
  // XY轴交换 
  changeXtoY(state, obj) {
    let xAxisArr = []
    let yAxisArr = []
    let xShow = false
    let yShow = false
    let config = state.chartsOption[obj.index].feature.styleConfig.config

    // 获取当前X轴选项的状态
    if (config.xAxis.length > 0) {
      xShow = config.xAxis[0].axisLabel.show
    }
    // 获取当前Y轴选项的状态
    if (config.yAxis.length > 0) {
      yShow = config.yAxis[0].axisLabel.show
    }

    xAxisArr = config.xAxis
    yAxisArr = config.yAxis

    config.xAxis = yAxisArr
    config.yAxis = xAxisArr

    let isCross = false

    // 已横向时
    if (config.yAxis[0].type === 'category' && config.xAxis[0].type === 'value') {
      isCross = true
    }

    // 保持交换后 同步XY轴标签显示状态
    for (let i = 0; i < config.xAxis.length; i++ ) {
      config.xAxis[i].axisLabel.show = xShow
      // X轴是类目轴
      if (!isCross) {
        config.xAxis[i].axisLine.show = xShow
      }
    }

    for (let i = 0; i < config.yAxis.length; i++ ) {
      config.yAxis[i].axisLabel.show = yShow
      // Y轴是类目轴时
      if (isCross) {
        config.yAxis[i].axisLine.show = yShow
      }
    }
    // 是否显示轴标题
    let isTitle = config.isTitle

    // 同步标题与标签的显示
    this.commit('setXAxisTitile', {
      index: obj.index,
      type: xShow && isTitle
    })

    // 同步标题与标签的显示
    this.commit('setYAxisTitile', {
      index: obj.index,
      type: yShow && isTitle
    })

    // 优化数值的显示效果
    this.commit('resetValuePositon', {index: obj.index})

    // 位置设置同步
    this.commit('setChart', {index: obj.index})

    if (obj.statue) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      // 读取记录  并更新操作选项
      operate.forEach((item, index) => {
        if (item.name === obj.record.name) {
          item.optionVal = obj.record.optionVal
          find = true
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
      }
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 对XY轴标题的显示操作
  // 轴标题是否显示 同时受坐标轴显示状态和显示坐标轴勾选按钮有关
  showAxisTitile (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    // let metricList = state.chartsOption[obj.index].feature.metricList
    let metricList = state.chartsOption[obj.index].feature.metricListFlat
    let dimList = state.chartsOption[obj.index].feature.dimList
    let Xlength = config.xAxis.length
    let Ylength = config.yAxis.length
    let isCross = false
    let xName = config.xName     // 重命名的X轴标题
    let yName = config.yName     // 重命名的Y轴标题
    let xShow = false
    let yShow = false

    // 是否显示X轴
    if (config.xAxis && config.xAxis.length > 0) {
      xShow = config.xAxis[0].axisLabel.show
    }
    // 是否显示Y轴
    if (config.yAxis && config.yAxis.length > 0) {
      yShow = config.yAxis[0].axisLabel.show
    }

    // 当前是否存在X/Y轴交换行为
    if (config.yAxis[0].type === 'category' && config.xAxis[0].type === 'value') {
      isCross = true
    }

    // 保存轴标题状态
    config.isTitle = obj.type

    // 显示 X/Y轴标题
    if (obj.type) {
      // X/Y交叉时 显示 X/Y轴标题
      if (isCross) {
        // 设置X轴标题
        if (xShow) {
          if (yName !== '') {
            config.xAxis[0].name = yName
          } else {
            for (let i = 0; i < Xlength; i++) {
              let mulUnits = metricList[i].mulUnits
              let name
              if (mulUnits.length > 0) {
                name = mulUnits[0].unitNm     // 取指标单位
              }
              config.xAxis[i].name = name
            }
          }
        }
        // 设置Y轴标题
        if (yShow) {
          if (xName !== '') {
            config.yAxis[0].name = xName
          } else {
            for (let i = 0; i < Ylength; i++) {
              let name = dimList[0].dimName
              if (name.length > 6) {
                name = name.substring(0, 6) + '...'
              }
              config.yAxis[i].name = name
            }
          }
        }
      } else {
        // X/Y不交叉时 显示 X/Y轴标题
        if (xShow) {
          if (xName !== '') {
            config.xAxis[0].name = xName
          } else {
            for (let i = 0; i < Xlength; i++) {
              let name = dimList[i].dimName
              if (name.length > 10) {
                name = name.substring(0, 10) + '...'
              }
              config.xAxis[i].name = name
            }
          }
        }
        if (yShow) {
          if (yName !== '') {
            config.yAxis[0].name = yName
          } else {
            for (let i = 0; i < Ylength; i++) {
              let mulUnits = metricList[i].mulUnits
              let name
              if (mulUnits.length > 0) {
                name = mulUnits[0].unitNm     // 取指标单位
              }
              config.yAxis[i].name = name
            }
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
    // 位置设置同步
    this.commit('setChart', {index: obj.index})

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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 折线图轴标题名称配置
  modifyXAxisTitleShow (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let xShow = false

    // 是否显示X轴
    if (config.xAxis && config.xAxis.length > 0) {
      xShow = config.xAxis[0].axisLabel.show
    }

    this.commit('setXname', {
      index: obj.index,
      value: obj.type
    })

    if (xShow) {
      config.xAxis[0].name = obj.type
    }

    // 位置设置同步
    this.commit('setChart', {index: obj.index})

    if (obj.statue) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      operate.forEach((item, index) => {
        if (item.name === obj.record.name && item.optionVal.type === obj.record.optionVal.type) {
          item.optionVal = obj.record.optionVal
          find = true
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
      }
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 折线图轴标题名称配置
  modifyYAxisTitleShow (state, obj) {
    let yShow = false
    let config = state.chartsOption[obj.index].feature.styleConfig.config

    // 是否显示Y轴
    if (config.yAxis && config.yAxis.length > 0) {
      yShow = config.yAxis[0].axisLabel.show
    }
    
    this.commit('setYname', {
      index: obj.index,
      value: obj.type
    })

    if (yShow) {
      config.yAxis[0].name = obj.type
    }

    // 位置设置同步
    this.commit('setChart', {index: obj.index})

    if (obj.statue) {
      // 保存操作记录
      let operate = state.chartsOption[obj.index].feature.styleConfig.config.operate
      let find = false
      operate.forEach((item, index) => {
        if (item.name === obj.record.name && item.optionVal.type === obj.record.optionVal.type) {
          item.optionVal = obj.record.optionVal
          find = true
        }
      })
      if (!find) {
        state.chartsOption[obj.index].feature.styleConfig.config.operate.push(obj.record)
      }
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 折线图双Y轴
  showDoubleY(state, obj) {
    // 最后一个指标参照第二个Y轴
    let length = state.chartsOption[obj.index].feature.styleConfig.config.series.length

    // 不满足俩个指标时  不做任何处理
    if (length !== 2) {
      return false
    }

    if (obj.type) {
      let Ydata = state.chartsOption[obj.index].feature.styleConfig.config.yAxis[0]
      state.chartsOption[obj.index].feature.styleConfig.config.yAxis.push(Ydata)
      if (length > 1) {
        state.chartsOption[obj.index].feature.styleConfig.config.series[length-1].yAxisIndex = 1
      }
    } else {
      let yAxisArr = state.chartsOption[obj.index].feature.styleConfig.config.yAxis
      state.chartsOption[obj.index].feature.styleConfig.config.yAxis = yAxisArr.splice(length-1, 1)
      state.chartsOption[obj.index].feature.styleConfig.config.series[length-1].yAxisIndex = 0
    }

    this.commit('setChart', {index: obj.index})
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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 折线图与柱状图之间切换
  switchType(state, obj) {

    let series = state.chartsOption[obj.index].feature.styleConfig.config.series
    let length = series.length

    // 不满足俩个指标时  不做任何处理
    if (length !== 2) {
      return false
    }

    // 俩个指标时 切换为为柱状图
    if (length === 2 && obj.type) {
      series[1].type = 'bar'
      state.chartsOption[obj.index].feature.styleConfig.config.legend.data[1].icon = 'rect'
      // 设置柱状图最大宽度尺寸
      series[1].barMaxWidth = 50
    } else {
      series[1].type = 'line'
      state.chartsOption[obj.index].feature.styleConfig.config.legend.data[1].icon = 'line'
      delete series[1].barMaxWidth
    }

    state.chartsOption[obj.index].feature.styleConfig.config.series = series

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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 是否显示X轴
  switchXshow (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let length = config.xAxis.length
    let isCross = false

    // 当前是否存在X/Y轴交换行为
    if (config.yAxis[0].type === 'category' && config.xAxis[0].type === 'value') {
      isCross = true
    }

    // 双X轴时 切换所有的Y轴样式
    for(let i = 0; i < length; i++) {
      config.xAxis[i].axisLabel.show = obj.type
      // 横向时 X轴已经是数值轴，数值轴默认不显示axisLine
      if (!isCross) {
        config.xAxis[i].axisLine.show = obj.type
      }
    }

    // 不显示Y轴时 && 轴标题是选中状态 => 去掉轴标题
    if (!obj.type && config.isTitle) {
      this.commit('setXAxisTitile', {
        index: obj.index,
        type: false
      })
    }

    // 显示X轴时 && 轴标题是选中状态 => 重新显示轴标题
    if (obj.type && config.isTitle) {
      this.commit('setXAxisTitile', {
        index: obj.index,
        type: true
      })
    }

    // 同步位置
    this.commit('setChart', {index: obj.index})

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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 是否显示Y轴
  switchYshow (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let length = config.yAxis.length
    let isCross = false

    // 当前是否存在X/Y轴交换行为
    if (config.yAxis[0].type === 'category' && config.xAxis[0].type === 'value') {
      isCross = true
    }

    // 双Y轴时 切换所有的Y轴样式
    for(let i = 0; i < length; i++) {
      config.yAxis[i].axisLabel.show = obj.type
      // 横向时 Y轴已经是类目轴，类目轴默认显示axisLine，所以要同步
      if (isCross) {
        config.yAxis[i].axisLine.show = obj.type
      }
    }

    // 不显示Y轴时 && 轴标题是选中状态 => 去掉轴标题
    if (!obj.type && config.isTitle) {
      this.commit('setYAxisTitile', {
        index: obj.index,
        type: false,
        statue: false      
      })
    }

    // 显示Y轴时 && 轴标题是选中状态 => 重新显示轴标题
    if (obj.type && config.isTitle) {
      this.commit('setYAxisTitile', {
        index: obj.index,
        type: true,
        statue: false
      })
    }

    // 同步位置
    this.commit('setChart', {index: obj.index})

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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 切换X轴显示状态时 对轴标题的显示操作
  setXAxisTitile (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    // let metricList = state.chartsOption[obj.index].feature.metricList
    let metricList = state.chartsOption[obj.index].feature.metricListFlat
    let dimList = state.chartsOption[obj.index].feature.dimList
    let Xlength = config.xAxis.length
    let Ylength = config.yAxis.length
    let isCross = false
    let val = config.positionName
    let xName = config.xName
    let yName = config.yName

    // 当前是否存在X/Y轴交换行为
    if (config.yAxis[0].type === 'category' && config.xAxis[0].type === 'value') {
      isCross = true
    }

    // 显示 X/Y轴标题
    if (obj.type) {
      // X/Y交叉时 显示 X/Y轴标题
      if (isCross) {
        if (yName !== '') {
          config.xAxis[0].name = yName
        } else {
          for (let i = 0; i < Xlength; i++) {
            let mulUnits = metricList[i].mulUnits
            let name
            if (mulUnits.length > 0) {
              name = mulUnits[0].unitNm     // 取指标单位
            }
            config.xAxis[i].name = name
          }
        }
      } else {
        // X/Y不交叉时 显示 X/Y轴标题
        if (xName !== '') {
          config.xAxis[0].name = xName
        } else {
          for (let i = 0; i < Xlength; i++) {
            let name = dimList[i].dimName
            if (name.length > 10) {
              name = name.substring(0, 10) + '...'
            }
            config.xAxis[i].name = name
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
    }

  },
  // 切换Y轴显示状态时 对轴标题的显示操作
  setYAxisTitile (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let metricList = state.chartsOption[obj.index].feature.metricListFlat
    let dimList = state.chartsOption[obj.index].feature.dimList
    let Xlength = config.xAxis.length
    let Ylength = config.yAxis.length
    let isCross = false
    let val = config.positionName
    let xName = config.xName
    let yName = config.yName

    // 当前是否存在X/Y轴交换行为
    if (config.yAxis[0].type === 'category' && config.xAxis[0].type === 'value') {
      isCross = true
    }

    // 显示 X/Y轴标题
    if (obj.type) {
      // X/Y交叉时 显示 X/Y轴标题
      if (isCross) {
        if (xName !== '') {
          config.yAxis[0].name = xName
        } else {
          for (let i = 0; i < Ylength; i++) {
            let name = dimList[0].dimName
            if (name.length > 6) {
              name = name.substring(0, 6) + '...'
            }
            config.yAxis[i].name = name
          }
        }
      } else {
        // X/Y不交叉时 显示 X/Y轴标题
        if (yName !== '') {
          config.yAxis[0].name = yName
        } else {
          for (let i = 0; i < Ylength; i++) {
            let mulUnits = metricList[i].mulUnits
            let name
            if (mulUnits.length > 0) {
              name = mulUnits[0].unitNm     // 取指标单位
            }
            config.yAxis[i].name = name
          }
        }
      }
    } else {
      for(let i = 0; i < Ylength; i++) {
        if (config.yAxis[i].hasOwnProperty('name')) {
          delete config.yAxis[i].name
        }
      }
    }
  },
  // 切换折线图样式为曲线
  switchSmooth (state, obj) {
    let length = state.chartsOption[obj.index].feature.styleConfig.config.series.length

    // 当前图形样式type 为line时 才可切换为曲线
    for(let i = 0; i < length; i++) {
      state.chartsOption[obj.index].feature.styleConfig.config.series[i].smooth = obj.type
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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 是否显示面积图
  switchArea (state, obj) {
    let length = state.chartsOption[obj.index].feature.styleConfig.config.series.length

    // 柱状图时不可切换为面积图
    if (obj.type) {
      for(let i = 0; i < length; i++) {
        if (state.chartsOption[obj.index].feature.styleConfig.config.series[i].type === 'line') {
          state.chartsOption[obj.index].feature.styleConfig.config.series[i].areaStyle = {
            opacity: 0.1
          }
        }
      }
    } else {
      for(let i = 0; i < length; i++) {
        if (state.chartsOption[obj.index].feature.styleConfig.config.series[i].type === 'line') {
          delete state.chartsOption[obj.index].feature.styleConfig.config.series[i].areaStyle
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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 是否显示tooltip
  showTootip (state, obj) {
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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 提示框指示器类型
  showTootipType (state, obj) {
    if (obj.type) {
      state.chartsOption[obj.index].feature.styleConfig.config.tooltip.axisPointer.type = 'shadow'
    } else {
      state.chartsOption[obj.index].feature.styleConfig.config.tooltip.axisPointer.type = 'line'
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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 图例组件显示的切换
  switchLegend (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.legend.show = obj.type
    this.commit('setChart', {index: obj.index})
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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 切换为table表
  switchTable (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.switchTable = obj.type

    if (obj.statue) {
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
    }
  },
  // 是否显示数值
  switchValue (state, obj) {
    let series = state.chartsOption[obj.index].feature.styleConfig.config.series
    let length = series.length

    for (let i = 0; i < length; i++) {
      series[i].label.show = obj.type
    }

    this.commit('resetValuePositon', {index: obj.index})

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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 优化数值的显示位置
  resetValuePositon (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let series = state.chartsOption[obj.index].feature.styleConfig.config.series
    let isValue = false
    let isCross = false
    // 是否显示数值
    if ((config.series.length > 0) && config.series[0].label.show) {
      isValue =  true
    } else {
      return
    }

    // 变化后是否横向
    if ((config.yAxis.length > 0) && (config.yAxis[0].type === 'category')) {
      isCross =  true
    }
    // 位置调整
    if (isCross) {
      series.map(item => item.label.position = 'right')
    } else {
      series.map(item => item.label.position = 'top')
    }
  },
  // 是否显示滑块(时间轴)
  switchSlider (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.dataZoom.show = obj.type
    // 位置设置同步
    this.commit('setChart', {index: obj.index})
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
      bus.$emit('updateOption', {
        index: obj.index,
        config: state.chartsOption[obj.index].feature.styleConfig.config
      })
    }
  },
  // 是否自定义切换时间
  changeTimeSet (state, obj) {
    let chart = state.chartsOption[obj.index]
    let isTime = chart.feature.dimList[0].dimCode === 'dasp_date' ? true : false
    // 时间维度时走正常流程，非时间维度设回默认值
    if (isTime) {
      state.chartsOption[obj.index].feature.styleConfig.config.isTimeSet = obj.type
    } else {
      // 进入的场景 => 先前的时间维度启用了自定义时间切换功能，再切换其他维度后进行数据更新
      state.chartsOption[obj.index].feature.styleConfig.config.isTimeSet = false
      //自主清空时 保存操作记录
      obj.statue = true
      obj.record = {
        name: 'changeTimeSet',
        optionVal: false
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
    }
  },
  // 设置查询时间
  setNumberTime (state, obj) {
    let chart = state.chartsOption[obj.index]
    let isTime = chart.feature.dimList[0].dimCode === 'dasp_date' ? true : false
    // 时间维度时走正常流程，非时间维度设回默认值
    if (isTime) {
      state.chartsOption[obj.index].feature.styleConfig.config.numberTime = obj.type
    } else {
      // 进入的场景 => 先前的时间维度启用了自定义时间切换功能，再切换其他维度后进行数据更新
      state.chartsOption[obj.index].feature.styleConfig.config.numberTime = 0
      //自主清空时 保存操作记录
      obj.statue = true
      obj.record = {
        name: 'setNumberTime',
        optionVal: 0
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
    }
  },
  // 自定义X轴标题
  setXname (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.xName = obj.value
  },
  // 自定义Y轴标题
  setYname (state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.yName = obj.value
  },
  // 汇总查询
  setValueSum (state, obj) {
    let chart = state.chartsOption[obj.index]
    let isTime = chart.feature.dimList[0].dimCode === 'dasp_date' ? true : false    
    // console.log(!parseInt(chart.sortByWhich) && !parseInt(chart.sortType) && isTime)
    // 非时间维度、维度下的升序时,不启用
    if (!parseInt(chart.sortByWhich) && !parseInt(chart.sortType) && isTime) {
      state.chartsOption[obj.index].feature.styleConfig.config.isValueSum = obj.type
    } else {
      state.chartsOption[obj.index].feature.styleConfig.config.isValueSum = false
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
    }    
  }
}
