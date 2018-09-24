<template>
  <div class="date-table">
    <transition name="fade">      
      <table class="date-table_wrapper">
        <tr>
          <td v-for="week in Weeks">{{ week }}</td>
        </tr>
        <tr v-for="(row, index) in rows">
          <td v-for="(cell, column) in row">
            <span
              v-if="!cell.limit"
              :class="{'other-day': (cell.type === 'prev-month') || (cell.type === 'next-month') || cell.limit, 'today': cell.isToday, 'selected': cell.dateString === activeString}"
              @click="select(cell)">
                {{ cell.text }}
            </span>
            <span v-else class="limit_day">{{ cell.text }}</span>
          </td>
        </tr>
      </table>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'datePickers',
  props: {
    date: {},
    value: {}
  },
  data () {
    return {
      Weeks: ['日', '一', '二', '三', '四', '五', '六'],
      tableRows: [ [], [], [], [], [], [] ],
      today: null,          // 当前日期
      currentYear: null,    // 当前的年份
      currentMonth: null    // 当前的月份
    }
  },
  computed: {
    // 已选定的目标日期
    activeString: {
      get () {
        return this.value
      },
      set () {}
    },
    // 可切换的年份
    year () {
      let date = this.date ? new Date(this.date) : new Date()
      return date.getFullYear()
    },
    // 月份取值 0 ~ 11
    month () {
      let date = this.date ? new Date(this.date) : new Date()
      return date.getMonth()
    },
    /*
    day () {
      let date = new Date(this.date)
      return date.getDate()
    },
    */
    startDate () {
      return this.getStartDateOfMonth(this.year, this.month)
    },
    rows () {
      // 本月一号日期
      const date = new Date(this.year, this.month, 1)
      // 本月第一天的星期
      let day = this.getFirstDayOfMonth(date) // day of first day
      day = (day === 0 ? 7 : day)

      // 本月的天数
      const dateCountOfMonth = this.getDayCountOfMonth(date.getFullYear(), date.getMonth())
      // 上个月的天数
      const dateCountOfLastMonth = this.getDayCountOfPreMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1))

      const datesArry = this.tableRows
      let count = 1

      // 获取当前月需要渲染的日期
      for (let i = 0; i < 6; i++) {
        const row = datesArry[i]

        for (let j = 0; j < 7; j++) {
          let cell = row[j]

          if (!cell) {
            cell = { row: i, column: j, type: 'normal', isToday: false, dateString: null, limit: false }
          }

          cell.type = 'normal'
          // 获取每个cell对应的日期
          if (i >= 0 && i <= 1) {
            if (j + i * 7 >= day) {
              cell.text = count++
            } else {
              cell.text = dateCountOfLastMonth - (day - j % 7) + 1 + i * 7
              cell.type = 'prev-month'
            }
          } else {
            if (count <= dateCountOfMonth) {
              cell.text = count++
            } else {
              cell.text = count++ - dateCountOfMonth
              cell.type = 'next-month'
            }
          }
          // 判断是否是今天
          if ((this.currentYear === this.year) && (this.currentMonth === this.month) && (this.today === cell.text) && (cell.type === 'normal')) {
            cell.isToday = true
          } else {
            cell.isToday = false
          }

          // 设置cell标识符  以"年-月-日"对应的字符为唯一标识
          if (cell.type === 'prev-month') {
            cell.dateString = this.getTimeString(this.year, this.month - 1, cell.text)
            if (this.month === 0) {
              cell.dateString = this.getTimeString(this.year - 1, 11, cell.text)
            }
          } else if (cell.type === 'next-month') {
            cell.dateString = this.getTimeString(this.year, this.month + 1, cell.text)
            if (this.month === 11) {
              cell.dateString = this.getTimeString(this.year + 1, 0, cell.text)
            }
          } else {
            cell.dateString = this.getTimeString(this.year, this.month, cell.text)
          }
          // 判断日期是否在today 之后 true: 限制该日期的被选择
          let timestamp = Date.parse(new Date(cell.dateString))
          let todayString = this.getTimeString(this.currentYear, this.currentMonth, this.today)
          let timestampNow = Date.parse(new Date(todayString))

          if (timestamp > timestampNow) {
            cell.limit = true
          } else {
            cell.limit = false
          }
          // 保存
          this.$set(row, j, cell)
        }
      }
      // console.log(datesArry)
      return datesArry
    }
  },
  mounted () {
    // 初始化数据
    const currentDate = new Date()
    this.today = currentDate.getDate()
    this.currentYear = currentDate.getFullYear()
    this.currentMonth = currentDate.getMonth()
  },
  methods: {
    // 统计月份的天数
    getDayCountOfMonth (year, month) {
      // 偶数月
      if (month === 3 || month === 5 || month === 8 || month === 10) {
        return 30
      }
      // 如果是二月份 判断是否是闰年
      if (month === 1) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          return 29
        } else {
          return 28
        }
      }
      // default值
      return 31
    },
    // 统计前一个月的天数
    getDayCountOfPreMonth (year, month) {
      // 1月份时，往前一年获取上一个月的天数
      if (month === 0) {
        year = year - 1
      }
      return this.getDayCountOfMonth(year, month)
    },
    // 获取月份 1号的星期  return值 0 || 1 || 2 || 3 || 4 || 5 || 6
    getFirstDayOfMonth (date) {
      const temp = new Date(date.getTime())
      temp.setDate(1)
      return temp.getDay()
    },
    // 返回 年 - 月 - 日构成的字符串
    getTimeString (year, month, day) {
      month = parseInt(month) + 1
      if (month < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      // 格式 xxxx-xx-xx
      return year + '-' + month + '-' + day
    },
    prevDate (date, amount = 1) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount)
    },
    nextDate (date, amount = 1) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
    },
    getStartDateOfMonth (year, month) {
      const result = new Date(year, month, 1)
      const day = result.getDay()

      if (day === 0) {
        return this.prevDate(result, 7)
      } else {
        return this.prevDate(result, day)
      }
    },
    // 点击目标日期
    select (cell) {
      if (!cell.limit) {
        // this.dateString = cell.dateString
        this.$emit('upDate', cell.dateString)
      }
    }
  }
}
</script>

<style scoped>
  .date-pickers{
    position: relative;
  }
  .date-box{
    position: absolute;
    bottom: -1px;
    left: 0;
    z-index: 100;
  }
  .el-date-table tr{
    height: 30px;
  }
  .date-table{
    padding: 0px 10px;
    box-sizing: border-box;
  }
  .date-table_wrapper{
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
  .date-table_wrapper tr{
    height: 32px;
    box-sizing: border-box;
  }
  .date-table_wrapper th{
    font-size: 12px;
  }
  .date-table_wrapper td{
    font-size: 12px;
    text-align: center;
  }
  .date-table_wrapper span{
    display: block;
    height: 25px;
    line-height: 25px;
    margin: 0 auto;
    width: 25px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .date-table_wrapper span:hover {
    color: #409eff;
  }
  .other-day{
    color: #c0c4cc;
  }
  .today{
    color: #409eff;
  }
  .limit_day{
    color: #c0c4cc;
  }
  .limit_day:hover{
    cursor: not-allowed;
    color: #c0c4cc !important;
  }
  .selected{
    border-radius: 100%;
    border: 1px solid #409eff;
    background-color: #409eff;
    color: #fff;
  }
</style>