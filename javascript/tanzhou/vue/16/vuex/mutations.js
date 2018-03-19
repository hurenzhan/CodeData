export default {
  // 添加商品
  vxaddCart (state, value) {
    // console.log(value.count)
    state.vxselectFoods.push(value)
  },
  // 删除商品
  vxdecreaseCart (state, value) {
    state.vxselectFoods.forEach((val, index) => {
      if (val.name === value.name) {
        state.vxselectFoods.splice(index, 1)
      }
    })
  },
  vxempty (state, value) {
    // value.forEach(val => {
    //   val.count = 0
    //   val.active = true
    // })
    state.vxselectFoods.splice(0, state.vxselectFoods.length)
  }
}
