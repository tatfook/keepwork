import Vue from 'vue'
import Router from 'vue-router'

const ContestsPage = () => import('@/components/contests/ContestsPage')
const ContestsHomePage = () => import('@/components/contests/ContestsHomePage')
const ContestsRules = () => import('@/components/contests/ContestsRules')
const ContestsDynamic = () => import('@/components/contests/ContestsDynamic')
const ContestsDynamicWorks = () => import('@/components/contests/ContestsDynamicWorks')
const ContestsDynamicNews = () => import('@/components/contests/ContestsDynamicNews')
const ApplyWay = () => import('@/components/contests/ApplyWay')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/han',
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
          component: ContestsDynamic,
          children: [
            {
              path: 'works',
              name: 'ContestsDynamicWorks',
              component: ContestsDynamicWorks
            },
            {
              path: 'news',
              name: 'ContestsDynamicNews',
              component: ContestsDynamicNews
            }
          ]
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