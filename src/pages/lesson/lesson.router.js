import Vue from 'vue'
import Router from 'vue-router'
const Lesson = () => import('@/components/lesson/Lesson')
const Maker = () => import('@/components/lesson/Maker')
const Teacher = () => import('@/components/lesson/Teacher')
const Student = () => import('@/components/lesson/Student')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'Lesson',
      component: Lesson
    },
    {
      path: '/maker',
      name: 'Maker',
      component: Maker
    },
    {
      path: '/teacher',
      name: 'Teacher',
      component: Teacher
    },
    {
      path: '/student',
      name: 'Student',
      component: Student
    }
  ]
})
