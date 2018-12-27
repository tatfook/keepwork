<template>
  <div>
    <div class="gallery-type">
      <el-select @change='handleChange' size='mini' :placeholder="$t('editor.newWindowOpen')">
        <el-option v-for="targetType in linkTargets" :key='targetType.value' :label='targetType.label' :value='targetType.value'></el-option>
      </el-select>
      <div>
        <span>高度：</span>
        <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
      </div>

      <el-button @click='handleAdd' class="gallery-type-add-btn" icon="el-icon-plus">{{$t('common.add')}}</el-button>
      <div v-for='(item, index) in galleryData' class="gallery-type-item" :key='index' :item="item" @change="handleChange()">

        <div v-if="!item.type || item.type === 'images'">
          <div class="gallery-type-item-img" :style="getImage(item)">
            <div class="gallery-type-item-img-cover">
              <span>
                <el-button class="gallery-type-change-img-btn" size="mini" round @click="handleUpdateImg(index)">{{$t('common.change')}}</el-button>
                <el-button class="gallery-type-remove-img-btn iconfont icon-delete" size="mini" round @click="handleImgRemove(index)" :disabled="isDisabled"></el-button>
              </span>
            </div>
          </div>
          <el-input :placeholder="$t('editor.pleaseInput')" v-model="item.link" class="input-with-select">
            <el-button v-if="item.link" slot="prepend" icon="iconfont icon-link_"></el-button>
            <el-button v-if="!item.link" slot="prepend">{{$t('common.link')}}</el-button>
            <el-select v-model="item.link" @change='handleChange' slot="append" placeholder="Select">
              <el-option v-for="(path, pathIndex) in personalAllPagePathList" :key="pathIndex" :value="getLocationUrl(path)">
                {{ path }}
              </el-option>
            </el-select>
          </el-input>
          <el-select v-model="item.target" @change='handleChange' class="select-targetType" size='mini' :placeholder="$t('editor.newWindowOpen')">
            <el-option v-for="targetType in linkTargets" :key='targetType.value' :label='targetType.label' :value='targetType.value'></el-option>
          </el-select>
        </div>

        <div v-if="item.type === 'videos'">
          <div class="gallery-type-item-img">
            <video :src="item.video" :play="true" :autoplay="item.autoplay" :loop="item.playloop" muted="muted"></video>
            <div class="gallery-type-item-img-play" v-if='!item.autoplay && isPlayIconShow'>
              <el-button circle size="mini">
                <i class='gallery-type-item-img-play-icon el-icon-caret-right'></i>
              </el-button>
            </div>
            <div class="gallery-type-item-img-cover">
              <span>
                <el-button class="gallery-type-play-img-btn el-icon-caret-right" size="mini" round @click="handlePlay(index)"></el-button>
                <el-button class="gallery-type-change-img-btn" size="mini" round @click="handleUpdateVideo(index)">{{$t('common.change')}}</el-button>
                <el-button class="gallery-type-remove-img-btn iconfont icon-delete" size="mini" round @click="handleVideoRemove(index)" :disabled="isDisabled"></el-button>
              </span>
            </div>
          </div>
          <div class="video-cover">
            <el-button v-if="!item.poster" @click='handleChangeCover(index)' plain>{{$t('editor.addVideoCover')}}</el-button>
            <div class="gallery-type-item-img" v-if="item.poster" :style="{backgroundImage: 'url(' + item.poster + ')'}">
              <div class="gallery-type-item-img-cover">
                <span>
                  <el-button class="gallery-type-change-img-btn" size="mini" round @click="handleChangeCover(index)">{{$t('common.change')}}</el-button>
                  <el-button class="gallery-type-remove-img-btn iconfont icon-delete" size="mini" circle @click="removeCover(index)"></el-button>
                </span>
              </div>
            </div>
          </div>
          <div class="video-settings">
            <el-checkbox v-model="item.autoplay">{{$t('field.autoplay')}}</el-checkbox>
            <el-checkbox v-model="item.playloop">{{$t('field.playloop')}}</el-checkbox>
          </div>
        </div>

      </div>
    </div>
    <sky-drive-manager-dialog :mediaLibrary='true' :isVideoTabShow='!isVideoTabHide' :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
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
      openType: "image",
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
      num1: 1,
      value: ''
    }
  },
  async mounted() {
    await this.getAllPersonalPageList()
  },
  computed: {
    ...mapGetters({
      personalAllPagePathList: 'user/personalAllPagePathList'
    }),
    galleryData: {
      get() {
        if (Array.isArray(this.originValue) && this.originValue.length) {
          return this.originValue
        } else {
          if (this.optionsData && this.optionsData.emptyGallery) {

            this.handleAdd()

            return [
              {
                img: this.optionsData.emptyGallery.img || '',
                link: this.optionsData.emptyGallery.link || '',
                target: this.optionsData.emptyGallery.target || '',
                autoplay: this.optionsData.emptyGallery.autoplay || false,
                playloop: this.optionsData.emptyGallery.playloop || false,
                poster: this.optionsData.emptyGallery.poster || ''
              }
            ]
          } else {
            return []
          }
        }
      },
      set() {
      }
    },
    isDisabled() {
      if(this.galleryData.length <= 1) {
        return true
      }else {
        return false
      }
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalPageList: 'user/getAllPersonalPageList'
    }),
    handleChange(value) {
      console.log(value);
    },
    handleChange() {
      let tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = this.originValue
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    handleAdd() {
      this.originValue.push({
        img: '',
        link: '',
        target: '',
        autoplay: false,
        playloop: false,
        poster: ''
      })

      this.handleChange()
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

      this.galleryData.splice(index, 1)
      this.handleChange()
    },
    async handleVideoRemove(index) {
      await this.$confirm(this.$t('editor.removeVideoConfirmMsg'), '', {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })

      this.galleryData.splice(index, 1)
      this.handleChange()
    },
    async removeCover(index) {
      await this.$confirm(this.$t('editor.deleteVideoCoverConfirmMsg'), '', {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })
      this.galleryData[index].poster = ''
    },
    handleUpdateImg(index) {
      this.selectedIndex = index
      this.openType = "image"
      this.isVideoTabHide = false
      this.openSkyDriveManagerDialog()
    },
    handleUpdateVideo(index) {
      this.selectedIndex = index
      this.openType = "video"
      this.isVideoTabHide = false
      this.openSkyDriveManagerDialog()
    },
    handleChangeCover(index) {
      this.selectedIndex = index
      this.openType = "cover"
      this.isVideoTabHide = true
      this.openSkyDriveManagerDialog()
    },
    openSkyDriveManagerDialog() {
      this.isSkyDriveManagerDialogShow = true
    },
    closeSkyDriveManagerDialog(payload) {
      if (!payload) return

      let { file, url } = payload

      this.isSkyDriveManagerDialogShow = false
      let item = this.originValue[this.selectedIndex]
      if (!file || !url || !item) return

      switch(this.openType) {
        case "image":
          if (file.type === 'images') {
            item.img = url
          }
          if (file.type === 'videos') {
            item.type = file.type
            item.video = url
            item.img = ""
            item.poster = ""
          }
          break
        case "video":
          if (file.type === 'images') {
            item.type = file.type
            item.img = url
            item.video = ""
            item.poster = ""
          }
          if (file.type === 'videos') {
            item.video = url
          }
          break
        case "cover":
          item.poster = url
          break
      }

      this.handleChange()
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
        color:#747474;
      }
    }
    &:hover, &.selected {
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
