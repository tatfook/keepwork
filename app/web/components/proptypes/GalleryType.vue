<template>
  <div>
    <div class="gallery-type">
      <el-button
        @click="handleAdd"
        class="gallery-type-add-btn"
        icon="el-icon-plus"
      >{{$t('common.add')}}</el-button>
      <div v-for="(item, index) in originValue" class="gallery-type-item" :key="index" :item="item">
        <div
          v-if="!item.type || item.type === 'images'"
          class="gallery-type-item-img"
          :style="getImage(item)"
        >
          <div class="gallery-type-item-img-cover">
            <span>
              <el-button
                class="gallery-type-change-img-btn"
                size="mini"
                round
                @click="handleUpdateImg(index)"
              >{{$t('common.change')}}</el-button>
              <el-button
                class="gallery-type-remove-img-btn iconfont icon-delete"
                size="mini"
                round
                @click="handleImgRemove(index)"
                :disabled="isDisabled"
              ></el-button>
            </span>
          </div>
        </div>

        <div v-if="item.type === 'videos'" class="gallery-type-item-img">
          <video :src="item.video" muted="muted"></video>
          <div class="gallery-type-item-img-play" v-if="isPlayIconShow">
            <el-button circle size="mini">
              <i class="gallery-type-item-img-play-icon el-icon-caret-right"></i>
            </el-button>
          </div>
          <div class="gallery-type-item-img-cover">
            <span>
              <el-button
                class="gallery-type-play-img-btn el-icon-caret-right"
                size="mini"
                round
                @click="handlePlay(index)"
              ></el-button>
              <el-button
                class="gallery-type-change-img-btn"
                size="mini"
                round
                @click="handleUpdateVideo(index)"
              >{{$t('common.change')}}</el-button>
              <el-button
                class="gallery-type-remove-img-btn iconfont icon-delete"
                size="mini"
                round
                @click="handleVideoRemove(index)"
                :disabled="isDisabled"
              ></el-button>
            </span>
          </div>
        </div>

        <div v-if="item.type === 'videos'" class="video-cover">
          <el-button
            v-if="!item.poster"
            @click="handleChangeCover(index)"
            plain
          >{{$t('editor.addVideoCover')}}</el-button>
          <div
            class="gallery-type-item-img"
            v-if="item.poster"
            :style="{backgroundImage: 'url(' + item.poster + ')'}"
          >
            <div class="gallery-type-item-img-cover">
              <span>
                <el-button
                  class="gallery-type-change-img-btn"
                  size="mini"
                  round
                  @click="handleChangeCover(index)"
                >{{$t('common.change')}}</el-button>
                <el-button
                  class="gallery-type-remove-img-btn iconfont icon-delete"
                  size="mini"
                  circle
                  @click="removeCover(item)"
                ></el-button>
              </span>
            </div>
          </div>
        </div>

        <div v-if="item.type === 'videos'" class="video-settings">
          <el-checkbox v-model="item.autoplay">{{$t('field.autoplay')}}</el-checkbox>
          <el-checkbox v-model="item.playloop">{{$t('field.playloop')}}</el-checkbox>
        </div>

        <el-input
          v-if="!item.type || item.type === 'images'"
          :placeholder="$t('editor.pleaseInput')"
          v-model="item.link"
          class="input-with-select"
        >
          <el-button v-if="item.link" slot="prepend" icon="iconfont icon-link_"></el-button>
          <el-button v-if="!item.link" slot="prepend">{{$t('common.link')}}</el-button>
          <el-select v-model="item.link" slot="append" placeholder="Select">
            <el-option
              v-for="(path, pathIndex) in personalAllPagePathList"
              :key="pathIndex"
              :value="getLocationUrl(path)"
            >{{ path }}</el-option>
          </el-select>
        </el-input>

        <el-select
          v-if="!item.type || item.type === 'images'"
          v-model="item.target"
          class="select-targetType"
          size="mini"
          :placeholder="$t('editor.newWindowOpen')"
        >
          <el-option
            v-for="targetType in linkTargets"
            :key="targetType.value"
            :label="targetType.label"
            :value="targetType.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <sky-drive-manager-dialog
      :isApplicable="true"
      :isNoMediaFileShow="false"
      :isVideoShow="!isVideoTabHide"
      :show="isSkyDriveManagerDialogShow"
      @close="closeSkyDriveManagerDialog"
    ></sky-drive-manager-dialog>
  </div>
