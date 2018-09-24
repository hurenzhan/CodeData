<template>
  <Row class="custom-header-wrap">
    <configHeader :name="name">
      <div @click="toggleTableHeader">
        <Icon v-show="!tableHeaderActive" type="ios-plus-empty" style="cursor: pointer;font-size: 18px;"></Icon>
        <Icon v-show="tableHeaderActive" type="ios-minus-empty" style="cursor: pointer;font-size: 18px;"></Icon>
      </div>
    </configHeader>
    <Row class="functional-wrap">
      <Row class="item-content">
        <Col class="header-title">行</Col>
        <Col class="header-title">
          <InputNumber :disabled="tableHeaderActive" size="small" :max="6" :min="1" v-model="row"></InputNumber>
        </Col>
      </Row>
      <Row class="item-content">
        <Row class="header-title">单元格</Row>
        <div class="row-line">
          <div class="mergecells icon-wrap" @click="handleTableChange(4)">
            <img src="static/design/svg/hebingdanyuange.svg" alt="合并单元格" title="合并单元格">
          </div>
          <div class="cancel-mergecells icon-wrap" @click="handleTableChange(5)">
            <img src="static/design/svg/quxiaohebingdanyuange.svg" alt="取消合并单元格" title="取消合并单元格">
          </div>
        </div>
        <div style="margin: 10px 20px;color: #777;">
          注意：增删列，将清空自定义表头的合并配置，建议先确认好表格内容（列信息）后再进行表头配置
        </div>
      </Row>
    <!--   <Row class="item-content" style="padding-top: 18px;">
        <Col class="title">
          <span>列数改变请重置</span>
          <Button @click="reNewHandsontable" style="float: right;margin-right: 16px;margin-top: -6px;" type="primary" size="small">重置</Button>
        </Col>       
      </Row>  -->  
    </Row>
  </Row>
</template>

<script>
import ConfigHeader from './ConfigHeader'

