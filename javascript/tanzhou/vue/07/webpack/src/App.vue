<template>
  <div id="app">
    <v-header :aaa='aaaa'></v-header>
    <router-view :b='aaaa' />
  </div>
</template>

<script>
import header from '@/components/header'
export default {
  name: 'App',
  data () {
    return {
      aaaa: '传数据的'
    }
  },
  components: {
    'v-header': header
  }
}
</script>
