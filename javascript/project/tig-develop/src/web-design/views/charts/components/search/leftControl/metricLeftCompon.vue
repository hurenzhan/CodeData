<template>
  <div class="metric-oper-input">
		<!-- 左侧指标输入框封装组件 -->
    <el-input size="small" v-model="metricInput" placeholder="请输入数值" maxlength="16">
			<el-select v-model="selectedDate" slot="prepend"  @change="selectedMetrics" placeholder="请选择">
				<el-option
					v-for="item in metricData.Operator"
					:key="item.value"
					:label="item.name"
					:value="item.value"
					>
				</el-option>
			</el-select>
		</el-input>
		<!-- {{metricData.Operator}} -->
  </div>
</template>

<script>
export default {
  name: 'metricLeftInput',
  data() {
		return {
			selectedDate: '0'
		}
	},
  props: ["index", "message","metricData"],
	computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
    metricInput: {
      get() {
        return this.currentContainer.feature.dataMetricData[this.message].title
      },
      set(value) {
        this.$store.commit('changeInputTitle', {
          index: this.currentContainer.i,
					value,
					key: this.message
        })
      }
    }
	},
	methods: {
		// 指标操作符修改
		selectedMetrics() {
			this.$store.commit('changeMetricOper', {
				index: this.currentContainer.i,
				value: this.selectedDate,
				key: this.message
			})
		}
	},
	mounted () {
		this.selectedDate = this.metricData.selectedOper
	}
}
</script>

<style lang="less">
.metric-oper-input {
	.el-input-group__prepend {
		background-color: #fff;
		width: 100px;
		.el-select .el-input__inner {
			text-align: center;
			color: #606266;
		}
	}
}
</style>
