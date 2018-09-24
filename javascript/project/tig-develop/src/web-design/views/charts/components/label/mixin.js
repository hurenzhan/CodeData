import api from '../../../../api/charts'

export default {
  methods: {
    getDimListValue (key = '') {
      // 请求接口，offset是分页
      api.dimListValue({ dimId: this.dimList[0].dimCode, offset: 0, limit: 20, key }).then(res => {
        if (res) {
          let dimValueList = res.data.map(({ dimValue, dimValueNm }) => ({
            value: dimValueNm,
            label: dimValueNm
          }))
          // 把远程搜索到的结果存到dimValueList里
          const newArr = []
          if (this.dimValueList) {
            dimValueList.map((item, index) => {
              newArr.push(item.value)
            })
            let arrayFilter = []
            if (this.selectedDimValue && this.selectedDimValue.length) {
              arrayFilter = this.selectedDimValue.filter((item, index) => {
                return !newArr.includes(item)
              })
            }
            const optionDataList = []
            arrayFilter.map((item, index) => {
              // const arr = item.split('_')
              optionDataList.push({
                value: item,
                label: item
              })
            })
            this.$store.commit('saveDimValueList', { index: this.option ? this.option.i : this.config.i, dimValueList: [...dimValueList, ...optionDataList] })
          }
        }
      })
    }
  }
}
