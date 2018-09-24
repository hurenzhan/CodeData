import bus from '../../utils/eventBus'
import { topListTemp } from './static'

export default {
  methods: {
    initTableStyle() {
      this.initStyle()
      // const chartsOption = this.chartsOption[this.index].feature.styleConfig
      // 清空排序激活状态
      // chartsOption.columnList.forEach((v, i) => {
      //   v.sortType = ''
      // })
      // if (chartsOption.hansonMerage) {
      //   this.handsonMerge = chartsOption.hansonMerage
      // } else {
      //   this.handsonMerge = []
      // }
      // 表格列宽   
    }
  },
	mounted() {
    // 展示的表格 因为有个隐藏列
    // 切换图表 除了编辑进来的时候
    bus.$on(`changeChartType_${this.index}`, (emitObj) => {
      this.$nextTick(() => {
        if (this.chartsOption[this.index].feature.chartId === 13) {
          if (!emitObj) {
            // this.clearSettings() // 清空设置项 表格这边和其他图表不一样
          }
          if (emitObj) {
            this.syncUpdateColumnList(true) // 生成列
          } else {
            this.syncUpdateColumnList()
          }
          this.tableHeader(true) // 生成表头数据
          if (!emitObj) {
            this.allDataRender() // 生成真实数据
          } else {
            this.allDataRender(this.allData) // 生成真实数据
          }
          // (async () => {
          //   const data = await this.tableSearch({})
          //   this.allDataRender(data)
          //   this.renderColumns(this.chartWarnData)
          //   this.tableDataRender()
          //   this.calTableScroll()
          //   this.calTableHeight()
          // })()
          this.tableDataRender() // 拼接数据
          this.renderColumns() // 渲染列
          this.calTableScroll()
          this.calTableHeight()
        }        
      })
    })
		// 图表与图表联动
    bus.$on(`updateLink_${this.index}`, (emitObj) => {
      this.currentPage = 1;
      (async () => {
        this.linkInfo = emitObj.linkInfo
        this.isQueryInfo = 'linkInfo'
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
        this.renderColumns()
      })()
    })
    // 查询面板
    bus.$on(`updateQuery_${this.index}`, (obj) => {
      this.selectedTopValue = ''
      this.currentPage = 1
      if (obj.init) {
        this.initTableStyle()
      }    
      (async () => {
        this.queryInfo = obj
        this.isQueryInfo = 'queryInfo'
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
        this.renderColumns()
      })()
    })
		// 更新代码事件
		bus.$on(`updateData_${this.index}`, (deliver) => {
      // 对表格进行销毁 不然拆分之后重新更新会有问题
      const chartsOption = this.chartsOption[this.index].feature.styleConfig
      if (this.hot) {
        this.hot.destroy()
        this.hot = null
      }
      // 初始化过来的状态
      if (deliver.init) {
        this.initTableStyle();
        (async () => {
          const data = await this.tableSearch({})
          this.allDataRender(data)
          this.renderColumns(this.chartWarnData) 
          this.tableDataRender() 
          this.calTableScroll()
          this.calTableHeight()
        })()         
      } else {
        this.loadingToggle(this.index, false)
        this.clearSettings() // 清空设置项 表格这边和其他图表不一样
        this.syncUpdateColumnList(); // 生成列
        this.tableHeader(); // 生成表头数据
        (async () => {
          const data = await this.tableSearch({})
          this.$store.commit("syncThoundsData", {
            index: this.index,
            data
          });
          this.allDataRender(data)
          this.renderColumns(this.chartWarnData)
          this.tableDataRender()
        })()
      }
    })
		// 列的属性改变 重新渲染表格
		bus.$on(`simpleRendererColumn${this.index}`, (deliver) => {
      if (this.index === deliver.index) {
        this.columnList = deliver.columnList
				this.renderColumns()
      }
    })
    // 页码改变
    bus.$on(`simpleStyleChange${this.index}`, (styleOption) => {
      // 不重置如果含合并单元格会有问题 有些情况下不用销毁表格
      // if (this.hot
      //   && styleOption.name !== 'input'
      //   && styleOption.name !== 'row'
      //   && styleOption.name !== 'currentPage'
      //   && styleOption.name !== 'tableBorder'
      //   && styleOption.name !== 'setColWidth'
      //   && styleOption.name !== 'isProportion'
      //   && styleOption.name !== 'isShowTop'
      //   && styleOption.name !== 'trendAddPercent'
      //   && styleOption.name !== 'isExport') {
      //   // this.hot.destroy()
      //   // this.hot = null
      // }
      if (this.index === styleOption.index) {
      	// 是否显示TOP 不显示this.row = 0
        if (styleOption.name === 'isShowTop') { // 是否显示TOP
          this.isShowTop = styleOption.value;
          this.currentPage = 1
          if (this.isShowTop) {
            this.calTableHeight()
          }

          if (!this.isShowTop) {
            if(this.selectedTopValue !== ''){
              (async () => {
                const data = await this.tableSearch({})
                this.allDataRender(data)
                this.renderColumns(this.chartWarnData) 
                this.tableDataRender()
                this.calTableHeight()
              })()
            }
          }
      	} else if (styleOption.name === 'currentPage') { // 当前页改变
      		this.currentPage = styleOption.value
					this.tableDataRender()
      	} else if (styleOption.name === 'pageSize') { // pageSize改变
          // 还有种情况不分页
          if (styleOption.value === 0) {
            this.pageSize = this.total
            this.isPage = false
          } else {
            this.pageSize = styleOption.value
            this.isPage = true
          }
      		this.renderData = true
          this.currentPage = 1
      		this.tableDataRender()
      	} else if (styleOption.name === 'showTotal') { // 是否显示合计
          this.showTotal = styleOption.value
          if (styleOption.value) {
            (async () => {
              await this.addAllNumber()
              if (!this.showTotal) {
                return
              }
              this.tableDataRender()
            })()
          } else {
            this.tableDataRender()
          }
      	} else if (styleOption.name === 'jumpDeatil') { // 跳详情
      		this.jumpDeatil = styleOption.value
          this.tableHeader()
					this.tableDataRender()
					this.renderColumns()
          this.calTableScroll()
          this.calTableHeight()
      	} else if (styleOption.name === 'tableBorder') {
          this.tableBorder = styleOption.value
          // 保存border
          this.$store.commit('simpleSaveConfig',  {
            index: this.index,
            name: 'tableBorder',
            tableBorder: styleOption.value
          })
          this.renderColumns(this.chartWarnData)
        } else if (styleOption.name === 'totalStore') {
          this.totalStore = styleOption.value
          this.tableDataRender()
        // } else if (styleOption.name === 'selectedTopList') {
        //   this.selectedTopList = styleOption.value.sort((a,b)=>{return a-b})
        } else if (styleOption.name === 'selectedTopList') {
          this.selectedTopValue = ''
          const topList = []
          topListTemp.forEach(v => {
            styleOption.value.forEach(item => {
              if (v.value === item) {
                topList.push(v)
              }
            })
          })
          this.topList = topList
        } else if (styleOption.name === 'trendAddPercent') {
          this.trendAddPercent = styleOption.value
          this.$nextTick(()=>{
            this.hot.render()
          }) 
        } else if (styleOption.name === 'isRanking') {
          // console.log(styleOption.value)
          this.isRanking = styleOption.value
          this.tableHeader()
          this.allDataRender(this.allData)
          this.tableDataRender()
          this.renderColumns() 
        }
      }
    })
    // 新增列显示条形图
		bus.$on(`simpleAddColumnBar${this.index}`, (deliver) => {
      if (this.index === deliver.index) {
				this.addBarColumnList()
      }
    })
    // 删除列显示条形图
		bus.$on(`simpleDelColumnBar${this.index}`, (deliver) => {
      if (this.index === deliver.index) {
				this.delBarColumnList()
      }
    })
    // 拖拽监听
    bus.$on(`resizeOrMove_${this.index}`, (deliver) => {
      // 销毁表格 不然冻结resize会有些问题
      if (!this.setColWidth) {
        if (this.hot && !this.setColWidth) {
          this.syncTable()
        }
      }
      if (this.previewToggle && !this.chartNameToggle) {
        this.calTableHeight(false)
      } else if (this.$route.path === '/visual' && !this.chartNameToggle) {
        this.calTableHeight(false)
      } else {
        this.calTableHeight()
      }
      this.$nextTick(() => {
        this.hot && this.hot.render()
      })
    })
    // 监听告警
    // bus.$on(`warnUpdate_${this.index}`, obj => {
    //   this.renderColumns(obj)
    // })
    // 通知查询面板准备完毕
    this.$store.commit('chartsReady', {
      index: this.index
    })
	},
  beforeDestroy() {
		bus.$off(`updateData_${this.index}`)
    bus.$off(`updateQuery_${this.index}`)
		bus.$off(`updateLink_${this.index}`)
		bus.$off(`simpleRendererColumn${this.index}`)
		bus.$off(`simpleStyleChange${this.index}`)			
		bus.$off(`simpleAddColumnBar${this.index}`)
		bus.$off(`simpleDelColumnBar${this.index}`)
    bus.$off(`resizeOrMove_${this.index}`)
    bus.$off(`changeChartType_${this.index}`)
    // bus.$off(`warnUpdate_${this.index}`)
    if (this.hot) {
      this.hot.destroy()
      this.hot = null
    }
    // console.log('aa') 	
	},
}