import Layouts from '@/components/Layouts'

import Home from './Home'

export default [
  {
    path: '/',
    component: Layouts,
    children: [
      {
        path: '',
        name: '首页',
        component: Home
      },
    ]
  }
]
