<template>
  <div class="media-type">
    <div v-if='isImage'>
      <div class="media-type-img">
        <img class="media-type-img-content" :src="mediaData">
        <div class="media-type-img-cover">
          <el-button class="media-type-img-cover-btn_change" size="mini" round @click="insertImg()">{{$t('common.change')}}</el-button>
        </div>
      </div>

      <el-input class="media-type-link" :placeholder="$t('editor.pleaseInput')" v-model="linkValue" @change="updateValue('link', linkValue)">
        <el-button v-if="linkValue" slot="prepend" icon="iconfont icon-link_"></el-button>
        <el-button v-if="!linkValue" slot="prepend">{{$t('common.link')}}</el-button>
        <el-select v-model="linkValue" @change="updateValue('link', linkValue)" slot="append" placeholder="Select" popper-class="media-type-popper">
          <el-option v-for="(path, pathIndex) in personalAllPagePathList" :key="pathIndex" :value="getLocationUrl(path)">
            {{path}}
          </el-option>
        </el-select>
      </el-input>

      <el-select class="media-type-target" v-model="targetValue" size='mini' :placeholder="$t('editor.newWindowOpen')" @change="updateValue('target', targetValue)">
        <el-option v-for="targetType in linkTargets" :key='targetType.value' :label='targetType.label' :value='targetType.value'>
        </el-option>
      </el-select>

    </div>

    <div v-else-if='isVideo'>

      <div class="media-type-img">
        <video :src="mediaData" muted></video>
        <div class="media-type-img-play" v-if='isPlayIconShow'>
          <el-button circle size="mini">
            <i class='media-type-img-play-icon el-icon-caret-right'></i>
          </el-button>
        </div>
        <div class="media-type-img-cover">
          <span>
            <el-button class="media-type-img-cover-btn_play media-type-img-cover-btn_play-icon el-icon-caret-right" size="mini" round @click="handlePlay()"></el-button>
            <el-button class="media-type-img-cover-btn_change" size="mini" round @click="insertVideo()">{{$t('common.change')}}</el-button>
          </span>
        </div>
      </div>

      <div class="video-cover">
        <el-button v-if="!posterValue" @click='changeCover()' plain>{{$t('editor.addVideoCover')}}</el-button>
        <div class="media-type-img" v-if="posterValue" :style="{backgroundImage: 'url(' + posterValue + ')'}">
          <div class="media-type-img-cover">
            <span>
              <el-button class="media-type-video-cover-btn_change" size="mini" round @click="changeCover()">{{$t('common.change')}}</el-button>
              <el-button class="media-type-video-cover-btn_remove iconfont icon-delete" size="mini" circle @click="removeCover()"></el-button>
            </span>
          </div>
        </div>
      </div>

      <div class="video-settings">
        <el-checkbox v-model="autoplayValue">{{$t('field.autoplay')}}</el-checkbox>
        <el-checkbox v-model="playloopValue">{{$t('field.playloop')}}</el-checkbox>
      </div>

    </div>

    <SkyDriveManagerDialog :mediaLibrary='true' :isVideoTabShow='isVideoTabShow' :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog' />
  </div>
</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import Media from '@/components/adi/common/media/media.types'
import { mapGetters } from 'vuex'

