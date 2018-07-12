<template>
  <div v-loading='loading' class="skydrive-manager" droppable="true" @drop.prevent='handleDrop' @dragover.prevent>
    <el-row class="skydrive-manager-header">
      <el-col :span="18">
        <div>
          {{ $t('skydrive.usage') }}
          <span class="skydrive-manager-total">
            <span class="skydrive-manager-total-used" :class="usedProcessBarClass" :style="{ width: info.usedPercent + '%' }"></span>
          </span>
          {{ info.used | biteToG }}GB / {{ info.total | biteToG }}GB
        </div>
      </el-col>
      <el-col :span="6" v-if='defaultMode'>
        <el-input :placeholder="$t('common.search')" size="mini" v-model="searchWord">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
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
              <el-progress :stroke-width="10" color="#13ce67" :show-text=false  :percentage="scope.row.percent"></el-progress>
            </span>
            <span v-else>{{scope.row.updatedAt | dateTimeFormatter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          :label="$t('skydrive.checkedState')"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="skydrive-manager-cell-danger-text" v-if="scope.row.state === 'error'" :title="scope.row.errorMsg">失败</span>
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
            <input type="file" style="display:none;" multiple @change="handleUploadFile">
          </label>
        </el-col>
      </el-row>
    </div>

    <div v-if='mediaLibraryMode'>
      <div class="skydrive-manager-media-library">
        <div v-for="(file, index) in uploadingFiles" :key="index" class="skydrive-manager-media-uploading skydrive-manager-media-item" v-show="file.state !== 'success' && file.state != 'error'" :style='{
            backgroundImage: `url("${file.cover}")`
          }'>
          <div class="skydrive-manager-media-uploading-cover">
          </div>
          <el-progress :show-text=false :stroke-width="10" :percentage="file.percent" status="success"></el-progress>
        </div>
        <div v-for='mediaItem in skyDriveMediaLibraryData'
          :key='mediaItem.filename'
          class='skydrive-manager-media-item'
          :class='{selected: selectedMediaItem === mediaItem}'
          @click='handleSelectMediaItem(mediaItem)'
          :style='{
            backgroundImage: "url(" + mediaItem.downloadUrl + ")"
          }'>
          <div class='skydrive-manager-media-item-cover'>
            <span v-if='!mediaItem.checkPassed' :title='mediaItem.checkedState'>{{ mediaItem.filename }}</span>
          </div>
          <span :title="$t('common.remove')" class='el-icon-delete' @click.stop="handleRemove(mediaItem)"></span>
        </div>
      </div>
      <el-row class="skydrive-manager-footer">
        <el-col :span="6">
          <el-button size="small"
            :disabled='!availableSelectedMediaItem' round
            @click="handleInsert(availableSelectedMediaItem)"
          >{{ $t('common.apply') }}</el-button>
        </el-col>
        <el-col :span="10" :offset="8" class="skydrive-manager-upload">
          {{ $t('skydrive.dragAndDrop') }}
          <label class="el-button skydrive-manager-upload-btn el-button--primary el-button--small is-round">
            <span>{{ $t('skydrive.uploadFile') }}</span>
            <input type="file" accept=".jpg,.jpeg,.png,.gif,.bmp" multiple style="display:none;" @change="handleUploadFile">
          </label>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getFilenameWithExt } from '@/lib/utils/gitlab'
