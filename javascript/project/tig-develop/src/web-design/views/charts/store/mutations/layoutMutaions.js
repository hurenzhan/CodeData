import { cancelAllSelected, getNewY, getCrossDimList, getAlias } from '../../utils/utils'
import { containerInit, constantWrapper } from '../../static/configData'
import configClass from '../../static/configClass'
import chartRelation from './chartRelation'

// 点击‘更新’后，将metricList扁平化
const _metricListFlat = (state, { index }) => {
  // 前端到后端字段的映射
  const _metricInfoMap = (v) => {
    let name = ''
    let nameCode = ''
    switch (v) {
      case 'value1': break
      case 'value1_1': name = '本期可比额'; nameCode = '_x'; break
      case 'value2': name = '同比值'; nameCode = '_1'; break
      case 'value3': name = '同比率'; nameCode = '_2'; break
      case 'value4': name = '环比值'; nameCode = '_3'; break
      case 'value5': name = '环比率'; nameCode = '_4'; break
      case 'value6': name = '对比值'; nameCode = '_5'; break
      case 'value6_1': name = '对比期可比额'; nameCode = '_1_x'; break
      case 'value6_2': name = '对比期可比差额'; nameCode = '_9_x'; break
      case 'value6_3': name = '对比期可比率'; nameCode = '_2_x'; break
      case 'value6_4': name = '增量'; nameCode = '_11'; break
      case 'value7': name = '对比率'; nameCode = '_6'; break
      case 'value8': name = '占比值'; nameCode = '_7'; break
      case 'value9': name = '占比率'; nameCode = '_8'; break
    }
    return { name, nameCode }
  }
  // 增加度量
  const _addMetric = (arr, item, v) => {
    const { name, nameCode } = _metricInfoMap(v)
    const unit = (item.mulUnits &&
      item.mulUnits.filter(unitItem => unitItem.unitCode === item.unitSelected) &&
      item.mulUnits.filter(unitItem => unitItem.unitCode === item.unitSelected)[0] &&
      item.mulUnits.filter(unitItem => unitItem.unitCode === item.unitSelected)[0].unitNm) || ''
    // 是率的时候不需要展示单位
    const showUnit = ['_2', '_4', '_6', '_8', '_2_x'].includes(nameCode) ? '' : `(${unit})`
    const alias = getAlias({ code: item.metricCode, alias: state.alias })
    const computedMetricName = alias === false ? item.metricName : alias
    arr.push({
      metricCode: `${item.metricCode}${nameCode}`,
      metricName: `${computedMetricName}${name}${showUnit}`,
      sdFlag: item.sdFlag,
      timeGranularity: item.timeGranularity,
      mulUnits: item.mulUnits,
      unitSelected: item.unitSelected
    })

  }
  let arr = []
  const metricList = JSON.parse(JSON.stringify(state.chartsOption[index].feature.metricList))
  metricList.forEach(item => {
    for (const key in item.feature) {
      if (item.feature[key]) _addMetric(arr, item, key)
    }
  })
  state.chartsOption[index].feature.metricListFlat = arr
}

