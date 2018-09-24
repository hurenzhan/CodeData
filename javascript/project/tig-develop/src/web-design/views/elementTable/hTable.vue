<template>
<div style="width:100%;" id="hTableMargin">
  <div id="hTable" class="hTable"></div>
  <clip-loader class="hTable_loader" :loading="loadingTableData" color="#51A6FF"></clip-loader>
</div>
</template>

<script>
import Handsontable from 'handsontable'
import ClipLoader from 'vue-spinner/src/ClipLoader'

export default {
  components: {
    ClipLoader
  },
  props: {
    loadingTableData: {
      default: false
    },
    source: {
      default() {
        return {
          // 数据
          columns: [],
          data: [],
          mergeCells: [], // 合并单元格
          // 样式
          fixedColumnsLeft: 1, // 冻结 1 列
          fixedRowsTop: 1,     // 冻结表头
          headerRows: 1,       // 表头行数
        }
      }
    }
  },
  data() {
    return {
      hTable: null
    }
  },
  methods: {
    initTable() {
      const source = this.source
      console.log(source)
      const fontSize = Number(source.cellStyle.fontSize.split('px')[0])
      const padding = Number(source.cellStyle.padding.split('px')[0])
      const height = source.headerRows * (fontSize + padding * 2 + 15) //  + 20
      const container = document.getElementById('hTable')
      const hConfig = {
        readOnly: true,
        data: source.data,
        height,
        colWidths: 100,
        columns: source.columns,
        mergeCells: source.mergeCells,
        disableVisualSelection: true
      }
 
      if (source.fixedColumnsLeft > 0 || source.fixedRowsTop > 0) {
        const hTableMargin = document.getElementById('hTableMargin').offsetWidth
        let colWidths = (hTableMargin - 15) / source.columns.length
        if (colWidths < 120) {
          colWidths = 120
        }
        hConfig.height = 500
        if (source.data.length === source.headerRows) {
          hConfig.height = source.data.length * (fontSize + padding * 2 + 15) + 20
        }
        hConfig.rowHeights = 30
        hConfig.colWidths = colWidths
        hConfig.rowHeaders = true
        hConfig.rowHeaderWidth = 0
        if (document.getElementById('frezeId')) {
          document.head.removeChild(document.getElementById('frezeId'))
        }
      } else {
        if (!document.getElementById('frezeId')) {
          const styleAdd = document.createElement('style')
          styleAdd.innerHTML = `
            #hTable {
            }
            #hTable .wtHolder,
            #hTable .handsontable .wtHider,
            #hTable .handsontable table.htCore {
              width: 100% !important;
            }
          `
          styleAdd.setAttribute('id', 'frezeId')
          document.head.append(styleAdd)
        }
        hConfig.stretchH = 'all'
      }
      this.hTable = new Handsontable(container, hConfig)
    },
    updateTable() {
      const source = this.source
      const fontSize = Number(source.cellStyle.fontSize.split('px')[0])
      const padding = Number(source.cellStyle.padding.split('px')[0])
      const hConfig = {
        mergeCells: source.mergeCells,
        columns: source.columns,
        data: source.data,
      }

      if (source.fixedColumnsLeft === 0 && source.fixedRowsTop === 0) {
        if (source.data.length >= 100) {
          hConfig.height = source.data.length * (fontSize + padding * 2 + 10)
        }
        if (source.data.length < 100 && source.data.length >= 20) {
          hConfig.height = source.data.length * (fontSize + padding * 2 + 10)
        }
        if (source.data.length < 20) {
          hConfig.height = source.data.length * (fontSize + padding * 2 + 13)
        }
        if (source.data.length < 6) {
          hConfig.height = source.data.length * (fontSize + padding * 2 + 15) + 60
        }
      }
      if (source.fixedColumnsLeft > 0 || source.fixedRowsTop > 0) {
        hConfig.fixedColumnsLeft = source.fixedColumnsLeft
        hConfig.fixedRowsTop = source.fixedRowsTop
        hConfig.height = 500
      }

      this.hTable.updateSettings(hConfig)
      if (source.fixedColumnsLeft === 0 && source.fixedRowsTop === 0) {
        document.getElementById('hTable').style.height = '100% !important'
        document.getElementsByClassName('wtHolder')[0].style.height = '100%  !important'
      }
    }
  }
}
</script>

<style scoped>
.hTable_loader {
  margin-top: 40px;
  margin-bottom: 40px;
}
</style>

<style lang="css">
@import 'handsontable/src/css/handsontable.css';
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/   
::-webkit-scrollbar   
{   
    width: 2px;   
    height: 2px;   
    background-color: #F5F5F5;   
}   
     
/*定义滚动条轨道 内阴影+圆角*/   
::-webkit-scrollbar-track   
{   
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);   
    border-radius: 10px;   
    background-color: #F5F5F5;   
}   
     
/*定义滑块 内阴影+圆角*/   
::-webkit-scrollbar-thumb   
{   
    border-radius: 10px;   
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);   
    background-color: #555;   
}   
</style>
