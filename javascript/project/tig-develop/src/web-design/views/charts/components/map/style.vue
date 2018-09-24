<template>
       <div class="config-style-map my-slide-bar">
        <div class = "map-line">
          <div class="title-map"><span class="point"></span>设计</div>
          <div class="config-line">
	            <div class="config-line-item">
	              <label class="map-label" >显示模式</label>
	              <div class="content">
	              <el-radio v-model="mapType" label="0" disabled>色块地图</el-radio>
	              </div>
	            </div>
	            <div class="config-line-item">
	              <label class="map-label"></label>
	              <div class="content">
	               <el-radio v-model="mapType" label="1" disabled>气泡地图</el-radio>
	              </div>
	            </div>
              <div class="config-line-item">
	              <label class="map-label"></label>
	              <div class="content">
	               <el-radio v-model="mapType" label="2" disabled>迁徙地图</el-radio>
	              </div>
	            </div>
              <div class="config-line-item">
                  <div class="row">
                  <label><el-checkbox v-model="isLegendShow">显示图例</el-checkbox></label>
                  </div>
                  <div class="row row-p" style="margin-left:20px">
                      <el-radio v-model="legendStore" label="top" @change="legendChange" style="width:10px;margin-top:10px" :disabled="disabled">上</el-radio>
                      <el-radio v-model="legendStore" label="bottom" @change="legendChange" style="width:10px;margin-top:10px" size="mini" :disabled="disabled">下</el-radio>
                      <el-radio v-model="legendStore" label="left" @change="legendChange"  style="width:10px;margin-top:10px" size="mini" :disabled="disabled" >左</el-radio>
                      <el-radio v-model="legendStore" label="right" @change="legendChange" style="width:10px;margin-top:10px" 	size="mini" :disabled="disabled">右</el-radio>
                  </div>
	           </div>
	             <div class="config-line-item">
	               <el-checkbox v-model="isScale">支持缩放</el-checkbox>
	             </div>
               <div class="config-line-item">
	               <el-checkbox v-model="isGeographyShow">显示地理名称</el-checkbox>
	             </div>
               <div class="config-line-item" v-show="mapUnder">
	               <el-checkbox v-model="isUnder">支持下钻</el-checkbox>
	             </div>
               <div class="config-line-item" v-show="mapPoint">
	               <el-checkbox v-model="isShowPoint">显示标点</el-checkbox>
	             </div>
               <div class="config-line-item" v-show="mapRadius">
	               <el-checkbox  v-model="adaptiveDrilling"  @change="drillChange" >自定义气泡</el-checkbox>
	             </div>
               <div class="config-line-item"  v-show="mapRadius&&metricCodeSelect">
	              <label class="map-label"></label>
	              <div class="content">
	                 <el-select v-model="metricValue" class="metricSelect e-select" size="small" placeholder="请选择">
	                    <el-option
	                        v-for="item in this.metricList"
	                        :key="item.metricCode"
	                        :label="item.metricName"
	                        :value="item.metricCode">
	                    </el-option>
	                 </el-select>
	              </div>
	             </div>
               <div v-for="(splite, index) in colorItems" :key="index" v-show="colorPick&&isShowPick">
                  <div class="config-line-item">
                    <div class="row" @click="AddDelColorPick(index)">
                      <el-button class="adddelBtn" size="small" >{{splite.add}}</el-button>
                    </div>
                    <label class="map-label warn">提醒</label>
                    <div class="content">
                      <el-input type="textarea" class="textarea" v-model="splite.warn" :rows="6" placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                  <div class="config-line-item">
                      <div class="content colorPick">
                        <el-input v-model="splite.start" size="small" class="startInput" placeholder="0"></el-input>
                        ~
                        <el-input v-model="splite.end" size="small" class="endInput" placeholder="100"></el-input>
                      </div>
                      <el-col :span="3" class="color_pick">
                        <color-picker id="colorPicker" style="margin-top:6px" v-model="splite.color" :colors="myColors" @change="setColorItems(index)"></color-picker>
                      </el-col>
                  </div>
               </div>
               <div class="config-line-item" v-show="mapRadius&&metricCodeSelect">
	               <el-checkbox v-model="adaptiveRadius" @change="radiusChange">自适应半径</el-checkbox>
	             </div>
               <div class="config-line-item">
                  <el-checkbox v-model="isToolTipShow">显示ToolTip</el-checkbox>
               </div>
          </div>
	    </div>
       </div>
