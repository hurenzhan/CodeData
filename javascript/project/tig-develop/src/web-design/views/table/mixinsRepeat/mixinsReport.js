import apiReport from '@/web-design/api/report'

export default {
  data() {
    return {
      // -----------------------------------
      business: {}, // 业务域
      subject: {}, // 主题
      time: {
        data: []
      }, // 时间粒度
      dimension: {}, // 权限维度
      single: false, // 是否权限内维度标志
      twoDimesional: false, // 二维表置灰标志
      crossType: false, // 交叉表置灰标志
      clearFilter: false, // 清空标识
      selectedDataArr: [], // 已勾选的所有指标对象数组
      metricArray: [], // 指标数组
      defaultNmArr: [], // 默认单位保存数组
      dimentionArray: [], // 交叉维度数组
      checkArray: [], // 维度默认勾选数组
      dimSelectedArr: [], // 交叉维度选择状态数组,里面存放被勾选的交叉维度code值
      tempArr: [], // 全选时存放非本页数据的数组
      isSelectAll: false, // 记录是否点击全选或单选后本页面已经全选
      queryData: [], // 编辑页面初始化查询数组
      deleteArr: [], // 点叉删除编码保存数组
      optionId: '1',
      options: [], // 流程id下拉选框
      firstChangePage: true, // 是否第一次翻页标志
      currentPage: 1, // 当前显示页面，默认值为1
      pageArray: [],
      tableInfo: {
        radio: false,
        radioKey: 1,
        paging: true,
        data: [],
        checkList: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID/指标名称',
            key: 'metricName',
            width: 250,
            render: (h, params) => h('div', [
              h('div', {
                class: 'report-name not-link',
                attrs: {
                  title: params.row.metricName
                },
              }, params.row.metricName),
              h('div', {
                class: 'report-id',
                attrs: {
                  title: params.row.metricsCode
                },
              }, params.row.metricsCode),
            ])
          },
          {
            title: '业务域-主题',
            render(h, params) {
              return h('span', `${params.row.businessDomainName}-${params.row.subjectName}`)
            }
          },
          {
            title: '时间粒度',
            key: 'timeGranularityName'
          },
          {
            title: '指标描述',
            ellipsis: 'true',
            render: (h, params) => h('div', {
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              },
              attrs: {
                title: params.row.caliberDesc
              }
            }, params.row.caliberDesc)
          },
          {
            title: '业务定义',
            ellipsis: 'true',
            render: (h, params) => h('div', {
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              },
              attrs: {
                title: params.row.busiDefine
              }
            }, params.row.busiDefine)
          },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => h('a',
              {
                style: {
                  color: '#3F8FFF',
                  cursor: 'pointer'
                },
                attrs: {
                  target: '_blank',
                  href: `#/tableDetail?metricsCode=${params.row.metricsCode}`
                }
              }, '查看详情'
            )
          }
        ],
        total: 3,
        page: 1,
        start: 1,
        end: 3
      },
    }
  },
  methods: {
    // 业务端创建/修改自定义报表公共方法
    // 初始化methods
    initMethods() {
      // 查询业务域
      this.querybusiScope()
      // 时间粒
      this.queryTime()
      // 权限维度下拉框
      this.queryDimList()
      // 页面初始化添加数组
      this.getPageInfo()
      // 离开当前页清空筛选条件
      this.getDataTable.body.busiTypes = ''
      this.getDataTable.body.subjects = ''
      this.getDataTable.body.timeGranularitys = ''
      this.getDataTable.body.dimCodes = ''
      this.getDataTable.body.searchKey = ''
    },
    // -------------startQuery start---------------
    // 时间粒
    async queryTime() {
      this.$refs.dataTable.judgeType()
      const res = await apiReport.getTime()
      if (!res) return
      this.time = res
    },
    // 页面初始化查询报表详情(编辑页)
    async queryInfo() {
      // 获取报表id和版本id
      const reportId = this.$route.query.reportId
      const versionId = this.$route.query.versionId
      const resData = await apiReport.queryInfo({
        params: {
          reportId,
          versionId,
          systemLabel: 4
        }
      })
      this.queryData = resData.data // 查询返回值
      // 根据返回的指标详情, 计算指标和交叉维度
      if (resData.statusCode === '0') {
        this.dimentionArray = []
        this.metricArray = []
        this.selectedDataArr = []
        this.$refs.dataTable.judgeType()
        const content = JSON.parse(resData.data.reportContent)
        content.metricsInfos.forEach((v) => {
          // // 默认单位
          // let unitNum = v.unitDefaultNm
          // // 指标信息
          // this.metricArray.push({
          //   metricName: v.metricName,
          //   metricsCode: v.metricsCode,
          //   timeGranularity: v.timeGranularity,
          //   timeGranularityName: v.timeGranularityName,
          //   unitDefaultNm: unitNum
          // })
           // 默认单位
           let unitNum = ''
           v.mulUnits.forEach((item) => {
             if (item.isDefault === 1) {
               unitNum = item.unitNm
             }
           })
           // 指标信息
           this.metricArray.push({
             metricName: v.metricName,
             metricsCode: v.metricsCode,
             timeGranularity: v.timeGranularity,
             timeGranularityName: v.timeGranularityName,
             unitDefaultNm: unitNum
           })
        })
        // const commonInfo = content.dimIdList
        // this.selectedDataArr = commonInfo
        // this.dimentionAll(commonInfo)
        const commonInfo = []
        content.metricsInfos.forEach((v) => {
          commonInfo.push(v)
        })
        this.selectedDataArr = commonInfo
        // console.log('初始化是的数据', this.selectedDataArr)
        this.dimentionAll(commonInfo)
      }
    },
    // -------------searchBar start---------------
    // 业务域(百川)
    async querybusiScope() {
      this.$refs.dataTable.judgeType()
      const res = await apiReport.querybusiScopeList()
      if (!res) return
      this.business = res
    },
    // 业务域change(百川)
    async querySubject() {
      this.$refs.dataTable.judgeType()
      // 获取业务域id
      const businessId = this.getDataTable.body.busiTypes
      if (businessId) {
        const res = await apiReport.queryReportTopic({
          params: {
            businessId
          }
        })
        if (!res) return
        this.subject = res
        // 初始化时也要判断第一页是否已经全选
        setTimeout(() => {
          // 翻页后判断本页是否已经全选
          if (this.judgePageSelectAll()) {
            this.pageArray[this.currentPage - 1] = this.$refs.dataTable.list
          }
        }, 500)
      } else {
        // 业务域删除，清空主题下拉框
        this.subject = []
        this.getDataTable.body.subjects = ''
      }
    },
    // 主题change(百川主题)
    subjChange() {
      this.$refs.dataTable.judgeType()
      // 初始化时也要判断第一页是否已经全选
      setTimeout(() => {
        // 翻页后判断本页是否已经全选
        if (this.judgePageSelectAll()) {
          this.pageArray[this.currentPage - 1] = this.$refs.dataTable.list
        }
      }, 500)
    },
    // 时间粒change
    timeChange() {
      this.$refs.dataTable.judgeType()
      // 初始化时也要判断第一页是否已经全选
      setTimeout(() => {
        // 翻页后判断本页是否已经全选
        if (this.judgePageSelectAll()) {
          this.pageArray[this.currentPage - 1] = this.$refs.dataTable.list
        }
      }, 500)
    },
    // 权限内维度下拉框
    async queryDimList() {
      // rightFlag参数默认传0
      const res = await apiReport.getDimensionList({
        params: {
          rightFlag: 0
        }
      })
      if (!res) return
      this.dimension = res
      // 初始化时也要判断第一页是否已经全选
      setTimeout(() => {
        // 翻页后判断本页是否已经全选
        if (this.judgePageSelectAll()) {
          this.pageArray[this.currentPage - 1] = this.$refs.dataTable.list
        }
      }, 500)
    },
    // 只显示权限内指标
    clickSingle() {
      if (this.single === true) {
        /**
        * 指标列表是否为权限内
        * rightFlag: 1为权限内指标
        * rightFlag: 0为非权限内指标
        */
        this.getDataTable.body.rightFlag = 1
        this.$refs.dataTable.judgeType()
      } else {
        this.getDataTable.body.rightFlag = 0
        this.$refs.dataTable.judgeType()
      }
    },
    // 权限内维度change
    dimChange() {
      this.$refs.dataTable.judgeType()
      // 初始化时也要判断第一页是否已经全选
      setTimeout(() => {
        // 翻页后判断本页是否已经全选
        if (this.judgePageSelectAll()) {
          this.pageArray[this.currentPage - 1] = this.$refs.dataTable.list
        }
      }, 500)
    },
    // 关键字change
    keyChangeEnter() {
      this.$refs.dataTable.judgeType()
    },
    // ---------selected start-----------------------
    // 0.页面初始化添加数组
    getPageInfo() {
      this.pageArray.push([])
      // 初始化时也要判断第一页是否已经全选
      setTimeout(() => {
        if (this.judgePageSelectAll()) {
          this.pageArray[this.currentPage - 1] = [].concat(this.$refs.dataTable.list)
        }
      }, 500)
    },
    // 1.获取所有已选指标的交叉维度
    dimentionAll(dimAll) {
      if (dimAll !== undefined) {
        let dimentionAll = [] // 指标合并数组
        dimAll.forEach((v) => {
          dimentionAll = dimentionAll.concat(v.permissionDimention)
        })
        let tmpList = [] // 交叉维度code数组
        let tmpNameList = [] // 交叉维度name数组
        // 是否为权限维度
        const isDimFlagList = [] // 交叉维度权限数组
        dimentionAll.forEach((item) => {
          if (dimentionAll.filter(each =>
          each.dimCode === item.dimCode).length === dimAll.length) {
            if (item.dimCode !== (undefined || null || '')) {
              tmpList.push(item.dimCode)
              tmpNameList.push(item.dimName)
              isDimFlagList.push(item.isRightDim)
            }
          }
        })
        tmpList = [...new Set(tmpList)]
        tmpNameList = [...new Set(tmpNameList)]
        tmpList.forEach((item, index) => {
          this.dimentionArray.push({
            dimCode: item,
            dimName: tmpNameList[index],
            isPrivilege: isDimFlagList[index]
          })
        })
        // 默认可用维度checkbox勾选
        this.checkArray = []
        this.dimentionArray.forEach((item) => {
          this.checkArray.push(item.dimCode)
        })
      }
    },
    // 2.清空
    processFilter() {
      this.clearFilter = true
      this.selectedDataArr = []
      this.metricArray = []
      this.dimentionArray = []
      this.deleteArr = []
      this.pageArray.forEach((item) => {
        item.length = 0
      })
      setTimeout(() => {
        // 清空标志置反
        this.clearFilter = false
      }, 500)
    },
    // 3.删除指标
    handleClose(index) {
      // 指标数量为空时，维度信息也置空
      if (this.metricArray.length <= 1) {
        this.dimentionArray = []
      }
      // 获取metricName赋给dataTableCode
      const deleteMetricCode = this.metricArray.splice(index, 1)[0].metricsCode
      this.deleteArr.push(deleteMetricCode)
      // 在所有已选数据中删除对应指标
      this.selectedDataArr.forEach((item, index) => {
        if (deleteMetricCode === item.metricsCode) {
          this.selectedDataArr.splice(index, 1)
        }
      })
      // 调用维度计算方法, 重新计算维度
      this.dimentionArray = []
      this.dimentionAll(this.selectedDataArr)
    },
    // 4.点击勾选或取消勾选交叉维度逻辑
    checkGroupChange(arr) {
      this.dimSelectedArr = []
      this.dimentionArray.forEach((v) => {
        arr.forEach((v1) => {
          if (v.dimDesc === v1) {
            this.dimSelectedArr.push(v.dimCode)
            this.dimSelectedArr = [...new Set(this.dimSelectedArr)]
          }
        })
      })
    },
    // 5.删除指标checked反选
    showChecked(row) {
      // 过滤权限，根据权限字段判断是否可以勾选
      // if (row.authority === '0') {
      //   row._isDisabled = true
      // }
      // 单独删除已选指标 置checked
      this.deleteArr.forEach((delCode, index) => {
        if (row.metricsCode === delCode) {
          row._isChecked = false
          // 比对过后删掉这个已删状态值
          this.deleteArr.splice(index, 1)
        }
      })
      // 点击清空 置空checked
      if (this.clearFilter) {
        row._isChecked = false
      }
      this.selectedDataArr.forEach((item) => {
        if (row.metricsCode === item.metricsCode) {
          row._isChecked = true
        }
      })
    },
    // 6.选中某一项
    selectOne(selection, row) {
      this.isSelectAll = false
      this.selectedDataArr.push(row)
      // 默认单位(isDefault=1)
      let defaultNm = ''
      row.mulUnits.forEach((item, index) => {
        if (row.mulUnits[index].isDefault === 1) {
          defaultNm = row.mulUnits[index].unitNm
        }
      })
      // 添加此指标显示
      this.metricArray.push({
        metricName: row.metricName,
        metricsCode: row.metricsCode,
        timeGranularity: row.timeGranularity,
        timeGranularityName: row.timeGranularityName,
        unitDefaultNm: defaultNm
      })
      this.dimentionArray = []
      this.dimentionAll(this.selectedDataArr)
      // 定义变量，循环表格，当权限标志为1时，变量默认加1
      let dataTableNum = 0
      this.$refs.dataTable.list.forEach((item) => {
        if (item.authority !== '') {
          dataTableNum += 1
        }
      })
      // 如果单选后导致页面全选,就调用一次全选,打开全选标志
      if (selection.length === dataTableNum) {
        this.selectAll(selection)
      }
    },
    // 7.取消某项选择
    cancelSelect(selection, row) {
      // 取消某项选择后此页肯定为非全选状态,清空本页面全选记录数组内的指标
      this.pageArray[this.currentPage - 1] = []
      if (this.dimentionArray.length === 0 && this.metricArray.length === 0) {
        // 修改维度勾选状态
        this.$refs.filterPanel.checkArray.length = 0
      }
      // 从数组中删掉这个指标,
      this.selectedDataArr.forEach((item, index) => {
        if (item.metricsCode === row.metricsCode) {
          this.selectedDataArr.splice(index, 1)
        }
      })
      // 删掉对应指标显示
      this.metricArray.forEach((item, index) => {
        if (item.metricsCode === row.metricsCode) {
          this.metricArray.splice(index, 1)
        }
      })
      this.dimentionArray = []
      this.dimentionAll(this.selectedDataArr)
    },
    // 8.全选本页面数据
    selectAll(selection) {
      // this.isSelectAll = true
      this.tempArr = []
      // 全选后过滤出非本页数据,防止已选数据数组中对象重复
      this.selectedDataArr.forEach((item) => {
        if (selection.filter(each => each.metricsCode === item.metricsCode).length === 0) {
          this.tempArr.push(item)
        }
      })
      // 合并全选后的已选数据数组(无重复项)
      this.selectedDataArr = selection.concat(this.tempArr)
      // 将已选的指标项非重复部分都加入到指标显示数组中
      this.selectedDataArr.forEach((item) => {
        if (this.metricArray.filter(each => each.metricsCode === item.metricsCode).length === 0) {
          let unitNum = ''
          item.mulUnits.forEach((v) => {
            if (v.isDefault === 1) {
              unitNum = v.unitNm
            }
          })
          // 指标信息
          this.metricArray.push({
            metricName: item.metricName,
            metricsCode: item.metricsCode,
            timeGranularity: item.timeGranularity,
            timeGranularityName: item.timeGranularityName,
            unitDefaultNm: unitNum
          })
        }
      })
      // 维度信息计算
      this.dimentionArray = []
      this.dimentionAll(this.selectedDataArr)
      // 少量延时后打开全选标志,若不延时会触发selectChange函数的if执行
      setTimeout(() => {
        this.pageArray[this.currentPage - 1] = selection
      }, 100)
    },
    // 9.选择项发生变化时触发,规定它仅在全选后点击反选才有效
    selectChange() {
      // 添加逻辑，当返回过来看是否触发
      // 当数据个数与当前页个数一致时触发
      // setTimeout(() => {
        if (this.pageArray[this.currentPage - 1].length === this.$refs.dataTable.list.length) {
          this.pageArray[this.currentPage - 1].forEach((item) => {
            this.selectedDataArr.forEach((v, index) => {
              if (v.metricsCode === item.metricsCode) {
                this.selectedDataArr.splice(index, 1)
              }
            })
          })
          this.pageArray[this.currentPage - 1] = []
          this.metricArray = []
          this.selectedDataArr.forEach((item) => {
            let unitNum = ''
            item.mulUnits.forEach((v) => {
              if (v.isDefault === 1) {
                unitNum = v.unitNm
              }
            })
            this.metricArray.push({
              metricName: item.metricName,
              metricsCode: item.metricsCode,
              timeGranularity: item.timeGranularity,
              timeGranularityName: item.timeGranularityName,
              unitDefaultNm: unitNum
            })
          })
          this.dimentionArray = []
          this.dimentionAll(this.selectedDataArr)
        }
      // }, 300)
      
    },
    // 10.切换页面
    pageChange(page, total) {
      this.currentPage = page
      if (this.firstChangePage) {
        for (let i = 0; i < total - 1; i += 1) {
          this.pageArray.push([])
        }
        this.firstChangePage = false
      }
      setTimeout(() => {
        // 翻页后判断本页是否已经全选
        if (this.judgePageSelectAll()) {
          this.pageArray[this.currentPage - 1] = this.$refs.dataTable.list
        }
      }, 500)
    },
    // 11.判断当前页数据是否初始化时就是全选(区别于手动全选逻辑) 全选返回true, 非全选返回false
    judgePageSelectAll() {
      let count = 0
      // 先获取本页全部数据
      const list = this.$refs.dataTable.list
      list.forEach((item) => {
        if (this.selectedDataArr.filter(each => item.metricsCode === each.metricsCode)
        .length !== 0) {
          count += 1
        }
      })
      if (count === list.length) {
        return true
      } else {
        return false
      }
    }
  }
}
