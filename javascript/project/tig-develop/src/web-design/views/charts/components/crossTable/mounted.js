import bus from '../../utils/eventBus'
// import { disabledFreeze } from './utils'
import Vue from 'vue'
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
export default {
  methods: {
    initTableStyle() {
      this.initStyle()
      if (this.moreMetricList.length === 0) {
        return
      }
      const chartsOption = this.chartsOption[this.index].feature.styleConfig
      // 清空排序激活状态
      chartsOption.columnList.forEach((v, i) => {
        v.sortType = ''
      })

      // if (this.hoverMetricSelect && this.hoverMetricSelect !== '') {
      //   this.hoverBar = this.metricList.filter(v => !v.selected)
      // }

      if (this.isSplit) {
        if (this.row === 1) {
          this.row = 2
        }
        const dimListValueSelectLable = []
        chartsOption.dimValueListSplit.forEach((v) => {
          dimListValueSelectLable.push({
            value: v.dimValueId,
            label: v.dimValue
          })
        })
        this.splitMetricList = chartsOption.splitMetricList
        this.dimListValueSelectLable = dimListValueSelectLable
        this.dimValueListSplit = chartsOption.dimValueListSplit;
      }
      // if (chartsOption.handsonMerge) {
      //   this.handsonMerge = chartsOption.handsonMerge
      // } else {
      //   this.handsonMerge = []
      // }      
    }
  },
	mounted() {
    this.moreDimList = this.dimList
    this.moreMetricList = this.metricListFlat
    // 展示的表格 因为有个隐藏列
    // 切换图表 除了编辑进来的时候
    bus.$on(`changeChartType_${this.index}`, (emitObj) => {
      this.$nextTick(() => {
        // console.log(this.columnList)
        if (this.chartsOption[this.index].feature.chartId === 15) {
          // debugger
          if (!emitObj) {
            this.clearSettings() // 清空设置项 表格这边和其他图表不一样
          }
          if (emitObj) {
            this.syncColumnList(true) // 生成列
          } else {
            this.syncColumnList()
          }
          // 拆分的表格
          if (emitObj && (this.isSplit)) {
            this.splitColumnList()
            this.splitHansonMerge()
            this.saveTableHeader()
          }
          this.tableHeader(true) // 生成表头数据
          if (!emitObj) {
            this.allDataRender() // 生成真实数据
          } else {
            this.allDataRender(this.allData) // 生成真实数据
          }
          this.tableDataRender() // 拼接数据
          this.renderColumns(this.chartWarnData) // 渲染列
          this.calTableScroll()
          this.calTableHeight()
          // bus.$emit(`resizeOrMove_${this.index}`)
        }        
      })
    })
		// 图表与图表联动
    bus.$on(`updateLink_${this.index}`, (emitObj) => {
      this.currentPage = 1;
      (async () => {
        let upsetting = {        
        }
        this.linkInfo = emitObj.linkInfo
        this.isQueryInfo = 'linkInfo'
        const res = await this.tableSearch(upsetting)
        if (this.showTotal) {
          await this.addAllNumber()
        }

        this.allDataRender(res) // 生成真实数据
        this.tableDataRender() // 拼接数据
        this.renderColumns(this.chartWarnData)
      })()
    })
    // 查询面板
    bus.$on(`updateQuery_${this.index}`, (obj) => {
      this.currentPage = 1
      if (obj.init) {
        this.initTableStyle()
      }
      (async () => {
        let upsetting = {}
        this.queryInfo = obj
        this.isQueryInfo = 'queryInfo'
        const res = await this.tableSearch(upsetting)
        if (this.showTotal) {
          await this.addAllNumber()
        }
        this.allDataRender(res) // 生成真实数据
        this.tableDataRender() // 拼接数据
        this.renderColumns(this.chartWarnData)
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
        // this.loadingToggle(this.index, false)
        this.initTableStyle()
        if (this.isSplit) {
          (async () => {
            const data = await this.tableSearch({})
            this.allDataRender(data) // 生成真实数据
            this.tableDataRender()
            this.renderColumns(this.chartWarnData)
            this.calTableScroll()
            this.calTableHeight()
          })()
        } else {
          (async () => {
            const data = await this.tableSearch({})
            this.allDataRender(data)
            this.renderColumns(this.chartWarnData) 
            this.tableDataRender()
            this.calTableScroll()
            this.calTableHeight()
          })()         
        }
      } else {
        this.loadingToggle(this.index, false)
        this.moreDimList = this.dimList
        this.moreMetricList = this.metricListFlat
        // this.syncTable()
        this.clearSettings() // 清空设置项 表格这边和其他图表不一样
        this.syncColumnList() // 生成列
        this.tableHeader(); // 生成表头数据
        // this.allDataRender()
        // this.renderColumns(this.chartWarnData) 
        // this.tableDataRender()
        (async () => {
          const data = await this.tableSearch({})
          this.allDataRender(data)
          this.renderColumns(this.chartWarnData) 
          this.tableDataRender()
        })()
      }     
    })
		// 列的属性改变 重新渲染表格
		bus.$on(`crossRendererColumn${this.index}`, (deliver) => {
      if (this.index === deliver.index) {
        this.columnList = deliver.columnList
				this.renderColumns(this.chartWarnData)
      }
    })
    // 页码改变
    bus.$on(`crossStyleChange${this.index}`, (styleOption) => {
      // 不重置如果含合并单元格会有问题 有些情况下不用销毁表格
      if (this.hot
        && styleOption.name !== 'row'
        && styleOption.name !== 'currentPage'
        && styleOption.name !== 'tableBorder'
        && styleOption.name !== 'pageSize'
        && styleOption.name !== 'showHeader'
        && styleOption.name !== 'isExport'
        && styleOption.name !== 'showGrowth') {
        this.hot.destroy()
        this.hot = null
      }
      if (this.index === styleOption.index) {
      	// 是否显示表格头 不显示this.row = 0
      	if (styleOption.name === 'showHeader') {
      		this.showHeader = styleOption.value
      		if (this.showHeader) {
      			this.row = styleOption.row
      		} else {
      			this.row = 0
      		}
      		this.tableHeader()
					this.tableDataRender()
          if (this.showHeader) {
            if (this.hot) {
              this.hot.updateSettings({
                mergeCells: this.handsonMerge
              })
            }           
          } else {
            if (this.hot) {
              this.hot.updateSettings({
                mergeCells: []
              })
            }           
          }
          // if (this.isSingleSplit && this.showHeader) {
          //   this.splitHansonMerge()
          //   this.saveTableHeader()
          // }
      	} else if (styleOption.name === 'row') { // 表头几行
          // 详情配置项清除
          this.handsonMerge = []
          // 拆分之后表头为2
          this.header = []
      		this.row = styleOption.value
          // 表头变了默认到第一页？
          // this.currentPage = 1
      		this.tableHeader()
					this.tableDataRender()
          // if (this.isSingleSplit || this.isManySplit) {
          //   this.splitHansonMerge()
          //   this.saveTableHeader()
          // }
          // console.log(this.header)
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
          this.tableHeader()
          if (styleOption.value) {
            (async () => {
              await this.addAllNumber()
              if (!this.showTotal) {
                return
              }
              this.tableDataRender()
              // this.renderColumns(this.chartWarnData)
            })()
          } else {
            // this.showTotal = styleOption.value
            this.tableDataRender()
            // this.renderColumns(this.chartWarnData)
          }
      	} else if (styleOption.name === 'totalStore') {
          this.totalStore = styleOption.value
          this.tableDataRender()
        } else if (styleOption.name === 'showGrowth') {
          this.showGrowth = styleOption.value
        } else if (styleOption.name === 'trendAddPercent') {
          this.trendAddPercent = styleOption.value
          this.$nextTick(()=>{
            this.hot.render()
          })
        }
      }
    })

    // 指标拆分
    bus.$on(`split${this.index}`,(obj) => {
      this.$store.commit('crossSaveConfig',  {
        index: this.index,
        name: 'splitInfo',
        splitInfo: obj
      })
      this.dimValueSure()
    })
    // 拖拽监听
    bus.$on(`resizeOrMove_${this.index}`, (deliver) => {
      // 销毁表格 不然冻结resize会有些问题
      if (this.hot) {
        this.syncTable()
      }
      this.calTableScroll()
      if (this.previewToggle && !this.chartNameToggle) {
        this.calTableHeight(false)
      } else if (this.$route.path === '/visual' && !this.chartNameToggle) {
        this.calTableHeight(false)
      } else {
        this.calTableHeight()
      }
    })
    // 监听告警
    bus.$on(`warnUpdate_${this.index}`, obj => {
      this.renderColumns(obj)
    })
    // 通知查询面板准备完毕
    this.$store.commit('chartsReady', {
      index: this.index
    })
	},
  beforeDestroy() {
		bus.$off(`updateData_${this.index}`)
    bus.$off(`updateQuery_${this.index}`)
		bus.$off(`updateLink_${this.index}`)
		bus.$off(`crossRendererColumn${this.index}`)
		bus.$off(`crossStyleChange${this.index}`)			
    bus.$off(`resizeOrMove_${this.index}`)
    bus.$off(`changeChartType_${this.index}`)
    bus.$off(`warnUpdate_${this.index}`)
    bus.$off(`split${this.index}`)
    if (this.hot) {
      this.hot.destroy()
      this.hot = null
    }	
	},
}