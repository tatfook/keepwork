<template>
  <div class="media-type" v-loading='loading'>
    <div class="media-type-header">
      <el-row class='media-type-header-usage-and-upload'>
        <el-col :span="14">
          <div>
            {{ $t('skydrive.usage') }}
            <span class="media-type-total">
              <span class="media-type-total-used" :class="usedProcessBarClass" :style="{ width: info.usedPercent + '%' }"></span>
            </span>
            {{ info.used | biteToG }}GB / {{ info.total | biteToG }}GB
          </div>
        </el-col>
        <el-col :span="10" class="media-type-upload">
          {{ $t('skydrive.dragAndDrop') }}
          <label class="el-button media-type-upload-btn el-button--primary el-button--small is-round">
            <span>{{ $t('skydrive.uploadFile') }}</span>
            <input ref="mediaInput" type="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.mp4,.avi,.wmv,.mkv,.amv,.m4v,.webm" multiple style="display:none;" @change="handleUploadFile">
          </label>
        </el-col>
      </el-row>
      <el-row class='media-type-header-tabs-and-search'>
        <el-col :span="18" class='media-type-header-tabs'>
          <div>
            <span :class="{'active': mediaFilterType==='image'}" @click.stop="changeMediaFilterType('image')">{{ $t('skydrive.image') }}</span>
            <span v-if="isVideoAvailable" :class="{'active': mediaFilterType==='video'}" @click.stop="changeMediaFilterType('video')">{{ $t('skydrive.video') }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <el-input :placeholder="$t('common.search')" size="mini" v-model="searchWord">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="media-type-media-library">
      <div v-for="(file, index) in uploadingFiles" :key="index" class="media-type-media-uploading media-type-media-item" v-show="file.state !== 'success' && file.state != 'error'">
        <img v-if="file.type === 'images'" :src="file.cover" class="media-type-media-item-img" />
        <div class="media-type-media-uploading-cover"></div>
        <span :title="$t('common.remove')" class='el-icon-delete' @click.stop="removeFromUploadQue(file)"></span>
        <el-progress :show-text=false :stroke-width="10" :percentage="file.percent" status="success"></el-progress>
      </div>
      <div v-for='mediaItem in sortedSkyDriveMediaLibraryData' :key='mediaItem.key' class='media-type-media-item' :class='{selected: selectedMediaItem === mediaItem}' @click='handleSelectMediaItem(mediaItem)'>
        <video v-if="mediaItem.type==='videos'" :src="mediaItem.downloadUrl" width="100%" height="100%"></video>
        <img v-if="mediaItem.type==='images'" :src="mediaItem.downloadUrl" class="media-type-media-item-img" />
        <div class='media-type-media-item-cover'>
          <!-- <span v-if='!mediaItem.checkPassed' :title='mediaItem.checkedState'>{{ mediaItem.filename }}</span> -->
          <i v-if="mediaItem.type==='videos'" class='media-type-media-item-play' @click.stop="handlePlay(mediaItem)"></i>
        </div>
        <span :title="$t('common.remove')" class='el-icon-delete' @click.stop="handleRemove(mediaItem)"></span>
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
export default {
  name: 'mediaType',
  props: {
    info: {
      type: Object,
      required: true
    },
    uploadingFiles: Array,
    skyDriveMediaLibraryData: Array,
    isVideoTabShow: {
      type: Boolean,
      default: false
    }
  },
  mounted(){
    this.keyupSubmit()
  },
  data() {
    return {
      mediaFilterType: 'image',
      selectedMediaItem: null,
      searchWord: '',
      loading: false
    }
  },
  computed: {
    sortedSkyDriveMediaLibraryData() {
      return _.sortBy(this.skyDriveMediaLibraryData, mediaItem => -moment(mediaItem.updatedAt).valueOf())
    },
    usedProcessBarClass() {
      let { usedPercent } = this.info
      return usedPercent >= 90
        ? 'table-type-total-used-danger'
        : usedPercent >= 70
          ? 'table-type-total-used-warning'
          : ''
    },
    isVideoAvailable() {
      return this.isVideoTabShow
    },
    availableSelectedMediaItem() {
      let item = this.itemFilterBySearchWord(this.selectedMediaItem)
        ? this.selectedMediaItem
        : null
      return item && item.checkPassed ? item : null
    }
  },
  methods: {
    keyupSubmit(){
      document.onkeydown = e => {
        let _key = window.event.keyCode
        if(_key === 13){
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
    handleRemove(file) {
      this.$emit('remove', file)
    },
    async handleInsert(file) {
      if (!file.checkPassed) {
        return
      }
      this.$emit('insert', { file })
    },
    changeMediaFilterType(type) {
      this.mediaFilterType = type
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
    }
  },
  filters: {
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    biteToG: (bite = 0) =>
      (bite / (1024 * 1024 * 1024))
        .toFixed(2)
        .toString()
        .replace(/\.*0*$/, '')
  },
  destroyed(){
    document.onkeydown = null
  }
}
</script>
<style lang="scss">
.media-type {
  &-header {
    margin-bottom: 20px;
    margin: -30px -35px 20px -35px;
    padding: 20px 35px 0 35px;
    background: #e8e8e8;
    &-usage-and-upload {
      margin-bottom: 20px;
      .media-type-upload {
        position: relative;
        top: -10px;
      }
    }
    &-tabs-and-search {
      .media-type-header-tabs {
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
  &-total {
    display: inline-block;
    margin: 0 15px 0 5px;
    width: 190px;
    height: 10px;
    border-radius: 5px;
    background: #f5f5f5;
    &-used {
      display: block;
      height: 100%;
      border-radius: 5px;
      background: #3ba4ff;
      &-danger {
        background-color: #ff1e02;
      }
      &-warning {
        background-color: #f97b00;
      }
    }
  }
  &-upload {
    text-align: right;
    &-btn {
      margin-left: 15px;
    }
  }
  &-media-library {
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
    [class*="icon"] {
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
        font-size: 0.7em;
        line-height: 1.2em;
        word-break: break-all;
      }
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
        content: "";
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
    .el-icon-delete {
      color: white;
      display: none;
      position: absolute;
      right: 7px;
      bottom: 10px;
    }
    .el-icon-delete:hover {
      color: #3ba4ff;
    }
    &:hover,
    &.selected {
      .media-type-media-item-cover {
        background: rgba(0, 0, 0, 0.4);
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
          content: "";
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
