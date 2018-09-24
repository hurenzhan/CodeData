import api from './index'

export default {
  // 获取产业
  queryIndustry() {
    return api.get('/dictionary/queryIndustry')
  },
  // 获取业务域
  queryBusiness(params) {
    return api.get('/dictionary/queryBusiness', params)
  },
  // 获取一级主题
  queryFirstTopic(params) {
    return api.get('/dictionary/queryFirstReportTopic', params)
  },
  // 获取二级主题
  querySecondTopic(params) {
    return api.get('/dictionary/querySecondReportTopic', params)
  },
  // 获取主系统列表
  queryMainSysList() {
    return api.get('/dictionary/querySystemInfo')
  },
  // 报表监控-获取报表使用统计表数据
  getRepUsageStatisticsTableData: {
    url: '/monitor/reportUseStatistic',
    methods: 'post',
    body: {
      // systemId: '', // 主系统
      startDate: '2017-11-11 00:00:00', // 开始日期
      endDate: '2017-11-12 00:00:00', // 结束日期
      // industryId: '', // 产业
      // domainId: '', // 业务域
      // firstSubject: '', // 报表一级主题
      // secondSubject: '', // 报表二级主题
      _search: '' // 搜索内容
    }
  },
  // 获取报表订阅详情表数据
  getSubscribDetailTableData: {
    url: '/reportMonitor/reportSubDetail',
    methods: 'post',
    body: {
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      industryId: '', // 产业
      domainId: '', // 业务域
      firstSubject: '', // 报表一级主题
      secondSubject: '', // 报表二级主题
      _search: '' // 搜索关键字
    }
  },
  // 获取报表导出详情表数据
  getExportDetailTableData: {
    url: '/monitor/reportExportDetail',
    methods: 'post',
    body: {
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      // industryId: '', // 产业
      // domainId: '', // 业务域
      // firstSubject: '', // 报表一级主题
      // secondSubject: '', // 报表二级主题
      _search: '' // 搜索关键字
    }
  },
  // 报表监控-获取报表访问详情表数据
  getVisitDetailTableData: {
    url: '/monitor/reportAccessDetail',
    methods: 'post',
    body: {
      startDate: '2017-11-11 00:00:00', // 开始日期
      endDate: '2017-11-12 00:00:00', // 结束日期
      // industryId: '', // 产业
      // domainId: '', // 业务域
      // firstSubject: '', // 报表一级主题
      // secondSubject: '', // 报表二级主题
      _search: '', // 搜索关键字
      // pagingIdentifiers: null // 访问详情页独有的字段,当页码大于1时的偏移量
    }
  }
}
