/**
 * vuex 模块
 * dingyiming
 * 2017/8/15
 */
import login from '@/web-design/api/login'

const state = {
  menu: [], // 菜单
  menuObj: {},
  user: { // 用户信息
    name: '',
    code: ''
  }
}

// mutations
const mutations = {
  // 更新用户信息和菜单
  UpdateUserMenu(state, data) {
    state.menu = data.menu
    const obj = {}
    for (let i = 0; i < data.menu.length; i += 1) {
      const item = data.menu[i]
      for (let j = 0; j < item.children.length; j += 1) {
        obj[item.children[j].url] = true
      }
    }
    state.menuObj = obj
    state.user = data.user
  }
}

const actions = {
  async initUserMenu({ commit }) {
    const data = await login.user()
    const res = data.data
    // 可以没有res.user
    // if (!res || !res.user || !res.menu) return
    if (!res || !res.menu) return
    commit('UpdateUserMenu', res)
  }
}

export default {
  state,
  getters: {},
  actions,
  mutations
}
