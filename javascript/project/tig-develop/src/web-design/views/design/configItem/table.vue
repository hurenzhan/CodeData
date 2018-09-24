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
    name: 'design-config-table',
    data() {
      return {
        name: 'developing...'
      }
    },
  }
</script>

<style scoped lang="less">

</style>
