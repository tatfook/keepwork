import Vue from 'vue'
import Router from 'vue-router'
const Lesson = () => import('@/components/lesson/Lesson')
const About = () => import('@/components/lesson/common/About')
const Center = () => import('@/components/lesson/common/Center')
const HerePage = () => import('@/components/lesson/common/HerePage')
const Teacher = () => import('@/components/lesson/Teacher')
const Student = () => import('@/components/lesson/Student')
const StudentPackageDetailPage = () =>
  import('@/components/lesson/student/PackageDetailPage')
const TeacherPackageDetailPage = () =>
  import('@/components/lesson/teacher/PackageDetailPage')
const LessonStudent = () => import('@/components/lesson/student/Lesson')
const LessonTeacher = () => import('@/components/lesson/teacher/Lesson')
const StudentColumn = () => import('@/components/lesson/student/StudentColumn')
const TeacherColumn = () => import('@/components/lesson/teacher/TeacherColumn')
const Teach = () => import('@/components/lesson/teacher/TeacherColumnTEACH')
const Review = () => import('@/components/lesson/teacher/TeacherColumnREVIEW')
const LessonSummaryShare = () =>
  import('@/components/lesson/student/LessonSummaryShare')
const PurchasePackage = () =>
  import('@/components/lesson/common/PurchasePackage')
const Share = () => import('@/components/lesson/Share')
const LessonStudentRecord = () => import('@/components/lesson/teacher/LessonStudentRecord')

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
          path: '/',
          name: 'TeacherColumn',
          component: TeacherColumn,
          children: [
            {
              path: '/',
              name: 'Teach',
              component: Teach
            },
            {
              path: 'review',
              name: 'Review',
              component: Review
            }
          ]
        },
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
          path: 'here',
          name: 'HerePage',
          component: HerePage
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
        },
        {
          path: 'package/:id/lesson/:lessonId',
          name: 'LessonTeacher',
          component: LessonTeacher
        },
        {
          path: 'student/:studentId/record',
          name: 'LessonStudentRecord',
          component: LessonStudentRecord
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
          path: 'here',
          name: 'HerePage',
          component: HerePage
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
          name: 'LessonStudent',
          component: LessonStudent
        },
        {
          path: 'share/package/:packageId/lesson/:lessonId',
          name: 'LessonSummaryShare',
          component: LessonSummaryShare
        }
      ]
    },
    {
      path: '/share',
      name: 'Share',
      component: Share,
      children: [
        {
          path: 'package/:packageId/lesson/:lessonId/style/:styleId',
          name: 'LessonSummaryShare',
          component: LessonSummaryShare
        }
      ]
    }
  ]
})
