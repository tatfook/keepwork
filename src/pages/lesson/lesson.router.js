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

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'Lesson',
      component: Lesson
    },
    // {
    //   path: '/about',
    //   name: 'About',
    //   component: About
    // },
    // {
    //   path: '/center',
    //   name: 'Center',
    //   component: Center
    // },
    {
      path: '/teacher',
      name: 'Teacher',
      component: Teacher,
      children: [
        {
          path: 'package/:id',
          name: 'TeacherPackage',
          component: TeacherPackageDetailPage
        }
      ]
    },
    {
      path: '/student',
      name: 'Student',
      component: Student,
      children: [
        {
          path: '/',
          name: 'StudentColumn',
          component: StudentColumn
        },
        {
          path: 'about',
          name: 'About',
          component: About
        },
        {
          path: 'center',
          name: 'Center',
          component: Center
        },
        {
          path: 'package/:id',
          name: 'StudentPackage',
          component: StudentPackageDetailPage
        },
        {
          path: 'package/:id/lesson/:id',
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
