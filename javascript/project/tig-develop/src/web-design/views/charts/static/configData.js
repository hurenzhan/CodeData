// 容器种类
const containerCategory = [
  {
    name: '图表',
    id: 0,
    icon: 'tubiao'
  },
  {
    name: '文本',
    id: 1,
    icon: 'wenben'
  },
  {
    name: '查询面板',
    id: 2,
    icon: 'chaxun'
  },
  {
    name: 'TAB切换',
    id: 3,
    icon: 'Tab'
  },
  {
    name: 'iframe',
    id: 4,
    icon: 'iframe'
  }
]
// 图表类型
const chartCategory = [
  {
    name: '复杂表',
    id: 0,
    orderId: 0,
    icon: 'biaoge.png',
    isRecommend ({ metricsNum, dimsNum }) {
      return metricsNum >= 1 && dimsNum >= 0
    }
  },
  {
    name: '饼图',
    id: 1,
    orderId: 3,
    icon: 'bingtu.png',
    isRecommend ({ metricsNum, dimsNum = 1, metricsFistNum }) {
      // 0个维度时，指标>=1
      const dimsNum0 = dimsNum === 0 && metricsNum >= 1 && metricsFistNum === 0
      // 1or2个维度时，指标=1
      const dimsNum1Or2 = (dimsNum === 1 || dimsNum === 2) && metricsNum === 1
      return dimsNum0 || dimsNum1Or2
    }
  },
  {
    name: '标签',
    id: 2,
    orderId: 6,
    icon: 'biaoqian.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum >= 1 && dimsNum <= 1 && metricsFistNum === 0
    }
  },
  {
    name: '地图',
    id: 3,
    orderId: 8,
    icon: 'ditu.png',
    isRecommend ({metricsNum, dimsNum, dimType, metricsFistNum}) {
      const dimTypeAllow = ['1', '2']
      const dimsNum1 = dimsNum === 1 && dimTypeAllow.includes(dimType[0])
      const dimsNum2 = dimsNum === 2 && dimTypeAllow.includes(dimType[0]) && dimTypeAllow.includes(dimType[1])
      const dimsNum1Or2 = dimsNum1 || dimsNum2
      return metricsNum >= 1 && metricsNum <= 8 &&
             dimsNum1Or2 && metricsFistNum === 0
        }
  },
  {
    name: '折线图',
    id: 4,
    orderId: 5,
    icon: 'zhexiantu.png',
    isRecommend ({ metricsNum, dimsNum = 1, metricsFistNum }) {
      return metricsNum >= 1 && dimsNum === 1 && metricsFistNum === 0
    }
  },
  {
    name: '柱状图',
    id: 5,
    orderId: 4,
    icon: 'zhutu.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum >= 1 && dimsNum === 1 && metricsFistNum === 0
    }
  },
  {
    name: '关系图',
    id: 6,
    orderId: 11,
    icon: 'guanxitu.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum >= 1 && dimsNum >= 0 && dimsNum <= 1 && metricsFistNum === 0
    }
  },
  {
    name: '词云图',
    id: 7,
    orderId: 20,
    icon: 'ciyuntu.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum === 1 && dimsNum === 1 && metricsFistNum === 0
    }
  },
  {
    name: '雷达图',
    id: 8,
    orderId: 21,
    icon: 'radar.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum >= 1 && metricsNum <= 6 && dimsNum > 0 && dimsNum <= 1 && metricsFistNum === 0
    }
  },
  {
    name: '散点图',
    id: 9,
    orderId: 22,
    icon: 'sandiantu.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum === 2 && dimsNum <= 1 && metricsFistNum === 0
    }
  },
  {
    name: '仪表盘',
    id: 10,
    orderId: 9,
    icon: 'yibiaopan.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum === 1 && dimsNum === 0 && metricsFistNum === 0
    }
  },
  {
    name: '气泡图',
    id: 11,
    orderId: 23,
    icon: 'qipaotu.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum === 1 && dimsNum === 1 && metricsFistNum === 0
    }
  },
  {
    name: '漏斗图',
    id: 12,
    orderId: 10,
    icon: 'loudoutu.png',
    isRecommend ({ metricsNum, dimsNum, metricsFistNum }) {
      return metricsNum >= 2 && metricsNum <= 8 && dimsNum === 0 && metricsFistNum === 0
    }
  },
  {
    name: '简单表',
    id: 13,
    orderId: 1,
    icon: 'jiandanbiao.png',
    isRecommend ({ metricsNum, dimsNum }) {
      return metricsNum >= 1 && dimsNum >= 0
    }
  },
  {
    name: '卡片',
    id: 14,
    orderId: 7,
    icon: 'card.png',
    isRecommend ({ metricsNum, metricCount, dimsNum, metricsFistNum }) {
      return metricsNum >= 1 && dimsNum <= 1 &&
             metricCount >= 1 && metricCount <= 5 &&
             metricsFistNum === 0
    }
  },
  {
    name: '交叉表',
    id: 15,
    orderId: 2,
    icon: 'jiaochabiao.png',
    isRecommend ({ metricsNum, dimsNum }) {
      return metricsNum >= 1 && dimsNum >= 0
    }
  }
]
// 容器的默认配置
const containerInit = {
  w: 12,
  h: 37, // 37or10
  minH: 2, // 5
  colNum: 12,
  rowHeight: 1, // 1or31
  rowOldHeight: 31,
  margin: [10, 10],
  useCssTransforms: false
}
// 整张可视报表的权限维度
const dimensionLimit = [
  {
    name: '大区',
    key: '1',
    value: true
  },
  {
    name: '公司',
    key: '2',
    value: true
  },
  {
    name: '门店',
    key: '3',
    value: true
  },
  {
    name: '品牌',
    key: '4',
    value: true
  },
  {
    name: '产业',
    key: '5',
    value: true
  }
]
// 常量
const constantWrapper = {
  LIMIT_NUM: 5000, // 慧眼请求的默认条数
  LIMIT_NUM_TIG: 200 // 天宫请求的最大条数
}
export { containerCategory, chartCategory, containerInit, dimensionLimit, constantWrapper }