/* eslint-disable */
  export default {
    components: {
      ConfigHeader
    },
    name: 'design-config-table',
    data() {
      return {
        name: '自定义表格头',
        tableData: [],
      }
    },
    computed: {
      columnList() {
        return this.$store.getters.getColumnList
      },
      row: {
        get() {
          return this.$store.state.design.row
        },
        set(newValue, oldVal) {
          this.$store.commit('syncWithCustomRow', newValue)
        }
      },
      // _data 是实例化handsontable的数据源
      _dataoop: {
        get() {
          return this.$store.getters.getTableHeader
        },
        set() {
        }
      },
      _selectedCell() {
        const data = this.$store.getters.getCell
        return data
      },
      isShow() {
        return this.$store.state.design.isShow
      },
      // 获取合并设置
      handsonMerge() {
        return this.$store.state.design.handsonMerge
      },
      tableHeaderActive() {
        return this.$store.state.design.tableHeaderActive
      },
      columnList() {
        return this.$store.getters.getColumnList
      },
      _subtotal() {
        return this.$store.getters.getSubtotal
      },
    },
    watch: {
      _dataoop: {
        handler(val) {
          this.tableData = val
        },
        deep: true
      },
      tableData: {
        handler(val) {
          this.$store.commit('handleTableHeaderChange', val)
        }
      }
    },
    methods: {
      // type: 0 --> 插入行，1 --> 插入列，2 --> 删除行，3 --> 删除列，4 --> 合并单元格，5 --> 取消合并单元格
      // tableData数据源， _selectedCell 被选中的单元格
      // 插入规则,插入行，向上插入，插入列像右插入
      // 为了防止连续操作，在每次方法执行完后，清空被选项
      handleTableChange(type) {
        const tableData = this.tableData
        const _selectedCell = this._selectedCell
        // 没选中单元格的情况下，不触发相关操作
        if (_selectedCell && !_selectedCell.length) {
          this.$Message.info('请选中相关单元格后，在执行操作')
          return
        }
        // 对被选中单元格归纳整理
        const minRow = Math.min(_selectedCell[0], _selectedCell[2])
        const maxRow = Math.max(_selectedCell[0], _selectedCell[2])
        const minCol = Math.min(_selectedCell[1], _selectedCell[3])
        const maxCol = Math.max(_selectedCell[1], _selectedCell[3])
        const selectId = this.columnList[minCol].id
        let firstSelectedItem = ''
        let lastSelectedItem = ''
        this.tableData.forEach((v, i) => {
          // debugger
          if (i === minRow) {
            Object.keys(v).forEach((item, index) => {
              if (item === selectId) {
        // debugger

                firstSelectedItem = this.tableData[i][item]
              }
            })
          }
          if (i === maxRow) {
            Object.keys(v).forEach((item, index) => {
              if (item === selectId) {
                lastSelectedItem = this.tableData[i][item]
              }
            })
          }
        })
        switch (type) {
          // 合并单元格
          case 4: {
            // debugger
            // 数据区域不能合并
            if ((maxRow > tableData.length - 6)) {
              this.$Message.error('数据区域不能合并')
              return false
            }
            // 新增需求：最后一行不能横向合并
            if ((maxRow === tableData.length - 6) && (maxCol - minCol > 0)) {
              this.$Message.error('最后一行不能合并')
              return false
            }
            // 修改被合并的所有单元格为左上第一个单元格的值
            // 现在出现这样一种情况，选中想要合并的单元格中包含了已经被合并的单元格，这样容易引发错误，做一次处理
            // 受预览维度切分限制， 合并单元格时，将被选中的所有数据改成被选中单元格左上第一个单元格的值
            if ((maxRow === tableData.length - 6)) {
              this.tableData.forEach((v, i) => {
                if (i >= minRow && i <= maxRow) {
                  Object.keys(v).forEach((item, index) => {

                    if (item === selectId) {
                      // debugger
                      this.tableData[i][selectId] = lastSelectedItem
                    }
                  })
                }
              })
            } else {
              this.tableData.forEach((v, i) => {
                if (i >= minRow && i <= maxRow) {
                  Object.keys(v).forEach((item, index) => {
                    if (index >= minCol && index <= maxCol) {
                      this.tableData[i][item] = firstSelectedItem
                    }
                  })
                }
              })
            }
            // 最大行
            this.handsonMerge.forEach((v, i) => {
              if (minRow <= v.row && minCol <= v.col && maxRow >= (v.row + v.rowspan - 1) && maxCol >= (v.col + v.colspan - 1)) {
                this.$store.commit('delSpecificHandsonMerge', i)
              }
            })
            // debugger
            if (_selectedCell) {
              this.$store.commit('handleHandsonMergeChange', _selectedCell)
            }
            const data = this.$store.getters.getFreeze.rowNumber
            // 判断合并单元格中有没有冻结
            const flag = this.handsonMerge.some((v) => {
              const sum = v.col + v.colspan
              return data < sum && data > v.col
            })
            const freeze = {
              rowNumber: 0,
              freezeBoolean: this.$store.getters.getFreeze.freezeBoolean
            }

            if (flag) {
              this.$store.commit('handleFreezeChange', freeze)
              this.$Message.info('合并单元格中有冻结列')
            }
            // debugger
            break
          }
          // 取消合并单元格
          case 5: {
            if (!_selectedCell) {
              return false
            }
            // 受预览维度切分限制，取消合并单元格的时候，除了左上第一个单元格不变外，所有被选中的单元格置为空值
            if (maxRow === tableData.length - 6) {
              this.tableData.forEach((v, i) => {
                if (i >= minRow && i <= maxRow) {
                  Object.keys(v).forEach((item, index) => {
                    if (item === selectId) {
                      this.tableData[i][item] = ''
                    }
                  })
                }
                // 第一个值
                if (i === maxRow) {
                  Object.keys(v).every((item, index) => {
                    if (item === selectId) {
                     this.tableData[i][item] = lastSelectedItem 
                      return false
                    }
                    return true
                  })
                }
              })
            } else {
              this.tableData.forEach((v, i) => {
                if (i >= minRow && i <= maxRow) {
                  Object.keys(v).forEach((item, index) => {
                    if (index >= minCol && index <= maxCol) {
                      this.tableData[i][item] = ''
                    }
                  })
                }
                // 第一个值
                if (i === minRow) {
                  Object.keys(v).every((item, index) => {
                    if (index === minCol) {
                     this.tableData[i][item] = firstSelectedItem 
                      return false
                    }
                    return true
                  })
                }
              })
            }
            this.$store.commit('handleHandsonUnMerge', _selectedCell)
            break
          }
          // default do nothing
          default: {
            break
          }
        }
        // 每次操作后清除选中的单元格
        this.$store.commit('emptySelectCell')
        return true
      },
      reNewHandsontable() {
        this.$store.commit('reNewHandsontable', false)
        this.$store.commit('renderColumns')
      },
      // 切换自定义表头数据
      toggleTableHeader() {
        // const isShow = this.isShow
        // 每次点击 + ，都会重新创建一个全新的handsontable
        const handsontable = document.querySelector('#handsontable')
        let reallyRow = ''
        let oldRow = ''
        this.$store.commit('resetHandsonMerge')
        if (this.tableHeaderActive) {
          this.$store.commit('handleTableHeaderActive', false)
          reallyRow = 1
          oldRow = this.row
        } else {
          this.$store.commit('handleTableHeaderActive', true)
          reallyRow = this.row
          oldRow = 1
        }
        // if (this.tableHeaderActive) {
        //   return this.row
        // } else {
        //   return 1
        // }
        // console.log(reallyRow)
        // 改变合并列的合并单元格
        // this.columnList.forEach((v, i) => {
          this.$store.commit('emptyHandsonMerge')
        // })
        // 再合并
        this._subtotal['mergeColumn'].forEach((v) => {
          this.columnList.forEach((item, i) => {
            if (v === item.id) {
              this.$store.commit('handleHandsonMergeChange', [reallyRow, i, reallyRow + 4, i])
            }
          })
        })
        this.reNewHandsontable()    
      }
    },
  }
</script>

<style scoped lang="less">
.custom-header-wrap{
  .item-content{
    margin-bottom: 10px;
  }
  .header-title{
    margin-left: 18px;
    padding: 10px 0 ;
  }
  .row-line{
    display: flex;
    &>div{
      margin-left: 34px;
    }
  }
  .icon-wrap{
    width: 20px;
    height: 20px;
    img{
      display: block;
      width: 100%;
    }
  }
}
</style>
