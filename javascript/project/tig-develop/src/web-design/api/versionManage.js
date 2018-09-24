import api from './index'

export default {
  // 获取电子表格页面的报表列表
  queryElecReportList: {
    url: '/report/list',
    methods: 'get',
    params: {
      groupId: '',
      reportType: '1,2', // 1普通表 2交叉表
      searchKey: ''
    }
  },
  // 获取可视化报表页面报表列表
  queryReportList: {
    url: '/report/list',
    methods: 'get',
    params: {
      groupId: '',
      reportType: '3', // 3可视化报表
      searchKey: ''
    }
  },
  // 获取报表分组列表
  queryReportGroupList() {
    return api.get('/report/groupList')
  },
  // 分组重命名
  groupRename(params) {
    // 这种写法是queryString传参,不是在body中放参数了.
    // 注意: post请求的三个参数作用 参数1:url, 参数2:body请求体, 参数3: config配置.
    // 参数3必须用大括号包着形参,作用是保留config的自定义能力.
    return api.post('/report/updateGroupName', {}, {params})
  },
  // 删除报表分组名称
  deleteGroupName(params) {
    return api.post('/report/deleteGroup', {}, {params})
  },
  // 新增报表分组
  addReportGroup(params) {
    return api.post('/report/addGroup', {}, {params})
  },
  // 锁定报表
  lockReport(params) {
    return api.post('/report/lock', {}, {params})
  },
  // 新增报表
  addReportVersion(body) {
    return api.post('/report/add', body)
  },
  // 删除报表
  deleteReport(params) {
    return api.post('/report/delete', {}, {params})
  },
  // 获取报表操作历史记录
  reportHistoryInfo(params) {
    return api.get('/report/logList', params)
  },
  // 添加报表到分组
  addReportToGroup(body) {
    return api.post('/report/addReportToGroup', body)
  }
}
