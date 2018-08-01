import Vue from 'vue'
import Router from 'vue-router'
const Lesson = () => import('@/components/lesson/Lesson')
const Center = () => import('@/components/lesson/Center')
const Teacher = () => import('@/components/lesson/Teacher')
const Student = () => import('@/components/lesson/Student')
const PackageDetailPage = () => import('@/components/lesson/PackageDetailPage')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'Lesson',
      component: Lesson
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
          path: 'package',
          name: 'Package',
          component: PackageDetailPage
        }
      ]
    },
    {
      path: '/student',
      name: 'Student',
      component: Student
    }
  ]
})
