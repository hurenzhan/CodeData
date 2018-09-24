<template>
  <div :containerIndex="option.i">
    <template v-if="styleConfig.showType==='1'">
      <div class="label-layout-center" v-if='showData[0]' :class="{noDim:showData[0].dimName === undefined}">
        <div v-for="(dim, index) in showData" :key="index">
            <p v-if="getDimName" class="dim-name" :class="{vertP:dim.dimName}"  @click="linkHandle(dim.dimName)">{{dim.dimName === undefined ? dim.dasp_date : dim.dimName | clearDimName}}</p>
            <el-carousel :height="carouselHeight" :autoplay="false" indicator-position="none" :arrow="centerArrow">
              <el-carousel-item v-for="(carouselItem,carouselIndex) in Math.ceil(getMetricsCodeArr.length/num)" :key="carouselIndex">
                <div class="label-metric-wrapper">
                  <metric-item
                    class="metric-item"
                    :class="{pointer:index*getMetricsCodeArr.length+metricIndex <= tabNum, notAllowed:index*getMetricsCodeArr.length+metricIndex > tabNum}"
                    v-for="(metric, metricIndex) in getMetricsCodeArr"
                    @click.native="tabControl(index*getMetricsCodeArr.length+metricIndex)"
                    v-if="metricIndex>=carouselIndex*num && metricIndex<=carouselIndex*num+num-1"
                    :key="metricIndex"
                    :index="option.i"
                    :styleConfig="option.feature.styleConfig"
                    :name1="dim[`${metric.code}Name`]"
                    :num1="dim[metric.code]"
                    :num2="dim[`${metric.code}_1`]"
                    :num3="dim[`${metric.code}_2`]"
                    :num4="dim[`${metric.code}_3`]"
                    :num5="dim[`${metric.code}_4`]"
                    :num6="dim[`${metric.code}_5`]"
                    :num7="dim[`${metric.code}_6`]"
                    :num8="dim[`${metric.code}_7`]"
                    :num9="dim[`${metric.code}_8`]"
                    :unit="metric.unit"
                  ></metric-item>
                </div>
              </el-carousel-item>
            </el-carousel>
        </div>
      </div>
    </template>
    <template v-if="styleConfig.showType==='2'">
      <resize v-if="route!=='/visual'" @notify="handleResize"></resize>
      <el-carousel v-if='showData[0]' :height="showData[0].dimName === undefined?(parseInt(carouselHeight)-parseInt('24px'))+'px':carouselHeight" :autoplay="false" indicator-position="none" :arrow="verticalArrow">
        <el-carousel-item v-for="(carouselItem,carouselIndex) in Math.ceil(showData.length/num)" :key="carouselIndex">
          <div v-if='showData[0]' class="vertical" :class="{noDim:showData[0].dimName === undefined}">
            <div v-for="(dim, index) in showData" :key="index" v-if="index>=carouselIndex*num && index<=carouselIndex*num+num-1">
              <p v-if="getDimName" class="dim-name" @click="linkHandle(dim.dimName)">{{dim.dimName === undefined ? dim.dasp_date : dim.dimName | clearDimName}}</p>
              <div class="label-metric-wrapper">
                <metric-item
                  class="metric-item"
                  :class="{pointer:index*getMetricsCodeArr.length+metricIndex <= tabNum, notAllowed:index*getMetricsCodeArr.length+metricIndex > tabNum}"
                  v-for="(metric, metricIndex) in getMetricsCodeArr"
                  @click.native="tabControl(index*getMetricsCodeArr.length+metricIndex)"
                  :key="metricIndex"
                  :index="option.i"
                  :styleConfig="option.feature.styleConfig"
                  :name1="dim[`${metric.code}Name`]"
                  :num1="dim[metric.code]"
                  :num2="dim[`${metric.code}_1`]"
                  :num3="dim[`${metric.code}_2`]"
                  :num4="dim[`${metric.code}_3`]"
                  :num5="dim[`${metric.code}_4`]"
                  :num6="dim[`${metric.code}_5`]"
                  :num7="dim[`${metric.code}_6`]"
                  :num8="dim[`${metric.code}_7`]"
                  :num9="dim[`${metric.code}_8`]"
                  :unit="metric.unit"
                ></metric-item>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </template>
    <template  v-if="styleConfig.showType==='3'">
       <div v-for="(dim, index) in showData" :key="index" class="wrap">
         <div class="label-metric-wrapper">
            <metric-item
                class="metric-item"
                v-for="(metric, metricIndex) in getMetricsCodeArr"
                @click.native="tabControl(index*getMetricsCodeArr.length+metricIndex)"
                :key="metricIndex"
                :index="option.i"
                :styleConfig="option.feature.styleConfig"
                :name1="dim[`${metric.code}Name`]"
                :num1="dim[metric.code]"
                :num2="dim[`${metric.code}_1`]"
                :num3="dim[`${metric.code}_2`]"
                :num4="dim[`${metric.code}_3`]"
                :num5="dim[`${metric.code}_4`]"
                :num6="dim[`${metric.code}_5`]"
                :num7="dim[`${metric.code}_6`]"
                :num8="dim[`${metric.code}_7`]"
                :num9="dim[`${metric.code}_8`]"
                :unit="metric.unit">
            </metric-item>
         </div>
      </div>
    </template>
  </div>
