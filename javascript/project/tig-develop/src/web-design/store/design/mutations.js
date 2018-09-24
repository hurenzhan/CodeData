import _unionwith from 'lodash.unionwith'
import _isEqual from 'lodash.isequal'
import { Message } from 'iview'
import _differenceBy from 'lodash.differenceby'
import _difference from 'lodash.difference'
import initData from './initData'
import Vue from 'vue'

// 初始化数据
const stateInit = Object.assign({}, initData)
const clearState = {
  style: { // 表格样式
    type: 'style1', // 默认风格类型
    custom: { // 自定义类型字段
      spacing: 1, // 单元格上下间距
      fontSize: 14, // 表格字体大小
      bgColor: '#fff' // 表格背景色
    }
  },
  freeze: { // 冻结表格头（是否冻结，冻结前N列）
    freezeBoolean: 0, // 1--> 是， 0-->否
    rowNumber: 0
  },
  formatter: {  // key --> 对应列i，value --> 具体配置信息
    active: {
      type: 0, // 数值类型：0 -->数值， 1 -->百分比
      decimals: 2, // 小数点位数
      thousands: false // 是否使用千位分割符
    }
  },
  subtotal: { // 分类汇总
    mergeColumn: [], // 合并列
    total: [] // 合计
  },
  crossMetric: { // 交叉指标
    id: '',
    name: '',
    unitDefaultNm: ''
  },
  columnDim: { // 列维度
    dim: { // 选择的维度
      id: '',
      name: ''
    },
    dimValue: []
  },
  drill: {
    selectedDrillItem: {
      name: '',
      id: '',
    },
    dirllRoad: {
      routeCode: '',
      routeNm: ''
    }
  },
}

