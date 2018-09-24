<template>
       <div class="config-style-pie my-slide-bar">
        <div class = "pie-line-pie">
          <div class="title-pie"><span class="point"></span>布局</div>
          <div class="config-line">
	            <div class="config-line-item">
	              <label class="pie-label" >显示模式</label>
	              <div class="content">
	              <el-radio v-model="showrModel" label="0" @change="changeModel(true)" :disabled="dimListLength==2">标准饼图</el-radio>
	              </div>

	            </div>
	            <div class="config-line-item">
	              <label class="pie-label"></label>
	              <div class="content">
	               <el-radio v-model="showrModel" label="1" @change="changeModel(true)" :disabled="dimListLength==2">环形饼图</el-radio>
	              </div>
	            </div>
               <div class="config-line-item">
                <label class="pie-label"></label>
                <div class="content">
                 <el-radio v-model="showrModel" label="2" @change="changeModel(true)" :disabled="dimListLength!=2">嵌套饼图</el-radio>
                </div>
              </div>
	            <div class="config-line-item">
	              <label class="pie-label" style="margin-top:5px">标签样式</label>
	              <div class="content" >
	                 <el-select  size="mini"  v-model="labelStyle" placeholder="请选择" class="e-select"  @change="changeLabel" :disabled="isNumTotal&&showrModel==1">
	                    <el-option
	                        v-for="item in labelOption"
	                        :key="item.value"
	                        :label="item.label"
	                        :value="item.value"  :disabled="item.disabled">
	                    </el-option>
	                 </el-select>
	              </div>
	            </div>
		         <div class="config-line-item"  v-show="showrModel==1">
		              <label class="pie-label" style="margin-top:3px">突出显示</label>
		              <div class="content" >
		                  <el-select  size="mini" multiple v-model="highLight" placeholder="请选择" class="e-select pieHight" @change="changeLight(true)" :disabled="isNumTotal&&showrModel==1" >
		                      <el-option
		                        v-for="item in seriesData"
		                        :key="item.name"
		                        :label="item.name.indexOf('###')!==-1 ? item.name.replace('###','_') : item.name"
		                        :value="item.name">
		                      </el-option>
		                  </el-select>
		              </div>
		         </div>
	             <div class="config-line-item">
	               <el-checkbox v-model="pieAxisTitle" :disabled="(pavedDisplay&&showrModel==1)|| metricListLength>1" @change="changeShowAxisTitle">显示轴标题</el-checkbox>
	             </div>
	             <div class="config-line-item">
	               <el-checkbox v-model="showrLabelLine" :disabled="labelStyle==4||pavedDisplay&& showrModel==1|| isNumTotal&&showrModel==1" @change="changeLabelLine" >显示标签引线</el-checkbox>
	             </div>
	             <div class="config-line-item" v-show="showrModel==1">
	                 <el-checkbox v-model="pavedDisplay" @change="changePavedDisplay(true)">平铺展示</el-checkbox>
	             </div>
              <div class="config-line-item"  v-show="showrModel==1">
                   <el-checkbox v-model="isNumTotal" @change="showNum(true)"  :disabled="pavedDisplay ||!isShowTotal||highLight.length!=0">显示总值</el-checkbox>
               </div>
          </div>
          <div class="line" v-show="showrModel==0 ||showrModel==2"></div>
          <div class="line1" v-show="showrModel==1 "></div>
	    </div>
	    <div class="pie-line-pie" style="margin-top: 15px;border-top:none;">
	      <div class="title-pie"><span class="point"></span>设计</div>
	      <div class="config-line">
	       <div class="config-line-item" v-show="showrModel==1" >
	          <label class="pie-title"  style="margin-top: 5px">半径</label>
	          <div class="content">
                 <el-select  size="mini" v-model="radius"   placeholder="请选择"  class="e-select-r" :disabled="showrModel == 1 &&pavedDisplay" @change="changeRadius" >
                          <el-option
                            v-for="item in radiusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                  </el-select>
	          </div>
	       </div>
	       <div class="config-line-item">
	         <div class="row">
	         <label><el-checkbox v-model="legendShow" @change="changeLegendShow" >显示图例</el-checkbox></label>
	         </div>
	         <div class="row row-p" style="margin-left:20px">
		         <el-radio v-model="legendPosition" label="top" @change="changeLengend" style="width:10px;margin-top:10px" :disabled="showrModel == 1 &&pavedDisplay|| !legendShow">上</el-radio>
	             <el-radio v-model="legendPosition" label="bottom" @change="changeLengend" style="width:10px;margin-top:10px" size="mini" :disabled="showrModel == 1 &&pavedDisplay || !legendShow">下</el-radio>
		         <el-radio v-model="legendPosition" label="left" @change="changeLengend"  style="width:10px;margin-top:10px" size="mini" :disabled="showrModel == 1 &&pavedDisplay||!legendShow" >左</el-radio>
		         <el-radio v-model="legendPosition" label="right" @change="changeLengend" style="width:10px;margin-top:10px" 	size="mini" :disabled="showrModel == 1 &&pavedDisplay||!legendShow">右</el-radio>
	         </div>
	       </div>
	      	<div class="config-line-item">
	         <div class="row">
	           <el-checkbox v-model="tooltip">显示ToolTip</el-checkbox>
	         </div>
	       </div>
	      </div>
	    </div>
       </div>
