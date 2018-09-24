// 每种类型的容器的class
// 标签
class ChartLabel {
  constructor () {
    this.showType = '2'
    this.styleType = '1'
    this.checkList = [] // 选中的指标属性
    this.showNumb = false // 整数
    this.filterDimValueFlag = false // 是否显示筛选维值
    this.selectedDimValue = [] // 选中的维值
    this.dimValueList = [] // 所有的维值
    this.filterData = [] // 筛选后请求接口获取的数据
  }
}
// 卡片
class Card {
  constructor () {
    this.cardType = '1'
    this.metricPro = 'momRate' // 选中的指标属性
    this.isShowTotal = true
    this.isShowTrend = false
    this.isShowLink = true
    this.linkList = []
    this.rankValue = '3'
    this.metricFlatSelect = ''
    this.rankOptions = [{
      value: '3',
      label: 'TOP3'
    }, {
      value: '5',
      label: 'TOP5'
    }, {
      value: '10',
      label: 'TOP10'
    }]
  }
}
// 表格
export class ChartTable {
  constructor () {
    this.columnList = [] // 表格列 存储了一些配置信息
    this.row = 1 // 表头几行
    this.pageSize = 10
    this.currentPage = 1
    this.header = [] // 表格头
    this.showTotal = false // 显示合计
    this.totalStore = 'before' // 合计位置
    this.showHeader = true // 显示表头
    this.showNumber = false // 显示序号
    this.isInputNumber = false
    this.inputNumber = '' // 突出显示前几行序号
    this.handsonMerge = [] // 合并单元格
    this.allTotal = {} // 合计值
    this.jumpDeatil = false // 显示详情
    this.selectRoute = '' // 保存下钻路径
    this.selectNumber = 5 // 保存下钻条数
    this.allMax = {} // 每一列的最大值
    // this.metricList = [] // 里面存着趋势标记 因为拆分之后的问题需要存起来
    this.moreDim = false // 启用更多维度
    this.moreDimList = [] // 更多维度
    this.dimSelected = [] // 更多维度选择的是什么 右侧面板初始化的是什么
    this.moreDimListSelect = [] // 更多维度选中的维度 表格选中的
    this.showPicture = false
    this.hoverMetricSelect = '' // 悬浮表格选中的指标
    this.hoverDim = '' // 悬浮表格的维度
    this.hoverBarSelect = '' // 悬浮的条形图
    this.hoverDimList = [] // 悬浮表格的维度
    // this.splitMetricList = [] // 拆分的指标
    // this.isSingleSplit = false // 是否是单维度指标
    // this.isManySplit = false // 是否是多指标拆分
    // this.dimValueListSplit = [] // 拆分的维值
    this.tableBorder = true // 边框有无
    this.moreDimSingle = false // 更多维度的单选
    this.moreDimSingleSelect = '' // 启用单选的选项
    this.isProportion = false // 是否启用占比
    this.hideDimMetric = [] // 隐藏的列
    this.moreMetricList = [] // 更多指标
    this.moreMetric = false // 更多指标
    this.moreMetricSelect = [] // 更多指标的选择 右侧面板
    this.moreMetricListSelect = [] // 更多指标的选择 表格自身的选择
    this.freeze = {
      isFreeze: false,
      freezeLine: 0,
      freezeCol: 0
    }
    this.isPage = true // 是否分页
    this.isExport = false // 是否启用导出
    this.trendAddPercent = false
    this.isRanking = false // 是否排名
  }
}