import _ from 'lodash'
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
      loading: true,
      searchWord: '',
      multipleSelectionResults: [],
      selectedMediaItem: null,
      uploadingFiles:[],
      qiniuCancelUpload:{}
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
        let { checked, size, filename, type } = item
        let file = { size, filename, type, downloadUrl: '' }
        let ext = this.getFileExt(file)

        let displaySize = this.biteToM(size) + 'MB'

        checked = Number(checked)
        let checkPassed = checked === 1
        let checkedState = checkPassed ? this.$t('skydrive.checkPassed') : checked === 2 ? this.$t('skydrive.checkUnpassed') : this.$t('skydrive.checking')
        return {...item, file, size, displaySize, type, ext, checkedState, checkPassed }
      }).filter(this.itemFilterBySearchWord)
    },
    skyDriveTableDataWithUploading() {
      let filterFinishedUploadingFile = _.filter(this.uploadingFiles, (file) => {
        return file.state !== 'success'
      })
      return _.concat(filterFinishedUploadingFile, this.skyDriveTableData)
    },
    skyDriveMediaLibraryData() {
      let mediaDatas = this.skyDriveTableData.filter(({ type }) => /^image/.test(type))
      let sortedMediaDatas = mediaDatas.sort((obj1, obj2)=>{
        return obj1.updatedAt <= obj2.updatedAt ? 1 : -1
      })
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
    getFileExt(file){
      let { filename, type } = file
      filename = filename || file.name
      let ext = /.+\./.test(filename) ? filename.split('.').pop() : type
      ext = (ext || '').toLowerCase()
      return ext
    },
    formatDate(dateObj){
      if (!dateObj) {
        dateObj = new Date()
      }
      let year = dateObj.getFullYear()
      let month = _.padStart(dateObj.getMonth() + 1, 2, '0')
      let day = _.padStart(dateObj.getDate(), 2, '0')
      let hour = _.padStart(dateObj.getHours(), 2, '0')
      let minute = _.padStart(dateObj.getMinutes(), 2, '0')
      let second = _.padStart(dateObj.getSeconds(), 2, '0')
      return [year, month, day].join('-') + [hour, minute, second].join(':')
    },
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
          ext: this.getFileExt(file),
          displaySize: this.biteToM(file.size) + 'MB',
          file: {
            downloadUrl: ''
          },
          updatedAt: this.formatDate(),
          state: 'doing' // success, error, cancel, doing
        })
        await this.uploadFile(file, fileIndex)
      }))
    },
    handleUploadFile(e) {
      let files = _.get(e, ['target', 'files'])
      console.log(files)
      this.filesQueueToUpload(files)
    },
    handleDrop(e) {
      let files = _.get(e, ['dataTransfer', 'files'])
      console.log(files)
      this.filesQueueToUpload(files)
    },
    async uploadFile(file, fileIndex) {
      if (!file) return
      if (this.mediaLibraryMode && !/^image\/.*/.test(file.type)) {
        this.uploadingFiles[fileIndex].state = 'error'
        this.uploadingFiles[fileIndex].errorMsg = filenameValidateResult
        return this.$message({
          showClose: true,
          message: this.$t('skydrive.notImageFileError'),
          type: 'error'
        })
      }

      let filenameValidateResult = this.filenameValidator(file.name)
      if (filenameValidateResult !== true) {
        this.uploadingFiles[fileIndex].state = 'error'
        this.uploadingFiles[fileIndex].errorMsg = filenameValidateResult
        return this.$message({
          message: file.name + ' ' + filenameValidateResult,
          type: 'error'
        })
      }
      let that = this
      await this.userUploadFileToSkyDrive({file, onStart(subscirbtion) {
        that.qiniuCancelUpload[file.name] = subscirbtion
      }, onProgress(progress) {
        fileIndex = _.findIndex(that.uploadingFiles, ['filename', file.name])
        that.uploadingFiles[fileIndex].percent = progress.percent
      }}).catch(err => console.error(err))
      fileIndex = _.findIndex(this.uploadingFiles, ['filename', file.name])
      this.uploadingFiles[fileIndex].state = 'success'
      this.uploadingFiles[fileIndex].updatedAt = this.formatDate()
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
    },
    removeFromUploadQue(file){
      let { filename, state } = file
      if (state === 'doing') {
        let removingFileSubscribtion = _.get(this.qiniuCancelUpload, filename)
        if (removingFileSubscribtion) {
          removingFileSubscribtion.unsubscribe()
        }
      }
      this.uploadingFiles = _.remove(this.uploadingFiles, (file)=>{
        return file.filename !== filename
      })
    },
    cancelUpload(){
      _.forIn(this.qiniuCancelUpload, (subscirbtion, key)=>{
        subscirbtion.unsubscribe()
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
      let toCopyLink = await this.getSiteFileUrl(file)

      await this.$confirm(toCopyLink, {
        confirmButtonText: this.$t('common.copy'),
        cancelButtonText: 'Cancel'
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
      let url = await this.getSiteFileUrl(file)
      this.$emit('close', { file, url: `${url}#${file.filename}` })
    },
    async handleRename(item) {
      let { _id, ext } = item
      let { value: newname } = await this.$prompt(this.$t('skydrive.newFilenamePromptMsg'),  this.$t('common.rename'), {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        inputValidator: str => {
          if (!str) {
            return this.$t('skydrive.nameEmptyError')
          }
          let isFilenameValid = this.testFilenameIsValid(str)
          if (typeof(isFilenameValid) === 'string') {
            return isFilenameValid
          }
          return this.filenameValidator(getFilenameWithExt(str, ext))
        }
      })

      newname = (newname || '').trim()
      if (!newname) return

      let newnameExt = /.+\./.test(newname) ? newname.split('.').pop() : ''
      newnameExt = newnameExt.toLowerCase()
      newname = newnameExt !== ext ? `${newname}.${ext}` : newname

      let filename = newname
      this.loading = true
      await this.userChangeFileNameInSkyDrive({key, filename}).catch(err => console.error(err))
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
    }
  },
  filters: {
    biteToG: (bite = 0) => (bite/(1024*1024*1024)).toFixed(2).toString().replace(/\.*0*$/, ''),
    dateTimeFormatter: (str = '') => str.replace(/[a-zA-Z]/g,' ').replace(/\..*$/, '')
  }
}
</script>

<style lang="scss">
.skydrive-manager {
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
  }
  &-media-item {
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    margin: 5px;
    background-size: cover;
    justify-content: space-between;
    background-color: #D1D1D1;
    position: relative;
    cursor: pointer;
    &.selected {
      border: 2px solid #3BA4FF;
      border-radius: 2px;
    }
    &-cover {
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
    .el-icon-delete {
      color: white;
      display: none;
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    &:hover, &.selected {
      .skydrive-manager-media-item-cover {
        background: rgba(0, 0, 0, .5);
      }
      .el-icon-delete {
        display: block;
      }
    }
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
</style>
