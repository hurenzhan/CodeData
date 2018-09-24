<template>
	<!-- 右侧高级面板 -->
  <div class="right-senior-demo">
		<!-- 折叠板内容区域 -->
		<div class="senior-table-body">

			<!-- 内容区域title -->
			<div class="senior-title"><div class="mysign"></div><span>图表关联</span></div>

			<!-- 图表列表 -->
			<div class="table-list">
				<el-checkbox-group v-model="checkedList">

					<!-- 循环图表名称 -->
					<el-checkbox
						class="table-style"
						v-for="(tableName,index) in tableNameList"
						:label="tableName.i"
						:key="'checked'+index">
							{{tableName.name}}
					</el-checkbox>

				</el-checkbox-group>
			</div>

			<!-- 查询面板之间关联 -->
			<div class="senior-title"><div class="mysign"></div><span>查询面板关联</span></div>

			<div class="table-list">
				<el-checkbox-group v-model="checkedSearch">

					<!-- 循环图表名称 -->
					<el-checkbox
						class="table-style"
						v-for="(tableName,index) in searchTable"
						:label="tableName.i"
						:key="'checked'+index">
							{{tableName.name}}
					</el-checkbox>

				</el-checkbox-group>
			</div>

			<!-- 内容区域title -->
			<div class="senior-title"><div class="mysign"></div><span>数据维度级联</span></div>

			<!-- 图表列表 -->
			<div class="table-list">
				<el-tree
				  :data="cascadeList"
				  :render-after-expand="false"
				  show-checkbox
				  node-key="id"
				  :props="treeLabel"
				  :default-checked-keys="checkedCascade"
				  ref="myTree"
				  @check-change="changeCheckedDim">
				</el-tree>
			</div>


      <!-- 内容区域title -->
      <div class="senior-title"><div class="mysign"></div><span>显示同环比时间</span></div>

      <!-- 图表列表 -->
      <div class="table-list">
        <el-checkbox
          label="同比时间"
          v-model="isCheckedYearCompare"
          :disabled="isDisableDateCompare"
          @change="(value) => handleDateCompareCheck(value, 'Year')"
          class="table-style">
          同比时间
        </el-checkbox>
        <el-checkbox
          v-model="isCheckedMonthCompare"
          :disabled="isDisableDateCompare"
          @change="(value) => handleDateCompareCheck(value, 'Month')"
          label="环比时间"
          class="table-style">
          环比时间
        </el-checkbox>
      </div>
		</div>
	</div>
</template>

