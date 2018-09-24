<template>
  <component :is="currentView"></component>
</template>

<script>
// 查询面板
import searchConfig from './otherFocus/seach'
// 文本
import textConfig from './otherFocus/text'
// tab
import tabConfig from './otherFocus/tabRight'
// iframe
import iframeConfig from './otherFocus/iframe'
export default {
  name: 'OtherFocus',
  components: {searchConfig, textConfig, tabConfig, iframeConfig},
  computed: {
    currentView () {
      const containerId = this.$store.state.charts.chartsOption.filter(item => item.selected)[0].id
      let currentViewName = ''
      switch (containerId) {
        case 1: currentViewName = 'textConfig'; break
        case 2: currentViewName = 'searchConfig'; break
        case 3: currentViewName = 'tabConfig'; break
        case 4: currentViewName = 'iframeConfig';break
        default: currentViewName = ''
      }
      return currentViewName
    }
  }
}
</script>

