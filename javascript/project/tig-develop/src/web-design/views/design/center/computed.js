import _differenceBy from 'lodash.differenceby'

export default {
  methods: {
    calcLabelForUnit(data) {
      if (data.type === 3) {
        return `${data.name},${this.crossOnlyMetric.unitDefaultNm}`
      }
      if (data.type !== 2) {
        return `${data.name},${data.unitDefaultNm}`
      }
      return `${data.cusName},${data.unitDefaultNm}`
    }
  },
  computed: {
    tableHeaderActive() {
      return this.$store.state.design.tableHeaderActive
    },
    // 左侧待选区指标列表
    metrics() {
      return this.$store.state.design.metric
    },
    // 交叉指标
    crossOnlyMetric() {
      return this.$store.state.design.crossMetric
    },
    // 选择的维值
    columnDim() {
      return this.$store.state.design.columnDim
    },
    leftDimList() {
      return this.$store.state.design.dim
    },
    firstLineText() {
      // let reportType = this.$route.query.reportType
      let reportType = this.reportType
      reportType = Number(reportType)
      const data = reportType === 1 ? '列' : '行维度'
      return data
    },
    timeDistance: {
      get() {
        return this.$store.state.design.timeDistance
      },
      set(newvalue) {
        this.$store.commit('handleTimeDistance', newvalue)
      }
    },
    pageSize: {
      get() {
        return this.$store.state.design.pageSize
      },
      set(newvalue) {
        this.$store.commit('handlePageSize', newvalue)
      }
    },
    reportFunction: {
      get() {
        return this.$store.state.design.reportFunction
      },
      set(newvalue) {
        this.$store.commit('handleReportFunction', newvalue)
      }
    },
    getExportData: {
      get() {
        return this.$store.state.design.exportData
      },
      set(newvalue) {
        this.$store.commit('handleExport', newvalue)
      }
    },
    rowDim() {
      const rowDim = this.$store.state.design.columnList.filter(v => v.type !== 3)
      // console.log(columns)
      return rowDim
    },
    columnList: {
      get() {
        const columns = this.$store.state.design.columnList
        // console.log(columns)
        return columns
      },
      set(newValue) {
        console.log(newValue)
        // debugger
        // this.$store.commit('removeTimeFromColumnList')
        // 新增的限制条件,在创建交叉表时,行维度中不能拖进指标
        const reportType = this.$route.query.reportType
        for (let i = 0; i < newValue.length; i += 1) {
          if (Number(reportType) === 2 && newValue[i].type === 1) {
            this.$Message.error('创建交叉表时,不能在行维度中加入指标')
            return false
          }
        }
        // 这里要解决的问题，度量，指标不能在维度前面 自定义列也算指标
        const dim = []
        const metric = []
        let flag = false
        newValue.forEach((v, i) => {
          if (v.type === 0) {
            dim.push({
              name: v.name,
              index: i
            })
          } else if (v.type === 1 || v.type === 2) {
            metric.push({
              name: v.name,
              index: i
            })
          }
        })
        // 自动将维度排在指标之前 可能有点啰嗦 待优化
        if (dim.length && metric.length && dim[dim.length - 1].index > metric[0].index) {
          // const metricValue = newValue[metric[0].index]
          // newValue.splice(metric[0].index, 1)
          // newValue.push(metricValue)
          const dimValue = newValue.filter(v => v.type === 0)
          const metricValue = newValue.filter(v => v.type === 1)
          const customValue = newValue.filter(v => v.type === 2)
          const dimenValue = newValue.filter(v => v.type === 3)
          newValue = dimValue.concat(metricValue).concat(customValue).concat(dimenValue)
        }
        const acrossDim = newValue.filter(v => v.type === 3)
        newValue = newValue.filter(v => v.type !== 3).concat(acrossDim)
        const payload = {}
        // 分为添加和拖拽改变顺序行为 4是拖拽行为
        if (this.columnList.length === newValue.length) {
          payload.type = 4
          payload.item = newValue
        } else {
          // type 为1 则为添加行为
          payload.type = 1
          payload.item = newValue
        }
        // console.log(payload)
        this.$store.commit('syncColumn', payload)
        // 触发set 动作时查看自定义列中是否已设置同环比，如果有，则要去掉columnList中的
        const customColumn = this.$store.getters.getCustomColumn
        // console.log(customColumn)
        customColumn.forEach((v) => {
          if (v.colSetting === 1) { // 同环比情况
            flag = true
          }
        })
        // debugger
        if (flag) {
          this.$store.commit('removeTimeFromColumnList')
        }
        // 每次set行为，都会遍历分类汇总的维度选择项，并将被选项前置
        // this.$store.commit('handleMergeCellInColumnList')
        // 每次set时去同步handsontable的数据源
        // this.$store.commit('syncHandsontableWithColumnList', val)
        window.initColumnListFlag = 1
        return true
      }
    },
    // 过滤条件应当来自store
    filterList: {
      get() {
        /* const dim = this.$store.state.design.dim.filter(v => v.filterChecked === true)
        const metric = this.$store.state.design.metric.filter(v => v.filterChecked === true)
        const combinArray = dim.concat(metric) */
        return this.$store.state.design.filterList
      },
      set(newValue) {
        const oldVal = this.filterList
        const operataItem = _differenceBy(newValue, oldVal, 'id')[0]
        // if (operataItem.type === 1) {
        //   this.$Message.info('指标不能作为过滤条件')
        //   return false
        // }
        // 规则： 指标作为过滤条件的前提是必须拖拽指标必须已经存在于columnList之中(二维表)
        if (Number(this.reportType) === 1
          && (operataItem.type !== 0)
          && !this.columnList.some(v => v.id === operataItem.id)) {
          this.$Message.info('二维表只有被列中被选中的指标才能做为过滤条件')
          return false
        }
        // 规则： 指标作为过滤条件的前提是必须拖拽指标必须已经存在于交叉指标之中(交叉表)
        if (Number(this.reportType) === 2
          && (operataItem.type !== 0)
          && !(this.crossOnlyMetric.id === operataItem.id)) {
          this.$Message.info('交叉表只有被交叉指标被选中的指标才能做为过滤条件')
          return false
        }
        if (operataItem && operataItem.id === 'dasp_date') {
          this.$Message.info('时间维度不能作为过滤条件')
          return false
        }
        // type 为1 则为添加行为
        const payload = {}
        payload.type = 1
        payload.item = newValue
        if (operataItem.type === 0) {
          this.$store.commit('activeKey', 'dim')
        } else {
          this.$store.commit('activeKey', 'metric')
        }
        this.$store.commit('syncSelected', payload)
        document.querySelector('.menuBar.menuList li:nth-child(1)').click()
        return true
      }
    },
    queryList: {
      get() {
        return this.$store.state.design.queryList
      },
      set(newValue) {
        const oldVal = this.queryList
        const operataItem = _differenceBy(newValue, oldVal, 'id')[0]
        if (operataItem && operataItem.id === 'dasp_date') {
          this.$Message.info('时间维度不能作为查询条件')
          return false
        }
        // if (operataItem && operataItem.type === 1) {
        //   this.$Message.info('指标不能作为查询条件')
        //   return false
        // }
        // 规则： 指标作为查询条件的前提是必须拖拽指标必须已经存在于columnList之中
        if (Number(this.reportType) === 1
          && (operataItem.type !== 0)
          && !this.columnList.some(v => v.id === operataItem.id)) {
          this.$Message.info('二维表中只有被列中被选中的指标才能做为查询条件')
          return false
        }
        // 规则： 指标作为查询条件的前提是必须拖拽指标必须已经存在于交叉指标之中(交叉表)
        if (Number(this.reportType) === 2
          && (operataItem.type !== 0)
          && !(this.crossOnlyMetric.id === operataItem.id)) {
          this.$Message.info('交叉表只有被交叉指标被选中的指标才能做为查询条件')
          return false
        }
        // type 为1 则为添加行为
        const payload = {}
        payload.type = 1
        payload.item = newValue
        this.$store.commit('syncQuery', payload)
        return true
      }
    }
  }
}
