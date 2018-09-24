import LayoutBlank from '@/components/Layouts/LayoutBlank'

const dashboard = () => import(/* webpackChunkName: "tig-charts" */ './layout/dashboard')
import batchManage from './components/batchManage/batchManage'

// 路由入口
export default {
  path: '/',
  component: LayoutBlank,
  children: [
    // 创建可视化
    {
      path: 'dashboard',
      component: dashboard
    },
    // 查看可视化报表
    {
      path: 'visual',
      component: dashboard
    },
    // 再编辑
    {
      path: 'edit',
      component: dashboard
    },
    // 兼容性批量管理
    {
      path: 'batchManage',
      component: batchManage
    }
  ]
}
