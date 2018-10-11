import _ from 'lodash'
import { keepwork } from '@/api'
import { props } from './mutations'

let {
  TOGGLE_LOGIN_DIALOG,
  GET_ALL_PROJECTS,
  GET_PROJECT_APPLY_LIST_SUCCESS,
  GET_PROJECT_MEMBERS_SUCCESS,
  GET_USER_PROJECTS_SUCCESS,
  GET_PROJECT_DETAIL_SUCCESS,
  GET_PROJECT_FAVORITE_STATE_SUCCESS,
  GET_PROJECT_STAR_STATE_SUCCESS,
  GET_COMMENTS_SUCCESS
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
  async getAllProjects({ commit }) {
    await keepwork.projects
      .getProjects()
      .then(res => {
        let allProjects = _.get(res, 'rows', [])
        commit(GET_ALL_PROJECTS, allProjects)
      }).catch(err => console.error(err))
  },
  async getUserProjects(context, { userId, useCache = true }) {
    let { commit, getters: { userProjects } } = context
    let projects = userProjects({ userId })
    if (projects && useCache) {
      return
    }
    await keepwork.projects.getUserProjects({ userId }).then(projects => {
      commit(GET_USER_PROJECTS_SUCCESS, { userId, projects })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async getProjectDetail(context, { projectId, useCache = true }) {
    let { commit, getters: { projectDetail } } = context
    let project = projectDetail({ projectId })
    if (project && useCache) {
      return
    }
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
  },
  async getFavoriteState(context, { objectId, objectType, useCache = true }) {
    let { commit, getters: { projectFavoriteState } } = context
    let favoriteState = projectFavoriteState({ projectId: objectId })
    if (favoriteState && useCache) {
      return
    }
    await keepwork.favorites.existFavorite({ objectId, objectType }).then(async isFavorite => {
      commit(GET_PROJECT_FAVORITE_STATE_SUCCESS, { projectId: objectId, isFavorite })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async favoriteProject(context, { objectId, objectType }) {
    let { dispatch } = context
    await keepwork.favorites.favoriteProject({ objectId, objectType }).then(async () => {
      await dispatch('getFavoriteState', { objectId, objectType, useCache: false })
      await dispatch('getProjectDetail', { projectId: objectId, useCache: false })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async unFavoriteProject(context, { objectId, objectType }) {
    let { dispatch } = context
    await keepwork.favorites.unFavoriteProject({ objectId, objectType }).then(async () => {
      await dispatch('getFavoriteState', { objectId, objectType, useCache: false })
      await dispatch('getProjectDetail', { projectId: objectId, useCache: false })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async getStarState(context, { projectId, useCache = true }) {
    let { commit, getters: { projectStarState } } = context
    let starState = projectStarState({ projectId })
    if (starState && useCache) {
      return
    }
    await keepwork.projects.getStarState({ projectId }).then(async isStared => {
      commit(GET_PROJECT_STAR_STATE_SUCCESS, { projectId, isStared })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async starProject(context, { projectId }) {
    let { dispatch } = context
    await keepwork.projects.starProject({ projectId }).then(async () => {
      await dispatch('getStarState', { projectId, useCache: false })
      await dispatch('getProjectDetail', { projectId, useCache: false })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async unStarProject(context, { projectId }) {
    let { dispatch } = context
    await keepwork.projects.unStarProject({ projectId }).then(async () => {
      await dispatch('getStarState', { projectId, useCache: false })
      await dispatch('getProjectDetail', { projectId, useCache: false })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async getComments(context, { objectType = 5, objectId }) {
    let { commit } = context
    await keepwork.comments.getComments({ objectType, objectId }).then(async commentList => {
      await commit('GET_COMMENTS_SUCCESS', { commentList, projectId: objectId })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async createComment(context, { objectType = 5, objectId, content }) {
    let { dispatch } = context
    await keepwork.comments.createComment({ objectType, objectId, content }).then(async () => {
      await dispatch('getComments', { objectType, objectId })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  }
}

export default actions
