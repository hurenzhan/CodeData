import axios from 'axios'
import api from './index'
import apiURL from '../config'
import env from '../../env'

export default {
  // 查询报表数据
  data(post, config) {
    config.baseURL = env.api
    return api.post('/tig-query/openApi/reportData/query', post, config)
  },

  // 查询报表权限
  checkAuth(params) {
    return api.get('/manage/checkUserPerm', {
      params
    })
  },
  // 查询报表配置信息
  config(params, headers) {
    const config = {}
    config.params = params
    if (headers) {
      config.headers = headers
    }
    return api.get('/report/info', config)
  },
  // 导出报表数据
  export(post, config) {
    // reportExport/export
    return api.post(`${apiURL.API_URL}/download/openApi/reportExport/exportData`, post, config)
  },
  // 报表详情公用
  // 指标详情
  metricDetail(params) {
    if (window.sys === 'admin') {
      return api.get('/cockpit/metricDetail', params)
    } else {
      return api.get('/dictionary/metricDetail', params)
    }
  },
  // 维度详情
  queryDimValue(body) {
    if (window.sys === 'admin') {
      return api.post('/cockpit/queryDimValue', body)
    } else {
      return api.post('/dictionary/queryDimValue', body)
    }
  },
  // 维度列表 modify-20180207
  qryMetricDim(body) {
    if (window.sys === 'admin') {
      return api.post('/cockpit/qryMetricDim', body)
    } else {
      return api.post('/dictionary/qryMetricDim', body)
    }
  },
  // 指标路径 modify-20180207
  qryMetricPath(body) {
    if (window.sys === 'admin') {
      return api.post('/cockpit/qryMetricPath', body)
    } else {
      return api.post('/dictionary/qryMetricPath', body)
    }
  },
  // 维值查询
  dimensionQuery(params) {
    return api.get('/dim/listValue', {
      params
    })
  }
  // 自定义报表公用接口
}
