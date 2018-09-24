<template>
    <div class="relation-style">
        <div class="style-title"><span class="point"></span>布局</div>
        <div class="config-relation">
          <el-checkbox checked>树型关系图</el-checkbox>
          <div class="node-set">
            <span style="margin-bottom: 5px;">维度节点配置</span>
              <el-select v-model="changeValue" placeholder="请选择" size="mini">
                <el-option
                  v-for="(item, index) in nodeTypeList"
                  :key="index"
                  :label="index|filtetIndex"
                  :value="index + 1"
                  :disabled="index === 0 || item.disabled">
                </el-option>
            </el-select>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'RelationStyle',
  props: {
    index: {
      default: 0
    }
  },
  computed: {
    // 获取指标编号下拉列表
    nodeTypeList () {
      return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.nodeTypeList
    },
    changeValue: {
      get () {
        if (parseInt(this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.nodeNo)) {
          return `节点${this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.nodeNo}`
        } else {
          return '请选择节点'
        }
      },
      set (value) {
        this.$store.commit('changeNode', {
          index: this.index,
          value,
        })
      }
    }
  },
  filters: {
    filtetIndex (value) {
      return `节点${value + 1}`
    }
  }
}
</script>

<style lang="less">
.relation-style{
  font-size: 14px;
  height: calc(100vh - 267px);
  overflow: auto;
  border-top: 1px solid #E8EAEB;
  .style-title {
    color: #666666;
    line-height: 20px;
    margin-top: 16px;
    .point{
      display: inline-block;
      height: 6px;
      width: 6px;
      box-sizing: border-box;
      border-radius: 100%;
      background: #d8d8d8;
      vertical-align: top;
      margin: 6px 8px 6px 10px;
    }
  }
  .config-relation{
      padding-top:10px;
      padding-left: 24px;
      clear:both;
      .node-set{
        margin-top: 5px;
        margin-left: 24px;
        margin-right: 15px;
        .el-select{
          margin-top: 3px;
        }
      }
    }
}
</style>
