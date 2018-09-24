<template>
  <div class="right-Component">
    <div class="text-area">
      <!-- 文本折叠板 -->
      <div class="text-content">
        <!-- v-model="activeName" -->
        <!-- <el-collapse accordion> -->
          <div class="text-body-style">
            <el-collapse-item ref="collapse-text">
        
              <template slot="title" >
                <div>
                  文本
                </div>
                
              </template>
              
              <!-- 文本区域 -->
              <div class="text-demo">
                <el-input
                  size="mini"
                  class="textarea-style"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入文本内容"
                  v-model="textContent">
                </el-input>
                <!-- <div class="row_border"><el-checkbox v-model="isBorder">显示边框</el-checkbox></div> -->
              </div>
            
            </el-collapse-item>
          </div>
        <!-- </el-collapse> -->
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name:'textArea',
  data() {
    return {
    }
  },
  props: ["message"],
  computed: {
    // 获取vuex数据
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    textContent: {
     // 获取vuex中feature数据
      get () {
        return this.currentContainer.feature.textCategory[this.message].value
      },
      /**
       * @param index: 当前容器下标
       * @param value: 修改相应下标文本区域的内容
       * @param key: 配置面板文本组件相应下标
       */
      set (value) {
        this.$store.commit('changeTextArea', {
          index: this.currentContainer.i,
          value,
          key: this.message
        })
      }
    },
    isBorder: {
      get () {
        return this.currentContainer.feature.textCategory[this.message].isBorder
      },
      set (value) {
        this.$store.commit('changeTextBorder', {
          index: this.currentContainer.i,
          value,
          key: this.message
        })
      }      
    }
  },
  mounted () {
    // 默认展开当前面板
    this.$nextTick(() => {
      this.$refs['collapse-text'].handleHeaderClick()
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
    .textarea-style {
      padding: 0;
      font-family: HiraginoSansGB-W3;
      textarea {
        border: 1px solid #D9D9D9;
      }
    }
    .row_border{
      margin-top: 10px;
      text-align: right;
    }
  }
</style>
