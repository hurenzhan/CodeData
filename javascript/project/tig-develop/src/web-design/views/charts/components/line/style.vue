<template>
  <div class="config-linestyle">
    <div class="pie-line">
      <div class="style-title"><span class="point"></span>布局</div>
      <div class="config-line">
          <div class="config-line-item">
            <div class="row">
                <el-checkbox v-model="isCross" @change="changeCrosswise" :disabled="isDoubleY || isSlider">横向</el-checkbox>
            </div>
            <div class="row">
                <el-checkbox v-model="isDoubleY" @change="changeDoubleY" :disabled="disableDY || isCross">双Y轴</el-checkbox>
            </div>
            <div class="row row-p" v-if="isDoubleY">
                <el-checkbox v-model="isBar" @change="changeType">柱状图</el-checkbox>
            </div>
            <div class="row">
                <el-checkbox v-model="isArea" @change="showArea" :disabled="isBar">面积</el-checkbox>
            </div>
            <div class="row">
                <el-checkbox v-model="isSmooth" @change="changeSmooth" :disabled="isBar">曲线</el-checkbox>
            </div>
            <div class="row">
                <el-checkbox v-model="yShow" @change="isShowY">显示Y轴</el-checkbox>
            </div>
            <div class="row">
                <el-checkbox v-model="xShow" @change="isShowX">显示X轴</el-checkbox>
            </div>
            <div class="row">
                <el-checkbox v-model="isTitle" @change='changeAxisTitle'>显示轴标题</el-checkbox>
            </div>
            <div class="row" style="padding-left: 24px;" v-if="isTitle">
                <ul class="show-title-as">
                  <p>X轴标题重命名:</p>
                  <el-input :disabled="isCross" v-model="xTitle" @input='modifyXAxisTitle' size="mini" :maxlength="8" />
                  <p>Y轴标题重命名:</p>
                  <el-input :disabled="isCross" v-model="yTitle" @input='modifyYAxisTitle' size="mini" :maxlength="8" />
                </ul>
            </div>
            <div class="row">
               <el-checkbox v-model="tableSwitch" @change="showTable">图表切换</el-checkbox>
            </div>
          </div>
      </div>
    </div>
    <div class="pie-line">
      <div class="style-title"><span class="point"></span>设计</div>
      <div class="config-line">
        <div class="config-line-item">
          <div class="row">
           <label><el-checkbox v-model="legendShow" @change="showLegend">显示图例</el-checkbox></label>
          </div>
          <div class="row row-p">
	          <el-radio v-model="legend" label="top" @change="changeLengend('top')" :disabled="!legendShow">上</el-radio>
            <el-radio v-model="legend" label="bottom" @change="changeLengend('bottom')" :disabled="!legendShow">下</el-radio>
	          <el-radio v-model="legend" label="left" @change="changeLengend('left')" :disabled="!legendShow">左</el-radio>
	          <el-radio v-model="legend" label="right" @change="changeLengend('right')" :disabled="!legendShow">右</el-radio>
          </div>
        </div>
      	<div class="config-line-item">
          <div class="row">
            <el-checkbox v-model="isTooltip" @change="showTooltip">显示ToolTip</el-checkbox>
          </div>
        </div>
        <div class="config-line-item" v-if="isTooltip">
          <div class="row row-p">
            <el-checkbox v-model="isShadow" @change="showShadow" :disabled="!isTooltip">显示鼠标面积悬停</el-checkbox>
          </div>
        </div>
        <!-- 该选项仅在时间维度时生效 /-->
        <div class="config-line-item">
          <div class="row">
            <el-checkbox v-model="isSlider" :disabled="!isTime || isCross" @change="showSlider">显示时间轴</el-checkbox>
          </div>
        </div>
        <div class="config-line-item">
          <div class="row">
            <el-checkbox v-model="isValue" @change="showValue">显示数值</el-checkbox>
          </div>
        </div>

        <!-- 该选项仅在时间维度时生效 /-->
        <div class="config-line-item">
          <div class="row">
            <el-checkbox v-model="isTimeSet" :disabled="!isTime">设置查询时间范围</el-checkbox>
          </div>
        </div>

        <div class="config-line-item" v-if="isTimeSet">
          <div class="row row-p">
            <span class="label_number-before">往前</span>
            <el-input-number size="mini" :max="31" :min="-31" v-model="numberTime" @change="setNumberTime"></el-input-number>
            <span class="label_number-after">往后</span>
          </div>
        </div>

        <!-- 显示累计数据 /-->
        <div class="config-line-item">
          <div class="row">
            <el-checkbox v-model="isValueSum" @change="setValueSum" :disabled="countLimit">累计数据(仅限时间维升序)</el-checkbox>
          </div>
        </div>
      </div>
	  </div>
  </div>
