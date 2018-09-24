<template>
  <div class="config-gaugestyle">
    <div class="column">
      <div class="style-title"><span class="point"></span>设计</div>
      <div class="config-line">
          <div class="config-line-item">
            <div class="row">
                <el-col :span="9"><span>显示模式</span></el-col>
                <el-col :span="10">
                  <span><el-radio v-model="gaugeModel" label="0" @change="changeModel">单色</el-radio></span>
                  <span><el-radio v-model="gaugeModel" label="1" @change="changeModel">多色</el-radio></span>
                </el-col>
            </div>
            <div class="row" style="marginBottom: 5px;">
                <el-checkbox v-model="isLenged" @change="showLenged">显示图例</el-checkbox>
            </div>
            <div class="row" style="marginBottom: 5px;">
                <el-checkbox v-model="isTooltip" @change="showTooltip">显示ToolTip</el-checkbox>
            </div>

            <div class="row" style="marginBottom: 5px;">
                <el-checkbox v-model="tickType" @change="switchTickType">显示百分比</el-checkbox>
            </div>
            <div class="row" style="marginBottom: 5px;">
                <span>目标值设置</span>
            </div>
            <div class="row" style="marginBottom: 5px;">
              <el-row :gutter="5">
                <el-col :span="22" style="marginBottom: 5px;">
                  <el-input :span="20" v-model="targetValue" type="number" size="mini" placeholder="设置目标值" @change="setTarget" ref='target_value'>
                  </el-input>
                </el-col>
              </el-row>
            </div>
            <div class="row" style="marginBottom: 5px;">
                <span>刻度设置</span>
            </div>
            <div class="row">
              <el-row :gutter="5">
                <el-col :span="8" style="marginBottom: 5px;"><el-input v-model="MinValue" type="number" size="mini" placeholder="最小值" width="50px" @change="setMinValue" ref="min_input"></el-input></el-col>
                <el-col :span="8" style="marginBottom: 5px;"><el-input v-model="MaxValue" type="number" size="mini" placeholder="最大值" width="50px" @change="setMaxValue" ref="max_input"></el-input></el-col>
                <el-col :span="6" style="marginBottom: 10px;"><el-input v-model.number="unit" size="mini" placeholder="单位" width="25px" :disabled="tickType" @change="setUnit" maxlength="4"></el-input></el-col>
              </el-row>
            </div>
            <div class="row" style="marginBottom: 5px;">
                <span>色彩设置</span>
            </div>
            <!--  单色模式 -->
            <div v-if="gaugeModel === '0'">
              <!-- <color-picker v-model="singelColor" :colors="myColors" @change="changeColorBySig"></color-picker> -->
              <div class="color_trigger" v-for="(item, index) in listColors" :key="index"  @click.stop="changeColorBySig(item)">
                <span class="color_outer" :style="{ borderColor: item}" :class="{'active': item === activeColor}">
                  <span class="color_inner" :style="{ backgroundColor: item}"></span>
                </span>
              </div>
            </div>
            <!--  多色模式 -->
            <div v-if="gaugeModel === '1'">
              <div class="row" style="marginBottom: 8px">
                  <el-radio v-model="colorType" label="0" @change="changeType">五等分</el-radio>
                  <el-radio v-model="colorType" label="1" @change="changeType">自定义</el-radio>
              </div>
              <div v-if="colorType === '1'" class="row">
                <div style="marginBottom: 5px; height: 28px;" v-for="(splite, index) in splites" :key="index">
                  <el-col :span="8" style="margin-right: 5px">
                    <el-select v-model="splite.start" size="mini" :disabled="index === 0" @change="setSplitStart(index)">
                      <el-option
                        v-for="item in colorOptions"
                        :value="item.value"
                        :label="item.label"
                        :key="item.value"
                        :disabled="(item.value >= splite.end) || (item.value <= splite.beforeStart)">
                      </el-option>
                    </el-select>
                  </el-col>

                  <el-col :span="8" style="margin-right: 5px">
                    <el-select v-model="splite.end" size="mini" @change="setSplitEnd(index)">
                      <el-option
                        v-for="item in colorOptions"
                        :value="item.value"
                        :label="item.label"
                        :key="item.value"
                        :disabled="item.value <= splite.start">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <color-picker v-model="splite.color" :colors="myColors" @change="setSplitColor(index)"></color-picker>
                  </el-col>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../../utils/eventBus'
  import colorPicker from './color.vue'
  export default {
    name: 'gauge-style',
    props: {
      index: {
        default: 0
      }
    },
    data() {
      return {
        gaugeModel: '0',
        colorType: '0',
        singelColor: '#57C92D',
        colorOptions: [
          { value: 0, label: 0} ,{ value: 0.1, label: 0.1},{ value: 0.2, label: 0.2},{ value: 0.3, label: 0.3},
          { value: 0.4, label: 0.4},{ value: 0.5, label: 0.5},{ value: 0.6, label: 0.6},{ value: 0.7, label: 0.7},
          { value: 0.8, label: 0.8},{ value: 0.9, label: 0.9},{ value: 1, label: 1}
        ],
        unit: '',
        splites: [{start: 0, end: 1, beforeStart: 0, color: '#2DC99F'}],
        listColors: ['#51A6FF', '#98C959', '#F2AF16', '#AC96FB'],
        isTooltip: true,
        isLenged: true,
        // 面板刻度类型
        tickType: false,
        activeColor: '#51A6FF',
        myColors: [
          "#AC96FB ",
          "#5EB1FF ",
          "#8B9EF7",
          "#E78A5F",
          "#F2AF16",
          "#FFE070",
          "#98C959",
          "#CBDB37",
          "#597EF7",
          "#39D4D4",
          "#CBDB37"
        ]
      }
    },
    computed: {
      styleConfig () {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
      },
      config () {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config
      },
      // 获取自定义最小刻度
      MinValue: {
        get () {
          return this.config.initData.min
        },
        set () {

        }
      },
      // 获取自定义最大刻度
      MaxValue: {
        get () {
          return this.config.initData.max
        },
        set (value) {

        }
      },
      // 显示百分比模式时 设置目标值
      targetValue: {
        get () {
          return this.config.initData.targetValue
        },
        set () {

        }
      }
    },
    watch: {
      styleConfig () {
        this.initData()
      }
    },
    components: {
      colorPicker
    },
    methods: {
      // 初始化按钮选项
      initData () {
        this.gaugeModel = this.config.initData.gaugeModel
        this.colorType = this.config.initData.colorType
        this.singelColor = this.config.initData.singelColor

        this.unit = this.config.initData.unit
        this.isTooltip = this.config.initData.isTooltip
        this.isLenged = this.config.initData.isLenged
        this.splites = this.config.initData.splites
        this.activeColor = this.config.initData.singelColor

        this.tickType = this.config.initData.tickType
      },
      // 设置最小刻度
      setMinValue (value) {
        // 最小刻度 < 最大刻度
        if (parseFloat(value) >= parseFloat(this.MaxValue) || value === '') {
          // 输入非法时 用旧值替换
          this.$refs['min_input']._data.currentValue = this.MinValue
          return
        }
        // 最小刻度大于目标指时 用最大刻度替换目标刻度
        if (parseFloat(value) >= parseFloat(this.targetValue)) {
          this.$store.commit('setTargetValue', {
            index: this.index,
            value: this.MaxValue,
            hasEdit: true
          })
        }
        this.$store.commit('setMinValue', {
          index: this.index,
          value,
          hasEdit: true
        })
        this.setTick()
      },
      // 设置最大刻度
      setMaxValue (value) {
        // 最大刻度 > 最小刻度
        if (parseFloat(value) <= parseFloat(this.MinValue) || value === '') {
          // 输入非法时 用旧值替换
          this.$refs['max_input']._data.currentValue = this.MaxValue
          return
        }
        // 最大刻度小于目标指时 用最大刻度替换目标刻度
        if (value < parseFloat(this.targetValue)) {
          this.$store.commit('setTargetValue', {
            index: this.index,
            value,
            hasEdit: true
          })
        }
        this.$store.commit('setMaxValue', {
          index: this.index,
          value,
          hasEdit: true
        })
        this.setTick()
      },
      // 设置目标刻度
      setTarget (value) {
        // 目标值 取值范围 大于最小刻度、小于等于最大刻度
        if (parseFloat(value) <= parseFloat(this.MinValue) || parseFloat(value) > parseFloat(this.MaxValue) || value === '') {
          // 输入非法时 用旧值替换
          this.$refs['target_value']._data.currentValue = this.targetValue
          return
        }
        this.$store.commit('setTargetValue', {
          index: this.index,
          value,
          hasEdit: true
        })
        this.setTick()
      },
      // 同步刻度设置到仪表盘
      setTick () {
        // 验证最小刻度不能超过最大刻度，最大刻度不能超过原始刻度
        this.$store.commit('setTickGauge', {
          index: this.index,
          statue: true,
          record: {
            name: 'setTick'
          }
        })
        if (!parseInt(this.gaugeModel)) {
          this.changeModel(this.gaugeModel)
        }
      },
      // 设置单位
      setUnit () {
        this.config.initData.unit = this.unit

        this.$store.commit('setUnitGauge', {
          index: this.index,
          type: this.unit,
          statue: true,
          record: {
            name: 'setUnit',
            optionVal: this.unit
          }
        })
      },
      showLenged (value) {
        this.config.initData.isLenged = this.isLenged
        this.$store.commit('showLengedGauge', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'showLenged',
            optionVal: value
          }
        })
      },
      showTooltip (value) {
        this.config.initData.isTooltip =  this.isTooltip
        this.$store.commit('showTooltipGauge', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'showTooltip',
            optionVal: value
          }
        })
      },
      // 切换单色/多色模式
      changeModel (value) {
        this.config.initData.gaugeModel = value
        if (parseInt(value)) {
          this.changeType(this.colorType)
        } else {
          let color = this.getSingleArea(this.MinValue, this.MaxValue, this.config.series[0].data[0].value, this.singelColor)
          this.setColor(color)
        }
      },
      // 改变单色模式下的颜色
      changeColorBySig (value) {
        let color = this.getSingleArea(this.MinValue, this.MaxValue, this.config.series[0].data[0].value, this.singelColor)
        this.activeColor = value
        this.config.initData.singelColor = value
        this.setColor(color)
      },
      changeType (value) {
        this.config.initData.colorType = this.colorType
        this.config.initData.splites = this.splites
        let color = []

        if (!parseInt(value)) {
          color = this.config.series[0].axisLine.lineStyle.defaultColor
        } else {
          color = this.splites.map( (item, index) => {
            return [item.end, item.color]
          })
        }
        this.setColor(color)
      },
      // 对splites的操作
      setSplitStart (index) {
        let value = this.splites[index].start
        this.splites[index - 1].end = value
        // 下一选项的起始值 需大于上一选项的起始值
        if (index + 1 <= this.splites.length) {
          this.splites[index + 1].beforeStart = value
        }
        this.changeType(this.colorType)
      },
      // 对splites的操作
      setSplitEnd (index) {
        let MaxIndex = this.splites.length - 1
        let value = this.splites[index].end
        if (this.splites[index].end !== 1) {
          if (index === MaxIndex) {
            let before = this.splites[index].start
            this.splites.push({start: value, end: 1, color: '#2DC99F', beforeStart: before})
          } else {
            this.splites[index + 1].start = value
            // 上一级起始值大于下一级结束值 结束值赋1 并删除后续数组元素
            if (this.splites[index + 1].end < value) {
              this.splites[index + 1].end = 1
              if (MaxIndex !== (index + 1)) {
                this.splites.splice(index + 2, MaxIndex - index - 1)
              }
            }
          }
        } else {
          if (MaxIndex > index) {
            this.splites.splice(index + 1, MaxIndex - index)
          }
        }
        this.changeType(this.colorType)
      },
      setSplitColor (index) {
        this.changeType(this.colorType)
      },
      // 改变仪表盘颜色
      setColor (color) {
        this.$store.commit('setColorGauge', {
          index: this.index,
          model: this.gaugeModel,
          type: this.colorType,
          color: color,
          statue: true,
          record: {
            name: 'setColor',
            optionVal: {
              color: color,
              model: this.gaugeModel,
              type: this.colorType
            }
          }
        })
      },
      getSingleArea (min, max, value, color) {
        // let colorArea = (value / (max- min)).toFixed(2)
        let colorArea = (value - min) / (max - min)
        // 特殊处理
        if (colorArea === 1) {
          return [[0.5, color]]
        } else {
          return [[colorArea, color], [1, '#eeeeee']]
        }
      },
      // 切换刻度类型
      switchTickType (value) {
        this.config.initData.tickType = value
        this.setTick()
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
<style  lang="less">
   .config-gaugestyle{
     font-size: 14px;
     height: calc(100vh - 267px);
     overflow: auto;
    .style-title {
     color: #666666;
     line-height: 20px;
     margin-top: 16px;
    }
    .column {
      border-top: 1px solid #E8EAEB;
      padding: 0px 0px 10px 0px;
      .config-line{
	    .config-line-item {
	     	 padding-top:10px;
	     	 padding-left: 24px;
	     	 clear:both;
         .row{
            width: 100%;
            box-sizing: border-box;
         }
	     	 .row-p {
	     	 	padding-left: 22px;
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
  .config-gaugestyle::-webkit-scrollbar {
    display: none;
  }
  .config-gaugestyle .el-radio{
    margin-left: 0px;
  }
  // .config-gaugestyle .el-radio span{

  // }
  .config-gaugestyle .el-radio .el-radio__label{
    padding-left: 6px;
    padding-right: 6px;
  }
  .config-gaugestyle .el-input__inner{
    padding: 0 5px
  }
  .config-gaugestyle .color_trigger {
    display: inline-block;
    height: 28px;
    width: 38px;
  }
  .config-gaugestyle .color_trigger .active {
    box-shadow: 1px 3px 5px #999999;
  }
  .config-gaugestyle .color_trigger span{
    display: block;
  }
  .config-gaugestyle .color_outer{
    width: 20px;
    height: 20px;
    padding: 3px;
    border: 1px solid;
    border-radius: 4px;
  }
  .config-gaugestyle .color_inner{
    width: 100%;
    height: 100%;
  }
  .config-gaugestyle input::-webkit-outer-spin-button,
  .config-gaugestyle input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  .config-gaugestyle .el-checkbox__label, .config-linestyle .el-radio__label{
    color: #333333;
  }
  .config-gaugestyle .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #333333;
  }
  .config-gaugestyle .el-radio__input.is-checked+.el-radio__label{
    color: #333333;
  }
</style>
