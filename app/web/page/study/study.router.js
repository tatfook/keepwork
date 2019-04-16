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

const PackageManager = () => import('@/components/lesson/teacher/PackageManager')
const NewPackage = () => import('@/components/lesson/teacher/NewPackage')

const LessonManager = () => import('@/components/lesson/teacher/LessonManager')
const NewLesson = () => import('@/components/lesson/teacher/NewLesson')


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
      children: [
        {
          path: 'lessonManager',
          name: 'LessonManager',
          component: LessonManager
        },
        {
          path: 'lesson/new',
          name: 'TeacherColumnNewLesson',
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
          name: 'TeacherColumnNewPackage',
          component: NewPackage,
          meta: { requireAuth: true }
        },
      ]
    },
    {
      path: '/teachingGroup',
      name: TeachingGroup,
      component: TeachingGroup
    }
  
  ]
})