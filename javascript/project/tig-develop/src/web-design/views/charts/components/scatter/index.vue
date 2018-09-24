<template>
  <div class="scatter">
    <div :id="chartId" style="width:100%; height: 100%"></div>
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts'
  // 引入折线图
  import 'echarts/lib/chart/scatter'
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
  import * as operateApi from './scatter'
  export default {
    name: 'scatter',
    mixins: [search, configClass],
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
      },
      isSwitch () {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.switchTable
      }
    },
    methods: {
      // 线图初始化
      initEchart (data) {
        // 获取Data
        if (data === 'undefined') {
          data = this.chartsOption[this.index].data
        }
        // 获取维度数据
        let dimList = this.chartsOption[this.index].feature.dimList
        // 获取指标数据
        let metricList = this.chartsOption[this.index].feature.metricList

        this.styleConfig.series = this.getSeriesData(data, metricList, dimList)

        // 获取图例数据
        this.styleConfig.legend.data = this.getLegendData(dimList)

        // 初始化线图
        this.chart = echarts.init(document.getElementById(this.chartId))

        // 注册点击事件 触发联动
        this.chart.on('click', (params) => {
          let  dimCode = this.chartsOption[this.index].feature.dimList[0].dimCode
          let dimValue = params.name
          let linkInfo = {
            dimCode,
            dimValue
          }
          sendLinkInfo(this.chartsOption, this.index, linkInfo)
        })

        // 绘图
        this.chart.setOption(this.styleConfig, true)
      },
      // 数据变化时 => 1.销毁line 2.初始化数据 3.根据operate生成配置文件 4.重绘图形
      redrawEchart (data) {
        // 获取数据更新前的操作记录
        let operate = this.styleConfig.operate
        console.log(operate)
        // 销毁当前line图
        if (this.chart) {
          this.chart.clear()
        }
        // 生成默认的line配置
        let scatter = new configClass.Scatter()
        // 保存操作记录
        scatter.config.operate = operate
        this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config = scatter.config

        // 获取维度数据
        let dimList = this.chartsOption[this.index].feature.dimList

        // 获取指标数据
        // let metricList = this.chartsOption[this.index].feature.metricList
        let metricList = this.chartsOption[this.index].feature.metricListFlat

        // 获取散点图series
        this.styleConfig.series = this.getSeriesData(data, metricList, dimList)

        // 获取图例数据
        this.styleConfig.legend.data = this.getLegendData(dimList)

        // 初始化线图
        this.chart = echarts.init(document.getElementById(this.chartId))

        // 注册点击事件 触发联动
        this.chart.on('click', (params) => {
          let  dimCode = this.chartsOption[this.index].feature.dimList[0].dimCode
          let dimValue = params.name
          let linkInfo = {
            dimCode,
            dimValue
          }
          sendLinkInfo(this.chartsOption, this.index, linkInfo)
        })

        // 回滚配置项
        operateApi.analyzeOpetate(scatter.config, this.$store, this.index)
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
      // 获取series数据
      getSeriesData (data, metricList, dimList) {
        let series = []
        let length = dimList.length
        // 处理多指标的数据
        for (let i = 0; i < length; i++) {
          let dimkey = dimList[i].dimCode
          let DataArr = data.map((item, index) => {
            let target = []
            // 取指标数据
            for (let i = 0; i < metricList.length; i++) {
              let key = metricList[i].metricCode
              target.push(item[key])
            }
            // 取维度数据
            target.push(item[dimkey])
            return target
          })
          series.push({
            name: dimList[i].dimName,
            type: 'scatter',
            lineStyle: {
              width: 1
            },
            data: DataArr,
            symbolSize: 20,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(25, 100, 150, 0.5)',
                shadowOffsetY: 5
              }
            }
          })
        }
        return series
      },
      // 获取图例数据
      getLegendData (dimList) {
        return dimList.map((item, index) => {
          return {
            name: item.dimName
          }
        })
      }
    },
    mounted() {
      // 监听style 选项变化更新图表
      bus.$on(`updateScatter_${this.index}`, (obj) => {
        if (this.index === obj.index) {
          this.updateEchart(obj.config)
        }
      })

      // 监听数据源变化 更新图表
      bus.$on(`updateData_${this.index}`, () => {
        console.log(this.$store.state.charts.chartsOption[this.index].feature)
        console.log(this.chartsOption[this.index].data)
        this.redrawEchart(this.chartsOption[this.index].data)
      })

      // 数据联动显示
      bus.$on(`updateLink_${this.index}`, (obj) => {
        // console.log('get = > updateLink', obj)
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
        // console.log('get = > updateQuery', obj)
        if (obj.selectedTable.includes(this.index)) {
          (async () => {
            const data = await this.updateDataPre(
              {
                index: this.index,
                queryInfo: obj
              }
            )
            this.redrawEchart(data)
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

      // 初始化数据和配置
      if (!(this.styleConfig.series.length > 0)) {
        this.initEchart(this.chartsOption[this.index].data)
      }

      // 通知查询面板准备完毕
      this.$store.commit('chartsReady', {
        index: this.index
      })
    },
    beforeDestroy() {
      bus.$off(`resizeOrMove_${this.index}`)
      bus.$off(`updateLink_${this.index}`)
      bus.$off(`updateQuery_${this.index}`)
      bus.$off(`updateData_${this.index}`)
      bus.$off(`updateScatter_${this.index}`)
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
