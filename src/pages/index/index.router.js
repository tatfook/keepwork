import Vue from 'vue'
import Router from 'vue-router'
const PageViewer = () => import('@/components/viewer/MdPageViewer')
const HomePage = () => import('@/components/common/HomePage')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '*',
      name: 'PageViewer',
      component: PageViewer
    }
  ]
})
