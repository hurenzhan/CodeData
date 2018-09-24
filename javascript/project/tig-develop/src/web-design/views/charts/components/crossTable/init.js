import { rateTypeByMetricCode, calcMetricFeature } from '../../utils/utils'
import _uniqBy from 'lodash.uniqby'
import bus from '../../utils/eventBus'
// import { initTableBorder } from './utils'

export default {
	methods: {
		allDataRenderAndBar(data) {
			// 如果初始化有新增列显示条形图
			// 获得前一列数据 append到所有数据中
      const addAllData = []
      // 重新组织数据
      for (let i = 0; i < this.allData.length; i += 1) {
        const lastLine = {}
        this.columnList.forEach((v, index) => {
          if (v.id === 'number') {
            lastLine[v.id] = i + 1
          } else if (v.id === 'operate') {
            // if (this.jumpDeatil) {
            //   lastLine[v.id] = ''
            // }
          } else if (v.id.indexOf('bar') !== -1) {
          	const barId = v.id.replace('bar', '')
            lastLine[v.id] = this.allData[i][barId]
          } else {
            lastLine[v.id] = this.allData[i][v.id]
          }
        })
        addAllData.push(lastLine)
      }
      this.allData = addAllData
		},
		initStyle() {
      const chartsOption = this.chartsOption[this.index].feature.styleConfig
      Object.keys(chartsOption).forEach(v => {
        if (chartsOption[v] !== undefined) {
          this[v] = chartsOption[v]
        }
        if(v === 'currentPage'){
          this[v] = 1
        }
      })
      if (this.pageSize === 0) {
        this.isPage = false
      }
      // 拆分兼容处理
      this.isSplit = this.isSplit || this.isSingleSplit || this.isManySplit ? true : false
      this.$store.commit('crossSaveConfig', {
        index: this.index,
        name: 'isSplit',
        isSplit: this.isSplit
      })  
		}
  }
}