</template>

<script>
  import eventBus from '../../utils/eventBus'
  import { containerInit } from '../../static/configData'
  import { sendLinkInfo } from '../../utils/utils'
  import searchMixin from '../../../../api/search'
  import carouselMixin from './carouselMixin'
  import mixin from './mixin'
  import metricItem from './metricItem'
  import aliasMap from '../mixins/aliasChange/aliasMap'
  import resize from '../search/otherView/resize'

  export default {
    name: 'LabelLayout',
    props: ['option'],
    mixins: [searchMixin, carouselMixin, mixin, aliasMap],
    components: {metricItem, resize},
    data () {
      return {
        showData: [] ,// 展示的数据
        getMetricsCodeArr:[],
        getDimName:null
      }
    },
    computed: {
      chartsOption () {
        return this.$store.state.charts.chartsOption
      },
      containerOption () {
        return this.chartsOption.filter(item => item.selected)[0]
      },
      // 获取选择的指标单位
      getMetricsMulUnits () {
        return this.option.feature.metricList.mulUnits.map(item => item.unitNm)
      },
      // 图标样式
      styleConfig () {
        return this.option.feature.styleConfig
      },
      dimList () {
        return this.option.feature.dimList || []
      },
      centerArrow (){
        if(this.getMetricsCodeArr.length<=this.num){
          return 'never'
        }else{
          return 'hover'
        }
      },
      verticalArrow (){
        if(this.showData.length<=this.num){
          return 'never'
        }else{
          return 'hover'
        }
      },
      // 查询面板是否显示标题栏
      isShowTab () {
        return this.option.nameToggle
      },
      checkList () {
        return this.styleConfig.checkList
      },
      tabNum() {
        const selectedTab = this.option.selectedTab
        const enableTab = this.option.enableTab
        if(selectedTab !== null && selectedTab !==''&& enableTab === true){
          const tabsFilter = this.chartsOption[selectedTab].feature.tabs.filter(item => item.drop === false)
          return tabsFilter.length - 1
        }
      },
      route() {
        return this.$route.path
      }
    },
    watch: {
      // 标题栏显示切换，重新计算标签的高度以满足自适应
      isShowTab () {
        this.handleResize()
      },
      styleConfig: {
        handler () {
          this.$nextTick(() => {
            this.handleResize()
          })
        },
        deep: true
      }
     },
    mounted () {
      this.getMetricsCode()
      this._getDimName()
      this.showData = this.changeShowData()
      this.$nextTick(() => {
        this.handleResize()
      })
      // 联动
      eventBus.$on(`updateLink_${this.option.i}`, (emitObj) => {
        this.updateLinkHandle(emitObj.linkInfo)
      })
      // 查询面板
      eventBus.$on(`updateQuery_${this.option.i}`, (obj) => {
        (async () => {
          const selectedDimValue = []
          const dimListData = []
          this.styleConfig.selectedDimValue.map((item)=>{
            selectedDimValue.push(item.slice(0,5))
          })
          dimListData[0] = {
              dimCode:this.dimList.length===0 ? null:this.dimList[0].dimCode,
              dimName:this.dimList.length===0 ? null:this.dimList[0].dimName,
              dimSelectedList:selectedDimValue,
              selectedOper:"in"
          }
          if(selectedDimValue.length !==0){
            obj.dimListData = dimListData
          }
          const res = await this.updateDataPre(
            {
              index: this.option.i,
              queryInfo: obj
            }
          )
          if(res !==undefined && res.length !==0) {
            this.showData = res.map(item => this.clearData(item))
          }
          else{
            this.showData = this.noData().map(item => this.clearData(item))
          }
          this.computeCarouselHeight()
          this.handleResize()
        })()
      })
      // 监听更新数据
      eventBus.$on(`updateData_${this.option.i}`, (obj) => {
        // 判断是不是初始化进来的更新事件
        if (!obj.init&&!obj.from) {
          // 清空维值筛选
          this.dimList.length !== 0 && this.dimList[0].dimCode.indexOf('_WD_') >=0 && this.getDimListValue()
          // 更新数据后把筛选维度的及时清空
          this.$store.commit('filterDimValue', {
            index: this.option.i,
            value: false
          })
          const selectedDimValue = []
          this.$store.commit('selectDimValue', {index: this.option.i, selectedDimValue})
        }
        if(this.dimList.length !== 0 && this.styleConfig.showType === '3') {
         this.$store.commit('showTypeToggle', {
            index: this.option.i,
            key: 'showType',
            value :'2'
          })
        }
        this.getMetricsCode()
        this._getDimName()
        this.showData = this.changeShowData()
        this.computeCarouselHeight()
         this.$nextTick(() => {
          this.handleResize()
        })
      })
      // 监听拖拽
      eventBus.$on(`resizeOrMove_${this.option.i}`, () => {
        this.computeNum()
        this.computeCarouselHeight()
      })
      // 监听筛选数据
      eventBus.$on(`filterDimValue_${this.option.i}`, () => {
        this.showData = this.changeShowData()
      })
      // // 监听是否勾选筛选维值
      eventBus.$on(`changeFilterData_${this.option.i}`, (flag) => {
        if (!flag) {
          this.showData = this.changeShowData()
        }
      })
      // 通知查询面板准备完毕
      this.$store.commit('chartsReady', {
        index: this.option.i
      })
    },
    beforeDestroy () {
      eventBus.$off(`resizeOrMove_${this.option.i}`)
      eventBus.$off(`updateLink_${this.option.i}`)
      eventBus.$off(`updateQuery_${this.option.i}`)
      eventBus.$off(`updateData_${this.option.i}`)
      eventBus.$off(`filterDimValue_${this.option.i}`)
      eventBus.$off(`changeFilterData_${this.option.i}`)
    },
    methods: {
      // 合并数据
      getMetricsInfo() {
        return Array.prototype.concat(this.getMetricsCodeArr, this.getMetricsMulUnits)
      },
      // 调用联动函数
      linkHandle (dimName) {
        sendLinkInfo(this.$store.state.charts.chartsOption, this.option.i, {
          dimCode: this.getDimName,
          dimName: dimName.indexOf('###') !== -1 ? dimName.split('###')[1] : dimName,
          dimValue: dimName.indexOf('###') !== -1 ? dimName.split('###')[0] : dimName,
          nearUpdateTime: this.option.nearUpdateTime
        })
      },
      // 获取选择的指标
      getMetricsCode () {
        this.getMetricsCodeArr = this.option.feature.metricList.map((item, index) => {
          const unitSelected = this.option.feature.metricListFlat.filter(v => v.metricCode === item.metricCode)[0].unitSelected
          return {
            code: item.metricCode,
            unit: item.mulUnits.filter(v => v.unitCode === unitSelected)[0].unitNm
          }
        })
      },
      // 获取选择的维度
      _getDimName () {
        this.getDimName = this.option.feature.dimList.length === 0 ? null : this.option.feature.dimList[0].dimCode
      },
      // 监听联动
      async updateLinkHandle (linkInfo) {
        const selectedDimValue = []
        this.styleConfig.selectedDimValue.map((item)=>{
          selectedDimValue.push(item.slice(0,5))
        })
        let condiComparedValue = selectedDimValue.join(',')
        let condiCode = (this.option.feature.dimList && this.option.feature.dimList[0] && this.option.feature.dimList[0].dimCode) || ''
        let conditionListArr = this.styleConfig.filterDimValueFlag ? [{condiCode, condiComparedValue, condiRateType: 0, condiType: 0, operator: 6 }] : []
        const res = await this.updateDataPre(
          {
            index: this.option.i,
            linkInfo: linkInfo,
            conditionListArr
          }
        )
        if(res !==undefined && res.length !==0){
          this.showData = res.map(item => this.clearData(item))
        }else{
          const metricList = this.option.feature.metricList
          const data = []
          let obj = {}
          metricList.map((i)=>{
                obj = {
                    [linkInfo.dimCode]:linkInfo.dimValue,
                    [i.metricCode]:' - ',
                    [`${i.metricCode}Name`]:i.metricName,
                    dimName:linkInfo.dimValue
                }
          })
          data.push(obj)
          this.showData = data.map(item => this.clearData(item))
        }
      },
      //没有数据照常展示
      noData(){
        const metricList = this.option.feature.metricList
        const data = []
        let obj = {}
        metricList.map((i)=>{
              obj = {
                  dimCode:null,
                  [i.metricCode]:' - ',
                  [`${i.metricCode}Name`]:i.metricName,
                  dimName:null
              }
        })
        data.push(obj)
        return data
      },
      // 处理数据函数
      clearData (item) {
        item.dimName = item[this.getDimName]
        this.getMetricsCodeArr.forEach(each => {
          // 当有别名的时候用别名，没有的时候，用原名
          const hasAlias = this.getAliasByMetricCode(each.code)
          if (hasAlias === false) {
            item[`${each.code}Name`] = this.option.feature.metricList.filter(item => item.metricCode === each.code)[0].metricName
          } else {
            item[`${each.code}Name`] = hasAlias
          }
        })
        return item
      },
      changeShowData() {
        if (this.styleConfig.filterDimValueFlag) {
          if(this.styleConfig.filterData){
            return this.styleConfig.filterData.map(item => this.clearData(item))
          }
        } else {
          if(this.option.data.length!==0){
            return this.option.data.map(item => this.clearData(item))
          }
          else{
            return this.noData().map(item => this.clearData(item))
          }
        }
      },
      //tab切换
      tabControl(index){
        if(this.containerOption!== undefined &&
           this.containerOption.enableTab === true &&
           this.containerOption.selectedTab !== ''){
          const obj = {
           value:index,
           index: this.option.i
        }
        eventBus.$emit(`tabControl_${this.containerOption.selectedTab}`,obj);
        }
      },
      // 重新计算容器的高度
      handleResize () {
         if(this.$route.path !== "/visual"){
          let tab = this.isShowTab ? 40 : 0                               // 容器标题栏的高度
          let margingB = 32                                                 // 下margin 16px
          let margingT = 24                                                 // 下margin 16px
          let RH = containerInit.rowHeight
          let margin = containerInit.margin[0]                            // 容器之间的margin
          const query = `div[containerIndex="${this.option.i}"] .vertical`
          if(document.querySelector(query) !== null){
            const height = getComputedStyle(document.querySelector(query)).height
            let h = (parseFloat(height)  + margingB + margin + tab) / (RH + margin)
            //没有维值
            if(this.showData[0].dimName === undefined){
                h = (parseFloat(height)  + margingT + margin + tab) / (RH + margin)
            }
            this.$store.commit('setContainerHeight', {
              index: this.option.i,
              h: h
            })
          }
         }
      },
    },
    filters: {
      // 维度名字
      clearDimName (value) {
        const namePattern = /^\w+###/
        if (namePattern.test(value)) {
          return value.replace(namePattern, '')
        }
        if (isNaN(parseInt(value))) return ' - '
        return value
      }
    }
  }
