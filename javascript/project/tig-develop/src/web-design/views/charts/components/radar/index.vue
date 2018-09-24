<template>
  <div class="radar" v-noData="{noDataLayer, containerHasTitle}">
    <div :id="chartId" style="width:100%; height:100%"></div>
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts'
  // 引入折线图
  import 'echarts/lib/chart/radar'
  // 引入提示框
  import 'echarts/lib/component/tooltip'
  // 引入图例
  import 'echarts/lib/component/legend'
  // 引入标题
  import 'echarts/lib/component/title'

  import bus from '../../utils/eventBus'
  import {sendLinkInfo} from '../../utils/utils'
  import search from '../../../../api/search'
  import noDataMixin from '../mixins/noData/noDataMixin'
  export default {
    name: 'Radar',
    props: {
      index: {
        default: 0
      },
    },
    data() {
      return {
        chart: null
      }
    },
    computed: {
      chartId () {
        return `chartRadar-${this.index}`
      },
      styleConfig () {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
      },
      config () {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config
      },
      chartsOption () {
        return this.$store.state.charts.chartsOption
      },
      data () {
        return this.$store.state.charts.chartsOption[this.index].data
      },
      feature () {
       return this.$store.state.charts.chartsOption[this.index].feature
      }
    },
    mixins: [search, noDataMixin],
    methods: {
      drawCharts (seriesData, legendData, indicator, metricName) {
        const chart = echarts.init(document.getElementById(this.chartId))
        this.chart = chart
        if (seriesData !== undefined) {
          // 求最大值
          this.config.maxValue = Math.ceil(Math.max(...seriesData[0].data.map(item => {
            return Math.max(...item.value.map(val => +(val || 0)))
          })) * 1.1)
          // radar 各坐标系最大值
          this.config.radar.indicator = indicator.map(item => {
            return {text: item, max: this.config.maxValue}
          })
          this.config.series = seriesData
        }
        if (legendData !== undefined) {
          this.config.legend.data = legendData
        }
        if (metricName !== undefined) {
          this.config.title.text = metricName
        }
        try {
          chart.setOption(this.config, true)
        } catch (e) {}
      },
      handelData(mockData) {
        const retObj = {}
        const series = [{
          name: 'radar',
          type: "radar",
          tooltip: {
            trigger: 'item'
          },
          areaStyle: {
            normal: {
              opacity: 0.2
            }
          },
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default'
              }
            }
          },
          data: []
        }]
        const legend = []
        let dimCode = ''
        if (this.feature.dimList.length > 0) {
          dimCode = this.feature.dimList[0].dimCode
        }
        this.feature.metricListFlat.map((itemMetric, indexMetric) => {
          legend.push(itemMetric.metricName)
          let obj = {
            name: itemMetric.metricName,
            value: []
          }
          mockData.map((item, index) => {
            obj.value.push(item[itemMetric.metricCode])
          })
          series[0].data.push(obj)
        })
        retObj.seriesData = series
        retObj.legendData = legend
        retObj.indicator = mockData.map(item => item[dimCode])
        return retObj
      },
      init(type, data) {
        const handelData = this.handelData(data)
        const legendData = handelData.legendData
        const seriesData = handelData.seriesData
        const indicator = handelData.indicator
        const metricName = handelData.metricName
        if (type === 'update') {
          // 初始化操作
          this.$store.commit('initRadarConfig', {
              index: this.index
          })
          this.drawCharts(seriesData, legendData, indicator, metricName)
          // 点击轴标题可发射联动事件
          this.chart.on('click', this.sendMessage)
        } else {
          this.drawCharts(seriesData, legendData, indicator, metricName)
          // 点击轴标题可发射联动事件
          this.chart.on('click', this.sendMessage)
        }
      },
      // 发射事件的处理
      sendMessage (params) {
        if (params === undefined) {
          return false
        }
        if (params.targetType === 'axisName') {
          const dimCode = this.chartsOption[this.index].feature.dimList[0].dimCode
          const dimValue = params.name
          const linkInfo = {
            dimCode,
            dimValue
          }
          sendLinkInfo(this.chartsOption, this.index, linkInfo)
        }
      },
      // 配置项改变，更新echarts视图
      updateEchart (setOption) {
        if (this.chart !== null) {
          this.chart.setOption(this.config, true)
          // if (setOption !== null) {
          //   setOption.data.indicator && setOption.data.indicator.splice(20)
          //   setOption.radar.indicator.splice(20)
          //   try {
          //     this.chart.setOption(setOption, true)
          //   } catch (e) {}
          // }
        }
      },
      // 数据变化时,重绘
      redrawEchart (data) {
        if (this.chart) {
          this.chart.off('click', this.sendMessage)
          this.chart.clear()
        }
        // 重新绘图
        data.splice(20)
        this.init('update', data)
      }
    },
    beforeDestroy () {
      bus.$off(`updateOptionRadar_${this.index}`)
      bus.$off(`updateData_${this.index}`)
      bus.$off(`updateLink_${this.index}`)
      bus.$off(`updateQuery_${this.index}`)
      bus.$off(`resizeOrMove_${this.index}`)
    },
    mounted() {
      // 监听style 选项变化更新图表
      bus.$on(`updateOptionRadar_${this.index}`, (obj) => {
        if (this.index === obj.index) {
          this.updateEchart(obj.config)
        }
      })
      // 监听数据源变化 更新图表
      bus.$on(`updateData_${this.index}`, () => {
        this.redrawEchart(this.chartsOption[this.index].data)
        // 无数据时的遮罩
        this.toggleNoData(this.chartsOption[this.index].data.length)
      })
      // 数据联动显示
      bus.$on(`updateLink_${this.index}`, (obj) => {
        if (obj.toWho.includes(this.index)) {
          (async () => {
            let data = await this.updateDataPre({
              index: this.index,
              linkInfo: obj.linkInfo
            })
            this.redrawEchart(data)
          })()
        }
      })
      // 查询面板联动
      bus.$on(`updateQuery_${this.index}`, (obj) => {
        (async () => {
          let data = await await this.updateDataPre(
            {
              index: this.index,
              queryInfo: obj
            }
          )
          if (data !== undefined) {
            data = JSON.parse(JSON.stringify(data))
            data = data.splice(0, 20)
          }
          this.init('update', data)
          this.toggleNoData(data.length)
        })()
      })
      // 自适应
      bus.$on(`resizeOrMove_${this.index}`, () => {
        if (this.chart) {
          try {
            this.chart.resize();
          } catch (e) {}
        }
      })
      // 初始化Echart
      // let data = this.data
      // if (this.data !== undefined) {
      //   data = JSON.parse(JSON.stringify(this.data))
      //   data = data.splice(0, 20)
      // }
      // 初始化
      if (!(this.styleConfig.config.series.length > 0)){
        this.init('init', this.data)
      }
      // 通知查询面板准备完毕
      this.$store.commit('chartsReady', {
        index: this.index
      })
    }
  }
</script>
<style lang="less">
</style>
