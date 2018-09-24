<template>
  <div class="right-search">

    <!-- 1.标题栏title -->
    <div class="right-title">
			<div class="right-title-head">
				<span>元素标题</span>
      	<el-checkbox size="mini" v-model="checked" class="checkbox-style">显示</el-checkbox>
			</div>
			<el-input size="mini" v-model="searchTitle" clearable placeholder="请输入标题"></el-input>
		</div>

    <!-- 2.-查询条件 -->
    <div class="right-search-term">
      <el-collapse accordion v-model="activeName" @change="changeFlage">
        <!-- 1.-查询条件 -->
        <el-collapse-item name="1">'
          <template slot="title">
              <span class="chart-type-title">
                <span class="el-icon-caret-top triangle" :class="{activeIcon: activeName === '1'}"></span>
                <span style="margin-left:8px">查询条件</span>
              </span>
              <el-dropdown size="small" trigger="click" class="add-condition" @click.native.stop>
                <!-- 触发dropdown -->
                <span class="icon-position"><img src="/static/charts/images/plus.svg"></span>
                <!-- dropdown详细内容 -->
                <el-dropdown-menu slot="dropdown">
                  <div @click.stop="addText">
                    <el-dropdown-item>文本</el-dropdown-item>
                  </div>
                  <div @click.stop="addDateTime">
                    <el-dropdown-item :disabled="this.currentContainer.feature.periodData.length > 0 ||
                    this.currentContainer.feature.dateCategory.length > 1 || disabledTime">日期范围</el-dropdown-item>
                  </div>
                  <div @click.stop="addDropDown">
                    <el-dropdown-item :disabled="this.currentContainer.feature.dropDownCategory.length > 0">
                      数据维度
                    </el-dropdown-item>
                  </div>
                  <div @click.stop="addDataMetric">
                    <el-dropdown-item>数据指标</el-dropdown-item>
                  </div>
                  <div @click.stop="addPeriodDate">
                    <el-dropdown-item :disabled="this.currentContainer.feature.dateCategory.length > 0 ||
                    this.currentContainer.feature.periodData.length > 0 || disabledTime">日期选择</el-dropdown-item>
                  </div>
                  <div @click.stop="addDataCycle">
                    <el-dropdown-item :disabled="this.currentContainer.feature.updateCycle.length > 0">
                      实时更新
                    </el-dropdown-item>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
          <div class="content">
            <el-collapse accordion>
              <div
                class="searchTerm-text"
                v-for="(item, index) in currentContainer.feature.textCategory" :key="'text'+index"
                v-if="item.name === 'text'">
                <!-- 文本组件 -->
                <text-area :message="index"></text-area>
                <!-- 删除按钮 -->
                <div @click="delTextArea(index)" class="text-delBtn"><img src="/static/charts/images/minus.svg"></div>
              </div>
              <!-- 2.动态添加时间 -->
              <div
                class="searchTerm-dateTime"
                v-for="(item, index) in currentContainer.feature.dateCategory" :key="'dateTime'+index"
                v-if="item.name === 'dateTime'">
                <!-- 时间组件 -->
                <date-Time :datemessage="index" :typeName="item.value"></date-Time>
                <!-- 删除按钮 -->
                <div @click="delDateTime(index)" class="text-delBtn"><img src="/static/charts/images/minus.svg"></div>
              </div>
              <!-- 3.动态添加维度下拉选 -->
              <div
                class="searchTerm-dropDown"
                v-for="(item, index) in currentContainer.feature.dropDownCategory" :key="'dim'+index"
                v-if="item.name === 'dropDown'">
                <!-- 维度下拉选组件 -->
                <drop-down></drop-down>
                <!-- 删除按钮 -->
                <div @click="delDropDown(index)" class="text-delBtn"><img src="/static/charts/images/minus.svg"></div>
              </div>
              <!-- 4.动态添加数据指标 -->
              <div
                class="searchTerm-dataMetrics"
                v-for="(item, index) in currentContainer.feature.dataMetricsCategory" :key="'metric'+index"
                v-if="item.name === 'dataMetrics'">
                <!-- 数据指标组件 -->
                <data-metrics :metricMessage="index" :indexNum="item.key"></data-metrics>
                <!-- 删除按钮 -->
                <div @click="delDataMtrics(index, item.key)" class="text-delBtn">
                  <img src="/static/charts/images/minus.svg">
                </div>
              </div>
              <!-- 5.动态添加周期选择 -->
              <div
                class="searchTerm-periodDateTime"
                v-for="(item, index) in currentContainer.feature.periodData" :key="'period' + index">
                <!-- 周期组件 -->
                <period-date :periodmessage="index" :typeName="item.value"></period-date>
                <!-- 删除按钮 -->
                <div @click="delPeriodDate" class="text-delBtn"><img src="/static/charts/images/minus.svg"></div>
              </div>
              <!-- 6.实时更新控件 -->
              <div
                class="searchTerm-dataMetrics"
                v-for="(item, index) in currentContainer.feature.updateCycle" :key="'cycle'+index"
                v-if="item.name === 'updateCycle'"
                >
                <!-- 数据指标组件 -->
                <set-cycle></set-cycle>
                <!-- 删除按钮 -->
                <div @click="delDataCycle" class="text-delBtn"><img src="/static/charts/images/minus.svg"></div>
              </div>
            </el-collapse>
          </div>
        </el-collapse-item>

        <!-- 2.-高级 -->
        <el-collapse-item name="2">
          <template slot="title">
            <span class="chart-type-title">
              <span class="el-icon-caret-top triangle" :class="{activeIcon: activeName === '2'}"></span>
              <span style="margin-left:8px">高级</span>
            </span>
          </template>
          <senior-content></senior-content>
        </el-collapse-item>
      </el-collapse>


    </div>

    <!-- 高级内容区域 -->
    <!-- <div class="senior-content" v-show="isShowContent" @click.native.stop="isShowSeniorBtn">
      <senior-content></senior-content>
    </div> -->
    <!-- 高级按钮区域 -->
    <!-- <div class="senior-style" v-show="isShowBtn" @click="isShowSenior">
      <span class="chart-type-title">
        <span class="el-icon-caret-top triangle"></span>
        <span style="margin-left:8px">高级</span>
      </span>
      <div class="clear-style"></div>
    </div> -->


  </div>
