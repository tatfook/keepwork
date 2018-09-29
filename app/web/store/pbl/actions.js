import { keepwork } from '@/api'
import { props } from './mutations'

let {
  TOGGLE_LOGIN_DIALOG,
  GET_PROJECT_APPLY_LIST_SUCCESS,
  GET_PROJECT_MEMBERS_SUCCESS,
  GET_PROJECT_DETAIL_SUCCESS
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
  async getProjectDetail(context, { projectId }) {
    let { commit } = context
    await keepwork.projects.getProjectDetail({ projectId }).then(projectDetail => {
      commit(GET_PROJECT_DETAIL_SUCCESS, { projectId, projectDetail })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async updateProject(context, { projectId, updatingProjectData }) {
    await keepwork.projects.updateProject({ projectId, updatingProjectData }).then(() => {
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async getProjectApplyList(context, { objectId, objectType, applyType }) {
    let { commit } = context
    await keepwork.applies.getApplyList({ objectId, objectType, applyType }).then(projectApplyList => {
      commit(GET_PROJECT_APPLY_LIST_SUCCESS, { projectId: objectId, projectApplyList })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async changeApplyState(context, { id, state, objectId, objectType, applyType }) {
    let { dispatch } = context
    await keepwork.applies.updateApplyState({ id, state }).then(async () => {
      await dispatch('getProjectApplyList', { objectId, objectType, applyType })
      await dispatch('getProjectMember', { objectId, objectType })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async getProjectMember(context, { objectId, objectType }) {
    let { commit } = context
    await keepwork.members.getProjectMembersList({ objectId, objectType }).then(memberList => {
      commit(GET_PROJECT_MEMBERS_SUCCESS, { projectId: objectId, memberList })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async deleteMember(context, { id, objectId, objectType }) {
    let { dispatch } = context
    await keepwork.members.deleteMember({ id }).then(async () => {
      await dispatch('getProjectMember', { objectId, objectType })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  }
}

export default actions
