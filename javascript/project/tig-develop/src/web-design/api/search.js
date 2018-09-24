import api from './index'
import env from '@/env'
import axios from 'axios'
import {getCrossDimList, MFSelected1, quarterToDay} from '../views/charts/utils/utils'
import {constantWrapper} from '../views/charts/static/configData'

const data = (post) => {
  return api.post('/openApi/reportData/query', post, {
    baseURL: `${env.api}/tig-query`
  })
}
// 仅用于交叉表拆分
const newData = (post) => {
  return api.post('/openApi/tigDataQuery', post, {
    baseURL: `${env.api}/tig-query`
  })
}

const queryDate = (options) => {
  return api.get('/ratio/queryDate', {
    params: options,
    baseURL: `${env.api}/tig-query`
  })
}

// // dev环境测试可比（老接口）
// const data = (post) => {
//   return axios.post('/tigbsdev/tig-query/openApi/reportData/query', post).then((res)=>{
//     return res.data
//   })
// }

// // dev环境测试可比（新接口）
// const newData = (post) => {
//   return axios.post('/tigbsdev/tig-query/openApi/tigDataQuery', post).then((res)=>{
//     return res.data
//   })
// }

export default {
  methods: {
    /**
     * 查询接口的整改
     * @param {Object} limit 预览行数
     * @param {Array} dimList 维度
     * @param {Array} metricsList 指标
     * @param {} rateType 0本期 1 2 3 4
     * @param {Array} conditionList 更多的查询条件
     */
    async searchPre ({index, limit, dimList, metricsList, dimValueList, drill, conditionList, type, sortList, autoSum, timeQueryCycle, format, proportionDimCodes,isTable, hideCodes, tableType, splitInfo}) {
      // 没有指标直接return
      if (!metricsList.length) return
      const userId = this.$store.state.auth.user.code
      const systemId = window.systemId
      const businessType = ''
      // const reportId = '11'
      let post = {
        userId, // 用户ID
        businessType,
        systemId, // 系统ID
        timeQueryCycle,
        dimList,
        metricsList,
        dimValueList,
        conditionList,
        proportionDimCodes,
        drill,
        format,
        hideCodes,
        sortList: this.sortListMap(sortList),
        autoSum
      }
      // url上的other字段，代表来自慧眼,当是慧眼访问时，需要加上reportId,用处：好像是监控
      if (this.$route.query.other) {
        post.reportId = this.$route.query.reportId
        post.limit = limit
      } else {
        // 在天宫端时，预览行数最多为200条
        const {LIMIT_NUM_TIG} = constantWrapper
        post.limit = limit > LIMIT_NUM_TIG ? LIMIT_NUM_TIG : limit
      }
      if (type) {
        post.type = type
      } else {
        post.type = 0
      }

      if (+post.type === 0 && isTable) {
        this.$store.commit('saveQueryJson', {
          index: index,
          data: post
        })
      }
      if (tableType === 3) {
        let newPost = this.getCrossTableParams(post,splitInfo)
        // console.log('newPost',newPost)
        const res = await newData(newPost)
        return res
      }else{
        post.metricsList.map(v =>{
          delete v.feature
        })
        const res = await data(post)
        // if (res.data && res.data.length) {
        //   // 保存最近更新的数据
        //   this.saveNearUpdateData(index, res.data, dimList)
        //   // 维值ID###维值名 => 维值ID_维值名
        //   this.changeDataFormat(index, res.data)
        // }
        return res
      }
    },
    // 点击‘更新’按钮，获取数据
    // linkInfo：联动时发射的维值
    // queryInfo：查询面板发射的数据
    // dimDivide：表格的维度拆分
    // loadingFalse 是否关闭loading，默认关闭
    // conditionListArr 自定义的一些过滤条件
    // disableLoading 是否禁用loading
    async updateDataPre ({index, rateType = 0, compareType = 0, linkInfo, queryInfo, dimValueList, dimList, type, sortList, autoSum, metricsList, drill, loadingFalse = true, startTime, endTime, conditionListArr, timeQueryCycle, limit, format, compareStartDate, compareEndDate, proportionDimCodes, isTable, hideCodes, isValueSum = false, tableType, splitInfo, disableLoading = false}) {
     // 悬浮表格取消loading
     if (!disableLoading) this.loadingToggle(index, true)
      const chartOption = this.$store.state.charts.chartsOption[index]
      if (!limit) {
        limit = chartOption.limitNum
      }
      if (!dimList) {
        dimList = chartOption.feature.dimList.map(item => {
          return {
            dimId: item.dimCode,
            dimName: item.dimName
          }
        })
      }
      if (!metricsList) {
        metricsList = chartOption.feature.metricList.map(item => {
          const { rateType, isProportion, compareType} = this.calcMetricFeature(item.feature)
          // todo 单位为万元时，显示两位小数
          return {
            metricsUnitCode: item.unitSelected,
            metricsCode: item.metricCode,
            label: item.metricName,
            decimals: 0,
            rateType,
            compareType,
            isProportion,
            thousands: false,
            // 在指标获取累计数据
            total: isValueSum,
            feature: item.feature
          }
        })
      }
      // 没有指标直接return
      if (!metricsList.length) {
        this.loadingToggle(index, false)
        return
      }
      let conditionList = []
      // 向conditionList里添加自定义过滤conditionListArr
      if (conditionListArr && conditionListArr.length) conditionList = [...conditionListArr]
      // 图表联动
      if (linkInfo) {
        conditionList.push({
          condiCode: linkInfo.dimCode,
          condiType: 0,
          condiRateType: rateType,
          operator: 6,
          // condiComparedValue: linkInfo.dimValue.split('_')[0]
          condiComparedValue: linkInfo.dimValue
        })
      }
      // 查询面板
      if (queryInfo) {
        let rateTypeTmep = rateType
        // 应急处理 同环比 携带指标问题报错
        if (metricsList.length) {
          // let data = JSON.parse(JSON.stringify(metricsList[0]))
          // if (data.rateType !== 0) {
          //   rateTypeTmep = data.rateType   // 重新赋值
          //   data.rateType = 0
          //   metricsList.unshift(data)
          // }
        }
        if (queryInfo.dimListData.length) {
          // isPublicDim true:所有容器的应用维度的交叉维度
          queryInfo.dimListData.forEach(item => {
            if (!queryInfo.isPublicDim ? chartOption.feature.dimList.map(({dimCode}) => dimCode).includes(item.dimCode) : 1) {
              conditionList.push({
                condiCode: item.dimCode,
                condiType: 0,
                condiRateType: rateType,
                operator: item.selectedOper === 'in' ? 6 : 7,
                condiComparedValue: item.dimSelectedList.join(',')
              })
            } else if (item.from === 'bar') {
              conditionList.push({
                condiCode: item.dimCode,
                condiType: 0,
                condiRateType: rateType,
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
                condiRateType: rateTypeTmep,    // 同环比等问题
                operator: Number(item.selectedOper),
                condiComparedValue: item.title
              })
            }
          })
        }
        // 当查询面板没有选对比日期时，将rateType改为0（fix：表格选中趋势标记时)
        // 2018.5.15需求更改，不能置为0了
        const rateTypeTo0 = () => {
          metricsList = metricsList.map(item => {
            // item.rateType = 0
            return item
          })
        }
        if (queryInfo.dateData && queryInfo.dateData.length !== 0) {
          if (queryInfo.dateData.length === 1) {
            // 查询面板只有本期时间
            // 将查询面板本期时间存入nearLinkTime
            chartOption.nearLinkTime = [[...queryInfo.dateData[0].dateData]]
            conditionList.push({
              condiCode: 'dasp_date',
              condiType: 0,
              condiStartDate: queryInfo.dateData[0].dateData[0],
              condiEndDate: queryInfo.dateData[0].dateData[1],
              condiRateType: 3
            })
            rateTypeTo0()
          }
          if (queryInfo.dateData && queryInfo.dateData.length === 2) {
            // 将查询面板本期时间存入nearLinkTime[0],对比期时间存入nearLinkTime[1]
            chartOption.nearLinkTime = [[...queryInfo.dateData[0].dateData],[...queryInfo.dateData[1].dateData]]
            // 图表需要配合查询面板设置的对比时间时
            // 只有表格0，标签2，关系图6，漏斗图12,需要对比时间
            if ([0, 2, 4, 5, 6, 12, 13, 14, 15].includes(chartOption.feature.chartId)) {
              conditionList.push({
                condiCode: 'dasp_date',
                condiType: 0,
                condiStartDate: queryInfo.dateData[0].dateData[0],
                condiEndDate: queryInfo.dateData[0].dateData[1],
                compareStartDate: queryInfo.dateData[1].dateData[0],
                compareEndDate: queryInfo.dateData[1].dateData[1],
                condiRateType: 4
              })
            } else {
              conditionList.push({
                condiCode: 'dasp_date',
                condiType: 0,
                condiStartDate: queryInfo.dateData[0].dateData[0],
                condiEndDate: queryInfo.dateData[0].dateData[1],
                condiRateType: 3
              })
            }
          }
          timeQueryCycle = this.getGranularity(queryInfo.dateData[0].formatType, chartOption)
        } else {
          // 实时更新时 使用实时更新控件提供的日期  时间粒度采用各个图表的
          conditionList.push({
            condiCode: 'dasp_date',
            condiType: 0,
            condiStartDate: queryInfo.realUpdate.isStart ? queryInfo.realUpdate.startTime : chartOption.nearUpdateTime[0],
            condiEndDate: queryInfo.realUpdate.isStart ? queryInfo.realUpdate.endTime : chartOption.nearUpdateTime[1],
            condiRateType:  MFSelected1 (chartOption.feature.metricList) ? 4 : 3
          })
          // 启用实时更新控件时 限制时间粒度 为'天'
          // TODO : 若存在图表的指标的限制粒度为'天'以上时, 会有查询异常的风险
          timeQueryCycle = queryInfo.realUpdate.isStart ? 'TG_00000004' : chartOption.timeQueryCycle
          // timeQueryCycle = chartOption.timeQueryCycle
        }
      } else {
        if (!timeQueryCycle) {
          timeQueryCycle = chartOption.timeQueryCycle || 'TG_00000004'
        }
         // 时间的赋值有个需要注意的地方：时间粒度为季度的时候，需要用quarterToDay转换一下
        // let condiStartDate = chartOption.timeQueryCycle === 'TG_00000008' ? quarterToDay(chartOption.nearUpdateTime)[0] : chartOption.nearUpdateTime[0]
        // let condiEndDate = chartOption.timeQueryCycle === 'TG_00000008' ? quarterToDay(chartOption.nearUpdateTime)[1] : chartOption.nearUpdateTime[1]
        // 已修改 数据关系 季时间粒度存入nearUpdateTime字段为正常的日期时间
        let condiStartDate = chartOption.nearUpdateTime[0]
        let condiEndDate = chartOption.nearUpdateTime[1]
        // 使用图表关联时，时间取nearLinkTime里面保存的时间
        if(linkInfo){
          condiStartDate = chartOption.nearLinkTime[0][0]
          condiEndDate = chartOption.nearLinkTime[0][1]
          // 需要对比期时，取nearLinkTime[1]中保存的时间
          if ((!compareStartDate || !compareEndDate) && this.isNeedCompareTime(index)) {
            if(chartOption.nearLinkTime && chartOption.nearLinkTime.length ==2){
            compareStartDate = chartOption.nearLinkTime[1][0]
            compareEndDate = chartOption.nearLinkTime[1][1]
            }
          }
        }else{
          // 数据关系更新按钮时，将数据关系里的时间存入nearLinkTime
          chartOption.nearLinkTime = [[...chartOption.nearUpdateTime],[...chartOption.nearUpdateTime]]
          // 对比期必须时 => 数据关系对比期时间 默认与本期一致
          if ((!compareStartDate || !compareEndDate) && this.isNeedCompareTime(index)) {
            compareStartDate = condiStartDate
            compareEndDate = condiEndDate
          }
        }
        if (startTime && endTime) {
          condiStartDate = startTime
          condiEndDate = endTime
        }

        // 当没选对比时，将rateType=3(同环比)，这样metricsList就支持rateType=1,2（同比，环比）
        conditionList.push({
          condiCode: 'dasp_date',
          condiType: 0,
          condiStartDate,
          condiEndDate,
          compareStartDate,
          compareEndDate,
          condiRateType: MFSelected1(chartOption.feature.metricList) ? 4 : 3
        })
      }
      // 按第一个指标or维度排序
      if (!sortList || sortList.length === 0) {
        const sortType = chartOption.sortType
        const attrType = String(chartOption.sortByWhich)
        const attrCode = attrType === '1' ? chartOption.feature.metricList[0].metricCode : (chartOption.feature.dimList && chartOption.feature.dimList[0] && chartOption.feature.dimList[0].dimCode || '')
        sortList = []
        if (sortType === 0 || sortType === 1) {
          sortList.push({
            attrCode,
            attrType,
            sortType
          })
        }
        // console.log(sortList)
        // 排序字段里没有指标
        if (attrType === '1') {
          const filter = metricsList.filter(v => v.metricsCode === attrCode)
          if (filter.length === 0) {
            sortList = []
          }
        }
      }
      // 数据关系过滤器
      // 1.维度过滤器
      if (chartOption && chartOption.dimFilter && chartOption.dimFilter.length) {
        console.log(chartOption.dimFilter)
        chartOption.dimFilter.forEach(item => {
          conditionList.push({
            condiCode: item.dimCode,
            condiType: 0,
            operator: item.operator,
            condiComparedValue: item.command === 'select' ? item.dimValuesSelected.join() : item.initFilterValue
          })
        })
      }
      try {
        // console.log(conditionList)
        const res = await this.searchPre({index, limit, dimList, metricsList, dimValueList, conditionList, type, sortList, autoSum, timeQueryCycle, drill, format, proportionDimCodes, isTable, hideCodes, tableType, splitInfo})
        const tableId = [0, 13, 15]
        if (!tableId.includes(chartOption.feature.chartId) && loadingFalse) this.loadingToggle(index, false)
        return res.data
      } catch (e) {
        this.loadingToggle(index, false)
        // 查询报错，置空数据
        if (!queryInfo) {
          this.$store.commit('syncData', {
            index: chartOption.i,
            data: []
          })
        } else {
          return []
        }
      }
    },
    // 查询数据,以下两个函数只有关系图在用，全部切换后，将其删除
    async initSearch (limit, dimList, metricsList, timeStart, timeEnd, rateType, dill, linkInfo, sortList) {
      const userId = this.$store.state.auth.user.code
      const systemId = window.systemId
      const reportId = 'draft_20180324_0750'
      const versionId = 'version_20180324_0913'
      const post = {
        userId, // 用户ID
        systemId, // 系统ID
        // reportId, // 报表ID
        // versionId, // 版本ID
        type: 0, // 0 普通表  1 分类汇总 2交叉表
        businessType: '', // 1：驾驶舱，2：报表市场预览 默认空字符串，可不传递参数
        limit, // 预览行数
        // selfMethods: [], // 自定义计算公式
        timeQueryCycle: 'TG_00000004',
        /*
          维度查询对象示例
          {"dimId":"dasp_date","dimName":"xxx"}
        */
        dimList, // 维度列表
        dimValueList: [
          // {
          //   dimId: '维度编码',
          //   dimName: '维度名称',
          //   dimValueId: '维值编码',
          //   dimValue: '维值'
          // }
        ], // 交叉表
        conditionList: [
          {
            condiCode: 'dasp_date', // 时间维度
            condiType: 0,
            condiStartDate: timeStart,
            condiEndDate: timeEnd,
            condiRateType: rateType,
            compareStartDate: '', // 对比开始时间
            compareEndDate: '' // 对比结束时间
          }
        ],
        sortList: this.sortListMap(sortList), // 排序
        /*
          指标列表对象示例：
          {
            "metricsCode": "ZB_ZY_CX_00000002",
            "metricsUnitCode": "",
            "rateType": 1, //同环比类型0本期值,1同比,2环比,3同环比，4对比
            "rateValue":true, // true表示比值，false表示比率
            "decimals":2,// 小数位
            "thousands":true,//千分位
            "type":"0",//0数值,1百分比,空字符串表示数据原值返回
            "label":"名称",
            "modelId":"模型编码"
          }
        */
        metricsList, // 指标列表
        autoSum: false, // 是否合计
        sumCodeList: [], // 合计列
        mergeCell: false, // 是否合并
        mergeCodeList: [] // 合并列
      }
      if (dill) {
        post.drill = dill
      }

      if (linkInfo) {
        post.conditionList.push({
          condiCode: linkInfo.condiCode,
          condiType: 0,
          condiRateType: 0,
          operator: 6,
          condiComparedValue: linkInfo.condiComparedValue.split('_')[0]
        })
      }
      const res = await data(post)
      return res
    },
    async updateData (index, timeStart, timeEnd, limit, rateType = 0,compareType = 0, dill = 0, linkInfo) {
      const midOption = this.$store.state.charts.chartsOption[index]
      const dimList = midOption.feature.dimList.map(item => {
        return {
          dimId: item.dimCode,
          dimName: item.dimName
        }
      })
      let metricsList = midOption.feature.metricList.map(item => {
        return {
          metricsCode: item.metricCode,
          label: item.metricName,
          decimals: 2,
          metricsUnitCode: item.unitSelected,
          rateType: rateType,
          compareType: compareType,
          thousands: false,
          type: '',
          feature: item.feature
        }
      })
      const res = await this.initSearch(limit, dimList, metricsList, timeStart, timeEnd, rateType, compareType, dill, linkInfo)
      return res.data.data
    },
    async getQueryDate ({startDate, endDate, formatType}) {
      let timeCycle = this.getGranularity(formatType)
      let options = {
        startDate,
        endDate,
        timeCycle
      }
      const res = await queryDate(options)
      return res
    },
    // 容器loading的开关
    loadingToggle (index, value) {
      this.$store.commit('loadingToggle', {
        index,
        value
      })
    },
    // 根据指标的feature，来计算rateType isProportion
    calcMetricFeature (feature) {
      let rateType = 0
      let compareType = 0
      let isProportion = feature && (feature.value8 || feature.value9) || false
      if (feature) {
        // 只同比
        if ((feature.value2 || feature.value3) && !feature.value4 && !feature.value5) {
          rateType = 1
          if(feature.value1_1) compareType = 2
        }
        // 只环比
        if ((feature.value4 || feature.value5) && !feature.value2 && !feature.value3) {
          rateType = 2
          if(feature.value1_1) compareType = 2
        }
        // 只同环比
        if ((feature.value2 || feature.value3) && (feature.value4 || feature.value5)) {
          rateType = 3
        }
        // 只对比
        if (feature.value6 || feature.value7) {
          rateType = 4
          if(feature.value6_1) compareType = 1
          if(feature.value1_1) compareType = 2
          if(feature.value6_2 || feature.value6_3) compareType = 3
        }
      }

      return {rateType, isProportion, compareType}
    },
    // 排序时，后缀紊乱，现在用此函数包装下sortList
    sortListMap (sortList) {
      const _attrCodeMap = (attrCode) => {
        const lastTwo = attrCode.slice(-2)
        let result
        switch (lastTwo) {
          case '_5': result = attrCode.slice(0, -1) + 1; break
          case '_6': result = attrCode.slice(0, -1) + 2; break
          case '_7': result = attrCode.slice(0, -1) + 5; break
          case '_8': result = attrCode.slice(0, -1) + 6; break
          default: result = attrCode
        }
        return result
      }
      return JSON.parse(JSON.stringify(sortList)).map(item => {
        item.attrCode = _attrCodeMap(item.attrCode)
        return item
      })
    },
    // 根据查询面板时间类型获取对应时间粒度
    getGranularity (formatType, chartOption) {
      let timeQueryCycle
      // 时间粒度对应
      switch (formatType) {
        // 旧报表的周期控件实时类型版本兼容
        case 'hour':
          // 表示实时 使用图表的粒度
          // timeQueryCycle = chartOption.timeQueryCycle
          timeQueryCycle = 'TG_00000004'
          break;
        // 当前周期控件实时类型
        case 'realTime':
          // timeQueryCycle = chartOption.timeQueryCycle
          timeQueryCycle = 'TG_00000004'
          break;
        case 'datetime-hour':
          timeQueryCycle = 'TG_00000003'
          break;
        case 'date':
          timeQueryCycle = 'TG_00000004'
          break;
        case 'month':
          timeQueryCycle = 'TG_00000005'
          break;
        case 'year':
          timeQueryCycle = 'TG_00000006'
          break;
        case 'week':
          timeQueryCycle = 'TG_00000007'
          break;
        case 'quater':
          timeQueryCycle = 'TG_00000008'
          break;
        default:
          timeQueryCycle = 'TG_00000004'
          break;
      }
      return timeQueryCycle
    },
    // 保存最近的查询数据到vuex上 新增nearUpdateData字段保存
    saveNearUpdateData (index, data = [], dimList) {
      let chart = this.$store.state.charts.chartsOption[index]
      let handelData = JSON.parse(JSON.stringify(data))
      let updateData = handelData.map(item => {
        dimList.forEach(subItem => {
          let objName = `${subItem.dimId}_Obj`
          let dimValueNm = item[subItem.dimId]
          let dimValue = dimValueNm.indexOf('###') !== -1 ? dimValueNm.split('###')[0] : dimValueNm
          let dimName = dimValueNm.indexOf('###') !== -1 ? dimValueNm.split('###')[1] : dimValueNm
          let dimValue_Name = dimValueNm.indexOf('###') !== -1 ? `${dimValue}_${dimName}` : dimValueNm
          item[objName] = {
            dimValue,
            dimName,
            dimValueNm,
            dimValue_Name
          }
        })
        return item
      })
      this.$store.commit('saveNearUpdateData', {
        index,
        data: updateData
      })
    },
    // 返回的数据 维值由'###' 替换成 '_'
    changeDataFormat (index, data = []) {
      let chart = this.$store.state.charts.chartsOption[index]
      let dimList = chart.feature.dimList
      data.forEach(item => {
        dimList.forEach(subItem => {
          if (item[subItem.dimCode].indexOf('###') !== -1) {
            item[subItem.dimCode] = item[subItem.dimCode].replace('###', '_')
          }
        })
      })
    },
    // 容器对比时间是否必须
    isNeedCompareTime (index) {
      let chart = this.$store.state.charts.chartsOption[index]
      let metricList = chart.feature.metricList
      let result = metricList.map(item => {
        let {rateType} = this.calcMetricFeature(item.feature)
        return rateType > 0 ? true : false
      })
      return result.some(value => value)
    },
    // 交叉表参数
    getCrossTableParams (post, splitInfo) {
      // console.log('post',post,'splitInfo',splitInfo)
      let newPost = {
        userId: post.userId !== '' ? post.userId : this.$store.state.auth.user.code,
        systemId: post.systemId,
        timeQueryCycle: post.timeQueryCycle,
        businessType: post.businessType,
        hideCodes: [],
        limit: post.limit,
        jql:[{
          fields:[],
          sumDim:[],
          timeCondition:{},
          conditions:[],
          proportionDimCodes: post.proportionDimCodes,
          sorts:[]
        },{
          fields:[],
          split:{},
          sumDim:[],
          timeCondition:{},
          conditions:[],
          proportionDimCodes: post.proportionDimCodes,
          sorts:[]
        }]
      }
      let formatObj = {isExist: false}
      if (post.format) {
        formatObj.isExist = true
        post.format.map(v => {
          v.percent = v.type ? true : false
          formatObj[v.metricsCode] = v
        })
      }
      // 指标列表，包含指标属性
      post.metricsList.map(v => {
        if(v.feature.value1){
          if (v.split) {
            newPost.jql[1].fields.push({
              code: v.metricsCode,
              unit: v.metricsUnitCode,
              type: 1,
              decimals: formatObj.isExist && formatObj[v.metricsCode] ? formatObj[v.metricsCode].decimals : v.decimals,
              thousands: formatObj.isExist && formatObj[v.metricsCode] ? formatObj[v.metricsCode].thousands : v.thousands,
              percent: formatObj.isExist && formatObj[v.metricsCode] ? formatObj[v.metricsCode].percent : false
            })
          } else {
            newPost.jql[0].fields.push({
              code: v.metricsCode,
              unit: v.metricsUnitCode,
              type: 1,
              decimals: formatObj.isExist && formatObj[v.metricsCode] ? formatObj[v.metricsCode].decimals : v.decimals,
              thousands: formatObj.isExist && formatObj[v.metricsCode] ? formatObj[v.metricsCode].thousands : v.thousands,
              percent: formatObj.isExist && formatObj[v.metricsCode] ? formatObj[v.metricsCode].percent : false
            })
          }
        }
        for (let i in v.feature) {
          if (v.feature[i] && i !== 'value1') {
            let metricAttrCode,tmpMetricAttrCode
            switch(i){
              case 'value2':
                metricAttrCode = v.metricsCode + '_1'
                tmpMetricAttrCode = v.metricsCode + '_1'
                break;
              case 'value3':
                metricAttrCode = v.metricsCode + '_2'
                tmpMetricAttrCode = v.metricsCode + '_2'
                break;
              case 'value4':
                metricAttrCode = v.metricsCode + '_3'
                tmpMetricAttrCode = v.metricsCode + '_3'
                break;
              case 'value5':
                metricAttrCode = v.metricsCode + '_4'
                tmpMetricAttrCode = v.metricsCode + '_4'
                break;
              case 'value6':
                metricAttrCode = v.metricsCode + '_1'
                tmpMetricAttrCode = v.metricsCode + '_5'
                break;
              case 'value7':
                metricAttrCode = v.metricsCode + '_2'
                tmpMetricAttrCode = v.metricsCode + '_6'
                break;
              case 'value8':
                metricAttrCode = v.metricsCode + '_5'
                tmpMetricAttrCode = v.metricsCode + '_7'
                break;
              case 'value9':
                metricAttrCode = v.metricsCode + '_6'
                tmpMetricAttrCode = v.metricsCode + '_8'
                break;
              case 'value1_1': // 本期可比值
                metricAttrCode = v.metricsCode + '_x'
                tmpMetricAttrCode = v.metricsCode + '_x'
                break;
              case 'value6_1': // 对比可比值
                metricAttrCode = v.metricsCode + '_1_x'
                tmpMetricAttrCode = v.metricsCode + '_1_x'
                break;
              case 'value6_2': // 对比可比差额
                metricAttrCode = v.metricsCode + '_7_x'
                tmpMetricAttrCode = v.metricsCode + '_9_x'
                break;
              case 'value6_3': // 对比可比率
                metricAttrCode = v.metricsCode + '_2_x'
                tmpMetricAttrCode = v.metricsCode + '_2_x'
                break;
            }
            if(splitInfo && splitInfo.hasOwnProperty('metricSelected') && splitInfo.metricSelected === tmpMetricAttrCode) {
              newPost.jql[1].fields.push({
                code: metricAttrCode,
                type: 1,
                decimals: formatObj.isExist && formatObj[tmpMetricAttrCode] ? formatObj[tmpMetricAttrCode].decimals : 2,
                thousands: formatObj.isExist && formatObj[tmpMetricAttrCode] ? formatObj[tmpMetricAttrCode].thousands : false,
                percent: formatObj.isExist && formatObj[tmpMetricAttrCode] ? formatObj[tmpMetricAttrCode].percent : false
              })
            } else {
              newPost.jql[0].fields.push({
                code: metricAttrCode,
                type: 1,
                decimals: formatObj.isExist && formatObj[tmpMetricAttrCode] ? formatObj[tmpMetricAttrCode].decimals : 2,
                thousands: formatObj.isExist && formatObj[tmpMetricAttrCode] ? formatObj[tmpMetricAttrCode].thousands : false,
                percent: formatObj.isExist && formatObj[tmpMetricAttrCode] ? formatObj[tmpMetricAttrCode].percent : false
              })
            }
          }
        }
      })
      // 维度
      post.dimList.map(v =>{
        newPost.jql[0].fields.push({
          code: v.dimId,
          type: 0
        })
        newPost.jql[1].fields.push({
          code: v.dimId,
          type: 0
        })
      })
      // 筛选条件
      post.conditionList.map(v =>{
        if (v.condiCode === 'dasp_date') {
          newPost.jql[0].timeCondition = v
          newPost.jql[1].timeCondition = v
        } else {
          newPost.jql[0].conditions.push(v)
          newPost.jql[1].conditions.push(v)
        }
      })
      post.sortList.map(v =>{
        newPost.jql[0].sorts.push(v)
        newPost.jql[1].sorts.push(v)
      })
      // 拆分信息，拆分维值存入conditions
      if(splitInfo && splitInfo.hasOwnProperty('metricSelected')) {
        newPost.jql[1].split.dimCode = splitInfo.dimCodeSelected.dimCode
        let dimValueCodeArr = []
        splitInfo.dimValueSelected.map(v =>{
          dimValueCodeArr.push(v.value)
        })
        // 拆分的指标判定
        let tmpMetric = splitInfo.metricSelected.slice(-2)
        if(tmpMetric === '_5' || tmpMetric === '_6' || tmpMetric === '_7' || tmpMetric === '_8' || tmpMetric === '_x'){
          switch (tmpMetric){
            case '_5':
              tmpMetric = splitInfo.metricSelected.replace(/_5$/,'_1')
              break
            case '_6':
              tmpMetric = splitInfo.metricSelected.replace(/_6$/,'_2')
              break
            case '_7':
              tmpMetric = splitInfo.metricSelected.replace(/_7$/,'_5')
              break
            case '_8':
              tmpMetric = splitInfo.metricSelected.replace(/_8$/,'_6')
              break
            case '_x':
              if(splitInfo.metricSelected.slice(-4) === '_9_x') tmpMetric = splitInfo.metricSelected.replace(/_9_x$/,'_7_x')
              break
          }
          newPost.jql[1].split.metricsCodes = [tmpMetric]
        }else{
          newPost.jql[1].split.metricsCodes = [splitInfo.metricSelected]
        }
        newPost.jql[1].fields.push({
          code: splitInfo.dimCodeSelected.dimCode,
          type: 0
        })
        newPost.jql[1].conditions.push({
          condiCode: splitInfo.dimCodeSelected.dimCode,
          condiType: 0,
          operator: '6',
          condiComparedValue: dimValueCodeArr.join()
        })
      } else {
        newPost.jql = newPost.jql.slice(0,1)
      }
      if(post.metricsList.length === 1 && splitInfo && splitInfo.hasOwnProperty('metricSelected')){
        let num = 0
        for (let i in post.metricsList[0].feature){
          if(post.metricsList[0].feature[i]){
            num +=1
          }
        }
        if(num < 2){
          newPost.jql = newPost.jql.slice(1,2)
        }
      }
      return newPost
    }
  }
}
