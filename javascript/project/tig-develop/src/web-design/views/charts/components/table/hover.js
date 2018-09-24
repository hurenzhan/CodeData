import _debounce from 'lodash.debounce'
import Vue from 'vue'
import bus from '../../utils/eventBus'

export default {
	methods: {
		// 处理hover表格的数据，有个防抖操作
		hoverBarShowChange: _debounce(function () {
			this.hoverBarShowData(this.hoverValue)
    }, 1000),
    async hoverBarShowData(showValue) {
      document.querySelector(`.grid-item-${this.index}`).style.overflow = 'visible'
    	// 指标 可以是同比，环比
			const metri = this.metricList.filter(v => v.metricCode === this.hoverMetricSelect)
			// 条形图的指标
			const metriBar = this.metricList.filter(v => v.metricCode === this.hoverBarSelect)
			// 维度
			const dim = this.dimList.filter(v => v.dimCode === this.hoverDim)
      const dimList = {
        dimId: dim[0].dimCode,
        dimName: dim[0].dimName
      }
			const dimName = this.dimList.filter(v => v.dimCode === this.hoverId)
			const conditionListArr = [{
        condiCode: this.hoverId,
        condiType: 0,
        operator: 6,
        condiRateType: 0,
        condiComparedValue: showValue.split('###')[0]
			}]
			const metricsList = []
			metricsList.push({
				metricsCode: metri[0].metricCode,
        label: metri[0].metricName,
        decimals: 2,
        rateType: 0,
        compareType: 0,
        thousands: false
			})
			metricsList.push({
				metricsCode: metriBar[0].metricCode,
        label: metriBar[0].metricName,
        decimals: 2,
        rateType: 0,
        compareType: 0,
        thousands: false
			})
			let upsetting = {}
			upsetting.dimList = dimList
			upsetting.conditionListArr = conditionListArr
			upsetting.metricsList = metricsList
			upsetting.type = 3

			const data = await this.tableSearch(upsetting)
      let sortList = []
      sortList.push({
        attrCode: this.hoverBarSelect,
        attrType: 1,
        sortType: 1
      })
      // type可能是交叉表的情况没有考虑
      // if (this.hoverBarSelect in this.allMax) {

      // } else {
        upsetting.sortList = sortList
        const dataMax = await this.tableSearch(upsetting)
        this.allMax[this.hoverBarSelect] = dataMax[0][this.hoverBarSelect]
        this.$store.commit('saveConfig', {
          index: this.index,
          name: 'allMax',
          allMax: this.allMax
        })
      // }
			this.dealData(data)
			// 图形显示
			this.hoverTable = true
			const wrapper = document.querySelector(`.grid-item-${this.index}`)
      const hoverTable = document.querySelector(`#${this.hoverTableIndex}`)
			hoverTable.style.left = this.eventClient.clientX - wrapper.offsetLeft + 'px'
			hoverTable.style.top = this.eventClient.clientY - wrapper.getBoundingClientRect().top - 40 + 'px'
      // debugger
    },
    dealData(data) {
    	data.forEach(v => {
        // 处理数据
    		Object.keys(v).forEach(item => {
          if (item === this.hoverBarSelect) {
            const itemValue = parseInt(Number(v[item]))
            const maxValue = parseInt(Number(this.allMax[this.hoverBarSelect]))
            if (itemValue === 0 && maxValue === 0) {
              v[item] = 100
            } else {
              v[item] = ((itemValue / maxValue) * 100)
            }
            if (v[item] < 1 && v[item] !== 0) {
              v[item] = 1
            }
            v[item] = v[item].toString().substring(0, 3)
          } else {
            v[item] = v[item]
          }
    		})
      })
    	this.hoverData = data
    },
	}
}
