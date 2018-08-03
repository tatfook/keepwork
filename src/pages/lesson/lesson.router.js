import Vue from 'vue'
import Router from 'vue-router'
const Lesson = () => import('@/components/lesson/Lesson')
const About = () => import('@/components/lesson/About')
const Center = () => import('@/components/lesson/Center')
const Teacher = () => import('@/components/lesson/Teacher')
const Student = () => import('@/components/lesson/Student')
const StudentPackageDetailPage = () => import('@/components/lesson/student/PackageDetailPage')
const TeacherPackageDetailPage = () => import('@/components/lesson/teacher/PackageDetailPage')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'Lesson',
      component: Lesson
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/center',
      name: 'Center',
      component: Center
    },
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
          path: 'package/:id',
          name: 'StudentPackage',
          component: StudentPackageDetailPage
        }
      ]
    }
  ]
})
