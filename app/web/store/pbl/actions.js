import { keepwork } from '@/api'
import { props } from './mutations'
import _ from 'lodash'

let {
  TOGGLE_LOGIN_DIALOG,
  GET_ALL_PROJECTS
} = props

const actions = {
  async toggleLoginDialog({ commit }, status) {
    commit(TOGGLE_LOGIN_DIALOG, status)
  },
  async createNewProject(context, { description, name, privilege, type, visibility }) {
    await keepwork.projects.createProject({ description, name, privilege, type, visibility }).then(() => {
      return Promise.resolve()
    }).catch((error) => {
      return Promise.reject(error)
    })
  },
  async setAllProjects({ commit }) {
    await keepwork.projects
      .getProjects()
      .then(res => {
        console.log('res', res)
        let allProjects = _.get(res, 'rows', [])
        console.log('all', allProjects)
        commit(GET_ALL_PROJECTS, allProjects)
      }).catch(err => console.error(err))
  }
}

export default actions
