import { wait } from '../../utils/utils'

export default {
  data () {
    return {
      carouselHeight: '100px', // 走马灯的高度
      carouselWidth: '260px', // 走马灯的宽度
      num: 2, // 每行指标的个数
    }
  },
  computed: {
    styleConfig () {
      return this.styleConfig
    }
  },
  watch: {
    styleConfig: {
      handler () {
        this.computeCarouselHeight()
      },
      deep: true
    }
  },
  mounted () {
    this.computeNum()
    this.computeCarouselHeight()
  },
  methods: {
    // 计算跑马灯每页的个数
    computeNum () {
      wait(0.2).then(() => {
        const div = document.querySelector(`div[containerIndex="${this.option.i}"]`)
        if (!div || getComputedStyle(div).width === 'auto') return
        const numTmp = Math.floor(getComputedStyle(div).width.slice(0, -2) / this.carouselWidth.slice(0, -2))
        this.num = numTmp === 0 ? 1 : numTmp
      })
    },
    // 计算跑马灯的高度
    computeCarouselHeight () {
      this.$nextTick(() => {
        wait(0.1).then(() => {
          const query = `div[containerIndex="${this.option.i}"] .metric-item`
          const metricItemDiv = document.querySelector(query)
          if (!metricItemDiv) return
          let height = (metricItemDiv && getComputedStyle(metricItemDiv).height) || 0
          // 横向
          if (this.styleConfig.showType === '1') {
            height = Number(height.slice(0, -2)) + 8
            height += 'px'
          }
          // 纵向
          if (this.styleConfig.showType === '2') {
            const metricLength = this.getMetricsCodeArr.length
            height = metricLength * (Number(height.slice(0, -2)) + 8) + 48
            height += 'px'
          }
          if (height !== 'auto') this.carouselHeight = height
        })
      })
    }
  }
}
