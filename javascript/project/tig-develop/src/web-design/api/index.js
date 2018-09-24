import axios from 'axios'
import env from '@/env'
import Utils from '@/components/Utils'
import {
  Message
} from 'element-ui'

// 获取系统ID
const systemId = Utils.getQueryString('systemId')

if (systemId) {
  window.systemId = systemId
} else {
  // 没有系统ID
  location.href = env.dataCloud
}

const auth = (response) => {
  // 未登录
  if (response && ((response.status === 401) || (response.status === 412))) {
    location.href = env.dataCloud
  }
}

const instance = axios.create({
  baseURL: `${env.api}${env.prefix.develop}`,
  params: {
    systemId
  },
  withCredentials: true
})
instance.interceptors.response.use((response) => {
  auth(response)
  if (response && response.data && response.data.statusCode !== '0') {
    Message.error((response.data && response.data.msg) || response.data.errmsg || '抱歉')
    return Promise.reject(response).catch(() => { })
  }
  return Promise.resolve(response.data)
}, (error) => {
  let msg = '网络错误,请稍后再试'
  if (error && error.response && error.response.status === 401) {
    msg = '请登录'
  }
  const notice = document.getElementsByClassName('ivu-message-error')
  if (notice.length === 0) {
    Message.error(msg)
  }
  auth(error && error.response)
  return Promise.reject(error).catch(() => { })
})

export default instance
