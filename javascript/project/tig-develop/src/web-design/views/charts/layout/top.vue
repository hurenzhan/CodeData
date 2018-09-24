<template>
  <div class="dashboard-top" v-if="$route.path!=='/visual'">
    <span class="dashboard-top-logo">
      <span class="back" @click="back"><img src="/static/charts/images/back.png" alt=""></span>
      <span class="logo"><img src="/static/charts/images/tiangonglogo.svg" alt=""></span>
    </span>
    <span class="name">{{charts.name}}</span>
    <div class="actions" v-if="$route.path!=='/visual'">
      <span @click="preview">
        <template v-if="!$store.state.charts.previewToggle">
          <img src="/static/charts/images/yulan.svg" alt="">
          <span>预览</span>
        </template>
        <template v-else>
          <img src="/static/charts/images/yulanout.svg" alt="">
          <span>退出预览</span>
        </template>
      </span>
      <span @click.stop="add"><img src="/static/charts/images/save.svg" alt=""> 保存</span>
    </div>
    <div v-else></div>
    <close-dialog
      :styles="dialogStyle"
      :closeFlag="closeFlag"
      :closable="closable"
      :maskClosable="maskClosable"
      @cancelDialog="cancelDialog"
      @saveDialog="saveDialog"
      @unsaveDialog="unsaveDialog"
      ></close-dialog>
  </div>
</template>

