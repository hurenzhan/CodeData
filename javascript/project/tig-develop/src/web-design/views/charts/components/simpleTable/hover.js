import _debounce from 'lodash.debounce'

export default {
  methods: {
    // 处理hover表格的数据，有个防抖操作
    hoverBarShowChange: _debounce(function () {
      this.hoverBarShowData(this.hoverValue, this.hoverIndex)
    }, 1000),
    async hoverBarShowData (value, index) {
      const chartsOption = this.chartsOption[this.index].feature.styleConfig
      // 指标
      const metri = this.metricList.filter(v => v.metricCode === chartsOption.hoverMetricSelect)
      // 维度
      const dim = this.dataSet.filter(item => item.metricCode === chartsOption.hoverMetricSelect)[0].dimList.filter(v => v.dimCode === chartsOption.hoverDim)

      const dimList = {
        dimId: dim[0].dimCode,
        dimName: dim[0].dimName
      }

      const metricsList = [{
        metricsCode: metri[0].metricCode,
        label: metri[0].metricName,
        decimals: 2,
        rateType: 0,
        thousands: false
      }]

      let conditionListArr = []

      if (value.indexOf('&dilldata') !== -1) {
        const dillDimList = this.tableData.filter(item => item[this.hoverId] === value)
        conditionListArr = [{
          operator: 6,
          condiType: 0,
          condiRateType: 0,
          condiCode: dillDimList[0].dillDim,
          condiComparedValue: value.split('&dilldata')[0].split('###')[0]
        },
        {
          operator: 6,
          condiType: 0,
          condiRateType: 0,
          condiCode: dillDimList[0].parentDimValue,
          condiComparedValue: dillDimList[0].parentDimCode.split('###')[0]
        }]
      }

      if (value.indexOf('&dilldata') === -1) {
        conditionListArr = [{
          operator: 6,
          condiType: 0,
          condiRateType: 0,
          condiCode: this.hoverId,
          condiComparedValue: value.indexOf('###') !== -1 ? value.split('###')[0] : value.split('*dillUp')[0]
        }]
      }

      const hoverAndLine = this.columnList.filter(v => {
        return v.id === this.selectId
      })
      let limit = null
      if (hoverAndLine.length !== 0) {
        if (hoverAndLine[0].showHoverLine === undefined) {
          limit = null
        } else {
          limit = hoverAndLine[0].selectHoverNumber || 5
        }
      }

      let upsetting = {}
      upsetting.type = 0
      upsetting.dimList = dimList
      upsetting.metricsList = metricsList
      upsetting.conditionListArr = conditionListArr
      upsetting.limit = limit
      upsetting.disableLoading = true

      await this.tableSearch(upsetting).then(res => {
        this.loading = false
        if (res.length === 0) {
          this.hoverTable = false
          this.$message({
            message: '此悬浮没有数据了',
            type: 'warning'
          })
        } else {
          let filterData = []
          const arr = []
          if (value.indexOf('&dilldata') === -1) {
            filterData = this.tableData.filter(item => item[this.hoverId] === value && item.number === index)
          }
          if (value.indexOf('&dilldata') !== -1) {
            filterData = this.tableData.filter(item => item[this.hoverId] === value && item.dillNumber === index)
          }
          const currentMetri = filterData.length === 0 ? '' : filterData[0][chartsOption.hoverMetricSelect]
          const _currentMetri = value.indexOf('&dilldata') !== -1 ? currentMetri.split('$dill')[0] : currentMetri
          res.map(item => {
            const splitHoverDim = item[chartsOption.hoverDim].indexOf('###') !== -1 ? item[chartsOption.hoverDim].split('###')[1] : item[chartsOption.hoverDim]
            const percentage = (item[chartsOption.hoverMetricSelect] / Number(_currentMetri)) * 100
            item.percentage = percentage > 100 ? 100 : (percentage < 0 ? 0 : percentage)
            arr.push(splitHoverDim.length)
          })
          this.hoverData = res
          this.hoverDimLength = Math.max.apply(null, arr) >= 12 ? 144 : Math.max.apply(null, arr) * 12
        }
        })
    }
  }
}
