<template>
  <div v-loading='loading' class="sky-drive-manager" @drop.prevent='handleDrop' @dragover.prevent>
    <table-type v-if="defaultMode" ref="tableTypeComp" :info='info' :userSkyDriveFileList='userSkyDriveFileList' :skyDriveTableDataWithUploading='skyDriveTableDataWithUploading' @uploadFile='handleUploadFile' @insert='handleInsert' @remove='handleRemove' @removeFromUploadQue='removeFromUploadQue'></table-type>
    <media-type v-if="mediaLibraryMode" :info='info' :uploadingFiles='uploadingFiles' @uploadFile='handleUploadFile' :skyDriveMediaLibraryData='skyDriveMediaLibraryData' @remove='handleRemove' @insert='handleInsert'></media-type>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import dayjs from 'dayjs'
import waitForMilliSeconds from '@/lib/utils/waitForMilliSeconds'
import { getFileExt, getBareFilename } from '@/lib/utils/filename'
import tableType from './skyDrive/tableType'
import mediaType from './skyDrive/mediaType'
export default {
  name: 'SkyDriveManager1',
  props: {
    mediaLibrary: {
      type: Boolean,
      default: false
    }
  },
  async mounted() {
    await this.userRefreshSkyDrive({ useCache: false })
    this.loading = false
  },
  data() {
    return {
      defaultMode: !this.mediaLibrary,
      mediaLibraryMode: this.mediaLibrary,
      loading: false,
      uploadingFiles: [],
      qiniuUploadSubscriptions: {},
      mediaFilterType: 'image'
    }
  },
  computed: {
    ...mapGetters({
      userSkyDriveInfo: 'user/skyDriveInfo',
      userSkyDriveFileList: 'user/skyDriveFileList'
    }),
    info() {
      let { total = 0, used = 0 } = this.userSkyDriveInfo || {}
      let unused = total - used
      let usedPercent = Math.max(0, ((100 * used) / total).toFixed(2))
      return { total, used, unused, usedPercent }
    },
    skyDriveTableData() {
      return this.userSkyDriveFileList.map(item => {
        // checked: 0 未审核, 1 通过, 2 未通过
        let { checked, size, filename, type, updatedAt } = item
        checked = Number(checked)
        return {
          ...item,
          file: { size, filename, type, downloadUrl: '' },
          displaySize: this.biteToM(size) + 'MB',
          ext: getFileExt(item),
          checkPassed: checked === 1,
          checkedState:
            checked === 1
              ? this.$t('skydrive.checkPassed')
              : checked === 2
                ? this.$t('skydrive.checkUnpassed')
                : this.$t('skydrive.checking')
        }
      })
    },
    filterFinishedUploadingFile() {
      return _.filter(this.uploadingFiles, file => {
        return file.state !== 'success'
      })
    },
    skyDriveTableDataWithUploading() {
      return _.sortBy(
        [...this.filterFinishedUploadingFile, ...this.skyDriveTableData],
        'updateAt'
      )
    },
    skyDriveMediaLibraryData() {
      let mediaDatas = this.skyDriveTableData.filter(({ type }) => {
        return new RegExp(`^${this.mediaFilterType}`).test(type)
      })
      return _.sortBy(mediaDatas, 'updateAt')
    },
    skyDriveTableReference() {
      return _.get(this.$refs, 'tableTypeComp.$refs.skyDriveTable')
    }
  },
  methods: {
    ...mapActions({
      userRefreshSkyDrive: 'user/refreshSkyDrive',
      userRemoveFileFromSkyDrive: 'user/removeFileFromSkyDrive',
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive'
    }),
    handleUploadFile(e) {
      let files = _.get(e, ['target', 'files'])
      this.filesQueueToUpload(files)
    },
    handleDrop(e) {
      let files = _.get(e, ['dataTransfer', 'files'])
      this.filesQueueToUpload(files)
    },
    async filesQueueToUpload(files) {
      if (this.defaultMode) {
        this.skyDriveTableReference.clearSort()
        this.skyDriveTableReference.sort('updatedAt', 'descending')
      }
      await Promise.all(
        _.map(files, async file => {
          let fileIndex = this.uploadingFiles.length
          this.uploadingFiles.push({
            cover: URL.createObjectURL(file),
            percent: 0,
            filename: file.name,
            ext: getFileExt(file),
            displaySize: this.biteToM(file.size) + 'MB',
            type: file.type.split('/')[0] + 's',
            file: {
              downloadUrl: ''
            },
            updatedAt: dayjs(
              new Date(Date.now() + 7 * 24 * 3600 * 1000)
            ).format('YYYY-MM-DD HH:mm:ss'), // add extra time for sort
            state: 'doing' // success, error, cancel, doing
          })
          await this.uploadFile(file, fileIndex)
        })
      )
    },
    biteToM(bite = 0) {
      return (bite / (1024 * 1024))
        .toFixed(2)
        .toString()
        .replace(/\.*0*$/, '')
    },
    async uploadFile(file, fileIndex) {
      if (!file) return
      let filenameValidateResult = this.filenameValidator(file.name)
      if (filenameValidateResult !== true) {
        this.uploadingFiles[fileIndex].state = 'error'
        this.uploadingFiles[fileIndex].errorMsg = filenameValidateResult
        await waitForMilliSeconds(Math.random() * 1000)
        this.$notify({
          title: this.$t('common.failure'),
          message: file.name + ' ' + filenameValidateResult,
          type: 'error'
        })
        return
      }
      let that = this
      await this.userUploadFileToSkyDrive({
        file,
        onStart(subscription) {
          that.qiniuUploadSubscriptions[file.name] = subscription
        },
        onProgress(progress) {
          fileIndex = _.findIndex(that.uploadingFiles, ['filename', file.name])
          that.uploadingFiles[fileIndex].percent = progress.percent
        }
      })
        .then(async () => {
          fileIndex = _.findIndex(this.uploadingFiles, ['filename', file.name])
          this.uploadingFiles[fileIndex].state = 'success'
          this.uploadingFiles[fileIndex].updatedAt = new Date()
          await this.userRefreshSkyDrive({ useCache: false }).catch(err =>
            console.error(err)
          )
        })
        .catch(err => {
          fileIndex = _.findIndex(this.uploadingFiles, ['filename', file.name])
          this.uploadingFiles[fileIndex].state = 'error'
          console.error(err)
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
    itemFilterBySearchWord(item) {
      if (!item) return false
      let { filename } = item
      let searchWord = this.searchWord && this.searchWord.trim().toLowerCase()
      if (!searchWord) return true
      let filenameLowerCase = (filename || '').toLowerCase()
      return filenameLowerCase.indexOf(searchWord) >= 0
    },
    async handleInsert({ file, url }) {
      this.$emit('close', { file, url })
    },
    async handleRemove(file) {
      await this.$confirm(
        this.$t('skydrive.removeFileConfirmMsg'),
        this.$t('editor.delNotice'),
        {
          confirmButtonText: this.$t('common.OK'),
          cancelButtonText: this.$t('common.Cancel'),
          type: 'warning'
        }
      )

      this.loading = true
      await this.userRemoveFileFromSkyDrive({ file }).catch(err =>
        console.error(err)
      )
      this.selectedMediaItem = null
      this.loading = false
    },
    removeFromUploadQue(file) {
      let { filename, state } = file
      if (state === 'doing') {
        let removingFileSubscribtion = _.get(
          this.qiniuUploadSubscriptions,
          filename
        )
        if (removingFileSubscribtion) {
          removingFileSubscribtion.unsubscribe()
        }
      }
      this.uploadingFiles = _.remove(this.uploadingFiles, file => {
        return file.filename !== filename
      })
    }
  },
  components: {
    tableType,
    mediaType
  }
}
</script>

