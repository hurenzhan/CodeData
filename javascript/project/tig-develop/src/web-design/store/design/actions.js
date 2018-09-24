import { Message } from 'iview'
import api from '@/web-design/api/design'

function formatLeftData(res) {
  const config = {}
  const data = JSON.parse(res.reportContent)
  // console.log(data)
  config.dim = data.dimIdList
  config.metric = data.metricIdList
  if (config.dim && config.dim.length) { // 初始化维度信息
    config.dim.forEach((v) => {
      v.queryDimValue = []
      v.filterValue = ''
      v.name = v.dimName
      v.id = v.dimCode
      v.type = 0
      v.activeClass = false
      v.align = 'center'
      v.collapse = true
      v.filterChecked = false
      v.alignDisplay = {
        vertical: 2,
        horizontal: 4 // 水平方向456
      }
      v.formatter = {
        type: 0, // 数值类型：0 -->数值， 1 -->百分比
        decimals: 2, // 小数点位数
        thousands: false
      }
    })
  }
  if (config.metric && config.metric.length) {
    config.metric.forEach((v) => { // 初始化度量信息
      v.filterValue = ''
      v.name = v.metricName
      v.id = v.metricId
      v.type = 1
      v.unitDefaultNm = v.unitDefaultNm
      v.align = 'center'
      v.activeClass = false
      v.collapse = true
      v.filterChecked = false
      v.alignDisplay = {
        vertical: 2,
        horizontal: 6 // 水平方向456
      }
      v.formatter = {
        type: 0, // 数值类型：0 -->数值， 1 -->百分比
        decimals: 2, // 小数点位数
        thousands: false
      }
    })
  }
  return config
}
const actions = {
  // 进入报表开发查询接口
  async getDimAndMetric({ commit }, payload) {
    const data = await api.queryInfo(payload)
    // console.log(data)
    if (!data) return false
    // 持久化储存字段versionInfoEntity下的id
    if (data.data && data.data.versionId) {
      localStorage.setItem('vId', data.data.versionId)
    }
    // if (data.data && data.data.reportEntity) {
    //   const systemId = data.data.reportEntity.systemId
    //   commit('saveSystemId', systemId)
    // }
    // 在没有数据的情况下，是创建状态，需要初始化查询的数据
    if (data.data && data.data.reportContent) {
      const leftData = formatLeftData(data.data)
      commit('onlyChangeLeftContent', leftData)
    }
    // 存有配置信息的时候替换所有配置信息
    // 存在reportContent的情况下全量替换
    if (data.data && data.data.reportContent) {
      const config = JSON.parse(data.data.reportContent)
      // console.log(config)
      commit('changeWholeState', config.reportContent)
    }
    return true
  },
  // 更新报表接口
  async updateReport({ state }, payload) {
    // 点击保存按钮，更新报表组装数据
    const vId = localStorage.getItem('vId')
    // update 数据装箱
    // 报表配置字符串 versionInfoEntity.reportContent
    // 所有报表配置信息都储存在state里
    // 处理表头数据
    let reallyRow = ''
    if (state.tableHeaderActive) {
      reallyRow = state.row
    } else {
      reallyRow = 1
    }
    const tableChange = JSON.stringify(state)
    const tableData = JSON.parse(tableChange)
    const columnList = tableData.columnList
    const tableHeader = tableData.tableHeader
    // console.log(tableHeader.splice(0, reallyRow))
    const tableHeaderArray = []
    tableHeader.forEach((v) => {
      const eachArray = []
      columnList.forEach((c) => {
        eachArray.push(v[c.id])
      })
      tableHeaderArray.push(eachArray)
    })
    tableData.realTableHeader = tableHeader.splice(0, reallyRow)
    tableHeaderArray.splice(reallyRow, 5)
    tableData.tableHeader = tableHeaderArray

    // 处理合并顺序
    const payloadHandle = {}
    const mergeColumn = [] // 和并列
    const total = [] // 合计
    // 处理顺序和列中顺序一样
    tableData.columnList.forEach((v) => {
      tableData.subtotal.mergeColumn.forEach((j) => {
        if (v.id === j) {
          mergeColumn.push(j)
        }
      })
      tableData.subtotal.total.forEach((k) => {
        if (v.id === k) {
          total.push(k)
        }
      })
    })
    payloadHandle.mergeColumn = mergeColumn
    payloadHandle.total = total
    tableData.subtotal = payloadHandle

    const config = { ...tableData }
    if (config.columnList.length === 0) {
      Message.warning('列头为空时，无法保存 ')
      return false
    }
    let granularity
    // 取最小时间粒度
    if (config.timeList.length && 'name' in config.timeList[0]) {
      const granularityMap = config.timeList.map(v => v.name)
      if (granularityMap.includes('年')) {
        granularity = '年'
      }
      if (granularityMap.includes('月')) {
        granularity = '月'
      }
      if (granularityMap.includes('日')) {
        granularity = '日'
      }
    }
    const updateData = {
      "versionId": payload.versionId,//版本
      "reportId": payload.reportId,//报表id
      "reportDesc":"",//描述
      "reportName":payload.reportName,//报表名称
      "reportType":payload.reportType,//报表类型
    }
    const reportContent = {
      eportId: payload.reportId,
      reportName: payload.reportName,
      versionId: payload.versionId,
      exportFlag: state.exportData ? 1 : 0, // 0是false，1是true
      showFirstFlag: '',
      granularity,
      id: vId,
      dimIdList:  state.dim.map(v => ({ // dimId -->改成 dimCode
        dimCode: v.dimCode,
        isPrivilege: v.isPrivilege,
        dimName: v.dimName,
        subDims: v.subDims,
        supDims: v.supDims
      })),
      metricIdList: state.metric.map(v => ({
        metricId: v.metricId,
        metricName: v.metricName
      })),
      reportContent: config
    }
    // console.log(config)
    updateData.reportContent = JSON.stringify(reportContent)
    const status = await api.changeReport(updateData)
    if (status && status.statusCode === '0') {
      Message.success('报表保存成功')
      if (payload.type === 1) return false
      location.href = '#/tableManage'
    }
    return true
  },
  // 审批流程

}

export default actions
