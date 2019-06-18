import _ from 'lodash'
import { props } from './mutations'

let {
  ADD_UPLOADING_FILE,
  UPDATE_UPLOADING_FILE,
  DELETE_UPLOADING_FILE,
  ADD_SUBSCRIPTION
} = props

const actions = {
  addUploadingFile({ commit }, file) {
    commit(ADD_UPLOADING_FILE, file)
  },
  changeUploadingState(
    { commit, getters },
    { state, file, errorMsg, percent, updatedAt }
  ) {
    let { uploadingFilesObj } = getters
    let filename = file.name
    let fileDetail = uploadingFilesObj[filename]
    let newFileData = {
      ...fileDetail,
      state: state || fileDetail.state,
      errorMsg: errorMsg || fileDetail.errorMsg,
      percent: percent || fileDetail.percent,
      updatedAt: updatedAt || fileDetail.updatedAt
    }
    commit(UPDATE_UPLOADING_FILE, { filename, newFileData })
  },
  addSubscription({ commit }, { filename, subscription }) {
    commit(ADD_SUBSCRIPTION, { filename, subscription })
  },
  removeFromUploadQue({ commit, getters }, { filename, state }) {
    let { subscriptions } = getters
    if (state === 'doing') {
      let removingSubscription = _.get(subscriptions, filename)
      removingSubscription && removingSubscription.unsubscribe()
    }
    commit(DELETE_UPLOADING_FILE, { filename })
  }
}

export default actions
