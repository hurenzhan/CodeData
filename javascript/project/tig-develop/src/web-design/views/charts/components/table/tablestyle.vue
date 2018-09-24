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
      <div class="row-style">
         <span>表头行数</span>
          <el-select
            size="small"
            v-model="row"
            class="select-style"
            :disabled="moreMetric || moreDim"
            placeholder="请选择"
            @change="Change('row', row)">
            <el-option
              v-for="item in rowOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </div>

      <div class="row-style hide-columns">
        <span >隐藏列</span>
        <el-select
          v-model="hideDimMetric"
          multiple
          collapse-tags
          size="small"
          :multiple-limit="hideColOption.length === 0 ? 0 : hideColOption.length -1"
          @visible-change="hideColChange($event, 'change')"
          @remove-tag="hideColChange($event, 'remove')"
          class="select-style"
          placeholder="请选择"
          :disabled="freeze.isFreeze || moreMetric  || moreDim">
          <el-option
            v-for="item in hideColOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="show-picture">
        <el-tooltip class="item" :disabled="isPictureColumn" effect="dark" content="需同时选中商品和供应商两个维度" placement="bottom-start">
        <el-checkbox
          v-model="showPicture"
          :disabled="!isPictureColumn"
          @change="Change('showPicture', showPicture)"></el-checkbox></el-tooltip>
          <span class="tablestyle-checkbox">显示商品列</span>
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
      <div class="show-header">
        <el-checkbox
          v-model="showHeader"
          @change="Change('showHeader', showHeader)"></el-checkbox>
          <span class="tablestyle-checkbox">显示表头</span>
      </div>
      <div class="show-number">
        <el-checkbox
          v-model="showNumber"
          :disabled="freeze.isFreeze"
          @change="Change('showNumber', showNumber)"></el-checkbox>
          <span class="tablestyle-checkbox">显示序号</span>
      </div>
      <div class="input-number">
        <el-checkbox
          v-model="isInputNumber"
          @change="ChangeInput"></el-checkbox>
        <span class="tablestyle-checkbox">突出前</span>
        <el-input
          size="mini"
          class="input-style"
          :disabled="!isInputNumber"
          v-model="inputNumber"
          @change="inputEnter"
          ></el-input>
        <span>行序号</span>
      </div>
      <div class="freeze">
        <el-checkbox
          v-model="freeze.isFreeze"
          :disabled="moreMetric || moreDim || hideDimMetric.length !==0"
          @change="ChangeFreeze"></el-checkbox>
        <span class="tablestyle-checkbox">锁定前</span>
        <el-input
          size="mini"
          class="input-style"
          v-model="freeze.freezeLine"
          :disabled="!freeze.isFreeze"
          @change="freezeEnter"
          ></el-input>
        <span>行前</span>
        <el-input
          size="mini"
          class="input-style"
          :disabled="!freeze.isFreeze"
          v-model="freeze.freezeCol"
          @change="freezeEnter"
          ></el-input>
        <span>列</span>
      </div>
      <div class="jump-detail">
        <el-checkbox
          v-model="jumpDeatil"
          @change="Change('jumpDeatil', jumpDeatil)"
          :disabled="freeze.isFreeze"
          ></el-checkbox>
          <span class="tablestyle-checkbox">显示详情</span>
      </div>

      <!-- 显示详情 -->
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
      <!-- 显示详情结束 -->

      <div class="table-border">
        <el-checkbox
          v-model="tableBorder"
          @change="Change('tableBorder', tableBorder)"></el-checkbox>
          <span class="tablestyle-checkbox">边框</span>
      </div>
      <div class="more-dim">
        <el-checkbox
          v-model="moreDim"
          @change="moreDimSelect"
          class="more-dim-label"
          :disabled="isMerage || freeze.isFreeze || hideDimMetric.length !== 0 || row !== 1"
          >
        </el-checkbox>
        <span>更多维度</span>
        <el-select
          v-model="dimListMore"
          multiple
          size="small"
          collapse-tags
          @change="moreChange($event,'dimList')"
          @visible-change="dimListMoreSure($event, 'change')"
          @remove-tag="dimListMoreSure($event, 'remove')"
          class="more-dim-select"
          :disabled="isMerage || !moreDim || moreDimSingle"
          placeholder="请选择">
          <el-option
            v-for="item in dimList"
            :key="item.dimCode"
            :label="item.dimName"
            :value="item.dimCode">
          </el-option>
        </el-select>
        <el-checkbox
          v-model="moreDimSingle"
          @change="startSingleChange"
          class="dim-start-single"
          :disabled="isMerage || !moreDim || dimListMore.length === 0">
        </el-checkbox>
        <span>启用单选</span>
      </div>
      <!-- 更多指标 -->
      <div class="more-metric">
         <el-checkbox
          v-model="moreMetric"
          @change="moreMetricChange"
          :disabled="isMerage || metricListFlat.length === 1 || freeze.isFreeze ||
          hideDimMetric.length !== 0  || row !== 1">
        </el-checkbox>
        <span>更多指标</span>
        <el-select
          v-model="moreMetricSelect"
          size="small"
          multiple
          collapse-tags
          class="more-dim-select"
          @change="moreChange($event,'metricList')"
          @visible-change="dimMetricMoreSure($event, 'change')"
          @remove-tag="dimMetricMoreSure($event, 'remove')"
          :disabled="splitTable || isMerage || !moreMetric"
          placeholder="请选择">
          <el-option
            v-for="item in metricListFlat"
            :key="item.metricCode"
            :label="item.metricName"
            :value="item.metricCode">
          </el-option>
        </el-select>
      </div>
      <div class="is-proportion">
        <el-checkbox
          v-model="isProportion"
          @change="Change('isProportion', isProportion)">
        </el-checkbox>
        <span class="tablestyle-checkbox">启用占比</span>
      </div>
      <div class="is-proportion">
        <el-checkbox
          v-model="isExport"
          @change="Change('isExport', isExport)">
        </el-checkbox>
        <span class="tablestyle-checkbox">启用导出</span>
      </div>
      <div class="is-proportion">
        <el-checkbox
          v-model="isPrecisePositioning"
          @change="Change('isPrecisePositioning', isPrecisePositioning)">
        </el-checkbox>
        <span class="tablestyle-checkbox">启用精准定位</span>
      </div>
      <div class="is-proportion">
        <el-checkbox
          v-model="isRanking"
          :disabled="freeze.isFreeze"
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
        moreDimSingle: false, // 更多维度单选按钮平铺
        tableBorder: true,
        pageSize: 10, // 分页 默认10
        row: 1, // 表头行数
        showPicture: false, // 显示图片列
        showTotal: false, // 显示合计
        showHeader: true, // 显示表格头
        showNumber: false, // 显示序号
        isInputNumber: false,
        inputNumber: '',
        jumpDeatil: false, // 跳转详情
        dialogVisible: false, // 模态框
        moreDim: false, // 更多维度
        dimListMore: [], // 更多维度选择的维度
        moreMetric: false, // 更多指标
        moreMetricSelect: [], // 更多指标的选择
        totalStore:'before',//合计位置
        hideDimMetric: [],
        splitTable: false, // 是否拆分表格
        isMerage: false, // 是否有合并单元格
        radioDisabled: false, // 启用单选禁用
        isProportion: false, // 是否启用占比
        trendAddPercent: false,  //趋势标记带增长率
        isDetail: false, //是否启用跳转详情
        isExport: false,
        freeze: {
          isFreeze: false,
          freezeLine: 0,
          freezeCol: 0
        },
        moreDimListChangeFlag: false,
        moreMetricListChangeFlag: false,
        hideDimMetricChangeFlag: false,
        isPrecisePositioning: false, //是否启用精准定位
        isRanking: false // 启用排名
      }
    },
    computed: {
      chartsOption() {
        return this.$store.state.charts.chartsOption
      },
      // 隐藏列的下拉选择
      hideColOption() {
        const option = []
        if (this.chartsOption[this.index].feature.styleConfig.moreDimList) {
          this.chartsOption[this.index].feature.styleConfig.moreDimList.map(item => {
            const i = {
              label: item.dimName,
              value: item.dimCode
            }
            option.push(i)
          })
        }
        if (this.chartsOption[this.index].feature.styleConfig.moreMetricList) {
          this.chartsOption[this.index].feature.styleConfig.moreMetricList.map(item => {
            const j = {
              label: item.metricName,
              value: item.metricCode
            }
            option.push(j)
          })
        }
        return option
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
      isPictureColumn() {
        let hasProduct = false, hasSupplier= false, isPictureColumn = true, hideGoodsAndSupplier = false
        const moreDimList = this.chartsOption[this.index].feature.styleConfig.moreDimList
        if (moreDimList) {
          moreDimList.map((item,index)=>{
            if(item.dimName === '商品'){
              hasProduct = true
            }else if(item.dimName === '供应商'){
              hasSupplier = true
            }
          })
          hideGoodsAndSupplier = this.hideDimMetric.some(v => v === 'PD_WD_0005')
          isPictureColumn = hasProduct && hasSupplier && !hideGoodsAndSupplier
          if (!isPictureColumn) {
            this.showPicture = false
            this.$store.commit('saveConfig', {
              index: this.index,
              name: 'showPicture',
              showPicture: false
            })
          }
          return isPictureColumn
        }
      },
      // 已锁定报表列表
      lockedReportList() {
        return this.chartsOption[this.index].lockedReportList
      },
      // 获取当前选择的报表版本
      reportVersionList() {
        return this.chartsOption[this.index].reportVersionList || []
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
          return this.chartsOption[this.index].detailSelectedReport || ''
        }
      },
      // 已选择报表的版本
      selectReportVersion: {
        set (value) {
          this.$store.commit('saveDetailSelectedReportVersion', {index: this.index, selectedReportVersion: value})
        },
        get () {
          return this.chartsOption[this.index].detailSelectedReportVersion || ''
        }
      },
      // 已设置的过滤条件
      detailFilter: {
        set (value) {
          this.$store.commit('saveDetailFilter', {index: this.index, detailFilter: value})
        },
        get () {
          return this.chartsOption[this.index].detailFilter || ''
        }
      },
      reportSearchKey () {
        return this.chartsOption[this.index].reportSearchKey
      },
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
      // 合并单元格
      bus.$on(`hansonmerage`, (deliver) => {
        if (this.index === deliver.index) {
          this.isMerage = deliver.value
        }
      })
      // 更多维度里没有选项 启用单选disabled
      // bus.$on(`disabledRadio`, (deliver) => {
      //   if (this.index === deliver.index) {
      //     this.radioDisabled = deliver.value
      //   }
      // })
      // 冻结的配置
      bus.$on(`disabledFreeze`, (deliver) => {
        if (this.index === deliver.index) {
          this.freeze = deliver.value
          // console.log(this.freeze)
          this.$store.commit('saveConfig', {
            index: this.index,
            name: 'freeze',
            freeze: this.freeze
          })
        }
      })
      // 接受清空配置
      bus.$on(`tableClearSettings`, (deliver) => {
        if (this.index === deliver.index) {
          this.clearState()
        }
      })
    },
    methods: {
      // 清空状态
      clearState() {
        // 初始化清空置为false
        Object.keys(this._data).forEach(v => {
          if (this._data[v] !== undefined && this._data[v] !== '' && typeof this._data[v] === 'boolean') {
            this[v] = false
          }
        })
        this.pageSize = 10
        this.row = 1
        this.showHeader = true
        this.inputNumber = ''
        this.tableBorder = true
        this.dimListMore = []
        this.moreMetricSelect = []
        this.totalStore = 'before'
        this.hideDim = []
        this.hideMetric = []
        this.hideDimMetric = []
        this.freeze = {
          isFreeze: false,
          freezeLine: 0,
          freezeCol: 0
        }
      },
      initState(styleConfig) {
        this.splitTable = false
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
        this.moreDimSingle = styleConfig.moreDimSingle || false
        if (this.moreDimSingle) {
          this.moreDim = true
        }
        // 表格是否拆分 拆分和很多功能互斥
        if (styleConfig.isSingleSplit || styleConfig.isManySplit) {
          this.splitTable = true
        }
        // 有合并单元格 和很多功能也互斥
        if (styleConfig.handsonMerge && styleConfig.handsonMerge.length !== 0) {
          this.isMerage = true
        }
        // 兼容之前报表 隐藏列只有指标
        const stringMetricFlat =  ';' + (this.metricListFlat.map(v => v.metricCode).join(';')) + ';'
        styleConfig.hideDimMetric.forEach(v => {
          let code = ';' + v +';'
          if (stringMetricFlat.indexOf(code) === -1) {
            this.hideDimMetric.push(v)
          }
        })
      },
      Change(name, value) {
        if (name === 'jumpDeatil') {
          this.clearReport()
          if (!value) {

          } else {
            this.getReportList(this.reportSearchKey) // 如果选中就去请求接口
          }
        }
        this.$store.commit('changeOption', {
          index: this.index,
          name: name,
          value: value
        })
      },

      showDetail(name, value) {
        // if(this.detailFilter){
        //   this.getReportDimlist(name, value)
        // }else{
          this.$store.commit('changeOption', {
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
      inputEnter() {
        if (!this.isInputNumber) {
          return
        }
        this.ChangeInput()
      },
      // 突出显示多少行
      ChangeInput() {
        const reg = /^[0-9]+$/
        if (!reg.test(Number(this.inputNumber)) || Number(this.inputNumber) > 6) {
          this.inputNumber = 3
        }
        this.$store.commit('changeOption', {
          index: this.index,
          name: 'input',
          input: {
            isInputNumber: this.isInputNumber,
            inputNumber: this.inputNumber
          }
        })
      },
      // 冻结
      ChangeFreeze() {
        if (!this.freeze.isFreeze) {
          this.freeze = {
            isFreeze: false,
            freezeLine: 0,
            freezeCol: 0
          }
        }
        this.$store.commit('changeOption', {
          index: this.index,
          name: 'freeze',
          value: this.freeze
        })
      },
      freezeEnter() {
        if (!this.freeze.isFreeze) {
          return
        }
        this.ChangeFreeze()
      },
      moreChange(value,type){
        type === 'dimList' ? this.moreDimlistChangeFlag = true : this.moreMetriclistChangeFlag = true
      },
      moreDimSelect() {
        this.moreDimlistChangeFlag = undefined
        this.dimListMoreSure(false)
      },
      dimListMoreSure(val, type="change") {
        if (type === 'change') {
          if (!val) {
            if (this.moreDim) {
            } else {
              this.dimListMore = []
            }
            if(this.moreDimlistChangeFlag !== false){
              this.$store.commit('changeOption', {
                index: this.index,
                name: 'moreDim',
                value: {
                  'moreDim': this.moreDim,
                  'dimSelected': this.dimListMore
                }
              })
            }
          }else{
            this.moreDimlistChangeFlag = false
          }
        } else if (type === 'remove') {
          if (this.moreDim) {
          } else {
            this.dimListMore = []
          }
          this.$store.commit('changeOption', {
            index: this.index,
            name: 'moreDim',
            value: {
              'moreDim': this.moreDim,
              'dimSelected': this.dimListMore
            }
          })
        }

        // 处理更多维度的单选
        if (!val) {
          this.moreDimSingle = false
        }
      },
      startSingleChange(val) {
        this.$store.commit('changeOption', {
          index: this.index,
          name: 'moreDimSingle',
          value: val
        })
      },
      // 更多指标
      moreMetricChange(val) {
        this.moreMetriclistChangeFlag = undefined
        this.dimMetricMoreSure(false)
      },
      // 更多指标
      dimMetricMoreSure(val, type="change") {
        let code = []
        this.metricListFlat.length !== 0 && code.push(this.metricListFlat[0].metricCode)
        if (type === 'change') {
          if (!val) {
            if (this.moreMetric) {
              if (this.moreMetricSelect && this.moreMetricSelect.length === 0) {
                this.moreMetricSelect = code
              }
            } else {
              this.moreMetricSelect = []
            }
            if(this.moreMetriclistChangeFlag !== false){
              this.$store.commit('changeOption', {
                index: this.index,
                name: 'moreMetric',
                value: {
                  'moreMetric': this.moreMetric,
                  'moreMetricSelect': this.moreMetricSelect
                }
              })
            }
          }else{
            this.moreMetriclistChangeFlag = false
          }
        } else if (type === 'remove') {
          if (this.moreMetric) {
            if (this.moreMetricSelect && this.moreMetricSelect.length === 0) {
              this.moreMetricSelect = code
            }
          } else {
            this.moreMetricSelect = []
          }
          this.$store.commit('changeOption', {
            index: this.index,
            name: 'moreMetric',
            value: {
              'moreMetric': this.moreMetric,
              'moreMetricSelect': this.moreMetricSelect
            }
          })
        }
      },
      moreMetricSelectChange(val) {
        if (val && val.length === 0) {
          this.metricListFlat.length !== 0 && this.moreMetricSelect.push(this.metricListFlat[0].metricCode)
        }
      },
      hideDimMetricSort(hideDimMetric) {
        const dimListHide = []
        const metricHide = []
        this.dimList.forEach(v => {
          hideDimMetric.forEach(item => {
            if (v.dimCode === item) {
              dimListHide.push(v.dimCode)
            }
          })
        })
        this.metricListFlat.forEach(v => {
          hideDimMetric.forEach(item => {
            if (v.metricCode === item) {
              metricHide.push(v.metricCode)
            }
          })
        })
        let hideDimMetricList = dimListHide.concat(metricHide).join('')
        return hideDimMetricList
      },
      // 隐藏列
      hideColChange(val, type = 'change') {
        if (type === 'change') {
          if (!val) {
            const hideDimMetric = this.chartsOption[this.index].feature.styleConfig.hideDimMetric
            if (this.hideDimMetricSort(this.hideDimMetric) !== this.hideDimMetricSort(hideDimMetric)) {
              this.$store.commit('changeOption', {
                index: this.index,
                name: 'hideDimMetric',
                value: this.hideDimMetric 
              })
            }
          }
        } else if (type === 'remove') {
          this.$store.commit('changeOption', {
            index: this.index,
            name: 'hideDimMetric',
            value: this.hideDimMetric
          })
        }
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
      // bus.$off(`splitTableRow${this.index}`)
      bus.$off(`hansonmerage`)
      // bus.$off(`splitTable${this.index}`)
      // bus.$off(`disabledRadio`)
      bus.$off(`disabledFreeze`)
      bus.$off(`tableClearSettings`)
      // bus.$off(`isProduct${this.index}`)
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
      .freeze,
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
      .freeze{
        .input-style{
          width: 25px;
          padding-left: 1px;
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
