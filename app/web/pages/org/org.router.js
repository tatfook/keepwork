import Vue from 'vue'
import Router from 'vue-router'
const OrgLogin = () => import('@/components/org/OrgLogin')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/org',
  routes: [
    {
      path: '*',
      name: 'OrgIndex',
      component: OrgLogin
    },
    {
      path: '/:orgName',
      redirect: { name: 'OrgLogin' }
    },
    {
      path: '/:orgName/login',
      name: 'OrgLogin',
      component: OrgLogin
    }
  ]
})
