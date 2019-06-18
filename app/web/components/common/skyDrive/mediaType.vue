<template>
  <div class="media-type" v-loading='loading'>
    <div class="media-type-media-library">
      <div v-for='(mediaItem, index) in sortedSkyDriveMediaLibraryData' :key='mediaItem.key || index' class='media-type-media-item'>
        <div class="media-type-media-item-main" v-if="mediaItem.key">
          <video v-if="mediaItem.type==='videos'" :src="mediaItem.downloadUrl" width="100%" height="100%"></video>
          <img v-else-if="mediaItem.type==='images'" v-lazy="mediaItem.downloadUrl + qiniuImgThumbnail" class="media-type-media-item-img" />
          <span v-else class="media-type-media-item-ext-cover iconfont" :class="getExtClass(mediaItem)"></span>
          <div class='media-type-media-item-cover' :class="{'media-type-media-item-cover-checked': mediaItem.isChecked}">
            <el-checkbox v-model="mediaItem.isChecked" @change="handleItemSelectChange(mediaItem)"></el-checkbox>
            <div v-if="mediaItem.type==='videos'" class='media-type-media-item-play' @click.stop="handlePlay(mediaItem)">
              <i class="el-icon-caret-right"></i>
            </div>
            <div class="media-type-media-item-operations">
              <el-tooltip content="复制链接">
                <file-url-getter :isDisabled="!mediaItem.checkPassed" :selectFile="mediaItem" operateType="copy"></file-url-getter>
              </el-tooltip>
              <el-tooltip content="插入">
                <file-url-getter v-if="isInsertable" :selectFile="mediaItem" operateType="insert" @close="handleClose"></file-url-getter>
              </el-tooltip>
              <el-tooltip content="下载">
                <file-downloader :isTextShow="false" :selectedFiles="[mediaItem]"></file-downloader>
              </el-tooltip>
              <el-tooltip content="重命名">
                <file-renamer :isTextShow="false" :selectFile="mediaItem"></file-renamer>
              </el-tooltip>
              <el-tooltip content="删除">
                <file-deleter :isTextShow="false" :selectedFiles="[mediaItem]"></file-deleter>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="media-type-media-item-main" v-else>
          <video v-if="mediaItem.type==='videos'" :src="mediaItem.cover" width="100%" height="100%"></video>
          <img v-else-if="mediaItem.type==='images'" v-lazy="mediaItem.cover" class="media-type-media-item-img" />
          <span v-else class="media-type-media-item-ext-cover iconfont" :class="getExtClass(mediaItem)"></span>
          <div class="media-type-media-item-cover media-type-media-item-cover-checked">
            <el-progress :show-text=false :stroke-width="10" :percentage="mediaItem.percent" status="success"></el-progress>
            <div class="media-type-media-item-operations">
              <span :title="$t('common.Cancel')" class='el-icon-delete' @click.stop="removeFromUploadQue(mediaItem)"></span>
            </div>
          </div>
        </div>
        <div class="media-type-media-item-name" :title="mediaItem.filename">{{mediaItem.filename}}</div>
      </div>
      <file-list-empty v-if="!sortedSkyDriveMediaLibraryData.length && !uploadingFiles.length" :uploadText="uploadText" viewType="thumb" :uploadType="mediaFilterType"></file-list-empty>
    </div>
    <el-row class="media-type-footer" v-if="isApplicable">
      <file-url-getter class="media-type-footer-button" :isDisabled="!isHaveSelected" :selectFile="approvedMultipleSelectionResults[0] || {}" :isApplyButtonType="true" operateType="insert" @close="handleClose"></file-url-getter>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import FileDeleter from './FileDeleter'
