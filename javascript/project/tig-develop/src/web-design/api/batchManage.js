import api from './index'

export default {
  // 获取可视化报表list
  getReportList ({limit}) {
    return api.get('/report/listAll', {
      params: {
        reportType: '3', // 3可视化报表
        limit
      }
    })
  },
  // 更新整张可视化报表
  update ({reportId, versionId, reportContent, reportName}) {
    return api.post('/report/update', {
      reportType: 3,
      reportId,
      versionId,
      reportContent,
      reportName
    })
  },
  // 获取可视化报表详情
  getReportInfo ({reportId, versionId}) {
    return api.get('/report/info', {
      params: {
        reportId,
        versionId
      }
    })
  }
}
