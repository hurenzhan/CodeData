<template>
  <div class="right-Component">
    <div class="text-area">
      <!-- 文本折叠板 -->
      <div class="text-content">
        <!-- v-model="activeName" -->
        <!-- <el-collapse accordion> -->
          <div class="text-body-style">
            <el-collapse-item ref="collapse-cycle">
        
              <template slot="title" >
                <div>
                  实时更新
                </div>
                
              </template>
              
              <!-- 文本区域 -->
              <div class="text-demo" @change="setUpdateType">
                <el-radio v-model="radio" label="1">分</el-radio>
                <el-radio v-model="radio" label="2">时</el-radio>
              </div>
            
            </el-collapse-item>
          </div>
        <!-- </el-collapse> -->
      </div>
    </div>
  </div>

</template>

<script>
import eventBus from '../../../utils/eventBus'
export default {
  name:'textArea',
  data() {
    return {

    }
  },
  props: ["index"],
  computed: {
    // 获取vuex数据
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    // 获取单选按钮状态
    radio: {
      get () {
        if (!this.currentContainer.feature.updateCycle) {
          this.currentContainer.feature.updateCycle = []
        }
        return this.currentContainer.feature.updateCycle[0].type
      },
      set (value) {
        this.$store.commit('setCycleType', {
          index: this.currentContainer.i,
          value
        })
      }
    }
  },
  methods: {
    setUpdateType () {
      eventBus.$emit(`setCycleType_${this.currentContainer.i}`, {index: this.currentContainer.i})
    }
  },
  mounted () {
    // 默认展开当前面板
    this.$nextTick(() => {
      this.$refs['collapse-cycle'].handleHeaderClick()
    })
  }
}
</script>

<style lang="less">
  .textarea-style {
    padding: 10px;
  }
  .text-body-style .el-collapse-item__header {
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 4px;
    padding-left: 10px;
    background-color: #F1F3F5;
    height: 32px;
    line-height: 32px;
    .el-collapse-item__arrow {
      line-height: 32px;
    }
  }
  .text-body-style .el-collapse-item__wrap {
    width: 100%;
    border-bottom: none;
    .el-collapse-item__content {
      padding-bottom: 0px;
    }
  }
  .text-body-style .text-demo {
    margin-top: 10px;
    text-align: center;
    .el-radio__label{
      color: #666666;
    }
    .el-radio__input.is-checked+.el-radio__label{
      color: #666666;
    }
  }
</style>
