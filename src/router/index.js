import Vue from 'vue'
import Router from 'vue-router'
const Editor = () => import('@/pages/editor/Editor')
const PageViewer = () => import('@/pages/viewer/MdPageViewer')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PageViewer',
      component: PageViewer
    },
    {
      path: '/editor',
      name: 'Editor',
      component: Editor
    }
  ]
})
