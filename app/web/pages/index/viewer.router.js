import Vue from 'vue'
import Router from 'vue-router'
const HomePage = () => import('@/components/common/HomePage')
const CreativityPage = () => import('@/components/common/CreativityPage')
const ExplorationPage = () => import('@/components/common/ExplorationPage')

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/creativity',
      name: 'CreativityPage',
      component: CreativityPage
    },
    {
      path: '/exploration',
      name: 'ExplorationPage',
      component: ExplorationPage
    }
  ]
})
