import Vue from 'vue'

const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'
const GET_PROJECT_DETAIL_SUCCESS = 'GET_PROJECT_DETAIL_SUCCESS'
const GET_PROJECT_APPLY_LIST_SUCCESS = 'GET_PROJECT_APPLY_LIST_SUCCESS'
const GET_PROJECT_MEMBERS_SUCCESS = 'GET_PROJECT_MEMBERS_SUCCESS'

export const props = {
  TOGGLE_LOGIN_DIALOG,
  GET_PROJECT_APPLY_LIST_SUCCESS,
  GET_PROJECT_DETAIL_SUCCESS,
  GET_PROJECT_MEMBERS_SUCCESS
}

const mutations = {
  [TOGGLE_LOGIN_DIALOG](state, status) {
    Vue.set(state, 'isShowLoginDialog', status)
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
  }
}

export default mutations
