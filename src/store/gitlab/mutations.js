import Vue from 'vue'

const GET_FILE_CONTENT_SUCCESS = 'GET_FILE_CONTENT_SUCCESS'
const SAVE_FILE_CONTENT_SUCCESS = 'SAVE_FILE_CONTENT_SUCCESS'
const CREATE_FILE_CONTENT_SUCCESS = 'CREATE_FILE_CONTENT_SUCCESS'
const GET_REPOSITORY_TREE_SUCCESS = 'GET_REPOSITORY_TREE_SUCCESS'
const REMOVE_FILE_SUCCESS = 'REMOVE_FILE_SUCCESS'
const CACHE_UNSAVED_FILE = 'CACHE_UNSAVED_FILE'
const CLEAR_UNSAVED_FILE = 'CLEAR_UNSAVED_FILE'

export const props = {
  GET_FILE_CONTENT_SUCCESS,
  SAVE_FILE_CONTENT_SUCCESS,
  CREATE_FILE_CONTENT_SUCCESS,
  GET_REPOSITORY_TREE_SUCCESS,
  REMOVE_FILE_SUCCESS,
  CACHE_UNSAVED_FILE,
  CLEAR_UNSAVED_FILE
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
  [CACHE_UNSAVED_FILE](state, { path, file }) {
    Vue.set(state, 'unsavedFiles', {
      ...state.unsavedFiles,
      [path]: file
    })
  },
  [CLEAR_UNSAVED_FILE](state, { path, file }) {
    Vue.set(state, 'unsavedFiles', {
      ...state.unsavedFiles,
      [path]: null
    })
  }
}

export default mutations
