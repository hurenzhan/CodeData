<template>
  <div :containerIndex="index" v-noData="{noDataLayer, containerHasTitle}">
    <template v-if="cardType==='1'">
      <el-carousel :height='carouselHeight' :autoplay="false" indicator-position="none" arrow="hover">
        <el-carousel-item v-for="(carouselItem,carouselIndex) in Math.ceil(showData.length/num)" :key="carouselIndex">
          <div class="card-dim-center">
            <div v-for="(dim, index) in showData" :key="index" v-if="index>=carouselIndex*num && index<=carouselIndex*num+num-1">
              <div class="card-dim-wrapper" @click="linkHandle(dim.dimName)">
                <dim-card
                  class="dim-item"
                  :styleConfig="styleConfig"
                  :dim ="dim"
                  :dimName ="dim.dimName"
                  :getMetricsCodeArr ="getMetricsCodeArr"
                ></dim-card>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </template>
    <pro-card
      v-if="cardType==='2'"
      :styleConfig="styleConfig"
      :showData = "showData"
      :getMetricsCodeArr ="getMetricsCodeArr"
    ></pro-card>
    <link-card
      v-if="cardType==='3'"
      :styleConfig="styleConfig"
      :showData = "showData"
      :getMetricsCodeArr ="getMetricsCodeArr"
    ></link-card>
    <template v-if="cardType==='4'">
      <el-carousel height='163px' :autoplay="false" indicator-position="none" arrow="hover">
        <el-carousel-item v-for="(carouselItem,carouselIndex) in Math.ceil(rankValue/num)" :key="carouselIndex">
          <el-radio-group v-model="metricFlatSelect" size="small" @change="handleClick" style="margin:16px 16px 0 16px">
            <el-radio-button
              v-for="(item, index) in getMetricListFlatArr"
              :key="index"
              :label="item.value"
              :disabled="item.value.slice(-2) === '_5'||item.value.slice(-2) === '_6'||item.value.slice(-2) === '_7'||item.value.slice(-2) === '_8'||item.value.slice(-2) === '_x'">
              {{item.name}}
            </el-radio-button>
          </el-radio-group>
            <div class="card-ranking-center">
              <div v-for="(dim, index) in rankingData" :key="index" v-if="index>=carouselIndex*num && index<=carouselIndex*num+num-1 && index<= rankValue-1">
                <div class="card-ranking-wrapper" @click="linkHandle(dim.dimName)">
                  <ranking-card
                    class="ranking-item"
                    :serialNumber='index'
                    :sortType="sortType"
                    :dimName ="dim.dimName"
                  ></ranking-card>
                </div>
              </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </template>
  </div>
</template>

