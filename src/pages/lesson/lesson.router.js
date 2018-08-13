import Vue from 'vue'
import Router from 'vue-router'
const Lesson = () => import('@/components/lesson/Lesson')
const About = () => import('@/components/lesson/common/About')
const Center = () => import('@/components/lesson/common/Center')
const Teacher = () => import('@/components/lesson/Teacher')
const Student = () => import('@/components/lesson/Student')
const StudentPackageDetailPage = () =>
  import('@/components/lesson/student/PackageDetailPage')
const TeacherPackageDetailPage = () =>
  import('@/components/lesson/teacher/PackageDetailPage')
const LessonStudy = () => import('@/components/lesson/common/Lesson')
const StudentColumn = () => import('@/components/lesson/student/StudentColumn')
const LessonSummaryShare = () =>
  import('@/components/lesson/common/LessonSummaryShare')
const PurchasePackage = () => import('@/components/lesson/common/PurchasePackage')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'Lesson',
      component: Lesson
    },
    {
      path: '/teacher',
      name: 'Teacher',
      component: Teacher,
      children: [
        {
          path: 'about',
          name: 'TeacherAbout',
          component: About
        },
        {
          path: 'center',
          name: 'TeacherCenter',
          component: Center
        },
        {
          path: 'package/:id',
          name: 'TeacherPackage',
          component: TeacherPackageDetailPage
        },
        {
          path: 'package/:id/purchase',
          name: 'TeacherPurchase',
          component: PurchasePackage
        }
      ]
    },
    {
      path: '/student',
      component: Student,
      children: [
        {
          path: '/',
          name: 'StudentColumn',
          component: StudentColumn
        },
        {
          path: 'about',
          name: 'StudentAbout',
          component: About
        },
        {
          path: 'center',
          name: 'StudentCenter',
          component: Center
        },
        {
          path: 'package/:id',
          name: 'StudentPackage',
          component: StudentPackageDetailPage
        },
        {
          path: 'package/:id/purchase',
          name: 'StudentPurchase',
          component: PurchasePackage
        },
        {
          path: 'package/:id/lesson/:lessonId',
          name: 'LessonStudy',
          component: LessonStudy
        },
        {
          path: 'share/:id',
          name: 'LessonSummaryShare',
          component: LessonSummaryShare
        }
      ]
    }
  ]
})
