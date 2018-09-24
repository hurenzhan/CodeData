import { wait } from '../../utils/utils'

export default {
  data () {
    return {
      carouselHeight: '270px', // 走马灯的高度
      carouselWidth: '145px', // 维度卡片的宽度  134
      rankWidth: '223px', // 排名卡片的宽度   212px
      num: 2
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
        let numTmp = Math.floor(getComputedStyle(div).width.slice(0, -2) / this.carouselWidth.slice(0, -2))
        if (this.styleConfig.cardType === '4') numTmp = Math.floor(getComputedStyle(div).width.slice(0, -2) / this.rankWidth.slice(0, -2))
        this.num = numTmp === 0 ? 1 : numTmp
      })
    },
    // 计算跑马灯的高度
    computeCarouselHeight () {
      this.$nextTick(() => {
        wait(0.1).then(() => {
          const query = `div[containerIndex="${this.option.i}"] .dim-item .metric p`
          const dimItemDiv = document.querySelector(query)
          if (!dimItemDiv) return
          let height = (dimItemDiv && getComputedStyle(dimItemDiv).height) || 0
          const metricLength = this.getMetricsCodeArr.length
          if (metricLength <= 2) {
            height = 150
          } else {
            height = 150 + (metricLength - 2) * 48.4
          }
          height += 'px'
          if (height !== 'auto') this.carouselHeight = height
        })
      })
    }
  }
}
