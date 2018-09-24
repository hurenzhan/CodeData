
import layout from '@/components/Layouts/LayoutAside'
const tableManage = () => import(/* webpackChunkName: "develop-monitor" */ '../views/table/tableManage/elecTableManage')
const tableDetail = () => import(/* webpackChunkName: "develop-monitor" */ '../views/table/tableDetail')
const tableCreate = () => import(/* webpackChunkName: "develop-monitor" */ '../views/table/tableCreate')
const tableUpdate = () => import(/* webpackChunkName: "develop-monitor" */ '../views/table/tableUpdate')
const tableCharts = () => import(/* webpackChunkName: "develop-monitor" */ '../views/table/tableManage/visualTableManage')

export default {
  path: '/',
  component: layout,
  children: [
    {
      path: 'tableCreate',
      component: tableCreate,
    },
    {
      path: 'tableManage',
      component: tableManage,
    },
    {
      path: 'tableCharts',
      component: tableCharts
    },
    {
      path: 'tableDetail',
      component: tableDetail,
      meta: {
        auth: 'login'
      }
    },
    {
      path: 'tableUpdate',
      component: tableUpdate,
      meta: {
        auth: 'login'
      }
    },
  ]
}
