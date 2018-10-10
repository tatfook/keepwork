import Vue from 'vue'
import Router from 'vue-router'
const PblIndex = () => import('@/components/pbl/PblIndex')
const ProjectPage = () => import('@/components/pbl/ProjectPage')
const NewProject = () => import('@/components/pbl/NewProject')
const EditProject = () => import('@/components/pbl/EditProject')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/pbl',
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
    },
    {
      path: '/project/:id/edit',
      name: 'EditProject',
      component: EditProject
    }
  ]
})
