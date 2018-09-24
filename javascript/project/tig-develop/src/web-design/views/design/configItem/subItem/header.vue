<template>
  <div class="config-header">
    <span>
      {{ name }}
    </span>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'design-config-header',
    props: {
      name: {
        required: true
      }
    }
  }
</script>

<style scoped lang="less">
  .config-header{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #F0F0F0;
    padding: 7px 12px 7px 16px;
    color: #4B4B4B;
  }
  .plus-icon{
    font-size: 18px;
  }
</style>
