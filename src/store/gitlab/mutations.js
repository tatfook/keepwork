import Vue from 'vue'
import _ from 'lodash'

const GET_FILE_CONTENT_SUCCESS = 'GET_FILE_CONTENT_SUCCESS'
const SAVE_FILE_CONTENT_SUCCESS = 'SAVE_FILE_CONTENT_SUCCESS'
const CREATE_FILE_CONTENT_SUCCESS = 'CREATE_FILE_CONTENT_SUCCESS'
const GET_REPOSITORY_TREE_SUCCESS = 'GET_REPOSITORY_TREE_SUCCESS'
const REMOVE_FILE_SUCCESS = 'REMOVE_FILE_SUCCESS'
const CACHE_OPENED_FILE = 'CACHE_OPENED_FILE'
const CLEAR_OPENED_FILE = 'CLEAR_OPENED_FILE'

export const props = {
  GET_FILE_CONTENT_SUCCESS,
  SAVE_FILE_CONTENT_SUCCESS,
  CREATE_FILE_CONTENT_SUCCESS,
  GET_REPOSITORY_TREE_SUCCESS,
  REMOVE_FILE_SUCCESS,
  CACHE_OPENED_FILE,
  CLEAR_OPENED_FILE
}

const doNothing = state => {
  // nothing todo with
}

const mutations = {
  [GET_FILE_CONTENT_SUCCESS](state, { path, file }) {
    Vue.set(state, 'files', {
      ...state.files,
      [path]: file
    })
  },
  [GET_REPOSITORY_TREE_SUCCESS](state, { projectId, path, list }) {
    Vue.set(state, 'repositoryTrees', {
      ...state.repositoryTrees,
      [projectId]: {
        ...state.repositoryTrees[projectId],
        [path]: list
      }
    })
  },
  [SAVE_FILE_CONTENT_SUCCESS]: doNothing,
  [CREATE_FILE_CONTENT_SUCCESS]: doNothing,
  [REMOVE_FILE_SUCCESS]: doNothing,
  [CACHE_OPENED_FILE](state, { path, file }) {
    Vue.set(state, 'openedFiles', {
      ...state.openedFiles,
      [path]: file
    })
  },
  [CLEAR_OPENED_FILE](state, { path, file }) {
    Vue.set(state, 'openedFiles', _.omit(state.openedFiles, path))
  }
}

export default mutations
