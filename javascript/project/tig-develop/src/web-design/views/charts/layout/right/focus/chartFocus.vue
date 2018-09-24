<template>
  <div>
    <div class="focus-item">
      <el-tabs type="card" v-model="activeName" @tab-click="dataLimitHeight">
        <el-tab-pane label="图表样式" name="first" :disabled="updateBtnActive">
          <div class="table-name">
            <!-- <span class="chart-type-title"><span class="el-icon-caret-top triangle"></span><span style="margin-left:8px">图表类型</span></span> -->
            <p class="container-name">
              <span>工作表名称</span>
              <el-checkbox v-model="containerNameToggle">显示</el-checkbox>
            </p>
            <el-input size="mini" :maxlength="30" v-model="containerName" class="el-input-s"></el-input>
          </div>
          <el-collapse v-model="activeCollapse" accordion>
            <el-collapse-item name="1" class="my-collapse">
              <template slot="title">
                <span class="chart-type-title"><span class="el-icon-caret-top triangle"></span><span style="margin-left:8px">图表类型</span></span>
              </template>
              <chart-type :index="selectedOption.i"></chart-type>
            </el-collapse-item>
            <el-collapse-item name="2" class="my-collapse">
              <template slot="title">
                <span class="chart-type-title"><span class="el-icon-caret-top triangle"></span><span style="margin-left:8px">图表样式</span></span>
              </template>
              <!--  各个组件 -->
              <component :is="currentStyle" :config="selectedOption" :index="selectedOption.i"> </component>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="数据关系" name="second"><data-picker ref="dataPicker"></data-picker></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import dataPicker from './chartFocus/dataPicker'
  import chartType from './chartFocus/chartType'
  // 各个图表的style组件
  import labelStyle from '../../../components/label/style'
  import cardStyle from '../../../components/card/style'
  import pieStyle from '../../../components/pie/pieStyle'
  import tableStyle from '../../../components/table/tablestyle'
  import simpleTableStyle from '../../../components/simpleTable/tablestyle'
  import crossTableStyle from '../../../components/crossTable/tablestyle'
  import mapStyle from '../../../components/map/style'
  import lineStyle from '../../../components/line/style'
  import barStyle from '../../../components/bar/barStyle'
  import relationStyle from '../../../components/relation/style'
  import wordCloudStyle from '../../../components/wordCloud/style'
  import scatterStyle from '../../../components/scatter/style'
  import radarStyle from '../../../components/radar/style'
  import gaugeStyle from '../../../components/gauge/style'
  import bubbleStyle from '../../../components/bubble/style'
  import funnelStyle from '../../../components/funnel/style'
  import eventBus from '../../../utils/eventBus.js'
  export default {
    name: 'ChartFocus',
    data () {
      return {
        activeName: 'second',
        activeCollapse: '1'
      }
    },
    components: {
      dataPicker,
      chartType,
      labelStyle,
      pieStyle,
      tableStyle,
      simpleTableStyle,
      crossTableStyle,
      mapStyle,
      lineStyle,
      barStyle,
      relationStyle,
      wordCloudStyle,
      radarStyle,
      scatterStyle,
      gaugeStyle,
      bubbleStyle,
      funnelStyle,
      cardStyle
    },
    computed: {
      // 选中的容器
      selectedOption () {
        return this.$store.state.charts.chartsOption.filter(item => !item.drop && item.selected)[0]
      },
      // ‘更新’按钮的高亮状态
      updateBtnActive () {
        return this.selectedOption.updateBtnActive
      },
      // 当前的图表样式组件
      currentStyle () {
        let currentName = ''
        const containerId = this.selectedOption.id
        const chartId = this.selectedOption.feature.chartId
        if (containerId === 0) {
          switch (chartId) {
            case 0:
              currentName = 'tableStyle'; break
            case 1:
              currentName = 'pieStyle'; break
            case 2:
              currentName = 'labelStyle'; break
            case 3:
              currentName = 'mapStyle'; break
            case 4:
              currentName = 'lineStyle'; break
            case 5:
              currentName = 'barStyle'; break
            case 6:
              currentName = 'relationStyle'; break
            case 7:
              currentName = 'wordCloudStyle'; break
            case 8:
              currentName = 'radarStyle'; break
            case 9:
              currentName = 'scatterStyle'; break
            case 10:
              currentName = 'gaugeStyle'; break
            case 11:
              currentName = 'bubbleStyle'; break
            case 12:
              currentName = 'funnelStyle'; break
            case 13:
              currentName = 'simpleTableStyle'; break
            case 14:
              currentName = 'cardStyle'; break
            case 15:
              currentName = 'crossTableStyle'; break
            default:
              currentName = ''
          }
        }
        return currentName
      },
      // 容器的名字
      containerName: {
        get () {
          return this.selectedOption.name
        },
        set (value) {
          this.$store.commit('changeContainerName', {
            index: this.selectedOption.i,
            value
          })
        }
      },
      // 容器的名字toggle
      containerNameToggle: {
        get () {
          return this.selectedOption.nameToggle
        },
        set (value) {
          const index = this.selectedOption.i
          this.$store.commit('containerNameToggle', {
            index,
            value
          })
          this.$store.commit('containerHeightChange', {
            index,
            value
          })
          eventBus.$emit('searchReset')
          eventBus.$emit(`resizeOrMove_${index}`)
        }
      }
    },
    watch: {
      // 监听选中容器的变化，要是变化了，就跳转到数据关系
      selectedOption (val, oldVal) {
        const containerIndex = val.i
        const oldContainerIndex = oldVal.i
        if (containerIndex !== oldContainerIndex) this.activeName = 'second'
      }
    },
    methods: {
      // 调用ref：dataPicker的方法，使‘高级’面板吸附在底下
      // 点击‘图表样式’，隐藏指标属性popover
      dataLimitHeight (tab) {
        this.$nextTick(() => {
          if (tab.label === '数据关系') this.$refs.dataPicker.dataLimitHeight()
          if (tab.label === '图表样式') this.$refs.dataPicker.cancelPopover()
        })
      }
    }
  }
