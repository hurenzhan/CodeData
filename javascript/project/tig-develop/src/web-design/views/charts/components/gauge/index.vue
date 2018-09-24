<template>
  <div class="gauge" v-noData="{noDataLayer, containerHasTitle}">
    <div :id="chartId" style="width:100%; height: 100%"></div>
  </div>
</template>

<script>
  // 按需引入 echarts 模块
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts'
  // 引入折线图
  import 'echarts/lib/chart/gauge'
  // 引入提示框
  import 'echarts/lib/component/tooltip'
  // 引入图例
  import 'echarts/lib/component/legend'
  // 引入标题
  import 'echarts/lib/component/title'

  import bus from '../../utils/eventBus'
  import {sendLinkInfo} from '../../utils/utils'
  import search from '../../../../api/search'
  import configClass from '../../static/configClass'
  import * as operateApi from './gauge'
  import noDataMixin from '../mixins/noData/noDataMixin'
  import aliasMap from '../mixins/aliasChange/aliasMap'
  export default {
    name: 'chartGauge',
    mixins: [search, configClass, noDataMixin, aliasMap],
    components: {
    },
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
    created() {

    },
    computed: {
      chartId () {
        return `chartLine-${this.index}`
      },
      title () {
        if (this.$store.state.charts.chartsOption[this.index].name === '') {
          return '请在右侧输入标题'
        } else {
          return this.$store.state.charts.chartsOption[this.index].name
        }
      },
      chartsOption() {
        return this.$store.state.charts.chartsOption
      },
      styleConfig:  {
        get () {
          return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config
        },
        set () {}
      }
    },
    methods: {
      initEchart (data) {
        // console.log('initEchart', data)
        // 获取维度数据
        let dimList = this.chartsOption[this.index].feature.dimList

        // 获取指标数据
        let metricList = JSON.parse(JSON.stringify(this.chartsOption[this.index].feature.metricList)).map(metric => {
          const alias = this.getAliasByMetricCode(metric.metricCode)
          metric.metricName = alias === false ? metric.metricName : alias
          return metric
        })

        this.styleConfig.series = this.getSeriesData(data, metricList)
        // 保存刻度
        this.setNewValue(this.styleConfig.series)

        // 初始化
        this.chart = echarts.init(document.getElementById(this.chartId))
        // 绘图
        this.chart.setOption(this.styleConfig, true)
      },
      // 数据变化时 => 1.销毁 2.初始化数据 3.根据operate生成配置文件 4.重绘图形
      redrawEchart (data) {
        // console.log('redrawEchart')
        // 获取数据更新前的操作记录
        let operate = this.styleConfig.operate
        let initData = JSON.parse(JSON.stringify(this.styleConfig.initData))
        if (this.chart) {
          this.chart.clear()
        }
        // 生成默认的line配置
        let gauge = new configClass.Gauge()
        // 保存操作记录
        gauge.config.operate = operate
        // 对新字段 targetValue 进行版本兼容
        if (initData.targetValue === undefined) {
          initData.targetValue = initData.max
        }
        gauge.config.initData = initData
        this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config = gauge.config

        // 获取指标数据 包括指标名同步
        let metricList = JSON.parse(JSON.stringify(this.chartsOption[this.index].feature.metricList)).map(metric => {
          const alias = this.getAliasByMetricCode(metric.metricCode)
          metric.metricName = alias === false ? metric.metricName : alias
          return metric
        })
        this.styleConfig.series = this.getSeriesData(data, metricList)

        // 保存刻度
        this.setNewValue(this.styleConfig.series, initData)

        // 初始化仪表盘
        this.chart = echarts.init(document.getElementById(this.chartId))

        // 回滚配置项
        operateApi.analyzeOpetate(gauge.config, this.$store, this.index)
        // 绘图
        this.chart.setOption(this.styleConfig, true)
        // 初始化style
        bus.$emit('initStyle', {
          index: this.index
        })
      },
      // 更新线图样式  setOption => 线图配置样式数据
      updateEchart (setOption) {
        this.chart.setOption(setOption, true)
      },
      // 获取 series数据
      getSeriesData (data, metricList) {
        let series = []
        let length = metricList.length
        // 处理多指标的数据
        for (let i = 0; i < length; i++) {
          //let unit = metricList[i].mulUnits[0].unitNm
          let unit = metricList[i].mulUnits.filter(item => item.unitCode === metricList[i].unitSelected)[0].unitNm
          let key = metricList[i].metricCode
          let dataArr = data.map((item, index) => {
            return {
              value: parseInt(item[key]),
              name: `${metricList[i].metricName} : ${item[key]} (${unit})`
            }
          })
          let min = Math.min(0, Math.ceil(dataArr[0].value))
          let max = Math.max(0, Math.ceil(dataArr[0].value))
          series.push({
            type: 'gauge',
            radius: '85%',
            name: metricList[i].metricName,
            min: min,
            max: max,
            splitNumber: 5,
            data: dataArr,
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                // color: [[1, '#51A6FF']],
                color: this.getSingleArea(min, max, dataArr[0].value, '#51A6FF'),
                defaultColor: [[0.2, '#597EF7'], [0.4, '#8B9EF7'], [0.6, '#CBDB37'], [0.8, '#FFE070'], [1, '#E78A5F']],
                width: 20
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              length: 20,
              lineStyle: {
                width: 2,
                color: '#ffffff'
              }
            },
            detail: {
              show: true,
              offsetCenter: [0, '95%'],
              // color: 'rgba(0,0,0,0.85)',
              color: '#666666',
              fontSize: 14,
              textShadowColor: 'rgba(0,0,0,0.12)',
              textShadowOffsetX: 0,
              textShadowOffsety: 14,
              textShadowBlur: 10,
              formatter: (value) => {
                let min = Math.min(0, Math.ceil(dataArr[0].value))
                let max = Math.max(0, Math.ceil(dataArr[0].value))
                let targetValue = Math.max(0, Math.ceil(dataArr[0].value))
                let top = value - min
                let bottom = targetValue - min
                return `完成率 ${((top/bottom) * 100).toFixed(2)}%`
              }
            },
            pointer: {
              show: true,
              width: 6,
              length: '70%'
            },
            itemStyle: {
              borderType: 'dotted',
              opacity: 1,
              backgroundColor: 'red',
              zIndex: 20
            },
            title : {
              show : true,
              offsetCenter: [0, '80%'],
              color: '#666666',
              fontSize : 14,
              lineHeight: 20,
              zIndex: 10
            },
            axisLabel: {
              show: true,
              distance: 5,
              color: '#999999',
              fontSize: 12,
              formatter: (value) => {
                if (parseInt(value) >= 1000000) {
                  return (value / 1000000).toFixed(2) + 'M'
                } else if (parseInt(value) >= 1000) {
                  return (value / 1000).toFixed(2) + 'K'
                } else {
                  return `${value}`
                }
              }
            }
          })
        }
        // console.log('series', series)
        return series
      },
      // 单色模式下 根据刻度和指针目标值重新计算颜色分割区域
      getSingleArea (min ,max, value, color) {
        // let colorArea = (value / (max- min)).toFixed(2)
        let colorArea = (value - min) / (max - min)
        if (colorArea === 1) {
          return [[1, color]]
        } else {
          return [[colorArea, color], [1, '#eeeeee']]
        }
      },
      // 重新设置仪表盘的默认刻度，最大刻度和最小刻度
      setNewValue (series, initData) {
        // console.log(initData !== undefined && initData.hasEdit)
        // 如果刻度是被修改过的，优先启用修改的刻度
        if (initData !== undefined && initData.hasEdit) {
          // 设置仪表盘默认的最小刻度
          this.$store.commit('setMinValue', {
            index: this.index,
            value: initData.min
          })
          // 设置仪表盘默认的最大刻度
          this.$store.commit('setMaxValue', {
            index: this.index,
            value: initData.max
          })
          // 设置仪表盘默认的目标刻度
          this.$store.commit('setTargetValue', {
            index: this.index,
            value: initData.targetValue
          })
        } else {
          let min = Math.min(parseFloat(series[0].min), parseFloat(series[0].max))
          let max = Math.max(parseFloat(series[0].min), parseFloat(series[0].max))
          // 设置仪表盘默认的最小刻度
          this.$store.commit('setMinValue', {
            index: this.index,
            value: min
          })
          // 设置仪表盘默认的最大刻度
          this.$store.commit('setMaxValue', {
            index: this.index,
            value: max
          })
          // 设置仪表盘默认的目标刻度
          this.$store.commit('setTargetValue', {
            index: this.index,
            value: max
          })
        }
      }
    },
    mounted() {
      // 监听style 选项变化更新图表
      bus.$on(`updateGauge_${this.index}`, (obj) => {
        if (this.index === obj.index) {
          this.updateEchart(obj.config)
        }
      })

      // 监听数据源变化 更新图表
      bus.$on(`updateData_${this.index}`, () => {
        this.toggleNoData(this.chartsOption[this.index].data.length)
        this.redrawEchart(this.chartsOption[this.index].data)
      })

      // 查询面板联动
      bus.$on(`updateQuery_${this.index}`, (obj) => {
        // console.log('get = > updateQuery', obj)
        if (obj.selectedTable.includes(this.index)) {
          (async () => {
            const data = await this.updateDataPre(
              {
                index: this.index,
                queryInfo: obj
              }
            )
            this.toggleNoData(data.length)
            data && data.length !== 0 && this.redrawEchart(data)
          })()
        }
      })

      // 容器的拖拽行为 line图进行自适应
      bus.$on(`resizeOrMove_${this.index}`, obj => {
        this.$nextTick(() => {
          if (this.chart) {
            this.chart.resize()
          }
        })
      })
      // 初始化Echart
      if (this.chartsOption[this.index].data.length > 0){
        this.initEchart(this.chartsOption[this.index].data)
      }
      // 通知查询面板准备完毕
      this.$store.commit('chartsReady', {
        index: this.index
      })
    },
    beforeDestroy() {
      bus.$off(`resizeOrMove_${this.index}`)
      bus.$off(`updateQuery_${this.index}`)
      bus.$off(`updateData_${this.index}`)
      bus.$off(`updateGauge_${this.index}`)
    }
  }
</script>
<style lang="less">
  .switch{
    position: absolute;
    top: 0px;
    right: 50px;
    z-index: 50;
  }
  .title{
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 10px;
    line-height: 20px;
  }
  .el-switch__label * {
    line-height: 20px;
    font-size: 12px;
  }
</style>
