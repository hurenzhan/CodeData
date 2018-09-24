<template>
  <component :is="current"></component>
</template>

<script>
  import chartFocus from './focus/chartFocus'
  import otherFocus from './focus/otherFocus'
  export default {
    name: 'Focus',
    data () {
      return {
      }
    },
    components: {
      chartFocus,
      otherFocus
    },
    computed: {
      // 选中的容器对应的focus面板
      current () {
        // drop 是删除的意思
        const containerId = this.$store.state.charts.chartsOption.filter(item => !item.drop && item.selected)[0].id
        return containerId === 0 ? 'chartFocus' : 'otherFocus'
      }
    }
  }
</script>
