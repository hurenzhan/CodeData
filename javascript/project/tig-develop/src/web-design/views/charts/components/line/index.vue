<template>
  <div class="line" v-noData="{noDataLayer, containerHasTitle}">
    <div class="switch" v-if="isSwitch">
      <el-switch v-model="isEchart" size="small" active-text="线图" inactive-text="表格" @change="changeTyle"></el-switch>
    </div>
    <div v-show="isEchart" class="chart-container" :id="chartId" style="width:100%; height: 100%"></div>
    <div v-if="!isEchart" class="table">
      <el-table
        size="small"
        ref="multipleTable"
        highlight-current-row
        :data="table"
        style="width: 100%"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column
          :prop="list"
          :label="tableHead[index]"
          align="center"
          :key="list"
          v-for="(list, index) in tableProp">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts'
  // 引入折线图
  import 'echarts/lib/chart/line'
  // 引入提示框
  import 'echarts/lib/component/tooltip'
  // 引入图例
  import 'echarts/lib/component/legend'
  // 引入可滚动的图例
  import 'echarts/lib/component/legendScroll'
  // 引入缩放插件
  import 'echarts/lib/component/dataZoom'
  // 引入标题
  import 'echarts/lib/component/title'

  import bus from '../../utils/eventBus'
  import {sendLinkInfo, getDimValueByType} from '../../utils/utils'
  import search from '../../../../api/search'
  import configClass from '../../static/configClass'
  import * as operateApi from './operate'
  import noDataMixin from '../mixins/noData/noDataMixin'
  import aliasMap from '../mixins/aliasChange/aliasMap'
  export default {
    name: 'chartLine',
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
        chart: null,
        table: [],
        tableProp: [],
        tableHead: [],
        isEchart: true
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
      },
      // 判断当前维度是否是时间维度
      isTime () {
        if (this.chartsOption[this.index].feature.dimList[0].dimCode === 'dasp_date') {
          return true
        } else {
          return false
        }
      },
      // 当前是否启用自定义查询时间
      isTimeSet () {
        return this.styleConfig.isTimeSet
      },
      // 当前时间粒度是否为'天'
      timeType () {
        return this.chartsOption[this.index].timeQueryCycle
      },
      // 获取自定义查询时间
      numberTime () {
        return this.styleConfig.numberTime
      },
      // 是否启用累计
      isValueSum () {
        let chart = this.$store.state.charts.chartsOption[this.index]
        return this.isTime && !parseInt(chart.sortByWhich) && !parseInt(chart.sortType) && this.styleConfig.isValueSum
      }
    },
    methods: {
      // 线图初始化
      initEchart (data) {
        // console.log('initEchart')
        // 获取Data
        if (data === 'undefined') {
          data = this.chartsOption[this.index].data
        }
        // 获取维度数据
        let dimList = this.chartsOption[this.index].feature.dimList
        // 获取指标数据
        // let metricList = this.chartsOption[this.index].feature.metricList
        let metricList = this.chartsOption[this.index].feature.metricListFlat

        this.styleConfig.series = this.getSeriesData(data, metricList)
        this.styleConfig.xAxis[0].data = this.getXdata(data, dimList)
        // 折线图样式特殊处理
        if (this.styleConfig.xAxis[0].data && this.styleConfig.xAxis[0].data.length > 10) {
          this.styleConfig.xAxis[0].rotate = -30
          this.styleConfig.xAxis[0].showMaxLabel = false
        }
        this.styleConfig.legend.data = this.getLegendData(metricList)
        // 初始化x、y轴标题
        this.initXYName(dimList, metricList)
        // 初始化线图
        this.chart = echarts.init(document.getElementById(this.chartId))
        // 时间维度 不做标签截断的任何处理
        if (dimList && dimList.length === 1 && dimList[0].dimCode === 'dasp_date') {
          this.styleConfig.xAxis[0].axisLabel.formatter = (params, index) => {
            return params
          }
        }
        // 注册点击事件 触发联动
        this.chart.on('click', this.sendMessage)

        // 只有一个维值时 显示柱状图
        this.setChartType()
        // 绘图
        this.chart.setOption(this.styleConfig, true)

        // 初始化表格数据
        this.getTableData(data, dimList, metricList)
      },
      // 数据变化时 => 1.销毁line 2.初始化数据 3.根据operate生成配置文件 4.重绘图形
      redrawEchart (data) {
        // 获取数据更新前的操作记录
        let operate = this.styleConfig.operate
        // 销毁当前line图
        if (this.chart) {
          this.chart.off('click', this.sendMessage)
          this.chart.clear()
        }
        // 生成默认的line配置
        let line = new configClass.Line()
        this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config = line.config

        // 获取维度数据
        let dimList = this.chartsOption[this.index].feature.dimList
        // 获取指标数据
        // let metricList = this.chartsOption[this.index].feature.metricList
        let metricList = this.chartsOption[this.index].feature.metricListFlat

        this.styleConfig.series = this.getSeriesData(data, metricList)
        this.styleConfig.xAxis[0].data = this.getXdata(data, dimList)
        // 折线图样式特殊处理
        if (this.styleConfig.xAxis[0].data && this.styleConfig.xAxis[0].data.length > 10) {
          this.styleConfig.xAxis[0].axisLabel.rotate = -30
          this.styleConfig.xAxis[0].axisLabel.showMaxLabel = false
        }
        this.styleConfig.legend.data = this.getLegendData(metricList)

        // 初始化x、y轴标题
        this.initXYName(dimList, metricList)
        // 时间维度 不做标签的任何处理(如: 截断等)
        if (dimList && dimList.length === 1 && dimList[0].dimCode === 'dasp_date') {
          this.styleConfig.xAxis[0].axisLabel.formatter = (params, index) => {
            return params
          }
        }
        // 初始化线图
        this.chart = echarts.init(document.getElementById(this.chartId))

        // 注册点击事件 触发联动
        this.chart.on('click', this.sendMessage)

        // 初始化表格数据
        this.getTableData(data, dimList, metricList)
        // 回滚配置项
        operateApi.analyzeOpetate(line.config, this.$store, this.index, operate)
        // 绘图前 检查是否维度只有一个维值时
        this.setChartType()
        // 绘图
        this.chart.setOption(this.styleConfig, true)
        // 初始化style
        bus.$emit('initStyle', {
          index: this.index
        })
      },
      // 更新线图样式  setOption => 线图配置样式数据
      updateEchart (setOption) {
        // 绘图前 检查是否维度只有一个维值时
        this.setChartType()
        this.chart.setOption(setOption, true)
      },
      sendMessage (params) {
        // console.log('send', params)
        let chartsOption = this.chartsOption[this.index]
        let dimCode = this.chartsOption[this.index].feature.dimList[0].dimCode
        // 获取维值value
        let linkInfo = {
          dimCode,
          dimName: params.name.indexOf('###') !== -1 ?  params.name.split('###')[1] : params.name,
          dimValue: params.name.indexOf('###') !== -1 ?  params.name.split('###')[0] : params.name
        }
        sendLinkInfo(this.chartsOption, this.index, linkInfo)
      },
      // 获取line图 series数据
      getSeriesData (data, metricList) {
        let series = []
        let length = metricList.length
        // 处理多指标的数据
        for (let i = 0; i < length; i++) {
          let key = metricList[i].metricCode
          let Arr = data.map((item, index) => {
            return item[key]
          })
          series.push({
            name: metricList[i].metricName,
            type: 'line',
            smooth: false,
            label: {
              show: false,
              color: '#000000',
              position: 'top'
            },
            lineStyle: {
              width: 1.5
            },
            data: Arr
          })
        }
        return series
      },
      // 获取line图 X轴类目数据
      getXdata (data, dimList) {
        let Xdata = []
        if (dimList.length > 0) {
          let key = dimList[0].dimCode
          Xdata = data.map((item, index) => {
            return item[key]
          })
        }
        return Xdata
      },
      // 获取类目数据
      getLegendData (metricList) {
        return metricList.map((item, index) => {
          return {
            name: item.metricName,
            icon: 'line'
          }
        })
      },
      // 生成表格数据
      getTableData (data, dimList, metricList) {
        // 初始化 表头和column的属性
        this.tableProp = []
        this.tableHead = []
        // 获取表头和column的属性
        for (let i= 0; i < dimList.length; i++) {
          // 维度别名应用
          const dimAlias = this.getAliasByDimCode(dimList[i].dimCode)
          const dimName = dimAlias === false ? dimList[i].dimName : dimAlias
          this.tableProp.push(dimList[i].dimCode)
          this.tableHead.push(dimName)
        }

        for (let i= 0; i < metricList.length; i++) {
          this.tableProp.push(metricList[i].metricCode)
          this.tableHead.push(metricList[i].metricName)
        }
        // 对配置文件中的data重新排序 确保与表头/属性的一致性
        this.table = data.map((item, index) => {
          let obj = {}
          for (let i = 0; i < this.tableProp.length; i++) {
            let keyName = this.tableProp[i]
            obj[keyName] = item[keyName]
          }
          return obj
        })
      },
      initXYName (dimList, metricList) {
        // 取维度单位
        if (dimList.length > 0) {
          let name = dimList[0].dimName
          if (name.length > 8) {
            name = name.substring(0, 8) + '...'
          }
          this.$store.commit('setXname', {
            index: this.index,
            value: name
          })
        }
        // 取指标单位
        if (metricList.length > 0) {
          let mulUnits = metricList[0].mulUnits
          let name = ''
          if (mulUnits.length > 0) {
            name = mulUnits[0].unitNm
          }
          this.$store.commit('setYname', {
            index: this.index,
            value: name
          })
        }
      },
      // 自适应  解决显示表格时容易发生拖拽行为 切回line图时, line显示的问题
      changeTyle (val) {
        if (val) {
          this.$nextTick(() => {
            this.chart.resize()
          })
        }
      },
      // 重新计算时间范围
      resetUpdateTime (startTime, endTime) {
        let dateArr = []
        // console.log(this.numberTime)
        if (this.numberTime < 0) {
          let timeStamp = Date.parse(new Date(endTime)) - Math.abs(this.numberTime) * 24 *  60 * 60 * 1000
          let timeObject = new Date(timeStamp)
          // 作为起始时间
          dateArr.push(this.getDateString(timeObject.getFullYear(), timeObject.getMonth(), timeObject.getDate()))
          // 作为结束时间
          dateArr.push(endTime)
        } else if(this.numberTime > 0) {
          let timeStamp = Date.parse(new Date(endTime)) + this.numberTime * 24 *  60 * 60 * 1000
          let timeObject = new Date(timeStamp)
          // 作为起始时间
          dateArr.push(endTime)
          // 作为结束时间
          dateArr.push(this.getDateString(timeObject.getFullYear(), timeObject.getMonth(), timeObject.getDate()))
        } else {
          dateArr.push(startTime)
          dateArr.push(endTime)
        }
        return dateArr
      },
      // 获取日期字符
      getDateString (year, month, day) {
        month = parseInt(month) + 1
        if (month < 10) {
          month = '0' + month
        }
        if (parseInt(day) < 10) {
          day = '0' + day
        }
        // 格式 xxxx-xx-xx
        return year + '-' + month + '-' + day
      },
      // 当前维度是时间维度 && 时间粒度为天  && 启用了设置时间
      isResetTime () {
        if (this.isTimeSet && this.isTime && this.timeType === "TG_00000004") {
          return true
        } else {
          return false
        }
      },
      // 绘图前 检查是否维度只有一个维值时 line => bar
      setChartType () {
        let series = this.styleConfig.series
        let showBar = true
        // 所有指标均只有一个维值时
        series.forEach(item => {
          if (item.data.length !== 1) {
            showBar = false
          }
        })
        if (showBar) {
          this.styleConfig.series.forEach(item => {
            item.type = 'bar'
            item.barMaxWidth = 50 // 设置柱状图最大宽度尺寸
          })
        }
      }
    },
    mounted() {
      // 监听style 选项变化更新图表
      bus.$on('updateOption', (obj) => {
        if (this.index === obj.index) {
          this.updateEchart(obj.config)
        }
      })
      // 监听数据源变化 更新图表
      bus.$on(`updateData_${this.index}`, ({special_query = false}) => {
        // console.log(`updateData_${this.index}`, this.isResetTime() || this.isValueSum || special_query)
        // 自定义查询 countSum 由获取累计数据功能触发
        // this.isResetTime() || this.isValueSum 条件用于非查询面板的编辑、保存后的初始化
        // special_query 走style选项变化的流程
        if (this.isResetTime() || this.isValueSum || special_query) {
          let obj = {}
          obj.index = this.index
          // 自定义时间 是否需要为折线图重新设置时间
          if (this.isResetTime()) {
            let startTime = this.chartsOption[this.index].nearUpdateTime[0]
            let endTime = this.chartsOption[this.index].nearUpdateTime[1]
            let newTime = this.resetUpdateTime(startTime, endTime)
            obj.startTime = newTime[0]
            obj.endTime = newTime[1]
          }
          // 是否启用累计
          if (this.isValueSum) {
            obj.isValueSum = this.isValueSum
          }
          (async () => {
            let data = await this.updateDataPre(obj)
            if (!data) {
              data = []
            }
            this.loadingToggle(this.index, false)
            this.redrawEchart(data)
          })()
        } else {
          this.redrawEchart(this.chartsOption[this.index].data)
          this.loadingToggle(this.index, false)
        }
        this.toggleNoData(this.chartsOption[this.index].data.length)
      })

      // 数据联动显示
      bus.$on(`updateLink_${this.index}`, (obj) => {
        // console.log('get = > updateLink', obj)
        if (obj.toWho.includes(this.index)) {
          (async () => {
            let data = await this.updateDataPre({
              index: this.index,
              linkInfo: obj.linkInfo,
              isValueSum: this.isValueSum
            })
            if (!data) {
              data = []
            }
            this.redrawEchart(data)
            this.toggleNoData(data.length)
          })()
        }
      })

      // 查询面板联动
      bus.$on(`updateQuery_${this.index}`, (obj) => {
        // console.log('get = > updateQuery', obj)
        if (obj.selectedTable.includes(this.index)) {
          let date = obj.dateData
          // 复制查询面板条件  为折线图重设时间时不影响其他图表
          let newObj = JSON.parse(JSON.stringify(obj))
          // 查询时间粒度为天 && 启用了设置时间
          if (date.length > 0 && date[0].formatType === 'date' && this.isTimeSet && this.isTime) {
            let startTime = date[0].dateData[0]
            let endTime = date[0].dateData[1]
            newObj.dateData[0].dateData = this.resetUpdateTime(startTime, endTime)
          }
          // console.log(date.length === 0 && this.isResetTime())
          // 查询面板没传递时间时 用数据关系构造类似查询面板的时间格式
          if (date.length === 0 && this.isResetTime()) {
            let startTime = this.chartsOption[this.index].nearUpdateTime[0]
            let endTime = this.chartsOption[this.index].nearUpdateTime[1]
            let objTime = {
              dateData: this.resetUpdateTime(startTime, endTime),
              formatType: 'date',
              type: 'daterange',
              value: 'daterange'
            }
            newObj.dateData.push(objTime)
          }
          // 请求数据
          (async () => {
            let data = await this.updateDataPre(
              {
                index: this.index,
                queryInfo: newObj,
                isValueSum: this.isValueSum
              }
            )
            // console.log(data)
            if (!data) {
              data = []
            }
            this.loadingToggle(this.index, false)
            this.redrawEchart(data)
            this.toggleNoData(data.length)
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
      // 初始化数据和配置
      // 默认时的初始化
      // console.log('mounted', this.chartsOption[this.index].data && this.chartsOption[this.index].data.length)
      if (this.chartsOption[this.index].data && this.chartsOption[this.index].data.length) {
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
      bus.$off('updateOption')
    }
  }
</script>
<style lang="less">
  .line {
    overflow: auto;
    box-sizing: border-box;
    .switch{
      position: absolute;
      top: 10px!important;
      right: 80px;
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
  }
</style>
