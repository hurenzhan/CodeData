import {getCrossDimList} from '../../utils/utils'
import bus from '../../utils/eventBus'

export default {
  data() {
    return {
      tableBorder: true, // 边框
      dimListRadio: [], // 更多维度的单选
      moreDimSingle: false, // moredimradio
      dimType: false, // 支持图片列的类型为3
      isNumberDisabled: false, // 数值格式是否禁用
      showPicture: false, // 是否显示图片列
      hoverIndex: 0, // 悬浮第几行
      moreDim: false, // 启用更多维度功能
      moreMetric: false, // 启用更多指标的功能
      moreDimList: this.dimList, // 更多维度的选项
      moreMetricList: [], // 更多指标
      dimSelected: [], // 更多维度默认带过来的维度
      metricSelected: [], // 更多指标默认带过来的指标
      moreDimListSelect: [], // 选择的维度
      moreMetricListSelect: [], // 选择的指标
      moreDimListFilter: [], // 除了选中的的更多维度
      moreDimSingleSelect: '', // 启用单选选择的
      moreDimSingleCode: '',// 启用单选选择的code
      mergeOrSplit: 'merge', // 右击出来合并还是拆分
      compareData: [], // 趋势标记也要继承
      splitMetricList: [], // 当前拆分的指标列
      hideMenu: false,
      queryInfo: '', // 查询条件
      linkInfo: '', // 图表与图表之间的联动
      isQueryInfo: '', // 是不是查询面板最后一个过来的 排序有用
      selectName: '', //  选中的名称
      showMerage: 0, // 右击是展示合并
      numberTypePercent: false, // 百分比
      numberTypeThousands: false, // 千分位
      modelRoute: '', // 选择的下钻路径
      isSingle: false, // 是不是单一单元格
      dimValue: {name: '', id: ''}, // 右击选择的维度 下钻时使用
      // metricSelect: [], // 维度拆分选择的指标
      // metricSelectList: [], // lable in value
      trend: false, // 趋势标记
      numberOrbar: '', //数值还是条形图
      alignFlag: 'left', // 单元格对齐方式
      hot: null,
      hover: false, // 悬浮内容
      selectedCell: [],
      colColor: '', // 列颜色配置
      numberType: '', // 数值格式
      dillList: [], // 下钻路径
      selectRoute: {}, // 选择的下钻对象
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
      jumpDeatil: false, // 显示详情
      total: 0, // 总页数
      isInputNumber: false, // 是否突出显示
      inputNumber: 0, // 突出显示多少行
      handsonMerge: [], // 合并的单元格
      allTotal: {}, // 所有列的合计值
      allMax: {}, // 当前列的最大值
      endIndex: 0, // 实际的结束分页位置
      startIndex: 0, // 实际的分页开始位置
      selectId: '', // 选中的列id
      selectType: '', // 选中的type类型
      isSort: false, // 是否排序
      dimListValue: [], //指标按列维度拆分数据
      dimListValueSelect: [], //指标按列维度拆分 已选中
      dimListValueSelectLable: [], //指标按列维度拆分 已选中带上指标
      dimSelect: "", // 选择的维度
      keyword:'', //搜索指标按列维度拆分 关键字
      superUrl: false, // 超链接跳转
      hoverDimList: [], // 悬浮维度的选择
      // hoverMetricList: [], // hover上去的指标,
      hoverBar: [], // hover上去哪一列显示条形图
      hoverBarSelect: '', // v-model hoverbar
      hoverValue: '', // 悬浮的维值
      hoverTable: false, // 悬浮条形图显不显示
      hoverId: '', // 悬浮上去的单元格
      eventClient: '', // 存鼠标的状态e
      hoverData: [], // hover请求回来的数据
      selectHover: false, // 启用悬浮
      disabledHover: false, // 是否禁掉悬浮表格
      selectDill: false, // 下钻选择
      showLine: false,//是否开启下钻行数
      selectNumber: 5,//下钻路径
      selectDillDisabled: false, // 下钻是否禁用
      hoverMetricSelect: [], // 选择的悬浮表格的度量选择
      hoverDim: '', // 悬浮表格的维度
      hideDimMetric: [], // 隐藏的维度或指标
      renderList: [], // 能看见的表格 有隐藏列
      isProportion: false, // 启用占比
      trendAddPercent: false, // 趋势标记带增长率
      freeze: {
        isFreeze: false,
        freezeLine: 0,
        freezeCol: 0
      },
      dimLabelArr:[],
      exportDialogVisible: false,
      exportTask: {
        exportName:'天工大数据',
        fileType: '1',
        tableHead:[],
      },
      formLabelWidth: '70px',
      exportBtnArr:[],
      exportTime:'',
      moreDimListChangeFlag: false,
      moreMetricListChangeFlag: false,
      dimAndMetricSmall: false, // 更多维度和更多指标小的时候两行
      fontColor: '', // 字体颜色设置
      precisePositioning: '', //精准定位
      isPrecisePositioning: false,
      precisePositioningWithNoResult: false,
      precisePositioningResult: [],
      precisePositioningPaginationData: [],
      precisePositioningCurrentPage: 1,
      precisePositioningPageSize: 10,
      precisePositioningShow: false,
      isRanking: false, // 是否排名
      howDimValueShow: 'dim' // 维值如何显示
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
    // 获取告警信息
    chartWarnData() {
      return this.chartsOption[this.index] && this.chartsOption[this.index].warnData || []
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
      if (!this.showNumber) {
        columnList = columnList.filter(item => item.id !== 'number')
      }
      if (!this.jumpDeatil) {
        columnList = columnList.filter(item => item.id !== 'operate')
      }
      if (!this.isRanking) {
        columnList = columnList.filter(item => item.id !== 'ranking')
      }
      let renderList = []
      const hideCodes = ';' + this.hideDimMetric.join(';') + ';'
      // 更多维度
      let dimCodeList = this.moreDimList.map(v => v.dimCode).filter(item => {
        const dimCode = ';' + item + ';'
        return hideCodes.indexOf(dimCode) === -1
      })
      // 更多指标
      let metricCodeList = this.moreMetricList.map(v => v.metricCode).filter(item => {
        const metricCode = ';' + item + ';'
        return hideCodes.indexOf(metricCode) === -1
      })
      let moreDimListCode = ';' + dimCodeList.join(';') + ';' + metricCodeList.join(';') + ';'
      const numberColumn = ['number', 'operate', 'ranking']
      columnList.forEach(v => {
        let code = ''
        if (v.id.indexOf('bar') === -1) {
          code = ';' + v.id + ';'
        } else {
          code = ';' + v.id.replace('bar', '') + ';'
        }
        if (moreDimListCode.indexOf(code) !== -1 || numberColumn.includes(v.id)) {
          renderList.push(v)
        }
      })
      return renderList
    },
    isDisDraggable () {
      return this.$route.path === '/visual' || this.$store.state.charts.previewToggle
    },
    selectedOption () {
      return this.chartsOption.filter(item => !item.drop && item.selected)[0]
    },
    crossAllList () {
      if (!this.selectedOption || !this.selectedOption.feature || !this.selectedOption.feature.metricList) {
        return
      }
      let crossAllList = getCrossDimList(this.$store.state.charts.dataSet, this.selectedOption.feature.metricList)
      return crossAllList
    },
    tableWrapperIndex() {
      return `tableWrapper${this.index}`
    },
    hoverTableIndex() {
      return `hoverTable${this.index}`
    },
    // 有没有指标属性
    // hasPropertyColumn() {
    //   let hasPropertyColumn = false
    //   this.metricListFlat.forEach(v => {
    //     if (v.metricCode.slice(-2).indexOf('_') !== -1) {
    //       hasPropertyColumn = true
    //     }
    //   })
    //   return hasPropertyColumn
    // },
    isInSight() {
      let href = window.location.href
      if (href.indexOf('&other=true') !== -1) {
        return true
      } else {
        return false
      }
    },
    isProduct() {
      let hasProduct = false, hasSupplier= false, isGoods = false
      if (this.moreDimList) {
        this.moreDimList.map((item, index)=>{
        if(item.dimName === '商品'){
          hasProduct = true
        }else if(item.dimName === '供应商'){
          hasSupplier = true
        }
        })
        if (this.selectId === 'PD_WD_0005') {
          isGoods = true
        }
        // 显示商品列
        if (!(hasProduct && hasSupplier)) {
          this.showPicture = false
        }
        // hideGoodsAndSupplier = this.hideDimMetric.some(v => v === ('PD_WD_0005' || 'PD_WD_0002'))
        return hasProduct && hasSupplier && isGoods
      }
    },
    // 请求带过去的隐藏列指标
    hideCodes() {
      const hideCodes = []
      if (this.hideDimMetric.length !== 0) {
        this.hideDimMetric.forEach(v => {
          this.metricListFlat.forEach(item => {
            if (v === item.metricCode) {
              hideCodes.push(v)
            }
          })
        })
      }
      return hideCodes
    },
    sortList() {
      // 判断排序的指标是否被删除，如果被删除就及时从sortList中清掉
      let sortList = []
      let existMetricAndDim = ';' + (this.moreMetricList && this.moreMetricList.map(v =>  v.metricCode).join(';') || '') +
        ';' + (this.moreDimList && this.moreDimList.map(v =>  v.dimCode).join(';') || '') + ';'
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
    columnMaxLengthObj() {
      let columnMaxLengthObj = {}, results = this.precisePositioningPaginationData
      if (results.length === 0) {
        this.precisePositioningWithNoResult = true
      }
      results.forEach(item => {
        for (let key in item) {
          if (item.hasOwnProperty(key)) {
            // 获取最大字符串长度
            if (columnMaxLengthObj[key] === undefined) columnMaxLengthObj[key] = 0
            let l1 = columnMaxLengthObj[key]
            let l2 = 0, len = 0, cnTest = 0
            if (item[key] !== '') {
              l2 = item[key].toString().length
              for (let i=0; i<l2; i++) {
                if (item[key].toString().charCodeAt(i) > 256) {
                  len += 2
                  cnTest++
                } else {
                  len ++
                }
              }
            }
            if (cnTest === l2 || l2 <= 3) {
              len = len + 2
            }
            // console.log(len)
            columnMaxLengthObj[key] = l1 > len ? l1 : len
          }
        }
      })
      return columnMaxLengthObj
    },
    columnMaxLengthSum() {
      let sum = 0, columnMaxLengthObj = this.columnMaxLengthObj
      if (columnMaxLengthObj !== null) {
        for (let key in columnMaxLengthObj) {
          if (columnMaxLengthObj.hasOwnProperty(key)) sum += columnMaxLengthObj[key]
        }
      }
      return sum
    },
    getMyAutoCompleteRef() {
      return `myAutoComplete${this.index}`
    },
    // 更多维度下拉的重命名
    dimListAlias() {
      const dimListAlias = JSON.parse(JSON.stringify(this.dimList))
      dimListAlias.forEach(v => {
        // 维度别名的应用
        const dimAlias = this.getAliasByDimCode(v.dimCode)
        v.dimName = dimAlias === false ? v.dimName : dimAlias
      })
      return dimListAlias
    },
    // 更多维度单选的重命名
    dimListRadioAlias() {
      let dimListRadioAlias = JSON.parse(JSON.stringify(this.dimListRadio))
      dimListRadioAlias.forEach(v => {
        // 维度别名的应用
        const dimAlias = this.getAliasByDimCode(v.dimCode)
        v.dimName = dimAlias === false ? v.dimName : dimAlias
      })
      if (this.moreDimSingle) {
        this.moreDimSingleSelect = dimListRadioAlias.filter(v => v.dimCode === this.moreDimSingleCode)[0].dimName
      }
      // 名字改变之后保存一下 初始化问题
      this.$store.commit('saveConfig',  {
        index: this.index,
        name: 'moreDimSingleSelect',
        moreDimSingleSelect: dimListRadioAlias[0].dimName,
      })
      return dimListRadioAlias
    },
    // 右侧面板的排序状态
    panelSortType() {
      return this.chartsOption[this.index].sortType
    },
    // 右击排序选项是否显示
    sortShow() {
      let sdFlag = '0'
      // 明细指标不支持排序
      if (this.selectId !== '') {
        const selectColumn = this.metricListFlat.filter(v => v.metricCode === this.selectId)[0]
        sdFlag = selectColumn && selectColumn.sdFlag
        // console.log(sdFlag)
      }
      return this.showMerage === 1 &&
        this.selectId !=='number' &&
        this.selectId !=='operate' &&
        this.selectId !=='ranking' &&
        this.selectId.slice(-2) !== '_x' &&
        this.selectId.slice(-2) !== '_8' &&
        this.selectId.slice(-2) !== '_7' &&
        sdFlag !== '1'
    },
    // 右击对齐方式是否显示
    alignShow() {
      return this.showMerage === 1 &&
        this.selectId !== 'number' &&
        this.selectId !== 'operate' &&
        this.selectId !== 'ranking'
    },
    // 右击悬浮内容是否显示
    hoverShow() {
      return this.showMerage === 1 &&
        this.selectId !== 'operate' &&
        this.selectId !== 'number' &&
        this.selectId !== 'ranking'
    }
  },
}
