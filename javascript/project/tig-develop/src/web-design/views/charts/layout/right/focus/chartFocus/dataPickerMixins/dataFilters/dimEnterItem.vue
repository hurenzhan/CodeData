<template>
  <div class="dimenter_item">
		<el-popover
		  placement="bottom"
		  width="215"
		  v-model="showDrop">
		  <div class="drop_container" ref="drop_container_area">
			  <el-input type="textarea" v-model="initValue" placeholder="输入编码(不同编码换行输入)" rows="8" :autosize="autoRows" ref="mytextarea" @change="setInputList"></el-input>
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
	name: 'dimEnterItem',
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
    	return this.filterItemInfo.initFilterValue
    },
    initValue: {
			get() {
				return this.filterItemInfo.initFilterValue
			},
			set() {}
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
      this.$store.commit('saveFilterValue', {
        index: this.index,
        filterItemIndex: this.filterItemIndex,
        value: this.inputList
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
	.dimenter_item {
		width: 100%;
		box-sizing: border-box;
    color: #606266;
    font-size: 14px;
		.filterContent {
			float: left;
			width: 128px;
			height: 32px;
			line-height: 32px;
			border-radius: 4px;
			border-top-right-radius:0px;
      border-bottom-right-radius:0px;
      border-right: 0;
			border: 1px solid #dcdfe6;
	    text-align: center;
	    overflow: hidden;
	    text-overflow:ellipsis;
    	white-space:nowrap;
    	padding: 0 10px;
		}
	}
	.dimenter_item .el-textarea textarea {
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
