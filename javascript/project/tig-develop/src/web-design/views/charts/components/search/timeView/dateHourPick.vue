<!--   自定义日历选择组件   /-->
<!--   可通过滑块拖动来选择时间  /-->
<template>
  <div class="date-pick_wrapper" style="width: 300px">

    <div class="top">
      <span class="input_date">
        <el-input v-model="inputDateString" size="small" placeholder="日期" readonly></el-input></span>
      <span class="input_time">
        <el-input v-model="inputHourString" size="small" placeholder="时间" readonly></el-input></span>
    </div>

    <div class="date-pick_arrow-switch">
      <span class="switch_icon_pre" @click="switchYearPre"><i class="el-icon-d-arrow-left"></i></span>
      <span class="switch_icon_pre" @click="switchMonthPre"><i class="el-icon-arrow-left"></i></span>
      <span class="switch_icon_aft" @click="switchYearAft"><i class="el-icon-d-arrow-right"></i></span>
      <span class="switch_icon_aft" @click="switchMonthAft"><i class="el-icon-arrow-right"></i></span>
      <span class="year">{{year}} 年</span>
      <span class="month">{{month + 1}} 月</span>
    </div>

    <date-table :date="tableString" :value="inputDateString" @upDate="getDateChange"></date-table>

    <div class="time-slider">
      <div class="slider-wrapper">
        <span class="slider_label">时</span>
        <span class="slider_box"><el-slider :min="0" :max="23" v-model="hour" @change="getHourChange"></el-slider></span>
      </div>
    </div>

    <div class="bottom_bar" style="text-align: right">
      <span class="tips" v-if="warnTips"><i class="el-icon-warning"></i><span>起始时间应小于结束时间</span></span>
      <el-button type="info" size="mini" @click="close">取消</el-button>
      <el-button type="primary" size="mini" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import dateTable from './dateTable.vue'
