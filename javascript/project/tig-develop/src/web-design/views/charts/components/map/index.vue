<template>
  <div class="china-map">
   <div :id="chinaMapId" style="width:100%; height: 100%"></div>
   <div  class="retPro" v-show="return_china" style="z-index:999;position: absolute;top:50px;left:10px;display: block;">
      <a href="javascript:void(0);" @click="goBackChinaMap()" class="link">
        返回全国
      </a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import bus from '../../utils/eventBus'
import api from '../../../../api/charts'
import search from '../../../../api/search'
import { sendLinkInfo, wait } from '../../utils/utils'
import { VISUALMAP_COLOR, MAP_COLOR } from '../../constants/map'
import { CITY_MAP } from '../../constants/cityMap'
import aliasMap from '../mixins/aliasChange/aliasMap'

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 地图
import 'echarts/lib/chart/map'
// 气泡地图
import 'echarts/lib/chart/scatter'
// 图例
import 'echarts/lib/component/legend'
// 提示框
import 'echarts/lib/component/tooltip'
// 视觉映射组件
import 'echarts/lib/component/visualMap'
// 地图geo
import 'echarts/lib/component/geo'
// 中国地图json
let chinaJson = require('echarts/map/json/china.json')

export default {
  name: 'china-map',
  components: {},
  props: {
    index: {
      default: 0
    }
  },
  data() {
    return {
      mapChart: {},
      chinaMap: {},
      proMap: {},
      data111: [],
      return_china: false
    }
  },
  computed: {
    //组件id
    chinaMapId() {
      return `chinaMapId-${this.index}`
    },
    //可视化容器
    chartsOption() {
      return this.$store.state.charts.chartsOption
    },
    // 获取当前面板索引的样式面板的属性
    feature() {
      return this.chartsOption[this.index].feature
    },
    // 图标样式
    config() {
      return this.feature.styleConfig.config
    },
    option() {
      return this.chartsOption[this.index]
    },
    // 当前面板索引请求接口后获得的数据
    data() {
      return this.chartsOption[this.index].data
    },
    dimLength() {
      return this.feature.dimList.length
    },
    //维度类型
    dimType() {
      if (this.dimLength !== 0) {
        return this.feature.dimList[0].dimType
      }
    }
  },
  mixins: [search, aliasMap],
  methods: {
    //混合气泡色块地图分2次请求后台数据
    async drawNestMap(startTime, endTime) {
      let data = []
      let condiStartDate = this.option.nearUpdateTime[0]
      let condiEndDate = this.option.nearUpdateTime[1]
      if (startTime && endTime) {
        condiStartDate = startTime
        condiEndDate = endTime
      }
      const dimList = this.feature.dimList
      const dimListArray = dimList.map(item => {
        return {
          dimId: item.dimCode,
          dimName: item.dimName
        }
      })
      const dimList1 = []
      dimList1.push(dimListArray[0])
      const dimList2 = []
      dimList2.push(dimListArray[1])
      const _this = this
      await wait(0.2).then(async () => {
        let data1 = this.updateDataPre({
          index: this.index,
          dimList: dimList1,
          disableLoading: true,
          startTime: condiStartDate,
          endTime: condiEndDate
        })
        let data2 = this.updateDataPre({
          index: this.index,
          dimList: dimList2,
          disableLoading: true,
          startTime: condiStartDate,
          endTime: condiEndDate
        })
        data = await Promise.all([data1, data2])
      })
      return data
    },
    //过滤后台数据
    getData(data, dimCode, metricList) {
      let Arr = []
      const mapData = []
      for (let i = 0; i < metricList.length; i++) {
        const key = metricList[i].metricCode
        const alias = this.getAliasByMetricCode(key)
        const metricName = alias === false ? metricList[i].metricName : alias
        const visualMapClor = VISUALMAP_COLOR[i]
        const mapClor = MAP_COLOR[i]
        if (data !==undefined && data.length !== 0){
            Arr = data.map((item, index) => {
            return [
              item[key],
              item[dimCode],
              metricName,
              visualMapClor,
              mapClor,
              key,
              dimCode
            ]
          })
          mapData.push(Arr)
        }
      }
      return mapData
    },
    //地图数据处理逻辑
    getMapData(data) {
      const metricList = this.feature.metricList
      const dimList = this.feature.dimList
      let dimCode = this.feature.dimList[0].dimCode
      let dimCode1
      let mapData = []
      if (dimList.length === 1) {
        if (data !==undefined && data.length !== 0 && data[0].childRoute !== undefined) {
          dimCode = data[0].childRoute
        }
        mapData = this.getData(data, dimCode, metricList)
      } else {
        dimCode1 = this.feature.dimList[1].dimCode
        mapData[0] = this.getData(data[0], dimCode, metricList)
        mapData[1] = this.getData(data[1], dimCode1, metricList)
      }
      return mapData
    },
    //提示信息数据处理
    tips(data, dimCode, params) {
      const tips = []
      const metricList = this.feature.metricList
      data.map(item => {
        if (item[dimCode].indexOf(params.name) >= 0) {
          for (let i = 0; i < metricList.length; i++) {
            const key = metricList[i].metricCode
            const alias = this.getAliasByMetricCode(key)
            const metricName = alias === false ? metricList[i].metricName : alias
            const tip = {
              name: metricName,
              value: item[key]
            }
            tips.push(tip)
          }
        }
      })
      return tips
    },
    //tooltip
    tooltip(data) {
      const tooltip = this.config.tooltip
      tooltip.formatter = params => {
        const dimList = this.feature.dimList
        let dimCode = this.feature.dimList[0].dimCode
        let dimCode1
        let tips = []
        if (dimList.length === 1) {
          if (data !==undefined && data.length !== 0 && data[0].childRoute !== undefined) {
            dimCode = data[0].childRoute
          }
          tips = this.tips(data, dimCode, params)
        } else {
          dimCode1 = this.feature.dimList[1].dimCode
          tips = this.tips(data[0], dimCode, params).concat(
            this.tips(data[1], dimCode1, params)
          )
        }
        const normal = tips.map(item => {
          return `<div class="tooltip_div"><span>${item.name}:${
            item.value
          }</span></div><br />`
        })
        const _tooltip =
          `<div class="tooltip_div" style="padding:5px 0"><span>${
            params.name
          }</span></div><br />` + normal.join('')
        if (params.data === undefined || params.data.value === '') {
          return
        }
        return _tooltip
      }
      return tooltip
    },
    //legend
    legend() {
      const legend = this.config.legend
      const dimList = this.feature.dimList
      legend.data = this.feature.metricList.map((item, index) => {
        const alias = this.getAliasByMetricCode(item.metricCode)
        return {
          name: alias === false ? item.metricName : alias,
          icon: 'rect'
        }
      })
      if (dimList[0].dimType === '2' && dimList.length === 1) {
        legend.selectedMode = false
      } else {
        legend.selectedMode = true
      }
      return legend
    },
    //色块visualMap
    visualMap(mapData) {
      const dimList = this.feature.dimList
      const visualMap = this.config.visualMap
      const arr = []
      let data = []
      if (dimList.length === 1) {
        data = mapData[0]
      } else {
        if (dimList[0].dimType === '2') {
          data = mapData[1][0]
        } else {
          data = mapData[0][0]
        }
      }
      if(data !== undefined && data.length!==0){
          data.map(item => {
          arr.push(item[0])
        })
        const min = Math.min.apply(null, arr)
        const max = Math.max.apply(null, arr)
        if (Number(min) === Number(max)) {
          if (Number(max) <= 0) {
            visualMap.min = min
            visualMap.max = 1000
          } else {
            visualMap.min = 0
            visualMap.max = max
          }
        } else {
          visualMap.min = min
          visualMap.max = max
        }
        visualMap.color = ['#2661A8', '#3AA0FF', '#C4EAFF']
      }
      return visualMap
    },
    //geo
    geo(drillData, selectProe) {
      const geo = this.config.geo
      const dimList = this.feature.dimList
      if (dimList[0].dimType === '2' && dimList.length === 1) {
        geo.itemStyle.emphasis.areaColor = '#E1E9F0'
        geo.label.normal.show = false
      } else {
        geo.label.normal.show = true
        geo.itemStyle.emphasis.areaColor = '#F8E275'
      }
      if (drillData === undefined) {
        geo.map = 'china'
      } else {
        geo.map = selectProe
        geo.itemStyle.emphasis.areaColor = '#F8E275'
      }
      return geo
    },
    //处理单色块seriesData逻辑
    seriesBlacks(data, selectProe) {
      if(data !== undefined && data.length!==0){
        const seriesData = []
        data.map((item, index) => {
          const obj = {}
          obj.value = item[0]
          if (selectProe === undefined) {
            obj.name = item[1].length === 0 ? '' : item[1].replace(/省/, '').replace(/市/, '').replace(/自治区/, '').split('###')[1]

          } else {
            obj.name = item[1].length === 0 ? '': item[1].split('###')[1]
          }
          obj.dimValue = item[1]
          obj.dimCode = item[6]
          seriesData.push(obj)
        })
        return seriesData
      }
    },
    //处理单气泡逻辑
    seriesBubbles(data) {
     if(data !== undefined && data.length!==0){
        let name = ''
        const res = []
        data.map(item => {
          if (item[1].indexOf('###') >= 0) {
            name = item[1].split('###')[1].replace(/市/, '')
            const geoCoord = CITY_MAP.geoCoordMap[name]
            if (geoCoord) {
              res.push({
                name: name,
                value: geoCoord.concat(item[0]),
                dimValue: item[1],
                dimCode: item[6],
                itemStyle: { color: '#D673B9' },
                label: {
                  normal: {
                    formatter: '{b}'
                  }
                }
              })
            }
          }
        })
        return res
     }
    },
    //气泡告警
    seriesScatter(data) {
      if(data !== undefined && data.length!==0){
        let name = ''
        const res = []
        const arr = []
        data.map(item => {
          if (item[1].indexOf('###') >= 0) {
            name = item[1].split('###')[1].replace(/市/, '')
            const geoCoord = CITY_MAP.geoCoordMap[name]
            if (geoCoord) {
              res.push({
                name: name,
                value: geoCoord.concat(item[0]),
                dimValue: item[1],
                dimCode: item[6],
                symbol: '',
                tooltip: {
                  formatter: ''
                }
              })
            }
          }
        })
        res.map(i => {
          const sum = i.value[2]
          this.config.colorItems.forEach(e => {
            if (
              Number(sum) >= Number(e.start) &&
              Number(sum) <= Number(e.end) &&
              e.start !== '' &&
              e.end !== ''
            ) {
              ;(i.symbol = `image:///static/charts/images/${e.color.replace(
                /#/,
                ''
              )}.svg`),
                (i.tooltip.formatter = params => {
                  const _tooltip = `<div class="tooltip_div"><span>${
                    e.warn
                  }</span></div>`
                  return _tooltip
                })
              arr.push(i)
            }
          })
        })
        return arr
      }
    },
    //色块/气泡series
    series(mapData, selectProe) {
      const dimList = this.feature.dimList
      const _series = this.config.series
      const label = this.config.label
      const visualMap = this.config.visualMap
      const adaptiveRadius = this.config.adaptiveRadius
      const legendArray = []
      const seriesData = []
      const arr = []
      let data = []
      this.feature.metricList.map((item, index) => {
        const alias = this.getAliasByMetricCode(item.metricCode)
        const legendSeries = {
          type: 'scatter',
          name: alias === false ? item.metricName : alias,
          coordinateSystem: 'geo'
        }
        legendArray.push(legendSeries)
      })
      let series = legendArray.concat(_series)
      const length = series.length
      visualMap.seriesIndex = length - 1
      series[length - 2].label = label
      if (dimList[0].dimType === '1') {
        //中国地图
        if (selectProe === undefined) {
          series[length - 1].map = 'china'
          if (dimList.length === 1) {
            series[length - 3].data = []
            series[length - 2].data = []
            series[length - 1].data = this.seriesBlacks(mapData[0])
          } else {
            series[length - 1].data = this.seriesBlacks(mapData[0][0])
            series[length - 2].data = this.seriesBubbles(mapData[1][0])
            series[length - 3].data = this.seriesScatter(mapData[1][0])
          }
        } else {
          //省份地图
          series[length - 1].map = selectProe
          series[length - 1].data = this.seriesBlacks(mapData[0], selectProe)
        }
      }
      if (dimList[0].dimType === '2') {
        series[length - 1].map = 'china'
        if (dimList.length === 1) {
          series[length - 3].data = this.seriesScatter(mapData[0])
          series[length - 2].data = this.seriesBubbles(mapData[0])
          series[length - 1].data = []
        } else {
          series[length - 3].data = this.seriesScatter(mapData[0][0])
          series[length - 2].data = this.seriesBubbles(mapData[0][0])
          series[length - 1].data = this.seriesBlacks(mapData[1][0])
        }
      }
      //初始化自定义气泡样式
      if(series[length - 2].data !== undefined && series[length - 2].data.length!==0){
          series[length - 2].data.map(item => {
          arr.push(Math.round(item.value[2]))
        })
      }
      const max = Math.max.apply(null, arr)
      const a = max * 1 / 5
      const b = max * 2 / 5
      const c = max * 3 / 5
      const d = max * 4 / 5
      if (adaptiveRadius === true) {
        series[length - 2].symbolSize = params => {
          const sum = params[2]
          if (sum <= a) {
            return 4
          }
          if (sum > a && sum <= b) {
            return 8
          }
          if (sum > b && sum <= c) {
            return 12
          }
          if (sum > d && sum <= max) {
            return 16
          }
        }
      }
      if (adaptiveRadius === false) {
        series[length - 2].symbolSize = 5
      }
      return series
    },
    //切换图例改变颜色
    legendChange(params, mapData, selectProe) {
      const dimList = this.feature.dimList
      const visualMap = this.config.visualMap
      const series = this.config.series
      const length = series.length
      const arr = []
      let legendChangeData = []
      if (dimList.length === 1) {
        legendChangeData = mapData
      } else {
        if (dimList[0].dimType === '2') {
          legendChangeData = mapData[1]
        } else {
          legendChangeData = mapData[0]
        }
      }
      legendChangeData.forEach((item, index) => {
        if (item[0][2] === params.name) {
          item.map(item => {
            arr.push(item[0])
          })
          const min = Math.min.apply(null, arr)
          const max = Math.max.apply(null, arr)
          visualMap.min = min
          visualMap.max = max
          visualMap.color = item[0][3]
          if (selectProe === undefined) {
            //中国地图
            series[length - 1].map = 'china'
            series[length - 1].data = this.seriesBlacks(item)
            this.mapChart.setOption(this.chinaMap, true)
          } else {
            //省份地图
            series[length - 1].map = selectProe
            series[length - 1].data = this.seriesBlacks(item, selectProe)
            this.mapChart.setOption(this.proMap, true)
          }
        }
      })
    },
    //渲染地图
    drawCharts(
      tooltip,
      legend,
      visualMap,
      geo,
      series,
      color,
      dimList,
      dimCode,
      mapData
    ) {
      echarts.registerMap('china', chinaJson);
      this.mapChart = echarts.init(document.getElementById(this.chinaMapId))
      //tooltip
      this.chinaMap.tooltip = tooltip
      //legend
      this.chinaMap.legend = legend
      //visualMap
      this.chinaMap.visualMap = visualMap
      //geo
      this.chinaMap.geo = geo
      //series
      this.chinaMap.series = series
      //color
      this.chinaMap.color = MAP_COLOR

      if ((this.dimLength === 1 && this.dimType === '2')||series[series.length-1].data === undefined) {
        delete this.chinaMap.visualMap
      }
      this.mapChart.clear()
      this.mapChart.setOption(this.chinaMap, true)
      //点击事件
      this.mapChart.off('click')
      this.mapChart.on('click', params => {
        //图标联动
        const chinaMap = this.chinaMap
        const chartsOption = this.chartsOption
        const index = this.index
        const linkInfo = {
          dimValue: !params.data ? null : (params.data.dimValue.indexOf('###') !== -1 ? params.data.dimValue.split('###')[0] : params.data.dimValue),
          dimCode: !params.data ? null : params.data.dimCode,
          dimName: !params.data ? null : (params.data.dimValue.indexOf('###') !== -1 ? params.data.dimValue.split('###')[1] : params.data.dimValue),
        }
        if (linkInfo.dimValue !== null && this.dimLength !== 2) {
          sendLinkInfo(chartsOption, index, linkInfo)
        }
        //地图下钻
        if (params.data) {
          this.drillMapDown(params, chinaMap, geo, dimList)
        }
      })
      this.mapChart.off('legendselectchanged')
      this.mapChart.on('legendselectchanged', params => {
        this.legendChange(params, mapData)
      })
    },

    // 获取下钻的数据
    async getDillorUpdillData(params) {
      const dimCode = this.feature.dimList[0].dimCode
      let res = await api.getDill({ dimId: dimCode })
      const data = {
        route: res.data[0].route.split('-').reverse(),
        routeCode: res.data[0].routeCode,
        routeNm: res.data[0].routeNm.split('-').reverse()
      }
      const parentRoute = data.route[0] // 父级维度编码
      const childRoute = data.route[1] // 子级维度编码
      const currentName = data.routeNm[0]
      let drill = {}
      if (params.data !== undefined) {
        drill.dimValueId = params.data.dimValue.split('###')[0] // 点击td的维值编码
      } else {
        drill.dimValueId = '' // 点击td的维值编码
      }
      drill.drillPath = data.routeCode
      drill.drillNumber = 1 // 层数 下钻1 上卷-1
      drill.nextDimCode = childRoute // 下一级纬度编码
      drill.drillDimCode = parentRoute
      const dimList = []
      dimList.push({
        dimId: parentRoute,
        dimName: currentName
      })
      const metricsList = this.feature.metricList.map(item => {
        return {
          metricsCode: item.metricCode,
          label: item.metricName,
          decimals: 2,
          metricsUnitCode: '',
          rateType: 0,
          thousands: false,
          type: ''
        }
      })
      const upsetting = {
        index: this.index,
        drill: drill,
        dimList: dimList,
        metricsList: metricsList
      }
      //获取指标名称
      const metricName = this.feature.metricList.map((item, index) => {
        return {
          [`${item.metricCode}Name`]: item.metricName
        }
      })
      const drillMapData = await this.updateDataPre(upsetting)
      if (drillMapData && drillMapData.length === 0) {
        return []
      }
      for (let i = 0; i < metricName.length; i++) {
        drillMapData.map(item => {
          item = Object.assign(item, metricName[i])
          item.childRoute = data.route[1] // 子级维度编码
        })
      }
      return drillMapData
    },
    // 获取下钻的省份数据
    async queryMapData(params) {  
      const data =  await api.queryMapData({
        id: params
      })
      return data
    },
    //地图下钻
    async drillMapDown(params, chinaMap, geo, dimList) {
      if (geo.z === 3 || dimList.length !== 1 || dimList[0].dimType === '2') {
        return 
      }
      if(params.data.name ==="北京" || params.data.name ==="天津"|| params.data.name ==="上海"|| params.data.name ==="重庆") {
         this.$message({
            message: "直辖市暂不支持下钻",
            type: 'warning'
          })
          return
      }
      this.mapChart.setOption(chinaMap, false) 
      const arg = params.data.dimValue.split('###')[0]
      const queryMapData = await this.queryMapData(arg)
      if(queryMapData && queryMapData.data) {
        const selectProe = JSON.parse(queryMapData.data).name
        const drillMapData = await this.getDillorUpdillData(params)
        const drillData = this.getMapData(drillMapData)   
        this.return_china = true
        echarts.registerMap(selectProe, JSON.parse(queryMapData.data))
        this.proMapChart = echarts.init(document.getElementById(this.chinaMapId))
        //tooltip
        this.proMap.tooltip = this.tooltip(drillMapData, selectProe)
        //legend
        this.proMap.legend = this.legend()
        //visualMap
        this.proMap.visualMap = this.visualMap(drillData, selectProe)
        //geo
        this.proMap.geo = this.geo(drillData, selectProe)
        //color
        this.proMap.color = MAP_COLOR
        //series
        this.proMap.series = this.series(drillData, selectProe)
        this.mapChart.clear()
        this.mapChart.setOption(this.proMap, true)
        this.mapChart.off('click')
        this.mapChart.on('click', params => {
          return false
        })
        this.mapChart.off('legendselectchanged')
        this.mapChart.on('legendselectchanged', params => {
          this.legendChange(params, drillData, selectProe)
        })
      }
    },
    //初始化图表
    async init(res) {
      this.return_china = false
      const dimCode = null
      const dimList = this.feature.dimList
      let data = []
      if (dimList.length === 1) {
        if(res !== undefined){
          data = res
        }else{
          data = this.data
        }
      }
      if (dimList.length === 2) {
        if(res !== undefined){
          data = await res
        }else{
          data =  await this.drawNestMap()
        }
      }
      const mapData = this.getMapData(data)
      const tooltip = this.tooltip(data)
      const legend = this.legend()
      const visualMap = this.visualMap(mapData)
      const geo = this.geo()
      const series = this.series(mapData)
      const color = this.config.color
      this.config.mapData = mapData
      this.config.metricValue = this.feature.metricList[0].metricName
      this.drawCharts(
        tooltip,
        legend,
        visualMap,
        geo,
        series,
        color,
        dimList,
        dimCode,
        mapData
      )
    },
    // 监听联动
    async updateLinkFun(linkInfo) {
      const res = await this.updateDataPre({
        index: this.index,
        linkInfo: linkInfo
      })
      this.$store.commit("saveResData", { index: this.index,res });
      this.init(res)
    },
    //下砖返回上级
    goBackChinaMap() {
      this.return_china = false
      this.init()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
    //查询面板联动
    bus.$on(`updateQuery_${this.index}`, obj => {
      let res = []
      if(this.feature.dimList.length === 2){
        let startTime;
        let endTime;
        if (obj.dateData.length > 0) {
          startTime = obj.dateData[0].dateData[0];
          endTime = obj.dateData[0].dateData[1];
        }
       res = this.drawNestMap(startTime, endTime);
      this.init(res)
      }else{
         (async () => {
            res = await await this.updateDataPre({
              index: this.index,
              queryInfo: obj
          })
          this.$store.commit("saveResData", { index: this.index,res });
          this.init(res)
        })()
      }
    })
    //调用bus更新
    bus.$on('updateMapOption', obj => {
      if (this.index === obj.index) {
        if (obj.config.geo.map === 'china') {
          const length = this.chinaMap.series.length
          this.chinaMap.series[length - 3] = obj.config.series[0]
          this.chinaMap.series[length - 2] = obj.config.series[1]
          this.mapChart.setOption(this.chinaMap, true)
        } else {
          this.mapChart.setOption(this.proMap, true)
        }
      }
    })
    //组件联动
    bus.$on(`updateLink_${this.index}`, obj => {
      this.updateLinkFun(obj.linkInfo)
    })
    //数据面板更新
    bus.$on(`updateData_${this.index}`, obj => {
      this.init()
    })
    //监听窗口拖动
    bus.$on(`resizeOrMove_${this.index}`, obj => {
      this.mapChart.resize()
    })
    // 通知查询面板准备完毕
    this.$store.commit('chartsReady', {
      index: this.index
    })
  },
  beforeDestroy() {
    bus.$off(`updateQuery_${this.index}`)
    bus.$off('updateMapOption')
    bus.$off(`updateLink_${this.index}`)
    bus.$off(`updateData_${this.index}`)
    bus.$off(`resizeOrMove_${this.index}`)
    bus.$off(`warnUpdate${this.index}`)
  }
}
</script>
<style lang="less">
.link {
  height: 30px;
  background: #fff;
  line-height: 30px;
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin-left: 20px;
  border-radius: 5px;
  cursor: pointer;
  color: #393939;
  text-decoration: none;
}

.china_map {
  width: 960px;
  height: 650px;
  margin: 0 auto;
  position: absolute;
  top: 10px;
  left: 80px;
}

.tooltip_div {
  height: 5px;
  line-height: 5px;
}
</style>