</script>

<style lang="less">
  @px5: 5px;
  @px16: 16px;
  .my-collapse.is-active{
    .triangle{
      transform: rotate(180deg);
    }
  }
  .el-input-s >
  input {
      width: 190px;
      height: 32px !important;
      margin-left: 3px;
      margin-right: 14px;
      color: #999;
      font-size: 14px;
      padding: 0 8px;
    }
  .focus-item{
    .container-name{
      display: flex;
      justify-content: space-between;
      padding: 12px 14px  12px 16px;
      .el-checkbox__input.is-checked+.el-checkbox__label{
        color: #999;
      }
      .el-checkbox__label{
        padding-left: 6px;
      }
      >span {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }
      & + .el-input{
      /*  margin: 0 @px16 20px;*/
        margin: 0  14px 20px 16px;
        width: calc(~"100%" - @px16 * 2);
      }
    }
    .el-tabs__nav{
      width: 100%;
      border-left: none!important;
      border-right: none!important;
   /*   .el-tabs__item is-top{
        color: #666;
      }*/
      > .el-tabs__item{
        width: 50%;
        color: #666;
        background: #F2F4F5;
        &.is-active {
          background-color: #fff;
          color:#51A6FF;
        }
      }
    }
    .el-tabs{
      .el-tabs__header{
        margin-bottom: 0;
        border-bottom: none;
      }
    }
  }
  .chart-type-title {
    color: #333;
    font-size: 14px;
    padding-left: 6px;
    font-weight: bold;
    .triangle{
      background: #FFFFFF;
      color: #D3D6D8;
      font-size: 14px;
    }
  }
  .el-collapse-item__header,.el-collapse-item__content{
    font-size: 14px;
  }
  .el-input__inner{
    font-size: 14px;
    padding: 0 6px;
  }
</style>
