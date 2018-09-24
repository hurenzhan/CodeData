import { wait } from '../../utils/utils'
import { containerInit } from '../../static/configData'
export default {
  methods: {
    changeLengend(val) {
      const piePosition = this.getPieXPosition()
      const xPercent = piePosition.xPercent
      const yPercent = piePosition.yPercent
      const radius = piePosition.radius
      const xPx = piePosition.xPx
      const yPX = piePosition.yPX
      const titleLeft = piePosition.titleLeft
      const innerRadius = piePosition.innerRadius
      this.$store.commit('changePieLengend', {
        index: this.index,
        type: val,
        xPercent,
        yPercent,
        radius,
        yPX,
        xPx,
        titleLeft,
        innerRadius
      })
    },
    changeModel(state) {
      const showrLabelLine = this.styleConfig.config.labelLine
      const val = this.styleConfig.config.showrModel
      const piePosition = this.getPieXPosition()
      const xPercent = piePosition.xPercent
      const yPercent = piePosition.yPercent
      const radius = piePosition.radius
      const innerRadius = piePosition.innerRadius
      const xPx = piePosition.xPx
      const yPX = piePosition.yPX
      const titleLeft = piePosition.titleLeft
      const labelStyle = this.styleConfig.config.labelStyle
      let isShowLabel = true
      if (labelStyle === '4') {
        isShowLabel = false
      }
      if (val === '0') {
        // this.isDisabledLegend = false
        const obj = {
          name: '',
          type: 'pie',
          radius: radius,
          hoverAnimation: true,
          legendHoverLink: false,
          center: [xPercent, yPercent],
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 0.25
          },
          data: this.seriesData.sort((a, b) => {
            return b.value - a.value;
          }), //  series.data重新排序
          label: {
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
              const value = this.setLabel(this.labelStyle, params);
              return value;
            }
          },
          labelLine: {
            normal: {
              show: showrLabelLine,
              lineStyle: {
                color: '#979797'
              },
              length: 0,
              length2: 30
            }
          }
        }
        const seriesArray = []
        seriesArray.push(obj)
        this.$store.commit('initNormalPie', {
          index: this.index,
          value: seriesArray,
          labelStyle: this.labelStyle,
          legendArray: this.legendData
        })
      } else {
        const pavedDisplay = this.styleConfig.config.pavedDisplay
        if (pavedDisplay) {
          const returnData = this.pavedDisplayS(this.highLight)
          const seriesArray = returnData.seriesArray
          const legendArray = returnData.legendArray
          this.$store.commit('saveMidOptionPaved', {
            index: this.index,
            seriesArray: seriesArray,
            legendArray: legendArray
          })
        } else if (this.highLight.length > 0) {
          const backData = this.highLightMethod(this.highLight)
          this.$store.commit('saveHighLightData', {
            index: this.index,
            highLightData: backData
          })
        }
        const obj = {
          normal: {
            show: showrLabelLine,
            lineStyle: {
              color: '#979797'
            },
            length: 0,
            length2: 30
          }
        }
        const itemStyleObj = {
          borderWidth: 2,
          borderColor: '#fff'
        }
        this.$store.commit('initCirclePie', {
          index: this.index,
          xPercent,
          yPercent,
          radius,
          innerRadius,
          xPx,
          yPX,
          titleLeft,
          labelLine: obj,
          itemStyle: itemStyleObj
        })
        //  this.$store.commit('saveOperate', {
        //  index: this.index,
        //  params: array,
        //  type: 'add',
        //  state: state,
        //  methods: 'changeModel'
        // })
      }
    },
    changeLight(state) {
      const array = this.styleConfig.config.highLight
      const backData = this.highLightMethod(array)
      const pavedDisplay = this.styleConfig.config.pavedDisplay
      this.$store.commit('saveHighLightData', {
        index: this.index,
        highLightData: backData
      })
      if (pavedDisplay) {
        const returnData = this.pavedDisplayS(array)
        const seriesArray = returnData.seriesArray
        const legendArray = returnData.legendArray
        this.$store.commit('editMidOptionPaved', {
          index: this.index,
          type: pavedDisplay,
          seriesArray: seriesArray,
          legendArray: legendArray
        })
      } else {
        this.$store.commit('changeLight', {
          index: this.index,
          value: backData
        })
      }
      this.$store.commit('saveOperate', {
        index: this.index,
        params: array,
        type: 'add',
        state: state,
        methods: 'changeLight'
      })
    },
    changeLabel(val) {
      const piePosition = this.getPieXPosition()
      this.$store.commit('changePieLabel', {
        index: this.index,
        type: val,
        radius: piePosition.radius
      })
    },
    changePavedDisplay(state) {
      const piePosition = this.getPieXPosition()
      const xPercent = piePosition.xPercent
      const yPercent = piePosition.yPercent
      const radius = piePosition.radius
      const xPx = piePosition.xPx
      const yPX = piePosition.yPX
      const titleLeft = piePosition.titleLeft
      const innerRadius = piePosition.innerRadius
      const val = this.styleConfig.config.pavedDisplay
      const highLightArray = this.styleConfig.config.highLight
      const data = this.seriesData
      if (val) {
        // await wait(10)
        const returnData = this.pavedDisplayS(highLightArray)
        const seriesArray = returnData.seriesArray
        const legendArray = returnData.legendArray
        this.$store.commit('editMidOptionPaved', {
          index: this.index,
          type: val,
          seriesArray: seriesArray,
          legendArray: legendArray
        })
        this.$store.commit('saveOperate', {
          index: this.index,
          type: 'add',
          state: state,
          params: val,
          methods: 'changePavedDisplay'
        })
      } else {
        const showLine = this.styleConfig.config.labelLine
        let isShowLable = true
        if (this.styleConfig.config.labelStyle === '4') {
          isShowLable = false
        }
        // const currentRadius = this.styleConfig.config.radius
        // const innerRadius = (Number(currentRadius.split('%')[0]) - 10) + '%'
        const obj = {
          name: '',
          type: 'pie',
          radius: [innerRadius, radius],
          hoverAnimation: true,
          legendHoverLink: false,
          center: [xPercent, yPercent],
          data: [],
          label: {
            show: isShowLable,
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
              const value = this.setLabel(this.labelStyle, params);
              return value
            }
          },
          // itemStyle: {
          //   borderColor: '#fff',
          //   borderWidth: 2
          // },
          labelLine: {
            normal: {
              show: showLine
            }
          },
        }
        const highLightData = this.styleConfig.config.highLightData
        if (highLightData.length > 0) {
          obj.data = highLightData
        } else {
          obj.data = data
        }
        const seriesArray = []
        seriesArray.push(obj)
        this.$store.commit('editMidOptionPaved', {
          index: this.index,
          type: val,
          seriesArray: seriesArray,
          legendArray: this.legendData
        })
      }
    },
    deepCopyArray(array) {
      const result = []
      for (let i = 0; i < array.length; i++) {
        let res = {}
        for (let key in array[i]) {
          res[key] = array[i][key]
        }
        result.push(res)
      }
      return result
    },
    setLabel(index, params) {
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
    },
    highLightMethod(array) {
      const data = this.seriesData
      let backData
      if (data !== undefined) {
        backData = JSON.parse(JSON.stringify(data))
      }
      const arrayName = []
      if (data) {
        data.map((itemSeries, indexSeries) => {
          arrayName.push(itemSeries.name)
        })
      }
      if (array.length > 0) {
        var arrayFilter = arrayName.filter((item, index) => {
          return !array.includes(item)
        });
        if (backData !== undefined) {
          backData.forEach((itemSeries, indexSeries) => {
            arrayFilter.forEach((item, index) => {
              if (itemSeries.name === item) {
                itemSeries.itemStyle = {}
                itemSeries.itemStyle.color = '#F0F2F5'
                itemSeries.itemStyle.borderColor = '#F0F2F5'
                itemSeries.itemStyle.borderWidth = 0
                itemSeries.emphasis = {}
                itemSeries.emphasis.itemStyle = {}
                itemSeries.emphasis.itemStyle.color = '#F0F2F5'
                itemSeries.emphasis.itemStyle.borderColor = '#F0F2F5'
                itemSeries.emphasis.itemStyle.borderWidth = 0
                itemSeries.label = {}
                itemSeries.label.show = false
                itemSeries.tooltip = {}
                itemSeries.tooltip.show = false
                itemSeries.cursor = 'default'
                itemSeries.labelLine = {}
                itemSeries.labelLine.show = false
              }
            })
          })
        }
      } else {
        backData.map((itemSeries, indexSeries) => {
          delete itemSeries.label
        })
      }
      return backData
    },
    showNum(state) {
      const val = this.styleConfig.config.isNumTotal
      const piePosition = this.getPieXPosition()
      const xPercent = piePosition.xPercent
      const yPercent = piePosition.yPercent
      const radius = piePosition.radius
      const innerRadius = piePosition.innerRadius
      const xPx = piePosition.xPx
      const yPX = piePosition.yPX
      const titleLeft = piePosition.titleLeft
      if (val) {
        this.$store.commit('saveOperate', {
          index: this.index,
          params: val,
          type: 'add',
          state: state,
          methods: 'showNum'
        })
      } else {
        this.$store.commit('saveOperate', {
          index: this.index,
          type: 'delete',
          methods: 'showNum'
        })
      }
      this.$store.commit('showNum', {
        index: this.index,
        type: val,
        xPercent,
        titleLeft,
        yPercent,
        radius,
        innerRadius
      })
    },
    changeLabelLine(val) {
      this.$store.commit('changeLabelLine', {
        index: this.index,
        type: val
      })
    },
    changeRadius(val) {
      const piePosition = this.getPieXPosition()
      const xPercent = piePosition.xPercent
      const yPercent = piePosition.yPercent
      const radius = piePosition.radius
      const innerRadius = piePosition.innerRadius
      const xPx = piePosition.xPx
      const yPX = piePosition.yPX
      const titleLeft = piePosition.titleLeft
      this.$store.commit('changeRadius', {
        index: this.index,
        xPercent,
        yPercent,
        radius,
        titleLeft,
        innerRadius,
        type: val
      })
    },
    pavedDisplayS(highLightArray) {
      this.legendPosition = 'top'
      this.changeLengend('top')
      const data = this.seriesData
      let arrayFilter
      // let restArray
      if (highLightArray.length > 0) {
        arrayFilter = data.filter((item, index) => {
          return highLightArray.includes(item.name)
        });
      } else {
        arrayFilter = data
      }
      const array = []
      const legendArray = []
      const length = arrayFilter.length
      let Arr = []
      if (length) {
        Arr = this.getPointAndRadius(length - 1)
      }
      const showLine = this.styleConfig.config.labelLine
      const backArray = this.deepCopyArray(arrayFilter)
      let isLabelShow = true
      // 标签样式为关闭的时候
      if (this.styleConfig.config.labelStyle === '4') {
        isLabelShow = false
      }
      if (backArray) {
        backArray.map((item, index) => {
          legendArray.push({
            name: item.name
          })
          const obj = {
            name: item.name,
            type: 'pie',
            // radius : [outR, innerR],
            radius: [0.7 * Arr[index].radius, 0.9 * Arr[index].radius],
            hoverAnimation: true,
            legendHoverLink: false,
            // center: [centerX, y + 2* (rowNum) * y + 10],
            center: [Arr[index].x, Arr[index].y],
            data: [],
            label: {
              show: isLabelShow,
              // position: 'inside',
              position: 'center',
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
                let value = this.setLabel(this.labelStyle, params);
                value = value.split(',')
                const text1 = value[0].length > 7 ? value[0].substr(0, 7) + '...' : value[0]
                const text2 = value[1] ? value[1] : ""
                const text3 = value[2] ? ', ' + value[2] : ""
                return '{a|' + text1 + '}' + '\n' + '{a|' + text2 + text3 + '}'
                // return value;
              }
            },
            labelLine: {
              normal: {
                show: showLine
              }
            },
          }
          item.itemStyle = {}
          item.itemStyle.borderColor = '#fff'
          item.itemStyle.borderWidth = 3
          obj.data.push(item)
          array.push(obj)
        })
      }
      const metricCode = this.chartsOption[this.index].feature.metricList[0].metricCode
      const totalNum = this.styleConfig.config.data.totalNum
      array.map((item, index) => {
        item.data.push({
          name: 'other',
          value: totalNum - Number(item.data[0].value),
          itemStyle: {
            color: '#F0F2F5',
            borderColor: '#F0F2F5',
            borderWidth: 0,
          },
          label: {
            show: false
          },
          tooltip: {
            show: false
          },
          cursor: 'default',
          labelLine: {
            show: false
          },
          emphasis: {
            itemStyle: {
              color: '#F0F2F5',
              borderColor: '#F0F2F5'
            }
          }
        })
      })
      // config.labelLine = false
      //   array.map((item, index) => {
      //     item.labelLine = newObj
      //     item.label.show = false
      //   })
      const returnObj = {
        seriesArray: array,
        legendArray
      }
      return returnObj
    },
    // 计算平铺展示环形图的半径和圆心位置
    getPointAndRadius(count) {
      const margin = 0.15        // 左右margin距离  百分比值 0 ~ 1
      const marginTop = 0.15     // 留给图例的距离  百分比值 0 ~ 1
      let marginBottom = 0
      // const isTitleShow = this.styleConfig.config.title.show
      // if (isTitleShow) {
      //   marginBottom = 0.1
      // }
      const dom = document.getElementById(this.chartId)
      let Arr = []
      if (dom) {
        let width = window.getComputedStyle(dom).width
        if (width) width = width.split('p')[0] * (1 - margin * 2)
        let height = window.getComputedStyle(dom).height
        height = height.split('p')[0] * (1 - marginTop - marginBottom)
        // 分布布局
        const layoutArray = [[1], [2], [3], [4], [5], [3, 3], [4, 3], [5, 3], [5, 4], [5, 5]]
        // 获取布局分布的行数
        let row = layoutArray[count].length


        // 单行分布
        if (row === 1) {
          let col = layoutArray[count][0]
          // 计算较小的直径
          let radius = height * 0.7
          if (radius > parseInt(width / col)) {
            radius = parseInt(width / col)
          }
          // 父容器分成 N 等分
          let split = (100 - margin * 2) / col
          for (let i = 0; i < col; i++) {
            let x = (1 / 2) * split + i * split
            Arr.push({ x: x + '%', y: ((1 - marginTop - marginBottom) * 0.5 + marginTop) * 100 + '%', radius: radius * 0.5 })
          }
        }
        // 双行分布
        if (row === 2) {

          let col = layoutArray[count][0]
          let radius = parseInt(height / 2)
          if (radius > (width / layoutArray[count][0])) {
            radius = parseInt(width / (layoutArray[count][0]))
          }
          // 第一行的分布
          for (let i = 0; i < layoutArray[count][0]; i++) {
            let col = layoutArray[count][0]
            let split = (100 - margin * 2) / col
            let x = (1 / 2) * split + i * split + margin
            Arr.push({ x: x + '%', y: ((1 - marginTop - marginBottom) * 0.25 + marginTop) * 100 + '%', radius: radius * 0.5 })
          }
          // 第二行的分布
          for (let i = 0; i < layoutArray[count][1]; i++) {
            let col = layoutArray[count][0]
            let split = (100 - margin * 2) / col
            let x = (1 / 2) * split + i * split + margin
            Arr.push({ x: x + '%', y: ((1 - marginTop - marginBottom) * 0.75 + marginTop) * 100 + '%', radius: radius * 0.5 })
          }
        }
      }
      return Arr
    },
    getPieRadius(params1, params2) {
      const legendPosition = this.styleConfig.config.legendPosition
      let radiusPersent = this.styleConfig.config.lfRadius
      if (radiusPersent === undefined) {
        radiusPersent = 0.82
      }
      const legendShow = this.styleConfig.config.legend.show
      const showrModel = this.styleConfig.config.showrModel
      const labelStyle = this.styleConfig.config.labelStyle
      // if (labelStyle === '4') {
      // radiusPersent = 0.9
      // } else {
      if (showrModel === '0') {
        if (legendShow) {
          if (legendPosition === 'top' || legendPosition === 'bottom') {
            radiusPersent = this.styleConfig.config.tbRadius
            if (radiusPersent === undefined) {
              radiusPersent = 0.8
            }
          }
        } else {
          radiusPersent = 0.7
        }
      } else if (showrModel === '1') {
        radiusPersent = Number(this.styleConfig.config.radius)
        if (isNaN(radiusPersent)) {
          radiusPersent = 0.82
        }
      }
      // }
      let radius
      if (params1 > params2) {
        radius = (params2 * radiusPersent) / 2
      } else {
        radius = (params1 * radiusPersent) / 2
      }
      return radius
    },
    // 计算圆心位置
    getPieXPosition() {
      const pieAxisTitle = this.styleConfig.config.title.show
      let pieAxisTitleHeight = this.styleConfig.config.pieAxisTitleHeight
      if (pieAxisTitleHeight === undefined) {
        pieAxisTitleHeight = 25
      }
      const legendShow = this.styleConfig.config.legend.show
      const legendPosition = this.styleConfig.config.legendPosition
      let legendWidth = this.styleConfig.config.legendWidth
      if (legendWidth === undefined) {
        legendWidth = 120
      }
      let legendHeight = this.styleConfig.config.legendHeight
      if (legendHeight === undefined) {
        legendHeight = 50
      }
      const height = this.option.h * containerInit.rowHeight + (this.option.h - 1) * containerInit.margin[0] - 40 - 10
      const width = getComputedStyle(document.getElementById(this.chartId)).width.split("px")[0] - 10
      let radius
      let innerRadius
      let xPercent
      let xPx
      let yPX
      let titleLeft
      let yPercent
      let obj = {}
      let restHeight
      if (legendShow) {
        if (legendPosition === 'right') {
          const restWidth = (width - legendWidth)
          const xWidth = restWidth / width * 100
          xPx = restWidth / 2
          xPercent = Number(xWidth / 2) + '%'
          yPercent = '50%'
          yPX = height / 2
          radius = this.getPieRadius(height, restWidth)
          if (pieAxisTitle) {
            yPercent = (((height - pieAxisTitleHeight) / 2) / height) * 100 + '%'
            yPX = (height - pieAxisTitleHeight) / 2
            radius = this.getPieRadius(height - pieAxisTitleHeight, restWidth)
            // titleLeft = xPx - radius + 50
            titleLeft = xPx - 0.5 * radius
          }
        } else if (legendPosition === 'left') {
          const restWidth = (width - legendWidth)
          xPx = restWidth / 2 + legendWidth
          xPercent = ((restWidth / 2 + legendWidth) / width) * 100 + '%'
          yPercent = '50%'
          yPX = height / 2
          radius = this.getPieRadius(height, restWidth)
          if (pieAxisTitle) {
            yPercent = (((height - pieAxisTitleHeight) / 2) / height) * 100 + '%'
            yPX = (height - pieAxisTitleHeight) / 2
            radius = this.getPieRadius(height - pieAxisTitleHeight, restWidth)
            // titleLeft = xPx - radius + 50
            titleLeft = xPx - 0.5 * radius
          }
        } else if (legendPosition === 'top') {
          restHeight = height - legendHeight
          xPercent = '50%'
          xPx = width / 2
          yPX = restHeight / 2 + legendHeight
          yPercent = (((height - legendHeight) / 2 + legendHeight) / height) * 100 + '%'
          radius = this.getPieRadius(width, restHeight)
          if (pieAxisTitle) {
            yPercent = (((height - pieAxisTitleHeight - legendHeight) / 2 + legendHeight) / height) * 100 + '%'
            yPX = (height - pieAxisTitleHeight - legendHeight) / 2 + legendHeight
            radius = this.getPieRadius(width, restHeight - pieAxisTitleHeight)
            // titleLeft = xPx - radius + 30
            titleLeft = xPx - 0.5 * radius
          }
        } else {
          restHeight = height - legendHeight
          xPercent = '50%'
          yPercent = (((height - legendHeight) / 2) / height) * 100 + '%'
          xPx = width / 2
          yPX = restHeight / 2
          radius = this.getPieRadius(width, restHeight)
          if (pieAxisTitle) {
            yPercent = (((height - pieAxisTitleHeight - legendHeight + 30) / 2) / height) * 100 + '%'
            yPX = (height - pieAxisTitleHeight - legendHeight + 30) / 2
            radius = this.getPieRadius(width, restHeight - pieAxisTitleHeight + 30)
            // titleLeft = xPx - radius + 30
            titleLeft = xPx - 0.5 * radius
          }
        }
      } else {
        xPercent = '50%'
        yPercent = '50%'
        xPx = width / 2
        yPX = height / 2
        radius = this.getPieRadius(width, height)
        if (pieAxisTitle) {
          yPercent = (((height - pieAxisTitleHeight) / 2) / height) * 100 + '%'
          yPX = (height - pieAxisTitleHeight) / 2
          radius = this.getPieRadius(width, height - pieAxisTitleHeight)
          titleLeft = 'center'
        }
      }
      obj.xPercent = xPercent
      obj.yPercent = yPercent
      obj.radius = radius
      obj.innerRadius = radius - 40
      obj.xPx = xPx
      obj.yPX = yPX
      obj.titleLeft = titleLeft
      return obj
    },
    changeLegendShow() {
      const legendPosition = this.styleConfig.config.legendPosition
      this.changeLengend(legendPosition)
    },
    changeShowAxisTitle() {
      const legendPosition = this.styleConfig.config.legendPosition
      this.changeLengend(legendPosition)
    }
  }
}
