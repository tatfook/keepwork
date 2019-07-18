import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const CompLib = () => import('@/components/paracraft/CompLib')

export default new Router({
  mode: 'history',
  base: '/p',
  routes: [
    {
      path: '/comp/system',
      name: 'ParacraftComps',
      component: CompLib
    }
  ]
})
