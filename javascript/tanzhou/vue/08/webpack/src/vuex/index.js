import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  age: [
    {name: 'a', age: 1, done: true},
    {name: 'b', age: 2, done: false},
    {name: 'c', age: 3, done: true},
    {name: 'd', age: 4, done: false}
  ],
  name: 'abc',
  count: 0
}

const getters = {
  countAnother: state => {
    return state.age.filter(todo => todo.done)
  }
}

const mutations = {
  INCREMENT (state) {
    state.count++;
  },
  DECREMENT (state) {
    state.count--;
  }
}

const actions = {
  increment({commit}) {
    commit("INCREMENT")
  },
  decrement({commit}) {
    commit("DECREMENT")
  }
}

// 语法检测的时候 new必须进行赋值
/* eslint-disable no-new */
export default new Vuex.Store({
  // 是用来保存数据的
  state,
  getters,
  mutations,
  actions
})
