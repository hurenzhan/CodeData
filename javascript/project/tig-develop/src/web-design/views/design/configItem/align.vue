<template>
  <div>
    <configHeader :name="name"></configHeader>
    <div class="align-wrap">
      <div class="stand-position">
        <Tooltip content="竖向居上">
          <div class="top item" :class="{active: align.active.vertical === 1}" @click="handleAlign(1)">
            <span class="position"></span>
          </div>
        </Tooltip>
        <Tooltip content="竖向居中">
          <div class="center item" :class="{active: align.active.vertical === 2}" @click="handleAlign(2)">
            <span class="position"></span>
          </div>
        </Tooltip>
        <Tooltip content="竖向居下">
          <div class="bottom item" :class="{active: align.active.vertical === 3}" @click="handleAlign(3)">
            <span class="position"></span>
          </div>
        </Tooltip>
      </div>
      <div class="laydown-position">
        <Tooltip content="横向居左">
          <div class="left item" :class="{active: align.active.horizontal === 4}" @click="handleAlign(4)">
            <span class="position"></span>
          </div>
        </Tooltip>
        <Tooltip content="横向居中">
          <div class="center item" :class="{active: align.active.horizontal === 5}" @click="handleAlign(5)">
            <span class="position"></span>
          </div>
        </Tooltip>
        <Tooltip content="横向居右">
          <div class="right item" :class="{active: align.active.horizontal === 6}" @click="handleAlign(6)">
            <span class="position"></span>
          </div>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigHeader from './ConfigHeader'

/* eslint-disable */
  export default {
    components: {
      ConfigHeader
    },
    name: 'design-config-align',
    data() {
      return {
        align: { // 对齐方式1 --> verticalTop 2 --> verticalCenter 3 --> verticalbottom
          // 4 --> horizontalLeft 5 --> horizontalCenter 6 --> horizontalRight
          // 默认位置是左中 --> vertical: 2, horizontal: 4
          active: {
            vertical: 2,
            horizontal: 4 // 水平方向456
          }
        }
      }
    },
    computed: {
      name() {
        const seletedValue = this.$store.getters.getSelectedColumn.map((v) => {
          const name = v.name ? v.name : v.cusName
          return name
        }).join('')
        if (!seletedValue) {
          return '对齐方式'
        }
        return `对齐方式（${seletedValue}）`
      },
      tableHeaderActive() {
        return this.$store.state.design.tableHeaderActive
      },
      columns() {
        return this.$store.getters.getColumnList
      },
      _selectedColumn() {
        return this.$store.getters.getSelectedColumn
      },
      _selectedCell() {
        return this.$store.getters.getCell
      },
      row() {
        return this.$store.state.design.row
      },
      reallyRow() {
        if (this.tableHeaderActive) {
          return this.row
        } else {
          return 1
        }
      },
      _selectedColumnType() {
        const startRow = Math.min(this._selectedCell[0], this._selectedCell[2])
        if (startRow >= 0 && startRow <= (this.reallyRow - 2)) {
          return 0
        }
        return 1
      }
    },
    methods: {
      handleAlign(number) {
        // 选择表格头除了最下面一行没有效果
        if (this._selectedColumnType === 0) {
          return
        }
        // 响应视图展示
        if (number > 3) {
          this.align.active.horizontal = number
        } else {
          this.align.active.vertical = number
        }
        if (this.name === '对齐方式') { // 同步全局对齐属性
          Object.keys(this.align).forEach((v) => {
            if (number > 3) {
              this.align[v].horizontal = number
            } else {
              this.align[v].vertical = number
            }
          })
        } else {  // 针对单独列的设置 支持多列
          if (number > 3) {
            this._selectedColumn.forEach((v) => {
              this.align[v.id].horizontal = number
            })
            this.updateEvent()
            return
          }
          this._selectedColumn.forEach((v) => {
            this.align[v.id].vertical = number
          })
        }
        this.updateEvent()
      },
      updateEvent() {
        let updateEvent = false // 自定义列触发  一个小bug
        for (let i = 0; i < this._selectedColumn.length; i += 1) {
          if (this._selectedColumn[i].type === 2) {
            updateEvent = true
            break
          }
        }
        if (updateEvent) {
          this.$store.commit('columnListUpdateEvent', false)
        }
      },
      selectedColumn() {
        const val = this._selectedColumn
        if (val.length !== 0 && val.length !== 1) {
          let verticalRepeatTrue = false // vertical 多列是不是一致
          let horizontalRepeatTrue = false // horizontal 多列是不是一致
          const vertical = [] // 选中的列的vertical
          const horizontal = [] // 选中的列的horizontal

          Object.keys(this.align).forEach((v) => {
            val.forEach((item) => {
              if (item.id === v) {
                vertical.push(this.align[v].vertical)
                horizontal.push(this.align[v].horizontal)
              }
            })
          })
          // 多列vertical方向是不是一致 一致就展示active.vertical
          for (let i = 0; i < vertical.length; i += 1) {
            if (vertical[i] !== vertical[0]) {
              verticalRepeatTrue = true
              break
            } else {
              verticalRepeatTrue = false
            }
          }
          // 多列horizontal方向是不是一致 一致就展示active.horizontal
          for (let i = 0; i < horizontal.length; i += 1) {
            if (horizontal[i] !== horizontal[0]) {
              horizontalRepeatTrue = true
              break
            } else {
              horizontalRepeatTrue = false
            }
          }

          if (verticalRepeatTrue) {
            this.align.active.vertical = 7
          } else {
            this.align.active.vertical = vertical[0]
          }

          if (horizontalRepeatTrue) {
            this.align.active.horizontal = 8
          } else {
            this.align.active.horizontal = horizontal[0]
          }
        }
        // 只有单列被选中的情况
        if (val.length === 1) {
          this.align.active.vertical = this.align[val[0].id] ? this.align[val[0].id].vertical : 2
          this.align.active.horizontal = this.align[val[0].id] ? this.align[val[0].id].horizontal : 4
        }
      },
      columnsAlignConfig() {
        const val = this.columns
        const alignConfig = {}
        val.forEach((v) => {
          alignConfig[v.id] = {
            vertical: v.alignDisplay.vertical,
            horizontal: v.alignDisplay.horizontal
          }
        })
        Object.keys(alignConfig).forEach((v) => {
          this.align[v] = alignConfig[v]
        })
      }
    },
    watch: {
      columns: {
        handler() {
          this.columnsAlignConfig()
        },
        deep: true
      },
      align: {
        handler(val) {
          this.$store.commit('syncAligninColumnList', val)
          if (this.columns.length !== 0 && this._selectedColumn.length !== 0) {
            this.$store.commit('renderColumns')
          }
        },
        deep: true
      },
      _selectedColumn() {
        this.selectedColumn()
      }
    },
    mounted() {
      this.columnsAlignConfig()
      this.selectedColumn()
    }
  }
