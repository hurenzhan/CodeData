<!-- 自定义月份范围控件 返回月份起始结束数组-->
<template>
  <div class="wrapper_month">
    <el-popover placement="bottom" v-model="showDrop">
      <div slot="reference">
        <span class="my-input__icon"><i class="el-icon-date"></i></span>
        <input
          id="inputStart"
          class="my-range_input"
          placeholder="开始日期"
          v-model="startMonth"
          readonly>
        <span class="input-separator">-</span>
        <input
          id="inputEnd"
          class="my-range_input"
          placeholder="结束日期"
          v-model="endMonth"
          readonly>
        <span class="clear_input" @click.stop="clearInput"><i class="my-clear__icon el-icon-circle-close"></i></span>
      </div>
      <div class="month_range_pick">
        <div class="header">
          <span class="switch_icon_pre" @click="switchYearPre"><i class="el-icon-d-arrow-left"></i></span>
          <span class="switch_icon_aft" @click="switchYearAft"><i class="el-icon-d-arrow-right"></i></span>
          <span class="year">{{year}} 年</span>
        </div>
        <div class="month-table">
          <span class="table-cell-box" v-for="list in monthTable">
            <span 
              class="cell"
              :class="{
                'current': list.timeString === currentMonth,
                'disabled': list.disabled,
                'active': list.active,
                'inRange': list.inRange,
                'range_start': list.start,
                'range_end': list.end
              }"
              @click="setMonthRange(list)"
              @mouseover="setTableEnterHover(list)">
              {{list.name}}
            </span>
          </span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "quaterDate",
  props: {
    value: {}
  },
  data () {
    return {
      showDrop: false,
      monthArr: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      table: [],
      // 显示的年份
      year: null,
      // 月份范围
      range: [],
      startMonth: null,
      endMonth: null
    }
  },
  computed: {
    // 当前月份
    currentMonth () {
      let time = new Date()
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      month = parseInt(month) < 10 ? `0${month}` : month
      return `${year}-${month}`
    },
    monthTable () {
      return this.table
    }
  },
  watch: {
    showDrop (value) {
      if (value) {
        this.range = []
        if (this.startMonth && this.endMonth) {
          this.range.push(this.startMonth)
          this.range.push(this.endMonth)
        }
        this.setTableInfo()
      }
    },
    // 监测prop传值的变化
    value (newValue) {
      if (newValue && Array.isArray(newValue) && newValue.length === 2) {
        this.year = (new Date(newValue[0])).getFullYear()
        this.startMonth = newValue[0]
        this.endMonth = newValue[1]
        this.initTable(this.year)
      }
    }
  },
  methods: {
    // 构建月份渲染数据
    initTable (year) {
      this.table = []
      for (let i = 0; i < 12; i++) {
        let id = i + 1
        let name = this.monthArr[i]
        let month =  id < 10 ? `0${id}` : id
        let cell = {
              id,
              name,
              month,
              timeString: `${year}-${month}`,         // 月份字符串
              inRange: false,                         // 是否覆盖在范围内
              disabled: false,                        // 是否禁选
              active: false,                          // 是否激活
              start: false,                           // 范围的开始段
              end: false                              // 范围的结束段
            }
        this.table.push(cell)
      }
    },
    // 年的切换
    switchYearPre () {
      this.year = parseInt(this.year) - 1
      // 限制年份 在2000之后
      if (this.year < 2000) {
        this.year = 2000
      }
      this.initTable(this.year)
      this.setTableInfo()
    },
    // 年的切换
    switchYearAft () {
      this.year = parseInt(this.year) + 1
      this.initTable(this.year)
      this.setTableInfo()
    },
    // 设置月份范围
    setMonthRange (list) {
      let length = this.range.length
      let timeString = list.timeString
      if (length === 2 || length === 0 ) {
        this.range = []
        this.range.push(timeString)
        // 更新样式
        this.setTableInfo()
      } else if (length === 1) {
        // 插入头部
        if ( (new Date(this.range[0])).getTime() < (new Date(timeString)).getTime() ) {
          this.range.push(timeString)
        } else {
          this.range.unshift(timeString)
        }
        // 更新样式
        this.setTableInfo()
        // 关闭本次选择
        this.submit()
      }
    },
    // 更新样式
    setTableInfo () {
      this.table.forEach (item => {
        this.setTableCellInfo(item)
      })
    },
    // 父组件传值
    submit () {
      this.startMonth = this.range[0]
      this.endMonth = this.range[1]
      this.$emit('input', this.range)
      this.$emit('change', this.range)
      this.showDrop = false
    },
    // 同步数据表基础信息
    setTableCellInfo (cell) {
      let time = (new Date(cell.timeString)).getTime()
      let length = this.range.length
      switch (length) {
        case 0:
          cell.inRange = false
          cell.start = false
          cell.end = false
          cell.active = false
          break;
        case 1:
          let firstTime = (new Date(this.range[0])).getTime()
          cell.active = time === firstTime ? true : false
          cell.start = time === firstTime ? true : false
          cell.end = time === firstTime ? true : false
          cell.inRange = time === firstTime? true : false
          break;
        case 2:
          let startTime = (new Date(this.range[0])).getTime()
          let endTime = (new Date(this.range[1])).getTime()
          cell.inRange = time >= startTime && time <= endTime ? true : false
          cell.start = time === startTime ? true : false
          cell.end = time === endTime ? true : false
          cell.active = time == startTime || time === endTime ? true : false
          break;                      
      }
    },
    // 控制table表进入hover时的样式
    setTableEnterHover (cell) {
      let length = this.range.length
      let timeTemp = (new Date(cell.timeString)).getTime()

      // 未设置起始月份时
      if (length === 2 || length === 0) {
        return
      }

      let time = (new Date(this.range[0])).getTime()
      let min = Math.min(time, timeTemp)
      let max = Math.max(time, timeTemp)
      this.table.forEach(item => {
        let cellTime = (new Date(item.timeString)).getTime()
        item.inRange = cellTime >= min && cellTime <= max ? true : false
        item.start = cellTime === min ? true : false
        item.end = cellTime === max ? true : false
        item.active = cellTime == min || cellTime === max ? true : false
      })
    },
    // 清空选项
    clearInput () {
      this.startMonth = null
      this.endMonth = null
      this.$emit('input', [])
      this.$emit('change', [])
    },
    checkArea (e) {
      if (!this.$el.contains(e.target)) {
        this.isShow = false
      }
    }
  },
  mounted () {
    // 事件捕获
    // document.addEventListener('click', this.checkArea, true)
    let date = new Date()
    // 本月
    let month = date.getMonth() + 1
    this.year = date.getFullYear()
    // 初始化渲染
    if (this.value && Array.isArray(this.value) && this.value.length === 2) {
      this.year = (new Date(this.value[0])).getFullYear()
      this.startMonth = this.value[0]
      this.endMonth = this.value[1]
      this.initTable(this.year)
    } else {
      this.initTable(this.year)
    }
  },
  beforeDestroy() {
    // document.removeEventListener('click', this.checkArea, true)
  }
}
</script>
<style scoped>
  .wrapper_month {
    display: inline-flex;
    padding: 3px 10px;
    height: 32px;
    line-height: 28px;
    border: 1px solid #dcdfe6;
    color: #606266;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    box-sizing: border-box;
    font-size: 0;
  }
  .focus {
    border-color: #409EFF;
  }
  .wrapper_month  .my-input__icon {
    line-height: 24px;
    font-size: 13px;
    margin-left: -5px;
    margin-right: 6px;
    color: #c0c4cc;
  }
  .clear_input {
    text-align: center;
    color: #fff;
    margin-left: 4px;
    margin-right: -6px;
  }
  .clear_input:hover {
    color: #c0c4cc;
  }
  .my-clear__icon {
    line-height: 24px;
    font-size: 14px;
  }
  .wrapper_month  span {
    display: inline-block;
  }
  .my-range_input {
    font-size: 13px;
    outline: none;
    border: none;
    width: 50px;
    text-align: center;
    color: #606266;
    height: 24px;
    box-sizing: border-box;
  }
  .my-range_input:hover {
    cursor: pointer;
  }
  .input-separator {
    font-size: 13px;
    width: 12px;
    text-align: center;
    line-height: 24px;
    color: #303133;
  }
  .el-popover__reference {
    height: 24px;
  }
  .month_range_pick {
    height: 270px;
    width: 300px;
  }
  .header {
    line-height: 20px;
    padding-bottom: 12px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #606266;
    border-bottom: 1px solid #ebeef5;
  }
  .header .switch_icon_pre {
    float: left;
    font-size: 12px;
    color: #303133;
  }
  .header .switch_icon_aft {
    float: right;
    font-size: 12px;
    color: #303133;
  }
  .header .switch_icon_pre:hover {
    color: #409eff;
  }
  .header .switch_icon_aft:hover {
    color: #409eff;
  }
  .month-table {
    color: #606266;
    font-size: 12px;
  }
  .month-table .table-cell-box {
    height: 75px;
    width: 75px;
    display: inline-block;
    position: relative;
  }
  .month-table .table-cell-box .cell {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 30px;
    line-height: 30px;
    margin-top: -15px;
    text-align: center;
    cursor: pointer;
  }
  .current {
    color: #409EFF;
  }
  .disabled {
    color: #c0c4cc;
    background-color: #f5f7fa;
    cursor: not-allowed;
  }
  .active {
    background: #409EFF;
    color: #fff;
  }
  .inRange {
    background: #409EFF;
    color: #fff;
  }
  .range_start {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }
  .range_end {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  }
</style>
