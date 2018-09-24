<template>
  <div class="scatter-style">
    <div class="column">
      <div class="style-title"><span class="point"></span>布局</div>
      <div class="config-line">
          <div class="config-line-item">
            <div class="row">
                <el-checkbox v-model="isTitle" @change="showAxisTitle">显示轴标题</el-checkbox>
            </div>
            <div class="row">
                <el-checkbox v-model="isZoom" @change="showZoom">支持缩放</el-checkbox>
            </div>
          </div>
      </div>
    </div>
    <div class="column">
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
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../../utils/eventBus'
  export default {
    name: 'scatter-style',
    components: {

    },
    props: {
      index: {
        default: 0
      }
    },
    data() {
      return {
        isTitle: false,
        isZoom: false,
        isTooltip: false,
        legendShow: false,
        legend: 'top'
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
      }
    },
    methods: {
      // 初始化按钮选项
      initData () {
        this.isTooltip = this.config.tooltip.show

        if (this.config.dataZoom.length > 0) {
          this.isZoom = true
        } else {
          this.isZoom = false
        }

        if (this.config.xAxis[0].hasOwnProperty('name')) {
          this.isTitle = true
        } else {
          this.isTitle = false
        }

        this.legendShow = this.config.legend.show
        this.legend = this.config.legend.positionName
      },
      showZoom (value) {
        this.$store.commit('showZoomScatter', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'showZoom',
            optionVal: value
          }
        })
      },
      showAxisTitle (value) {
        this.$store.commit('showTitleScatter', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'showAxisTitle',
            optionVal: value
          }
        })        
      },
      showLegend (value) {
        this.$store.commit('showLegendScatter', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'showLegend',
            optionVal: value
          }
        })
      },
      showTooltip (value) {
        this.$store.commit('showTootipScatter', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'showTooltip',
            optionVal: value
          }
        })
      },
      // 图例位置
      changeLengend(value) {
        this.$store.commit('setLegendScatter', {
          index: this.index,
          type: value,
          statue: true,
          record: {
            name: 'changeLengend',
            optionVal: value
          }
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
<style  lang="less">
   .scatter-style{
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
  .scatter-style::-webkit-scrollbar {
    display: none;
  }
  .scatter-style .el-radio{
    margin-left: 0px;
  }
  .scatter-style .el-radio .el-radio__label{
    padding-left: 6px;
    padding-right: 6px;
  }
</style>
