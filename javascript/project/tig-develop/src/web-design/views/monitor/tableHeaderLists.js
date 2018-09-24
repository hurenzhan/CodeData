/**
 * name: 表头数据列表存放类
 * func: 用于存放页面中tablePaging组件的表头数据.
 * warning: 直接引入组件即可使用
 * author: 程宾 2017.11.21
 */
export default {
  data() {
    return {
      // 报表使用统计表头项
      repUsageStatisticsHeader: [
        {
          title: '报表ID',
          key: 'reportId',
        },
        {
          title: '报表名称',
          key: 'reportName',
        },
        {
          title: '主系统',
          key: 'systemName',
          className: 'table-column-min-width-120',
          align: 'center'
        },
        {
          title: '创建人',
          key: 'developer',
          className: 'table-column-min-width-100',
          align: 'center',
          render: (h, params) => h('div', [
            h('div', params.row.developer),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.developerId)
          ])
        },
        // {
        //   title: '修改人',
        //   key: 'updateUser',
        //   className: 'table-column-min-width-100',
        //   align: 'center',
        //   render: (h, params) => h('div', [
        //     h('div', params.row.updateUser),
        //     h('div', {
        //       style: {
        //         color: '#9f9f9f',
        //         fontSize: '12px',
        //       }
        //     }, params.row.updateUserId)
        //   ])
        // },
        // {
        //   title: '创建时间',
        //   key: 'createTime',
        //   className: 'table-column-min-width-100',
        //   sortType: 'desc'
        // },
        // {
        //   title: '订阅用户数',
        //   key: 'subCount',
        //   className: 'table-column-min-width-100'
        // },
        {
          title: '访问量',
          key: 'pvCount',
          className: 'table-column-min-width-100'
        },
        {
          title: '平均响应时间',
          key: 'avgTime',
          className: 'table-column-min-width-120'
        },
        {
          title: '最大响应时间',
          key: 'maxTime',
          className: 'table-column-min-width-120'
        },
        {
          title: '导出次数',
          key: 'exportCount',
          className: 'table-column-min-width-100',
        }
      ],
      // 报表订阅详情表头数据项
      repSubHeaderList: [
        {
          title: '报表ID',
          key: 'reportId',
          width: 200
        },
        {
          title: '报表名称',
          key: 'reportName',
          width: 200
        },
        {
          title: '开发者',
          key: 'developer',
          render: (h, params) => h('div', [
            h('div', params.row.developer),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.developerId)
          ])
        },
        {
          title: '负责人',
          key: 'manager',
          render: (h, params) => h('div', [
            h('div', params.row.manager),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.managerId)
          ])
        },
        {
          title: '订阅用户',
          key: 'subUser',
          render: (h, params) => h('div', [
            h('div', params.row.subUser),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.subUserId)
          ])
        },
        {
          title: '订阅时间',
          key: 'subTime',
          sortType: 'desc'
        }
      ],
      // 报表访问详情页表头数据项
      repVisitHeaderList: [
        {
          title: '报表ID',
          key: 'reportId',
          width: 200
        },
        {
          title: '报表名称',
          key: 'reportName',
          width: 200
        },
        {
          title: '开发者',
          key: 'developer',
          render: (h, params) => h('div', [
            h('div', params.row.developer),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.developerId)
          ])
        },
        {
          title: '负责人',
          key: 'manager',
          render: (h, params) => h('div', [
            h('div', params.row.manager),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.managerId)
          ])
        },
        {
          title: '访问用户ID',
          key: 'visitor',
          render: (h, params) => h('div', [
            h('div', params.row.visitor),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.visitorId)
          ])
        },
        {
          title: '访问时间',
          key: 'visitTime',
          className: 'table-column-min-width-100',
          sortType: 'desc'
        },
        {
          title: '接口响应时间',
          key: 'responseTime'
        }
      ],
      // 报表导出详情页表头数据项
      repExportHeaderList: [
        {
          title: '报表ID',
          key: 'reportId',
          width: 200
        },
        {
          title: '报表名称',
          key: 'reportName',
          width: 200
        },
        {
          title: '开发者',
          key: 'developer',
          render: (h, params) => h('div', [
            h('div', params.row.developer),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.developerId)
          ])
        },
        {
          title: '负责人',
          key: 'manager',
          render: (h, params) => h('div', [
            h('div', params.row.manager),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.managerId)
          ])
        },
        {
          title: '导出用户',
          key: 'exportUser',
          render: (h, params) => h('div', [
            h('div', params.row.exportUser),
            h('div', {
              style: {
                color: '#9f9f9f',
                fontSize: '12px',
              }
            }, params.row.exportUserId)
          ])
        },
        {
          title: '导出时间',
          key: 'exportTime',
          sortType: 'desc'
        }
      ]
    }
  }
}