</template>

<script>
import bus from "../../utils/eventBus";
import pieMethod from "./pie";
export default {
  name: "pie-style",
  components: {},
  props: {
    index: {
      default: 0
    }
  },
  mixins: [pieMethod],
  data() {
    return {
      isLabelReturn: true,
      radiusOption: [
        {
          value: "0.35",
          label: "35%"
        },
        {
          value: "0.40",
          label: "40%"
        },
        {
          value: "0.45",
          label: "45%"
        },
        {
          value: "0.5",
          label: "50%"
        },
        {
          value: "0.6",
          label: "60%"
        },
        {
          value: "0.7",
          label: "70%"
        },
        {
          value: "0.75",
          label: "75%"
        },
        {
          value: "0.8",
          label: "80%"
        },
        {
          value: "0.82",
          label: "85%"
        }
      ],
      disabled: false
    };
  },
  computed: {
    feature() {
       return this.$store.state.charts.chartsOption[this.index].feature;
    },
    styleConfig() {
      return this.$store.state.charts.chartsOption[this.index].feature
        .styleConfig;
    },
    labelOption() {
      return this.$store.state.charts.chartsOption[this.index].feature
        .styleConfig.config.labelOption;
    },
    chartId() {
      return `chartPie-${this.index}`;
    },
    seriesData() {
      const seriesData = this.$store.state.charts.chartsOption[this.index]
        .feature.styleConfig.config.data.seriesData;
      return seriesData ? seriesData : [];
    },
    legendData() {
      const legendData = this.$store.state.charts.chartsOption[this.index]
        .feature.styleConfig.config.data.legendData;
      return legendData ? legendData : [];
    },
    dimListLength() {
      return this.$store.state.charts.chartsOption[this.index].feature.dimList
        .length;
    },
    metricListLength() {
      const metricListFlat = this.$store.state.charts.chartsOption[this.index]
        .feature.metricListFlat;
      return metricListFlat
        ? metricListFlat.length
        : this.$store.state.charts.chartsOption[this.index].feature.metricList
            .length;
    },
    chartsOption() {
      return this.$store.state.charts.chartsOption;
    },
    option() {
      return this.$store.state.charts.chartsOption[this.index];
    },
    isShowTotal() {
      const metricList = this.$store.state.charts.chartsOption[this.index]
        .feature.metricList;
      if (metricList.length > 0) {
        const sdFlag = metricList[0].sdFlag;
        if (sdFlag === "0") {
          return true;
        } else {
          return false;
        }
      }
    },
    tooltip: {
      get() {
        return this.styleConfig.config.tooltip.show;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          toEdit: "show",
          name: "tooltip",
          value
        });
      }
    },
    pavedDisplay: {
      get() {
        return this.styleConfig.config.pavedDisplay;
      },
      set(value) {
        if (!value) {
          this.$store.commit("saveOperate", {
            index: this.index,
            type: "delete",
            methods: "changePavedDisplay"
          });
        }
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "pavedDisplay",
          value
        });
      }
    },
    isNumTotal: {
      get() {
        return this.styleConfig.config.isNumTotal;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "isNumTotal",
          value
        });
      }
    },
    // 标题内容
    legendPosition: {
      get() {
        return this.styleConfig.config.legendPosition;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "legendPosition",
          value
        });
      }
    },
    // 显示模式
    showrLabelLine: {
      get() {
        return this.styleConfig.config.labelLine;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "labelLine",
          value
        });
      }
    },
    // 设置半径
    radius: {
      get() {
        return this.styleConfig.config.radius;
      },
      set(value) {
        // value = value + '%'
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "radius",
          value
        });
      }
    },
    // 标签样式
    labelStyle: {
      get() {
        return this.styleConfig.config.labelStyle;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "labelStyle",
          value
        });
      }
    },
    // 轴标题
    pieAxisTitle: {
      get() {
        return this.styleConfig.config.title.show;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "title",
          toEdit: "show",
          value
        });
      }
    },
    // 图例显示
    legendShow: {
      get() {
        return this.styleConfig.config.legend.show;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "legend",
          toEdit: "show",
          value
        });
      }
    },
    showrModel: {
      get() {
        return this.styleConfig.config.showrModel;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "showrModel",
          value
        });
      }
    },
    highLight: {
      get() {
        return this.styleConfig.config.highLight;
      },
      set(value) {
        this.$store.commit("editMidOptionPie", {
          index: this.index,
          name: "highLight",
          value
        });
      }
    }
  },
  methods: {},
  beforeDestroy() {
    // bus.$off(`updateData_${this.index}`)
  },
  mounted() {}
};
</script>
<style lang="less">
.el-radio {
  font-weight: normal !important;
}
.config-style-pie::-webkit-scrollbar {
  display: none;
}
.el-collapse-item__wrap {
  border-bottom: none;
}
.row {
  .el-radio__label {
    font-size: 14px;
    padding-left: 6px;
  }
}
.el-collapse-item__content {
  padding-bottom: 10px;
}
.pieHight {
  .el-select__tags-text {
    max-width: 75px;
    display: inline-block;
    vertical-align: top;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.el-select-dropdown__item.selected {
  color: #409eff;
  font-weight: normal !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  right: 0px !important;
  content: "";
}
.config-style-pie {
  height: calc(100vh - 300px);
  overflow-y: auto;
  overflow-x: hidden;
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #333;
  }
  .el-select-dropdown__item.selected {
    color: #409eff;
    /* font-weight: 700; */
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    color: #409eff;
    background-color: #fff;
    font-weight: normal !important;
  }
  .el-checkbox__label {
    color: #333333;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #333;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #51a6ff;
    border-color: #51a6ff;
  }
  .el-input__inner {
    height: 32px;
    /* width: 115px;*/
  }
  .title-pie {
    padding-left: 0px;
    color: #666666;
    font-size: 14px;
    margin-top: 10px;
    .point {
      display: inline-block;
      height: 6px;
      width: 6px;
      box-sizing: border-box;
      border-radius: 100%;
      background: #d8d8d8;
      vertical-align: top;
      margin: 8px 8px 6px 10px;
    }
  }
  .pie-line-pie {
    border-top: 1px solid #e8eaeb;
    /* padding: 0px 0px 10px 0px;*/
    .line {
      border: 1px solid #e1e3e3;
      margin-left: 25px;
      margin-top: 8px;
    }
    .line1 {
      border-top: 1px solid #e1e3e3;
      margin-left: 25px;
      margin-top: 8px;
    }
    .config-line {
      .config-line-item {
        padding-top: 10px;
        padding-left: 25px;
        clear: both;
        .row-p {
          margin-left: 25px;
          e-radio {
            width: 10px;
          }
        }
        .pie-label {
          float: left;
          color: #333333;
          font-size: 14px;
          min-width: 60px;
          min-height: 1px;
        }
        .pie-title {
          float: left;
          color: #333333;
          font-size: 14px;
        }
        .content {
          float: left;
          padding-left: 10px;
          .e-select {
            width: 115px;
            min-height: 32px;
            /*overflow: auto;*/
            /*margin-left:60px;*/
          }
          .e-select-r {
            width: 140px;
            min-height: 32px;
          }
        }
      }
    }
  }
}
</style>
