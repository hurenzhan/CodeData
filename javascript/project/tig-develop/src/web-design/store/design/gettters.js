// getters
const getters = {
  getSelectedColumn: state => state.selectedColumn,
  getDesignState: state => state.designState,
  getReportName: state => state.reportName,
  getDim: state => state.dim,
  getMetric: state => state.metric,
  getExportData: state => state.exportData,
  getStyle: state => state.style,
  getFreeze: state => state.freeze,
  getAlign: state => state.align,
  getFormatter: state => state.formatter,
  getColumnList: state => state.columnList,
  getFilterList: state => state.filterList,
  getSorter: state => state.sorter,
  getSubtotal: state => state.subtotal,
  getCustomColumn: state => state.customColumn,
  getDrill: state => state.drill,
  getTableHeader: state => state.tableHeader,
  getCell: state => state.cell,
  getHandsonMerge: state => state.handsonMerge
}

export default getters
