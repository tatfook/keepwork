import Vue from 'vue'
import Router from 'vue-router'
const PblIndex = () => import('@/components/pbl/PblIndex')
const ProjectPage = () => import('@/components/pbl/ProjectPage')
const NewProject = () => import('@/components/pbl/NewProject')
const ProjectDetailPage = () => import('@/components/pbl/ProjectDetailPage')
const ProjectIndex = () => import('@/components/pbl/ProjectIndex')
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
      path: '/project/:id',
      component: ProjectDetailPage,
      children: [{
        path: '/',
        name: 'ProjectIndexPage',
        component: ProjectIndex
      }, {
        path: '/project/:id/edit',
        name: 'EditProject',
        component: EditProject
      }]
    }
  ]
})
