import Vue from 'vue'

const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS'
const GET_FILE_CONTENT_SUCCESS = 'GET_FILE_CONTENT_SUCCESS'
const SAVE_FILE_CONTENT_SUCCESS = 'SAVE_FILE_CONTENT_SUCCESS'
const GET_REPOSITORY_TREE_SUCCESS = 'GET_REPOSITORY_TREE_SUCCESS'

export const props = {
  GET_ALL_PROJECTS_SUCCESS,
  GET_FILE_CONTENT_SUCCESS,
  SAVE_FILE_CONTENT_SUCCESS,
  GET_REPOSITORY_TREE_SUCCESS
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

export default mutations
