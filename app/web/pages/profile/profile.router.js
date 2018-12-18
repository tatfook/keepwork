import Vue from 'vue'
import Router from 'vue-router'
const ProfileDetailPage = () => import('@/components/profile/ProfileDetailPage')
const NotFound = () => import('@/components/profile/NotFound')
const ProfileIndex = () => import('@/components/profile/ProfileIndex')
const ProfileSocial = () => import('@/components/profile/ProfileSocial')
const ProfileProject = () => import('@/components/profile/ProfileProject')
const PasswordResetPage = () => import('@/components/profile/PasswordResetPage')
const PersonalCenter = () => import('@/components/profile/PersonalCenter')
const UserData = () => import('@/components/profile/PersonalCenterComponents/UserData')
const ChangePassword = () => import('@/components/profile/PersonalCenterComponents/ChangePassword')
const ThirdPartyAccountBinding = () => import('@/components/profile/PersonalCenterComponents/ThirdPartyAccountBinding')
const RealNameAuthentication = () => import('@/components/profile/PersonalCenterComponents/RealNameAuthentication')
const LoginPage = () => import('@/components/profile/LoginPage')
const Login = () => import('@/components/profile/Login')
const Register = () => import('@/components/profile/Register')

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
      path: '/r',
      name: LoginPage,
      component: LoginPage,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        },
      ]
    },
    {
      path: '/p',
      name: 'PersonalCenter',
      component: PersonalCenter,
      children: [
        {
          path: 'userData',
          name: 'UserData',
          component: UserData
        },
        {
          path: 'changePassword',
          name: 'ChangePassword',
          component: ChangePassword
        },
        {
          path: 'thirdPartyAccountBinding',
          name: 'ThirdPartyAccountBinding',
          component: ThirdPartyAccountBinding
        },
        {
          path: 'realNameAuthentication',
          name: 'RealNameAuthentication',
          component: RealNameAuthentication
        }
      ]
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
