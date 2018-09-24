<script>
  export default {
    data () {
      return {
        noDataLayer: false
      }
    },
    mounted () {
      this.noDataLayerInit()
    },
    computed: {
      // 容器是否有标题
      containerHasTitle () {
        return this.$store.state.charts.chartsOption[this.index].nameToggle
      }
    },
    methods: {
      /**
       * @param {Number} length
       */
      toggleNoData (length) {
        this.noDataLayer = length === 0
        return this.noDataLayer
      },
      // 组件加载noDataLayer的初始化
      noDataLayerInit () {
        this.noDataLayer = this.$store.state.charts.chartsOption[this.index].data.length === 0
      }
    }
  }
</script>
