import api from '../../../../api/charts'
import {calcMetricFeature} from '../../utils/utils'
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

	      // type可能是交叉表的情况没有考虑
	      // if (this.selectId in this.allMax) {
        //   this.$store.commit('saveConfig', {
        //     index: this.index,
        //     name: 'allMax',
        //     allMax: this.allMax
        //   })
	      // } else {
	      // 	upsetting.sortList = sortList
        //   try {
        //     const dataMax = await this.tableSearch(upsetting)
        //     // console.log(dataMax[0][this.selectId])
        //     // 千分位处理一下
        //     let dealDataMax = dataMax[0][this.selectId]
        //     if (dealDataMax && dealDataMax.toString().indexOf(',') > 0) {
        //       dealDataMax = dealDataMax.toString().replace(/,/g, "")
        //     }
        //     // debugger
        //     // 百分比处理一下
        //     if (dealDataMax && dealDataMax.toString().indexOf('%') > 0) {
        //       dealDataMax = Number(dealDataMax.toString().replace("%", "")) / 100
        //     }
        //     // console.log(dealDataMax)
        //     this.allMax[this.selectId] = dealDataMax
        //     this.$store.commit('saveConfig', {
        //       index: this.index,
        //       name: 'allMax',
        //       allMax: this.allMax
        //     })
        //   } catch (e) {

        //   }
	      // }
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
	        this.$store.commit('delAddColumn',  {
	          index: this.index,
	          name: 'numberOrbarDel',
	          selectedCell: this.selectedCell
	        })
	        return
      	}
      	this.numberOrbar = 'addnewcolumn'
      	this.$store.commit('barAddColumn',  {
          index: this.index,
          name: 'numberOrbarAdd',
          selectedCell: this.selectId
        })

      }
      if (this.numberOrbar === 'number' || this.numberOrbar === 'bar') {
      	this.$store.commit('columnsOption',  {
          index: this.index,
          name: 'numberOrbar',
          value: this.numberOrbar,
          selectedCell: this.selectId
        })
      }
    },
    // 设置单元格对齐方式
    setAlignClick(type) {
      this.alignFlag = type
      this.$store.commit('columnsOption', {
        index: this.index,
        name: 'alignFlag',
        selectedCell: this.selectId,
        value: type
      })
    },
    // 数值显示方式
    showDimValue(type) {
      this.howDimValueShow = type
      this.$store.commit('columnsOption', {
        index: this.index,
        name: 'howDimValueShow',
        selectedCell: this.selectId,
        value: type
      })
    },
    // 判断有没有新增列
    judgeAddColumn() {
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
    // 超链接启用与否
    superUrlChange(e) {
    	if (e) {
    		this.superUrl = true
    	} else {
    		this.superUrl = false
    	}
    	this.$store.commit('columnsOption',  {
        index: this.index,
        name: 'superUrl',
        value: this.superUrl,
        selectedCell: this.selectId
      })
    },
    // 列颜色的配置
    colColorChange(e) {
    	if (e === this.colColor) {
    		this.colColor = ''
    	} else {
      	this.colColor = e
    	}
    	this.$store.commit('columnsOption',  {
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
      this.$store.commit('columnsOption',  {
        index: this.index,
        name: 'fontColor',
        value: this.fontColor,
        selectedCell: this.selectId
      })
    },
    // 数值格式
    async numberTypeChange(e) {
      // debugger
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
      				v.percentType = this.numberTypePercent? 1 : 0
      			} else if (e === 'thousands') {
              v.thousands = this.numberTypeThousands
            }
      		}
      	})
    	}

    	this.$store.commit('saveConfig', {
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
    trendChange(e) {
    	this.trend = !this.trend
    	if (this.isSingleSplit) {
    		this.metricListFlat[0].trend = this.trend
    		this.$store.commit('saveConfig',  {
          index: this.index,
          name: 'metricList',
          metricList: this.metricListFlat
        })
    	}
    	this.$store.commit('columnsOption',  {
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
      this.$store.commit('changeOption',  {
        index: this.index,
        name: 'currentPage',
        value: this.currentPage,
      })
    },
    // 下一页
    nextPage () {
      // debugger
      this.currentPage = Number(this.currentPage)
      if (this.currentPage === this.totalPages) return
      if (this.currentPage > this.totalPages || this.currentPage < 0){
        this.currentPage = 1
      }else{
        this.currentPage += 1
      }
      this.$store.commit('changeOption',  {
        index: this.index,
        name: 'currentPage',
        value: this.currentPage,
      })
    },
    // 排序
    sortChange() {
    	this.isSort = !this.isSort
    	if (!this.isSort) {
    	}
    	this.$store.commit('columnsOption',  {
        index: this.index,
        name: 'sort',
        selectedCell: this.selectId
      })
    },
    // hover样式
    hoverChange() {
    	this.hover = !this.hover
    	this.$store.commit('columnsOption',  {
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
    	const selectColumn = this.showColumn[this.selectedCell[1]]

    	// 悬浮条形图选择的维度
    	const crossAllList = JSON.parse(JSON.stringify(this.dimList))

    	// if (this.hoverDimList.length === 0) {
    		this.hoverDimList = crossAllList.filter(v => v.dimCode !== this.selectId)
	      // if (this.hoverDimListSelect && this.hoverDimListSelect.length === 0) {
	      // 	this.hoverDimListSelect = JSON.parse(JSON.stringify(this.hoverDimList))
	      // }
    	// }
    	// 悬浮条形图选择的指标并且初始化
      // const hoverMetric = JSON.parse(JSON.stringify(this.metricListFlat))
  	  // if (this.hoverMetricList.length === 0) {
  	  	// this.hoverMetricList = hoverMetric.map((v) => {
    	 //  	v.selected = false
	     //    v.rateType = 0 // 默认同期值
	     //    return v
	     //  })
	      // if (this.hoverMetricListSelect && this.hoverMetricListSelect.length === 0) {
	      // 	this.hoverMetricListSelect = JSON.parse(JSON.stringify(this.hoverMetricList))
	      // }
  	  // }
  	  if (selectColumn.hoverType === 1) {
  	  	// this.hoverDimList = this.hoverDimListSelect
    		// this.hoverMetricList = this.hoverMetricListSelect
  	  }

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
      // 新增列显示条形图没有右击功能 预览模式下 但是合并单元格功能可以
      if ((this.isDisDraggable || this.selectId.indexOf('bar') !== -1) && this.showMerage === 1) {
        this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
        return
      }
    	// 合并单元格出来的时候 和更多维度互斥 更多指标 更多维度的单选
    	if (this.showMerage === 2 && (this.moreDim || this.moreDimSingle || this.moreMetric)) {
    		this.$nextTick(() => {
          this.$refs.contextmenu.hide()
        })
    		return
    	}
      // console.log(this.showMerage)
  		if (this.selectType === 0 && this.showMerage !== 2) {
  			this.getDill()
  		}
		},
    // 选择下钻数据
    setDrillRouter(code) {
    	if (!code || code === '') {
    		return
    	}
    	if (!this.selectDill) {
    		return
    	}

    	this.dillList.forEach((v, i) => {
    		if (v.routeCode === code) {
    			this.selectRoute = v
    			this.$store.commit('saveConfig',  {
		        index: this.index,
		        name: 'selectRoute',
		        selectRoute: this.selectRoute
          })
    		}
    	})
    	this.columnList.forEach((v, i) => {
    		if (v.id === this.selectId) {
    			v.modelRoute = this.modelRoute
    		}
    	})
    	this.$store.commit('columnsOption',  {
        index: this.index,
        name: 'dill',
        selectedCell: this.selectId
      })
      // 下钻样式重新渲染
      // this.$nextTick(()=>{
      //   this.syncTable()
      // })
    },
    //选择下砖行数
    setSelectNumber(value) {
      this.selectNumber = value.replace(/\D/g, '')
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'selectNumber',
        selectNumber: this.selectNumber
      })
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
		  // if (maxRow === (this.row - 1) && (maxCol - minCol) > 0) {
		  // 	this.$message({
    //       message: ' 最后一行不能合并',
    //       type: 'warning'
    //     })
    //     return
		  // }
      // 冻结列
      if (this.freeze.isFreeze) {
        const flagCol = this.freeze.freezeCol <= maxCol && this.freeze.freezeCol >= minCol? true : false
        const flagLine = this.freeze.freezeLine <= maxRow && this.freeze.freezeLine >= minRow? true : false
        // debugger
        if (flagCol) {
          this.$message({
            message: `冻结的列在合并单元格中,不能合并`,
            type: 'error'
          })
          return
        }
        if (flagLine) {
          this.$message({
            message: `冻结的行在合并单元格中,不能合并`,
            type: 'error'
          })
          return
        }
      }

      // 序号、显示详情与合并单元格互斥
      // if(this.showNumber && minCol === 0 && this.selectedCell[1] !== this.selectedCell[3]){
      //   return this.$message({
      //     message: `序号列不能合并单元格`,
      //     type: 'error'
      //   })
      // }

      // if(this.jumpDeatil && maxCol === Object.getOwnPropertyNames(this.header[0]).length-2 && this.selectedCell[1] !== this.selectedCell[3]){
      //   return this.$message({
      //     message: `详情列不能合并单元格`,
      //     type: 'error'
      //   })
      // }
      // console.log(this.handsonMerge)

		  // 合并单元格删除已经存在的 不然会有 bug
	    // this.handsonMerge.forEach((v, i) => {
	    // 	const BooleanStart = v.row >= minRow && v.col >= minCol
	    //   const BooleanEnd = v.rowspan <= (maxRow - minRow + 1) && v.colspan <= (maxCol - minCol) + 1
	    // 	if (BooleanStart && BooleanEnd) {
	    // 		this.handsonMerge.splice(i, 1)
	    // 	}
	    // })
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
        this.$store.commit('changeOption',  {
          index: this.index,
          name: 'currentPage',
          value: this.currentPage,
        })
      } else {
        // 输入的页码不正确时，再这里写逻辑，现在简单的跳转到第一页
        this.currentPage = 1
        this.$store.commit('changeOption',  {
          index: this.index,
          name: 'currentPage',
          value: this.currentPage,
        })
      }
    },
    // 获取下钻的路径
    async getDill() {
    	let res = await api.getDill({dimId: this.selectId})
    	this.dillList = res.data
    	let dillList = this.dillList.slice()
    	const isShowRoute = this.crossAllList.map(v => v.dimCode)
    	// 下钻路径不能在公共维度中出现
    	for (let i = 0; i < dillList.length; i += 1) {
    		let isShow = true
    		const splitRoute = dillList[i].route.split('-')
    		for (let j = 0; j < splitRoute.length; j += 1) {
    			if (isShowRoute.toString().indexOf(splitRoute[j]) !== -1) {
						isShow = false
					} else {
						isShow = true
						break
					}
    		}
    		if (isShow) {
    			dillList.splice(i, 1)
    			i -= 1
    		}
    	}
      // console.log(dillList)
    	this.dillList = dillList
		},
		async selectDillCancel(value) {
			// 取消下钻
      // console.log(this.selectDill)
    	if (!this.selectDill) {
    		this.columnList.forEach((v, i) => {
    			v.dill = false
    		})
    		this.modelRoute = ''
        this.showLine = false
        this.selectNumber = 5
    		this.$store.commit('saveConfig',  {
          index: this.index,
          name: 'columnList',
          columnList: this.columnList
        })
        // 清空下钻数据
        let upsetting = {
        }
      	const res = await this.tableSearch(upsetting)
      	// 合计值
      	// await this.addAllNumber()
      	this.allDataRender(res) // 生成真实数据
      	this.tableDataRender() // 拼接数据
        this.renderColumns(this.chartWarnData)
    	}
		},
		// selectDimValue(item) {
  //     this.clearDimListValueSelect()
  //     this.dimListValueSelectLable = []
  //     let obj = {};
  //     obj = this.crossDimList.find((value)=>{
  //         return value.dimCode === item;
  //     });
		// 	this.dimValue.id = item
  //     this.dimValue.name = obj.dimName
		// 	this.getDimList()
		// },
		// //指标按列维度拆分
		// async getDimList(){
		// 	if (!this.dimValue.id || this.dimValue.id === '' || this.dimSelect.length === 0) {
  //       return
		// 	}
		// 	let res = await api.dimListValue({dimId: this.dimValue.id, offset:0, limit:50})
		// 	this.dimListValue = res.data;
		// },
		// dimSplit(item) {
  //     this.dimLabelArr = []
		// 	if (item.length === 0) {
		// 		return
		// 	}
  //     this.dimListValueSelectLable = []
  //     item.map((val)=>{
  //       let obj = {}
  //       obj = this.dimListValue.find((value)=>{
  //           return value.dimValue === val;
  //       });
  //       this.dimLabelArr.push(obj.dimValueNm)
  //       this.dimListValueSelectLable.push({value:val,label:obj.dimValueNm})
  //     })
		// },

    // clearDimListValueSelect(){
    //   this.dimListValue = []
    //   this.dimLabelArr = []
    //   this.dimListValueSelect = []
    // },

    moreChange(value,type){
      type === 'dimList' ? this.moreDimlistChangeFlag = true : this.moreMetriclistChangeFlag = true
    },

		async moreDimListChange(value, type) {
      type === 'change' && value ? this.moreDimlistChangeFlag = false : ''
      // if (type === 'change') {
      if ((!value || type === 'remove') && this.moreDimlistChangeFlag) {
        this.currentPage = 1

        const sortMoreDimList = []
        this.moreDimList = []
        let dimListArray = []
        let dimList = [] // 发送请求的dimList
        this.moreDimListSelect.forEach((v, i) => {
          this.dimList.forEach((item) => {
            if (item.dimCode === v) {
              this.moreDimList.push(item)
            }
          })
        })
        // 给moreDimList排序
        this.dimList.forEach(v => {
          this.moreDimList.forEach(item => {
            if (item.dimCode === v.dimCode) {
              sortMoreDimList.push(item)
            }
          })
        })

        if (this.moreDimSingle) {
          // this.dimListRadio = []
          // let dimFirst = []
          // sortMoreDimList.forEach((v, i) => {
          //   let selected = false
          //   if (v.dimCode === this.moreDimSingleSelect) {
          //     selected= true
          //   }
          //   this.dimListRadio.push({
          //     dimCode: v.dimCode,
          //     dimName: v.dimName,
          //     selected: selected,
          //     dimType: v.dimType
          //   })
          // })
          // this.moreDimList = sortMoreDimList.filter(item => item.dimCode === this.moreDimSingleSelect)
        } else {
          this.moreDimList = sortMoreDimList
        }
        // 改变列单元格配置取消
        this.moreDimList.forEach((v) => {
          dimList.push({
            dimId: v.dimCode,
            dimName: v.dimName
          })
        })
        this.hot.destroy()
        this.hot = null
        // 取消冻结
        this.disabledFreeze()
        let res = []
        this.tableHeader() // 生成表头数据
        if (this.showTotal) {
          let upsetting = {}
          upsetting.type = 1
          upsetting.autoSum = true
          res = await this.tableSearch(upsetting)
          await this.addAllNumber(res[0])
          this.allDataRender(res.slice(1)) // 生成真实数据
        } else {
          res = await this.tableSearch({})
          this.allDataRender(res) // 生成真实数据
        }
        this.tableDataRender() // 拼接数据
        this.renderColumns(this.chartWarnData) // 渲染列
        this.calTableScroll()
        this.calTableHeight()
      }
		},
    async moreMetricListChange(value, type) {
      type === 'change' && value ? this.moreMetriclistChangeFlag = false : ''
      // if (type === 'change') {
        this.currentPage = 1
        if ((!value || type === 'remove') && this.moreMetriclistChangeFlag) {
          // 如果一个都不选 默认是第一个
          if (this.moreMetricListSelect.length === 0) {
            this.moreMetricListSelect = []
            this.moreMetricListSelect.push(this.metricListFlat[0].metricCode)
          }

          this.moreMetricList = []

          this.metricListFlat.forEach((v, i) => {
            this.moreMetricListSelect.forEach((item) => {
              if (item === v.metricCode) {
                this.moreMetricList.push(v)
              }
            })
          })

          this.hot.destroy()
          this.hot = null
          this.disabledFreeze()
          this.tableHeader() // 生成表头数据
          let res = []
          if (this.showTotal) {
            let upsetting = {}
            upsetting.type = 1
            upsetting.autoSum = true
            res = await this.tableSearch(upsetting)
            await this.addAllNumber(res[0])
            this.allDataRender(res.slice(1)) // 生成真实数据
          } else {
            res = await this.tableSearch({})
            this.allDataRender(res) // 生成真实数据
          }
          this.tableDataRender() // 拼接数据
          this.renderColumns(this.chartWarnData) // 渲染列
        }
        this.calTableScroll()
        this.calTableHeight()
    },
		hoverBarShow() {
			this.hoverTable = true
		},
		hoverBarHide() {
			// 隐藏悬浮表格
			this.hoverTable = false
		},
		// 悬浮上去选条形图
		hoverBarChange(value) {
			// this.$store.commit('saveConfig', {
   //      index: this.index,
   //      name: 'hoverBarSelect',
   //      hoverBarSelect: value
   //    })
		},
		// 悬浮上去选指标
		selectHoverMetrics(value) {
			if (!this.selectHover) {
				return
			}
			// const selectHoverDim = this.hoverMetricList.filter(v => v.selected)
			// const selectOrDeselect = this.hoverMetricList.filter(v => v.metricCode === value)
			// if (selectHoverDim.length === 1 && !selectOrDeselect[0].selected) {
			// 	return
			// }
			// this.hoverMetricList.forEach((v) => {
			// 	if (v.metricCode === value) {
			// 		if (v.selected) {
			// 			v.selected = false
			// 		} else {
			// 			v.selected = true
			// 		}
			// 	}
			// })
			// this.hoverMetricListSelect = JSON.parse(JSON.stringify(this.hoverMetricList))
      // console.log(this.hoverMetricListSelect)
      // this.$store.commit('saveConfig', {
      //   index: this.index,
      //   name: 'hoverMetricListSelect',
      //   hoverMetricListSelect: this.hoverMetricListSelect
      // })
			this.hoverBar = this.metricList.filter(v => v.metricCode !== value)
		},
		hoverSure() {
      if (this.hoverMetricSelect === '' || this.hoverBarSelect === '' || this.hoverDim === '') {
        return
      }
			this.$store.commit('columnsOption',  {
        index: this.index,
        name: 'hoverType',
        value: 1,
        selectedCell: this.selectId
      })
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'hoverMetricSelect',
        hoverMetricSelect: this.hoverMetricSelect
      })
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'hoverBarSelect',
        hoverBarSelect: this.hoverBarSelect
      })
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'hoverDim',
        hoverDim: this.hoverDim
      })
		},
		// 悬浮上去显示改变选中维度
		selectHoverDim(value) {
			if (!this.selectHover) {
				return
			}
			// const selectHoverDim = this.hoverDimList.filter(v => v.selected)
			// const selectOrDeselect = this.hoverDimList.filter(v => v.dimCode === value)

			// if (selectHoverDim.length === 2 && !selectOrDeselect[0].selected) {
			// 	return
			// }

			// this.hoverDimList.forEach((v) => {
			// 	if (v.dimCode === value) {
			// 		if (v.selected) {
			// 			v.selected = false
			// 		} else {
			// 			v.selected = true
			// 		}
			// 	}
			// })
			// this.hoverDimListSelect = JSON.parse(JSON.stringify(this.hoverDimList))
			// this.$store.commit('saveConfig', {
   //      index: this.index,
   //      name: 'hoverDimListSelect',
   //      hoverDimListSelect: this.hoverDimListSelect
   //    })
		},
		selectHoverCancel() {
			// 取消悬浮
			if (!this.selectHover) {
				this.$store.commit('columnsOption',  {
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
		async moredimRadio(code) {
      this.currentPage = 1
      let nameCode = code
      nameCode = this.dimListRadioAlias.filter(item => item.dimName === code)[0].dimCode
      this.moreDimSingleCode = nameCode
			this.moreDimList = []
			this.dimListRadio.forEach(v => {
				if (v.dimCode === nameCode) {
					this.moreDimList.push({
						dimCode: v.dimCode,
            dimName: v.dimName,
            dimType: v.dimType
					})
				}
			})
      this.hot.destroy()
      this.hot = null
      this.disabledFreeze()
      this.tableHeader() // 生成表头数据

      let res = []
      if (this.showTotal) {
        let upsetting = {}
        upsetting.type = 1
        upsetting.autoSum = true
        res = await this.tableSearch(upsetting)
        await this.addAllNumber(res[0])
        this.allDataRender(res.slice(1)) // 生成真实数据
      } else {
        res = await this.tableSearch({})
        this.allDataRender(res) // 生成真实数据
      }
      this.renderColumns(this.chartWarnData) // 渲染列
      this.tableDataRender() // 拼接数据
      // 当更多维度是否勾选的时候重新计算表格高度
      this.calTableHeight()
      this.calTableScroll()
		},

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

    // 表格导出
    async exportReport (){
      this.exportDialogVisible = false
      var _this = this
      this.header.map((item,index)=>{
        if(index == this.row-1){
          Object.keys(item).forEach(function(key){
            if(key !== 'operate' && !/bar$/.test(key) && key.slice(-2) !== '_x'){
              _this.exportTask.tableHead.push({'code':key,'title':item[key]})
            }
          })
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
          metricsUnitCode: item.unitSelected,
          rateType,
          isProportion,
          compareType: 0,
          thousands: false,
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
    // 精准定位4连 start
    querySearch(queryString) {
		  if(queryString === '') {
        this.precisePositioningShow = false
      } else {
        this.precisePositioningShow = true
        // 从allData数据源生成新的总数据
        let tableData = JSON.parse(JSON.stringify(this.allData)).map(item => {
          for (let keyName in item) {
            if (item.hasOwnProperty(keyName) && this.hideDimMetric.length > 0 && this.hideDimMetric.indexOf(keyName) > -1) {
              delete item[keyName]
            }
            if (item.hasOwnProperty(keyName) && !this.isRanking && keyName === 'ranking') {
              delete item[keyName]
            }
            if (item.hasOwnProperty(keyName) && typeof(item[keyName]) === 'string' && item[keyName].indexOf('###') > -1) {
              const howDimValueShow = this.columnList.filter(v => v.id === keyName)[0].howDimValueShow
              if (howDimValueShow === 'dimAndCode') {
                item[keyName] = item[keyName].replace(/###/g, '_')
              } else if (howDimValueShow === 'code') {
                item[keyName] = item[keyName].split('###')[0]
              } else if (howDimValueShow === 'dim') {
                item[keyName] = item[keyName].split('###')[1]
              } else {
                item[keyName] = item[keyName].replace(/###/g, '_')
              }

            }
          }
          return item
        })
        // 过滤查询结果
        this.precisePositioningResult = tableData.filter(this.createFilter(queryString))
        // console.log(columnMaxLengthObj)
        // results = this.header.concat(results)
        // 调用 callback 返回建议列表的数据
        // cb(results)
        this.precisePositioningPagination(1)
        if (this.precisePositioningResult.length > 0) {
          //50是右边定位图标偏移量
          this.$nextTick(() => {
            let suggestionList = this.$refs[`myAutoComplete${this.index}`]
            suggestionList.setAttribute("style", "width:" + (this.columnMaxLengthSum * 10 + 70) + "px!important;")
          })
        }
      }

    },
    createFilter(queryString) {
      return (tableDataObj) => {
        let tableDataObjValues = []
        for (let keyName in tableDataObj) {
          if (tableDataObj.hasOwnProperty(keyName) && this.showNumber) {
            tableDataObjValues.push(tableDataObj[keyName])
          } else if (tableDataObj.hasOwnProperty(keyName) && !this.showNumber) {
            if (keyName !== 'number') tableDataObjValues.push(tableDataObj[keyName])
          }
        }
        return (tableDataObjValues.join('').toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    handleSelect(item) {
		  let num = item.number
      if (!Number.isInteger(num)) return false
      let pageSize = this.pageSize
      // 表头行数大于1，合计前置等，多余偏移量
      this.currentPage = Math.ceil(num / pageSize)
      this.enterPage()
      let trs = document.querySelector(`#tablePro${this.index} .htCore`).querySelectorAll('tr')
      let trsLength = trs.length
      let dataLength = this.allData.length
      let offsetLength = 0
      trs.forEach(tr => tr.setAttribute("style", "font-weight: normal;"))
      if (this.currentPage * pageSize > dataLength) {
		    offsetLength = trsLength - dataLength % pageSize
      } else {
        offsetLength = trsLength - pageSize
      }
      if (this.showTotal && this.totalStore === 'after' && this.currentPage === 1) offsetLength--
      const tr = document.querySelector(`#tablePro${this.index} .htCore tr:nth-child(${num%pageSize === 0 ? pageSize + offsetLength : num%pageSize + offsetLength})`)
      tr.scrollIntoView(false)
      tr.setAttribute("style", "font-weight: 700;")
      this.precisePositioningShow = false
    },
    handleIconClick(ev) {
		  console.log(ev)
    },
    clearTrsStyle() {
		  let eleHtCore = document.querySelector(`#tablePro${this.index} .htCore`)
      if (eleHtCore) {
        eleHtCore.querySelectorAll('tr').forEach(tr => tr.setAttribute("style", "font-weight: normal;"))
      }
    },
    precisePositioningHighLight(v) {
		  let queryString = this.precisePositioning
      if (queryString !== '' && typeof(queryString) !== 'undefined' && this.precisePositioningPaginationData.length > 0) {
        queryString = queryString.replace(/(\*)|(\?)|(\$)|(\^)|(\()|(\))|(\+)|(\|)|(\\)/g, "")
        // debugger
        // 高亮替换v-html值
        let replaceReg = new RegExp(queryString, "g")
        let replaceString =`<span class="search-text">${queryString}</span>`
        v = v.toString().replace(replaceReg, replaceString)
      }
      return v
    },
    // 解决切换排名，重新聚焦，刷新查询结果问题
    // querySearchCall() {
    //   if (this.precisePositioning !== '' && typeof(this.precisePositioning) !== 'undefined') {
    //     this.$refs[`myAutoComplete${this.index}`].getData(this.precisePositioning)
    //   } else {
		//     return false
    //   }
    // },
    precisePositioningPagination(current) {
      this.precisePositioningCurrentPage = current
      this.getPrecisePositioningPaginationData()
    },
    precisePositioningSizeChange(pageSize) {
		  this.precisePositioningPageSize = pageSize
      this.getPrecisePositioningPaginationData()
    },
    getPrecisePositioningPaginationData() {
      this.precisePositioningPaginationData = this.precisePositioningResult.filter((item, index) => {
        let maxIndex = this.precisePositioningCurrentPage*this.precisePositioningPageSize
        return index < maxIndex && index >= maxIndex - this.precisePositioningPageSize
      })
    },
    precisePositioningFocus(value) {
      this.precisePositioningShow = value === 'true'
    }
    // 精准定位4连 end
  }
}
