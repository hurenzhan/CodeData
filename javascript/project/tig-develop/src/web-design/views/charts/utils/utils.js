import eventBus from './eventBus'
import moment from 'moment'

/**
 * 取消选中所有的容器
 * @param {Array} arr 所有图表的配置
 * @param {Number} index 重新选中的index
 */
const cancelAllSelected = (arr, index) => {
  if (!arr.length) return
  arr.forEach(item => {
    item.selected = false
  })
  if (index !== undefined) {
    arr[index].selected = true
  }
}
// 获取所有展示的容器配置(未直接或者间接删除)
const getInShowContainers = (chartsOption) => {
  const tmpArr = []
  chartsOption.forEach(item => {
    // 判断是否在删除的Tab里
    let inDropTab = false
    if (item.tabContainerIndex !== undefined) {
      const currentTab = chartsOption[item.tabContainerIndex]
      const currentTabItem = chartsOption[item.tabContainerIndex].feature.tabs[item.activeTabIndex]
      if (currentTab.drop || currentTabItem.drop) inDropTab = true
    }
    if (!item.drop && !inDropTab) tmpArr.push(item)
  })
  return tmpArr
}
/**
 * 获取新添加的容器的Y轴位置
 * 注意点： 在tab里添加容器时才会有tabContainerIndex，activeTabIndex
 * @param {Array} arr 所有容器的配置
 * @return {Number} 返回y值
 */
const getNewY = (arr, tabContainerIndex, activeTabIndex) => {
  let containerOption = getInShowContainers(arr)
  if (activeTabIndex === undefined && tabContainerIndex === undefined) {
    return containerOption.reduce((sum, item) => (sum += item.h), 0)
  } else {
    // 在tab里添加容器时
    return containerOption.filter(
      item => item.tabContainerIndex === tabContainerIndex && item.activeTabIndex === activeTabIndex
    ).reduce((sum, item) => (sum += item.h), 0)
  }
}
/**
 * 判断所有容器失去焦点
 * @param {Array} arr 所有容器的配置
 * @return {Boolean}
 */
const allBlur = (arr) => {
  return !arr.some(item => item.selected)
}
/**
 * 计算选中指标的交叉维度
 */
const getCrossDimList = (dataSet, selectedMetrics) => {
  const selectedDataSet = dataSet.filter(item => selectedMetrics.some(each => each.metricCode === item.metricCode))
  const tmpDimList = []
  const allDimList = [] // 所有维度的集合
  const finalList = []
  dataSet.forEach(item => {
    if (selectedMetrics.some(each => each.metricCode === item.metricCode)) {
      tmpDimList.push(...item.dimList)
    }
  })
  tmpDimList.forEach(item => {
    allDimList.every(each => each.dimCode !== item.dimCode) && allDimList.push(item)
  })
  allDimList.forEach(item => {
    selectedDataSet.every(each => each.dimList.some(one => one.dimCode === item.dimCode)) && finalList.push(item)
  })
  return finalList
}
// 获取展示的tab块
const getInshowTabs = (chartsOption) => {
  const tmpArr = []
  chartsOption.forEach( item => {
    if(item.drop) {
      tmpArr.push(item)
    }
  })
  return tmpArr
}
/**
 * 计算当前所有使用中的指标
 * @param {Array} chartsOption 图表的所有配置
 * @return {Array} 指标id的数组
 */
const getMetricsUsed = (chartsOption) => {
  let tmpArr = []
  getInShowContainers(chartsOption).forEach(item => {
    if (item.feature.metricList) {
      item.feature.metricList.forEach(each => {
        if (!tmpArr.includes(each.metricCode)) tmpArr.push(each.metricCode)
      })
    }
  })
  return tmpArr
}
/**
 * 计算当前所有使用中的指标或者维度
 * @param {Array} chartsOption 图表的所有配置
 * @param {Number} type 1指标 2维度  默认为1
 * @return {Array} 对象形式的指标或者维度的数组
 */
const getMetricOrDimUsed = (chartsOption, type = 1) => {
  let tmpArr = []
  let typeWord = type === 1 ? 'metricList' : 'dimList'
  let typeCodeWord = type === 1 ? 'metricCode' : 'dimCode'
  getInShowContainers(chartsOption).forEach(item => {
    if (item.feature[typeWord] && !item.drop) {
      item.feature[typeWord].forEach(each => {
        if (!tmpArr.some(one => one[typeCodeWord] === each[typeCodeWord])) tmpArr.push(each)
      })
    }
  })
  return tmpArr
}
/**
 * 通过维度获取所有公共维度里包含这个维度的所有容器
 * @param {Array} chartsOption 图表的所有配置
 * @param {Array} dataSet 数据集
 * @param {String} dimCode 维度id
 * @param {Number} index containerIndex
 * @return {Array}
 */
