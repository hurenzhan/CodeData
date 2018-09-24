<!-- 输入型select组件 查询面板定制化/-->
<template>
  <div class="dimList-input">
		<el-popover
		  placement="bottom"
		  width="215"
		  v-model="showDrop">
		  <div class="drop_container" ref="drop_container_area">
			  <el-input type="textarea" clearable :value="initValue" placeholder="输入编码(不同编码换行输入)" rows="8" :autosize="autoRows" ref="mytextarea" @change="setInputList"></el-input>
			  <div style="text-align: right; margin-top: 10px">
			    <el-button type="info" size="mini" @click="showDrop = false">取消</el-button>
			    <el-button type="primary" size="mini" @click="submitInput">确定</el-button>
			  </div>
			</div>
		  <div slot="reference" class="content">
  			<el-input
  				size="small"
  				:suffix-icon="icon"
  				readonly
  				clearable
  				placeholder="输入关键字查询"
  				v-model="inputValue">
  			</el-input>
		  </div>
		</el-popover>
  </div>
</template>

<script>
export default {
	name: 'dimLeftSelect',
  data() {
		return {
			showDrop: false,
			autoRows: {
				minRows: 4,
				maxRows: 8
			},
			inputList: ''
		}
	},
  props: ["index", "message", "dimData"],
	computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
    inputValue: {
    	get () {
	    	let string = this.dimData.dimSelectedNameList.join(',')
	    	return string.substr(0, string.length)
	    },
	    set () {
	    	// 清空textarea
	    	this.$refs['mytextarea']._data.currentValue = ''
	    	this.inputList = ''
	    	// 保存结果
	    	this.submitInput()
	    }
    },
    initValue: {
    	get () {
    		return this.dimData.dimSelectedNameList.join('\n')
    	},
    	set () {

    	}
    },
	  icon () {
	  	return this.showDrop ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
	  }
	},
	watch: {
		showDrop (newValue) {
			if (newValue) {
				this.$refs['mytextarea']._data.currentValue = this.initValue
			}
		}
	},
	methods: {
		setInputList (value) {
			this.inputList = value
			// console.log('setInputList', this.inputList)
		},
		submitInput () {
			// let value = this.$refs['mytextarea']._data.currentValue.split('\n')
			// console.log(this.inputList)
			let validArr = this.inputList.split('\n').filter(item => item )
			// console.log(validArr)
			this.$store.commit('setSelectedValueBydimCode', {
				index: this.currentContainer.i,
				dimCode: this.dimData.dimCode,
				value: validArr,
				name: validArr
			})
			this.showDrop = false
		},
    checkArea (e) {
      if (!this.$el.contains(e.target) && !this.$refs['drop_container_area'].contains(e.target)) {
      	if (this.showDrop) {
      		this.showDrop = false
      	}
      }
    }
	},
	mounted ()  {
		document.addEventListener('click', this.checkArea, true)
	},
	beforeDestroy () {
		document.removeEventListener('click', this.checkArea, true)
	}
}
</script>

<style lang="less" scoped>
	.dimList-input {
		width: 215px;
		box-sizing: border-box;
    color: #606266;
    font-size: 14px;
		.content {
			height: 32px;
			width: 215px;
			border-radius: 4px;
	    text-overflow:ellipsis;
    	white-space:nowrap;
		}
	}
	.el-textarea textarea {
		border: 1px solid #eee;
		padding: 5px;
		width: 100%;
		outline: none;
		border-radius: 4px;
		overflow:hidden;
		resize: none;
		width: 100%;
	}
</style>
<style>
	.dimList-input .content .el-input__inner {
		text-align: center;
		cursor: pointer;
		font-size: 12px;
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
	}
	.drop_container .el-textarea__inner {
		resize: none;
	}
</style>
