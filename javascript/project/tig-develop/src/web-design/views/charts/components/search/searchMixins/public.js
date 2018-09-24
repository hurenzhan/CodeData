export default {
  // 时间操作函数
  getFullTime (string) {
    let date = this.getDateString(string.getFullYear(), string.getMonth(), string.getDate())
    let time = this.getTimeString(string.getHours(), string.getMinutes(), string.getSeconds())

    return date + ', ' + time
  },
  // 获取日期字符
  getDateString (year, month, day) {
    month = parseInt(month) + 1
    if (month < 10) {
      month = '0' + month
    }
    if (parseInt(day) < 10) {
      day = '0' + day
    }
    // 格式 xxxx-xx-xx
    return year + '.' + month + '.' + day
  },
  // 获取日期字符
  getTodayString () {
    let time = new Date()
    let year = time.getFullYear()
    let month = parseInt(time.getMonth()) + 1
    let day = time.getDate()
    if (month < 10) {
      month = '0' + month
    }
    if (parseInt(day) < 10) {
      day = '0' + day
    }
    // 格式 xxxx-xx-xx
    return year + '-' + month + '-' + day
  },
  // 获取时间字符
  getTimeString (hour, minu, sec) {
    if (parseInt(hour) < 10) {
      hour = '0' + hour
    }
    if (parseInt(minu) < 10) {
      minu = '0' + minu
    }
    if (parseInt(sec) < 10) {
      sec = '0' + sec
    }
    return hour + ':' + minu + ':' + sec
  }
}