</script>

<style lang="less">
  @border-color: #eceaea;
  @bg-color: rgb(226,244,254);
  @border: 1px solid @border-color;
  @width: 252px;
  @padding: 12px 16px;
  @gap: 16px;
  .el-carousel__arrow--right {
    width: 24px;
    background: rgba(0,0,0,0.45);
    font-size: 14px;
    font-weight: bold;
    right: 16px;
    height: 24px;
  }
  .el-carousel__arrow--left {
    width: 24px;
    background: rgba(0,0,0,0.45);
    font-size: 14px;
    font-weight: bold;
    right: 16px;
    height: 24px;
  }
  .el-icon-arrow-right:before{
    background-color:transparent;
  }
  .el-icon-arrow-left:before{
    background-color:transparent;
  }
  .dim-name{
    font-size: 14px;
    font-weight: bold;
    color: #666;
    width: @width;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: PingFangSC-Medium;
    cursor: pointer;
    &.vertP{
      margin-top: 8px;
    }
  }
  .label-metric-wrapper{
    margin-top: 8px;
    display: flex;
    flex-wrap: nowrap;
    >.el-carousel{
      width: 100%;
    }
    .metric-item{
      display: flex;
      flex-direction: column;
      width: @width;
      border: @border;
      border-radius: 2px;
      transition: all 0.2s ease;
      &.pointer{
        cursor: pointer;
      }
      &.notAllowed{
        cursor: not-allowed;
      }
      &+.metric-item{
        margin-left: 8px;
      }
      .metric-item-top{
        height: 90.59px;
        border-radius:2px;
        &.radius{
          border-bottom-right-radius:0px;
          border-bottom-left-radius:0px;
        }
        background-image: url(/static/charts/images/label.svg);
        p{
          line-height: 1;
          span{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.name1{
              margin-top:12px;
              font-size: 14px;
              color: #FFFFFF;
              font-weight: 500;
              font-family: PingFangSC-Medium;
            }
            &.num1{
              display: block;
              font-size: 28px;
              color: #fff;
              text-align: right;
              letter-spacing: 0;
              font-family: HelveticaNeue;
            }
            &.unit{
              font-weight: 500;
              margin-top:12px;
              font-size: 14px;
              color: #FFFFFF;
              font-family: PingFangSC-Medium;
              text-align: right;
            }
          }
        }
        .metric{
         margin-top:12px;
         margin-left: 16px;
        }
        .number{
          margin-top: 21px;
          margin-right:16px;
          text-align: right
        }
      }
      .metric-item-bottom{
        display: flex;
        flex-wrap: wrap;
        padding: 0px 10px 4px 10px;
        transition: all 0.2s ease;
        &.no-padding{
          padding: 0;
        }
        p{
          width: 65.5%;
          font-size: 14px;
          margin-top: 8px;
          color: #333333;
          font-family: HelveticaNeue;
          &.worth{
            width: 100%;
          }
          &.rate{
            width: 50%;
          }
          &.littleRate{
            width: 34.5%;
          }
          span{
            font-size: 14px;
            margin-right: 2px;
            &:first-child{
              font-family: PingFangSC-Regular;
              color: #666666;
            }
            &:last-child{
              font-family: HelveticaNeue;
              color: #333333;
              letter-spacing: -0.06px;
            }
            &.hideName{
              display: none;
            }
          }
        }
      }
    }
  }
  .label-layout-center{
    margin-left: 16px;
    margin-top: 16px;
    &.noDim{
      margin-top: 8px;
    }
  }
  .vertical{
    display: flex;
    margin-left: 16px;
    margin-top: 16px;
    &.noDim{
      margin-top: 8px;
    }
    >div+div{
      margin-left: 8px;
    }
    .label-metric-wrapper{
      margin-top: 8px;
      flex-direction: column;
      .metric-item+.metric-item{
        margin-left: 0;
        margin-top: 8px;
      }
    }
  }
  .wrap{
    margin-left: 8px;
    // margin-top: 16px;
    .label-metric-wrapper{
      flex-wrap: wrap;
      .metric-item{
          margin-left: 8px;
          margin-top: 8px;
         
      }
    }
  }
</style>
