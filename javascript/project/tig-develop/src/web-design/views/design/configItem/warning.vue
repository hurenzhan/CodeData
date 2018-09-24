<template>
  <div>
    <configHeader :name="name"></configHeader>
  </div>
</template>

<script>
import ConfigHeader from './ConfigHeader'

/* eslint-disable */
  export default {
    components: {
      ConfigHeader
    },
    name: 'design-config-warn',
    data() {
      return {
        name: '警告(developing)'
      }
    },
  }
</script>

<style scoped lang="less">

</style>
