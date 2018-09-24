import bus from '../../utils/eventBus'

export default {
	methods: {
		clearSettings() {
			// 清空右边的状态栏
			bus.$emit(`tableClearSettings`, {
        index: this.index
      })
			// 清空vuex状态
			this.$store.commit('tableClearVuex',  this.index)
      Object.keys(this._data).forEach(v => {
        if (this._data[v] !== undefined && this._data[v] !== '' && typeof this._data[v] === 'boolean') {
          this[v] = false
        }
      })
      this.isPage = true
      this.modelRoute = ''
			this.pageSize = 10
			this.row = 1
			this.currentPage = 1
			this.handsonMerge = []
      this.totalStore = 'before'
      this.showHeader = true
      this.inputNumber = ''
      this.header = []
      this.queryInfo = ''
      this.dillList = []
      this.dimListValueSelect = []
    	this.dimSelect = ""
    	this.dimListValue = []
      this.linkInfo = ''
      this.isQueryInfo = ''
      this.selectDill = true
      this.tableBorder = true
      this.hoverBarSelect = ''
      this.moreDimList = this.dimList
      this.moreMetricList = this.metricListFlat
      this.precisePositioning = ''
      this.hideDimMetric = []
      this.freeze = {
        isFreeze: false,
        freezeLine: 0,
        freezeCol: 0
      }
      this.dimLabelArr = []
      // 更多指标
      this.$store.commit('saveConfig',  {
        index: this.index,
        name: 'moreDimList',
        moreDimList: this.moreDimList
      })
      // 存更多指标
      this.$store.commit('saveConfig',  {
        index: this.index,
        name: 'moreMetricList',
        moreMetricList: this.moreMetricList
      })
		},
    // 初始化右击状态
		updateSettings() {
      const selectColumn = this.showColumn[this.selectedCell[1]]
			const columnList = this.columnList.filter(item => item.id === this.selectId)[0]
      const feature = this.chartsOption[this.index].feature.styleConfig
      this.numberOrbar = columnList.numberOrbar // 数值还是条形图
      this.alignFlag = columnList.alignFlag ? columnList.alignFlag : 'left' // 对齐方式
			this.colColor = columnList.colColor // 颜色
			this.numberType = columnList.decimals // 几位小数
      this.numberTypePercent = columnList.percentType === 1? true : false // 百分比
			this.trend = columnList.trend // 趋势标记
			this.hover = columnList.hover // 悬浮内容
			this.isSort = columnList.sort // 排序
      this.numberTypeThousands = columnList.thousands // 千分位
      this.superUrl = columnList.superUrl // 超链接
      this.fontColor = columnList.fontColor // 字体颜色
      this.howDimValueShow = columnList.howDimValueShow || 'dim' // 维值显示格式

			const selectIdBar = this.selectId + 'bar'
			const columnListBar = this.columnList.filter(item => item.id === selectIdBar)[0]
			//  判断有没有新增列
			if (columnListBar) {
				this.numberOrbar = 'addnewcolumn'
			}
    	// 悬浮表格的初始化情况
    	this.selectHover = false // 是不是启用了hover
    	this.disabledHover = false // 是不是disabled掉
    	this.isNumberDisabled = false // 新增列和数值格式互斥
    	this.selectDillDisabled = false // 其他列是不是启用了下钻
    	this.selectDill = false // 是不是启用了下钻
      this.hoverMetricSelect = ''
      this.hoverBarSelect = ''
      this.hoverDim = ''
      this.modelRoute = ''  // 下钻路径
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
      // 保存下钻的路径
    	if (selectColumn.dill) {
    		this.modelRoute = selectColumn.modelRoute
    	}
		},
    // 取消冻结
    disabledFreeze() {
      this.freeze = {
        isFreeze: false,
        freezeLine: 0,
        freezeCol: 0
      }
      bus.$emit(`disabledFreeze`, {
        index: this.index,
        value: this.freeze
      })
    }
	}
}