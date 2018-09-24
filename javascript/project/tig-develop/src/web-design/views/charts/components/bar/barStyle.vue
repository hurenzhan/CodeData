<template>
       <div class="config-style my-slide-bar" >
        <div class = "bar-line">
          <div class="title-bar"><span class="point"></span>布局</div>
          <div class="config-line">
	            <div class="config-line-item">
                <div class="row-bar">
                   <el-checkbox v-model="crosswise" @change="changeCrosswise(true)" :disabled="doubleY">横向</el-checkbox>
                </div>
                <div class="row-bar">
                    <el-checkbox v-model="stack" @change="changeStack(true)" :disabled="doubleY||metricListLength<=1 || showNumber||isShowLineChart|| indexPave">堆积</el-checkbox>
                </div>
                <div class="row-bar">
                   <el-checkbox v-model="doubleY" @change="changeDoubleY(true)" :disabled="stack || metricListLength!=2 || crosswise || styleConfig.config.yAxis[0].show == false">双Y轴</el-checkbox>
                </div>
               <!--   <div class="row-bar">
                  <el-checkbox v-model="line" @change="changeLine(true)" :disabled="!doubleY || metricListLength!=2">折线图</el-checkbox>
                 </div> -->
                <div class="row-bar">
                    <el-checkbox v-model="y"  @change="showY(true)">显示Y轴</el-checkbox>
                </div>
                <div class="row-bar">
                  <el-checkbox v-model="x" @change="showX(true)">显示X轴</el-checkbox>
                </div>
                <div class="row-bar">
                    <el-checkbox v-model="axisTitle" @change='changeAxisTitle(true)' :disabled="indexPave">显示轴标题</el-checkbox>
                </div>
                 <div class="row-bar" v-show="axisTitle" style="padding-left: 24px; margin-bottom: 10px">
                   <ul class="show-title-as">
                     <p>X轴标题重命名:</p>
                     <el-input :disabled="crosswise" v-model="XAxisTitle" placeholder="请输入X轴标题" @blur="changeX(true)" size="mini" :maxlength="8" />
                     <p>Y轴标题重命名:</p>
                     <el-input :disabled="crosswise" v-model="YAxisTitle" placeholder="请输入X轴标题" @blur="changeY(true)" size="mini" :maxlength="8" />
                   </ul>
                 </div>
               <!--  <div class="row-bar" v-if ="isShowTimeAxis">
                    <el-checkbox v-model="timeAxis" @change="changeTimeAxis" :disabled="indexPave">显示时间轴</el-checkbox>
                </div> -->
                  <div class="row-bar">
                    <el-checkbox v-model="isShowLineChart" @change="changeShowLine(true)" :disabled="stack||indexPave">显示折线图</el-checkbox>
                    <div style="margin-left:15px;margin-top:8px;margin-bottom: 8px" v-show='isShowLineChart'>
                      <el-select  size="mini" multiple v-model="selectMetricList" placeholder="请选择" class="e-select ellipsis" @change="changeLineChart(true)" >
                          <el-option
                            v-for="item in metricList"
                            :key="item.metricCode"
                            :label="item.metricName"
                            :value="item.metricCode">
                          </el-option>
                      </el-select>
                  </div>
                </div>
                  <div class="row-bar">
                    <el-checkbox v-model="indexPave" @change="changeIndexPave(true)" :disabled="timeAxis||isShowLineChart || stack">指标平铺展示</el-checkbox>
                 </div>
                  <div class="row-bar" v-show ="indexPave">
                    <el-checkbox v-model="dimFilter" @change="changeDimFilter">维值筛选</el-checkbox>
                 </div>
                 <div class="row-bar" v-show="dimFilter&&indexPave" style="margin-bottom: 10px">
                   <dima-limit :index="index" :indexPave='indexPaveFlag' :clear="clear"  @on-change-dim="changeDim" @on-change-dimValue="changeDimValueTotal" :dimValueList="dimValueList" @on-change-remote="changeRemoteMethod" :loading="loading"></dima-limit>
                 </div>
           <!--       <div class="row-bar"  v-show = 'dimFilter'>
                   <span style="float:left;margin-top:12px;font-size:14px;">选择维度</span>
                   <el-select  placeholder="请选择维度"  v-model="selectedDim" @change="changeDim" class="barDim">
                    <el-option
                      v-for="item in crossDimList"
                      :key="item.dimCode"
                      :label="item.dimName"
                      :value="item.dimCode">
                    </el-option>
                  </el-select>
                 </div>
                <div class="row-bar"  style="clear:both;" v-show = 'dimFilter'>
                   <span  style="float:left;margin-top:10px;font-size: 14px;">选择维值</span>
                  <el-select
                v-model="selectDimValue"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入维值"
                :remote-method="remoteMethod"
                :loading="loading"  @change="changeDimValueTotal"  class="barDim"  collapse-tags>
                <el-option
                  v-for="item in dimValueList"
                  :key="item.dimValue"
                  :label="item.dimValueNm"
                  :value="item.dimValue">
                </el-option>
              </el-select>
                 </div> -->
	            </div>
          </div>
          <div class="line1"></div>
	    </div>
	   <div class="bar-line" style="clear: both;margin-top:15px;border-top:none">
	      <div class="title-bar"><span class="point"></span>设计</div>
	      <div class="config-line">
	       <div class="config-line-item">
	         <div class="row-bar">
	         <label><el-checkbox v-model="legendShow" :disabled="timeAxis" @change="changeLegendShow">显示图例</el-checkbox></label>
	         </div>
	         <div class="row-bar row-p" style="margin-left:20px;">
		         <el-radio v-model="legendPosition" label="top" @change="changeLengend" style="width:10px;margin-top:10px" :disabled="!legendShow || timeAxis" >上</el-radio>
	             <el-radio v-model="legendPosition" label="bottom" @change="changeLengend" style="width:10px;margin-top:10px" size="mini" :disabled="!legendShow || timeAxis">下</el-radio>
		         <el-radio v-model="legendPosition" label="left" @change="changeLengend"  style="width:10px;margin-top:10px" size="mini" :disabled="!legendShow || timeAxis" >左</el-radio>
		         <el-radio v-model="legendPosition" label="right" @change="changeLengend" style="width:10px;margin-top:10px" 	size="mini" :disabled="!legendShow || timeAxis">右</el-radio>
	         </div>
	       </div>
	      	<div class="config-line-item">
	         <div class="row-bar">
	           <el-checkbox v-model="tooltip">显示ToolTip</el-checkbox>
	         </div>
	       </div>
          <div class="config-line-item">
           <div class="row-bar">
             <el-checkbox v-model="showNumber" @change="changeShowNumber(true)" :disabled="stack">显示数值</el-checkbox>
           </div>
         </div>
        <div class="config-line-item">
           <div class="row-bar">
             <el-checkbox v-model="isGuideShow" @change="changeGuideShow(true)">显示辅助线</el-checkbox>
           </div>
         </div>
          <div class="config-line-item">
           <div class="row-bar">
             <el-checkbox v-model="isMeasureLineShow" @change="changeMeasureLine(true)" :disabled="doubleY&&metricListLength==2">显示度量水平线</el-checkbox>
           </div>
           <div class="row-bar row-p" style="margin-top:8px">
             <el-radio v-model="measureLineType" label="0"  style="width:50px" :disabled="!isMeasureLineShow || doubleY &&metricListLength==2" @change="changeMeasureType(true)">固定值</el-radio>
              <el-radio v-model="measureLineType" label="1" :disabled="!isMeasureLineShow || doubleY&&metricListLength==2" @change="changeMeasureType(true)">平均值</el-radio>
           </div>
            <div class="row-bar row-p" style="margin-top:8px">
             <el-input v-model.number="dimValue" placeholder="请输入维度值" v-show="measureLineType==0" :disabled="!isMeasureLineShow" @blur="changeDimValue"></el-input>
           </div>
         </div>
	      </div>
	    </div>
       </div>
