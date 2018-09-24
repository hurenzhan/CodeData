import api from './index'

export default {
  groupList: {
    url: '/sysInfo/querySysInfo',
    methods: 'get',
    params: {
      searchKey: ''
    }
  },
  getListajax: {
    url: '/system/developUserList',
    methods: 'post',
    body: {
      searchKey: '',
      systemId: '', // 主系统id
    }
  },
  querySysInfo(par) { // 支持的主系统下拉框
    return api.get('/sysInfo/querySysInfo', {
      params: {
        searchKey: par,
        offset: 0,
        limit: 500
      }
    })
  },
}
