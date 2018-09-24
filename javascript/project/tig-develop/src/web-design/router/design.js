const design = () => import(/* webpackChunkName: "develop-design" */ '../views/design')

export default {
  name: 'design',
  path: '/design',
  component: design,
  meta: {
    auth: 'login'
  }
}
