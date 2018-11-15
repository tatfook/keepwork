import Vue from 'vue'
import Router from 'vue-router'
const Editor = () => import('@/components/editor/Editor')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/ed',
  routes: [
    {
      path: '*',
      name: 'Editor',
      component: Editor
    }
  ]
})
