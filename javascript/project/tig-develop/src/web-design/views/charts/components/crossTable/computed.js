import {getCrossDimList} from '../../utils/utils'
import bus from '../../utils/eventBus'

export default {
  data() {
    return {
      tableBorder: true, // 边框
      // dimListRadio: [], // 更多维度的单选
      // moreDimSingle: false, // moredimradio
      dimType: false, // 支持图片列的类型为3
      isSingleSplit: false, // 是否拆分 拆分调用的columnList不一致 多维度单指标
      isManySplit: false, // 是否拆分 拆分调用的columnList不一致 多维度多指标
      isNumberDisabled: false, // 数值格式是否禁用
      // showPicture: false, // 是否显示图片列
      // hoverIndex: 0, // 悬浮第几行
      moreDim: false, // 启用更多维度功能
      moreMetric: false, // 启用更多指标的功能
      moreDimList: this.dimList, // 更多维度的选项
      moreMetricList: [], // 更多指标
      // dimSelected: [], // 更多维度默认带过来的维度
      metricSelected: [], // 更多指标默认带过来的指标
      moreDimListSelect: [], // 选择的维度
      moreMetricListSelect: [], // 选择的指标
      moreDimListFilter: [], // 除了选中的的更多维度
      moreDimSingleSelect: '', // 启用单选选择的
      mergeOrSplit: 'merge', // 右击出来合并还是拆分
      compareData: [], // 趋势标记也要继承
      splitMetricList: [], // 当前拆分的指标列
      queryInfo: '', // 查询条件
      linkInfo: '', // 图表与图表之间的联动
      isQueryInfo: '', // 是不是查询面板最后一个过来的 排序有用
      selectName: '', //  选中的名称
      showMerage: 0, // 右击是展示合并
      numberTypePercent: false, // 百分比
      numberTypeThousands: true, // 千分位
      // modelRoute: '', // 选择的下钻路径
      isSingle: false, // 是不是单一单元格
      dimListSplit: [], // 维值拆分去掉拆分的维度
      dimValueListSplit: [], // 维值
      dimValue: {name: '', id: ''}, // 右击选择的维度 下钻时使用
      metricSelect: [], // 维度拆分选择的指标
      metricSelectList: [], // lable in value
      trend: false, // 趋势标记
      numberOrbar: '', //数值还是条形图
      alignFlag: 'left', // 单元格对齐方式
      hot: null,
      // hover: false, // 悬浮内容
      selectedCell: [],
      colColor: '', // 列颜色配置
      numberType: '', // 数值格式
      // dillList: [], // 下钻路径
      // selectRoute: {}, // 选择的下钻对象
      columnList: [], // 列
      allData: [], // 所有数据 包含表头
      header: [], // 表头
      tablerenderer: [], // 渲染方法
      tableData: [], // 表格数据
      row: 1, // 表头行数
      showHeader: true, // 是否显示表头
      showNumber: false, // 是否显示序号
      currentPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      isPage: true, // 是否分页
      showTotal: false, // 显示合计
      totalStore: 'before', // 合计位置
      // jumpDeatil: false, // 显示详情
      total: 0, // 总页数
      // isInputNumber: false, // 是否突出显示
      // inputNumber: 0, // 突出显示多少行
      handsonMerge: [], // 合并的单元格
      allTotal: {}, // 所有列的合计值
      // allMax: {}, // 当前列的最大值
      endIndex: 0, // 实际的结束分页位置
      startIndex: 0, // 实际的分页开始位置
      selectId: '', // 选中的列id
      selectType: '', // 选中的type类型
      isSort: false, // 是否排序
      dimListValue: [], //指标按列维度拆分数据
      dimListValueSelect: [], //指标按列维度拆分 已选中
      dimListValueSelectLable: [], //指标按列维度拆分 已选中带上指标
      // dimSelect: "", // 选择的维度
      // keyword:'', //搜索指标按列维度拆分 关键字
      superUrl: false, // 超链接跳转
      // eventClient: '', // 存鼠标的状态e
      // hideDimMetric: [], // 隐藏的维度或指标
      // isProportion: false, // 启用占比
      dimSplitSwitch: false,
      trendAddPercent: false, // 趋势标记带增长率
      // dimLabelArr:[],
      exportDialogVisible: false,
      exportTask: {
        exportName:'天工大数据',
        fileType: '1',
        tableHead:[],
      },
      formLabelWidth: '70px',
      exportBtnArr:[],
      exportTime:'',
      fontColor: '', // 列颜色
      showGrowth: false, //增长趋势
      isSplit: false, //是否拆分
      howDimValueShow: 'dim'
    }
  },
  computed: {
    totalPages() {
      return this.total % this.pageSize === 0 ? this.total / this.pageSize
        : parseInt(this.total / this.pageSize, 10) + 1
    },
    chartsOption() {
      return this.$store.state.charts.chartsOption
    },
    styleConfig() {
      return this.$store.state.charts.chartsOption[this.index].feature.styleConfig
    },
    // 判断容器名字是否勾选
    chartNameToggle() {
      return this.chartsOption[this.index].nameToggle
    },
    hansontableProId() {
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
    // 侧边栏所有指标
    dataSet() {
      return this.$store.state.charts.dataSet
    },
    showColumn() {
      let columnList = JSON.parse(JSON.stringify(this.columnList))
      // if (!this.showNumber) {
      //   columnList = columnList.filter(item => item.id !== 'number')
      // }
      // if (!this.jumpDeatil) {
      //   columnList = columnList.filter(item => item.id !== 'operate')
      // }
      return columnList
    },
    isDisDraggable () {
      return this.$route.path === '/visual' || this.$store.state.charts.previewToggle
    },
    selectedOption () {
      return this.chartsOption.filter(item => !item.drop && item.selected)[0]
    },
    // 交叉维度 去除选中的状态
    crossDimList () {
      if (!this.selectedOption || !this.selectedOption.feature || !this.selectedOption.feature.metricList) {
        return
      }
      let crossDimListFilter = []
      let crossDimList = getCrossDimList(this.$store.state.charts.dataSet, this.selectedOption.feature.metricList)
      for (let i = 0; i < crossDimList.length; i += 1) {
        let isDimExist = false
        for (let j = 0; j < this.dimList.length; j += 1) {
          if (crossDimList[i].dimCode === this.dimList[j].dimCode) {
            isDimExist = true
            break
          } else {
            isDimExist = false
          }
        }
        if (!isDimExist) {
          crossDimListFilter.push(crossDimList[i])
        }
      }
      return crossDimListFilter
    },
    tableWrapperIndex() {
      return `tableWrapper${this.index}`
    },
    hoverTableIndex() {
      return `hoverTable${this.index}`
    },
    isInSight() {
      let href = window.location.href
      if (href.indexOf('&other=true') !== -1) {
        return true
      } else {
        return false
      }
    },
    // isProduct() {
    //   let hasProduct = false, hasSupplier= false, isGoods = false
    //   if (this.moreDimList) {
    //     this.moreDimList.map((item, index)=>{
    //     if(item.dimName === '商品'){
    //       hasProduct = true
    //     }else if(item.dimName === '供应商'){
    //       hasSupplier = true
    //     }
    //     })
    //     if (this.selectId === 'PD_WD_0005') {
    //       isGoods = true
    //     }
    //     // 显示商品列
    //     if (!(hasProduct && hasSupplier)) {
    //       this.showPicture = false
    //     }
    //     // console.log('aa')
    //     return hasProduct && hasSupplier && isGoods
    //   }
    // },
    // 请求带过去的隐藏列指标
    // hideCodes() {
    //   const hideCodes = []
    //   if (this.hideDimMetric.length !== 0) {
    //     this.hideDimMetric.forEach(v => {
    //       this.metricListFlat.forEach(item => {
    //         if (v === item.metricCode) {
    //           hideCodes.push(v)
    //         }
    //       })
    //     })
    //   }
    //   return hideCodes
    // },
    // 拆分信息
    splitInfo: {
      get() {
        return this.chartsOption[this.index].feature.styleConfig.splitInfo
      },
      set() {

      }
    }
  },
}
