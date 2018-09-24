<template>
  <div class="demo">
		<!-- 维度操作符封装组件 -->
    <el-select size="small" class="demo21121" v-model="selectedDate" @change="selectedDim()" placeholder="请选择">
			<el-option
				v-for="item in dimData.Operator"
				:key="item.value"
				:label="item.name"
				:value="item.value"
				>
			</el-option>
		</el-select>
		<!-- {{dimData.}} -->
  </div>
</template>

<script>
export default {
	name: 'dimLeftOper',
  data() {
		return {
			selectedDate: 'in' // 维值操作符选中值
		}
	},
  props: ["index", "message", "dimData"],
	computed: {
		// 当前容器feature值
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
	},
	methods: {
		// 维值操作符修改
		selectedDim() {
			this.$store.commit('changeDimOper', {
				index: this.currentContainer.i,
				value: this.selectedDate,
				key: this.message
			})
		}
	},
	mounted () {
		this.selectedDate = this.dimData.selectedOper
	}
}
</script>

<style lang="less">
.demo {
	.demo21121 {
		.el-input__inner{
			border-right:none;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			text-align: center;
		}
	}	
}
</style>
