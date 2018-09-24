<template>
	<!--数据指标组件-->
  <div class="right-Component">
    <div class="metric-content">
      <!-- <el-collapse  accordion> -->
        <el-collapse-item title="数据指标" ref="collapse-metrics">

          <!-- 标题输入框 -->
          <div class="data-style">
            <!-- <el-input 
              class="input-style"
              size="mini"
              clearable
              v-model="dataMetricTitle"
              placeholder="请输入标题">
            </el-input> -->
            <div class="input-icon">
              <span>选择数据指标</span>
              <i class="el-icon-search" @click="isShow"></i>
              <div class="demo"></div>
            </div>
            <el-input class="show-input-style" v-show="isShowInput" v-model="searchKey" placeholder="请输入指标名称"></el-input>
          </div>
          
          <!-- 动态显示图表使用的指标 -->
          <div 
            v-for="(item, index) in computeMetricList"  :key="index" 
          >
            <metric-list v-show="item.metricName.includes(searchKey)" :indexNum="indexNum" :metricIndex="metricMessage" :index="index" :metricData= "item"></metric-list>
          </div>

        </el-collapse-item>
      <!-- </el-collapse> -->
    </div>
  </div>
 
</template>

<script>
import { getMetricOrDimUsed } from '../../../utils/utils'
import metricList from './metricRightList'
export default {
  name:'dataMetrics',
  data() {
    return {
      isShowInput: false, // 是否展示输入框（默认不展示）
      searchKey: '', // 输入框值
      // activeName: '1', // 默认打开伸缩板
    }
  },
  components: {
    metricList
  },
  props: ["metricMessage", "indexNum"], // 当前指标下标索引
  computed: {
    // 获取vuex数据
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    // 修改数据指标title
    dataMetricTitle: {
      get () {
        return this.currentContainer.feature.dataMetricListTitle
      },
      set(value) {
        this.$store.commit('changeDataMetricTitle', {
          index: this.currentContainer.i,
          value
        })
      }
    },
    // 实时计算当前使用到指标
    computeMetricList () {
      return getMetricOrDimUsed(this.$store.state.charts.chartsOption,1)
    }
  },
  methods: {
      // 是否展示输入框
    isShow () {
      this.isShowInput = !this.isShowInput
    },
  },
  mounted () {
    // 默认展开当前面板
    this.$nextTick(() => {
      this.$refs['collapse-metrics'].handleHeaderClick()
    })
  }
}
</script>

<style lang="less">
.metric-content {
  .el-collapse-item__header {
    border: 1px solid rgba(0,0,0,0.15);
    background-color: #F1F3F5;
    border-radius: 4px;
    padding-left: 10px;
    height: 32px;
    line-height: 32px;
    .el-collapse-item__arrow {
      line-height: 32px;
    }
  }
  .el-collapse-item__wrap {
    border-bottom: none;
    width: 100%;
    padding: 0;
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
  .data-style {
    margin-top: 10px;
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
      .demo {
        clear: both;
      }
    }
    .input-style {
      height: 32px;
      line-height: 32px;
      // margin-bottom: 10px;
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
} 
  
  .isSelcet {
    color: red;
    border: 1px solid red;
  }
  .data-border {
    text-align: center;
    border: 1px solid #ccc;  
    margin-bottom: 5px;
  }
</style>