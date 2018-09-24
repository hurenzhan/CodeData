<template>
  <div style="text-align:center;color:#666">
    无权限
  </div>
</template>

<script>
export default {
  created() {
    this.$Message.error('无权限')
  }
}
</script>

