/**
 * 维度是增加or减少
 *  addFlag 增加or减少
 *  activeDimCode 相关的维度code
 */
const _dimAddOrDel = (dimCodeList, dimFilter) => {
  const addFlag = dimCodeList.length - dimFilter.length > 0
  let activeDimCode = ''
  if (addFlag) {
    activeDimCode = dimCodeList.filter(item => !dimFilter.includes(item))[0]
  } else {
    activeDimCode = dimFilter.filter(item => !dimCodeList.includes(item))[0]
  }
  return {
    addFlag,
    activeDimCode
  }
}
// 判断：维值是增加还是删除
const _dimValueAddOrDel = (newArr, oldArr) => {
  const addFlag = newArr.length - oldArr.length > 0
  let activeDimValue = ''
  if (addFlag) {
    activeDimValue = newArr.filter(item => !oldArr.includes(item))[0]
  } else {
    activeDimValue = oldArr.filter(item => !newArr.includes(item))[0]
  }
  return {
    addFlag,
    activeDimValue
  }
}
// 通过dimCode获取dimName
const _getDimName = (crossDimList, dimCode) => {
  return crossDimList.filter(i => i.dimCode === dimCode)[0].dimName
}
// 全部隐藏
const hideAll = (dimFilter) => {
  dimFilter.forEach(item => {item.hidden = 1})
}

export default {
  /**
   * 维度过滤器change
   * @param {Number} index 容器index
   * @param {Array} dimCodeList 选中的维度
   */
  dimFilterChange (state, {index, dimCodeList, crossDimList}) {
    const option = state.chartsOption[index]
    const dimFilter = option.dimFilter
    const {addFlag, activeDimCode} = _dimAddOrDel(dimCodeList, dimFilter.map(i => i.dimCode))
    // 添加维度
    if (addFlag) {
      // 添加新的过滤器时，先将hideAll
      hideAll(dimFilter)
      dimFilter.push({
        dimCode: activeDimCode,
        dimName: _getDimName(crossDimList, activeDimCode),
        operator: '6', // 包含:6 不包含:7
        dimValuesSelected: [], // 选中的维值
        hidden: 0, // 关闭状态
        command: 'select', // 输入控件还是选择控件
        initFilterValue: ''
      })
    } else {
      // 删除维度
      dimFilter.forEach((item, index) => {
        if (item.dimCode === activeDimCode) dimFilter.splice(index, 1)
      })
    }
  },
  // 包含OR不包含change
  inOrNotChange (state, {index, filterItemIndex, value}) {
    state.chartsOption[index].dimFilter[filterItemIndex].operator = value
  },
  // 显示or隐藏toggle
  toggleHidden (state, {index, filterItemIndex}) {
    state.chartsOption[index].dimFilter[filterItemIndex].hidden ^= true
  },
  // 选中的维值的添加OR删除
  dimValuesSelectedChange (state, {index, filterItemIndex, value}) {
    const option = state.chartsOption[index]
    const dimValuesSelected = option.dimFilter[filterItemIndex].dimValuesSelected
    const {addFlag, activeDimValue} = _dimValueAddOrDel(value, dimValuesSelected)
    // 添加维值
    if (addFlag) {
      dimValuesSelected.push(activeDimValue)
    } else {
      // 删除维值
      dimValuesSelected.forEach((item, index) => {
        if (item === activeDimValue) dimValuesSelected.splice(index, 1)
      })
    }
  },
  // 自定义维度 选中的维值
  dimValuesInputChange (state, {index, filterItemIndex, value}) {
    let dimValuesSelected = state.chartsOption[index].dimFilter[filterItemIndex].dimValuesSelected
    dimValuesSelected.splice(0, dimValuesSelected.length)
    for (let i = 0, length = value.length; i < length; i++) {
      dimValuesSelected.push(value[i])
    }
  },
  // 删除某个维度过滤器
  deleteDimFilter (state, {index, filterItemIndex}) {
    state.chartsOption[index].dimFilter.splice(filterItemIndex, 1)
  },
  // 数据关系里交叉维度改变时，触发这里
  // 继续包含时，不作操作
  // 不再包含时，删除相关维度过滤器
  deleteDimFilterByCrossDimChange (state, {index, newCrossDimList}) {
    let dimFilter = (state.chartsOption[index] && state.chartsOption[index].dimFilter) || []
    state.chartsOption[index].dimFilter = dimFilter.filter(item => newCrossDimList.includes(item.dimCode))
  },
  setCommand (state, {index, filterItemIndex, value}) {
    state.chartsOption[index].dimFilter[filterItemIndex].command = value
  },
  saveFilterValue (state, {index, filterItemIndex, value}) {
    state.chartsOption[index].dimFilter[filterItemIndex].initFilterValue = value
  }
}
