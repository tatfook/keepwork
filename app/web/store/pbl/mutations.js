import Vue from 'vue'

const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'
const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS'
const GET_PROJECT_DETAIL_SUCCESS = 'GET_PROJECT_DETAIL_SUCCESS'
const GET_PROJECT_APPLY_LIST_SUCCESS = 'GET_PROJECT_APPLY_LIST_SUCCESS'
const GET_PROJECT_MEMBERS_SUCCESS = 'GET_PROJECT_MEMBERS_SUCCESS'
const GET_USER_PROJECTS_SUCCESS = 'GET_USER_PROJECTS_SUCCESS'
const GET_PROJECT_FAVORITE_STATE_SUCCESS = 'GET_PROJECT_FAVORITE_STATE_SUCCESS'
const GET_PROJECT_STAR_STATE_SUCCESS = 'GET_PROJECT_STAR_STATE_SUCCESS'
const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS'


export const props = {
  TOGGLE_LOGIN_DIALOG,
  GET_ALL_PROJECTS,
  GET_PROJECT_APPLY_LIST_SUCCESS,
  GET_PROJECT_DETAIL_SUCCESS,
  GET_USER_PROJECTS_SUCCESS,
  GET_PROJECT_MEMBERS_SUCCESS,
  GET_PROJECT_FAVORITE_STATE_SUCCESS,
  GET_PROJECT_STAR_STATE_SUCCESS,
  GET_COMMENTS_SUCCESS
}

const mutations = {
  [TOGGLE_LOGIN_DIALOG](state, status) {
    Vue.set(state, 'isShowLoginDialog', status)
  },
  [GET_ALL_PROJECTS](state, allProjects) {
    Vue.set(state, 'allProjects', allProjects)
  },
  [GET_USER_PROJECTS_SUCCESS](state, { userId, projects }) {
    Vue.set(state, 'usersProjects', {
      ...state.usersProjects,
      [userId]: projects
    })
  },
  [GET_PROJECT_DETAIL_SUCCESS](state, { projectId, projectDetail }) {
    Vue.set(state, 'projects', {
      ...state.projects,
      [projectId]: projectDetail
    })
  },
  [GET_PROJECT_APPLY_LIST_SUCCESS](state, { projectId, projectApplyList }) {
    Vue.set(state, 'projectApplyList', {
      ...state.projectApplyList,
      [projectId]: projectApplyList
    })
  },
  [GET_PROJECT_MEMBERS_SUCCESS](state, { projectId, memberList }) {
    Vue.set(state, 'memberList', {
      ...state.memberList,
      [projectId]: memberList
    })
  },
  [GET_PROJECT_FAVORITE_STATE_SUCCESS](state, { projectId, isFavorite }) {
    Vue.set(state, 'projectsFavoriteState', {
      ...state.projectsFavoriteState,
      [projectId]: isFavorite
    })
  },
  [GET_PROJECT_STAR_STATE_SUCCESS](state, { projectId, isStared }) {
    Vue.set(state, 'projectsStarState', {
      ...state.projectsStarState,
      [projectId]: isStared
    })
  },
  [GET_COMMENTS_SUCCESS](state, { projectId, commentList }) {
    Vue.set(state, 'commentList', {
      ...state.commentList,
      [projectId]: commentList
    })
  }
}

export default mutations
