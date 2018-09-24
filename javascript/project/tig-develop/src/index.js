// 多入口配置
let entry = [
  {
    path: 'web-index',
    name: 'index'
  },
  {
    path: 'web-design',
    name: 'develop'
  },
  {
    path: 'private-page',
    name: 'private'
  }
]

if (process.env.NODE_ENV === 'production') {
  entry = [
    {
      path: 'web-index',
      name: 'index'
    },
    {
      path: 'web-design',
      name: 'develop'
    },
    {
      path: 'private-page',
      name: 'private'
    }
  ]
}

module.exports = entry
