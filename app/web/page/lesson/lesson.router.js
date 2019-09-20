import Vue from 'vue'
import Router from 'vue-router'
const Preview = () => import('@/components/lesson/Preview')
const PackagePreview = () => import('@/components/lesson/preview/PackagePreview')
const LessonPreview = () => import('@/components/lesson/preview/LessonPreview')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/l',
  routes: [
    {
      path: '/preview',
      name: 'Preview',
      component: Preview,
      children: [
        {
          path: 'package/:packageId',
          name: 'PackagePreview',
          component: PackagePreview
        },
        {
          path: 'lesson/:lessonId',
          name: 'LessonPreview',
          component: LessonPreview
        },
        {
          path: 'lesson/:lessonId/courseware',
          name: 'LessonPreviewCourseware',
          component: LessonPreview
        },
      ]
    }
  ]
})
