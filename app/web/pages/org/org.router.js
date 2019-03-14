import Vue from 'vue'
import Router from 'vue-router'
const OrgLogin = () => import('@/components/org/OrgLogin')
const OrgAdmin = () => import('@/components/org/OrgAdmin')
const OrgPackages = () => import('@/components/org/admin/OrgPackages')
const OrgClasses = () => import('@/components/org/admin/OrgClasses')
const OrgSetting = () => import('@/components/org/admin/OrgSetting')

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
      path: '/:orgName/login',
      name: 'OrgLogin',
      component: OrgLogin
    },
    {
      path: '/:orgName/admin',
      component: OrgAdmin,
      children: [
        {
          path: 'packages',
          name: 'OrgPackages',
          component: OrgPackages
        },
        {
          path: 'classes',
          name: 'OrgClasses',
          component: OrgClasses
        },
        {
          path: 'setting',
          name: 'OrgSetting',
          component: OrgSetting
        }
      ]
    }
  ]
})
