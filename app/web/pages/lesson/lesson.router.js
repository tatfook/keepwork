import Vue from 'vue'
import Router from 'vue-router'
// const Lesson = () => import('@/components/lesson/Lesson')
const About = () => import('@/components/lesson/common/About')
const Center = () => import('@/components/lesson/common/Center')
const AllTeachingVideo = () => import('@/components/lesson/common/AllTeachingVideo')
const Autobiography = () => import('@/components/lesson/common/Autobiography')
const Solution = () => import('@/components/lesson/common/Solution')
const MoreResources = () => import('@/components/lesson/common/MoreResources')

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
const Teach = () => import('@/components/lesson/teacher/TeacherColumnTeach')
const Review = () => import('@/components/lesson/teacher/TeacherColumnReview')
const PackageManager = () =>
  import('@/components/lesson/teacher/PackageManager')
const LessonManager = () => import('@/components/lesson/teacher/LessonManager')
const NewPackage = () => import('@/components/lesson/teacher/NewPackage')
const EditPackage = () => import('@/components/lesson/teacher/EditPackage')
const EditLesson = () => import('@/components/lesson/teacher/EditLesson')
const NewLesson = () => import('@/components/lesson/teacher/NewLesson')
const SharedCourseLecturer = () =>
  import('@/components/lesson/teacher/SharedCourseLecturer')

const LessonSummaryShare = () =>
  import('@/components/lesson/student/LessonSummaryShare')
const PurchasePackage = () =>
  import('@/components/lesson/common/PurchasePackage')
const Share = () => import('@/components/lesson/Share')
const LessonStudentRecord = () =>
  import('@/components/lesson/teacher/LessonStudentRecord')
const LessonSummary = () =>
  import('@/components/lesson/teacher/LessonTeacherSummary')
const LessonPlan = () => import('@/components/lesson/teacher/LessonTeacherPlan')
const LessonPerformance = () =>
  import('@/components/lesson/teacher/LessonStudentPerformance')
const Print = () => import('@/components/lesson/teacher/Print')
const LearnSummary = () => import('@/components/lesson/student/LearnSummary')
const Bean = () => import('@/components/lesson/student/Bean')
const Visitor = () => import('@/components/lesson/Visitor')
const VisitorLesson = () => import('@/components/lesson/visitor/Lesson')
const LearningCenterPackages = () =>
  import('@/components/lesson/student/LearningCenterPackages')
const OfflineGuidanceCourse = () =>
  import('@/components/lesson/student/OfflineGuidanceCourse')
