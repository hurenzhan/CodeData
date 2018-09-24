<template>
  <el-dialog
    @click.native.stop
    class="metric-dialog"
    :visible="value"
    :width="width"
    :show-close="false">
    <div slot="title" class="metric-dialog-title">
      <span class="metric-dialog-title-name">
        <span>{{title}}告警</span>
        <span></span>
      </span>
      <span>
        <el-button size="mini" @click.stop="$store.commit('toggleWarnDialog', false)">返回</el-button>
        <el-button type="primary" size="mini" @click="save">保存</el-button>
      </span>
    </div>
    <div class="metric-dialog-content">
      <p class="metric-dialog-content-name">
        <span>名称</span>
        <el-input size="mini" style="width:434px" placeholder="请输入名称" v-model="warnName"></el-input>
      </p>
    </div>
    <div class="metric-dialog-content" style="padding-top:15px;display: flex;justify-content: space-between;">
      <span style="padding-right:4.1px">指标</span>
      <el-select size="small" v-model="metricCode" placeholder="请选择指标" style="width:434px">
        <el-option
          v-for="item in metric"
          :key="item.metricCode"
          :label="item.metricName"
          :value="item.metricCode">
        </el-option>
      </el-select>
    </div>
    <div class="metric-dialog-content" style="padding-top:15px">
      <span style="padding-right:80%">区域设置</span>
      <i style="cursor:pointer;" class="el-icon-arrow-down el-icon-plus" @click.stop="addText()"></i>
      <div class = "pie-line">
      </div>
      <div v-for="(item, index) in settings" style="padding-top:15px" :key="index">
         <span style="padding-right:9px">提醒</span>
          <el-input size="mini" style="width:136px" placeholder="请输入提醒" v-model="item.warn"></el-input>
          <el-select size="mini" style="width:88px"  v-model="item.selected" placeholder="请选择" @change="(value) => changeSelect(value, index)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
         <el-input size="mini" style="width:130px" :type="item.inputType" placeholder="请输入数字或1-" v-model="item.number"></el-input>
         <div style="float:right;margin-right:5px">
           <el-button style="padding:2px 6px"  @click.stop="delTextArea(index)" size="small" >-</el-button>
         </div>
          <color-picker v-model="item.color" style="float:right;margin-right:10px;"  :colors="myColors"></color-picker>
           <p class="metric-dialog-content-name">
            <span>备注</span>
            <el-input size="mini" style="width:434px" placeholder="请输入备注" v-model="item.note"></el-input>
          </p>
      </div>
    </div>
    <div class="metric-dialog-content" style="padding-top:15px">
      <span>缺省值</span>
      <div class = "pie-line">
      </div>
      <div class="metric-dialog-content">
      <p class="metric-dialog-content-name">
        <span style="padding-right:2px">提醒</span>
        <el-input size="mini" style="width:398px" placeholder="请输入提醒" v-model="defaultName"></el-input>
        <color-picker style="float:right;margin-right:1px;margin-left:8px" v-model="defaultColor"  :colors="myColors"></color-picker>
      </p>
      <p class="metric-dialog-content-name">
        <span>备注</span>
        <el-input size="mini" style="width:434px" placeholder="请输入备注" v-model="defaultNote"></el-input>
      </p>
    </div>
    </div>

  </el-dialog>
</template>

<script>
import api from "../../../api/charts";
import colorPicker from "./color.vue";
import bus from "../utils/eventBus";