const getContainersByDim = ({chartsOption, dataSet, dimCode, index}) => {
  const _isChecked = (containerIndex) => {
    return chartsOption[index].linkedContainers.filter(item => item.dimCode === dimCode && item.containerIndex === containerIndex).length
  }
  let tmpArr = []
  // 不能被关联的图表（词云图、漏斗图、关系图)
  const chartIdArr = [6, 7, 12]
  getInShowContainers(chartsOption).filter(item => item.id === 0 && item.i !== index && !item.drop && !chartIdArr.includes(item.feature.chartId)).forEach(item => {
    const crossDimList = getCrossDimList(dataSet, item.feature.metricList)
    if (crossDimList.some(each => each.dimCode === dimCode)) {
      tmpArr.push({
        containerName: item.name,
        containerIndex: item.i,
        checked: _isChecked(item.i)
      })
    }
  })
  return tmpArr
}

/**
 * 图表关联后点击图表维值后发射关联信息
 * @param {Array} chartsOption 图表的所有配置
 * @param {Number} index 当前点击图表所在的容器序号,从0开始
 * @param {Object} linkInfo 点击要进行联动的维值信息
 * linkInfo的字段格式:
 * {
 *  dimCode 点击的维度编码(String)
 *  dimValue 点击的维度值(String)
 * }
 */
function sendLinkInfo (chartsOption, index, linkInfo) {
  let toWho = []
  chartsOption[index].linkedContainers.forEach(item => {
    if(item.dimCode === linkInfo.dimCode){
      toWho.push(item.containerIndex)
    }
  })
  const emitObj = {
    toWho, // 要接收这个事件的图表容器序号数组
    linkInfo, // 要联动的维值信息对象
  }
  toWho = Array.from(new Set(toWho)) // 表格去重
  for (let i = 0; i < toWho.length; i++) {
    eventBus.$emit(`updateLink_${toWho[i]}`, emitObj)
  }
}
// 向所有容器发射resize事件
const emitResizeToAll = (chartsOption) => {
  for (let i = 0; i < chartsOption.length; i++) {
    eventBus.$emit(`resizeOrMove_${chartsOption[i].i}`)
  }
}

// 金额按千位逗号拆分,判断是不是带小数，带小数的话如果大于6位就不展示，否则展示小数
const toThousands = (num2) => {
  // 判断是不是num类型
  if (!isNaN(num2)) {
    let r = /^[0-9]*[1-9][0-9]*$/　　//正整数
    // 首先判断是不是整数
    if (!r.test(Math.abs(num2)) && parseInt(num2) !== 0) {
      // 如果不是整数且小于7位数
      if (Math.abs(parseInt(num2)).toString().length <= 6) {
        num2 = num2.split('.')
        let num = ((num2[0] < 0 ? Math.abs(num2[0]) : num2[0]) || 0).toString(), result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        result = num ? (num + result) : ''
        if (num2[0] < 0) {
          return '-' + result + '.' + num2[1];
        } else if (num2[0] >= 0) {
          return result + '.' + num2[1]
        }
      } else {
        num2 = parseInt(num2)
        let num = ((num2 < 0 ? Math.abs(num2) : num2) || 0).toString(), result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        result = num ? (num + result) : ''
        if (num2 < 0) {
          return '-' + result;
        } else if (num2 >= 0) {
          return result
        }
      }
    } else {
      num2 = parseInt(num2)
      let num = ((num2 < 0 ? Math.abs(num2) : num2) || 0).toString(), result = '';
      while (num.length > 3) {
          result = ',' + num.slice(-3) + result;
          num = num.slice(0, num.length - 3);
      }
      result = num ? (num + result) : ''
      if (num2 < 0) {
        return '-' + result;
      } else if (num2 >= 0) {
        return result
      }
    }
  } else {
    return num2
  }
}
/**
 * 验证a-b个字符   包涵 数字，中英文，_-/()（）
 * 默认a = 1   b = 30
 */
