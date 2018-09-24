import bus from '../../utils/eventBus'

export default {
  // 是否显示数值
  showNumberFunnel(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    config.showNumber.show = obj.value
    bus.$emit(`updateFunnel_${obj.index}`, {
      index: obj.index,
      showNumber:  obj.value
    })
  },
  // 是否显示对比期
  showCompareTimeFunnel(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    // 判断是否禁用对比期选择框
    if (obj.showDisableTime) {
      config.showCompareTime.disableCompareTime = obj.disableCompareTime
      // 如果禁用了选择框，就把对比期取消选中
      if (obj.disableCompareTime) {
        config.showCompareTime.show = false
      }
      // 判断是否存在查询面板的对比日期，如果存在就保存日期面板属性
      if (obj.dateData) {
        config.queryDate = obj.dateData
      } else {
        config.queryDate = []
      }
    }
    // 判断对比期选择框是否选中
    if (obj.showCompareTime) {
      config.showCompareTime.show = obj.value
      bus.$emit(`updateFunnel_${obj.index}`, {
        index: obj.index,
        showCompareTime: obj.showCompareTime
      })
    }
  },
  // 是否显示转化率
  showConvertFunnel(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    config.showConvert.show = obj.value
    bus.$emit(`updateFunnel_${obj.index}`, {
      index: obj.index,
      showConvert: obj.value
    })
  },
  // 是否显示层数
  showFloorFunnel(state, { index, value, notEmit }) {
    let config = state.chartsOption[index].feature.styleConfig.config
    config.showFloor.show = value
    // 根据当前指标数量来决定显示层数
    // config.showFloor.floors = floors
    // 每一层带上当前指标面板的指标
    // for (let i = 0; i < floors; i++) {
    //   config.showFloor.nodeList.push({selectedOptions: [metricList[i].metricCode]})
    // }
    // 如果取消勾选就还原
    if (!value) {
      config.showFloor.floors = 2
      config.showFloor.nodeList = [{
        selectedOptions: [],
        options: [],
      }, {
          selectedOptions: [],
          options: [],
      }]
      config.originData = []
      // config.showFloor.nodeList = []
      if (!notEmit) {
        if (config.showFloor.nodeList.length < 2) {
          config.showFloor.nodeList = [{
            selectedOptions: [],
            options: config.showFloor.nodeList[0].options // 把第一层的配置给新增的层
          }, {
            selectedOptions: [],
            options: config.showFloor.nodeList[0].options // 把第一层的配置给新增的层
          }]
        }
        bus.$emit(`updateFunnel_${index}`, {
          index,
          hideFloor: true
        })
      }
    }
  },

  // 改变层数
  changeFloorFunnel(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    let differ = Math.abs(obj.value - config.showFloor.floors)
    // 根据层数大小动态增加和减少下拉框
    let status = 'up'
    if (config.showFloor.floors < obj.value) {
      for (let i = 0; i < differ; i++) {
        config.showFloor.nodeList.push({
          selectedOptions: [],
          options: config.showFloor.nodeList[0].options,
        })
      }
    } else if (config.showFloor.floors > obj.value) {
      config.showFloor.nodeList.splice(obj.value, differ)
    }
    // 把最新的层数给替换掉
    config.showFloor.floors = obj.value

    // 如果有originData，就提交到saveOriginData里面
    if (obj.originData) {
      config.originData = obj.originData
    }
    bus.$emit(`updateFunnel_${obj.index}`, {
      index: obj.index,
      status
    })
  },

  // 存储处理过的数据
  saveDataFunnel(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    config.handleData = obj.handleData
  },

  // 存储对比数据
  saveCompareDataFunnel(state, obj) {
    let config = state.chartsOption[obj.index].feature.styleConfig.config
    config.compareHandleData = obj.handleData
  },

  // 存储options数据
  saveOptions(state, { index, options, floorIndex }) {
    let config = state.chartsOption[index].feature.styleConfig.config
    // 如果层数存在就改变那一层的选项，如果没有层数就改变所有的选项options
    if (floorIndex === undefined) {
      config.showFloor.nodeList.forEach(v => {
        v.options = options
      })
    } else {
      config.showFloor.nodeList[floorIndex].options = options
    }
  },

  // 存储原始数据
  saveOriginData(state, { index, originData }) {
    let config = state.chartsOption[index].feature.styleConfig.config
    config.originData = originData
    bus.$emit(`updateFunnel_${index}`, {
      index
    })
  }
}
