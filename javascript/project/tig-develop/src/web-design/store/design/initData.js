const state = {
  keepActive: true, // 表格保持激活状态
  firstFlag: 0, // 是否是第一次进入的flag
  isShow: false,
  activeKey: 'dim',
  columnListUpdate: true, // hack需求 hansontable的列需要更新吗 对齐方式更新hansontable会有问题
  activeIcon: '', // 当前选中的icon
  renderColumns: [], // 自定义表格columns
  systemId: window.systemId, // 系统id
  selectedColumn: [], // 这里储存被选中的列，swicth右侧组件的时候默认清空 支持多列
  designState: 0, // 报表类型0 --> 二维表, 1 --> 交叉表
  reportName: '', // 报表名称
  columnList: [], // 列信息
  queryList: [], // 查询条件信息selectedColumn
  filterList: [], // 过滤条件信息
  dim: [], // 左侧所有交叉维度
  metric: [], // 左侧所有指标/度量
  timeDistance: 'day', // 用户选择的默认时间查询
  timeList: [], // 根据选择指标生成默认时间列表
  pageSize: 10, // 分页设置
  reportFunction: 0, // 0 固定报表 1维度切分
  exportData: false, // 数据导出
  style: { // 表格样式
    type: 'style1', // 默认风格类型
    custom: { // 自定义类型字段
      spacing: 6, // 单元格上下间距
      fontSize: 12, // 表格字体大小
      bgColor: '#fff' // 表格背景色
    }
  },
  freeze: { // 冻结表格头（是否冻结，冻结前N列）
    freezeBoolean: 0, // 1--> 是， 0-->否
    rowNumber: 0
  },
  /* align: { // 对齐方式1 --> verticalTop 2 --> verticalCenter 3 --> verticalbottom
    // 4 --> horizontalLeft 5 --> horizontalCenter 6 --> horizontalRight
    active: {
      vertical: 2, // 垂直方向123
      horizontal: 4 // 水平方向456
    }
  }, */
  formatter: {  // key --> 对应列i，value --> 具体配置信息
    active: {
      type: 0, // 数值类型：0 -->数值， 1 -->百分比
      decimals: 2, // 小数点位数
      thousands: false // 是否使用千位分割符
    }
  },
  sorter: [ // 排序
    {
      collapse: true,
      name: 'dasp_date',
      id: '', // id (dimId 或者 metricId)
      type: 0, // 0 维度， 1 指标
      value: 0 // 0是升序，1是降序
    }
  ],
  subtotal: { // 分类汇总
    mergeColumn: [], // 合并列
    total: [] // 合计
  },
  customColumn: [],
  drill: {
    selectedDrillItem: {
      name: '',
      id: '',
    },
    dirllRoad: {
      routeCode: '',
      routeNm: ''
    }
  },
  tableHeaderActive: false,
  tableHeader: [], // handsontable数据源
  cell: [], // handsontable被选中的单元格
  handsonMerge: [], // handsontable 合并单元格设置
  columnDim: { // 列维度
    dim: { // 选择的维度
      id: '',
      name: ''
    },
    dimValue: []
  },
  crossMetric: { // 交叉指标
    id: '',
    name: '',
    unitDefaultNm: ''
  },
  row: 1,
  leftToggle: false, // 左侧有没有收起
  rightToggle: false, // 右侧有没有收起
  realTableHeader: [] // 编辑进来的表格头
}
export default state
