import colorSetting from './static'
import { getMetricCode } from '../../utils/utils'
// console.log(colorSetting.fontColor)
// let rateType = 0 // 同比情况
// 根据selectedCell确定行数  不然会有bug
let dillRoute = ''
// let startIndexRow = ''
// 下钻名称
let routeNm = ''
// let selectRow = ''
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
      // 序号和详情排名居中
      if (v.id === 'number' || v.id === 'operate' || v.id === 'ranking') {
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
            let saveShowValue = ''
            let showValue = ''
            if (value) {
              value = value.toString()
            }
            let dillValue = '' // 下钻的维度id
            let isDillLast = false // 是不是最后一级 最后一级没有小箭头
            let isDillUp = false // 有没有收缩
            let dillRow = false // 是不是下钻行 这里针对指标还有没有下钻的维度

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
            } else if (value && value.indexOf('$dill') !== -1) { // 这边也可以通过其他方法判断
              // 针对指标列的下钻数据  需要改变颜色 或不是下钻的维度列
              showValue = value.split('$dill')[0]
              dillRow = true
            } else if (value && value.indexOf('#compare') !== -1) {
              // 趋势标记 对比
              showValue = value.split('#compare')[0]
            } else {
              showValue = value
            }
            // if (this.isPrecisePositioning) {
            //   debugger
            // }
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

            // 图片列
            if (v.type === 0
              && v.dimType === '3'
              && v.id === 'PD_WD_0005'
              && this.showPicture
              && row >= relaRow
              && row < numberArea
              && value
              && value.split('###')) {
              let zero = ''
              const code = value.split('###')[0]
              for(let i = 0; i < 18 - code.length; i += 1) {
                zero += '0'
              }
              let imageSrc = ''
              if (this.tableData[row] && this.tableData[row]['productInfo']) {
                imageSrc = 'http://'+ this.tableData[row]['productInfo']['domain'] + this.tableData[row]['productInfo']['pictureUrl'] + '_60w_60h'
              } else {
                imageSrc = 'http://image4.suning.cn/b2c/catentries/' + zero + code + '_1_60x60.jpg'
              }
              let spanValueImage = `<img class='table-image' src= '${imageSrc}' ` + ' '+`onerror=` + `"this.src='/static/charts/images/nopicture.png'">`
              td.innerHTML = spanValueImage
            }
            // 只有商品列才有链接 并且配置了超链接
            if (v.type === 0
              && v.dimType === '3'
              && v.id === 'PD_WD_0005'
              && v.superUrl
              && row >= relaRow
              && value
              && value.split('###')) {
              let spanValueLink;
              if (value.indexOf('合计') !== -1){
                spanValueLink = document.createElement('span')
                spanValueLink.innerHTML = showValue
                td.appendChild(spanValueLink)
              } else {
                const spanWareCode = document.createElement('span')
                const wareWrap = document.createElement('div')
                spanValueLink = document.createElement('a')
                let linkcode = value.split('###')[0]
                // debugger
                if (value.length > 10) {
                  spanValueLink.innerHTML = showValue
                  td.title = showValue
                } else {
                  spanValueLink.innerHTML = showValue
                }
                let supplierCode = /^1/.test(this.tableData[row]['PM_WD_0002'].split('###')[0]) ? '0000000000' : this.tableData[row]['PM_WD_0002'].split('###')[0].padStart(10,'0')
                // spanValueLink.href = 'http://product.suning.com/'+ this.tableData[row]['PM_WD_0002'].split('_')[0].padStart(10,'0') +'/' + linkcode + '.html'
                spanValueLink.href = 'http://product.suning.com/'+ supplierCode +'/' + linkcode + '.html'
                spanValueLink.target = '_blank'
                spanWareCode.innerHTML = '商品编号:' + value.split('###')[0]
                spanWareCode.style.display = 'block'
                spanWareCode.style.color = '#999'
                wareWrap.style.display = 'inline-block'
                wareWrap.style.verticalAlign = 'middle'
                wareWrap.append(spanValueLink)
                wareWrap.append(spanWareCode)
                td.append(wareWrap)
              }
            }
            // 超链接的一列不能在这渲染  会覆盖掉 这里渲染所有表头和数据区域
            if (!v.superUrl || row < relaRow) {
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
              
            }
            // if (value === '合计') {
            //   debugger
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
                // td.style.color = colorSetting.fontColor[v.fontColor]
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
              // 突出显示多少行
              if (this.isInputNumber && Number(this.inputNumber) !== 0 && row < (Number(this.inputNumber) + this.row)) {
                // 判断showNumber是否为真
                if (this.showNumber) {
                  // 判断是第几行
                  if (colItem === 0 || colItem === 1) {
                    td.classList.add('out-stand-color')
                    const tdLink = td.querySelector('a')
                    if (tdLink) {
                      td.classList.add('out-stand-color')
                    }
                  }
                } else {
                  if (colItem === 0) {
                    const tdLink = td.querySelector('a')
                    if (tdLink) {
                      td.classList.add('out-stand-color')
                    }
                    td.classList.add('out-stand-color')
                  }
                }
              }
            }

            if (row >= relaRow && row < numberArea) { // 数据区域
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
                if (showValue && showValue.toString().indexOf(',') !== -1) {
                  barValue = showValue.toString().replace(/,/g, "")
                }

                // 百分比处理一下
                if (showValue && showValue.toString().indexOf('%') !== -1) {
                  barValue = Number(barValue.toString().replace("%", "")) / 100
                }
                if (realId.indexOf('bar') !== -1) {
                  realId = realId.substring(0, realId.length - 3)
                }
                // 不足1px的用1px
                barValue = Number(barValue)
                // let proportion = v.trend ? (Math.abs(barValue) / Number(this.calcMaxMetric(realId))) * 90 : (Math.abs(barValue) / Number(this.calcMaxMetric(realId))) * 100
                let proportion = Math.abs(barValue) / Number(this.calcMaxMetric(realId)) * 100
                if (proportion < 1) {
                  proportion = 1
                }
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
                  if(value.split('#compare')[0] !== ''){
                    const spanTrendValue = document.createElement('span')
                    spanTrendValue.innerHTML = (Math.ceil(Number(compareValue) * 10000)/100) + '%'
                    spanTrendValue.classList.add('trend-value')
                    td.appendChild(spanTrendValue)
                  }
                }
              }

              // 趋势标记 下降 下钻 下钻的数据
              // if (dillRow && v.trend && value.indexOf('#compare') !== -1) {
              //   const compareValue = value.split('#compare')[1]
              //   if (Number(compareValue) < 0) {
              //     const spanImg = document.createElement('span')
              //     spanImg.classList.add('trend-down')
              //     spanImg.setAttribute('trenDown', 'trenDown')
              //     td.appendChild(spanImg)
              //   }
              //   if (Number(compareValue) > 0) {
              //     const spanImg = document.createElement('span')
              //     spanImg.classList.add('trend-up')
              //     spanImg.setAttribute('trenUp', 'trenUp')
              //     td.appendChild(spanImg)
              //   }
              //   if (this.trendAddPercent) {
              //     const spanTrendValue = document.createElement('span')
              //     spanTrendValue.innerHTML = compareValue
              //     spanTrendValue.classList.add('trend-value')
              //     td.appendChild(spanTrendValue)
              //   }
              // }
              // 列没有悬浮条形图
              if (this.hoverTable && v.hoverType === 0) {
                this.hoverTable = false
              }
              // 悬浮内容
              if (v.hoverType === 1) {
                td.onmouseenter = (e) => {
                  this.eventClient = e
                  this.hoverValue = value
                  this.hoverIndex = row
                  this.hoverId = v.id
                }
                td.style.color = '#51A6FF'
              } else {
                td.onmouseenter = null
              }
              // 详情
              if (v.id === 'operate') {
                let selectedReport, selectedReportVersion, selectedDimCode, selectedDimName, selectedDimValue, selectedDimValueNm
                selectedReport = this.chartsOption[this.index].detailSelectedReport
                selectedReportVersion = this.chartsOption[this.index].detailSelectedReportVersion
                this.chartsOption[this.index].feature.dimList.map(item => {
                  if(this.chartsOption[this.index].detailFilter === item.dimCode){
                    selectedDimCode = item.dimCode
                  }
                })
                let detailFilterParmas = {
                  reportId: selectedReport,
                  versionId: selectedReportVersion,
                }
                if(selectedDimCode){
                  detailFilterParmas.dimCode = selectedDimCode
                  detailFilterParmas.dimValue = this.tableData[row][selectedDimCode]
                }
                let routeData = this.$router.resolve({
                  path:'/visual',
                  query: detailFilterParmas,
                })
                td.innerHTML = ''
                let html = ""
                if(selectedReport && selectedReportVersion){
                  html = '<div class="table-icon-detail" style="cursor:pointer;"><a style="color:#51A6FF" target="_blank" href="'+routeData.href.replace(/%23%23%23/g,'###')+'">详情</a></div>'
                }else{
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
              if (v.dill && !isDillLast && !isDillUp) {
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
              if (v.dill && isDillUp && !isDillLast) {
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
              if (dillValue !== '' ||
                dillRow ||
                (v.id === 'number' && showValue.toString().indexOf('.') !== -1)) {
                td.style.backgroundColor = '#FAFAFA'
                // 下钻数据缩进
                const indent = dillValue.substr(dillValue.length - 1, 1)
                if (indent && indent !== '') {
                  // 原先padding 有12
                  td.style.paddingLeft = indent * 10 + 12 + 'px'
                }
              }
              // 调用过滤告警数据的方法
              this.filterWarnData({ warnData, v, saveShowValue, td })
              instance.setCellMeta(row, colItem, 'readOnly', true)
            } else if (row === (this.row - 1)) { // 表头样式
              // let renderRow = ''
              // if (this.isSingleSplit || this.isManySplit) {
              //   renderRow = this.row - 2
              // } else {
              //   renderRow = this.row - 1
              // }

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
                // }
              } else {
                td.innerHTML = value
              }
            } else {
              td.innerHTML = showValue
            }
            td.classList.add('htCenter')
            return td
          }
        })
      })
      this.tablerenderer = renderColumns // 整个表格的渲染方法
    },
    calcMaxMetric(metric){
      let metricArr = new Array()
      for(let i in this.allData){
        if(this.allData[i][metric]){
          let item = this.allData[i][metric].replace('$dill', '')
          item.indexOf('%') !== -1 ?
            metricArr.push(Number(item.split('#compare')[0].replace(/,/g, "").replace('%', '')) / 100) :
            metricArr.push(Number(item.split('#compare')[0].replace(/,/g, "")))
        }
      }
      metricArr.sort(function(num1,num2){
        return num1-num2
      })
      let maxMetric= eval(metricArr[metricArr.length-1])
      // console.log(maxMetric)
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
      // 重新置为1
      let drillNumber = 1
      let selectIndex = Number(this.selectedCell[0])

      if (value && value.indexOf('&dilldata') !== -1) {
        dillRoute.forEach((v, i) => {
          // 最后一位是缩进几格
          if (v === value.split('&dilldata')[1].substr(0, value.split('&dilldata')[1].length - 1)) {
            drillNumber = i + 1
          }
        })
      }
      // 将收缩flag绑定到数据上 用*标识
      this.tableData[selectIndex][this.selectId] += '*dillUp'
      // 将下钻数据插入表格中 指标列打上标识$ 以便渲染td颜色
      if (data) {
        data.forEach((v, i) => {
          let modifyValue = v[childRoute] + '&dilldata' + childRoute + drillNumber
          const numberDill = i + 1

          if (drillNumber === (dillRoute.length - 1)) {
            modifyValue += '&last'
          }

          v[parentRoute] = modifyValue
          v['number'] = number + '.' + numberDill
          delete v[childRoute]
          // 针对指标列
          this.showColumn.forEach((item) => {
            if (item.id !== 'number' && item.id !== parentRoute) {
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
          if (this.showTotal === true && this.totalStore === 'before' && this.currentPage === 1){
            this.allData.splice(this.startIndex + selectIndex + i - this.row, 0, v)
          } else{
            this.allData.splice(this.startIndex + selectIndex + i - this.row + 1, 0, v)
          }
        })
      }
      // 重新组织数据
      this.tableDataRender()
      this.renderColumns(this.chartWarnData)
    },
    // 点击上卷 请求下钻数据 删除下钻的数据 分为两个情况 点击最父级元素和点击下一级元素
    async dillUpdate() {
      let selectIndex = ''
      if (this.showTotal === true && this.totalStore === 'before' && this.currentPage === 1) {
        selectIndex = Number(this.selectedCell[0]) - 1
      } else{
        selectIndex = Number(this.selectedCell[0])
      }

      const deleteDillUp = this.allData[this.startIndex + selectIndex - this.row][this.selectId]
      if (deleteDillUp.indexOf('&dilldata') !== -1) {
        const data = await this.getDillorUpdillData()
        // 点击子级收缩 把*dillUp这个属性去掉
        this.allData.splice(this.startIndex + selectIndex - this.row + 1, data.length)
      } else {
        let spliceIndex = ''
        // 点击最父层级 找出下一个不是下钻的数据
        for(let i = this.startIndex + selectIndex - this.row + 1; i < this.allData.length; i += 1) {
          if (this.allData[i][this.selectId].indexOf('&dilldata') === -1) {
            spliceIndex = i
            break
          }
        }
        let spliceLength = spliceIndex - this.startIndex - selectIndex + this.row - 1
        // 考虑最后一级
        if (!spliceIndex || spliceIndex === '') {
          spliceLength = this.allData.length - this.startIndex - selectIndex + this.row - 1
        }
        this.allData.splice(this.startIndex + selectIndex - this.row + 1, spliceLength)
      }
      this.allData[this.startIndex + selectIndex - this.row][this.selectId] = deleteDillUp.replace('*dillUp', '')
        // 重新组织数据
      this.tableDataRender()
    },
    // 获取下钻的数据
    async getDillorUpdillData() {
      dillRoute = this.selectRoute.route.split('-').reverse()
      let selectIndex = Number(this.selectedCell[0])
      // 下钻名称
      routeNm = this.selectRoute.routeNm.split('-').reverse()
      let selectRow = this.tableData.slice(selectIndex, selectIndex + 1)
      // 获得下钻父节点的number
      number = selectRow[0]['number']
      // 选中的单元格值
      value = selectRow[0][this.selectId].replace('*dillUp', '')
      // console.log(value)
      let drillNumber = 1 // 下钻层级
      if (value && value.indexOf('&dilldata') !== -1) {
        dillRoute.forEach((v, i) => {
          // const compareValue = value.split('&')[1].substr(0, value.length - 1)
          if (v === value.split('&dilldata')[1].substr(0, value.split('&dilldata')[1].length - 1)) {
            drillNumber = i + 1
          }
        })
      }

      parentRoute = dillRoute[0] // 最父级维度编码
      childRoute = dillRoute[drillNumber] // 当前下钻的维度编码
      currentRoute = dillRoute[drillNumber - 1] // 当前下钻的维度编码
      currentName = routeNm[drillNumber - 1]
      // 这个路径不能下钻 大区-片区总部
      if (parentRoute !== this.showColumn[this.selectedCell[1]].id) {
        return
      }
      let drill = {}
      // 分为下钻和不是下钻的数据
      if (value.indexOf('&dilldata') === -1) {
        drill.dimValueId = value.split('###')[0]
      } else {
        drill.dimValueId = value.split('&dilldata')[0].split('###')[0]
      }

      drill.drillPath = this.selectRoute.routeCode // 路径编码
      drill.drillNumber = 1 // 层数 下钻1 上卷-1 下钻带1就行
      drill.nextDimCode = childRoute // 下一级纬度编码

      if (Number(drillNumber) === 1) {
        drill.drillDimCode = parentRoute
      } else {
        drill.drillDimCode = currentRoute
      }
      // const businessType = 2
      // 获取下层数据需要改变dimList
      const dimList = []
      dimList.push({
        dimId: currentRoute,
        dimName: currentName
      })
      const limit = this.showLine ? this.selectNumber : null
      // 多维 其他的维度也要带上
      const dimListFilter = this.moreDimList.filter(v => v.dimCode !== parentRoute)
      dimListFilter.forEach((v, i) => {
        dimList.push({
          dimId: v.dimCode,
          dimName: v.dimName
        })
      })

      let upsetting = {
        limit: limit,
        drill: drill,
        dimList: dimList,
      }
      // 拆分维度也有下钻数据
      const data = await this.tableSearch(upsetting)
      if (data && data.length === 0) {
        return []
      }
      return data
    },

    // 根据告警修改数据
    filterWarnData({ warnData, v, saveShowValue, td }) {
      // 根据告警修改数据
      if (warnData) {
        // 事先把节点添加好
        const ulWarn = document.createElement('ul')
        ulWarn.classList = "htCenterWarn"
        warnData.forEach((item, index) => {
          // 判断是不是拆分表格了 之前融到一起  现在分成两个图表类型了
          if (this.splitMetricList.length !== 0) {
            // 让同一指标下拆分的纬度都要添加告警
            // if (this.splitMetricList[0].id === item.metricCode && v.type === 3) {
            //   // 第一行是表头，去掉

            //   if (Number(saveShowValue) || Number(saveShowValue) === 0) {
            //     // 判断是否满足区域设置的条件
            //     let flag = false
            //     item.settings.forEach((v, i) => {
            //       switch (Number(v.selected)) {
            //         case 0:
            //           if (Number(saveShowValue) > Number(v.number)) {
            //             this.addWarnLi({ ulWarn, v })
            //             flag = true
            //           }
            //           break;
            //         case 1:
            //           if (Number(saveShowValue) < Number(v.number)) {
            //             this.addWarnLi({ ulWarn, v })
            //             flag = true
            //           }
            //           break;
            //         case 2:
            //           if (Number(saveShowValue) > Number(v.number) || Number(saveShowValue) === Number(v.number)) {
            //             this.addWarnLi({ ulWarn, v })
            //             flag = true
            //           }
            //           break;
            //         case 3:
            //           if (Number(saveShowValue) < Number(v.number) || Number(saveShowValue) === Number(v.number)) {
            //             this.addWarnLi({ ulWarn, v })
            //             flag = true
            //           }
            //           break;
            //         case 4:
            //           if (Number(saveShowValue) === Number(v.number)) {
            //             this.addWarnLi({ ulWarn, v })
            //             flag = true
            //           }
            //           break;
            //         case 5:
            //           if (Number(saveShowValue) !== Number(v.number)) {
            //             this.addWarnLi({ ulWarn, v })
            //             flag = true
            //           }
            //           break;
            //         case 6:
            //           if (v.number.includes('-')) {
            //             const splitNums = v.number.split('-')
            //             if (Number(saveShowValue) >= Number(splitNums[0]) && Number(saveShowValue) <= Number(splitNums[1])) {
            //               this.addWarnLi({ ulWarn, v })
            //               flag = true
            //             }
            //           }
            //           break;
            //       }
            //     })
            //     // 判断是否需要缺省值
            //     if (!flag) {
            //         const liWarn = document.createElement('li')
            //       liWarn.style.backgroundColor = item.defaultColor
            //       liWarn.innerHTML = item.defaultName
            //       liWarn.title = item.defaultNote
            //       ulWarn.appendChild(liWarn)
            //       flag = true
            //     }
            //     // 判断是否有匹配值
            //     if (flag) {
            //       td.style.paddingTop = '10px'
            //     }
            //   }
            // } else if (item.metricCode === v.id) {
            //     // 第一行是表头，去掉
            //   if (Number(saveShowValue) || Number(saveShowValue) === 0) {
            //       // 判断是否满足区域设置的条件
            //       let flag = false
            //       item.settings.forEach((v, i) => {
            //         switch (Number(v.selected)) {
            //           case 0:
            //             if (Number(saveShowValue) > Number(v.number)) {
            //               this.addWarnLi({ ulWarn, v })
            //               flag = true
            //             }
            //             break;
            //           case 1:
            //             if (Number(saveShowValue) < Number(v.number)) {
            //               this.addWarnLi({ ulWarn, v })
            //               flag = true
            //             }
            //             break;
            //           case 2:
            //             if (Number(saveShowValue) > Number(v.number) || Number(saveShowValue) === Number(v.number)) {
            //               this.addWarnLi({ ulWarn, v })
            //               flag = true
            //             }
            //             break;
            //           case 3:
            //             if (Number(saveShowValue) < Number(v.number) || Number(saveShowValue) === Number(v.number)) {
            //               this.addWarnLi({ ulWarn, v })
            //               flag = true
            //             }
            //             break;
            //           case 4:
            //             if (Number(saveShowValue) === Number(v.number)) {
            //               this.addWarnLi({ ulWarn, v })
            //               flag = true
            //             }
            //             break;
            //           case 5:
            //             if (Number(saveShowValue) !== Number(v.number)) {
            //               this.addWarnLi({ ulWarn, v })
            //               flag = true
            //             }
            //             break;
            //           case 6:
            //             if (v.number.includes('-')) {
            //               const splitNums = v.number.split('-')
            //               if (Number(saveShowValue) >= Number(splitNums[0]) && Number(saveShowValue) <= Number(splitNums[1])) {
            //                 this.addWarnLi({ ulWarn, v })
            //                 flag = true
            //               }
            //             }
            //             break;
            //         }
            //       })
            //       // 判断是否需要缺省值
            //       if (!flag) {
            //           const liWarn = document.createElement('li')
            //         liWarn.style.backgroundColor = item.defaultColor
            //         liWarn.innerHTML = item.defaultName
            //         liWarn.title = item.defaultNote
            //         ulWarn.appendChild(liWarn)
            //         flag = true
            //       }
            //       // 判断是否有匹配值
            //       if (flag) {
            //         td.style.paddingTop = '10px'
            //       }
            //     }
            // }
          } else {
            if (item.metricCode === v.id) {
              // 第一行是表头，去掉
              if (Number(saveShowValue) || Number(saveShowValue) === 0) {
                // 判断是否满足区域设置的条件
                let flag = false
                item.settings.forEach((v, i) => {
                  // console.log(saveShowValue)
                  switch (Number(v.selected)) {
                    case 0:
                      if (Number(saveShowValue) > Number(v.number)) {
                        this.addWarnLi({ ulWarn, v })
                        flag = true
                      }
                      break;
                    case 1:
                      if (Number(saveShowValue) < Number(v.number)) {
                        this.addWarnLi({ ulWarn, v })
                        flag = true
                      }
                      break;
                    case 2:
                      if (Number(saveShowValue) > Number(v.number) || Number(saveShowValue) === Number(v.number)) {
                        this.addWarnLi({ ulWarn, v })
                        flag = true
                      }
                      break;
                    case 3:
                      if (Number(saveShowValue) < Number(v.number) || Number(saveShowValue) === Number(v.number)) {
                        this.addWarnLi({ ulWarn, v })
                        flag = true
                      }
                      break;
                    case 4:
                      if (Number(saveShowValue) === Number(v.number)) {
                        this.addWarnLi({ ulWarn, v })
                        flag = true
                      }
                      break;
                    case 5:
                      if (Number(saveShowValue) !== Number(v.number)) {
                        this.addWarnLi({ ulWarn, v })
                        flag = true
                      }
                      break;
                    case 6:
                      if (v.number.includes('-')) {
                        const splitNums = v.number.split('-')
                        if (Number(saveShowValue) >= Number(splitNums[0]) && Number(saveShowValue) <= Number(splitNums[1])) {
                          this.addWarnLi({ ulWarn, v })
                          flag = true
                        }
                      }
                      break;
                  }
                })
                // 判断是否需要缺省值
                if (!flag) {
                    const liWarn = document.createElement('li')
                  liWarn.style.backgroundColor = item.defaultColor
                  liWarn.innerHTML = item.defaultName
                  liWarn.title = item.defaultNote
                  ulWarn.appendChild(liWarn)
                  flag = true
                }
                // 判断是否有匹配值
                if (flag) {
                  td.style.paddingTop = '10px'
                }
              }
            }
          }

        })
        td.appendChild(ulWarn)
      }
    },
    // 动态添加li告警标签
    addWarnLi({ ulWarn, v }) {
      const liWarn = document.createElement('li')
      liWarn.style.backgroundColor = v.color
      liWarn.innerHTML = v.warn
      liWarn.title = v.note
      ulWarn.appendChild(liWarn)
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
          let tableHeight = 0
          // 判断是否有告警
          if (this.moreDim || this.moreMetric || this.isPrecisePositioning) {
            const moreWrap = document.querySelector(`.${this.tableWrapperIndex} .moreWrap`).offsetHeight
            tableHeight = containerHeight - moreWrap
          } else {
            tableHeight = containerHeight
          }
          if ( this.moreDimSingle) {
            const dimSingle = document.querySelector(`.${this.tableWrapperIndex} .more-dim-single`).offsetHeight
            tableHeight = tableHeight - dimSingle
          }
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
        }
      })
    },
    // 解决横向滚动条的问题，当容器宽度大于等于表格实际宽度时候就禁掉，否则就放出来
    calTableScroll() {
      this.$nextTick(() => {
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
      })
    }
	}
}
