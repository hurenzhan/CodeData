<template>
  <!--下拉框组件-->
  <div class="right-Component">
    <!-- <el-collapse  accordion> -->
      <el-collapse-item title="数据维度" ref="collapse-drop">

        <!-- 下拉框内容区域 -->
        <div class="just-demo">

           <!-- 维度标题 -->
          <div class="data-style">
            <!-- <el-input
              class="input-style"
              size="mini"
              v-model="dropDownListTitle"
              clearable
              placeholder="请输入标题">
            </el-input> -->
            <div class="input-icon">
                <span>选择维度</span>
                <!-- icon图表 -->
                <i class="el-icon-search" @click="isShow"></i>
                <div class="clear-float"></div>
            </div>
            <el-input size="mini" class="show-input-style" v-show="isShowInput" v-model="searchKey" placeholder="请输入维度名称"></el-input>
          </div>
          <el-switch
            v-model="isPublicDim"
            active-text="启用全局查询条件"
            inactive-text="">
          </el-switch>
          <!-- 文本点击添加左侧维度 -->
          <div
            v-for="(item, index) in selectedDim"
            :key="item.dimCode"
          >
          <dim-list v-show="item.dimName.includes(searchKey)" :dimData="item"></dim-list>
          </div>
          <div
            v-for="(item, index) in unselectedDim"
            :key="item.dimCode"
          >
          <dim-list v-show="item.dimName.includes(searchKey)" :dimData="item"></dim-list>
          </div>
        </div>
      </el-collapse-item>
    <!-- </el-collapse> -->
  </div>
</template>

<script>
import { getMetricOrDimUsed, getCrossDimList, getMetricsUsed } from '../../../utils/utils'
import dimList from './dimRightList'
import eventBus from '../../../utils/eventBus'
export default {
  name: 'dropDown',
  data() {
    return {
      // activeName: '1', // 默认打开
      isActive: true,
      isShowInput: false, // 是否展示输入框（默认不展示）
      searchKey: '' // 输入框值
      // computedData: ''
    }
  },
  components: {
    dimList
  },
  computed: {
    // 获取vuex数据
    currentContainer () {
			return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    // 修改数据指标title
    dropDownListTitle: {
      get () {
        return this.currentContainer.feature.dropDownListTitle
      },
      set(value) {
        this.$store.commit('changedropDownListTitle', {
          index: this.currentContainer.i,
          value
        })
      }
    },
    isPublicDim: {
      get () {
        return this.currentContainer.feature.isPublicDim
      },
      set (value) {
        this.$store.commit('changePublicDim', {
          index: this.currentContainer.i,
          value
        })
      }
    },
    // 实时计算当前图表所有维度
    computeDimList () {
      // 获取已选指标的分析维度
      let dimList = getMetricOrDimUsed(this.$store.state.charts.chartsOption, 2)
      // 过滤掉时间维度
      return dimList.filter(item => item.dimCode !== 'dasp_date')
    },
    // 实时计算当前图表已选指标的公共维度
    publicDimList () {
      // 获取已所有图表选中指标
      let metricList = getMetricsUsed(this.$store.state.charts.chartsOption).map(item => {
          return {
            metricCode: item
          }
        })
      // 获取已选指标交叉维度
      let dimList = getCrossDimList(this.$store.state.charts.dataSet, metricList)
      // 过滤掉时间维度
      return dimList.filter(item => item.dimCode !== 'dasp_date')
    },
    /*
      * 对选中的维度有限排序
    */
    // 选中的维度
    selectedDim () {
      let dimList = []
      if (this.isPublicDim) {
        dimList = this.publicDimList
      } else {
        dimList = this.computeDimList
      }
      return dimList.filter(item => {
        if (this.currentContainer.feature.dropDownData.some(subItem => {
          return subItem.dimCode === item.dimCode }) )
        {
          return true
        }
      })
    },
    // 未选中的维度
    unselectedDim () {
      let dimList = []
      if (this.isPublicDim) {
        dimList = this.publicDimList
      } else {
        dimList = this.computeDimList
      }
      return dimList.filter(item => {
        if (!this.currentContainer.feature.dropDownData.some(subItem => {
          return subItem.dimCode === item.dimCode }) )
        {
          return true
        }
      })
    }
  },
  watch: {
    // computedData(val) {
    //   console.log('1231313213213123',val)
    // }
  },
  mounted () {
    // 默认展开当前面板
    this.$nextTick(() => {
      this.$refs['collapse-drop'].handleHeaderClick()
    })
  },
  methods: {
    // 是否展示输入框
    isShow () {
      this.isShowInput = !this.isShowInput
    },
    // 点击右侧相应下标维度，动态添加左侧维度区域
    addDimList(dimCode,dimName, key) {
      this.isActive = !this.isActive
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
      // 标志非true,则添加
      if (!dimFlag) {
        this.$store.commit('addDropDownList',{
          index: this.currentContainer.i,
          dimCode,
          dimName,
          key,
          selectedOper: '',           // 选中的操作符数据
          dimSelectedList: [],        // 选中的维值数据
          dimSelectedNameList: [],
          dimSelected:[],             // 维值初始化
          Operator: [ // 操作符初始化
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
      }
      // action异步请求, 根据维度code查询维值
      this.$store.dispatch('getDimListData',{dimIndex,dimCode,key})
    }
  }
}
</script>

<style lang="less">
  .right-Component {
    .el-switch{
      margin-bottom: 10px;
      font-size: 12px;
    }
    .el-switch__label {
      color: #666666;
      font-size: 12px;
    }
    .el-switch__label.is-active {
      color: #666666;
      font-size: 12px;
    }
    .el-collapse-item {
      .el-collapse-item__header {
        border: 1px solid rgba(0,0,0,0.15);
        background-color: #F1F3F5;
        color: #666666;
        border-radius: 4px;
        padding-left: 10px;
        height: 32px;
				line-height: 32px;
				.el-collapse-item__arrow {
					line-height: 32px;
				}
      }
      .el-collapse-item__wrap {
        width: 100%;
        border-bottom: none;
        .el-collapse-item__content {
          padding-bottom: 0px;
        }
      }
    }

    // 下拉框内容区域
    .just-demo {
      // background-color: #ccc;
      // 标题区域
       .input-style {
          height: 32px;
          line-height: 32px;
          // margin-bottom: 10px;
          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      .data-style {
        margin-top: 8px;
        .input-icon {
          margin: 12px 0 13px 0;
          span {
            float: left;
          }
          i {
            float: right;
            line-height: 23px;
            cursor: pointer;
          }
          .clear-float {
            clear: both;
          }
        }
        .show-input-style {
          height: 32px;
          line-height: 32px;
          margin-bottom: 16px;
          .el-input__inner {
            height: 32px;
          }
        }
      }
      .data-border {
        text-align: center;
        border: 1px solid #000;
        margin-bottom: 5px;
      }
      .isSelcet {
        color: red;
        border: 1px solid red;
      }
      .el-collapse-item__content {
        padding: 10px;
      }
    }
  }

</style>
