import initData from './initData'
import getters from './gettters'
import mutations from './mutations'
import actions from './actions'

const state = JSON.parse(JSON.stringify(initData))

export default {
  state,
  getters,
  actions,
  mutations
}
