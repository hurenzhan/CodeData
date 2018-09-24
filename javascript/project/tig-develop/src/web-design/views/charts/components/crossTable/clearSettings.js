import bus from '../../utils/eventBus'
// import { initTableBorder } from './utils'

export default {
	methods: {
		clearSettings() {
			// 清空右边的状态栏
			bus.$emit(`crossTableClearSettings`, {
        index: this.index
      })
			// 清空vuex状态
			this.$store.commit('crossTableClearVuex',  this.index)
      Object.keys(this._data).forEach(v => {
        if (this._data[v] !== undefined && this._data[v] !== '' && typeof this._data[v] === 'boolean') {
          this[v] = false
        }
      })
      this.isPage = true
      // this.modelRoute = ''
      // this.isNumberDisabled = false
			this.pageSize = 10
			this.row = 1
			this.currentPage = 1
			this.isSingleSplit = false
			this.isManySplit = false
			this.isSplit = false
			this.handsonMerge = []
			// this.showNumber = false	
			// this.jumpDeatil = false
      // this.showPicture = false
      // this.showTotal = false
      this.totalStore = 'before'
      this.showHeader = true
      // this.inputNumber = ''
      this.header = []
      this.queryInfo = ''
      // this.dillList = []
      this.dimListValueSelect = []
    	// this.dimSelect = ""
    	this.dimListValue = []
      this.linkInfo = ''
      this.isQueryInfo = ''
      this.selectDill = true
      this.tableBorder = true
      this.sortList = []
      // this.moreDimSingle = false
      // this.moreMetric = false
      // this.hideDimMetric = []
      // this.isProportion = false
      this.isExport = false
      // this.isProduct = false
      // this.hoverTable = false
      // this.isShowDropdown = false
      // this.dimLabelArr = []
      // this.dimSplitSwitch = false // 拆分的状态
      // this.initTableBorder(true)
      // 更多指标
      this.$store.commit('crossSaveConfig',  {
        index: this.index,
        name: 'splitInfo',
        splitInfo: {}
      })
		},
		updateSettings() {
			const selectColumn = this.showColumn[this.selectedCell[1]]
			let columnList,tmpColumnList
			columnList = this.columnList.filter(item => item.id === this.selectId)[0]
			if(this.selectName.indexOf('###')>=0){
				tmpColumnList = this.splitMetricList[0]
				this.numberType = tmpColumnList.decimals
				this.numberTypePercent = tmpColumnList.percentType === 1? true : false
				this.numberTypeThousands = tmpColumnList.thousands
			}else{
				this.numberType = columnList.decimals
				this.numberTypePercent = columnList.percentType === 1? true : false
				this.numberTypeThousands = columnList.thousands
			}
			const feature = this.chartsOption[this.index].feature.styleConfig
      this.howDimValueShow = columnList.howDimValueShow || 'dim'
      this.alignFlag = columnList.alignFlag ? columnList.alignFlag : 'left'
			this.colColor = columnList.colColor
      this.fontColor = columnList.fontColor
      this.showGrowth = columnList.showGrowth
			const selectIdBar = this.selectId + 'bar'
			const columnListBar = this.columnList.filter(item => item.id === selectIdBar)[0]

    	this.selectDillDisabled = false // 其他列是不是启用了下钻
    	this.showColumn.forEach(v => {
    		if (v.id === this.selectId && v.hoverType === 1) {
    			this.selectHover = true
          this.hoverMetricSelect = feature.hoverMetricSelect
          this.hoverBarSelect = feature.hoverBarSelect
          this.hoverDim = feature.hoverDim
          this.hoverBar = this.metricList.filter(v => v.metricCode !== this.hoverMetricSelect)
    		}
    		if (v.hoverType === 1 && v.id !== this.selectId) {
    			this.disabledHover = true
    		}
    		if (v.id === this.selectId) {
    			if (v.numberOrbar === 'bar') {
    				this.isNumberDisabled = true
    			}
    		}
    		// 其他列有下钻路径此列不能启用下钻
  			if (v.dill && this.selectId === v.id) {
    			this.selectDill = true
    		}
    		if (v.dill && this.selectId !== v.id) {
    			this.selectDillDisabled = true
    		}
    	})
		}
	}
}