</script>

<style scoped lang="less">
@unit: 20 / 3 px;
@border-color: #a2a8b8;
@background-color: #999;
@active-bg-color: #51a6ff;
.align-wrap {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  .stand-position,
  .laydown-position {
    display: flex;
    justify-content: space-around;
    .item {
      border: 1px dotted @border-color;
    }
  }
  .stand-position {
    .position {
      display: block;
      position: absolute;
      left: 0;
      width: 100%;
      height: 33.333%;
      background-color: @background-color;
    }
    .item {
      position: relative;
      width: 20px;
      height: 26px;
      cursor: pointer;
      &.active {
        border: 1px dotted @active-bg-color;
        .position {
          background-color: @active-bg-color;
        }
      }
    }
    .top {
      & > .position {
        width: 100%;
        top: 0;
      }
    }
    .center {
      & > .position {
        width: 100%;
        top: 33.333%;
      }
    }
    .bottom {
      & > .position {
        width: 100%;
        top: 66.666%;
      }
    }
  }
  .laydown-position {
    margin-top: 26px;
    .position {
      display: block;
      position: absolute;
      top: 0;
      height: 100%;
      width: 33.333%;
      background-color: @background-color;
    }
    .item {
      position: relative;
      width: 26px;
      height: 20px;
      cursor: pointer;
      &.active {
        border: 1px dotted @active-bg-color;
        .position {
          background-color: @active-bg-color;
        }
      }
    }
    .left {
      & > .position {
        width: 33.333%;
        left: 0;
      }
    }
    .center {
      & > .position {
        width: 33.333%;
        left: 33.333%;
      }
    }
    .right {
      & > .position {
        width: 33.333%;
        left: 66.666%;
      }
    }
  }
}
</style>
