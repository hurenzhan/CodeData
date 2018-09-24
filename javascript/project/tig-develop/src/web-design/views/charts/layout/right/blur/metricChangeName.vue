<template>
  <div class="metric-change-name">
    <div class="my-slide-bar item-wrapper">
      <el-input
        size="mini"
        placeholder="请输入指标"
        suffix-icon="el-icon-search"
        v-model="keyword">
      </el-input>
      <div
        class="metric-show-item"
        :class="{open: item.open,danger: !item.validation,hasAlias: metricAlias[index]}"
        v-for="(item, index) in metrics" :key="index"
        v-if="item.metricName.includes(keyword) || metricAlias[index].includes(keyword)">
        <p :title="item.metricName" @click="toggle(index)">{{item.metricName}}</p>
        <p>
          <span>重命名</span>
          <el-input
            size="mini"
            v-model="metricAlias[index]"
            @change="nameChange(item.metricCode, item.metricName, $event, index)"
          ></el-input>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {wait} from '../../../utils/utils'
  import {metricsAliasValidate} from '../../../utils/validationBySave'
  import eventBus from '../../../utils/eventBus'
  import methodsMixins from './methodsMixins.js'

  export default {
    name: 'MetricChangeName',
    mixins: [methodsMixins],
    data () {
      return {
        keyword: '',
        metrics: [],
        metricAlias: []
      }
    },
    computed: {
    },
    mounted () {
      this.metricsInit()
    },
    methods: {
      metricsInit () {
        wait(0.1).then(() => {
          const {dataSet} = this.$store.state.charts
          if (dataSet.length) {
            this.metrics = JSON.parse(JSON.stringify(dataSet))
            this.metrics.forEach(item => {
              this.$set(item, 'open', 0)
              this.$set(item, 'validation', true)
            })
            this.metricAliasInit()
          } else {
            this.metricsInit()
          }
        })
      },
      // 指标别名初始化
      metricAliasInit () {
        let {metrics: metricsAlias} = this.$store.state.charts.alias
        // 清除多余的别名(保证别名全部能和选中的指标对应)
        metricsAlias = metricsAlias.filter(item => this.metrics.some(metric => metric.metricCode === item.metricCode))
        this.$store.commit('syncMetricAlias', {
          data: metricsAlias,
          type: 'metrics'
        })
        // 别名存在时使用别名，否则使用''
        this.metricAlias = this.metrics.map(i => {
          const isInAlias = metricsAlias.findIndex(a => a.metricCode === i.metricCode)
          if (isInAlias === -1) {
            // return i.metricName
            return ''
          } else {
            return metricsAlias[isInAlias].alias
          }
        })
      },
      // 指标别名改变handle
      nameChange (metricCode, metricName, alias, index) {
        // 这个if写验证规则
        if (metricsAliasValidate(alias)) {
          this.$store.commit('addMetricAlias', {
            metricCode,
            metricName,
            alias
          })
          this.metrics[index].validation = true
          this.metricListFlat()
          this.emitMetricAliasChange()
        } else if (alias !== '') {
          // 验证不过，并且不为空
          this.$message.error(`${metricName}重命名不规则`)
          this.metrics[index].validation = false
        }
        if (alias === '') {
          // 删除别名
          this.$store.commit('delMetricAlias', {
            metricCode
          })
          this.metrics[index].validation = true
          this.metricListFlat()
          this.emitMetricAliasChange()
        }
      },
      toggle (index) {
        this.metrics[index].open = !this.metrics[index].open
      }
    }
  }
</script>

<style lang="less">
</style>