export default {
  // 指标选择弹窗的toggle
  toggleMetricDialog(state, value) {
    state.metricDialogToggle = value
  },
  // 添加一个容器
  addContainer({ chartsOption }, { id, tabContainerIndex, activeTabIndex }) {
    cancelAllSelected(chartsOption)
    const length = chartsOption.length
    const nextIndex = length || 0
    const y = getNewY(chartsOption, tabContainerIndex, activeTabIndex)
    let feature = {}
    let h = containerInit.h
    switch (id) {
      case 0:
        feature = new configClass.ChartFeature(); break
      case 1:
        feature = new configClass.TextFeature()
        h = 8.46;    // 固定文本容器初始高度为83px 折算h
        break
      case 2:
        feature = new configClass.SearchFeature()
        h = 10.37;   // 固定查询面板容器初始高度为104px 折算h
        break
      case 3: feature = new configClass.Tab(); break
      case 4:
        feature = new configClass.Iframe();
        break
      default: feature = {}
    }
    chartsOption.push(
      {
        id,
        name: '未命名',
        nameToggle: true, // 容器名字是否显示
        x: 0,
        y,
        w: containerInit.w,
        h,
        i: nextIndex,
        selected: true, // 容器是否聚焦（被选中）
        drop: false, // 是否删除
        nearUpdateTime: [], // 最近一次的查询数据的时间
        searchTime: [], // 查询面版使用过的最近一次的时间
        nearLinkTime: [], //储存数据关系与查询面板两个中最新的操作使用过的时间
        limitNum: constantWrapper.LIMIT_NUM, // 预览行数
        timeQueryCycle: '', // 时间粒度
        sortByWhich: 1, // 根据什么排序,0维度 1指标
        sortType: 1, // 降序1，升序0，自然2
        data: '', // 点击更新按钮后获取的数据
        feature,
        tabContainerIndex, // tab容器的index
        activeTabIndex, // 属于哪一个tab标签页
        linkedContainers: [], // 高级：联动的容器
        loading: false, // 是否正在查询数据
        updateBtnActive: false, // 更新按钮是否高亮，指标或者维度改变时，将此置为true
        selectedTab: '',// Tab切换选中的容器
        warnData: [], // 告警数据集合
        showMoreDataFlag: false, // 是否显示更多数据
        enableTab: false,//是否开启Tab绑定
        selectedReport: '', // 已选中的报表
        reportVersionList: [], // 报表版本的list
        selectedReportVersion: '', // 已选中的报表版本
        reportSearchKey: '', // 更多数据的关键字
        dimFilter: [], // 维度过滤器
        lockedReportList: [], // 已锁定报表的列表
        detailSelectedReport: '', // 详情已选中的报表
        detailSelectedReportVersion: '', // 详情已选中的报表版本
        detailFilter: '',  //详情过滤器
      }
    )
  },
  // 容器拖动或者大小变化时
  resizeOrMove({ chartsOption }, newArr) {
    chartsOption = newArr
  },
  /**
   * 改变选中的容器
   * @params {Number} index 选中第几个
   */
  selectedChange({ chartsOption }, index) {
    const selectedContainer = chartsOption.filter(item => item.selected)[0]
    if (selectedContainer && selectedContainer.i === index) return
    cancelAllSelected(chartsOption, index)
  },
  /**
   * 删除选中的容器
   * @params {Number} index 删除第几个
   */
  delContainer({ chartsOption }, index) {
    chartsOption[index].drop = true
    for (let i = 0; i < chartsOption.length; i++) {
      if (chartsOption[i].feature.chartId === 2 && chartsOption[i].selectedTab == index) {
        chartsOption[i].selectedTab = null
      }
    }
  },
  /**
   * 同步数据集
   * @param {Array} data
   */
  syncDataSet(state, data) {
    data.forEach(dataItem => {
      dataItem.dimList && dataItem.dimList.forEach(dimListItem => {
        let isCustom = 0
        let customArr = ['DASP']
        const code = dimListItem.dimCode.split('_')[0]
        if (customArr.some(item => item === code)) {
          isCustom = 1
        } else {
          isCustom = 0
        }
        dimListItem.isCustom = isCustom
      })
    })
    state.dataSet = data
  },
  // 工作表重命名
  changeName(state, value) {
    state.name = value
  },
  /**
   * 为相应的容器挑选或者取消选择指标
   * @param {Number} index 第几个容器
   * @param {String} metricsCode 指标
   * @param {Number} cancelIndex 选择or取消
   */
  toggleSelect(state, { index, metricCode, cancelIndex }) {
    if (cancelIndex === undefined) {
      const currentMetric = state.dataSet.filter(item => item.metricCode === metricCode)[0]
      state.chartsOption[index].feature.metricList.push({
        metricCode,
        metricName: currentMetric.metricName,
        sdFlag: currentMetric.sdFlag,
        timeGranularity: currentMetric.timeGranularity,
        mulUnits: currentMetric.mulUnits, // 所有单位
        unitSelected: currentMetric.mulUnits.filter(item => item.isDefault === 1) && currentMetric.mulUnits.filter(item => item.isDefault === 1)[0] && currentMetric.mulUnits.filter(item => item.isDefault === 1)[0].unitCode || '', // 选中的单位
        // 属性值的显示与否
        feature: {
          value1: true, // 本期
          value1_1: false, // 本期可比额
          value2: false, // 同比值
          value3: false, // 同比率
          value4: false, // 环比值
          value5: false, // 环比率
          value6: false, // 对比值
          value6_1: false, // 对比期期可比额
          value6_2: false, // 对比期期可比差额
          value6_3: false, // 对比期期可比率
          value7: false, // 对比率
          value8: false, // 占比值
          value9: false, // 占比率
        }
      })
    } else {
      state.chartsOption[index].feature.metricList.splice(cancelIndex, 1)
    }
    // toggle选择指标后得判断容器选中的维度还在不在交叉维里
    const crossDimList = getCrossDimList(state.dataSet, state.chartsOption[index].feature.metricList)
    const tmpDimList = []
    state.chartsOption[index].feature.dimList.forEach(item => {
      if (crossDimList.some(each => each.dimCode === item.dimCode)) {
        tmpDimList.push(item)
      } else {
        // 根据维度删除图表的联动关系
        chartRelation.relationChangeByDim(state, { index, dimCode: item.dimCode })
      }
    })
    state.chartsOption[index].feature.dimList = tmpDimList
  },
  // 重置一个容器所选指标的feature
  resetMetricFeature(state, { index }) {
    const metricList = state.chartsOption[index].feature.metricList
    metricList.forEach(item => {
      for (const key in item.feature) {
        if (key === 'value1') {
          item.feature[key] = true
        } else {
          item.feature[key] = false
        }
      }
    })
    _metricListFlat(state, { index })
  },
  // 度量变化后，将metricList扁平化
  metricListFlat(state, { index }) {
    _metricListFlat(state, { index })
  },
  // 为容器选择维度
  addDim(state, { index, dimCode, dimName, dimType, isCustom }) {
    state.chartsOption[index].feature.dimList.push({
      dimCode,
      dimName,
      dimType,
      isCustom
    })
  },
  // 为容器取消选择维度
  cancelDim(state, { index, dimIndex }) {
    state.chartsOption[index].feature.dimList.splice(dimIndex, 1)
  },
  // 为选中的指标选择需要展示的属性
  metricFeatureChange(state, { index, metricIndex, key, value }) {
    state.chartsOption[index].feature.metricList[metricIndex].feature[key] = value
    // console.log('metricFeatureChange')
  },
  // 为选中的指标切换单位
  unitChange(state, { index, metricIndex, value }) {
    state.chartsOption[index].feature.metricList[metricIndex].unitSelected = value
    // 同步 指标的属性列表数据
    let metricListFlat = state.chartsOption[index].feature.metricListFlat
    let metricCode = state.chartsOption[index].feature.metricList[metricIndex].metricCode
    let metricName = state.chartsOption[index].feature.metricList[metricIndex].metricName
    let unitName = state.chartsOption[index].feature.metricList[metricIndex].mulUnits.filter(item => {
        return item.unitCode === value
      })[0].unitNm
    metricListFlat.forEach(item => {
      if (new RegExp('^'+metricCode,'g').test(item.metricCode)) {
        item.unitSelected = value
        item.metricName = item.metricName.replace(/\([^\)]*\)$/g, `(${unitName})`)
      }
    })
  },
  /*
  * 同步数据，代表这个容器点击过‘更新’按钮
  */
  syncData(state, { index, data }) {
    if (data) state.chartsOption[index].data = data
  },
    /*
  * 同步数据，代表这个容器点击过‘更新’按钮 千分位数据
  */
  syncThoundsData(state, { index, data }) {
    if (data) state.chartsOption[index].thoundsData = data
  },
  // ‘更新’按钮的高亮状态toggle
  updateBtnActiveToggle(state, { index, value }) {
    state.chartsOption[index].updateBtnActive = value
  },
  // 容器的排序规则的change
  sortTypeChange(state, { index, value }) {
    state.chartsOption[index].sortType = value
  },
  // 容器的根据谁排序的change
  sortByWhichChange(state, { index, value }) {
    state.chartsOption[index].sortByWhich = value
  },
  /**
   * 将选中的容器（类型是图表），设定图表类型
   * @param {Number} index 第几个容器
   * @param {Number} id 什么类型的图表
   */
  selectType(state, { index, id }) {
    state.chartsOption[index].feature.chartId = id
    // 指标面板2
    if (id === 3) state.chartsOption[index].feature.styleConfig = new configClass.ChinaMap()
    if (id === 2) state.chartsOption[index].feature.styleConfig = new configClass.ChartLabel()
    if (id === 1) state.chartsOption[index].feature.styleConfig = new configClass.Pie()
    if (id === 0) state.chartsOption[index].feature.styleConfig = new configClass.ChartTable()
    if (id === 13) state.chartsOption[index].feature.styleConfig = new configClass.SimpleChartTable()
    if (id === 15) state.chartsOption[index].feature.styleConfig = new configClass.CrossChartTable()
    if (id === 4) state.chartsOption[index].feature.styleConfig = new configClass.Line()
    if (id === 5) state.chartsOption[index].feature.styleConfig = new configClass.Bar()
    if (id === 6) state.chartsOption[index].feature.styleConfig = new configClass.Relation()
    if (id === 7) state.chartsOption[index].feature.styleConfig = new configClass.WordCloud()
    if (id === 8) state.chartsOption[index].feature.styleConfig = new configClass.Radar()
    if (id === 9) state.chartsOption[index].feature.styleConfig = new configClass.Scatter()
    if (id === 10) state.chartsOption[index].feature.styleConfig = new configClass.Gauge()
    if (id === 11) state.chartsOption[index].feature.styleConfig = new configClass.Bubble()
    if (id === 12) state.chartsOption[index].feature.styleConfig = new configClass.Funnel()
    if (id === 14) state.chartsOption[index].feature.styleConfig = new configClass.Card()
  },
  // 更改容器的名字
  changeContainerName(state, { index, value }) {
    state.chartsOption[index].name = value
  },
  // 更改容器的名字toggle
  containerNameToggle(state, { index, value }) {
    state.chartsOption[index].nameToggle = value
  },
  // 更改容器的h,+-1
  // todo 这里得用公式，不能是简单的1
  containerHeightChange (state, { index, value }) {
    const height = (40 + containerInit.margin[0]) / (containerInit.rowHeight + containerInit.margin[0])
    state.chartsOption[index].h -= value ? -1 * height : height
  },
  /**
   * 选中指标的排序
   * @param {Array} sortList 排序的ids
   * @param {Number} type 指标：1  维度：2
   */
  sortMetricsOrDim(state, { index, sortList, type }) {
    let typeWord = type === 1 ? 'metricList' : 'dimList'
    let codeType = type === 1 ? 'metricCode' : 'dimCode'
    state.chartsOption[index].feature[typeWord].sort((a, b) => sortList.indexOf(a[codeType]) - sortList.indexOf(b[codeType]))
    // 对指标及属性 进行排序
    if (type === 1) {
      let metricList = state.chartsOption[index].feature.metricList
      let metricListFlat = state.chartsOption[index].feature.metricListFlat
      let newMetricListFlat = []
      metricList.forEach(item => {
        metricListFlat.forEach(subItem => {
          if (subItem.metricCode.indexOf(item.metricCode) !== -1) {
            newMetricListFlat.push(subItem)
          }
        })
      })
      state.chartsOption[index].feature.metricListFlat = newMetricListFlat
      //state.chartsOption[index].feature.metricListFlat.sort((a, b) => sortList.indexOf(a[codeType]) - sortList.indexOf(b[codeType]))
    }
  },
  // 预览toggle
  preview(state, value) {
    state.previewToggle = value
  },
  // 保存弹窗toggle
  saveDialogToggle(state, value) {
    state.saveDialogToggle = value
  },
  // 维度权限的chang
  dimensionLimitChange(state, { index, value }) {
    state.dimensionLimit[index].value = value
  },
  // 再编辑时，需要同步vuex的数据
  asyncDataInEdit(state, { reportContent, name, createTime }) {
    reportContent = JSON.parse(reportContent)
    state.dataSet = reportContent.dataSet
    state.metricDialogToggle = reportContent.metricDialogToggle
    state.name = name
    state.createTime = createTime
    state.warnData = reportContent.warnData
    state.alias = reportContent.alias
    state.chartsOption = reportContent.chartsOption.map(item => {
      if (item.tabContainerIndex !== undefined) return { drop: true, i: undefined, feature: { metricList: [] } }
      return item
    })
  },
  // 再编辑同步数据，数据中有Tab时，需要在nextTick后，再次同步tab的子容器 （这个bug是设计初期，vue-grid里的i应该为字符，却使用了数字造成）
  asyncDataTwiceInEdit(state, reportContent) {
    reportContent = JSON.parse(reportContent)
    state.chartsOption = state.chartsOption.map((item, index) => {
      if (item.i === undefined) return reportContent.chartsOption[index]
      return item
    })
  },
  // 同步容器的查询时间
  syncUpdateTime(state, { index, time }) {
    state.chartsOption[index].nearUpdateTime = time
  },
  // 同步预览行数
  syncLimitNum(state, { index, limitNum }) {
    state.chartsOption[index].limitNum = limitNum
  },
  // 同步时间粒度
  syncTimeQueryCycle(state, { index, value }) {
    state.chartsOption[index].timeQueryCycle = value
  },
  // 重置state
  resetState(state) {
    // 这里的字段要和store保持一致
    state.chartsOption = []
    state.name = '未命名' // 可视化报表名字
    state.metricDialogToggle = true // 选择指标弹窗toggle
    state.saveDialogToggle = false // 保存弹窗toggle
    state.previewToggle = false // 预览toggle
    state.dataSet = [] // 数据集
    state.createTime = ''
    state.alias = {
      metrics: [],
      dims: []
    }
  },
  // 容器的loading
  loadingToggle(state, { index, value }) {
    if (state.chartsOption[index]) state.chartsOption[index].loading = value
  },
  // 是否显示更多数据
  showMoreData(state, { index, value }) {
    state.chartsOption[index].showMoreDataFlag = value
  },
  // 存放每个报表的list
  getLockedReportList(state, { index, reportList }) {
    state.chartsOption[index].lockedReportList = reportList
  },
  //是否开启Tab绑定
  saveEnableTab(state, { index, value }) {
    state.chartsOption[index].enableTab = value
  },
  //存放Tab切换选中的容器
  saveSelectedTab(state, { index, selectedTab }) {
    state.chartsOption[index].selectedTab = selectedTab
  },
  // 存放选中的报表
  saveSelectedReport(state, { index, selectedReport }) {
    state.chartsOption[index].selectedReport = selectedReport
  },
  //存放选中报表的编号
  saveSelectedReportVersion(state, { index, selectedReportVersion }) {
    state.chartsOption[index].selectedReportVersion = selectedReportVersion
  },

  // 存放详情选中的报表
  saveDetailSelectedReport(state, { index, selectedReport }) {
    state.chartsOption[index].detailSelectedReport = selectedReport
  },
  //存放详情选中报表的编号
  saveDetailSelectedReportVersion(state, { index, selectedReportVersion }) {
    state.chartsOption[index].detailSelectedReportVersion = selectedReportVersion
  },
  //存放选中报表的过滤条件
  saveDetailFilter(state, { index, detailFilter }) {
    state.chartsOption[index].detailFilter = detailFilter
  },

  // 获取当前报表的版本
  getReportVersionList(state, { index, reportVersionList }) {
    state.chartsOption[index].reportVersionList = reportVersionList
  },
  // 存储saveReportSearchKey
  saveReportSearchKey(state, { index, reportSearchKey }) {
    state.chartsOption[index].reportSearchKey = reportSearchKey
  },
  // 存储报表的查询条件
  saveQueryJson(state, { index, data }) {
    state.chartsOption[index].queryJson = data
  },
  // 保存报表最近一次更新的数据 查询面板or图表自身
  saveNearUpdateData (state, { index, data}) {
    state.chartsOption[index].nearUpdateData = data
  }
}