</template>

<script>
  import barMethod from './barMix'
  // import {getCrossDimList} from '../../utils/utils'
  import dimaLimit from './dimaLimit'
  import bus from '../../utils/eventBus'
  export default {
    name: 'pie-style',
    components: {
      dimaLimit
    },
    props: {
      index: {
        default: 0
      }
    },
    mixins: [barMethod],
    data() {
      return {
        loading: false,
        dimValueList: [],
        indexPaveFlag: true,
        clear: true
      }
    },
    computed: {
      styleConfig() {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
      },
      isShowTimeAxis() {
        const isShowTimeAxis = this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.isShowTimeAxis
        return  isShowTimeAxis
      },
      metricListLength() {
        const metricListFlat = this.$store.state.charts.chartsOption[this.index].feature.metricListFlat
        return metricListFlat ? metricListFlat.length : this.$store.state.charts.chartsOption[this.index].feature.metricList.length
      },
      metricList() {
        return this.$store.state.charts.chartsOption[this.index].feature.metricListFlat ? this.$store.state.charts.chartsOption[this.index].feature.metricListFlat  : this.$store.state.charts.chartsOption[this.index].feature.metricList
      },
      option () {
        return this.$store.state.charts.chartsOption[this.index]
      },
      //   // 交叉维度
      // crossDimList () {
      //   return getCrossDimList(this.$store.state.charts.dataSet, this.option.feature.metricList)
      // },
      x: {
        get() {
          return this.styleConfig.config.xAxis[0].show
        },
        set(value) {
          this.$store.commit('editMidOptionBarXAxis', {
            index: this.index,
            name: 'show',
            value,
          })
        }
      },
      y: {
        get() {
          return this.styleConfig.config.yAxis[0].show
        },
        set(value) {
          this.$store.commit('editMidOptionBarYAxis', {
            index: this.index,
            name: 'show',
            value,
          })
        }
      },
      indexPave: {
        get() {
          return this.styleConfig.config.indexPave
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'indexPave',
            value,
          })
        }
      },
      dimFilter: {
       get() {
          return this.styleConfig.config.dimFilter
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'dimFilter',
            value,
          })
        }
      },
     // selectedDim: {
     //   get() {
     //      return this.styleConfig.config.selectedDim
     //    },
     //    set(value) {
     //      this.$store.commit('editMidOptionBar', {
     //        index: this.index,
     //        name: 'selectedDim',
     //        value,
     //      })
     //    }
     //  },
      stack: {
        get() {
          return this.styleConfig.config.stack
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'stack',
            value,
          })
        }
      },
      timeAxis: {
        get() {
          return this.styleConfig.config.timeAxis
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'timeAxis',
            value,
          })
        }
      },
      selectMetricList: {
        get() {
          return this.styleConfig.config.selectMetricList ? this.styleConfig.config.selectMetricList : []
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'selectMetricList',
            value,
          })
        }
      },
      isMeasureLineShow: {
        get() {
          return this.styleConfig.config.isMeasureLineShow
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'isMeasureLineShow',
            value,
          })
        }
      },
      doubleY: {
        get() {
          return this.styleConfig.config.doubleY
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'doubleY',
            value
          })
        }
      },
      isShowLineChart: {
        get() {
          return this.styleConfig.config.isShowLineChart
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'isShowLineChart',
            value
          })
        }
      },
      line: {
        get() {
          return this.styleConfig.config.line
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'line',
            value
          })
        }
      },
      isGuideShow: {
        get() {
          return this.styleConfig.config.isGuideShow
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'isGuideShow',
            value,
          })
        }
      },
      dimValue: {
        get() {
          return this.styleConfig.config.dimValue
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'dimValue',
            value
          })
        }
      },
     XAxisTitle: {
        get() {
          return this.styleConfig.config.XAxisTitle
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'XAxisTitle',
            value
          })
        }
      },
      YAxisTitle: {
        get() {
          return this.styleConfig.config.YAxisTitle
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'YAxisTitle',
            value
          })
        }
      },
      measureLineType: {
        get() {
          return this.styleConfig.config.measureLineType
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'measureLineType',
            value
          })
        }
      },
     legendPosition: {
        get() {
          return this.styleConfig.config.legendPosition
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'legendPosition',
            value,
          })
        }
      },
     axisTitle: {
        get() {
          return this.styleConfig.config.axisTitle
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'axisTitle',
            value,
          })
        }
      },
      showNumber: {
        get() {
          return this.styleConfig.config.showNumber
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'showNumber',
            value,
          })
        }
      },
      crosswise: {
        get() {
          return this.styleConfig.config.crosswise
        },
        set(value) {
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'crosswise',
            value,
          })
        }
      },
      tooltip: {
        get() {
          return this.styleConfig.config.tooltip.show
        },
        set(value) {
          this.$store.commit('changeToolip', {
            index: this.index,
            type: value
          })
        }
      },
      // 图例显示
      legendShow: {
        get() {
          return this.styleConfig.config.legend.show
        },
        set(value) {
          // if (value) {
          //   this.isDisabledLegend = false
          // } else {
          //   this.isDisabledLegend = true
          // }
          this.$store.commit('editMidOptionBar', {
            index: this.index,
            name: 'legend',
            toEdit: 'show',
            value,
          })
        }
      }
    },
    methods: {
      changeDimFilter(val) {
        const selectDimValue = this.styleConfig.config.selectDimValue
        if (!val) {
          this.$store.commit('cancelDimFilter', {
            index: this.index
          })
          if (selectDimValue && selectDimValue.length) {
            bus.$emit(`updateIndexPave_${this.option.i}`, {
              index: this.index,
              value: true
            })
          }
      }
    }
  },
  beforeDestroy () {
      bus.$off(`clearDimValue_${this.index}`)
  },
  mounted() {
    this.getDimValueList()
    bus.$on(`clearDimValue_${this.index}`, (obj) => {
     this.dimValueList = []
    })
  }
 }
