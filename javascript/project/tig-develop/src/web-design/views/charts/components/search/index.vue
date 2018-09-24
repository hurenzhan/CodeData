<template>
  <div class="search-assembly">
    <!-- 左侧图表区域 -->
    <div class="left-search" :class="{'limit': isMore && showMore}" ref="mycontainer">
      <!-- 特殊组件，用来监听父容器div resize的变化 为div触发resize处理提供可能/-->
      <resize @notify="handleResize"></resize>
      <!-- text-area -->
      <div class="textArea-style" ref="realcontainer">
        <div class="flex-box">
          <div class="flex-container">
            <div class="filter-select-style">

              <!-- 查询按钮区域采用float/-->
              <div class="flex-right">
                <div class="flex-right-container">
                  <span class="inline-span" v-if="showMore">
                    <span class="el-dropdown-link" @click="showMoreData" v-if="isMore">展开<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <span class="el-dropdown-link" @click="showMoreData" v-else>收起<i class="el-icon-arrow-up el-icon--right"></i></span>
                  </span>
                  <span class="inline-span">
                    <el-button :type="buttonType" size="small" @click="commitData" :loading="isLoading" :disabled="isLoading">
                      查询
                    </el-button>
                  </span>
                  <span class="inline-span">
                    <span class="clear-option" @click="clearDimOrMetricOption">清 空</span>
                  </span>
                </div>
              </div>

              <!-- text-content -->
              <div class="text-style" v-for="(item, index) in currentContainer.feature.textCategory" :key="'leftText' + index"
                v-if="item.name ==='text'">
                <edit-box :value="item.value" v-if="item.value"></edit-box>
              </div>

      			 	<!-- 1. 日期范围 -->
              <div
                class="date-inlineBlock"
                v-for="(item, myIndex) in currentContainer.feature.dateCategory" :key="'date' + myIndex"
                v-if="item.name === 'dateTime'"
                >
                <date-range-pick :index="index" :timeData="item" :key="myIndex"></date-range-pick>
              </div>

              <!-- 4. 周期范围选择 -->
              <period-pick v-if="showPeriod" :index="index"></period-pick>

              <!-- 2. 维度 -->
              <!-- 2.1 维度titile -->
              <!-- <div class="dim-metric-title"> -->

              <!-- </div> -->

              <!-- 2.2 维度集合 -->
              <div
                class="drop-down-list"
                v-for=" (items, indexs) in dropDownData"
                :key="'dimList' + indexs"
                >
                  <p :title="currentContainer.feature.dropDownListTitle"
                    class="dim-title-style"
                    v-if="currentContainer.feature.dropDownListTitle!==''">
                    {{currentContainer.feature.dropDownListTitle + ' :'}}
                  </p>

                  <!-- 维度name -->
                  <span
                    :title="items.editName"
                  >
                    {{items.editName + ' :'}}
                  </span>

                  <!-- 维度操作区域 -->
                  <div class="dim-operation">
                    <!-- 操作符 -->
                    <div class="drop-down-selected">
                      <dim-oper :message="indexs" :index="index" :dimData="items"></dim-oper>
                    </div>

                    <!-- 封装维值下拉框组件 -->
                    <div class="drop-down-demo">
                      <dim-select-list :message="indexs" :index="index" :dimData="items"></dim-select-list>
                    </div>
                  </div>

                  <!-- 自定义维度控件 -->
                  <!--
                  <div class="dim-operation" v-else>
                    <div class="drop-down-demo">
                      <dimInputList :message="indexs" :index="index" :dimData="items"></dimInputList>
                    </div>
                  </div>
                  /-->
              </div>

              <!-- 3. 数据指标 -->
              <!-- metric-title -->
              <!-- <div class="dim-metric-title"> -->
              <!-- </div> -->

              <!-- metric-list -->
              <div
                class="data-metrics-list"
                v-if="currentContainer.feature.dataMetricsCategory.length>0"
                v-for=" (items,indexs) in dataMetricData"
                :key="'metricList' +indexs"
              >
                  <p :title="currentContainer.feature.dataMetricListTitle" class="metric-title-style" v-if="currentContainer.feature.dataMetricListTitle!==''">
                    {{currentContainer.feature.dataMetricListTitle + ' :'}}
                  </p>
                  <!-- metric-name -->
                  <span class="metric-Name" :title="items.editName">{{items.editName + ' :'}}</span>

                  <div class="metric-style">
                    <metric-left :message="indexs" :index="index" :metricData="items"></metric-left>
                  </div>

              </div>

              <!-- 5. 实时更新 -->
              <p class="cycle-style" v-if="showUpdateCycle">
                实时更新 ( {{realTime}} )
              </p>
            </div>
          </div>
        </div>
        <!-- <div class="clear-both"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import search from '@/web-design/api/search'
