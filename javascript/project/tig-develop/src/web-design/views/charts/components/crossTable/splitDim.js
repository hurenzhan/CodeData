export default {
	methods: {
		splitColumnList() {
      const columnList = []
      // 未拆分的指标列
      const noSplitMetric = this.metricListFlat.filter(v => v.metricCode !== this.splitMetricList[0].id)
      // push维度列 维度在指标前面
      this.columnList.filter(v => v.type === 0).forEach((v, i) => {
        columnList.push(v)
      })
      let colMetricIdArr = []
      this.columnList.filter(v => v.type ===1 || v.type ===3).map(v => {
        colMetricIdArr.push(v.id)
      })
      this.metricListFlat.map(v =>{
        if (colMetricIdArr.includes(v.metricCode)) {
          if (v.metricCode === this.splitMetricList[0].id) {
            this.dimListValueSelectLable.forEach((vd, i) => {
              if(colMetricIdArr.includes(vd.value)){
                columnList.push(this.columnList.filter(vc => vc.id === vd.value)[0])
              }else{
                columnList.push({
                  id: vd.value,
                  name: vd.label,
                  colColor: '', // 列颜色
                  fontColor: '',
                  trend: false, // 趋势标记
                  sort: false, // 是否排序
                  type: 3, // 维值类型
                  sortType: '', // 排序类型
                  alignFlag: 'right',
                  showGrowth: false
                })
              }
            })
          } else {
            columnList.push(this.columnList.filter(vc => vc.id ===v.metricCode)[0])
          }
        }else{
          if (v.metricCode !== this.splitMetricList[0].id) {
            columnList.push({
              id: v.metricCode,
              name: v.metricName,
              colColor: '', // 列颜色
              fontColor: '',
              trend: false, // 趋势标记
              sort: false, // 是否排序
              type: 1, // 指标类型
              sortType: '', // 排序类型
              decimals: 2, // 数值格式 默认为2
              percentType: 0, // 百分比 0数值,1百分比
              thousands: true, // 千分位
              alignFlag: 'right',
              showGrowth: false
            })
          } else {
            this.dimListValueSelectLable.forEach((vd, i) => {
              if (colMetricIdArr.includes(vd.value)) {
                columnList.push(this.columnList.filter(vc => vc.id ===vd.value)[0])
              } else {
                columnList.push({
                  id: vd.value,
                  name: vd.label,
                  colColor: '', // 列颜色
                  fontColor: '',
                  trend: false, // 趋势标记
                  sort: false, // 是否排序
                  type: 3, // 维值类型
                  sortType: '', // 排序类型
                  alignFlag: 'right',
                  showGrowth: false
                })
              }
            })
          }
        }
      })
      this.columnList = columnList
      // 将columnList存到vuex中
      this.$store.commit('saveConfig', {
        index: this.index,
        name: 'columnList',
        columnList: columnList
      })
		},
    // 多维单指标拆分
		splitHansonMerge() {
			const dimListFilter = this.moreDimList
			const handsonMerge = []

      let colStart = 0
      // 维度的合并 横向变为两个
      dimListFilter.forEach((v, i) => {
        handsonMerge.push({
          row: this.row - 2,
          col: i + colStart,
          rowspan: 2,
          colspan: 1
        })
      })
      // 其余没有拆分的指标
      let startSplitCol = 0,isFirstSplit = true
      this.showColumn.forEach((v, i) => {
        if (v.id !== this.splitMetricList[0].id && v.type === 1) {
          handsonMerge.push({
            row: this.row - 2,
            col: i,
            rowspan: 2,
            colspan: 1
          })
        }else if(v.type === 3 && isFirstSplit){
          startSplitCol = i
          isFirstSplit = false
        }
      })
      // 维值的合并
      handsonMerge.push({
        row: this.row - 2,
        col: colStart + startSplitCol,
        rowspan: 1,
        colspan: this.dimListValueSelectLable.length
      })     
      this.handsonMerge = handsonMerge
		},
    saveTableHeader() {
      const dimListFilter = this.showColumn.filter(v => v.type === 0)
      // 未拆分的指标
      const noSplitMetric = this.showColumn.filter(v => v.type === 1).filter(v => v.id !== this.splitMetricList[0].id)
      let splitName = ''
      this.metricListFlat.forEach(v => {
        if (v.metricCode === this.splitMetricList[0].id) {
          splitName =  v.metricName
        }
      })
      // 当有表格头时才保存表格头的一些数据
      if (this.showHeader) {
        // 维度
        for (let i = 0; i < dimListFilter.length; i += 1) {
          let dim2 = this.tableData[this.row - 2][dimListFilter[i].id]
          if (dim2 && dim2 !== '') {
          } else {
            this.tableData[this.row - 2][dimListFilter[i].id] = dimListFilter[i].name
          }
          let dim1 = this.tableData[this.row - 1][dimListFilter[i].id]
          if (dim1 && dim1 !== '') {
          } else {
            this.tableData[this.row - 1][dimListFilter[i].id] = dimListFilter[i].name
          }          
        }
        // 其余未拆分的指标
        for (let i = 0; i < noSplitMetric.length; i += 1) {
          let metric2 = this.tableData[this.row - 2][noSplitMetric[i].id]
          if (metric2 && metric2 !== '') {
          } else {
            this.tableData[this.row - 2][noSplitMetric[i].id] = noSplitMetric[i].name
          }
          let metric1 = this.tableData[this.row - 1][noSplitMetric[i].id]
          if (metric1 && metric1 !== '') {
          } else {
            this.tableData[this.row - 1][noSplitMetric[i].id] = noSplitMetric[i].name
          }           
        }
        // 指标值
        let dimlable = this.tableData[this.row - 2][this.dimListValueSelectLable[0].value]
        if (dimlable && dimlable !== '') {

        } else {
          this.tableData[this.row - 2][this.dimListValueSelectLable[0].value] = splitName
        }
        if (this.hot) {
          this.hot.updateSettings({
            data: this.tableData
          }) 
        }        
      }    
    }
	}
}