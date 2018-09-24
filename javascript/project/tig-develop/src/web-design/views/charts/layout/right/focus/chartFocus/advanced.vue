<template>
  <div v-show="!notShow" style="padding-left: 10px;">
    <div class="title-area">
      <div class="dot"></div><span>图表关联</span>
    </div>
    <el-collapse class="relation-item-area">
      <el-collapse-item v-for="(item, index) in option.feature.dimList.filter(v => v.dimCode ? v.dimCode !== 'dasp_date' : '')" :key="option.i + item.dimCode" :title="item.dimName">
        <div v-for="(chart, chartIndex) in getChartsList[index]" :key="chartIndex">
          <el-checkbox :key="option.i + 'linkCheckbox'" :checked="Boolean(chart.checked)" @change="selectChange(item.dimCode, chart.containerIndex, $event)">{{chart.containerName}}</el-checkbox>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import getListMixin from './advancedMixins/getListMixin'

export default {
  name: 'advanced',
  mixins: [getListMixin],
  data () {
    return {}
  },
  computed: {
    // 并不是所有的图表都可以关联别人
    notShow () {
      const feature = this.option.feature
      // 饼嵌套图不能关联别人
      const pieFlag = feature.chartId === 1 && feature.styleConfig.config.showrModel === '2'
      // 柱状图指标平铺 不能关联别人
      const barFlag = feature.chartId === 5 && feature.styleConfig.config.indexPave
      // 混合地图不能关联别人
      const mapFlag = feature.chartId === 3 && feature.dimList.length === 2
      // 不能关联别人的图表（表格、词云图、漏斗图、关系图
      const chartIdArr = [0, 6, 7, 12, 15]
      return chartIdArr.includes(feature.chartId) || pieFlag || mapFlag || barFlag
    }
  },
  methods: {
    selectChange (dimCode, containerIndex, value) {
      this.$store.commit('relationChange', {
        index: this.option.i,
        containerIndex,
        dimCode,
        value
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .title-area {
    padding-bottom: 12px;
    padding-top: 12px;
    font-family: 'PingFangSC-Regular';
    font-size: 12px;
    font-size: 14px;
    color: #666666;
    display: flex;
    align-items: center
  }
</style>

<style lang="less">
  .relation-item-area {
    padding-left: 14px;
    .el-collapse-item__header {
      font-size: 14px;
      font-family: 'PingFangSC-Regular';
      color: rgba(0, 0, 0, 0.45);
    }
    .el-checkbox__label {
      color: #333333;
      font-family: 'PingFangSC-Regular';
    }
  }
</style>
