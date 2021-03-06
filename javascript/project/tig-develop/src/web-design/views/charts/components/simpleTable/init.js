import { getMetricCode } from '../../utils/utils'
import _uniqBy from 'lodash.uniqby'
import { topListTemp } from './static'

export default {
	methods: {
		allDataRenderAndBar(data) {
			// 如果初始化有新增列显示条形图
			// 获得前一列数据 append到所有数据中
      const addAllData = []
      // 重新组织数据
      for (let i = 0; i < this.allData.length; i += 1) {
        const lastLine = {}
        this.columnList.forEach((v, index) => {
          if (v.id === 'number') {
            lastLine[v.id] = i + 1
          } else if (v.id === 'operate') {
            if (this.jumpDeatil) {
              lastLine[v.id] = ''
            }
          } else if (v.id.indexOf('bar') !== -1) {
          	const barId = v.id.replace('bar', '')
            lastLine[v.id] = this.allData[i][barId]
          } else {
            lastLine[v.id] = this.allData[i][v.id]
          }
        })
        addAllData.push(lastLine)
      }
      this.allData = addAllData
		},
		initStyle() {
      const chartsOption = this.chartsOption[this.index].feature.styleConfig
      Object.keys(chartsOption).forEach(v => {
        if (chartsOption[v] !== undefined) {
          this[v] = chartsOption[v]
        }
        if(v === 'currentPage'){
          this[v] = 1
        }
      })
      if (this.pageSize === 0) {
        this.isPage = false
      }
      if (chartsOption.selectedTopList) {
        const topList = []
        topListTemp.forEach(v => {
          chartsOption.selectedTopList.forEach(item => {
            if (v.value === item) {
              topList.push(v)
            }
          })
        })
        this.topList = topList
      }
      // 加了个排名功能 原来columnList里面没有存 怕兼容问题
      if (this.columnList.filter(v => v.id === 'ranking').length === 0) {
        this.columnList.splice(1, 0, {
          id: 'ranking',
          name: '排名'
        })
      }
      // console.log(this.dillAndLine)   
		},
    // 趋势标记 多维单多指标不支持
    async initTrend() {
      let metricsList = []
      let trendMetricList = []
      trendMetricList = this.columnList.filter(v => v.trend === true)

      if (trendMetricList.length !== 0) {
        //  对比指标
        trendMetricList.forEach((v, i) => {
          let metricCurrent = getMetricCode(this.metricList, v.id)
          let metricSetting = {
            metricsCode: metricCurrent,
            rateType: 4, //同环比类型0本期值,1同比,2环比,3同环比，4对比
            decimals: 2,// 小数位
            thousands: false,//千分位
            type : 0,//0数值,1百分比,空字符串表示数据原值返回
            label : '新增',
          }
          metricsList.push(metricSetting)
        })
      }
      if (trendMetricList.length !== 0) {
        metricsList = _uniqBy(metricsList, 'metricsCode')        
        this.compareData = metricsList
      } else {
        this.compareData = []
      }
    },
  }
}