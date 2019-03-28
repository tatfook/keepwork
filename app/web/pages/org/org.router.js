import Vue from 'vue'
import Router from 'vue-router'
const OrgLogin = () => import('@/components/org/OrgLogin')
const OrgContact = () => import('@/components/org/OrgContact')
const OrgNotFound = () => import('@/components/org/OrgNotFound')
const OrgTeacherContainer = () => import('@/components/org/OrgTeacher')
const OrgTeacher = () => import('@/components/org/teacher/OrgTeacher')
const OrgTeacherTeach = () => import('@/components/org/teacher/OrgTeacherTeach')
const OrgTeacherStatistics = () => import('@/components/org/teacher/OrgTeacherStatistics')
const OrgTeacherClass = () => import('@/components/org/teacher/OrgTeacherClass')
const OrgTeacherClassPackage = () => import('@/components/org/teacher/OrgTeacherClassPackage')
const OrgTeacherClassPackageLesson = () => import('@/components/org/teacher/OrgTeacherClassPackageLesson')
const OrgTeacherLessonPlan = () => import('@/components/org/teacher/OrgTeacherLessonPlan')
const OrgTeacherLessonPerformance = () => import('@/components/org/teacher/OrgTeacherLessonPerformance')
const OrgTeacherLessonSummary = () => import('@/components/org/teacher/OrgTeacherLessonSummary')
const OrgTeacherLessonStudentRecord = () => import('@/components/org/teacher/OrgTeacherLessonStudentRecord')
const OrgStudentContainer = () => import('@/components/org/OrgStudent')
const OrgStudent = () => import('@/components/org/student/OrgStudent')
const OrgStudentClass = () => import('@/components/org/student/OrgStudentClass')
const OrgStudentPackage = () => import('@/components/org/student/OrgStudentPackage')
const OrgStudentPackageLesson = () => import('@/components/org/student/OrgStudentPackageLesson')
const LearnSummary = () => import('@/components/org/student/LearnSummary')
const OrgAdmin = () => import('@/components/org/OrgAdmin')
const OrgPackages = () => import('@/components/org/admin/OrgPackages')
const OrgClasses = () => import('@/components/org/admin/OrgClasses')
const OrgSetting = () => import('@/components/org/admin/OrgSetting')
const ClassList = () => import('@/components/org/admin/ClassList')
const NewClass = () => import('@/components/org/admin/NewClass')
const EditClass = () => import('@/components/org/admin/EditClass')
const ClassDetail = () => import('@/components/org/admin/ClassDetail')
const NewTeacher = () => import('@/components/org/admin/NewTeacher')
const TeacherList = () => import('@/components/org/admin/TeacherList')
const StudentList = () => import('@/components/org/admin/StudentList')
const NewStudent = () => import('@/components/org/admin/NewStudent')
const EditMember = () => import('@/components/org/admin/EditMember')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/org',
  routes: [
    {
      path: '*',
      component: OrgNotFound
    },
    {
      path: '/:orgLoginUrl',
      redirect: { name: 'OrgLogin' }
    },
    {
      path: '/:orgLoginUrl/contact',
      name: 'OrgContact',
      component: OrgContact
    },
    {
      path: '/:orgLoginUrl/notfound',
      name: 'OrgNotFound',
      component: OrgNotFound
    },
    {
      path: '/:orgLoginUrl/login',
      name: 'OrgLogin',
      component: OrgLogin
    },
    {
      path: '/:orgLoginUrl/student',
      name: 'OrgStudentContainer',
      component: OrgStudentContainer,
      redirect: { name: 'OrgStudent' },
      children: [
        {
          path: '/',
          name: 'OrgStudent',
          component: OrgStudent,
          redirect: { name: 'OrgStudentClass' },
          children: [
            {
              path: 'OrgStudentClass',
              name: 'OrgStudentClass',
              component: OrgStudentClass
            }
          ]
        },
        {
          path: 'package/:packageId',
          name: 'OrgStudentPackage',
          component: OrgStudentPackage
        },
        {
          path: 'package/:packageId/lesson/:lessonId',
          name: 'OrgStudentPackageLesson',
          component: OrgStudentPackageLesson
        },
        {
          path: 'learnSummary/package/:packageId/lesson/:lessonId',
          name: 'OrgStudentLearnSummary',
          component: LearnSummary
        }
      ]
    },
    {
      path: '/:orgLoginUrl/teacher',
      name: 'OrgTeacherContainer',
      component: OrgTeacherContainer,
      redirect: { name: 'OrgTeacher' },
      children: [
        {
          path: '/',
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
          path: 'package/:packageId/lesson/:lessonId/classroom/:classroomId/summary',
          name: 'OrgTeacherLessonSummaryPage',
          component: OrgTeacherLessonSummary
        },
        {
          path:
						'/:orgLoginUrl/teacher/student/:userId/classId/:classId/lessonNo/:lessonNo/lessonName/:lessonName/record',
          name: 'OrgTeacherLessonStudentRecord',
          component: OrgTeacherLessonStudentRecord
        },
        {
          path: '/:orgLoginUrl/teacher/teach/class/:classId/package/:packageId',
          name: 'OrgTeacherClassPackage',
          component: OrgTeacherClassPackage
        },
        {
          path: '/:orgLoginUrl/teacher/teach/class/:classId/package/:packageId/lesson/:lessonId',
          name: 'OrgTeacherClassPackageLesson',
          component: OrgTeacherClassPackageLesson,
          redirect: { name: 'OrgTeacherLessonPlan' },
          children: [
            {
              path: 'lessonPlan',
              name: 'OrgTeacherLessonPlan',
              component: OrgTeacherLessonPlan
            },
            {
              path: 'lessonPerformance',
              name: 'OrgTeacherLessonPerformance',
              component: OrgTeacherLessonPerformance
            },
            {
              path: 'lessonSummary/:classroomId/',
              name: 'OrgTeacherLessonSummary',
              component: OrgTeacherLessonSummary
            }
          ]
        }
      ]
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
          redirect: { name: 'OrgClassList' },
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
              path: 'class/edit',
              name: 'OrgEditClass',
              component: EditClass
            },
            {
              path: 'class/detail',
              name: 'OrgClassDetail',
              component: ClassDetail
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
              path: 'teacher/edit',
              name: 'OrgEditTeacher',
              component: EditMember
            },
            {
              path: 'student',
              name: 'OrgStudentList',
              component: StudentList
            },
            {
              path: 'student/new',
              name: 'OrgNewStudent',
              component: NewStudent
            },
            {
              path: 'student/edit',
              name: 'OrgEditStudent',
              component: EditMember
            }
          ]
        },
        {
          path: 'setting',
          name: 'OrgSetting',
          component: OrgSetting
        }
      ]
    },
    {
      path: '/:orgLoginUrl/*',
      component: OrgNotFound
    }
  ]
})
