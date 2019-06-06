<template>
  <div class="media-type" v-loading='loading'>
    <div class="media-type-media-library">
      <div v-for="(file, index) in uploadingFiles" :key="index" class="media-type-media-uploading media-type-media-item" v-show="file.state !== 'success' && file.state != 'error'">
        <img v-if="file.type === 'images'" :src="file.cover" class="media-type-media-item-img" />
        <div class="media-type-media-uploading-cover"></div>
        <span :title="$t('common.Cancel')" class='el-icon-delete' @click.stop="removeFromUploadQue(file)"></span>
        <el-progress :show-text=false :stroke-width="10" :percentage="file.percent" status="success"></el-progress>
      </div>
      <div v-for='mediaItem in sortedSkyDriveMediaLibraryData' :key='mediaItem.key' class='media-type-media-item' @click='handleSelectMediaItem(mediaItem)'>
        <video v-if="mediaItem.type==='videos'" :src="mediaItem.downloadUrl" width="100%" height="100%"></video>
        <img v-if="mediaItem.type==='images'" v-lazy="mediaItem.downloadUrl + qiniuImgThumbnail" class="media-type-media-item-img" />
        <div class='media-type-media-item-cover'>
          <el-checkbox v-model="mediaItem.isChecked"></el-checkbox>
          <div class="media-type-media-item-operations">
            <i v-if="mediaItem.type==='videos'" class='media-type-media-item-play' @click.stop="handlePlay(mediaItem)"></i>
            <file-downloader title="下载" :isTextShow="false" :selectedFiles="[mediaItem]"></file-downloader>
            <file-deleter title="删除" :isTextShow="false" :selectedFiles="[mediaItem]"></file-deleter>
          </div>
        </div>
      </div>
      <div v-if="!sortedSkyDriveMediaLibraryData.length && !uploadingFiles.length" class="media-type-media-library-placeholder">
        <img src="@/assets/img/media_library_empty.png">
        <span class="media-type-media-library-placeholder-tip">{{ $t('skydrive.nothingHere') }}</span>
        <label v-if="mediaFilterType === 'image'" class="el-button media-type-upload-btn el-button--primary el-button--small is-round">
          <span>{{ $t('skydrive.uploadImage') }}</span>
          <input ref="centerVideoInput" type="file" accept=".jpg,.jpeg,.png,.gif,.bmp" style="display:none;" multiple @change="handleUploadFile">
        </label>
        <label v-if="mediaFilterType === 'video'" class="el-button media-type-upload-btn el-button--primary el-button--small is-round">
          <span>{{ $t('skydrive.uploadVideo') }}</span>
          <input ref="centerVideoInput" type="file" accept=".mp4,.avi,.wmv,.mkv,.amv,.m4v,.webm" style="display:none;" multiple @change="handleUploadFile">
        </label>
      </div>
    </div>
    <el-row class="media-type-footer">
      <el-col :span="6" :offset="18">
        <el-button size="small" :type="availableSelectedMediaItem ? 'primary':''" :disabled='!availableSelectedMediaItem' round @click="handleInsert(availableSelectedMediaItem)">{{ $t('common.apply') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import FileDeleter from './FileDeleter'
import FileDownloader from './FileDownloader'
export default {
  name: 'mediaType',
  props: {
    mediaFilterType: String,
    uploadingFiles: Array,
    skyDriveMediaLibraryData: Array,
    isImageTabShow: Boolean,
    isVideoTabShow: Boolean
  },
  mounted() {
    this.keyupSubmit()
  },
  data() {
    return {
      selectedMediaItem: null,
      searchWord: '',
      loading: false,
      qiniuImgThumbnail: '&imageView2/2/w/100'
    }
  },
  computed: {
    sortedSkyDriveMediaLibraryData() {
      return _.sortBy(
        this.skyDriveMediaLibraryData,
        mediaItem => -moment(mediaItem.updatedAt).valueOf()
      )
    },
    availableSelectedMediaItem() {
      let item = this.itemFilterBySearchWord(this.selectedMediaItem)
        ? this.selectedMediaItem
        : null
      return item && item.checkPassed ? item : null
    }
  },
  methods: {
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
    handleSelectMediaItem(mediaItem) {
      this.selectedMediaItem = mediaItem
    },
    itemFilterBySearchWord(item) {
      if (!item) return false
      let { filename } = item
      let searchWord = this.searchWord && this.searchWord.trim().toLowerCase()
      if (!searchWord) return true
      let filenameLowerCase = (filename || '').toLowerCase()
      return filenameLowerCase.indexOf(searchWord) >= 0
    },
    async handleInsert(file) {
      if (!file.checkPassed) {
        return
      }
      this.$emit('insert', { file })
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
      this.$emit('removeFromUploadQue', file)
    }
  },
  filters: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  destroyed() {
    document.onkeydown = null
  },
  components: {
    FileDownloader,
    FileDeleter
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
    display: inline-block;
    background-color: #d1d1d1;
    position: relative;
    vertical-align: middle;
    [class*='icon'] {
      cursor: pointer;
    }
    &.selected {
      border: 2px solid #3ba4ff;
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
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .el-checkbox {
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
      right: 0;
      color: #fff;
      display: flex;
      justify-content: flex-end;
      bottom: 8px;
    }
    &-play {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid #90908b;
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
        border-color: transparent transparent transparent #90908b;
      }
    }
    .el-progress {
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      line-height: 100px;
    }
    .el-progress-bar {
      display: inline-block;
    }
    &:hover,
    &.selected {
      .media-type-media-item-cover {
        background: rgba(0, 0, 0, 0.4);
        display: inline-block;
      }
      .el-icon-delete {
        display: block;
      }
      .media-type-media-item-play {
        border: 1px solid white;
        width: 11px;
        height: 11px;
        top: 31.4px;
        right: 32px;
        &:after {
          content: '';
          display: block;
          position: relative;
          left: 1.7px;
          top: 0.4px;
          box-sizing: border-box;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 4.5px 0px 4.5px 5.5px;
          border-color: transparent transparent transparent white;
        }
      }
      .media-type-media-item-play:hover {
        border: 1px solid #3ba4ff;
        width: 11px;
        height: 11px;
        &:after {
          border-color: transparent transparent transparent #3ba4ff;
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
  }
  &-footer {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
