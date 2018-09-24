<!-- 维度相对应下维值下拉框封装组件 -->
<template>
  <div class="dimList-container">
		<!-- 多选新控件 /-->
		<multi-select
				v-if="controlType === 0"
				:message="message"
				:index="index"
				:dimData="dimData">
		</multi-select>
		<!--  单选模式  /-->
		<single-select
			  v-if="controlType === 1"
			  :message="message"
			  :index="index"
			  :dimData="dimData">
		</single-select>
		<!-- 自定义输入 /-->
		<input-select
		    v-if="controlType === 2"
		    :message="message"
		    :index="index"
		    :dimData="dimData">
		</input-select>
  </div>
</template>

<script>
import multiSelect from './dimMultiSelect'
import singleSelect from './dimSingleSelect'
import inputSelect from './dimLeftInput'
export default {
	name: 'dimLeftSelect',
  data() {
		return {
			filterOption: []
		}
	},
  props: ["index", "message", "dimData"],
  components: {
    multiSelect,
    singleSelect,
    inputSelect
  },
	computed: {
		// 当前容器
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
    // 是否自定义维度 (版本兼容)
    isCustom () {
    	return this.dimData.type ? this.dimData.type : false
    },
    // 是否存在级联子集
    isCascade () {
    	if (!this.currentContainer.feature.dropDownData[this.message].children) {
    		this.currentContainer.feature.dropDownData[this.message].children = []
    	}
    	if (this.currentContainer.feature.dropDownData[this.message].children.length > 0) {
    		return true
    	} else {
    		return false
    	}
    },
    // 控件类型 并对各个版本控件做兼容处理
    controlType () {
    	let controlType = this.currentContainer.feature.dropDownData[this.message].controlType
    	if (this.isCustom) {
    		controlType = 2																						// 自定义维度时 强制使用输入控件
    	} else if (this.isCascade) {
    		controlType = 1																						// 级联时 强制使用单选控件
    	} else {
    		controlType === undefined ? controlType : 0								// 未定义controlType字段的旧报表，默认使用多选控件
    	}
    	return  controlType
    }
	},
	watch: {
		isCascade (newValue) {
			// this.initDataByCascade()		// 存在级联关系时  清空子集级联数据
		},
		controlType () {
			this.initDimData()						// 清空自身已选维值
			// this.initDimDataList()			// 初始化维值列表
		}
	},
	methods: {
		// 已选维值清空
		initDimData () {
			this.$store.commit('changeDimSelectList', {
				index: this.currentContainer.i,								// 当前容器的index
				value: [],																		// 维值编码
				name: [],																			// 维值名
				key: this.message															// 下拉维度控件的index
			})
		},
		// 级联时的初始化
		initDataByCascade () {
			let length = this.currentContainer.feature.dropDownData[this.message].children.length
			if (length > 0) {
				for (let i = 0; i < length; i++) {
					let dimCode = this.currentContainer.feature.dropDownData[this.message].children[i]
					// 清空子集已选的维值
					this.$store.commit('clearDimSelectList', {
						index: this.currentContainer.i,						// 当前容器的index
						dimCode																		// 下拉维度控件的index
					})
				}
			}
		},
		// 初始化维值列表
		initDimDataList (key = '') {
			let dimIndex = this.index
			let dimCode = this.dimData.dimCode
			this.$store.dispatch('getDimListBykey', {dimIndex, dimCode, key})
		}
	},
	mounted ()  {

	}
}
</script>

<style lang="less" >
.dimList-container {
	width: 215px;
	.demoMultiple {
		.el-input__inner{
			border-top-left-radius: 0 ;
			border-bottom-left-radius: 0;
		}
		.el-select__tags-text{
			max-width: 100px;
			display: inline-block;
			vertical-align: top;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
		.el-select__input {
			max-width: 25px !important;
		}
	}
	.demo {
		.el-input__inner{
			border-top-left-radius: 0 ;
			border-bottom-left-radius: 0;
		}
		.el-select__tags-text{
			max-width: 100px;
			display: inline-block;
			vertical-align: top;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
	}
	.el-select {
		width: 215px;
	}
	.el-select__tags {
		max-width: none !important;
	}
	.el-select__tags>span {
		width: auto;
	}
	.el-select__input {
		display: inline-block;
	}
}
.el-select-dropdown__item {
	max-width: 350px;
	overflow: hidden;
}
</style>
