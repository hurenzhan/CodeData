import bus from '../../utils/eventBus'
import configClass from '../../static/configClass'

export default {
  // update图表配置项
  editMidOptionRadar(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    if (obj.toDelete && obj.toDelete.length > 0) {
      // 移除原有legend 位置属性
      obj.toDelete.map((item, index) => {
        delete config[obj.name][item]
      })
    }
    if (obj.toEdit) {
      // 改变lengend 位置属性
      if (Array.isArray(obj.toEdit)) {
        obj.toEdit.map((item, index) => {
          config[obj.name][item] = obj.value[index]
        })
      } else {
        config[obj.name][obj.toEdit] = obj.value
      }
    } else {
      config[obj.name] = obj.value
    }
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionRadar_${obj.index}`, {
      index: obj.index,
      config
    })
  },
  // 输入
  setAxisRadar (state, obj) {
    let indicator = state.chartsOption[obj.index].feature.styleConfig.config.radar.indicator
    indicator.forEach( (val) => {
      val.max = obj.value
    })
    state.chartsOption[obj.index].feature.styleConfig.config.maxValue = obj.value
    // 配置同步到vuex后，用bus来联动图表
    bus.$emit(`updateOptionRadar_${obj.index}`, {
      index: obj.index
    })
  },
  // 图例位置
  setLegendRadar (state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    const vertical = 'vertical'
    const horizontal = 'horizontal'
    let option = { index: obj.index, name: 'legend', position: obj.value }
    if (obj.value === 'left') {
      Object.assign(option, {
        // 原有位置
        toDelete: ['right', 'bottom'],
        // 改变后位置
        toEdit: ['left', 'orient', 'top'],
        // 偏移量(与toEdit一一对应)
        value: ['40', vertical, '70']
      })
    } else if (obj.value === 'top') {
      Object.assign(option, {
        toDelete: ['right', 'bottom'],
        toEdit: ['top', 'orient', 'left'],
        value: ['20', horizontal, 'center']
      })
    } else if (obj.value === 'right') {
      Object.assign(option, {
        toDelete: ['left', 'bottom'],
        toEdit: ['right', 'orient', 'top'],
        value: ['40', vertical, '70']
      })
    } else {
      Object.assign(option, {
        toDelete: ['right','top'],
        toEdit: ['bottom', 'orient', 'left'],
        value: ['20', horizontal, 'center']
      })
    }
    // 保存位置到配置文件中
    config.legend.positionName = obj.value
    this.commit('editMidOptionRadar', option)
  },
  // 初始化radar的配置
  initRadarConfig(state, obj) {
    // 保存tooltip状态、最大刻度、图例位置
    let isTooltip = state.chartsOption[obj.index].feature.styleConfig.config.tooltip.show
    let maxValue = state.chartsOption[obj.index].feature.styleConfig.config.maxValue
    let positionName = state.chartsOption[obj.index].feature.styleConfig.config.legend.positionName

    // 重新初始化 => 恢复保存的配置
    let radar = new configClass.Radar()
    radar.config.tooltip.show = isTooltip
    radar.config.maxValue = maxValue
    // 覆盖radar配置
    state.chartsOption[obj.index].feature.styleConfig.config = radar.config
    this.commit('setLegendRadar', { index: obj.index, value: positionName})
  }
}