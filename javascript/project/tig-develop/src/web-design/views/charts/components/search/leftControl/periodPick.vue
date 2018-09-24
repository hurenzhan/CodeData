<!-- 周期选择控件 /-->
<!-- 其中 日为时间范围控件,日、月、年、周使用了element-ui控件,季度、小时使用高仿elementUi风格自定义开发控件 /-->
<template>
  <div class="period-wrapper" v-if="show">
    <el-popover
      placement="right-end"
      popper-class="date-compare-double-wrap"
      :disabled="yoyAndMomDateFlag"
      trigger="hover">
      <div class="date-compare-double">
        {{ `${isCheckedYearCompare && yoyAndMomDate ? '同比时间：'+ yoyAndMomDate['yoyStartDate'] +' 00:00  至 ' + yoyAndMomDate['yoyEndDate'] + ' 23:00' : '' }` }}<br/>
        {{ `${isCheckedMonthCompare && yoyAndMomDate ? '环比时间：' + yoyAndMomDate['momStartDate'] + ' 00:00  至 ' + yoyAndMomDate['momEndDate'] + ' 23:00': '' }`}}
      </div>
      <i :style="{display: isCheckedYearMonthCompare ? 'block': 'none'}" class="icon-info" slot="reference"></i>
    </el-popover>
    <div class="period-select">
      <span class="name">日期选择 :</span>
      <el-select class="select-container" v-model="selectedKey" placeholder="周期选择" size="small">
        <el-option
          v-for="item in periodData.selected"
          v-if="!item.disabled"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- 日/周/月/年 选择控件/-->
      <span class="pick-container" v-if="[1, 2, 5].includes(selectedKey) || (selectedKey === 3 && !isRange)">
        <el-date-picker
          size="small"
          v-model="dateNow"
          :type="periodData.type"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="center"
          :format="periodData.format"
          :value-format="periodData.valueFormat"
          :default-value="periodData.defaultValue"
          :picker-options="pickerOptions"
          :disabled="selectedKey === 0"
          @change="changeDate">
        </el-date-picker>
      </span>
      <!-- 实时控件/-->
      <span class="pick-container" v-show="selectedKey === 0">
        <div class="real">{{realTime}}</div>
      </span>
      <!-- 按季度选择控件/-->
      <span class="pick-container" v-if="selectedKey === 4">
        <quater-date v-model="dateNow" @change="changeDate"></quater-date>
      </span>
      <!-- 小时控件 /-->
      <span class="pick-container" v-if="selectedKey === 6">
        <my-time-pick v-model="dateNow" @change="changeDate"></my-time-pick>
      </span>
      <!-- 月范围控件 /-->
      <span class="pick-container" v-if="selectedKey === 3 && isRange">
        <month-range  v-model="dateNow" @change="changeDate"></month-range>
      </span>
      <template v-if="compare">
        <!-- 对比期部分 -->
        <span class="name" style="margin-left: 24px;" v-if="compare">对比日期 :</span>
        <!-- 日/周/月/年 选择控件/-->
        <span class="compare-container" v-if="[0, 1, 2, 5].includes(selectedKey) || (selectedKey === 3 && !isRange)">
          <el-date-picker
            size="small"
            v-model="dateCompare"
            :type="periodData.type"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            :format="periodData.format"
            :value-format="periodData.valueFormat"
            :default-value="periodData.defaultValue"
            :picker-options="pickerOptions"
            @change="changeCompare">
          </el-date-picker>
        </span>
        <!-- 按季度选择控件/-->
        <span class="compare-container" v-if="selectedKey === 4">
          <quater-date v-model="dateCompare" @change="changeCompare"></quater-date>
        </span>
        <!-- 小时控件 /-->
        <span class="compare-container" v-if="selectedKey === 6">
          <my-time-pick v-model="dateCompare" @change="changeCompare"></my-time-pick>
        </span>
        <!-- 月范围控件 /-->
        <span class="compare-container" v-if="selectedKey === 3 && isRange">
          <month-range  v-model="dateCompare" @change="changeCompare"></month-range>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import eventBus from '../../../utils/eventBus'
