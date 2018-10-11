<template>
  <div>
    <div class="gallery-type">
      <el-button @click='handleAdd' class="gallery-type-add-btn" icon="el-icon-plus">{{$t('common.add')}}</el-button>
      <div v-for='(item, index) in galleryData' class="gallery-type-item" :key='index' :item="item" @change="handleChange()">

        <div v-if="!item.type || item.type === 'images'" class="gallery-type-item-img" :style="getImage(item)">
          <div class="gallery-type-item-img-cover">
            <span>
              <el-button class="gallery-type-change-img-btn" size="mini" round @click="handleUpdateImg(index)">{{$t('common.change')}}</el-button>
              <el-button class="gallery-type-remove-img-btn iconfont icon-delete" size="mini" round @click="handleImgRemove(index)"></el-button>
            </span>
          </div>
        </div>

        <div v-if="item.type === 'videos'" class="gallery-type-item-img">
          <video :src="item.video" :play="true" :autoplay="item.autoplay" :loop="item.playloop" muted="true"></video>
          <div class="gallery-type-item-img-cover">
            <span>
              <el-button class="gallery-type-play-img-btn iconfont icon-video" size="mini" round @click="handlePlay(index)"></el-button>
              <el-button class="gallery-type-change-img-btn" size="mini" round @click="handleUpdateImg(index)">{{$t('common.change')}}</el-button>
              <el-button class="gallery-type-remove-img-btn iconfont icon-delete" size="mini" round @click="handleVideoRemove(index)"></el-button>
            </span>
          </div>
        </div>

        <div v-if="item.type === 'videos'" class="video-settings">
          <el-checkbox v-model="item.autoplay">{{$t('field.autoplay')}}</el-checkbox>
          <el-checkbox v-model="item.playloop">{{$t('field.playloop')}}</el-checkbox>
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
      </div>
    </div>
    <sky-drive-manager-dialog :mediaLibrary='true' :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
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
    return {
      selectedIndex: 0,
      isSkyDriveManagerDialogShow: false,
      autoplay: false,
      playloop: false
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
            return [
              {
                img: this.optionsData.emptyGallery.img || '',
                link: this.optionsData.emptyGallery.link || ''
              }
            ]
          } else {
            []
          }
        }
      },
      set() {
      }
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalPageList: 'user/getAllPersonalPageList'
    }),
    handleChange() {
      let tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = this.galleryData
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    handleAdd() {
      this.galleryData.push({
        img: '',
        link: ''
      })

      this.handleChange()
    },
    handlePlay() {
      let video = this.$el.querySelector('video')

      if (video) {
        video.play()
      }
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
    handleUpdateImg(index) {
      this.selectedIndex = index
      this.openSkyDriveManagerDialog()
    },
    openSkyDriveManagerDialog() {
      this.isSkyDriveManagerDialogShow = true
    },
    closeSkyDriveManagerDialog(payload) {
      if (!payload) return

      let { file, url } = payload

      this.isSkyDriveManagerDialogShow = false
      let item = this.galleryData[this.selectedIndex]
      if (!file || !url || !item) return

      item.type = file.type

      if (file.type === 'images') {
        item.img = url
      }

      if (file.type === 'videos') {
        item.video = url
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
    padding: 6px !important;
    margin-right: -8px;
    font-size: 14px !important;
  }
  &-change-img-btn {
    padding: 6px 12px !important;
    font-size: 14px !important;
  }
  &-remove-img-btn {
    padding: 6px !important;
    margin-left: 2px !important;
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

    .video-settings {
      margin-top: 15px;

      label {
        display: block;
        margin-left: 0px;
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

    &-cover {
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      position: absolute;
      top: 0;
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
