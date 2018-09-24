// layout下的addPannel.vue 和tab下的addPannel.vue，的mixin
export default {
  methods: {
    // 计算背景url
    getBackground(icon) {
      let x = ''
      let y = '27.2%'
      let url = '/static/charts/images/icons.png'
      let widthHeight = '1250px 703px'
      switch (icon) {
        case 'tubiao': x = '72.9%'; break
        case 'wenben': x = '78.8%'; break
        case 'chaxun': x = '84.5%'; break
        case 'Tab': x = '90.2%'; break
        case 'iframe' : url = '/static/charts/images/containerType/iframe.png',
         x = '50%' , y = '50%' , widthHeight = '23px 23px' ;break
      }
      return {
        'background-size': widthHeight,
        'background-image': `url(${url})`,
        'background-position': `${x} ${y}`
      }
    }
  }
}
