import bus from '../../utils/eventBus'
// import { initTableBorder } from './utils'

export default {
	methods: {
		clearSettings() {
			// 清空右边的状态栏
			bus.$emit(`simpleTableClearSettings`, {
				index: this.index
			})
			// 清空vuex状态
			this.$store.commit('simpleTableClearSettings',  this.index)
      this.isNumberDisabled = false
			this.currentPage = 1
			this.handsonMerge = []
      this.showTotal = false
      this.totalStore = 'before'
      this.header = []
      this.queryInfo = ''
      this.dillList = []
      this.linkInfo = ''
      this.isQueryInfo = ''
      this.dillDim = ''
			this.selectDill = false
			this.hoverDimList = []
			this.selectedTopValue = ''
			this.$store.commit('saveSimpleDetailConfig',  {
        index: this.index,
        name: 'detailConfig',
        detailConfig: {
					selectedReport: '',
					selectedReportVersion: '1.0',
					detailFilter: '',
					reportSearchKey: ''
				}
      })
		},
		// 更新右侧弹框的状态
		updateSettings() {
      const selectColumn = this.showColumn[this.selectedCell[1]]
			const columnList = this.columnList.filter(item => item.id === this.selectId)[0]
			const chartsOption = this.chartsOption[this.index].feature.styleConfig
			const dataSet = this.$store.state.charts.dataSet

      this.numberOrbar = columnList.numberOrbar
      this.alignFlag = columnList.alignFlag ? columnList.alignFlag : 'left'
			this.colColor = columnList.colColor
			this.numberType = columnList.decimals
      this.numberTypePercent = columnList.percentType === 1? true : false
			this.trend = columnList.trend
			this.hover = columnList.hover
			this.isSort = columnList.sort
      this.numberTypeThousands = columnList.thousands
      this.fontColor = columnList.fontColor
      this.dillAndLine = {
        showLine: false, // 是否开启下钻行数
        selectNumber: 5,//下钻条数
      }
      this.howDimValueShow = columnList.howDimValueShow || 'dim'
 
      this.dillDim = ''
			const selectIdBar = this.selectId + 'bar'
			const columnListBar = this.columnList.filter(item => item.id === selectIdBar)[0]
			//  判断有没有新增列
			if (columnListBar) {
				this.numberOrbar = 'addnewcolumn'
			}
			// 悬浮表格的初始化情况
			this.hoverAndLine = {
				showLine: false, // 是否开启悬浮行数
				selectNumber: 5,//悬浮条数
			}
    	this.selectHover = false // 是不是启用了下钻
			this.disabledHover = false // 是不是disabled掉
			this.hoverMetricSelect = ''
			this.hoverDim = ''
    	this.isNumberDisabled = false // 新增列和数值格式互斥
    	this.selectDillDisabled = false // 其他列是不是启用了下钻
			this.selectDill = false // 是不是启用了下钻		
			this.$store.commit('simpleSaveConfig',  {
				index: this.index,
				name: 'hoverDimList',
				hoverDimList: []
			})
    	this.showColumn.forEach(v => {
    		if (v.id === this.selectId) {
    			if (v.numberOrbar === 'bar') {
    				this.isNumberDisabled = true
    			}
    		}
    		// 其他列有下钻路径此列不能启用下钻
  			if (v.dill && this.selectId === v.id) {
    			this.selectDill = true
          this.dillAndLine = chartsOption.dillAndLine
          this.dillDim = chartsOption.dimDill
    		}
    		if (v.dill && this.selectId !== v.id) {
    			this.selectDillDisabled = true
				}
				if (v.id === this.selectId && v.hoverType === 1) {
    			this.selectHover = true
					this.hoverDim = chartsOption.hoverDim
					this.hoverMetricSelect = chartsOption.hoverMetricSelect	
					const hoverDimList = dataSet.filter(item => item.metricCode === this.hoverMetricSelect)[0].dimList.filter(item=>item.dimCode !== v.id && item.dimCode !== "dasp_date" )
					this.$store.commit('simpleSaveConfig',  {
						index: this.index,
						name: 'hoverDimList',
						hoverDimList: hoverDimList
					})
					this.hoverAndLine = chartsOption.hoverAndLine	
    		}
				if (v.hoverType === 1 && v.id !== this.selectId) {
					this.disabledHover = true
					this.$store.commit('simpleSaveConfig',  {
						index: this.index,
						name: 'hoverDimList',
						hoverDimList: []
					})
    		}
    	})
		}
	}
}