export default {
  name: 'datePickers',
  props: {
    value: {},
    type: {},
    relativeValue: {}
  },
  data () {
    return {
      year: null,
      month: null,
      day: null,
      hour: 0,
      // inputHourString: null,
      inputDateString: null,    // input框value值，变化时也影响table表
      warnTips: false
    }
  },
  computed: {
    // 日历table表渲染内容 受year/month/day等变化影响
    tableString: {
      get () {
        let year = this.year
        let month = parseInt(this.month) + 1
        let day
        if (month < 10) {
          month = '0' + month
        }
        if (parseInt(this.day) < 10) {
          day = '0' + this.day
        } else {
          day = this.day
        }
        return year + '-' + month + '-' + day
      },
      set () {

      }
    },
    inputHourString () {
      return `${this.hour} 时`
    },
    fullDateString () {
      let hour = parseInt(this.hour) < 10 ? '0' + this.hour : this.hour
      return `${this.inputDateString}-${hour}`
    }
  },
  watch: {
    fullDateString () {
      if (this.relativeValue && !this.isValueValid()) {
        this.warnTips = true
      } else {
        this.warnTips = false
      }
    }
  },
  components: {
    'date-table': dateTable
  },
  mounted () {
    if (this.value) {
      let date = new Date(this.transformat(this.value))
      this.handleTime(date)
      this.inputDateString = this.getdateString(date.getFullYear(), date.getMonth(), date.getDate())
    } else {
      let date = new Date()
      this.handleTime(date)
      this.inputDateString = this.getdateString(date.getFullYear(), date.getMonth(), date.getDate())
    }
  },
  methods: {
    transformat (string) {
      let splitArr = string.split('-')
      let year = splitArr[0]
      let month = splitArr[1]
      let day = splitArr[2]
      let hour =splitArr[3]
      return `${year}-${month}-${day} ${hour}:00:00`
    },
    handleTime (date) {
      this.year = date.getFullYear()
      this.month = date.getMonth()
      this.day = date.getDate()
      this.hour = date.getHours()
    },
    getdateString (year, month, day) {
      month = parseInt(month) + 1
      if (month < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      return year + '-' + month + '-' + day
    },
    getSliderHour (hour) {
      this.hour = hour
    },
    getSliderMinu (minu) {
      this.minu = minu
    },
    getSliderSec (sec) {
      this.sec = sec
    },
    // 年的切换
    switchYearPre () {
      this.year = parseInt(this.year) - 1
    },
    switchYearAft () {
      this.year = parseInt(this.year) + 1
    },
    // 月份的切换  取值范围 0 ~ 11
    switchMonthPre () {
      let month = parseInt(this.month) - 1
      if (month < 0) {
        this.month = 11
        this.switchYearPre()
      } else {
        this.month = month
      }
    },
    // 取值范围 0 ~ 11
    switchMonthAft () {
      let month = parseInt(this.month) + 1
      if (month >= 12) {
        this.month = 0
        this.switchYearAft()
      } else {
        this.month = month
      }
    },
    // 获取选取的日期
    getDateChange (string) {
      let dateString = new Date(string)
      this.inputDateString = string
      // 根据pre-month/next-month 更新table
      this.year = dateString.getFullYear()
      this.month = dateString.getMonth()
      this.day = dateString.getDate()
    },
    // input value改变时更新table表的显示
    inputUpdate (val) {
      var date = new Date(val)
      var exp = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/g
      if (exp.test(val)) {
        this.year = date.getFullYear()
        this.month = date.getMonth()
        this.day = date.getDate()
        this.hour = date.getHours()
        this.minu = date.getMinutes()
        this.sec = date.getSeconds()
      }
      // 触发 v-model绑定值得更新
      this.$emit('input', val)
    },
    // 设置小时
    getHourChange (value) {
      this.hourString = `${this.hour} 时`
    },
    close () {
      this.$emit('close')
    },
    // 检查输入的合法性
    isValueValid () {
      if (this.type === 'START') {
        let dateStart = this.transformat(this.fullDateString)
        let dateEnd = this.transformat(this.relativeValue)
        let startTimestamp = new Date(dateStart).getTime()
        let endTimestamp = new Date(dateEnd).getTime()
        return startTimestamp <= endTimestamp
      } else if (this.type === 'END') {
        let dateStart = this.transformat(this.relativeValue)
        let dateEnd = this.transformat(this.fullDateString)
        let startTimestamp = new Date(dateStart).getTime()
        let endTimestamp = new Date(dateEnd).getTime()
        return startTimestamp <= endTimestamp
      } else {
        return true
      }
    },
    submit () {
      if (this.relativeValue && !this.isValueValid()) {
        // this.warnTips = true
        return false
      }
      this.$emit('submit', this.fullDateString)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
  .top{
    width: 300px;
    box-sizing: border-box;
    font-size: 0;
    padding: 0px 0px 12px 0px;
    border-bottom: 1px solid #ebeef5;
  }
  .top .input_date {
    display: inline-block;
    width: 150px;
    margin-right: 20px;
    box-sizing: border-box;
    vertical-align: middle;
    height: 32px;
  }
  .top .input_time {
    display: inline-block;
    width: 130px;
    box-sizing: border-box;
    vertical-align: middle;
    height: 32px;
  }
  .date-pick_wrapper {
    width: 300px;
    color: #606266;
    background: #fff;
    line-height: 30px;
    box-sizing: border-box;
  }
  .date-pick_arrow-switch {
    text-align: center;
    /*border-bottom: 1px solid #ebeef5;*/
  }
  .date-pick_arrow-switch .switch_icon_pre, .date-pick_arrow-switch .switch_icon_aft {
    font-size: 14px;
    height: 42px;
    line-height: 42px;
  }
  .date-pick_arrow-switch .marginR {
    margin-right: 5px;
  }
  .date-pick_arrow-switch .switch_icon_pre {
    float: left;
  }
  .date-pick_arrow-switch .switch_icon_aft {
    float: right;
  }
  .date-pick_arrow-switch .switch_icon_pre:hover {
    color: #409eff;
  }
  .date-pick_arrow-switch .switch_icon_aft:hover {
    color: #409eff;
  }
  .date-pick_arrow-switch .year,.date-pick_arrow-switch .month{
    font-size: 16px;
    line-height: 42px;
    vertical-align: middle;
  }
  .date-pick_arrow-switch button{
    margin-right: 10px;
  }
  .time-slider{
    position: relative;
    padding: 0px 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .slider-wrapper{
    display: flex;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
  }
  .slider_label{
    width: 38px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-size: 14px;
  }
  .slider_box{
    flex: 1;
    padding: 0 5px 0 10px;
    box-sizing: border-box;
  }
  .date-pick_wrapper .bottom_bar {
    font-size: 0;
    height: 28px;
  }
  .bottom_bar .tips {
    display: inline-block;
    font-size: 13px;
    color: #F56C6C;
    float: left;
    line-height: 28px;
    vertical-align: middle;
  }
  .bottom_bar .tips i {
    margin-right: 5px;
  }
</style>
<style>
  .top .el-input__inner {
    text-align: center;
  }
</style>