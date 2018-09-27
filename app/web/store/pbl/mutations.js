import Vue from 'vue'

const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'
const GET_PROJECT_DETAIL_SUCCESS = 'GET_PROJECT_DETAIL_SUCCESS'

export const props = {
  TOGGLE_LOGIN_DIALOG,
  GET_PROJECT_DETAIL_SUCCESS
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
  }
}

export default mutations
