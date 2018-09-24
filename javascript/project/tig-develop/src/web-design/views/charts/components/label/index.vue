<template>
  <div :class="containerStyle ? 'name-show':'name-hide'">
    <label-layout :option="option"></label-layout>
  </div>
</template>

<script>
  import LabelLayout from './layout'
  export default {
    name: 'Label',
    props: ['index'],
    components: {LabelLayout},
    computed: {
      option () {
        return this.$store.state.charts.chartsOption[this.index]
      },
      //容器样式
      containerStyle(){
        return this.$store.state.charts.chartsOption[this.index].nameToggle
      }
    }
  }
</script>

<style lang="less">
  .name-show{
    height: calc(~'100%' - 40px);
    overflow: auto;
  }
  .name-hide{
    height: calc(~'100%');
    overflow: auto;
  }
</style>
