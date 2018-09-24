/*
 * @Author: Jacob
 * @Date: 2018-04-26 10:13:20
 * @description: 漏斗图，用g2绘制，分为基础漏斗图和对比漏斗图，用户可自定义漏斗图的层数
 * @Last Modified by: Jacob
 * @Last Modified time: 2018-07-25 17:05:15
 * @leave: 1、图表联动 2、转化率 3、调样式 4、自己配双漏斗图
 */
<template>
  <div v-noData="{noDataLayer, containerHasTitle}" class="funnel-parent">
    <div :id="mountNode" :class="styleConfig.showNumber.show ? 'funnel' : 'funnel-no-number'" style="width:100%; height:100%;overflow: hidden;"></div>
  </div>
</template>

<script>
  import G2 from '@antv/g2'
  import { View } from '@antv/data-set'
  import bus from '../../utils/eventBus'
  import searchMixin from '../../../../api/search'
  import noDataMixin from '../mixins/noData/noDataMixin'
  import aliasMap from '../mixins/aliasChange/aliasMap'

  // 漏斗图label的配置，设在vuex里不能重新读取，htmlTemplate会解析不了
  const label = {
    // 文本线的配置，如果值为 false，表示不展示文本线
    labelLine: false,
    // 数值，设置坐标轴文本 label 距离坐标轴线的距离
    offset: 120,
    htmlTemplate (text, item, index) {
      let html = `
        <div style="font-size: 14px; display: flex; width: 400px">
          <span style="background: ${
            item.point.color
          }; width: 10px; height: 10px; margin-top: 8px; flex: none" ></span>
          <span style="margin: 0 20px 0 10px;padding-top: 3px;">${
            item.point.metricName
          }</span>
          <span style="color:#000; font-size: 16px;">${
            item.point.count
          }</span>
        </div>
      `

      return html
    }
  }

  export default {
    name: 'funnel',
    mixins: [searchMixin, noDataMixin, aliasMap],
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
      this.$nextTick(async () => {
        // 更新数据触发事件
        bus.$on(`updateData_${this.index}`, async (obj) => {
          // 点完更新按钮把层数设定的配置还原
          // 如果是编辑进来的时候不要还原,obj.init为true时是第一次进来
          if (!obj.init) {
            this.$store.commit('showFloorFunnel', {
              index: this.index,
              value: false,
              notEmit: true // 不要触发更新事件
            })
            // 更新事件默认是不带对比期查询的，所以禁用对比期勾选框
            this.$store.commit('showCompareTimeFunnel', {
              index: this.index,
              disableCompareTime: true,
              showDisableTime: true // 控制是否可用
            })
          }

          // 第一次进来初始化数据
          // 判断是不是自己配置了层数，如果配置了编辑进来时要按自定义的来
          if (!this.styleConfig.showFloor.show || !this.styleConfig.showFloor.nodeList.some(item => item.selectedOptions.length !== 0)) {
            await this.handleData({ data: this.data })
          }
          this.toggleNoData(this.data.length)
          this.data && this.data.length !== 0 && this.updateChart()
        })

        // 查询面板触发的事件过滤条件请求接口
        bus.$on(`updateQuery_${this.index}`, (obj) => {
          (async () => {
            const hasCompareDate = obj.dateData.length === 2
            const res = await this.updateDataPre(
              {
                index: this.index,
                rateType: hasCompareDate ? 4 : 0,
                queryInfo: obj
              }
            )
            this.toggleNoData(res.length)
            // 是否查到了结果
            if (!res || res.length === 0) {
              // this.$message.warning('没有查到数据')
            } else {
              // 判断是否带对比日期查询
              if(hasCompareDate) {
                this.$store.commit('showCompareTimeFunnel', {
                  index: this.index,
                  disableCompareTime: false,
                  dateData: obj.dateData,
                  showDisableTime: true // 控制是否可用
                })
              } else {
                this.$store.commit('showCompareTimeFunnel', {
                  index: this.index,
                  disableCompareTime: true,
                  dateData: obj.dateData,
                  showDisableTime: true // 控制是否可用
                })
              }
              // if (!obj.init) {
              //   // 点完查询按钮把层数设定的配置还原
              //   this.$store.commit('showFloorFunnel', {
              //     index: this.index,
              //     value: false,
              //     notEmit: true // 不要触发更新事件
              //   })
              // }

              // 判断是不是自己配置了层数，如果配置了编辑进来时要按自定义的来
              if (!this.styleConfig.showFloor.show || !this.styleConfig.showFloor.nodeList.some(item => item.selectedOptions.length !== 0)) {
                if (!res || res.length === 0) return
                await this.handleData({ data: res })
              }
              this.updateChart()
            }
          })()
        })

        // 监听拖拽
        bus.$on(`resizeOrMove_${this.index}`, async() => {
          // 先更新图表
          await this.updateChart()
          // 修改g-labels的宽度
          let gLable = document.querySelector('.g-labels')
          if (this.styleConfig.showNumber.show) {
            let gLables = gLable.querySelectorAll('.g-label')
            gLables && gLables.forEach((item, index) => {
              item.querySelector('div').style.width = document.getElementById(this.mountNode).offsetWidth / 3 + 'px'
              if (parseInt(item.querySelector('div').style.width) <= 200) {
                item.querySelector('div').querySelectorAll('span')[2].style.fontSize = '12px'
                item.querySelector('div').querySelectorAll('span')[2].style.marginTop = '4px'
                item.querySelector('div').querySelectorAll('span')[1].style.fontSize = '12px'
              } else if (parseInt(item.querySelector('div').style.width) <= 500 && parseInt(item.querySelector('div').style.width) > 200) {
                item.querySelector('div').querySelectorAll('span')[2].style.marginTop = '4px'
                item.querySelector('div').querySelectorAll('span')[2].style.fontSize = '14px'
                item.querySelector('div').querySelectorAll('span')[1].style.fontSize = '14px'
              } else {
                item.querySelector('div').querySelectorAll('span')[2].style.fontSize = '16px'
                item.querySelector('div').querySelectorAll('span')[1].style.fontSize = '16px'
              }
            })
          }
        })

        // 监听自定义的样式配置面板
        bus.$on(`updateFunnel_${this.index}`, async (obj) => {
          if(this.index === obj.index) {
            // 如果取消勾选层数设定，就把数据还原
            if (obj.hideFloor) {
              await this.handleData({ data: this.data })
            } else if (!obj.changeFloor){
              //  如果是否显示数值按钮勾选的时候不去处理数据
              if (!obj.hasOwnProperty('showNumber') && !obj.hasOwnProperty('showConvert')) {
                await this.handleData({ data: this.styleConfig.originData })
              }
            }
            obj.status !== 'up' && this.updateChart()
          }
        })

        // 监听自定义配置nodata的事件
        bus.$on(`changeNoData_${this.index}`, data => {
          this.toggleNoData(data.length)
        })

        // 通知查询面板准备完毕
        this.$store.commit('chartsReady', {
          index: this.index
        })


        // 第一次进来初始化数据
        // 判断是不是自己配置了层数，如果配置了编辑进来时要按自定义的来
        if (!this.styleConfig.showFloor.show || !this.styleConfig.showFloor.nodeList.some(item => item.selectedOptions.length !== 0)) {
          await this.handleData({ data: this.data })
        }
        this.data && this.data.length !==0 && this.init()

        G2.track(false) // 关闭G2体验计划
      })

    },
    methods: {
      init() {
        let configData = []
        let configPadding = []
        let itemTpl = ''
        let chartWidth = document.getElementById(this.mountNode).offsetWidth

        // 判断是否是对比数据
        if(this.styleConfig.showCompareTime.show) {
          configData = this.styleConfig.compareHandleData
          configPadding = [ 30, 120, 95 ]
          itemTpl = '<li data-index={index} style="margin-bottom:4px;">'
              + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
              + '{name}<br/>'
              + '<span style="padding-left: 16px">名称：{metricName}</span><br/>'
              + '<span style="padding-left: 16px">数值：{count}</span><br/>'
              + '<span style="padding-left: 16px">占比：{percent}</span><br/>'
              + '</li>'
        } else {
          configData = this.styleConfig.handleData
          configPadding = [ 20, 0, 20, 0 ]
          itemTpl = '<li data-index={index} style="margin-bottom:4px;">'
              + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
              + '{name}<br/>'
              + '<span style="padding-left: 16px">数值：{count}</span><br/>'
              // + '<span style="padding-left: 16px">占比：{percent}</span><br/>'
              + '</li>'
          if (this.styleConfig.showNumber.show) {
            chartWidth = chartWidth / 4 * 2
          } else {
            chartWidth = chartWidth / 4 * 3
          }
        }

        const dv = new View().source(configData)

        let data = dv.rows

        this.chart = new G2.Chart({
          container: this.mountNode,
          forceFit: false,
          height: document.getElementById(this.mountNode).offsetHeight,
          padding: configPadding,
          width: chartWidth
        })

        this.chart.source(data)

        this.chart.axis(false) // 不显示坐标轴
        this.chart.legend(false) // 不显示图例



        // 设置tooltip
        this.chart.tooltip({
          showTitle: false,
          crosshairs: false,
          itemTpl: itemTpl
        })

        // 设置坐标系类型, rect是直角坐标系
        this.chart.coord('rect').transpose().scale(1,-1)

        // 区分是单漏斗图还是双漏斗图
        if (this.styleConfig.showCompareTime.show) {
          this.chart.facet('mirror', {
            fields: [ 'period' ],
            transpose: true,
            padding: 5,
            eachView: (view, facet) => {
              view.interval()
                .position('metricName*count')
                .color('metricName', this.styleConfig.color)
                .shape('funnel')
                .tooltip('period*percent*metricName*count', (period, percent, metricName, count) => {
                  return {
                    name: period, // 此处字段名必须要是name，否则tooltip左右移动会有不更新的问题
                    metricName,
                    percent: parseFloat(percent * 100).toFixed(2) + '%',
                    count
                  };
                })
              data.map(obj => {
                if (obj.period === facet.colValue) {
                  view.guide().text({
                    top: true,
                    position: [obj.metricName, 'min'],
                    content: obj.count,
                    style: {
                      fill: '#fff',
                      fontSize: '12',
                      textAlign: facet.colIndex ? 'start' : 'end',
                      shadowBlur: 2,
                      shadowColor: 'rgba(0, 0, 0, .45)'
                    },
                    offsetX: facet.colIndex ? 10 : -10
                  });
                }
              })
            }
          })
        } else {
          this.chart.intervalSymmetric().position('metricName*count')
            .shape('funnel')
            .color('metricName', this.styleConfig.color)
            .label('metricName*count', (metricName, count) => {
              // 设置启动和关闭label
              if (this.styleConfig.showNumber.show) {
                return metricName + ' ' + count
              } else {
                return null
              }
          }, label)
            .tooltip('metricName*count', (metricName, count) => {
              return {
                name: metricName,
                // percent: parseFloat(percent * 100).toFixed(2) + '%',
                count: count
              }
            })

          // 判断是否显示数值
          if (this.styleConfig.showConvert.show) {
            data.forEach((obj, index, arrayList) => {
              // 中间标签文本
              this.chart.guide().text({
                top: true,
                position: {
                  metricName: obj.metricName,
                  count: 'median'
                },
                // content: parseFloat(obj.count * 100).toFixed(2) + '%', // 显示的文本内容
                content: index === arrayList.length -1 ? '' : parseFloat(( arrayList[index + 1]  ? arrayList[index + 1].count * 100 : 0 ) / (arrayList[index].count ? arrayList[index].count : 1)).toFixed(2) + '%' + ' ' + '转化率' + '                             ', // 最后一层不显示转化率， 最后的空格是为了将转化率居住对齐
                style: {
                  fill: '#fff',
                  fontSize: this.styleConfig.showNumber.show ? '12' : '14',
                  textAlign: 'center',
                  shadowBlur: 2,
                  shadowColor: 'rgba(0, 0, 0, .45)'
                }
              })
            })
          }
        }
        this.chart.render()
      },

      async updateChart () {
        if (this.chart && !this.chart.destroyed) {
          await this.chart.destroy()
        }
        this.init()
      },

      //处理数据，整合成我需要的格式
      handleData({ data, hasCompareDate = false }) {
        // 先获取指标编码和维值编码
        let metricList = JSON.parse(JSON.stringify(this.feature.metricList)).map(metric => {
          // 指标别名的应用
          const alias= this.getAliasByMetricCode(metric.metricCode)
          metric.metricName = alias === false ? metric.metricName : alias
          return metric
        })
        let handleData = [] // 处理后的数据

        if (data.length !== 0) {
          // 先判断是否打开了层数设定面板，分开处理数据
          if (this.styleConfig.showFloor.show) {
            data.forEach((item, index) => {
              if (item.dimValueList) {
                // 判断是否带维值
                handleData.push({
                  metricName: item.metricList.label + ' ' + item.dimValueList.dimValue, // 加上指标区分维值
                  count: Number(item[item.dimValueList.dimValueId])
                })
              } else {
                metricList.forEach((v, index2, arr) => {
                  if (item[v.metricCode]) {
                    handleData.push({
                      metricName: v.metricName,
                      count: Number(item[v.metricCode])
                    })
                  }
                })
              }
            })
            this.$store.commit('saveDataFunnel', { index:this.index, handleData })
          } else {
            // 判断是否带对比期查询,分开处理
            if (hasCompareDate) {
              let originData = {} // 不带对比的数据
              let compareData = {} // 对比的数据
              let copyArr = [] // 复制出来临时存放对比期数据的数组

              // 筛选数据，筛出原始数据和对比数据
              for (let key in data[0]) {
                if (!key.includes('_1') && !key.includes('_2') && !key.includes('_5') && !key.includes('_6')) {
                  originData[key] = data[0][key]
                } else if (key.includes('_5')) {
                  compareData[key] = data[0][key]
                }
              }

              handleData = metricList.map((v, index, arr) => ({
                period: '本期',
                metricName: v.metricName,
                count: Number(originData[v.metricCode]),
                // percent: arr[index + 1] ? Number(originData[arr[index + 1].metricCode]) / Number(originData[v.metricCode]) : null
              }))
              handleData.reverse()

              metricList.map((v, index, arr) => {
                copyArr.push({
                  period: '对比期',
                  metricName: v.metricName,
                  count: Number(compareData[v['metricCode'] + '_5']),
                  // percent: arr[index + 1] ? Number(compareData[arr[index + 1]['metricCode'] + '_5']) / Number(compareData[v['metricCode'] + '_5']) : null
                })
              })

              copyArr.reverse()

              handleData = handleData.concat(copyArr) // 数据合并

              // 存储对比数据，在合适的时候放出来
              this.$store.commit('saveCompareDataFunnel', { index:this.index, handleData })
            } else {
              metricList.forEach((v, index, arr) => {
                if (data[0][v.metricCode]) {
                  handleData.push({
                    metricName: v.metricName,
                    count: Number(data[0][v.metricCode]),
                    // percent: arr[index + 1] ? Number(data[0][arr[index + 1].metricCode]) / Number(data[0][v.metricCode]) : null
                  })
                }
              })
              this.$store.commit('saveDataFunnel', { index:this.index, handleData })
            }
          }
        }
      }
    },

    beforeDestroy() {
      bus.$off(`resizeOrMove_${this.index}`)
      bus.$off(`updateQuery_${this.index}`)
      bus.$off(`updateData_${this.index}`)
      bus.$off(`updateFunnel_${this.index}`)
      bus.$off(`changeNoData_${this.index}`)
    }
  }
</script>


<style lang="less">
  .funnel-parent{
    overflow: hidden;
  }

  .funnel {
    text-align: center;
    canvas {
      margin-left: 30%;
      margin-right: -10%;
    }
    .g-labels {
      left: 10% !important;
      .g-label {
        left: 0 !important;
        border-bottom: 1px dashed #ddd;
      }
    }
    .g2-tooltip{
      margin-left: 35%;
    }
  }
  .funnel-no-number{
    canvas {
      margin-left: 12%;
    }
  }
</style>

