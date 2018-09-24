<template>
  <div class="wrapper">
    <appHeader :userName="userName" :userCode="userCode">
    </appHeader>
    <div class="wrapper-content">
      <!-- <sideBar></sideBar> -->
      <router-view class="container"></router-view>
    </div>
  </div>
</template>

<script>
import sideBar from './sideBar'
import appHeader from './headBar'

export default {
  name: 'layout',
  computed: {
    userName() {
      if (!this.$store.state.auth.user) return ''
      return this.$store.state.auth.user.name
    },
    userCode() {
      if (!this.$store.state.auth.user) return ''
      return this.$store.state.auth.user.code
    },
  },
  created() {
    this.$store.dispatch('initUserMenu')
  },
  methods: {
  },
  components: {
    sideBar,
    appHeader
  }
}
</script>

<style scoped lang="less">
.wrapper {
  height: 100%;
}

.wrapper-content {
  height: calc(~"100% - 40px");
  overflow: hidden;
  .container {
    height: 100%;
    padding: .36rem .2rem .2rem .3rem;
    overflow: auto;
  }
}
</style>
