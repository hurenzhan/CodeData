/*
 * @Author: Jacob
 * @Date: 2018-04-17 11:22:30
 * @Last Modified by: Jacob
 * @Description: 词云图，使用antv/g2来实现
 * @Last Modified time: 2018-06-15 15:12:36
 */
<template>
  <div v-noData="{noDataLayer, containerHasTitle}">
    <div :id="mountNode" style="width:100%; height:100%; overflow:hidden;" class="word-cloud"></div>
  </div>
</template>

<script>
  import G2 from '@antv/g2'
  import { View } from '@antv/data-set'
  import bus from '../../utils/eventBus'
  import searchMixin from '../../../../api/search'
  import noDataMixin from '../mixins/noData/noDataMixin'

  // 给point注册一个词云的shape
  G2.Shape.registerShape('point', 'cloud', {
    drawShape(cfg, container) {
      return container.addShape('text', {
        attrs:{
          fillOpacity: cfg.opacity,
          fontSize: cfg.origin._origin.size,
          rotate: cfg.origin._origin.rotate,
          text: cfg.origin._origin.text,
          textAlign: 'center',
          fontFamily: cfg.origin._origin.font,
          fill: cfg.color,
          textBaseline: 'Alphabetic',
          ...cfg.style,
          x: cfg.x,
          y: cfg.y,
        }
      })
    }
  })

  export default {
    name: 'wordCloud',
    mixins: [searchMixin, noDataMixin],
    // 传过来的当前容器的索引
    props: {
      index: {
        default: 0
      }
    },
    computed: {
      // 关系图挂载的容器id，针对不同的面板窗口索引挂载不同的ID
      mountNode() {
        return `mountNode-${this.index}`
      },
      // 获取vuex公共数据,展示联动
      currentContainer () {
        return this.$store.state.charts.chartsOption[this.index]
      },
      // 当前面板索引请求接口后获得的数据
      data() {
        return this.currentContainer.data
      },
      // 获取当前面板索引的样式面板的属性
      feature() {
        return this.currentContainer.feature
      },
      // 获取样式的配置信息
      styleConfig() {
        return this.currentContainer.feature.styleConfig.config
      },
      preview () {
        return this.$store.state.charts.previewToggle
      }
    },
    mounted () {
      this.$nextTick(() => {
        // 更新数据触发事件
        bus.$on(`updateData_${this.index}`, (obj) => {
          this.toggleNoData(this.data.length)
          this.data && this.data.length !== 0 && this.updateChart(this.data, this.styleConfig.tooltip.show)
        })

        // 查询面板触发的事件过滤条件请求接口
        bus.$on(`updateQuery_${this.index}`, (obj) => {
          (async () => {
            const res = await this.updateDataPre(
              {
                index: this.index,
                rateType: obj.dateData.length === 2 ? 4 : 0,
                queryInfo: obj
              }
            )
            this.toggleNoData(res.length)
            res && res.length !== 0 && this.updateChart(res, this.styleConfig.tooltip.show)
          })()
        })

        // 监听拖拽
        bus.$on(`resizeOrMove_${this.index}`, () => {
          this.updateChart(this.data, this.styleConfig.tooltip.show)
        })

        // 监听自定义的样式配置面板
        bus.$on(`updateWordCloud_${this.index}`, (obj) => {
          if(this.index === obj.index) {
            this.chart.tooltip(obj.config.tooltip.show, {showTitle: false})
            this.chart.render()
          }
        })

        this.data && this.data.length !== 0 && this.init(this.data, this.styleConfig.tooltip.show) // 初始化

        // 通知查询面板准备完毕
        this.$store.commit('chartsReady', {
          index: this.index
        })

        G2.track(false) // 关闭G2体验计划
      })
    },
    methods: {
      async init(data, showToolTip) {
        // 如果有数据再生成
        if (data) {
          // 获取画布宽高
          let chartWidth = document.getElementById(this.mountNode).offsetWidth
          let chartHeight = document.getElementById(this.mountNode).offsetHeight
          await this.handleData(data) // 获取处理后的数据并保存到vuex
          const dv = new View().source(this.styleConfig.handleData)
          const range = dv.range('value')
          const min = parseInt(range[0])
          const max = parseInt(range[1])

          // console.log(max, min)

          dv.transform({
              type: 'tag-cloud',
              fields: ['dimName', 'value', 'metricName'],
              size: [chartWidth, chartHeight],
              font: 'Verdana',
              padding: 10,
              timeInterval: 5000, // max execute time
              rotate() {
                  let random = ~~(Math.random() * 4) % 4;
                  if (random == 2 || random == 3 || random == 1) {
                      random = 0
                  }
                  return 0 * 90; // 0 固定为0，就是不旋转，如果需要旋转的话就改变上面random的值
              },
              fontSize(d) {
                  if (d.value) {
                    // 判断字体大小，如果超过80就无法显示了，给一个默认值60
                    return (((d.value - min) / (max - min)) * (80 - 24) + 12) > 60 ? 60 : (((d.value - min) / (max - min)) * (80 - 24) + 12)
                  }
                  return 0;
              }
          })
          // 生产G2画布
          this.chart = new G2.Chart({
              container: this.mountNode,
              width: chartWidth,
              height: chartHeight,
              forceFit: true,
              padding: 0,
          });

          // 为 chart 装载数据，返回 chart 对象
          this.chart.source(dv, {
            dimName: {
              alias: '维值'
            },
            value: {
              alias: '数值'
            },
            metricName: {
              alias: '指标'
            }
          });
          // 图例，默认不开启
          this.chart.legend(false);
          // 坐标轴，默认不开启
          this.chart.axis(false);
          // 提示信息，默认不开启
          this.chart.tooltip(showToolTip, {
            showTitle: false
            // 如果要写回调函数这里要定义好模板
            // itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          })
          // 坐标系：reflect: 镜像, 沿 x 方向镜像或者沿 y 轴方向映射。
          this.chart.coord().reflect();

          // 创建点图图，返回一个 geom 对象
          this.chart.point()
              .position('x*y')
              .color('dimName')
              .shape('cloud')
              .tooltip('dimName*value*metricName')

          this.chart.render() // 渲染画布
        }
      },
      async updateChart (data, showToolTip = false) {
        if (this.chart && !this.chart.destroyed) {
          await this.chart.destroy()
        }
        this.init(data, showToolTip)
      },
      //处理数据，整合成我需要的格式
      handleData(data) {
        // 先获取指标编码和维值编码
        const metricCode = this.feature.metricList[0].metricCode
        const dimCode = this.feature.dimList[0].dimCode
        const metricName = this.feature.metricList[0].metricName

        let handleData = data.filter(item => {
          return item[dimCode] !== '-' && item[dimCode] !== ''
        }).map(v => ({
          'dimName': v[dimCode],
          'value': Number(v[metricCode]) ? Number(v[metricCode]) : 0,
          'metricName': metricName,
        }))

        this.$store.commit('saveHandleData', { index:this.index, handleData })
      }
    },
    beforeDestroy() {
      bus.$off(`resizeOrMove_${this.index}`)
      bus.$off(`updateQuery_${this.index}`)
      bus.$off(`updateData_${this.index}`)
      bus.$off(`updateWordCloud_${this.index}`)
    }
  }
</script>