<script>
import { getInShowContainers } from '../../../utils/utils'
export default {
	name: 'rightSenior',
	data () {
		return {
			treeLabel: {
				children: 'children',
				label: 'dimName',
				disabled: 'disabled'
			}
		}
	},
  computed: {
		// 获取vuex数据
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
		},
    isDisableDateCompare() {
      return !(this.currentContainer.feature.dateCategory.length > 0 || this.currentContainer.feature.periodData.length > 0)
    },
    isCheckedYearCompare() {
      return this.currentContainer.feature.isCheckedYearCompare || false
    },
    isCheckedMonthCompare() {
      return this.currentContainer.feature.isCheckedMonthCompare || false
    },
		// 获取vuex中所有的图表名称
    tableNameList () {
      return this.$store.state.charts.chartsOption.filter(
        item => {
          // 判断是否在删除的Tab里
          let inDropTab = false
          if (item.tabContainerIndex !== undefined) {
            this.$store.state.charts.chartsOption[item.tabContainerIndex].drop
              ? inDropTab = true
              : inDropTab = false
          }
          return (item.id === 0 || item.id === 4) && !item.drop && !inDropTab
        }
      ).map(({name, i}) => ({name, i}))
    },
    // 获取当前图表所有的查询面板
    searchTable () {
    	let myIndex = this.currentContainer.i    // 当前图表的index
    	// 1.获取未删除的查询面板或者关联tab的查询面板被删除(id : 2)  2.筛选未被关联的查询面板  3.获取面板的名称和index
      return getInShowContainers(this.$store.state.charts.chartsOption).filter(
        item => {return item.id === 2 && !item.drop && item.i !== myIndex}
      ).filter(item => {
      	if (!item.feature.relativeSearch) {
      		item.feature.relativeSearch = []
      	}
      	return item.feature.relativeSearch.indexOf(myIndex) === -1
      }).map(({name, i}) => ({name, i}))
    },
		// 高级面板勾选关联的图表
    checkedList: {
      get() {
        return this.currentContainer.feature.tableSelectedList
      },
      set(value) {
	      this.$store.commit('tableSelected', {
	          index: this.currentContainer.i,
	          value
	        })
	      }
    },
    // 设置关联的查询面板
    checkedSearch: {
    	get () {
    		if (!this.currentContainer.feature.relativeSearch) {
    			this.currentContainer.feature.relativeSearch = []
    		}
    		return this.currentContainer.feature.relativeSearch
    	},
    	set (value) {
	      this.$store.commit('checkedRelativeSearch', {
	        index: this.currentContainer.i,
	        value
	      })
    	}
    },
    // 可级联的维度数据
    cascadeList () {
    	if (!this.currentContainer.feature.DimCascade) {
    		this.currentContainer.feature.DimCascade = []
    	}
    	return this.currentContainer.feature.DimCascade
    },
    checkedCascade () {
    	if (!this.currentContainer.feature.cascadeIdArr) {
    		this.currentContainer.feature.cascadeIdArr = []
    	}
    	return this.currentContainer.feature.cascadeIdArr
    }
	},
	methods: {
		changeCheckedDim (node, ischecked) {
			let index = this.currentContainer.i
			// console.log(node, ischecked)
			// 判断当前节点勾选状态
			if (ischecked) {
				// 是否含有子集
				if (node.hasOwnProperty('children')) {
					// for (let i = 0; i < node.children.length; i++) {
					// 	let sunNode = node.children[i]
					// 	this.addCascade(index, sunNode.dimCode, sunNode.father, sunNode.id)
					// }
				} else {
					this.addCascade(index, node.dimCode, node.father, node.id)
				}
			} else {
				if (node.hasOwnProperty('children')) {
					// for (let i = 0; i < node.children.length; i++) {
					// 	let sunNode = node.children[i]
					// 	this.delCascade(index, sunNode.dimCode, sunNode.father, sunNode.id)
					// }
				} else {
					this.delCascade(index, node.dimCode, node.father, node.id)
				}
			}
		},
		// 新增级联维度配置
		addCascade (index, dimCode, father, id) {
      this.$store.commit('setDropDownCascade', {
	      index: index,
	      dimCode: dimCode,
	      father: father
	    })
      this.$store.commit('saveCascadeId', {
	      index: index,
	      dimCode: dimCode,
	      id,
	      father
	    })
		},
		// 删除级联维度配置
		delCascade (index, dimCode, father, id) {
      this.$store.commit('delDropDownCascade', {
	      index,
	      dimCode,
	      father
	    })
      this.$store.commit('delCascadeId', {
	      index: index,
	      dimCode: dimCode,
	      id,
	      father
	    })
		},
    // 勾选同比环比
    handleDateCompareCheck(value, type) {
      let index = this.currentContainer.i
      this.$store.commit('setDateCompareCheck', {
        index,
        value,
        type
      })
    }
	},
	mounted () {

	}
}
</script>

<style lang="less">
	.right-senior-demo {
		max-height: 410px;
    overflow: auto;
		.senior-header {
			// color:#333333;
			font-family: PingFangSC-Medium;
			padding-left: 10px;
			font-size: 14px;
			font-weight: bold;
			height: 48px;
			line-height: 48px;
			span {
				color: #333333;
			}
			i {
				float: right;
				margin-right: 9px;
				line-height: 48px;
			}
			.clear-style {
				clear: both;
			}
		}
		.senior-table-body {
			.senior-icon-style {
				position: relative;
				color: #C1C3C3;
				top: -5px;
			}
			.senior-title {
				padding-left: 12px;
				margin-bottom: 8px;
				color: #666666;
				font-family: PingFangSC-Regular;
				font-size: 0px;
				.mysign{
					height: 6px;
					width: 6px;
					margin-right: 8px;
					display: inline-block;
					vertical-align: middle;
					background-color: #d8d8d8;
					border-radius: 100%;
				}
				> span{
					display: inline-block;
					vertical-align: middle;
					font-size: 14px;
				}
			}
			// 图表名称主体
			.table-list {
				margin-left: 26px;
				margin-bottom: 5px;
				color:#333333;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				.table-style {
					display: table-row;
				}
				.el-tree__empty-block{
					display: none;
				}
			}
		}
	}
  .right-senior-demo::-webkit-scrollbar {
    width: 0px;
  }
  .el-tree-node__content>.el-tree-node__expand-icon {
  	padding-left: 0px;
  }
</style>
