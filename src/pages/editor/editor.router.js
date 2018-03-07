import Vue from 'vue'
import Router from 'vue-router'
const Editor = () => import('@/components/editor/Editor')
const PageViewer = () => import('@/components/viewer/MdPageViewer')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/preview',
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