</template>
<script>
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'GalleryType',
  props: {
    editingKey: String,
    originValue: Array,
    optionsData: Object
  },
  data() {
    let self = this
    return {
      selectedIndex: 0,
      openType: 'image',
      isSkyDriveManagerDialogShow: false,
      isPlayIconShow: true,
      isVideoTabHide: false,
      linkTargets: [
        {
          label: self.$t('editor.selfWindowOpen'),
          value: '_self'
        },
        {
          label: self.$t('editor.newWindowOpen'),
          value: '_blank'
        }
      ],
      value: ''
    }
  },
  async mounted() {
    if (
      Array.isArray(this.originValue) &&
      this.originValue.length === 0 &&
      this.optionsData
    ) {
      this.handleAdd()
    }

    this.getAllPersonalPageList()
  },
  watch: {
    originValue: {
      handler(newData, oldData) {
        this.$emit('onPropertyChange', { [this.editingKey]: newData })
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
      personalAllPagePathList: 'user/personalAllPagePathList'
    }),
    isDisabled() {
      if (this.originValue.length <= 1) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalPageList: 'user/getAllPersonalPageList'
    }),
    handleAdd() {
      this.originValue.push({
        img: '',
        link: '',
        target: '',
        autoplay: true,
        playloop: false,
        poster: '',
        type: 'images',
        video: ''
      })
    },
    handlePlay() {
      let video = this.$el.querySelector('video')

      if (video) {
        video.play()
      }
      this.isPlayIconShow = false
    },
    getImage(item) {
      let img = ''

      if (item && item.img) {
        img = item.img
      } else {
        if (this.optionsData && this.optionsData.emptyGallery)
          img = this.optionsData.emptyGallery.img || ''
      }

      return { backgroundImage: 'url(' + img + ')' }
    },
    async handleImgRemove(index) {
      await this.$confirm(this.$t('editor.removeImgConfirmMsg'), '', {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })

      this.originValue.splice(index, 1)
    },
    async handleVideoRemove(index) {
      await this.$confirm(this.$t('editor.removeVideoConfirmMsg'), '', {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })

      this.originValue.splice(index, 1)
    },
    async removeCover(item) {
      await this.$confirm(this.$t('editor.deleteVideoCoverConfirmMsg'), '', {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })
      item.poster = ''
      item.autoplay = true
    },
    handleUpdateImg(index) {
      this.selectedIndex = index
      this.openType = 'image'
      this.isVideoTabHide = false
      this.openSkyDriveManagerDialog()
    },
    handleUpdateVideo(index) {
      this.selectedIndex = index
      this.openType = 'video'
      this.isVideoTabHide = false
      this.openSkyDriveManagerDialog()
    },
    handleChangeCover(index) {
      this.selectedIndex = index
      this.openType = 'cover'
      this.isVideoTabHide = true
      this.openSkyDriveManagerDialog()
    },
    openSkyDriveManagerDialog() {
      this.isSkyDriveManagerDialogShow = true
    },
    closeSkyDriveManagerDialog(payload) {
      this.isSkyDriveManagerDialogShow = false

      if (!payload) return

      const { file, url } = payload
      const item = this.originValue[this.selectedIndex]

      if (!file || !url || !item) return

      switch (this.openType) {
        case 'image':
          if (file.type === 'images') {
            item.img = url
          }
          if (file.type === 'videos') {
            item.type = file.type
            item.video = url
            item.img = ''
            item.poster = ''
            item.autoplay = true
          }
          break
        case 'video':
          if (file.type === 'images') {
            item.type = file.type
            item.img = url
            item.video = ''
            item.poster = ''
          }
          if (file.type === 'videos') {
            item.video = url
            item.autoplay = true
          }
          break
        case 'cover':
          item.poster = url
          item.autoplay = false
          break
      }
    },
    getLocationUrl(url) {
      return url ? location.origin + '/' + url : ''
    }
  },
  components: {
    SkyDriveManagerDialog
  }
}
</script>
<style lang="scss">
.gallery-type {
  .el-button {
    border: none;
  }
  &-add-btn {
    padding: 0;
    margin: 16px 0;
    font-size: 16px !important;
    .el-icon-plus {
      background: #e9f5ff;
      color: #a6b3c0;
    }
    &:hover,
    &:focus,
    &:active {
      background: none;
      .el-icon-plus {
        background: #1b81f3;
        color: white;
      }
    }
  }
  &-play-img-btn {
    padding: 2px !important;
    font-size: 22px !important;
  }
  &-change-img-btn {
    padding: 6px 12px !important;
    font-size: 14px !important;
  }
  &-remove-img-btn {
    padding: 6px !important;
    font-size: 14px !important;
  }
  .el-input-group__prepend {
    padding: 0;
    .el-button--default {
      padding: 0;
      margin: 0;
    }
  }
  .input-with-select {
    border-bottom: 1px solid #e4e7ed;
    > .el-input-group__prepend,
    > .el-input__inner,
    > .el-input-group__append {
      border: none;
      background: none;
    }
    > .el-input__inner {
      padding: 0 0 0 5px;
    }
    > .el-input-group__append {
      padding-left: 12px;
    }
  }
  &-item {
    margin-bottom: 20px;
    + .gallery-type-item {
      margin-top: 35px;
    }

    .video-cover {
      margin-top: 15px;
      .el-button {
        padding: 0 !important;
      }
      .gallery-type-item-img {
        .gallery-type-change-img-btn {
          padding: 6px 12px !important;
          font-size: 14px !important;
        }
        .gallery-type-remove-img-btn {
          padding: 6px !important;
          font-size: 14px !important;
        }
      }
    }

    .video-settings {
      margin-top: 15px;

      label {
        display: block;
        margin-left: 0px;
      }
    }
    .select-targetType {
      margin-top: 11px;
      width: auto;

      .el-input__inner {
        color: #909399;
      }
    }
  }
  &-item-img {
    height: 150px;
    background-color: lightgray;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    position: relative;

    video {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    &-play {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-button {
        padding: 2px !important;
      }
      &-icon {
        font-size: 40px;
        color: #747474;
      }
    }
    &:hover,
    &.selected {
      .gallery-type-item-img-play {
        display: none;
      }
    }

    &-cover {
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      position: absolute;
      top: 0;
      span {
        display: flex;
        align-items: center;
      }
    }

    &:hover {
      .gallery-type-item-img-cover {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
