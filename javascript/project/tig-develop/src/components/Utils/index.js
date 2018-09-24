/**
 * 帮助函数
 */
export default {
  // 获取地址栏Query参数
  getQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
    const r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
  },
  // 千分位符
  toThousands(numArr) {
    let result = ''
    let counter = 0
    for (let i = numArr[0].length - 1; i >= 0; i -= 1) {
      counter += 1
      result = numArr[0].charAt(i) + result
      if (!(counter % 3) && i !== 0) {
        result = `,${result}`
      }
    }
    if (numArr[1]) {
      result = `${result}.${numArr[1]}`
    }
    return result
  },
  formatData: (value, scope, item, formats) => {
    const id = item.prop
    const format = formats[id]
    if (format && !isNaN(Number(value))) {
      // 1 数值精度 纯小数处理
      if (!format.thousands && format.type !== 1) {
        return Number(value).toFixed(format.decimals)
      }
      // 2 小数 + 百分比
      if (format.type === 1 && !format.thousands) {
        const total = Number(value) * 100
        const decimal = Number(total).toFixed(format.decimals)
        return `${decimal}%`
      }
      // 3 小数 + 千分位符
      if (format.thousands && format.type !== 1) {
        const decimal = Number(value).toFixed(format.decimals)
        const decimalArr = decimal.split('.')
        return this.toThousands(decimalArr)
      }

      // 4 小数 + 百分比 + 千分位
      if (format.thousands && format.type === 1) {
        const total = Number(value) * 100
        const decimal = total.toFixed(format.decimals)
        const decimalArr = decimal.split('.')
        return `${this.toThousands(decimalArr)}%`
      }
    }
    return value
  }
}

/**
   *
   *
   * @param {Dom Elemement} el
   * @param {String} className
   */
export const hasClass = (el, className) => {
  if (el.classList) {
    el.classList.contains(className)
  } else {
    new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className)
  }
}

/**
   *
   *
   * @param {Dom Elemement} el
   * @param {String} className
   */
export const removeClass = (el, className) => {
  if (el.classList) {
    el.classList.remove(className)
  } else {
    el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ')
  }
}

/**
   *
   *
   * @param {Dom Elemement} el
   * @param {String} className
   */
export const addClass = (el, className) => {
  if (el.classList) {
    el.classList.add(className)
  } else {
    el.className += ` ${className}`
  }
}

/**
 * 验证报表等名称是否合法
 * @param {string} reportName
 */
export const checkReportName = (reportName) => {
  const namePattern = /^[\u4e00-\u9fa5a-zA-Z0-9\s_\-()]{1,100}$/
  if (reportName) {
    return namePattern.test(String(reportName))
  }
  return false
}
