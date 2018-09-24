const layout = () => import('@/components/Layouts/LayoutAside')
const systemManage = () => import(/* webpackChunkName: "develop-monitor" */ '../views/system/systemManage')
const userManage = () => import(/* webpackChunkName: "develop-monitor" */ '../views/system/userManage')

export default {
  path: '/',
  component: layout,
  children: [
    {
      path: 'systemManage',
      component: systemManage
    },
    {
      path: 'userManage',
      component: userManage
    }
  ]
}
