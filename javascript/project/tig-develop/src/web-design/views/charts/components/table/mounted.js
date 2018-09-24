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
      // const chartsOption = this.chartsOption[this.index].feature.styleConfig
      // 清空排序激活状态
      // chartsOption.columnList.forEach((v, i) => {
      //   v.sortType = ''
      // })
    },
    initFreeze() {
      const chartsOption = this.chartsOption[this.index].feature.styleConfig
      if (chartsOption.freeze && chartsOption.freeze.isFreeze && this.hot) {
        this.hot.updateSettings({
          fixedColumnsLeft: Number(chartsOption.freeze.freezeCol),
          fixedRowsTop: Number(chartsOption.freeze.freezeLine),
        })
      }
    },
  },
	mounted() {
    this.moreDimList = this.dimList
    this.moreMetricList = this.metricListFlat
    // 展示的表格 因为有个隐藏列
    // 切换图表 除了编辑进来的时候
    bus.$on(`changeChartType_${this.index}`, (emitObj) => {
      this.$nextTick(() => {
        if (this.chartsOption[this.index].feature.chartId === 0) {
          if (!emitObj) {
            this.clearSettings() // 清空设置项 表格这边和其他图表不一样
          }
          if (emitObj) {
            this.syncColumnList(true) // 生成列
          } else {
            this.syncColumnList()
          }
          // 拆分的表格
          // if (emitObj && (this.isSingleSplit || this.isManySplit)) {
          //   this.splitColumnList()
          //   this.splitHansonMerge()
          //   this.saveTableHeader()
          // }
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
          this.renderColumns(this.chartWarnData) // 渲染列
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
        this.renderColumns(this.chartWarnData)
      })()
    })
    // 查询面板
    bus.$on(`updateQuery_${this.index}`, (obj) => {
      // 清除trs加粗样式
      this.clearTrsStyle()
      this.currentPage = 1
      if (obj.init) {
        this.initTableStyle()
        if (this.moreDim || this.moreMetric || this.moreDimSingle) {
          this.tableHeader()
        }
      };
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
        this.initTableStyle();
        // 更多指标 维度 单选 会还原默认选中状态
        if (this.moreDim || this.moreMetric || this.moreDimSingle) {
          this.tableHeader()
        };
        (async () => {
          const data = await this.tableSearch({})
          this.allDataRender(data)
          this.renderColumns(this.chartWarnData)
          this.tableDataRender()
          this.initFreeze()
          this.calTableScroll()
          this.calTableHeight()
        })()
      } else {
        this.loadingToggle(this.index, false)
        this.moreDimList = this.dimList
        this.moreMetricList = this.metricListFlat
        this.clearSettings() // 清空设置项 表格这边和其他图表不一样
        this.syncColumnList() // 生成列
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
		bus.$on(`rendererColumn${this.index}`, (deliver) => {
      if (this.index === deliver.index) {
        this.columnList = deliver.columnList
				this.renderColumns(this.chartWarnData)
        // 重新渲染一下 因为一些样式问题
        this.$nextTick(() => {
          this.hot && this.hot.render()
        })
      }
    })
    // 页码改变
    bus.$on(`styleChange${this.index}`, (styleOption) => {
      // 翻页时清除tr样式缓存
      if (styleOption.name === 'currentPage'
        || styleOption.name === 'row'
        || styleOption.name === 'showHeader'
        || styleOption.name === 'isPrecisePositioning'
      ) {
        this.clearTrsStyle()
      }
      // 不重置如果含合并单元格会有问题 有些情况下不用销毁表格
      if (this.hot
        && styleOption.name !== 'input'
        && styleOption.name !== 'row'
        && styleOption.name !== 'currentPage'
        && styleOption.name !== 'tableBorder'
        && styleOption.name !== 'pageSize'
        && styleOption.name !== 'showHeader'
        && styleOption.name !== 'trendAddPercent'
        && styleOption.name !== 'hideDimMetric'
        && styleOption.name !== 'isProportion'
        && styleOption.name !== 'isExport'
        && styleOption.name !== 'freeze'
        && styleOption.name !== 'isPrecisePositioning'
        && styleOption.name !== 'isRanking'
        && styleOption.name !== 'showNumber') {
        this.hot.destroy()
        this.hot = null
      }
      if (this.index === styleOption.index) {
      	// 是否显示表格头 不显示this.row = 0
      	if (styleOption.name === 'showHeader') {
      		this.showHeader = styleOption.value
      		if (this.showHeader) {
      			this.row = this.styleConfig.row
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
      	} else if (styleOption.name === 'showNumber') { // 是否显示序号
          // 如果有合并单元格需要处理一下
      		this.showNumber = styleOption.value
          this.handsonMerge = []
          if (!this.isSingleSplit && !this.isManySplit) {
            this.tableHeader()
          }
          this.renderColumns(this.chartWarnData)

					this.tableDataRender()
          //  处理单元格合并情况 col增加1
          if (this.showNumber) {
            this.handsonMerge.forEach((v, i) => {
              v.col += 1
            })
          }
          if (!this.showNumber) {
            this.handsonMerge.forEach((v, i) => {
              if (v.col !== 0) {
                v.col -= 1
              }
            })
          }
          // 处理单元格 宽度不更新的异常情况
          this.calTableScroll()
          this.calTableHeight()
          // bus.$emit(`resizeOrMove_${this.index}`)
      	} else if (styleOption.name === 'row') { // 表头几行
          // 详情配置项清除
          this.handsonMerge = []
          this.header = []
      		this.row = styleOption.value
          // 行数改变 冻结清除 如果有拆分的表格
          if (this.hot && this.freeze.isFreeze) {
            this.hot.destroy()
            this.hot = null
            this.freeze = {
              isFreeze: false,
              freezeLine: 0,
              freezeCol: 0
            }
            bus.$emit(`disabledFreeze`, {
              index: this.index,
              value: {
                isFreeze: false,
                freezeLine: 0,
                freezeCol: 0
              }
            })
          }
          // 表头变了默认到第一页？
          // this.currentPage = 1
      		this.tableHeader()
					this.tableDataRender()
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
      		// this.renderData = true
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
            })()
          } else {
            this.tableDataRender()
          }
      	} else if (styleOption.name === 'jumpDeatil') { // 跳详情
          // 详情配置项清除
          this.handsonMerge = []
      		this.jumpDeatil = styleOption.value
          this.tableHeader()
					this.tableDataRender()
					this.renderColumns(this.chartWarnData)
          this.calTableScroll()
          this.calTableHeight()
      	} else if(styleOption.name === 'input') {
      		this.inputNumber = styleOption['input']['inputNumber']
          this.isInputNumber = styleOption['input']['isInputNumber']
					this.renderColumns(this.chartWarnData)
      	} else if (styleOption.name === 'moreDim') {
          this.currentPage = 1
          this.moreDim = styleOption.value['moreDim']
          this.moreDimListSelect = []
          // 清空下钻路径
          this.modelRoute = ''
          this.moreDimListFilter = []
          let dimFilter = [] // moredim
          if (this.moreDim) {
            styleOption.value['dimSelected'].forEach(item => {
              this.dimList.forEach(v => {
                let dim = {}
                if (v.dimCode === item) {
                  dim.dimCode = item
                  dim.dimName = v.dimName
                  dim.dimType = v.dimType
                  dimFilter.push(dim)
                }
              })
            })
            this.moreDimList = dimFilter
          } else {
            this.moreDimList = this.dimList
            this.moreDimSingle = false
          }
          this.moreDimListSelect = styleOption.value['dimSelected']

          this.$store.commit('saveConfig',  {
            index: this.index,
            name: 'moreDimListSelect',
            moreDimListSelect: this.moreDimListSelect
          })
          this.$store.commit('saveConfig',  {
            index: this.index,
            name: 'moreDimList',
            moreDimList: this.moreDimList
          });

          (async () => {
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
            // const data = await this.tableSearch(upsetting)
            // this.syncColumnList() // 生成列
            // if (this.showTotal) {
            //   await this.addAllNumber() // 计算合计值
            // }
            this.renderColumns(this.chartWarnData) // 渲染列
            // this.allDataRender(data) // 生成真实数据
            this.tableDataRender() // 拼接数据
            // 当更多维度是否勾选的时候重新计算表格高度
            this.calTableScroll()
            this.calTableHeight()
          })()
        } else if (styleOption.name === 'tableBorder') {
          this.tableBorder = styleOption.value
          // 保存border
          this.$store.commit('saveConfig',  {
            index: this.index,
            name: 'tableBorder',
            tableBorder: styleOption.value
          })
          this.renderColumns(this.chartWarnData)
        } else if (styleOption.name === 'showPicture') {
          this.showPicture = styleOption.value
          if (styleOption.value) {
            let tmpData = this.tableData.slice(this.row)
            let queryStr = '',colPicture={}
            tmpData.map((item)=>{
               queryStr += item['PM_WD_0002'].split('###')[0].padStart(10,'0')+'-'+item['PD_WD_0005'].split('###')[0].padStart(18,'0')+'-0-1,'
            })
            queryStr = 'http://pcpsimage.suning.cn/mainpicture/mpBatchCallback/batchGetByLocation/' + queryStr.substr(0,queryStr.length-1) + '.jsonp'
            this.$jsonp(queryStr , {callbackName:"mpBatchCallback"}).then( resp => {
              let startIndex = this.row,endIndex = this.tableData.length
              for(let i = startIndex;i<endIndex;i++){
                this.tableData[i].productInfo = resp[i-startIndex]
              }
              this.renderColumns(this.chartWarnData)
              this.calTableScroll()
              this.calTableHeight()
            })
          } else {
            this.renderColumns(this.chartWarnData)
            this.calTableScroll()
            this.calTableHeight()
          }

        } else if (styleOption.name === 'moreDimSingle') {
          this.currentPage = 1
          // 初始化
          this.dimListRadio = []
          if (styleOption.value) {
            this.moreDim = false
            this.moreDimSingle = true
            this.moreDimSingleSelect = ''
            const dimSelected = this.chartsOption[this.index].feature.styleConfig.dimSelected
            let dimFirst = []
            this.dimList.forEach((v, i) => {
              dimSelected.forEach(item => {
                if (v.dimCode === item) {
                  this.dimListRadio.push({
                    dimCode: v.dimCode,
                    dimName: v.dimName,
                    dimType: v.dimType
                  })
                }
              })
            })
            dimFirst.push(this.dimListRadio[0])
            this.moreDimList = dimFirst
            this.moreDimSingleSelect = dimFirst[0].dimName
            this.moreDimSingleCode = dimFirst[0].dimCode
            this.$store.commit('saveConfig',  {
              index: this.index,
              name: 'moreDimSingleSelect',
              moreDimSingleSelect: dimFirst[0].dimName,
            })
          } else {
            this.moreDim = true
            this.moreDimSingle = false
            const sortMoreDimList = []
            this.moreDimList = []
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
            this.moreDimList = sortMoreDimList
          }

          this.$store.commit('saveConfig',  {
            index: this.index,
            name: 'moreDim',
            moreDim: this.moreDim
          })
          this.$store.commit('saveConfig',  {
            index: this.index,
            name: 'moreDimList',
            moreDimList: this.moreDimList,
          });
          // upsetting.dimList = dimList;
          (async () => {
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
            // const data = await this.tableSearch(upsetting)
            // this.syncColumnList() // 生成列
            // if (this.showTotal) {
            //   await this.addAllNumber() // 计算合计值
            // }
            this.renderColumns(this.chartWarnData) // 渲染列
            // this.allDataRender(data) // 生成真实数据
            this.tableDataRender() // 拼接数据
            // 当更多维度是否勾选的时候重新计算表格高度
            this.calTableScroll()
            this.calTableHeight()
          })()
        } else if (styleOption.name === 'moreMetric') {
          this.currentPage = 1
          this.moreMetric = styleOption.value['moreMetric']
          this.moreMetricListSelect = []
          let metricFilter = [] // moredim
          if (this.moreMetric) {
            styleOption.value['moreMetricSelect'].forEach(item => {
              this.metricListFlat.forEach(v => {
                let metric = {}
                if (v.metricCode === item) {
                  metric.metricCode = item
                  metric.metricName = v.metricName
                  metricFilter.push(metric)
                }
              })
            })
            this.moreMetricList = metricFilter
          } else {
            this.moreMetricList = this.metricListFlat
          }
          this.moreMetricListSelect = styleOption.value['moreMetricSelect']

          this.$store.commit('saveConfig',  {
            index: this.index,
            name: 'moreMetricListSelect',
            moreMetricListSelect: this.moreMetricListSelect
          })
          // 存更多指标
          this.$store.commit('saveConfig',  {
            index: this.index,
            name: 'moreMetricList',
            moreMetricList: this.moreMetricList
          });

          (async () => {
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
            // const data = await this.tableSearch(upsetting)
            // this.syncColumnList() // 生成列
            // if (this.showTotal) {
            //   await this.addAllNumber() // 计算合计值
            // }
            this.renderColumns(this.chartWarnData) // 渲染列
            // this.allDataRender(data) // 生成真实数据
            this.tableDataRender() // 拼接数据
            // 当更多维度是否勾选的时候重新计算表格高度
            this.calTableScroll()
            this.calTableHeight()
          })()
        } else if (styleOption.name === 'totalStore') {
          this.totalStore = styleOption.value
          this.tableDataRender()
        } else if (styleOption.name === 'hideDimMetric') {
          this.hideDimMetric = styleOption.value;
          this.handsonMerge = [];
          (async () => {
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
            // const data = await this.tableSearch({})
            // if (this.showTotal) {
            //   await this.addAllNumber() // 计算合计值
            // }
            this.renderColumns(this.chartWarnData) // 渲染列
            // this.allDataRender(data) // 生成真实数据
            this.tableDataRender() // 拼接数据
            // 当更多维度是否勾选的时候重新计算表格高度
            this.calTableScroll()
            this.calTableHeight()
          })()
        } else if (styleOption.name === 'isProportion') {
          this.isProportion = styleOption.value;
          (async () => {
            const data = await this.tableSearch({})
            this.tableHeader()
            this.allDataRender(data) // 生成真实数据
            this.tableDataRender()
            if (this.isSingleSplit || this.isManySplit) {
              this.splitHansonMerge()
              this.saveTableHeader()
            }
            this.renderColumns(this.chartWarnData)
          })()
        } else if (styleOption.name === 'freeze') {
          const freezeCol = Number(styleOption.value.freezeCol)
          const freezeLine = Number(styleOption.value.freezeLine)
          this.freeze = styleOption.value
          if (styleOption.value.isFreeze) {
            const flagCol = this.handsonMerge.some((v) => {
              const sumCol = v.col + v.colspan
              return freezeCol < sumCol && freezeCol > v.col
            })
            const flagLine = this.handsonMerge.some((v) => {
              const sumRow = v.row + v.rowspan
              return freezeLine < sumRow && freezeLine > v.row
            })
            // 列
            if (flagCol) {
              this.$message({
                message: `由于合并单元格的限制，您不能固定自定义表格前${freezeCol}列`,
                type: 'error'
              })
              bus.$emit(`disabledFreeze`, {
                index: this.index,
                value: {
                  isFreeze: styleOption.value.isFreeze,
                  freezeLine: freezeLine,
                  freezeCol: 0
                }
              })
              this.hot.updateSettings({
                fixedColumnsLeft: 0
              })
              this.freeze.freezeCol = 0
              return
            }
            // 行
            if (flagLine) {
              this.$message({
                message: `由于合并单元格的限制，您不能固定自定义表格前${freezeLine}行`,
                type: 'error'
              })
              this.hot.updateSettings({
                fixedRowsTop: 0
              })
              bus.$emit(`disabledFreeze`, {
                index: this.index,
                value: {
                  isFreeze: styleOption.value.isFreeze,
                  freezeLine: 0,
                  freezeCol: freezeCol
                }
              })
              this.freeze.freezeLine = 0
              return
            }
            if (this.hot) {
              this.hot.destroy()
              this.hot = null
            }
            this.syncTable()
            if (this.hot) {
              this.hot.updateSettings({
                fixedColumnsLeft: freezeCol,
                fixedRowsTop: freezeLine,
              })
            }
          } else {
            if (this.hot) {
              this.hot.destroy()
              this.hot = null
            }
            this.syncTable()
            if (this.hot) {
              this.hot.updateSettings({
                fixedColumnsLeft: 0,
                fixedRowsTop: 0,
              })
            }
          }
        } else if (styleOption.name === 'trendAddPercent') {
          this.trendAddPercent = styleOption.value
        } else if (styleOption.name === 'isPrecisePositioning') {
      	  this.isPrecisePositioning = styleOption.value
          this.calTableHeight()
        } else if (styleOption.name === 'isRanking') { //排名
          this.isRanking = styleOption.value
          this.tableHeader()
          this.allDataRender(this.allData)
          this.tableDataRender()
          this.renderColumns(this.chartWarnData)
        }
        // 增减列会改变列宽 需要重新render一下
        this.$nextTick(() => {
          this.hot && this.hot.render()
        })
      }
    })
    // 新增列显示条形图
		bus.$on(`addColumnBar${this.index}`, (deliver) => {
      if (this.index === deliver.index) {
				this.addBarColumnList()
      }
    })
    // 删除列显示条形图
		bus.$on(`delColumnBar${this.index}`, (deliver) => {
      if (this.index === deliver.index) {
				this.delBarColumnList()
      }
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
		bus.$off(`rendererColumn${this.index}`)
		bus.$off(`styleChange${this.index}`)
		bus.$off(`addColumnBar${this.index}`)
		bus.$off(`delColumnBar${this.index}`)
    bus.$off(`resizeOrMove_${this.index}`)
    bus.$off(`changeChartType_${this.index}`)
    bus.$off(`warnUpdate_${this.index}`)
    if (this.hot) {
      this.hot.destroy()
      this.hot = null
    }
	},
}
