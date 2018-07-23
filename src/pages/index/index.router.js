import Vue from 'vue'
import Router from 'vue-router'
const PageViewer = () => import('@/components/viewer/MdPageViewer')
const PerfectRegisterInfo = () => import('@/components/common/PerfectRegisterInfo')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/PerfectRegisterInfo',
      name: 'PerfectRegisterInfo',
      component: PerfectRegisterInfo
    },
    {
      path: '*',
      name: 'PageViewer',
      component: PageViewer
    }
  ]
})
