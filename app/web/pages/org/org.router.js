import Vue from 'vue'
import Router from 'vue-router'
const OrgLogin = () => import('@/components/org/OrgLogin')
const OrgTeacher = () => import('@/components/org/teacher/OrgTeacher')
const OrgTeacherTeach = () => import('@/components/org/teacher/OrgTeacherTeach')
const OrgTeacherStatistics = () => import('@/components/org/teacher/OrgTeacherStatistics')
const OrgTeacherClass = () => import('@/components/org/teacher/OrgTeacherClass')
const OrgTeacherClassPackage = () => import('@/components/org/teacher/OrgTeacherClassPackage')
const OrgTeacherClassPackageLesson = () => import('@/components/org/teacher/OrgTeacherClassPackageLesson')
const OrgTeacherLessonPlan = () => import('@/components/org/teacher/OrgTeacherLessonPlan')
const OrgTeacherLessonPerformance = () => import('@/components/org/teacher/OrgTeacherLessonPerformance')
const OrgTeacherLessonSummary = () => import('@/components/org/teacher/OrgTeacherLessonSummary')
const OrgAdmin = () => import('@/components/org/OrgAdmin')
const OrgPackages = () => import('@/components/org/admin/OrgPackages')
const OrgClasses = () => import('@/components/org/admin/OrgClasses')
const OrgSetting = () => import('@/components/org/admin/OrgSetting')
const ClassList = () => import('@/components/org/admin/ClassList')
const NewClass = () => import('@/components/org/admin/NewClass')
const NewTeacher = () => import('@/components/org/admin/NewTeacher')
const TeacherList = () => import('@/components/org/admin/TeacherList')
const StudentList = () => import('@/components/org/admin/StudentList')

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
      path: '/:orgLoginUrl',
      redirect: { name: 'OrgLogin' }
    },
    {
      path: '/:orgLoginUrl/login',
      name: 'OrgLogin',
      component: OrgLogin
    },
    {
      path: '/:orgLoginUrl/teacher',
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
      path: '/:orgLoginUrl/teacher/teach/class/:classId/package/:packageId',
      name: 'OrgTeacherClassPackage',
      component: OrgTeacherClassPackage,
    },
    {
      path: '/:orgLoginUrl/teacher/teach/class/:classId/package/:packageId/lesson/:lessonId',
      name: 'OrgTeacherClassPackageLesson',
      component: OrgTeacherClassPackageLesson,
      redirect: { name: 'OrgTeacherLessonPlan' },
      children: [{
        path: 'lessonPlan',
        name: 'OrgTeacherLessonPlan',
        component: OrgTeacherLessonPlan
      }, {
        path: 'lessonPerformance',
        name: 'OrgTeacherLessonPerformance',
        component: OrgTeacherLessonPerformance
      },
      {
        path: 'lessonSummary/:classId/:lessonId',
        name: 'OrgTeacherLessonSummary',
        component: OrgTeacherLessonSummary
      }]
    },
    {
      path: '/:orgLoginUrl/admin',
      name: 'OrgAdmin',
      component: OrgAdmin,
      children: [
        {
          path: 'packages',
          name: 'OrgPackages',
          component: OrgPackages
        },
        {
          path: 'classes',
          component: OrgClasses,
          children: [
            {
              path: 'class',
              name: 'OrgClassList',
              component: ClassList
            },
            {
              path: 'class/new',
              name: 'OrgNewClass',
              component: NewClass
            },
            {
              path: 'teacher',
              name: 'OrgTeacherList',
              component: TeacherList
            },
            {
              path: 'teacher/new',
              name: 'OrgNewTeacher',
              component: NewTeacher
            },
            {
              path: 'student',
              name: 'OrgStudentList',
              component: StudentList
            }
          ]
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
