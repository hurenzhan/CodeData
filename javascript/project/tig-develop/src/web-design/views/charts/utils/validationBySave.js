import {isName, isContent, getInShowContainers} from './utils'

const nameMsg = '不符合命名规则'
export const validate = charts => {
  let errorArr = []
  // 对工作表名字进行校验
  if (!isName(charts.name)) {
    errorArr.push({
      title: '工作表名称',
      msg: nameMsg
    })
  }
  // 对过滤后的chartsOption进行校验
  getInShowContainers(charts.chartsOption).forEach(item => {
    switch (item.id) {
      case 0:
        // 检验名字
        if (!isName(item.name)) {
          errorArr.push({
            title: `第${item.i + 1}个容器(${item.name})名称`,
            msg: nameMsg
          })
        }
        // 检验更新按钮
        if (item.updateBtnActive) {
          errorArr.push({
            title: `第${item.i + 1}个容器(${item.name})更新按钮`,
            msg: '数据集改变后需要点击更新按钮'
          })
        }
        break
      case 1:
        if (!isName(item.feature.title)) {
          errorArr.push({
            title: `第${item.i + 1}个容器(${item.name})名称`,
            msg: nameMsg
          })
        }
        if (!isContent(item.feature.content, 0, 500)) {
          errorArr.push({
            title: `第${item.i + 1}个容器(${item.name})的文本内容`,
            msg: '不符合规范'
          })
        }
        break
      case 2:
        if (!isName(item.feature.title)) {
          errorArr.push({
            title: `第${item.i + 1}个容器(${item.name})名称`,
            msg: nameMsg
          })
        }
        if (!isName(item.feature.dataMetricListTitle, 0, 20)) {
          errorArr.push({
            title: `第${item.i + 1}个容器(${item.name})的指标下拉框的名称`,
            msg: nameMsg
          })
        }
        if (!isName(item.feature.dropDownListTitle, 0, 20)) {
          errorArr.push({
            title: `第${item.i + 1}个容器(${item.name})名称的维度下拉框的名称`,
            msg: nameMsg
          })
        }
        item.feature.textCategory.forEach(({value}, index) => {
          if (!isContent(value, 0, 200)) {
            errorArr.push({
              title: `第${item.i + 1}个容器(${item.name})的第${index}个文本`,
              msg: '文本内容不符合规范'
            })
          }
        })
        break
      case 3:
        if (!isName(item.feature.title.value)) {
          errorArr.push({
            title: `第${item.i + 1}个容器(${item.name})名称`,
            msg: nameMsg
          })
        }
        item.feature.tabs.forEach(({name}, index) => {
          if (!isName(name)) {
            errorArr.push({
              title: `第${item.i + 1}个容器(${item.name})的第${index}个tab的名称`,
              msg: nameMsg
            })
          }
        })
        break
      default:
        console.log(111)
    }
  })
  return errorArr
}
// 只验证‘更新’按钮是否需要点击
export const onlyUpdateBtnActive = chartsOption => {
  let errorArr = []
  getInShowContainers(chartsOption).forEach(item => {
    if (item.id === 0 && item.updateBtnActive) {
      errorArr.push({
        title: `第${item.i + 1}个容器(${item.name})更新按钮`,
        msg: '数据集改变后需要点击更新按钮'
      })
    }
  })
  return errorArr
}
// 查询前，是否所有指标都至少选择了一个属性
export const everyMetricHasFeature = (metricList) => {
  // 检测单个指标的feature是否合法：至少有一个true
  const _checkOneMetric = (item) => {
    let flag = false
    for (const v in item.feature) {
      if (item.feature[v]) flag = true
    }
    return flag
  }
  let flag = true
  metricList.forEach(item => {
    if (!_checkOneMetric(item)) flag = false
  })
  return flag
}
// 重命名指标时的验证
export const metricsAliasValidate = (alias) => {
  return isName(alias, 1, 20)
}

export default validate