// 简单表
export class SimpleChartTable {
  constructor () {
    this.columnList = [] // 表格列 存储了一些配置信息
    this.pageSize = 10
    this.currentPage = 1
    this.header = [] // 表格头
    this.showTotal = false // 显示合计
    this.totalStore = 'before' // 合计位置
    this.hansonMerage = [] // 合并单元格
    this.allTotal = {} // 合计值
    this.jumpDeatil = false // 显示详情
    this.dimDill = [] // 下钻的路径状态
    this.dillAndLine = {
      showLine: false, // 是否开启下钻行数
      selectNumber: 5,//下钻条数
    }
    this.allMax = {} // 每一列的最大值
    this.metricList = [] // 里面存着趋势标记 因为拆分之后的问题需要存起来
    this.tableBorder = true // 边框有无
    this.trendAddPercent = false  //趋势标记带增长率
    this.isShowTop = false //是否显示TOP
    this.isPage = true // 是否分页
    this.isExport = false // 是否启用导出
    this.selectedTopList = [] // top几
    this.hoverMetricSelect = '', // 选择的悬浮表格的度量选择
    this.hoverDim = '', // 悬浮表格的维度
    this.hoverDimList = [] // 悬浮维度的选择
    this.hoverAndLine = {
      showLine: false, // 是否开启悬浮行数
      selectNumber: 5,//悬浮条数
    }
    this.isRanking = false // 是否排名
  }
}

export class CrossChartTable {
  constructor () {
    this.columnList = [] // 表格列 存储了一些配置信息
    this.row = 1 // 表头几行
    this.pageSize = 10
    this.currentPage = 1
    this.header = [] // 表格头
    this.showTotal = false // 显示合计
    this.totalStore = 'before' // 合计位置
    this.showHeader = true // 显示表头
    // this.showNumber = false // 显示序号
    // this.isInputNumber = false
    // this.inputNumber = '' // 突出显示前几行序号
    this.handsonMerge = [] // 合并单元格
    this.allTotal = {} // 合计值
    this.jumpDeatil = false // 显示详情
    this.metricList = [] // 里面存着趋势标记 因为拆分之后的问题需要存起来
    // this.dimSelected = [] // 更多维度选择的是什么 右侧面板初始化的是什么
    // this.moreDimListSelect = [] // 更多维度选中的维度
    this.splitMetricList = [] // 拆分的指标
    this.isSingleSplit = false // 是否是单维度指标
    this.isManySplit = false // 是否是多指标拆分
    this.isSplit = false // 是否是多指标拆分
    this.dimValueListSplit = [] // 拆分的维值
    this.tableBorder = true // 边框有无
    // this.moreDimSingle = false // 更多维度的单选
    // this.moreMetricList = [] // 更多指标
    // this.moreDimList = [] // 更多维度
    // this.moreMetric = false // 更多指标
    this.isProportion = false // 是否启用占比
    // this.moreMetricSelect = [] // 更多指标的选择
    // this.moreDimSingleSelect = '' // 启用单选的选项
    this.isExport = false // 是否启用导出
    this.isPage = true // 是否分页
    this.trendAddPercent = false
    this.splitInfo = {} //拆分信息
  }
}

