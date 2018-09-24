<!-- 单选select组件 查询面板定制化/-->
<!-- 兼容远程搜索 -->
<template>
  <div class="single_contanier">
		<el-popover
		  placement="bottom"
		  width="215"
		  popper-class="my-popover"
		  v-model="showDrop">
		  <div slot="reference" class="content">
  			<el-input
  				size="small"
  				:suffix-icon="icon"
  				readonly
  				clearable
  				placeholder="请选择"
  				v-model="valueName">
  			</el-input>
		  </div>
		  <div class="popup_container" ref="drop_container_area">
		  	<div class="top_input">
	  			<el-input size="small"
	  				placeholder="请输入关键字"
	  				prefix-icon="el-icon-search"
	  				v-model="inputKey"
	  				clearable
	  				:disabled="!isRemote"
	  				ref="remoteInput"
	  				>
	  			</el-input>
		  	</div>
		  	<div class="list_option">
  				<!-- 加载中动画 /-->
  				<div class="loading" v-if="loading">
  					<span class="text">加载中</span>
  					<span class="icon"><i class="el-icon-loading"></i></span>
  				</div>
		  		<div v-else>
		  			<div class="noData" v-if="!dimData.dimSelected.length">暂无数据</div>
			  		<li
			  			v-for="list in dimData.dimSelected"
			  			:key="list.dimValue"
			  			:class="{isActive: list.dimLabel === valueName}"
			  			:title="list.dimLabel"
			  			@click="getDimValueList(list.dimValueNm)">
			  			{{list.dimLabel}}
			  		</li>
			  	</div>
		  	</div>
		  </div>
		</el-popover>
  </div>
</template>

<script>
import searchApi from '@/web-design/api/design'
import debounce from 'lodash.debounce'
export default {
	name: 'single-select',
  data() {
    return {
    	initFlag: false,
    	showDrop: false,
    	loading: false,
    	searchKey: ''
    }
  },
  props: ["index", "message", "dimData"],
  computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
  	valueName: {
  		get () {
  			// return this.dimData.dimSelectedNameList.length ? this.dimData.dimSelectedNameList[0] : ''
  			if (this.dimData.dimSelectedNameList.length) {
  				return this.dimData.dimSelectedNameList[0].replace('###', '_')
  			} else {
  				return ''
  			}
  		},
  		set (value) {
  			this.setDimValue()
  		}
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
	  inputKey: {
	  	get () {
	  		return this.searchKey
	  	},
	  	set (value) {
	  		this.searchKey = value
	  		this.goSearch()
	  	}
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
  		// 清空自身的已选维值
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
  	},
  	// TODO: 后期支持多选的级联时有用
  	hasChild (newValue) {
  		// this.clearDataForChildren()
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
		// 防抖功能
    goSearch: debounce(
      function () {
        this.searchList(this.searchKey)
      },
      500
    ),
		// 异步模糊搜索查询
		async searchListByKey (key = '') {
			let dimIndex = this.index
			let dimCode = this.dimData.dimCode
			this.loading = true
	    let response = await searchApi.queryDimInfoByKey({key, dimCode})
	    response && response.data && response.data.forEach((item) => {
	    	let re = /^(.+)###(.*)$/i
	      item.disabled = false
	      item.dimLabel = re.test(item.dimValueNm) ? item.dimValueNm.replace('###', '_') : item.dimValueNm
	    })
	    // 过滤出有效的维值
	    let dimList = []
	    if (response && response.data) {
	    	dimList = response.data.filter(item => {
	    		// let re = /^(.+)_(.*)$/i
	    		// return re.test(item.dimValueNm)
	    		return true
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
		// 获取可保存的数据格式
		getDimValueList (value) {
			let valueArr = []
  		let nameList = []
			let valueList = []
			valueArr.push(value)
			if (valueArr.length) {
				// 获取维值编码
  		 let reg = /(.+)###(.*)/
				valueList = valueArr.map(item => {
					return item.match(reg)[1]
				})
				// 获取维值名
				nameList = valueArr.map(item => {
					return item
				})
			}
			this.showDrop = false
			this.setDimValue(valueList, nameList)
		},
		// 设置已选维值
		setDimValue (valueList = [], nameList = []) {
			// 选项不变时
			if (nameList[0] === this.valueName) {
				return
			}
			// 将选中的维值添加到feature
			this.$store.commit('changeDimSelectList', {
				index: this.index,										// 当前容器的index
				value: valueList,											// 维值编码
				name: nameList,												// 维值名
				key: this.message											// 下拉维度控件的index
			})
			// 级联相关 只在级联时生效
			this.clearDataForChildren()							//清空级联的控件的选项
			if (valueList.length) {
				this.queryValueByCascade(valueList) 	//初始化级联的待选维值列表
			}
		},
		// 级联相关 维值查询
		queryValueByCascade (valueList) {
			let value = valueList.length > 0 ? valueList[0] : ''
			let length = this.currentContainer.feature.dropDownData[this.message].children.length
			for (let i = 0; i < length; i++) {
				let dimCode = this.currentContainer.feature.dropDownData[this.message].children[i]
				this.$store.dispatch('queryDimByCascade', {
					index: this.currentContainer.i,			// 当前容器的index
					dimCode,														// 级联子级 维度
					key: value,													// 父级 维值id
					keyDimCode: this.dimData.dimCode    // 父级 维度id
				})
			}
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
		// 清空已选维度下所有已选维值
		clearAllValue () {
			let length = this.initValueArr.length
			this.initValueArr.splice(0, length)
		},
		submit () {
			this.getDimValueList(this.initValueArr)
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
		document.addEventListener('click', this.checkArea, true)
	},
	beforeDestroy () {
		document.removeEventListener('click', this.checkArea, true)
	}
}
</script>

<style scoped>
	.single_contanier {
		font-size: 14px;
		box-sizing: border-box;
    color: #606266;
	}
	.single_contanier .content {
		height: 32px;
		width: 215px;
    text-align: center;
	}
	.popup_container {
		height: auto;
		width: 215px;
		box-sizing: border-box;
		padding: 10px;
	}
	.top_input {
    margin-bottom: 10px;
	}
	.popup_container .list_option {
		max-height: 250px;
		overflow: auto;
		box-sizing: border-box;
	}
  .popup_container .list_option::-webkit-scrollbar {
  	height: 8px;
    width: 5px;
  }
	.popup_container .list_option .noData {
		line-height: 50px;
		text-align: center;
		font-size: 12px;
	}
	.popup_container .list_option .loading {
		padding: 10px;
		text-align: center;
		font-size: 14px;
	}
	.popup_container .list_option li {
		padding: 8px 10px;
		font-size: 12px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	.popup_container .list_option .isActive {
		background-color: #f5f7fa;
		color: #409EFF;
	}
	.popup_container .list_option li:hover {
		background-color: #f5f7fa;
	}
</style>
<style>
	.my-popover {
		padding: 0px;
	}
	.single_contanier .content .el-input__inner {
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
		text-align: center;
		cursor: pointer;
		font-size: 12px;
	}
	.popup_container .el-input__inner {
		font-size: 12px;
	}
</style>