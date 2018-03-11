export default {
  // 默认第一个接收的参数是 vuex里所定义的数据
  vxaddCart (state, val) {
    state.vxfood.push(val)
  },
  vxdecreaseCart (state, food) {
    state.vxfood.forEach((value, index) => {
      if (value.name === food.name) {
        state.vxfood.splice(index, 1)
      }
    })
  }
}