const isName = (name, a = 1, b = 30) => {
  const namePattern = new RegExp(`^[\\u4e00-\\u9fa5\\w-/()（）]{${a},${b}}$`)
  return namePattern.test(name)
}
// 验证文本内容
const isContent = (content, a = 1, b = 200) => {
  const length = content.length
  return length >= a && length <= b
}
// 下一步
const tick = () => new Promise(resolve => setTimeout(resolve, 0))
// 等待n秒
const wait = time => new Promise(resolve => setTimeout(resolve, time * 1000))
// 时间类型的映射
const dateTypeMap = (dateType) => {
  let result = ''
  if (dateType === 'TG_00000003') result = 'datetime-hour'
  if (dateType === 'TG_00000004') result = 'date'
  if (dateType === 'TG_00000007') result = 'week'
  if (dateType === 'TG_00000005') result = 'month'
  if (dateType === 'TG_00000008') result = 'quarter'
  if (dateType === 'TG_00000006') result = 'year'
  if (dateType === 'datetime-hour') result = 'TG_00000003'
  if (dateType === 'date') result = 'TG_00000004'
  if (dateType === 'week') result = 'TG_00000007'
  if (dateType === 'month') result = 'TG_00000005'
  if (dateType === 'quarter') result = 'TG_00000008'
  if (dateType === 'year') result = 'TG_00000006'
  return result
}
// 时间控件类型
const dateTypes = [
  {
    name: '时',
    value: 'datetime-hour',
    dateTypeCode: 'TG_00000003'
  },
  {
    name: '天',
    value: 'date',
    dateTypeCode: 'TG_00000004'
  },
  {
    name: '周',
    value: 'week',
    dateTypeCode: 'TG_00000007'
  },
  {
    name: '月',
    value: 'month',
    dateTypeCode: 'TG_00000005'
  },
  {
    name: '季',
    value: 'quarter',
    dateTypeCode: 'TG_00000008'
  },
  {
    name: '年',
    value: 'year',
    dateTypeCode: 'TG_00000006'
  }
]
// 计算当前容器的度量的总数,注意不是指标的总数
const calcNumOfMeasure = (metricList) => {
  let num = 0
  metricList.forEach(item => {
    for (let key in item.feature) {
      item.feature[key] && num++
    }
  })
  return num
}
// 计算当前容器是否含有可比属性
const calcNumMetricListFlat = (metricListFlat) => {
  const num = metricListFlat.filter(item => item.metricCode.indexOf('_x') !== -1).length || 0
  return num
}
const getMetricCode = (metricList, metricCode) => {
  let metricCodeCurrent = ''
  metricList.forEach(v => {
    if (metricCode.indexOf(v.metricCode) !== -1) {
      metricCodeCurrent = v.metricCode
    }
  })
  return metricCodeCurrent
}
// 通过metricCode计算rateType
const rateTypeByMetricCode = (metricCode) => {
  const suffix = metricCode.slice(-2)
  let rateType = 0
  let isProportion = (suffix === '_7' || suffix === '_8')? true : false
  let metricsCode = ''
  let rateValue = ''
  let rateValueList = ['_2', '_4', '_6', '_8']
  switch (suffix) {
    case '_1':
    case '_2': rateType = 1; break
    case '_3':
    case '_4': rateType = 2; break
    case '_5':
    case '_6': rateType = 4; break
    // case '_7':
    // case '_8': rateType = 'isProportion'; break
    default: rateType = 0
  }
  // 判断是比值还是比率
  if (rateValueList.includes(metricCode.slice(-2))) {
    rateValue = false
  } else {
    rateValue = true
  }
  // 不是比值也不是比率
  if (metricCode.slice(-2).indexOf('_') === -1) {
    rateValue = 'none'
  }
  // 处理code
  if (rateType !== 0 || isProportion) {
    metricsCode = metricCode.substring(0, metricCode.length - 2)
  } else {
    metricsCode = metricCode
  }
  return { rateType, isProportion, metricsCode, rateValue }
}
// 根据指标的feature，来计算rateType isProportion
const calcMetricFeature = (feature) => {
  let rateType = 0
  let compareType = 0
  let isProportion = feature.value8 || feature.value9
  // 只同比
  if ((feature.value2 || feature.value3) && !feature.value4 && !feature.value5) {
    rateType = 1
    if(feature.value1_1) compareType = 2
  }
  // 只环比
  if ((feature.value4 || feature.value5) && !feature.value2 && !feature.value3) {
    rateType = 2
    if(feature.value1_1) compareType = 2
  }
  // 只同环比
  if ((feature.value2 || feature.value3) && (feature.value4 || feature.value5)) {
    rateType = 3
  }
  // 只对比
  if (feature.value6 || feature.value7) {
    rateType = 4
    if(feature.value6_1) compareType = 1
    if(feature.value1_1) compareType = 2
    if(feature.value6_2 || feature.value6_3) compareType = 3
  }
  return {rateType, isProportion, compareType}
}

