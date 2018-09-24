import api from './index'
import env from '@/env'

export default {
  // 指标列表的获取
  getMetrics (data) {
    return api.get('/metric/list', { params: data })
  },
  // 下钻获取
  getDill (data) {
    return api.get('/dim/queryUpDown', { params: data })
  },
  // 获取业务域
  getDomainList () {
    return api.get('/metric/listDomain')
  },
  // 获取主题
  getSubjectList (data) {
    return api.get('/metric/listSubject', { params: data })
  },
  // 新增一张可视化报表
  add (data) {
    return api.post('/report/add', data)
  },
  // 更新整张可视化报表
  update (data) {
    return api.post('/report/update', data)
  },
  // 获取可视化报表详情
  getReportInfo (data) {
    return api.get('/report/info', { params: data })
  },
  dimListValue (data) {
    // 按列维度拆分接口
    return api.get('/dim/listValue', { params: data })
  },
  // 获取经纬度
  queryLonLat (data) {
    return api.get('/dim/queryLonLat', { params: data })
  },
  // 表格导出
  exportReportFile (data) {
    return api.post('/openApi/reportData/export', data, {
       baseURL: `${env.api}/tig-download`
    })
  },
  // 获取地图下砖信息
  queryMapData (data) {
    return api.get('/openApi/queryMapData', { params: data })
  }
}
