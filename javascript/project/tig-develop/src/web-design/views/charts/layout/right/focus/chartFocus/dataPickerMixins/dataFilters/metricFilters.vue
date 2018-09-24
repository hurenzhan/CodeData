<template>
  <div class="data-filters">
    <el-select ref="dimSelect" size="mini" filterable multiple collapse-tags v-model="dimSelected" @click.native="dimFoldHandle">
      <el-option
        v-for="item in metricList"
        :key="item.metricCode"
        :label="item.metricName"
        :value="item.metricCode"
      >
      </el-option>
    </el-select>
    <!-- <dim-filter-item
      v-for="(item,dimFilterIndex) in dimFilter"
      :key="item.dimCode"
      :filterItemInfo="dimFilter[dimFilterIndex]"
      :filterItemIndex="dimFilterIndex"
      :index="index"
    >
    </dim-filter-item> -->
  </div>
</template>

<script>
  import {getCrossDimList} from '../../../../../../utils/utils'
  // import metricFilterItem from './metricFilterItem'

  export default {
    name: 'MetricFilters', // 数据关系里的过滤器
    props: {
      index: {} // 容器index
    },
    // components: {metricFilterItem},
    data () {
      return {}
    },
    computed: {
      charts () {
        return this.$store.state.charts
      },
      option () {
        return this.charts.chartsOption[this.index]
      },
      metricList () {
        return this.option.feature.metricList
      },
      // 维度过滤器的集合
      dimFilter () {
        return this.option.dimFilter
      },
      // 当前容器选中指标的交叉维度(非分析维度(选中的维度))
      crossDimList () {
        return getCrossDimList(this.charts.dataSet, this.metricList)
      },
      // 被过滤器选中的指标（用于绑定在el-select上）
      dimSelected: {
        get () {
          return this.dimFilter && this.dimFilter.map(i => i.dimCode) || []
        },
        set (value) {
          this.$store.commit('dimFilterChange', {
            index: this.index,
            dimCodeList: value,
            crossDimList: this.crossDimList
          })
        }
      }
    },
    methods: {
      dimFoldHandle (e) {
        const selectSuffix = document.querySelector('.data-filters .el-icon-arrow-up')
        const isReverse = selectSuffix.classList.contains('is-reverse')
        if (e.target.contains(selectSuffix) && isReverse) {
          this.$refs.dimSelect.blur()
        }
      }
    }
  }
</script>

<style lang="less">
  .data-filters{
    margin-top: 10px;
    input {
      height: 32px !important;
    }
    .el-select__tags{
      height: 25px;
    }
  }
</style>
