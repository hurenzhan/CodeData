<template>
  <div class="right-metric">
		<!-- 右侧指标显示按钮列表封装组件 -->
    <p 
		  class="right-metric-list"
			:class="{isSelcet: isActive}"
      :title="metricName"
			@click="addDataMetrics(metricData.metricCode, metricData.metricName, index, indexNum, metricData.metricIndex)">
			{{metricName}}
		</p>
	
  </div>
</template>

<script>
import aliasMap from '../../mixins/aliasChange/aliasMap'
export default {
  name: 'metricsList',
  mixins: [aliasMap],
  data() {
		return {
			// isActive: false
		}
	},
  props: ["index", "metricData", "metricIndex", "indexNum"], // metricIndex：当前第几个添加的下拉框查询条件面板
	computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    // 可修改的指标名
    metricName () {
      let alias = this.getAliasByMetricCode(this.metricData.metricCode)
      return alias === false ? this.metricData.metricName : alias
    },
    // 查询面板使用中的指标列表
    dataMetricData () {
      return this.currentContainer.feature.dataMetricData
    },
    // 关联当前指标控件的查询面板指标列表
    relativeMetricList () {
      return this.dataMetricData.filter(item => item.containerNum === this.indexNum)
    },
    // 当前指标选项是否选中
    isActive () {
      return this.relativeMetricList.some(item => item.metricCode === this.metricData.metricCode)
    }
  },
  mounted() {

  },
	methods: {
		// 左侧添加指标查询条件
    addDataMetrics(metricCode, metricName, key, containerNum, metricIndex) {
      // 删除选项
      if (this.isActive) {
        let index = this.dataMetricData.findIndex(item => item.metricCode === this.metricData.metricCode && item.containerNum === this.indexNum)
        this.currentContainer.feature.dataMetricData.splice(index, 1)
        return
      }
      // 新增选项
      if (!this.isActive) {
        this.$store.commit('addDataMetrics',{
          index: this.currentContainer.i,                       // 容器的i
          metricCode,                                           // 指标编码
          metricName,                                           // 指标名称
          key,                                                  // 当前新建索引
          isActive: true,                                       // 高亮标志 => 废弃
          containerNum,                                         // 对应的指标控件 ['num0', 'num1']
          metricIndex: this.metricIndex,                        // 当前指标查询条件的索引 => 废弃
          title: '',                                            // input输入框
          selectedOper: '0',                                    // 已选操作符
          Operator: [
            {
              value: '0',
              name: '大于'
            },
            {
              value: '1',
              name: '小于'
            },
            {
              value: '2',
              name: '大于等于'
            },
            {
              value: '3',
              name: '小于等于'
            }
          ]
        })
      }
    }
	}
}
</script>

<style lang="less" scoped>
.right-metric {
	margin-bottom: 6px;
	.right-metric-list {
    height: 25px;
    line-height: 25px;
		color: #606266;
		border: 1px solid #dcdfe6;
		padding-left: 10px;
		border-radius: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    font-size: 12px;
  }
  .isSelcet {
    color: #409EFF;
    border-color: #409EFF;
    background-color: #ecf5ff;
	}
  .right-metric-list:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}
</style>
