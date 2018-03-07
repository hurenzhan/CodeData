import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  age: [
    {name: '1', age: 1},
    {name: '2', age: 2},
    {name: '3', age: 3},
    {name: '4', age: 4}
  ],
  name: 'abc',
  vxcart: []
}
// 相当于 computed 作用于 state 过滤操作 .....
const getters = {
  guolv (state) {
    state.name = '123'
  }
}
// 主要是用来操控 state 里面的数据的
const mutations = {
  addage () {
    state.age++
  },
  minusage () {
    state.age--
  },
  vxaddCart (state, value) {
    state.vxcart.push(value)
  },
  vxjian (state, value) {
    state.vxcart.forEach((val, index) => {
      if (val.title === value.title) {
        state.vxcart.splice(index, 1)
      }
    })
  }
}
// 来调用 mutations 里的方法
// 可以进行异步操作
const actions = {
  // 默认接收了一个参数
  addagepro ({commit}) {
    commit('addage')
  }
}
// 语法检测的时候 new必须进行赋值
/* eslint-disable no-new */
export default new Vuex.Store({
  // 是用来保存数据的
  state,
  mutations,
  actions,
  getters
})
