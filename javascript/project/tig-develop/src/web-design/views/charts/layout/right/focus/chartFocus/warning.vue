<template>
  <div style="padding-left: 10px;padding-top: 10px">
    <div class="title-area">
      <div class="dot"></div>
      <span style="padding-right:120px;">告警</span>
      <i style="cursor:pointer;margin-left:15px;" class="el-icon-arrow-down el-icon-plus" @click.stop="addText"></i>
    </div>
     <div  v-for="(item, index) in warnData" :key="index" style="margin:6px 0">
        <el-button type="info"  size="small" @click.stop="edit(index)" style="width:148px;height:32px;background: #F1F3F5;border: 1px solid rgba(0,0,0,0.15);border-radius: 4px;color: #333;">{{item.name}}</el-button>
         <i style="padding-left:10px;cursor:pointer;font-size:14px;" class="el-icon-edit" @click.stop="edit(index)"></i>
         <div style="float:right;;padding-right: 10px;padding-top: 3px;" @click.stop="delTextArea(index)">
             <el-button style="padding:2px 6px;border: 1px solid #999999;" size="small" >-</el-button>
         </div>
    </div>
    <div style="font-family: PingFangSC-Regular;font-size: 14px;color: #999999; margin-left: 18px;">* 注：告警只对表格生效</div>
  </div>
</template>

<script>
import bus from "../../../../utils/eventBus";
export default {
  name: "warning",
  computed: {
    warnData() {
      return this.$store.state.charts.chartsOption[this.index].warnData || [];
    },
    // 选中的容器
    index() {
      return this.$store.state.charts.chartsOption.filter(
        item => !item.drop && item.selected
      )[0].i;
    },
  },
  methods: {
    // 添加文本区域
    addText() {
      if (this.warnData.length > 2) {
        this.$message({
          message: "暂时只能添加3条告警",
          type: "warning"
        });
      } else {
        bus.$emit(`add`, {index: this.index});
        this.$store.commit("toggleWarnDialog", true);
      }
    },
    edit(index) {
      bus.$emit(`edit`, {index: this.index, warnIndex: index});
      this.$store.commit("toggleWarnDialog", true);
    },
    delTextArea(index) {
      this.$store.commit(`delWarnData`, {index: this.index, warnIndex: index})
    }
  }
};
</script>

<style lang="less" scoped>
.title-area {
  padding-bottom: 12px;
  padding-top: 12px;
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  font-size: 14px;
  color: #666666;
}
</style>