</template>

<script>
// 文本封装组件
import textArea from './rightControl/textArea'
// 日期封装组件
import dateTime from './rightControl/dateTime'
// 下拉框封装组件
import dropDown from './rightControl/dropDown'
// 数据指标封装组件
import dataMetrics from './rightControl/dataMetrics'
// 周期选择封装组件
 import periodDate from './rightControl/periodDate'
// 高级面板封装组件
import senior from './rightControl/senior'
// 高级内容封装组件
import seniorContent from  './rightControl/seniorContent'
// 周期选择组件
import setCycle from './rightControl/setCycle'

export default {
  name: 'search-style',
  data() {
    return {
      activeName: '',
      isShowContent: false,
      disabledTime: false,
      isShowBtn: true
    }
  },
  components: {
    textArea,
    dateTime,
    dropDown,
    dataMetrics,
    senior,
    seniorContent,
    periodDate,
    seniorContent,
    setCycle
  },
  computed: {
    // 获取vuex数据
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    // 获取vuex中所有的图表名称
    tableNameList () {
      return this.$store.state.charts.chartsOption.filter(item => item.id === 0 && !item.drop).map(({name, i}) => ({name, i}))
    },
    // 是否显示标题
    checked: {
      get() {
        return this.currentContainer.nameToggle
      },
      set(value) {
        this.$store.commit('containerNameToggle', {
          index: this.currentContainer.i,
          value
        })
      }
    },
    // 获取数据，发送方法到mutaions,改变vuex数据
    searchTitle: {
      // 获取vuex中feature数据
      get () {
        return this.currentContainer.name
      },
      // 发送方法到mutations
      set (value) {
        this.$store.commit('changeContainerName', {
          index: this.currentContainer.i,
          value
        })
      }
    },
    // 高级面板勾选关联的图表
    checkedList: {
      get() {
        return this.currentContainer.feature.tableSelectedList
      },
      set(value) {
        this.$store.commit('tableSelected', {
          index: this.currentContainer.i,
          value
        })
      }
    },
    // 是否存在关联的查询面板
    isRelative () {
      if (!this.currentContainer.feature.relativeSearch) {
        this.currentContainer.feature.relativeSearch = []
      }

      return this.currentContainer.feature.relativeSearch.length > 0 ? true : false
    }
  },
  watch: {
    isRelative (newValue) {
      this.checkTimecontrol()
    }
  },
  methods: {
    changeFlage() {
      this.isShowContent = false
      this.isShowBtn = true
    },
    // 高级按钮
    isShowSenior() {
      this.isShowContent = !this.isShowContent
      this.isShowBtn = false
      this.activeName = ''
    },
    // 是否显示高级按钮
    isShowSeniorBtn() {
      this.isShowBtn = true
      this.isShowContent = false
      this.activeName = '1'
    },
    /**
     * @augments 文本
     */
    // 添加文本区域
    addText () {
      this.activeName = '1'
      this.isShowContent = false
      this.isShowBtn = true
      this.$store.commit('searchAddText',{
        index: this.currentContainer.i,
        value: ''
      })
    },
    // 删除相应的文本区域
    delTextArea (index) {
       this.$store.commit('delTextArea', {
        index: this.currentContainer.i,
        value: index
      })
    },
    /**
     * @augments 时间区域
     */
    // 添加时间区域
    addDateTime () {
      this.activeName = '1'
      this.isShowContent = false
      this.isShowBtn = true

      // 与周期控件互斥
      if (this.currentContainer.feature.periodData.length > 0 || this.disabledTime) {
        return
      }

      // 时间组件数组数量
      let dateArray = this.currentContainer.feature.dateCategory.length
      let dateData  = this.currentContainer.feature.dateCategory[0]

      // 添加数量判断，超过两个给出错误提示
      if ( dateArray > 1) {
        this.$Message.warning('日期范围条件暂只支持两个！')
        return
      }
      // 当前数组没有数据时
      else if ( dateArray === 0 ) {
        // 第一个日期查询条件
        const date = new Date
        let startDate = ''
        let endDate = ''
        let dateRangData = []
        startDate = date.getFullYear() + '-' + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + '-' + ((date.getDate()-1)<10?'0'+(date.getDate()-1):(date.getDate()-1))
        endDate = date.getFullYear() + '-' + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + '-' + ((date.getDate()-1)<10?'0'+(date.getDate()-1):(date.getDate()-1))
        dateRangData.push(startDate, endDate)
        // console.log('添加的初始数据', dateRangData)
         // 添加日期组件
        this.$store.commit('searchAddDateTime', {
          index: this.currentContainer.i, // 当前容器下标
          value: 'dateRange', // 默认类型
          title: '日期范围', // 日期条件组件title
          type: 'dateRange',  // 当前日期类型
          dateData: dateRangData, // 日期框选中数据
          formatType: 'date', // 当前日期框类型(day: 日期 , month: 月)
          dateType: 'preDate', // 默认选择框类型(nowDate: 当天, preDate:前一天 nowMonth:当月 preMonth:上一月)
        })
      }
      if ( dateArray === 1 && dateData.value !== "ComparDate") {
        // 对比日期
        const date = new Date
        let startDate = ''
        let endDate = ''
        let dateRangData = []
        startDate = (date.getFullYear()-1) + '-' + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + '-' + ((date.getDate()-1)<10?'0'+(date.getDate()-1):(date.getDate()-1))
        endDate = (date.getFullYear()-1) + '-' + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + '-' + ((date.getDate()-1)<10?'0'+(date.getDate()-1):(date.getDate()-1))
        dateRangData.push(startDate, endDate)
        // 添加日期组件
        this.$store.commit('searchAddDateTime', {
          index: this.currentContainer.i,
          value: 'ComparDate',
          title: '对比日期 :',
          type: 'dateRange',
          dateData: dateRangData,
          formatType: 'date', // 当前日期框类型(day: 日期 , month: 月)
          dateType: 'preDate', // 默认选择框类型(nowDate: 当天, preDate:前一天 nowMonth:当月 preMonth:上一月)
        })
      }
      if ( dateArray === 1 && dateData.value === "ComparDate") {
         // 第一个日期查询条件
        const date = new Date
        let startDate = ''
        let endDate = ''
        let dateRangData = []
        startDate = date.getFullYear() + '-' + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + '-' + ((date.getDate()-1)<10?'0'+(date.getDate()-1):(date.getDate()-1))
        endDate = date.getFullYear() + '-' + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + '-' + ((date.getDate()-1)<10?'0'+(date.getDate()-1):(date.getDate()-1))
        dateRangData.push(startDate, endDate)
        // console.log('添加的初始数据', dateRangData)
         // 添加日期组件
        this.$store.commit('searchAddDateTime', {
          index: this.currentContainer.i, // 当前容器下标
          value: 'dateRange', // 默认类型
          title: '日期范围标题', // 日期条件组件title
          type: 'dateRange',  // 当前日期类型
          dateData: dateRangData, // 日期框选中数据
          formatType: 'date', // 当前日期框类型(date: 日期 , month: 月)
          dateType: 'preDate', // 默认选择框类型(nowDate: 当天, preDate:前一天 nowMonth:当月 preMonth:上一月)
        })
      }
    },
    // 删除相应的日期区域
    delDateTime (index) {
      if (this.currentContainer.feature.dateCategory.length > 1 && index == 0) {
        this.$Message.warning('请确认是否存在对比日期, 不能单独删除日期范围！！！')
        return
      } else {
        this.$store.commit('delDateTime', {
          index: this.currentContainer.i,
          value: index
        })
      }
    },
    /**
     * @augments 维度下拉
     */
    // 添加点击维度下拉选方法
    addDropDown () {
      //$route 配置，显示添加下拉框
      this.activeName = '1'
      this.isShowContent = false
      this.isShowBtn = true
      // 下拉框数量限制只支持一个
      let dropDownArray = this.currentContainer.feature.dropDownCategory.length
      // 添加数量判断，超过两个给出错误提示
      if ( dropDownArray > 0) {
        this.$Message.warning('数据维度控件件暂只支持一个！')
        return
      }
      this.$store.commit('searchAddDropDown', {
        index: this.currentContainer.i,
        value: ''
      })
    },
    // 删除相应的维值下拉框
    delDropDown (index) {
      this.$store.commit('delDropDown', {
        index: this.currentContainer.i,
        value: index
      })
      // 清空级联
      this.$store.commit('clearDimCascade', {
        index: this.currentContainer.i,
      })
    },
    /**
     * @augments 数据指标
     */
    // 添加点击数据指标方法
    addDataMetric () {
      this.activeName = '1'
      this.isShowContent = false
      this.isShowBtn = true
        // 数据指标数量限制只支持两个
      let dataMetricsArray = this.currentContainer.feature.dataMetricsCategory.length
      // 添加数量判断，超过两个给出错误提示
      // console.log('当前个数', dataMetricsArray)
      if ( dataMetricsArray > 1) {
        this.$Message.warning('数据指标条件暂只支持两个！')
        return
      }
      this.$store.commit('searchAddDataMetrics', {
        index: this.currentContainer.i,
        value: '',
        key: this.getMetricFlag(),
        dataList: []
      })
    },
    // 获取指标控件的识别符
    getMetricFlag () {
      let dataMetrics = this.currentContainer.feature.dataMetricsCategory
      const flagArr = ['num0', 'num1']
      if (dataMetrics.length === 0) {
        return flagArr[0]
      } else if (dataMetrics.length === 1) {
        let usedFlag = dataMetrics[0].key
        return flagArr.filter(item => item !== usedFlag)[0]
      }
    },
    // 删除相应的数据指标
    delDataMtrics (index, key) {
      // console.log('12313213123132', key)
      this.$store.commit('delDataMtrics', {
        index: this.currentContainer.i,
        value: index,
        key
      })
    },
    addPeriodDate () {
      // 与时间范围控件互斥
      if (this.currentContainer.feature.dateCategory.length > 0 || this.disabledTime) {
        return
      }

      this.$store.commit('searchAddPeriodDate', {
        index: this.currentContainer.i,
      })
    },
    delPeriodDate () {
      this.$store.commit('delPeriodDate', {
        index: this.currentContainer.i,
      })
    },
    // 实时更新控件
    addDataCycle () {
      if (this.currentContainer.feature.updateCycle.length > 0) {
        return
      }
      this.activeName = '1'
      this.isShowContent = false
      this.isShowBtn = true

      this.$store.commit('addDataCycle', {
        index: this.currentContainer.i
      })
    },
    delDataCycle () {
      this.$store.commit('delDataCycle', {
        index: this.currentContainer.i
      })
    },
    // 时间相关控件是否可用
    checkTimecontrol () {
      let relative = this.currentContainer.feature.relativeSearch
      this.disabledTime = false
      if (this.isRelative) {
        for (let i = 0; i < relative.length; i++) {
          let index = relative[i]
          if ( this.$store.state.charts.chartsOption[index].feature.dateCategory.length > 0
            || this.$store.state.charts.chartsOption[index].feature.periodData.length > 0) {
            this.disabledTime = true
          }
        }
      }
    }
  },
  mounted () {
    // this.activeName = '1'
  }
}
</script>

