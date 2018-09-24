<template>
  <div class="table-style-wrapper my-slide-bar">
    <div class="table-style">
      <div class="style-title">
        <span class="point"></span>
        布局
      </div>
      <div class="page-style">
        <span>分页属性</span>
        <el-select
          size="small"
          v-model="pageSize"
          class="select-style"
          placeholder="请选择"
          @change="Change('pageSize', pageSize)">
          <el-option
            v-for="item in pageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="show-total">
        <el-tooltip class="item" :disabled="!isComparable" effect="dark" content="指标可比不支持合计" placement="bottom-start">
        <el-checkbox
          v-model="showTotal"
          :disabled="isComparable"
          @change="Change('showTotal', showTotal)"></el-checkbox></el-tooltip>
          <span class="tablestyle-checkbox">合计</span>
          <div class="row row-p">
            <el-radio v-model="totalStore" label="before" class="before-tolal" @change="Change('totalStore', totalStore)" :disabled="!showTotal">前置</el-radio>
            <el-radio v-model="totalStore" label="after" class="after-tolal" @change="Change('totalStore', totalStore)" :disabled="!showTotal">后置</el-radio>
          </div>
      </div>
      
      <!-- 边框 -->
      <div class="table-border">
        <el-checkbox
          v-model="tableBorder"
          @change="Change('tableBorder', tableBorder)"></el-checkbox>
          <span class="tablestyle-checkbox">边框</span>
      </div>
      <!-- 趋势标记带增长率 -->
      <div class="table-border">
        <el-checkbox
          v-model="trendAddPercent"
          @change="Change('trendAddPercent', trendAddPercent)"></el-checkbox>
          <span class="tablestyle-checkbox">趋势标记带增长率</span>
      </div>

      <!-- 显示TOP -->
      <div class="more-dim">
        <el-checkbox
          v-model="isShowTop"
          @change="Change('isShowTop', isShowTop)"
          class="more-dim-label">
        </el-checkbox>
        <span>显示TOP</span>
        <div style="margin: 6px 0; margin-left: 24px;" v-show="isShowTop">
          <el-checkbox-group v-model="selectedTopList" @change="topSelect">
            <div v-for="item in topList">
              <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>

      <!-- 显示详情 -->
      <div class="jump-detail">
        <el-checkbox
          v-model="jumpDeatil"
          @change="Change('jumpDeatil', jumpDeatil)"
          ></el-checkbox>
          <span class="tablestyle-checkbox">显示详情</span>
      </div>
      <div class="detailConfigWrap" v-if="jumpDeatil">
        <div class="row">
          <el-select
            v-model="selectedReport"
            remote
            size="small"
            filterable
            placeholder="请选择报表名"
            clearable
            :disabled="!jumpDeatil"
            :remote-method="handleItemChange"
            @clear="clearReport"
            >
            <el-option
              v-for="item in lockedReportList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="row">
          <el-select
            v-model="selectReportVersion"
            placeholder="请选择版本号"
            :disabled="!selectedReport"
            size="small"
            >
            <el-option
              v-for="item in reportVersionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="row">
          <div>传递参数（可选）</div>
          <el-select
            v-model="detailFilter"
            size="small"
            clearable
            :disabled="!selectReportVersion || !selectedReport"
            style="margin-top: 8px;"
            placeholder="请选择">
            <el-option
              v-for="item in dimList"
              :key="item.dimCode"
              :label="item.dimName"
              :value="item.dimCode">
            </el-option>
          </el-select>
        </div>
        <div class="row" style="text-align: center;">
          <el-button 
            type="primary"
            :disabled="!(selectedReport && selectReportVersion)" 
            @click="showDetail('jumpDeatil',jumpDeatil)" 
            size="mini">确定</el-button>
        </div>
      </div>

      <!-- 启用导出 -->
      <div class="is-proportion">
        <el-checkbox
          v-model="isExport"
          @change="Change('isExport', isExport)">
        </el-checkbox>
        <span class="tablestyle-checkbox">启用导出</span>   
      </div>
      <div class="is-proportion">
        <el-checkbox
          v-model="isRanking"
          @change="Change('isRanking', isRanking)">
        </el-checkbox>
        <span class="tablestyle-checkbox">启用排名</span>
      </div>
    </div>   
  </div>
