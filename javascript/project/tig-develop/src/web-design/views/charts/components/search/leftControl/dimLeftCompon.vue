<template>
  <div>
		<!-- 维度相对应下维值下拉框封装组件 -->
		<!-- :disabled="item.disabled" -->
		<el-select 
			class="demo1231"
			filterable
			multiple
			collapse-tags
			size="mini"
			v-model="selectedDate"
			@change="selectedDim()"
			placeholder="请选择">
				<el-option
					v-for="item in dimData.dimSelected"
					:disabled="item.disabled"
					:key="item.dimValue"
					:label="item.dimValueNm"
					:value="item.dimValue">
				</el-option>
				<el-select size="mini" slot="prepend" v-model="selectedDate" @change="selectedDim()" placeholder="请选择">
					<el-option
						v-for="item in dimData.Operator"
						:key="item.value"
						:label="item.name"
						:value="item.value"
						>
					</el-option>
				</el-select>
			</el-select>

  </div>
</template>

<script>
export default {
	name: 'dimLeftSelect',
  data() {
		return {
			selectedDate: '', // 维值下拉框选中数据
			isMultiple: true
		}
	},
  props: ["index", "message", "dimData"],
	computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
	},
	methods: {
		// 维值选择方法修改
		selectedDim() {
			// console.log('当前dim数据', this.dimData)
			let isTrue = false // 是否包含全选字段
			this.selectedDate.forEach((item) => {
				if (item === 'allSelected') {
					isTrue = true
				}
			})
			if (isTrue === true) {
				this.dimData.dimSelected.forEach((item) => {
					item.disabled = true
				})
				this.dimData.dimSelected[0].disabled = false
				this.selectedDate = ['allSelected']
				// 将数组中除去全部外的所有数据添加到feature
				this.dimData.dimSelected.shift()

				// 拿到所有维值(逻辑修改为只传当前维度的value)
				const sendData = this.dimData.dimSelected
				let sendArr = []
				
				sendData.forEach((item) => {
					sendArr.push(item.dimValue)
				})

				this.$store.commit('changeDimSelectList', {
					index: this.currentContainer.i,
					value: sendArr,
					key: this.message
				})
				const allSelected = {
					dimValue: 'allSelected',
					dimValueNm: '全部',
					disabled: false
				}
				this.dimData.dimSelected.unshift(allSelected)
			} else {
				// 不包含全选选项
				if (this.selectedDate.length === 0) {
					this.dimData.dimSelected.forEach((item) => {
						item.disabled = false
					})
				}
				// 将选中的维值添加到feature
				this.$store.commit('changeDimSelectList', {
					index: this.currentContainer.i,
					value: this.selectedDate,
					key: this.message
				})
			}

		}
	}
}
</script>

<style lang="less" scoped>

</style>
