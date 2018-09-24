<template>
  <div class="chart-type">
    <el-button
      v-if="item.id<6 || item.id === 12 || item.id === 10 || item.id === 13 || item.id === 14 || item.id === 15"
      v-for="(item, index) in categorySorted"
      :key="index"
      @click="selectType(item.id)"
      :disabled="!recommendList[item.id]"
      :class="{
        active:item.id===selectedContainerChartId
      }">
      <img :src="'/static/charts/images/chartsType/' + item.icon" :alt="item.name" :title="item.name">
    </el-button>
  </div>
</template>

<script>
  import {chartCategory} from '../../../../static/configData'
  import eventBus from '../../../../utils/eventBus'
  import {getInShowContainers, calcNumOfMeasure, calcNumMetricListFlat} from '../../../../utils/utils'

  export default {
    name: 'ChartType',
    props: {
      // 第几个容器
      index: {
        type: Number
      }
    },
    data () {
      return {
        chartCategory
      }
    },
    computed: {
      // 图表类型排序
      categorySorted(){
        return this.chartCategory.slice(0).sort((a,b)=>{
          return a.orderId-b.orderId  
        })
      },
      // 选中的容器的chartId
      selectedContainerChartId () {
        return this.$store.state.charts.chartsOption[this.index].feature.chartId
      },
      // 推荐的图表类型
      recommendList () {
        const feature = this.$store.state.charts.chartsOption[this.index].feature
        return chartCategory.map(item => {
          return item.isRecommend({
            metricsNum: calcNumOfMeasure(feature.metricList),
            metricsFistNum: calcNumMetricListFlat(feature.metricListFlat),
            dimsNum: feature.dimList.length,
            dimType: feature.dimList.map(({dimType}) => dimType),
            metricCount: feature.metricList.length,
          })
        })
      },
      // 关系图的个数，目标：添加一个关系图后，禁止再次添加关系图
      relationNum () {
        return getInShowContainers(this.$store.state.charts.chartsOption).filter(item => item.feature.chartId === 6).length || 0
      }
    },
    methods: {
      selectType (id) {
        // 关系图个数限制下
        if (this.relationNum === 1 && id === 6) {
          this.$message('关系图只能有一个')
          return
        }
        // 切换自己时，不操作
        if (this.selectedContainerChartId === id) return
        this.$store.commit('selectType', {
          index: this.index,
          id
        })
        this.$nextTick(() => {
          eventBus.$emit(`changeChartType_${this.index}`)
        })
      }
    }
  }
</script>

<style lang="less">
  @shadow-color: #51A6FF;
  @width: 45px;
  .chart-type {
    padding: 2px 8px;
    >.el-button {
      width: @width;
      height: @width;
      padding: 0px;
      transition: all 0.2s ease;
      border: none;
      margin: 2px 0px 2px 8px;
      &.active{
        box-shadow: 0 0 4px @shadow-color;
        border: 1px solid #51a6ff;
      }
      &.is-disabled{
        filter: grayscale(100%);
      }
      &:nth-child(4n+1) {
        margin-left: 0;
      }
      &:active{
        border-color: #ebeef5;
      }
      img {
        width: 45px;
        margin: -2px;
        // transform-origin: 68% 64%;
        // transform: scale(1.1);
      }
    }
  }
</style>
