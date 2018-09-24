<template>
  <div :class="containerStyle ? 'name-show':'name-hide'">
    <label-layout :index="index"></label-layout>
  </div>
</template>

<script>
  import LabelLayout from './layout'
  import bus from '../../utils/eventBus'
  import searchMixin from '../../../../api/search'
  export default {
    name: 'Label',
    props: ['index'],
    components: {LabelLayout},
    computed: {
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
