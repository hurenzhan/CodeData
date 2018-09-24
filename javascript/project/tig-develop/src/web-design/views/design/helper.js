/* eslint-disable */
// 获取元素的计算的样式值
const getComputedStyle = (element, styleProperty) => {
  return window.getComputedStyle(element, null).getPropertyValue(styleProperty)
}

// 获取自定义表格头最后一行的真实长度
export const getHandsontableLastLineLength = () => {
  const handsontable = document.querySelector('#handsontable')
  const tableDom = handsontable.querySelector('.htCore')
  const trList = tableDom.querySelectorAll('tr') // 获取所有tr
  const tdInLastTr = trList[trList.length - 1].querySelectorAll('td') // 获取最后一行tr中的所有td
  const lastLine = Array.from(tdInLastTr) // 最后一行的dom合集，类数组
  const actualLength = lastLine.map(v => getComputedStyle(v, 'display'))
  // 获取最后一列
  let counter = 0
  actualLength.forEach((v) => {
    if (v === 'table-cell') {
      counter += 1
    }
  })
  return counter
}
