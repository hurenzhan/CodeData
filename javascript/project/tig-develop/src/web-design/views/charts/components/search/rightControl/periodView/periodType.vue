<!-- 设置日期选择控件类型: 日期or范围/-->
<template>
  <!-- 周期选择组件 -->
  <div class="period-type">
    <el-select class="inline-select-left" size="mini" v-model='selectKey'>
      <el-option
        v-for="list in selectKeyValue"
        :key="list.key"
        :value="list.key"
        :label="list.label">
      </el-option>
    </el-select>

    <el-select class="inline-select-right" size="mini" v-model="selectType" :disabled="disabled">
      <el-option
        v-for="list in selectValue"
        :key="list.type"
        :value="list.type"
        :label="list.name">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import {controlTypePeriod} from '../../searchUtils/common'
export default {
  name: 'periodDate',
  data() {
    return {
      selectKey: 1,
      tabName: 'current'
    }
  },
	computed: {
		// 获取vuex数据
    currentContainer () {
			return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    index () {
      return this.currentContainer.i
    },
    period () {
      return this.currentContainer.feature.periodData[0]
    },
    selectKeyValue () {
      return controlTypePeriod
    },
    selectValue () {
      return controlTypePeriod.filter(item => item.key === this.selectKey)[0].selectValue
    },
    disabled () {
      return controlTypePeriod.filter(item => item.key === this.selectKey)[0].disabled
    },
    selectType: {
      get () {
        return this.period.selected.filter(item => item.value === this.selectKey)[0].isRange
      },
      set (value) {
        this.$store.commit('isPeriodRange', {
          index: this.index,
          key: this.selectKey,
          type: value
        })
      }
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="less">
  .period-type {
    display: flex;
    width: 100%;
    .inline-select-left {
      display: inline-block;
      width: 70px;
      .el-input__inner {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border-color: #dcdfe6;
      }
    }
    .inline-select-right {
      display: inline-block;
      flex: 1;
      .el-input__inner {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        text-align: center;
        right: -1px;
      }
    }
  }
</style>


