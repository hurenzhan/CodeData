<!-- 多选select组件 查询面板定制化/-->
<!-- 兼容远程搜索 -->
<template>
  <div class="multi_contanier">
		<el-popover
		  placement="bottom"
		  width="400"
		  popper-class="my-popover"
		  v-model="showDrop">
		  <div slot="reference" class="content">
  			<el-input
  				size="small"
  				:suffix-icon="icon"
  				readonly
  				v-model="tips">
  			</el-input>
		  </div>
		  <div class="popup_container" ref="drop_container_area">
		  	<div class="top_bar">
		  		<div class="inline_block">
		  			<el-input size="small"
		  				v-model="searchKey"
		  				placeholder="请输入关键字"
		  				clearable
		  				prefix-icon="el-icon-search"
		  				:disabled="!isRemote"
		  				ref="remoteInput"
		  				@change="searchList">
		  			</el-input>
		  		</div>
		  		<div class="inline_block status">
		  			<span class="text_left">已选择: {{count}}</span>
		  			<span class="text_right" @click="clearAllValue">清空</span>
		  		</div>
		  	</div>
		  	<div class="middle_content">
		  		<div class="left_selectList">
		  			<div class="list_container">
		  				<div class="all-checked">
		  					<el-checkbox
		  						:disabled="disabledForCheck"
		  						v-model="checkAll"
		  						@change="handleCheckAllChange">
		  						全选
		  					</el-checkbox>
		  				</div>
		  				<!-- 加载中动画 /-->
		  				<div class="loading" v-if="loading">
		  					<span class="text">加载中</span>
		  					<span class="icon"><i class="el-icon-loading"></i></span>
		  				</div>
		  				<!-- 列表组件 /-->
						  <el-checkbox-group v-else v-model="initValueArr" @change="changeValueArr">
						    <el-checkbox
						    	v-for="item in dimData.dimSelected"
						    	:label="item.dimValueNm"
						    	:title="item.dimLabel"
						    	:key="item.dimValue">
						    	{{item.dimLabel}}
						    </el-checkbox>
						  </el-checkbox-group>
						</div>
		  		</div>
		  		<div class="right_selected">
		  			<div class="list_container">
			  			<span class="tag" v-for="(valueName, valueIndex) in displayValueArr">
			  				<span class="tag_text" :title="valueName">{{valueName}}</span>
			  				<i class="el-icon-close" @click="deleteDimValue(valueIndex)"></i>
			  			</span>
			  		</div>
		  		</div>
		  	</div>
			  <div class="bottom_bar">
			    <el-button type="info" size="mini" @click="closeDrop">取消</el-button>
			    <el-button type="primary" size="mini" @click="submit">确定</el-button>
			  </div>
		  </div>
		</el-popover>
  </div>
</template>

