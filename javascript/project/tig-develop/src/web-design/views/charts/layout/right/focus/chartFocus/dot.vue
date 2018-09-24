<template>
  <div class="dot">
  </div>
</template>

<script>
  export default {
    name: 'Dot'
  }
</script>

<style lang="less">
  @width: 6px;
  .dot{
    display: inline-block;
    width: @width;
    min-width: @width;
    height: @width;
    border-radius: 50%;
    background-color: #d8d8d8;
    margin-right: 8px;
    vertical-align: middle;
  }
</style>
