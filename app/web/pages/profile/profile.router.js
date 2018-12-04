import Vue from 'vue'
import Router from 'vue-router'
const ProfileDetailPage = () => import('@/components/profile/ProfileDetailPage')
const NotFound = () => import('@/components/profile/NotFound')
const ProfileIndex = () => import('@/components/profile/ProfileIndex')
const ProfileSocial = () => import('@/components/profile/ProfileSocial')
const ProfileProject = () => import('@/components/profile/ProfileProject')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/user',
  routes: [
    {
      path: '*',
      name: 'ProfileNotFound',
      component: NotFound
    },
    {
      path: '/:id',
      component: ProfileDetailPage,
      children: [{
        path: '/:id',
        name: 'ProfileIndexPage',
        component: ProfileIndex
      },
      {
        path: '/:id/social',
        name: 'ProfileSocialPage',
        component: ProfileSocial
      },
      {
        path: '/:id/project',
        name: 'ProfileProjectPage',
        component: ProfileProject
      }]
    }
  ]
})
