// tab里的left和layout里的left，公用方法得混合之处
import {containerInit} from '../../../static/configData'
import eventBus from '../../../utils/eventBus'
export default {
  computed: {
    // 判断是不是编辑状态
    isEdit () {
      return this.route.path === '/edit'
    }
  },
  mounted () {
    eventBus.$on('searchReset', this.resize)
  },
  methods: {
    // 弃用:原因，粒度的问题，混用粒度了
    // 根据容器的高度，计算下需要使用的rowHeight
    // 所有容器的h都小于37(拖动粒度修改后的默认高度),使用之前的rowHeight(rowOldHeight)
    getRowHeight (chartsOption) {
      if (chartsOption.map(i => i.h).sort((a, b) => a < b ? 1 : -1)[0] < 20 && this.isEdit) {
        return containerInit.rowOldHeight
      }
      return containerInit.rowHeight
    },
    // 查询面板自适应高度时，需要将layout自适应一下
    resize() {
      this.$refs.gridLayout && this.$refs.gridLayout.resizeEventHandler()
    }
  },
  beforeDestroyed () {
    eventBus.$off('searchReset')
  }
}
