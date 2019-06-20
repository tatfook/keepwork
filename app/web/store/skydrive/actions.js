import _ from 'lodash'
import { removeQiniuUpload } from '@/api/skyDrive'
import { props } from './mutations'

let {
  ADD_UPLOADING_FILE,
  UPDATE_UPLOADING_FILE,
  ADD_NAME_CONFLICT_FILE,
  DELETE_UPLOADING_FILE,
  DELETE_NAME_CONFLICT_FILE
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
  addNameConflictFile({ commit }, file) {
    commit(ADD_NAME_CONFLICT_FILE, file)
  },
  removeFromUploadQue({ commit, getters }, file) {
    let { filename, state, isNameConflict } = file
    if (state === 'doing') {
      removeQiniuUpload(filename)
    }
    if (isNameConflict) {
      commit(DELETE_NAME_CONFLICT_FILE, { filename })
      return
    }
    commit(DELETE_UPLOADING_FILE, { filename })
  }
}

export default actions
