// 字符串转换为HTML元素
export const toHtml = params => {
  var div = document.createElement('div')
  div.innerHTML = params
  return div.childNodes[0]
}

// 判断是否为IE浏览器(包括IE11)
export const isIE = () => {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true
  } else {
    return false
  }
}

// JS子元素oumouseover触发父元素onmouseout的解决方案
export const mouseOverProblem = (e, parentObj) => {
  let bool = false
  let relativeObj = e.fromElement || e.relatedTarget
  // elem: e.fromElement或e.toElement, 为IE下onmouseover获取相关对象方法，relatedTarget为标准浏览器下获取方法
  // relativeObj为相关对象， 父级移入到子级对象，相关对象为父级。 子级移出到父级对象，相对对象为子级
  if (relativeObj !== null) {
    if (document.all) {    // 判断浏览器是否为IE,如果存在document.all则为IE
      if (!parentObj.contains(relativeObj)) {    // 判断调用onmouseover的对象是否包含自身或子级，如果包含，则不执行
        bool = true
      }
    } else {    // 标准浏览器下的方法
      let reg = parentObj.compareDocumentPosition(relativeObj)  // 判断一个元素是否包含另一个元素的方法
      if (!(reg === 20 || reg === 0)) {
        bool = true
      }
    }
  }
  return bool
}

export const mouseOutProblem = (e, parentObj) => {
  let bool = false
  let relativeObj = e.toElement || e.relatedTarget
  if (relativeObj !== null) {
    if (document.all) {
      if (!parentObj.contains(relativeObj)) {
        bool = true
      }
    } else {
      let reg = parentObj.compareDocumentPosition(relativeObj)
      if (!(reg === 20 || reg === 0)) {
        bool = true
      }
    }
  }
  return bool
}


// 获取今天、昨天、前天的日期
const singleSwitch = (data)  => {
  if (data >= 1 && data <= 9) {
    data = '0' + data
  }
  return data
}
export const getDates = (param) => {
  let myDate = new Date()
  let number = 30
  let dateTemp
  let dateArray = []
  let day
  for (let i = number; i > 0; i--) {
    dateTemp = myDate.getFullYear() + '-' + singleSwitch((myDate.getMonth() + 1)) + '-' + singleSwitch(myDate.getDate())
    dateArray.push(dateTemp)
    myDate.setDate(myDate.getDate() - 1)
  }
  switch (param) {
    case 'today':
      day = dateArray[0]
      break
    case 'yesterday':
      day = dateArray[1]
      break
    case 'daybefore':
      day = dateArray[2]
      break
    case 'fourDay':
      day = dateArray[3]
      break
    case 'sevenDay':
      day = dateArray[6]
      break
    case 'eightDay':
      day = dateArray[7]
      break
    case 'fourteenDay':
      day = dateArray[13]
      break
    case 'thirtyDay':
      day = dateArray[29]
      break

  }
  return day
}
