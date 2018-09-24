import api from './index'

export default {
  // 查询报表配置信息
  queryInfo(data) {
    return api.get('report/info'//'/manage/queryReportDetailByReportAndVersionId'
    , { params: data })
  },
  // 更新报表信息接口
  changeReport(data = {}) {
    return api.post('/report/update', data)
  },
  // 审批接口
  changeState(data) {
    return api.post('/applicationCenter/approveApplication', data)
  },
  // 维值查询
  queryDimValue(data, key) {
    return api.get('/dim/listValue', { params: {
      key,
      dimId: data,
      offset: 0,
      limit: 50
    } })
  },
  // 上卷下钻接口
  uprolldrilldown(data, metricsCodes) {
    return api.get('/dim/queryUpDown', {
      params: {
        dimId: data,
        flag: '1'
      }
      // metricsCodes
    })
  },
  // 维度下相应维值查询
  queryDimInfo(data) {
    return api.get('/dim/listValue', { params: {
      // key,
      dimId: data,
      offset: 0,
      limit: 50
    } })
  },
  // 维度下相应维值远程模糊查询  => 查询面板使用
  queryDimInfoByKey(obj) {
    return api.get('/dim/listValue', { params: {
      key: obj.key,
      dimId: obj.dimCode,
      offset: 0,
      limit: 100
    } })
  },
  queryDimInfoByTree(obj) {
    return api.get('/dim/queryDimTree', {params: {
      dimCode: obj.dimCode,
      pDimCode: obj.keyDimCode,
      pDimValueCode: obj.key,
      offset: 0,
      limit: 100
    } })
  },
  // 级联时维值远程模糊查询  => 查询面板使用
  queryDimInfoByCascadeKey(obj) {
    return api.get('/dim/queryDimTree', { params: {
      dimValueCode: obj.key,
      dimCode: obj.dimCode,
      pDimCode: obj.fatherCode,
      pDimValueCode: obj.fatherValue,
      offset: 0,
      limit: 100
    } })
  }
}
