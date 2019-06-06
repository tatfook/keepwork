<template>
  <div class="file-uploader">
    <div v-show="!isDragMode" class="file-uploader-info">{{$t('skydrive.dragAndDrop')}}</div>
    <el-upload class="file-uploader-button" action="" multiple :drag="isDragMode" :show-file-list="false" :auto-upload="false" :accept="acceptTypes" :on-change="handleUploadFile">
      <el-button v-show="!isDragMode" slot="trigger" size="small" type="primary" round>{{uploadText}}</el-button>
    </el-upload>
  </div>
</template>
<script>
import moment from 'moment'
import { getFileExt } from '@/lib/utils/filename'
import waitForMilliSeconds from '@/lib/utils/waitForMilliSeconds'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FileUploader',
  props: {
    viewType: {
      validator: value => {
        return ['list', 'thumb'].indexOf(value) !== -1
      }
    },
    uploadType: {
      default: 'all',
      validator: value => {
        return ['all', 'image', 'video'].indexOf(value) !== -1
      }
    },
    activeChildComp: {
      required: true
    },
    uploadingFiles: {
      type: Array,
      default: []
    },
    uploadingFileSize: {
      type: Number,
      default: 0
    },
    isDragMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      waitingFiles: []
    }
  },
  computed: {
    ...mapGetters({
      userSkyDriveInfo: 'user/skyDriveInfo',
      userSkyDriveFileList: 'user/skyDriveFileList'
    }),
    acceptTypes() {
      if (this.uploadType == 'image') {
        return '.jpg,.jpeg,.png,.gif,.bmp'
      } else if (this.uploadType == 'video') {
        return '.mp4,.avi,.wmv,.mkv,.amv,.m4v,.webm'
      } else {
        return ''
      }
    },
    uploadText() {
      return this.uploadType == 'image'
        ? this.$t('skydrive.uploadImage')
        : this.uploadType == 'video'
        ? this.$t('skydrive.uploadVideo')
        : this.$t('skydrive.uploadFile')
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
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive'
    }),
    getSizeText(bite = 0) {
      let KBVal = (bite / 1024)
        .toFixed(2)
        .toString()
        .replace(/\.*0*$/, '')
      let MBVal = (bite / 1024 / 1024)
        .toFixed(2)
        .toString()
        .replace(/\.*0*$/, '')
      let GBVal = (bite / 1024 / 1024 / 1024)
        .toFixed(2)
        .toString()
        .replace(/\.*0*$/, '')
      return KBVal < 100
        ? `${KBVal}KB`
        : MBVal < 100
        ? `${MBVal}MB`
        : `${GBVal}GB`
    },
    handleUploadFile(file) {
      this.filesQueueToUpload(file)
    },
    async filesQueueToUpload(file) {
      if (this.viewType == 'list') {
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
        displaySize: this.getSizeText(file.size),
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
      this.waitingFiles.push(waitingUploadFile)
      this.$emit('addUploadingFiles', waitingUploadFile)
      await this.uploadFile(file, fileIndex)
    },
    async handleFilenameIllegal({ file, fileIndex, filenameValidateResult }) {
      this.$emit('changeUploadingState', {
        state: 'error',
        file,
        errorMsg: filenameValidateResult
      })
      await waitForMilliSeconds(Math.random() * 1000)
      this.$notify({
        title: this.$t('common.failure'),
        message: file.name + ' ' + filenameValidateResult,
        type: 'error'
      })
    },
    filenameValidator(newFilename) {
      let errMsg = this.$t('skydrive.nameConflictError')
      return this.userSkyDriveFileList.filter(
        ({ filename }) => filename === newFilename
      ).length
        ? errMsg
        : true
    },
    async uploadFile(file, fileIndex) {
      if (!file) return
      let filenameValidateResult = this.filenameValidator(file.name)
      if (filenameValidateResult !== true) {
        this.handleFilenameIllegal({ file, fileIndex, filenameValidateResult })
        return
      }
      let self = this
      await this.userUploadFileToSkyDrive({
        file,
        onStart(subscription) {
          self.$emit('addNewUploader', { subscription, filename: file.name })
        },
        onProgress(progress) {
          self.$emit('changeUploadingState', {
            file,
            percent: progress.percent
          })
        }
      }).catch(err => {
        self.$emit('changeUploadingState', {
          state: 'error',
          file
        })
        console.error(err)
      })
      this.$emit('changeUploadingState', {
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
  }
  &-button {
    display: inline-block;
    margin-left: 20px;
    /deep/.el-button--small {
      font-size: 14px;
      padding: 8px 15px;
    }
  }
}
</style>