const mutations = {
  // 储存维值信息到对应过滤列表
  saveDimValue(state, payload) {
    if (payload === undefined) {
      throw new Error('维值查询缺失payload参数')
    }
    // 处理后端返回的null
    if (payload.queryDimValue.length) {
      payload.queryDimValue.forEach((v) => {
        if (!v.dimValue) {
          v.dimValue = '数据为空'
        }
        if (!v.dimValueNm) {
          v.dimValueNm = '数据为空'
        }
      })
    }
    state.filterList.forEach((v) => {
      if ('queryDimValue' in v && v.id === payload.id) {
        v.queryDimValue = payload.queryDimValue
      }
    })
  },
  // 同步选中过滤筛选选中的维度度量
  // 只有维度才能成为过滤条件
  syncSelected(state, { type, item }) {
    // type --> 1添加操作
    // 添加的两种情况 1、center组件中拖拽式添加 2.filter组件中点击checkbox添加，不同之处在于，前者传过来的是数组，后者是对象
    if (type === 'filter') {
      state.filterList = state.filterList.filter(v => v.type !== 1)
      return
    }
    if (type === 1) {
      if (Array.isArray(item)) {
        state.filterList = item.map(v => ({
          id: v.id,
          name: v.name,
          type: v.type,
          queryDimValue: v.queryDimValue ? v.queryDimValue : [], // 维值查询
          collapse: true,
          filterValue: v.filterValue,
          filterCondition: v.filterCondition
        }))
      } else {
        state.filterList.push({
          id: item.id,
          name: item.name,
          type: item.type,
          queryDimValue: [], // 维值查询
          collapse: true,
          filterValue: item.filterValue,
          filterCondition: item.filterCondition
        })
      }
    }
    // type --> 0 , 删除操作
    if (type === 0) {
      state.filterList = state.filterList.filter(v => v.id !== item.id)
    }
  },
  syncColumn(state, payload) {
    let witchNumber = '' // 添加或删除列的位置
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    // 列删除或减少时删除合并单元格
    if (payload.type !== 4) {
      mutations.clearHeaderConfig(state)
    }
    // type 为0 是删除行为， type为1是拖拽添加行为 2是点击维值行为增加 3是点击指标行为增加 4是拖拽改变顺序行为
    if (payload.type === 1) {
      // BUG-FIXED: TIG-363 添加的指标要在维值指标的前面
      // 对payload.item做个重排
      let newValue
      if (payload.item.length) {
        newValue = payload.item.filter(v => v.type !== 3)
        newValue = newValue.concat(payload.item.filter(v => v.type === 3))
      }
      // 计算添加进来的位置
      payload.item = _difference(payload.item, state.columnList)[0]
      state.columnList = newValue
    } else if (payload.type === 0) {
      const id = payload.item.id
      // 确认删除的位置
      state.columnList.forEach((v, i) => {
        if (v.id === payload.item.id) {
          witchNumber = i
        }
      })
      // state.columnList.filter(v => v.id !== id) 把删除的的列的对齐方式 数值方式变为默认
      state.columnList.forEach((v, i, arr) => {
        if (v.id === id) {
          v.formatter.type = 0
          v.formatter.decimals = 2
          v.formatter.thousands = false
          v.alignDisplay.vertical = 2
          if (v.type === 1 || v.type === 2) {
            v.alignDisplay.horizontal = 6
          } else {
            v.alignDisplay.horizontal = 4
          }
          arr.splice(i, 1)
        }
      })
    } else if (payload.type === 2) {
      let metricValueI = ''
      let dimValue
      dimValue = state.columnList.filter(v => v.type !== 3)
      dimValue.every((v, i) => {
        if (v.type === 1 || v.type === 2) {
          metricValueI = i
          return false
        }
        return true
      })
      // debugger
      if (typeof metricValueI === 'number') {
        dimValue.splice(metricValueI, 0, payload.item)
      } else {
        dimValue.push(payload.item)
      }
      dimValue = dimValue.concat(state.columnList.filter(v => v.type === 3))
      state.columnList = dimValue
    } else if (payload.type === 3) {
      let metricValue
      metricValue = state.columnList.filter(v => v.type !== 3)
      metricValue.push(payload.item)
      metricValue = metricValue.concat(metricValue.filter(v => v.type === 3))
      state.columnList = metricValue
    } else if (payload.type === 4) {
      state.columnList = payload.item
    }

    if (payload.type !== 0) {
      state.columnList.forEach((v, i) => {
        if (v.id === payload.item.id) {
          witchNumber = i
        }
      })
    }
    const frontMerge = []
    const afterMerge = []
    // 删除或增加列处理合并单元格这块
    // if (state.handsonMerge.length !== 0) {
    //   // 分开和并列 在此列的前面还是后面
    //   state.handsonMerge.forEach((v) => {
    //     if (witchNumber === v.col && witchNumber === (v.colspan + v.col) - 1) {
    //       afterMerge.push(v)
    //     } else if (witchNumber >= v.col && witchNumber <= (v.colspan + v.col) - 1) {
    //       frontMerge.push(v)
    //     } else if (witchNumber >= (v.colspan + v.col) - 1) {
    //       frontMerge.push(v)
    //     } else {
    //       afterMerge.push(v)
    //     }
    //   })
    //   // 删除行为
    //   if (payload.type === 0) {
    //     state.handsonMerge.forEach((v, i) => {
    //       if (witchNumber === v.col && witchNumber === (v.colspan + v.col) - 1) {
    //         state.handsonMerge.splice(i, 1)
    //       }
    //       if (witchNumber >= v.col && witchNumber <= (v.colspan + v.col) - 1) {
    //         v.colspan -= 1
    //       }
    //       afterMerge.forEach((j) => {
    //         if (v.col === j.col
    //           && v.colspan === j.colspan
    //           && v.row === j.row
    //           && v.rowspan === j.rowspan) {
    //           v.col -= 1
    //         }
    //       })
    //     })
    //   } else {
    //     state.handsonMerge.forEach((v) => {
    //       if (witchNumber > v.col && witchNumber <= (v.colspan + v.col) - 1) {
    //         v.colspan += 1
    //       }
    //       afterMerge.forEach((j) => {
    //         if (v.col === j.col
    //           && v.colspan === j.colspan
    //           && v.row === j.row
    //           && v.rowspan === j.rowspan) {
    //           v.col += 1
    //         }
    //       })
    //     })
    //   }
    // }
    // 处理默认选中单元格
    // let reallyCellStart = 0
    // let reallyCellEnd = 0
    // if (state.tableHeaderActive) {
    //   reallyCellStart = state.row - 1
    //   reallyCellEnd = state.row - 1
    // } else {
    //   reallyCellStart = 0
    //   reallyCellEnd = 0
    // }
    // if (state.handsonMerge.length !== 0) {
    //   state.handsonMerge.forEach((v) => {
    //     if (v.col === 0
    //       && v.colspan === 1
    //       && reallyCellStart >= v.row
    //       && reallyCellStart <= (v.rowspan + v.row) - 1) {
    //       reallyCellStart = v.row
    //       reallyCellEnd = (v.rowspan + v.row) - 1
    //     }
    //   })
    // }
    // state.cell = [reallyCellStart, 0, reallyCellEnd, 0]
    state.cell = []
    // console.log('bb')
  },
  syncQuery(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    // type 为0 是删除行为， type为1是拖拽添加行为, query 交叉指标改变过滤指标
    if (payload.type === 'query') {
      state.queryList = state.queryList.filter(v => v.type !== 1)
      return
    }
    if (payload.type === 1) {
      state.queryList = payload.item
    } else if (payload.type === 0) {
      const id = payload.item.id
      state.queryList.forEach((v, i, arr) => {
        if (v.id === id) {
          arr.splice(i, 1)
        }
      })
    }
  },
  // 处理数据导出
  handleExport(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.exportData = payload
  },
  // 处理报表功能
  handleReportFunction(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.reportFunction = payload
  },
  // 处理分页信息
  handlePageSize(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.pageSize = payload
  },
  // 处理用户选择的默认时间查询
  handleTimeDistance(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.timeDistance = payload
  },
  // 处理默认时间列表
  handleTimeList(state, payload) {
    if (payload === undefined) {
      throw new Error('timeList缺失payload参数')
    }
    state.timeList = payload
  },
  // 处理报表名称
  handleReportNameChange(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.reportName = payload
  },
  // 处理样式风格
  handleStyleChange(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.style = payload
  },
  // 处理冻结表格
  handleFreezeChange(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.freeze = payload
  },
  handleSelectedColumnChange(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.selectedColumn = payload
  },
  // 处理对齐方式
  handleAlignChange(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.align = payload
  },
  // 处理数值格式
  handleFormatterChange(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.formatter = payload
  },
  // 处理排序
  handleSorterChange(state, payload) {
    if (payload === undefined) {
      throw new Error('缺失payload参数')
    }
    state.sorter = payload
  },
  // 处理筛选时，根据筛选条件切换select单选和多选的情况
  handleSingerOrMultipleSwitch(state, { index, value }) {
    // 0大于, 1小于, 2大于等于, 3小于等于，6 等于，7不等于，6,7可以多选
    state.filterList[index].filterCondition = value
    if (value === 6 || value === 7) {
      state.filterList[index].filterValue = []
    } else { // 单选
      state.filterList[index].filterValue = ''
    }
  },
   // 处理分类汇总
  handleSubtotalChange(state, payload) {
    if (payload === undefined) {
      throw new Error('Subtotal缺失payload参数')
    }
    // 这边处理合并顺序会造成死循环 没找到原因 就在预览保存那边处理了
    // const payloadHandle = {}
    // const mergeColumn = [] // 和并列
    // const total = [] // 合计
    // // 处理顺序和列中顺序一样
    // state.columnList.forEach((v) => {
    //   payload.mergeColumn.forEach((j) => {
    //     if (v.id === j) {
    //       mergeColumn.push(j)
    //     }
    //   })
    //   payload.total.forEach((k) => {
    //     if (v.id === k) {
    //       total.push(k)
    //     }
    //   })
    // })
    // payloadHandle.mergeColumn = mergeColumn
    // payloadHandle.total = total
    state.subtotal = payload
    // console.log(state.subtotal)
  },
  // 处理自定义列设置
  handleCustomColumnChange(state, payload) {
    if (payload === undefined) {
      throw new Error('Subtotal缺失payload参数')
    }
    state.customColumn = payload
  },
  // 替换整个state
  changeWholeState(state, load) {
    const payload = load
    // console.log(load)
    if (payload) {
      Object.keys(payload).forEach((v) => {        
        state[v] = payload[v]
      })
    }
    // console.log(state.tableHeader)
    // console.log(state.handsonMerge)
    // 每次替换后初始化firstflag参数，关乎delDimValueCol(mutation)的调用
    state.firstFlag = 0
  },
  // 在没有reportContent的情况下，仅替换左侧维度和指标的信息
  onlyChangeLeftContent(state, payload) {
    Object.keys(payload).forEach((v) => {
      state[v] = payload[v]
    })
    // BUG FIXED: TIG-318 点击”修改二维表“，返回报表设计器后，列区域的自定义列信息未被清除
    state.columnList = []
    state.customColumn = []
    state.filterList = []
    // BUG FIXED: TIG-395 交叉表列维度，信息未清除
    state.columnDim = { // 列维度
      dim: { // 选择的维度
        id: '',
        name: ''
      },
      dimValue: [ // 选择的维值，多选
        {
          dimValue: '',
          dimValueNm: ''
        }
      ]
    }
  },
  // 清空所有数据
  removeAllData(state) {
    // 这边需要完善 时间紧急 先这么写死
    Object.keys(stateInit).forEach((v) => {
      state[v] = stateInit[v]
      if (v === 'style') {
        state[v] = { // 表格样式
          type: 'style1', // 默认风格类型
          custom: { // 自定义类型字段
            spacing: 1, // 单元格上下间距
            fontSize: 14, // 表格字体大小
            bgColor: '#fff' // 表格背景色
          }
        }
      }
      if (v === 'freeze') {
        state[v] = { // 冻结表格头（是否冻结，冻结前N列）
          freezeBoolean: 0, // 1--> 是， 0-->否
          rowNumber: 0
        }
      }
      if (v === 'formatter') {
        state[v] = {  // key --> 对应列i，value --> 具体配置信息
          active: {
            type: 0, // 数值类型：0 -->数值， 1 -->百分比
            decimals: 2, // 小数点位数
            thousands: false // 是否使用千位分割符
          }
        }
      }
      if (v === 'subtotal') {
        state[v] = { // 分类汇总
          mergeColumn: [], // 合并列
          total: [] // 合计
        }
      }
      if (v === 'columnDim') {
        state[v] = { // 列维度
          dim: { // 选择的维度
            id: '',
            name: ''
          },
          dimValue: []
        }
      }
      if (v === 'crossMetric') {
        state[v] = { // 交叉指标
          id: '',
          name: '',
          unitDefaultNm: ''
        }
      }
    })
    // state.filterList = []
  },
  // 清空时间维度
  removeTimeFromColumnList(state) {
    state.columnList.forEach((v, i, arr) => {
      if (v.id === 'dasp_date') {
        // debugger
        Message.info('存在自定义列关联同环比，列中不能有时间维度')
        arr.splice(i, 1)
        // 分类汇总merge.vue数据要与删除columnList行为联动
        mutations.syncDelActionWithMerge(state, v)
        // syncDelActionWithMerge(state, i)
      }
    })
  },
  removeSelectedValue(state) {
    state.selectedColumn = []
  },
  // 修改储存在columnList中的对齐状态
  syncAligninColumnList(state, payload) {
    Object.keys(payload).forEach((v) => {
      state.columnList.forEach((j, index, arr) => {
        if (v === j.id && v !== 'active') {
          arr[index].alignDisplay.horizontal = payload[v].horizontal
          arr[index].alignDisplay.vertical = payload[v].vertical
        }
      })
    })
    // mutations.reNewHandsontable(state, true)
    // mutations.renderColumns(state)
    // this.$store.commit('renderColumns')
  },
   // 修改储存在columnList中的对齐状态
  syncNumberColumnList(state, payload) {
    Object.keys(payload).forEach((v) => {
      state.columnList.forEach((j, index, arr) => {
        if (v === j.id && v !== 'active') {
          arr[index].formatter.type = payload[v].type
          arr[index].formatter.decimals = payload[v].decimals
          arr[index].formatter.thousands = payload[v].thousands
        }
      })
    })
    // mutations.reNewHandsontable(state, true)
    // mutations.renderColumns(state)
  },
  columnListUpdateEvent(state, payload) {
    state.columnListUpdate = payload
  },
  // 分类汇总组件中合并列顺序和列顺序一样
  handleMergeCellInColumnList(state) {
    const payloadHandle = {}
    const mergeColumn = [] // 和并列
    const total = [] // 合计
    // 处理顺序和列中顺序一样
    state.columnList.forEach((v) => {
      state.subtotal.mergeColumn.forEach((j) => {
        if (v.id === j) {
          mergeColumn.push(j)
        }
      })
      state.subtotal.total.forEach((k) => {
        if (v.id === k) {
          total.push(k)
        }
      })
    })
    payloadHandle.mergeColumn = mergeColumn
    payloadHandle.total = total
    state.subtotal = payloadHandle
    // console.log(state.subtotal)
    // payload.forEach((v) => {
    //   state.columnList.forEach((j, index, arr) => {
    //     if (v === j.id) {
    //       arr.splice(index, 1)
    //       arr.unshift(j)
    //     }
    //   })
    // })
  },
  // 同步下钻选项
  handleDrillChange(state, payload) {
    state.drill = payload
  },
  // 处理自定义表格头数据<二维数组>
  handleTableHeaderChange(state, payload) {
    state.tableHeader = payload
  },
  // 同步被选中的单元格
  handleSelectedCellChange(state, payload) {
    // debugger
    state.cell = payload
    // console.log(payload)
  },
  // 根据被选中的单元格同步mergeCell option
  handleHandsonMergeChange(state, payload) {
    if (!payload) {
      state.handsonMerge = ''
    }
    // payload = payload[0]
    // 选中单个单元格不提供合并单元格功能
    if (payload[0] === payload[2] && payload[1] === payload[3]) {
      return false
    }
    // 因为选择的位置的不确定，mergeCellOption的起始位置需要比较
    const rowStart = payload[0] < payload[2] ? payload[0] : payload[2]
    const colStart = payload[1] < payload[3] ? payload[1] : payload[3]
    const mergeCellOption = [{
      row: rowStart,
      col: colStart,
      rowspan: Math.abs(payload[0] - payload[2]) + 1,
      colspan: Math.abs(payload[1] - payload[3]) + 1
    }]
    // debugger
    state.handsonMerge = _unionwith(state.handsonMerge, mergeCellOption, _isEqual)
    // console.log(state.handsonMerge)
    return true
  },
  // 取消合并单元格,待优化
  handleHandsonUnMerge(state, selectCells) {
    // 1.selectCells(被选框)不包含mergeCells时，直接return
    // 2.selectCells包含mergeCells时，将mergeCells中的数组splice掉
    // 疑问在于：怎么知道被选框内是否有mergeCells的单元格
    // 获取selectCells 范围
    // 规则强制： 取消合并单元格必须选中单个单元格
    const selectRowMin = Math.min(selectCells[0], selectCells[2])
    // const selectRowMax = Math.max(selectCells[0], selectCells[2])
    const selectColMin = Math.min(selectCells[1], selectCells[3])
    // const selectColMax = Math.max(selectCells[1], selectCells[3])
    const selectrowspan = Math.abs(selectCells[0] - selectCells[2]) + 1
    const selectColspan = Math.abs(selectCells[1] - selectCells[3]) + 1
    // console.log(selectCells)
    for (let i = 0; i < state.handsonMerge.length; i += 1) {
      const v = state.handsonMerge[i]
      const BooleanStart = v.row >= selectRowMin && v.col >= selectColMin
      const BooleanEnd = v.rowspan <= selectrowspan && v.colspan <= selectColspan
      if (BooleanStart && BooleanEnd) {
        state.handsonMerge.splice(i, 1)
        i -= 1
      } 
    }
    // console.log(state.handsonMerge)
    // state.handsonMerge.forEach((v, i, arr) => {
    //   const BooleanStart = v.row >= selectRowMin && v.col >= selectColMin
    //   const BooleanEnd = v.rowspan <= selectrowspan && v.colspan <= selectColspan
    //   if (BooleanStart && BooleanEnd) {
    //     arr.splice(i, 1)
    //   }
    // })
  },
  // 将自定义列同步到列中
  syncCustomWithColumnList(state, payload) {
    state.columnList.push(payload[0])
  },
  // 每次触发columnList的set时。去更新handsontable的数据源（最后一行）方法被注掉了
  syncHandsontableWithColumnList(state, payload) {
    this.tableHeader[this.tableHeader.length - 1] = payload
  },
  // 更改isShow
  handleIsShowChange(state, payload) {
    state.isShow = payload
  },
  // 将自定义列内容推到columnList
  addCustomToColumnList(state, payload) {
    const allCustonCol = state.columnList.filter(v => v.type === 2).map(v => v.timestamp)
    const payloadIdCollection = payload.map(v => v.timestamp)
    // 新的问题，因为切换列设置的时候会改变当前自定义列的id，所以会重复添加一个新的自定义列
    // 所以这里用timestamp来做唯一校验
    // 根据timestamp更新数据
    // 修改自定义列
    state.columnList.forEach((v, i, a) => {
      payload.forEach((value) => {
        if (v.timestamp === value.timestamp) {
          a.splice(i, 1, value)
        }
      })
    })
    // 新增自定义列
    payloadIdCollection.forEach((v, i) => {
      if (!allCustonCol.includes(v)) {
        state.columnList.push(payload[i])
      }
    })
  },
  // 在删除当前行时与columnList
  deleteCustomSyncWithCol(state, payload) {
    state.columnList.forEach((v, i, arr) => {
      if (v.timestamp === payload.timestamp) {
        arr.splice(i, 1)
      }
    })
  },
  // 同步删除自定义列的内容
  syncCustomColumn(state, payload) {
    state.customColumn.forEach((v, i, arr) => {
      if (v.id === payload) {
        arr.splice(i, 1)
      }
    })
  },
  // 清空handsontable中被选中的单元格
  emptySelectCell(state) {
    state.cell = []
    // console.log('aa')
  },
  // 清空handsontable 的mergeHansontable
  emptyHandsonMerge(state) {
    state.handsonMerge = []
    // console.log('aa')
  },
  activeIcon(state, name) {
    state.activeIcon = name
  },
  // 全新创建handsontable,并初始化,初始化也要塞入最后一行表格头 加五行数据
  reNewHandsontable(state, isSaveHeader) {
    // console.log(state.handsonMerge)
    // console.log(state.tableHeader)
    // debugger
    if (isSaveHeader === false) {
      isSaveHeader = isSaveHeader
    } else {
      isSaveHeader = true
    }
    // console.log(isSaveHeader)
    // console.log(state.columnList)
    // const lastLine = state.columnList.map(v => (v.name ? v.name : v.cusName))
    const tmp = []
    const fakeData = 5 // 有五行假数据
    let rowNumber = ''
    // debugger
    if (state.tableHeaderActive) {
      rowNumber = state.row
    } else {
      rowNumber = 1
    }
    const number = 1111.44 // 数值格式
    // const mergeStart = []
    // const rowStart = []
    // state.handsonMerge.forEach((v) => {
    //   if (v.colspan === 1 && (v.row + v.rowspan === state.row)) {
    //     rowStart.push(v.row)
    //     mergeStart.push(v.col)
    //   }
    // })
    // console.log(mergeStart)
    // console.log()
    // console.log(state.realTableHeader)
    // 自定义表格头部有时有合并  取值问题 还要处理一个问题就是重新建表头数据时要保留原有的数据
    for (let i = 0; i < rowNumber - 1; i += 1) {
      // debugger
      if (state.realTableHeader.length !== 0) {
        // console.log('aa')
        tmp.push(state.realTableHeader[i])
      } else {
        const obj = {}
        state.columnList.forEach((v, j) => {
          // debugger
          if (state.tableHeader.length !== 0
            && state.tableHeaderActive
            && (state.tableHeader.length - 5) !== 1
            && state.tableHeader[i][v.id]
            && isSaveHeader) {
            // debugger
            obj[v.id] = state.tableHeader[i][v.id]
            // console.log(v.id)
            // console.log(state.tableHeader[i][v.id])
          } else {
            obj[v.id] = ''
          }
          // debugger
          // obj[v.id] = ''
          // mergeStart.forEach((item, k) => {
          //   if (j === item && i === rowStart[k]) {
          //     let name = v.name ? v.name : v.cusName
          //     if (v.unitDefaultNm !== undefined) {
          //       name = `${name} ( ${v.unitDefaultNm} )`
          //     }
          //     if (v.type === 3) {
          //       name = `${name} ( ${state.crossMetric.unitDefaultNm} )`
          //     }
          //     obj[v.id] = `${name} ( ${String.fromCharCode(65 + j)} )`
          //   }
          // })
        })
        tmp.push(obj)
      }

    }
    for (let i = 0; i <= fakeData; i += 1) {
      const lastLine = {}
      state.columnList.forEach((v, index) => {
        if (parseFloat(v.type) !== 0 && i !== 0) {
          lastLine[v.id] = number
        } else {
          let name = v.name ? v.name : v.cusName
          if (v.unitDefaultNm !== undefined) {
            name = `${name} ( ${v.unitDefaultNm} )`
          }
          if (v.type === 3) {
            name = `${name} ( ${state.crossMetric.unitDefaultNm} )`
          }
          lastLine[v.id] = `${name} ( ${String.fromCharCode(65 + index)} )`
        }
      })
      tmp.push(lastLine)
    }
    // 去除掉编辑时进来的状态
    state.realTableHeader = []
    // 处理默认选中单元格
    // let reallyCellStart = 0
    // let reallyCellEnd = 0
    // if (state.tableHeaderActive) {
    //   reallyCellStart = state.row - 1
    //   reallyCellEnd = state.row - 1
    // } else {
    //   reallyCellStart = 0
    //   reallyCellEnd = 0
    // }
    // if (state.handsonMerge.length !== 0) {
    //   state.handsonMerge.forEach((v) => {
    //     if (v.col === 0
    //       && v.colspan === 1
    //       && reallyCellStart >= v.row
    //       && reallyCellStart <= (v.rowspan + v.row) - 1) {
    //       reallyCellStart = v.row
    //       reallyCellEnd = (v.rowspan + v.row) - 1
    //     }
    //   })
    // }
    // state.cell = [reallyCellStart, 0, reallyCellEnd, 0]
    // state.handsonMerge = []
    // state.cell = []
    // console.log('aa')
    state.tableHeader = tmp
  },
  renderStyle(state, td, row) {
    // 表格全局样式 （涉及对齐方式，上下左右，上下间距，字体颜色，背景色
    // 数据样式
    let tableHeader = ''
    if (state.tableHeaderActive) {
      tableHeader = state.row
    } else {
      tableHeader = 1
    }
    if (row > (tableHeader - 1)) {
      td.style.backgroundColor = state.style.custom.bgColor
      td.style.fontWeight = 'normal'
    }
    // 表头样式
    if (row >= 0 && row <= (tableHeader - 1)) {
      if (state.style.type === 'style1') {
        td.style.backgroundColor = '#EDFBFB'
      } else {
        td.style.backgroundColor = '#FAFCED'
      }
      td.style.textAlign = 'center'
      td.style.verticalAlign = 'middle'
    }
    td.style.fontSize = `${state.style.custom.fontSize}px`
    td.style.padding = `${state.style.custom.spacing}px`
  },
  renderColumns(state) {
    const renderColumns = []
    state.columnList.forEach((v) => {
      renderColumns.push({
        data: v.id,
        renderer: (instance, td, row, colItem, prop, value) => {
          let tableHeader = ''
          if (state.tableHeaderActive) {
            tableHeader = state.row
          } else {
            tableHeader = 1
          }
          const freezeBoolean = parseFloat(state.freeze.freezeBoolean) // 是否冻结表格头
          const rowNumber = parseFloat(state.freeze.rowNumber) // 冻结多少列
          // 表格全局样式
          mutations.renderStyle(state, td, row)
          // 冻结表格头
          if (freezeBoolean === 1 && (row >= 0 && row <= (tableHeader - 1))) {
            td.style.backgroundColor = 'skyblue'
          }
          // 冻结前N列加颜色
          if (rowNumber !== 0 && colItem >= 0 && colItem < rowNumber) {
            td.style.backgroundColor = 'skyblue'
          }
          if (row > (tableHeader - 1)) {
              // 垂直对齐 上
            if (v.alignDisplay.vertical === 1) {
              td.style.verticalAlign = 'top'
            }
            // 垂直对齐 居中
            if (v.alignDisplay.vertical === 2) {
              td.style.verticalAlign = 'middle'
            }
            // 垂直对齐 下
            if (v.alignDisplay.vertical === 3) {
              td.style.verticalAlign = 'bottom'
            }
            // 水平对齐 左
            if (v.alignDisplay.horizontal === 4) {
              td.style.textAlign = 'left'
            }
            // 水平对齐 中
            if (v.alignDisplay.horizontal === 5) {
              td.style.textAlign = 'center'
            }
            // 水平对齐 右
            if (v.alignDisplay.horizontal === 6) {
              td.style.textAlign = 'right'
            }
          }
          // 数值格式 维度除外 type = 0 只处理数值部分 表格头数据不变
          if (v.type !== 0 && row > (tableHeader - 1)) {
            if (parseFloat(v.formatter.type) === 0) {
              if (value && v.formatter.decimals) {
                td.innerHTML = value.toFixed(v.formatter.decimals)
              }
            } else {
              td.innerHTML = `${(Math.round(value * 10000) / 100).toFixed(v.formatter.decimals)}%`
            }

            if (v.formatter.thousands) {
              td.innerHTML = td.innerHTML.replace(/(\d{1,2})(?=(\d{3})+\.)/g, '$1,')
            }
          } else {
            td.innerHTML = value
          }
          // 上卷下钻
          if (row > (tableHeader - 1) && state.drill.selectedDrillItem.id === v.id) {
            td.style.color = 'skyblue'
            const spanWrapper = document.createElement('span')
            const top = state.style.custom.fontSize + 2
            spanWrapper.style.display = 'inline-block'
            spanWrapper.style.position = 'relative'
            const spanValue = document.createElement('span')
            spanValue.innerHTML = td.innerHTML
            spanWrapper.appendChild(spanValue)
            const spanWave = document.createElement('span')
            spanWave.classList.add('spanWave')
            spanWave.style.top = `${top}px`
            spanWrapper.appendChild(spanWave)
            td.innerHTML = ''
            td.appendChild(spanWrapper)
          }
          if (td && td.classList) {
            td.classList.add('htCenter')
          }
          if (row >= (tableHeader - 1)) {
            instance.setCellMeta(row, colItem, 'readOnly', true)
          }
          return td
        }
      })
    })
    state.renderColumns = renderColumns
  },
  // 更改维值列表
  updateDimValueList(state, payload) {
    // 最多可供选择20个
    state.columnDim.dimValue = payload
  },
  // 更改维度列表
  handleDimList(state, payload) {
    state.columnDim.dim = payload
  },
  // 更改交叉指标
  handleCrossMetricChange(state, payload) {
    state.crossMetric = payload
  },
  // 清除自定义表格头合并配置
  clearHeaderConfig(state) {
    // 清空表头数值
    if (state.columnList.length !== 0 && window.hot && state.handsonMerge.length !== 0) {
      mutations.reNewHandsontable(state, false)
      mutations.renderColumns(state)
    }
    let realRow = state.tableHeaderActive? state.row : 1

    for (let i = 0; i < state.handsonMerge.length; i += 1) {
      const endRow = state.handsonMerge[i].rowspan - 1 + state.handsonMerge[i].row
      if (endRow <= realRow) {
        state.handsonMerge.splice(i, 1)
        i -= 1
      } 
    }
  },
  // 更改自定义表头的active状态
  handleTableHeaderActive(state, payload) {
    state.tableHeaderActive = payload
    if (payload) {
      state.reportFunction = 0
    }
  },
  addDimValueToColumnList(state, payload) {
    let witchNumber = '' // 删除或增加的位置在哪里
    const dimValueCol = state.columnList.filter(v => v.type === 3)
    const columnId = state.columnList.map(v => v.id)
    // state.columnList = data.concat(payload)
    // question: payload携带所有的维值列，然而当columnList中已经存在的维值列，就不应该重复添加了
    // 但是payload 有可能是取消选择的情况，所有不可能所有情况都是添加,要考虑删除的情况
    // 第一种增加情况 顺便处理自定义表头合并单元格问题
    payload.forEach((v) => {
      if (!columnId.includes(v.id)) {
        state.columnList.push(v)
        witchNumber = state.columnList.length - 1
        state.handsonMerge.forEach((v) => {
          if (witchNumber > v.col && witchNumber <= (v.colspan + v.col) - 1) {
            v.colspan += 1
          }
        })
      }
    })
    // 第二种删除情况
    // 删除情况下特征：columnList中存在（type === 3），payload中没有的
    const differenceCol = _differenceBy(dimValueCol, payload, 'id')
    if (differenceCol.length) {
      // 确认删除的位置
      state.columnList.forEach((v, i) => {
        if (v.id === differenceCol[0].id) {
          witchNumber = i
        }
      })
      state.columnList = state.columnList.filter(v => v.id !== differenceCol[0].id)
      state.handsonMerge.forEach((v) => {
        if (witchNumber >= v.col && witchNumber <= (v.colspan + v.col) - 1) {
          v.colspan -= 1
        }
      })
    }
  },
  // BUG FIXED: TIG-347 列区域删除维度后，分类汇总已选维度展示框中未删除已被删除的维度
  // BUG FIXED: TIG-423 合计忘了删除了
  syncDelActionWithMerge(state, payload) {
    state.subtotal.mergeColumn.forEach((v, i, arr) => {
      if (v === payload.id) {
        arr.splice(i, 1)
      }
    })
    state.subtotal.total.forEach((v, i, arr) => {
      if (v === payload.id) {
        arr.splice(i, 1)
      }
    })
    // console.log(state.subtotal)
  },
  // 删除维值列
  delDimValueCol(state) {
    state.columnList = state.columnList.filter(v => v.type !== 3)
  },
  // 保存报表id
  saveSystemId(state, payload) {
    state.systemId = payload
  },
  // 删除列在最大单元格不符合条件时调整handsonMerge设置
  // 最大列要减少
  /* eslint-disable */
  /*
  *
  * */
  // selectCellStart, selectCellEnd都代表被选中的单元格列的位置
  makeHandsonMergeQualified(state, {selectCellStart, selectCellAbs, tableLen, mergeCellCol}) {
    const selectCellEnd = selectCellStart + selectCellAbs - 1
    state.handsonMerge.forEach((v, i, arr) => {
      const itemColStart = v.col
      const itemColEnd = itemColStart + v.colspan - 1
      // 第一情况全包含
      if (selectCellEnd <= itemColEnd && selectCellStart >= itemColStart) {
        v.colspan = v.colspan - selectCellAbs
      }
      // 第二情况在左边半包含
      if (selectCellEnd > itemColStart && selectCellStart < itemColStart) {
        const intersection = selectCellEnd - itemColStart // 交流列大小
        v.col = v.col + intersection
        v.colspan = v.colspan - intersection
      }
      // 第三情况右边半包含
      if (selectCellEnd > itemColEnd && selectCellStart < itemColEnd) {
        const intersection = itemColEnd - selectCellStart // 交流列大小
        /* v.col = v.col + intersection */ // 起始位置不变
        v.colspan = v.colspan - intersection
      }
    })
  },
  // 合并单元格时，如果选择的单元格范围内已经包含了已被合并的单元格，就删除此单元格
  // here is the question : 如果被选中的单元格内包含了一个以上的被合并的单元格呢
  delSpecificHandsonMerge(state, payload) {
    state.handsonMerge.splice(payload, 1)
  },
  syncWithCustomRow(state, payload) {
    state.row = payload
  },
  changeFilterListCollapse(state, payload) {
    state.filterList[payload].collapse = !state.filterList[payload].collapse
  },
  changeFilterValue(state, { index, data }) {
    state.filterList[index].filterValue = data
  },
  changeFirstFlag(state, payload) {
    if (payload === 0) {
      state.firstFlag = 0
    }
    state.firstFlag += 1
  },
  // hack iview center组件中维值查询的select初始化的时候会带一个空值过来
  clearEmptyDimValue(state, payload) {
    state.columnDim.dimValue.forEach((v, i, arr) => {
      if (v && v.hasOwnProperty('dimValue') && v.dimValue === '') {
        arr.splice(i, 1)
      }
    })
  },
  // 同步删除指标做为筛选、查询条件
  syncQueryAndFilterWithColumnList(state, payload) {
    state.queryList = state.queryList.filter(v => v.id !== payload)
    state.filterList = state.filterList.filter(v => v.id !== payload)
  },
  // 重置合并列配置
  resetHandsonMerge(state) {
    state.handsonMerge = []
    // 先取消所有的合并
    state.columnList.forEach((v, i) => {
      mutations.handleHandsonUnMerge(state, [1, i, 5, i])
      // this.$store.commit('handleHandsonUnMerge', [1, i, 5, i])
    })
    // 再合并
    state.subtotal['mergeColumn'].forEach((v) => {
      state.columnList.forEach((item, i) => {
        if (v === item.id) {
          mutations.handleHandsonMergeChange(state, [1, i, 5, i])
          // this.$store.commit('handleHandsonMergeChange', [1, i, 5, i])
        }
      })
    })
    // console.log(state.handsonMerge)
  },
  leftToggle(state, leftToggle) {
    state.leftToggle = leftToggle
  },
  rightToggle(state, rightToggle) {
    state.rightToggle = rightToggle
  },
  activeKey(state, activeKey) {
    state.activeKey = activeKey
  },
  // keepActive表格
  keepActive(state, keepActive) {
    state.keepActive = keepActive
  }
}
export default mutations

