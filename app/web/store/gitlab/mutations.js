import Vue from 'vue'

const GET_FILE_CONTENT_SUCCESS = 'GET_FILE_CONTENT_SUCCESS'
const GET_FILE_CONTENT_WITH_COMMITID_SUCCESS =
  'GET_FILE_CONTENT_WITH_COMMITID_SUCCESS'
const SAVE_FILE_CONTENT_SUCCESS = 'SAVE_FILE_CONTENT_SUCCESS'
const CREATE_FILE_CONTENT_SUCCESS = 'CREATE_FILE_CONTENT_SUCCESS'
const GET_REPOSITORY_TREE_SUCCESS = 'GET_REPOSITORY_TREE_SUCCESS'
const REMOVE_FILE_SUCCESS = 'REMOVE_FILE_SUCCESS'

export const props = {
  GET_FILE_CONTENT_SUCCESS,
  GET_FILE_CONTENT_WITH_COMMITID_SUCCESS,
  SAVE_FILE_CONTENT_SUCCESS,
  CREATE_FILE_CONTENT_SUCCESS,
  GET_REPOSITORY_TREE_SUCCESS,
  REMOVE_FILE_SUCCESS
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
  [GET_FILE_CONTENT_WITH_COMMITID_SUCCESS](state, { barePath, commitId, content }) {
    Vue.set(state, 'filesCommitContent', {
      ...state.filesCommitContent,
      [barePath]: {
        ...state.filesCommitContent[barePath],
        [commitId]: content
      }
    })
  },
  [GET_REPOSITORY_TREE_SUCCESS](state, { projectId, path, list }) {
    Vue.set(state, 'repositoryTrees', {
      ...state.repositoryTrees,
      [path]: {
        ...state.repositoryTrees[path],
        [path]: list
      }
    })
  },
  [SAVE_FILE_CONTENT_SUCCESS]: doNothing,
  [CREATE_FILE_CONTENT_SUCCESS]: doNothing,
  [REMOVE_FILE_SUCCESS]: doNothing
}

export default mutations