const MFSelected = (metricList, keyArr) => {
  let flag = false
  metricList.forEach(item => {
    for (const k in item.feature) {
      if (keyArr.includes(k) && item.feature[k]) {
        flag = true
      }
    }
  })
  return flag
}
// 容器的指标的属性中是否选中了对比value6,7
const MFSelected1 = (metricList) => {
  return MFSelected(metricList, ['value6', 'value7'])
}
// 容器指标的属性中是否选中了同环比value2,3,4,5
const MFSelected2 = (metricList) => {
  return MFSelected(metricList, ['value2', 'value3', 'value4', 'value5'])
}
// 针对季度选择控件返回的数据，解析成天
// 如['2018 第 1 季度', '2018 第 1 季度']解析成['2018-01-01', '2018-03-31']
const quarterToDay = (timeArr) => {
  const format = 'YYYY-MM-DD'
  const firstTimeArr = timeArr[0].match(/\d+/g).map(Number)
  const firstTime = moment(`${firstTimeArr[0]}-${firstTimeArr[1] * 3 - 2}-01`).format(format)
  const lastTimeArr = timeArr[1].match(/\d+/g).map(Number)
  const lastTime = moment(`${lastTimeArr[0]}-${(lastTimeArr[1] + 1) * 3 - 2}-01`).subtract(1, 'days').format(format)
  return [firstTime, lastTime]
}
/**
 * @desc 根据传的指标list，返回所有维度（去重后）
 */
const getDimsFromMetrics = (metrics) => {
  let result = []
  metrics.forEach(metric => {
    metric.dimList.forEach(dim => {
      if (!result.some(i => i.dimCode === dim.dimCode)) {
        result.push(dim)
      }
    })
  })
  return result
}
/**
 * @desc 传入metricCode返回相应的别名
 */
const getAlias = ({code, alias}) => {
  const index = alias.metrics.findIndex(item => item.metricCode === code)
  if (index === -1) {
    return false
  } else {
    return alias.metrics[index].alias
  }
}
/**
 * 根据传入的维值格式 获取指定对格式的维值
 * dimValueName 目标维值名(要匹配的对象)
 * type 需要的目标格式
*/
const getDimValueByType = (chartsOption, dimCode, dimString, type) => {
  let filterData = chartsOption.nearUpdateData.filter(item => {
        if (item[`${dimCode}_Obj`]
          && (item[`${dimCode}_Obj`].dimName === dimString
          || item[`${dimCode}_Obj`].dimValue === dimString
          || item[`${dimCode}_Obj`].dimValueNm === dimString
          || item[`${dimCode}_Obj`].dimValue_Name === dimString) ) {
          return true
        } else {
          return false
        }
      })
  let target = dimString
  if (filterData.length) {
    let dimObj = filterData[0][`${dimCode}_Obj`]
    switch (type) {
      case 'value':
        target = dimObj.dimValue
        break;
      case 'name':
        target = dimObj.dimName
        break;
      case '_':
        target = dimObj.dimValue_Name
        break;
      case '#':
        target = dimObj.dimValueNm
        break;
      default:
        target = dimObj.dimValue
        break;
    }
  }
  return target
}

export {
  getNewY,
  cancelAllSelected,
  allBlur,
  getCrossDimList,
  getMetricsUsed,
  getMetricOrDimUsed,
  getContainersByDim,
  sendLinkInfo,
  emitResizeToAll,
  toThousands,
  isName,
  isContent,
  wait,
  tick,
  dateTypeMap,
  dateTypes,
  getInShowContainers,
  calcNumOfMeasure,
  calcNumMetricListFlat,
  rateTypeByMetricCode,
  MFSelected1,
  MFSelected2,
  calcMetricFeature,
  quarterToDay,
  getDimsFromMetrics,
  getAlias,
  getDimValueByType,
  getMetricCode
}
