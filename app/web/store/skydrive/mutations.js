import Vue from 'vue'

const ADD_UPLOADING_FILE = 'ADD_UPLOADING_FILE'
const UPDATE_UPLOADING_FILE = 'UPDATE_UPLOADING_FILE'
const DELETE_UPLOADING_FILE = 'DELETE_UPLOADING_FILE'
const ADD_SUBSCRIPTION = 'ADD_SUBSCRIPTION'

export const props = {
  ADD_UPLOADING_FILE,
  UPDATE_UPLOADING_FILE,
  DELETE_UPLOADING_FILE,
  ADD_SUBSCRIPTION
}

const mutations = {
  [ADD_UPLOADING_FILE](state, file) {
    Vue.set(state, 'uploadingFilesObj', {
      ...state.uploadingFilesObj,
      [file.filename]: file
    })
  },
  [UPDATE_UPLOADING_FILE](state, { filename, newFileData }) {
    Vue.set(state, 'uploadingFilesObj', {
      ...state.uploadingFilesObj,
      [filename]: newFileData
    })
  },
  [DELETE_UPLOADING_FILE](state, { filename }) {
    Vue.delete(state.uploadingFilesObj, filename)
  },
  [ADD_SUBSCRIPTION](state, { filename, subscription }) {
    Vue.set(state, 'subscriptions', {
      ...state.subscriptions,
      [filename]: subscription
    })
  }
}

export default mutations
