<template>
	<!-- 右侧高级面板 -->
  <div class="right-senior-demo">

        <div class="senior-body">
          <el-collapse-item name="2">

							<!-- 高级折叠板-标题 -->
							<template slot="title">
								<div class="senior-header">
									高级
								</div>
							</template>

							<!-- 折叠板内容区域 -->
							<div class="senior-table-body">

								<!-- 内容区域title -->
								<p class="senior-title">图表关联<i class="el-icon-question icon-style senior-icon-style"></i></p>

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

							</div>

          </el-collapse-item>
        </div>

    </div>
</template>

<script>
export default {
	name: 'rightSenior',
  computed: {
		// 获取vuex数据
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
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
          return item.id === 0 && !item.drop && !inDropTab
        }
      ).map(({name, i}) => ({name, i}))
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
    }
	}
}
</script>

<style lang="less">
	.right-senior-demo {
		.senior-body {
			.senior-header {
				color:#333333;
				font-family: PingFangSC-Medium;
				padding-left: 10px;
				font-size: 14px;
				font-weight: bold;
			}
			.el-collapse-item{
				.el-collapse-item__wrap {
					border-bottom: none;
					.senior-table-body {
					// background-color: red;
						padding-left: 10px;
						padding-right: 10px;
						.senior-icon-style {
							position: relative;
							top: -6px;
							color: #ccc;
						}
						.senior-title {
							color: rgba(204, 204, 204, 0.795);
						}
						// 图表名称主体
						.table-list {
							.table-style {
								display: table-row;
							}
						}
					}
				}
			}

		}
	}
</style>
