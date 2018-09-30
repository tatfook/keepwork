import Vue from 'vue'

const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'
const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS'

export const props = {
  TOGGLE_LOGIN_DIALOG,
  GET_ALL_PROJECTS
}

const mutations = {
  [TOGGLE_LOGIN_DIALOG](state, status) {
    Vue.set(state, 'isShowLoginDialog', status)
  },
  [GET_ALL_PROJECTS](state, allProjects) {
    Vue.set(state, 'allProjects', allProjects)
  }
}

export default mutations