</template>

<script>
  import bus from '../../utils/eventBus'
  export default {
    name: 'line-style',
    components: {

    },
    props: {
      index: {
        default: 0
      }
    },
    data() {
      return {
          isArea: false,      // 当前style 是否堆叠区域图
          isSmooth: false,    // 当前style 线条类型是否smooth
          isTitle: false,     // 标题显示
          isDoubleY: false,   // 当前style 是否存在双Y轴
          isCross: false,     // 是否存在双XY交换
          isBar: false,       // 是否存在柱状图
          xShow: false,       // 是否显示X轴
          yShow: false,       // 是否显示Y轴
          isTooltip: true,    // 是否显示tooltip
          legendShow: true,   //  是否显示图例
          legend: 'top',      // 图例位置
          tableSwitch: false,
          isShadow: false,
          isSlider: false,    // 是否显示滑块控件
          isValue: false,
          numberTime: 0,
          isValueSum: false   // 启用累计数据
        }
    },
    computed: {
      styleConfig () {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
      },
      // 标题内容
      chartTitle: {
        get() {
          return this.styleConfig.config.chartTitle
        },
        set(value) {

        }
      },
      config () {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config
      },
      // 当前仅俩个指标时 可切换矩形图
      disableDY () {
        if (this.config.series.length === 2) {
          return false
        } else {
          return true
        }
      },
      // 当前仅俩个指标时 可切换矩形图
      disableBar () {
        if (this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.series && this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.series.length === 2) {
          return false
        } else {
          return true
        }
      },
      // 判断当前维度是否是时间维度
      isTime () {
        if (this.$store.state.charts.chartsOption[this.index].feature.dimList && this.$store.state.charts.chartsOption[this.index].feature.dimList[0] && this.$store.state.charts.chartsOption[this.index].feature.dimList[0].dimCode === 'dasp_date') {
          return true
        } else {
          return false
        }
      },
      // 是否启用自定义控制时间
      isTimeSet: {
        get () {
          return this.config.isTimeSet ? this.config.isTimeSet : false
        },
        set (value) {
          this.$store.commit('changeTimeSet', {
            index: this.index,
            type: value,
            statue: true,
            record: {
              name: 'changeTimeSet',
              optionVal: value
            }
          })
          if (!value) {
            bus.$emit(`updateData_${this.index}`, {
              index: this.index,
              special_query: true
            })
            this.$store.commit('setNumberTime', {
              index: this.index,
              type: 0,
              statue: true,
              record: {
                name: 'setNumberTime',
                optionVal: 0
              }
            })
            this.numberTime = 0
          }
        }
      },
      xTitle: {
        get () {
          return this.config.xName
        },
        set () {}
      },
      yTitle: {
        get () {
          return this.config.yName
        },
        set () {}
      },
      // 是否只有一个维值
      isSingleValue () {
        let single = true
        this.config.series.forEach(item => {
          if (item.data.length !== 1) {
            single = false
          }
        })
        return single
      },
      countLimit () {
        let chart = this.$store.state.charts.chartsOption[this.index]
        if (this.isTime && !parseInt(chart.sortByWhich) && !parseInt(chart.sortType)) {
          return false
        } else {
          return true
        }
      }
    },
    watch: {
      // 多个折线图图 切换时更新style样式区域
      styleConfig () {
        this.initData()
      }
    },
    methods: {
      // 初始化按钮选项
      initData () {
        if (this.styleConfig.config.xAxis && this.styleConfig.config.xAxis.length > 0) {
          this.xShow = this.styleConfig && this.styleConfig.config && this.styleConfig.config.xAxis && this.styleConfig.config.xAxis[0] && this.styleConfig.config.xAxis[0].axisLabel.show
        } else {
          this.xShow = false
        }

        if (this.styleConfig.config.yAxis && this.styleConfig.config.yAxis.length > 0) {
          this.yShow = this.styleConfig && this.styleConfig.config && this.styleConfig.config.yAxis && this.styleConfig.config.yAxis[0].axisLabel.show
        } else {
          this.yShow = false
        }

        if (this.styleConfig.config.series && this.styleConfig.config.series.length > 0) {
          this.isArea =  this.styleConfig.config.series[0].hasOwnProperty('areaStyle')
        } else {
          this.isArea = false
        }

        if (this.styleConfig.config.series.length > 0) {
          this.isSmooth =  this.styleConfig.config.series[0].smooth ? this.styleConfig.config.series[0].smooth : false
        } else {
          this.isSmooth = false
        }

        // this.isTitle = this.styleConfig.config.xAxis[0].hasOwnProperty('name') ? this.styleConfig.config.xAxis[0].hasOwnProperty('name') : false
        this.isTitle = this.styleConfig.config.isTitle || false

        this.isTooltip = this.styleConfig.config.tooltip.show ? this.styleConfig.config.tooltip.show : false
        this.legendShow = this.styleConfig.config.legend.show ? this.styleConfig.config.legend.show : false
        if (this.styleConfig.config.yAxis.length > 1) {
          this.isDoubleY =  true
        } else {
          this.isDoubleY = false
        }

        if ((this.styleConfig.config.yAxis.length > 0) && (this.styleConfig.config.yAxis[0].type === 'category')) {
          this.isCross = true
          //this.xTitle = this.styleConfig.config.yAxis[0].name || ''
          //this.yTitle = this.styleConfig.config.xAxis[0].name || ''
        } else {
          this.isCross = false
          //this.xTitle = this.styleConfig.config.xAxis[0].name || ''
          //this.yTitle = this.styleConfig.config.yAxis[0].name || ''
        }
        this.isBar = false
        if (this.styleConfig.config.series && this.styleConfig.config.series.some(item => item.type === 'bar')) {
          this.isBar = true
        }
        // if (this.styleConfig.config.series && this.styleConfig.config.series.length == 2 && this.styleConfig.config.series[1].type === 'bar') {
        //   this.isBar =  true
        // } else {
        //   this.isBar = false
        // }

        if (this.styleConfig.config.tooltip && this.styleConfig.config.tooltip.axisPointer && this.styleConfig.config.tooltip.axisPointer.type === 'shadow') {
          this.isShadow = true
        } else {
          this.isShadow = false
        }

        if ((this.styleConfig.config.series.length > 0) && this.styleConfig.config.series[0].label.show) {
          this.isValue =  true
        } else {
          this.isValue = false
        }

        this.legend = this.styleConfig.config.positionName,

        // 图表切换
        this.tableSwitch = this.styleConfig.config.switchTable
        // 显示时间轴
        this.isSlider = this.styleConfig && this.styleConfig.config && this.styleConfig.config.dataZoom && this.styleConfig.config.dataZoom.show
        // 自定义控制时间
        this.numberTime = this.styleConfig.config.numberTime
        // 是否启用累计数据
        this.isValueSum = this.styleConfig.config.isValueSum
      },
      // 图例位置
      changeLengend(value) {
        const vertical = 'vertical'
        const horizontal = 'horizontal'
        this.$store.commit('setLegendPosition', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'changeLengend',
            optionVal: value
          }
        })
      },
      // XY交叉
      changeCrosswise(value) {
        this.$store.commit('changeXtoY', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'changeCrosswise',
            optionVal: value
          }
        })
      },
      // 是否显示轴标题
      changeAxisTitle (value) {
        this.$store.commit('showAxisTitile', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'changeAxisTitle',
            optionVal: value
          }
        })
      },
      // 修改显示的轴标题
      modifyXAxisTitle (value) {
        this.$store.commit('modifyXAxisTitleShow', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'modifyXAxisTitle',
            optionVal: value
          }
        })
      },
      modifyYAxisTitle (value) {
        this.$store.commit('modifyYAxisTitleShow', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'modifyYAxisTitle',
            optionVal: value
          }
        })
      },
      // 是否显示双Y轴
      changeDoubleY(value) {
        this.$store.commit('showDoubleY', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'changeDoubleY',
            optionVal: value
          }
        })
        // 取消双Y轴时 取消柱状图
        if (!value && this.isBar) {
          if (!this.isSingleValue) {
            this.isBar = false
          }
          this.changeType(false)
        }
      },
      showTooltip (value) {
        this.$store.commit('showTootip', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'showTooltip',
            optionVal: value
          }
        })
      },
      showShadow (value) {
        this.$store.commit('showTootipType', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'showShadow',
            optionVal: value
          }
        })
      },
      // 切换折线图的type类型
      changeType (value) {
        this.$store.commit('switchType', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'changeType',
            optionVal: value
          }
        })
      },
      // 是否显示X轴
      isShowX (value) {
        this.$store.commit('switchXshow', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'isShowX',
            optionVal: value
          }
        })
      },
      // 是否显示Y轴
      isShowY (value) {
        this.$store.commit('switchYshow', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'isShowY',
            optionVal: value
          }
        })
      },
      // 当前style 线条是否smooth
      changeSmooth (value) {
        this.$store.commit('switchSmooth', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'changeSmooth',
            optionVal: value
          }
        })
      },
      // 当前style 是否堆叠区域图
      showArea (value) {
        this.$store.commit('switchArea', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'showArea',
            optionVal: value
          }
        })
      },
      // 是否显示图例
      showLegend (value) {
        this.$store.commit('switchLegend', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'showLegend',
            optionVal: value
          }
        })
      },
      // 是否显示图表切换开关
      showTable (value) {
        this.$store.commit('switchTable', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'showTable',
            optionVal: value
          }
        })
      },
      // 是否显示值
      showValue (value) {
        this.$store.commit('switchValue', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'showValue',
            optionVal: value
          }
        })
      },
      // 是否显示滑块
      showSlider (value) {
        this.$store.commit('switchSlider', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'showSlider',
            optionVal: value
          }
        })
      },
      // 设置查询时间
      setNumberTime (value) {
        this.$store.commit('setNumberTime', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'setNumberTime',
            optionVal: value
          }
        })
        bus.$emit(`updateData_${this.index}`, {
          index: this.index,
          special_query: true
        })
      },
      // 启用汇总查询
      setValueSum (value) {
        this.$store.commit('setValueSum', {
          type: value,
          index: this.index,
          statue: true,
          record: {
            name: 'setValueSum',
            optionVal: value
          }
        })
        bus.$emit(`updateData_${this.index}`, {
          index: this.index,
          special_query: true
        })
      }
    },
    mounted () {
      this.initData()
      bus.$on('initStyle', obj => {
        if (this.index === obj.index) {
          this.initData()
        }
      })
    },
    beforeDestroy() {
      bus.$off('initStyle')
    }
  }
