<template>
  <div class="file-uploader">
    <div v-if="isDropable" v-show="!isDragMode" class="file-uploader-info">{{$t('skydrive.dragAndDrop')}}</div>
    <el-upload class="file-uploader-button" action="" multiple :drag="isDragMode" :show-file-list="false" :auto-upload="false" :accept="acceptTypes" :on-change="handleUploadFile">
      <el-button v-show="!isDragMode" slot="trigger" size="small" type="primary" round>{{uploadText}}</el-button>
    </el-upload>
  </div>
</template>
<script>
import moment from 'moment'
import { getFileExt, getFileSizeText } from '@/lib/utils/filename'
import waitForMilliSeconds from '@/lib/utils/waitForMilliSeconds'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FileUploader',
  props: {
    isDropable: {
      type: Boolean,
      default: true
    },
    viewType: {
      validator: value => {
        return ['table', 'thumb'].indexOf(value) !== -1
      }
    },
    uploadType: {
      default: 'all',
      validator: value => {
        return ['all', 'image', 'video'].indexOf(value) !== -1
      }
    },
    isDragMode: {
      type: Boolean,
      default: false
    },
    uploadText: String
  },
  data() {
    return {
      waitingFiles: []
    }
  },
  computed: {
    ...mapGetters({
      uploadingFiles: 'skydrive/uploadingFiles',
      noFinishedUploadingFiles: 'skydrive/noFinishedUploadingFiles',
      uploadingFileSize: 'skydrive/uploadingFileSize',
      userSkyDriveInfo: 'user/skyDriveInfo',
      userSkyDriveFileList: 'user/skyDriveFileList'
    }),
    acceptTypes() {
      if (this.uploadType == 'image') {
        return '.jpg,.jpeg,.png,.gif'
      } else if (this.uploadType == 'video') {
        return '.mp4'
      } else {
        return ''
      }
    },
    waitingFileSize() {
      return _.reduce(
        this.waitingFiles,
        (sum, file) => {
          return sum + file.size
        },
        0
      )
    },
    unusedWithUpload() {
      let { total = 0, used = 0 } = this.userSkyDriveInfo || {}
      return total - used - this.uploadingFileSize - this.waitingFileSize
    }
  },
  methods: {
    ...mapActions({
      addUploadingFile: 'skydrive/addUploadingFile',
      addNameConflictFile: 'skydrive/addNameConflictFile',
      changeUploadingState: 'skydrive/changeUploadingState',
      addSubscription: 'skydrive/addSubscription',
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive'
    }),
    handleUploadFile(file) {
      let supportedExt = _.split(this.acceptTypes, ',')
      let fileExt = '.' + getFileExt(file.raw)
      let uploadType = this.uploadType

      let selectedType = uploadType == 'all' ? '' : uploadType
      if (
        uploadType != 'all' &&
        _.findIndex(supportedExt, ext => ext == fileExt) == -1
      ) {
        this.$message.error(
          uploadType == 'image'
            ? '请选择jpg、jpeg、gif、png格式图片上传'
            : '请选择mp4格式视频上传'
        )
        return
      }
      this.filesQueueToUpload(file)
    },
    async filesQueueToUpload(file) {
      if (this.viewType == 'table') {
        this.$emit('resetTableSort')
      }
      file = file.raw || file
      let fileIndex = this.uploadingFiles.length
      let waitingUploadFile = {
        cover: URL.createObjectURL(file),
        percent: 0,
        filename: file.name,
        ext: getFileExt(file),
        size: file.size,
        displaySize: getFileSizeText(file.size),
        type: file.type.split('/')[0] + 's',
        file: {
          downloadUrl: ''
        },
        updatedAt: moment(new Date(Date.now() + 7 * 24 * 3600 * 1000)).format(
          'YYYY-MM-DD HH:mm:ss'
        ), // add extra time for sort
        state: 'doing' // success, error, cancel, doing
      }
      if (this.unusedWithUpload < file.size) {
        this.$notify({
          title: this.$t('common.failure'),
          message: `网盘空间不足， ${file.name}无法上传`,
          type: 'error'
        })
        return
      }
      let filenameValidateResult = this.filenameValidator(file.name)
      if (filenameValidateResult !== true) {
        this.handleFilenameIllegal({ file, fileIndex, filenameValidateResult })
        waitingUploadFile = {
          ...waitingUploadFile,
          state: 'error',
          isNameConflict: true,
          errorMsg: filenameValidateResult
        }
        this.addNameConflictFile(waitingUploadFile)
        return
      }
      this.waitingFiles.push(waitingUploadFile)
      this.addUploadingFile(waitingUploadFile)
      await this.uploadFile(file, fileIndex)
    },
    async handleFilenameIllegal({ file, fileIndex, filenameValidateResult }) {
      await waitForMilliSeconds(Math.random() * 1000)
      this.$notify({
        title: this.$t('common.failure'),
        message: file.name + ' ' + filenameValidateResult,
        type: 'error'
      })
    },
    filenameValidator(newFilename) {
      let errMsg = this.$t('skydrive.nameConflictError')
      return _.concat(this.noFinishedUploadingFiles, this.userSkyDriveFileList).filter(
        ({ filename }) => filename.toLowerCase() === newFilename.toLowerCase()
      ).length
        ? errMsg
        : true
    },
    async uploadFile(file, fileIndex) {
      if (!file) return
      let self = this
      await this.userUploadFileToSkyDrive({
        file,
        onProgress(progress) {
          self.changeUploadingState({
            file,
            percent: progress.percent
          })
        }
      }).catch(err => {
        self.changeUploadingState({
          state: 'error',
          file
        })
        console.error(err)
      })
      this.changeUploadingState({
        state: 'success',
        file,
        updatedAt: new Date()
      })
    }
  },
  watch: {
    uploadingFiles() {
      this.waitingFiles = []
    }
  }
}
</script>
<style lang="scss" scoped>
.file-uploader {
  &-info {
    color: #666;
    font-size: 14px;
    display: inline-block;
    margin-right: 20px;
  }
  &-button {
    display: inline-block;
    /deep/.el-button--small {
      font-size: 14px;
      padding: 8px 15px;
    }
  }
}
</style>
