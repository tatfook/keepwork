import Vue from 'vue'
import Router from 'vue-router'

const ContestsPage = () => import('@/components/contests/ContestsPage')
const ContestsHomePage = () => import('@/components/contests/ContestsHomePage')
const ContestsRules = () => import('@/components/contests/ContestsRules')
const ContestsDynamic = () => import('@/components/contests/ContestsDynamic')
const ApplyWay = () => import('@/components/contests/ApplyWay')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/c',
  routes: [
    {
      path: '*',
      name: 'ContestsPage',
      component: ContestsPage
    },
    {
      path: '/',
      name: 'ContestsPage',
      component: ContestsPage,
      children: [
        {
          path: '/',
          name: 'ContestsHomePage',
          component: ContestsHomePage,
        },
        {
          path: 'contestsRules',
          name: 'ContestsRules',
          component: ContestsRules
        },
        {
          path: 'contestsDynamic',
          name: 'ContestsDynamic',
          component: ContestsDynamic
        },
        {
          path: 'applyWay',
          name: 'ApplyWay',
          component: ApplyWay
        }
      ]
    }
  ]
})