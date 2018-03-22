import Vue from 'vue'
import _ from 'lodash'
import { newGitlabAPI } from '@/api'

const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS'
const GET_FILE_CONTENT_SUCCESS = 'GET_FILE_CONTENT_SUCCESS'
const GET_REPOSITORY_TREE_SUCCESS = 'GET_REPOSITORY_TREE_SUCCESS'

const state = () => ({
  projects: {},
  repositoryTrees: {}
})

const getters = {
  info: state => state.info,
  repositoryTrees: state => state.repositoryTrees
}

const gitlabCache = {}
const getGitlabAPI = ({ rootGetters }) => {
  let config = rootGetters['user/gitlabConfig']
  let cacheKey = JSON.stringify(config)
  let result = gitlabCache[cacheKey] || (
    gitlabCache[cacheKey] = newGitlabAPI(config)
  )
  console.log('getGitlabAPI: ', result)
  return result
}

const actions = {
  getAllProjects(context, payload) {
    let { commit } = context
    return getGitlabAPI(context).projects.all(payload).then(list => {
      commit(GET_ALL_PROJECTS_SUCCESS, list)
    })
  },
  getRepositoryTree(context, payload) {
    let { commit, getters: { repositoryTrees } } = context
    let { projectId, path } = payload
    let children = _.get(repositoryTrees, [projectId, path])
    return !_.isEmpty(children) ? Promise.resolve() : getGitlabAPI(context).projects.repository.tree(projectId, payload).then(list => {
      commit(GET_REPOSITORY_TREE_SUCCESS, { projectId, path, list })
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
  },
  [GET_REPOSITORY_TREE_SUCCESS](state, { projectId, path, list }) {
    Vue.set(state, 'repositoryTrees', {
      ...state.repositoryTrees,
      [projectId]: {
        ...state.repositoryTrees[projectId],
        [path]: list
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