export default {
  name: "warnDialog",
  props: {
    'value': {
      default: false
    }
  },
  data() {
    return {
      title: '新建',
      warnIndex: 0,
      width: "514px",
      defaultName: "",
      defaultColor: "#D86C4C",
      defaultNote: "",
      warnName: "",
      metricCode: "",
      settings: [
        { warn: "", selected: "", number: "", color: "#D86C4C", note: "", inputType: "number" }
      ],
      myColors: [
        "#D86C4C",
        "#FAD645",
        "#49FCFD",
        "#1990FE",
        "#D673B9",
        "#9E66E0",
        "#8DDA23",
        "#263675"
      ],
      name: "",
      options: [
        {
          value: "0",
          label: "大于"
        },
        {
          value: "1",
          label: "小于"
        },
        {
          value: "2",
          label: "大于等于"
        },
        {
          value: "3",
          label: "小于等于"
        },
        {
          value: "4",
          label: "等于"
        },
        {
          value: "6",
          label: "区间"
        }
      ],
      value111: "2"
    };
  },
  computed: {
    chartsOption(){
      return  this.$store.state.charts.chartsOption
    },
    // 选中的容器
    index() {
      let index = 0;
      if (this.chartsOption.length !== 0 &&
          this.chartsOption.filter(item => !item.drop && item.selected).length !== 0) {
          index = this.chartsOption.filter(item => !item.drop && item.selected)[0].i
      }
      return index
    },
    // 获取当前面板索引的样式面板的属性
    feature() {
      if(this.chartsOption.length !==0){
        return this.chartsOption[this.index].feature
      }
    },
    metric(){
      return  this.feature && this.feature.metricListFlat;
    },
    warnData() {
      return this.$store.state.charts.chartsOption[this.index].warnData || [];
    }
  },
  components: {
    colorPicker
  },
  methods: {
    // 改变下拉选项时对后面的输入框做校验
    changeSelect(value, index) {
      if (value === "6") {
        this.settings[index].inputType = 'text'
      } else {
        // 如果转到数字类型时不是数字类型就置空
        if (!Number(this.settings[index].number)) {
          this.settings[index].number = ''
        }
        this.settings[index].inputType = 'number'
      }
    },
    init(index) {
      const obj = this.warnData[index];
      this.warnName = obj === undefined ? "" : obj.name;
      this.metricCode = obj === undefined ? "" : obj.metricCode;
      this.settings =
        obj === undefined
          ? [
              {
                warn: "",
                selected: "1",
                number: "",
                color: "#D86C4C",
                note: ""
              }
            ]
          : obj.settings;
      this.defaultName = obj === undefined ? "" : obj.defaultName;
      this.defaultColor = obj === undefined ? "#D86C4C" : obj.defaultColor;
      this.defaultNote = obj === undefined ? "" : obj.defaultNote;
    },
    // 添加文本区域
    addText() {
      if (this.settings.length > 4) {
        this.$message({
          message: "暂时只能添加5条区间",
          type: "warning"
        });
        return;
      }
      this.settings.push({
        warn: "",
        selected: "1",
        number: "",
        color: "#D86C4C",
        note: ""
      });
    },

    delTextArea(index) {
      if (this.settings.length < 2) {
        this.$message({
          message: "最少保留1条区间",
          type: "warning"
        });
        return;
      }
      this.settings.splice(index, 1);
    },
    save() {
      const inputReg = new RegExp(/(^[\u4E00-\u9FA5A-Za-z0-9_]+$)+/);
      const selectReg = new RegExp(/^[(-|\+)\d][^-]*-[^-][\d]*$/)
      const selectNumberReg = new RegExp(/^(?:0|\-?(?:0\.\d*[1-9]|[1-9]\d*(?:\.\d*[1-9])?))$/);
      if (this.warnName == "" || this.defaultName == "") {
        this.$message({
          message: "请输入名称、提醒",
          type: "warning"
        });
        return;
      }
      if (!inputReg.exec(this.warnName) || !inputReg.exec(this.defaultName)) {
        this.$message({
          message: "格式错误，支持中文、英文、数字、下划线",
          type: "warning"
        });
        return;
      }
      for (let i = 0; i < this.settings.length; i++) {
        const item = this.settings[i];
        if (item.warn == "") {
          this.$message({
            message: "请输入区域设置提醒、阈值",
            type: "warning"
          });
          return;
        }
        if (
          !inputReg.exec(item.warn)
        ) {
          this.$message({
            message:
              "格式错误，提醒支持中文、英文、数字、下划线；阈值支持数字、区间",
            type: "warning"
          });
          return;
        }
        if (item.selected === '6' && !selectReg.exec(item.number)) {
          this.$message({
            message: "当选择区间时必须以1-10这种格式",
            type: 'warning'
          })
          return;
        }
        if (item.selected !== '6' && !selectNumberReg.exec(item.number) || item.number == "") {
          this.$message({
            message: "当选择比较关系时必须以数字",
            type: 'warning'
          })
          return;
        }
      }
      const emitObj = {
        name: this.warnName,
        metricCode: this.metricCode,
        settings: this.settings,
        defaultName: this.defaultName,
        defaultColor: this.defaultColor,
        defaultNote: this.defaultNote
      };
      this.$store.commit("saveWarnData", { index: this.index, emitObj, warnIndex: this.warnIndex });
      this.$store.commit("toggleWarnDialog", false);
    }
  },
  mounted() {
    bus.$on(`add`, ({index}) => {
      if (index === this.index) {
        this.warnIndex = null;
        this.warnName = "";
        this.metricCode = "";
        this.title = '新建'
        this.settings = [
          { warn: "", selected: "", number: "", color: "#D86C4C", note: "", inputType: "number" }
        ];
        this.defaultName = "";
        this.defaultColor = "#D86C4C";
        this.defaultNote = "";
      }
    });
    bus.$on(`edit`, ({index, warnIndex}) => {
      if (index === this.index) {
        this.title = '编辑'
        this.warnIndex = warnIndex;
        this.init(this.warnIndex);
      }
    });
  },
  watch: {
    metric(curVal,oldVal) {
      // console.log(curVal,oldVal)
    }
  }
};
</script>

<style lang="less">
@defaultHeight: 32px;
.metric-dialog {
  > .el-dialog {
    transition: all 0.2s ease;
  }
}
.pie-line {
  border-top: 1px solid #e8eaeb;
  padding: 0px 0px 10px 0px;
}
.metric-dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .metric-dialog-title-name {
    > span:first-child {
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
    > span:last-child {
      font-size: 12px;
      color: #ccc;
    }
  }
  > span {
    > button {
      padding-top: 9px;
      padding-bottom: 9px;
    }
  }
}
.metric-dialog-content {
  .metric-dialog-content-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    > span {
      white-space: nowrap;
      margin-right: 10px;
      font-size: 14px;
      color: #333;
    }
    > div.el-input {
      > input {
        height: @defaultHeight;
      }
    }
  }
}
</style>