const TeachingVideo = () => import('@/components/lesson/student/TeachingVideo')
const MentorService = () => import('@/components/lesson/student/MentorService')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/l',
  routes: [
    {
      path: '*',
      name: 'Lesson',
      component: Center
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
              path: 'sharedCourseLecturer',
              name: 'SharedCourseLecturer',
              component: SharedCourseLecturer
            },
            {
              path: '/',
              name: 'TeacherColumn',
              component: Teach,
              meta: { requireAuth: true }
            },
            {
              path: 'review',
              name: 'TeacherColumnReview',
              component: Review,
              meta: { requireAuth: true }
            },
            {
              path: 'lesson/new',
              name: 'TeacherColumnNewLesson',
              component: NewLesson,
              meta: { requireAuth: true }
            },
            {
              path: 'lessonManager',
              name: 'TeacherColumnLessonManager',
              component: LessonManager,
              meta: { requireAuth: true }
            },
            {
              path: 'lesson/:id/edit',
              name: 'TeacherColumnEditLesson',
              component: EditLesson,
              meta: { requireAuth: true }
            },
            {
              path: 'newPackage',
              name: 'TeacherColumnNewPackage',
              component: NewPackage,
              meta: { requireAuth: true }
            },
            {
              path: 'package/:id/edit',
              name: 'TeacherColumnEditPackage',
              component: EditPackage,
              meta: { requireAuth: true }
            },
            {
              path: 'packageManager',
              name: 'TeacherColumnPackageManager',
              component: PackageManager,
              meta: { requireAuth: true }
            }
          ]
        },
        {
          path: 'solution/:command',
          name: 'TeacherSolution',
          component: Solution
        },
        {
          path: 'allteachingvideo/:command',
          name: 'TeacherAllTeachingVideo',
          component: AllTeachingVideo
        },
        {
          path: 'moreResources/:command',
          name: 'TeacherMoreResources',
          component: MoreResources
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
          path: 'autobiography',
          name: 'Autobiography',
          component: Autobiography
        },
        {
          path: 'package/:id',
          name: 'TeacherPackage',
          component: TeacherPackageDetailPage,
          meta: { requireAuth: true }
        },
        {
          path: 'package/:id/purchase',
          name: 'TeacherPurchase',
          component: PurchasePackage,
          meta: { requireAuth: true }
        },
        {
          path: 'package/:packageId/lesson/:lessonId',
          name: 'LessonTeacher',
          component: LessonTeacher,
          meta: { requireAuth: true },
          children: [
            {
              path: '/',
              name: 'LessonTeacherPlan',
              component: LessonPlan
            },
            {
              path: 'plan',
              name: 'LessonTeacherPlan',
              component: LessonPlan
            },
            {
              path: 'performance',
              name: 'LessonTeacherPerformance',
              component: LessonPerformance
            },
            {
              path: 'summary/:classId/:lessonId',
              name: 'LessonTeacherSummary',
              component: LessonSummary
            }
          ]
        },
        {
          path:
            'student/:userId/classId/:classId/lessonNo/:lessonNo/lessonName/:lessonName/record',
          name: 'LessonStudentRecord',
          component: LessonStudentRecord
        },
        {
          path: 'package/:packageId/lesson/:lessonId/class/:classId/summary',
          name: 'LessonSummary',
          component: LessonSummary
        },
        {
          path:
            'package/:packageId/lesson/:lessonId/class/:classId/summary/print',
          name: 'Print',
          component: Print
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
          component: StudentColumn,
          meta: { requireAuth: true },
          children: [
            {
              path: '/',
              name: 'LearningCenterPackages',
              component: LearningCenterPackages
            },
            {
              path: 'offlinecourse',
              name: 'OfflineGuidanceCourse',
              component: OfflineGuidanceCourse
            },
            {
              path: 'teachingvideo',
              name: 'TeachingVideo',
              component: TeachingVideo
            },
            {
              path: 'mentor',
              name: 'MentorService',
              component: MentorService
            }
          ]
        },
        {
          path: 'solution/:command',
          name: 'StudentSolution',
          component: Solution
        },
        {
          path: 'allteachingvideo/:command',
          name: 'StudentAllTeachingVideo',
          component: AllTeachingVideo
        },
        {
          path: 'moreResources/:command',
          name: 'StudentMoreResources',
          component: MoreResources
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
          path: 'autobiography',
          name: 'Autobiography',
          component: Autobiography
        },
        {
          path: 'package/:id',
          name: 'StudentPackage',
          component: StudentPackageDetailPage
        },
        {
          path: 'package/:id/purchase',
          name: 'StudentPurchase',
          component: PurchasePackage,
          meta: { requireAuth: true }
        },
        {
          path: 'package/:packageId/lesson/:lessonId',
          name: 'LessonStudent',
          component: LessonStudent,
          meta: { requireAuth: true }
        },
        {
          path: 'learnSummary/package/:packageId/lesson/:lessonId',
          name: 'LearnSummary',
          component: LearnSummary,
          meta: { requireAuth: true }
        },
        {
          path: 'bean',
          name: 'Bean',
          component: Bean,
          meta: { requireAuth: true }
        }
      ]
    },
    {
      path: '/visitor',
      name: 'Visitor',
      component: Visitor,
      children: [
        {
          path: 'package/:packageId/lesson/:lessonId',
          name: 'Visitor',
          meta: { auto: true }
        }
      ]
    },
    {
      path: '/anonymous',
      name: 'Anonymous',
      component: Visitor,
      children: [
        {
          path: 'package/:packageId/lesson/:lessonId',
          name: 'Anonymous',
          component: VisitorLesson
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