</script>
<style lang="less">
   .config-linestyle{
     font-size: 14px;
     padding: 0px 0px 16px 0px;
     box-sizing: border-box;
     height: calc(100vh - 267px);
     overflow: auto;
    .style-title {
     color: #666666;
     line-height: 20px;
     margin-top: 16px;
    }
    .pie-line {
      border-top: 1px solid #E8EAEB;
      padding: 0px 0px 10px 0px;
      .config-line{
	    .config-line-item {
	     	 padding-top:10px;
	     	 padding-left: 24px;
	     	 clear:both;
	     	 .row-p {
	     	 	margin-left:22px;
	     	 	e-radio {
	     	 		width:40px;
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
          .label_number-before{
            font-size: 12px;
            color: #666666;
            margin-right: 5px;
          }
          .label_number-after{
            font-size: 12px;
            color: #666666;
            margin-left: 5px;
          }
	     }
      }
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
  }
  .config-linestyle::-webkit-scrollbar {
    display: none;
  }
  .config-linestyle .el-radio{
    margin-left: 0px;
  }
  .config-linestyle .el-radio span{

  }
  .config-linestyle .el-radio .el-radio__label{
    padding-left: 6px;
    padding-right: 6px;
  }
  .config-linestyle .el-checkbox__label, .config-linestyle .el-radio__label{
    color: #666666;
  }
  .config-linestyle .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #666666;
  }
  .config-linestyle .el-radio__input.is-checked+.el-radio__label{
    color: #666666;
  }
  .config-linestyle .el-input-number--mini {
    width: 100px;
  }
  .show-title-as .el-input{
    margin: 2px 14px 5px 0;
    width: 130px;
  }
  .show-title-as p {
    font-size: 12px;
    color: #666;
  }
</style>
