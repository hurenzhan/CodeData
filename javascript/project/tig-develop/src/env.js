// 配置
let prefix = {
  develop: '/tig-report'
}

// 环境变量
let env = ''
let envDataCloud = env
let envSSO = env

// 请求环境
switch (location.hostname) {
  // DEV
  case 'tiangongdev.cnsuning.com': {
    env = 'dev'
    envDataCloud = env
    envSSO = env
    break
  }
  // PRE
  case 'tigpre.cnsuning.com': {
    env = 'pre'
    envDataCloud = 'prexg'
    envSSO = 'prexg'
    break
  }
  case 'tiangongpre.cnsuning.com': {
    env = 'pre'
    envDataCloud = 'prexg'
    envSSO = 'prexg'
    break
  }
  // PRD
  case 'tig.cnsuning.com': {
    env = ''
    envDataCloud = env
    envSSO = env
    break
  }
  case 'tig.cnsuning.com': {
    env = ''
    envDataCloud = env
    envSSO = env
    break
  }
  case 'tiangong.cnsuning.com': {
    env = ''
    envDataCloud = env
    envSSO = env
    break
  }
  // SIT
  case 'tigsit.cnsuning.com': {
    env = 'sit'
    envDataCloud = env
    envSSO = env
    break
  }
  case 'tiangongsit.cnsuning.com': {
    env = 'sit'
    envDataCloud = env
    envSSO = env
    break
  }
  default: {
    // 本地开发时，环境切换
    env = ''
    envDataCloud = env
    envSSO = env
    break
  }
}

// 全局环境变量
window.env = env

// 正式接口地址
/* eslint-disable */
let api = `http://tigbs${env}.cnsuning.com`
const dataCloud = `http://datacloud${envDataCloud}.cnsuning.com`
const uploadHost = `http://tigbs${env}.cnsuning.com/zuul`
const exportHost = `http://tigbs${env}.cnsuning.com/portal/openApi/reportExport/download`

/*
业务端跳转的地址
sit:
https://ssosit.cnsuning.com/ids/login?service=http://tigbssit.cnsuning.com/portal/auth?targetUrl=http://tigsit.cnsuning.com/business.html
pre:
https://ssopre.cnsuning.com/ids/login?service=http://tigbspre.cnsuning.com/portal/auth?targetUrl=http://tigpre.cnsuning.com/business.html

https://ssoprexg.cnsuning.com/ids/login?service=http://tigbspre.cnsuning.com/portal/auth?targetUrl=http://tigpre.cnsuning.com/business.html

prod:
https://sso.cnsuning.com/ids/login?service=http://tigbs.cnsuning.com/portal/auth?targetUrl=http://tig.cnsuning.com/business.html
*/
const ssoLoginBusiness = `https://sso${envSSO}.cnsuning.com/ids/login?service=http://tigbs${env}.cnsuning.com/portal/auth?targetUrl=http://tig${env}.cnsuning.com/business.html`

/*
  退出登录
  https://ssosit.cnsuning.com/ids/logout?service=http://tigsit.cnsuning.com/business.html#/login
*/
const ssoLogoutBussiness = `https://sso${envSSO}.cnsuning.com/ids/logout?service=http://tig${env}.cnsuning.com`

// DIP 环境选择 只有DIP环境要用开发环境，其他走真实地址即可
/* eslint-disable */
if (process.env.NODE_ENV === 'development') {
  // api = '/dip'
}

export default {
  mobileDesign: `http://d.tiangong${env}.cnsuning.com/#/dashboard`,
  api,
  prefix,
  uploadHost,
  exportHost,
  dataCloud,
  ssoLoginBusiness,
  ssoLogoutBussiness
}