</template>
<script>
import colorPicker from './color.vue'
export default {
  name: 'MapStyle',
  data() {
    return {}
  },
  computed: {
    // 选中的容器
    selectedOption() {
      return this.$store.state.charts.chartsOption.filter(
        item => !item.drop && item.selected
      )[0].i
    },
    // 获取当前面板索引的样式面板的属性
    feature() {
      return this.$store.state.charts.chartsOption[this.selectedOption].feature
    },
    // 图标样式
    config() {
      return this.feature.styleConfig.config
    },
    //图例title
    metricList() {
      return this.feature.metricList
    },
    dimLength() {
      return this.feature.dimList.length
    },
    //维度类型
    dimType() {
      if (this.feature.dimList.length !== 0) {
        return this.feature.dimList[0].dimType
      }
    },
    //调色组件
    colorItems() {
      return this.config.colorItems
    },
    myColors() {
      return this.config.myColors
    },
    colorPick() {
      return this.config.myColors
    },
    metricCodeSelect() {
      return this.config.metricCodeSelect
    },
    //单色块不显示调色盘
    isShowPick() {
      const length = this.config.series.length
      const opacity = this.config.series[length - 2].itemStyle.normal.opacity
      if (this.dimLength === 1 && this.dimType === '1') return false
      if (this.dimLength === 2 && opacity === 0) return false
      if (this.config.metricCodeSelect === false) return false
      else {
        return true
      }
    },
    //地图类型
    mapType: {
      get() {
        if (this.dimLength === 1) {
          if (this.dimType === '1') {
            return '0'
          }
          if (this.dimType === '2') {
            return '1'
          }
        }
        if (this.dimLength === 2) {
          if (this.dimType === '1' || this.dimType === '2') {
            return '0'
          }
        } else {
          return '2'
        }
      },
      set(value) {}
    },
    metricValue: {
      get(value) {
        return this.config.metricValue
      },
      set(value) {
        this.$store.commit('mapMetricChange', {
          index: this.selectedOption,
          dimLength: this.dimLength,
          dimType: this.dimType,
          metricList: this.metricList,
          value: value
        })
      }
    },
    adaptiveDrilling: {
      get() {
        return this.config.metricCodeSelect
      },
      set(value) {}
    },
    //显示图例
    isLegendShow: {
      get() {
        return this.config.legend.show
      },
      set(value) {
        this.$store.commit('mapOption', {
          index: this.selectedOption,
          name: 'legend',
          property: 'show',
          value
        })
      }
    },
    // 图例位置初始化
    legendStore: {
      get() {
        return this.config.legendStore
      },
      set(value) {
        this.$store.commit('editlegendStore', {
          index: this.selectedOption,
          name: 'legendStore',
          value
        })
      }
    },
    //隐藏图例不允许切换图例位置
    disabled: {
      get() {
        if (this.config.legend.show === false) {
          return true
        } else {
          return false
        }
      },
      set(value) {}
    },
    //支持缩放
    isScale: {
      get() {
        return this.config.geo.roam
      },
      set(value) {
        this.$store.commit('mapOption', {
          index: this.selectedOption,
          name: 'geo',
          property: 'roam',
          value
        })
      }
    },
    // 是否显示地理名称
    isGeographyShow: {
      get() {
        if (this.dimLength === 1) {
          if (this.dimType === '1') {
            return this.config.geo.label.normal.show
          }
          if (this.dimType === '2') {
            return this.config.label.normal.show
          }
        }
        if (this.dimLength === 2) {
          return this.config.geo.label.normal.show
        }
      },
      set(value) {
        this.$store.commit('mapGeography', {
          index: this.selectedOption,
          dimLength: this.dimLength,
          dimType: this.dimType,
          value
        })
      }
    },
    //是否显示标点
    isShowPoint: {
      get() {
        const length = this.config.series.length
        const opacity = this.config.series[length - 2].itemStyle.normal.opacity
        if (opacity === 0.5) {
          return true
        }
        if (opacity === 0) {
          return false
        }
      },
      set(value) {
        this.$store.commit('mapShowPoint', {
          index: this.selectedOption,
          name: 'normal',
          property: 'opacity',
          type: value
        })
      }
    },
    //支持下钻
    isUnder: {
      get() {
        if (this.config.geo.z === 2) {
          return true
        } else {
          return false
        }
      },
      set(value) {
        this.$store.commit('mapUnder', {
          index: this.selectedOption,
          name: 'geo',
          property: 'z',
          value
        })
      }
    },
    //自适应半径
    adaptiveRadius: {
      get() {
        return this.config.adaptiveRadius
      },
      set(value) {
        this.$store.commit('editlegendStore', {
          index: this.selectedOption,
          name: 'adaptiveRadius',
          value
        })
      }
    },
    //混合地图、气泡迁徙地图隐藏下钻
    mapUnder: {
      get() {
        const dimList = this.feature.dimList
        if (
          this.dimType === '1' &&
          dimList.length === 1 &&
          this.config.geo.map === 'china'
        ) {
          return true
        } else {
          return false
        }
      },
      set(value) {}
    },
    //单色块气泡迁徙地图隐藏显示标点
    mapPoint: {
      get() {
        const dimList = this.feature.dimList
        if (dimList.length === 1) {
          return false
        }
        if (dimList.length === 2) {
          return true
        }
      },
      set(value) {}
    },
    //单色块，混合地图隐藏标点、迁徙地图隐藏自适应半径,自定义标点
    mapRadius: {
      get() {
        if (this.dimLength === 1) {
          if (this.dimType === '1') {
            return false
          }
          if (this.dimType === '2') {
            return true
          }
        }
        if (this.dimLength === 2) {
          const length = this.config.series.length
          const opacity = this.config.series[length - 2].itemStyle.normal
            .opacity
          if (opacity === 0.5) {
            return true
          }
          if (opacity === 0) {
            return false
          }
        }
      },
      set(value) {}
    },
    //显示点toolTip
    isToolTipShow: {
      get() {
        return this.config.tooltip.show
      },
      set(value) {
        this.$store.commit('mapOption', {
          index: this.selectedOption,
          name: 'tooltip',
          property: 'show',
          value
        })
      }
    }
  },
  components: {
    colorPicker
  },
  methods: {
    // 切换图例位置
    legendChange(val) {
      this.$store.commit('mapLegend', {
        index: this.selectedOption,
        type: val
      })
    },
    radiusChange(val) {
      this.$store.commit('mapRadius', {
        index: this.selectedOption,
        type: val
      })
    },
    drillChange(val) {
      this.$store.commit('mapdrillChange', {
        index: this.selectedOption,
        type: val
      })
    },
    setColorItems() {
      this.$store.commit('colorPick', {
        index: this.selectedOption
      })
    },
    //增加删除调色盘
    AddDelColorPick(i) {
      const colorIndex = i
      this.$store.commit('AddDelColor', {
        index: this.selectedOption,
        colorIndex: colorIndex
      })
    }
  },
  mounted() {
    this.options = this.feature.metricList
  }
}
</script>
<style  lang="less">
.config-style-map {
  height: calc(100vh - 287px);
  overflow-y: auto;
  overflow-x: hidden;
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #333;
  }
  .el-checkbox__label {
    color: #333333;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #51a6ff;
    border-color: #51a6ff;
  }
  .el-button--mini,
  .el-button--small {
    width: 16px;
    height: 16px;
    padding-bottom: 1px;
    padding-top: 1px;
    padding-left: 3px;
    padding-right: 3px;
    margin-right: 3px;
  }
  .el-input--small .el-input__inner {
    padding: 0;
    height: 32px;
    line-height: 32px;
  }
  .title-map {
    color: #666666;
    line-height: 20px;
    margin-top: 16px;
  }
  .map-line {
    border-top: 1px solid #e8eaeb;
    padding: 0px 0px 10px 0px;
    .point {
      display: inline-block;
      height: 6px;
      width: 6px;
      box-sizing: border-box;
      border-radius: 100%;
      background: #d8d8d8;
      vertical-align: top;
      margin: 6px 8px 6px 10px;
    }
    .config-line {
      .config-line-item {
        padding-top: 5px;
        padding-left: 25px;
        clear: both;
        .row-p {
          margin-left: 25px;
          e-radio {
            width: 10px;
          }
        }
        .adddelBtn {
          float: left;
          border: 1px solid #c1c3c3;
          margin-top: 10px;
        }
        .map-label {
          float: left;
          font-size: 14px;
          min-width: 60px;
          min-height: 1px;
        }
        .warn {
          margin-top: 6px;
          margin-left: 6px;
        }
        .metricSelect {
          width: 156px;
          margin-left: 15px;
        }
        .textarea {
          width: 156px;
          margin-left: 15px;
          margin-top: 3px;
        }
        .colorPick {
          margin-top: 10px;
          margin-left: 15px;
        }
        .startInput {
          width: 48px;
          margin-right: 5px;
        }
        .endInput {
          width: 48px;
          margin-left: 5px;
          margin-right: 8px;
        }
        .color_pick {
          margin-top: 5px;
          margin-left: -2px;
        }
        .content {
          float: left;
          padding-left: 10px;
          .e-select {
            width: 150px;
            min-height: 32px;
            height: 32px;
          }
        }
      }
    }
  }
}
</style>
