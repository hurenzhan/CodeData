const state = {
  // 容器的所有配置
  chartsOption: [],
  name: '未命名', // 可视化报表名字
  metricDialogToggle: true, // 选择指标弹窗toggle
  saveDialogToggle: false, // 保存弹窗toggle
  previewToggle: false, // 预览toggle
  dataSet: [], // 数据集,
  warnDialogToggle: false, // 告警弹窗toggle
  createTime: '',
  chartsReady: [], // 查询面板专用
  alias: {
    metrics: [],
    dims: []
  } // 指标和维度的别名
}

export default state
