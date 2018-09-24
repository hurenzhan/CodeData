<template>
  <div class="percolator">
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="维度过滤" name="0">
           <dim-filters :index="index"></dim-filters>
        </el-tab-pane>
        <el-tab-pane label="指标过滤" name="1">
           <metric-filters :index="index"></metric-filters>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
  import dimFilters from './dimFilters'
  import metricFilters from './metricFilters'

  export default {
    name: 'DataFilters', // 数据关系里的过滤器
    props: {
      index: {} // 容器index
    },
    components: {dimFilters, metricFilters},
    data () {
      return {
        activeName: '0',
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      }
    }
  }
</script>

<style lang="less">

</style>
