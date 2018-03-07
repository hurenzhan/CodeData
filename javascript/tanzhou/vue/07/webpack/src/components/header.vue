<template lang="html">
  <div>
    这里是头部 {{aaa}}
    <ul>
      <li v-for='item in nav'><router-link :to="`${item.id}`">{{ item.title}}</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['aaa'],
  data() {
    return {
      nav: [
        { title: '首页', id: '/', img: 'xxx,jpg' },
        { title: 'a', id: '/a' },
        { title: 'b', id: '/b' }
      ]
    }
  }
}
</script>

<style lang="css">
</style>
