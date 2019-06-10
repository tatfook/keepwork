import Vue from 'vue'
import Router from 'vue-router'

const ContestsHomePage = () => import('@/components/contests/ContestsHomePage')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/c',
  routes: [
    {
      path: '*',
      name: 'ContestsHomePage',
      component: ContestsHomePage
    },
    {
      path: '/',
      name: 'ContestsHomePage',
      component: ContestsHomePage
    }
  ]
})