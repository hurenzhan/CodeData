<template>
  <div class="dim-change-name">
    <div class="my-slide-bar item-wrapper">
      <el-input
        size="mini"
        placeholder="请输入维度"
        suffix-icon="el-icon-search"
        v-model="keyword">
      </el-input>
      <div
        class="metric-show-item"
        :class="{open: item.open,danger: !item.validation,hasAlias: dimsAlias[index]}"
        v-for="(item, index) in dims" :key="index"
        v-if="item.dimName.includes(keyword) || dimsAlias[index].includes(keyword)">
        <p :title="item.dimName" @click="toggle(index)">{{item.dimName}}</p>
        <p>
          <span>重命名</span>
          <el-input
            size="mini"
            v-model="dimsAlias[index]"
            @change="nameChange(item.dimCode, item.dimName, $event, index)"
          ></el-input>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {wait, getDimsFromMetrics} from '../../../utils/utils'
  import {metricsAliasValidate} from '../../../utils/validationBySave'
  import methodsMixins from './methodsMixins.js'
  export default {
    name: 'DimChangeName',
    mixins: [methodsMixins],
    data () {
      return {
        keyword: '',
        dims: [],
        dimsAlias: []
      }
    },
    mounted () {
      this.dimsInit()
    },
    methods: {
      dimsInit () {
        wait(0.1).then(() => {
          const {dataSet} = this.$store.state.charts
          if (dataSet.length) {
            this.dims = JSON.parse(JSON.stringify(getDimsFromMetrics(dataSet)))
            this.dims.forEach(item => {
              this.$set(item, 'open', 0)
              this.$set(item, 'validation', true)
            })
            this.dimAliasInit()
          } else {
            this.dimsInit()
          }
        })
      },
      // 维度别名初始化
      dimAliasInit () {
        // 别名存在时使用别名，否则使用''
        let {dims: dimsAlias} = this.$store.state.charts.alias
        // 清除多余的别名(保证别名全部能和选中的维度对应)
        dimsAlias = dimsAlias.filter(item => this.dims.some(dim => dim.dimCode === item.dimCode))
        this.$store.commit('syncMetricAlias', {
          data: dimsAlias,
          type: 'dims'
        })
        this.dimsAlias = this.dims.map(i => {
          const isInAlias = dimsAlias.findIndex(a => a.dimCode === i.dimCode)
          if (isInAlias === -1) {
            return ''
          } else {
            return dimsAlias[isInAlias].alias
          }
        })
      },
      // 维度别名改变handle
      nameChange (dimCode, dimName, alias, index) {
        // 这个if写验证规则
        if (metricsAliasValidate(alias)) {
          this.$store.commit('addDimAlias', {
            dimCode,
            dimName,
            alias
          })
          this.dims[index].validation = true
          this.metricListFlat()
          this.emitMetricAliasChange()
        } else if (alias !== '') {
          // 验证不过，并且不为空
          this.$message.error(`${dimName}重命名不规则`)
          this.dims[index].validation = false
        }
        if (alias === '') {
          // 删除别名
          this.$store.commit('delDimAlias', {
            dimCode
          })
          this.dims[index].validation = true
          this.metricListFlat()
          this.emitMetricAliasChange()
        }
      },
      toggle (index) {
        this.dims[index].open ^= true
      }
    }
  }
</script>
