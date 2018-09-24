<template>
  <div class="right-dim">
		<!-- 右侧指标显示按钮列表封装组件 -->
    <p 
		  class="right-dim-list"
			:class="{isSelcet: isActive, isDisabled: disabledValue}"
      :title="dimName"
			@click="addDimList(dimData.dimCode, dimData.dimName, index)">
			{{dimName}}
		</p>
    <control-type :index="index" :dimData="dimData" v-if="!isCustomDim && isActive"></control-type>
  </div>
</template>

<script>
import eventBus from '../../../utils/eventBus'
import aliasMap from '../../mixins/aliasChange/aliasMap'
import controlType from './controlType'
export default {
  name: `dimList${this.index}`,
  mixins: [aliasMap],
  data() {
		return {

		}
	},
  components: {
    controlType
  },
  props: ['index','dimData'],
	computed: {
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    // 不可设置维度
    disabledDimList () {
      let disabledDim = []
      if (this.currentContainer.feature.relativeSearch.length > 0) {
        let relative = this.getValidSearch(this.currentContainer.feature.relativeSearch)
        for (let i = 0; i < relative.length; i++) {
          let index = relative[i]
          let dimList = this.$store.state.charts.chartsOption[index].feature.dropDownData
          dimList.forEach(item => {
            disabledDim.push(item.dimCode)
          })
        }
      }
      return disabledDim
    },
    disabledValue () {
      return this.disabledDimList.some(item => item === this.dimData.dimCode)
    },
    isActive () {
      return this.currentContainer.feature.dropDownData.some(item => {
        return item.dimCode === this.dimData.dimCode
      })
    },
    // 修改后的维度名
    dimName () {
      let alias = this.getAliasByDimCode(this.dimData.dimCode)
      return alias === false ? this.dimData.dimName : alias
    },
    // 是否是自定义维度
    isCustomDim () {
      let custom = false
      let dimCode = this.dimData.dimCode
      // 是否自定义维度
      if (dimCode.indexOf('DASP') !== -1) {
        if (dimCode.split('_')[0] === 'DASP') {
          custom = true
        }
      }
      return custom
    }
  },
  mounted() {
    const initConfig = this.currentContainer.feature.dropDownData
    // this.initState(initConfig)
  },
	methods: {
    // 对关联的查询检查是否可用 (关联过的查询面板可能会被删除)
    getValidSearch (relative) {
      let charts = this.$store.state.charts.chartsOption
      return relative.filter(id => {
        let chart = charts[id]
        // 判断是否在删除的Tab里
        let inDropTab = false
        if (chart.tabContainerIndex !== undefined) {
          charts[chart.tabContainerIndex].drop ? inDropTab = true : inDropTab = false
        }
        return !chart.drop && !inDropTab
      })
    },    
    // 左侧添加指标查询条件
    /**@augments
     * dimCode: 维度编码
     * dimName: 维度名称
     * key: 操作的第几个维度
     */
    addDimList(dimCode, dimName, key) {
      // 不可选择的维度
      if (this.disabledValue) {
        return
      }
      const dimIndex = this.currentContainer.i
      // 逻辑修改，已添加的维度，再次点击的时候删除该条
      let dimFlag = false
      // 添加判断，是否已添加过当前指标
      this.currentContainer.feature.dropDownData.forEach((item,index) => {
        if (item.dimCode === dimCode) {
          // this.$Message.warning('当前指标已添加，不允许重复添加！！！')
          // 删除当前索引数据
          this.currentContainer.feature.dropDownData.splice(index, 1)
          dimFlag = true
          return
        }
      })
      // 删除维度时 级联数组中删除该维度接连选项配置
      if (dimFlag) {
        // 配置级联
        if (!this.currentContainer.feature.DimCascade.some(item => {item.dimCode === dimCode})) {
          this.$store.commit('delDimCascade', {
            index: this.currentContainer.i,
            dimCode,
            dimName: this.dimData.dimName
          })
        }
      }
      // 标志非true,则添加
      if (!dimFlag) {
        this.$store.commit('addDropDownList',{
          index: this.currentContainer.i,
          dimCode,                  // 维度编码
          dimName,                  // 维度名
          controlType: 0,           // 后期新增控件类型识别符 (0: 多选控件, 1: 单选控件, 2: 自定义输入控件)
          key,                      // 索引 (已弃用,版本兼容保留字段)
          isActive: true,           // 当前维度是否已启用 (已弃用,版本兼容保留字段)
          selectedOper: 'in',       // 选中的操作符数据
          dimSelectedList: [],      // 选中的维值 id集合
          dimSelectedNameList: [],  // 选中的维值 name集合
          dimSelected:[],           // 维值初始化
          father: [],               // 级联时 上级维度
          children: [],             // 级联时 下级维度
          Operator: [               // 操作符初始化
            {
              value: 'in',
              name: '包含'
            },
            {
              value: 'not in',
              name: '不包含'
            }
          ]
        })
        // 是否是自定义维度
        let hasNoValueId = false
        if (dimCode.indexOf('DASP') !== -1) {
          if (dimCode.split('_')[0] === 'DASP') {
            hasNoValueId = true
          }
        }
        // 非自定义维度时 action异步请求, 根据维度code查询维值列表
        if (!hasNoValueId) {
          this.$store.dispatch('getDimListData', {dimIndex, dimCode, key})
        }

        // 新增维度时  为该维度配置级联相关选项
        if (!hasNoValueId && !this.currentContainer.feature.DimCascade.some(item => {item.dimCode === dimCode})) {
          this.$store.commit('getDimCascade', {
            index: this.currentContainer.i,
            dimCode,
            dimName: dimName
          })
        }
      }
    }
	}
}
</script>

<style lang="less" scoped>
.right-dim {
  position: relative;
	margin-bottom: 8px;
	.right-dim-list {
    height: 25px;
    cursor: pointer;
    line-height: 25px;
    color: #606266;
    border: 1px solid #dcdfe6;
		padding-left: 10px;
		border-radius: 3px;
    font-size: 12px;
  }
  .isSelcet {
    color: #409EFF;
    border-color: #409EFF;
    background-color: #ecf5ff;
	}
  .right-dim-list:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .isDisabled {
    cursor: not-allowed
  }
}
	
</style>
