import _ from 'lodash'

const getters = {
  uploadingFilesObj: state => {
    return state.uploadingFilesObj || {}
  },
  uploadingFiles: (state, { uploadingFilesObj }) => {
    return _.values(uploadingFilesObj) || []
  },
  noFinishedUploadingFiles: (state, { uploadingFiles }) => {
    return _.filter(uploadingFiles, file => file.state !== 'success')
  },
  uploadingFileSize: (state, { noFinishedUploadingFiles }) => {
    return _.reduce(noFinishedUploadingFiles, (sum, file) => sum + file.size, 0)
  },
  subscriptions: state => state.subscriptions
}

export default getters
