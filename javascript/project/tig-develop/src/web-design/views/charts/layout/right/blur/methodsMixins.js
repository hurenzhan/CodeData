import eventBus from '../../../utils/eventBus'
import {getInShowContainers} from '../../../utils/utils'

export default {
  computed: {
    // 所有容器(只包含图表)
    chartsOption () {
      return getInShowContainers(this.$store.state.charts.chartsOption).filter(item => item.id === 0)
    }
  },
  methods: {
    // 指标重命名后，调用下指标扁平化函数
    metricListFlat () {
      this.chartsOption.forEach(option => {
        const index = option.i
        this.$store.commit('metricListFlat', {
          index
        })
      })
    },
    // 指标重命名后，需要通知容器刷新视图
    // todo 这里简单的向每个容器发送，精确的做法是谁用了当前指标才发送给谁
    emitMetricAliasChange () {
      this.chartsOption.forEach(option => {
        const index = option.i
        eventBus.$emit(`metricAliasChange_${index}`)
      })
    }
  }
}
