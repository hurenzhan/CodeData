import eventBus from '../../../utils/eventBus'
import {wait} from '../../../utils/utils'

export default {
  data () {
    return {
      chartDivShow: true // 图表组件是否显示
    }
  },
  computed: {
    currentContainerOption () {
      return this.$store.state.charts.chartsOption[this.index]
    }
  },
  mounted () {
    // console.log(111)
    eventBus.$on(`metricAliasChange_${this.index}`, () => {
      // console.log(this.current)
      // 图表是表格时，特殊处理
      if (this.current === 'chartTable' || this.current === 'chartSimpleTable' || this.current === 'chartCrossTable') {
        wait(0.05).then(() => {
          eventBus.$emit(`changeChartType_${this.index}`, {
            from: 'aliasChange'
          })
        })
      } else {
        /* 方案一：问题点，有些图表的配置会丢失
        // toggle chartDivShow字段，达到重新渲染的目的
        this.chartDivShow = false
        wait(0.2).then(() => {
          this.chartDivShow = true
        })
        */
        // 方案二，模拟发射updateData事件
        // TODO:用了这种方案后，字段chartDivShow就不再使用了,可以删除
        eventBus.$emit(`updateData_${this.index}`, {
          data: this.currentContainerOption.data,
          from: 'alaisChange'
        })
      }
    })
  },
  methods: {},
  beforeDestroy () {
    // console.log(222)
    eventBus.$off(`metricAliasChange_${this.index}`)
  }
}
