import api from './index'

export default {
  // 开发端-报表-报表管理-已发布报表
  getPublish: {
    url: '/manage/queryRptInfo',
    methods: 'get',
    params: {
      offset: 10,
      limit: 10,
      onlineState: 1,
      searchKey: '',
      industry: '',
      businessScope: '',
      firstSubject: '',
      secondSubject: '',
      isSub: '',
      systemLabel: 0
    }
  },
  // 已发布报表的详情信息（单条报表）
  getPublishDetail(params) {
    return api.get('/report/info', params)
  },
  // 开发端-报表-报表管理-未发布报表
  // console.log(location.search.split('=')[1])
  getUnpublish: {
    url: '/manage/queryRptInfo',
    methods: 'get',
    params: {
      offset: 10,
      limit: 10,
      onlineState: 0,
      searchKey: '',
      industry: '',
      businessScope: '',
      firstSubject: '',
      secondSubject: '',
      isSub: '',
      systemLabel: 0
    }
  },
  // 获取产业
  queryIndustry() {
    return api.get('/dictionary/queryIndustry')
  },
  // 根据产业，获取业务域
  querybusiScope(params) {
    return api.get('/dictionary/queryBusiness', params)
  },
  // 根据产业-业务域，获取主题一
  queryFirstReportTopic(params) {
    return api.get('/dictionary/queryFirstReportTopic', params)
  },
  // 根据产业-业务域-主题一,获取主题二
  querySecondReportTopic(params) {
    return api.get('/dictionary/querySecondReportTopic', params)
  },
  // 获取时间粒度
  getTime() {
    return api.get('/dictionary/timeGranularity')
  },
  // 获取维度
  getDimensionList(params) {
    return api.get('/dictionary/queryDimList', params)
  },
  // 获取百川业务域
  querybusiScopeList(params) {
    return api.get('/metric/listDomain', params)
  },
  // 根据百川主题
  queryReportTopic(params) {
    return api.get('/dictionary/queryDashTopic', params)
  },
  // 获取流程id列表
  getSysAllApplyId() {
    return api.get('/applicationCenter/getSysAllApplyId')
  },
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
      sdFlag: 0, // 1：查询明细指标，0：查询汇总指标
      systemId: location.search.split('=')[1]
    }
  },
  getApplyDtl(params) {
    return api.get('/applicationCenter/qryApplyDtl', params)
  },
    // 更新报表信息接口
    changeReport(data = {}) {
      return api.post('/report/update', data)
    },
  queryInfo(params) {
    return api.get('/report/info', params)
  },
  // 报表更改查询
  // queryInfo(params) {
  //   return api.get('/manage/queryRptDetail', params)
  // },
  // 报表创建
  getTableCreate: {
    url: '/manage/insertReportBySystemLabel',
    methods: 'post',
    body: {
      dimIdList: '',
      metricIdList: '',
      reportDto: '',
      reportVersionDto: '',
      requestApply: ''
    }
  },
  // 创建报表
  insertTableInfo(params) {
    return api.post('/report/add'
    // '/manage/insertReportBySystemLabel'
    , params)
  },
  // 修改报表信息
  modifyInfo(params) {
    return api.post('/manage/updateReport', params)
  },
  // 指标详情
  metricDetail(params) {
    return api.get('/dictionary/metricDetail', params)
  },
  // 维度详情
  queryDimValue(body) {
    return api.post('/dictionary/queryDimValue', body)
  },
  // 校验报表是否已经在修改或者下线流程中
  isInProcess(params) {
    return api.get('/manage/isInProcess', params)
  },
  // 获取已锁定的报表列表
  getLockedReportList(params) {
    return api.get('/report/visualLockList', params)
  }
}
