<template>
<div>
  <div id="handsontable"></div>
</div>
</template>

<script>
/* eslint-disable */
import Handsontable from 'handsontable'
import _difference from 'lodash.difference'

export default {
  name: 'HANDSONTABLE',
  data() {
    return {
      hot: null, // save handsontable instance
      tableHeader: [], // handsontable表格数据
      selectedCell: [], // 所有操作都基于当前被选中的单元格
      flag: 0,
      reportType: this.$route.query.reportType
    }
  },
  computed: {
    keepActive() {
      return this.$store.state.design.keepActive
    },
    tableHeaderActive() {
      return this.$store.state.design.tableHeaderActive
    },
    isShow() {
      return this.$store.state.design.isShow
    },
    columnList() {
      return this.$store.getters.getColumnList
    },
    _tableHeader() {
      return this.$store.getters.getTableHeader
    },
    _activeIcon() {
      return this.$store.state.design.activeIcon
    },
    _selectedCell() {
      return this.$store.getters.getCell
    },
    _handsonMerge() {
      return this.$store.getters.getHandsonMerge
    },
    tableData() {
      return this.$store.getters.getTableHeader
    },
    renderColumns() {
      return this.$store.state.design.renderColumns
    },
    _subtotal() {
      return this.$store.getters.getSubtotal
    },
    row() {
      return this.$store.state.design.row
    },
    rightToggle() {
      return this.$store.state.design.rightToggle
    },
    leftToggle() {
      return this.$store.state.design.leftToggle
    },
    reallyRow() {
      if (this.tableHeaderActive) {
        return this.row
      } else {
        return 1
      }
    }
  },
  watch: {
    // 右侧栏改变适配自定义表格宽度
    rightToggle() {
      if (this.hot) {
        this.hot.render()
      }
    },
    // 左侧栏改变适配自定义表格宽度
    leftToggle() {
      if (this.hot) {
        this.hot.render()
      }
    },
    // 每次表格数据变化，同步vuex，然后重新实例化
    tableHeader(val) {
      this.$store.commit('handleTableHeaderChange', val)
    },
    _tableHeader: {
      handler(val) {
        this.tableHeader = val
        if (val && val.length !== 0 && this.hot) {
          this.hot.updateSettings({
            data: val
          })
        } else {
          this.syncTableLength()
        }
      },
      deep: true
    },
    renderColumns: {
      handler(val) {
        if (val.length !== 0 && this.hot) {
          this.hot.updateSettings({
            columns: val
          })
        } else if (val.length !== 0 && !this.hot) {
          this.syncTableLength()
        }
      },
      deep: true
    },
    // 每次表格数据变化，同步vuex，然后重新实例化 这边有点小bug 用columnListUpdateEvent修复了一下
    //  这边可以优化一下放在mutation columnList变化的地方触发
    columnList(val, oldVal) {
      if (window.hot && this.$store.state.design.columnListUpdate && val.length !== 0) {
        this.$store.commit('reNewHandsontable', true)
        this.$store.commit('renderColumns')
      } else if (!window.hot && this.$store.state.design.columnListUpdate && val.length !== 0) {
        this.$store.commit('reNewHandsontable', true)
        this.$store.commit('renderColumns')
        this.syncTableLength()
      }  else if (window.hot && this.$store.state.design.columnListUpdate && val.length === 0) {
        this.hot.destroy()
        window.hot = null
        this.hot = null
      }
      this.$store.commit('columnListUpdateEvent', true)
    },
    selectedCell(val, oldVal) {
      // console.log(val)
      // 相同的不进行操作 还有个hack需求 如果不return 数值格式那边会有问题 估计是selectedColumn引起变化那边没来的及反应
      if (val[0] === oldVal[0] && val[1] === oldVal[1] && val[2] === oldVal[2] && val[3] === oldVal[3]) {
        return
      }
      // 自定义表格头点击跳转到配置区 数值区域高亮显示
      if (val[0] >= 0 && val[2] <= (this.reallyRow - 2)) {
        document.querySelector('.menuBar.menuList li:nth-child(3)').click()
      }
      // console.log(val)
      this.$store.commit('handleSelectedCellChange', val)
       // handleSelectedColumnChange
      const selectedColumn = []
      // debugger
      const selected = val
      const startCol = Math.min(selected[1], selected[3])
      const endCol = Math.max(selected[1], selected[3])
      const columnList = this.columnList
      if (selected.length !== 0) {
        if (selected[1] === selected[3]) {
          const obj = {}
          obj.id = columnList[selected[1]].id
          obj.name = columnList[selected[1]].name ? columnList[selected[1]].name : columnList[selected[1]].cusName
          obj.type = columnList[selected[1]].type
          selectedColumn.push(obj)
        } else {
          columnList.forEach((v, i) => {
            if ((i >= startCol) && (i <= endCol)) {
              const obj = {}
              obj.id = v.id
              obj.name = v.name ? v.name : v.cusName
              obj.type = v.type
              selectedColumn.push(obj)
            }
          })
        }
      }      
      this.$store.commit('handleSelectedColumnChange', selectedColumn)
    },
    // 监听mergeCells变化，重新实例化handsontable
    _handsonMerge: {
      handler(val) {
        // console.log(val)
        if (val.length == 0 && this.hot) {
          this.hot.updateSettings({
            mergeCells: []
          })
        }
        if (val.length !== 0 && this.hot) {
          this.hot.updateSettings({
            mergeCells: val
          })
        }       
      },
      deep: true
    },
    // 监听合并列的变化
    _subtotal: {
      handler(val) {
        // 先取消所有的合并
        this.columnList.forEach((v, i) => {
          this.$store.commit('handleHandsonUnMerge', [this.reallyRow, i, this.reallyRow + 4, i])
        })
        // 再合并
        val['mergeColumn'].forEach((v) => {
          this.columnList.forEach((item, i) => {
            if (v === item.id) {
              this.$store.commit('handleHandsonMergeChange', [this.reallyRow, i, this.reallyRow + 4, i])
            }
          })
        })
      },
      deep: true
    }
  },
  mounted() {
    // 从零开始，初次挂载清除之前被选中的单元格
    // ugly hack:  保存后刷新报表不展示，随便点一下才显示
    setTimeout(() => {
      document.querySelector('#handsontable').click()
    }, 600)
  },
  methods: {
    syncTableLength() {
      const handsontableDom = document.getElementById('handsontable')
      let height = '' // 二维表和交叉表高度不一致
      if (!handsontableDom) return false
      // destroy handontable instance
      if (this.hot) {
        this.hot.destroy()
      }
      
      if (parseFloat(this.reportType) === 2) {
        height = 210
      } else {
        height = 310
      }
      const container = document.getElementById('handsontable')
      /* const actuallyData = [data.map(v => v.name)] */
      const hot = new Handsontable(container, {
        data: this.tableHeader,
        height: height,
        columns: this.renderColumns,
        contextMenu: false,
        rowHeights: 47,
        colWidths: 200,
        mergeCells: this._handsonMerge,
        stretchH: 'all',
        className: 'htCenter',
        // Callback fired after one or more cells are selected (e.g. during mouse move).
        afterSelectionEnd: () => {
          // console.log(this.selectedCell)
          // [startRow, startCol, endRow, endCol].
          this.selectedCell = hot.getSelected()
          // ugly hack,需求: 选中handsontable的单元格后，右侧面板要跳到相应配置组件
          // const thirdConfigComponent = document.querySelector('.menuBar.menuList li:nth-child(3)')
          // if (thirdConfigComponent) {
          //   thirdConfigComponent.click()
          // }
        },
        beforeChange: (changes, source) => {
          if (this.selectedCell[2] === (this.reallyRow - 1)) {
            this.$Message.info('最后一行值不能被修改')
            return false
          }
          const that = this
          if (changes && changes[0][3]) {
            changes[0][3]= changes[0][3].replace(/\r\n/ig,'')
          }
          if (changes && changes.length === 1 && changes[0][3] && changes[0][3].length > 20) {
            this.$Message.info('输入字符数超过20个最大限制')
            return false
          }
          // 由于预览维度切分的限制，在修改后将被选中的所有单元格的值同步为左上第一个单元格的值,即修改的值
          const changedValue = changes[0][3]
          const _selectedCell = that.selectedCell
          const minRow = Math.min(_selectedCell[0], _selectedCell[2])
          const maxRow = Math.max(_selectedCell[0], _selectedCell[2])
          const minCol = Math.min(_selectedCell[1], _selectedCell[3])
          const maxCol = Math.max(_selectedCell[1], _selectedCell[3])
          // 选中单个单元格不需要进一步操作
          if (minCol === maxCol && minRow === maxRow) return true
         
          return true
        }
      })
      
      window.hot = hot
      this.hot = hot

      document.getElementById("handsontable").addEventListener('keyup', function(event){
        var input = event.target
        var value = input.value
        input.value = value.replace(/\n/g, '')     
      })
      // 监听整个页面 不知道会不会造成性能问题
      document.addEventListener('click', function(e){
        // console.log('aa')
        if (this.selectedCell.length !== 0
          &&this.hot
          && (this._activeIcon === 'formatter' || this._activeIcon === 'align')
          && this.keepActive) {
          // console.log('aa')
          window.hot.selectCell(
            this.selectedCell[0],
            this.selectedCell[1],
            this.selectedCell[2],
            this.selectedCell[3]
          )
          // this.$store.commit('handleSelectedCellChange', this.selectedCell)
        }    
      }.bind(this))
      return true
    }
  },
  beforeDestroy() {
    if (this.hot) {
      this.hot.destroy()
      this.hot = null
      window.hot = null
    }
  }
}
</script>