export default {
  name: 'MediaType',
  props: {
    originValue: String
  },
  mixins: [protypesBaseMixin],
  mounted() {
    this.targetValue = this.targetGetterValue
    this.linkValue = this.linkGetterValue
  },
  data() {
    let self = this
    return {
      targetValue: '',
      linkValue: '',
      openType: 'image',
      isSkyDriveManagerDialogShow: false,
      isPlayIconShow: true,
      isVideoTabShow: true,
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
  computed: {
    ...mapGetters({
      personalAllPagePathList: 'user/personalAllPagePathList'
    }),
    mediaData() {
      return this.originValue
        ? this.originValue
        : (this.optionsData && this.optionsData.emptyMedia) || ''
    },
    isImage() {
      return Media.isImage(this.mediaData)
    },
    isVideo() {
      return Media.isVideo(this.mediaData)
    },
    linkGetterValue() {
      return this.cardValue.link
    },
    targetGetterValue() {
      return this.cardValue.target
    },
    autoplayValue: {
      get() {
        if (typeof this.cardValue.autoplay === 'boolean') {
          return this.cardValue.autoplay
        } else {
          return this.optionsData.autoplay
        }
      },
      set(data) {
        this.updateValue('autoplay', data)
      }
    },
    playloopValue: {
      get() {
        if (typeof this.cardValue.playloop === 'boolean') {
          return this.cardValue.playloop
        } else {
          return this.optionsData.playloop
        }
      },
      set(data) {
        this.updateValue('playloop', data)
      }
    },
    posterValue: {
      get() {
        return this.cardValue.poster
      },
      set(data) {
        this.updateValue('poster', data)
      }
    }
  },
  methods: {
    updateValue(newKey, newVal) {
      let tempChangedDataObj = {}
      tempChangedDataObj[newKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    handlePlay() {
      let video = this.$el.querySelector('video')
      if (video) {
        video.play()
      }
      this.isPlayIconShow = false
    },
    async removeCover() {
      await this.$confirm(this.$t('editor.deleteVideoCoverConfirmMsg'), '', {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })
      this.posterValue = ''
      this.autoplayValue = true
    },
    insertImg() {
      if (
        typeof (this.optionsData && this.optionsData.isVideoTabShow) ===
        'boolean'
      ) {
        this.isVideoTabShow = this.optionsData.isVideoTabShow
      } else {
        this.isVideoTabShow = true
      }

      this.openType = 'image'
      this.openSkyDriveManagerDialog()
    },
    insertVideo() {
      this.isVideoTabShow = true
      this.openType = 'video'
      this.openSkyDriveManagerDialog()
    },
    changeCover() {
      this.isVideoTabShow = false
      this.openType = 'cover'
      this.openSkyDriveManagerDialog()
    },
    openSkyDriveManagerDialog() {
      this.isSkyDriveManagerDialogShow = true
    },
    closeSkyDriveManagerDialog(payload) {
      if (!payload) return
      let { file, url } = payload

      this.isSkyDriveManagerDialogShow = false

      if (!url) return

      switch (this.openType) {
        case 'image':
          this.posterValue = ''
          this.autoplayValue = true
          this.updateValue('src', url)
          break
        case 'video':
          this.autoplayValue = true
          this.updateValue('src', url)
          break
        case 'cover':
          this.autoplayValue = false
          this.updateValue('poster', url)
          break
      }
    },
    getLocationUrl(url) {
      return url ? location.origin + '/' + url : ''
    }
  },
  components: {
    SkyDriveManagerDialog
  },
  watch: {
    targetGetterValue(val) {
      this.targetValue = val
    },
    linkGetterValue(val) {
      this.linkValue = val
    }
  }
}
</script>

<style lang="scss">
.media-type {
  .el-button {
    border: none;
  }
  .el-input-group__prepend {
    padding: 0;
    .el-button--default {
      padding: 0;
      margin: 0;
    }
  }
  &-img {
    height: 150px;
    background-color: lightgray;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    position: relative;
    &:hover {
      .media-type-img-cover {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &:hover,
    &.selected {
      .media-type-img-play {
        display: none;
      }
    }
    &-content {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
      &-btn_play {
        padding: 2px !important;
        margin-right: -2px;
        &-icon {
          font-size: 22px;
          color: #747474;
        }
      }
      &-btn_change {
        padding: 6px 12px !important;
        font-size: 14px;
      }
    }
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
  }

  &-link {
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
  &-target {
    margin-top: 11px;
    width: auto;

    .el-input__inner {
      color: #909399;
    }
  }
  &-popper {
    max-width: 400px;
  }

  .video-cover {
    margin-top: 15px;
    > .el-button {
      padding: 0 !important;
    }
    .media-type-video-cover-btn_change {
      padding: 6px 12px !important;
      font-size: 14px !important;
    }
    .media-type-video-cover-btn_remove {
      font-size: 14px !important;
    }
  }

  .video-settings {
    margin-top: 15px;
    label {
      display: block;
      margin-left: 0px;
    }
  }
}
</style>