<script>
  import eventBus from '../../utils/eventBus'
  import { containerInit } from '../../static/configData'
  import { sendLinkInfo } from '../../utils/utils'
  import searchMixin from '../../../../api/search'
  import carouselMixin from './carouselMixin'
  import dimCard from './dimCard'
  import linkCard from './linkCard'
  import proCard from './proCard'
  import rankingCard from './rankingCard'
  import aliasMap from '../mixins/aliasChange/aliasMap'
  import noDataMixin from '../mixins/noData/noDataMixin'

  export default {
    name: 'LabelLayout',
    props: ['index'],
    mixins: [searchMixin, carouselMixin, aliasMap, noDataMixin],
    components: {dimCard, linkCard, proCard, rankingCard},
    data () {
      return {
        showData: [] ,// 展示的数据
        getMetricsCodeArr:[],
        getMetricListFlatArr:[],
        getDimName:null,
        sortType:1,
        rankingData:[]
      }
    },
    computed: {
      chartsOption() {
        return this.$store.state.charts.chartsOption;
      },
      option () {
        return this.$store.state.charts.chartsOption[this.index]
      },
      // 图标样式
      styleConfig () {
        return this.option.feature.styleConfig
      },
      // 获取选择的指标单位
      getMetricsMulUnits () {
        return this.option.feature.metricList.mulUnits.map(item => item.unitNm)
      },
      dimList () {
        return this.option.feature.dimList || []
      },
      metricList () {
        return this.option.feature.metricList || []
      },
      metricListFlat () {
        return this.option.feature.metricListFlat || []
      },
      rankValue () {
        return  Number(this.styleConfig.rankValue) || 3
      },
      isDimValue () {
        if(this.dimList.length !==0 ){
          return this.dimList[0].dimCode.indexOf('_WD_')
        }
      },
      cardType () {
        return this.styleConfig.cardType
      },
      initMetricCode() {
        return this.metricList.length === 0 ? '' : this.metricList[0].metricCode
      },
      metricFlatSelect: {
        get() {
           return this.styleConfig.metricFlatSelect || ''
        },
        set(value) {
          this._initMetricFlatSelect(value)
        }
      },
     },
    methods: {
      // 调用联动函数
      linkHandle (dimName) {
        if(dimName !== undefined) {
          sendLinkInfo(this.chartsOption, this.index, {
          dimCode: this.getDimName,
          dimName: dimName.indexOf('###') !== -1 ? dimName.split('###')[1] : dimName,
          dimValue: dimName.indexOf('###') !== -1 ? dimName.split('###')[0] : dimName,
          nearUpdateTime: this.option.nearUpdateTime
        })
        }else{
           this.$message({
            message: "卡片暂无数据，不支持图表关联",
            type: "warning"
          });
        }
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
      // 获取选择的指标属性
      _getMetricListFlat() {
       this.getMetricListFlatArr = this.option.feature.metricListFlat.map((item, index) => {
         return {
            value: item.metricCode,
            name: item.metricName.split('(')[0]
          }      
       })
      },
      // 获取升序降序
      getSortType () {
        this.sortType = this.option.sortType
      },
      // 获取选择的维度
      _getDimName () {
        this.getDimName = this.dimList.length === 0 ? null : this.dimList[0].dimCode
      },
      // 监听联动
      async updateLinkHandle (linkInfo) {
        const res = await this.updateDataPre(
          {
            index: this.index,
            linkInfo: linkInfo
          }
        )
        this.showData = res.map(item => this.clearData(item))
        this.rankingData = res.map(item => this.clearData(item))
      },
      // 处理数据函数
      clearData (item) {
        item.dimName = item[this.getDimName]
        this.getMetricsCodeArr.forEach(each => {
          // 当有别名的时候用别名，没有的时候，用原名
          const hasAlias = this.getAliasByMetricCode(each.code)
          if (hasAlias === false) {
            item[`${each.code}Name`] = this.metricList.filter(item => item.metricCode === each.code)[0].metricName
          } else {
            item[`${each.code}Name`] = hasAlias
          }
        })
        return item
      },
      changeShowData() {
        return this.option.data.map(item => this.clearData(item))
      },
      _initShowType() {
        if(this.dimList.length === 0){
          if(this.cardType === '4'){
             this.$store.commit('showTypeToggle', {
              index: this.index,
              key: 'cardType',
              value:'1'
            })
          }
        }
        if(this.dimList.length === 1){
          if(this.cardType === '2'|| this.cardType === '3'|| this.sortType === 2 || this.isDimValue < 0 || this.metricList.length !== 1 ){
            this.$store.commit('showTypeToggle', {
              index: this.index,
              key: 'cardType',
              value:'1'
            })
          }
        }
      },
      handleClick(value) {
        (async () => {
          const sortList = [{
            attrCode: value,
            attrType: '1',
            sortType: Number(this.sortType)
          }]
          const res = await this.updateDataPre(
            {
              index: this.index,
              sortList: sortList
            }
          )
          this.toggleNoData(res.length)
          this.rankingData = res.map(item => this.clearData(item))
          this.computeCarouselHeight()
          this._initMetricFlatSelect(value)
        })()    
      },
      _initMetricFlatSelect(value) {
        this.$store.commit('showTypeToggle', {
          index: this.index,
          key: 'metricFlatSelect',
          value: value
        })
      },
      _initRankCard() {
        if(this.metricFlatSelect){
          this.rankingData = this.handleClick(this.metricFlatSelect)
        } else {
          this.rankingData = this.changeShowData()
          this._initMetricFlatSelect(this.initMetricCode)
        }
      }
    },
    mounted () {
      this._initRankCard()
      this.getMetricsCode()
      this.getSortType()
      this._getDimName()
      this._getMetricListFlat()
      this.showData = this.changeShowData()
      this.computeCarouselHeight()
      // 联动
      eventBus.$on(`updateLink_${this.index}`, (emitObj) => {
        this.updateLinkHandle(emitObj.linkInfo)
      })
      // 查询面板
      eventBus.$on(`updateQuery_${this.index}`, (obj) => {
        (async () => {
          const res = await this.updateDataPre(
            {
              index: this.index,
              queryInfo: obj
            }
          )
          this.toggleNoData(res.length)
          this.showData = res.map(item => this.clearData(item))
          this.rankingData = res.map(item => this.clearData(item))
          this.computeCarouselHeight()
          this._initMetricFlatSelect(this.initMetricCode)
        })()
      })
      // 监听更新数据
      eventBus.$on(`updateData_${this.index}`, (obj) => {
        if (!obj.init&&!obj.from) {
          this._initMetricFlatSelect(this.initMetricCode)
          this.rankingData = this.changeShowData()
        }
        this.showData = this.changeShowData()
        this.toggleNoData(this.option.data.length)
        this.getMetricsCode()
        this.getSortType()
        this._getDimName()
        this._getMetricListFlat() 
        this.computeCarouselHeight()
        this._initShowType()
      })
      // 监听拖拽
      eventBus.$on(`resizeOrMove_${this.index}`, () => {
        this.computeNum()
        this.computeCarouselHeight()
      })
      // 通知查询面板准备完毕
      this.$store.commit('chartsReady', {
        index: this.index
      })
    },
    filters: {
      // 三位数字用，号隔开
      splitByComma (value) {
        return Number(value).toLocaleString()
      }
    },
    watch: {
      cardType: {
        handler () {
          this.computeNum()
        },
        deep: true
      }
    },
    beforeDestroy () {
      eventBus.$off(`resizeOrMove_${this.index}`)
      eventBus.$off(`updateLink_${this.index}`)
      eventBus.$off(`updateQuery_${this.index}`)
      eventBus.$off(`updateData_${this.index}`)
    }
  }
</script>

<style lang="less">
  @border-color: #E8EAEB;
  @bg-color: rgb(226,244,254);
  @border: 1px solid @border-color;
  @width: 134px;
  @height: 270px;
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
  .card-dim-center{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    display: flex;
    margin-left: 16px;
    margin-top: 16px;
    >div+div{
      margin-left: 8px;
    }
    .card-dim-wrapper{
      flex-direction: column;
      .dim-item{
        display: flex;
        flex-direction: column;
        width: @width;
        border-radius: 2px;
        min-height: 129px;
        transition: all 0.2s ease;
        background-image: linear-gradient(0deg, #E2E6FF 0%, #DDE3FF 22%, #CCDFFF 97%);
        .dim{
          height: 28px;
          text-align: center;
          padding: 4px;
          background: #ADBDD9;
          border-radius: 2px 2px 0 0;
          .dim-name{
            font-family: PingFangSC-Medium;
            font-weight: 500;
            font-size: 14px;
            color: #FFFFFF;
          }
        }
        .metric{
          display: block;
          text-align: right;
          padding: 9px 12px 3px 0;
          p{
            line-height: 1.32;
            color: #333333;
            margin-bottom: 8px;
            .metric-name{
              display: block;
              margin-bottom: 2px;
              margin-right: 3px;
              font-family: PingFangSC-Regular;
              font-size: 12px;
            }
            .metric-code{
              display: block;
              font-family: HelveticaNeue;
              font-weight: 500;
              font-size: 16px;
            }
          }
        }
        &+.dim-item{
          margin-left: 8px;
        }
      }
      .dim-item:hover{
       box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      }
      .dim-item+.dim-item{
        margin-left: 0;
        margin-top: 8px;
      }
    }
  }
  .pro{
    min-width: 312px;
    margin-top:16px;
    margin-left:16px;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    .metric-name{
     margin-bottom: 7px;
     font-family: PingFangSC-Regular;
     font-size: 14px;
     color: #333333;
     display: block;
     text-align: left;
    }
    .metric-code{
      display: inline-block;
      width: 175px;
      font-family: HelveticaNeue-Medium;
      font-size: 20px;
      background: linear-gradient(to right, #6492D3, #3AE2F0);
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: 0;
      text-align: left;
    }
    .rate{
      .rate-name{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
      }
      .rate-number{
        margin-left: 6px;
        font-family: HelveticaNeue;
        font-size: 14px;
        color: #333333;
      }
    }
  }
  .linkCard{
    min-width: 202px;
    margin-left:16px;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    .metric-name{
      margin-top: 16px;
      margin-bottom: 7px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #51A6FF;
      display: block;
    }
    .metric-code{
      margin-right: 8px;
      font-family: HelveticaNeue-Medium;
      font-size: 20px;
      color: #333333;
    }
    img{
      margin-bottom: 2px;
    }
    .total{
      margin-top: 8px;
      margin-bottom: 6px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      display: block;
    }
    .sum{
      margin-top: 6px;
      font-family: HelveticaNeue-Medium;
      font-size: 20px;
      color: #F25C11;
    }
    .hyper-link{
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .card-ranking-center{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    display: flex;
    margin-left: 16px;
    margin-top: 16px;
    >div+div{
      margin-left: 8px;
    }
    .card-ranking-wrapper{
      flex-direction: column;
      cursor: pointer;
      .ranking-item{
        display: flex;
        flex-direction: column;
        width: 212px;
        height: 91px;
        border-radius: 2px;
        transition: all 0.2s ease;
        background-image: url(/static/charts/images/ordRankCard.svg);
        position: relative;
        &.top-tree{
          background-image: url(/static/charts/images/topThreeCard.svg);
        }
        .ranking-img{
             position:absolute;
             top: -18%;
             left: 41%;
          }
        .box:after {
          box-shadow: 0 2px 4px rgba(11,35,53,0.32);
          }
        .serial{
          height: 17px;
          margin-left: 14px;
          margin-top: 10px;
          margin-bottom: 20px;
          span{
            font-family: HelveticaNeue-Medium;
            font-size: 14px;
            color: #FFFFFF;
            text-align: left;
            display: inline-block;
            margin-left: 4px;
          }

        }
        .dim{
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #FFFFFF;
          text-align: center;
        }
      }
    }
  }
</style>
