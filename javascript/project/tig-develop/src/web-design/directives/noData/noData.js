import Vue from 'vue'
import noDataVue from './noData.vue'
const NoDataMask = Vue.extend(noDataVue)
const toggleShow = (el, value) => {
  el.querySelector('.search-no-data').style.display = value ? 'flex' : 'none'
}
// 容器是否有标题，没有的话加上'no-title'
const toggleTitle = (el, value) => {
  const action = value ? 'remove' : 'add'
  el.querySelector('.search-no-data').classList[action]('no-title')
}

export default {
  inserted: function (el, binding) {
    const noDataDiv = new NoDataMask({
      el: document.createElement('div'),
      data: {
      }
    })
    el.appendChild(noDataDiv.$el)
    toggleShow(el, binding.value.noDataLayer)
  },
  update: function (el, binding) {
    const {noDataLayer, containerHasTitle} = binding.value
    toggleShow(el, noDataLayer)
    toggleTitle(el, containerHasTitle)
  }
}
