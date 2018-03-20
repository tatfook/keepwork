import Vue from 'vue'
import { newGitlabAPI } from '@/api'

const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS'
const GET_FILE_CONTENT_SUCCESS = 'GET_FILE_CONTENT_SUCCESS'

const state = () => ({
  projects: {}
})

const getters = {
  info: state => state.info
}

const gitlabCache = {}
const getGitlabAPI = ({ rootGetters }) => {
  let config = rootGetters['user/gitlabConfig']
  let cacheKey = JSON.stringify(config)
  return gitlabCache[cacheKey] || (
    gitlabCache[cacheKey] = newGitlabAPI(config)
  )
}

const actions = {
  getAllProjects(context, payload) {
    let { commit } = context
    return getGitlabAPI(context).projects.all(payload).then(list => {
      commit(GET_ALL_PROJECTS_SUCCESS, list)
    })
  },
  getFileContent(context, payload) {
    let { commit } = context
    return getGitlabAPI(context).projects.repository.file.showRaw(payload).then(content => {
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
