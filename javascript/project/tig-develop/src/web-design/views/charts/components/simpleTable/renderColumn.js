import colorSetting from './static'
import { getMetricCode } from '../../utils/utils'

// 根据selectedCell确定行数  不然会有bug
let startIndexRow = ''
// 获得下钻父节点的number
let number = ''
// 选中的单元格值
let value = ''
// const dillDimVuex = this.chartsOption[this.index].feature.styleConfig.dillDim || ''
export default {
	methods: {
		renderStyle (td, row, v, instance, colItem) {
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
      if (row <= (this.row - 1)) {
        // 有边框才有颜色
        if (this.tableBorder) {
          td.style.backgroundColor = '#E9ECEF'
        }
        td.style.textAlign = 'center'
        td.style.fontWeight = 'bold'
        td.style.height = '28px'
        td.classList.add('htCenterHeader')
      }
      if (row === (this.row - 1)) {
        instance.setCellMeta(row, colItem, 'readOnly', true)
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
      if (v.id === 'number' || v.id === 'operate' || v.id === 'ranking') {
        td.style.textAlign = 'center'
      }
    },
    renderColumns () {
      this.tablerenderer = []
      const renderColumns = []
      this.showColumn.forEach((v) => {
        renderColumns.push({
          data: v.id,
          renderer: (instance, td, row, colItem, prop, value) => {
            td.innerHTML = ''
            td.classList.add('htCenter') // 合并单元格的时候
            let saveShowValue = ''
            let showValue = ''
            if (value) {
              value = value.toString()
            }
            let dillValue = '' // 下钻的维度id
            let isDillUp = false // 有没有收缩

            if (value && value.indexOf('*dillUp') !== -1 && value.indexOf('&dilldata') !== -1) {
              // 收缩并且是二级目录
              const valueDill = value.split('*dillUp')
              showValue = valueDill[0].split('&dilldata')[0] // 值
              dillValue = valueDill[0].split('&dilldata')[1]
              isDillUp = true
              // 这种情况好像不存在 先放着
              if (valueDill[0].indexOf('&last') !== -1) {
                dillValue = dillValue.split('&last')[0]
                isDillLast = true
              }
            } else if (value && value.indexOf('*dillUp') !== -1 && value.indexOf('&dilldata') === -1) {
              // 收缩是一级目录
              showValue = value.split('*dillUp')[0]
              isDillUp = true
            } else if (value && value.indexOf('*dillUp') === -1 && value.indexOf('&dilldata') !== -1) {
              // 是下钻的数据但是没有下钻
              showValue = value.split('&dilldata')[0]
              dillValue = value.split('&dilldata')[1]
              if (value.indexOf('&last') !== -1) {
                dillValue = dillValue.split('&last')[0]
                isDillLast = true
              }
            } else if (value && value.indexOf('$dill') !== -1) {
              // 针对指标列的下钻数据  需要改变颜色 或不是下钻的维度列
              showValue = value.split('$dill')[0]
              // dillRow = true
            } else if (value && value.indexOf('#compare') !== -1) {
              // 趋势标记
              showValue = value.split('#compare')[0]
            } else {
              showValue = value
            }
            // 维值显示方式
            if (v.type === 0) {
              if (v.howDimValueShow === 'dimAndCode') {
                showValue = showValue && showValue.replace(/###/g, '_')
              } else if (showValue && v.howDimValueShow === 'code') {
                showValue = showValue.indexOf('###') !== -1? showValue.split('###')[0] : showValue
              } else if (showValue && v.howDimValueShow === 'dim') {
                showValue = showValue.indexOf('###') !== -1? showValue.split('###')[1] : showValue
              } else {
                showValue = showValue && showValue.replace(/###/g, '_')
              }
            }
            saveShowValue = showValue

            let relaRow = 1
            if (this.showTotal === true && this.totalStore === 'before' && this.currentPage === 1) {
              relaRow = relaRow + 1
            }

            let numberArea = '' // 有没有合计列 合计列不用渲染
            if (this.showTotal && this.totalStore === 'after' && this.currentPage === 1) {
              numberArea = this.tableData.length - 1
            } else {
              numberArea = this.tableData.length
            }
            // value值
            // if (row < relaRow) {
              const spanValueInnerHtml = document.createElement('span')
              // 图片列超过30个字符截断
              if (v.dimType === '3' && showValue && v.id === 'PD_WD_0005') {
                if (row >= relaRow && row < numberArea) {
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
                  spanWareCode.innerHTML = '商品编号:' + value.split('###')[0]
                  spanWareCode.style.display = 'block'
                  spanWareCode.style.color = '#999'
                  wareWrap.append(spanValueInnerHtml)
                  wareWrap.append(spanWareCode)
                  td.append(wareWrap)
                } else {
                  spanValueInnerHtml.innerHTML = showValue
                  td.appendChild(spanValueInnerHtml)
                }
              } else {
                spanValueInnerHtml.innerHTML = showValue
                td.appendChild(spanValueInnerHtml)
              }
            // }
            this.renderStyle(td, row, v, instance, colItem) // 渲染样式

            // 列颜色需要和其他功能区分开
            if (row >= 1) {
              // 列颜色字体
              if (v.fontColor && v.fontColor !== '') {
                td.classList.add(v.fontColor)
              }
              // 悬浮内容
              if (v.hover && v.hoverType === 0) {
                td.title = showValue
                td.style.color = '#51b1ff'
                td.style.cursor = 'pointer'
              } else if (!v.hover && v.hoverType === 0 && v.dimType !== '3') {
                td.title = ''
              }
            }
            if (row >= relaRow && row < numberArea) { // 数据区域
              // 联动时的小手
              if (this.linkPointer && v.type === 0) {
                td.style.cursor = 'pointer'
              }
              // 条形图还是柱状图
              if (v.numberOrbar === 'bar' && row <= numberArea) {
                if (td.childNodes.length !== 0) {
                  td.removeChild(td.childNodes[0])
                }
                // 条形图算的是占比
                const barDiv = document.createElement('span')
                barDiv.setAttribute('bar', 'bar')
                barDiv.classList.add('barDiv')
                let barValue = showValue
                let realId = v.id // 新增列id要处理一下
                // 千分位处理一下
                if (showValue && showValue.toString().indexOf(',') > 0) {
                  barValue = showValue.toString().replace(/,/g, "")
                }

                // 百分比处理一下
                if (showValue && showValue.toString().indexOf('%') > 0) {
                  barValue = Number(barValue.toString().replace("%", "")) / 100
                }
                if (realId.indexOf('bar') > 0) {
                  realId = realId.substring(0, realId.length - 3)
                }
                // 不足1px的用1px
                barValue = Number(barValue)
                // let proportion = v.trend ? (Math.abs(barValue) / Number(this.calcMaxMetric(realId))) * 90 : (Math.abs(barValue) / Number(this.calcMaxMetric(realId))) * 100
                let proportion = Math.abs(barValue) / Number(this.calcMaxMetric(realId)) * 90

                barDiv.style.width = this.trendAddPercent ? (proportion * 0.5) + '%' : proportion + '%'
                barDiv.innerHTML = ''
                td.appendChild(barDiv)
              }
              // 不是下钻的数据
              if (v.trend && value && value.indexOf('#compare') !== -1) {
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
                  if (value.split('#compare')[0] !== '') {
                    const spanTrendValue = document.createElement('span')
                    spanTrendValue.innerHTML = (Math.ceil(Number(compareValue) * 10000)/100) + '%'
                    spanTrendValue.classList.add('trend-value')
                    td.appendChild(spanTrendValue)
                  }
                }
              }
              // 列没有悬浮条形图
              if (this.hoverTable && v.hoverType === 0) {
                this.hoverTable = false
              }
              // 悬浮内容
              if (v.hoverType === 1) {
                spanValueInnerHtml.style.cursor = 'pointer'
                spanValueInnerHtml.style.color = '#51A6FF'
                spanValueInnerHtml.addEventListener('mouseenter', function (e) {
                  this.eventClient = e
                  this.hoverValue = value
                  this.hoverTitle = showValue
                  this.hoverIndex = row
                  this.hoverId = v.id
                  this.hoverData = []
                  this.hoverTable = true
                  this.loading = true
                  this.hoverBarShowChange()
                  this.$nextTick(() => {
                    // 图形显示
                    const wrapper = document.querySelector(`.grid-item-${this.index}`)
                    const hoverTable = document.querySelector(`#${this.hoverTableIndex}`)
                    if (wrapper !== null && hoverTable !== null) {
                      wrapper.style.overflow = 'visible'
                      hoverTable.style.left = this.eventClient.clientX - wrapper.offsetLeft + 'px'
                      hoverTable.style.top = this.eventClient.clientY - wrapper.getBoundingClientRect().top - 30 + 'px'
                    }
                  })
                }.bind(this), false)
              } else {
                spanValueInnerHtml.onmouseenter = null
              }
              // 详情
              if (v.id === 'operate') {
                let selectedReport, selectedReportVersion, selectedDimCode, selectedDimName, selectedDimValue, selectedDimValueNm
                selectedReport = this.chartsOption[this.index].detailSelectedReport
                selectedReportVersion = this.chartsOption[this.index].detailSelectedReportVersion
                this.chartsOption[this.index].feature.dimList.map(item => {
                  if (this.chartsOption[this.index].detailFilter === item.dimCode) {
                    selectedDimCode = item.dimCode
                  }
                })
                let detailFilterParmas = {
                  reportId: selectedReport,
                  versionId: selectedReportVersion
                }
                if (selectedDimCode) {
                  detailFilterParmas.dimCode = selectedDimCode
                  detailFilterParmas.dimValue = this.tableData[row][selectedDimCode]
                }
                let routeData = this.$router.resolve({
                  path:'/visual',
                  query: detailFilterParmas
                })
                td.innerHTML = ''
                // const html = `<div class="table-icon-add" style="cursor:pointer;"><img src="/static/charts/images/table-add.png"><span style="color:#51A6FF;">添加</span></div><div class="table-icon-detail" style="cursor:pointer;"><img src="/static/charts/images/table-detail.png"><span style="color:#51A6FF">详情</span></div>`
                let html = ""
                if (selectedReport && selectedReportVersion) {
                  html = '<div class="table-icon-detail" style="cursor:pointer;"><a style="color:#51A6FF" target="_blank" href="'+routeData.href.replace(/%23%23%23/g,'###')+'">详情</a></div>'
                } else {
                  html = '<div class="table-icon-detail" style="cursor:pointer;"><span>未配置</span></div>'
                }
                const spanDetail = document.createElement('div')
                spanDetail.className = 'table-operator'
                spanDetail.innerHTML = html
                // 下钻的颜色设置
                if (this.tableData[row]['number'].toString().indexOf('.') !== -1) {
                  td.style.backgroundColor = '#FAFAFA'
                }
                td.appendChild(spanDetail)
              }

              // 下钻箭头
              if (v.dill && !isDillUp && value.indexOf('&dilldata') === -1) {
                const spanDill = document.createElement('span')
                spanDill.classList.add('dill-arrow')
                spanDill.setAttribute('dill', 'dill')
                spanDill.onclick = (e) => {
                  e.preventDefault()
                  this.dill()
                }
                td.append(spanDill)
              }
              // 收缩箭头
              if (v.dill && isDillUp) {
                const spanUp = document.createElement('span')
                spanUp.classList.add('dillUp-arrow')
                spanUp.setAttribute('dillUp', 'dillUp')
                spanUp.onclick = (e) => {
                  e.preventDefault()
                  this.dillUpdate()
                }
                td.append(spanUp)
              }

              // 下钻的数据样式
              if (this.tableData[row]['number'].toString().indexOf('.') !== -1) {
                td.style.backgroundColor = '#FAFAFA'
              }
              if (value && value.indexOf('&dilldata') !== -1) {
                // 原先padding 有12
                td.style.paddingLeft = '40px'
              }
              instance.setCellMeta(row, colItem, 'readOnly', true)
            } else if (row === 0) { // 表头样式
              // if (renderRow === row) {
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
              // }
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
    calcMaxMetric (metric) {
      let metricArr = new Array()
      for (let i in this.allData) {
        if (this.allData[i][metric]) {
          let item = this.allData[i][metric].replace('$dill', '')
          item.indexOf('%') > 0 ?
            metricArr.push(Number(item.split('#compare')[0].replace(/,/g, "").replace('%', '')) / 100) :
            metricArr.push(Number(item.split('#compare')[0].replace(/,/g, "")))
        }
      }
      metricArr.sort(function (num1, num2) {
        return num1 - num2
      })
      let maxMetric = eval(metricArr[metricArr.length-1])
      return maxMetric
    },
    // 点击下钻 请求下钻数据 同时改变总条数和每页条数
    async dill() {
      const data = await this.getDillorUpdillData()
      if (!data) {
        this.$message({
          message: '此下钻没有数据了',
          type: 'warning'
        })
        return
      }
      if (data && data.length === 0) {
        this.$message({
          message: '此下钻没有数据了',
          type: 'warning'
        })
        return
      }

      // 将收缩flag绑定到数据上 用*标识
      this.tableData[startIndexRow][this.selectId] += '*dillUp'
      // 将下钻数据插入表格中 指标列打上标识$ 以便渲染td颜色
      if (data) {
        data.forEach((v, i) => {
          let modifyValue = v[this.dillDimVuex] + '&dilldata'
          const numberDill = i + 1
          v[this.selectId] = modifyValue
          v['number'] = number + '.' + numberDill
          v['parentDimCode'] = value
          v['parentDimValue'] = this.selectId
          v['dillDim'] = this.dillDimVuex
          v['dillNumber'] = number + numberDill
          delete v[this.dillDimVuex]
          // 针对指标列
          this.showColumn.forEach((item) => {
            if (item.type === 1) {
              // 对比值放进去
              // if (item.trend) {
                let code = getMetricCode(this.metricList, item.id)
                // let code = item.id.slice(-2).indexOf('_') !== -1? item.id.substring(0, item.id.length - 2) : item.id
                code += '_6'
                if (item.trend) {
                  if (code in data[i]) {
                    v[item.id] += '$dill' + '#compare' + data[i][code]
                  }
                } else {
                  if (v[item.id]) {
                    v[item.id] += '$dill'
                  } else {
                    v[item.id] = '$dill'
                  }
                }
              // }
            }
          })
          // 下钻加入条形图
          this.columnList.forEach((item, index) => {
            if (item.id.indexOf('bar') !== -1) {
              const barId = item.id.substring(0, item.id.length - 3)
              v[item.id] = data[i][barId]
            }
          })
          // debugger
          if (this.showTotal === true && this.totalStore === 'before' && this.currentPage === 1) {
            this.allData.splice(this.startIndex + startIndexRow + i - this.row, 0, v)
          } else {
            this.allData.splice(this.startIndex + startIndexRow + i - this.row + 1, 0, v)
          }
        })
      }
      // 重新组织数据
      this.tableDataRender()
      this.renderColumns()
    },
    // 点击上卷 请求下钻数据 删除下钻的数据 分为两个情况 点击最父级元素和点击下一级元素
    async dillUpdate () {
      if (this.showTotal === true && this.totalStore === 'before' && this.currentPage === 1) {
        startIndexRow = Number(this.selectedCell[0]) - 1
      } else {
        startIndexRow = Number(this.selectedCell[0])
      }
      const deleteDillUp = this.allData[this.startIndex + startIndexRow - this.row][this.selectId]
      // if (deleteDillUp.indexOf('&dilldata') !== -1) {
      //   const data = await this.getDillorUpdillData()
      //   // 点击子级收缩 把*dillUp这个属性去掉
      //   this.allData.splice(this.startIndex + startIndexRow - this.row, data.length)
      // } else {
        let spliceIndex = ''
        // 点击最父层级 找出下一个不是下钻的数据
        for (let i = this.startIndex + startIndexRow + 1; i < this.allData.length; i += 1) {
          if (this.allData[i][this.selectId].indexOf('&dilldata') === -1) {
            spliceIndex = i
            break
          }
        }
        let spliceLength = spliceIndex - this.startIndex - startIndexRow  + this.row - 1
        // 考虑最后一级
        if (!spliceIndex || spliceIndex === '') {
          spliceLength = this.allData.length - this.startIndex - startIndexRow  + this.row - 1
        }
        this.allData.splice(this.startIndex + startIndexRow  - this.row + 1, spliceLength)
      // }
      this.allData[this.startIndex + startIndexRow - this.row][this.selectId] = deleteDillUp.replace('*dillUp', '')
      // this.hot.destroy()
      // this.hot = null
        // 重新组织数据
      this.tableDataRender()
    },
    // 获取下钻的数据
    async getDillorUpdillData () {
      // const dillDim = this.chartsOption[this.index].feature.styleConfig.dillDim
      let selectRow = ''
      startIndexRow = Number(this.selectedCell[0])
      selectRow = this.tableData.slice(startIndexRow, startIndexRow + 1)
      // 获得下钻父节点的number
      number = selectRow[0]['number']
      // 选中的单元格值
      value = selectRow[0][this.selectId].replace('*dillUp', '')
      let dimCustomList = this.dimList.filter(v => {return v.dimCode !== this.selectId })
      const dillDim = this.dillDimList.filter(v => {return v.dimCode === this.dillDimVuex })
      dimCustomList.push(dillDim[0])
      let dimList = []
      // console.log(this.dillDim)
      dimCustomList.forEach(v => {
        dimList.push({
          dimId: v.dimCode,
          dimName: v.dimName
        })
      })
      // debugger
      // console.log(this.getDimValue(this.selectId, value))
      let conditionListArr = [{
        condiCode: this.selectId,
        condiType: 0,
        operator: 6,
        condiComparedValue: value.split('###')[0]
      }]

      const dillAndLine = this.columnList.filter(v => {
        return v.id === this.selectId
      })
      const data = await this.tableSearch({
        dimList: dimList,
        conditionListArr: conditionListArr,
        limit: dillAndLine[0].showLine ? dillAndLine[0].selectNumber : 5
      })

      if (data && data.length === 0) {
        return []
      }
      return data
    },
    // 计算表格高度
    calTableHeight (hasName = true) {
      this.$nextTick(() => {
        // 有滚动条高度所以要加8 wtHolder
        if (this.hot) {
          const handsontableDom = document.getElementById(this.hansontableProId)
          const nameToggle = this.chartsOption[this.index].nameToggle
          let containerHeight = handsontableDom.parentNode.parentNode.parentNode.style.height
          let gridWidth = document.getElementsByClassName(`grid-item-${this.index}`)[0]
          let numHeight = ''
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
          let tableHeight = 0
          // 判断是否有告警
          // if (this.moreDim || this.moreDimSingle) {
          //   tableHeight = containerHeight - 52
          // } else {
            tableHeight = containerHeight
          // }
          if (this.isShowTop) {
            tableHeight = tableHeight - 50
          }
          let tableRenderHeight = document.querySelector(`.grid-item-${this.index} .wtSpreader`).offsetHeight + 8
          let offseWidth = document.querySelector(`.grid-item-${this.index} .wtHolder`).style.width.replace('px', '')
          let tableWidth = document.querySelector(`.grid-item-${this.index} .wtHider`).style.width.replace('px', '')
          let exportAndPaginate = document.querySelector(`.grid-item-${this.index} .paginationWrapper`)

          if (gridWidth) {
            let width = gridWidth.offsetWidth - 32
            if (this.hot) {
              this.hot.updateSettings({
                width: width
              })
            }
          }
          if (Number(tableRenderHeight) < Number(tableHeight)) {
            this.hot.updateSettings({
              height: tableRenderHeight
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
              height: tableHeight
            })
            if (exportAndPaginate) {
              exportAndPaginate.style.paddingTop = '8px'
            }
          }
        }
      })
    },
    // 解决横向滚动条的问题，当容器宽度大于等于表格实际宽度时候就禁掉，否则就放出来
    calTableScroll () {
      this.$nextTick(() => {
        if (this.hot) {
          const tableContainer = document.querySelector(`#${this.hansontableProId}`) // 滚动条距顶端的距离
          const tableChild = tableContainer.firstChild.firstChild
          const grandSonChild = tableChild.firstChild
          const gridContainer = tableContainer.parentNode.parentNode.parentNode
          if (gridContainer.offsetWidth - 24 < grandSonChild.offsetWidth) {
            tableChild.style.overflowX = 'auto'
          } else {
            tableChild.style.overflowX = 'hidden'
          }
        }
      })
    }
	}
}