// 图表容器的feature
class ChartFeature {
  constructor () {
    this.metricList = [] // 选中的指标
    this.metricListFlat = [] // 将指标的属性扁平化
    this.dimList = [] // 选中的维度
    this.chartId = 0 // 图表的类型,默认是0，为表格类型
    this.styleConfig = new ChartTable() // 样式配置,默认是表格
  }
}
// 文本容器的feature
class TextFeature {
  constructor () {
    this.title = '未命名'
    this.content = '' // 文本区域内容
    this.isShowTitle = true // 是否显示标题
  }
}
// 查询容器的feature
class SearchFeature {
  constructor () {
    this.textCategory = []          // 文本控件相关
    this.dateCategory = []          // 日期时间组件数组
    this.dateData = []              // 日期时间数据
    this.isPublicDim = false        // 维度筛选条件是否作用于全局图表 下拉组件相关
    this.dropDownCategory = []      // 下拉选条件组件数组
    this.dropDownData = []          // 后台返回下拉维度数组
    this.dropDownListTitle = ''     // 下拉维度条件组件标题
    this.DimCascade = []            // 设置级联控件相关
    this.cascadeIdArr = []          // 保存DimCascade中已选节点的唯一识别符
    this.periodData = []            // 周期选择控件相关
    this.dataMetricsCategory = []   // 数据指标条件组件数组
    this.dataMetricData = []        // 后台返回指标数据数组
    this.dataMetricListTitle = ''   // 数据指标条件组件标题
    this.tableSelectedList = []     // 已选择的关联图表名称数组
    this.relativeSearch = []        // 关联的查询面板
    this.updateCycle = []           // 实时更新控件相关
    this.title = '未命名'           // 查询面板标题
    this.isShowTitle = true         // 是否显示标题
    this.isCheckedYearCompare = false     // 是否启用对比
    this.isCheckedMonthCompare = false    // 是否启用环比
    this.yoyAndMomDate = {}
  }
}
// TAB
class Tab {
  constructor () {
    this.title = {
      value: '未命名',
      show: true
    }
    this.tabs = [
      {
        name: 'TAB1',
        id:1,
        drop: false
      },
      {
        name: 'TAB2',
        id: 2,
        drop: false
      }
    ]
    this.showTabFlag = true
  }
}
// iframe容器的feature
class Iframe {
  constructor(){
    this.title =  '未命名'          //iframe容器标题
    this.isShowTitle = true        //是否显示标题
    this.content = ''              //输入框内容
    this.iframeContent = ''        //iframe容器内容
  }
}
class Pie {
  defaultSetting () {
    return {
      labelStyle: '1',
      legendWidth: 120,
      tbRadius: 0.8,
      lfRadius: 0.82,
      legendHeight: 50,
      showrModel: '0',
      labelLine: true,
      radius: '0.82',
      pieAxisTitleHeight: 25,
      highLight: [],
      highLightData: [],
      pavedDisplay: false,
      legendPosition: 'right',
      operate: [],
      isNumTotal: false,
      grid: {
        left: '16',
        right: '16',
        top: '50',
        bottom: '16',
        containLabel: true
      },
      labelOption: [
        {
          value: '0',
          label: '标题，百分比',
          disabled: false
        },
        {
          value: '1',
          label: '标题'
        },
        {
          value: '2',
          label: '标题，值'
        },
        {
          value: '3',
          label: '标题，值(百分比)',
          disabled: false
        },
        {
          value: '4',
          label: '关闭'
        }
      ],
      data: [
      ],
      title: {
        show: false,
        text: '',
        left: 'center',
        bottom: 24,
        textStyle: {
          color: '#333',
          fontWeight: 'normal',
          fontSize: 14
        }
      },
      color: [
        "#F9C878",
        "#A3C2C7",
        "#3BDBDB",
        "#FFD9D3",
        "#FF9985",
        "#6A99AD",
        "#FFB185",
        "#CAE6F7",
        "#A3B7FF",
        "#F2BDE4",
        "#A3E8D4",
        "#6FDFB5",
        "#88BDA9",
        "#D2E071",
        "#EBF593",
        "#FFAAAF",
        "#FA8B9D",
        "#99F3FD",
        "#79BCFF",
        "#C4B9EB"
      ],
      label: {
        show: true,
        rotate: 30
      },
      tooltip: {
        show: true,
        confine:true,
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.7)',
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        formatter: params => {
          let name  = params.data.name
          name = name.indexOf('###')!==-1 ? name.replace('###','_') : name
          const str =
            '<div style="border-radius:2px; padding:5px;line-height:20px"><span style="border-radius:50%;width:8px;height:8px;display:inline-block;background:' +
            params.color +
            '"></span><span style="width:10px;height:10px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;padding-left:5px;padding-top:6px">' +
            name +
            '<span style="padding-left:10px">' +
            params.data.value +
            '</span>' +
            '</span>' +
            '<div style="padding-left:10px"><span style="display:inline-block">占比</span>' +
            '<span style="padding-left:10px">' +
            params.percent +
            '%</span></div></div>'
          return str
        },
        extraCssText:
          'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
      },
      legend: {
        show: false,
        orient: 'vertical',
        right: '16',
        // left: "80%",
        top: '24',
        bottom: '12',
        type: 'scroll',
        // itemGap: 20,
        // itemWidth: 12,
        // itemHeight: 12,
        width: 100,
        // padding:[60, 40, 10, 40],
        borderRadius: 0,
        data: [],
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 0,
        shadowBlur: 0,
        icon: 'rect',
        pageIconSize:[10,10],
        formatter: function (params) {
          if (params.indexOf('###') !== -1) {
            let dimName = params.split('###')[1]
            return dimName.length > 6
              ? dimName.substr(0, 6) + '...'
              : dimName
          } else {
            return params.length > 6
              ? params.substr(0, 6) + '...'
              : params
          }
          // return name.length > 11 ? name.substr(0, 10) + '...' : name
        },
        tooltip: {
          show: true,
          confine:true,
          textStyle: {
           color: '#fff',
           fontSize: 12
          },
          formatter: function (params) {
            let name  = params.name
            name = name.indexOf('###')!==-1 ? name.replace('###','_') : name
            const str =
              '<div style="border-radius:2px;padding:0 5px;font-size:12px;">' +
              name +
              '</div'
            return str
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          extraCssText:
            'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
        },
        textStyle: {
          color: '#333333',
          padding: [0, 0, 0, 5]
        }
      },
      series: [
      ]
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
  setLabel (index, params) {
    let name  = params.name
    name = name.indexOf('###')!==-1 ? name.replace('###','_') : name
    switch (index) {
      case '0':
        return name + ',  ' + params.percent + '%'
        break
      case '1':
        return name
        break
      case '2':
        return name + ',' + params.data.value
        break
      case '3':
        return (
          name +
          ',' +
          params.data.value +
          ',' +
          params.percent +
          '%'
        )
        break
      case '4':
        return ''
    }
  }
}
class Line {
  defaultSetting () {
    return {
      switchTable: false,
      charTitle: '请在右侧输入标题',
      isCharTitleShow: true,
      isXtoY: false,
      xName: '',
      yName: '',
      isTitle: false,                                               // 是否显示轴标题
      label: { show: false },
      isTimeSet: false,                                             // 是否启用自定义查询时间范围
      numberTime: 0,                                                // 自定义时间偏移量
      isValueSum: false,                                            // 是否启用累计数据
      positionName: 'top',
      data: [],
      operate: [],
      dataZoom: {
        type: 'slider',
        show: false,
        realtime: true,
        start: 0,
        end: 100,
        bottom: 25
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
          type: 'line'
        },
        confine:true,
        formatter: params => {
          let category = params[0].name.indexOf('###') !== -1 ? params[0].name.replace('###', '_') : params[0].name
          let html = ''
          html += '<div style="fontSize: 8px;padding: 0px 6px;">'
          html += `<div style="lineHeight: 20px">${category}</div>`
          html += '<ul style="listStyle: none;">'
          for (let i = 0; i < params.length; i++) {
            let list = params[i]
            if (list.value !== undefined) {
              html += `<li style="line-height: 20px">`;
              // html +=   `<span  style="color: ${list.color}" >•</span>`;
              html += `<span style="border-radius:50%;width:8px;height:8px;display:inline-block;background: ${list.color}"></span>`
              html += `<span style="margin:5px 15px 0px 7px">${
                list.seriesName
              }</span>`;
              html += `<span>${list.value}</span>`;
              html += "</li>";
            }
          }
          html += '</ul>'
          html += '</div>'
          return html
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        textStyle: {
         color: '#fff',
         fontSize: 12
        },
        extraCssText:
          'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
      },
      legend: {
        data: [],
        show: true,
        type: 'scroll',
        orient: 'horizontal',
        x: 'center',
        top: '0',
        padding: [11, 20],
        itemGap: 20,
        itemWidth: 12,
        itemHeight: 12,
        height: 50,
        tooltip: {
          show: true,
          confine:true,
          formatter: function (params) {
            const str =
              '<div style="border-radius:4px;padding:0 5px;font-size:12px;">' +
              params.name +
              '</div'
            return str
          },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          textStyle: {
           color: '#fff'
          },
          extraCssText:
            'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
        }
      },
      grid: {
        left: 16,
        right: 16,
        top: 50,
        bottom: 16,
        containLabel: true
      },
      xAxis: [
        {
          show: true,
          alignWithLabel: true, // 标签刻度对齐
          type: 'category',
          boundaryGap: true,
          nameLocation: 'end',
          nameTextStyle: {
            color: '#666666',
            fontWeight: 'normal',
            fontSize: 12
          },
          nameGap: 20,
          axisTick: {
            show: false,
            alignWithLabel: true // 标签刻度对齐,
          },
          axisLabel: {
            fontFamily: 'HelveticaNeue',
            fontSize: 12,
            lineHeight: 12,
            color: '#333333',
            show: true,
            // 自定义标签显示格式
            formatter: (params, index) => {
              if (params.indexOf('###') !== -1) {
                let dimName = params.split('###')[1]
                return dimName.length > 8
                  ? dimName.substr(0, 8) + '...'
                  : dimName
              } else {
                return params.length > 8
                  ? params.substr(0, 8) + '...'
                  : params
              }
            },
            // rotate: -30,
            // 不显示最小刻度标签
            // showMinLabel: false,
            // showMaxLabel: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: '#000000',
              opacity: 0.15
            }
          },
          data: []
        }
      ],
      yAxis: [
        {
          show: true,
          type: 'value',
          nameLocation: 'end',
          nameTextStyle: {
            color: '#666666',
            fontWeight: 'normal',
            fontSize: 12,
            lineHeight: 12
          },
          nameGap: 16,
          axisLine: {
            show: false,
            lineStyle: {
              width: 1,
              color: '#000000',
              opacity: 0.15
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            fontFamily: 'HelveticaNeue',
            fontSize: 12,
            color: '#333333',
            lineHeight: 20
            // showMaxLabel: false   // 隐藏数值轴最大刻度，防止横向时 最大刻度溢出
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [],
      color: [
        '#229DF0',
        '#00D8C7',
        '#AC96FB',
        '#5EB1FF',
        '#8B9EF7',
        '#E78A5F',
        '#F2AF16',
        '#FFE070',
        '#98C959',
        '#CBDB37',
        '#597EF7',
        '#39D4D4',
        '#CBDB37'
      ],
      dimensions: [{ dimId: 'year', dimName: '年' }],
      measures: [{ metricsCode: 'value', label: '值' }]
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}
class Bar {
  defaultSetting () {
    return {
      operate: [],
      searchKey: '',
      YAxisTitle: '',
      XAxisTitle: '',
      isShowLineChart: false,
      selectMetricList: [],
      showNumber: false,
      isShowTimeAxis: false,
      currentPage: 0,
      dimFilter: false,
      indexPave: false,
      stack: false,
      selectedDim: '',
      selectDimValue: [],
      dimValueNmList: [],
      timeAxis: false,
      doubleY: false,
      line: false,
      isGuideShow: false,
      legendPosition: 'top',
      axisTitle: false,
      dimValue: '',
      measureLineType: '0',
      crosswise: false,
      isMeasureLineShow: false,
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
        { value: 335, name: '测试1' },
        { value: 310, name: '测试2' },
        { value: 234, name: '测试3' },
        { value: 135, name: '测试4' },
        { value: 1548, name: '测试5' }
      ],
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        confine:true,
        axisPointer: {
          type: '',
          label: {
            formatter: params => {
              if (typeof params.value === 'string' && params.value.indexOf('###') > -1) {
                params.value = params.value.replace('###', '_')
              }
              return params.value
            }
          }
        },
        crossStyle: {
          opacity: 0
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        boxShadow: '0 2px 4px 0',
        extraCssText:
          'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px',
        formatter: params => {
          let category = params[0].name
          category = category.indexOf('###') > -1 ? category.replace('###', '_') : category
          let html = ''
          html += '<div style="fontSize: 8px;padding: 0px 6px;">'
          html += `<div style="lineHeight: 20px">${category}</div>`
          html += '<ul style="listStyle: none;">'
          for (let i = 0; i < params.length; i++) {
            let list = params[i]
            if (list.value !== undefined) {
            html += `<li style="line-height: 20px">`;
            // html +=   `<span  style="color: ${list.color}" >•</span>`;
            html += `<span style="border-radius:50%;width:8px;height:8px;display:inline-block;background: ${list.color}"></span>`
            html += `<span style="margin:5px 15px 0px 7px">${
              list.seriesName
            }</span>`;
            html += `<span>${list.value}</span>`;
            html += "</li>";
          }
          }
          html += '</ul>'
          html += '</div>'
          return html
        }
      },
      legend: {
        positionName: 'top',
        data: [],
        show: true,
        type: 'scroll',
        orient: 'horizontal',
        top: 0,
        padding: [16, 50],
        itemGap: 20,
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 0,
        shadowBlur: 0,
        icon: 'rect',
        tooltip: {
          show: true,
          confine:true,
          textStyle: {
           color: '#fff'
          },
          formatter: function (params) {
            const str =
              '<div style="border-radius:2px;padding:0 5px;font-size:12px;">' +
              params.name +
              '</div'
            return str
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          extraCssText:
            'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
        }
      },
      grid: {
        left: '16',
        right: '16',
        top: '50',
        bottom: '16',
        containLabel: true
      },
      xAxis: [
        {
          show: true,
          type: 'category',
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
          ]
        }
      ],
      yAxis: [
        {
          show: true,
          type: 'value',
          name: '轴标题',
          nameLocation: 'start'
        }
      ],
      series: [],
      color: [
        '#00B5E7',
        '#0CDFCE',
        '#F1CF83',
        '#8B9EF7',
        '#82BEFD',
        '#FDE689',
        '#CBBAF1',
        '#687DC0',
        '#C5CC85',
        '#F7B495'
      ]
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
    this.selectDimValue = []
    this.selectedDim = ''
  }
}
class ChinaMap {
  defaultSetting () {
    return {
      mapData: [],
      legendStore: 'top',
      adaptiveRadius: false,
      colorPick: true,
      adaptiveDrilling: true,
      metricCodeSelect: true,
      metricValue: '',
      resData: [],
      colorItems: [
        { add: '+', warn: '', start: '', end: '', color: '#3CA0FD' }
      ],
      myColors: [
        '#EC7D4A',
        '#FFBF00',
        '#3CA0FD',
        '#0FD2C2',
        '#8B9EF7',
        '#AC96FB',
        '#2FC25B',
        '#9FD160'
      ],
      label: {
        normal: {
          formatter: '{b}',
          position: 'right',
          show: true,
          color: '#666666'
        },
        emphasis: {
          show: false
        }
      },
      tooltip: {
        show: true,
        trigger: 'item',
        backgroundColor: 'rgba(50,50,50,0.7)',
        extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);',
        confine: true,
        textStyle: {
          fontFamily: 'PingFangSC',
          fontSize: '12px',
          color: '#fff',
          lineHeight: '32px'
        }
      },
      legend: {
        show: true,
        right: 'center',
        top: 24,
        orient: 'horizontal',
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 0,
        shadowBlur: 0,
        data: [],
        selectedMode: false
      },
      visualMap: {
        min: '',
        max: '',
        left: 16,
        bottom: 24,
        text: ['高', '低'],
        calculable: true,
        show: true,
        color: ['#2661A8', '#3AA0FF', '#C4EAFF']
      },
      geo: {
        map: 'china',
        z: 2,
        roam: true,
        scaleLimit: {
          min: 0.6,
          max: 2
        },
        label: {
          normal: {
            show: true
          },
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          // 地图背景色
          normal: {
            areaColor: '#E1E9F0',
            borderColor: '#fff'
          },
          emphasis: {
            areaColor: '#E1E9F0'
          }
        }
      },
      color: [],
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: [14.4, 19.8],
          symbolOffset: [0, '-80%'],
          zlevel: 6,
          data: []
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
          symbolSize: 5,
          itemStyle: {
            normal: {
              opacity: 0.5
            },
            emphasis: {
              label: {
                show: false
              }
            }
          },
          zlevel: 1
        },
        {
          type: 'map',
          map: 'china',
          scaleLimit: {
            min: 0.6,
            max: 2
          },
          showLegendSymbol: false,
          geoIndex: 0,
          data: []
        }
      ]
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}
// 关系图
class Relation {
  defaultSetting () {
    return {
      nodeTypeList: [],
      nodeNo: 0,
      data: {},
      metricNo: 0,
      nodeNum: 1,
      edgeNum: 1,
      gatherData: [],
      detailData: []
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}
// 词云图
class WordCloud {
  defaultSetting () {
    return {
      charTitle: '请在右侧输入标题',
      tooltip: {
        show: true,
        confine:true
      },
      handleData: [] // 存储处理过的数据
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}

// 散点图
class Scatter {
  defaultSetting () {
    return {
      charTitle: '请在右侧输入标题',
      operate: [],
      label: { show: false },
      tooltip: {
        trigger: 'axis',
        show: true,
        confine:true,
        axisPointer: {
          type: 'cross'
        },
        formatter: params => {
          let category = params[0].name
          let html = ''
          html += '<div style="fontSize: 8px;padding: 0px 6px;">'
          // html += `<div style="color: rgba(0,0,0,0.65);lineHeight: 20px">${category}</div>`;
          html += '<ul style="listStyle: none;">'
          for (let i = 0; i < params.length; i++) {
            let list = params[i]
            let value = params[i].value[2]
            html += `<li style="color: ${list.color};lineHeight: 20px">`
            html += '<span>•</span>'
            html += `<span style="margin:0px 15px 0px 7px">${
              list.seriesName
            }</span>`
            html += `<span>${value}</span>`
            html += '</li>'
          }
          html += '</ul>'
          html += '</div>'
          return html
        },
        backgroundColor: 'rgba(255, 255, 255, 1)',
        extraCssText:
          'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
      },
      legend: {
        positionName: 'top',
        data: [],
        show: true,
        type: 'scroll',
        orient: 'horizontal',
        x: 'center',
        top: '0',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 12,
          lineHeight: 12
        }
      },
      grid: {
        left: '24',
        right: '24',
        top: '50',
        bottom: '16',
        containLabel: true
      },
      xAxis: [
        {
          show: true,
          alignWithLabel: true, // 标签刻度对齐
          type: 'value',
          boundaryGap: true,
          nameLocation: 'end',
          nameTextStyle: {
            color: '#0090ff',
            fontWeight: 'normal'
          },
          axisTick: {
            show: false,
            alignWithLabel: true // 标签刻度对齐,
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            fontFamily: 'HelveticaNeue',
            fontSize: 12,
            color: '#333333',
            lineHeight: 20
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: '#000000',
              opacity: 0.15
            }
          },
          nameGap: 20
        }
      ],
      yAxis: [
        {
          show: true,
          type: 'value',
          nameLocation: 'end',
          nameTextStyle: {
            color: '#0090ff',
            fontWeight: 'normal'
          },
          nameGap: 10,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: '#000000',
              opacity: 0.15
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true
          },
          splitArea: {
            show: true
          },
          axisLabel: {
            fontFamily: 'HelveticaNeue',
            fontSize: 12,
            color: '#333333',
            lineHeight: 20
          },
          splitLine: {
            show: false
          }
        }
      ],
      dataZoom: [],
      series: [],
      color: [
        '#05B7E8',
        '#0CDFCE',
        '#AC96FB',
        '#5EB1FF',
        '#8B9EF7',
        '#E78A5F',
        '#F2AF16',
        '#FFE070',
        '#98C959',
        '#CBDB37',
        '#597EF7',
        '#39D4D4',
        '#CBDB37'
      ]
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}

class Radar {
  defaultSetting () {
    return {
      data: [],
      color: [
        '#AC96FB ',
        '#5EB1FF ',
        '#8B9EF7',
        '#E78A5F',
        '#F2AF16',
        '#FFE070',
        '#98C959',
        '#CBDB37',
        '#597EF7',
        '#39D4D4',
        '#CBDB37'
      ],
      tooltip: {
        show: true,
        confine:true,
        trigger: 'item',
        textStyle: {
          color: '#000'
        },
        formatter: params => {
          const tempArr = this.config.radar.indicator.map(val => val.text)
          let tempStr = tempArr
            .map((val, idx) => {
              return `<span style="padding-left:10px">${val}：${
                params.value[idx]
              }</span><br> `
            })
            .join('')
          const str = `<div style="border-radius:2px;padding:5px;color:${
            params.color
          }">
              <span style="border-radius:50%;width:6px;height:6px;display:inline-block;background:${
                params.color
              }"></span>
              <span style="width:10px;height:10px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;padding-left:5px;">
                ${params.data.name}
              </span>
              <div style="padding:5px;">${tempStr}</div>
            </div>`
          return str
        },
        backgroundColor: 'rgba(255, 255, 255, 1)',
        extraCssText:
          'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
      },
      legend: {
        positionName: 'right',
        show: true,
        orient: 'vertical',
        right: '15',
        top: '70',
        borderRadius: 0,
        data: [],
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 0,
        shadowBlur: 0,
        icon: 'rect',
        formatter: function (name) {
          return name.length > 11 ? name.substr(0, 10) + '...' : name
        },
        tooltip: {
          show: true,
          confine:true,
          formatter: function (params) {
            const str =
              '<div style="background:black;border-radius:4px;padding:5px;font-size:12px;color:#fff;opacity:0.5">' +
              params.name +
              '</div'
            return str
          }
        },
        textStyle: {
          color: '#333',
          padding: [0, 0, 0, 5]
        }
      },
      radar: {
        indicator: [],
        name: {
          textStyle: {
            color: '#666666',
            fontSize: 14
          }
        },
        splitNumber: 5,
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#666666'],
            type: 'solid',
            opacity: 0.2
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
          }
        },
        axisLine: {
          show: true
        },
        center: ['50%', '50%'],
        radius: '70%',
        triggerEvent: true
      },
      series: [],
      maxValue: 0
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}

// 仪表盘
class Gauge {
  defaultSetting () {
    return {
      charTitle: '请在右侧输入标题',
      initData: {
        gaugeModel: '0',
        colorType: '0',
        // 单色
        singelColor: '#51A6FF',
        // 自定义颜色
        customColor: [],
        splites: [{ start: 0, end: 1, beforeStart: 0, color: '#2DC99F' }],
        isLenged: true,
        isTooltip: true,
        min: null,
        max: null,
        targetValue: '',
        hasEdit: false,           // 刻度是否被用户修改过
        unit: '',
        tickType: false           // 控制面板标签类型
      },
      operate: [],
      label: { show: false },
      tooltip: {
        trigger: 'item',
        show: true,
        confine:true,
        formatter: params => {
          let html = ''
          html +=
            '<div style="fontSize: 8px;padding: 0px 6px;lineHeight: 20px">'
          html += `<span style="margin: 0 10px 0 10px">${params.name}</span>`
          // html += `<span>${params.value}</span>`
          html += '</div>'
          return html
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        textStyle: {
         color: '#fff'
        },
        extraCssText:
          'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px'
      },
      grid: {
        left: '24',
        right: '24',
        top: '50',
        bottom: '16',
        containLabel: true
      },
      series: [],
      color: ['#05B7E8', '#0CDFCE']
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}

// 气泡图
class Bubble {
  defaultSetting () {
    return {}
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}

// 漏斗图
class Funnel {
  defaultSetting () {
    return {
      showNumber: { show: true },
      showCompareTime: { show: false, disableCompareTime: true },
      showConvert: { show: false },
      showFloor: {
        show: false,
        floors: 2,
        nodeList: [{
          selectedOptions: [],
          options: []
        }, {
            selectedOptions: [],
            options: []
        }]
      },
      color: ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF'],
      compareColor: ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF'],
      handleData: [], // 本期数据
      compareHandleData: [], // 对比数据
      originData: [], // 原始数据
      queryDate: [] // 保存查询面板的时间
    }
  }
  constructor (option) {
    const defaultSetting = this.defaultSetting()
    this.config = Object.assign(defaultSetting, option)
  }
}

export default {
  ChartLabel,
  Card,
  ChartFeature,
  TextFeature,
  SearchFeature,
  Pie,
  ChinaMap,
  ChartTable,
  SimpleChartTable,
  CrossChartTable,
  Line,
  Bar,
  Tab,
  Iframe,
  Relation,
  WordCloud,
  Scatter,
  Radar,
  Gauge,
  Bubble,
  Funnel
}
