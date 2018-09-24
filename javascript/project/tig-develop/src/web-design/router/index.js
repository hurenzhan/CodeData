import Nothing from '@/components/Nothing'
import table from './table'
import system from './system'
import design from './design'
import monitor from './monitor'
import charts from '../views/charts'
import Layout from '@/components/Layouts/LayoutAside'

const elementTable = () => import(/* webpackChunkName: "develop-design" */ '../views/elementTable')

export default [

  {
    path: '/',
    redirect: '/tableCharts'
  },
  monitor,
  table,
  system,
  design,
  charts,
  {
    path: '/table',
    component: elementTable,
    meta: {
      auth: 'login'
    }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'nothing',
        component: Nothing,
        meta: {
          auth: 'login'
        }
      }
    ]
  },
]
