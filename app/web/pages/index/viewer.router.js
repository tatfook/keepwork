import Vue from 'vue'
import Router from 'vue-router'
const HomePage = () => import('@/components/common/HomePage')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    }
  ]
})
