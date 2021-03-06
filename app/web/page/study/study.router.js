import Vue from 'vue'
import Router from 'vue-router'

import Study from '@/components/study/Study'
import Textbook from '@/components/study/Textbook'
import Document from '@/components/study/Document'
import Lesson from '@/components/study/Lesson'
import LessonPackage from '@/components/study/LessonPackage'
import Education from '@/components/study/Education'
import MyOrganization from '@/components/study/MyOrganization'
import CreatePackage from '@/components/study/CreatePackage'
import TeachingGroup from '@/components/study/TeachingGroup'
import OrganizationCooperation from '@/components/study/OrganizationCooperation'
import PackageDetail from '@/components/study/PackageDetail'
import LessonDetail from '@/components/study/LessonDetail'

const PackageManager = () => import('@/components/study/PackageManager')
const NewPackage = () => import('@/components/study/NewPackage')

const LessonManager = () => import('@/components/study/LessonManager')
const NewLesson = () => import('@/components/study/NewLesson')

const EditPackage = () => import('@/components/study/EditPackage')
const EditLesson = () => import('@/components/study/EditLesson')
const Autobiography = () => import('@/components/study/common/Autobiography')
const Solution = () => import('@/components/study/common/Solution')


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/s',
  routes: [
    {
      path: '*',
      name: 'Study',
      component: Study
    },
    {
      path: '/',
      name: 'StudyHome',
      component: Study
    },
    {
      path: '/textbook',
      name: 'Textbook',
      component: Textbook
    },
    {
      path: '/document',
      name: 'Document',
      component: Document
    },
    {
      path: '/lesson',
      name: 'Lesson',
      component: Lesson,
      redirect: { name: 'LessonPackage' },
      children: [
        {
          path: '/',
          name: 'LessonPackage',
          component: LessonPackage
        },
        {
          path: 'organizationCooperation',
          name: 'OrganizationCooperation',
          component: OrganizationCooperation
        },
        {
          path: 'package/:packageId',
          name: 'PackageDetail',
          component: PackageDetail
        }, {
          path: 'package/:packageId/lesson/:lessonId',
          name: 'LessonDetail',
          component: LessonDetail,
          meta: { paracraft: true }
        }
      ]
    },
    {
      path: '/education',
      name: 'Education',
      component: Education
    },
    {
      path: '/myOrganization',
      name: 'MyOrganization',
      component: MyOrganization,
      meta: { requireAuth: true }
    },
    {
      path: '/createPackage',
      name: 'CreatePackage',
      component: CreatePackage,
      redirect: { name: 'LessonManager' },
      meta: { requireAuth: true },
      children: [
        {
          path: 'lessonManager',
          name: 'LessonManager',
          component: LessonManager
        },
        {
          path: 'lesson/new',
          name: 'NewLesson',
          component: NewLesson,
          meta: { requireAuth: true }
        },
        {
          path: 'packageManager',
          name: 'PackageManager',
          component: PackageManager
        },
        {
          path: 'newPackage',
          name: 'NewPackage',
          component: NewPackage,
          meta: { requireAuth: true }
        },
        {
          path: 'package/:id/edit',
          name: 'EditPackage',
          component: EditPackage,
          meta: { requireAuth: true }
        },
        {
          path: 'lesson/:id/edit',
          name: 'EditLesson',
          component: EditLesson,
          meta: { requireAuth: true }
        },
      ]
    },
    {
      path: '/teachingGroup',
      name: TeachingGroup,
      component: TeachingGroup
    },
    {
      path: '/autobiography',
      name: Autobiography,
      component: Autobiography
    },
    {
      path: '/solution/:command',
      name: 'TeacherSolution',
      component: Solution
    }
  ]
})
