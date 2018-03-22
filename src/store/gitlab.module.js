import Vue from 'vue'
import _ from 'lodash'
import { Base64 } from 'js-base64'
import { newGitlabAPI } from '@/api'

const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS'
const GET_FILE_CONTENT_SUCCESS = 'GET_FILE_CONTENT_SUCCESS'
const SAVE_FILE_CONTENT_SUCCESS = 'SAVE_FILE_CONTENT_SUCCESS'
const GET_REPOSITORY_TREE_SUCCESS = 'GET_REPOSITORY_TREE_SUCCESS'

const state = () => ({
  projects: {},
  repositoryTrees: {},
  files: {}
})

const getters = {
  repositoryTrees: state => state.repositoryTrees,
  files: state => state.files
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

const asyncGetFileParamsByPath = async ({ rootGetters, dispatch }, path) => {
  await dispatch('user/getAllPersonalSite', null, {root: true})

  let personalSitePathMap = rootGetters['user/personalSitePathMap']
  let defaultSiteProjectId = rootGetters['user/defaultSiteProjectId']
  let defaultSiteLastCommitId = rootGetters['user/defaultSiteLastCommitId']
  let [username, sitename] = path.split('/').filter(x => x)

  let projectId = _.get(personalSitePathMap, [`${username}/${sitename}`, 'projectId'], defaultSiteProjectId)
  let ref = _.get(personalSitePathMap, [`${username}/${sitename}`, 'lastCommitId'], defaultSiteLastCommitId) || 'master'

  return {
    projectId,
    ref
  }
}

const actions = {
  async getAllProjects(context, payload) {
    let { commit } = context
    let list = await getGitlabAPI(context).projects.all(payload)
    commit(GET_ALL_PROJECTS_SUCCESS, list)
  },
  async getRepositoryTree(context, payload) {
    let { commit, getters: { repositoryTrees } } = context
    let { projectId, path } = payload
    let children = _.get(repositoryTrees, [projectId, path])

    if (!_.isEmpty(children)) return Promise.resolve()

    let list = await getGitlabAPI(context).projects.repository.tree(projectId, payload)
    commit(GET_REPOSITORY_TREE_SUCCESS, { projectId, path, list })
  },
  async getFileContent(context, path) {
    let { commit } = context
    let { projectId, ref } = await asyncGetFileParamsByPath(context, path)
    let file = await getGitlabAPI(context).projects.repository.files.show(projectId, path, ref)

    commit(GET_FILE_CONTENT_SUCCESS, { path, file: {...file, content: Base64.decode(file.content)} })
  },
  async saveFileContent(context, {path, content}) {
    let { commit } = context
    let { projectId } = await asyncGetFileParamsByPath(context, path)
    let branch = 'master'
    let file = getGitlabAPI(context).projects.repository.files.edit(projectId, path, branch, {content, commit_message: `update with vue editor`})

    commit(SAVE_FILE_CONTENT_SUCCESS, { path, file: {...file, content: Base64.decode(file.content)} })
  }
}

const mutations = {
  [GET_ALL_PROJECTS_SUCCESS](state, payload) {
    Vue.set(state, 'projects', payload)
  },
  [GET_FILE_CONTENT_SUCCESS](state, { path, file }) {
    Vue.set(state, 'files', {
      ...state.files,
      [path]: file
    })
  },
  [SAVE_FILE_CONTENT_SUCCESS](state, { path, file }) {
    console.log(SAVE_FILE_CONTENT_SUCCESS, file)
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
