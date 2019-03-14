import Vue from 'vue'
import Router from 'vue-router'
const OrgLogin = () => import('@/components/org/OrgLogin')
const OrgTeacher = () => import('@/components/org/teacher/OrgTeacher')
const OrgTeacherTeach = () => import('@/components/org/teacher/OrgTeacherTeach')
const OrgTeacherStatistics = () => import('@/components/org/teacher/OrgTeacherStatistics')
const OrgTeacherClass = () => import('@/components/org/teacher/OrgTeacherClass')
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
      path: '/:orgName',
      redirect: { name: 'OrgLogin' }
    },
    {
      path: '/:orgName/login',
      name: 'OrgLogin',
      component: OrgLogin
    },
    {
      path: '/:orgName/teacher',
      name: 'OrgTeacher',
      component: OrgTeacher,
      redirect: { name: 'OrgTeacherTeach' },
      children: [
        {
          path: 'teach',
          name: 'OrgTeacherTeach',
          component: OrgTeacherTeach
        },
        {
          path: 'statistics',
          name: 'OrgTeacherStatistics',
          component: OrgTeacherStatistics
        },
        {
          path: 'classes',
          name: 'OrgTeacherClass',
          component: OrgTeacherClass
        }
      ]
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
