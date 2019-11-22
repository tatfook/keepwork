import _ from 'lodash'
import { keepwork, EsAPI, injectUserInfo } from '@/api'
import { props } from './mutations'

let {
  TOGGLE_LOGIN_DIALOG,
  GET_EXCELLENT_PROJECTS,
  GET_ALL_PROJECTS,
  GET_PROJECT_APPLY_LIST_SUCCESS,
  GET_PROJECT_MEMBERS_SUCCESS,
  GET_USER_PROJECTS_SUCCESS,
  GET_PROJECT_DETAIL_SUCCESS,
  GET_PROJECT_FAVORITE_STATE_SUCCESS,
  GET_PROJECT_STAR_STATE_SUCCESS,
  GET_MY_ALL_PROJECTS_SUCCESS,
  GET_PROJECT_APPLY_STATE_SUCCESS,
  GET_COMMENTS_SUCCESS,
  GET_TYPE_PROJECTS,
  GET_PROJECT_ISSUES_SUCCESS,
  GET_ALL_USERS_SUCCESS,
  GET_USER_FOLLOWS,
  GET_GAMES_LIST,
  GET_WORKS_BY_GAMEID,
  GET_PROJECT_GAMES_SUCCESS,
  GET_LEGAL_GAMES_PROJECTS
} = props

const actions = {
  async toggleLoginDialog({ commit }, status) {
    commit(TOGGLE_LOGIN_DIALOG, status)
  },
  async createNewProject(context, { description, name, privilege, type, visibility, siteId, tags }) {
    let projectDetail = await keepwork.projects.createProject({ description, name, privilege, type, visibility, siteId, tags })
    return projectDetail
  },
  async getExcellentProjects({ commit }) {
    await keepwork.projects
      .getProjects()
      .then(res => {
        commit(GET_EXCELLENT_PROJECTS, res)
      }).catch(err => console.error(err))
  },
  async getAllProjects({ commit }, payload) {
    try {
      const res = await EsAPI.projects.getProjects(payload)
      res.hits = await injectUserInfo({ data: res.hits })
      commit(GET_ALL_PROJECTS, res)
    } catch (err) {
      console.error(err)
    }
  },
  async getTypeProjects({ commit }, payload) {
    try {
      const projects = await EsAPI.projects
        .getProjects(payload)
      projects.hits = await injectUserInfo({ data: projects.hits })
      commit(GET_TYPE_PROJECTS, { type: payload.type, projects })
    } catch (error) {
      console.error(error)
    }
  },
  async getMyAllProjects({ commit }) {
    await Promise.all([
      keepwork.projects.getPersonalProjects(),
      keepwork.projects.getContributeProjects(),
    ]).then(res => {
      commit(GET_MY_ALL_PROJECTS_SUCCESS, res)
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
    let { dispatch } = context
    try {
      await keepwork.projects.updateProject({ projectId, updatingProjectData })
      await Promise.all([
        dispatch('getProjectDetail', { projectId, useCache: false }),
        dispatch('getUserProjects', { userId: updatingProjectData.userId, useCache: false })
      ])
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
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
  async getApplyState(context, { objectType = 5, objectId, applyType, applyId }) {
    let { commit } = context
    await keepwork.applies.getApplyState({ objectType, objectId, applyType, applyId }).then(applyState => {
      commit(GET_PROJECT_APPLY_STATE_SUCCESS, { objectId, applyId, applyState })
      return Promise.resolve()
    })
  },
  async applyJoinProject(context, { objectType = 5, objectId, applyType, applyId, legend, extra }) {
    let { dispatch } = context
    await keepwork.applies.applyProjectMember({ objectType, objectId, applyType, applyId, legend, extra }).then(async () => {
      await dispatch('getApplyState', { objectId, objectType, applyType, applyId })
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
    await keepwork.favorites.favoriteObject({ objectId, objectType }).then(async () => {
      await dispatch('getFavoriteState', { objectId, objectType, useCache: false })
      await dispatch('getProjectDetail', { projectId: objectId, useCache: false })
      return Promise.resolve()
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async unFavoriteProject(context, { objectId, objectType }) {
    let { dispatch } = context
    await keepwork.favorites.unFavoriteObject({ objectId, objectType }).then(async () => {
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
  async getComments(context, { objectType = 5, objectId, xPage, xPerPage, xOrder }) {
    let { commit } = context
    let commentList = await keepwork.comments.getComments({ objectType, objectId, xPage, xPerPage, xOrder }).catch(error => {
      return Promise.reject(error)
    })
    await commit(GET_COMMENTS_SUCCESS, { commentList, projectId: objectId })
    return commentList
  },
  async createComment(context, { objectType = 5, objectId, content }) {
    let { dispatch } = context
    let newComment = await keepwork.comments.createComment({ objectType, objectId, content }).catch(error => {
      return Promise.reject(error)
    }).catch(error => Promise.reject(error))
    await dispatch('getComments', { objectType, objectId })
    objectType === 5 && await dispatch('getProjectDetail', { projectId: objectId, useCache: false })
    return newComment
  },
  async deleteComment(context, { objectType = 5, objectId, commentId }) {
    let { dispatch } = context
    await keepwork.comments.deleteComment({ commentId }).then(async () => {
      await dispatch('getComments', { objectType, objectId })
      objectType === 5 && await dispatch('getProjectDetail', { projectId: objectId, useCache: false })
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  async getProjectIssues({ commit }, payload) {
    await keepwork.issues.getSingleProjectIssues(payload).then(projectIssues => {
      commit(GET_PROJECT_ISSUES_SUCCESS, { projectIssues, projectId: payload.objectId })
    }).catch(err => console.error(err))
  },
  async getAllUsers({ commit }, payload) {
    await EsAPI.users.getUsers(payload).then(async users => {
      users.hits = await injectUserInfo({ data: users.hits, appendKey: false })
      commit(GET_ALL_USERS_SUCCESS, users)
    }).catch(err => console.error(err))
  },
  async getUserFavorite({ commit }, { objectType, userId }) {
    await keepwork.favorites.getUserFavorites({ objectType, userId }).then(res => {
      commit(GET_USER_FOLLOWS, res)
    }).catch(err => console.error(err))
  },
  async getGamesList({ commit }) {
    await keepwork.games.getGamesList().then(res => {
      commit(GET_GAMES_LIST, res)
    }).catch(err => console.warn(err))
  },
  async getWorksByGameId({ commit }, payload) {
    await keepwork.games.getWorksByGameId(payload).then(res => {
      commit(GET_WORKS_BY_GAMEID, res)
    })
  },
  async getProjectGames({ commit }, { projectId }) {
    let nowJoinedGame = await keepwork.projects.getProjectGames({ projectId }).catch(() => [])
    commit(GET_PROJECT_GAMES_SUCCESS, { projectId, nowJoinedGame })
  },
  async getLegalGamesProjects({ commit }) {
    await keepwork.games.getLegalGamesProjects().then(res => {
      console.log('legalProjects', res)
      commit(GET_LEGAL_GAMES_PROJECTS, res)
    })
  },
  async submitGameWorks({ dispatch }, payload) {
    await keepwork.games.submitGameWorks(payload).then(async res => {
      let { gameId } = payload
      await dispatch('getWorksByGameId', { gameId })
    })
  },
  async getGameWorksStatistics({ commit }) {
    const data = await keepwork.games.getGameWorksStatistics()
    return data
  }
}

export default actions
