import Vue from 'vue'
import Router from 'vue-router'
const ProfileDetailPage = () => import('@/components/profile/ProfileDetailPage')
const NotFound = () => import('@/components/profile/NotFound')
const ProfileIndex = () => import('@/components/profile/ProfileIndex')
const ProfileSocial = () => import('@/components/profile/ProfileSocial')
const ProfileProject = () => import('@/components/profile/ProfileProject')
const PasswordResetPage = () => import('@/components/profile/PasswordResetPage')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/u',
  routes: [
    {
      path: '*',
      name: 'ProfileNotFound',
      component: NotFound
    },
    {
      path: '/set',
      name: 'PasswordResetPage',
      component: PasswordResetPage
    },
    {
      path: '/:username',
      component: ProfileDetailPage,
      children: [{
        path: '/:username',
        name: 'ProfileIndexPage',
        component: ProfileIndex
      },
      {
        path: '/:username/social',
        name: 'ProfileSocialPage',
        component: ProfileSocial
      },
      {
        path: '/:username/project',
        name: 'ProfileProjectPage',
        component: ProfileProject
      }]
    }
  ]
})
