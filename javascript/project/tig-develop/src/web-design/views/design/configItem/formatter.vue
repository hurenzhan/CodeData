<template>
  <div>
    <configHeader :name="name"></configHeader>
    <p style="padding-left: 16px;margin-top: 14px;" v-show="_selectedColumnType === 0">请先选择指标列</p>
    <div class="formatter-wrap" v-show="_selectedColumnType && _selectedColumnType !== 0">
      <div>格式设置</div>
      <RadioGroup
        :value="formatter.active.type"
        class="radio-group"
        @on-change="changeFormatter('type', $event)">
        <Radio :label="0"><span>数值</span></Radio>
        <Radio :label="1"><span>百分比</span></Radio>
      </RadioGroup>
      <div class="count-wrap">
        小数点位数
        <InputNumber
          class="count"
          size="small"
          :max="6"
          :min="0"
          :value="formatter.active.decimals"
          @on-change="changeFormatter('decimals', $event)"></InputNumber>

      </div>
      <div class="thousand">
        <Checkbox
          class="item"
          :value="formatter.active.thousands"
          @on-change="changeFormatter('thousands', $event)">使用千位符</Checkbox>
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
    name: 'design-config-formatter',
    data() {
      return {
        formatter: {  // key --> 对应列id，all是全局，value --> 具体配置信息
          active: {
            type: 0, // 数值类型：0 -->数值， 1 -->百分比
            decimals: 2, // 小数点位数
            thousands: false // 是否使用千位分割符
          }
        }
      }
    },
    computed: {
      name() {
        if (this._selectedColumn.length !== 0 && window.hot) {
          const seletedValue = this._selectedColumn.map(v => v.name).join('')
          if (!seletedValue) {
            return '数值格式'
          }
          return `数值格式（${seletedValue}）`
        }
        return '数值格式'
      },

      columns() {
        return this.$store.getters.getColumnList
      },
      tableHeaderActive() {
        return this.$store.state.design.tableHeaderActive
      },
      _formatter() {
        return this.$store.getters.getFormatter
      },
      _selectedColumn() {
        return this.$store.getters.getSelectedColumn
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
      _selectedCell() {
        return this.$store.state.design.cell
      },
      _selectedColumnType() {
        const startRow = Math.min(this._selectedCell[0], this._selectedCell[2])
        if (startRow >= 0 && startRow <= (this.reallyRow - 2)) {
          return 0
        }
        if (this._selectedColumn.length !== 0 && window.hot) {
          const getSelectedColumn = this.$store.getters.getSelectedColumn
          if (getSelectedColumn.length !== 0) {
            for (let i = 0; i < getSelectedColumn.length; i += 1) {
              if (getSelectedColumn[i].type === 0) {
                return 0
              } else {
                return 1
              }
            }
          } else {
            return 0
          }
          return 0
        }
        return 0
      },
    },
    methods: {
      changeFormatter(type, data) {
        // 三种类型，type
        switch (type) {
          case 'type':
            this.formatter.active.type = data
            if (this.name === '数值格式') { // 作用全局
              Object.keys(this.formatter).forEach((v) => {
                this.formatter[v].type = data
              })
            } else {
              this._selectedColumn.forEach((v) => {
                this.formatter[v.id].type = data
              })
            }
            this.updateEvent()
            break
          case 'decimals':
          // console.log(this._selecteCell)

            this.formatter.active.decimals = data
            if (this.name === '数值格式') { // 作用全局
              Object.keys(this.formatter).forEach((v) => {
                this.formatter[v].decimals = data
              })
            } else {
              this._selectedColumn.forEach((v) => {
                this.formatter[v.id].decimals = data
              })
            }
            this.updateEvent()
            break
          case 'thousands':
            this.formatter.active.thousands = data
            if (this.name === '数值格式') { // 作用全局
              Object.keys(this.formatter).forEach((v) => {
                this.formatter[v].thousands = data
              })
            } else {
              this._selectedColumn.forEach((v) => {
                this.formatter[v.id].thousands = data
              })
            }
            this.updateEvent()
            break
          default:
            break
        }
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
      }
    },
    watch: {
      formatter: {
        handler(val) {
          this.$store.commit('handleFormatterChange', val)
          this.$store.commit('syncNumberColumnList', val)
          this.$store.commit('renderColumns')
        },
        deep: true
      },
      _formatter: {
        handler(val) {
          this.formatter = val
        },
        deep: true
      },
      columns(val) {
        // 同步
        if (val.length) {
          val.forEach((v) => {
            if (!this.formatter[v.id]) {
              const config = {
                type: 0, // 数值类型：0 -->数值， 1 -->百分比
                decimals: 2, // 小数点位数
                thousands: false // 是否使用千位分割符
              }
              this.formatter[v.id] = JSON.parse(JSON.stringify(config))
            }
          })
        }
      },
      // 点击表头同步表头的数值格式信息到视图
      _selectedColumn(val) {
        // 选中多列
        if (val.length !== 0 && val.length !== 1) {
          let type = false
          let decimals = false
          let thousands = false

          const typeArray = [] // 选中的列的type
          const decimalsArray = [] // 选中的列的decimals
          const thousandsArray = [] // 选中的列的thousands

          Object.keys(this.formatter).forEach((v) => {
            val.forEach((item) => {
              if (item.id === v) {
                typeArray.push(this.formatter[v].type)
                decimalsArray.push(this.formatter[v].decimals)
                thousandsArray.push(this.formatter[v].thousands)
              }
            })
          })
          // 数值格式是不是一致
          for (let i = 0; i < typeArray.length; i += 1) {
            if (typeArray[i] !== typeArray[0]) {
              type = true
              break
            } else {
              type = false
            }
          }
          // 小数点位数是不是一致
          for (let i = 0; i < decimalsArray.length; i += 1) {
            if (decimalsArray[i] !== decimalsArray[0]) {
              decimals = true
              break
            } else {
              decimals = false
            }
          }

          // 千分位是不是一致
          for (let i = 0; i < thousandsArray.length; i += 1) {
            if (thousandsArray[i] !== thousandsArray[0]) {
              thousands = true
              break
            } else {
              thousands = false
            }
          }

          if (type) {
            this.formatter.active.type = 3
          } else {
            this.formatter.active.type = typeArray[0]
          }

          if (decimals) {
            this.formatter.active.decimals = 0
          } else {
            this.formatter.active.decimals = decimalsArray[0]
          }

          if (thousands) {
            this.formatter.active.thousands = false
          } else {
            this.formatter.active.thousands = thousandsArray[0]
          }
        }

         // 只有单列被选中的情况
        if (val.length === 1) {
          const idExist = this.formatter[val[0].id]
          this.formatter.active.type = this.formatter[val[0].id] ? idExist.type : 0
          this.formatter.active.decimals = this.formatter[val[0].id] ? idExist.decimals : 2
          this.formatter.active.thousands = this.formatter[val[0].id] ? idExist.thousands : false
        }
      }
    },
    mounted() {
      this.formatter = this._formatter
    }
  }
</script>

<style scoped lang="less">
.formatter-wrap{
  padding: 20px 14px;
  .radio-group{
    display: flex;
    justify-content: space-between;
    // padding: 0 10px;
    padding-top: 10px;
  }
  .count{
    width: 60px;
  }
  .count-wrap{
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    font-size: 10px;
  }
  .thousand{
    text-align: right;
  }
}
</style>
<style lang="less">
@tabMainColor: #00C5E1;
.formatter-wrap{
  .ivu-checkbox-wrapper{
    margin-right: 0;
  }
}
</style>

