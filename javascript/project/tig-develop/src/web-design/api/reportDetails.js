import api from './index'

export default {
  // 指标列表查询
  getList: {
    url: '/dictionary/qryMetricList',
    methods: 'post',
    body: {
      offset: 0,
      limit: 10,
      sortBy: '', // 排序字段
      sortType: 0, // 排序方式，0 升序，1降序
      searchKey: '', // 指标名称搜索关键字
      busiTypes: '', // 指标业务域,多个指标业务域用逗号隔开
      timeGranularitys: '', // 时间粒度，多个时间粒度用逗号隔开
      dimCodes: '', // 维度编码，多个维度用逗号隔开
      subjects: '', // 指标主题1,指标主题2 。都是字符串，多个指标主题用逗号隔开
      rightFlag: 0, // 是否是权限内的维度，0没有勾选，1勾选
      sdFlag: 0 // 1：查询明细指标，0：查询汇总指标
    }
  },
  // 百川业务域
  querybusiScope() {
    return api.get('/dictionary/queryDashBusiness')
  },
  // 百川主题
  querySubject(params) {
    return api.get('/dictionary/queryDashTopic', params)
  },
  // 时间粒度
  queryTime() {
    return api.get('/dictionary/timeGranularity')
  },
  // 权限维度
  queryDimList(params) {
    return api.get('/dictionary/queryDimList', params)
  },
  // 校验交叉维度
  checkJCDims(params) {
    return api.post('/manage/checkJCDims', params)
  },
  // 修改报表初始化查询（修改二维表/交叉表)
   // 创建报表
  insertTableInfo(params) {
    return api.post('/manage/insertReportBySystemLabel', params)
  },
  // 修改报表信息
  modifyInfo(params) {
    return api.post('/manage/updateReport', params)
  },
  // 修改报表回退查询
  queryInfo(params) {
    return api.get('/report/info', params)
  },
  // 指标详情
  // metricDetail(params) {
  //   return api.get('/dictionary/metricDetail', params)
  // },
  // 获取自定义报表详情
  getExportList: {
    url: '/report/getReportDetials',
    methods: 'post',
    params: {}
  },
  // 报表市场下拉框
  // 产业下拉框（一级菜单）
  getIndustry(params) {
    return api.get('/industry', params)
  },
  // 业务域下拉框（二级菜单）
  getBusiScope(params) {
    return api.get('/busiScope?industryId=111', params)
  },
  // 主题接口1下拉框（一级菜单）
  getReportTopic(params) {
    return api.get('/reportTopic?industryId=111&businessId=22', params)
  },
  // 主题接口2下拉框（二级菜单）
  getReportTopicSecond(params) {
    return api.get('/reportTopicSecond?industryId=111&businessId=222&reportTopicId=333', params)
  },
}
