const Layout = () => import('@/components/Layouts/LayoutAside')
const use = () => import(/* webpackChunkName: "develop-monitor" */ '../views/monitor/use')
const exp = () => import(/* webpackChunkName: "develop-monitor" */ '../views/monitor/exp')
const visit = () => import(/* webpackChunkName: "develop-monitor" */ '../views/monitor/visit')

export default {
  path: '/monitor',
  component: Layout,
  children: [
    {
      path: 'use',
      component: use
    },
    {
      path: 'exp',
      component: exp
    },
    {
      path: 'visit',
      component: visit
    }
  ]
}
