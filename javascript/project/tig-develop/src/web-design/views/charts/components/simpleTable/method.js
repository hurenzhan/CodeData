import api from '../../../../api/charts'
import {calcMetricFeature} from '../../utils/utils'
import bus from '../../utils/eventBus'
import Vue from 'vue'
import moment from 'moment'

export default {
  methods: {
    // 标记类型
    async numberOrbarClick (vm) {
      this.isNumberDisabled = false
      // 当前列显示条形图和数值格式互斥
      if (vm === 'bar') {
        this.isNumberDisabled = true
      }
      // 排序 按当前列的最大值排序
      if (vm !== 'number') {
        let sortList = []
        let upsetting = {}
        // const index = this.index
        // const type = 0
        let attrType = ''
        if (this.selectType === 0) {
          attrType = 0
        } else if (this.selectType === 1) {
          attrType = 1
        } else if (this.selectType === 3) {
          attrType = 3
        }
        sortList.push({
          attrCode: this.selectId,
          attrType: attrType,
          sortType: 1
        })
      }
      if (vm === 'number') {
        this.numberOrbar = 'number'
        // 如果已有新增列要删掉新增列
        if (this.judgeAddColumn()) {
          this.delBarColumnList()
        }
      } else if (vm === 'bar') {
        // 如果已有新增列要删掉新增列
        if (this.judgeAddColumn()) {
          this.delBarColumnList()
        }
        this.numberOrbar = 'bar'
      } else {
        if (this.judgeAddColumn()) {
          this.numberOrbar = 'number'
          this.$store.commit('simpleDelAddColumn', {
            index: this.index,
            name: 'numberOrbarDel',
            selectedCell: this.selectedCell
          })
          return
        }
        this.numberOrbar = 'addnewcolumn'
        this.$store.commit('simpleBarAddColumn', {
          index: this.index,
          name: 'numberOrbarAdd',
          selectedCell: this.selectId
        })
      }
      if (this.numberOrbar === 'number' || this.numberOrbar === 'bar') {
        this.$store.commit('simpleColumnsOption', {
          index: this.index,
          name: 'numberOrbar',
          value: this.numberOrbar,
          selectedCell: this.selectId
        })
      }
    },
    // 设置单元格对齐方式
    setAlignClick (type) {
      this.alignFlag = type
      this.$store.commit('simpleColumnsOption', {
        index: this.index,
        name: 'alignFlag',
        selectedCell: this.selectId,
        value: type
      })
    },
    // 数值显示方式
    showDimValue(type) {
      this.howDimValueShow = type
      this.$store.commit('simpleColumnsOption', {
        index: this.index,
        name: 'howDimValueShow',
        selectedCell: this.selectId,
        value: type
      })
    },
    // 判断有没有新增列
    judgeAddColumn () {
      let selectedId = ''
      this.columnList.forEach((v, i) => {
        if (this.selectId === v.id) {
          selectedId = this.columnList[i + 1].id
        }
      })
      if (selectedId !== '' && selectedId.toString().indexOf('bar') > 0) {
        return true
      }
      return false
    },
    // 列颜色的配置
    colColorChange (e) {
      if (e === this.colColor) {
        this.colColor = ''
      } else {
        this.colColor = e
      }
      this.$store.commit('simpleColumnsOption', {
        index: this.index,
        name: 'colColor',
        value: this.colColor,
        selectedCell: this.selectId
      })
    },
    // 字体颜色
    fontColorChange(e) {
      if (e === this.fontColor) {
        this.fontColor = ''
      } else {
        this.fontColor = e
      }
      this.$store.commit('simpleColumnsOption',  {
        index: this.index,
        name: 'fontColor',
        value: this.fontColor,
        selectedCell: this.selectId
      })
    },
    // 数值格式
    async numberTypeChange (e) {
      if (e !== 'percent' && e !== 'thousands') {
        this.numberType = e
      } else if (e === 'percent') {
        this.numberTypePercent = !this.numberTypePercent
      } else if (e === 'thousands') {
        this.numberTypeThousands = !this.numberTypeThousands
      }
      // 不是拆分情况下
      if (this.selectType !== 3) {
        this.columnList.forEach(v => {
          if (v.id === this.selectId) {
            if (e !== 'percent' && e !== 'thousands') {
              v.decimals = e
            } else if (e === 'percent') {
              v.percentType = this.numberTypePercent ? 1 : 0
            } else if (e === 'thousands') {
              v.thousands = this.numberTypeThousands
            }
          }
        })
      }

      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })
      let res = []
      if (this.showTotal) {
        let upsetting = {}
        upsetting.type = 1
        upsetting.autoSum = true
        res = await this.tableSearch(upsetting)
        await this.addAllNumber(res[0])
        this.allDataRender(res.slice(1)) // 生成真实数据
        this.tableDataRender() // 拼接数据
      } else {
        res = await this.tableSearch({})
        this.allDataRender(res) // 生成真实数据
        this.tableDataRender() // 拼接数据
      }
    },
    // 趋势标记
    trendChange (e) {
      this.trend = !this.trend
      this.$store.commit('simpleColumnsOption', {
        index: this.index,
        name: 'trend',
        value: e,
        selectedCell: this.selectId
      })
    },
    // 上一页
    prePage () {
      this.currentPage = Number(this.currentPage)
      if (this.currentPage === 1) return
      if (this.currentPage > this.totalPages || this.currentPage <= 0){
        this.currentPage = 1
      }else{
        this.currentPage -= 1
      }
      this.$store.commit('changeSimpleOption',  {
        index: this.index,
        name: 'currentPage',
        value: this.currentPage,
      })
    },
    // 下一页
    nextPage () {
      this.currentPage = Number(this.currentPage)
      if (this.currentPage === this.totalPages) return
      if (this.currentPage > this.totalPages || this.currentPage < 0){
        this.currentPage = 1
      }else{
        this.currentPage += 1
      }
      this.$store.commit('changeSimpleOption',  {
        index: this.index,
        name: 'currentPage',
        value: this.currentPage,
      })
    },
    enterPage () {
      const val = Number(this.currentPage)
      if (Number.isInteger(val) && val >= 1 && val <= this.totalPages) {
        this.currentPage = val
        this.$store.commit('changeSimpleOption', {
          index: this.index,
          name: 'currentPage',
          value: this.currentPage
        })
      } else {
        // 输入的页码不正确时，再这里写逻辑，现在简单的跳转到第一页
        this.currentPage = 1
        this.$store.commit('changeSimpleOption', {
          index: this.index,
          name: 'currentPage',
          value: this.currentPage
        })
      }
    },
    // 排序
    sortChange () {
      this.isSort = !this.isSort
      if (!this.isSort) {
      }
      this.$store.commit('simpleColumnsOption', {
        index: this.index,
        name: 'sort',
        selectedCell: this.selectId
      })
    },
    async selectDillChange () {
      if (!this.selectDill) {
        this.columnList.forEach((v, i) => {
          v.dill = false
        })
        this.dillDim = ''
        this.showLine = false
        this.selectNumber = 5
        this.$store.commit('simpleSaveConfig', {
          index: this.index,
          name: 'columnList',
          columnList: this.columnList
        })
        // 清空下钻数据
        const res = await this.tableSearch({})
        this.allDataRender(res) // 生成真实数据
        this.tableDataRender() // 拼接数据
        this.renderColumns()
      }
    },
    showLineChange() {
      this.columnList.forEach(v => {
        if (v.id === this.selectId) {
          v.showLine = this.dillAndLine.showLine
        }
      })
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })
    },
    //选择下砖行数
    setSelectNumber(value) {
      this.dillAndLine.selectNumber = value.replace(/\D/g, '')
      this.columnList.forEach(v => {
        if (v.id === this.selectId) {
          v.selectNumber = this.dillAndLine.selectNumber
        }
      })
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })
    },
    setDillDim (dimDill) {
      if (!dimDill || dimDill.length === 0) {
        return
      }
      if (!this.selectDill) {
        return
      }

      // 保存下钻路径
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'dimDill',
        dimDill: dimDill
      })
      // 下钻状态
      this.$store.commit('simpleColumnsOption', {
        index: this.index,
        name: 'dill',
        selectedCell: this.selectId
      })
    },
    // hover样式
    hoverChange () {
      this.hover = !this.hover
      this.$store.commit('simpleColumnsOption', {
        index: this.index,
        name: 'hover',
        selectedCell: this.selectId
      })
    },
    // 解决一个bug 点击表格最后一行不触发show事件
    // contextmenuEvent() {
    // 	const activeCell = this.tableData.length - 1
    // 	if (!this.hot.getSelected()) {
    //   	this.hideMenu = true
    // 	}
    // 	if (this.selectedCell[2] === activeCell) {
    // 		this.updateSettings()
    // 		this.hot.selectCell(this.row, this.selectedCell[1], activeCell, this.selectedCell[1], false)
    // 		if (this.selectType === 0) {
    //       console.log('bb')
    // 			this.getDill()
    // 		}
    // 	}
    // },
    // 菜单显示出来时 请求下钻数据
    contextmenuShow () {
      // debugger
      if (!this.hot.getSelected()) {
        this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
        return
      }
      if (!this.selectId || this.selectId === '' || this.selectId === 'operate') {
        this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
        return
      }
      // 判断当前是否选中在样式面板上，考虑别的情况，如果当前面板不是在样式面板或数据集面板
      let tabNav = document.querySelector('.right .el-tabs__nav')
      if (tabNav) {
        let secondNav = tabNav.querySelector('#tab-second')
        if (
          secondNav &&
          secondNav.classList.contains('is-active') &&
          this.$refs.contextmenu
        ) {
          this.$nextTick(() => {
            this.$refs.contextmenu.hide()
          })
          return
        }
      } else {
        if (this.$refs.contextmenu) {
          this.$nextTick(() => {
            this.$refs.contextmenu.hide()
          })
        }
        return
      }
      // 将当前组件设为选中状态
      this.chartsOption.forEach((v, i) => {
        v.selected = false
        if (i === this.index) {
          v.selected = true
        }
      })
      const activeCell = this.tableData.length - 1
      // const selectColumn = this.showColumn[this.selectedCell[1]]
      const crossAllList = JSON.parse(JSON.stringify(this.dimList))
      this.hoverDimList = crossAllList.filter(v => v.dimCode !== this.selectId)
      // 列的状态与右击菜单对应上
      this.updateSettings()
      const minRow = Math.min(this.selectedCell[0], this.selectedCell[2])
      const maxRow = Math.max(this.selectedCell[0], this.selectedCell[2])
      const minCol = Math.min(this.selectedCell[1], this.selectedCell[3])
      const maxCol = Math.max(this.selectedCell[1], this.selectedCell[3])
      this.showMerage = 0
      // 展示右侧不包括合并 数据区域
      if (minRow >= this.row) {
        this.showMerage = 1
        this.hot.selectCell(this.row, minCol, activeCell, minCol, false)
      }
      // 展示合并拆分的东西 纵向
      if ((maxRow !== minRow || minCol !== maxCol) && maxRow <= this.row) {
        this.mergeOrSplit = 'merge'
        this.showMerage = 2
        this.handsonMerge.forEach((v, i) => {
          const rowStart = v.row >= minRow
          const rowEnd = v.rowspan - 1 + v.row <= maxRow
          const startCol = v.col >= minCol
          const endCol = v.colspan - 1 + v.col <= maxCol
          if (rowStart && rowEnd && startCol && endCol) {
            this.mergeOrSplit = 'split'
          }
        })
      }

      if (this.showMerage === 0) {
        this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
        return
      }
      // 新增列显示条形图没有右击功能 预览模式下 但是合并单元格功能可以
      if (
        (this.isDisDraggable || this.selectId.indexOf('bar') !== -1) &&
        this.showMerage === 1
      ) {
        this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
        return
      }
      // 合并单元格出来的时候 和更多维度互斥 更多指标 更多维度的单选
      if (
        this.showMerage === 2 &&
        (this.moreDim || this.moreDimSingle || this.moreMetric)
      ) {
        this.$refs.contextmenu.hide()
      }
    },
    async topChange () {
      this.currentPage = 1
      const data = await this.tableSearch({ limit: this.selectedTopValue })
      this.allDataRender(data)
      this.renderColumns()
      this.tableDataRender()
    },
    showExportBtn (btnIndex) {
      if (this.chartsOption[this.index].feature.styleConfig.isExport) {
        this.exportBtnArr[btnIndex] = true
        Vue.set(this.exportBtnArr, btnIndex, this.exportBtnArr[btnIndex])
      }
    },
    hideExportBtn (btnIndex) {
      this.exportBtnArr[btnIndex] = false
      Vue.set(this.exportBtnArr, btnIndex, this.exportBtnArr[btnIndex])
    },
    showExportDialog () {
      this.exportTime = moment().format('YYYYMMDDHHmmssSSS')
      this.exportDialogVisible = true
      setTimeout(() => {
        this.$refs.exportNameInput.focus()
      })
    },

    // 表格导出
    async exportReport () {
      this.exportDialogVisible = false
      var _this = this
      this.showColumn.map((item, index) => {
        if (item.id !== 'operate' && !/bar$/.test(item.id) && item.id.slice(-2) !=='_x') {
          _this.exportTask.tableHead.push({ code: item.id, title: item.name })
        }
      })
      let exportParams = this.chartsOption[this.index].queryJson
      exportParams.exportTask = this.exportTask
      // 导出文件名加时间戳
      exportParams.exportTask.exportName = this.exportTask.exportName
        ? this.exportTask.exportName + '-' + this.exportTime
        : this.exportTime
      exportParams.reportId = this.$route.query.reportId
      exportParams.versionId = this.$route.query.versionId
      exportParams.metricsList = this.metricList.map(item => {
        let {rateType, isProportion, compareType} = calcMetricFeature(item.feature)
        return {
          metricsCode: item.metricCode,
          label: item.metricName,
          decimals: 2,
          metricsUnitCode: item.unitSelected,
          rateType,
          compareType: 0,
          isProportion,
          thousands: false,
          type: ''
        }
      })
      exportParams.dimList = this.dimList.map(item => {
        return {
          dimId: item.dimCode,
          dimName: item.dimName
        }
      })
      delete exportParams.format
      delete exportParams.sortList
      // console.log('exportParams',exportParams)
      let res = await api.exportReportFile(exportParams)
      if (res) {
        if (+res.statusCode === 0) {
          this.$message({
            message: '导出成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.error('请求失败')
      }
      this.exportTask = {
        exportName: '天工大数据',
        fileType: '1',
        tableHead: []
      }
    },

    // 简单表悬浮
    hoverBarHide () {
      this.hoverTable = false
    },
    hoverBarShow () {
      this.hoverTable = true
    },
    selectHoverCancel () {
      // 取消悬浮
      if (!this.selectHover) {
        this.$store.commit('simpleColumnsOption', {
          index: this.index,
          name: 'hoverType',
          value: 0,
          selectedCell: this.selectId
        })
        this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
      }
    },
    // 悬浮上去选指标
    selectHoverMetrics (value) {
      this.columnList.forEach(v => {
        if (v.id === this.selectId && this.selectHover) {
          this.$store.commit('queryHoverDimlist', {
            index: this.index,
            name: 'hoverDimList',
            value,
            dataSet: this.dataSet,
            id: v.id
          })
          this.hoverDim = ''
          this.$store.commit('simpleSaveConfig', {
            index: this.index,
            name: 'hoverDim',
            hoverDim: ''
          })
        }
      })
    },
    // 悬浮上去显示改变选中维度
   selectHoverDim (value) {
    if (!this.selectHover) {
      return
    }
    },
    // 是否展示悬浮行数
    isShowHoverLine () {
      this.columnList.forEach(v => {
        if (v.id === this.selectId) {
          v.showHoverLine = this.hoverAndLine.showLine
        }
      })
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })
    },
    // 选择悬浮行数
    chooseHoverLine (value) {
      this.hoverAndLine.selectNumber = value.replace(/\D/g, '')
      this.columnList.forEach(v => {
        if (v.id === this.selectId) {
          v.selectHoverNumber = this.hoverAndLine.selectNumber
        }
      })
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })
    },

    hoverSure () {
      if (this.hoverMetricSelect === '' || this.hoverDim === '') {
        return
      }
      this.$store.commit('simpleColumnsOption', {
        index: this.index,
        name: 'hoverType',
        value: 1,
        selectedCell: this.selectId
      })
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'hoverMetricSelect',
        hoverMetricSelect: this.hoverMetricSelect
      })
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'hoverDim',
        hoverDim: this.hoverDim
      })
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'hoverAndLine',
        hoverAndLine: this.hoverAndLine
      })
    }
  }
}
