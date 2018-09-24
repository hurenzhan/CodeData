// 本期期默认值配置项
const currentPeriod =  [
  {
    label: '实时',
    key: 0,
    selectValue: [
      {
        type: 0,
        name: '当日'
      }
    ]
  },
  {
    label: '时',
    key: 6,
    selectValue: [
      {
        type: 0,
        name: '当时'
      },
      {
        type: 1,
        name: '前一时'
      }
    ]
  },
  {
    label: '日',
    key: 1,
    selectValue: [
      {
        type: 0,
        name: '当日'
      },
      {
        type: 1,
        name: '前一日'
      }
    ]
  },
  {
    label: '周',
    key: 2,
    selectValue: [
      {
        type: 0,
        name: '当周'
      },
      {
        type: 1,
        name: '前一周'    
      }
    ]
  },
  {
    label: '月',
    key: 3,
    selectValue: [
      {
        type: 0,
        name: '当月'
      },
      {
        type: 1,
        name: '前一月'              
      }
    ]
  },
  {
    label: '季',
    key: 4,
    selectValue: [
      {
        type: 0,
        name: '当季'
      },
      {
        type: 1,
        name: '前一季'              
      }
    ]
  },
  {
    label: '年',
    key: 5,
    selectValue: [
      {
        type: 0,
        name: '当年'
      },
      {
        type: 1,
        name: '前一年'      
      }
    ]
  }
]

// 对比期默认值配置项
const comparePeriod =  [
  {
    label: '实时',
    key: 0,
    selectValue: [
      {
        type: 0,
        name: '当日'
      },
      {
        type: 1,
        name: '前一日'
      },
      {
        type: 2,
        name: '同比日期'
      },
      {
        type: 3,
        name: '环比日期'
      }
    ]
  },
  {
    label: '时',
    key: 6,
    selectValue: [
      {
        type: 0,
        name: '当时'
      },
      {
        type: 1,
        name: '前一时'
      },
      {
        type: 2,
        name: '同比日期'
      },
      {
        type: 3,
        name: '环比日期'
      }
    ]
  },
  {
    label: '日',
    key: 1,
    selectValue: [
      {
        type: 0,
        name: '当日'
      },
      {
        type: 1,
        name: '前一日'
      },
      {
        type: 4,
        name: '前两日'
      },
      {
        type: 2,
        name: '同比日期'
      },
      {
        type: 3,
        name: '环比日期'
      }
    ]
  },
  {
    label: '周',
    key: 2,
    selectValue: [
      {
        type: 0,
        name: '当周'
      },
      {
        type: 1,
        name: '前一周'    
      },
      {
        type: 2,
        name: '同比日期'
      },
      {
        type: 3,
        name: '环比日期'
      }
    ]
  },
  {
    label: '月',
    key: 3,
    selectValue: [
      {
        type: 0,
        name: '当月'
      },
      {
        type: 1,
        name: '前一月'              
      },
      {
        type: 2,
        name: '同比日期'
      },
      {
        type: 3,
        name: '环比日期'
      }
    ]
  },
  {
    label: '季',
    key: 4,
    selectValue: [
      {
        type: 0,
        name: '当季'
      },
      {
        type: 1,
        name: '前一季'              
      },
      {
        type: 2,
        name: '同比日期'
      },
      {
        type: 3,
        name: '环比日期'
      }
    ]
  },
  {
    label: '年',
    key: 5,
    selectValue: [
      {
        type: 0,
        name: '当年'
      },
      {
        type: 1,
        name: '前一年'      
      },
      {
        type: 2,
        name: '同比日期'
      },
      {
        type: 3,
        name: '环比日期'
      }
    ]
  }
]

const controlTypePeriod = [
  {
    label: '实时',
    key: 0,
    disabled: true,
    selectValue: [
      {
        type: 0,
        name: '日期'
      }
    ]
  },
  {
    label: '时',
    key: 6,
    disabled: false,
    selectValue: [
      {
        type: 1,
        name: '范围'
      }
    ]
  },
  {
    label: '日',
    key: 1,
    disabled: false,
    selectValue: [
      {
        type: 0,
        name: '单日'
      },
      {
        type: 1,
        name: '日期范围'
      }
    ]
  },
  {
    label: '周',
    key: 2,
    disabled: false,
    selectValue: [
      {
        type: 0,
        name: '单周'
      }
    ]
  },
  {
    label: '月',
    key: 3,
    disabled: false,
    selectValue: [
      {
        type: 0,
        name: '单月'
      },
      {
        type: 1,
        name: '多月'              
      }
    ]
  },
  {
    label: '季',
    key: 4,
    disabled: false,
    selectValue: [
      {
        type: 0,
        name: '单季'
      }
    ]
  },
  {
    label: '年',
    key: 5,
    disabled: false,
    selectValue: [
      {
        type: 0,
        name: '单年'
      }
    ]
  }
]

// 按粒度兼容顺序排名
const timeGranularityArr = [
  {
    formatType: 'datetime-sec',
    timeGranularity: 'TG_00000001',
    timeGranularityName: '秒'
  },
  {
    formatType: 'datetime-min',
    timeGranularity: 'TG_00000002',
    timeGranularityName: '分'
  },
  {
    formatType: 'datetime-hour',
    timeGranularity: 'TG_00000003',
    timeGranularityName: '时'
  },
  {
    formatType: 'date',
    timeGranularity: 'TG_00000004',
    timeGranularityName: '天'
  },
  {
    formatType: 'hour',
    timeGranularity: 'TG_00000004',
    timeGranularityName: '天'
  },
  {
    formatType: 'realTime',
    timeGranularity: 'TG_00000004',
    timeGranularityName: '天'
  },
  {
    formatType: 'week',
    timeGranularity: 'TG_00000007',
    timeGranularityName: '周'
  },
  {
    formatType: 'month',
    timeGranularity: 'TG_00000005',
    timeGranularityName: '月'
  },
  {
    formatType: 'quater',
    timeGranularity: 'TG_00000008',
    timeGranularityName: '季'
  },
  {
    formatType: 'year',
    timeGranularity: 'TG_00000006',
    timeGranularityName: '年'
  }
]

// params: timeGranularity 指标可用的最小的时间粒度
// return: 返回所有可用时间粒度数组
const getValidTimeCycle = (timeGranularity) => {
  let index = timeGranularityArr.findIndex(value => value.timeGranularity === timeGranularity)
  return timeGranularityArr.slice(index)
}

// 根据输入的粒度数组 获取可用的公共时间粒度数组
const getCommonValidTimeCycle = (Arr) => {
  let indexArr = Arr.map(timeGranularity => {
    return timeGranularityArr.findIndex(value => value.timeGranularity === timeGranularity)
  })
  return timeGranularityArr.slice(Math.max(...indexArr))
}

export {
  currentPeriod,
  comparePeriod,
  controlTypePeriod,
  getValidTimeCycle,
  getCommonValidTimeCycle
}
