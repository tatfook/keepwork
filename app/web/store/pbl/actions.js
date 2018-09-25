import { keepwork } from '@/api'
import { props } from './mutations'

let {
  TOGGLE_LOGIN_DIALOG
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
  }
}

export default actions
