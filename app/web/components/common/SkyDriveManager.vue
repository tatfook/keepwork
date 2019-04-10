<template>
  <div v-loading='loading' class="sky-drive-manager" @drop.prevent='handleDrop' @dragover.prevent>
    <table-type v-if="defaultMode" ref="tableTypeComp" :info='info' :userSkyDriveFileList='userSkyDriveFileList' :skyDriveTableDataWithUploading='skyDriveTableDataWithUploading' :insertable='insertable' @uploadFile='handleUploadFile' @insert='handleInsert' @remove='handleRemove' @removeFromUploadQue='removeFromUploadQue' @copy='handleCopy'></table-type>
    <media-type v-if="mediaLibraryMode" ref="mediaTypeComp" :info='info' :uploadingFiles='uploadingFiles' @uploadFile='handleUploadFile' :skyDriveMediaLibraryData='skyDriveMediaLibraryData' :isImageTabShow='isImageTabShow' :isVideoTabShow='isVideoTabShow' @remove='handleRemove' @insert='handleInsert'></media-type>
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
  name: 'SkyDriveManager',
  props: {
    isSiteMode: Boolean,
    mediaLibrary: {
      type: Boolean,
      default: false
    },
    insertable: {
      type: Boolean,
      default: true
    },
    isImageTabShow: Boolean,
    isVideoTabShow: Boolean
  },
  async mounted() {
    this.loading = true
    await this.userRefreshSkyDrive({ useCache: false })
    this.loading = false
    this.isMounted = true
  },
  data() {
    return {
      defaultMode: !this.mediaLibrary,
      mediaLibraryMode: this.mediaLibrary,
      loading: false,
      isMounted: false,
      uploadingFiles: [],
      qiniuUploadSubscriptions: {}
    }
  },
  computed: {
    ...mapGetters({
      userSkyDriveInfo: 'user/skyDriveInfo',
      userRawUrlByFileId: 'user/rawUrlByFileId',
      userSkyDriveFileList: 'user/skyDriveFileList',
      activePageInfo: 'activePageInfo',
      userSiteFileBySitePathAndFileId: 'user/siteFileBySitePathAndFileId'
    }),
    isEditorPage() {
      return _.get(this.$route, 'name') === 'Editor'
    },
    isUseFileInSiteMode() {
      return this.isSiteMode === false ? false : this.isEditorPage
    },
    tableTypeComp() {
      return this.isMounted ? this.$refs.tableTypeComp : ''
    },
    mediaTypeComp() {
      return this.isMounted ? this.$refs.mediaTypeComp : ''
    },
    searchWord() {
      return this.defaultMode
        ? this.tableTypeComp.searchWord
        : this.mediaTypeComp.searchWord
    },
    info() {
      let { total = 0, used = 0 } = this.userSkyDriveInfo || {}
      let unused = total - used
      let usedPercent = Math.max(0, ((100 * used) / total).toFixed(2))
      return { total, used, unused, usedPercent }
    },
    skyDriveTableData() {
      return this.userSkyDriveFileList
        .map(item => {
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
        .filter(this.itemFilterBySearchWord)
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
    mediaFilterType() {
      return this.isMounted ? this.mediaTypeComp.mediaFilterType : 'image'
    },
    skyDriveTableReference() {
      return _.get(this.$refs, 'tableTypeComp.$refs.skyDriveTable')
    }
  },
  methods: {
    ...mapActions({
      userRefreshSkyDrive: 'user/refreshSkyDrive',
      userRemoveFileFromSkyDrive: 'user/removeFileFromSkyDrive',
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive',
      userGetFileRawUrl: 'user/getFileRawUrl',
      userUseFileInSite: 'user/useFileInSite'
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
        this.handleFilenameIllegal({ file, fileIndex, filenameValidateResult })
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
      }).catch(err => {
        fileIndex = _.findIndex(this.uploadingFiles, ['filename', file.name])
        this.uploadingFiles[fileIndex].state = 'error'
        console.error(err)
      })
      this.uploadingFiles[fileIndex].state = 'success'
      this.uploadingFiles[fileIndex].updatedAt = new Date()
    },
    filenameValidator(newFilename) {
      let errMsg = this.$t('skydrive.nameConflictError')
      return this.userSkyDriveFileList.filter(
        ({ filename }) => filename === newFilename
      ).length
        ? errMsg
        : true
    },
    async handleFilenameIllegal({ file, fileIndex, filenameValidateResult }) {
      this.uploadingFiles[fileIndex].state = 'error'
      this.uploadingFiles[fileIndex].errorMsg = filenameValidateResult
      await waitForMilliSeconds(Math.random() * 1000)
      this.$notify({
        title: this.$t('common.failure'),
        message: file.name + ' ' + filenameValidateResult,
        type: 'error'
      })
    },
    itemFilterBySearchWord(item) {
      if (!item) return false
      let { filename } = item
      let searchWord = this.searchWord && this.searchWord.trim().toLowerCase()
      if (!searchWord) return true
      let filenameLowerCase = (filename || '').toLowerCase()
      return filenameLowerCase.indexOf(searchWord) >= 0
    },
    async handleGetUrl({ file }) {
      return this.isUseFileInSiteMode
        ? await this.getSiteFileUrl(file)
        : await this.getFileRawUrl(file)
    },
    async handleInsert({ file }) {
      if (file.checkPassed) {
        let url = await this.handleGetUrl({ file })
        this.$emit('close', {
          file,
          url: `${url}#${file.filename ? file.filename : ''}`
        })
      }
    },
    async handleCopy(file) {
      this.$emit('copy', file)
      let toCopyPrefix = await this.handleGetUrl({ file })
      let toCopyLink = `${toCopyPrefix}#${file.filename ? file.filename : ''}`
      await this.$confirm(toCopyLink, {
        customClass: 'sky-drive-manager-messagebox',
        confirmButtonText: this.$t('common.copy'),
        cancelButtonText: this.$t('common.Cancel')
      })
      this.$copyText(toCopyLink).catch(e => {
        console.error(e)
        this.$message({
          showClose: true,
          message: this.$t('editor.copyFail'),
          type: 'error'
        })
      })
      this.$message({
        showClose: true,
        message: this.$t('editor.copySuccess'),
        type: 'success'
      })
    },
    async getSiteFileUrl(file) {
      let { sitepath: sitePath } = this.activePageInfo
      let fileId = file.id
      this.loading = true
      await this.userUseFileInSite({ fileId, sitePath }).catch()
      this.loading = false
      return this.userSiteFileBySitePathAndFileId({ fileId, sitePath })
    },
    async getFileRawUrl(file) {
      this.loading = true
      let fileId = file.id
      await this.userGetFileRawUrl({ fileId })
      this.loading = false
      return this.userRawUrlByFileId({ fileId })
    },
    async handleRemove(files) {
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
      files = files.length ? files : [files]
      await Promise.all(
        files.map(file => this.userRemoveFileFromSkyDrive({ file }).catch())
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
        removingFileSubscribtion && removingFileSubscribtion.unsubscribe()
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
<style lang="scss">
.sky-drive-manager {
  &-messagebox {
    word-break: break-all;
  }
}
</style>
