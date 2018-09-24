import {getCrossDimList} from '../../utils/utils'
export default {
  data() {
    return {
      tableBorder: true, // 边框
      dimType: false, // 支持图片列的类型为3
      // showNumber: false, // 序号列
      isNumberDisabled: false, // 数值格式是否禁用
      compareData: [], // 趋势标记也要继承
      hideMenu: false,
      queryInfo: '', // 查询条件
      linkInfo: '', // 图表与图表之间的联动
      isQueryInfo: '', // 是不是查询面板最后一个过来的 排序有用
      selectName: '', //  选中的名称
      showMerage: 0, // 右击是展示合并
      numberTypePercent: false, // 百分比
      numberTypeThousands: false, // 千分位
      trend: false, // 趋势标记
      numberOrbar: '', //数值还是条形图
      alignFlag: 'left', // 单元格对齐方式
      hot: null,
      hover: false, // 悬浮内容
      selectedCell: [],
      colColor: '', // 列颜色配置
      numberType: '', // 数值格式
      columnList: [], // 列
      allData: [], // 所有数据 包含表头
      header: [], // 表头
      tablerenderer: [], // 渲染方法
      tableData: [], // 表格数据
      row: 1, // 表头行数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      isPage: true, // 是否分页
      showTotal: false, // 显示合计
      totalStore: 'before', // 合计位置
      jumpDeatil: false, // 显示详情
      total: 0, // 总页数
      handsonMerge: this.merge, // 合并的单元格
      allTotal: {}, // 所有列的合计值
      endIndex: 0, // 实际的结束分页位置
      startIndex: 0, // 实际的分页开始位置
      selectId: '', // 选中的列id
      selectType: '', // 选中的type类型
      isSort: false, // 是否排序
      // hideDimMetric: [], // 隐藏的维度或指标
      // renderList: [], // 能看见的表格 有隐藏列
      exportDialogVisible: false,
      exportTask: {
        exportName: '天工大数据',
        fileType: '1',
        tableHead: [],
      },
      formLabelWidth: '70px',
      exportBtnArr: [],
      exportTime: '',
      selectedTopList: [],
      selectedTopValue: '',
      isShowTop: false,
      setColWidth: false,
      colWidths:[],
      topList: [],
      trendAddPercent: false,
      selectDillDisabled: false, // 下钻是否禁用
      selectDill: false, // 下钻
      dillDim: '', // 自定义下钻维度
      dillAndLine: {
        showLine: false, // 是否开启下钻行数
        selectNumber: 5 // 下钻条数
      },
      selectHover: false, // 启用悬浮
      hoverMetricSelect: '', // 选择的悬浮表格的度量选择
      disabledHover: false, // 是否禁掉悬浮表格
      hoverDim: '', // 悬浮表格的维度
      hoverIndex: 0, // 悬浮第几行
      hoverId: '', // 悬浮上去的单元格
      hoverValue: '', // 悬浮的维值
      hoverTitle: '', // 悬浮的维值
      hoverTable: false, // 悬浮条形图显不显示
      hoverData: [], // hover请求回来的数据
      hoverDimLength: 0, // 悬浮维值的长度
      showHoverLine: false, // 悬浮条数
      selectHoverNumber: '', // 展示行数
      fontColor: '', // 字体颜色设置
      hoverAndLine: {
        showLine: false, // 是否开启悬浮行数
        selectNumber: 5
      },
      linkPointer: false, // 关联时候出现小手
      loading: false,
      isRanking: false, // 排名
      howDimValueShow: 'dim' // 维值如何显示
    }
  },
  computed: {
    styleConfig () {
      return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
    },
    // 悬浮维度的选择
    hoverDimList: {
      get () {
        return this.chartsOption[this.index].feature.styleConfig.hoverDimList
      },
      set () {}
    },
    totalPages () {
      return this.total % this.pageSize === 0 ? this.total / this.pageSize
        : parseInt(this.total / this.pageSize, 10) + 1
    },
    chartsOption () {
      return this.$store.state.charts.chartsOption
    },
    // 判断容器名字是否勾选
    chartNameToggle () {
      return this.chartsOption[this.index].nameToggle
    },
    hansontableProId () {
      const index = this.index
      return `tablePro${index}`
    },
    // 维度列
    dimList: {
      get() {
        return this.chartsOption[this.index].feature.dimList
      }
    },
    // 指标列
    metricList: {
      get() {
        return this.chartsOption[this.index].feature.metricList
      },
      set() {

      }
    },
    metricListFlat(){
      return this.chartsOption[this.index].feature.metricListFlat
    },
    // 预览标志
    previewToggle() {
      return this.$store.state.charts.previewToggle
    },
    sortList() {
      // 判断排序的指标是否被删除，如果被删除就及时从sortList中清掉
      let sortList = []
      let existMetricAndDim = ';' + (this.metricListFlat && this.metricListFlat.map(v =>  v.metricCode).join(';') || '') +
        ';' + (this.dimList && this.dimList.map(v =>  v.dimCode).join(';') || '') + ';'
      this.columnList.forEach(v => {
        let code = ';' + v.id + ';'
        if (existMetricAndDim.indexOf(code) !== -1) {
          if (v.sortType !== '') {
            sortList.push({
              attrCode: v.id,
              attrType: v.type,
              sortType: v.sortType === 'up'? 0 : 1
            })
          }
        }
      })
      return sortList
    },
    // 侧边栏所有指标
    dataSet() {
      return this.$store.state.charts.dataSet
    },
    showColumn() {
      let columnList = JSON.parse(JSON.stringify(this.columnList))
      if (!this.showNumber) {
        columnList = columnList.filter(item => item.id !== 'number')
      }
      if (!this.jumpDeatil) {
        columnList = columnList.filter(item => item.id !== 'operate')
      }
      if (!this.isRanking) {
        columnList = columnList.filter(item => item.id !== 'ranking')
      }
      return columnList
    },
    isDisDraggable () {
      return this.$route.path === '/visual' || this.$store.state.charts.previewToggle
    },
    crossAllList () {
      // if (!this.selectedOption || !this.selectedOption.feature || !this.selectedOption.feature.metricList) {
      //   return
      // }
      let crossAllList = getCrossDimList(this.$store.state.charts.dataSet, this.chartsOption[this.index].feature.metricList)
      return crossAllList
    },
    tableWrapperIndex () {
      return `tableWrapper${this.index}`
    },
    hoverTableIndex () {
      return `hoverTable${this.index}`
    },
    // 有没有指标属性
    // hasPropertyColumn () {
    //   let hasPropertyColumn = false
    //   this.metricListFlat.forEach(v => {
    //     if (v.metricCode.slice(-2).indexOf('_') !== -1) {
    //       hasPropertyColumn = true
    //     }
    //   })
    //   return hasPropertyColumn
    // },
    isInSight () {
      let href = window.location.href
      if (href.indexOf('&other=true') !== -1) {
        return true
      } else {
        return false
      }
    },
    // 公共维度
    dillDimList () {
      // 去除表格上的维度和时间维度
      const dillDimList = []
      const dimCodeList = ';' + this.dimList.map(item => {return item.dimCode}).join(';') + ';'
      if (this.crossAllList && this.crossAllList.length !== 0) {
        this.crossAllList.forEach(v => {
          const code = ';' + v.dimCode + ';'
          if (dimCodeList.indexOf(code) === -1 && v.dimCode !== 'dasp_date') {
            dillDimList.push(v)
          }
        })
      }
      return dillDimList
    },
    dillDimVuex () {
      return this.chartsOption[this.index].feature.styleConfig.dimDill
    },
    linkedContainers() {
      return this.chartsOption[this.index].linkedContainers
    },
    // 右侧面板的排序状态
    panelSortType() {
      return this.chartsOption[this.index].sortType
    }
  },
}
