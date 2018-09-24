import bus from '../../utils/eventBus'
const showNumFamtter = function (name, totalNum) {
  const handeName = name.length > 6 ? name.substr(0, 6) + "..." : name
  const handelTotalNum = totalNum.length > 21 ? totalNum.substr(0, 20) + "..." : totalNum
  return '{a|' + handeName + '}' + '\n' + '{a|' + handelTotalNum + '}'
}
const setLabel = function (index, params) {
  let name  = params.name
  name = name.indexOf('###')!==-1 ? name.replace('###','_') : name
  switch (index) {
    case '0':
      return name + ',  ' + params.percent + '%'
      break
    case '1':
      return name
      break
    case '2':
      return name + ',' + params.data.value
      break
    case '3':
      return name + ',' + params.data.value + ',' + params.percent + '%'
      break
    case '4':
      return name + ',  ' + params.percent + '%'
  }
}
const getPieXPosition = function () {
  const legendShow = this.styleConfig.config.legend.show
  const legendPosition = this.styleConfig.config.legendPosition
  const legendWidth = this.styleConfig.config.legendWidth
  const legendHeight = this.styleConfig.config.legendHeight
  // const defaultRadius = this.styleConfig.config.defaultRadius
  const height = this.option.h * containerInit.rowHeight + (this.option.h - 1) * containerInit.margin[0] - 40 - 10
  const width = getComputedStyle(document.getElementById("pieChart")).width.split("px")[0] - 10
  let restWidth
  let xWidth
  let radius
  let xPercent
  let yPercent
  let obj = {}
  if (legendShow) {
    if (legendPosition === 'right') {
      restWidth = (width - legendWidth)
      xWidth = restWidth / width * 100
      xPercent = Number(xWidth / 2) + '%'
      yPercent = '50%'
    } else if (legendPosition === 'left') {
      restWidth = (width - legendWidth)
      xPercent = (restWidth / 2 + legendWidth) / width
      yPercent = '50%'
    } else if (legendPosition === 'top') {
      xPercent = '50%'
      yPercent = ((height - legendHeight) / 2) / height
    } else {
      xPercent = '50%'
      yPercent = ((height - legendHeight) / 2 + legendHeight) / height
    }
  } else {
    xPercent = '50%'
    yPercent = '50%'
  }
  obj.xPercent = xPercent
  obj.yPercent = yPercent
  return obj
}
export default {
  editMidOptionPie(state, obj) {
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
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  editMidOptionSeries(state, obj) {
    if (obj.toDelete && obj.toDelete.length > 0) {
      obj.toDelete.map((item, index) => {
        delete state.chartsOption[obj.index].feature.styleConfig.config[obj.name][item]
      })
    }
    if (obj.toEdit) {
      if (Array.isArray(obj.toEdit)) {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((seriesItem, seriesIndex) => {
          obj.toEdit.map((item, index) => {
            seriesItem[obj.name][item] = obj.value[index]
          })
        })
      } else {
        state.chartsOption[obj.index].feature.styleConfig.config.series.map((seriesItem, seriesIndex) => {
          seriesItem[obj.name][obj.toEdit] = obj.value
        })
      }
    } else {
      state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        item[obj.name] = obj.value
      })
    }
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  editMidOptionPaved(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const isNumTotal = config.isNumTotal
    if (isNumTotal) {
      config.series.map((item, index) => {
        item.data.map((itemData, dattaIndex) => {
          delete itemData.label
        })
      })
    }
    state.chartsOption[obj.index].feature.styleConfig.config.series = obj.seriesArray
    state.chartsOption[obj.index].feature.styleConfig.config.legend.data = obj.legendArray
    state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
      item.itemStyle = {
        borderColor: '#fff',
        borderWidth: 2
      }
    })
    const labelStyle = config.labelStyle
    let isShowLabel = true
    if (labelStyle === '4') {
      isShowLabel = false
    }
    const label = {
      show: isShowLabel,
      color: '#333',
      rich: {
        a: {
          color: '#666666',
          lineHeight: 20,
          align: 'center',
          padding: [0, 0, 20, 0],
          fontSize: 12,

        }
      },
      formatter: params => {
        let splitParams = ''
        if (params.name.indexOf('###') !== -1) {
          let dimName = params.name.split('###')[1]
          splitParams = dimName.length > 6
            ? dimName.substr(0, 6) + '...'
            : dimName
        } else {
          splitParams = params.name.length > 6
            ? params.name.substr(0, 6) + '...'
            : params.name
        }
        params.name = splitParams
        let value = setLabel(config.labelStyle, params);
        value = value.split(',')
        const text1 = value[0].length > 7 ? value[0].substr(0, 7) + '...' : value[0]
        const text2 = value[1] ? value[1] : ""
        const text3 = value[2] ? ', ' + value[2] : ""
        return '{a|' + text1 + '}' + '\n' + '{a|' + text2 + text3 + '}'
      }
    }
    if (obj.type) {
      config.labelLine = false
      config.title.show = false
      config.isNumTotal = false
      if (isNumTotal) {
        config.series.map((item, index) => {
          item.data[0].label = label
        })
      } else {
        config.series.map((item, index) => {
          item.data.map((itemData, dattaIndex) => {
            if (dattaIndex === 0) {
              itemData.label = {
                show: isShowLabel,
                color: '#333',
                rich: {
                  a: {
                    color: '#666666',
                    lineHeight: 20,
                    align: 'center',
                    padding: [0, 0, 20, 0],
                    fontSize: 12,

                  }
                },
                formatter: params => {
                  let splitParams = ''
                  if (params.name.indexOf('###') !== -1) {
                    let dimName = params.name.split('###')[1]
                    splitParams = dimName.length > 6
                      ? dimName.substr(0, 6) + '...'
                      : dimName
                  } else {
                    splitParams = params.name.length > 6
                      ? params.name.substr(0, 6) + '...'
                      : params.name
                  }
                  params.name = splitParams
                  let value = setLabel(config.labelStyle, params);
                  value = value.split(',')
                  const text1 = value[0].length > 7 ? value[0].substr(0, 7) + '...' : value[0]
                  const text2 = value[1] ? value[1] : ""
                  const text3 = value[2] ? ', ' + value[2] : ""
                  return '{a|' + text1 + '}' + '\n' + '{a|' + text2 + text3 + '}'
                }
              }
            } else {
              itemData.label = {
                show: false,
                color: '#333',
                formatter: params => {
                  let splitParams = ''
                  if (params.name.indexOf('###') !== -1) {
                    let dimName = params.name.split('###')[1]
                    splitParams = dimName.length > 6
                      ? dimName.substr(0, 6) + '...'
                      : dimName
                  } else {
                    splitParams = params.name.length > 6
                      ? params.name.substr(0, 6) + '...'
                      : params.name
                  }
                  params.name = splitParams
                  const value = setLabel(config.labelStyle, params);
                  return value;
                }
              }
            }
          })
        })
      }
    } else {
      config.series.map((item, index) => {
        item.label = {
          show: isShowLabel,
          color: '#333',
          formatter: params => {
            let splitParams = ''
            if (params.name.indexOf('###') !== -1) {
              let dimName = params.name.split('###')[1]
              splitParams = dimName.length > 6
                ? dimName.substr(0, 6) + '...'
                : dimName
            } else {
              splitParams = params.name.length > 6
                ? params.name.substr(0, 6) + '...'
                : params.name
            }
            params.name = splitParams
            const value = setLabel(config.labelStyle, params);
            return value;
          }
        }
      })
      const highLight = config.highLight
      if (highLight<=0) {
        config.series.map((item, index) => {
          item.data.map((itemData, dattaIndex) => {
            delete itemData.label
          })
        })
      }
    }
    // config.series.map((item, index) => {
    //   item.data.map((itemData, dattaIndex) => {
    //     delete itemData.label
    //   })
    // })
    //  if (isNumTotal) {
    //   const metricList = state.chartsOption[obj.index].feature.metricList
    //   const totalNum = config.data.totalNum
    //   const metricName = metricList[0].metricName
    //   const label = {
    //     show: true,
    //     position: 'center',
    //     rich: {
    //        a: {
    //             color: '#333',
    //             lineHeight: 40,
    //             align: 'center',
    //             padding:[10, 0, 0, 0],
    //             fontSize: 12,

    //         }
    //     },
    //     formatter: showNumFamtter(metricName, totalNum)
    //   }
    //   const dataLength = config.series[0].data.length
    //   const position = Math.floor(dataLength/2)
    //   const dataLabel = {
    //     show: false,
    //     color: '#333'
    //   }
    //   config.series.map((item, index) => {
    //       item.label = label
    //       item.data.map((dataItem, index) => {
    //         if (index !== position) {
    //           dataItem.label = dataLabel
    //         } else {
    //           dataItem.label = {
    //             show: true,
    //             color: '#333',
    //             formatter: showNumFamtter(metricName, totalNum)
    //           }
    //         }
    //       })
    //   })
    // }
    // }
    // if (obj.type) {
    //  state.chartsOption[obj.index].feature.styleConfig.config.isDisabledRadius = true
    //  state.chartsOption[obj.index].feature.styleConfig.config.isDisabledLegend = true
    // } else {
    //  state.chartsOption[obj.index].feature.styleConfig.config.isDisabledRadius = false
    //  state.chartsOption[obj.index].feature.styleConfig.config.isDisabledLegend = false
    // }
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeLight(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.series[0].data = obj.value
    // 当不是平铺的情况  图例 和 半径 恢复功能
    // state.chartsOption[obj.index].feature.styleConfig.config.isDisabledRadius = false
    // state.chartsOption[obj.index].feature.styleConfig.config.isDisabledLegend = false
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  saveHighLightData(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.highLightData = obj.highLightData
    state.chartsOption[obj.index].feature.styleConfig.config.series[0].data = obj.highLightData
  },
  changePieLengend(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const isLengendShow = config.legend.show
    const title = config.title
    const isShowTitle = config.title.show
    const showrModel = config.showrModel
    const legend = config.legend
    const vertical = 'vertical'
    const horizontal = 'horizontal'
    const paveDisplay = config.pavedDisplay

    // if (paveDisplay !== true) {
    //   config.series.map((item, index) => {
    //     item.center = [obj.xPercent, obj.yPercent]
    //   })
    // }
    if (showrModel === '0') {
      config.series[0].radius = obj.radius
      config.series.map((item, index) => {
        item.center = [obj.xPercent, obj.yPercent]
      })
    } else if (showrModel === '1' && paveDisplay !== true) {
      config.series[0].radius = [obj.innerRadius, obj.radius]
      config.series.map((item, index) => {
        item.center = [obj.xPercent, obj.yPercent]
      })
    } else if (showrModel === '2') {
      config.series[0].radius = [0, obj.innerRadius - 30]
      config.series[1].radius = [obj.innerRadius, obj.radius]
      config.series.map((item, index) => {
        item.center = [obj.xPercent, obj.yPercent]
      })
    }
    if (isShowTitle) {
      title.bottom = 24
      title.left = obj.titleLeft
    }
    if (isLengendShow) {
      if (obj.type === 'left') {
        delete legend.right
        delete legend.bottom
        delete legend.height
        legend.width = 100
        legend.left = '16'
        legend.orient = vertical
        legend.top = '24'
      } else if (obj.type === 'top') {
        delete legend.bottom
        delete legend.width
        delete legend.right
        delete legend.left
        legend.orient = horizontal
        legend.top = '24'
      } else if (obj.type === 'right') {
        delete legend.left
        delete legend.bottom
        delete legend.height
        legend.width = 100
        legend.right = '16'
        legend.orient = vertical
        legend.top = '24'
      } else {
        delete legend.top
        delete legend.width
        if (isShowTitle) {
          title.bottom = 54
        }
        delete legend.right
        legend.bottom = '24'
        legend.orient = horizontal
      }
    } else {
      if (isShowTitle) {
        title.bottom = 24
      }
    }
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changePieLabel(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const series = config.series
    const showrModel = config.showrModel
    const highLight = config.highLight
    const newObj = {}
    newObj.normal = {}
    newObj.normal.show = false
    const pavedDisplay = config.pavedDisplay
    let isShowLable = true
    const labelStyle = config.labelStyle
    if (labelStyle === '4') {
      isShowLable = false
    }

    // 平铺展示
    // 在判断平铺展示前先判断是环形饼图
    if (pavedDisplay && showrModel === '1') {
      // 初始化为了防止点击显示总值
      config.series.map((item, index) => {
        item.data.map((itemData, dattaIndex) => {
          if (dattaIndex === 0) {
            itemData.label = {
              show: isShowLable,
              color: '#333',
              rich: {
                a: {
                  color: '#666666',
                  lineHeight: 20,
                  align: 'center',
                  padding: [0, 0, 20, 0],
                  fontSize: 12
                }
              },
              formatter: params => {
                let splitParams = ''
                if (params.name.indexOf('###') !== -1) {
                  let dimName = params.name.split('###')[1]
                  splitParams = dimName.length > 6
                    ? dimName.substr(0, 6) + '...'
                    : dimName
                } else {
                  splitParams = params.name.length > 6
                    ? params.name.substr(0, 6) + '...'
                    : params.name
                }
                params.name = splitParams
                let value = setLabel(config.labelStyle, params);
                value = value.split(',')
                const text1 = value[0].length > 7 ? value[0].substr(0, 7) + '...' : value[0]
                const text2 = value[1] ? value[1] : ""
                const text3 = value[2] ? ', ' + value[2] : ""
                return '{a|' + text1 + '}' + '\n' + '{a|' + text2 + text3 + '}'
              }
            }
          } else {
            itemData.label = {
              show: false,
              color: '#333',
              formatter: params => {
                let splitParams = ''
                if (params.name.indexOf('###') !== -1) {
                  let dimName = params.name.split('###')[1]
                  splitParams = dimName.length > 6
                    ? dimName.substr(0, 6) + '...'
                    : dimName
                } else {
                  splitParams = params.name.length > 6
                    ? params.name.substr(0, 6) + '...'
                    : params.name
                }
                params.name = splitParams
                const value = setLabel(config.labelStyle, params);
                return value;
              }
            }
          }
        })
      })
    } else {
      if (highLight.length <= 0) {
        series.map((item, index) => {
          item.data.map((itemData, dattaIndex) => {
            delete itemData.label
          })
        })
      }
    }
    if (obj.type === '4' && showrModel === '0') {
      config.labelLine = false
      series.forEach(item => item.label.show = false)
    } else if (obj.type === '4' && showrModel !== '0' && highLight.length <= 0) {
      config.labelLine = false
      series.map((item, index) => {
        // item.radius = obj.radius
        item.labelLine = newObj
        item.label.show = false
        item.data.map((itemData, dattaIndex) => {
          itemData.label = {
            show: false,
            color: '#333',
            formatter: params => {
              let splitParams = ''
              if (params.name.indexOf('###') !== -1) {
                let dimName = params.name.split('###')[1]
                splitParams = dimName.length > 6
                  ? dimName.substr(0, 6) + '...'
                  : dimName
              } else {
                splitParams = params.name.length > 6
                  ? params.name.substr(0, 6) + '...'
                  : params.name
              }
              params.name = splitParams
              const value = setLabel(config.labelStyle, params);
              return value;
            }
          }
        })
      })
    } else if (obj.type === '4' && highLight.length > 0 ) {
      series.map((item, index) => {
        item.label.show = false
        item.data.forEach(dataItem => {
          if (dataItem.label && highLight.includes(dataItem.name)) dataItem.label.show = false
        })
      })
    } else {
      config.labelStyle = obj.type
      if (showrModel === '2') {
        series[0].label.show = false
        series[1].label.show = true
      } else {
        series.map((item, index) => {
          item.label.show = true
        })
        if (highLight.length > 0) {
          series[0].data.forEach(dataItem => {
            if (dataItem.label && highLight.includes(dataItem.name)) dataItem.label.show = true
          })
        }
      }
    }
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  // 初始化标准饼图
  initNormalPie(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const isNumTotal = config.isNumTotal
    state.chartsOption[obj.index].feature.styleConfig.config.series = obj.value
    state.chartsOption[obj.index].feature.styleConfig.config.legend.data = obj.legendArray

    if (obj.labelStyle === '4') {
      state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
        item.label.show = false
      })
    }

    config.series.map((item, index) => {
      item.data.map((itemData, dattaIndex) => {
        delete itemData.label
      })
    })
    // if (isNumTotal) {
    //   if (obj.labelStyle !== '4') {
    //     state.chartsOption[obj.index].feature.styleConfig.config.series.map((item, index) => {
    //       item.data.map((dataItem, dattaIndex) => {
    //         dataItem.label = {
    //           show: true
    //         }
    //       })
    //     })
    //   }
    // }
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  // 初始化环形饼图
  initCirclePie(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    // const currentRadius = config.radius
    const pavedDisplay = config.pavedDisplay
    const isNumTotal = config.isNumTotal
    const isShowTitle = config.title.show
    if (isShowTitle) {
      config.title.left = obj.titleLeft
    }
    // const innerRadius = (Number(currentRadius.split('%')[0]) - 10) + '%'
    config.series.map((item, index) => {
      if (!pavedDisplay) {
        item.radius = [obj.innerRadius, obj.radius]
      }
      item.labelLine = obj.labelLine
      item.itemStyle = obj.itemStyle
      if (obj.labelStyle === '4') {
        item.label.show = false
      }
      if (isNumTotal) {
        let totalNum = config.data.totalNum
        // totalNum = totalNum.toFixed(4)
        const metricList = state.chartsOption[obj.index].feature.metricList
        // let metricName = metricList[0].metricName
        let metricName = config.title.text
        if (metricList.length > 1) {
          metricName = '总值'
        }
        const label = {
          show: true,
          position: 'center',
          rich: {
            a: {
              color: '#666666',
              lineHeight: 20,
              align: 'center',
              padding: [10, 0, 0, 0],
              fontSize: 14,

            }
          },
          formatter: showNumFamtter(metricName, totalNum)
        }
        const dataLength = config.series[0].data.length
        const position = Math.floor(dataLength / 2)
        const dataLabel = {
          show: false
        }
        item.label = label
        item.data.map((dataItem, index) => {
          if (index !== position) {
            dataItem.label = dataLabel
          }
        })
      }
    })
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  // 保存平铺数据
  saveMidOptionPaved(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    config.labelLine = false
    config.title.show = false
    state.chartsOption[obj.index].feature.styleConfig.config.series = obj.seriesArray
    state.chartsOption[obj.index].feature.styleConfig.config.legend.data = obj.legendArray
  },
  // saveHighLightCircle(state, obj) {
  //  const config = state.chartsOption[obj.index].feature.styleConfig.config
  //  config.highLightData = obj.highLightData
  // },
  initRadius(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    config.series.map((item, index) => {
      item.radius = ['40%', '50%']
    })
  },
  saveOperate(state, obj) {
    if (obj.state) {
      const config = state.chartsOption[obj.index].feature.styleConfig.config
      config.operate.map((item, index) => {
        if (item.methods === obj.methods) {
          config.operate.splice(index, 1)
        }
      })
      if (obj.type === 'add') {
        config.operate.push(obj)
      }
    }
  },
  // 保存处理数据
  saveHandelData(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.data = obj.handelData
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  // 平铺的时候置灰图例
  setLegendDisabled(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.data = obj.handelData
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeLabelLine(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const labelStyle = config.labelStyle
    const showrModel = config.showrModel
    let labelObj = {
      normal: {
        show: obj.type,
        lineStyle: {
          color: '#979797'
        },
        length: 0,
        length2: 30
      }
    }
    if (labelStyle === '4') {
      labelObj.normal.show = false
      // config.labelLine = false
    }
    // if (showrModel === '1') {
    //   labelObj.normal.length = 10
    //   labelObj.normal.length2 = 30
    // }
    config.series.map((item, index) => {
      item.labelLine = labelObj
    })
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  changeRadius(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    // const innerValue = Number(obj.type)
    // const innerRadius = innerValue +'%'
    config.series.map((item, index) => {
      item.radius = [obj.innerRadius, obj.radius]
    })
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  showNum(state, obj) {
    const metricList = state.chartsOption[obj.index].feature.metricList
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const isShowTitle = config.title.show
    if (isShowTitle) {
      config.title.left = obj.titleLeft
    }
    const totalNum = config.data.totalNum
    // let metricName = metricList[0].metricName
    let metricName = config.title.text
    if (metricList.length > 1) {
      metricName = '总值'
    }
    
    const label = {
      show: true,
      position: 'center',
      rich: {
        a: {
          color: '#333',
          lineHeight: 20,
          align: 'center',
          padding: [6, 0, 0, 0],
          fontSize: 14,

        }
      },
      formatter: showNumFamtter(metricName, totalNum)
    }
    const dataLength = config.series[0].data.length
    const position = Math.floor(dataLength / 2)
    const dataLabel = {
      show: false,
      color: '#333'
    }
    // const currentRadius = config.radius
    // const innerRadius = (Number(currentRadius.split('%')[0]) - 10) + '%'
    if (obj.type) {
      config.series.map((item, index) => {
        item.radius = [obj.innerRadius, obj.radius]
        item.center = [obj.xPercent, obj.yPercent]
        item.label = label
        item.data.map((dataItem, index) => {
          if (index !== position) {
            dataItem.label = dataLabel
          } else {
            dataItem.label = {
              show: true,
              color: '#333',
              formatter: showNumFamtter(metricName, totalNum)
            }
          }
        })
      })
    } else {
      //  const circleLabel = {
      //    label: {
      //        show: true,
      //        color: '#333',
      //        formatter: params => {
      //          const value = setLabel(config.labelStyle, params);
      //          return value;
      //        }
      //    }
      // }
      const dataCircleLabel = {
        show: true,
        color: '#333',
        formatter: params => {
          let splitParams = ''
          if (params.name.indexOf('###') !== -1) {
            let dimName = params.name.split('###')[1]
            splitParams = dimName.length > 6
              ? dimName.substr(0, 6) + '...'
              : dimName
          } else {
            splitParams = params.name.length > 6
              ? params.name.substr(0, 6) + '...'
              : params.name
          }
          params.name = splitParams
          const value = setLabel(config.labelStyle, params);
          return value;
        }
      }
      const labelStyle = config.labelStyle
      let isShowLabel = true
      if (labelStyle === '4') {
        isShowLabel = false
      }
      config.series.map((item, index) => {
        item.label = {
          show: isShowLabel,
          color: '#333',
          formatter: params => {
            let splitParams = ''
            if (params.name.indexOf('###') !== -1) {
              let dimName = params.name.split('###')[1]
              splitParams = dimName.length > 6
                ? dimName.substr(0, 6) + '...'
                : dimName
            } else {
              splitParams = params.name.length > 6
                ? params.name.substr(0, 6) + '...'
                : params.name
            }
            params.name = splitParams
            const value = setLabel(config.labelStyle, params);
            return value;
          }
        }
        item.data.map((dataItem, index) => {
          delete dataItem.label
          // dataItem.label = dataCircleLabel
        })
      })
    }
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  },
  setPieXPosition(state, obj) {
    const config = state.chartsOption[obj.index].feature.styleConfig.config
    const showrModel = config.showrModel
    const isShowTitle = config.title.show
    if (isShowTitle) {
      config.title.left = obj.titleLeft
    }
    if (showrModel === '0') {
      config.series.map((item, index) => {
        item.center = [obj.xPercent, obj.yPercent]
        item.radius = obj.radius
      })
    } else if (showrModel === '1') {
      config.series.map((item, index) => {
        item.center = [obj.xPercent, obj.yPercent]
        item.radius = [obj.innerRadius, obj.radius]
      })
    } else {
      config.series.map((item, index) => {
        item.center = [obj.xPercent, obj.yPercent]
      })
      config.series[0].radius = [0, obj.innerRadius - 30]
      config.series[1].radius = [obj.innerRadius, obj.radius]
    }
    bus.$emit('updateOptionPie', {
      index: obj.index,
      config: state.chartsOption[obj.index].feature.styleConfig.config
    })
  }
}
