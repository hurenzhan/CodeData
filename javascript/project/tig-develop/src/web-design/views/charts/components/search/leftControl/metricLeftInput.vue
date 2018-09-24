<template>
  <div>
		<!-- 左侧指标输入框封装组件 -->
    <el-input
			size="mini"
			v-model="metricInput"
      maxlength="3"
			placeholder="请输入内容1111">
		</el-input>

  </div>
</template>

<script>
export default {
  name: 'metricLeftInput',
  data() {
		return {
		}
	},
  props: ["index", "message"],
	computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
    metricInput: {
      get() {
        return this.currentContainer.feature.dataMetricData.title
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
	}
}
</script>

<style lang="less" scoped>

</style>