</template>

<script>
  import bus from '../../utils/eventBus'
  import api from '@/web-design/api/report'
  import apiCharts from '@/web-design/api/charts'
  export default {
    name: 'table-style',
    components: {
    },
    props: {
      index: {
        default: 0
      }
    },
    data() {
      return {
        pageOptions: [{
          value: 10,
          label: '10条'
        }, {
          value: 20,
          label: '20条'
        }, {
          value: 30,
          label: '30条'
        }, {
          value: 0,
          label: '不分页'
        }],
        rowOptions: [{
          value: 1,
          label: '1'
        }, {
          value: 2,
          label: '2'
        }, {
          value: 3,
          label: '3'
        }],
        tableBorder: true,
        pageSize: 10, // 分页 默认10
        row: 1, // 表头行数
        showTotal: false, // 显示合计
        jumpDeatil: false, // 跳转详情
        dialogVisible: false, // 模态框
        totalStore:'before',//合计位置
        isMerage: false, // 是否有合并单元格
        isDetail: false, //是否启用跳转详情
        isExport: false,
        trendAddPercent: false, //趋势标记带增长率
        topList: [
          {label:'TOP5',value:5},
          {label:'TOP10',value:10},
          {label:'TOP15',value:15}
        ],
        selectedTopList: [],
        isShowTop: false,
        setColWidth: false,
        isRanking: false, // 启用排名
      }
    },
    computed: {
      chartsOption() {
        return this.$store.state.charts.chartsOption
      },
      dimList() {
        return this.chartsOption[this.index].feature.dimList
      },
      metricListFlat(){
        return this.chartsOption[this.index].feature.metricListFlat
      },
      isComparable(){
        return this.metricListFlat.filter(v=>v.metricCode.slice(-2)==='_x').length > 0 ? true : false
      },
      // 选中的容器
      selectedOption () {
        return this.$store.state.charts.chartsOption.filter(item => !item.drop && item.selected)[0]
      },
      // jumpDeatil: {
      //   set(value) {
      //   // 如果取消选中，就及时清空列表里已选中的报表
      //     if (!value) {
      //       this.clearReport()
      //     } else {
      //       console.log(value, '++++')
      //       this.getReportList(this.reportSearchKey) // 如果选中就去请求接口
      //     }
      //     // this.$store.commit('showMoreData', { index: this.index, value})

      //   },
      //   get() {
      //     return this.selectedOption.jumpDeatil || false
      //   }
      // },
      // 已锁定报表列表
      lockedReportList() {
        return this.selectedOption.lockedReportList
      },
      // 获取当前选择的报表版本
      reportVersionList() {
        return this.selectedOption.reportVersionList || []
      },
      // 已选择的报表
      selectedReport: {
        set (value) {
          this.$store.commit('saveDetailSelectedReport', {index: this.index, selectedReport: value})
          const reportChildren = this.lockedReportList.filter(item => item.value === value)
          reportChildren.length !== 0 && this.$store.commit('getReportVersionList', { index: this.index, reportVersionList: reportChildren[0].children })
          this.$store.commit('saveDetailSelectedReportVersion', {index: this.index, selectedReportVersion: '1.0'}) // 清空报表版本默认1.0版本
        },
        get () {
          return this.selectedOption.detailSelectedReport || ''
        }
      },
      // 已选择报表的版本
      selectReportVersion: {
        set (value) {
          this.$store.commit('saveDetailSelectedReportVersion', {index: this.index, selectedReportVersion: value})
        },
        get () {
          return this.selectedOption.detailSelectedReportVersion || ''
        }
      },
      // 已设置的过滤条件
      detailFilter: {
        set (value) {
          this.$store.commit('saveDetailFilter', {index: this.index, detailFilter: value})
        },
        get () {
          return this.selectedOption.detailFilter || ''
        }
      },
      reportSearchKey () {
        return this.selectedOption.reportSearchKey
      }
    },
    watch: {
      index(val, oldValue) {
        // 切换图表时
        const styleConfig = this.chartsOption[this.index].feature.styleConfig
        this.initState(styleConfig)
        if (this.jumpDeatil) {
          this.getReportList(this.reportSearchKey)
        }   
      }
    },
    mounted() {
      const styleConfig = this.chartsOption[this.index].feature.styleConfig
      this.initState(styleConfig)
      // 接受清空配置
      bus.$on(`simpleTableClearSettings`, (deliver) => {
        if (deliver.index === this.index) {
          // debugger
          this.clearState()
        }
      })
      if (this.jumpDeatil) {
        this.getReportList(this.reportSearchKey)
      }
    },
    methods: {
      // 清空状态
      clearState() {
        this.showTotal = false
        this.totalStore = 'before'
      },
      initState(styleConfig) {
        this.isMerage = false
        this.radioDisabled = false
        this.clearState()
        // 初始化
        Object.keys(this._data).forEach(v => {
          if (v in styleConfig) {
            if (styleConfig[v] !== undefined) {
              this[v] = styleConfig[v]
            }
          }
        })
        // 有关拆分和合并单元格的初始化       
        this.dimListMore = styleConfig.dimSelected || []
        // 有合并单元格 和很多功能也互斥
        if (styleConfig.hansonMerage && styleConfig.hansonMerage.length !== 0) {
          this.isMerage = true
        }
      },
      Change(name, value) {
        if (name === 'jumpDeatil') {
          this.clearReport()
          if (!value) {
            
          } else {
            this.getReportList(this.reportSearchKey) // 如果选中就去请求接口
          }
        }
        this.$store.commit('changeSimpleOption', {
          index: this.index,
          name: name,
          value: value
        })
        if (name === 'isShowTop' && !value) {
          this.selectedTopList = []
          this.$store.commit('changeSimpleOption', {
            index: this.index,
            name: 'selectedTopList',
            value: []
          })
        }
      },

      showDetail(name, value) {
        // if(this.detailFilter){
        //   this.getReportDimlist(name, value)
        // }else{
          this.$store.commit('changeSimpleOption', {
            index: this.index,
            name: name,
            value: value
          })
          this.$message({
            message: '详情链接已生成',
            type: 'success'
          });
        // }
      },
        
      // 子报表筛选过滤暂时隐藏
      // async getReportDimlist(name ,value){
      //   // console.log('getReportDimlist')
      //   const res = await apiCharts.getReportInfo({
      //     reportId: this.selectedReport,
      //     versionId: this.selectedReportVersion || '1.0'
      //   })
      //   const reportContent = JSON.parse(res.data.reportContent).chartsOption
      //   let detailReportDimList = []
      //   console.log('reportContent',reportContent)
      //   reportContent.map(item =>{
      //     if(item.feature.dimList){
      //       item.feature.dimList.map(subItem => {
      //         detailReportDimList.push(subItem.dimCode)
      //       })
      //     }
      //   })
      //   console.log('detailReportDimList',detailReportDimList)
      //   if(Array.indexOf(detailReportDimList, this.detailFilter) >= 0){
      //     this.$store.commit('changeSimpleOption', {
      //       index: this.index,
      //       name: name,
      //       value: value
      //     })
      //   }else{
      //     this.$message({
      //       message: '设置链接的子报表不适合设置详情链接',
      //       type: 'warning'
      //     });
      //     this.$store.commit('changeSimpleOption', {
      //       index: this.index,
      //       name: name,
      //       value: value
      //     })
      //     this.detailFilter = ''
      //     this.$store.commit('saveDetailFilter', {index: this.index, detailFilter: ''})
      //   }
      // },
      topSelect() {
        this.$store.commit('changeSimpleOption', {
          index: this.index,
          name: 'selectedTopList',
          value: this.selectedTopList
        })
      },
      startSingleChange(val) {
        this.$store.commit('changeSimpleOption', {
          index: this.index,
          name: 'moreDimSingle',
          value: val
        })
      },
      // 报表详情配置开始
      handleItemChange(value) {
        this.getReportList(value)
        this.$store.commit('saveReportSearchKey', {index: this.index, reportSearchKey: value})
      },
      // 获取报表列表
      getReportList (searchKey = '') {
        this.$nextTick(async () => {
          let res = await api.getLockedReportList({ params: { searchKey }})
          let reportList = []
          if (res && res.data) {
            res.data.forEach((item, index) => {
              let reportVersion = item.reportVersion.map(report => ({
                value: report,
                label: report
              }))
              reportList.push({value: item.reportId, label: item.reportName,  children: reportVersion})
            })
          }

          this.$store.commit('getLockedReportList', {index: this.index, reportList})
          const reportChildren = this.lockedReportList && this.lockedReportList.filter(item => item.value === this.selectedReport) || []
          reportChildren.length !== 0 && this.$store.commit('getReportVersionList', { index: this.index, reportVersionList: reportChildren[0].children })
        })
      },
      clearReport() {
        this.getReportList()
        this.$store.commit('saveDetailSelectedReport', {index: this.index, selectedReport: ''})
        this.$store.commit('saveDetailSelectedReportVersion', {index: this.index, selectedReportVersion: '1.0'})
        this.$store.commit('saveDetailFilter', {index: this.index, detailFilter: ''})
        this.$store.commit('saveReportSearchKey', {index: this.index, reportSearchKey: ''})
      },
      // 报表详情配置结束
    },
    beforeDestroy() {
      bus.$off(`simpleTableClearSettings`)
    }
  }
