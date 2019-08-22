import Vue from 'vue'
import Router from 'vue-router'
const PblIndex = () => import('@/components/pbl/PblIndex')
const ProjectPage = () => import('@/components/pbl/ProjectPage')
const NewProject = () => import('@/components/pbl/NewProject')
const ProjectDetailPage = () => import('@/components/pbl/ProjectDetailPage')
const ProjectIndex = () => import('@/components/pbl/ProjectIndex')
const EditProject = () => import('@/components/pbl/EditProject')
const ProjectWhiteBoard = () => import('@/components/pbl/ProjectWhiteBoard')
const DeleteProject = () => import('@/components/pbl/DeleteProject')
const NotVerifiedPage = () => import('@/components/pbl/NotVerifiedPage')

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
      path: '/notVerifiedPage',
      name: 'NotVerifiedPage',
      component: NotVerifiedPage
    },
    {
      path: '/project',
      name: 'ProjectPage',
      component: ProjectPage
    },
    {
      path: '/project/new',
      name: 'NewProject',
      component: NewProject,
      meta: { requireAuth: true }
    },
    {
      path: '/project/:id',
      component: ProjectDetailPage,
      children: [{
        path: '/',
        name: 'ProjectIndexPage',
        component: ProjectIndex
      },
      {
        path: '/project/:id/whiteboard',
        name: 'ProjectWhiteBoard',
        component: ProjectWhiteBoard
      },
      {
        path: '/project/:id/edit',
        name: 'EditProject',
        component: EditProject
      },
      {
        path: '/project/:id/delete',
        name: 'DeleteProject',
        component: DeleteProject
      }]
    }
  ]
})