<script>
import searchApi from '@/web-design/api/design'
export default {
	name: 'multi-select',
  data() {
    return {
    	initFlag: true,
    	showDrop: false,
    	searchKey: '',
    	// checkAll: false,
    	initValueArr: [],					// 有效数据格式(###)
    	loading: false
    }
  },
  props: ["index", "message", "dimData"],
  computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
  	count () {
  		return this.initValueArr.length
  	},
  	tips () {
  		return `已选${this.dimData.dimSelectedNameList.length}个${this.dimData.dimName}`
  	},
    // 当前组件是否支持远程搜索 存在级联父级时不支持远程、模糊搜索
	  isRemote () {
	  	if (this.currentContainer.feature.dropDownData[this.message].father === undefined) {
	  		this.currentContainer.feature.dropDownData[this.message].father = []
	  	}
	  	//return this.currentContainer.feature.dropDownData[this.message].father.length > 0 ? false : true
	  	return true
	  },
	  icon () {
	  	return this.showDrop ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
	  },
	  // 当前是否处于全选状态
	  checkAll: {
	  	get () {
	  		let hasAll = true
	  		this.dimData.dimSelected.map(item => {
	  			if (!this.initValueArr.some(value => value === item.dimValueNm)) {
	  				hasAll = false
	  			}
	  		})
	  		return this.dimData.dimSelected.length ? hasAll : false
	  	},
	  	set () {

	  	}
	  },
	  // 全选按钮是否禁用
	  disabledForCheck () {
	  	return this.dimData.dimSelected.length ? false : true
	  },
	  // 展示的数组格式(_)
	  displayValueArr () {
			return this.initValueArr.map(item => {
				return item.replace('###', '_')
			})
	  },
	  // 是否存在级联父级
	  hasFahter () {
	  	return this.dimData.father.length > 0 ? true : false
	  },
	  // 是否含有级联子集
	  hasChild () {
	  	return this.dimData.children.length > 0 ? true : false
	  }
  },
  watch: {
  	showDrop (newValue) {
  		if (newValue) {
  			this.initValueArr = JSON.parse(JSON.stringify(this.dimData.dimSelectedNameList))
  			// 首次加载，请求列表，优化加载机制，尽可能地减少初始化的http请求
  			if (this.initFlag) {
  				this.searchList()
  				this.initFlag = false
  			}
  			// 开启时 清空模糊查询关键字并重新加载选项列表
				if (this.searchKey) {
					this.searchKey = ''
					this.searchList()
				}
  		}
  	},
  	// 级联与取消级联时 重新查询维值列表
  	hasFahter (newValue) {
  		this.clearDimSelectList()
  		if (newValue) {
  			this.searchCascadeListByKey()
  		} else {
  			this.searchListByKey()
  		}
  		// 自身存在子集时 清空子集(链式反应)
  		if (this.hasChild) {
  			this.clearDataForChildren()
  		}
  	}
  },
	methods: {
		searchList (key = '') {
			if (this.hasFahter) {
				this.searchCascadeListByKey(key)
			} else {
				this.searchListByKey(key)
			}
		},
		// 异步模糊搜索查询
		async searchListByKey (key = '') {
			let dimIndex = this.index
			let dimCode = this.dimData.dimCode
			this.loading = true
	    let response = await searchApi.queryDimInfoByKey({key, dimCode})
	    // console.log('getDimListData', response)
	    response && response.data && response.data.forEach((item) => {
	    	let re = /^(.+)###(.*)$/i
	      item.disabled = false
	      item.dimLabel = re.test(item.dimValueNm) ? item.dimValueNm.replace('###', '_') : item.dimValueNm
	    })
	    // 过滤出有效的维值
	    let dimList = []
	    if (response && response.data) {
	    	dimList = response.data.filter(item => {
	    		let re = /^(.+)###(.*)$/i
	    		return re.test(item.dimValueNm)
	    	})
	    }
	    // 获取维值数据绑定在相应下标的维度下
	    this.$store.commit('saveDimListData', {
	      index: dimIndex,
	      dimList,
	      dimCode,
	      key
	    })
	    this.loading = false
		},
		async searchCascadeListByKey (key = '') {
			let dimIndex = this.index
			// 当前维度
			let dimCode = this.dimData.dimCode
			// 父级维度编码
			let fatherCode = this.dimData.father[0]
			// 父级维度数据
			let fatherDimData = this.currentContainer.feature.dropDownData.filter(item => item.dimCode === fatherCode)
			// 父级维值编码
			let fatherValue = fatherDimData[0].dimSelectedList.length ? fatherDimData[0].dimSelectedList[0] : ''
			// 缺少父级编码时
			if (!fatherValue) {
				this.searchListByKey()
				return
			}
			this.loading = true
	    let response = await searchApi.queryDimInfoByCascadeKey({key, dimCode, fatherCode, fatherValue})
	    // console.log('getDimListData', response)
	    response && response.data && response.data.forEach((item) => {
	    	let re = /^(.+)###(.*)$/i
	      item.disabled = false
	      item.dimLabel = re.test(item.dimValueNm) ? item.dimValueNm.replace('###', '_') : item.dimValueNm
	    })
	    // 过滤出有效的维值
	    let dimList = []
	    if (response && response.data) {
	    	dimList = response.data.filter(item => {
	    		let re = /^(.+)###(.*)$/i
	    		return re.test(item.dimValueNm)
	    	})
	    }
	    // 获取维值数据绑定在相应下标的维度下
	    this.$store.commit('saveDimListData', {
	      index: dimIndex,
	      dimList,
	      dimCode,
	      key
	    })
	    this.loading = false
		},
		changeValueArr (valueArr) {
			this.initValueArr = valueArr
		},
		// 全选按钮的处理
		handleCheckAllChange (value) {
			if (value) {
				// true时 将全选的值push进initValueArr
				this.dimData.dimSelected.forEach(item => {
					if (!this.initValueArr.some(value => value === item.dimValueNm)) {
						this.initValueArr.push(item.dimValueNm)
					}
				})
			} else {
				// false时 将全选的值从initValueArr删除
				this.dimData.dimSelected.forEach(item => {
					if (this.initValueArr.some(value => value === item.dimValueNm)) {
						let index = this.initValueArr.indexOf(item.dimValueNm)
						this.initValueArr.splice(index, 1)
					}
				})
			}
		},
		// 获取可保存的数据格式
		getDimValueList (valueArr) {
  		let nameList = []
			let valueList = []
			if (valueArr.length) {
				// 获取维值编码
  		 const reg = /(.+)###(.*)/
				valueList = valueArr.map(item => {
					return item.match(reg)[1]
				})
				// 获取维值名
				nameList = valueArr.map(item => {
					return item
				})
			}
			this.setDimValue(valueList, nameList)
		},
		// 设置已选维值
		setDimValue (valueList = [], nameList = []) {
			// 将选中的维值添加到feature
			this.$store.commit('changeDimSelectList', {
				index: this.index,								// 当前容器的index
				value: valueList,									// 维值编码
				name: nameList,										// 维值名
				key: this.message									// 下拉维度控件的index
			})
		},
		// 按维值下标删除维值
		deleteDimValue (valueIndex) {
			this.initValueArr.splice(valueIndex, 1)
		},
		// 清空已选维度下所有已选维值
		clearAllValue () {
			let length = this.initValueArr.length
			this.initValueArr.splice(0, length)
		},
		// 级联相关 清空自身已选维值
		clearDimSelectList () {
			this.$store.commit('clearDimSelectList', {
				index: this.currentContainer.i,						// 当前容器的index
				dimCode: this.dimData.dimCode						  // 下拉维度控件的index
			})
		},
		// 级联相关 清空所有的子集已选维值
		clearDataForChildren () {
			let length = this.dimData.children.length
			if (length > 0) {
				for (let i = 0; i < length; i++) {
					let dimCode = this.dimData.children[i]
					// 清空子集已选的维值
					this.$store.commit('clearDimSelectList', {
						index: this.currentContainer.i,						// 当前容器的index
						dimCode																		// 下拉维度控件的index
					})
				}
			}
		},
		// 确认按钮
		submit () {
			this.getDimValueList(this.initValueArr)
			this.closeDrop()
		},
		// 关闭下拉drop层
		closeDrop () {
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
	beforeDestroy () {
		document.removeEventListener('click', this.checkArea, true)
	},
}
</script>

<style scoped>
	.multi_contanier {
		font-size: 14px;
		box-sizing: border-box;
    color: #606266;
	}
	.multi_contanier .content {
		height: 32px;
		width: 215px;
    text-align: center;
	}
	.popup_container {
		height: 383px;
		width: 400px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 0px !important;
	}
	.popup_container .top_bar{
		height: 48px;
		font-size: 0px;
	}
	.popup_container .top_bar .inline_block {
		display: inline-block;
		width: 200px;
		padding: 10px;
	}
	.popup_container .top_bar .status{
		font-size: 14px;
		line-height: 28px;
	}
	.popup_container .top_bar .status	.text_left {
		text-align: left;
	}
	.popup_container .top_bar .status	.text_right {
		float: right;
		margin-right: 10px;
		text-align: right;
		color: #409EFF;
		cursor: pointer;
	}
	.popup_container .middle_content {
		flex: 1;
		font-size: 0px;
		position: relative;
	}
	.left_selectList {
		position: absolute;
		left: 0;
		top: 0;
		box-sizing: border-box;
		width: 200px;
		height: 100%;
		padding: 0px 10px;
	}
	.left_selectList .list_container {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.left_selectList .list_container .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%,-50%);
    text-align: center;
		padding: 5px;
		font-size: 0;
	}
	.left_selectList .loading .text {
		font-size: 14px;
		margin-right: 10px;
		vertical-align: middle;
	}
	.left_selectList .loading .icon {
		font-size: 25px;
		vertical-align: middle;
	}
	.left_selectList .all-checked {
		padding: 10px 10px 10px 5px;
		border-bottom: 1px solid #eee;
	}
	.left_selectList .el-checkbox-group {
		flex: 1;
		width: 180px;
		box-sizing: border-box;
		padding-left: 5px;
		padding-right: 10px;
		overflow: auto;
	}
  .left_selectList .el-checkbox-group::-webkit-scrollbar {
  	height: 8px;
    width: 6px;
  }
	.left_selectList .el-checkbox-group .el-checkbox {
		display: block;
		width: 160px;
		margin-left: 0px;
		padding: 10px 0px;
		border-bottom: 1px solid #eee;
	}
	.right_selected .list_container{
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		border-left: 1px solid #eee;
		box-sizing: border-box;
		padding-left: 10px;
	}
	.right_selected .list_container::-webkit-scrollbar {
  	height: 8px;
    width: 6px;
  }
	.right_selected {
		position: absolute;
		right: 0;
		top: 0;
		box-sizing: border-box;
		width: 200px;
		height: 100%;
		padding: 0px 10px 0px 0px;
		font-size: 0px;
		padding-top: 10px;
	}
	.right_selected .tag {
		display: inline-block;
    box-sizing: border-box;
    border-color: transparent;
    background-color: #f0f2f5;
    font-size: 0px;
    height: 20px;
    padding: 0px 5px;
    margin: 0px 8px 8px 0px;
    border-radius: 4px;
	}
	.right_selected .tag .tag_text {
		max-width: 140px;
		font-size: 12px;
		height: 20px;
		line-height: 20px;
		display: inline-block;
		vertical-align: middle;
    text-overflow: ellipsis;
    white-space: nowrap;
		overflow: hidden;
		margin-right: 3px;
	}
	.right_selected .tag i {
		height: 12px;
		width: 12px;
		font-size: 12px;
		display: inline-block;
		vertical-align: middle;
		cursor: pointer;
	}
	.right_selected .tag i:hover {
		color: #409EFF;
	}
	.popup_container .bottom_bar {
		padding: 10px;
		height: 48px;
		text-align: right;
	}
</style>
<style>
	.my-popover {
		padding: 0px;
	}
	.multi_contanier .content .el-input__inner {
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
		text-align: center;
		cursor: pointer;
		font-size: 12px;
	}
	.popup_container .el-input__inner {
		font-size: 12px;
	}
  .left_selectList .el-checkbox__input {
 		vertical-align: middle;
 	}
	.left_selectList .el-checkbox__label {
		vertical-align: middle;
		font-size: 12px;
		max-width: 140px;
		overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
	}
</style>