</script>
<style scoped lang="less">  
  .el-collapse{
    width: 175px;
    display: inline-block;
    padding-left: 10px;
    border: none;
  }
  .table-style-wrapper{
    height: calc(100vh - 300px);
    overflow: auto;
    .table-style{

      font-size: 14px;
      .style-title {
        color: #666666;
        line-height: 20px;
        border-top: 1px solid #E8EAEB;
        padding: 10px 0px 0 0;
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
      .select-style{
        width: 116px;
      }
      .before-tolal {
        width: 10px;
        margin-top: 10px;
        margin-left: 28px;
        margin-right: 30px;
      }
      .after-tolal {
        width: 10px;
        margin-top: 10px;
      }
      .page-style,
      .row-style,
      .show-picture{
        padding-top: 8px;
        padding-left: 25px;
      }
      .show-total,
      .show-header,
      .show-number,
      .input-number,
      .jump-detail,
      .table-border,
      .more-metric,
      .show-picture,
      .is-proportion,
      .more-dim{
        span{
          padding-left: 6px;
        }
        .more-dim-select{
          display: block;
          width: 174px;
          padding-left: 23px;
          margin-top: 8px;
        }
        padding-left: 25px;
        padding-top: 8px;
      }
      .input-number{
        .input-style{
          width: 50px;
          padding-left: 5px;
          height: 23px;
        }
      }
      .dim-start-single{
        padding-left: 24px;
        padding-top: 8px;
      }
    }
  }
  
</style>
<style lang="less">
  .hide-columns .el-select{
    width: 135px !important;
  }
  .hide-columns .el-select__tags span,.more-dim-select .el-select__tags span{
    .el-tag--mini:first-child{
      .el-select__tags-text{
        display: inline-block;
        width: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }
</style>
