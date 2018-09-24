<template>
  <component v-if="chartDivShow" :is="current" :index="index" class="container-inner my-slide-bar" :class="containerStyle ? 'name-show':'name-hide'"></component>
</template>

<script>
  import chartNoData from './noData'
  import chartTable from '../../components/table/index'
  import chartSimpleTable from '../../components/simpleTable/index'
  import chartCrossTable from '../../components/crossTable/index'
  // import chartTable from '../../components/table2/detail'
  import chartLabel from '../../components/label/index'
  import chartCard from '../../components/card/index'
  import chartPie from '../../components/pie/pieIndex'
  import chartMap from '../../components/map/index'
  import chartLine from '../../components/line/index'
  import chartBar from '../../components/bar/bar'
  import containerSearch from '../../components/search/index.vue'
  import containerText from '../../components/text/index.vue'
  import containerTab from '../../components/tab/index.vue'
  import containerIframe from '../../components/iframe/index.vue'
  import chartRelation from '../../components/relation/index.vue'
  //import chartRadar from '../../components/radar/index.vue'
  //import wordCloud from '../../components/wordCloud/index.vue'
  //import chartScatter from '../../components/scatter/index.vue'
  import chartGauge from '../../components/gauge/index.vue'
  //import chartBubble from '../../components/bubble/index'
  import chartFunnel from '../../components/funnel/index'
  import aliasChangeMixin from '../../components/mixins/aliasChange/aliasChangeMixin'
  export default {
    props: {
      // 第几个container
      index: {
        type: Number
      }
    },
    mixins: [aliasChangeMixin],
    components: {
      chartNoData,
      chartLabel,
      chartPie,
      chartMap,
      chartTable,
      chartSimpleTable,
      chartCrossTable,
      chartLine,
      chartCard,
      chartBar,
      containerSearch,
      containerText,
      containerTab,
      containerIframe,
      chartRelation,
      //chartRadar,
      //wordCloud,
      //chartScatter,
      chartGauge,
      //chartBubble,
      chartFunnel
    },
    computed: {
      current () {
        let currentName = ''
        const option = this.$store.state.charts.chartsOption[this.index]
        const {data} = option
        const containerId = option.id
        const chartId = option.feature.chartId
        if (containerId === 0) {
          // 没有数据时
          if (!data) {
            currentName = 'chartNoData'
          } else {
            switch (chartId) {
              case 0:// 复杂表
                currentName = 'chartTable'; break
              case 1:// 饼图
                currentName = 'chartPie'; break
              case 2:// 标签
                currentName = 'chartLabel'; break
              case 3:// 地图
                currentName = 'chartMap'; break
              case 4:// 折线图
                currentName = 'chartLine'; break
              case 5:// 柱状图
                currentName = 'chartBar'; break
              case 6:// 关系图
                currentName = 'chartRelation'; break
              // case 7:// 词云图
              //   currentName = 'wordCloud'; break
              // case 8:// 雷达图
              //   currentName = 'chartRadar'; break
              // case 9:// 散点图
              //   currentName = 'chartScatter'; break
              case 10:// 仪表盘
                currentName = 'chartGauge'; break
              // case 11:// 气泡图
              //   currentName = 'chartBubble'; break
              case 12:// 漏斗图
                currentName = 'chartFunnel'; break
              case 13:// 简单表
                currentName = 'chartSimpleTable'; break
              case 14:// 卡片
                currentName = 'chartCard'; break
              case 15:// 交叉表
                currentName = 'chartCrossTable'; break
              default:
                currentName = ''
            }
          }
        }
        if (containerId === 1) {
          currentName = 'containerText'
        }
        if (containerId === 2) {
          currentName = 'containerSearch'
        }
        if (containerId === 3) {
          currentName = 'containerTab'
        }
        if (containerId === 4) {
          currentName = 'containerIframe'
        }
        return currentName
      },
       //容器样式
      containerStyle(){
        return  this.$store.state.charts.chartsOption[this.index].nameToggle
      }
    }
  }
</script>

<style lang="less">
  .name-show{
    // padding: 5px;
    height: calc(~'100%' - 40px);
    /*overflow: auto;*/
  }
  .name-hide{
    // padding: 5px;
    height: calc(~'100%');
    /*overflow: auto;*/
  }
</style>
