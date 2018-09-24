import bus from '../../utils/eventBus'
export default {
  changeNode(state, obj) {

    state.chartsOption[obj.index].feature.styleConfig.config.nodeNo = obj.value
    
      // 配置同步到vuex后，用bus来联动图表
      bus.$emit('updateOption', obj)
  },

  // 拆分维度后把节点全部置灰
  disableAllNo(state, obj) {
    state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList.forEach((item) => {
      item.disabled = true
    })
  },

  // 往nodeTypeList里新增节点
  addNodeNo(state, obj) {
    if (state.chartsOption[obj.index]) {
      state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList.push({ 'type': obj.type, 'disabled': obj.disabled, 'isDetailNode': obj.isDetailNode })
    }  
  },
  // 删除nodeTypeList里的节点
  delNodeNo(state, obj) {
    if (state.chartsOption[obj.index]) {
      state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList.splice(obj.delNo, obj.type ? (state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList.length - obj.delNo) : 1)
      if (state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList.length < state.chartsOption[obj.index].feature.styleConfig.config.nodeNo) {
        state.chartsOption[obj.index].feature.styleConfig.config.nodeNo = 0
      }
    }   
  },

  // 更新nodeTypeList里的节点
  updateNodeNo(state, obj) {
    if (state.chartsOption[obj.index]) {
      if (obj.updateAll) {
        state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList.forEach((item, index) => {
          item.disabled = false
        })
        state.chartsOption[obj.index].feature.styleConfig.config.nodeNo = 0
      } else {
        if (obj.updateFail) {
          state.chartsOption[obj.index].feature.styleConfig.config.nodeNo = 0
        } else {
          state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList[obj.num - 1].disabled = true
          state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList[obj.num - 1].isDetailNode = true
        }
      }
    }
  },

  // 保存数据
  saveData(state, obj) {
    if (state.chartsOption[obj.index].feature) {
      state.chartsOption[obj.index].feature.styleConfig.config.data = obj.json
      state.chartsOption[obj.index].feature.styleConfig.config.metricNo = obj.metricNo // 保存已经使用的指标数量
      state.chartsOption[obj.index].feature.styleConfig.config.nodeNum = obj.nodeNum
      state.chartsOption[obj.index].feature.styleConfig.config.edgeNum = obj.edgeNum
    }
  },

  // 保存我需要的数据，带维度和汇总的，分别用两个state来保存，一个是gatherData代表汇总数据，一个是detailData代表明细指标数据
  saveAllData(state, obj) {
    if (state.chartsOption[obj.index]) {
      if (obj.data) {
        if (obj.data.length === 0) {
          state.chartsOption[obj.index].feature.styleConfig.config.gatherData = []
        } else if (obj.data.length === 1){
          state.chartsOption[obj.index].feature.styleConfig.config.gatherData = obj.data.slice(0, 1)
        } else {
          state.chartsOption[obj.index].feature.styleConfig.config.gatherData = obj.data.slice(0, 1)
          state.chartsOption[obj.index].feature.styleConfig.config.detailData = obj.data.slice(1, 4)
        }
      } else {
        state.chartsOption[obj.index].feature.styleConfig.config.gatherData = []
      }
    }
  },

  emptyNodeList(state, obj) {
    if (state.chartsOption[obj.index]) {
      state.chartsOption[obj.index].feature.styleConfig.config.nodeTypeList = []
      state.chartsOption[obj.index].feature.styleConfig.config.nodeNo = 0
    }
  }  

}
