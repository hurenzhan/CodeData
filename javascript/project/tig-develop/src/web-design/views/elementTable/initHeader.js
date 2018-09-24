export default {
  data() {
    return {
      isRatio: false,
      // 上卷下钻路径
      drillCol: null,
      drillCurrent: {
        dimCode: '',
        pathCode: '',
        name: '',
        number: 1,
        drillRoadArr: [],
        drillDimArr: [],
        drillDimValArr: [],
        total: 1,
      },
      headerColumns: [],
      headerMergeCells: [],
      headerMergeCellsOrigin: [],
      headerData: [],
      headerExport: [],
      headerStyles: {       // 表头样式表
        style1: {
          backgroundColor: '#EDFBFB',
        },
        style2: {
          backgroundColor: '#FAFCED',
        }
      }
    }
  },
  methods: {
    // 初始化表头数据
    initHeader() {
      this.source.fixedColumnsLeft = this.design.freeze.rowNumber
      if (this.design.tableHeaderActive) {
        this.source.headerRows = this.design.tableHeader.length
      } else {
        this.source.headerRows = 1
      }
      // 表头冻结配置
      if (this.design.freeze && this.design.freeze.freezeBoolean === 1) {
        this.source.fixedRowsTop = this.source.headerRows
      }
      this.handleColumns()
      if (this.design.tableHeaderActive) {
        this.headerMergeCells = JSON.parse(JSON.stringify(this.design.handsonMerge))
        this.headerMergeCellsOrigin = JSON.parse(JSON.stringify(this.headerMergeCells))
        this.source.mergeCells = this.headerMergeCells
      }
      this.source.headerStyle = this.headerStyles[this.design.style.type]
    },
    // 解析上卷下钻路径
    transformDrill() {
      const drill = this.design.drill
      if (drill && drill.dirllRoad && drill.dirllRoad.routeCode && drill.dirllRoad.routeNm
        && drill.dirllRoad.dimRoute && drill.selectedDrillItem.id && drill.selectedDrillItem.name) {
        const id = drill.selectedDrillItem.id
        this.drillCurrent.dimCode = id
        this.drillCurrent.name = drill.selectedDrillItem.name
        let routeNmArr = drill.dirllRoad.routeNm.split('-')
        const drillRoadArr = routeNmArr.reverse()
        this.drillCurrent.drillRoadArr = drillRoadArr
        const drillDimArr = drill.dirllRoad.dimRoute.split('-')
        this.drillCurrent.drillDimArr = drillDimArr.reverse()
        this.drillCurrent.pathCode = drill.dirllRoad.routeCode
        this.drillCurrent.total = drillRoadArr.length
      }
    },
    renderStyle(td, row) {
      /* 渲染表格样式 */
      // 表格全局样式 （涉及对齐方式，上下左右，上下间距，字体颜色，背景色）
      const cellStyle = this.source.cellStyle
      td.style.padding = `${cellStyle.padding} 12px`
      td.style.fontSize = cellStyle.fontSize
      td.style.textAlign = cellStyle.textAlign
      td.style.paddingTop = cellStyle.paddingTop
      td.style.paddingBottom = cellStyle.paddingBottom
      td.style.backgroundColor = cellStyle.backgroundColor
      // 表头样式
      const headerRows = this.source.headerRows
      const headerStyle = this.source.headerStyle
      if (row < headerRows) {
        td.style.backgroundColor = headerStyle.backgroundColor
        td.style.color = headerStyle.color
        td.style.textAlign = 'center'
        td.style.fontWeight = '600'
      }
    },
    // 统一处理列
    handleColumns(again) {
      this.source.mergeCells = this.headerMergeCells
      const design = this.design
      if (!again) {
        this.transformDrill()
      }
      const drillCurrent = this.drillCurrent
      // 表头列
      let columnList = JSON.parse(JSON.stringify(design.columnList))
      if (again) {
        columnList = this.headerColumns
      }
      const headerColumns = []
      const headerData = []
      const headerFirst = {}
      const columnIndex = {}
      const hiddenCol = {}
      for (let i = 0; i < columnList.length; i += 1) {
        const col = columnList[i]
        if (!again) {
          col.show = true
        }
        let id = col.id
        let name = col.name
        if (col.type === 1) {
          name = `${col.name}(${col.unitDefaultNm})`
        }
        if (col.type === 3) {
          name = `${col.name}(${design.crossMetric.unitDefaultNm})`
        }
        // 自定义列
        if (col.type === 2) {
          name = col.cusName
          // 同环比 colSetting 1  0 计算方式
          // col.ratio 1 同比值 2 同比率 3 环比值 4 环比率 5 对比值 6 对比率
          if ((col.colSetting === 1 || col.colSetting === 2) && col.id && col.ratio) {
            const metricsCode = col && col.id && col.id.split('-')[0]
            id = `${metricsCode}_${col.ratio}`
          }
          if (col.ratio === 5 || col.ratio === 6) {
            this.isRatio = true
          }
        }
        if (!col.show) {
          hiddenCol[i] = true
        }
        if (col.show) {
          columnIndex[i] = id
          headerColumns.push({
            data: id,
            renderer: (instance, td, row, colItem, prop, value) => {
              // 进行上卷下钻的行列
              // 冻结
              td.title = value
              if (this.source.fixedColumnsLeft > 0 || this.source.fixedRowsTop > 0) {
                if (value && value.length > 20) {
                  td.title = `${value}...`
                  value = value.substring(0, 20)
                }
              }
              if (col.index === this.drillCol
                && drillCurrent.drillDimArr[drillCurrent.number - 1] === id
                && (drillCurrent.number < drillCurrent.total)
                && row >= this.source.headerRows && value !== '合计') {
                const aHref = document.createElement('a')
                if (!value) {
                  value = ''
                }
                aHref.text = value
                aHref.onclick = () => {
                  this.drillNext(id, value)
                }
                td.innerHTML = ''
                td.appendChild(aHref)
              } else {
                td.innerHTML = value
              }
              // 上卷下钻表头变更在此进行
              if ((row === this.source.headerRows - 1)
                && drillCurrent.drillDimArr[drillCurrent.number - 1] === id
                && (drillCurrent.number <= drillCurrent.total)
                && (drillCurrent.number > 1)
                ) {
                td.innerHTML = drillCurrent.drillRoadArr[drillCurrent.number - 1]
              }
              this.renderStyle(td, row)
              if (col.alignDisplay) {
                // 垂直对齐 上
                if (col.alignDisplay.vertical === 1) {
                  td.style.verticalAlign = 'top'
                  td.style.height = '30px'
                }
                // 垂直对齐 居中
                if (col.alignDisplay.vertical === 2) {
                  td.style.verticalAlign = 'middle'
                }
                // 垂直对齐 下
                if (col.alignDisplay.vertical === 3) {
                  td.style.verticalAlign = 'bottom'
                  td.style.height = '30px'
                }
                // 水平对齐 左
                if (col.alignDisplay.horizontal === 4) {
                  td.style.textAlign = 'left'
                }
                // 水平对齐 中
                if (col.alignDisplay.horizontal === 5) {
                  td.style.textAlign = 'center'
                }
                // 水平对齐 右
                if (col.alignDisplay.horizontal === 6) {
                  td.style.textAlign = 'right'
                }
              }
              // 表头样式
              const headerRows = this.source.headerRows
              const headerStyle = this.source.headerStyle
              if (row < headerRows) {
                td.style.textAlign = 'center'
                td.style.backgroundColor = headerStyle.backgroundColor === '#fff' ? '#f5f5f5' : headerStyle.backgroundColor
              }
              
              td.style.border = '1px solid #e6e6e6'
              td.style.overflow = 'hidden'
              td.style.textOrderflow = 'ellipsis'
              td.style.whiteSpace = 'nowrap'
              return td
            }
          })
        }
        // 非自定义表头
        if (!design.tableHeaderActive) {
          headerFirst[id] = name
        }
      }
      this.headerColumns = columnList
      // 自定义表头
      if (design.tableHeaderActive) {
        const tableHeader = design.tableHeader
        for (let i = 0; i < tableHeader.length; i += 1) {
          const rowData = {}
          for (let j = 0; j < tableHeader[i].length; j += 1) {
            if (!hiddenCol[j]) {
              rowData[columnIndex[j]] = tableHeader[i][j]
            }
          }
          headerData.push(rowData)
        }
      } else {
        headerData.push(headerFirst)
      }
      const headerExportArr = []
      const headerKeys = Object.keys(columnIndex)
      for (let i = 0; i < headerData.length; i += 1) {
        let headerExportRow = ''
        for (let j = 0; j < headerKeys.length; j += 1) {
          headerExportRow += `${headerData[i][columnIndex[headerKeys[j]]]},`
        }
        headerExportArr.push(headerExportRow)
      }
      this.headerExport = headerExportArr
      this.source.columns = headerColumns
      this.headerData = headerData
      this.source.data = headerData
    }
  }
}
