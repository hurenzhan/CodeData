import { rateTypeByMetricCode } from '../../utils/utils'
import Vue from 'vue'
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
const fixNumber = 2 // 精确到两位小数
export default {
  methods: {
    // 所有的指标列
    syncColumnList(isRename) {
      if (!isRename) {
        this.columnList = []
      }
      // 序号列
      // if (!isRename) {
      //   this.columnList.push({
      //     id: 'number',
      //     name: '序号'
      //   })
      // }
      // push维度列 维度在指标前面
      if (!isRename) {
        this.moreDimList.forEach((v, i) => {
          // 维度别名的应用
          const dimAlias = this.getAliasByDimCode(v.dimCode)
          this.columnList.push({
            id: v.dimCode,
            numberOrbar: 'number', // 条形还是数值
            name: dimAlias === false ? v.dimName : dimAlias,
            superUrl: false, // 是否启用超链接
            colColor: '', // 列颜色
            fontColor: '', // 字体颜色
            trend: false, // 趋势标记
            sort: false, // 是否排序
            // hover: false, // 悬浮
            // hoverType: 0, // 悬浮表格
            // dill: false, // 下钻与否 不可逆
            showGrowth: false, //增长率趋势
            type: 0, // 维度类型
            sortType: '', // 排序类型 up升序 down降序 ''不排序
            dimType: v.dimType, // 维度类型 为图片列做准备
            alignFlag: 'left', // 对齐方式
            howDimValueShow: 'dim' // 维值显示方式
          })
        })
      }
      if (isRename) {
        // 维度重命名
        this.moreDimList.forEach(v => {
          this.columnList.forEach(item => {
            if (v.dimCode === item.id) {
              // 维度别名的应用
              const dimAlias = this.getAliasByDimCode(item.id)
              item.name = dimAlias === false ? v.dimName : dimAlias
            }
          })
        })
      }
      // push指标列
      if (!isRename) {
        this.moreMetricList.forEach((v, i) => {
          this.columnList.push({
            id: v.metricCode,
            numberOrbar: 'number', // 条形还是数值
            name: v.metricName,
            superUrl: false, // 是否启用超链接
            colColor: '', // 列颜色
            fontColor: '', // 字体颜色
            trend: false, // 趋势标记
            sort: false, // 是否排序
            // hover: false, // 悬浮
            // hoverType: 0,
            // dill: false, // 下钻与否 不可逆
            showGrowth: false, //增长率趋势
            type: 1, // 指标类型
            sortType: '', // 排序类型 0升序 1降序 ''不排序
            decimals: 2, // 数值格式 默认为2
            percentType: 0, // 百分比 0数值,1百分比
            thousands: true, // 千分位
            alignFlag: 'right',
          })
        })
      }

      if (isRename) {
        this.metricListFlat.forEach(v => {
          this.columnList.forEach(item => {
            if (v.metricCode === item.id) {
              item.name = v.metricName
            }
          })
        })
      }
      // 操作列
      // if (!isRename) {
      //   this.columnList.push({
      //     id: 'operate',
      //     name: '操作'
      //   })
      // }
      // 将
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })
    },
    // 当前要展示的数据 下钻数据不计算到条数中 所以这边需要处理一下
    tableDataRender() {
      // 清空当前展示数据 
      this.tableData = []
      const currentData = []
      // let startIndex = 0 // 起始位置
      // let endIndex = 0 // 结束位置
      let realSumEnd = -1
      let realSum = -1
      // let lastDill = false // 如果最后一行下还有下钻数据
      let endSize = 0 // 如果最后一页需要减去1
      let isend = false
      if (this.isPage) {
        isend = Number(this.total) <= Number(this.currentPage * this.pageSize)? true: false
        if (isend){
          endSize = Number(this.total) - 1
        } else {
          endSize = Number(this.currentPage * this.pageSize)
        }
      } else {
        this.pageSize = this.total
      }
      
      // 分页和不分页的情况
      if (this.isPage) {
        for (let i = 0; i < this.allData.length; i += 1) {
          // 是不是下钻数据
          let dill = false
          Object.keys(this.allData[i]).forEach((item) => {
            if (this.allData[i][item] && Number(this.allData[i][item].toString().indexOf('&dilldata')) !== -1) {            
              dill = true
            }
          })
          if (!dill) {
            realSum += 1
          }
          // 查出数据中不包括下钻数据的开始位置
          if (realSum === Number((this.currentPage - 1) * this.pageSize)) {
            // startIndex = i
            this.startIndex = i
            break
          }
        }
        // 查出数据中不包括下钻数据的结束位置 有一点不同 最后一行可能有下钻数据 需要处理
        if (!isend) {
          for (let i = 0; i < this.allData.length; i += 1) {
            let dill = false
            Object.keys(this.allData[i]).forEach((item) => {
              if (this.allData[i][item] && Number(this.allData[i][item].toString().indexOf('&dilldata')) !== -1) {            
                dill = true
              }
            })
            if (!dill) {
              realSumEnd += 1      
            }
            // debugger
            // 最后一行没有下钻数据 分情况是不是最后一页
            if (realSumEnd === endSize) {
              // debugger
              // endIndex = i
              this.endIndex = i
              break              
            }
            // 最后一行有下钻数据 这边好像是多余的逻辑 但是不敢删掉
            // if (lastDill && !dill && !isend) {
            //   endIndex = i
            //   this.endIndex = endIndex
            //   break
            // }
            // // 最后一页的最后一条有下钻数据
            // if (lastDill && !dill && isend) {
            //   endIndex = this.allData.length - 1
            //   this.endIndex = endIndex
            //   break
            // }
          }
        }
      }
      // console.log(endIndex)
      if (isend) {
        // endIndex = this.allData.length
        this.endIndex = this.allData.length
      }
      // 不分页的情况
      if (!this.isPage) {
        // startIndex = 0
        this.startIndex = 0
        // endIndex = this.allData.length
        this.endIndex = this.allData.length
      }

      const currentRealData = this.allData.slice(this.startIndex, this.endIndex)
      //表头
      if (this.showHeader) {
        this.header.forEach((v) => {
          currentData.push(v)
        })
      }
      currentRealData.forEach((v) => {
        currentData.push(v)
      })
      this.tableData = currentData
      if (this.hot) {
        this.hot.updateSettings({
          data: this.tableData
        })
      } else {
        this.syncTable()
      }

      this.calTableScroll()
      this.calTableHeight()
      this.$nextTick(() => {
        this.hot.render()
      })
    },

    tableHeader(isReanme) {
      if (!this.showHeader) {
        this.header = []
        this.row = 0
        return
      }
      // 重命名表格头
      if (this.isSplit || isReanme) {
        this.header = []
      }
      const tmpheader = [] // 表头数据
      // 表头数据
      if (this.showHeader) {
        for (let i = 0; i < this.row; i += 1) {
          let obj = {}
          this.showColumn.forEach((v, j) => {
            if (i !== (this.row - 1)) {
              obj[v.id] = ''
            } else {
              obj[v.id] = v.name.replace(/###/,'_')
            }
            if (this.header.length !==0 && this.header[i] && this.header[i][v.id]) {
              obj[v.id] = this.header[i][v.id].replace(/###/,'_')
            }  
          })
          tmpheader.push(obj)
        }
      }
      this.header = tmpheader
      // 保存表格头
      this.$store.commit('crossSaveConfig',  {
        index: this.index,
        name: 'header',
        header: this.header
      })
    },
    // 所有数据
    allDataRender(data) {
      if (data) {
        data = data
      } else {
        data = this.chartsOption[this.index].thoundsData
      }
      this.toggleNoData(data.length)
      // 不分页情况
      if (this.pageSize === 0) {
        this.pageSize = data.length
      }
      this.allData = []
      const tmptable = [] // 真实数据
      this.total = data.length
      // 数据
      for (let i = 0; i < data.length; i += 1) {
        const lastLine = {}
        this.columnList.forEach((v, index) => {
          if (v.id === 'number') {
            lastLine[v.id] = i + 1
          } else if (v.id === 'operate') {
            // if (this.jumpDeatil) {
            //   lastLine[v.id] = ''
            // }
          } else {
            // debugger
            // 或者维值
            if (v.id in data[i] || v.type == 3) {
              if(data[i][v.id]){
                lastLine[v.id] = data[i][v.id]
              }else{
                let tmpId = this.getMetricAttr(v.id)
                if(tmpId in data[i]){
                  lastLine[v.id] = data[i][tmpId]
                }else{
                  lastLine[v.id] = ""
                }
              }
              // 表格拆分
              if (v.type === 3 && (this.isSplit)) {
                let tmpMetric = this.getMetricAttr(this.splitMetricList[0].id)
                const name = tmpMetric + '#' + v.name
                lastLine[v.id] = data[i][name]
                if (!data[i][name]) {
                  lastLine[v.id] = ''
                }
              }
            } else {
              let tmpId = this.getMetricAttr(v.id)
              if(data[i][tmpId]){
                lastLine[v.id] = data[i][tmpId]
              }else{
                lastLine[v.id] = ""
              }
            }
          }
        })
        tmptable.push(lastLine)
      }
      // console.log(tmptable)
      this.allData = tmptable
      // 处理保存过来的新增条形图
      this.columnList.forEach((v, i) => {
        if (v.id.indexOf('bar') !== -1) {
          this.allDataRenderAndBar(this.allData)
        }
      })
    },
    // 指标属性转化
    getMetricAttr(colId){
      let tmpId
      switch (colId.slice(-2)){
        case '_5':
          tmpId = colId.replace(/_5$/,'_1')
          break
        case '_6':
          tmpId = colId.replace(/_6$/,'_2')
          break
        case '_7':
          tmpId = colId.replace(/_7$/,'_5')
          break
        case '_8':
          tmpId = colId.replace(/_8$/,'_6')
          break
        case '_x':
          if(colId.slice(-4) === '_9_x') tmpId = colId.replace(/_9_x$/,'_7_x')
          break
        default:
          tmpId = colId
      }
      return tmpId
    },
    // 合计
    async addAllNumber() {
      let upsetting = {}
      upsetting.type = 1
      upsetting.autoSum = true
      let dataSum = ''
      try {
        dataSum = await this.tableSearch(upsetting)
      } catch(err) {
        return
      }
      if (!dataSum) {
        this.allTotal = []
        return
      }
      if (dataSum.length === 0) {
        this.allTotal = []
        return
      }
      // 计算合计值
      const allTotal = {}
      this.columnList.forEach((v, i) => {        
        if (v.id in dataSum[0]) {
          allTotal[v.id] = dataSum[0][v.id]
          if (dataSum[0][v.id] === '合计') {

            allTotal[v.id] = ''
          }
        }
      })

      this.allTotal = allTotal
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'allTotal',
        allTotal: this.allTotal
      })
    },
    // 点击排序
    async sortColumn(id, type) {
      const index = this.index
      const sortList = []
      let data = []
      let upsetting = {}
      this.columnList.forEach((v, i) => {       
        if (v.id === id) {
          if (v.sortType === 'up' && type === 'down') {
            v.sortType = ''
          } else {
            v.sortType = type
          }
          v.sort = true
        }
      })
      this.sortList = sortList
      data = await this.tableSearch(upsetting)

      this.currentPage = 1
      this.allDataRender(data)
      this.tableDataRender() // 拼接数据
      this.renderColumns(this.chartWarnData)     
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })
    }
  }
}

