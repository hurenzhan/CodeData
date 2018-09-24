import _isEmpty from 'lodash.isempty'
import Vue from 'vue'
import { getMetricCode } from '../../utils/utils'
import VueJsonp from 'vue-jsonp'
import moment from 'moment'
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
      if (!isRename) {
        this.columnList.push({
          id: 'number',
          name: '序号'
        })
      }
      // 排名列
      if (!isRename) {
        this.columnList.push({
          id: 'ranking',
          name: '排名'
        })
      }
      // push维度列 维度在指标前面
      if (!isRename) {
        this.dimList.forEach((v, i) => {
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
            hover: false, // 悬浮
            hoverType: 0, // 悬浮表格
            dill: false, // 下钻与否 不可逆
            type: 0, // 维度类型
            sortType: '', // 排序类型 up升序 down降序 ''不排序
            dimType: v.dimType, // 维度类型 为图片列做准备
            alignFlag: 'left', // 对齐方式
            howDimValueShow: 'dim'
          })
        })
      }
      if (isRename) {
        // 维度重命名
        this.dimList.forEach(v => {
          this.columnList.forEach(item => {
            if (v.dimCode === item.id) {
              // debugger
              // 维度别名的应用
              const dimAlias = this.getAliasByDimCode(item.id)
              item.name = dimAlias === false ? v.dimName : dimAlias
            }
          })
        })
      }
      // push指标列
      if (!isRename) {
        this.metricListFlat.forEach((v, i) => {
          this.columnList.push({
            id: v.metricCode,
            numberOrbar: 'number', // 条形还是数值
            name: v.metricName,
            superUrl: false, // 是否启用超链接
            colColor: '', // 列颜色
            fontColor: '', // 字体颜色
            trend: false, // 趋势标记
            sort: false, // 是否排序
            hover: false, // 悬浮
            hoverType: 0,
            dill: false, // 下钻与否 不可逆
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
      if (!isRename) {
        this.columnList.push({
          id: 'operate',
          name: '操作'
        })
      }
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
      // debugger
      // 不分页的情况
      if (!this.isPage) {
        // startIndex = 0
        this.startIndex = 0
        // endIndex = this.allData.length
        this.endIndex = this.allData.length
      }
      const currentRealData = this.allData.slice(this.startIndex, this.endIndex)
      // 表头
      if (this.showHeader) {
        this.header.forEach((v) => {
          currentData.push(v)
        })
      }

      if (this.totalStore === 'before'){
        // 合计项
        if (this.showTotal && this.currentPage === 1) {
          const lastLine = {}
          this.showColumn.forEach((v, index) => {
            if (index === 0 && v.type !== 1) {
              lastLine[v.id] = '合计'
            } else {
              lastLine[v.id] = this.allTotal[v.id] ? this.allTotal[v.id] : ''
            }
          })
          currentData.push(lastLine)
        }
        //内容
        currentRealData.forEach((v) => {
          currentData.push(v)
        })
      }
      if (this.totalStore === 'after') {
        //内容
        currentRealData.forEach((v) => {
          currentData.push(v)
        })
        // 合计项
        if (this.showTotal && this.currentPage === 1) {
          const lastLine = {}
          this.showColumn.forEach((v, index) => {
            if (index === 0 && v.type !== 1) {
              lastLine[v.id] = '合计'
            } else {
              lastLine[v.id] = this.allTotal[v.id] ? this.allTotal[v.id] : ''
            }
          })
          currentData.push(lastLine)
        }
      }
      this.tableData = currentData
      // 图片列
      if ((this.showPicture || this.superUrl) && this.isProduct && !this.hideDimMetric.some(v => v === 'PD_WD_0005')) {
        let tmpData = this.tableData.slice(this.row)
        let queryStr = '', colPicture={}
        tmpData.map((item)=>{
          if ('PM_WD_0002' in item && 'PD_WD_0005' in item) {
            queryStr += item['PM_WD_0002'].split('###')[0].padStart(10,'0')+'-'+item['PD_WD_0005'].split('###')[0].padStart(18,'0')+'-0-1,'
          }
        })
        queryStr = 'http://pcpsimage.suning.cn/mainpicture/mpBatchCallback/batchGetByLocation/' + queryStr.substr(0,queryStr.length-1) + '.jsonp'
        this.$jsonp(queryStr,{callbackName:"mpBatchCallback"}).then( resp => {
          let startIndex = this.row, endIndex = this.tableData.length
          for(let i = startIndex;i<endIndex;i++){
            this.tableData[i].productInfo = resp[i-startIndex]
          }
          if (this.hot) {
            this.hot.updateSettings({
              data: this.tableData
            })
          } else {
            this.syncTable()
          }
        })
      } else {
        if (this.hot) {
          this.hot.updateSettings({
            data: this.tableData
          })
        } else {
          this.syncTable()
        }
      }
      this.calTableScroll()
      this.calTableHeight()
      this.$nextTick(() => {
        this.hot && this.hot.render()
      })
    },

    tableHeader(isReanme) {
      if (!this.showHeader) {
        // this.header = []
        // this.row = 0
        return
      }
      // 重命名表格头
      if (this.isSingleSplit || this.isManySplit || isReanme) {
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
              obj[v.id] = v.name
            }
            if (this.header.length !==0 && this.header[i] && this.header[i][v.id]) {
              obj[v.id] = this.header[i][v.id]
            }  
          })
          tmpheader.push(obj)
        }
      }
      this.header = tmpheader
      // 保存表格头
      this.$store.commit('saveConfig',  {
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
            if (this.jumpDeatil) {
              lastLine[v.id] = ''
            }
          } else if (v.id === 'ranking') {
            // 排名 表格排序的第一个为准 没有就取右侧面板的排序 右侧面板排序无就从1开始
            if (this.sortList.length === 0) {
              if (Number(this.chartsOption[this.index].sortType) === 2) {
                lastLine[v.id] = i+1
              } else {
                this.chartsOption[this.index].sortType === 0? lastLine[v.id] =data.length - i : lastLine[v.id] = i+1
              }
            } else {
              this.sortList[0].sortType === 0? lastLine[v.id] = data.length - i : lastLine[v.id] = i+1
            }
          } else {
            // 或者维值
            if (v.id in data[i]) {
              lastLine[v.id] = data[i][v.id]
              if (!data[i][v.id]) {
                lastLine[v.id] = ''
              }
              // 对比值放进去
              if (v.trend) {
                let code = getMetricCode(this.metricList, v.id)
                code += '_6'
                if (code in data[i]) {
                  lastLine[v.id] += '#compare' + data[i][code]
                }
              }
            } else {
              lastLine[v.id] = ''
            }
          }
        })
        tmptable.push(lastLine)
      }
      this.allData = tmptable
      // 处理保存过来的新增条形图
      this.columnList.forEach((v, i) => {
        if (v.id.indexOf('bar') !== -1) {
          this.allDataRenderAndBar(this.allData)
        }
      })
    },
    // 合计
    async addAllNumber(data) {
      let dataSum = {}
      if (data) {
        dataSum = data
      } else {
        let upsetting = {}
        upsetting.type = 1
        upsetting.autoSum = true
        try {
          dataSum = await this.tableSearch(upsetting)
          dataSum = dataSum[0]
        } catch(err) {
          return
        }
      }
      
      if (!dataSum) {
        this.allTotal = []
        return
      }
      if (_isEmpty(dataSum)) {
        this.allTotal = []
        return
      }
      // 计算合计值
      const allTotal = {}
      this.columnList.forEach((v, i) => {        
        if (v.id in dataSum) {
          allTotal[v.id] = dataSum[v.id]
          if (dataSum[v.id] === '合计') {
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
      let data = []
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
      data = await this.tableSearch({})

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

