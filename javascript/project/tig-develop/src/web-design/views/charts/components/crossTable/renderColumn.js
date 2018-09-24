import { rateTypeByMetricCode, wait } from '../../utils/utils'
import colorSetting from './static'

let rateType = 0 // 同比情况
// 根据selectedCell确定行数  不然会有bug
let dillRoute = ''
let startIndexRow = ''
// 下钻名称
let routeNm = ''
let selectRow = ''
// 获得下钻父节点的number
let number = ''
// 选中的单元格值
let value = ''
let parentRoute = '' // 最父级维度编码
let childRoute = '' // 当前下钻的维度编码
let currentRoute = '' // 当前下钻的维度编码
let currentName = ''
export default {
	methods: {
		renderStyle(td, row, v, instance, colItem) {
	    td.style.fontSize = '14px'
      if (v.type === 1 || v.type === 3) {
        td.style.textAlign = 'right'
      } else {
        td.style.textAlign = 'left'
      }
      td.style.textAlign = v.alignFlag ? v.alignFlag : td.style.textAlign
      td.style.verticalAlign = 'middle'
      td.style.paddingTop = '6px'
      td.style.paddingBottom = '6px'
      td.style.paddingLeft = '12px'
      td.style.paddingRight = '12px'
      td.style.color = '#333'

      // 表头样式
      if (row <= (this.row - 1) && this.showHeader) {
        // 有边框才有颜色
        if (this.tableBorder) {
          td.style.backgroundColor = '#E9ECEF'
        }
        td.style.textAlign = 'center'
        td.style.fontWeight = 'bold'
        td.style.height = '28px'
        td.classList.add('htCenterHeader')
      }
      // 合计只读
      if ((this.showTotal && this.totalStore === 'before') && row === this.row) {
        instance.setCellMeta(row, colItem, 'readOnly', true)
      }
      // 合计只读
      if ((this.showTotal && this.totalStore === 'after') && row === this.tableData.length - 1) {
        instance.setCellMeta(row, colItem, 'readOnly', true)
      }
      // 序号和详情居中
      if (v.id === 'number' || v.id === 'operate') {
        td.style.textAlign = 'center'
      }
    },
    renderColumns(warnData) {
      this.tablerenderer = []
      const renderColumns = []
      this.showColumn.forEach((v) => {
        renderColumns.push({
          data: v.id,
          renderer: (instance, td, row, colItem, prop, value) => {
            td.innerHTML = ''
            td.classList.add('htCenter') // 合并单元格的时候
            let showValue = ''
            if (value) {
              value = value.toString()
            }
            // let dillValue = '' // 下钻的维度id
            // let isDillLast = false // 是不是最后一级 最后一级没有小箭头
            // let isDillUp = false // 有没有收缩
            // let dillRow = false // 是不是下钻行 这里针对指标还有没有下钻的维度

            if (value && value.indexOf('#compare') !== -1) {
              // 趋势标记
              showValue = value.split('#compare')[0]
            } else if (v.dimType === '3') {
              if (value && value.indexOf('_') !== -1) {
                showValue = value.split('_')[1]
              } else {
                showValue = value
              }
            } else {
              showValue = value
            }
            // if (value && value.indexOf('*dillUp') !== -1 && value.indexOf('&dilldata') !== -1) {
            //   // 收缩并且是二级目录
            //   const valueDill = value.split('*dillUp')
            //   showValue = valueDill[0].split('&dilldata')[0] // 值
            //   dillValue = valueDill[0].split('&dilldata')[1]
            //   isDillUp = true
            //   // 这种情况好像不存在 先放着
            //   if (valueDill[0].indexOf('&last') !== -1) {
            //     dillValue = dillValue.split('&last')[0]
            //     isDillLast = true
            //   }
            // } else if (value && value.indexOf('*dillUp') !== -1 && value.indexOf('&dilldata') === -1) {
            //   // 收缩是一级目录
            //   showValue = value.split('*dillUp')[0]
            //   isDillUp = true
            // } else if (value && value.indexOf('*dillUp') === -1 && value.indexOf('&dilldata') !== -1) {
            //   // 是下钻的数据但是没有下钻
            //   showValue = value.split('&dilldata')[0]
            //   dillValue = value.split('&dilldata')[1]
            //   if (value.indexOf('&last') !== -1) {
            //     dillValue = dillValue.split('&last')[0]
            //     isDillLast = true
            //   }
            // } else if (value && value.indexOf('$dill') !== -1) {
            //   // 针对指标列的下钻数据  需要改变颜色 或不是下钻的维度列
            //   showValue = value.split('$dill')[0]
            //   dillRow = true
            // } else if (value && value.indexOf('#compare') !== -1) {
            //   // 趋势标记
            //   showValue = value.split('#compare')[0]
            // } else if (v.dimType === '3') {
            //   if (value && value.indexOf('_') !== -1) {
            //     showValue = value.split('_')[1]
            //   } else {
            //     showValue = value
            //   }
            // } else {
            //   showValue = value
            // }
             // 维值显示方式
            if (v.type === 0) {
              if (v.howDimValueShow === 'dimAndCode') {
                showValue = showValue &&showValue.replace(/###/g, '_')
              } else if (v.howDimValueShow === 'code') {
                showValue = showValue.indexOf('###') !== -1? showValue.split('###')[0] : showValue
              } else if (v.howDimValueShow === 'dim') {
                showValue = showValue.indexOf('###') !== -1? showValue.split('###')[1] : showValue
              } else {
                showValue = showValue && showValue.replace(/###/g, '_')
              }
            }
            let relaRow = ''
            if (this.showHeader) {
              relaRow = this.row
            } else {
              relaRow = 0
            }
            if(this.showTotal === true && this.totalStore === 'before' && this.currentPage === 1){
              relaRow = relaRow + 1
            }

            let numberArea = '' // 有没有合计列 合计列不用渲染
            if (this.showTotal && this.totalStore === 'after' && this.currentPage === 1) {
              numberArea = this.tableData.length - 1
            } else {
              numberArea = this.tableData.length
            }

            // if (!v.superUrl || row < relaRow) {
              const spanValueInnerHtml = document.createElement('span')
              // 图片列超过30个字符截断
              if (v.dimType === '3' && showValue && v.id === 'PD_WD_0005') {
                const spanWareCode = document.createElement('span')
                const wareWrap = document.createElement('div')
                if (showValue.length > 10) {
                  spanValueInnerHtml.innerHTML = showValue
                  td.title = showValue
                } else {
                  spanValueInnerHtml.innerHTML = showValue
                }
                wareWrap.style.display = 'inline-block'
                wareWrap.style.verticalAlign = 'middle'
                spanWareCode.innerHTML = '商品编号:' + value.split('_')[0]
                spanWareCode.style.display = 'block'
                spanWareCode.style.color = '#999'
                wareWrap.append(spanValueInnerHtml)
                wareWrap.append(spanWareCode)
                td.append(wareWrap)
              } else {
                spanValueInnerHtml.innerHTML = showValue
                td.appendChild(spanValueInnerHtml)
              }
            // }
            this.renderStyle(td, row, v, instance, colItem) // 渲染样式

            // 列颜色需要和其他功能区分开
            if (row >= this.row && row < this.tableData.length) {
              // 列颜色配置
              if (v.colColor !== '') {
                td.style.backgroundColor = colorSetting.backColor[v.colColor]
              } else {
                td.style.backgroundColor = 'white'
              }
              // 列颜色字体
              if (v.fontColor && v.fontColor !== '') {
                td.style.color = colorSetting.fontColor[v.fontColor]
              }
            }

            if (row >= relaRow && row < numberArea) { // 数据区域
              if(v.showGrowth && value){
                if (value.slice(0,1) === '-') {
                  const spanImg = document.createElement('span')
                  spanImg.classList.add('growth-down')
                  spanImg.setAttribute('trenDown', 'trenDown')
                  td.appendChild(spanImg)
                }
              }

              // 不是下钻的数据
              if (v.trend && value && row < numberArea && value.indexOf('#compare') !== -1) {
                // 趋势标记 下降
                const compareValue = value.split('#compare')[1]
                if (Number(compareValue) < 0) {
                  const spanImg = document.createElement('span')
                  spanImg.classList.add('trend-down')
                  spanImg.setAttribute('trenDown', 'trenDown')
                  td.appendChild(spanImg)
                }
                // 趋势标记 持平
                if (Number(compareValue) == 0 && value.split('#compare')[0] !== '') {
                  const spanImg = document.createElement('span')
                  spanImg.classList.add('trend-tied')
                  spanImg.setAttribute('trenTied', 'trenTied')
                  td.appendChild(spanImg)
                }
                // 趋势标记 上升
                if (Number(compareValue) > 0) {
                  const spanImg = document.createElement('span')
                  spanImg.classList.add('trend-up')
                  spanImg.setAttribute('trenUp', 'trenUp')
                  td.appendChild(spanImg)
                }
                if (this.trendAddPercent) {
                  if(value.split('#compare')[0] !== ''){
                    const spanTrendValue = document.createElement('span')
                    spanTrendValue.innerHTML = (Math.ceil(Number(compareValue) * 10000)/100) + '%'
                    spanTrendValue.classList.add('trend-value')
                    td.appendChild(spanTrendValue)
                  }
                }
              }
              instance.setCellMeta(row, colItem, 'readOnly', true)
            } else if (row >= (this.row - 2)) { // 表头样式
              let renderRow = ''
              if (this.isSplit) {
                renderRow = this.row - 2
              } else {
                renderRow = this.row - 1
              }

              if (renderRow === row) {
                // 表头值
                td.innerHTML = ''
                const spanValueInnerHtml = document.createElement('span')
                spanValueInnerHtml.innerHTML = showValue
                td.appendChild(spanValueInnerHtml)
                const sortDiv = document.createElement('div')
                sortDiv.classList.add('arrow-wrapper')
                sortDiv.setAttribute('sort', 'sort')
                if (v.sort) {
                  if (v.sortType !== 'up') {
                    // 升序箭头
                    const spanSortUp = document.createElement('span')
                    spanSortUp.classList.add('up-arrow')
                    spanSortUp.onclick = () => {
                      this.sortColumn(v.id, 'up')
                    }
                    sortDiv.appendChild(spanSortUp)
                    td.appendChild(sortDiv)
                  }
                  if (v.sortType === 'up') {
                    // 升序激活箭头
                    const spanSortUpActive = document.createElement('span')
                    spanSortUpActive.classList.add('up-arrow-active')
                    sortDiv.appendChild(spanSortUpActive)
                    td.appendChild(sortDiv)
                  }
                  if (v.sortType !== 'down') {
                    // 降序箭头
                    const spanSortDown = document.createElement('span')
                    spanSortDown.classList.add('down-arrow')
                    spanSortDown.onclick = () => {
                      this.sortColumn(v.id, 'down')
                    }
                    sortDiv.appendChild(spanSortDown)
                    td.appendChild(sortDiv)
                  }
                  if (v.sortType === 'down') {
                    // 降序箭头
                    const spanSortDownActive = document.createElement('span')
                    spanSortDownActive.classList.add('down-arrow-active')
                    sortDiv.appendChild(spanSortDownActive)
                    td.appendChild(sortDiv)
                  }
                }
              } else {
                td.innerHTML = value
              }
            } else {
              td.innerHTML = value
            }
            td.classList.add('htCenter')
            return td
          }
        })
      })
      this.tablerenderer = renderColumns // 整个表格的渲染方法
    },
    // 计算表格高度
    calTableHeight(hasName = true) {
      // 计算更多维度和更多指标纵向
      let gridWidth = document.getElementsByClassName(`grid-item-${this.index}`)[0]
      if (this.moreDim && this.moreMetric) {
        const dimAndMetric = 640
        if (gridWidth.offsetWidth < dimAndMetric) {
          this.dimAndMetricSmall = true
        } else {
          this.dimAndMetricSmall = false
        }
      }
      this.$nextTick(() => {
        // 有滚动条高度所以要加8 wtHolder
        if (this.hot) {
          const handsontableDom = document.getElementById(this.hansontableProId)
          const nameToggle = this.chartsOption[this.index].nameToggle
          let containerHeight = handsontableDom.parentNode.parentNode.parentNode.style.height
          let numHeight = ''
          // debugger
          // 判断是否开启了分页
          if (nameToggle) {
            numHeight = 108
          } else {
            numHeight = 68
          }
          // 没有分页的时候上下16px
          if (this.totalPages === 1 && nameToggle) {
            numHeight = 72
          }
          if (this.totalPages === 1 && !nameToggle) {
            numHeight = 32
          }

          containerHeight = containerHeight.substr(0, containerHeight.length - 2) - numHeight
          let tableHeight = containerHeight
          // 判断是否有告警
          // debugger
          // if (this.moreDim || this.moreMetric) {
          //   const moreWrap = document.querySelector(`.${this.tableWrapperIndex} .moreWrap`).offsetHeight
          //   tableHeight = containerHeight - moreWrap
          // } else {
          //   tableHeight = containerHeight
          // }
          // if ( this.moreDimSingle) {
          //   const dimSingle = document.querySelector(`.${this.tableWrapperIndex} .more-dim-single`).offsetHeight
          //   tableHeight = tableHeight - dimSingle
          // }
          let tableRenderHeight = document.querySelector(`.grid-item-${this.index} .wtSpreader`).offsetHeight + 8
          let offseWidth = document.querySelector(`.grid-item-${this.index} .wtHolder`).style.width.replace('px', '')
          let tableWidth = document.querySelector(`.grid-item-${this.index} .wtHider`).style.width.replace('px', '')
          let exportAndPaginate = document.querySelector(`.grid-item-${this.index} .paginationWrapper`)

          if (gridWidth) {
            let width = gridWidth.offsetWidth - 32
            this.hot.updateSettings({
              width: width,
            })
          }
          if (Number(tableRenderHeight) < Number(tableHeight)) {
            this.hot.updateSettings({
              height: tableRenderHeight,
            })
            if (exportAndPaginate) {
              if (Number(tableWidth) > Number(offseWidth)) {
                exportAndPaginate.style.paddingTop = '8px'
              } else {
                exportAndPaginate.style.paddingTop = '2px'
              }
            }
          } else {
            this.hot.updateSettings({
              height: tableHeight,
            })
            if (exportAndPaginate) {
              exportAndPaginate.style.paddingTop = '8px'
            }
          }
          // this.hot.render()
        }
      })
    },
    // 解决横向滚动条的问题，当容器宽度大于等于表格实际宽度时候就禁掉，否则就放出来
    calTableScroll() {
      this.$nextTick(() => {
        // wait(0.2).then(() => {
          const tableContainer = document.querySelector(`#${this.hansontableProId}`) //滚动条距顶端的距
          if (this.hot && tableContainer) {
            const tableChild = tableContainer.firstChild.firstChild
            const grandSonChild = tableChild.firstChild
            const gridContainer = tableContainer.parentNode.parentNode.parentNode
            if (gridContainer.offsetWidth - 24 < grandSonChild.offsetWidth) {
              tableChild.style.overflowX = 'auto'
            } else {
              tableChild.style.overflowX = 'hidden'
            }
          }
        // }).catch(() => {})
      })
    }
	}
}