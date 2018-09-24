<template>
  <div>
		<!-- 指标操作符封装组件 -->
    <el-select size="mini" v-model="selectedDate" @change="selectedMetrics()" placeholder="请选择">
			<el-option
				v-for="item in metricData.Operator"
				:key="item.value"
				:label="item.name"
				:value="item.value"
				>
			</el-option>
		</el-select>
  </div>
</template>

<script>
export default {
	name: 'metricLeftOper',
  data() {
		return {
			selectedDate: '0'
		}
	}, 
	/**
	 * @augments index.vue
	 * 	message: 当前指标的index下标
	 *  index： 当前容器所在面板的的index
	 * 	metricData: feature中维度信息
	 */
  props: ["index", "message", "metricData"],
	computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
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
	}
}
</script>

<style lang="less" scoped>

</style>
