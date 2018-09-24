<template>
  <div class="tab" :id="tabId">
    <el-tabs v-model="activeName" @tab-click="tabClickHandle">
      <el-tab-pane
        v-for="(item, tabIndex) in tabs"
        :key="tabIndex"
        v-if="!item.drop"
        :lazy="true"
        :name="String(tabIndex)">
        <span slot="label" class="tab-item-name" :title="item.name">{{item.name}}</span>
        <left :containerIndex="index" :tabIndex="tabIndex"></left>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import left from './left'
  import eventBus from '../../utils/eventBus'
  import {wait, tick, getInShowContainers} from '../../utils/utils'
  import search from '../../../../api/search'

  export default {
    name: 'TabContainer',
    props: ['index'],
    mixins: [search],
    data () {
      return {
        activeName: '0',
        hasClickedTabs: [], // 已经点击过的tab
        leaveFlag: true // 判断tab是否能离开
      }
    },
    components: {left},
    computed: {
      containerOption () {
        return this.$store.state.charts.chartsOption[this.index]
      },
      charts () {
        return this.$store.state.charts
      },
      // 初始化的tab第一个
      inThisTabCharts () {
        const filterChartOption = this.charts.chartsOption.filter(
          ({drop, tabContainerIndex, activeTabIndex, id}) => !drop && tabContainerIndex === this.index && activeTabIndex == this.activeName && id === 0
        )
        return filterChartOption
      },
       // 获取label的容器options
      selectedContainerOption () {
        return this.$store.state.charts.chartsOption.filter(item => item.id=== 0)[0]
      },
      // 获取tab容器options id === 3
      tabContainerOption () {
        let  getTabsOp = this.$store.state.charts.chartsOption.filter(item => item.id===3)
        let  getNotDropTabsOp = getTabsOp.filter(item => item.drop == false)
        return getNotDropTabsOp
      },
      tabs () {
        return this.containerOption.feature.tabs
      },
      tabFiler () {
        return  this.tabs.filter(tab => !tab.drop)
      },
      tabsIsShow() {
      return this.tabContainerOption[0].feature.tabs.filter(item => item.drop === false)
      },
      tabId() {
        return `tab_${this.index}`
      },
      tabsLength () {
        return this.tabs.filter(item => !item.drop).length
      },
      showTab () {
        return this.containerOption.feature.showTabFlag
      },
    },
    watch: {
      tabsLength (value, olderValue) {
        if (value < olderValue) this.activeName = '0'
      },
      showTab (value) {
        let tabHeader = document.querySelector(`#${this.tabId}`).querySelector('.el-tabs__header')
        if (value) {
          tabHeader.style.display = 'block'
        } else {
          tabHeader.style.display = 'none'
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        let tabHeader = document.querySelector(`#${this.tabId}`).querySelector('.el-tabs__header')
        if (this.showTab) {
          tabHeader.style.display = 'block'
        } else {
          tabHeader.style.display = 'none'
        }

        // 先判断已经点击的tab的编号是否已存在，不存在则挨个请求当前tab下所有图表依次请求
        if (!this.hasClickedTabs.includes(this.activeName)) {
          this.inThisTabCharts.forEach(item => {
            // 判断已点击的id是否存在数组里，如果存在就不再调用请求接口的方法
            this.fetchTabData(item.i, true)
            // eventBus.$emit(`resizeOrMove_${item.i}`, item.i)
          })
        }
        this.hasClickedTabs.push(this.activeName)
      }),
      eventBus.$on(`tabControl_${this.index}`, (obj) => {
        if(Number(obj.value)  < Number(this.tabFiler.length)){
          const activeTab = document.querySelector(`#${this.tabId}`).querySelector('.el-tabs__active-bar')
          activeTab.style.transform = `translateX(${obj.value*140}px)`
          const tabIndexItem = this.tabFiler.filter((item, index) => index ===  parseInt(obj.value))
          let tabIndex = ''
          this.tabs.forEach((tab, index) => {
            if ( tab.id === tabIndexItem[0].id) {
              tabIndex =  index
            }
          })
          this.activeName = tabIndex.toString()
          this.tabClickHandle()
        }
      })
    },
    methods: {
      /**
       * before-leave: 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换
       * description: 在tab切换之前触发，如果查询还没结束就不让切换
       * 暂时不用这个方法
       */
      leaveTab () {
        if (!this.leaveFlag) return false
      },
      tabClickHandle () {
        this.$nextTick(() => {
          wait(0.25).then(() => {
            // 先判断已经点击的tab的编号是否已存在，不存在则挨个请求当前tab下所有图表依次请求
            if (!this.hasClickedTabs.includes(this.activeName)) {
              this.inThisTabCharts.forEach(item => {
                this.fetchTabData(item.i, true) // 第二个tab也是init
              })
              this.hasClickedTabs.push(this.activeName)
            }
            // tab切换的时候发射自适应的事件
            this.inThisTabCharts.forEach(item => {
              eventBus.$emit(`resizeOrMove_${item.i}`, item.i)
            })
          })
          // 以下的这个hack，我也很绝望
          // 这种bug出现的概率很低，具体看http://newjira.cnsuning.com/projects/TIGBS/issues/TIGBS-147?filter=allissues
          // 概率：0.0001%
          wait(0.4).then(() => {
            const a = document.querySelector(`.grid-item-${this.index}`)
            const width = a.style.width.split('p')[0]
            a.style.width = `${width - 1}px`
            wait(0.05).then(() => {
              a.style.width = `${width}px`
            })
          })
        })
      },
      /**
       * tabIndex: 选中tab的i
       * init: 是否是初始化
       */
      fetchTabData (tabIndex = 0, init = false) {
        const chartsOption = this.charts.chartsOption
        // 查询面板关联的containerIndex的集合
        let linkedContainerList = getInShowContainers(this.charts.chartsOption)
          .filter(item => item.id === 2)
          .reduce((all, item) => { return all.concat(item.feature.tableSelectedList) }, [])
        linkedContainerList = [...new Set(linkedContainerList)]
        // 需要手动关闭loading的图表
        const chartIdArr = [0]
        const index = tabIndex
        const chartId = chartsOption[tabIndex].feature.chartId
        // 查看时，如果这个容器被查询面板关联了，这里就不查询
        if (!(linkedContainerList.includes(index)&&this.$route.path === '/visual')) {
          // this.leaveFlag = false // 请求开始，不允许切换
          this.updateDataPre({
            index,
            rateType: 0,
            // loadingFalse: !chartIdArr.includes(chartId)
            // 由查询面板发起的初始化时 此时的查询数据仅用于图表切换时的备用 禁用loading动画
            // 图数据关系发起的初始化时 此时的查询将用于图标渲染 需要loading动画
            disableLoading: linkedContainerList.includes(index)
          }).then(data => {
            console.log('aa')
            // this.$store.commit('syncData', {
            //   index,
            //   data
            // })
            // 如果不被关联，才触发更新事件
            if (!linkedContainerList.includes(index)) {
              this.$nextTick(() => {
                // 只有再编辑才能走到这步，如果是再编辑，如果这个容器被查询面板关联了,只查数据，不发射updateData事件，查出的数据供切图时使用
                eventBus.$emit(`updateData_${index}`, {
                  index,
                  data: data,
                  init // 是否属于初始化
                })
                // this.leaveFlag = true // 请求结束，允许切换
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="less">
  @height: 40px;
  .tab{
    margin-left: 5px;
    .el-tabs__nav-wrap{
      &:after{
        height: 0;
      }
    }
    .el-tabs__header{
      margin: 10px 0 15px 0;
    }
    >.tab-title{
      margin-left: 16px;
      position: absolute;
      top: 0;
      left: -5px;
      height: @height;
      line-height: @height;
      font-size: 16px;
      font-weight: bold;
      width: 100%;
    }
    .tab-item-name{
      display: inline-block;
      min-width: 96px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
