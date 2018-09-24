<template>
  <div class="wrapper_quater">
    <el-popover
      v-model="isShow"
      placement="bottom"
      trigger="focus"
      width="250"
      ref="quater_popover">
      <el-input
        slot="reference"
        :size="size"
        placeholder="请输入内容"
        prefix-icon="el-icon-date"
        v-model="quaterString"
        clearable
        ref="quaterInput"
        readonly="true"
        @focus="showPick">
      </el-input>
      <div class="quater_pick">
        <div class="wrapper_pick">
          <div class="el-date-picker__header el-date-picker__header--bordered">
            <button
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left" @click.stop="switchYearPre">
            </button>
            <span
              role="button"
              class="el-date-picker__header-label">{{ year }} 年</span>
            <button
              type="button"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right" @click.stop="switchYearAft">
            </button>
          </div>
          <table class="quater-table_wrapper">
            <tr v-for="row in rows">
              <td v-for="col in row">
                <el-button
                  size="small"
                  :class="{'active-button': value === col.quaterString}"
                  :disabled="col.disabled"
                  @click.stop="getTimeByQuater(col)">
                  {{col.name}}
                </el-button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "quaterDate",
  props: {
    value: {},
    size: {
      default: 'small'
    }
  },
  data () {
    return {
      year: null,
      isShow: false,
      rows: [
        [
          {name: '第 1 季度', disabled: false, id: 1, startDate: '01-01', endDate: '03-31', fullDateStart: null, fullDateEnd: null, isActive: false},
          {name: '第 2 季度', disabled: false, id: 2, startDate: '04-01', endDate: '06-30', fullDateStart: null,
            fullDateEnd: null, isActive: false}
        ],
        [
          {name: '第 3 季度', disabled: false, id: 3, startDate: '07-01', endDate: '09-30', fullDateStart: null,
            fullDateEnd: null, isActive: false},
          {name: '第 4 季度', disabled: false, id: 4, startDate: '10-01', endDate: '12-31', fullDateStart: null,
            fullDateEnd: null, isActive: false}
        ]
      ]
    }
  },
  computed: {
    quaterString: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change', null)
        this.$emit('input', null)
      }
    }
  },
  methods: {
    showPick () {
      this.isShow = true
    },
    hidePick () {
      this.isShow = false
    },
    getTimeByQuater (col) {
      if (!col.disabled) {
        let quaterString = this.year + ' ' + col.name
        let today = new Date()
        let timestamp = Date.parse(today)
        if (timestamp < Date.parse(new Date(col.fullDateEnd))) {
          let todayString = this.getDateString(today.getFullYear(), today.getMonth(), today.getDate(), 'day')
          this.$emit('change',[col.fullDateStart, todayString])
        } else {
          this.$emit('change',[col.fullDateStart, col.fullDateEnd])
        }
        this.$emit('input', quaterString)
        this.hidePick()
      }
    },
    setTimeByQuater () {
      let timestampNow = Date.parse(new Date())
      for (let i = 0; i < this.rows.length; i++) {
        let row = this.rows[i]
        for (let j = 0; j < row.length; j++) {
          let startString = this.year + '-' + row[j].startDate
          let endString = this.year + '-' + row[j].endDate
          let timestamp = Date.parse(new Date(startString))
          // 获取季度的完整日期
          // 当前选项季度字符
          this.rows[i][j].quaterString = this.year + ' ' + this.rows[i][j].name
          // 当前选项季度对应日期的起始时间
          this.rows[i][j].fullDateStart = startString
          // 当前选项季度对应日期的结束时间
          this.rows[i][j].fullDateEnd = endString
          // 当前季度是否禁选
          if (timestampNow < timestamp) {
            this.rows[i][j].disabled = true
          } else {
            this.rows[i][j].disabled = false
          }
        }
      }
    },
    // 年的切换
    switchYearPre () {
      this.year = parseInt(this.year) - 1
      this.setTimeByQuater()
    },
    switchYearAft () {
      this.year = parseInt(this.year) + 1
      this.setTimeByQuater()
    },
    checkArea (e) {
      if (!this.$el.contains(e.target)) {
        this.isShow = false
      }
    },
    // 今日 0时0分0秒的时间戳
    getTodayTimeStamp () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let dateString = [year, month, day].join('-')
      return Date.parse(new Date(dateString))
    },
    // 时间操作函数
    getFullTime (string, type) {
      let date = this.getDateString(string.getFullYear(), string.getMonth(), string.getDate(), type)
      return date
    },
    // 获取日期字符
    getDateString (year, month, day, type) {
      month = parseInt(month) + 1
      if (month < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      // 格式 xxxx-xx-xx
      if (type === 'year') {
        return year.toString()
      }
      // 格式 xxxx-xx-xx
      if (type === 'month') {
        return year + '-' + month
      }
      // 格式 xxxx-xx-xx
      if (type === 'day') {
        return year + '-' + month + '-' + day
      }
    },
    // 季度字符串转化为月份
    getYearFromString (string) {
      this.year = string.match(/^[0-9]+/g)[0]      // 从季度字符串中拿到年
      // let quarter = parseInt(string.match(/ [1-4]+ /g)[0]) // 从季度字符串中拿到季度
      this.setTimeByQuater()
    }
  },
  mounted () {
    // 事件捕获
    // document.addEventListener('click', this.checkArea, true)
    let re = new RegExp(/^[0-9]+ 第 [1-4]+ 季度$/g)
    if (this.value && re.test(this.value)) {
      this.getYearFromString (this.value)
    } else {
      let today = new Date()
      this.year = today.getFullYear()
      this.setTimeByQuater()
    }
  },
  beforeDestroy() {
    // document.removeEventListener('click', this.checkArea, true)
  }
}
</script>
<style scoped>
  .wrapper_quater {
    position: relative;
    width: 160px;
  }
  .wrapper_quater .quater_pick .date-pick_arrow-switch{
    padding: 5px 10px;
    text-align: center;
  }
  .wrapper_quater .quater_pick .date-pick_arrow-switch button{
    margin-right: 10px;
  }
  .quater_pick .el-picker-panel__icon-btn{
    margin-top: 4px;
  }
  .quater_pick .wrapper_pick{

  }
  .quater-table_wrapper{
    height: 150px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .quater-table_wrapper td{
    padding: 15px 10px;
    text-align: center;
  }
  .quater-table_wrapper span{
    display: inline-block;
    height: 100%;
    width: 100%;
    font-size: 12px;
    line-height: 20px;
    border-radius: 4px;
    border: 1px solid #eee;
  }
  .quater_arrow{
    position: relative;
    height: 6px;
    width: 12px;
    box-sizing: border-box;
    top: -6px;
    left: 50%;
    margin-right: 6px;
    background-color: transparent;
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
  }
  .quater_arrow::after{
    position: absolute;
    content: '';
    border-width: 6px;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    top: 1px;
    left: 50%;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #fff;
  }
  .quater_arrow::before{
    position: absolute;
    content: '';
    border-width: 6px;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    top: 0px;
    left: 50%;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #e4e7ed;
  }
  .active-button {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff
  }
</style>