</script>
<style lang="less">
/*        .barDim{
          margin-top: 10px;
          margin-bottom: 10px;
          margin-left:10px;
          float:left;
          .el-input{
            .el-input__inner{
            width: 110px;
            min-height: 32px !important;
            height: 32px;
          }
          }

        }*/
        .el-radio {
          font-weight: normal !important;
         }
        .config-style::-webkit-scrollbar {
          display: none;
         }
        .ellipsis{
          .el-select__tags-text{
              max-width: 100px;
            display: inline-block;
            vertical-align: top;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
        .row-bar {
          .el-radio__label {
            font-size: 14px;
            padding-left: 6px;
           }
        .el-checkbox{
          font-weight: normal !important;
          }
        }
        .el-select-dropdown__item.selected {
        color: #409EFF;
        font-weight: normal !important;
      }
      .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
        right: 0px !important;
        content: "";
      }
   .config-style{
      height: calc(100vh - 300px);
      overflow-y: auto;
      overflow-x: hidden;
       .el-input__inner {
          height: 32px;
          width: 162px;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label{
        color:#333;
      }
      .el-checkbox__label {
       color: #333333;
       }
       .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #51A6FF;
        border-color: #51A6FF;
        }
    .title-bar {
     padding-left:0px;
     color:#666666;
     font-size: 14px;
     margin-top:10px;
     .point{
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
    .bar-line {
      border-top: 1px solid #E8EAEB;
     /* padding: 0px 0px 10px 0px;*/
     .line1{
       border-top: 1px solid #E1E3E3;
      margin-left:25px;
      margin-top:8px
     }
      .config-line{
	   .config-line-item {
	     	 padding-top:5px;
	     	 padding-left: 25px;
	     	 clear:both;
	     	 .row-p {
	     	 	margin-left:25px;
	     	 	.e-radio {
	     	 		width:10px;
	     	 	}
          .row-p-input{
            width: 162px;
            height: 32px
          }
          .el-input--mini .el-input__inner{
            width: 160px;
            height: 32px;
          }
	     	 }
	     	 .pie-label {
	     	 	float:left;
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
	          .content{
	          	float:left;
	          	padding-left:10px;
	          	.e-select {
	          		width:115px;
	          		height: 32px;
	          		/*margin-left:60px;*/
	          	}
	          	.e-select-r{
	              width:140px;
	              height: 32px
	          	}
	          }
	     }
      }
    }
  }
.show-title-as .el-input{
  margin: 2px 14px 5px 0;
  width: 130px;
}
.show-title-as .el-input .el-input__inner{
  width: 130px;
  height: 28px;
}
.show-title-as p {
  font-size: 12px;
  color: #666;
}
</style>
