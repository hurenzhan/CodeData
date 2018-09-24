import _unionwith from 'lodash.unionwith'
import _isEqual from 'lodash.isequal'

let selectId = '' // 选中的id 处理条形图

export default {
  methods: {
    addBarColumnList() {
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
      // this.renderList.forEach((v, i) => {
      //   let addColoum = {} // 新增的这列
      //   if (v.id === this.selectId) {
      //     // 选择的这列变为数值
      //     v.numberOrbar = 'number'
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
      //     this.renderList.splice(i + 1, 0, addColoum) // 新增了一列
      //   }
      // })
      // let mergeCellOption = []

      // 将columnList 存到vuex中
      this.$store.commit('simpleSaveConfig', {
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
        this.allData[i][this.selectId + 'bar'] = addBarArr[i]
        // const lastLine = {}
        // this.columnList.forEach((v, index) => {
        //   if (v.id === 'number') {
        //     lastLine[v.id] = i + 1
        //   } else if (v.id === 'operate') {
        //     if (this.jumpDeatil) {
        //       lastLine[v.id] = ''
        //     }
        //   } else if (v.id === (this.selectId + 'bar')) {
        //     lastLine[v.id] = addBarArr[i]
        //   } else {
        //     lastLine[v.id] = this.allData[i][v.id]
        //   }
        // })
        // addAllData.push(lastLine)
      }
      this.renderColumns()
      // 处理合并单元格的问题
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
      //     // selectIdBar = v.id
      //     this.renderList.splice(i, 1)
      //   }
      // })

      // 将columnList 存到vuex中
      this.$store.commit('simpleSaveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: this.columnList
      })

      this.allData.forEach((item) => {
        delete item[selectIdBar]
      })

      let splitCol = 0
      // 删除表头合并列
      this.tableHeader() // 表头少了一列
      this.tableDataRender()
      this.renderColumns()
      // for (let i = 0; i < this.handsonMerge.length; i += 1) {
      //   const v = this.handsonMerge[i]
      //   if (v.row === (this.row - 1)
      //     && v.col === this.selectedCell[1]
      //     && v.rowspan === 1
      //     && v.colspan === 2) {
      //     splitCol = v.col
      //     this.handsonMerge.splice(i, 1)
      //     i -= 1
      //   }
      //   if (v.col > splitCol) {
      //     v.col -= 1
      //   }
      // }
    }
  }
}
