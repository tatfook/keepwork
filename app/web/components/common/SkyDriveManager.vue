<template>
  <div v-loading='loading' class="skydrive-manager" @drop.prevent="handleDrop" @dragenter.prevent="handleDragEnter" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave">
    <div class="skydrive-manager-header">
      <div class='skydrive-manager-header-first' :class="{'skydrive-manager-header-first-no-position':isDroping}">
        <usage-bar class='skydrive-manager-header-usage'></usage-bar>
        <div class="skydrive-manager-header-fake-upload" v-show="isDroping">
          {{$t('skydrive.dragAndDrop')}}
          <el-button class="skydrive-manager-fake-upload-button" size="small" type="primary" round>{{uploadText}}</el-button>
        </div>
        <file-uploader :class="{'skydrive-manager-drop': isDroping, 'skydrive-manager-header-upload': !isDroping}" :uploadText="uploadText" :isDragMode="isDroping" :viewType="viewType" :uploadType="mediaFilterType" @resetTableSort="resetTableSort"></file-uploader>
        <p class="skydrive-manager-header-first-info" v-show="mediaFilterType==='image'">建议上传图片大小不能超过2M，支持jpg/png格式</p>
      </div>
      <div class='skydrive-manager-header-second'>
        <div class='skydrive-manager-header-tabs'>
          <span class="skydrive-manager-header-tabs-item" v-if="isNoMediaFileShow" :class="{'active': mediaFilterType==='all'}" @click.stop="changeMediaFilterType('all')">全部</span>
          <span class="skydrive-manager-header-tabs-item" v-if="isImageShow" :class="{'active': mediaFilterType==='image'}" @click.stop="changeMediaFilterType('image')">{{ $t('skydrive.image') }}</span>
          <span class="skydrive-manager-header-tabs-item" v-if="isVideoShow" :class="{'active': mediaFilterType==='video'}" @click.stop="changeMediaFilterType('video')">{{ $t('skydrive.video') }}</span>
        </div>
        <div class="skydrive-manager-header-operations">
          <el-checkbox v-model="isAllSelected" v-if="!isApplicable" class="skydrive-manager-header-operations-item" @change="selectAll">全选</el-checkbox>
          <file-downloader class="skydrive-manager-header-operations-item" v-if="!isApplicable" :selectedFiles='activeSelectedFiles'></file-downloader>
          <file-deleter @changeLoadingState="changeLoadingState" v-if="!isApplicable" class="skydrive-manager-header-operations-item" :selectedFiles='activeSelectedFiles'></file-deleter>
          <el-input :placeholder="$t('common.search')" size="mini" :clearable="true" v-model="searchWord">
            <i slot="suffix" class="el-input__icon el-icon-search" v-show="!searchWord"></i>
          </el-input>
          <div class="skydrive-manager-header-operations-item" v-if="!isApplicable" @click="toggleViewType">
            <el-tooltip v-show="viewType == 'thumb'" content="切换到列表模式">
              <i class="iconfont icon-menu"></i>
            </el-tooltip>
            <el-tooltip v-show="viewType == 'table'" content="切换到缩略图模式">
              <i class="iconfont icon-tuwen1"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <table-type v-if="!isApplicable" class="skydrive-manager-table" ref="tableTypeComp" v-show="viewType=='table'" :uploadText="uploadText" :mediaFilterType="mediaFilterType" :isInsertable="isInsertable" :fileListWithUploading='fileListWithUploading' @selectAllStateChange='changeSelectAllState' @close="handleClose"></table-type>
    <media-type ref="mediaTypeComp" v-show="viewType=='thumb'" :isInsertable="isInsertable" :isApplicable="isApplicable" :uploadingFiles='filterTypeUploadingFile' :uploadText="uploadText" :fileListFilteredSearched='fileListFilteredSearched' :mediaFilterType="mediaFilterType" @selectAllStateChange='changeSelectAllState' @close="handleClose"></media-type>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import {
  getFileExt,
  getFileSizeText,
  getBareFilename
} from '@/lib/utils/filename'
import tableType from './skyDrive/tableType'
import mediaType from './skyDrive/mediaType'
import UsageBar from './skyDrive/UsageBar'
import FileDownloader from './skyDrive/FileDownloader'
import FileDeleter from './skyDrive/FileDeleter'
import FileUploader from './skyDrive/FileUploader'
const ImageTypeExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
const VideoTypeExts = ['mp4']
export default {
  name: 'SkyDriveManager',
  props: {
    isInsertable: Boolean,
    isApplicable: Boolean,
    isImageShow: Boolean,
    isVideoShow: Boolean,
    isNoMediaFileShow: Boolean
  },
  async mounted() {
    this.loading = true
    await this.userRefreshSkyDrive({ useCache: false })
    this.loading = false
    this.isMounted = true
  },
  data() {
    return {
      leaveTimer: undefined,
      isDroping: false,
      isAllSelected: false,
      viewType: this.isApplicable ? 'thumb' : 'table',
      searchWord: '',
      mediaFilterType: this.isNoMediaFileShow
        ? 'all'
        : this.isImageShow
        ? 'image'
        : 'video',
      loading: false,
      isMounted: false,
      uploadingFiles: []
    }
  },
  computed: {
    ...mapGetters({
      noFinishedUploadingFiles: 'skydrive/noFinishedUploadingFiles',
      subscriptions: 'skydrive/subscriptions',
      userSkyDriveFileList: 'user/skyDriveFileList',
      activePageInfo: 'activePageInfo'
    }),
    uploadText() {
      let uploadType = this.mediaFilterType
      return uploadType == 'image'
        ? this.$t('skydrive.uploadImage')
        : uploadType == 'video'
        ? this.$t('skydrive.uploadVideo')
        : this.$t('skydrive.uploadFile')
    },
    activeChildComp() {
      if (!this.isMounted) {
        return
      }
      return this.viewType == 'table'
        ? this.$refs.tableTypeComp
        : this.$refs.mediaTypeComp
    },
    activeSelectedFiles() {
      return (
        (this.activeChildComp &&
          this.activeChildComp.approvedMultipleSelectionResults) ||
        []
      )
    },
    fileListFormated() {
      return this.userSkyDriveFileList.map(item => {
        // checked: 0 未审核, 1 通过, 2 未通过
        let { checked, size, filename, type, updatedAt } = item
        checked = Number(checked)
        return {
          ...item,
          file: { size, filename, type, downloadUrl: '' },
          displaySize: getFileSizeText(size),
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
    fileListFilteredType() {
      return this.getTypeFilteredFiles(this.fileListFormated)
    },
    fileListFilteredSearched() {
      return this.fileListFilteredType.filter(this.itemFilterBySearchWord)
    },
    filterTypeUploadingFile() {
      return this.getTypeFilteredFiles(this.noFinishedUploadingFiles)
    },
    fileListWithUploading() {
      return _.concat(
        this.filterTypeUploadingFile,
        this.fileListFilteredSearched
      )
    }
  },
  methods: {
    ...mapActions({
      userRefreshSkyDrive: 'user/refreshSkyDrive'
    }),
    handleDragEnter(e) {
      this.$set(this, 'isDroping', true)
    },
    handleDragOver(e) {
      clearTimeout(this.leaveTimer)
      this.handleDragEnter(e)
    },
    removeDropZone() {
      this.$set(this, 'isDroping', false)
    },
    handleDragLeave() {
      clearTimeout(this.leaveTimer)
      this.leaveTimer = setTimeout(this.removeDropZone, 100)
    },
    handleDrop(e) {
      this.isDroping = false
    },
    getTypeFilteredFiles(fileList) {
      if (this.mediaFilterType === 'all') {
        return fileList
      } else {
        let validExts =
          this.mediaFilterType === 'image' ? ImageTypeExts : VideoTypeExts
        return _.filter(
          fileList,
          ({ ext }) =>
            _.findIndex(validExts, validExt => validExt === ext) !== -1
        )
      }
    },
    addUploadingFiles(file) {
      this.uploadingFiles.push(file)
    },
    changeLoadingState(isLoading) {
      this.loading = isLoading
    },
    changeSelectAllState(isAllSelected) {
      this.isAllSelected = isAllSelected
    },
    toggleViewType() {
      this.viewType = this.viewType == 'table' ? 'thumb' : 'table'
      this.isAllSelected = this.activeChildComp.isAllSelected
    },
    changeMediaFilterType(type) {
      this.mediaFilterType = type
    },
    selectAll() {
      this.activeChildComp.selectAll()
    },
    resetTableSort() {
      let skyDriveTable = _.get(this.activeChildComp, '$refs.skyDriveTable')
      if (!skyDriveTable) return
      skyDriveTable.clearSort()
      skyDriveTable.sort('updatedAt', 'descending')
    },
    itemFilterBySearchWord(item) {
      if (!item) return false
      let { filename } = item
      let searchWord = this.searchWord && this.searchWord.trim().toLowerCase()
      if (!searchWord) return true
      let filenameLowerCase = (filename || '').toLowerCase()
      return filenameLowerCase.indexOf(searchWord) >= 0
    },
    handleClose({ file, url }) {
      this.$emit('close', { file, url })
    }
  },
  components: {
    tableType,
    mediaType,
    UsageBar,
    FileDownloader,
    FileDeleter,
    FileUploader
  }
}
</script>
<style lang="scss">
.skydrive-manager {
  &-header {
    margin-bottom: 20px;
    padding: 30px 36px 0;
    background-color: #e8e8e8;
    &-first {
      position: relative;
      padding-bottom: 32px;
      display: flex;
      align-items: center;
      min-height: 32px;
      &-no-position {
        position: unset;
      }
      &-info {
        position: absolute;
        right: 8px;
        bottom: 0;
        font-size: 12px;
        color: #999;
      }
    }
    &-fake-upload {
      .el-button--small {
        display: inline-block;
        margin-left: 20px;
        font-size: 14px;
        padding: 8px 15px;
      }
    }
    &-usage {
      flex: 1;
    }
    &-second {
      display: flex;
    }
    &-operations {
      &-item {
        margin-left: 24px;
        margin-right: 0;
        display: inline-block;
        cursor: pointer;
        .iconfont {
          margin-right: 8px;
        }
      }
      .el-input {
        width: 226px;
        margin-left: 24px;
      }
    }
    &-tabs {
      flex: 1;
      padding-top: 8px;
      &-item {
        display: inline-block;
        cursor: pointer;
        padding: 8px 12px;
        font-size: 14px;
        line-height: 16px;
        color: #333;
      }
      .active {
        color: #3ba4ff;
        background-color: #fff;
      }
    }
  }
  &-table {
    height: 500px;
    padding: 0 36px;
  }
  &-upload {
    text-align: right;
    &-btn {
      margin-left: 15px;
    }
  }
  &-drop {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    padding-top: 240px;
    z-index: 1111;
    .file-uploader-button {
      width: 100%;
      height: 100%;
      margin-left: 0;
    }
    .el-upload-dragger {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: auto;
      height: auto;
      background-color: rgba(32, 159, 255, 0.06);
    }
    .el-icon-upload {
      font-size: 80px;
      position: relative;
      color: #909399;
    }
    .el-upload__text {
      position: relative;
      font-size: 18px;
    }
  }
}
</style>
