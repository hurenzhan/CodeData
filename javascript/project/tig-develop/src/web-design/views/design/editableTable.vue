<template>
<div class="editable-wrap">
  <el-table
    border
    style="width: 100%;"
    :data="tableData"
    :show-header="false"
    :highlight-current-row="false"
    @cell-click="handleSelectCell"
    :span-method="arraySpanMethod"
    :cell-class-name="setCellClass">
    <el-table-column
      prop="id"
      label="ID"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="amount1"
      sortable
      label="数值 1">
    </el-table-column>
    <el-table-column
      prop="amount2"
      sortable
      label="数值 2">
    </el-table-column>
    <el-table-column
      prop="amount3"
      sortable
      label="数值 3">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
/* eslint-disable */
import { hasClass, removeClass, addClass } from '@/components/Utils'
import { Table, TableColumn } from 'element-ui'

export default {
  name: 'editable-table',
  components: {
    elTable: Table,
    elTableColumn: TableColumn
  },
  data() {
    return {
      tableData: [{
        id: '12987122',
        name: '王小虎',
        amount1: '234',
        amount2: '3.2',
        amount3: 10
      }, {
        id: '12987123',
        name: '王小虎',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '12987124',
        name: '王小虎',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      }, {
        id: '12987125',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '12987126',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }],
      span: [2,3]
    }
  },
  methods: {
    handleSelectCell(row, column, cell, event) {
      if (hasClass(cell, 'clickedStatus')) {
        cell.classList.remove('clickedStatus')
      } else {
        cell.classList.add('clickedStatus')
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
      return [1, 1]
    },
    setCellClass({row, column, rowIndex, columnIndex}) {
    }
  }
}
</script>

<style lang="less">
@import "element-ui/lib/theme-chalk/table.css";
@import "element-ui/lib/theme-chalk/table-column.css";
// .editable-wrap {}
</style>
<style lang="less">
@mainColor: #51A6FF;
.editable-wrap {
  .el-table_1_column_1{
    &.clickedStatus{
      border: 1px solid @mainColor;
    }
  }
}
</style>