import { getMetricOrDimUsed, getCrossDimList, getMetricsUsed } from '../../utils/utils'
import { containerInit } from '../../static/configData'
import editBox from './leftControl/editBox'
// 维度操作符组件
import dimOper from './leftControl/dimLeftOper'
// 维值选择框组件
import dimSelectList from './leftControl/dimLeftSelect'
import dimInputList from './leftControl/dimLeftInput'
// 维度输入框组件
import inputs from './leftControl/metricLeftInput'
// 维值操作符组件
import metricOper from './leftControl/metricLeftOper'
// 指标操作符，输入框复合框
import metricLeft from './leftControl/metricLeftCompon'
// 维度复合框
import dimLeft from './leftControl/dimLeftCompon'
import eventBus from '../../utils/eventBus'
// import dataChange from './searchMixins/dataChange'
import debounce from 'lodash.debounce'
import {onlyUpdateBtnActive} from '../../utils/validationBySave'
import periodPick from './leftControl/periodPick'
import dateRangePick from './leftControl/dateRangePick'
import resize from './otherView/resize'
import aliasMap from '../mixins/aliasChange/aliasMap'
import {getValidTimeCycle, getCommonValidTimeCycle} from './searchUtils/common'
export default {
  name: 'searchInfo',
  mixins: [aliasMap, search],
  data() {
    return {
      test: 'cesjh',
      dimOperator: '', // 左侧维度操作符
      dimSelec: '',    // 左侧维度下拉选
      realTime: '',    // 实时更新时间
      realTimer: null, // 执行实时更新定时器 获取实时时间
      timer: null,     // 周期执行定时器 周期触发数据更新
      delayTimer: null,// 延时执行定时器
      initTimer: null,
      showMore: false, // 是否启用收起、展开功能 true => 启用 false => 禁用
      isMore: true,    // true: 收起, false: 展开
      startDate: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      endDate: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      selectedPeriod: 'day', //下拉选择内容：1 day按天, 2 week按周 3 month按月
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > (new Date().getTime())
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > (new Date().getTime())
        }
      }
    }
  },
  components: {
    editBox,
    dimOper,
    dimSelectList,
    dimInputList,
    inputs,
    metricOper,
    metricLeft,
    dimLeft,
    periodPick,
    resize,
    dateRangePick
  },
  // 在computed数据之前 初始化下拉框维度 对数据维度并清除保存的已选维值/对数据指标并清除保存的已设置条件
  created () {
    // 已改成在拉取查询面板配置参数的时候初始化
    // this.initMetricList()
    // this.initDimList()
    this.getConditionOfUrl(this.$route.fullPath.slice(this.$route.fullPath.indexOf('?') + 1))
  },
  mounted() {
    eventBus.$on(`resizeOrMove_${this.index}`, obj => {
      this.handleResize()
    })

    // 是否启用展开、收起功能
    this.$nextTick(() => {
      // 查看模式下生效
      if (this.$route.path.indexOf('visual') !== -1) {
        // console.log(this.$refs['realcontainer'].offsetHeight > 40)
        // 一行的高度正常是40px
        this.showMore = this.$refs['realcontainer'].offsetHeight > 50 ? true : false
        if (this.showMore) {
          this.isMore = true
        }
      }
    })
    // 初始化时 启动实时更新
    if( (this.currentContainer.feature.updateCycle.length > 0 || this.realPeriod)
      && ( this.$route.path.indexOf('visual') !== -1
      || this.$store.state.charts.previewToggle) ) {
      // 实时时间变化
      this.realTimer = setInterval(this.getRealTime, 1000)
      this.delayStartService()
    }

    if (this.$route.path.indexOf('visual') > -1 || this.$store.state.charts.previewToggle) {
      if (this.currentContainer.feature.isCheckedYearCompare || this.currentContainer.feature.isCheckedMonthCompare) {
        let startDate, endDate, timeCycle

        if (this.currentContainer.feature.dateCategory.length > 0) {
          startDate = this.currentContainer.feature.dateCategory[0].dateData[0]
          endDate = this.currentContainer.feature.dateCategory[0].dateData[1]
          timeCycle = this.currentContainer.feature.dateCategory[0].formatType
        } else if (this.currentContainer.feature.periodData.length > 0) {
          startDate = this.currentContainer.feature.periodData[0].dateData[0].starTime
          endDate = this.currentContainer.feature.periodData[0].dateData[0].endTime
          timeCycle = this.currentContainer.feature.periodData[0].timeUint
        }
        this.getQueryDate({startDate, endDate, timeCycle}).then(res => {
          this.$store.commit('generatorYoyAndMomDate', {
            index: this.currentContainer.i,
            value: res.data
          })
        })
      }
    }
  },
  props: ["index"],
  computed: {
    // 获取vuex公共数据,展示联动
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },
    // 维度重命名同步
    dropDownData () {
      const dropDownData = this.currentContainer.feature.dropDownData
      return dropDownData.map(i => {
        // 维度别名应用
        const alias = this.getAliasByDimCode(i.dimCode)
        // editName 适应别名修改
        i.editName = alias === false ? i.dimName : alias
        return i
      })
    },
    // 指标重命名同步
    dataMetricData () {
      const dataMetricData = this.currentContainer.feature.dataMetricData
      return dataMetricData.map(i => {
        // 维度别名应用
        const alias = this.getAliasByMetricCode(i.metricCode)
        // editName 适应别名修改
        i.editName = alias === false ? i.metricName : alias
        return i
      })
    },
    showPeriod () {
      if (!this.currentContainer.feature.periodData) {
        this.currentContainer.feature.periodData = []
      }
      return this.currentContainer.feature.periodData.length > 0 ? true : false
    },
    showUpdateCycle () {
      if (!this.currentContainer.feature.updateCycle) {
        this.currentContainer.feature.updateCycle = []
      }
      return this.currentContainer.feature.updateCycle.length > 0 ? true : false
    },
    // 周期选择控件启用了 实时功能
    realPeriod () {
      let period = this.currentContainer.feature.periodData[0]
      if (period && period.selectedKey === 0) {
        return true
      } else {
        return false
      }
    },
    // 实时更新服务是否启动 1.周期选择控件启用了实时类型 2.启用了实时更新控件
    realService () {
      // 添加实时更新控件时 可在左侧预览控件
      this.getRealTime()

      if (!this.currentContainer.feature.updateCycle) {
        this.currentContainer.feature.updateCycle = []
      }

      // 实时更新控件功能 在预览or查看模式下生效
      if ( (this.currentContainer.feature.updateCycle.length > 0 || this.realPeriod)
         && ( this.$route.path.indexOf('visual') !== -1
         || this.$store.state.charts.previewToggle)) {
        return true
      } else {
        return false
      }
    },
    isPublicDim () {
      return this.currentContainer.feature.isPublicDim
    },
    //  实时计算当前所有图表已选指标
    computeMetricList () {
      return getMetricOrDimUsed(this.$store.state.charts.chartsOption, 1).map(item => {return item.metricCode})
    },
    // 实时计算当前图表所有分析维度
    computeDimList () {
      // 获取已选指标的分析维度
      let dimList = getMetricOrDimUsed(this.$store.state.charts.chartsOption, 2)
      // 过滤掉时间维度
      return dimList.filter(item => item.dimCode !== 'dasp_date')
    },
    // 实时计算当前图表已选指标的公共维度
    publicDimList () {
      // 获取已所有图表选中指标
      let metricList = getMetricsUsed(this.$store.state.charts.chartsOption).map(item => {
          return {
            metricCode: item
          }
        })
      // 获取已选指标交叉维度
      let dimList = getCrossDimList(this.$store.state.charts.dataSet, metricList)
      // 过滤掉时间维度
      return dimList.filter(item => item.dimCode !== 'dasp_date')
    },
    // 是否存在关联的查询面板
    isRelative () {
      if (!this.currentContainer.feature.relativeSearch) {
        this.currentContainer.feature.relativeSearch = []
      }
      return this.currentContainer.feature.relativeSearch.length > 0 ? true : false
    },
    // 不可设置维度
    disabledDimList () {
      let disabledDim = []
      if (!this.currentContainer.feature.relativeSearch) {
        this.currentContainer.feature.relativeSearch = []
      }
      if (this.currentContainer.feature.relativeSearch.length > 0) {
        let relative = this.currentContainer.feature.relativeSearch
        for (let i = 0; i < relative.length; i++) {
          let index = relative[i]
          let dimList = this.$store.state.charts.chartsOption[index].feature.dropDownData
          dimList.forEach(item => {
            disabledDim.push(item.dimCode)
          })
        }
      }
      return disabledDim
    },
    // 关联的图表
    relativeCharts () {
      // return this.currentContainer.feature.tableSelectedList
      // 过滤掉已关联但是已删除的图表
      return this.currentContainer.feature.tableSelectedList.filter(
        item => {
          // 判断是否在删除的Tab里
          let inDropTab = false
          let drop = this.$store.state.charts.chartsOption[item].drop
          let isChart = this.$store.state.charts.chartsOption[item].id
          if (item.tabContainerIndex !== undefined) {
            this.$store.state.charts.chartsOption[item.tabContainerIndex].drop
              ? inDropTab = true
              : inDropTab = false
          }
          return (isChart === 0 || isChart === 4) && !drop && !inDropTab
        })
    },
    // 按钮类型
    buttonType () {
      return this.relativeCharts.length > 0 ? 'primary': 'info'
    },
    // 图表是否全部加载完成
    // TODO: 图表或接口异常 loadding 如何结束
    isLoading () {
      let loading = false
      this.relativeCharts.forEach(id => {
        let chart = this.$store.state.charts.chartsOption[id]
        if (chart.loading) {
          loading = true
        }
      })
      return loading
    },
    AllCharts () {
      return this.$store.state.charts.chartsReady
    },
    // 查询面板是否显示标题栏
    isShowTab () {
      return this.currentContainer.nameToggle
    }
  },
  watch: {
    // 监测进入mounted图表
    AllCharts (chartsArr) {
      chartsArr.forEach(chart => {
        if (this.relativeCharts.indexOf(chart.id) !== -1) {
          let key = `${this.index}-${chart.id}`
          if (!chart[key]) {
            this.sendUpdateToChart(chart.id)
          }
        }
      })
    },
    // 根据服务状态 启动或停止服务
    realService (value) {
      if (value) {
        // 实时时间变化
        this.realTimer = setInterval(this.getRealTime, 1000)
        this.delayStartService()
        // 监听 实时更新选项变化
        eventBus.$on(`setCycleType_${this.index}`, (obj) => {
          if (this.index === obj.index) {
            this.stopRealService()
            this.delayStartService()
          }
        })
      } else {
        this.stopRealService()
        eventBus.$off(`setCycleType_${this.index}`)
      }
    },
    computeMetricList (metricList) {
      this.$store.commit('checkMetricOut', {
        index: this.currentContainer.i,
        metricList
      })
    },
    computeDimList (dimList) {
      if (!this.isPublicDim) {
        this.checkDimOut(dimList)
      }
    },
    publicDimList (dimList) {
      if (this.isPublicDim) {
        this.checkDimOut(dimList)
      }
    },
    disabledDimList (dimList) {
      if (this.isRelative) {
        this.checkDimOutByRelative(dimList)
      }
    },
    // 标题栏显示切换，重新计算查询面板的高度以满足自适应
    isShowTab () {
      this.handleResize()
    }
  },
  methods: {
    // 初始化指标值
    initMetricList () {
      this.$store.commit('initDataMetricTitle',{
        index: this.currentContainer.i,
      })
    },
    // 初始化数据维度
    initDimList() {
      let dropDownData = this.currentContainer.feature.dropDownData
      let index = this.currentContainer.i
      // 清除已选维值
      // this.$store.commit('initDropDownSelectedValue', {index})
      dropDownData.forEach((item) => {
        // 非自定义维度 查询维值列表
        if (!item.type) {
          const dimCode = item.dimCode
          this.$store.dispatch('initDimListData',{index, dimCode})
        }
      })
    },
    //改变周期控件类型 按日 按周 按月
    changePeriod() {
      //修改周期类型
      this.$store.commit('changePeriodType',{
        index: this.currentContainer.i,
        selectedPeriod: this.selectedPeriod, //右侧select选中类型:day, week, month
      })
    },
    // 查询按钮事件
    commitData: debounce(
      function () {
        this.sendUpdateDataEvent()
      },
      300
    ),
    commitDataInner () {
      // 获取所有过滤条件
      const filterData = {}

      // 日期范围控件
      filterData.dateData = []
      if (this.currentContainer.feature.dateCategory.length > 0) {
        const dataArr = JSON.parse(JSON.stringify(this.currentContainer.feature.dateCategory))
        this.packDateRange(filterData, dataArr)
      }

      // 周期选择控件
      if ( this.currentContainer.feature.periodData.length > 0) {
        this.packPeriod(filterData, this.currentContainer.feature.periodData[0])
      }

      // 下拉维度控件
      filterData.dimListData = []
      if (this.currentContainer.feature.dropDownData.length > 0) {
        this.currentContainer.feature.dropDownData.forEach(item => {
          filterData.dimListData.push(item)
        })
      }

      // 下拉维度控件作用范围
      filterData.isPublicDim = this.currentContainer.feature.isPublicDim

      // 数据指标控件
      filterData.metricsListData = []
      if (this.currentContainer.feature.dataMetricData.length > 0) {
        this.currentContainer.feature.dataMetricData.forEach(item => {
          filterData.metricsListData.push(item)
        })
      }

      // 已勾选图表
      filterData.selectedTable = this.currentContainer.feature.tableSelectedList

      // 查询面板关联时
      if (this.isRelative) {
        this.commitDataByRelative(filterData)             // 存在关联的查询面板时 进行筛选条件的合并
      }

      // // 时间相关控件合法性校验
      // if (!this.isRelativeTimeEmpty(filterData)) {
      //   return false
      // }

      filterData.realUpdate = {}

      // 实时更新控件 设置更新时间
      // this.getRealTime()
      // 未配置查询面板时间 => 限制时间为当天
      if (this.realService) {
        let todayString = this.getTodayString()
        filterData.realUpdate = {
          isStart: true,
          startTime: todayString,
          endTime: todayString,
          formatType: 'realTime'
        }
      } else {
        filterData.realUpdate = {
          isStart: false
        }
      }
      return filterData
      // console.log('传输信息--->', filterData)
    },
    // 关联图表条件设置
    commitDataByRelative (filterData) {
      let relative = this.getValidSearch(this.currentContainer.feature.relativeSearch)
      for (let i = 0; i < relative.length; i++) {
        let index = relative[i]
        let config = this.$store.state.charts.chartsOption[index].feature
        // 时间的设置
        if (!filterData.dateData.length) {
          if (config.dateCategory.length > 0) {
            let dateArr = JSON.parse(JSON.stringify(config.dateCategory))   // 不改变原数据
            this.packDateRange(filterData, dateArr)
          }

          if (config.periodData.length > 0) {
            this.packPeriod(filterData, config.periodData[0])
          }

        }
        // 下拉框条件合并
        config.dropDownData.forEach(item => {
          if (!filterData.dimListData.some(subItem => subItem.dimCode === item.dimCode)) {
            filterData.dimListData.push(item)
          }
        })
        // 指标数据条件合并
        config.dataMetricData.forEach(item => {
          filterData.metricsListData.push(item)
        })
      }
    },
    // 对关联的查询检查是否可用 (关联过的查询面板可能会被删除)
    getValidSearch (relative) {
      let charts = this.$store.state.charts.chartsOption
      return relative.filter(id => {
        let chart = charts[id]
        // 判断是否在删除的Tab里
        let inDropTab = false
        if (chart.tabContainerIndex !== undefined) {
          charts[chart.tabContainerIndex].drop ? inDropTab = true : inDropTab = false
        }
        return !chart.drop && !inDropTab
      })
    },
    // 点击查询按钮之前 检查是否存图表需要点击更新按钮获取数据
    checkUpdate () {
      let result = false
      const errorArr = onlyUpdateBtnActive(this.$store.state.charts.chartsOption)
      if (errorArr.length) {
        this.$notify({
          title: '查询失败',
          dangerouslyUseHTMLString: true,
          message: errorArr.map(({title, msg}) => `<p><span>${title}</span>:<span>${msg}</span></p>`).join(''),
          position: 'bottom-right'
        })
        result = true
      }
      return result
    },
    // 点击查询按钮 向各个图表发送数据更新事件
    sendUpdateDataEvent () {
      console.log('sendUpdateDataEvent')
      if (this.checkUpdate()) {
        return
      }
      // 验证有没有‘更新’按钮需要点击的
      let filterData = this.commitDataInner()

      // 时间相关控件合法性校验
      if (!this.isRelativeTimeEmpty(filterData)) {
        return false
      }
      // 勾选图表查询条件信息
      for (let i = 0; i < filterData.selectedTable.length; i++) {
        let index = filterData.selectedTable[i]
        if (this.checkGranularity(index, filterData)) {
          // 将查询面板的时间添加到关联了面板的容器上
          this.$store.commit('syncSearchTime', {
            index,
            searchTime: filterData.dateData
          })
          eventBus.$emit(`updateQuery_${filterData.selectedTable[i]}`, JSON.parse(JSON.stringify(filterData)) )
        } else {

          // 方案A : 剔除时间, 采用数据关系里面的时间查询数据
          // 不影响数据源
          // let filterDataTemp = JSON.parse(JSON.stringify(filterData))
          // 清空时间
          // filterDataTemp.dateData = []
          // 对实时控件的兼容
          // if (filterDataTemp.realUpdate && filterDataTemp.realUpdate.isStart) {
          //   filterDataTemp.realUpdate = {}
          // }
          // this.$store.commit('syncSearchTime', {
          //   index,
          //   searchTime: filterDataTemp.dateData
          // })
          // eventBus.$emit(`updateQuery_${filterData.selectedTable[i]}`, filterDataTemp )

          // 方案B : 不符合规则的图表 不进行查询 但会进行出错提示
          let name = this.$store.state.charts.chartsOption[index].name
          this.$Message.warning(`时间粒度不满足图表 (${name}) 指标最小粒度`)
        }
      }

      if (this.initTimer !== null) {
        clearTimeout(this.initTimer)
        this.initTimer = null
      }
    },
    // 向各个图表发送初始化数据事件
    sendUpdateToChart (chartIndex) {
      if (this.checkUpdate()) {
        return
      }
      let filterData = this.commitDataInner()

      // 时间相关控件合法性校验
      if (!this.isRelativeTimeEmpty(filterData)) {
        return false
      }

      // 告诉图表 数据更新属于第一次初始化
      filterData.init = true

      this.$store.commit('syncSearchTime', {
        index: chartIndex,
        searchTime: filterData.dateData
      })

      // 结束初始化
      this.$store.commit('setChartsReady', {
        chartIndex: chartIndex,
        searchIndex: this.index
      })

      if (this.checkGranularity(chartIndex, filterData)) {
        // console.log('sendUpdateToChart', this.index, chartIndex, JSON.parse(JSON.stringify(filterData)) )
        eventBus.$emit(`updateQuery_${chartIndex}`, JSON.parse(JSON.stringify(filterData)) )
      } else {
        // 方案A : 剔除时间, 采用数据关系里面的时间查询数据
        // 不影响数据源
        // let filterDataTemp = JSON.parse(JSON.stringify(filterData))
        // 按数据关系时间查询
        // filterDataTemp.dateData = []
        // this.$store.commit('setChartsReady', {
        //   chartIndex: chartIndex,
        //   searchIndex: this.index
        // })
        // 对实时控件的兼容
        // if (filterDataTemp.realUpdate && filterDataTemp.realUpdate.isStart) {
        //  filterDataTemp.realUpdate = {}
        // }
        // eventBus.$emit(`updateQuery_${chartIndex}`,  filterDataTemp)

        // 方案B : 不符合规则的图表 不进行查询 但会进行出错提示
        let name = this.$store.state.charts.chartsOption[chartIndex].name
        this.$Message.warning(`时间粒度不满足图表 (${name}) 指标最小粒度`)
      }
    },
    // 检查时间粒度是否满足各个图表需求
    checkGranularity (index, filterData) {
      let chart = this.$store.state.charts.chartsOption[index]
      if (chart.id === 4) {
        return true
      }
      // 获取当前图表 所有指标的最小粒度集合
      let granularityArr = chart.feature.metricListFlat.map(item => {
        return item.timeGranularity
      })
      // 获取当前图表 可用的时间粒度集合
      let checkList = getCommonValidTimeCycle(granularityArr)

      // 存在时间控件时 检查粒度是否符合图表指标公共粒度
      // 不存在时间控件时 检查实时控件的粒度是否符合图表指标公共粒度
      // 没有时间控件 && 实时控件  直接return true
      if (!filterData.dateData.length) {
        if (filterData.realUpdate && filterData.realUpdate.isStart) {
          let formatType = filterData.realUpdate.formatType
          return checkList.some(value => value.formatType === formatType)
        } else {
          return true
        }
      } else {
        let formatType = filterData.dateData && filterData.dateData[0].formatType
        return checkList.some(value => value.formatType === formatType)
      }
    },
    // 检查周期控件 是否为空  => 暂时弃用
    isPeriodEmpty () {
      let periodData = this.currentContainer.feature.periodData[0]
      if ( !periodData.dateData.some(item => item.starTime && item.endTime) ) {
        this.$Message.warning('查询时间不能为空')
        return false
      } else {
        return true
      }
    },
    // 检查时间范围控件输入是否合法
    isRelativeTimeEmpty (filterData) {
      // console.log(filterData.dateData)
      // 检查控件类型是否一致  => 针对时间范围控件
      if (filterData.dateData.length > 1) {
        if ((filterData.dateData[0].type !== filterData.dateData[1].type) || (filterData.dateData[0].formatType !== filterData.dateData[1].formatType)) {
          this.$Message.warning('日期选择类型不一致, 请在右侧选择同类型范围！')
          return false
        }
      }
      let isEmpty = filterData.dateData.some(item => {
        if (!item.dateData) {
          return true
        } else {
          return Array.isArray(item.dateData) ? item.dateData.some(subItem => !subItem) : false
        }
      })
      // 检查时间是否为空
      if (isEmpty){
        this.$Message.warning('查询时间不能为空')
        return false
      }
      return true
    },
    // 日期范围控件 => 格式包装
    packDateRange (filterData, dataArr) {
      dataArr.forEach((item) => {
        if (item.type === 'dateTime') {
          var arr = []
          arr[0] = item.dateData
          arr[1] = item.dateData
          item.dateData = arr
        }
      })
      // filterData.dateData = dataArr.filter(item => item.dateData)
      filterData.dateData = dataArr
    },
    // 周期选择控件 => 格式包装
    packPeriod (filterData, periodData) {
      let data = []
      // console.log(periodData)
      if (periodData.dateData.length > 0) {
        for (let i = 0; i < periodData.dateData.length; i++) {
          let dateArr = []
          if (periodData.dateData[i].starTime !== null && periodData.dateData[i].endTime !== null) {
            dateArr.push(periodData.dateData[i].starTime)
            dateArr.push(periodData.dateData[i].endTime)
          } else {
            dateArr = null                                          // 与时间范围控件统一校验标准
          }
          // 周期选择是实时类型时 做版本兼容
          if (parseInt(periodData.selectedKey) === 0) {
            periodData.timeUint = 'hour'
          }
          data.push({
            name: 'periodData',                                     // 控件名
            dateData: dateArr,                                      // 时间数组
            type: periodData.type,                                  // 识别控件类型 [year,date,daterange,datetime]等
            formatType: periodData.timeUint,                        // 时间粒度
            value: periodData.compared && (i > 0) ? 'ComparDate' : 'dateRange'  // 用来识别对比期
          })
        }
      }
      filterData.dateData = data

    },
    // 有指标变化时检查当前的已选维度是否有效
    checkDimOut (dimList) {
      let selectedDim = this.currentContainer.feature.dropDownData
      // 对当前的已选维度 重新适配 过滤掉不符合的维度
      let filterDrop = selectedDim.filter(item => {
        if (dimList.some(subItem => {return subItem.dimCode === item.dimCode}) && dimList.length ) {
          return true
        } else {
          return false
        }
      })
      this.currentContainer.feature.dropDownData = filterDrop
      this.checkCascadeOut(dimList)
    },
    // 查询面板关联后过滤掉相同维度的条件
    checkDimOutByRelative (dimList) {
      let selectedDim = this.currentContainer.feature.dropDownData
      let filterDrop = selectedDim.filter(item => {
        if (dimList.some(subItem => {return subItem === item.dimCode}) && dimList.length ) {
          return false
        } else {
          return true
        }
      })
      this.currentContainer.feature.dropDownData = filterDrop
    },
    // 指标变化 过滤不符合当前维度集级联维度
    checkCascadeOut (dimList) {
      this.$store.commit('checkDimCascadeOut', {
        index: this.currentContainer.i,
        dimList
      })
    },

    /**
      实时更新控件功能相关
    */

    // 延时启动服务
    delayStartService () {
      let date = new Date()
      let minu = date.getMinutes()
      let sec = date.getSeconds()
      // 默认按秒
      let count = (60 - sec) * 1000

      if (!this.realPeriod) {
        let type = this.currentContainer.feature.updateCycle[0].type              // 执行类型 按时、按分
        count = type === '2' ? (60 - minu) * 60 * 1000 + (60 - sec) * 1000 : (60 - sec) * 1000
      }
      // console.log(count)
      // 延时到分钟/小时整执行
      this.delayTimer = setTimeout(this.startRealService, count)
    },
    // 启动实时更新服务
    startRealService () {
      // 默认60s 更新数据一次
      let timeout = 60 * 1000
      // 实时控件启动的实时更新服务
      if (!this.realPeriod) {
        let type = this.currentContainer.feature.updateCycle[0].type
        timeout = type === '2' ? 60 * 60 * 1000 : 60 * 1000
      }
      this.timer = setInterval(this.operate, timeout)
    },
    // 关闭实时更新服务
    stopRealService () {
      // console.log('stopRealService')
      clearInterval(this.timer)
      clearInterval(this.realTimer)
      clearTimeout(this.delayTimer)
      //console.log(this.timer, this.delayTimer)
    },
    // 关闭实时更新服务
    operate () {
      // 触发查询
      this.sendUpdateDataEvent()
    },
    // 获取更新的时间
    getRealTime () {
      let timeString
      timeString = this.getFullTime(new Date())
      this.realTime = timeString
    },
    // 时间操作函数
    getFullTime (string) {
      let date = this.getDateString(string.getFullYear(), string.getMonth(), string.getDate())
      let time = this.getTimeString(string.getHours(), string.getMinutes(), string.getSeconds())

      return date + ', ' + time
    },
    // 获取日期字符
    getDateString (year, month, day) {
      month = parseInt(month) + 1
      if (month < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      // 格式 xxxx-xx-xx
      return year + '.' + month + '.' + day
    },
    // 获取日期字符
    getTodayString () {
      let time = new Date()
      let year = time.getFullYear()
      let month = parseInt(time.getMonth()) + 1
      let day = time.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      // 格式 xxxx-xx-xx
      return year + '-' + month + '-' + day
    },
    // 获取时间字符
    getTimeString (hour, minu, sec) {
      if (parseInt(hour) < 10) {
        hour = '0' + hour
      }
      if (parseInt(minu) < 10) {
        minu = '0' + minu
      }
      if (parseInt(sec) < 10) {
        sec = '0' + sec
      }
      return hour + ':' + minu + ':' + sec
    },

    /*
    *   自适应高度
    */

    // 重新计算容器的高度
    handleResize () {
      let tab = this.isShowTab ? 40 : 0                               // 容器标题栏的高度
      let paddingT = 16                                               // 上padding 24px
      let paddingB = 8                                                // 上padding 16px
      let contentHeight = this.$refs['mycontainer'].offsetHeight      // 查询面板容器的有效内容的高度
      let RH = containerInit.rowHeight
      let margin = containerInit.margin[0]                            // 容器之间的margin
      let h = (contentHeight + paddingT + paddingB + margin + tab) / (RH + margin)
      // console.log('handleResize', contentHeight, h)
      this.$store.commit('setContainerHeight', {
        index: this.index,
        h: h
      })
    },
    // 显示更多数据
    showMoreData () {
      this.isMore = !this.isMore
    },
    /*
    *   其他
    */
    // 获取url中的条件
    getConditionOfUrl (string) {
      let condition = string.split('&').filter(item => item.indexOf('dimCode') !== -1 || item.indexOf('dimValue') !== -1)
      if (condition.length > 0) {
        let dimCode
        let dimValueNm
        condition.forEach(item => {
          if (item.indexOf('dimCode=') !== -1) {
            dimCode = item.split('=')[1]
          }
          if (item.indexOf('dimValue=') !== -1) {
            dimValueNm = decodeURIComponent(item.split('=')[1])
          }
        })
        this.setDropDownData(dimCode, dimValueNm)
      }
    },
    // 设置选中维值
    setDropDownData (dimCode, dimValueNm) {
      let valueList = []
      let nameList = []
      if (dimValueNm.indexOf('###') !== -1) {
        valueList.push(dimValueNm.split('###')[0])
      }
      nameList.push(dimValueNm)
      this.$store.commit('setSelectedValueBydimCode', {
        index: this.index,                        // 当前容器的index
        dimCode,                                  // 当前维度编码
        value: valueList,                         // 维值编码
        name: nameList                            // 维值名
      })
    },
    // 清除已选中的维值或已设置的指标值
    clearDimOrMetricOption () {
      let index = this.currentContainer.i
      this.$store.commit('initDropDownSelectedValue', {index})
      this.$store.commit('initDataMetricTitle', {index})
    }
  },
  beforeDestroy() {
    clearInterval(this.operate)
    clearTimeout(this.initTimer)
    eventBus.$off(`setCycleType_${this.index}`)
    eventBus.$off(`resizeOrMove_${this.index}`)
  }
}
</script>

