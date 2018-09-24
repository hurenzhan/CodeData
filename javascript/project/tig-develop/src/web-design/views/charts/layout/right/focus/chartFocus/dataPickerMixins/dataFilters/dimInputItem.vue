<template>
  <div class="diminput_item">
		<el-popover
		  placement="bottom"
		  width="215"
		  v-model="showDrop">
		  <div class="drop_container" ref="drop_container_area">
			  <el-input type="textarea" :value="initValue" placeholder="输入编码(不同编码换行输入)" rows="8" :autosize="autoRows" ref="mytextarea" @change="setInputList"></el-input>
			  <div style="text-align: right; margin-top: 10px">
			    <el-button type="primary" size="mini" @click.stop="showDrop = false">取消</el-button>
			    <el-button type="primary" size="mini" @click.stop="submitInput">确定</el-button>
			  </div>
			</div>
		  <div slot="reference" class="filterContent" ref="drop_container_target">{{inputValue}}</div>
		</el-popover>
  </div>
</template>

<script>
export default {
	name: 'dimInputItem',
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
  props: ["index", "filterItemInfo", "filterItemIndex"],
	computed: {
    inputValue () {
    	let string = this.filterItemInfo.dimValuesSelected.join(',')
    	return string.substr(0, string.length)
    },
    initValue () {
    	return this.filterItemInfo.dimValuesSelected.join('\n')
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
		},
		submitInput () {
			let validArr = this.inputList.split('\n').filter(item => item )
			// console.log(validArr)
      this.$store.commit('dimValuesInputChange', {
        index: this.index,
        filterItemIndex: this.filterItemIndex,
        value: validArr
      })
			this.showDrop = false
		},
    checkArea (e) {
    	// console.log(this.$el)
      // if (!this.$refs['drop_container_area'].contains(e.target)) {
       if (!this.$el.contains(e.target) && !this.$refs['drop_container_area'].contains(e.target)) {
      	if (this.showDrop) {
      		this.showDrop = false
      	}
      }
    }
	},
  mounted () {
    // 事件捕获
    document.addEventListener('click', this.checkArea, true)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.checkArea, true)
  }
}
</script>

<style lang="less" scoped>
	.diminput_item {
		width: 100%;
		box-sizing: border-box;
    color: #606266;
    font-size: 14px;
		.filterContent {
			height: 32px;
			line-height: 32px;
			width: 100%;
			border-radius: 4px;
			border: 1px solid #dcdfe6;
	    text-align: center;
	    overflow: hidden;
	    text-overflow:ellipsis;
    	white-space:nowrap;
    	padding: 0 10px;
		}
	}
	.diminput_item .el-textarea textarea {
		border: 1px solid #eee;
		padding: 5px;
		width: 100%;
		outline: none;
		border-radius: 4px;
		overflow:hidden;
		resize:none;
		width: 100%;
	}
</style>