<style lang="less">
  .right-search {
    // 标题
    .right-title {
			margin: 11px;
			.right-title-head {
        font-size: 14px;
        color:rgba(51,51,51,1);
        font-family: PingFangSC-Medium;
        font-weight: bold;
        margin-bottom: 10px;
        .checkbox-style {
          float: right;
          font-family: PingFangSC-Regula;
          color:rgba(153,153,153,1);
				}
      }
    }
    // 查询条件
    .right-search-term {
      position: relative;
      .chart-type-title {
        width: 100%;
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
      .el-dropdown{
        float: right;
        display: table;
        .icon-position{
          padding: 0px 11px 0px 30px;
          display: table-cell;
        }
      }
      .el-collapse-item {
        .el-collapse-item__wrap {
          // border-bottom: none;
        }
        .el-collapse {
          border-bottom: none;
        }
        .el-collapse-item__content {
          margin-bottom: 0px;
          padding-bottom: 0px;
        }
        .el-icon-arrow-right:before{
          content: ''
        }
      }
      .content {
        //max-height: 410px;
        max-height: calc(100vh - 227px);
        overflow: auto;
        .el-collapse {
          padding: 4px 0px 4px 0;
        }
      }
      // 滚轮区域宽度
      .content::-webkit-scrollbar {
        width: 0px;
        // background: #535353;
      }
      // 滚轮样式
      .content::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 2px;
        background: #E0E2E3;
      }
      // 滚轮底色样式
      .content::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        // border-radius: 10px;
        background: #ffffff;
      }
      .searchTerm-text,
      .searchTerm-dateTime,
      .searchTerm-dropDown,
      .searchTerm-dataMetrics,
      .searchTerm-periodDateTime
       {
        padding: 4px 8px 4px 12px;
        .right-Component {
          width:176px;
          display: inline-block;
        }
        // 删除按钮
        .text-delBtn {
          text-align: center;
          position: relative;
          display: inline-block;
          width: 16px;
          height: 16px;
          line-height: 5px;
          float: right;
          top: 7px;
          cursor: pointer;
          color: #C1C3C3;
        }
      }
      // .searchTerm-text{
      //   padding: 8px 12px 4px 12px;
      // }
      // .searchTerm-text
      // 查询条件伸缩板样式
      .searchTerm-title {
        color:#333333;
        font-family: PingFangSC-Medium;
        margin-left: 10px;
        font-size: 14px;
      	font-weight: bold;
      }
    }
    .senior-content {
      width: 100%;
      // line-height: 32px;
      // height: 32px;
      // text-align: center;
      // background-color: rgb(204, 204, 204);
    }
    .senior-style {
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      font-weight: bold;
      border-top: 1px solid #ccc;
      position: absolute;
      width: 100%;
      bottom: 0;
      .senior-title {
        color:#333333;
        margin-left: 24px;
      }
      i {
        float: right;
        line-height: 48px;
        margin-right: 13px;
      }
      .clear-style {
        clear: both;
      }
    }
    .activeIcon {
      transform: rotate(180deg);
    }
    .el-checkbox__label {
      padding-left: 6px;
      color: #666666;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
      color: #666666;
    }
    .el-tree-node__content>.el-checkbox {
      margin-right: 6px;
    }
    .el-switch__core {
      height: 16px;
      width: 36px !important;
      border-radius: 8px;
      vertical-align: top;
    }
    .el-switch__core::after{
      width: 12px;
      height: 12px;
    }
    .el-switch.is-checked .el-switch__core::after {
      margin-left: -13px;
    }
    .el-switch__core .el-switch__button {
      width: 12px;
      height: 12px;
    }
    .el-switch__label {
      height: 16px;
    }
    .el-switch__label--right {
      font-size: 14px !important;
      line-height: 16px;
      vertical-align: top;
    }
    .el-switch__label--right is-active {
      font-size: 14px !important;
      line-height: 16px;
      vertical-align: top;
    }
  }
</style>

