<template>
  <div
    v-loading='loading'
    class="skydrive-manager"
    :class="{'skydrive-manager-media-mode': mediaLibrary}"
    droppable="true"
    @drop.prevent='handleDrop'
    @dragover.prevent>
    <el-row v-if='defaultMode' class="skydrive-manager-header">
      <el-col :span="18">
        <div>
          {{ $t('skydrive.usage') }}
          <span class="skydrive-manager-total">
            <span class="skydrive-manager-total-used" :class="usedProcessBarClass" :style="{ width: info.usedPercent + '%' }"></span>
          </span>
          {{ info.used | biteToG }}GB / {{ info.total | biteToG }}GB
        </div>
      </el-col>
      <el-col :span="6">
        <el-input :placeholder="$t('common.search')" size="mini" v-model="searchWord">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-row v-else class="skydrive-manager-header">
      <el-row class='skydrive-manager-header-usage-and-upload'>
        <el-col :span="14">
          <div>
            {{ $t('skydrive.usage') }}
            <span class="skydrive-manager-total">
              <span class="skydrive-manager-total-used" :class="usedProcessBarClass" :style="{ width: info.usedPercent + '%' }"></span>
            </span>
            {{ info.used | biteToG }}GB / {{ info.total | biteToG }}GB
          </div>
        </el-col>
        <el-col :span="10" class="skydrive-manager-upload">
          {{ $t('skydrive.dragAndDrop') }}
          <label class="el-button skydrive-manager-upload-btn el-button--primary el-button--small is-round">
            <span>{{ $t('skydrive.uploadFile') }}</span>
            <input ref="mediaInput" type="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.mp4,.avi,.wmv,.mkv,.amv,.m4v,.webm" multiple style="display:none;" @change="handleUploadFile">
          </label>
        </el-col>
      </el-row>
      <el-row class='skydrive-manager-header-tabs-and-search'>
        <el-col :span="18" class='skydrive-manager-header-tabs'>
          <div v-if ="isImgLoopMod">
            <span :class="{'active': mediaFilterType==='image'}" @click.stop="changeMediaFilterType('image')">{{ $t('skydrive.image') }}</span>
            <span :class="{'active': mediaFilterType==='video'}" @click.stop="changeMediaFilterType('video')">{{ $t('skydrive.video') }}</span>
          </div>
          <div v-else>
            <span :class="{'active': mediaFilterType==='image'}" @click.stop="changeMediaFilterType('image')">{{ $t('skydrive.image') }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <el-input :placeholder="$t('common.search')" size="mini" v-model="searchWord">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
      </el-row>
    </el-row>

    <div v-if='defaultMode'>
      <el-table
        ref="skyDriveTable"
        :data="skyDriveTableDataWithUploading"
        height="500"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          sortable
          width="40">
        </el-table-column>
        <el-table-column
          prop="filename"
          :label="$t('skydrive.filename')"
          class-name="skydrive-manager-cell-filename"
          sortable
          width="300">
        </el-table-column>
        <el-table-column
          prop="ext"
          sortable
          :label="$t('skydrive.filetype')"
          width="80">
        </el-table-column>
        <el-table-column
          prop="size"
          sortable
          :label="$t('skydrive.filesize')"
          width="85"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.displaySize }}</template>
        </el-table-column>
        <el-table-column
          prop="updatedAt"
          sortable
          :label="$t('skydrive.updateDate')"
          width="155">
          <template slot-scope="scope">
            <span v-if="scope.row.percent >= 0 && scope.row.state !== 'success'">
              <el-progress
                :stroke-width="10"
                :color="scope.row.state === 'doing' ? '#13ce67' : '#f56c6c'"
                :show-text=false
                :percentage="scope.row.percent"
              ></el-progress>
            </span>
            <span v-else>{{scope.row.updatedAt}}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          :label="$t('skydrive.checkedState')"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="skydrive-manager-cell-danger-text" v-if="scope.row.state === 'error'" :title="scope.row.errorMsg">{{$t('skydrive.uploadFailed')}}</span>
            <span v-else>{{scope.row.checkedState}}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="skydrive-manager-cell-actions"
          :label="$t('common.action')"
          width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.percent >= 0 && scope.row.state !== 'success'">
              <span class='iconfont icon-close_' :title="$t('common.remove')" @click="removeFromUploadQue(scope.row)"></span>
            </span>
            <span v-else>
              <span class='iconfont icon-copy' :class='{disabled: !scope.row.checkPassed}' :title="$t('common.copyURI')" @click='handleCopy(scope.row)'></span>
              <span class='iconfont icon-insert' :class='{disabled: !scope.row.checkPassed}' :title="$t('common.insert')" @click='handleInsert(scope.row)'></span>
              <span class='el-icon-download' :title="$t('common.download')" @click='download(scope.row)'></span>

              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu class='skydrive-manager-cell-actions-menu' slot="dropdown">
                  <!-- <el-dropdown-item>
                    <label class='el-icon-refresh'>
                      <input type="file" :accept="'.' + scope.row.ext" style="display:none;" @change='e => handleUpdateFile(e, scope.row)'>
                      <span>{{ $t('common.update') }}</span>
                    </label>
                  </el-dropdown-item> -->
                  <el-dropdown-item @click.native='handleRename(scope.row)'>
                    <span class='el-icon-edit'></span>
                    {{ $t('common.rename') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click.native='handleRemove(scope.row)'>
                    <span class='el-icon-delete'></span>
                    {{ $t('common.remove') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="skydrive-manager-footer">
        <el-col :span="6">
          <el-button size="small" :disabled="!approvedMultipleSelectionResults.length" round @click="downloadAllSelected">{{ $t('skydrive.downloadSelected') }}</el-button>
          <el-button size="small" :disabled="!multipleSelectionResults.length" round @click="removeAllSelected">{{ $t('skydrive.removeSelected') }}</el-button>
        </el-col>
        <el-col :span="10" :offset="8" class="skydrive-manager-upload">
          {{ $t('skydrive.dragAndDrop') }}
          <label class="el-button skydrive-manager-upload-btn el-button--primary el-button--small is-round">
            <span>{{ $t('skydrive.uploadFile') }}</span>
            <input ref="fileInput" type="file" style="display:none;" multiple @change="handleUploadFile">
          </label>
        </el-col>
      </el-row>
    </div>

    <div v-if='mediaLibraryMode'>
      <div class="skydrive-manager-media-library">
        <div
          v-for="(file, index) in uploadingFiles" :key="index"
          class="skydrive-manager-media-uploading skydrive-manager-media-item"
          v-show="file.state !== 'success' && file.state != 'error'"
          >
          <img v-if="file.type === 'images'" :src="file.cover" class="skydrive-manager-media-item-img"/>
          <div class="skydrive-manager-media-uploading-cover"></div>
          <span :title="$t('common.remove')" class='el-icon-delete' @click.stop="removeFromUploadQue(file)"></span>
          <el-progress :show-text=false :stroke-width="10" :percentage="file.percent" status="success"></el-progress>
        </div>
        <div v-for='mediaItem in skyDriveMediaLibraryData'
          :key='mediaItem.key'
          class='skydrive-manager-media-item'
          :class='{selected: selectedMediaItem === mediaItem}'
          @click='handleSelectMediaItem(mediaItem)'
          >
          <video v-if="mediaItem.type==='videos'" :src="mediaItem.downloadUrl" width="100%" height="100%"></video>
          <img v-if="mediaItem.type==='images'" :src="mediaItem.downloadUrl" class="skydrive-manager-media-item-img"/>
          <div class='skydrive-manager-media-item-cover'>
            <!-- <span v-if='!mediaItem.checkPassed' :title='mediaItem.checkedState'>{{ mediaItem.filename }}</span> -->
            <i v-if="mediaItem.type==='videos'" class='skydrive-manager-media-item-play' @click.stop="handlePlay(mediaItem)"></i>
          </div>
          <span :title="$t('common.remove')" class='el-icon-delete' @click.stop="handleRemove(mediaItem)"></span>
        </div>
        <div v-if="!loading && !skyDriveMediaLibraryData.length && !uploadingFiles.length" class="skydrive-manager-media-library-placeholder">
          <img src="@/assets/img/media_library_empty.png">
          <span class="skydrive-manager-media-library-placeholder-tip">{{ $t('skydrive.nothingHere') }}</span>
          <label v-if="mediaFilterType === 'image'" class="el-button skydrive-manager-upload-btn el-button--primary el-button--small is-round">
            <span>{{ $t('skydrive.uploadImage') }}</span>
            <input ref="centerVideoInput" type="file" accept=".jpg,.jpeg,.png,.gif,.bmp" style="display:none;" multiple @change="handleUploadFile">
          </label>
          <label v-if="mediaFilterType === 'video'" class="el-button skydrive-manager-upload-btn el-button--primary el-button--small is-round">
            <span>{{ $t('skydrive.uploadVideo') }}</span>
            <input ref="centerVideoInput" type="file" accept=".mp4,.avi,.wmv,.mkv,.amv,.m4v,.webm" style="display:none;" multiple @change="handleUploadFile">
          </label>
        </div>
      </div>
      <el-row class="skydrive-manager-footer">
        <el-col :span="6" :offset="18">
          <el-button size="small" :type="availableSelectedMediaItem ? 'primary':''"
            :disabled='!availableSelectedMediaItem' round
            @click="handleInsert(availableSelectedMediaItem)"
          >{{ $t('common.apply') }}</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { getFilenameWithExt } from '@/lib/utils/gitlab'
import formatDate from '@/lib/utils/formatDate'
import waitForMilliSeconds from '@/lib/utils/waitForMilliSeconds'
import { getFileExt, getBareFilename } from '@/lib/utils/filename'
import mediaProperties from '../adi/common/media/media.properties';
const ErrFilenamePatt = new RegExp('^[^\\\\/\*\?\|\<\>\:\"]+$');

export default {
  name: 'SkyDriveManager',
  props: {
    mediaLibrary: Boolean
  },
  data() {
    return {
      defaultMode: !this.mediaLibrary,
      mediaLibraryMode: this.mediaLibrary,
      mediaFilterType: 'image',
      loading: true,
      searchWord: '',
      multipleSelectionResults: [],
      selectedMediaItem: null,
      uploadingFiles:[],
      qiniuUploadSubscriptions:{}
    }
  },
  async mounted() {
    await this.userRefreshSkyDrive({useCache: false})
    this.loading = false
  },
  beforeDestroy(){
    this.cancelUpload()
  },
  computed: {
    ... mapGetters({
      'activePageInfo': 'activePageInfo',
      'userSkyDriveFileList': 'user/skyDriveFileList',
      'userSkyDriveInfo': 'user/skyDriveInfo',
      'userSiteFileBySitePathAndFileId': 'user/siteFileBySitePathAndFileId'
    }),
    skyDriveTableData() {
      return this.userSkyDriveFileList.map(item => {
        // checked: 0 未审核, 1 通过, 2 未通过
        let { checked, size, filename, type, updatedAt } = item
        let file = { size, filename, type, downloadUrl: '' }
        let ext = getFileExt(file)
        updatedAt = formatDate(new Date(updatedAt))

        let displaySize = this.biteToM(size) + 'MB'
        checked = Number(checked)
        let checkPassed = checked === 1
        let checkedState = checkPassed ? this.$t('skydrive.checkPassed') : checked === 2 ? this.$t('skydrive.checkUnpassed') : this.$t('skydrive.checking')

        return {...item, file, size, updatedAt, displaySize, type, ext, checkedState, checkPassed }
      }).filter(this.itemFilterBySearchWord).sort(this.sortByUpdateAt)
    },
    skyDriveTableDataWithUploading() {
      let filterFinishedUploadingFile = _.filter(this.uploadingFiles, (file) => {
        return file.state !== 'success'
      })

      return [
        ...filterFinishedUploadingFile,
        ...this.skyDriveTableData
      ].sort(this.sortByUpdateAt)
    },
    skyDriveMediaLibraryData() {
      let mediaDatas = this.skyDriveTableData.filter(({ type }) => new RegExp(`^${this.mediaFilterType}`).test(type))
      let sortedMediaDatas = mediaDatas.sort(this.sortByUpdateAt)
      return sortedMediaDatas
    },
    info() {
      let {total = 0, used = 0} = this.userSkyDriveInfo || {}
      let unused = total - used
      let usedPercent = Math.max(0, (100 * used/total).toFixed(2))
      return {total, used, unused, usedPercent}
    },
    availableSelectedMediaItem() {
      let item = this.itemFilterBySearchWord(this.selectedMediaItem) ? this.selectedMediaItem : null
      return item && item.checkPassed ? item : null
    },
    approvedMultipleSelectionResults() {
      return this.multipleSelectionResults.filter(({ checked }) => Number(checked) === 1)
    },
    usedProcessBarClass() {
      let { usedPercent } = this.info
      return usedPercent >= 90 ? 'skydrive-manager-total-used-danger' : (usedPercent >= 70 ? 'skydrive-manager-total-used-warning' : '')
    },
    isImgLoopMod() {
      if (this.$store.getters.activeProperty === 'imgLoop') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ... mapActions({
      userRefreshSkyDrive: 'user/refreshSkyDrive',
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive',
      userRemoveFileFromSkyDrive: 'user/removeFileFromSkyDrive',
      userChangeFileNameInSkyDrive: 'user/changeFileNameInSkyDrive',
      userUseFileInSite: 'user/useFileInSite'
    }),
    async filesQueueToUpload(files){
      if (this.defaultMode) {
        this.$refs.skyDriveTable.clearSort()
        this.$refs.skyDriveTable.sort('updatedAt', 'descending')
      }
      await Promise.all(_.map(files, async file => {
        let fileIndex = this.uploadingFiles.length
        let previewUrl = URL.createObjectURL(file)
        this.uploadingFiles.push({
          cover: previewUrl,
          percent: 0,
          filename: file.name,
          ext: getFileExt(file),
          displaySize: this.biteToM(file.size) + 'MB',
          type: file.type.split('/')[0]+'s',
          file: {
            downloadUrl: ''
          },
          updatedAt: formatDate(new Date(Date.now() + 7*24*3600*1000)), // add extra time for sort
          state: 'doing' // success, error, cancel, doing
        })
        await this.uploadFile(file, fileIndex)
      }))
    },
    handleUploadFile(e) {
      let files = _.get(e, ['target', 'files'])
      this.filesQueueToUpload(files)
      this.$refs.fileInput && (this.$refs.fileInput.value = '')
      this.$refs.mediaInput && (this.$refs.mediaInput.value = '')
      this.$refs.centerImageInput && (this.$refs.centerImageInput.value = '')
      this.$refs.centerVideoInput && (this.$refs.centerVideoInput.value = '')
    },
    handleDrop(e) {
      let files = _.get(e, ['dataTransfer', 'files'])
      this.filesQueueToUpload(files)
    },
    async uploadFile(file, fileIndex) {
      if (!file) return
      if (this.mediaLibraryMode && !/^(image|video)\/.*/.test(file.type)) {
        this.uploadingFiles[fileIndex].state = 'error'
        this.uploadingFiles[fileIndex].errorMsg = filenameValidateResult
        return this.$message({
          showClose: true,
          message: this.$t('skydrive.notMediaFileError'),
          type: 'error'
        })
      }

      let filenameValidateResult = this.filenameValidator(file.name)
      if (filenameValidateResult !== true) {
        this.uploadingFiles[fileIndex].state = 'error'
        this.uploadingFiles[fileIndex].errorMsg = filenameValidateResult
        await waitForMilliSeconds(Math.random()*1000)
        this.$notify({
          title: this.$t('common.failure'),
          message: file.name + ' ' + filenameValidateResult,
          type: 'error'
        })
        return
      }
      let that = this
      await this.userUploadFileToSkyDrive({file, onStart(subscription) {
        that.qiniuUploadSubscriptions[file.name] = subscription
      }, onProgress(progress) {
        fileIndex = _.findIndex(that.uploadingFiles, ['filename', file.name])
        that.uploadingFiles[fileIndex].percent = progress.percent
      }}).then(async () => {
        fileIndex = _.findIndex(this.uploadingFiles, ['filename', file.name])
        this.uploadingFiles[fileIndex].state = 'success'
        this.uploadingFiles[fileIndex].updatedAt = formatDate()
        await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      }).catch(err => {
        fileIndex = _.findIndex(this.uploadingFiles, ['filename', file.name])
        this.uploadingFiles[fileIndex].state = 'error'
        console.error(err)
      })
    },
    removeFromUploadQue(file){
      let { filename, state } = file
      if (state === 'doing') {
        let removingFileSubscribtion = _.get(this.qiniuUploadSubscriptions, filename)
        if (removingFileSubscribtion) {
          removingFileSubscribtion.unsubscribe()
        }
      }
      this.uploadingFiles = _.remove(this.uploadingFiles, (file)=>{
        return file.filename !== filename
      })
    },
    cancelUpload(){
      _.forIn(this.qiniuUploadSubscriptions, (subscription, key)=>{
        subscription.unsubscribe()
      })
    },
    async handleRemove(file) {
      await this.$confirm(this.$t('skydrive.removeFileConfirmMsg'), this.$t('editor.delNotice'), {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })

      this.loading = true
      await this.userRemoveFileFromSkyDrive({file}).catch(err => console.error(err))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.selectedMediaItem = null
      this.loading = false
    },
    async handleCopy(file) {
      if (!file.checkPassed) {
        return
      }

      let toCopyPrefix = await this.getSiteFileUrl(file)
      let toCopyLink = `${toCopyPrefix}#${file.filename}`

      await this.$confirm(toCopyLink, {
        confirmButtonText: this.$t('common.copy'),
        cancelButtonText: this.$t('common.Cancel')
      })

      this.$copyText(toCopyLink).then(res => {
        this.$message({
          showClose: true,
          message: this.$t('editor.copySuccess'),
          type: 'success'
        })
      }).catch(e => {
        console.error(e)
        this.$message({
          showClose: true,
          message: this.$t('editor.copyFail'),
          type: 'error'
        })
      })
    },
    async handleInsert(file) {
      if (!file.checkPassed) {
        return
      }
      let url = await this.getSiteFileUrl(file)
      this.$emit('close', { file, url: `${url}#${file.filename}` })
    },
    async handleRename(item) {
      let { _id, ext, filename, key } = item
      let bareFilename = getBareFilename(filename)
      let { value: newname } = await this.$prompt(this.$t('skydrive.newFilenamePromptMsg'),  this.$t('common.rename'), {
        inputValue: bareFilename,
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        inputValidator: str => {
          if (str === bareFilename || str === filename) return true
          if (!str) return this.$t('skydrive.nameEmptyError')

          let isFilenameValid = this.testFilenameIsValid(str)
          if (typeof(isFilenameValid) === 'string') return isFilenameValid

          return this.filenameValidator(getFilenameWithExt(str, ext))
        }
      })

      newname = (newname || '').trim()
      if (!newname) return

      let newnameExt = /.+\./.test(newname) ? newname.split('.').pop() : ''
      newnameExt = newnameExt.toLowerCase()
      newname = newnameExt !== ext ? `${newname}.${ext}` : newname
      let newFilename = newname
      if (newFilename === filename) return

      this.loading = true
      await this.userChangeFileNameInSkyDrive({key, filename: newFilename}).catch(err => console.error(err))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    testFilenameIsValid(newFilename) {
      let errMsg = this.$t('skydrive.nameContainSpecialCharacterError')
      return (!ErrFilenamePatt.test(newFilename)) ? errMsg : true
    },
    filenameValidator(newFilename) {
      let errMsg = this.$t('skydrive.nameConflictError')
      return this.userSkyDriveFileList.filter(({ filename }) => filename === newFilename).length ? errMsg : true
    },
    handleSelectionChange(selectionResults) {
      this.multipleSelectionResults = selectionResults
    },
    async downloadAllSelected() {
      this.approvedMultipleSelectionResults.map(({ file }) => this.download(file))
    },
    async download(file) {
      let downloadUrl = file.downloadUrl
      if (!downloadUrl) return
      let { filename } = file
      await new Promise((resolve, reject) => {
        let a = document.createElement('a')
        a.target = '_blank'
        a.style.display = 'none'
        a.href = `${downloadUrl};attname=${filename}`
        a.download = filename || ""
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          a.remove()
          resolve()
        }, 300)
      }).catch(e => console.error(e))
    },
    async removeAllSelected() {
      await this.$confirm(this.$t('skydrive.removeFileConfirmMsg'), this.$t('editor.delNotice'), {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })

      this.loading = true
      await Promise.all(this.multipleSelectionResults.map(
        file => this.userRemoveFileFromSkyDrive({file}).catch(err => console.error(err))
      ))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    biteToM: (bite = 0) => (bite/(1024*1024)).toFixed(2).toString().replace(/\.*0*$/, ''),
    itemFilterBySearchWord(item) {
      if (!item) return false
      let { filename } = item
      let searchWord = this.searchWord && this.searchWord.trim().toLowerCase()
      if (!searchWord) return true
      let filenameLowerCase = (filename || '').toLowerCase()
      return filenameLowerCase.indexOf(searchWord) >= 0
    },
    handleSelectMediaItem(mediaItem) {
      this.selectedMediaItem = mediaItem
    },
    async getSiteFileUrl(file) {
      let {sitepath: sitePath} = this.activePageInfo
      let payload = {fileId: file.id, sitePath}
      this.loading = true
      await this.userUseFileInSite(payload).catch(e => console.error(e))
      this.loading = false
      let url = this.userSiteFileBySitePathAndFileId(payload)
      return url
    },
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    handlePlay(mediaItem) {
      let mediaItemVideoPreviewId = `mediaItemVideoPreview_${ Date.now() }`
      this.$alert(`<div>
          <style>.el-message-box__wrapper{background: black;}</style>
          <video id="${mediaItemVideoPreviewId}" src="${mediaItem.downloadUrl}" controls></video>
        </div>`, {
        customClass: 'skydrive-manager-video-preview-dialog',
        showConfirmButton: false,
        dangerouslyUseHTMLString: true,
        beforeClose: (action, instance, done) => {
          let mediaItemVideoPreviewDom = document.querySelector(`#${ mediaItemVideoPreviewId }`)
          mediaItemVideoPreviewDom && mediaItemVideoPreviewDom.pause()
          done()
        }
      });
    },
    changeMediaFilterType(type) {
      this.mediaFilterType = type
    }
  },
  filters: {
    biteToG: (bite = 0) => (bite/(1024*1024*1024)).toFixed(2).toString().replace(/\.*0*$/, '')
  }
}
</script>

<style lang="scss">
.skydrive-manager {
  &-media-mode {
    .skydrive-manager-header {
      margin: -30px -35px 20px -35px;
      padding: 20px 35px 0 35px;
      background: #E8E8E8;
      &-usage-and-upload {
        margin-bottom: 20px;
        .skydrive-manager-upload {
          position: relative;
          top: -10px;
        }
      }
      &-tabs-and-search {
        .skydrive-manager-header-tabs {
          position: relative;
          left: -12px;
          span {
            cursor: pointer;
            display: inline-block;
            padding: 6px 12px;
            font-size: 16px;
            line-height: 16px;
          }
          .active {
            background: white;
          }
        }
        .el-input {
          top: -10px;
        }
      }
    }
    .skydrive-manager-footer {
      text-align: right;
    }
  }
  &-header {
    margin-bottom: 20px;
  }
  &-total {
    display: inline-block;
    margin: 0 15px 0 5px;
    width: 190px;
    height: 10px;
    border-radius: 5px;
    background: #F5F5F5;
    &-used {
      display: block;
      height: 100%;
      border-radius: 5px;
      background: #3BA4FF;
      &-danger {
        background-color: #ff1e02;
      }
      &-warning {
        background-color: #f97b00;
      }
    }
  }
  &-footer {
    margin-top: 20px;
  }
  &-upload {
    text-align: right;
    &-btn {
      margin-left: 15px;
    }
  }
  &-cell-filename {
    .cell {
      white-space: nowrap;
    }
  }
  &-cell-danger-text{
    color: #f56c6c;
  }
  &-cell-actions, &-cell-actions-menu {
    [class*="icon"] {
      display: inline-block;
      margin-right: 10px;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      &.disabled {
        color: #bbb;
        cursor: not-allowed;
      }
      &::before {
        font-size: 16px;
      }
      &.el-icon-refresh::before {
        margin-right: 10px;
      }
      &.el-icon-download:before {
        font-size: 18px;
      }
    }
    [class*="iconfont"]::before {
      font-size: 16px;
    }
    .el-dropdown {
      float: right;
    }
    .el-icon-more {
      color: #858585;
      transform: rotate(90deg);
    }
  }
  &-media-library {
    height: 500px;
    overflow-x: hidden;
    overflow-x: auto;
    display: flex;
    flex-wrap: wrap;
    &-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &-tip {
        margin: 30px auto 60px;
      }
    }
  }
  &-media-item {
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    margin: 5px 10px 5px 0px;
    background-size: cover;
    justify-content: space-between;
    background-color: #D1D1D1;
    position: relative;
    [class*='icon'] {
      cursor: pointer;
    }
    &.selected {
      border: 2px solid #3BA4FF;
      border-radius: 2px;
    }
    &-img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    &-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      color: white;
      align-items: center;
      span {
        width: 80px;
        font-size: .7em;
        line-height: 1.2em;
        word-break: break-all;
      }
    }
    &-play {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 3px solid rgba(144,144,139, .8);
      position: relative;
      cursor: pointer;
      &:after {
        content: '';
        display: block;
        position: relative;
        left: 2px;
        box-sizing: border-box;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 8px 0px 8px 12px;
        border-color: transparent transparent transparent rgba(144,144,139, 1);
      }
    }
    .el-icon-delete {
      color: white;
      display: none;
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    &:hover, &.selected {
      .skydrive-manager-media-item-cover {
        background: rgba(0, 0, 0, .4);
      }
      .el-icon-delete {
        display: block;
      }
      .skydrive-manager-media-item-play {
        border: 3px solid #3BA4FF;
        background: #3BA4FF;
        &:after {
          border-color: transparent transparent transparent white;
        }
      }
    }
  }
  &-video-preview-dialog {
    width: 900px;
    min-height: 500px;
    background: transparent;
    border: 0;
    box-shadow: none;
    video {
      max-width: 100%;
      max-height: 600px;
      display: block;
      margin: 0 auto;
    }
    // .el-message-box__header {
    //   padding: 30px 30px 10px;
    // }
    // .el-message-box__headerbtn {
    //   top: -5px;
    //   right: -5px; 
    //   .el-message-box__close {
    //     font-size: 3em;
    //     color: white;
    //   }
    // }
    // .el-message-box__content {
    //   padding: 0;
    //   p {
    //     padding: 0;
    //     margin: 0;
    //   }
    // }
  }
  &-media-uploading{
    padding: 0 15px;
    background-color: rgba(0, 0, 0, 0.5);
    &-cover{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.3);
    }
    .el-progress{
      position: relative;
      top: 45px;
    }
  }
}
.el-popup-parent--hidden {
  .el-message-box__content {
    p {
      word-wrap:break-word; 
      word-break:break-all;
    }
  }
}
</style>