<style lang="less" scoped>
  .search-assembly {
    padding: 16px 16px 8px 16px;
    box-sizing: border-box;
    overflow: hidden !important;
    .flex-box {
      display: flex;
      height: auto;
      .flex-container {
        flex: 1
      }
      .flex-right {
        float: right;
        .flex-right-container {
          margin-bottom: 8px;
          overflow: hidden;
        }
        font-size: 0;
        .inline-span {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
          .el-dropdown-link {
            padding: 0px 10px;
            cursor: pointer;
            color: #409EFF;
          }
          .clear-option {
            font-size: 12px;
            padding: 0px 10px;
            color: #409EFF;
            cursor: pointer;
          }
        }
        .el-button--small, .el-button--small.is-round {
          width: 74px;
          box-sizing: border-box;
        }
      }
    }
    // 父盒子
    .left-search {
      position: relative;
      width: 100%;
      // 标题
      .search-title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 16px;
        font-weight: bold;
        padding-left: 6px;
      }
      // 文本区域
      .textArea-style {
        width: 100%;
        // 文本内容
        .text-style {
          height: auto;
          box-sizing: border-box;
          word-wrap: break-word;
          font-size: 14px;
          color:rgba(102,102,102,1);
          font-family: HiraginoSansGB-W3;
          margin-right: 180px;
          textarea {
            border: 1px solid #999999;
            border-radius: 4px;
            outline: none;
            line-height: 24px;
            min-height: 24px;
            width: 100%;
            resize: none;
          }
        }
        .text-border {
          border: 1px solid #999999;
          border-radius: 4px;
        }
        // 按钮样式
        .btn-style {
          float: right;
          cursor: pointer;
          width: 74px;
          line-height: 32px;
          height: 32px;
          background-color: #51A6FF;
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #FFFFFF;
          border-radius: 4px;
        }
        .clear-both {
          clear: both;
        }
      }
      // 查询条件(日期，维度，指标区域)
      .filter-select-style {
        width: 100%;
        display: inline-block;
        vertical-align: middle;
        font-size: 0;
        // 日期
        .date-inlineBlock {
          display: inline-block;
          vertical-align: middle;
          margin-right: 24px;
          margin-bottom: 8px;
          .dateTime-innner {
            display: inline-block;
            vertical-align: middle;
            .demonstration {
              display: inline-block;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #333333;
              max-width: 120px;
              text-align: left;
              line-height: 32px;
              vertical-align: middle;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-right: 6px;
              .el-range-editor--mini .el-range-input {
                font-size: 14px;
              }
            }
            .datePicker {
              width: 125px;
              height: 32px;
              vertical-align: middle;
            }
            .date-style-day {
              width: 150px;
              height: 32px;
              vertical-align: middle;
              font-size: 14px;
            }
            .date-style-month {
              width: 120px;
              height: 32px;
              vertical-align: middle;
              font-size: 14px;
            }
            // 日期类型下的日期(当天，前一天)
            .date-style {
              width: 210px;
              height: 32px;
              vertical-align: middle;
              font-size: 14px;
              .el-input__icon .el-range__icon .el-icon-date {
                height: 32px;
              }
              span {
                height: 32px;
              }
            }
          }
        }
        // 维度, 数据指标标题
        .dim-title-style,
        .metric-title-style {
          display: inline-block;
          vertical-align: middle;
          line-height: 32px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          max-width: 120px;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        // 循环维度区域
        .drop-down-list {
          display: inline-block;
          vertical-align: middle;
          margin-bottom: 8px;
          margin-right: 24px;
          font-size: 0;
          // 维度名称
          span {
            max-width: 120px;
            text-align: left;
            line-height: 32px;
            vertical-align: middle;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-right: 6px;
          }
          // 维度操作符区域
          .dim-operation {
            display: inline-block;
            vertical-align: middle;
            font-size: 0;
            // 操作符下拉框
            .drop-down-selected {
              width: 80px;
              display: inline-block;
              vertical-align: middle;
              //position: relative;
              //left: 4px;
            }
            // 维值下拉框
            .drop-down-demo {
              //width: 160px!important;
              min-width: 160px!important;
              display: inline-block;
              vertical-align: middle;
              .demo {
                width: 160px!important;
              }
            }
          }
        }
        // 指标区域
        .data-metrics-list {
          display: inline-block;
          margin-right: 24px;
          margin-bottom: 8px;
          vertical-align: middle;
          font-size: 0;
          // 指标名称
          .metric-Name {
            font-family: PingFangSC-Regular;
            margin-right: 6px;
            line-height: 32px;
            vertical-align: middle;
            font-size: 14px;
            color: #333333;
            max-width: 120px;
            text-align: left;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          // 指标操作符
          .metric-style{
            display: inline-block;
            width: 250px;
            box-sizing: border-box;
            vertical-align: middle;
          }
        }

        // 周期
        .period-inlineblock{
          .period-select{
            margin-left: 19px;
            span{
              font-size: 14px;
              font-family: PingFangSC-Regula;
              color: #333333
            }
            .period-select-op{
              width:80px;
              .el-input--suffix{
                .el-input--small,.el-input__inner{
                  height: 32px;
                  line-height: 32px;
                }
              }

            }
          }
          .period-select-day{
            margin-left: 173px !important;
          }
        }
        .periodType{
          margin-left: 173px;
          margin-top: -32px;
          .el-date-editor--daterange{
            width: 240px;
            height: 32px;
          }
          .el-date-editor--month{
            width: 120px;
          }
        }
        .cycle-style{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          //margin: 5px 0 5px 0;
        }
      }
    }
    .limit {
      overflow: hidden;
      max-height: 40px;
    }
  }
</style>

<style lang="less">
  // 显示同环比
  .date-compare-double-wrap{
    background-color: hsla(100, 0%, 0%, .7);
    border-radius: 5px;
  }
  .date-compare-double-wrap .popper__arrow{
    display: none;
  }
  .date-compare-double{
    color: white;
  }
  // 显示同环比小图标
  .icon-info{
    position: absolute;
    right: -16px;
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: url("/static/charts/images/icon-info.svg") no-repeat 0 0;
    background-size: 100%;
    cursor: pointer;
  }
  .icon-info:hover{
    background-image: url("/static/charts/images/icon-info-hover.svg");
  }
  .search-assembly {
    .flex-box {
      .flex-right {
        .el-button--small, .el-button--small.is-round {
          width: 74px;
          box-sizing: border-box;
        }
        .el-button--info:focus, .el-button--info:hover, .el-button--info {
          background-color: #ccc;
          border-color: #ccc;
        }
        .el-button {
          font-weight: 400 !important;
          font-size: 14px;
        }
        .el-button--small, .el-button--small.is-round {
          padding: 8px 15px !important;
        }
      }
    }
    .left-search {
       // 日期
      .date-inlineBlock {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 5px;
        .dateTime-innner {
          font-size: 0;
          // 标题样式
          .datePicker {
            width: 120px;
            height: 32px;
            .el-input__inner {
              height: 32px;
            }
          }
          .date-style-day {
            width: 185px;
            height: 32px;
            .el-input__inner {
              height: 32px;
            }
          }
          .date-style-month {
            width: 120px;
            height: 32px;
            .el-input__inner {
              height: 32px;
              .el-input__prefix {
                top: -4px;
              }
            }
          }
          // 日期类型下的日期(当天，前一天)
          .date-style {
            width: 210px;
            height: 32px;
            vertical-align: middle;
            .el-range-separator {
              height: 32px;
            }
            .el-input__icon.el-range__icon.el-icon-date {
              // height: 100px;
            }
            .el-range-separator {
              line-height: 32px;
              text-align: center;
            }
          }
          .el-range-separator {
            width: auto;
          }
        }
      }
    }
  }

</style>



