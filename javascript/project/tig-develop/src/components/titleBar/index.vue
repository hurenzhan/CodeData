<template>
  <header class="titleBar">
    <h2 v-text="title"></h2>
    <Breadcrumb v-if="bread.length > 0">
      <BreadcrumbItem v-for="item in bread" :key="item.name" :href="item.link">{{item.name}}</BreadcrumbItem>
      <Button v-if="showBack" @click="backButtonClick" class="title-bar-back-btn">返回</Button>
    </Breadcrumb>
  </header>
</template>

<script>
export default {
  props: {
    showBack: false, // 是否显示返回按钮
    title: {
      default: ''
    },
    bread: {
      default() {
        return []
      }
    }
  },
  methods: {
    // 点击返回电子报表管理页面
    backButtonClick() {
      this.$router.push('/tableManage')
    }
  }
}
</script>

<style lang="less" scoped>
.titleBar {
  margin-bottom: .3rem
}
.title-bar-back-btn {
  width: 64px;
  height: 32px;
  padding: 5px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  float: right;
  margin-top: 11px;
  &:hover {
    border-color: #51A6FF;
    color: #51A6FF;
  }
}
</style>
