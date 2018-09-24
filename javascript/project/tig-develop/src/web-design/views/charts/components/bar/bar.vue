<template>
 <div v-noData="{noDataLayer, containerHasTitle}">
  <div class="bar">
   <div class="container" :id="chartId" style="width:100%;height: 100%"></div>
   <div class="page" v-if="config.timeAxis" style="margin-left:70px">
     <!--   <div class="page"> -->
       <time-axis :total="total" @on-change="changePageNew" :currentPage="config.currentPage" :width="width" :extraParams="timeParams"></time-axis>
    </div>
    <div class="page"  v-if="isShowDimInstruction">
      <div :title="dimValueStr" class="dim-title"> 说明 <span style="color:red;position: absolute;top:3px">*</span><span style="margin-left:8px;margin-right: 5px">:</span>{{dimValueStr}}</div>
    </div>
  </div>
</div>
</template>

<script>
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts'
  // 引入折线图
  import 'echarts/lib/chart/bar'
  // 引入提示框
  import 'echarts/lib/component/tooltip'
  // 引入图例
  import 'echarts/lib/component/legend'
  // 引入度量水平线
  import 'echarts/lib/component/markLine'
  // 引入标题
  import 'echarts/lib/component/title'

  import bus from '../../utils/eventBus'
  import {sendLinkInfo, getCrossDimList} from '../../utils/utils'
  import search from '../../../../api/search'
  import configClass from '../../static/configClass'
  import barMethod from './barMix'
  import timeAxis from './timeAxis'
  import dimaLimitUtil from './dimaLimitUtil'
  import noDataMixin from '../mixins/noData/noDataMixin'
  export default {
    name: 'Pie',
    components: {
      timeAxis
    },
    props: {
      index: {
        default: 0
      }
    },
    mixins: [search, barMethod, dimaLimitUtil, noDataMixin],
    data() {
      return {
        chart: null,
        isShowDimInstruction: false,
        dimValueStr: '',
        total: 24,
        pageOption: {
          chunk: 12
        },
        width: 1200,
        pagerCount: 24,
        timeParams: {
          startTime: '',
          endTime: '',
          startCompareTime: '',
          endCompareTime: '',
          conditionList: []
        }
      }
    },
    created() {
    },
    computed: {
      chartId() {
        return `chartBar-${this.index}`
      },
      timeAxis() {
        const timeAxis = this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.timeAxis
        return timeAxis ? timeAxis : false
      },
      styleConfig() {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
      },
      config() {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config
      },
      option () {
        return this.$store.state.charts.chartsOption[this.index]
      },
      chartsOption() {
        return this.$store.state.charts.chartsOption
      },
      data() {
       return this.$store.state.charts.chartsOption[this.index].data
      },
       // 交叉维度
      crossDimList () {
        return getCrossDimList(this.$store.state.charts.dataSet, this.option.feature.metricList)
      },
      feature() {
       return this.$store.state.charts.chartsOption[this.index].feature
      }
    },
    methods: {
      drawCharts (xAxis, yAxis, series, legendData) {
        const legendPosition = this.styleConfig.config.legendPosition
        const axisTitle = this.styleConfig.config.axisTitle
          // 解决多条柱子间距莫名其妙不对的样式问题
        const metricList = this.feature.metricListFlat ? this.feature.metricListFlat : this.feature.metricList
        if (legendPosition === "right") {
           if (axisTitle) {
            this.styleConfig.config.grid.right = 170
          }
        } else {
          if (!axisTitle) {
            if (metricList.length > 1) {
          this.styleConfig.config.grid.right = '0'
         } else {
          this.styleConfig.config.grid.right = 16
         }
          }
        }
        const chart = echarts.init(document.getElementById(this.chartId))
        this.chart = chart
        if (xAxis !== undefined) {
          this.styleConfig.config.xAxis = xAxis
        }
        if (yAxis !== undefined) {
          this.styleConfig.config.yAxis = yAxis
        }
        if (series !== undefined) {
          this.styleConfig.config.series = series
        }
        // if (this.styleConfig.config.doubleY) {
        //   this.styleConfig.config.series[1].xAxisIndex = 1
        // }
        if (legendData !== undefined) {
          this.styleConfig.config.legend.data = legendData
        }
        chart.setOption(this.styleConfig.config)
      },
      handelData(mockData, type) {
        let mockDataLength
        if (mockData && mockData.length) {
          mockDataLength = mockData.length
        }
        const retObj = {}
        let dimCode = ''
        let dimName = ''
        if (this.feature.dimList.length > 0) {
          dimCode = this.feature.dimList[0].dimCode
          dimName = this.feature.dimList[0].dimName
        }
        const metricList = this.feature.metricListFlat ? this.feature.metricListFlat : this.feature.metricList
        let metricLength = 0
        if (metricList && metricList.length) {
          metricLength = this.feature.metricList.length
        }
        let metricName = ''
        if (metricLength > 0) {
           metricName = this.feature.metricList[0].metricName
        }
        const xAxis = []
        xAxis.push(
          { show: true,
            type : 'category',
            data : [],
            boundaryGap: true,
            alignWithLabel: true,
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
                color: '#333'
            },
            axisLabel: {
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
            },
            axisTick: {
              show: false,
              alignWithLabel: true // 标签刻度对齐,
            },
            splitLine: {
                show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#000000',
                opacity: 0.15
              }
            }
        })
        const yAxis = []
        const series = []
        const legendArray = []
        if (metricList) {
         metricList.map((itemMetric, indexMetric) => {
          legendArray.push(itemMetric.metricName)
          const obj = {
            name: itemMetric.metricName,
            id: itemMetric.metricCode,
            type:'bar',
            stack: '',
            barMinHeight: '1',
            barMaxWidth: '32',
            barGap: '30%',
            data:[],
            // label: {
            //   show: false,
            //   position: 'top'
            // },
            markLine: {
              data: [],
              lineStyle: {
                opacity: 1,
                type: 'dashed'
              },
              label: {
                show: true
              }
            }
          }
          if (indexMetric < 2) {
            if (indexMetric === 0) {
              yAxis.push(
                {   show: true,
                    type : 'value',
                    name: '',
                    nameLocation: 'end',
                    nameTextStyle: {
                      color: '#333'
                    },
                    splitLine: {
                     show: false
                    },
                    axisLabel: {
                      show: true,
                      textStyle: {
                        color: '#333'
                      }
                    },
                    axisLine: {
                      show: false,
                      lineStyle: {
                        width: 1,
                        color: '#000000',
                        opacity: 0.15
                      }
                    },
                    axisTick: {
                      show: false
                    }
               })
            } else {
              yAxis.push(
                {   show: false,
                    type : 'value',
                    name: '',
                    nameLocation: 'end',
                    nameTextStyle: {
                      color: '#333'
                    },
                    axisLabel: {
                      show: true,
                      textStyle: {
                        color: '#333'
                      }
                    },
                    splitLine: {
                     show: false
                    },
                    axisLine: {
                      show: false,
                      lineStyle: {
                        width: 1,
                        color: '#000000',
                        opacity: 0.15
                      }
                    },
                    axisTick: {
                      show: false
                    }
               })
            }
          }
          if (mockData && mockData.length) {
           mockData.map((item, index) => {
              if (indexMetric === 0) {
                if (type === 'pave') {
                   xAxis[0].data.push(item.metricName)
                } else {
                  xAxis[0].data.push(item[dimCode])
                }
              }
              obj.data.push(item[itemMetric.metricCode])
            })
          }
          series.push(obj)
        })
        }
        // if (mockData && mockData.length) {
        //  mockData.map((item, index) => {
        //     if (indexMetric === 0) {
        //       if (type === 'pave') {
        //          xAxis[0].data.push(item.metricName)
        //       } else {
        //         xAxis[0].data.push(item[dimCode])
        //       }
        //     }
        //     obj.data.push(item[itemMetric.metricCode])
        //   })
        // }
        const totalLength = (series.length) * mockDataLength
        // if (totalLength < 21) {
        //   series.map((item, index) => {
        //     item.barWidth = '32'
        //   })
        // }
        retObj.xAxis = xAxis
        retObj.yAxis = yAxis
        retObj.series = series
        retObj.legendData = legendArray
        retObj.totalLength = totalLength
        return retObj
      },
      init(type, data, dataType) {
        const handelData = this.handelData(data, dataType)
        this.$store.commit('saveHandelData', {
            index: this.index,
            name: 'data',
            value: handelData,
        })
        const legendData = handelData.legendData
        const series = handelData.series
        const xAxis = handelData.xAxis
        const yAxis = handelData.yAxis
        // const totalLength = handelData.totalLength
        // if (totalLength > 9) {
        //   this.styleConfig.config.grid.right = '0'
        // }
        if (type === 'update') {
          const metricLength = this.feature.metricListFlat ? this.feature.metricListFlat.length : this.feature.metricList.length
          this.initTooltip()
          this.initLegend()
          if (metricLength !== 2) {
            this.styleConfig.config.doubleY = false
          }
          const timeAxis = this.styleConfig.config.timeAxis
          // if (timeAxis) {
            // this.updateTimeAxis()
          // }
          const selectMetricList = this.styleConfig.config.selectMetricList
          const metricList = this.feature.metricListFlat ? this.feature.metricListFlat : this.feature.metricList
          const newSelectMetricList = []
          if (selectMetricList) {
            selectMetricList.map((itemHighLight, indexHighLight) => {
            metricList.map((item, index) => {
              if (itemHighLight === item.metricCode) {
                newSelectMetricList.push(itemHighLight)
              }
            })
           })
          }
          this.styleConfig.config.selectMetricList = newSelectMetricList
          // this.drawCharts(xAxis, yAxis, series, legendData)
          this.redrawEchart(xAxis, yAxis, series, legendData)
        } else {
          const startTime = this.option.nearUpdateTime[0]
          const endTime = this.option.nearUpdateTime[1]
          // this.initTimeAxisNew(startTime, endTime)
          this.drawCharts(xAxis, yAxis, series, legendData)
          this.chart.on('click', this.sendMessage)
       }
      },
      sendMessage (params) {
        const indexPave = this.feature.styleConfig.config.indexPave
        if (indexPave) {
          return
        }
        let  dimCode = this.chartsOption[this.index].feature.dimList[0].dimCode
        let dimValue = params.name
        dimValue = dimValue.indexOf('###') > -1 ? dimValue.split('###')[0] : dimValue
        // const selectedDim = this.styleConfig.config.selectedDim
        // const selectDimValueList = this.styleConfig.config.selectDimValue
        // const test = selectDimValueList.join(',')
        let linkInfo = {
          dimCode,
          dimValue
        }
        sendLinkInfo(this.chartsOption, this.index, linkInfo)
      },
      updateEchart (setOption) {
        if (this.chart !== null) {
          if (setOption !== null) {
            this.chart.setOption(setOption, true)
          }
        }
      },
      formatter (params) {
        let category = params[0].name
          let html = ''
          html += '<div style="fontSize: 8px;padding: 0px 6px;">'
          html += `<div style="lineHeight: 20px">${category}</div>`
          html += '<ul style="listStyle: none;">'
          for (let i = 0; i < params.length; i++) {
            let list = params[i]
            if (list.value !== undefined) {
            html += `<li lineHeight: 20px">`;
            // html +=   `<span  style="color: ${list.color}" >•</span>`;
            html += `<span style="border-radius:50%;width:8px;height:8px;display:inline-block;background: ${list.color}"></span>`
            html += `<span style="margin:5px 15px 0px 7px">${
              list.seriesName
            }</span>`;
            html += `<span>${list.value}</span>`;
            html += "</li>";
          }
          }
          html += '</ul>'
          html += '</div>'
          return html
      },
      legendFormatter(name) {
        const legendPosition = this.styleConfig.config.legendPosition
        if (legendPosition === 'left' || legendPosition === 'right') {
           return name.length > 11 ? name.substr(0, 10) + "..." : name;
        } else {
          return name
        }
      },
      legendTootipFormatter(params) {
        const str = '<div style="background:black;border-radius:4px;padding:5px;font-size:12px;opacity:0.5">' + params.name +'</div'
        return str
      },
      async update(index, dimCode, dimValue, dimName = '') {
        const linkInfo = {
         dimCode,
         dimValue
        }
        const indexPave = this.feature.styleConfig.config.indexPave
        const dimFilter = this.feature.styleConfig.config.dimFilter
        if (indexPave && !dimFilter) {
          let data = await this.getLinkInfoPanelData({
            index,
            dimList: []
          })
          const indexPaveDataList = this.handelPaveData(data)
          this.init('update', indexPaveDataList, 'pave')
        } else if (indexPave && dimFilter) {
          let data = await this.getLinkInfoPanelData({
            index,
            linkInfo,
            dimList: []
          })
          let dimValueList = []
          let dimValueNmList = []
          dimValueList.push(dimCode)
          dimValueNmList.push(dimName)
          this.initDimValueInstruction(dimValueNmList, dimValueList);
          const indexPaveDataList = this.handelPaveData(data)
          this.init('update', indexPaveDataList, 'pave')
          this.toggleNoData(data.length)
        } else {
          let data = await this.getLinkInfoPanelData({
            index,
            linkInfo
          })
          this.init('update', data)
          this.toggleNoData(data.length)
        }
      },
      async restoreData() {
        let data = await this.updateDataPre({
          index: this.index,
          loadingFalse: false
         })
       if (data !== undefined) {
          data = JSON.parse(JSON.stringify(data))
          data = data.splice(0, 15)
          this.init('update', data)
          this.isShowDimInstruction = false
          this.$nextTick(() => {
            if (this.chart) {
              this.chart.resize()
            }
          })
          this.loadingToggle(this.index, false)
        }
      },
     async cancelPave() {
        let data = await this.updateDataPre({
          index: this.index,
          loadingFalse: false
         })
       if (data !== undefined) {
          data = JSON.parse(JSON.stringify(data))
          data = data.splice(0, 15)
          this.init('update', data)
          this.loadingToggle(this.index, false)
        }
      },
      // 数据变化时 先销毁Bar 重新绘制
      redrawEchart (xAxis, yAxis, series, legendData) {
        if (this.chart) {
         this.chart.clear()
         this.chart.off('click', this.sendMessage)
        }
        this.drawCharts(xAxis, yAxis, series, legendData)
        this.chart.on('click', this.sendMessage)
        this.initStyleConfig()
      },
      initStyleConfig() {
        const operate = this.styleConfig.config.operate
        const metricLength = this.feature.metricListFlat ? this.feature.metricListFlat.length : this.feature.metricList.length
        if (operate) {
           operate.map((item, index) => {
            const methods = item.methods
            if (methods === 'changeLine') {
              if (metricLength === 2) {
                this[methods](false, item.params)
              }
            } else {
              this[methods](false, item.params)
            }
          })
        }
      },
      async changePageNew(obj) {
       this.$store.commit('editCurrentPage', {
            index: this.index,
            value: obj.currentPage,
        })
        let currentPage = obj.currentPage
        if (currentPage < 10) {
           currentPage = '0' + currentPage
        } else if (currentPage === 24) {
          currentPage = '00'
        }
        const startTime = obj.startTime + ' ' + currentPage
        let endTime = obj.endTime + ' ' + currentPage
        if (endTime === undefined) {
          endTime = startTime
        }
        const startCompareTime = obj.startCompareTime + ' ' + currentPage
        let endCompareTime = obj.endCompareTime + ' ' + currentPage
        if (endCompareTime === undefined) {
          endCompareTime = startCompareTime
        }
        let conditionListArr = []
        if (obj.conditionList && obj.conditionList.length > 0) {
          conditionListArr = obj.conditionList
        }
        let data = await this.updateDataPre({
          index: this.index,
          startTime: endTime,
          endTime,
          compareStartDate: startCompareTime,
          compareEndDate: endCompareTime,
          timeQueryCycle: 'TG_00000003',
          loadingFalse: false,
          conditionListArr
        })
        if (data !== undefined) {
          data = JSON.parse(JSON.stringify(data))
          data = data.splice(0, 15)
          this.init('update', data)
          this.loadingToggle(this.index, false)
        }
      },
      getConditionList(queryInfo) {
        const conditionList = []
        const chartOption = this.$store.state.charts.chartsOption[this.index]
        if (queryInfo.dimListData && queryInfo.dimListData.length) {
          // isPublicDim true:所有容器的应用维度的交叉维度
          queryInfo.dimListData.forEach(item => {
            if (!queryInfo.isPublicDim ? chartOption.feature.dimList.map(({dimCode}) => dimCode).includes(item.dimCode) : 1) {
              conditionList.push({
                condiCode: item.dimCode,
                condiType: 0,
                condiRateType: 0,
                operator: item.selectedOper === 'in' ? 6 : 7,
                condiComparedValue: item.dimSelectedList.join(',')
              })
            }
          })
        }
        if (queryInfo.metricsListData && queryInfo.metricsListData.length) {
          queryInfo.metricsListData.forEach((item, index) => {
            // 1判断在不在自己选中的指标中 2指标有值（item.title）
            if (chartOption.feature.metricList.map(({metricCode}) => metricCode).includes(item.metricCode) && item.title !== '') {
              conditionList.push({
                condiCode: item.metricCode,
                condiType: 1,
                condiRateType: 0,    // 同环比等问题
                operator: Number(item.selectedOper),
                condiComparedValue: item.title
              })
            }
          })
        }
        return conditionList
      },
      async changePage(val) {
        this.$store.commit('editCurrentPage', {
            index: this.index,
            value: val,
        })
        if (val < 10) {
          val = '0' + val
        }
        const timeQueryCycle = this.option.timeQueryCycle
        let timeQueryCycleLast
        if (timeQueryCycle === 'TG_00000005') {
           timeQueryCycleLast = 'TG_00000004'
        } else if (timeQueryCycle === 'TG_00000006') {
          timeQueryCycleLast = 'TG_00000005'
        } else if (timeQueryCycle === 'TG_00000004') {
           timeQueryCycleLast = 'TG_00000003'
        }
        let startTime = ''
        let endTime = ''
        if (timeQueryCycle === 'TG_00000004') {
          if (val === 24) {
            val = '00'
          }
          startTime = this.option.nearUpdateTime[0] + ' ' + val
          endTime = this.option.nearUpdateTime[1] + ' ' + val
        } else {
          startTime = this.option.nearUpdateTime[0] + '-' + val
          endTime = this.option.nearUpdateTime[1] + '-' + val
        }
        let data = await this.updateDataPre({
          index: this.index,
          startTime,
          endTime,
          timeQueryCycle: timeQueryCycleLast,
          loadingFalse: false
        })
        if (data !== undefined) {
          data = JSON.parse(JSON.stringify(data))
          data = data.splice(0, 15)
          this.init('update', data)
          this.loadingToggle(this.index, false)
        }
      },
      getTimeAxisTotal(dataType, index) {
        if (dataType === 'TG_00000004') {
          this.total = 24
        } else if (dataType === 'TG_00000005') {
          this.total = this.getMonthDay(index)
        } else if (dataType === 'TG_00000006') {
          this.total = 12
        }
      },
      getMonthDay(index) {
         const monthArray = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
         return monthArray[index]
      },
      isShowTimeAxisNew(minTimeGranularity, startTime, endTime) {
        if (endTime === undefined) {
          endTime = startTime
        }
        const dimCode = this.feature.dimList[0].dimCode
        if (dimCode === 'dasp_date') {
            return false
            // 判断是否选择是日期（2018-05-17 的格式）
          } else if (this.checkTimeQranularityNew(endTime)){
            let index = -1
            // 日
            const dateQranularity = ['TG_00000003', 'TG_00000002', 'TG_00000001']
            index = dateQranularity.findIndex((data) => {
               return data === minTimeGranularity;
            })
            if (index === -1) {
              return false
            } else {
              return true
            }
          }
      },
      isShowTimeAxis(minTimeGranularity, timeQueryCycle, startTime, endTime) {
        if (startTime === endTime) {
          const dimCode = this.feature.dimList[0].dimCode
          // 判断是否为时间维度
          if (dimCode === 'dasp_date') {
            return false
            // 判断是否选择是年 月 日 粒度
          } else if (this.checkTimeQranularity(timeQueryCycle)){
            let index = -1
          // 日
            if (timeQueryCycle === 'TG_00000004') {
               const dateQranularity = ['TG_00000003', 'TG_00000002', 'TG_00000001']
               index = dateQranularity.findIndex((data) => {
                 return data === minTimeGranularity;
                })
            // 月
            } else if (timeQueryCycle === 'TG_00000005') {
              const month = ['TG_00000004','TG_00000003', 'TG_00000002', 'TG_00000001']
              index = month.findIndex((data) => {
                return data === minTimeGranularity;
              })
            // 年
            } else if (timeQueryCycle === 'TG_00000006') {
              const yearQranularity = ['TG_00000005', 'TG_00000004','TG_00000003', 'TG_00000002', 'TG_00000001']
              index = yearQranularity.findIndex((data) => {
                return data === minTimeGranularity;
              })
            }
            if (index === -1) {
              return false
            } else {
              return true
            }
          } else {
            return false
          }
        } else {
          return false
        }
      },
      // 获取最小时间粒度
      minDateTypeCode () {
        const metricListFlat = this.this.option.feature.metricListFlat
        let metricArray = []
        if (metricListFlat) {
          metricArray =  this.option.feature.metricListFlat.map(item => {
          return Number(item.timeGranularity.slice(-1))
         })
        }
        // console.log('TG_0000000' + metricArray.sort()[0])
        return 'TG_0000000' + metricArray.sort()[0]
      },
      checkTimeQranularity(dataType) {
        let index = -1
        const arr = ['TG_00000005', 'TG_00000004','TG_00000003']
        index = arr.findIndex((data) => {
          return data === dataType;
        })
        if (index === -1) {
          return false
        } else {
          return true
        }
      },
      checkTimeQranularityNew(timeType) {
        let length = 0
        if (timeType.length) {
          length = timeType.split('-').length
        }
        if (length === 2) {
          return true
        } else {
          return false
        }
      },
      initTimeAxisNew(startTime, endTime) {
        if (startTime === undefined && endTime === undefined) {
          startTime = this.option.nearUpdateTime[0]
          endTime = this.option.nearUpdateTime[1]
        }
        const minTimeGranularity = this.minDateTypeCode()
        // const isShow = this.isShowTimeAxisNew(minTimeGranularity, startTime, endTime)
        const isShow = true
        if (isShow) {
         this.styleConfig.config.isShowTimeAxis = true
        } else {
          this.styleConfig.config.isShowTimeAxis = false
           if (this.styleConfig.config.timeAxis) {
             this.styleConfig.config.timeAxis = false
             const _this = this
             this.$nextTick(() => {
              if (_this.chart) {
                _this.chart.resize()
              }
            })
           }
        }
      },
      initTimeAxis() {
       const timeQueryCycle = this.option.timeQueryCycle
       const startTime = this.option.nearUpdateTime[0]
       const month = Number(startTime.split('-')[1]) - 1
       const minTimeGranularity = this.minDateTypeCode()
       const endTime = this.option.nearUpdateTime[1]
       if (this.isShowTimeAxis(minTimeGranularity, timeQueryCycle, startTime, endTime)) {
         this.getTimeAxisTotal(timeQueryCycle, month)
         // this.styleConfig.config.timeAxis = true
         this.styleConfig.config.isShowTimeAxis = true
       } else {
         this.styleConfig.config.isShowTimeAxis = false
         if (this.styleConfig.config.timeAxis) {
           this.styleConfig.config.timeAxis = false
           const _this = this
           this.$nextTick(() => {
            if (_this.chart) {
              _this.chart.resize()
            }
          })
         }
       }
      },
      initTooltip() {
        const tooltipShow = this.styleConfig.config.tooltip.show
        const isGuideShow = this.styleConfig.config.isGuideShow
        const metricLength = this.feature.metricListFlat ? this.feature.metricListFlat.length : this.feature.metricList.length
        const axisPointer = {
          type: '',
          label: {
            formatter: params => {
              if (typeof params.value === 'string' && params.value.indexOf('###') > -1) {
                params.value = params.value.replace('###', '_')
              }
              return params.value
            }
          }
        }
        if (isGuideShow) {
          if (metricLength === 1) {
            axisPointer.type = 'cross'
          } else {
            axisPointer.type = 'shadow'
          }
        }
        this.styleConfig.config.tooltip = {
          trigger: "axis",
          show: tooltipShow,
          axisPointer,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          boxShadow: "0 2px 4px 0",
          textStyle: {
            color: '#fff',
            fontSize: 12
         },
         boxShadow: '0 2px 4px 0',
         extraCssText:
          'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px',
          formatter: params => {
            let category = params[0].name
            category = category.indexOf('###') > -1 ? category.replace('###', '_') : category
            let html = ''
            html += '<div style="fontSize: 8px;padding: 0px 6px;">'
            html += `<div style="lineHeight: 20px">${category}</div>`
            html += '<ul style="listStyle: none;">'
            for (let i = 0; i < params.length; i++) {
              let list = params[i]
              if (list.value !== undefined) {
              html += `<li style="line-height: 20px">`;
              // html +=   `<span  style="color: ${list.color}" >•</span>`;z
              html += `<span style="border-radius:50%;width:8px;height:8px;display:inline-block;background: ${list.color}"></span>`
              html += `<span style="margin:5px 15px 0px 7px">${
                list.seriesName
              }</span>`;
              html += `<span>${list.value}</span>`;
              html += "</li>";
            }
            }
            html += '</ul>'
            html += '</div>'
            return html
          }
        }
      },
      initLegend() {
        this.styleConfig.config.legend.formatter = this.legendFormatter
        this.styleConfig.config.legend.tooltip = {
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
      updateTimeAxis(startTime, endTime, conditionList) {
        const currentPage = this.styleConfig.config.currentPage
        this.timeParams.startTime = startTime
        this.timeParams.endTime = endTime
        this.timeParams.startCompareTime = startTime
        this.timeParams.endCompareTime = endTime
        if (conditionList) {
         this.timeParams.conditionList = conditionList
        } else {
          this.timeParams.conditionList = []
        }
        let conditionListArr = []
        if (conditionList && conditionList.length > 0) {
          conditionListArr = conditionList
        }
        this.changePageNew({
          currentPage: currentPage,
          startTime: startTime,
          endTime: endTime,
          startCompareTime: startTime,
          endCompareTime: endTime,
          conditionList: conditionListArr
        })
      },
      async indexPave(startTime, endTime, conditionList, objData) {
        this.dimValueStr = ''
        this.isShowDimInstruction = false
        this.$nextTick(() => {
          if (this.chart) {
            this.chart.resize()
          }
        })
        let data
        if (objData == undefined) {
         data = await this.updateDataPre({
            index: this.index,
            startTime,
            endTime,
            loadingFalse: false,
            dimList: [],
            conditionList: conditionList
          })
         } else {
           data = objData
         }
        const indexPaveDataList = this.handelPaveData(data)
        this.init('update', indexPaveDataList, 'pave')
        this.loadingToggle(this.index, false)
      },
      // handelPaveData(data) {
      //   const metricList = this.feature.metricListFlat
      //   const indexPaveDataList = []
      //   if (data && data.length > 0) {
      //      const paveData = data[0]
      //       metricList.map((item, index) => {
      //         const metricCode = item.metricCode
      //         indexPaveDataList.push({
      //           [item.metricCode]: paveData[metricCode],
      //           metricName: item.metricName
      //         })
      //       })
      //   }
      //   return indexPaveDataList
      // },
      async dimValueTotal(startTime, endTime, dimValueList, dimCode, dimValueNmList) {
       this.initDimValueInstruction(dimValueNmList, dimValueList)
       const conditionList = []
       const condiComparedValue = dimValueList.join(',')
       conditionList.push({
        condiCode: dimCode,
        condiType: 0,
        condiRateType: 0,
        operator: 6,
        condiComparedValue: condiComparedValue
       })
       let data = await this.updateDataPre({
            index: this.index,
            loadingFalse: false,
            dimList: [],
            startTime,
            endTime,
            conditionListArr: conditionList
        })
        const metricList = this.feature.metricListFlat ? this.feature.metricListFlat:  this.feature.metricList
        const indexPaveDataList = this.handelPaveData(data)
        this.init('update', indexPaveDataList, 'pave')
        this.loadingToggle(this.index, false)
      },
      initDimValueInstruction(dimValueNmList, dimValueList) {
       let str = ''
       if (dimValueNmList) {
        dimValueNmList.map((item, index) => {
         str = str + item  + '、'
        })
       }
       str = str.substring(0, str.length - 1)
       this.dimValueStr = str
       if (dimValueList && dimValueList.length) {
          this.isShowDimInstruction = true
       } else {
          this.isShowDimInstruction = false
       }
       this.$nextTick(() => {
          if (this.chart) {
            this.chart.resize()
          }
        })
      },
     async updateQueryPanel(obj) {
        let startTime
        let endTime
        let startCompareTime
        let endCompareTime
        if (obj.dateData.length) {
           startTime = obj.dateData[0].dateData[0]
           endTime = obj.dateData[0].dateData[1]
           if (obj.dateData.length === 2) {
             startCompareTime = obj.dateData[1].dateData[0]
             endCompareTime = obj.dateData[1].dateData[0]
           }
        }
        if (startTime === undefined) {
          startTime = this.option.nearUpdateTime[0]
          endTime = this.option.nearUpdateTime[1]
        }
        if (startCompareTime === undefined) {
          startCompareTime = startTime
          endCompareTime = endTime
        }
        // this.initTimeAxisNew(startTime, endTime)
        const timeAxis = this.feature.styleConfig.config.timeAxis
        const indexPave = this.feature.styleConfig.config.indexPave
        const dimFilter = this.feature.styleConfig.config.dimFilter
        if (timeAxis) {
        let currentPage = this.styleConfig.config.currentPage
        if (currentPage < 10) {
           currentPage = '0' + currentPage
        } else if (currentPage === 24) {
          currentPage = '00'
        }
        this.timeParams.startTime = startTime
        this.timeParams.endTime = endTime
        this.timeParams.startCompareTime = startCompareTime
        this.timeParams.endCompareTime = endCompareTime
        startTime = startTime + ' ' + currentPage
        endTime = endTime + ' ' + currentPage
        startCompareTime = startCompareTime + ' ' + currentPage
        endCompareTime = endCompareTime + ' ' + currentPage
        if (obj.dateData && obj.dateData.length) {
          obj.dateData[0].dateData[0] = startTime
          obj.dateData[0].dateData[1] = endTime
          obj.dateData[0].formatType = 'hour'
        } else {
           const dateObj = {
            dateData: [startTime, endTime],
            formatType: 'hour'
           }
           obj.dateData.push(dateObj)
        }

        if (obj.dateData.length === 2) {
          obj.dateData[1].dateData[0] = startCompareTime
          obj.dateData[1].dateData[1] = endCompareTime
        } else {
           const dateObj = {
            dateData: [startCompareTime, endCompareTime],
            formatType: 'hour'
           }
           obj.dateData.push(dateObj)
        }
        const data = await this.getQueryPanelData({
          index: this.index,
          queryInfo: obj
        })
        this.init('update', data)

        // if (endTime === undefined) {
        //   endTime = startTime
        // }
          // this.updateTimeAxis(startTime, endTime, conditionList)
        } else if (indexPave && !dimFilter) {
           let conditionList = []
           if (obj.dimListData.length) {
             obj.dimListData = []
           };
           const data = await this.getQueryPanelData({
            index: this.index,
            queryInfo: obj,
            dimList: []
           })
           const indexPaveDataList = this.handelPaveData(data)
           this.init('update', indexPaveDataList, 'pave')
        } else if (indexPave && dimFilter) {
          if (obj.dimListData && obj.dimListData.length > 0) {
            const dimListData = obj.dimListData
            let dimValueList = []
            let dimValueNmSelectedList = []
            let dimValueNmList = []
            if (dimListData && dimListData.length) {
              dimListData.map((item, index) => {
                if (item.dimSelectedNameList && item.dimSelectedNameList.length) {
                  dimValueNmSelectedList = dimValueNmSelectedList.concat(item.dimSelectedNameList)
                }
                dimValueList = dimValueList.concat(item.dimSelectedList)
              })
              if (dimValueNmSelectedList.length) {
                dimValueNmSelectedList.map((item, index) => {
                  dimValueNmList.push(item.split('###')[1])
                })
              }
            }
            this.initDimValueInstruction(dimValueNmList, dimValueList);
          } else {
            let dimCode = this.config.selectedDim
            let dimSelectedList = this.config.selectDimValue.map(item => item.split('_')[0])
            let dimListDataNew = [
              {
                "name":"dataDimcodeList",
                "dimCode":dimCode,
                "dimName": "",
                "controlType":0,
                "isActive":false,
                "selectedOper":"in",
                "dimSelectedList":dimSelectedList,
                "dimSelectedNameList": this.config.selectDimValue,
                "dimSelected":[],
                "father":[],
                "children":[],
                "Operator":[],
                "type":false,
                "editName":"",
                "from": "bar"
              }
            ]
            this.initDimValueInstruction(this.config.dimValueNmList, dimSelectedList);
            obj.dimListData = dimListDataNew
          }
          const data = await this.getQueryPanelData({
            index: this.index,
            queryInfo: obj,
            dimList: []
           })
          const indexPaveDataList = this.handelPaveData(data)
          this.init('update', indexPaveDataList, 'pave')
        } else {
          const data = await this.getQueryPanelData({
            index: this.index,
            queryInfo: obj
           })
          this.init('update', data)
        }
      },
      async getQueryPanelData(params) {
        let data = await this.updateDataPre(params)
        if (data !== undefined) {
          data = JSON.parse(JSON.stringify(data))
          data = data.splice(0, 15)
        }
        // 无数据时的遮罩
        this.toggleNoData(data.length)
        return data
      },
      async getLinkInfoPanelData(params) {
        let data = await this.updateDataPre(params)
        if (data !== undefined) {
          data = JSON.parse(JSON.stringify(data))
          data = data.splice(0, 15)
        }
        return data
      }
    },
    beforeDestroy () {
      bus.$off(`updateOptionBar_${this.index}`)
      bus.$off(`updateData_${this.index}`)
      bus.$off(`resizeOrMove_${this.index}`)
      bus.$off(`updateLink_${this.index}`)
      bus.$off(`updateQuery_${this.index}`)
      bus.$off(`updateTimeAxis_${this.index}`)
      bus.$off(`updateIndexPave_${this.index}`)
      bus.$off(`updateDimValueTotal_${this.index}`)
    },
    mounted() {
      bus.$on(`updateData_${this.index}`, (obj) => {
        const startTime = this.option.nearUpdateTime[0]
        const endTime = this.option.nearUpdateTime[1]
        // this.initTimeAxisNew(startTime, endTime)
        // console.log(this.feature.styleConfig.config.timeAxis)
        const timeAxis = this.feature.styleConfig.config.timeAxis
        const currentPage = this.feature.styleConfig.config.currentPage
        const indexPave = this.feature.styleConfig.config.indexPave
        const dimFilter = this.feature.styleConfig.config.dimFilter
        const dimList = this.feature.dimList
        let selectDimValueList = this.feature.styleConfig.config.selectDimValue
        let selectDimValueCodeList = []
        if (selectDimValueList) {
          selectDimValueList.map((item, index) => {
           selectDimValueCodeList.push(item.split('_')[0])
          })
        }
        let dimValueNmList = this.feature.styleConfig.config.dimValueNmList
        if (indexPave && dimFilter && selectDimValueList.length) {
         const selectedDim = this.styleConfig.config.selectedDim
         let flag = false
          if (this.crossDimList) {
            this.crossDimList.map((item, index) => {
            if (item.dimCode === selectedDim) {
              flag = true
              return
            }
           })
          }
          if (!flag) {
            selectDimValueList = []
            dimValueNmList = []
            selectDimValueCodeList = []
            this.$store.commit('clearSelectedDim', {
             index: this.index
            })
            bus.$emit(`clearDimValue_${this.option.i}`, {
              index: this.index
            })
          }
        }
        // let dimCode = ''
        // if (dimList && dimList.length) {
        //   dimCode = dimList[0].dimCode
        // }
        let dimCode = this.styleConfig.config.selectedDim
        if (timeAxis && currentPage !== 0) {
          this.updateTimeAxis(startTime, endTime)
        } else if (indexPave && !dimFilter || indexPave && dimFilter && selectDimValueList.length === 0) {
           this.indexPave(startTime, endTime)
        } else if (indexPave && dimFilter) {
          this.dimValueTotal(startTime, endTime, selectDimValueCodeList, dimCode, dimValueNmList)
        }
        else {
          let data = obj.data
          if (data !== undefined) {
             data = JSON.parse(JSON.stringify(data))
             data = data.splice(0, 15)
          }
          this.init('update', data)
          this.loadingToggle(this.index, false)
        }
        this.toggleNoData(this.option.data.length)
      })
      bus.$on(`updateOptionBar_${this.index}`, (obj) => {
        this.updateEchart(obj.config)
      })
      bus.$on(`resizeOrMove_${this.index}`, () => {
        const _this = this
        this.$nextTick(() => {
          if (_this.chart) {
            const width = _this.chart.getWidth()
            this.width = width - 70 - 24
            this.pagerCount = 10
          }
        })
        if (this.chart) {
          this.chart.resize();
        }
      })
      bus.$on(`updateLink_${this.index}`, (obj) => {
        if (obj.toWho.includes(this.index)) {
          const timeAxis = this.styleConfig.config.timeAxis
          if (timeAxis) {
            return
          }
          const dimCode = obj.linkInfo.dimCode
          const dimValue = obj.linkInfo.dimValue
          const dimName = obj.linkInfo.dimName
          this.update(this.index, dimCode, dimValue, dimName)
        }
      })
      bus.$on(`updateQuery_${this.option.i}`, (obj) => {
        this.updateQueryPanel(obj)
      })
      bus.$on(`updateTimeAxis_${this.option.i}`, (obj) => {
        if (obj.value) {
          const legendShow = this.styleConfig.config.legend.show
          if (legendShow) {
             this.styleConfig.config.legendPosition = 'top'
             this.$store.commit('setBarLegendPosition', {
              index: obj.index,
              type: 'top',
              statue: false,
            })
          }
          const startTime = this.option.nearUpdateTime[0]
          const endTime = this.option.nearUpdateTime[1]
          const currentPage = 1
          this.timeParams.startTime = this.option.nearUpdateTime[0]
          this.timeParams.endTime = this.option.nearUpdateTime[1]
          this.timeParams.startCompareTime = this.timeParams.startTime
          this.timeParams.endCompareTime = this.timeParams.endTime
          this.changePageNew({
            startTime,
            endTime,
            startCompareTime: startTime,
            endCompareTime: endTime,
            currentPage
          })
        } else {
          this.restoreData()
        }
        const _this = this
        this.$nextTick(() => {
          if (_this.chart) {
              _this.chart.resize()
          }
        })
      })
      bus.$on(`updateIndexPave_${this.option.i}`, (obj) => {
        if (obj.value) {
          const startTime = this.option.nearUpdateTime[0]
          const endTime = this.option.nearUpdateTime[1]
          this.indexPave(startTime, endTime)
        } else {
           this.restoreData()
        }
      })
      bus.$on(`updateDimValueTotal_${this.option.i}`, (obj) => {
        const startTime = this.option.nearUpdateTime[0]
        const endTime = this.option.nearUpdateTime[1]
        this.dimValueTotal(startTime, endTime, obj.value, obj.dimCode, obj.dimValueNmList)
      })
      let data = this.data
      if (this.data !== undefined) {
        data = JSON.parse(JSON.stringify(this.data))
        data = data.splice(0, 15)
      }
      this.init('init', data)
      // 通知查询面板准备完毕
      this.$store.commit('chartsReady', {
        index: this.index
      })
    }
  }
</script>
<style lang="less">
  .bar{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .bar .container{
    flex: 1;
    width: 100%;
  }
  .bar .page {
    height: 30px;
    .dim-title{
       position: relative;
       overflow:hidden;
       padding-left:24px;
      text-overflow:ellipsis;
      white-space:nowrap;
      width:100%;
      height: 20px;
      text-align: left;
    }
  }
</style>