import quaterDate from '../otherView/quaterDate'
import myTimePick from '../timeView/customTimePick'
import monthRange from '../timeView/monthRange'
// 时间操作相关方法
import time from '../searchMixins/time.js'
import searchMixinComputed from '../searchMixins/searchMixinComputed'
export default {
  name: "periodPick",
  props: ['index'],
  mixins: [time, searchMixinComputed],
  data () {
    return {
      dateNow: null,
      dateCompare: null,
      realTime: '',
      minDate: '',
      pickerOptions: {
        disabledDate: (value) => {
          return this.checkDate(value)
        },
        onPick: (value) => {
          if (value.minDate && !value.maxDate) {
            this.minDate = value.minDate
          } else {
            this.minDate = ''
          }
        }
      }
    }
  },
  computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
    show () {
      if (!this.currentContainer.feature.periodData) {
        this.currentContainer.feature.periodData = []
      }

      if (this.currentContainer.feature.periodData.length > 0
        && this.currentContainer.feature.periodData[0].selected.some(item => !item.disabled)) {
        return true
      } else {
        return false
      }
    },
    periodData () {
      if (!this.currentContainer.feature.periodData) {
        this.currentContainer.feature.periodData = []
      }

      if (this.currentContainer.feature.periodData.length > 0) {
        return this.currentContainer.feature.periodData[0]
      } else {
        return {}
      }
    },
    compare () {
      if (!this.periodData.dateData) {
        this.periodData.dateData = []
      }
      return this.periodData.dateData.length > 1 ? true : false
    },
    selectedKey: {
      get () {
        return this.periodData.selectedKey !== undefined ? this.periodData.selectedKey : 1
      },
      set (value) {
        this.dateNow = null
        this.dateCompare = null
        this.$store.commit('selectedType', {
          index: this.index,
          key: value
        })
        // 切换周期类型初始化一次
        this.setInitData(value)
        if (this.compare) {
          this.setInitCompareData(value)
        }
      }
    },
    // 当前控件的时间限制范围
    limitRange () {
      let limit = ''
      let period = this.currentContainer.feature.periodData[0]
      period.selected && period.selected.forEach(item => {
        if (item.value === this.selectedKey) {
          limit = item.limitRange !== undefined ? item.limitRange : ''
        }
      })
      return limit
    },
    isRange () {
      if (this.periodData.isRange === undefined) {
        return false
      } else {
        return this.periodData.isRange
      }
    }
  },
  watch: {
    compare (newValue) {
      if (newValue) {
        this.setInitCompareData(this.selectedKey)
      }
    }
  },
  components: {
    quaterDate,
    myTimePick,
    monthRange
  },
  methods: {
    getPickDate (value) {
      console.log('getPickDate', value)
    },
    // 对时间控件设置不可选择的条件
    checkDate (value) {
      let isdiabled = false
      let today = new Date()
      switch(this.selectedKey) {
        // 禁选的天
        case 1:
          if (Date.parse(value) > this.getTodayTimeStamp() || this.dateRangeLimit(value)) {
            isdiabled =  true
          }
          break;
        // 禁选的周
        case 2:
          if ( Date.parse(value) > (Date.parse(this.getMondayOfWeek()) + 7 * 24 * 60 * 60 * 1000) ) {
            isdiabled = true
          }
          break;
        // 禁选的月
        case 3:
          if (Date.parse(value) > Date.parse(this.getDateString(today.getFullYear(), today.getMonth(), today.getDate(), 'month'))) {
            isdiabled =  true
          }
          break;
        // 禁选的季度
        case 4:
          break;
        // 禁选的年
        case 5:
          if ( parseInt(value.getFullYear()) > parseInt(today.getFullYear()) ) {
            isdiabled = true
          }
          break;
      }
      return isdiabled
    },
    // 限制 周期控件为天时 取值区间
    dateRangeLimit (date) {
      if (!this.minDate || this.limitRange === '') {
        return false
      }
      let count = parseInt(this.limitRange)
      let limitMax = Date.parse(this.minDate) + count * 24 * 60 * 60 * 1000
      let limitMin = Date.parse(this.minDate) - count * 24 * 60 * 60 * 1000
      return Date.parse(date) >= limitMax || Date.parse(date) <= limitMin ? true : false
    },
    // 选中 当value === null 时表示删除选中的日期
    changeDate (value) {
      if (value !== null) {
        // 控件类型是周时的特殊处理
        if (this.selectedKey === 2) {
          value = this.transformForWeek(value)
        }
        this.$store.commit('currentPeriodTime', {
          index: this.index,
          selectedKey: this.selectedKey,
          value
        })
      } else {
        this.$store.commit('clearcurrentPeriodTime', {
          index: this.index,
          selectedKey: this.selectedKey,
          value
        })
      }
    },
    changeCompare (value) {
      if (value !== null) {
        // 控件类型是周时的特殊处理 key === 2时 value是周当中的周一时间对象
        if (this.selectedKey === 2) {
          value = this.transformForWeek(value)
        }
        this.$store.commit('compredPeriodTime', {
          index: this.index,
          selectedKey: this.selectedKey,
          value
        })
      } else {
        this.$store.commit('claercompredPeriodTime', {
          index: this.index,
          selectedKey: this.selectedKey,
          value
        })
      }
    },
    // 初始化本期时间
    setInitData (key) {
      // console.log('setInitData', key)
      clearInterval(this.realTimer)
      let timestamp = Date.parse(new Date())
      // type 0 表示默认值采用当天/周/月的数据 type 1 表示默认值采用前一天/周/月的数据
      let type = 0
      let isRange = true
      this.periodData.selected.forEach(item => {
        if (item.value === key) {
          type = item.type
          isRange = item.isRange ? true : false
        }
      })
      switch(key) {
        // 天
        case 0:

          this.dateNow = [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')]
          this.changeDate(this.dateNow)

          // 初始化
          this.realTime = this.getFullDateTime(new Date())
          // 实时时间变化
          this.realTimer = setInterval(this.getRealTime, 1000)
          break;
        case 1:
          if (type === 1) {
            this.dateNow = isRange ? [this.getPreDate(new Date()), this.getPreDate(new Date())] : this.getPreDate(new Date())
            this.changeDate(this.dateNow)
          } else {
            this.dateNow = isRange ? [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')] : this.getFullTime(new Date(), 'day')
            this.changeDate(this.dateNow)
          }
          break;
        // 周
        case 2:
          if (type === 1) {
            this.dateNow = this.getMondayOfPreWeek()     // element Ui 根据当前时间对象 自动获取当前周
            this.changeDate(this.getMondayOfPreWeek())   // 初始化周时   周组件无法自动触发change事件, 自主触发
          } else {
            this.dateNow = new Date()                    // element Ui 根据当前时间对象 自动获取当前周
            this.changeDate(this.getMondayOfWeek())      // 初始化周时   周组件无法自动触发change事件, 自主触发
          }
          break;
        // 月
        case 3:
          if (type === 1) {
            this.dateNow = isRange ? [this.getPreMonth(new Date()), this.getPreMonth(new Date())] : this.getPreMonth(new Date())
            this.changeDate(this.dateNow)
          } else {
            this.dateNow =  isRange ? [this.getFullTime(new Date(), 'month'), this.getFullTime(new Date(), 'month')] : this.getFullTime(new Date(), 'month')
            this.changeDate(this.dateNow)
          }
          break;
        // 季
        case 4:
          let today = new Date()
          let year = today.getFullYear()
          let month = today.getMonth()
          let quater = Math.ceil(month/3)
          if (type === 1) {
            // 前一季度
            quater = quater - 1
            this.dateNow = `${year} 第 ${quater} 季度`
            this.changeDate(this.getQuaterOfYear(quater))
          } else {
            // 当前季度
            this.dateNow = `${year} 第 ${quater} 季度`
            this.changeDate(this.getQuaterOfYear(quater))
          }
          break;
        // 年
        case 5:
          if (type === 1) {
            this.dateNow = this.getPreYear(new Date())
            this.changeDate(this.dateNow)
          } else {
            this.dateNow = this.getFullTime(new Date(), 'year')
            this.changeDate(this.dateNow)
          }
          break;
        // 时
        case 6:
          this.dateNow = [this.getHourByCount(type), this.getHourByCount(type)]
          this.changeDate(this.dateNow)
          break;
        // 天
        default:
          if (type === 1) {
            this.dateNow = this.getPreDate(new Date())
            this.changeDate(this.dateNow)
          } else {
            this.dateNow = [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')]
            this.changeDate(this.dateNow)
          }
          break;
      }
    },
    // 初始化对比期的时间
    setInitCompareData (key) {
      let timestamp = Date.parse(new Date())
      let type = 0
      let isRange = true
      this.periodData.selected.forEach(item => {
        if (item.value === key) {
          type = item.compareType
          isRange = item.isRange ? true : false
        }
      })
      switch(key) {
        // 实时 对比期
        case 0:
          let date = this.getPreDate(new Date())
          this.dateCompare = [date, date]
          this.changeCompare(this.dateCompare)
          break;
        // 天
        case 1:
          switch (parseInt(type)) {
            // 当天
            case 0:
              if (isRange) {
                this.dateCompare = [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')]
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getFullTime(new Date(), 'day')
                this.changeCompare(this.dateCompare)
              }
              break;
            // 前一天
            case 1:
              if (isRange) {
                this.dateCompare = [this.getPreDate(new Date()), this.getPreDate(new Date())]
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getPreDate(new Date())
                this.changeCompare(this.dateCompare)
              }
              break;
            // 同比日期 => 底层数据是可配的,此处调用接口查询
            case 2:
              break;
            // 环比日期 => 相对本期的偏移
            case 3:
              if (isRange) {
                this.dateCompare = this.getCycleCompare(key)
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getCycleCompare(key)[0]
                this.changeCompare(this.dateCompare)
              }
              break;
            // 前两日
            case 4:
              if (isRange) {
                this.dateCompare = [this.getPreDateByCount(new Date(), 2), this.getPreDateByCount(new Date(), 2)]
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getPreDateByCount(new Date(), 2)
                this.changeCompare(this.dateCompare)
              }
              break;
            default:
              if (isRange) {
                this.dateCompare = [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')]
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getFullTime(new Date(), 'day')
                this.changeCompare(this.dateCompare)
              }
              break;
          }
          break;
        // 周
        case 2:
          switch (parseInt(type)) {
            // 前一周
            case 0:
              this.dateCompare = new Date()
              this.changeCompare(this.getMondayOfWeek())
              break;
            // 当周
            case 1:
              this.dateCompare = this.getMondayOfPreWeek()     // element Ui 根据当前时间对象 自动获取当前周
              this.changeCompare(this.getMondayOfPreWeek())    // 初始化周时   周组件无法自动触发change事件, 自主触发
              break;
            case 2:
              break;
            case 3:
              break;
            default:
              this.dateCompare = new Date()
              this.changeCompare(this.getMondayOfWeek())
              break;
          }
          break;
        // 月
        case 3:
          switch (parseInt(type)) {
            // 当月
            case 0:
              if (isRange) {
                this.dateCompare = [this.getFullTime(new Date(), 'month'), this.getFullTime(new Date(), 'month')]
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getFullTime(new Date(), 'month')
                this.changeCompare(this.dateCompare)
              }
              break;
            // 前一月
            case 1:
              if (isRange) {
                this.dateCompare = [this.getPreMonth(new Date()), this.getPreMonth(new Date())]
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getPreMonth(new Date())
                this.changeCompare(this.dateCompare)
              }
              break;
            // 同比
            case 2:
              break;
            // 环比
            case 3:
              if (isRange) {
                this.dateCompare = this.getCycleCompare(key)
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getCycleCompare(key)[0]
                this.changeCompare(this.dateCompare)
              }
              break;
            default:
              if (isRange) {
                this.dateCompare = [this.getFullTime(new Date(), 'month'), this.getFullTime(new Date(), 'month')]
                this.changeCompare(this.dateCompare)
              } else {
                this.dateCompare = this.getFullTime(new Date(), 'month')
                this.changeCompare(this.dateCompare)
              }
              break;
          }
          break;
        // 季
        case 4:
          let today = new Date()
          let year = today.getFullYear()
          let month = today.getMonth()
          let quater = Math.ceil(month/3)
          switch (parseInt(type)) {
            // 当前季度
            case 0:
              this.dateCompare = `${year} 第 ${quater} 季度`
              this.changeCompare(this.getQuaterOfYear(quater))
              break;
            // 前一季度
            case 1:
              quater = quater - 1
              this.dateCompare = `${year} 第 ${quater} 季度`
              this.changeCompare(this.getQuaterOfYear(quater))
              break;
            case 2:
              break;
            case 3:
              break;
            default:
              this.dateCompare = `${year} 第 ${quater} 季度`
              this.changeCompare(this.getQuaterOfYear(quater))
              break;
          }
          break;
        // 年
        case 5:
          switch (parseInt(type)) {
            // 当年
            case 0:
              this.dateCompare = this.getFullTime(new Date(), 'year')
              this.changeCompare(this.dateCompare)
              break;
            // 前一年
            case 1:
              this.dateCompare = this.getPreYear(new Date())
              this.changeCompare(this.dateCompare)
              break;
            // 同比
            case 2:
              break;
            // 环比
            case 3:
              this.dateCompare = this.getCycleCompare(key)[0]
              this.changeCompare(this.dateCompare)
              break;
            default:
              this.dateCompare = this.getFullTime(new Date(), 'year')
              this.changeCompare(this.dateCompare)
              break;
          }
          break;
        // 时
        case 6:
          switch (parseInt(type)) {
            // 当时
            case 0:
              this.dateCompare = [this.getHourByCount(type), this.getHourByCount(type)]
              this.changeCompare(this.dateCompare)
              break;
            // 前一时
            case 1:
              this.dateCompare = [this.getHourByCount(type), this.getHourByCount(type)]
              this.changeCompare(this.dateCompare)
              break;
            case 2:
              break;
            case 3:
              break;
            default:
              break;
          }
          break;
        // 天
        default:
          this.dateCompare = [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')]
          this.changeCompare(this.dateCompare)
          break;
      }
    },
    // 周 转换为时间范围
    transformForWeek (time) {
      let value = []
      let timestamp = Date.parse(time)
      let timestampToday = this.getTodayTimeStamp()
      if ( (timestamp + 6 * 24 * 60 * 60 * 1000) < timestampToday ) {
        value.push(this.getFullTime(new Date(timestamp), 'day'))
        value.push(this.getFullTime(new Date(timestamp + 6 * 24 * 60 * 60 * 1000), 'day'))
      } else {
        value.push(this.getFullTime(new Date(timestamp), 'day'))
        //value.push(this.getFullTime(new Date(timestampToday - 24 * 60 * 60 * 1000), 'day'))
        value.push(this.getFullTime(new Date(timestampToday), 'day'))
      }
      return value
    },
    getRealTime () {
      if (this.$route.path.indexOf('visual') !== -1 || this.$store.state.charts.previewToggle) {
        this.realTime = this.getFullDateTime(new Date())
      }
    },
    // 获取环比日期
    // TODO: 兼容问题
    getCycleCompare (key) {
      let currentStartTime = ''
      let currentEndTime = ''
      let compareStartTime = ''
      let compareEndTime = ''

      if (this.periodData.dateData) {
        currentStartTime = this.periodData.dateData[0].starTime
        currentEndTime = this.periodData.dateData[0].endTime
      } else {
        return
      }
      // console.log(currentStartTime, currentEndTime, key)
      switch (parseInt(key)) {
        // 实时
        case 0:
          compareStartTime = this.getPreDate(new Date(currentStartTime))
          compareEndTime = this.getPreDate(new Date(currentEndTime))
          break;
        // 天
        case 1:
          compareStartTime = this.getPreDate(new Date(currentStartTime))
          compareEndTime = this.getPreDate(new Date(currentEndTime))
          break;
        // 周
        case 2:
          break;
        // 月
        case 3:
          compareStartTime = this.getPreMonth(new Date(currentStartTime))
          compareEndTime = this.getPreMonth(new Date(currentEndTime))
          break;
        // 季
        case 4:
          break;
        // 年
        case 5:
          compareStartTime = this.getPreYear(new Date(currentStartTime))
          compareEndTime = this.getPreYear(new Date(currentEndTime))
          break;
        case 6:
          break;
        default:
          break;
      }
      return [compareStartTime, compareEndTime]
    }
  },
  mounted () {
    this.setInitData(this.selectedKey)
    if (this.compare) {
      this.setInitCompareData(this.selectedKey)
    }
    // 触发本期日期默认值更新
    eventBus.$on('switchTypeToPeriod', (key) => {
      this.setInitData(key)
    })
    // 触发对比期默认值更新
    eventBus.$on('switchTypeToCompare', (key) => {
      if (this.compare) {
        this.setInitCompareData(key)
      }
    })
  },
  beforeDestroy() {
    eventBus.$off(`switchTypeToPeriod`)
    eventBus.$off(`switchTypeToCompare`)
    clearInterval(this.realTimer)
  }
}
</script>
<style lang="less" scoped>
  .period-wrapper {
    position: relative;
    display: inline-block;
    vertical-align: top;
    margin-right: 24px;
    margin-bottom: 8px;
    .period-select {
      vertical-align: top;
      font-size: 0;
      span {
        display: inline-block;
        vertical-align: top;
      }
      .name {
        line-height: 32px;
        max-width: 84px;
        text-align: left;
        margin-right: 6px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        color: #333333;
      }
      .select-container {
        width: 80px;
        .el-input__inner {
          border-right: none;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          text-align: center;
        }
      }
      .split-line {
        width: 20px;
        text-align: center;
        font-size: 14px;
        line-height: 32px;
      }
      .pick-container {
        position: relative;
        .el-date-editor--daterange{
          width: 210px;
          height: 32px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          left: -1px;
        }
        .el-date-editor--month{
          width: 120px;
          height: 32px;
        }
        .el-date-editor.el-input{
          //width: 150px;
        }
        .real {
          height: 32px;
          width: 180px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          border: 1px solid #dcdfe6;
          font-size: 14px;
          line-height: 26px;
          left: -1px;
          text-align: center;
          padding: 3px 10px;
          box-sizing: border-box;
        }
      }
      .compare-container {
        position: relative;
        .el-date-editor--daterange{
          width: 210px;
          height: 32px;
        }
        .el-date-editor--month{
          width: 120px;
          height: 32px;
        }
        .el-date-editor.el-input{
          //width: 150px;
        }
      }
    }
  }
</style>
<style lang="less">
  .period-wrapper .select-container .el-input__inner {
    border-right: none;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    text-align: center;
  }
  .period-wrapper .el-range-editor--small .el-range-separator {
    text-align: center;
    width: auto;
  }
  // 周的样式
  .period-wrapper .el-date-editor--week {
    width: 150px;
  }
  .period-wrapper .pick-container .el-date-editor--week .el-input__inner {
    left: -1px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    text-align: center;
  }
  .period-wrapper .compare-container .el-date-editor--week .el-input__inner {
    text-align: center;
  }
  // 月的样式
  .period-wrapper .pick-container .el-date-editor--month .el-input__inner {
    left: -1px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    width: 120px;
    text-align: center;
  }
  .period-wrapper .compare-container .el-date-editor--month .el-input__inner {
    width: 120px;
    text-align: center;
  }
  // 季的样式
  .period-wrapper .pick-container .wrapper_quater .el-input__inner {
    left: -1;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  // 年的样式
  .period-wrapper .el-date-editor--year {
    width: 100px;
  }
  .period-wrapper .pick-container .el-date-editor--year .el-input__inner {
    left: -1;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    text-align: center;
  }
  .period-wrapper .pick-container .el-date-editor--year .el-input__inner {
    text-align: center;
  }
  // 小时样式
  .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner {
    width: 250px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  // 天的样式 非范围
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 150px;
  }
  .el-date-editor--date .el-input__inner {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .el-input__inner {
    text-align: center;
  }
</style>
