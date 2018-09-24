import api from '@/web-design/api/design'

/**
 * 初始化维值到可用于columnList中的程度
 * @param {Array} data
 */
const convertDimValue = (data) => {
  if (Array.isArray(data)) {
    const config = []
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i]
      if (item && Object.prototype.toString.call(item) === '[object String]') {
        const reg = /(.+)_(.+)/
        config[i] = {
          id: item.match(reg)[1],
          name: item.match(reg)[2],
          type: 3,
          align: 'center',
          collapse: true,
          alignDisplay: {
            horizontal: 6,
            vertical: 2
          },
          formatter: {
            type: 0, // 数值类型：0 -->数值， 1 -->百分比
            decimals: 2, // 小数点位数
            thousands: false
          }
        }
      }
    }
    return config
  }
  return false
}

export default {
  methods: {
    // 选择列维度，维值查询支持远程搜索
    async queryDim(id, query) {
      if (query === '') {
        const bodySelector = document.querySelector('body')
        bodySelector.click()
      }
      const data = await api.queryDimValue(id, query)
      if (!data) return false
      this.loading1 = false
      this.dimValueList = data.data
      return true
    },
    // 更改列维度，并且请求维值列表数据
    async handleDim(data) {
      const isFirstFlag = this.$store.state.design.firstFlag
      let config
      this.leftDimList.filter(v => v.type === 0).forEach((v) => {
        if (data === v.id) {
          config = {
            id: v.id,
            name: v.name
          }
        }
      })
      this.$store.commit('handleDimList', config)
      const res = await api.queryDimValue(data)
      if (res && res.data) {
        // 默认展示所有数据
        this.loading1 = false
        this.dimValueList = res.data
      }
      // 每次更改列维度强制选项，都清空columnList中的维值列
      // 但是要注意第一次进来不要触发此行为
      if (isFirstFlag > 0) {
        this.$store.commit('delDimValueCol')
        this.$store.commit('updateDimValueList', [])
      }
      this.$store.commit('changeFirstFlag')
    },
    // 更改维值
    handleDimvalue(data) {
      // 列维度维值需要推到columnList中，Type => 3,另外不需要显示到行维度中，不过要显示到自定义表头和下面的数据表头中去
      // 有一个问题？因为每次重新初始化维值列的问题导致不能添加对齐属性
      // 如果columnList已经存在了维值列，就不往里面添加了，所以只添加没有的部分
      // data始终是select当前的数据
      const config = convertDimValue(data)
      this.$store.commit('addDimValueToColumnList', config)
      // 最多只能选20条
      const maxNumber = 20
      if (data.length > maxNumber) {
        this.$Message.info(`维值最多只可以选择${maxNumber}个`)
        this.columnDim.dimValue.pop()
        return false
      }
      this.$store.commit('updateDimValueList', data)
      return true
    },
    // 维度切分change event
    dimSegmentation(data) {
      // data --> 1 维度切分
      // 维度切分和上卷下钻是互斥的，所以当选择维度切分时，需要清空上卷下钻的数据
      const initDrillConfig = {
        selectedDrillItem: {
          name: '',
          id: '',
        },
        dirllRoad: {
          routeCode: '',
          routeNm: ''
        }
      }
      if (data === 1) {
        // 维度切分跳转到其他地方  不让选择上卷下钻
        const thirdConfigComponent = document.querySelector('.menuBar.menuList li:nth-child(3)')
        if (thirdConfigComponent) {
          thirdConfigComponent.click()
        }
        this.$store.commit('handleDrillChange', initDrillConfig)
      }
    }
  }
}
