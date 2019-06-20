import _ from 'lodash'

const getters = {
  uploadingFilesObj: state => state.uploadingFilesObj || {},
  nameConflictFilesObj: state => state.nameConflictFilesObj || [],
  nameConflictFiles: (state, { nameConflictFilesObj }) =>
    _.values(nameConflictFilesObj),
  uploadingFiles: (state, { nameConflictFiles, uploadingFilesObj }) => {
    return _.concat(_.values(uploadingFilesObj), nameConflictFiles)
  },
  noFinishedUploadingFiles: (state, { uploadingFiles }) => {
    return _.filter(uploadingFiles, file => file.state !== 'success')
  },
  uploadingFileSize: (state, { noFinishedUploadingFiles }) => {
    return _.reduce(noFinishedUploadingFiles, (sum, file) => sum + file.size, 0)
  }
}

export default getters
