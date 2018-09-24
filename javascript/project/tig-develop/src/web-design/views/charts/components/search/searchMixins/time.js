export default {
  methods: {
    // 今日 0时0分0秒的时间戳
    getTodayTimeStamp () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let dateString = [year, month, day].join('-')
      return Date.parse(new Date(dateString))
    },
    // 获取前一天
    getPreDate (time) {
      let timestamp = Date.parse(time)
      let date = new Date(timestamp - 24 * 60 * 60 * 1000)
      return this.getFullTime(date, 'day')
    },
    // 获取前N天
    getPreDateByCount (time, count) {
      let timestamp = Date.parse(new Date())
      let date = new Date(timestamp - 24 * 60 * 60 * 1000 * parseInt(count))
      return this.getFullTime(date, 'day')
    },
    // 获取前一个月
    getPreMonth (time) {
      let year = time.getFullYear()
      let month = time.getMonth()
      if (month === 0) {
        month = 12
        year = year - 1
      }
      if (parseInt(month) < 10) {
        month = '0' + month
      }
      return `${year}-${month}`
    },
    // 获取前一个季度 => 转化为月份
    getPreQuater (time) {
      let year = time.getFullYear()
      let month = time.getMonth()
      if (month === 0) {
        month = 12
        year = year -1
      }
      return year + '-' + 'month'
    },
    // 获取前一年
    getPreYear (time) {
      let year = time.getFullYear() - 1
      return year.toString()
    },
    // 时间操作函数
    getFullTime (string, type) {
      let date = this.getDateString(string.getFullYear(), string.getMonth(), string.getDate(), type)
      return date
    },
    // 时间操作函数
    getFullDateTime (string) {
      let date = this.getDateString(string.getFullYear(), string.getMonth(), string.getDate(), 'day')
      let time = this.getTimeString(string.getHours(), string.getMinutes(), string.getSeconds())
      return date + ', ' + time
    },
    // 获取日期字符
    getDateString (year, month, day, type) {
      month = parseInt(month) + 1
      if (month < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      // 格式 xxxx-xx-xx
      if (type === 'year') {
        return year.toString()
      }
      // 格式 xxxx-xx-xx
      if (type === 'month') {
        return year + '-' + month
      }
      // 格式 xxxx-xx-xx
      if (type === 'day') {
        return year + '-' + month + '-' + day
      }
    },
    // params: 时，分，秒
    // return: 时:分:秒格式字符串
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
    },
    // params: 根据当前时间往前推count小时
    // return: 返回 Year-month-day-hour 时间格式字符串
    getHourByCount (count) {
      let timestamp = Date.parse(new Date()) - parseInt(count) * 60 * 60 * 1000
      let newDate = new Date(timestamp)
      let year = newDate.getFullYear()
      let month = newDate.getMonth()
      let day = newDate.getDate()
      let hour = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
      return this.getDateString(year, month, day, 'day') + '-' + hour
    },
    // 去年前一天
    getPreDateLastYear (time) {
      let year = time.getFullYear() - 1
      let month = time.getMonth()
      let day = time.getDate()
      // 闰年二月份最后一天
      if ( (year % 400 === 0 || year % 4 === 0) && (month + 1) === 2 && day ===  29) {
        day = 28
      }
      let timestring = this.getDateString(year, month, day, 'day')
      return this.getPreDate(new Date(timestring))
    },
    // 去年同日
    getDateLastYear (time) {
      let nowYear = time.getFullYear()
      let year = time.getFullYear() - 1
      let month = time.getMonth()
      let day = time.getDate()
      // 闰年二月份最后一天
      if ( (nowYear % 400 === 0 || year % 4 === 0) && (month + 1) === 2 && day ===  29) {
        day = 28
      }
      return this.getDateString(year, month, day, 'day')
    },
    // 去年同月
    getMonthLastYear (time) {
      let year = time.getFullYear() - 1
      let month = time.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      return `${year}-${month}`
    },
    // 去年前月
    getPreMonthLastYear (time) {
      let year = time.getFullYear() - 1
      let month = time.getMonth()
      if (parseInt(month) === 0) {
        month = 12
        year = year - 1
      } 
      if (month < 10) {
        month = '0' + month
      }
      return `${year}-${month}`
    },
    // 获取季度的起始日期
    // 前一季度TODO
    // 存在遗留问题: 一季度的前一季
    getQuaterOfYear (quater) {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth()
      let date = today.getDate()
      let quaterArr = [{startTime: `${year}-01-01`,endTime: `${year}-03-31`},{startTime: `${year}-04-01`,endTime: `${year}-06-30`},{startTime: `${year}-07-01`,endTime: `${year}-09-30`},{startTime: `${year}-10-01`,endTime: `${year}-12-31`}]

      if (Date.parse(new Date(quaterArr[quater - 1].endTime)) > this.getTodayTimeStamp() ) {
        return [quaterArr[quater - 1].startTime, this.getDateString(year, month, date, 'day')]
      } else {
        return [quaterArr[quater - 1].startTime, quaterArr[quater - 1].endTime]
      }      
    },
    // 获取当年第几周
    getWeekOfYear () {
      let today = new Date()
      let firstDay = new Date(today.getFullYear(),0, 1)
      let dayOfWeek = firstDay.getDay()
      let spendDay = 1
      if (dayOfWeek !== 0) {
        spendDay = 7 - dayOfWeek + 1
      }
      firstDay = new Date(today.getFullYear(), 0, 1 + spendDay)
      var d = Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000)
      var result = Math.ceil(d/7) + 1
      return today.getFullYear() + ` 第 ${result} 周`
    },
    // 获取当周的周一
    getMondayOfWeek () {
      let today = new Date()
      let day = today.getDay()
      let count = day === 0 ? 7 -1 : day - 1
      let timestamp = this.getTodayTimeStamp() - count * 24 * 60 * 60 * 1000
      return new Date(timestamp)
    },
    // 获取前一周的周一
    getMondayOfPreWeek () {
      let today = new Date()
      let day = today.getDay()
      let count = day === 0 ? 7 - 1 : day - 1
      let timestamp = this.getTodayTimeStamp() - (count + 7) * 24 * 60 * 60 * 1000
      return new Date(timestamp)
    }
  }
}