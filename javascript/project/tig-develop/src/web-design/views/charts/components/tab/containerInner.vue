<template>
  <component v-if="chartDivShow" :is="current" :index="index" class="container-inner my-slide-bar" :class="containerStyle ? 'name-show':'name-hide'"></component>
</template>

<script>
  import chartNoData from '../../layout/left/noData'
  import chartTable from '../table/index'
  import chartSimpleTable from '../simpleTable/index'
  import chartCrossTable from '../crossTable/index'
  import chartLabel from '../label/index'
  import chartCard from '../card/index'
  import chartPie from '../pie/pieIndex'
  import chartMap from '../map/index'
  import chartLine from '../line/index'
  import chartBar from '../bar/bar'
  import chartGauge from '../gauge/index'
  import containerSearch from '../search/index'
  import containerText from '../text/index.vue'
  import containerTab from '../tab/index.vue'
  import containerIframe from '../iframe/index.vue'
  import chartRelation from '../relation/index.vue'
  import wordCloud from '../wordCloud/index'
  import chartBubble from '../bubble/index'
  import chartFunnel from '../funnel/index'
  import aliasChangeMixin from '../mixins/aliasChange/aliasChangeMixin'
  export default {
    name: 'TabContainerInner',
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
      chartCard,
      chartPie,
      chartMap,
      chartTable,
      chartSimpleTable,
      chartCrossTable,
      chartLine,
      chartBar,
      chartGauge,
      containerSearch,
      containerText,
      containerIframe,
      containerTab,
      chartRelation,
      wordCloud,
      chartBubble,
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
              case 0:
                currentName = 'chartTable'; break
              case 1:
                currentName = 'chartPie'; break
              case 2:
                currentName = 'chartLabel'; break
              case 3:
                currentName = 'chartMap'; break
              case 4:
                currentName = 'chartLine'; break
              case 5:
                currentName = 'chartBar'; break
              case 6:
                currentName = 'chartRelation'; break
              case 7:
                currentName = 'wordCloud'; break
              case 10:
                currentName = 'chartGauge'; break
              case 11:
                currentName = 'chartBubble'; break
              case 12:
                currentName = 'chartFunnel'; break
              case 13:
                currentName = 'chartSimpleTable'; break
              case 14:
                currentName = 'chartCard'; break
              case 15:
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
        return this.$store.state.charts.chartsOption[this.index].nameToggle
      }
    }
  }
</script>

<style lang="less">
.name-show{
  // padding: 5px;
  height: calc(~'100%' - 40px);
  overflow: auto;
}
.name-hide{
  // padding: 5px;
  height: calc(~'100%');
  overflow: auto;
}
</style>
