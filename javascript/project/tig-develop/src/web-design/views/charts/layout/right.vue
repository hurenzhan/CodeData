<template>
  <component :is="currentView" @click.native.stop></component >
</template>

<script>
  import {allBlur} from '../utils/utils'
  import blur from './right/blur'
  import focus from './right/focus'

  export default {
    name: 'Right',
    data () {
      return {
      }
    },
    components: {blur, focus},
    computed: {
      currentView () {
        const chartsOption = this.$store.state.charts.chartsOption.filter(item => !item.drop)
        return allBlur(chartsOption) ? blur : focus
      }
    }
  }
</script>
