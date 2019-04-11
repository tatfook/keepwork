import Vue from 'vue'
import Router from 'vue-router'
const PageViewer = () => import('@/components/viewer/MdPageViewer')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'PageViewer',
      component: PageViewer
    }
  ]
})
