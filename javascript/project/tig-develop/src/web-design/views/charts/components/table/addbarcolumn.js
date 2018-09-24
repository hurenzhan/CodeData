import _unionwith from 'lodash.unionwith'
import _isEqual from 'lodash.isequal'

let selectId = '' // 选中的id 处理条形图

export default {
  methods: {
    addBarColumnList() {
      // let saveMerge = [] // 保存一下合并单元格的值
      this.handsonMerge = []
      if (!this.selectId) {
        this.$message({
          message: '请选择列',
          type: 'warning'
        })
        return
      }

      const addBarArr = []
      const addAllData = []
      const fakeData  = 10
      this.columnList.forEach((v, i) => {
        let addColoum = {} // 新增的这列
        if (v.id === this.selectId) {
          // 选择的这列变为数值
          v.numberOrbar = 'number'
          // startCol = i
          addColoum.id = v.id + 'bar'
          addColoum.numberOrbar = 'bar'
          addColoum.name = v.name,
          addColoum.superUrl = false
          addColoum.colColor = ''
          addColoum.numberType = ''
          addColoum.trend = false
          addColoum.sort = false
          addColoum.hover = false
          addColoum.dill = false
          this.columnList.splice(i + 1, 0, addColoum) // 新增了一列
        }
      })
      // 加入隐藏列中
      // this.showColumn.forEach((v, i) => {
      //   let addColoum = {} // 新增的这列
      //   if (v.id === this.selectId) {
      //     // 选择的这列变为数值
      //     v.numberOrbar = 'number'
      //     // startCol = i
      //     addColoum.id = v.id + 'bar'
      //     addColoum.numberOrbar = 'bar'
      //     addColoum.name = v.name,
      //     addColoum.superUrl = false
      //     addColoum.colColor = ''
      //     addColoum.numberType = ''
      //     addColoum.trend = false
      //     addColoum.sort = false
      //     addColoum.hover = false
      //     addColoum.dill = false
      //     this.showColumn.splice(i + 1, 0, addColoum) // 新增了一列
      //   }
      // })
      // let mergeCellOption = []
      // 处理合并单元格问题
      // this.renderList.forEach((v, i) => {
      //   if (v.id.indexOf('bar') !== -1) {
      //     mergeCellOption.push({
      //       row: this.row - 1,
      //       col: i - 1,
      //       rowspan: 1,
      //       colspan: 2
      //     })
      //   }
      // })
      // 将columnList 存到vuex中
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })
      // 获得前一列数据 append到所有数据中
      this.allData.forEach((v, i) => {
        Object.keys(v).forEach((item, index) => {
          if (item === this.selectId) {
            addBarArr.push(v[this.selectId])
          }
        })
      })
      // 重新组织数据
      for (let i = 0; i < this.allData.length; i += 1) {
        const lastLine = {}
        this.columnList.forEach((v, index) => {
          if (v.id === 'number') {
            lastLine[v.id] = i + 1
          } else if (v.id === 'operate') {
            if (this.jumpDeatil) {
              lastLine[v.id] = ''
            }
          } else if (v.id === (this.selectId + 'bar')) {
            lastLine[v.id] = addBarArr[i]
          } else {
            lastLine[v.id] = this.allData[i][v.id]
          }
        })
        addAllData.push(lastLine)
      }
      this.renderColumns(this.chartWarnData)
      // 处理合并单元格的问题
      this.allData = addAllData
      this.tableHeader() // 表头多了一列
      this.tableDataRender()
    },
    // 删除新增列
    delBarColumnList() {
      let selectIdBar = ''
      const startCol = this.selectId + 'bar'

      this.columnList.forEach((v, i) => {
        if (startCol === v.id) {
          selectIdBar = v.id
          this.columnList.splice(i, 1)
        }
      })
      // 隐藏列也要去除
      // this.renderList.forEach((v, i) => {
      //   if (startCol === v.id) {
      //     this.renderList.splice(i, 1)
      //   }
      // })

      // 将columnList 存到vuex中
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })

      this.allData.forEach((item) => {
        delete item[selectIdBar]
      })

      // let splitCol = 0
      // 删除表头合并列
      this.tableHeader() // 表头少了一列
      this.tableDataRender()
      this.renderColumns(this.chartWarnData)
    }
  }
}
