<template>
  <div class="config-style-radar my-slide-bar">
    <div class="radar-config-item">
      <div class="radar-title">设计</div>
      <div class="config-content">
        <div class="config-content-item">
          <div class="row">
          <label><el-checkbox v-model="legendShow">显示图例</el-checkbox></label>
          </div>
          <div class="row row-p" style="margin-left:20px">
            <el-radio v-model="legendPosition" label="top" @change="changeLengend('top')" style="width:10px;margin-top:10px" :disabled="!legendShow">上</el-radio>
            <el-radio v-model="legendPosition" label="bottom" @change="changeLengend('bottom')" style="width:10px;margin-top:10px" size="mini" :disabled="!legendShow">下</el-radio>
            <el-radio v-model="legendPosition" label="left" @change="changeLengend('left')"  style="width:10px;margin-top:10px"size="mini" :disabled="!legendShow" >左</el-radio>
            <el-radio v-model="legendPosition" label="right" @change="changeLengend('right')" style="width:10px;margin-top:10px" 	size="mini" :disabled="!legendShow">右</el-radio>
          </div>
        </div>
        <div class="config-content-item">
          <div class="row">
            <el-checkbox v-model="tooltip">显示ToolTip</el-checkbox>
          </div>
        </div>
        <div class="config-content-item">
          <div class="row">
            分支最大值
            <el-input v-model.trim="maxValue" placeholder="请输入分支最大值" class="max-value" @change="setAxisRadar"/>
            <span class="max-value-error-tip" v-if="errorShow">{{errorTip}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../../utils/eventBus'
  export default {
    name: 'radar-style',
    props: {
      index: {
        default: 0
      }
    },
    data() {
      return {
        isDisabledLegend: false,
        errorShow: false,
        errorTip: '',
        timer: null
      }
    },
    methods: {
      // 图例位置
      changeLengend(value) {
        this.$store.commit('setLegendRadar', { index: this.index, value: value})
      },
      // 检查输入
      checkInput (value) {
        if (value === '') { return false }
        value = Math.abs(value)
        if (Number.isNaN(value)) {
          this.errorShow = true
          this.errorTip = '必须输入数字'
          return false
        }
        if (value < this.MinValue) {
          this.errorShow = true
          this.errorTip = `可输入的最小值为 ${this.MinValue}`
          return false
        } else {
          this.errorShow = false
          this.errorTip = ''
        }
        return true
      },
      setAxisRadar (value) {
        if (this.checkInput(value)) {
          this.$store.commit('setAxisRadar', { index: this.index, value: value})
        }
      }
    },
    computed: {
      data () {
        return this.$store.state.charts.chartsOption[this.index].data
      },
      feature () {
        return this.$store.state.charts.chartsOption[this.index].feature
      },
      styleConfig() {
        return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
      },
      MinValue () {
        let Arr = []
        this.feature.metricList.map( (metric) => {
          let key = metric.metricCode
          this.data.map( (item) => {
            Arr.push(item[key])
          })
        })
        return Math.max(...Arr)
      },
      tooltip: {
        get() {
          return this.styleConfig.config.tooltip.show
        },
        set(value) {
          this.$store.commit('editMidOptionRadar', {
            index: this.index,
            toEdit: 'show',
            name: 'tooltip',
            value,
          })
        }
      },
      // 图例位置
      legendPosition: {
        get() {
          return this.styleConfig.config.legend.positionName
        },
        set(value) {}
      },
      // 图例显示
      legendShow: {
        get() {
          return this.styleConfig.config.legend.show
        },
        set(value) {
          this.$store.commit('editMidOptionRadar', {
            index: this.index,
            name: 'legend',
            toEdit: 'show',
            value,
          })
        }
      },
      // 分支最大值限制
      maxValue: {
        get() {
          return this.styleConfig.config.maxValue
        },
        set(value) {}
      }
    }
  }
</script>
<style lang="less">
   .config-style-radar{
      height: 340px;
      overflow-y: auto;
      overflow-x: hidden;
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
       .el-input__inner {
          height: 32px;
          width: 115px;
        }
    .radar-title {
     padding-left:25px;
     color:#666666;
     font-size: 14px;
     margin-top:10px;
    }
    .radar-config-item {
      border-top: 1px solid #E8EAEB;
      padding: 0px 0px 10px 0px;
      .config-content{
        .config-content-item {
          padding-top:5px;
          padding-left: 25px;
          clear:both;
          .row-p {
            margin-left:25px;
            e-radio {
              width:10px;
            }
          }
          .max-value {
            > input {
              width: calc(100% - 15px);
            }
          }
          .max-value-error-tip {
              margin: 10px 0;
              color: #f00;
              font-size: 12px;
            }
	      }
      }
    }
  }
</style>
