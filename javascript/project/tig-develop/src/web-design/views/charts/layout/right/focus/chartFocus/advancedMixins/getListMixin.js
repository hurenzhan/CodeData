import {getContainersByDim} from '../../../../../utils/utils'

export default {
  data () {
    return {
    }
  },
  computed: {
    option() {
      // 过滤掉时间维度
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    getChartsList () {
      let tmpArr = []
      this.option.feature.dimList.forEach(item => {
        tmpArr.push(getContainersByDim({
          chartsOption: this.$store.state.charts.chartsOption,
          dataSet: this.$store.state.charts.dataSet,
          dimCode: item.dimCode,
          index: this.option.i
        }))
      })
      return tmpArr
    }
  }
}
