import Vue from 'vue'
import { gitlab } from '@/api'

const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS'
const GET_FILE_CONTENT_SUCCESS = 'GET_FILE_CONTENT_SUCCESS'

const state = () => ({
  projects: {}
})

// todo: create gitlab api dynamically with user info in store

console.log('gitlab.module.js gitlab: ', gitlab)

const getters = {
  info: state => state.info
}

const actions = {
  getAllProjects({ commit }, payload) {
    gitlab.projects.all(payload).then(list => {
      commit(GET_ALL_PROJECTS_SUCCESS, list)
    })
  },
  getFileContent({ commit }, payload) {
    // todo: get file content
    gitlab.projects.repository.file.showRaw(payload).then(content => {
      commit(GET_FILE_CONTENT_SUCCESS, content)
    })
  }
}

const mutations = {
  [GET_ALL_PROJECTS_SUCCESS](state, payload) {
    Vue.set(state, 'projects', payload)
  },
  [GET_FILE_CONTENT_SUCCESS](state, payload) {
    Vue.set(state, 'info', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
