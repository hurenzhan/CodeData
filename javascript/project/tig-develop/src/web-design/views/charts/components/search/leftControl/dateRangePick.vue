<!-- 日期范围控件 /-->
<template>
  <div class="dateRange-pick">
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
    {{name}}
    <span
      v-if="timeData.title"
      class="time_name"
      :title="name">
      {{name}}
    </span>
    <!-- 日期控件 /-->
    <span v-if="isDateOrMonth === 'date'">
      <el-date-picker
        size="small"
        v-model="dateData"
        :type="dateType"
        placeholder="选择日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </span>
    <!-- 月份控件 /-->
    <span v-if="isDateOrMonth === 'month'" class="month_container">
      <el-date-picker
        v-model="firstMonth"
        size="small"
        type="month"
        placeholder="选择月"
        format="yyyy-MM"
        value-format="yyyy-MM">
      </el-date-picker>
      <span v-if="isDateRange === 'dateRange' ">-</span>
      <el-date-picker
        v-if="isDateRange === 'dateRange' "
        v-model="secondMonth"
        size="small"
        type="month"
        placeholder="选择月"
        format="yyyy-MM"
        value-format="yyyy-MM">
      </el-date-picker>
    </span>
  </div>
</template>

<script>
import eventBus from '../../../utils/eventBus'
// 时间操作相关方法
import time from '../searchMixins/time.js'
import searchMixinComputed from '../searchMixins/searchMixinComputed'
export default {
  name: "periodPick",
  mixins: [time, searchMixinComputed],
  props: ['index', 'timeData'],
  data () {
    return {
      dateNow: null,
      dateCompare: null
    }
  },
  computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
    // 控件类型
    isDateOrMonth () {
      return this.timeData.formatType
    },
    // 是否范围控件
    isDateRange () {
      return this.timeData.type
    },
    // 日期控件类型
    dateType () {
      return this.isDateRange === 'dateRange' ? 'daterange' : 'date'
    },
    // 控件名字
    name () {
      if (this.timeData.value !== 'ComparDate') {
        return this.timeData.title ? `${this.timeData.title}：` : ''
      } else {
        return '对比日期：'
      }
    },
    // 日期的v-model
    dateData: {
      get () {
        return this.timeData.dateData
      },
      set (value) {
        this.timeData.dateData = value
      }
    },
    // 月份的v-model
    firstMonth: {
      get () {
        return this.isDateRange === 'dateRange' ? this.timeData.dateData[0] : this.timeData.dateData
      },
      set (value) {
        if (this.isDateRange === 'dateRange') {
          // 替换数组某个元素 并触发视图更新
          this.timeData.dateData.splice(0, 1, value)
        } else {
          this.timeData.dateData = value
        }
      }
    },
    // 月份(范围时)的v-model
    secondMonth: {
      get () {
        return this.isDateRange === 'dateRange' ? this.timeData.dateData[1] : this.timeData.dateData
      },
      set (value) {
        if (this.isDateRange === 'dateRange') {
          // 替换数组某个元素 并触发视图更新
          this.timeData.dateData.splice(1, 1, value)
        } else {
          this.timeData.dateData = value
        }
      }
    },
    // 是否是对比期控件
    isCompareType () {
      return this.timeData.value === 'ComparDate' ? true : false
    }
  },
  watch: {

  },
  components: {

  },
  methods: {
    // 初始化日期控件时间
    setInitDate (key) {
      // 范围时 v-model绑定的是数组
      if (this.isDateRange === 'dateRange') {
        switch (this.timeData.dateType) {
          case 'preDate':
            if (!this.isCompareType) {
              this.timeData.dateData = [this.getPreDate(new Date()), this.getPreDate(new Date())]
            } else {
              this.timeData.dateData = [this.getPreDateLastYear(new Date()), this.getPreDateLastYear(new Date())]
            }
            break;
          case 'nowDate':
            if (!this.isCompareType) {
              this.timeData.dateData = [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')]
            } else {
              this.timeData.dateData = [this.getDateLastYear(new Date()), this.getDateLastYear(new Date())]
            }
            break;
          default:
            if (!this.isCompareType) {
              this.timeData.dateData = [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')]
            } else {
              this.timeData.dateData = [this.getPreDateLastYear(new Date()), this.getPreDateLastYear(new Date())]
            }
            break;
        }
      } else {
        switch (this.timeData.dateType) {
          case 'preDate':
            if (!this.isCompareType) {
              this.timeData.dateData = this.getPreDate(new Date())
            } else {
              this.timeData.dateData = this.getPreDateLastYear(new Date())
            }
            break;
          case 'nowDate':
            if (!this.isCompareType) {
              this.timeData.dateData = this.getFullTime(new Date(), 'day')
            } else {
              this.timeData.dateData = this.getDateLastYear(new Date())
            }
            break;
          default:
            if (!this.isCompareType) {
              this.timeData.dateData = this.getPreDate(new Date())
            } else {
              this.timeData.dateData = this.getPreDateLastYear(new Date())
            }
            break;
        }
      }
    },
    // 初始化月份控件时间
    setInitMonth () {
      // 范围时 v-model绑定的是数组
      if (this.isDateRange === 'dateRange') {
        switch (this.timeData.dateType) {
          case 'lastMonth':
            if (!this.isCompareType) {
              this.timeData.dateData = [this.getPreMonth(new Date()), this.getPreMonth(new Date())]
            } else {
              this.timeData.dateData = [this.getPreMonthLastYear(new Date()), this.getPreMonthLastYear(new Date())]
            }
            break;
          case 'nowMonth':
            if (!this.isCompareType) {
              this.timeData.dateData = [this.getFullTime(new Date(), 'month'), this.getFullTime(new Date(), 'month')]
            } else {
              this.timeData.dateData = [this.getMonthLastYear(new Date()), this.getMonthLastYear(new Date())]
            }
            break;
          default:
            if (!this.isCompareType) {
              this.timeData.dateData = [this.getPreMonth(new Date()), this.getPreMonth(new Date())]
            } else {
              this.timeData.dateData = [this.getPreMonthLastYear(new Date()), this.getPreMonthLastYear(new Date())]
            }
            break;
        }
      } else {
        switch (this.timeData.dateType) {
          case 'lastMonth':
            if (!this.isCompareType) {
              this.timeData.dateData = this.getPreMonth(new Date())
            } else {
              this.timeData.dateData = this.getPreMonthLastYear(new Date())
            }
            break;
          case 'nowMonth':
            if (!this.isCompareType) {
              this.timeData.dateData = this.getFullTime(new Date(), 'month')
            } else {
              this.timeData.dateData = this.getMonthLastYear(new Date())
            }
            break;
          default:
            if (!this.isCompareType) {
              this.timeData.dateData = this.getPreMonth(new Date())
            } else {
              this.timeData.dateData = this.getPreMonthLastYear(new Date())
            }
            break;
        }
      }
    }
  },
  mounted () {
    if (this.isDateOrMonth === 'date') {
      this.setInitDate()
    } else {
      this.setInitMonth()
    }
  }
}
</script>
<style lang="less" scoped>
  .time_name {
    font-size: 14px;
    color: #333333;
  }
  .month_container {
    width: auto;
    font-size: 14px;
  }
</style>
<style type="text/css">
  .dateRange-pick{
    position: relative;
  }
  .dateRange-pick .el-date-editor--month {
    width: 120px;
    text-align: center;
  }
  .dateRange-pick .el-date-editor--daterange {
    width: 210px;
    text-align: center;
    font-size: 13px;
  }
  .dateRange-pick .el-date-editor--date {
    width: 140px;
    text-align: center;
    font-size: 13px;
  }
  .dateRange-pick .el-input__inner {
    text-align: center;
  }
  .dateRange-pick .el-range-editor--small .el-range-separator {
    text-align: center;
    width: auto;
  }
</style>