import FileDownloader from './FileDownloader'
import FileRenamer from './FileRenamer'
import FileUrlGetter from './FileUrlGetter'
import FileListEmpty from './FileListEmpty'
const ExtIcons = {
  txt: 'icon-txt1',
  mp4: 'icon-mp4-1',
  mp3: 'icon-mp3-1',
  rar: 'icon-rar1',
  gif: 'icon-gif1',
  ppt: 'icon-ppt',
  png: 'icon-PNG',
  html: 'icon-html',
  pdf: 'icon-pdf1',
  xls: 'icon-excel',
  xlsx: 'icon-excel',
  jpg: 'icon-jpg',
  psd: 'icon-PSD',
  svg: 'icon-SVG',
  zip: 'icon-zip',
  ts: 'icon-ts',
  less: 'icon-less',
  jsx: 'icon-jsx',
  js: 'icon-js',
  css: 'icon-css',
  sketch: 'icon-sketch',
  exe: 'icon-exe',
  xmind: 'icon-xmind',
  svga: 'icon-SVGA',
  md: 'icon-markdown',
  json: 'icon-json',
  doc: 'icon-word',
  docx: 'icon-word',
  sql: 'icon-sql'
}
export default {
  name: 'mediaType',
  props: {
    mediaFilterType: String,
    uploadingFiles: Array,
    fileListFilteredSearched: Array,
    isInsertable: Boolean,
    isApplicable: Boolean,
    uploadText: String
  },
  mounted() {
    this.fileList = _.cloneDeep(this.fileListFilteredSearched)
    this.keyupSubmit()
  },
  data() {
    return {
      fileList: [],
      selectedMediaItem: null,
      loading: false,
      qiniuImgThumbnail: '&imageView2/2/w/100'
    }
  },
  computed: {
    filterdUploadingFiles() {
      return _.filter(this.uploadingFiles, file => {
        return file.state !== 'success' && file.state != 'error'
      })
    },
    sortedSkyDriveMediaLibraryData() {
      return _.concat(
        this.filterdUploadingFiles,
        _.sortBy(
          this.fileList,
          mediaItem => -moment(mediaItem.updatedAt).valueOf()
        )
      )
    },
    approvedMultipleSelectionResults() {
      return (
        this.sortedSkyDriveMediaLibraryData.filter(
          ({ isChecked }) => Number(isChecked) === 1
        ) || []
      )
    },
    isAllSelected() {
      let selectedCount = this.approvedMultipleSelectionResults.length
      return (
        selectedCount > 0 &&
        selectedCount == this.sortedSkyDriveMediaLibraryData.length
      )
    },
    isHaveSelected() {
      return this.approvedMultipleSelectionResults.length > 0
    }
  },
  methods: {
    ...mapActions({
      skydriveRemoveFromUploadQue: 'skydrive/removeFromUploadQue'
    }),
    selectAll() {
      let selected = this.isAllSelected ? false : true
      this.fileList = _.map(this.fileList, mediaItem => {
        return {
          ...mediaItem,
          isChecked: selected
        }
      })
    },
    handleItemSelectChange(file) {
      if (
        this.isApplicable &&
        file.isChecked &&
        this.approvedMultipleSelectionResults.length > 1
      ) {
        this.fileList = _.map(this.fileList, mediaItem => {
          return {
            ...mediaItem,
            isChecked: mediaItem.filename == file.filename ? true : false
          }
        })
      }
    },
    getExtClass(file) {
      let { ext } = file
      return ExtIcons[ext] || 'icon-ukown_file'
    },
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode
        if (_key === 13) {
          this.handleInsert(this.availableSelectedMediaItem)
        }
      }
    },
    handleUploadFile(e) {
      this.$emit('uploadFile', e)
      this.$refs.fileInput && (this.$refs.fileInput.value = '')
    },
    handleClose({ file, url }) {
      this.$emit('close', { file, url })
    },
    handlePlay(mediaItem) {
      let mediaItemVideoPreviewId = `mediaItemVideoPreview_${Date.now()}`
      this.$alert(
        `<div>
          <style>.el-message-box__wrapper{background: black;}</style>
          <video id="${mediaItemVideoPreviewId}" src="${
          mediaItem.downloadUrl
        }" controls></video>
        </div>`,
        {
          customClass: 'media-type-video-preview-dialog',
          showConfirmButton: false,
          dangerouslyUseHTMLString: true,
          beforeClose: (action, instance, done) => {
            let mediaItemVideoPreviewDom = document.querySelector(
              `#${mediaItemVideoPreviewId}`
            )
            mediaItemVideoPreviewDom && mediaItemVideoPreviewDom.pause()
            done()
          }
        }
      )
    },
    removeFromUploadQue(file) {
      let { filename, state } = file
      this.skydriveRemoveFromUploadQue({ filename, state })
    }
  },
  filters: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    fileListFilteredSearched() {
      this.fileList = _.cloneDeep(this.fileListFilteredSearched)
    },
    isAllSelected(val) {
      this.$emit('selectAllStateChange', val)
    }
  },
  destroyed() {
    document.onkeydown = null
  },
  components: {
    FileListEmpty,
    FileDownloader,
    FileDeleter,
    FileRenamer,
    FileUrlGetter
  }
}
</script>
<style lang="scss">
.media-type {
  &-media-library {
    padding: 0 36px;
    height: 500px;
    overflow-x: hidden;
    overflow-x: auto;
  }
  &-media-item {
    box-sizing: border-box;
    margin: 5px 10px 5px 0px;
    display: inline-block;
    width: 100px;
    &-main {
      width: 100px;
      height: 100px;
      background-color: #d1d1d1;
      position: relative;
      vertical-align: middle;
      text-align: center;
      line-height: 100px;
    }
    [class*='icon'] {
      cursor: pointer;
    }
    &-ext-cover {
      font-size: 50px;
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
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      &-checked {
        display: inline-block;
      }
      .el-checkbox {
        line-height: initial;
        position: absolute;
        top: 8px;
        left: 8px;
        margin: 0;
      }
      .el-checkbox__inner {
        width: 20px;
        height: 20px;
        background-color: transparent;
        border-color: #fff;
        border-radius: 50%;
        &::after {
          left: 7px;
          top: 4px;
          width: 4px;
          height: 8px;
        }
      }
    }
    &-operations {
      position: absolute;
      left: 0;
      right: 3px;
      color: #fff;
      display: flex;
      justify-content: flex-end;
      bottom: 8px;
      .iconfont {
        font-size: 13px;
        margin-right: 0;
      }
    }
    .el-button + .el-button {
      margin-left: 6px;
    }
    &-play {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      position: absolute;
      left: 34px;
      top: 34px;
      cursor: pointer;
      color: #fff;
      text-align: center;
      line-height: 32px;
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 20px;
    }
    .el-progress {
      position: absolute;
      top: 0;
      left: 4px;
      right: 4px;
      line-height: 100px;
    }
    .el-progress-bar {
      display: inline-block;
    }
    &:hover {
      .media-type-media-item-cover {
        display: inline-block;
      }
      .el-icon-delete {
        display: block;
      }
    }
    &-name {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 14px;
      font-size: 12px;
      padding: 8px 0;
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
  }
  &-footer {
    margin-top: 20px;
    text-align: right;
    padding: 0 36px 30px;
  }
}
</style>
<style lang="scss" scoped>
.icon-txt1 {
  color: rgb(186, 189, 194);
}
.icon-mp4-1 {
  color: rgb(98, 166, 245);
}
.icon-mp3-1 {
  color: rgb(245, 108, 73);
}
.icon-rar1 {
  color: rgb(159, 209, 59);
}
.icon-gif1 {
  color: rgb(210, 110, 219);
}
.icon-ppt {
  color: rgb(243, 115, 39);
}
.icon-PNG {
  color: rgb(60, 153, 216);
}
.icon-html {
  color: rgb(240, 70, 49);
}
.icon-pdf1 {
  color: rgb(238, 126, 113);
}
.icon-excel {
  color: rgb(102, 188, 92);
}
.icon-jpg {
  color: rgb(56, 173, 255);
}
.icon-PSD {
  color: rgb(60, 153, 216);
}
.icon-SVG {
  color: rgb(249, 189, 15);
}
.icon-zip {
  color: rgb(249, 189, 15);
}
.icon-ts {
  color: rgb(60, 153, 216);
}
.icon-less {
  color: rgb(42, 78, 138);
}
.icon-jsx {
  color: rgb(249, 189, 15);
}
.icon-js {
  color: rgb(249, 189, 15);
}
.icon-css {
  color: rgb(102, 188, 92);
}
.icon-sketch {
  color: rgb(249, 189, 15);
}
.icon-exe {
  color: rgb(119, 149, 198);
}
.icon-xmind {
  color: rgb(245, 90, 35);
}
.icon-SVGA {
  color: rgb(178, 193, 142);
}
.icon-markdown {
  color: rgb(72, 79, 89);
}
.icon-json {
  color: rgb(102, 188, 92);
}
.icon-word {
  color: rgb(77, 151, 255);
}
.icon-sql {
  color: #333;
}
.icon-ukown_file {
  color: rgb(86, 155, 255);
}
</style>
