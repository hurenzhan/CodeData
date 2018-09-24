import searchApi from '@/web-design/api/design'
import chartsApi from '@/web-design/api/charts'
const actions = {
  increment ({ commit }) {
    commit('increment')
  },
  // 初始化维值查询
  async initDimListData({ commit }, {index, dimCode}) {
    // console.log('initDimListData', dimCode)
    // 调用查询接口
    const response = await searchApi.queryDimInfo(dimCode)
    response && response.data && response.data.forEach((item) => {
      let re = /^(.+)###(.*)$/i
      item.disabled = false
      item.dimLabel = re.test(item.dimValueNm) ? item.dimValueNm.replace('###', '_') : item.dimValueNm
    })
    // 添加全选字段
    // const allSelected = {
    //   dimValue: 'allSelected',
    //   dimValueNm: '全部',
    //   disabled: false
    // }
    // data.data.unshift(allSelected)
    // // 获取维值数据绑定在相应下标的维度下
    commit('initSaveDimListData', {
      index,
      dimList: response && response.data ? response.data : [],
      dimCode
    })
  },
  // 维度下相应维值查询
  async getDimListData({ commit }, {dimIndex, dimCode, key}) {
    // 调用查询接口
    const response = await searchApi.queryDimInfo(dimCode)
    response && response.data && response.data.forEach((item) => {
      if (item) {
        let re = /^(.+)###(.*)$/i
        item.disabled = false
        item.dimLabel = re.test(item.dimValueNm) ? item.dimValueNm.replace('###', '_') : item.dimValueNm
      }
    })
    // 添加全选字段
    // const allSelected = {
    //   dimValue: 'allSelected',
    //   dimValueNm: '全部',
    //   disabled: false
    // }
    // data.data.unshift(allSelected)
    // console.log('维值数据', data)
    // 获取维值数据绑定在相应下标的维度下
    commit('saveDimListData', {
      index: dimIndex,
      dimList: response && response.data ? response.data : [],
      dimCode,
      key
    })
  },
  // 维度下维值的远程搜索
  async getDimListBykey({ commit }, {dimIndex, dimCode, key}) {
    // 调用查询接口
    const response = await searchApi.queryDimInfoByKey({key, dimCode})
    // console.log('getDimListData', response)
    response && response.data && response.data.forEach((item) => {
      let re = /^(.+)###(.*)$/i
      item.disabled = false
      item.dimLabel = re.test(item.dimValueNm) ? item.dimValueNm.replace('###', '_') : item.dimValueNm
    })
    // 获取维值数据绑定在相应下标的维度下
    commit('saveDimListData', {
      index: dimIndex,
      dimList: response && response.data ? response.data : [],
      dimCode,
      key
    })
  },
  // 获取某个维度下的可级联维度
  async getDimRelative ({commit}, {index, dimCode, dimName}) {
    const response = await chartsApi.getDill({dimId: dimCode})
    // console.log('getDimRelative', response)
    let target = []
    response && response.data && response.data.forEach( (item) => {
      let dimCodeArr = item.route.split('-').reverse()
      let dimNameArr = item.routeNm.split('-').reverse()
      if (dimCodeArr.indexOf(dimCode) !== -1) {
        let targetIndex = dimCodeArr.indexOf(dimCode) + 1
        if (targetIndex <= dimCodeArr.length - 1) {
          if (!target.some(list => list.dimCode === dimCodeArr[targetIndex])) {
            target.push({
              dimCode: dimCodeArr[targetIndex],
              dimName: dimNameArr[targetIndex],
              father: dimCode,
              disabled: false
            })
          }
        }
      }
    })
    // 生成级联数据
    commit('saveDimListDill', {
      index,
      dimCode,
      dimCascade: target
    })
  },
  // 级联条件下 基于维值的查询
  async queryDimByCascade({ commit }, {index, dimCode, key, keyDimCode}) {
    // 调用查询接口
    const response = await searchApi.queryDimInfoByTree({key, dimCode, keyDimCode})
    response && response.data && response.data.forEach((item) => {
      let re = /^(.+)###(.*)$/i
      item.disabled = false
      item.dimLabel = re.test(item.dimValueNm) ? item.dimValueNm.replace('###', '_') : item.dimValueNm
    })
    // 获取维值数据绑定在相应下标的维度下
    this.commit('saveDimCascadeData', {
      index,
      dimCode,
      dimList: response && response.data ? response.data : []
    })
  }
}
export default actions