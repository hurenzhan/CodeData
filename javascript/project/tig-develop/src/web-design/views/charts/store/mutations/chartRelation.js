import {getInShowContainers} from '../../utils/utils'

export default {
  relationChange (state, {index, containerIndex, dimCode, value}) {
    if (value) {
      state.chartsOption[index].linkedContainers.push({
        dimCode,
        containerIndex
      })
    } else {
      state.chartsOption[index].linkedContainers.forEach((item, num) => {
        if (item.dimCode === dimCode && item.containerIndex === containerIndex) {
          state.chartsOption[index].linkedContainers.splice(num, 1)
        }
      })
    }
  },
  /**
   * // 容器取消选择某个维度后，删掉关联关系
   * @params {Number} index 容器的index
   * @params {String} dimCode 取消选择的维度id
   */
  relationChangeByDim (state, {index, dimCode}) {
    state.chartsOption[index].linkedContainers.forEach((item, num) => {
      if (item.dimCode === dimCode) state.chartsOption[index].linkedContainers.splice(num, 1)
    })
    // 维度取消时，只需要清除掉自己的linkedContainers
    /*
    state.chartsOption.forEach(item => {
      item.linkedContainers.forEach((each, eachIndex) => {
        if (each.dimCode === dimCode && each.containerIndex === index) {
          item.linkedContainers.splice(eachIndex, 1)
        }
      })
    })
    */
  },
  // 容器选中的指标改变，导致交叉维度改变后，
  // watch crossDimList的变化，检验交叉维度是否还继续包含关联容器(主动者)的维度
  // 继续包含时，不作操作
  // 不再包含时，关联容器(主动者)删除联动关系
  /**
   * @params {Number} index 容器的index
   * @params {Number} indexDel 需要删除的联动关系的index
   */
  relationChangeByMetric (state, {index, newValStr}) {
    const containers = getInShowContainers(state.chartsOption)
    containers.forEach(item => {
      item.linkedContainers.forEach((each, eachIndex) => {
        if (!newValStr.includes(each.dimCode) && each.containerIndex === index) {
          item.linkedContainers.splice(eachIndex, 1)
        }
      })
    })
  }
}