<style scoped lang="less">
@import 'handsontable/src/css/handsontable.css';
</style>
<style lang="less">
@tableMainColor: #e6ebf5;
@fontColor: rgb(135, 141, 153);
#handsontable{
  display: block;
  width: 100%;
  height: 180px;
  overflow: hidden;
  .handsontable th, .handsontable td {
    border-right: 1px solid @tableMainColor;
    border-bottom: 1px solid @tableMainColor;
  }
  .handsontable tr:first-child th, .handsontable tr:first-child td {
    border-top: 1px solid @tableMainColor;
  }
  .handsontable th:first-child, .handsontable th:nth-child(2), .handsontable td:first-of-type, .handsontable .htNoFrame + th, .handsontable .htNoFrame + td {
    border-left: 1px solid @tableMainColor;
  }
  .htCenter{
    color: @fontColor;
    font-size: 14px;
    font-weight: 700;
    height: 48px;
  }
  .spanWave{
    display: inline-block;
    width: 100%;
    height: 7.5px;
    background-size: 15px 15px;
    background-repeat: repeat-x;
    background-image: linear-gradient(135deg, transparent 45%, red 55%, transparent 60%), linear-gradient(45deg, transparent 45%, red 55%, transparent 60%);
    position: absolute;
    left: 0;
  }
}
</style>

