import tableApi from '@/web-design/api/table'
import enums from '@/components/Utils/enums'
import userApi from '@/web-design/api/login'
import moment from 'moment'

export default {
  data() {
    return {
      sumCodeList: [],
      dimListOrigin: [], // 初始的dimList
      timeType: 'day',
      timeTypeList: [
        {
          value: 'day',
          name: '日'
        },
        {
          value: 'month',
          name: '月'
        },
        {
          value: 'year',
          name: '年'
        }
      ],
      // 查询条件
      queryList: [],
      queryValueList: {},
      // 报表数据 查询条件
      filter: {
        userId: '',
        systemId: '',
        reportId: '',
        versionId: '',
        type: 0, // 0 普通表  1 分类汇总 2交叉表
        businessType: this.businessType, // 1：驾驶舱，2：报表市场预览 默认空字符串，可不传递参数
        limit: this.designLimit,
        // selfMethods: [], // 自定义计算公式
        timeQueryCycle: '',
        dimList: [],
        dimValueList: [
          // {
          //   dimId: '维度编码',
          //   dimName: '维度名称',
          //   dimValueId: '维值编码',
          //   dimValue: '维值'
          // }
        ], // 交叉表
        conditionList: [],
        sortList: [],
        metricsList: [],
        autoSum: false,
        sumCodeList: [],
        mergeCell: false,
        mergeCodeList: []
      },
      // 合并列数据
      columnMerge: {},
      // 查询时间
      condiDate: [],
      // 对比时间
      condiDateRatio: [],
      isRatio: false, // 是否对比
    }
  },
  methods: {
    // 切换时间粒度
    changeTimeType(val) {
      switch (val) {
        case 'day': {
          this.condiDate[0] = moment().subtract(1, 'days').format('YYYY-MM-DD')
          this.condiDate[1] = moment().subtract(1, 'days').format('YYYY-MM-DD')
          this.condiDateRatio[0] = moment().subtract(2, 'days').format('YYYY-MM-DD')
          this.condiDateRatio[1] = moment().subtract(2, 'days').format('YYYY-MM-DD')
          break
        }
        case 'month': {
          this.condiDate[0] = moment().subtract(1, 'month').format('YYYY-MM')
          this.condiDate[1] = moment().subtract(1, 'month').format('YYYY-MM')
          this.condiDateRatio[0] = moment().subtract(2, 'month').format('YYYY-MM')
          this.condiDateRatio[1] = moment().subtract(2, 'month').format('YYYY-MM')
          break
        }
        case 'year': {
          this.condiDate[0] = moment().subtract(1, 'year').format('YYYY')
          this.condiDate[1] = moment().subtract(1, 'year').format('YYYY')
          this.condiDateRatio[0] = moment().subtract(2, 'year').format('YYYY')
          this.condiDateRatio[1] = moment().subtract(2, 'year').format('YYYY')
          break
        }
        default:
          break
      }
    },
    // 手动查询数据
    searchData() {
      if (new Date(this.condiDate[0]) > new Date(this.condiDate[1])) {
        this.$Message.info('起始时间不能大于结束时间')
        return
      }
      this.loadingTableData = true
      this.paging.page = 1
      this.paging.total = 0
      this.source.data = this.headerData
      if (this.design.tableHeaderActive) {
        this.source.mergeCells = this.headerMergeCells
      } else {
        this.source.mergeCells = []
      }
      this.$refs.htable.updateTable()
      // 过滤条件
      const conditionArr = []
      const filterList = this.design.filterList
      for (let i = 0; i < filterList.length; i += 1) {
        const item = filterList[i]
        let condiComparedValue = item.filterValue
        if (typeof condiComparedValue !== 'string') {
          for (let v = 0; v < condiComparedValue.length; v += 1) {
            const vItem = condiComparedValue[v]
            condiComparedValue[v] = vItem.split('_')[0]
          }
          condiComparedValue = condiComparedValue.toString()
        }
        if (condiComparedValue) {
          conditionArr.push({
            condiCode: item.id,
            condiType: item.type,
            operator: item.filterCondition,
            condiRateType: 0,
            condiComparedValue
          })
        }
      }
      // 时间粒度
      this.filter.timeQueryCycle = enums.timeQueryCycle[this.timeType]
      let condiStartDate = ''
      let condiEndDate = ''
      let compareStartDate = ''
      let compareEndDate = ''
      let condiRateType = 0
      for (let i = 0; i < this.design.customColumn.length; i += 1) {
        const item = this.design.customColumn[i]
        if (item.colSetting === 1) {
          condiRateType = 3
        }
        if (item.colSetting === 2) {
          condiRateType = 4
        }
      }
      switch (this.timeType) {
        case 'day': {
          condiStartDate = moment(this.condiDate[0]).format('YYYYMMDD')
          condiEndDate = moment(this.condiDate[1]).format('YYYYMMDD')
          if (condiRateType === 4) {
            compareStartDate = moment(this.condiDateRatio[0]).format('YYYYMMDD')
            compareEndDate = moment(this.condiDateRatio[1]).format('YYYYMMDD')
          }
          break
        }
        case 'month': {
          condiStartDate = moment(this.condiDate[0]).format('YYYYMM')
          condiEndDate = moment(this.condiDate[1]).format('YYYYMM')
          if (condiRateType === 4) {
            compareStartDate = moment(this.condiDateRatio[0]).format('YYYYMM')
            compareEndDate = moment(this.condiDateRatio[1]).format('YYYYMM')
          }
          break
        }
        case 'year': {
          condiStartDate = moment(this.condiDate[0]).format('YYYY')
          condiEndDate = moment(this.condiDate[1]).format('YYYY')
          if (condiRateType === 4) {
            compareStartDate = moment(this.condiDateRatio[0]).format('YYYY')
            compareEndDate = moment(this.condiDateRatio[1]).format('YYYY')
          }
          break
        }
        default:
          break
      }
      // 时间条件查询
      conditionArr.push({
        condiCode: 'dasp_date',
        condiType: 0,
        condiStartDate,
        condiEndDate,
        condiRateType,
        compareStartDate, // 对比开始时间
        compareEndDate // 对比结束时间
      })
      // 查询条件
      for (let i = 0; i < this.queryList.length; i += 1) {
        const item = this.queryList[i]
        if (item.operator !== '' && item.operator >= 0 && item.value) {
          conditionArr.push({
            condiCode: item.id,
            condiType: item.type,
            operator: Number(item.operator),
            condiComparedValue: item.value
          })
        }
      }
      this.filter.conditionList = conditionArr
      // 进行查询
      this.initData()
    },
    // 转化查询条件 - 根据配置
    transformFilter() {
      this.loadingTableData = true
      this.transformColation()
      // 排序
      this.transformSort()
      // 分类汇总
      this.transformSubtotal()
      // 查询条件
      this.transformCondition()
      // 列头数据查询
      this.transformColumnData()
    },
    // 过滤条件
    transformColation() {
      // 同环比
      let condiRateType = 0
      for (let i = 0; i < this.design && this.design.customColumn && this.design.customColumn.length; i += 1) {
        const item = this.design.customColumn[i]
        if (item.colSetting === 1) {
          condiRateType = 3
        }
        if (item.colSetting === 2) {
          this.isRatio = true
          condiRateType = 4
        }
      }
      // 默认时间维度过滤
      this.timeTypeList = this.design.timeList
      const timeDistance = this.design.timeDistance
      // 默认时间类型
      this.timeType = timeDistance
      this.filter.timeQueryCycle = enums.timeQueryCycle[timeDistance]
      // 获取初始值
      let condiStartDate = ''
      let condiEndDate = ''
      const now = moment()
      let condiStartDateFormat = ''
      let condiEndDateFormat = ''
      let compareStartDate = ''
      let compareStartDateFormat = ''
      let compareEndDate = ''
      let compareEndDateFormat = ''
      switch (timeDistance) {
        case 'day': {
          const preDay = now.subtract(1, 'days').format('YYYYMMDD')
          const preDayFormat = moment().subtract(1, 'days').format('YYYY-MM-DD')
          condiStartDate = `${preDay}`
          condiEndDate = `${preDay}`
          condiStartDateFormat = `${preDayFormat}`
          condiEndDateFormat = `${preDayFormat}`
          if (condiRateType === 4) {
            compareStartDate = moment().subtract(2, 'days').format('YYYYMMDD')
            compareStartDateFormat = moment().subtract(2, 'days').format('YYYY-MM-DD')
            compareEndDate = compareStartDate
            compareEndDateFormat = compareStartDateFormat
          }
          break
        }
        case 'month': {
          const month = now.subtract(1, 'month').format('YYYYMM')
          const monthFormat = moment().subtract(1, 'month').format('YYYY-MM')
          condiStartDate = `${month}`
          condiEndDate = condiStartDate
          condiStartDateFormat = `${monthFormat}`
          condiEndDateFormat = condiStartDateFormat
          if (condiRateType === 4) {
            compareStartDate = moment().subtract(2, 'month').format('YYYYMM')
            compareStartDateFormat = moment().subtract(2, 'month').format('YYYY-MM')
            compareEndDate = compareStartDate
            compareEndDateFormat = compareStartDateFormat
          }
          break
        }
        case 'year': {
          const year = now.subtract(1, 'year').format('YYYY')
          condiStartDate = `${year}`
          condiEndDate = condiStartDate
          condiStartDateFormat = condiStartDate
          condiEndDateFormat = condiStartDate
          if (condiRateType === 4) {
            compareStartDate = moment().subtract(2, 'year').format('YYYY')
            compareStartDateFormat = compareStartDate
            compareEndDate = compareStartDate
            compareEndDateFormat = compareStartDateFormat
          }
          break
        }
        default:
          break
      }
      this.condiDate[0] = condiStartDateFormat
      this.condiDate[1] = condiEndDateFormat
      this.condiDateRatio[0] = compareStartDateFormat
      this.condiDateRatio[1] = compareEndDateFormat

      const conditionArr = []
      conditionArr.push({
        condiCode: 'dasp_date',
        condiType: 0,
        condiStartDate,
        condiEndDate,
        condiRateType,
        compareStartDate, // 对比开始时间
        compareEndDate // 对比结束时间
      })
      // 过滤条件
      const filterList = this.design.filterList
      for (let i = 0; i < filterList.length; i += 1) {
        const item = filterList[i]
        if (item.id) {
          let condiComparedValue = item.filterValue
          if (typeof condiComparedValue !== 'string') {
            for (let v = 0; v < condiComparedValue.length; v += 1) {
              const vItem = condiComparedValue[v]
              condiComparedValue[v] = vItem.split('_')[0]
            }
            condiComparedValue = condiComparedValue.toString()
          }
          conditionArr.push({
            condiCode: item.id,
            condiType: item.type,
            operator: item.filterCondition,
            condiRateType: 0,
            condiComparedValue
          })
        }
      }
      this.filter.conditionList = conditionArr
    },
    // 列头
    transformColumnData() {
      // 列头查询条件
      const dimCodeArr = []
      const metricsArr = []
      const dimValueArr = []
      // 数值格式转义
      const formatterObj = this.design.formatter
      const arr = this.design.columnList // .concat(this.design.customColumn)

      for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i]
        // 维度列
        if (item.type === 0) {
          // 维度字段
          dimCodeArr.push({
            dimId: item.id,
            dimName: item.dimName
          })
        }
        // 维值列
        if (item.type === 3 && this.filter && this.filter.type === 2 && this.design.columnDim
          && this.design.columnDim.dim && this.design.columnDim.dim.id
          && (this.design.columnDim.dimValue.length > 0)) {
          let meType = ''
          if (formatterObj[item.id]
            && (formatterObj[item.id].type || formatterObj[item.id].type === 0)) {
            meType = formatterObj[item.id].type
          }
          let decimals = 2
          if (formatterObj[item.id]
            && (formatterObj[item.id].decimals || formatterObj[item.id].decimals === 0)) {
            decimals = formatterObj[item.id].decimals
          }
          dimValueArr.push({
            dimId: this.design.columnDim.dim.id,
            dimName: this.design.columnDim.dim.name,
            dimValueId: item.id,
            dimValue: item.name,
            type: meType,
            thousands: (formatterObj[item.id] && formatterObj[item.id].thousands) || false,
            decimals,
          })
        }
        // 自定义列
        if (item.type === 2) {
          // 指标字段
          // 同环比
          if (item.colSetting && item.colSetting === 1) {
            let rateValue = true
            let rateType = 3
            if (item.ratio === 1 || item.ratio === 2) {
              rateType = 1
            }
            if (item.ratio === 3 || item.ratio === 4) {
              rateType = 2
            }
            if (item.ratio === 2 || item.ratio === 4) {
              rateValue = false
            }
            let meType = ''
            if (formatterObj[item.id]
              && (formatterObj[item.id].type || formatterObj[item.id].type === 0)) {
              meType = formatterObj[item.id].type
            }
            let decimals = 2
            if (formatterObj[item.id]
              && (formatterObj[item.id].decimals || formatterObj[item.id].decimals === 0)) {
              decimals = formatterObj[item.id].decimals
            }
            const metricsCode = item && item.id && item.id.split('-')[0]
            metricsArr.push({
              metricsCode,
              metricsUnitCode: '',
              rateType,
              rateValue,
              label: item.cusName,
              type: meType,
              thousands: (formatterObj[item.id] && formatterObj[item.id].thousands) || false,
              decimals,
            })
          }
          // 对比
          if (item.colSetting && item.colSetting === 2) {
            let rateValue = true
            if (item.ratio === 6) {
              rateValue = false
            }
            let meType = ''
            if (formatterObj[item.id]
              && (formatterObj[item.id].type || formatterObj[item.id].type === 0)) {
              meType = formatterObj[item.id].type
            }
            let decimals = 2
            if (formatterObj[item.id]
              && (formatterObj[item.id].decimals || formatterObj[item.id].decimals === 0)) {
              decimals = formatterObj[item.id].decimals
            }
            const metricsCode = item && item.id && item.id.split('-')[0]
            metricsArr.push({
              metricsCode,
              metricsUnitCode: '',
              rateType: 4,
              rateValue,
              label: item.cusName,
              type: meType,
              thousands: (formatterObj[item.id] && formatterObj[item.id].thousands) || false,
              decimals,
            })
          }
          // 计算公式
          if (item.colSetting === 0) {
            const str = item.formula || ''
            const columns = this.design.columnList
            const columnObj = {}
            const allABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'X', 'Y', 'Z']
            for (let i = 0; i < columns.length; i += 1) {
              const item = columns[i]
              if (item.type === 1) {
                columnObj[allABC[i]] = item.id
              }
            }
            let expression = ''
            for (let i = 0; i < str.length; i += 1) {
              const char = str.charAt(i)
              if (char && columnObj[char]) {
                expression += columnObj[char]
              } else {
                expression += char
              }
            }
            let meType = ''
            if (formatterObj[item.id]
              && (formatterObj[item.id].type || formatterObj[item.id].type === 0)) {
              meType = formatterObj[item.id].type
            }
            let decimals = 2
            if (formatterObj[item.id]
              && (formatterObj[item.id].decimals || formatterObj[item.id].decimals === 0)) {
              decimals = formatterObj[item.id].decimals
            }
            metricsArr.push({
              metricsCode: item.id,
              rateType: 5, // 自定义计算公式
              method: expression,
              label: item.cusName,
              type: meType,
              thousands: (formatterObj[item.id] && formatterObj[item.id].thousands) || false,
              decimals,
            })
          }
        }
        // 指标列
        if (item.type === 1) {
          if (formatterObj[item.id]) {
            let meType = ''
            if (formatterObj[item.id]
              && (formatterObj[item.id].type || formatterObj[item.id].type === 0)) {
              meType = formatterObj[item.id].type
            }
            let decimals = 2
            if (formatterObj[item.id]
              && (formatterObj[item.id].decimals || formatterObj[item.id].decimals === 0)) {
              decimals = formatterObj[item.id].decimals
            }
            metricsArr.push({
              metricsCode: item.id,
              metricsUnitCode: '',
              rateType: 0,
              type: meType,
              thousands: (formatterObj[item.id] && formatterObj[item.id].thousands) || false,
              decimals,
              label: item.metricName
            })
          } else {
            let meType = ''
            if (formatterObj[item.id]
              && (formatterObj[item.id].type || formatterObj[item.id].type === 0)) {
              meType = formatterObj[item.id].type
            }
            let decimals = 2
            if (formatterObj[item.id]
              && (formatterObj[item.id].decimals || formatterObj[item.id].decimals === 0)) {
              decimals = formatterObj[item.id].decimals
            }
            metricsArr.push({
              metricsCode: item.id,
              metricsUnitCode: '',
              rateType: 0,
              type: meType,
              thousands: false,
              decimals,
              label: item.metricName
            })
          }
        }
      }
      this.filter.dimValueList = dimValueArr
      this.filter.dimList = dimCodeArr
      this.dimListOrigin = dimCodeArr
      for (let i = 0; i < dimCodeArr.length; i += 1) {
        this.dimListTemp[dimCodeArr[i].dimId] = true
      }

      if (this.filter.type === 2 && this.design.crossMetric
        && this.design.crossMetric.name && this.design.crossMetric.id) {
        metricsArr.push({
          metricsCode: this.design.crossMetric.id,
          metricsUnitCode: '',
          rateType: 0,
          type: '',
          thousands: false,
          decimals: 2,
          label: this.design.crossMetric.name
        })
      }
      this.filter.metricsList = metricsArr
    },
    // 排序条件
    transformSort() {
      const sorter = this.design.sorter
      const arr = []
      for (let i = 0; i < sorter.length; i += 1) {
        const item = sorter[i]
        if (item.id) {
          arr.push({
            attrCode: item.id,
            attrType: item.type,
            sortType: item.value
          })
        }
      }
      this.filter.sortList = arr
    },
    // 分类汇总
    transformSubtotal() {
      const subTotal = this.design.subtotal
      if (subTotal && subTotal.mergeColumn.length > 0) {
        this.filter.type = 1
        this.filter.mergeCell = true
        const column = JSON.stringify(subTotal.mergeColumn)
        const mergeCodeList = JSON.parse(JSON.stringify(JSON.parse(column)))
        this.mergeCodeList = mergeCodeList
        this.filter.mergeCodeList = mergeCodeList
      }
      if (subTotal && subTotal.total.length > 0) {
        this.filter.type = 1
        this.filter.autoSum = true
        const sumCodeList = JSON.parse(JSON.stringify(subTotal.total))
        this.sumCodeList = sumCodeList.reverse()
        this.filter.sumCodeList = this.sumCodeList// 合计的维度
      }
    },
    // 查询条件 - 根据用户选择
    transformCondition() {
      const queryList = JSON.parse(JSON.stringify(this.design.queryList))
      for (let i = 0; i < queryList.length; i += 1) {
        const item = queryList[i]
        item.value = ''
        item.operator = 0
        // 获取维值
        if (item.type === 0) {
          item.operator = '6'
          this.getDimValue('', item, 0, 100)
        }
      }
      this.queryList = queryList
    },
    searchDimVal(query) {
      this.getDimValue(query.key, query, 0, 100)
    },
    // 获取维值
    getDimValue(query, item, offset, limit) {
      tableApi.dimensionQuery({
        dimId: (item && item.id) || '',
        key: query,
        offset: offset || 0,
        limit: limit || 100
      }).then((res) => {
        if (res && res.statusCode && res.statusCode === '0') {
          item.valueList = res.data
        }
        this.queryList.push()
      })
    },
    // 初始化表格数据
    async initData() {
      const config = {}
      if (this.LogFlag === 1) {
        config.headers = {
          LogFlag: 1
        }
      }

      let data = await tableApi.data(this.filter, config)
      if (data && data.statusCode !== '0') {
        this.$Message.error(data.msg|| '抱歉')
      }
      this.loadingTableData = false
      const resData = data && data.data
      if (!resData || resData.length === 0) {
        this.source.data = this.headerData
        if (this.design.tableHeaderActive) {
          this.source.mergeCells = JSON.parse(JSON.stringify(this.headerMergeCells))
        } else {
          this.source.mergeCells = []
        }
        this.tablePage = {}
        this.paging.page = 1
        this.paging.total = 0
        this.$refs.htable.updateTable()
        return
      }
      const size = this.design.pageSize
      if (size === 0) {
        const obj = {}
        obj[1] = resData
        this.computMergeCell(obj, 1)
        this.tablePage = obj
      } else {
        const total = data.total
        let pages = 0
        const divider = total / size
        const remainder = total % size
        if (remainder !== 0) {
          pages = (parseInt(divider, 10) + 1)
        } else {
          pages = divider
        }
        this.paging.pages = pages
        const obj = {}
        for (let i = 0; i < pages; i += 1) {
          obj[i + 1] = resData.splice(0, size)
          this.computMergeCell(obj, i + 1)
        }
        this.tablePage = obj
      }
      this.source.data = this.headerData.concat(this.tablePage[1])
      if (this.mergeCells[1]) {
        if (this.design.tableHeaderActive) {
          this.source.mergeCells = this.headerMergeCells.concat(this.mergeCells[1])
        } else {
          this.source.mergeCells = this.mergeCells[1]
        }
      }
      this.paging.total = data.total
      if (this.$refs.htable && this.$refs.htable.updateTable) this.$refs.htable.updateTable()
    },
    // 计算合并单元格
    computMergeCell(obj, num) {
      // 处理当前页合并
      let mergeColumn = this.filter.mergeCodeList
      mergeColumn = Array.from(new Set(mergeColumn))
      this.columnMerge[num] = {}
      this.mergeCells[num] = []
      if (mergeColumn.length === 0) return
      // 查询列
      const datas = obj[num]
      for (let i = 0; i < mergeColumn.length; i += 1) {
        // 列ID
        const colId = mergeColumn[i]
        this.columnMerge[num][colId] = []
        const colIndex = i
        if (i === 0) {
          // 起始行
          const start = 0
          // 前列重复次数
          const lng = datas.length
          this.coplitComputMerge(num, colId, start, lng, datas, colIndex)
        } else {
          // 前一列编码
          const colIdPre = mergeColumn[i - 1]
          // 前一列已完成的列合并计算
          const preColumnMerge = this.columnMerge[num][colIdPre]
          const preKeys = Object.keys(preColumnMerge)
          for (let j = 0; j < preKeys.length; j += 1) {
            const start = preColumnMerge[preKeys[j]].row
            const lng = preColumnMerge[preKeys[j]].rowspan
            this.coplitComputMerge(num, colId, start, lng, datas, colIndex)
          }
        }
      }
    },
    // 切割进行合并列计算
    coplitComputMerge(num, colId, start, lng, datas, colIndex) {
      // 计算重复行数
      // 数值临时个数
      const sameValue = {}
      const length = start + lng
      let tempZ = null
      // 结果对象
      for (let z = start; z < length; z += 1) {
        const now = datas[z]
        const nowVal = (now && now[colId].trim()) || ''
        let pre = null
        let preVal = null
        if (z > start) {
          pre = datas[z - 1]
          preVal = pre[colId].trim() || ''
        }
        if (preVal === nowVal) {
          sameValue[preVal] += 1
          if (z === (length - 1)) {
            const span = {
              row: tempZ,
              col: colIndex,
              rowspan: sameValue[preVal],
              colspan: 1,
            }
            this.columnMerge[num][colId].push(span)
            const spanRes = JSON.parse(JSON.stringify(span))
            spanRes.row += this.source.headerRows
            this.mergeCells[num].push(spanRes)
          }
        }
        if (preVal !== nowVal && sameValue[preVal] && sameValue[preVal] >= 1) {
          const span = {
            row: tempZ,
            col: colIndex,
            rowspan: sameValue[preVal],
            colspan: 1,
          }
          this.columnMerge[num][colId].push(span)
          const spanRes = JSON.parse(JSON.stringify(span))
          spanRes.row += this.source.headerRows
          this.mergeCells[num].push(spanRes)
        }
        if (preVal !== nowVal && z === length - 1) {
          const span = {
            row: z,
            col: colIndex,
            rowspan: 1,
            colspan: 1,
          }
          this.columnMerge[num][colId].push(span)
          const spanRes = JSON.parse(JSON.stringify(span))
          spanRes.row += this.source.headerRows
          this.mergeCells[num].push(spanRes)
        }
        // 初始化当前值相同
        if (!sameValue[nowVal]) {
          sameValue[nowVal] = 1
          tempZ = z
        }
      }
    }
  }
}
