export default {
  data() {
    return {
      dimListTemp: {}, // 存储变化的dimList
      mergeCodeList: [],
      mergeCells: {}, // 合并的设置
      tableHead: [],
      // 报表数据
      tableData: [],
      loadingTableData: false,
      // 分页设置
      tablePage: {},
      paging: {
        total: 0,
        page: 1,
        pages: 0,
      }
    }
  },
  methods: {
    // 初始化表格
    initTable() {
      const custom = this.design && this.design.style && this.design.style.custom
      if (custom) {
        this.source.cellStyle = {
          padding: `${custom.spacing}px`,
          fontSize: `${custom.fontSize}px`,
          backgroundColor: custom.bgColor
        }
      }
    },
    // 本地分页
    changePage(bool, isPage) {
      let page = this.paging.page
      const total =  this.paging.total % this.design.pageSize === 0 ?  ( this.paging.total / this.design.pageSize) : parseInt(( this.paging.total / this.design.pageSize)) + 1
      if (bool && this.paging.page < total) {
        page = this.paging.page += 1
      } 
      if (!bool && this.paging.page > 1) {
        page = this.paging.page -= 1
      }
      if (isPage  && this.tempPage > 0 && this.tempPage < total) {
        page = this.tempPage
      }
      if (isPage && this.tempPage < 0 && this.tempPage > total) {
        this.tempPage = page
      }
      this.paging.page = page
      this.source.data = this.headerData.concat(this.tablePage[page])
      if (this.mergeCells[page]) {
        if (this.design.tableHeaderActive) {
          this.source.mergeCells = this.headerMergeCells.concat(this.mergeCells[page])
        } else {
          this.source.mergeCells = this.mergeCells[page]
        }
      }
      this.$refs.htable.updateTable()
    },
    // 维度切分 - 展示
    triggerDim(item) {
      if (item.show) {
        item.show = false
        this.dimListTemp[item.id] = false
      } else {
        item.show = true
        this.dimListTemp[item.id] = true
      }
      const dimListOrigin = JSON.parse(JSON.stringify(this.dimListOrigin))
      const arr = []
      for (let i = 0; i < dimListOrigin.length; i += 1) {
        const el = dimListOrigin[i]
        if (this.dimListTemp[el.dimId]) {
          arr.push(el)
        }
      }
      this.filter.dimList = arr

      // 表头合并的配置
      const headerMergeCells = JSON.parse(JSON.stringify(this.headerMergeCellsOrigin))
      const headerColumns = this.headerColumns
      for (let j = 0; j < headerColumns.length; j += 1) {
        const headerCol = headerColumns[j]
        let headerColPre = null
        if (j > 0) {
          headerColPre = headerColumns[j - 1]
        }
        for (let i = 0; i < headerMergeCells.length; i += 1) {
          const mergeCell = headerMergeCells[i]

          if (!headerCol.show) {
            let colIndex = JSON.parse(JSON.stringify(j))
            if (headerColPre && !headerColPre.show) {
              colIndex -= 1
            }
            // 被隐藏列，在合并列的起止之间
            if (colIndex >= mergeCell.col && colIndex < (mergeCell.col + mergeCell.colspan)) {
              mergeCell.colspan -= 1
            }
            // 被隐藏列, 整列被移除
            if (mergeCell.col === colIndex && mergeCell.colspan === 1 && mergeCell.rowspan > 1) {
              // mergeCell.rowspan = 1
              mergeCell.colspan = 1
            }
            // 序号在合并列之前
            if (colIndex < mergeCell.col) {
              mergeCell.col -= 1
            }
          }
        }
      }
      const hArr = []
      for (let i = 0; i < headerMergeCells.length; i += 1) {
        const headerMergeCell = headerMergeCells[i]
        if (headerMergeCell.colspan && headerMergeCell.rowspan) {
          hArr.push(headerMergeCell)
        }
      }
      this.headerMergeCells = hArr
      const mergeCodeList = []
      for (let j = 0; j < this.mergeCodeList.length; j += 1) {
        const mergeCode = this.mergeCodeList[j]
        for (let i = 0; i < this.headerColumns.length; i += 1) {
          const headerCol = this.headerColumns[i]
          if (mergeCode === headerCol.id && headerCol.show) {
            mergeCodeList.push(mergeCode)
          }
        }
      }
      this.filter.mergeCodeList = mergeCodeList
      // sumCodeList
      const sumCodeList = []
      for (let j = 0; j < this.sumCodeList.length; j += 1) {
        const mergeCode = this.sumCodeList[j]
        for (let i = 0; i < this.headerColumns.length; i += 1) {
          const headerCol = this.headerColumns[i]
          if (mergeCode === headerCol.id && headerCol.show) {
            sumCodeList.push(mergeCode)
          }
        }
      }
      this.filter.sumCodeList = sumCodeList
      this.handleColumns(1)
      this.searchData()
    }
  }
}
