import api from './index'

export default {
  // 获取用户信息和菜单
  user() {
    return api.get('/permission/loginUserInfo')
  }
}
