import Vue from 'vue'
import Router from 'vue-router'
const PblIndex = () => import('@/components/pbl/PblIndex')
const ProjectPage = () => import('@/components/pbl/ProjectPage')
const NewProject = () => import('@/components/pbl/NewProject')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'PBLIndexPage',
      component: PblIndex
    },
    {
      path: '/project',
      name: 'ProjectPage',
      component: ProjectPage
    },
    {
      path: '/project/new',
      name: 'NewProject',
      component: NewProject
    }
  ]
})
