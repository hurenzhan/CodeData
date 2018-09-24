<template>
    <div style="padding:10px;">
        <el-checkbox v-model="tooltip">显示ToolTip</el-checkbox>
    </div>
</template>

<script>
export default {
  name: 'WordCloudStyle',
  props: {
    index: {
      default: 0
    }
  },
  computed: {
    styleConfig() {
      return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
    },
    tooltip: {
      get() {
        return this.styleConfig.config.tooltip.show
      },
      set(value) {
        this.$store.commit('showTootipWordCloud', {
          index: this.index,
          value,
        })
      }
    },
  }
}
</script>