<script>
  import api from '../../../api/charts'
  import closeDialog from './closeDialog'
  import {emitResizeToAll, tick, getInShowContainers} from '../utils/utils'
  import search from '../../../api/search'
  import bus from '../utils/eventBus'
  import validationBySave from '../utils/validationBySave'
  import { containerInit } from '../static/configData'
  export default {
    name: 'DashboardTop',
    mixins: [search],
    components: {
      closeDialog
    },
    data () {
      return {
        reportId: '',
        versionId: '',
        dialogStyle: {
          top: '200px'
        },
        closeFlag: false, // 是否关闭对话框
        closable: false, // 点击esc是否能保存
        maskClosable: false // 是否能点击遮罩层关闭
      }
    },
    computed: {
      charts () {
        return this.$store.state.charts
      }
    },
    mounted () {
      this.$nextTick(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
        }, 200)
      })
      bus.$on('afterGetReportInfo', this.initData)
    },
    beforeDestroyed () {
      bus.$off('afterGetReportInfo')
    },
    methods: {
      preview () {
        this.$store.commit('preview', !this.$store.state.charts.previewToggle)
        // 预览时发射拖放事件
        this.$nextTick(() => {
          setTimeout(() => {
            emitResizeToAll(this.charts.chartsOption)
          }, 200)
        })
      },
      back () {
        this.closeFlag = true
      },
      // 取消
      cancelDialog () {
        this.closeFlag = false
      },
      // 保存报表
      async saveDialog () {
        if (await this.add()) {
          window.close()
        }
      },
      // 不保存报表
      unsaveDialog () {
        window.close()
      },
      // 保存(新增or更新)
      async add () {
        // 保存配置前需要通知关系图去保存下数据
        // 只有关系图需要这么做，所以没有用index标识
        bus.$emit('beforeSave')
        await tick()
        const errorArr = validationBySave(this.charts)
        if (errorArr.length) {
          this.$notify({
            title: '保存失败',
            dangerouslyUseHTMLString: true,
            message: errorArr.map(({title, msg}) => `<p><span>${title}</span>:<span>${msg}</span></p>`).join(''),
            position: 'bottom-right'
          })
          return
        }
        if (this.checkSave()) {
          this.$message({
            message: '请等待数据请求结束后 再保存',
            type: 'warning'
          })
          return
        }
        const reportName = this.charts.name
        const reportType = 3
        let reportContent = JSON.parse(JSON.stringify(this.charts))
        // 对chartsOption里的data进行过滤，data不需要保存
        reportContent.chartsOption.forEach(item => {
          if (item.id === 0) {
            item.data = []
            return item
          }
        })
        // 添加字段:gridWrapperHeight(即图表展示区的高度)
        // reportContent.gridWrapperHeight = document.querySelector('.vue-grid-layout').scrollHeight
        let documentHeight = document.querySelector('.vue-grid-layout').scrollHeight
        reportContent.gridWrapperHeight = this.calculateHeight(documentHeight)
        reportContent = JSON.stringify(reportContent)
        const {reportId, versionId} = this.$route.query
        let res = {}
        if (this.$route.path === '/dashboard') {
          res = this.reportId
            ? await api.update({reportName, reportType, reportContent, reportId: this.reportId, versionId: this.versionId})
            : await api.add({reportName, reportType, reportContent})
        } else {
          res = await api.update({reportName, reportType, reportContent, reportId, versionId})
        }
        if (res.statusCode === '0') {
          if (res.data) {
            this.reportId = res.data.reportId
            this.versionId = res.data.versionId
          }
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          return true
        }
        return false
      },
      // 由于查询面板的折叠功能 需要重新计算整个图表的最小高度
      calculateHeight (scrollHeight) {
        let paddingT = 16                                               // 上padding 24px
        let paddingB = 8                                                // 下padding 16px
        let RH = containerInit.rowHeight
        let margin = containerInit.margin[0] 
        // 获取非tab下且未删除的查询面板
        let allSearch = this.charts.chartsOption.filter(item => {
          if (item.id === 2 && item.activeTabIndex === undefined && !item.drop) {
            return true
          } else {
            return false
          }
        })
        allSearch.forEach(item => {
          let tabHeight = item.nameToggle ? 40: 0
          let contentHeight = item.h * (margin + RH) - paddingT - paddingB - margin - tabHeight
          if (contentHeight > 40) {
            scrollHeight = scrollHeight - (contentHeight - 40)
          }
        })
        // console.log(scrollHeight)
        return scrollHeight
      },
      // 保存前检查是否存在图表正在请求数据
      checkSave () {
        let loadingChart = this.charts.chartsOption.filter(item => {
          let inDropTab = false
          let isChart = parseInt(item.id) === 0 ? true : false
          if (item.tabContainerIndex !== undefined) {
            this.charts.chartsOption[item.tabContainerIndex].drop ? inDropTab = true : inDropTab = false
          }
          // 返回未删除的还在加载中的图表
          return item.loading && !item.drop && !inDropTab && isChart
        })
        return loadingChart.length ? true : false
      },
      // 查看时或编辑时的初始化
      initData () {
        const pathArr = ['/visual', '/edit']
        const currentPath = this.$route.path
        const tableChartId = [0, 13, 15]
        if (pathArr.includes(currentPath)) {
          // todo: 这里可以将dataPicker里的update方法做成混合
          // todo: 针对需要手动关闭的图表，请求时加loadingFalse
          const chartsOption = getInShowContainers(this.charts.chartsOption).filter(item => item.id === 0 && item.tabContainerIndex === undefined)
          // 查询面板关联的containerIndex的集合
          let linkedContainerList = getInShowContainers(this.charts.chartsOption)
            .filter(item => item.id === 2)
            .reduce((all, item) => { return all.concat(item.feature.tableSelectedList) }, [])
          linkedContainerList = [...new Set(linkedContainerList)]
          for (let i = 0; i < chartsOption.length; i++) {
            const index = chartsOption[i].i
            const chartId = chartsOption[i].feature.chartId
            // 查看时，如果这个容器被查询面板关联了，这里就不查询
            // console.log('asd')
            if (linkedContainerList.includes(index) && currentPath === '/visual') continue
            // 如果是查看模式 且当前为表格 就不发请求 并且没有被查询面板关联
            if (currentPath === '/visual' && tableChartId.includes(chartId)) {
              if (!linkedContainerList.includes(index)) {
                this.$nextTick(() => {
                   bus.$emit(`updateData_${index}`, {
                    index,
                    init: true // 是否属于初始化
                  })
                })               
              }
              continue
            }
            this.updateDataPre({
              index,
              rateType: 0,
              // 由查询面板发起的初始化时 此时的查询数据仅用于图表切换时的备用 禁用loading动画
              // 图数据关系发起的初始化时 此时的查询将用于图标渲染 需要loading动画
              disableLoading: linkedContainerList.includes(index)
            }).then(data => {
              this.$store.commit('syncData', {
                index,
                data
              })
              this.$nextTick(() => {
                // 只有再编辑才能走到这步，如果是再编辑，如果这个容器被查询面板关联了,只查数据，不发射updateData事件，查出的数据供切图时使用
                if (!linkedContainerList.includes(index)) {
                  bus.$emit(`updateData_${index}`, {
                    index,
                    data: data,
                    init: true // 是否属于初始化
                  })
                }
              })
            })
          }
        }
      }
    }
  }
</script>

<style lang="less">
  .dashboard-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    >.dashboard-top-logo{
      height: 50px;
      display: flex;
      align-items: center;
      span{
        display: flex;
        justify-content: center;
        align-items: center;
        &.back{
          width: 40px;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s ease;
          &:hover{
            background-color: rgba(0, 0, 0, 0.2);
          }
          img{
            width: 12px;
          }
        }
        &.logo{
          margin-left: 16px;
        }
      }
    }
    .name{
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }
    >.actions {
      color: #fff;
      >span{
        margin-right: 16px;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        img{
          position: relative;
          top: 3px;
          margin-right: 6px;
        }
      }
    }
  }
</style>
