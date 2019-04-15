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
      component: MyOrganization
    },
    {
      path: '/createPackage',
      name: 'CreatePackage',
      component: CreatePackage
    },
    {
      path: '/teachingGroup',
      name: TeachingGroup,
      component: TeachingGroup
    }
  ]
})