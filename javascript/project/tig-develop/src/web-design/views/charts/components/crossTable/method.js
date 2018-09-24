import api from '../../../../api/charts'
import {calcMetricFeature} from '../../utils/utils'
import bus from '../../utils/eventBus'
import Vue from 'vue'
import moment from 'moment'
export default {
	methods: {
    // 设置单元格对齐方式
    setAlignClick(type) {
      this.alignFlag = type
      this.$store.commit('crossColumnsOption', {
        index: this.index,
        name: 'alignFlag',
        selectedCell: this.selectId,
        value: type
      })
    },
    // 字体颜色
    fontColorChange(e) {
      if (e === this.fontColor) {
        this.fontColor = ''
      } else {
        this.fontColor = e
      }
      this.$store.commit('crossColumnsOption',  {
        index: this.index,
        name: 'fontColor',
        value: this.fontColor,
        selectedCell: this.selectId
      })
    },
    // 数值显示方式
    showDimValue(type) {
      this.howDimValueShow = type
      this.$store.commit('crossColumnsOption', {
        index: this.index,
        name: 'howDimValueShow',
        selectedCell: this.selectId,
        value: type
      })
    },
    // 列颜色的配置
    colColorChange(e) {
    	if (e === this.colColor) {
    		this.colColor = ''
    	} else {
      	this.colColor = e
    	}
    	this.$store.commit('crossColumnsOption',  {
        index: this.index,
        name: 'colColor',
        value: this.colColor,
        selectedCell: this.selectId
      })
    },
    // 数值格式
    async numberTypeChange(e) {
    	if (e !== 'percent' && e !== 'thousands') {
    		this.numberType = e
    	} else if (e === 'percent') {
    		this.numberTypePercent = !this.numberTypePercent
    	} else if (e === 'thousands') {
        this.numberTypeThousands = !this.numberTypeThousands
      }
      // debugger
    	// 不是拆分情况下
    	if (this.selectType !== 3) {
    		this.columnList.forEach(v => {
      		if (v.id === this.selectId) {
      			if (e !== 'percent' && e !== 'thousands') {
      				v.decimals = e
      			} else if (e === 'percent') {
      				v.percentType = this.numberTypePercent? 1 : 0
      			} else if (e === 'thousands') {
              v.thousands = this.numberTypeThousands
            }
      		}
      	})
    	} else {
    		// 拆分情况下 好像不起作用
    		if (e !== 'percent' && e !== 'thousands') {
  				this.splitMetricList[0].decimals = e
  			} else if (e === 'percent') {
  				this.splitMetricList[0].percentType = this.numberTypePercent? 1 : 0
  			} else if (e === 'thousands') {
          this.splitMetricList[0].thousands = this.numberTypeThousands
        }
    	}

    	this.$store.commit('crossSaveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })

      let upsetting = {}
      const res = await this.tableSearch(upsetting)
      // 合计值也要统一格式
      if (this.showTotal) {
        await this.addAllNumber()
      }
      this.allDataRender(res) // 生成真实数据
      this.tableDataRender() // 拼接数据
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
      this.$store.commit('changeCrossOption',  {
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
      this.$store.commit('changeCrossOption',  {
        index: this.index,
        name: 'currentPage',
        value: this.currentPage,
      })
    },
    // 显示增长率趋势
    showGrowthChange() {
    	this.showGrowth = !this.showGrowth
    	this.$store.commit('crossColumnsOption',  {
        index: this.index,
        name: 'showGrowth',
        selectedCell: this.selectId,
        value: this.showGrowth
      })
      this.$nextTick(() => {
        this.hot && this.hot.render()
      })
    },
    // 菜单显示出来时 请求下钻数据
    contextmenuShow() {
    	if (!this.hot.getSelected()) {
      	this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
    		return
    	}
    	if (!this.selectId || this.selectId === '') {
      	this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
    		return
      }
      // 判断当前是否选中在样式面板上，考虑别的情况，如果当前面板不是在样式面板或数据集面板
      let tabNav = document.querySelector('.right .el-tabs__nav')
      if (tabNav) {
        let secondNav = tabNav.querySelector('#tab-second')
        if (secondNav && secondNav.classList.contains('is-active')) {
          this.$nextTick(() => {
            this.$refs.contextmenu.hide()
          })
          return
        }
      } else {
        this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
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
    	if ((maxRow !== minRow || minCol !== maxCol)
    		&& maxRow <= this.row ){
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
      if(this.showMerage === 2){
        return this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
      }

      // 新增列显示条形图没有右击功能 预览模式下 但是合并单元格功能可以
      if ((this.isDisDraggable || this.selectId.indexOf('bar') !== -1) && this.showMerage === 1) {
        this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
        return
      }
    	// 合并单元格出来的时候 和更多维度互斥 更多指标 更多维度的单选
    	// if (this.showMerage === 2 && (this.moreDim || this.moreDimSingle || this.moreMetric)) {
    	// 	this.$nextTick(() => {
     //      this.$refs.contextmenu.hide()
     //    })
    	// 	return
    	// }
		},
    // 取消合并
    hansonMergeCancel() {
      const minRow = Math.min(this.selectedCell[0], this.selectedCell[2])
      const maxRow = Math.max(this.selectedCell[0], this.selectedCell[2])
      const minCol = Math.min(this.selectedCell[1], this.selectedCell[3])
      const maxCol = Math.max(this.selectedCell[1], this.selectedCell[3])
      for (let i = 0; i < this.handsonMerge.length; i += 1) {
        const v = this.handsonMerge[i]
        // 表格头最后一行不改变
        // const isLastHeader = v.rowspan - 1 + v.row === (this.row - 1) && v.row === (this.row - 1)
        if (v.row >= minRow
          && v.col >= minCol
          && v.rowspan - 1 + v.row <= maxRow
          && v.colspan - 1 + v.col <= maxCol) {
          this.handsonMerge.splice(i ,1)
          i -= 1
        }
      }
    },
   	// 合并单元格
    hansonMerge() {
    	if (this.selectedCell[2] >= this.row) {
    		this.$message({
          message: '数据区域不能合并',
          type: 'warning'
        })
        return
    	}
      // 判断冻结列    
    	const minRow = Math.min(this.selectedCell[0], this.selectedCell[2])
		  const maxRow = Math.max(this.selectedCell[0], this.selectedCell[2])
		  const minCol = Math.min(this.selectedCell[1], this.selectedCell[3])
		  const maxCol = Math.max(this.selectedCell[1], this.selectedCell[3])
		  this.handsonMerge.push({
		  	row: minRow,
        col: minCol,
        rowspan: (maxRow - minRow) + 1,
        colspan: (maxCol - minCol) + 1
		  })
    },
    enterPage() {
		 	const val = Number(this.currentPage)
      if (Number.isInteger(val) && val >= 1 && val <= this.totalPages) {
        this.currentPage = val
        this.$store.commit('changeCrossOption',  {
          index: this.index,
          name: 'currentPage',
          value: this.currentPage,
        })
      } else {
        // 输入的页码不正确时，再这里写逻辑，现在简单的跳转到第一页
        this.currentPage = 1
        this.$store.commit('changeCrossOption',  {
          index: this.index,
          name: 'currentPage',
          value: this.currentPage,
        })
      }
    },

    clearDimListValueSelect(){
      this.dimListValue = []
      // this.dimLabelArr = []
      this.dimListValueSelect = []
    },

		// 维度拆分接口查询
		async dimValueSure() {
      let splitInfo = this.splitInfo
      console.log(splitInfo)
      this.dimListValueSelectLable = splitInfo.dimValueSelected.slice(0).map(item =>{
        item.label = item.dimValueNm
        item.value = item.dimValue
        return item
      })
      this.dimValue.id = splitInfo.dimCodeSelected.dimCode
      this.dimValue.name = splitInfo.dimCodeSelected.dimName
      const dimValueList = [] // 维值
      this.dimListValueSelectLable.forEach((v, i) => {
        dimValueList.push({
          dimId: this.dimValue.id,
          dimName: this.dimValue.name,
          dimValueId: v.value,
          dimValue: v.label, // 前端以此取值
          decimals :2,// 小数位
          thousands :true,//千分位
          type : '' //0数值,1百分比,空字符串表示数据原值返回
        })
      })
			
      this.dimValueListSplit = dimValueList
			// 存维值
			this.$store.commit('crossSaveConfig', {
        index: this.index,
        name: 'dimValueListSplit',
        dimValueListSplit: this.dimValueListSplit
      })

			// 分为多指标拆分和单指标拆分
      this.splitMetricList = this.showColumn.filter(v => v.id === splitInfo.metricSelected)
      if (this.splitMetricList.length > 0) {
        // 存拆分指标
        this.$store.commit('crossSaveConfig', {
          index: this.index,
          name: 'splitMetricList',
          splitMetricList: this.splitMetricList
        })
      } else {
        this.splitMetricList = this.$store.state.charts.chartsOption[this.index].feature.styleConfig.splitMetricList
      }
      let upsetting = {}
      this.isSplit = true
      this.$store.commit('crossSaveConfig', {
        index: this.index,
        name: 'isSplit',
        isSplit: true
      })

      const data = await this.tableSearch(upsetting)
      this.showTotal = false
      // 拆分之后的表格合计为false
      this.$store.commit('crossSaveConfig', {
        index: this.index,
        name: 'showTotal',
        showTotal: false
      })
			// 拆分之后为两行表头
			// if (this.row === 1) {
			this.row = 2
			this.$store.commit('crossSaveConfig', {
        index: this.index,
        name: 'row',
        row: 2
      })
        // bus.$emit(`splitTableRow`, {
        //   index: this.index,
        //   row: 2
        // })
			// }
			if (this.hot) {
        this.hot.destroy()
        this.hot = null
      }
			this.splitColumnList()
			this.tableHeader() // 生成表头数据
			this.allDataRender(data) // 生成真实数据

			this.tableDataRender() // 拼接数据

			this.renderColumns() // 渲染列
			this.splitHansonMerge() // 处理合并表头情况
      this.saveTableHeader()
			// 拆分之后右击菜单消失
			// if (this.$refs.contextmenu) {
   //    	this.$refs.contextmenu.hide()
   //  	}
    	// 清空拆分选项
    	this.dimListValueSelect = []
      // this.dimSelect = ''
    	this.dimListValue = []
      // this.dimLabelArr = []
    	// bus.$emit(`splitTable${this.index}`, true)
		},

    // 导出相关
    showExportBtn(btnIndex){
      if(this.chartsOption[this.index].feature.styleConfig.isExport){
        this.exportBtnArr[btnIndex] = true
        Vue.set(this.exportBtnArr, btnIndex, this.exportBtnArr[btnIndex])
      }
    },
    hideExportBtn(btnIndex){
        this.exportBtnArr[btnIndex] = false
        Vue.set(this.exportBtnArr, btnIndex, this.exportBtnArr[btnIndex])
    },
    showExportDialog(){
      this.exportTime = moment().format('YYYYMMDDHHmmssSSS')
      this.exportDialogVisible = true
      setTimeout(()=>{
        this.$refs.exportNameInput.focus()
      })
    },

    // 是否显示增长趋势
    isShowGrowth(selectId){
      if(selectId.slice(-2) === '_2' || selectId.slice(-2) === '_4' || selectId.slice(-2) === '_6') return true
      if(this.isSplit){
        if(this.splitInfo.metricSelected.slice(-2) === '_2' || this.splitInfo.metricSelected.slice(-2) === '_4' || this.splitInfo.metricSelected.slice(-2) === '_6'){
          let dimValueCodeArr = []
          this.splitInfo.dimValueSelected.map(v =>{
            dimValueCodeArr.push(v.dimValue)
          })
          if(dimValueCodeArr.indexOf(selectId) >= 0) return true
        }
      }
      return false
    },

    // 表格导出
    async exportReport (){
      this.exportDialogVisible = false
      var _this = this
      let splitHeader = true
      this.showColumn.map((item, index) => {
        if (item.id !== 'operate' && !/bar$/.test(item.id)) {
          if(item.name.indexOf('###')>=0){
            if(splitHeader){
              _this.exportTask.tableHead.push({ code: this.splitMetricList[0].id, title: this.splitMetricList[0].name })
              splitHeader = false
            }
          }else{
            _this.exportTask.tableHead.push({ code: item.id, title: item.name })
          }
        }
      })
      let exportParams = this.chartsOption[this.index].queryJson
      exportParams.exportTask = this.exportTask
      // 导出文件名加时间戳
      exportParams.exportTask.exportName=this.exportTask.exportName?this.exportTask.exportName+'-'+this.exportTime:this.exportTime
      exportParams.reportId = this.$route.query.reportId
      exportParams.versionId = this.$route.query.versionId
      // exportParams.userId = this.$store.state.auth.user.code
      exportParams.metricsList = this.metricList.map(item => {
        let {rateType, isProportion, compareType} = calcMetricFeature(item.feature)
        return {
          metricsCode: item.metricCode,
          label: item.metricName,
          decimals: 2,
          metricsUnitCode: '',
          rateType,
          compareType,
          isProportion,
          thousands: true,
          type: '',
        }
      })
      exportParams.dimList = this.dimList.map(item => {
        return {
          dimId: item.dimCode,
          dimName: item.dimName
        }
      })
      // 隐藏列
      exportParams.hideCodes = this.hideCodes
      delete exportParams.format
      delete exportParams.sortList
      // console.log('exportParams',exportParams)
      let res = await api.exportReportFile(exportParams)
      if(res){
        if(+res.statusCode === 0){
          this.$message({
            message: '导出成功',
            type: 'success'
          });
        }else{
          this.$message.error(res.msg)
        } 
      }else{
        this.$message.error('请求失败')
      }
      this.exportTask = {
        exportName:'天工大数据',
        fileType: '1',
        tableHead:[],
      }
    },
	}
}
